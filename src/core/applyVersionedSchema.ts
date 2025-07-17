import { SchemaChange } from "./schemaTypes";
import { cloneDeep, set, unset } from "lodash";

/**
 * Applique des changements versionnés à un schéma de base en fonction de la version de format.
 * @param base Le schéma de base auquel les changements seront appliqués.
 * @param changes Les changements versionnés à appliquer au schéma de base.
 * @param formatVersion La version de format du document, utilisée pour déterminer quels changements appliquer.
 * @returns 
 */
export function applyVersionedSchema(base: any, changes: SchemaChange[], formatVersion: string | undefined): any {
    const result = cloneDeep(base); // Crée une copie profonde du schéma de base
    if (formatVersion) {
        for (const changeSet of changes) { // Parcourt chaque ensemble de changements versionnés
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