import { getErrorsForSchema } from './getErrorsForSchema';

/**
 * Navigue dans un schéma JSON pour trouver le sous-schéma correspondant à un chemin donné.
 * @param schema Le schéma JSON complet.
 * @param path Le chemin à suivre dans le schéma, sous forme de tableau de segments.
 * @param rootValue La valeur racine pour laquelle on veut résoudre le schéma.
 * @returns Le sous-schéma résolu à la position indiquée par le chemin.
 */
export function resolveSchemaAtPath(schema: any, path: (string | number)[], rootValue?: any): any {
    let current = schema;
    let currentValue = rootValue;

    for (const segment of path) {
        current = resolveInlineRefs(current, schema);

        const isIndex = typeof segment === 'number' || (typeof segment === 'string' && /^\d+$/.test(segment));

        if (isIndex) {
            const index = typeof segment === 'number' ? segment : Number(segment);

            const match = getErrorsForSchema(current, currentValue);
            current = match.schema ?? current;

            let itemSchema;
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

        let nextSchema = getSubSchemaForObject(current, segment);
        nextSchema = resolveInlineRefs(nextSchema, schema);

        const subValue = currentValue?.[segment];
        const match = getErrorsForSchema(nextSchema, subValue ?? {});
        current = match.schema ?? nextSchema;

        if (typeof currentValue === 'object' && currentValue !== null) {
            currentValue = currentValue[segment];
        }
    }

    return resolveInlineRefs(current, schema);
}

/**
 * Version non résolue qui préserve les oneOf - navigue dans un schéma JSON sans résoudre les oneOf
 * @param schema Le schéma JSON complet.
 * @param path Le chemin à suivre dans le schéma, sous forme de tableau de segments.
 * @returns Le sous-schéma NON résolu à la position indiquée par le chemin (garde les oneOf).
 */
export function resolveSchemaAtPathUnresolved(schema: any, path: (string | number)[]): any {
    let current = schema;

    for (const segment of path) {
        current = resolveInlineRefs(current, schema);

        const isIndex = typeof segment === 'number' || (typeof segment === 'string' && /^\d+$/.test(segment));

        if (isIndex) {
            const index = typeof segment === 'number' ? segment : Number(segment);

            // Pas de résolution oneOf ici - juste la navigation
            let itemSchema;
            if (Array.isArray(current?.items)) {
                itemSchema = current.items[index] ?? {};
            } else if (current?.items) {
                itemSchema = current.items;
            } else {
                itemSchema = {};
            }

            current = itemSchema;
            continue;
        }

        let nextSchema = getSubSchemaForObject(current, segment);
        nextSchema = resolveInlineRefs(nextSchema, schema);

        // IMPORTANT: Pas de getErrorsForSchema ici pour préserver les oneOf
        current = nextSchema;
    }

    return resolveInlineRefs(current, schema);
}

function getSubSchemaForObject(current: any, segment: string | number): any {
    if (current?.properties?.[segment]) {
        return current.properties[segment];
    }

    // Si on a un oneOf, chercher dans toutes les branches qui ont des propriétés
    if (current?.oneOf) {
        const oneOfBranches = [];
        for (const branch of current.oneOf) {
            // Un objet JSON Schema est implicitement de type "object" s'il a des propriétés
            if (branch.properties?.[segment]) {
                oneOfBranches.push(branch.properties[segment]);
            }
        }
        
        // Si on a trouvé des branches, créer un nouveau oneOf avec ces branches
        if (oneOfBranches.length > 0) {
            return {
                oneOf: oneOfBranches
            };
        }
    }

    if (current?.patternProperties) {
        const matched = Object.entries(current.patternProperties)
            .find(([pattern]) => new RegExp(pattern).test(String(segment)));
        if (matched) {
            return matched[1];
        }
    }

    if (current?.additionalProperties) {
        return current.additionalProperties;
    }

    return undefined;
}

/**
 * Résout un $ref de type JSON Schema local (ex: "#/definitions/foo/properties/bar")
 * @param rootSchema Le schéma racine (non modifié, complet)
 * @param ref La valeur du $ref à résoudre
 * @returns Le schéma résolu ou null si non trouvé
 */
function resolveRefInSchema(rootSchema: any, ref: string): any {
    if (!ref.startsWith('#/')) {
        return null;
    }

    const path = ref.slice(2).split('/');
    let current: any = rootSchema;

    for (const segment of path) {
        const key = decodeURIComponent(segment);
        if (!(key in current)) {
            return null;
        }
        current = current[key];
    }

    if (current && typeof current === 'object' && '$ref' in current) {
        return resolveRefInSchema(rootSchema, current.$ref);
    }

    return current;
}

function resolveInlineRefs(current: any, rootSchema: any): any {
    while (current?.$ref) {
        const resolved = resolveRefInSchema(rootSchema, current.$ref);
        if (!resolved) {
            break;
        }
        current = { ...resolved, ...current };
        delete current.$ref;
    }
    return current;
}