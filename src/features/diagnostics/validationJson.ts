import * as vscode from 'vscode';
import { parseTree, ParseError, getNodePath, Node } from 'jsonc-parser';
import { getVersionedSchemaForFile } from '../../core/getVersionedSchemaForFile';
import { resolveSchemaAtPath } from '../../utils/json/resolveSchemaAtPath';
import { getErrorsForSchema } from '../../utils/json/resolveMatchingSubSchema';

export function registerValidationJson(context: vscode.ExtensionContext) {
    const diagnostics = vscode.languages.createDiagnosticCollection("jsonSchemaValidation");
    context.subscriptions.push(diagnostics);

    vscode.workspace.onDidOpenTextDocument(doc => validateDocument(doc, diagnostics));
    vscode.workspace.onDidChangeTextDocument(e => validateDocument(e.document, diagnostics));
    vscode.workspace.textDocuments.forEach(doc => validateDocument(doc, diagnostics));
}

function validateDocument(document: vscode.TextDocument, diagnostics: vscode.DiagnosticCollection) {
    // Si le document n'est pas un JSON, on ne fait rien
    if (document.languageId !== 'json') {
        diagnostics.delete(document.uri);
        return;
    }

    const schema = getVersionedSchemaForFile(document); // Récupère le schéma versionné pour le fichier
    // Si aucun schéma n'est trouvé, on supprime les diagnostics pour ce document
    if (!schema) {
        diagnostics.delete(document.uri);
        return;
    }

    const errors: vscode.Diagnostic[] = []; // Tableau pour stocker les erreurs de validation
    const parseErrors: ParseError[] = []; // Tableau pour stocker les erreurs de parsing
    const root = parseTree(document.getText(), parseErrors); // Parse le document JSON en arbre
    // Si on n'obtient pas de racine, on supprime les diagnostics pour ce document
    if (!root) {
        diagnostics.delete(document.uri);
        return;
    }

    // Explore le JSON en utilisant une fonction récursive pour valider chaque noeud
    walkJsonTree(root, (node, path) => {
        const value = nodeToValue(node); // Convertit le noeud en valeur JavaScript
        if (value === undefined) { // Si la valeur est indéfinie, on ignore ce noeud
            return;
        }

        const rawSchema = resolveSchemaAtPath(schema, path, nodeToValue(root)); // Récupère le schéma brut pour le chemin actuel
        const { schema: resolvedSchema, errors: validationErrors } = getErrorsForSchema(rawSchema, value); // Validation centralisée

        if (validationErrors.length > 0) {
            errors.push(new vscode.Diagnostic(
                toRange(document, node),
                validationErrors[0].error, // On affiche uniquement la première erreur
                vscode.DiagnosticSeverity.Warning
            ));
        }
    });

    diagnostics.set(document.uri, errors);
}

function walkJsonTree(node: Node, callback: (node: Node, path: string[]) => void, path: string[] = []) {
    if (node.type === 'property' && node.children?.length === 2) {
        const key = node.children[0].value;
        const valueNode = node.children[1];
        walkJsonTree(valueNode, callback, [...path, key]);
    } else if (node.type === 'array') {
        callback(node, path); // le tableau lui-même
        node.children?.forEach((child, index) => {
            // on donne un path avec l'index pour chaque élément
            walkJsonTree(child, callback, [...path, String(index)]);
        });
    } else if (node.type === 'object') {
        callback(node, path); // l'objet lui-même
        node.children?.forEach(child => {
            walkJsonTree(child, callback, path); // les "property" se chargeront d'ajouter la clé
        });
    } else {
        callback(node, path); // valeur simple
    }
}

/**
 * Convertit un nœud JSON en valeur JavaScript exploitable.
 * @param node Le nœud JSON à convertir.
 * @returns 
 */
export function nodeToValue(node: Node): any {
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