import { getErrorsForSchema } from './resolveMatchingSubSchema'; // adapte le chemin si besoin

/**
 * Navigue dans un schéma JSON pour trouver le sous-schéma correspondant à un chemin donné.
 * @param schema Le schéma JSON complet.
 * @param path Le chemin à suivre dans le schéma, sous forme de tableau de segments.
 * @param rootValue La valeur racine pour laquelle on veut résoudre le schéma.
 * @returns 
 */
export function resolveSchemaAtPath(schema: any, path: (string | number)[], rootValue?: any): any {
    let current = schema; // Commence avec le schéma racine
    let currentValue = rootValue; // La valeur 
    
    for (const segment of path) { // Parcourt chaque segment du chemin
        // Résout les $ref à chaque étape
        while (current?.$ref) {
            const resolved = resolveRefInSchema(schema, current.$ref);
            if (!resolved) {
                break;
            }
            current = { ...resolved, ...current };
            delete current.$ref;
        }

        // Si le segment est un index numérique (type number OU string avec chiffres)
        const isIndex = typeof segment === 'number' || (typeof segment === 'string' && /^\d+$/.test(segment));

        if (isIndex) {
            const index = typeof segment === 'number' ? segment : Number(segment);

            let itemSchema = undefined;

            // 🔥 Ajoute ça : résout d'abord le oneOf s'il y en a
            const match = getErrorsForSchema(current, currentValue);
            current = match.schema ?? current;

            // Maintenant que current est résolu, on peut aller dans items
            if (Array.isArray(current?.items)) {
                itemSchema = current.items[index] ?? {};
            } else if (current?.items) {
                itemSchema = current.items;
            } else {
                itemSchema = {};
            }

            const itemValue = Array.isArray(currentValue) ? currentValue[index] : undefined;
            const itemMatch = getErrorsForSchema(itemSchema, itemValue);
            current = itemMatch.schema ?? itemSchema;

            if (Array.isArray(currentValue)) {
                currentValue = currentValue[index];
            }

            continue;
        }


        // Descente normale dans les propriétés
        if (current?.properties?.[segment]) {
            current = current.properties[segment];
        } else if (current?.patternProperties) {
            const matched = Object.entries(current.patternProperties)
                .find(([pattern]) => new RegExp(pattern).test(segment));
            if (matched) {
                current = matched[1];
                while (current?.$ref) {
                    const resolved = resolveRefInSchema(schema, current.$ref);
                    if (!resolved) {break;}
                    current = { ...resolved, ...current };
                    delete current.$ref;
                }
            } else if (current.additionalProperties) {
                current = current.additionalProperties;
            } else {
                return undefined;
            }
        } else if (current.additionalProperties) {
            current = current.additionalProperties;
        } else {
            return undefined;
        }

        if (typeof currentValue === 'object' && currentValue !== null) {
            currentValue = currentValue[segment];
        }

        // Si on est dans un oneOf/anyOf → on doit choisir dynamiquement
        const match = getErrorsForSchema(current, currentValue ?? {});
        current = match.schema ?? current; // Récupère le schéma renvoyé par la validation ou garde le schéma actuel
    }

    // Résout un dernier $ref s’il traîne à la fin
    while (current?.$ref) {
        const resolved = resolveRefInSchema(schema, current.$ref);
        if (!resolved) {break;}
        current = { ...resolved, ...current };
        delete current.$ref;
    }

    return current;
}

/**
 * Résout un $ref de type JSON Schema local (ex: "#/definitions/foo/properties/bar")
 * @param rootSchema Le schéma racine (non modifié, complet)
 * @param ref La valeur du $ref à résoudre
 * @returns Le schéma résolu ou null si non trouvé
 */
function resolveRefInSchema(rootSchema: any, ref: string): any {
    // Si le $ref n'est pas un chemin local, on ne peut pas le résoudre ici
    if (!ref.startsWith('#/')) {
        return null;
    }

    const path = ref.slice(2).split('/'); // Enlève le préfixe "#/" et divise en segments
    let current: any = rootSchema; // Commence avec le schéma racine

    for (const segment of path) { // Parcourt chaque segment du chemin
        const key = decodeURIComponent(segment); // Au cas où il y a des caractères échappés
        if (!(key in current)) { // Si le segment n'existe pas dans les propriétés du schéma
            return null; // Retourne null si le chemin n'est pas valide
        }
        current = current[key]; // Descend dans le schéma
    }

    // Résolution récursive si le nœud résolu contient aussi un $ref
    if (current && typeof current === 'object' && '$ref' in current) {
        return resolveRefInSchema(rootSchema, current.$ref);
    }

    return current; // Retourne le schéma résolu
}
