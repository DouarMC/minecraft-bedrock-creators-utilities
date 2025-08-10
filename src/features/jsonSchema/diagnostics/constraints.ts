import {Node as JsonNode} from 'jsonc-parser';
import { resolveOneOfBranch } from '../utils/resolveOneOfBranch';
import { validateNode, NodeValidationError } from './validateNode';
import { isTypeValid } from './helpers';
import { ERROR_WEIGHTS } from './validateNode';

export function validateOneOf(node: JsonNode, oneOfSchemas: any[]): NodeValidationError[] | undefined {
    const errors: NodeValidationError[] = [];

    const validSchemas = resolveOneOfBranch(oneOfSchemas, node);

    if (validSchemas.length !== 1) {
        errors.push({
            node: node,
            message: `Aucune ou plusieurs branches valides trouvées pour 'oneOf'.`
        });
    } else {
        const validSchema = validSchemas[0];
        const schemaErrors = validateNode(node, validSchema);
        if (schemaErrors.length > 0) {
            errors.push(...schemaErrors);
        }
    }

    return errors;
}

export function validateType(node: JsonNode, schema: any): NodeValidationError[] {
    const errors: NodeValidationError[] = [];

    if (!isTypeValid(node, schema.type)) {
        errors.push({
            node: node,
            message: `Type attendu: ${schema.type}`,
            code: "type",
            priority: ERROR_WEIGHTS.type
        });
    }

    return errors;
}

export function validateObjectConstraints(node: JsonNode, schema: any): NodeValidationError[] {
    if (node.type !== "object") return [];

    const errors: NodeValidationError[] = [];

    if (schema.required !== undefined) {
        const present = new Set((node.children ?? []).map(child => child.children?.[0]?.value));
        for (const requiredKey of schema.required) {
            if (!present.has(requiredKey)) {
                errors.push({
                    node: node,
                    message: `Clé requise manquante: ${requiredKey}`,
                    code: "required",
                    priority: ERROR_WEIGHTS.required
                });
            }
        }
    }

    if (schema.properties !== undefined) {
        for (const child of node.children ?? []) {
            // Vérifie que child.children existe et a au moins 2 éléments
            if (child.children !== undefined && child.children.length >= 2) {
                const propName = child.children[0].value;
                const propSchema = schema.properties[propName];
                if (propSchema !== undefined) {
                    const childErrors = validateNode(child.children[1], propSchema);
                    errors.push(...childErrors);
                }
            }
        }
    }

    if (schema.propertyNames !== undefined) {
        for (const child of node.children ?? []) {
            if (child.children !== undefined && child.children.length >= 2) {
                const propName = child.children[0].value;
                // On crée un faux nœud JSON pour le nom de la propriété
                const fakeNode = {
                    type: "string",
                    value: propName,
                    offset: child.children[0].offset,
                    length: child.children[0].length
                } as JsonNode;
                const nameErrors = validateStringConstraints(fakeNode, schema.propertyNames);
                errors.push(...nameErrors);
            }
        }
    }

    if (schema.additionalProperties !== undefined) {
        if (typeof schema.additionalProperties === "object") {
            for (const child of node.children ?? []) {
                if (child.children !== undefined && child.children.length >= 2) {
                    const propName = child.children[0].value;

                    if (schema.properties !== undefined) {
                        if (!(propName in schema.properties)) {
                            const childErrors = validateNode(child.children[1], schema.additionalProperties);
                            errors.push(...childErrors);
                        }
                    } else {
                        const childErrors = validateNode(child.children[1], schema.additionalProperties);
                        errors.push(...childErrors);
                    }
                }
            }
        } else if (typeof schema.additionalProperties === "boolean" && schema.additionalProperties === false) {
            for (const child of node.children ?? []) {
                if (child.children !== undefined && child.children.length >= 2) {
                    const propName = child.children[0].value;
                    if (!(propName in schema.properties)) {
                        errors.push({
                            node: child,
                            message: `Propriété non autorisée: ${propName}`,
                            code: "additionalProperties",
                            priority: ERROR_WEIGHTS.default
                        });
                    }
                }
            }
        }
    }

    return errors;
}

