import { getErrorsForSchema } from './resolveMatchingSubSchema'; // adapte le chemin si besoin

export function resolveSchemaAtPath(schema: any, path: string[], rootValue?: any): any {
    let current = schema;
    let currentValue = rootValue;

    for (const segment of path) {
        // 🔁 Résout les $ref à chaque étape
        while (current?.$ref) {
            const resolved = resolveRefInSchema(schema, current.$ref);
            if (!resolved) {break;}
            current = { ...resolved, ...current };
            delete current.$ref;
        }

        // 🔁 Si on est dans un tableau et que le segment est un index
        if (/^\d+$/.test(segment)) {
            const index = Number(segment);
            if (Array.isArray(current?.items)) {
                current = current.items[index] ?? (current.additionalItems ?? {});
            } else {
                current = current?.items ?? {};
            }

            if (Array.isArray(currentValue)) {
                currentValue = currentValue[index];
            }

            continue;
        }

        // 🔄 Si on est dans un oneOf/anyOf → on doit choisir dynamiquement
        const match = getErrorsForSchema(current, currentValue ?? {});
        current = match.schema ?? current;

        // Re-résout un éventuel $ref issu de la variante sélectionnée
        while (current?.$ref) {
            const resolved = resolveRefInSchema(schema, current.$ref);
            if (!resolved) {break;}
            current = { ...resolved, ...current };
            delete current.$ref;
        }

        // Descente normale dans les propriétés
        if (current?.properties?.[segment]) {
            current = current.properties[segment];
        } else if (current?.patternProperties) {
            const matched = Object.entries(current.patternProperties)
                .find(([pattern]) => new RegExp(pattern).test(segment));
            if (matched) {
                current = matched[1];
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }

        if (typeof currentValue === 'object' && currentValue !== null) {
            currentValue = currentValue[segment];
        }
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
    if (!ref.startsWith('#/')) {return null;}

    const path = ref.slice(2).split('/');
    let current: any = rootSchema;

    for (const segment of path) {
        const key = decodeURIComponent(segment); // Au cas où il y a des caractères échappés
        if (!(key in current)) {return null;}
        current = current[key];
    }

    // Résolution récursive si le nœud résolu contient aussi un $ref
    if (current && typeof current === 'object' && '$ref' in current) {
        return resolveRefInSchema(rootSchema, current.$ref);
    }

    return current;
}
