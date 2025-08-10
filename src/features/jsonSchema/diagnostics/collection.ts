import * as vscode from "vscode";
import { getSchemaForDocument } from "../utils/getSchemaForDocument";
import { parseTree } from "jsonc-parser";
import { validateNode } from "./validateNode";
import { createDiagnostic } from "./helpers";

export function updateDiagnostics(document: vscode.TextDocument, diagnostics: vscode.DiagnosticCollection) {
    const schema = getSchemaForDocument(document);
    if (!schema) {
        diagnostics.set(document.uri, []);
        return;
    }

    const root = parseTree(document.getText());
    if (!root) {
        diagnostics.set(document.uri, []);
        return;
    }

    const diags: vscode.Diagnostic[] = [];
    const errors = validateNode(root, schema);
    for (const error of errors) {
        const diagnostic = createDiagnostic(error.node, document, error.message);
        if (diagnostic) {
            diags.push(diagnostic);
        }
    }
    
    diagnostics.set(document.uri, diags);
}