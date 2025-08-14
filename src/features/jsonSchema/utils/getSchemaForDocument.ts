import * as vscode from 'vscode';
import { detectMinecraftFileType } from './detectMinecraftFileType';
import { cloneDeep, set, unset, get} from 'lodash';

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
    
    // 🆕 2. Résoudre toutes les références $ref
    const resolvedSchema = resolveAllReferences(versionedSchema);

    return resolvedSchema;
}

/**
 * Extrait la format_version du document JSON de façon robuste
 */
function extractFormatVersion(document: vscode.TextDocument): string | null {
    const text = document.getText();
    
    // 🚀 Tentative 1: JSON.parse standard (le plus rapide si JSON valide)
    try {
        const json = JSON.parse(text);
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
    formatVersion: string
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
export function compareVersions(a: string, b: string): number {
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

/**
 * Résout toutes les références $ref dans un schéma
 */
function resolveAllReferences(schema: any): any {
    const rootSchema = schema;
    
    function resolveRecursive(obj: any, visited = new Set()): any {
        if (!obj || typeof obj !== 'object') {
            return obj;
        }
        
        // Éviter les références circulaires
        if (visited.has(obj)) {
            return obj;
        }
        visited.add(obj);
        
        // 🎯 Si c'est une référence, la résoudre avec merge
        if (obj.$ref && typeof obj.$ref === 'string') {
            const resolved = resolveReference(obj, rootSchema);
            return resolveRecursive(resolved, visited); // Résoudre récursivement le résultat
        }
        
        // Traitement récursif pour arrays
        if (Array.isArray(obj)) {
            return obj.map(item => resolveRecursive(item, visited));
        }
        
        // Traitement récursif pour objets
        const resolved: any = {};
        for (const [key, value] of Object.entries(obj)) {
            resolved[key] = resolveRecursive(value, visited);
        }
        
        return resolved;
    }
    
    return resolveRecursive(schema);
}

/**
 * Résout une référence $ref et merge avec les propriétés locales
 */
function resolveReference(refObj: any, rootSchema: any): any {
    const { $ref, ...localProperties } = refObj;
    
    if (!$ref.startsWith('#/')) {
        console.warn(`Unsupported $ref format: ${$ref}`);
        return refObj;
    }
    
    const path = $ref.substring(2).split('/');
    let referencedSchema = rootSchema;
    
    // Naviguer vers la référence
    for (const segment of path) {
        const decodedSegment = segment.replace(/~1/g, '/').replace(/~0/g, '~');
        if (referencedSchema && typeof referencedSchema === 'object' && decodedSegment in referencedSchema) {
            referencedSchema = referencedSchema[decodedSegment];
        } else {
            console.warn(`$ref not found: ${$ref} at segment: ${decodedSegment}`);
            return refObj;
        }
    }
    
    // Si la référence pointe vers une autre référence, la résoudre récursivement
    if (referencedSchema?.$ref) {
        referencedSchema = resolveReference(referencedSchema, rootSchema);
    }
    
    // 🎯 MERGE avec priorité aux propriétés locales
    return {
        ...referencedSchema,      // Propriétés de la référence en base
        ...localProperties        // Propriétés locales en priorité
    };
}