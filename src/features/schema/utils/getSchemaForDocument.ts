import * as vscode from 'vscode';
import { findMinecraftSchema } from './findMinecraftSchema';
import { extractFormatVersion } from './extractFormatVersion';
import { resolveSchema } from '../model/versioning/resolveSchema';

export function getSchemaForDocument(document: vscode.TextDocument) {
    const schemaType = findMinecraftSchema(document);
    if (!schemaType?.baseSchema) return undefined;

    const formatVersion = extractFormatVersion(document);
    return resolveSchema(schemaType, formatVersion);
}