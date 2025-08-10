import {Node as JsonNode} from 'jsonc-parser';
import { validateOneOf, validateArrayConstraints, validateNumberConstraints, validateObjectConstraints, validateStringConstraints, validateType } from './constraints';

export interface NodeValidationError {
    node: JsonNode;
    message: string;
    code?: string; // optionnel (ex: 'type', 'required', 'enum', 'pattern'…)
    priority?: number; // optionnel, pour ordonner les erreurs
}

export const ERROR_WEIGHTS: Record<string, number> = {
    type: 1000,            // le plus bloquant
    integer: 900,         // très important pour les nombres
    required: 120,
    enum: 80,
    pattern: 60,
    minLength: 40,
    maxLength: 40,
    minimum: 60,
    maximum: 60,
    exclusiveMinimum: 60,
    exclusiveMaximum: 60,
    multipleOf: 60,
    // fallback par défaut si pas de code connu
    default: 50,
};


export function validateNode(node: JsonNode, schema: any): NodeValidationError[] {
    const errors: NodeValidationError[] = [];

    // OneOf
    if (schema.oneOf && Array.isArray(schema.oneOf)) {
        const error = validateOneOf(node, schema.oneOf);
        if (error) {
            errors.push(...error);
        }
    }

    // Type
    if (schema.type) {
        errors.push(...validateType(node, schema));
    }

    // Enum
    if (schema.enum) {
        if (!Array.isArray(schema.enum) || !schema.enum.includes(node.value)) {
            errors.push({
                node: node,
                message: `Valeur non autorisée. Possibles: ${schema.enum.join(", ")}`,
                code: "enum",
                priority: ERROR_WEIGHTS.enum
            });
        }
    }

    if (schema.type) {
        switch (schema.type) {
            case "object":
                errors.push(...validateObjectConstraints(node, schema));
                break;
            case "array":
                errors.push(...validateArrayConstraints(node, schema));
                break;
            case "string":
                errors.push(...validateStringConstraints(node, schema));
                break;
            case "number":
            case "integer":
                errors.push(...validateNumberConstraints(node, schema));
                break;
        }
    }

    return errors;
}