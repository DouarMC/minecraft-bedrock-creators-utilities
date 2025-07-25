import { SchemaType } from "../../../types/schema";
import { cloneDeep, set, unset } from "lodash";
import { getMinecraftProjectMetadataSync } from "../../../utils/workspace/getMinecraftProjectMetadata";
import * as vscode from "vscode";

/**
 * Applique les modifications de schéma versionnées à un schéma de base.
 * @param schemaType Le type de schéma contenant le schéma de base et les modifications versionnées.
 * @param formatVersion La version de format du document à modifier, sous forme de chaîne de caractères.
 * @returns 
 */
export function applyVersionedSchema(schemaType: SchemaType, formatVersion: string | undefined): any {
    const result = cloneDeep(schemaType.baseSchema); // Crée une copie profonde du schéma de base

    // Si la version de format est définie, on applique les modifications versionnées
    if (formatVersion) {
        for (const changeSet of schemaType.versionedChanges) { // Parcourt chaque ensemble de changements versionnés
            if (compareVersions(formatVersion, changeSet.version) >= 0) { // Si la format version du document est supérieure ou égale à la version de l'ensemble de changements
                for (const change of changeSet.changes) { // Pour chaque changement dans l'ensemble
                    switch (change.action) {
                        // Si l'action est "add" ou "modify", on ajoute ou modifie la valeur à l'emplacement spécifié par change.target
                        case "add":
                        case "modify":
                            set(result, change.target, change.value);
                            break;
                        // Si l'action est "remove", on supprime la valeur à l'emplacement spécifié par change.target
                        case "remove":
                            unset(result, change.target);
                            break;
                    }
                }
            }
        }

        const projectMetadata = getMinecraftProjectMetadataSync(vscode.workspace.workspaceFolders?.[0].uri as vscode.Uri);
        if (projectMetadata?.minecraftProduct === "preview" && schemaType.previewVersionedChanges) {
            for (const changeSet of schemaType.previewVersionedChanges) {
                if (compareVersions(formatVersion, changeSet.version) >= 0) {
                    for (const change of changeSet.changes) {
                        switch (change.action) {
                            case "add":
                            case "modify":
                                set(result, change.target, change.value);
                                break;
                            case "remove":
                                unset(result, change.target);
                                break;
                        }
                    }
                }
            }
        }
    }

    // Retourne le schéma modifié
    return result;
}

/**
 * Compare deux versions de format en string.
 * @param a La première version à comparer.
 * @param b La deuxième version à comparer.
 * @returns 
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