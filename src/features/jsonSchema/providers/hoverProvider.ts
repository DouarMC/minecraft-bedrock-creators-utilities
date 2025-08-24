import * as vscode from "vscode";
import { getSchemaForDocument } from "../utils/getSchemaForDocument";
import { doHover } from "../hover/doHover";

export function registerHoverProvider(context: vscode.ExtensionContext, documentSelector: vscode.DocumentSelector) {
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(
            documentSelector,
            {
                provideHover(document, position, token) {
                    const schema = getSchemaForDocument(document);
                    if (!schema) return null;

                    return doHover(document, position, schema);
                }
            }
        )
    );
}