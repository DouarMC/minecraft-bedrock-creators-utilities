import * as vscode from "vscode";
import { hoverProvider } from "./hover/provider";

export function registerHoverProvider(context: vscode.ExtensionContext, documentSelector: vscode.DocumentSelector) {
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(
            documentSelector,
            hoverProvider
        )
    );
}