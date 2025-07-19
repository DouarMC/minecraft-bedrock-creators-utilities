import * as vscode from 'vscode';
import { getJsonPathForHoverAt } from '../../utils/json/getJsonPathAt';
import { getVersionedSchemaForFile } from '../../core/getVersionedSchemaForFile';
import { resolveSchemaAtPath } from '../../utils/json/resolveSchemaAtPath';
import { findNodeAtLocation, parseTree } from 'jsonc-parser';
import { getErrorsForSchema } from '../../utils/json/resolveMatchingSubSchema';
import { normalizePath } from '../molang/molangEditor';

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
        const normalizedPath = normalizePath(path);
        console.log("AAAAAA");
        if (!normalizedPath) {
            return;
        }

        const schema = getVersionedSchemaForFile(document);
        console.log("BBBBB");
        if (!schema) {
            return;
        }

        const root = parseTree(document.getText());
        console.log("CCCCCC");
        if (!root) {
            return;
        }

        const node = findNodeAtLocation(root, normalizedPath);
        console.log("PATH: ", normalizedPath);
        if (!node) {
            console.log("Le noeud n'existe pas pour le chemin donné.");
            return;
        }

        const value = node.value;
        const rawSchema = resolveSchemaAtPath(schema, normalizedPath, node.value);
        const { schema: resolvedSchema, errors } = getErrorsForSchema(rawSchema, value);

        console.log("RAW SCHEMA : ", JSON.stringify(rawSchema, null, 2));
        console.log("RESOLVED SCHEMA : ", JSON.stringify(resolvedSchema, null, 2));
        console.log("CACA ?");
        if (!resolvedSchema || resolvedSchema.type !== "molang") {
            console.log("Le schéma n'est pas de type Molang ou n'existe pas.");
            return;
        }

        const action = new vscode.CodeAction(
            "Éditer l'expression Molang",
            vscode.CodeActionKind.QuickFix
        );

        action.command = {
            command: 'minecraft-bedrock-creators-utilities.openMolangEditor',
            title: "Ouvrir l'éditeur Molang",
            arguments: [document.uri, normalizePath]
        };

        return [action];
    }
}