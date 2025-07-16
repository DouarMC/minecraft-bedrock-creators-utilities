import * as vscode from 'vscode';
import { parseTree, ParseError, getNodePath, Node } from 'jsonc-parser';
import { getVersionedSchemaForFile } from '../../schemas/getVersionedSchemaForFile';
import { resolveSchemaAtPath } from '../../utils/resolveSchemaAtPath';
import { resolveMatchingSubSchema, isValueOfType } from '../../utils/resolveMatchingSubSchema';

export function registerValidationJson(context: vscode.ExtensionContext) {
    const diagnostics = vscode.languages.createDiagnosticCollection("jsonSchemaValidation");
    context.subscriptions.push(diagnostics);

    vscode.workspace.onDidOpenTextDocument(doc => validateDocument(doc, diagnostics));
    vscode.workspace.onDidChangeTextDocument(e => validateDocument(e.document, diagnostics));
    vscode.workspace.textDocuments.forEach(doc => validateDocument(doc, diagnostics));
}

function validateDocument(document: vscode.TextDocument, diagnostics: vscode.DiagnosticCollection) {
    if (document.languageId !== 'json') {
        diagnostics.delete(document.uri);
        return;
    }

    const schema = getVersionedSchemaForFile(document);
    if (!schema) {
        diagnostics.delete(document.uri);
        return;
    }

    const errors: vscode.Diagnostic[] = [];
    const parseErrors: ParseError[] = [];
    const root = parseTree(document.getText(), parseErrors);
    if (!root) {
        diagnostics.delete(document.uri);
        return;
    }

    walkJsonTree(root, (node, path) => {
        const value = nodeToValue(node);
        if (value === undefined) {
            return;
        }
        const rawSchema = resolveSchemaAtPath(schema, path);
        const { schema: resolvedSchema, error: typeError } = resolveMatchingSubSchema(rawSchema, value);
        if (!resolvedSchema) {
            return;
        }

        if (resolvedSchema.type && !isValueOfType(value, resolvedSchema.type)) {
            errors.push(new vscode.Diagnostic(
                toRange(document, node),
                `Type attendu : ${Array.isArray(resolvedSchema.type) ? resolvedSchema.type.join(' | ') : resolvedSchema.type}`,
                vscode.DiagnosticSeverity.Warning
            ));
        }

        if (typeError) {
            errors.push(new vscode.Diagnostic(
                toRange(document, node),
                typeError,
                vscode.DiagnosticSeverity.Warning
            ));
            return;
        }

        // 🔹 Vérification enum
        if (Array.isArray(resolvedSchema.enum) && !resolvedSchema.enum.includes(value)) {
            errors.push(new vscode.Diagnostic(
                toRange(document, node),
                `Valeur invalide. Attendu : ${resolvedSchema.enum.map((v: any) => JSON.stringify(v)).join(', ')}`,
                vscode.DiagnosticSeverity.Warning
            ));
        }

        // TODO: pattern, minLength, maxLength, required, etc.
    });

    diagnostics.set(document.uri, errors);
}

function walkJsonTree(node: Node, callback: (node: Node, path: string[]) => void, path: string[] = []) {
    if (node.type === 'property' && node.children?.length === 2) {
        const key = node.children[0].value;
        const valueNode = node.children[1];
        walkJsonTree(valueNode, callback, [...path, key]);
    } else if (node.type === 'object' || node.type === 'array') {
        callback(node, path); // 🔥 Appelle pour l’objet ou tableau lui-même
        if (node.children) {
            for (let i = 0; i < node.children.length; i++) {
                const child = node.children[i];
                const newPath = node.type === 'array' ? [...path, String(i)] : path;
                walkJsonTree(child, callback, newPath);
            }
        }
    } else {
        callback(node, path); // Valeur simple
    }
}

function nodeToValue(node: Node): any {
    switch (node.type) {
        case 'string':
        case 'number':
        case 'boolean':
            return node.value;
        case 'null':
            return null;
        case 'object': {
            const obj: Record<string, any> = {};
            if (node.children) {
                for (const prop of node.children) {
                    const key = prop.children?.[0]?.value;
                    const valNode = prop.children?.[1];
                    if (typeof key === 'string' && valNode) {
                        obj[key] = nodeToValue(valNode); // récursif
                    }
                }
            }
            return obj;
        }
        case 'array': {
            return (node.children ?? []).map(child => nodeToValue(child));
        }
        default:
            return undefined;
    }
}

function toRange(document: vscode.TextDocument, node: Node): vscode.Range {
    return new vscode.Range(
        document.positionAt(node.offset),
        document.positionAt(node.offset + node.length)
    );
}