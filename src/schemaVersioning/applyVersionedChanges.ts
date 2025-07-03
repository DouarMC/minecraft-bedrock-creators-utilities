import { SchemaChange } from "./registry";
import { compareVersions } from "../utils/compareVersions";

/**
 * Accède à une propriété profondément imbriquée dans un objet.
 * Ex. path = ['a','b','c'] → retourne schema.a.b.c ou undefined si introuvable.
 */
function getNested(schema: any, path: string[]): any {
    let current = schema;
    for (const segment of path) {
        if (!current[segment]) {
            return undefined; // Chemin invalide → on renvoie undefined
        }
        current = current[segment];
    }
    return current;
}

/**
 * Définit (ou remplace) une propriété profondément imbriquée.
 * Crée les objets intermédiaires si nécessaire.
 */
function setNested(schema: any, path: string[], value: any): void {
    let current = schema;
    // Parcours jusqu’à l’avant-dernier segment
    for (let i = 0; i < path.length - 1; i++) {
        current[path[i]] = current[path[i]] || {};
        current = current[path[i]];
    }
    // Affecte la valeur au dernier segment
    current[path[path.length - 1]] = value;
}

/**
 * Supprime une propriété profondément imbriquée dans un objet.
 * Si une partie du chemin n’existe pas, on abandonne silencieusement.
 */
function deleteNested(schema: any, path: string[]): void {
    let current = schema;
    // Parcours jusqu’à l’avant-dernier segment
    for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) {
            return; // Chemin invalide → rien à supprimer
        }
        current = current[path[i]];
    }
    // Suppression de la clé cible
    delete current[path[path.length - 1]];
}

/**
 * Parcourt et applique toutes les modifications de schéma dont la version
 * est ≤ formatVersion, dans l’ordre croissant des versions.
 *
 * @param schema          Schéma de base (sera modifié in-place)
 * @param formatVersion   Version cible, ex "1.21.60"
 * @param versionedChanges  Liste de { version, changes[] }
 * @returns Le schéma mis à jour
 */
export function applyVersionedChanges(
    schema: any,
    formatVersion: string,
    versionedChanges: SchemaChange[]
): any {
    // Sélectionne les jeux de modifications applicables (version ≤ formatVersion),
    // puis trie par version croissante pour appliquer dans l’ordre.
    const changesToApply = versionedChanges
        .filter(change => compareVersions(formatVersion, change.version) >= 0)
        .sort((a, b) => compareVersions(a.version, b.version));

    // Pour chaque jeu de modifications…
    for (const changeSet of changesToApply) {
        // …pour chaque changement dans ce jeu…
        for (const change of changeSet.changes) {
            // On découpe la cible en segments de chemin
            const path = change.target.split("."); 
            if (change.action === "add" || change.action === "modify") {
                // Ajout ou remplacement
                setNested(schema, path, change.value);
            } else if (change.action === "remove") {
                // Suppression de la propriété
                deleteNested(schema, path);
            }
        }
    }

    return schema;  // Schéma muté et renvoyé
}