import * as vscode from "vscode";
import { getSchemaForDocument } from "../utils/getSchemaForDocument";
import { doValidation } from "./doValidation";

export function registerDiagnosticsProvider(context: vscode.ExtensionContext, documentSelector: vscode.DocumentSelector): vscode.DiagnosticCollection {
    const diagnostics = vscode.languages.createDiagnosticCollection("minecraft-bedrock-creators-utilities.jsonSchema");

    // Exemple de listener sur changement de document
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(event => {
            if (vscode.languages.match(documentSelector, event.document)) {
                updateDiagnostics(event.document, diagnostics);
            }
        })
    );

    // Listener à l'ouverture d'un document
    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(document => {
            if (vscode.languages.match(documentSelector, document)) {
                updateDiagnostics(document, diagnostics);
            }
        })
    );

    // Nettoyer les diagnostics à la fermeture d'un document
    context.subscriptions.push(
        vscode.workspace.onDidCloseTextDocument(document => {
            diagnostics.delete(document.uri);
        })
    );

    return diagnostics;
}

function updateDiagnostics(document: vscode.TextDocument, diagnostics: vscode.DiagnosticCollection) {
    const schema = getSchemaForDocument(document);
    if (schema === undefined) {
        diagnostics.set(document.uri, []);
        return;
    }

    const diags = doValidation(document, schema);
    diagnostics.set(document.uri, diags ?? []);
}