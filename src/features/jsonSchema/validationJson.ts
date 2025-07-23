import * as vscode from 'vscode';
import { parseTree, ParseError, Node } from 'jsonc-parser';
import { getVersionedSchemaForFile } from './versioning/getVersionedSchemaForFile';
import { getErrorsForSchema } from '../../utils/json/getErrorsForSchema';
import { getSchemaAtNodePath } from './versioning/schemaContext';
import { walkJsonTree } from '../../utils/json/walkJsonTree';
import { nodeToValue } from '../../utils/json/nodeToValue';

export function registerValidationJson(context: vscode.ExtensionContext) {
    const diagnostics = vscode.languages.createDiagnosticCollection("minecraft-bedrock-creators-utilities.jsonValidation");
    context.subscriptions.push(diagnostics);

    vscode.workspace.onDidOpenTextDocument(doc => validateDocument(doc, diagnostics));
    vscode.workspace.onDidChangeTextDocument(e => validateDocument(e.document, diagnostics));
    vscode.workspace.textDocuments.forEach(doc => validateDocument(doc, diagnostics));
}

function validateDocument(document: vscode.TextDocument, diagnostics: vscode.DiagnosticCollection) {
    // Si le document n'est pas un JSON, on ne fait rien
    if (document.languageId !== 'json' && document.languageId !== 'jsonc') {
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

        const { schema: resolvedSchema, valueAtPath } = getSchemaAtNodePath(document, node, path);
        const { errors: validationErrors } = getErrorsForSchema(resolvedSchema, valueAtPath);

        for (const err of validationErrors) {
            errors.push(new vscode.Diagnostic(
                toRange(document, node),
                err.error,
                vscode.DiagnosticSeverity.Warning
            ));
        }
    });

    diagnostics.set(document.uri, errors);
}

function toRange(document: vscode.TextDocument, node: Node): vscode.Range {
    return new vscode.Range(
        document.positionAt(node.offset),
        document.positionAt(node.offset + node.length)
    );
}