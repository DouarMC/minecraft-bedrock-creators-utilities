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

/**
 * Récupère les métadonnées du projet de manière synchrone avec cache intelligent
 * @deprecated Préférez la version asynchrone quand possible
 */
export function getMinecraftProjectMetadataSync(folder: vscode.Uri): ProjectMetadata | undefined {
    try {
        return projectMetadataCache.getSync(folder);
    } catch (error) {
        // Gestion d'erreur silencieuse pour éviter les popups répétitifs
        return undefined;
    }
}

/**
 * Invalide le cache des métadonnées pour un projet spécifique
 */
export function invalidateProjectMetadata(folder: vscode.Uri): void {
    projectMetadataCache.invalidate(folder);
}

/**
 * Nettoie le cache des métadonnées de projet
 */
export function clearProjectMetadataCache(): void {
    projectMetadataCache.clear();
}