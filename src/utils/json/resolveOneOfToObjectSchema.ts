export function resolveOneOfToObjectSchema(schema: any): any | null {
    if (!schema || typeof schema !== 'object') {
        return null;
    }

    if (schema.type === 'object' && schema.properties) {
        return schema;
    }

    const candidates = schema.oneOf || schema.anyOf || [];

    for (const option of candidates) {
        if (option.type === 'object' && option.properties) {
            return option;
        }
    }

    return null;
}