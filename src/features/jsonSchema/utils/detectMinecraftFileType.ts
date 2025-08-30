import * as vscode from 'vscode';
import { schemaTypes } from "../minecraftSchemas/schemaTypes";
import { SchemaType } from "../../../types/schema";

/**
 * Renvoie le type de schéma minecraft correspondant au document.
 * @param document 
 * @returns 
 */
export function detectMinecraftFileType(document: vscode.TextDocument): SchemaType | null {
    for (const schemaType of schemaTypes) {
        const fileMatch = schemaType.fileMatch;
        const documentSelector: vscode.DocumentSelector = fileMatch.map(pattern => ({
            pattern: pattern,
            scheme: 'file'
        }));

        if (vscode.languages.match(documentSelector, document)) {
            return schemaType;
        }
    }
    return null;
}