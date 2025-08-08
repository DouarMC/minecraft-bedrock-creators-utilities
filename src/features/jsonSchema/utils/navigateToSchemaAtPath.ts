import { JSONPath } from "jsonc-parser";

export function navigateToSchemaAtPath(baseSchema: any, path: JSONPath): any {
    let currentSchema = baseSchema;
    
    for (const segment of path) {
        if (currentSchema?.type === "object" && currentSchema?.properties) {
            // Navigation dans un objet
            currentSchema = currentSchema.properties[segment];
        } else if (currentSchema?.type === "array" && currentSchema?.items) {
            // Support arrays positionnels
            const index = typeof segment === 'number' ? segment : parseInt(segment.toString());
            if (Array.isArray(currentSchema.items)) {
                // items: [schema0, schema1, ...]
                if (!isNaN(index) && currentSchema.items[index]) {
                    currentSchema = currentSchema.items[index];
                } else {
                    // Par défaut, rien
                    return null;
                }
            } else {
                // items: { ... }
                currentSchema = currentSchema.items;
            }
        } else {
            return null;
        }
        
        if (!currentSchema) {
            return null;
        }
    }
    
    return currentSchema;
}