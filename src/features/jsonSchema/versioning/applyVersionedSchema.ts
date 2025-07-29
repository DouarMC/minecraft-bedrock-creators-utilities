import { SchemaType } from "../../../types/schema";
import { cloneDeep, set, unset } from "lodash";
import { getMinecraftProjectMetadataSync } from "../../../utils/workspace/getMinecraftProjectMetadata";
import * as vscode from "vscode";

/**
 * Applique les modifications de schéma versionnées à un schéma de base avec optimisations.
 * @param schemaType Le type de schéma contenant le schéma de base et les modifications versionnées.
 * @param formatVersion La version de format du document à modifier, sous forme de chaîne de caractères.
 * @param documentUri URI du document pour déterminer le contexte projet
 * @returns Le schéma modifié et optimisé
 */
export function applyVersionedSchema(schemaType: SchemaType, formatVersion: string | undefined, documentUri?: vscode.Uri): any {
    const result = cloneDeep(schemaType.baseSchema); // Crée une copie profonde du schéma de base

    // Si la version de format est définie, on applique les modifications versionnées
    if (formatVersion) {
        // Application des changements de version standard
        for (const changeSet of schemaType.versionedChanges) {
            if (compareVersions(formatVersion, changeSet.version) >= 0) {
                applyChanges(result, changeSet.changes);
            }
        }

        // Détermination des métadonnées projet de manière optimisée
        const projectMetadata = documentUri ? getProjectMetadataOptimized(documentUri) : undefined;
            
        // Application des changements preview si nécessaire
        if (projectMetadata?.minecraftProduct === "preview" && schemaType.previewVersionedChanges) {
            for (const changeSet of schemaType.previewVersionedChanges) {
                if (compareVersions(formatVersion, changeSet.version) >= 0) {
                    applyChanges(result, changeSet.changes);
                }
            }
        }
    }

    return result;
}

/**
 * Applique un ensemble de changements à un schéma de manière optimisée
 */
function applyChanges(schema: any, changes: any[]): void {
    for (const change of changes) {
        switch (change.action) {
            case "add":
            case "modify":
                set(schema, change.target, change.value);
                break;
            case "remove":
                unset(schema, change.target);
                break;
        }
    }
}

/**
 * Récupère les métadonnées projet de manière optimisée
 */
function getProjectMetadataOptimized(documentUri: vscode.Uri): any {
    try {
        const folderUri = vscode.workspace.getWorkspaceFolder(documentUri)?.uri 
            || vscode.workspace.workspaceFolders?.[0].uri;
        
        return folderUri ? getMinecraftProjectMetadataSync(folderUri) : undefined;
    } catch {
        return undefined;
    }
}

/**
 * Compare deux versions de format en string (fonction inchangée car déjà optimisée).
 * @param a La première version à comparer.
 * @param b La deuxième version à comparer.
 * @returns Résultat de la comparaison (-1, 0, 1)
 */
function compareVersions(a: string, b: string): number {
    const aParts = a.split('.').map(Number);
    const bParts = b.split('.').map(Number);
    const maxLength = Math.max(aParts.length, bParts.length);

    for (let i = 0; i < maxLength; i++) {
        const aNum = aParts[i] ?? 0;
        const bNum = bParts[i] ?? 0;

        if (aNum > bNum) {
            return 1;
        }
        if (aNum < bNum) {
            return -1;
        }
    }

    return 0;
}