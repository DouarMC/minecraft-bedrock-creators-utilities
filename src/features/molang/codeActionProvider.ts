import * as vscode from 'vscode';
import { findNodeAtLocation, parseTree } from 'jsonc-parser';
import { SchemaResolver } from '../jsonSchema/core/schemaResolver';
import { JsonContextAnalyzer } from '../jsonSchema/core/jsonContextAnalyzer';

export function registerCodeActionProvider(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider(
            [{language: "json", scheme: "file"}, {language: "jsonc", scheme: "file"}],
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
        
        // Utiliser le nouveau système
        const schemaResolver = new SchemaResolver();
        const contextAnalyzer = new JsonContextAnalyzer();

        const schema = schemaResolver.resolveSchemaForFile(document.uri.fsPath, document.getText());
        if (!schema) {
            return;
        }

        const offset = document.offsetAt(range.start);
        const jsonContext = contextAnalyzer.analyzePosition(document.getText(), offset);

        // Naviguer vers le schema à la position
        let schemaAtPath = schema;
        for (const segment of jsonContext.path) {
            if (schemaAtPath.properties && schemaAtPath.properties[segment]) {
                schemaAtPath = schemaAtPath.properties[segment];
            } else if (schemaAtPath.items) {
                schemaAtPath = schemaAtPath.items;
            } else {
                return;
            }
        }

        if (!schemaAtPath || schemaAtPath.format !== "molang" || !jsonContext.path.length) {
            return;
        }

        // 🧠 Optionnel mais sûr : vérifier que la valeur existe à ce chemin
        const root = parseTree(document.getText());
        const node = root ? findNodeAtLocation(root, jsonContext.path) : undefined;
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
            arguments: [document.uri, jsonContext.path]
        };
        return [action];
    }
}