export function validateStringConstraints(node: JsonNode, schema: any): NodeValidationError[] {
    if (node.type !== "string") return [];

    const errors: NodeValidationError[] = [];

    if (schema.pattern !== undefined) {
        const regex = new RegExp(schema.pattern);
        if (!regex.test(node.value)) {
            errors.push({
                node: node,
                message: `La chaîne ne correspond pas au motif: ${schema.pattern}`,
                code: "pattern",
                priority: ERROR_WEIGHTS.pattern
            });
        }
    }

    if (schema.minLength !== undefined) {
        if (node.value.length < schema.minLength) {
            errors.push({
                node: node,
                message: `Longueur minimale: ${schema.minLength}`,
                code: "minLength",
                priority: ERROR_WEIGHTS.minLength
            });
        }
    }

    if (schema.maxLength !== undefined) {
        if (node.value.length > schema.maxLength) {
            errors.push({
                node: node,
                message: `Longueur maximale: ${schema.maxLength}`,
                code: "maxLength",
                priority: ERROR_WEIGHTS.maxLength
            });
        }
    }

    return errors;
}

export function validateNumberConstraints(node: JsonNode, schema: any): NodeValidationError[] {
    if (node.type !== "number") return [];

    if (schema.type === "integer") {
        if (!Number.isInteger(node.value)) {
            return [{
                node: node,
                message: `La valeur doit être un entier.`,
                code: "integer",
                priority: ERROR_WEIGHTS.integer
            }];
        }
    }

    const errors: NodeValidationError[] = [];

    if (schema.minimum !== undefined) {
        if (node.value < schema.minimum) {
            errors.push({
                node: node,
                message: `Valeur minimale: ${schema.minimum}`,
                code: "minimum",
                priority: ERROR_WEIGHTS.minimum
            });
        }
    }

    if (schema.maximum !== undefined) {
        if (node.value > schema.maximum) {
            errors.push({
                node: node,
                message: `Valeur maximale: ${schema.maximum}`,
                code: "maximum",
                priority: ERROR_WEIGHTS.maximum
            });
        }
    }

    if (schema.exclusiveMinimum !== undefined) {
        if (node.value <= schema.exclusiveMinimum) {
            errors.push({
                node: node,
                message: `Valeur doit être supérieure à ${schema.exclusiveMinimum}`,
                code: "exclusiveMinimum",
                priority: ERROR_WEIGHTS.exclusiveMinimum
            });
        }
    }

    if (schema.exclusiveMaximum !== undefined) {
        if (node.value >= schema.exclusiveMaximum) {
            errors.push({
                node: node,
                message: `Valeur doit être inférieure à ${schema.exclusiveMaximum}`,
                code: "exclusiveMaximum",
                priority: ERROR_WEIGHTS.exclusiveMaximum
            });
        }
    }

    if (schema.multipleOf !== undefined) {
        if (node.value % schema.multipleOf !== 0) {
            errors.push({
                node: node,
                message: `La valeur doit être un multiple de ${schema.multipleOf}`,
                code: "multipleOf",
                priority: ERROR_WEIGHTS.multipleOf
            });
        }
    }

    return errors;
}

export function validateArrayConstraints(node: JsonNode, schema: any): NodeValidationError[] {
    if (node.type !== "array") return [];

    const errors: NodeValidationError[] = [];

    if (schema.minItems !== undefined) {
        const itemCount = node.children?.length ?? 0;
        if (itemCount < schema.minItems) {
            errors.push({
                node: node,
                message: `Nombre minimum d'éléments: ${schema.minItems}`,
                code: "minItems",
                priority: ERROR_WEIGHTS.minItems
            });
        }
    }

    if (schema.maxItems !== undefined) {
        const itemCount = node.children?.length ?? 0;
        if (itemCount > schema.maxItems) {
            errors.push({
                node: node,
                message: `Nombre maximum d'éléments: ${schema.maxItems}`,
                code: "maxItems",
                priority: ERROR_WEIGHTS.maxItems
            });
        }
    }

    if (schema.items !== undefined) {
        // On gère les schema positinel pour les items
        if (Array.isArray(schema.items)) {
            for (let i = 0; i < (node.children?.length ?? 0); i++) {
                const itemSchema = schema.items[i] ?? schema.additionalItems;
                if (itemSchema && node.children) {
                    const itemErrors = validateNode(node.children[i], itemSchema);
                    errors.push(...itemErrors);
                }
            }
        } else {
            for (let i = 0; i < (node.children?.length ?? 0); i++) {
                if (node.children !== undefined) {
                    const itemErrors = validateNode(node.children[i], schema.items);
                    errors.push(...itemErrors);
                }
            }
        }
    }

    return errors;
}