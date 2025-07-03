import * as vscode from 'vscode';
import { minimatch } from 'minimatch';
import { schemaTypes, SchemaType } from '../../schemaVersioning/registry';
import { applyDynamicSchema } from '../../schemaVersioning/applyDynamicSchema';

/**
 * Enregistre les événements de versionnement de schéma pour les fichiers JSON
 */
export function registerSchemaVersioning(context: vscode.ExtensionContext) {
    for (const schemaType of schemaTypes) {
        const handler = async (document: vscode.TextDocument) => {
            if (!matchesSchemaType(document, schemaType)) {
                return; // Ne traite que les documents qui correspondent au type de schéma
            }

            const formatVersion = extractFormatVersion(document.getText());
            await applyDynamicSchema(formatVersion, context.extensionPath, schemaType);
        };

        context.subscriptions.push(
            vscode.workspace.onDidOpenTextDocument(handler),
            vscode.workspace.onDidSaveTextDocument(handler)
        );
    }
}

/**
 * Vérifie si un document JSON correspond à un des `fileMatch` d’un `SchemaType`
 */
function matchesSchemaType(document: vscode.TextDocument, schemaType: SchemaType): boolean {
    if (document.languageId !== 'json' && document.languageId !== 'jsonc') {
        return false; // Ne traite que les documents JSON ou JSONC
    }
    const fsPath = document.uri.fsPath.replace(/\\/g, '/');
    return schemaType.fileMatch.some(pattern => minimatch(fsPath, pattern));
}

/**
 * Extrait proprement la version à partir d'un texte JSON
 */
function extractFormatVersion(text: string): string | null {
    const match = text.match(/"format_version"\s*:\s*"([^"]+)"/);
    return match?.[1] ?? null;
}