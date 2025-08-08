import * as vscode from "vscode";
import { updateDiagnostics } from "./diagnostics/collection";

export function registerDiagnosticCollection(context: vscode.ExtensionContext, documentSelector: vscode.DocumentSelector) {
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
}