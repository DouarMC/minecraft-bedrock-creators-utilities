export interface ResolvedSchemaResult {
    schema: any;
    error: string | null;
}

export function resolveMatchingSubSchema(schema: any, value: any): ResolvedSchemaResult {
    if (!schema || typeof schema !== 'object') {
        return { schema: null, error: null };
    }

    const variants = schema.oneOf || schema.anyOf;
    if (Array.isArray(variants)) {
        for (const variant of variants) {
            if (isValueValidForSchema(value, variant)) {
                return { schema: variant, error: null };
            }
        }

        // ❌ Aucun sous-schéma ne matche → on retourne une erreur
        return {
            schema: schema,
            error: `Aucune des variantes (${variants.length}) ne correspond à la valeur de type "${typeof value}"`
        };
    }

    // Pas de oneOf → normal
    return { schema, error: null };
}

function isValueValidForSchema(value: any, schema: any): boolean {
    if (schema.type && !isValueOfType(value, schema.type)) {return false;}
    if (schema.enum && !schema.enum.includes(value)) {return false;}
    return true;
}

export function isValueOfType(value: any, type: string | string[]): boolean {
    const types = Array.isArray(type) ? type : [type];
    return types.some(t => {
        if (t === 'string') {return typeof value === 'string';}
        if (t === 'number') {return typeof value === 'number';}
        if (t === 'boolean') {return typeof value === 'boolean';}
        if (t === 'null') {return value === null;}
        if (t === 'object') {return typeof value === 'object' && value !== null && !Array.isArray(value);}
        if (t === 'array') {return Array.isArray(value);}
        return false;
    });
}
