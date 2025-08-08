import * as vscode from 'vscode';
import {Node as JsonNode} from 'jsonc-parser';
import { isTypeValid, createDiagnostic } from './helpers';
import { validateStringConstraints, validateNumberConstraints, validateArrayConstraints, validateObjectConstraints } from './constraints';

export function validateNode(node: JsonNode, schema: any, document: vscode.TextDocument, diags: vscode.Diagnostic[]) {
    // 1. Type
    if (schema.type && !isTypeValid(node, schema.type)) {
        diags.push(createDiagnostic(node, document, `Type attendu: ${schema.type}`));
    }

    // 2. Enum
    if (schema.enum && Array.isArray(schema.enum) && node.value !== undefined) {
        if (!schema.enum.includes(node.value)) {
            diags.push(createDiagnostic(node, document, `Valeur non autorisée. Possibles: ${schema.enum.join(", ")}`));
        }
    }

    if (schema.type === "object") {
        validateObjectConstraints(node, schema, document, diags);
    }
    if (schema.type === "array") {
        validateArrayConstraints(node, schema, document, diags);
    }
    if (schema.type === "string") {
        validateStringConstraints(node, schema, document, diags);
    }
    if (schema.type === "number" || schema.type === "integer") {
        validateNumberConstraints(node, schema, document, diags);
    }
}