import * as vscode from 'vscode';
import { findNodeAtLocation, parseTree } from 'jsonc-parser';
import { getSchemaAtPosition } from '../jsonSchema/versioning/schemaContext';

export function registerCodeActionProvider(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider(
            {language: "json", scheme: "file"},
            new MolangCodeActionProvider(),
            {
                providedCodeActionKinds: [vscode.CodeActionKind.QuickFix]
            }
        )
    );
}

class MolangCodeActionProvider implements vscode.CodeActionProvider {
    provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.CodeAction[]> {
        const { schema, path } = getSchemaAtPosition(document, range.start);
        if (!schema || schema.type !== "molang" || !path.length) {
            return;
        }

        // 🧠 Optionnel mais sûr : vérifier que la valeur existe à ce chemin
        const root = parseTree(document.getText());
        const node = root ? findNodeAtLocation(root, path) : undefined;
        if (!node) {
            return;
        }

        // Crée l'action d'ouverture de l'éditeur Molang
        const action = new vscode.CodeAction(
            "Éditer l'expression Molang",
            vscode.CodeActionKind.QuickFix
        );

        action.command = {
            command: 'minecraft-bedrock-creators-utilities.openMolangEditor',
            title: "Ouvrir l'éditeur Molang",
            arguments: [document.uri, path]
        };
        return [action];
    }
}