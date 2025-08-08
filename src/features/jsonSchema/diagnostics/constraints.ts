import * as vscode from 'vscode';
import {Node as JsonNode} from 'jsonc-parser';
import { createDiagnostic } from './helpers';
import { validateNode } from './validateNode';

export function validateStringConstraints(node: JsonNode, schema: any, document: vscode.TextDocument, diags: vscode.Diagnostic[]) {
    if (node.type !== "string") return;

    if (schema.pattern !== undefined) {
        const regex = new RegExp(schema.pattern);
        if (!regex.test(node.value)) {
            diags.push(createDiagnostic(node, document, `La valeur ne correspond pas au pattern: ${schema.pattern}`));
        }
    }
    if (schema.minLength !== undefined) {
        if (node.value.length < schema.minLength) {
            diags.push(createDiagnostic(node, document, `Longueur minimale: ${schema.minLength}`));
        }
    }
    if (schema.maxLength !== undefined) {
        if (node.value.length > schema.maxLength) {
            diags.push(createDiagnostic(node, document, `Longueur maximale: ${schema.maxLength}`));
        }
    }
}

export function validateNumberConstraints(node: JsonNode, schema: any, document: vscode.TextDocument, diags: vscode.Diagnostic[]) {
    if (node.type !== "number") return;

    // Vérifie si le type est "integer" et si la valeur est un entier
    if (schema.type === "integer") {
        if (!Number.isInteger(node.value)) {
            diags.push(createDiagnostic(node, document, `La valeur doit être un entier.`));
        }
    }

    if (schema.minimum !== undefined) {
        if (node.value < schema.minimum) {
            diags.push(createDiagnostic(node, document, `Minimum: ${schema.minimum}.`));
        }
    }

    if (schema.maximum !== undefined) {
        if (node.value > schema.maximum) {
            diags.push(createDiagnostic(node, document, `Maximum: ${schema.maximum}.`));
        }
    }

    if (schema.exclusiveMinimum !== undefined) {
        if (node.value <= schema.exclusiveMinimum) {
            diags.push(createDiagnostic(node, document, `La valeur doit être supérieure à ${schema.exclusiveMinimum}.`));
        }
    }

    if (schema.exclusiveMaximum !== undefined) {
        if (node.value >= schema.exclusiveMaximum) {
            diags.push(createDiagnostic(node, document, `La valeur doit être inférieure à ${schema.exclusiveMaximum}.`));
        }
    }

    if (schema.multipleOf !== undefined) {
        if (node.value % schema.multipleOf !== 0) {
            diags.push(createDiagnostic(node, document, `La valeur doit être un multiple de ${schema.multipleOf}.`));
        }
    }
}

export function validateObjectConstraints(node: JsonNode, schema: any, document: vscode.TextDocument, diags: vscode.Diagnostic[]) {
    if (node.type !== "object") return;

    // Vérifie les propriétés requises
    if (schema.required !== undefined && Array.isArray(schema.required)) {
        const present = new Set((node.children ?? []).map(child => child.children?.[0]?.value));
        for (const req of schema.required) {
            if (!present.has(req)) {
                diags.push(createDiagnostic(node, document, `Propriété requise manquante: ${req}`));
            }
        }
    }

    // Récursivité sur les propriétés
    if (schema.properties !== undefined) {
        for (const child of node.children ?? []) {
            // Vérifie que child.children existe et a au moins 2 éléments
            if (child.children !== undefined && child.children.length >= 2) {
                const propName = child.children[0].value;
                const propSchema = schema.properties[propName];
                if (propSchema !== undefined) { 
                    validateNode(child.children[1], propSchema, document, diags);
                }
            }
        }
    }

    // Validation des noms de propriétés (propertyNames)
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
                validateStringConstraints(fakeNode, schema.propertyNames, document, diags); // On valide le nom de la propriété, c'est forcément un string donc on utilise validateStringConstraints
            }
        }
    }

    // Validation des propriétés additionnelles
    if (schema.additionalProperties !== undefined) {
        if (typeof schema.additionalProperties === "object") {
            for (const child of node.children ?? []) {
                if (child.children !== undefined && child.children.length >= 2) {
                    const propName = child.children[0].value;

                    // Si la propriété n'est pas dans schema.properties, on valide avec additionalProperties
                    if (schema.properties !== undefined) {
                        if (!(propName in schema.properties)) {
                            validateNode(child.children[1], schema.additionalProperties, document, diags);
                        }
                    } else {
                        // Si schema.properties n'existe pas, on valide toujours avec additionalProperties
                        validateNode(child.children[1], schema.additionalProperties, document, diags);
                    }
                }
            }
        }
    }
}

export function validateArrayConstraints(node: JsonNode, schema: any, document: vscode.TextDocument, diags: vscode.Diagnostic[]) {
    if (node.type !== "array") return;

    if (schema.minItems !== undefined) {
        const itemCount = node.children?.length ?? 0;
        if (itemCount < schema.minItems) {
            diags.push(createDiagnostic(node, document, `Nombre minimum d'éléments: ${schema.minItems}.`));
        }
    }

    if (schema.maxItems !== undefined) {
        const itemCount = node.children?.length ?? 0;
        if (itemCount > schema.maxItems) {
            diags.push(createDiagnostic(node, document, `Nombre maximum d'éléments: ${schema.maxItems}.`));
        }
    }

    if (schema.items !== undefined) {
        // On gère les schema positinel pour les items
        if (Array.isArray(schema.items)) {
            for (let i = 0; i < (node.children?.length ?? 0); i++) {
                const itemSchema = schema.items[i] ?? schema.additionalItems;
                if (itemSchema && node.children) {
                    validateNode(node.children[i], itemSchema, document, diags);
                }
            }
        } else {
            for (let i = 0; i < (node.children?.length ?? 0); i++) {
                if (node.children !== undefined) {
                    validateNode(node.children[i], schema.items, document, diags);
                }
            }
        }
    }
}