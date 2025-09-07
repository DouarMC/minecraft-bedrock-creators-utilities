import * as vscode from 'vscode';
import { minecraftSchemaRegistry } from '../registries/minecraftSchemaRegistry';

/**
 * Renvoie le type de schéma minecraft correspondant au document.
 * @param document 
 * @returns 
 */
export function findMinecraftSchema(document: vscode.TextDocument) {
    for (const [key, schemaType] of Object.entries(minecraftSchemaRegistry)) {
        if (schemaType === undefined) continue;

        const fileMatch = schemaType.fileMatch;
        const documentSelector: vscode.DocumentSelector = fileMatch.map(pattern => ({
            pattern: pattern,
            scheme: 'file'
        }));

        if (vscode.languages.match(documentSelector, document)) {
            return schemaType;
        }
    }

    return undefined;
}