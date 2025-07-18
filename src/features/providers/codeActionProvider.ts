import * as vscode from 'vscode';
import { getJsonPathForHoverAt } from '../../utils/json/getJsonPathAt';
import { getVersionedSchemaForFile } from '../../core/getVersionedSchemaForFile';
import { resolveSchemaAtPath } from '../../utils/json/resolveSchemaAtPath';

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
        const path = getJsonPathForHoverAt(document, range.start);
        if (!path) {
            return;
        }

        const schema = getVersionedSchemaForFile(document);
        if (!schema) {
            return;
        }

        const resolved = resolveSchemaAtPath(schema, path);
        if (!resolved || resolved.type !== "molang") {
            return;
        }

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