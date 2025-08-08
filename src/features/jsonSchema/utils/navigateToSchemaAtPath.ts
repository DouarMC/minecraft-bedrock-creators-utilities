import { JSONPath } from "jsonc-parser";

export function navigateToSchemaAtPath(baseSchema: any, path: JSONPath): any {
    let currentSchema = baseSchema;
    
    for (const segment of path) {
        // Navigation dans un objet
        if (currentSchema?.type === "object") {
            // Géré le cas si on a des propriétés définies mais aussi des propriétés additionnelles
            if (currentSchema?.properties !== undefined && currentSchema?.additionalProperties !== undefined) {
                const propertyName = typeof segment === 'string' ? segment : segment.toString();
                if (currentSchema.properties[propertyName]) {
                    currentSchema = currentSchema.properties[propertyName];
                } else if (typeof currentSchema.additionalProperties === "object") {
                    // Si la propriété n'existe pas dans properties, on utilise additionalProperties
                    currentSchema = currentSchema.additionalProperties;
                } else {
                    return null; // Si aucune propriété correspondante, on arrête la navigation
                }
            } else if (currentSchema?.properties !== undefined) { // Juste des propriétés
                currentSchema = currentSchema.properties[segment];
            } else if (currentSchema?.additionalProperties !== undefined) { // Juste des propriétés additionnelles
                if (typeof currentSchema.additionalProperties === "object") {
                    currentSchema = currentSchema.additionalProperties;
                }
            }
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