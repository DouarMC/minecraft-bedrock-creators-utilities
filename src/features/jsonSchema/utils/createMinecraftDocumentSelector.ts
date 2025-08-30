import * as vscode from 'vscode';
import { schemaTypes } from '../minecraftSchemas/schemaTypes';

/**
 * Permet de renvoyer un sélecteur de documents pour les fichiers Minecraft en JSON/JSONC.
 * @returns 
 */
export function createMinecraftDocumentSelector(): vscode.DocumentSelector {
    return schemaTypes.flatMap(schemaType =>
        schemaType.fileMatch.flatMap(pattern => [
            { scheme: 'file', language: 'json', pattern },
            { scheme: 'file', language: 'jsonc', pattern }
        ])
    );
}