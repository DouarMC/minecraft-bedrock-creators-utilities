import * as vscode from "vscode";
import { getSchemaForDocument } from "../utils/getSchemaForDocument";
import { parseTree } from "jsonc-parser";
import { validateNode } from "./validateNode";

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
    validateNode(root, schema, document, diags);

    diagnostics.set(document.uri, diags);
}