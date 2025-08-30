import * as vscode from 'vscode';
import { detectMinecraftFileType } from './detectMinecraftFileType';
import { cloneDeep, set, unset} from 'lodash';
import * as JsonParser from 'jsonc-parser';

export function getSchemaForDocument(document: vscode.TextDocument): any | null {
    const schemaType = detectMinecraftFileType(document);
    if (!schemaType?.baseSchema) {
        return null;
    }

    // 🆕 Extraire la format_version du document
    const formatVersion = extractFormatVersion(document);
    
    const versionedSchema = formatVersion && schemaType.versionedChanges?.length
        ? generateVersionedSchema(schemaType.baseSchema, schemaType.versionedChanges, formatVersion)
        : cloneDeep(schemaType.baseSchema);

    return versionedSchema;
}

/**
 * Extrait la format_version du document JSON de façon robuste
 */
function extractFormatVersion(document: vscode.TextDocument): string | number | null {
    const text = document.getText();
    
    // 🚀 Tentative 1: JSON.parse standard (le plus rapide si JSON valide)
    try {
        const json = JsonParser.parse(text);
        return json.format_version || null;
    } catch {
        // 🛡️ Fallback: Regex simple si JSON invalide
        const match = text.match(/"format_version"\s*:\s*"([^"]+)"/);
        return match ? match[1] : null;
    }
}

/**
 * Génère un schéma versionné en appliquant les changements
 */
function generateVersionedSchema(
    baseSchema: any,
    versionedChanges: any[],
    formatVersion: string | number
): any {
    // Cloner le schéma de base pour ne pas le modifier
    const versionedSchema = cloneDeep(baseSchema);
    
    // Application des changements de version
    for (const changeSet of versionedChanges) {
        if (compareVersions(formatVersion, changeSet.version) >= 0) {
            applyChanges(versionedSchema, changeSet.changes);
        } else {
            // Si la version du document est inférieure à la version du changement, on ignore
        }
    }
    
    return versionedSchema;
}

/**
 * Compare deux versions de format en string.
 * @param a La première version à comparer.
 * @param b La deuxième version à comparer.
 * @returns Résultat de la comparaison (-1, 0, 1)
 */
export function compareVersions(a: string | number, b: string | number): number {
    if (typeof a === "string" && typeof b === "string") {
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
    } else if (typeof a === "number" && typeof b === "number") {
        if (a > b) {
            return 1;
        }
        if (a < b) {
            return -1;
        }
        return 0;
    }

    return 0; // Si les types ne correspondent pas, on considère qu'ils sont égaux
}

/**
 * Applique une liste de changements au schéma
 */
function applyChanges(schema: any, changes: any[]): void {
    for (const change of changes) {
        switch (change.action) {
            case "add":
            case "modify":
                const value = cloneDeep(change.value); // ⬅️ éviter toute fuite de référence
                set(schema, change.target, value);
                break;
            case "remove":
                unset(schema, change.target);
                break;
            default:
                console.warn(`Unknown change action: ${change.action}`);
        }
    }
}