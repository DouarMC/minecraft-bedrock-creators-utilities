import * as vscode from 'vscode';
import { completionProvider } from './completion/provider';

export function registerCompletionProvider( context: vscode.ExtensionContext, documentSelector: vscode.DocumentSelector) {
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            documentSelector,
            completionProvider
        )
    );
}