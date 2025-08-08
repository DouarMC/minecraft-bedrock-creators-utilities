import * as vscode from "vscode";
import { ProjectMetadata } from "../../types/projectMetadata";
import { projectMetadataCache } from "../cache/projectMetadataCache";

/**
 * Récupère les métadonnées du projet de manière asynchrone avec cache intelligent
 */
export async function getMinecraftProjectMetadata(folder: vscode.Uri): Promise<ProjectMetadata | undefined> {
    try {
        return await projectMetadataCache.get(folder);
    } catch (error) {
        // Gestion d'erreur silencieuse pour éviter les popups répétitifs
        return undefined;
    }
}