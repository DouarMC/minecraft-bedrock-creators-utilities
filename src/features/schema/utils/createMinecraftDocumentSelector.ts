import * as vscode from "vscode";
import { minecraftSchemaRegistry } from "../registries/minecraftSchemaRegistry";

/**
 * Construit un sélecteur de documents VS Code
 * pour tous les fichiers Minecraft connus (JSON / JSONC).
 */
export function createMinecraftDocumentSelector(): vscode.DocumentSelector {
    return Object.values(minecraftSchemaRegistry)
        .filter((schemaType): schemaType is NonNullable<typeof schemaType> => !!schemaType)
        .flatMap(schemaType =>
            schemaType.fileMatch.flatMap(pattern => [
                { scheme: "file", language: "json", pattern },
                { scheme: "file", language: "jsonc", pattern },
            ])
        );
}