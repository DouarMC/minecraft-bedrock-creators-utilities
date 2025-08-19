import * as vscode from 'vscode';
import {Node as JsonNode} from 'jsonc-parser';

export function isTypeValid(node: JsonNode, type: string): boolean {
    switch (type) {
        case "object": return node.type === "object";
        case "array": return node.type === "array";
        case "string": return node.type === "string";
        case "number": return node.type === "number";
        case "integer": return node.type === "number";
        case "boolean": return node.type === "boolean";
        case "null": return node.type === "null";
        default: return true;
    }
}

export function createDiagnostic(node: JsonNode, document: vscode.TextDocument, message: string): vscode.Diagnostic {
    const range = new vscode.Range(
        document.positionAt(node.offset),
        document.positionAt(node.offset + node.length)
    );
    return new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Warning);
}