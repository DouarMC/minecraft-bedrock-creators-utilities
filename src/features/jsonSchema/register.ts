import * as vscode from 'vscode';
import { registerCompletionProvider } from './completionProvider';
import { registerHoverProvider } from './hoverProvider';
import { registerValidationJson } from './validationJson';

export function registerJsonSchemaFeatures(context: vscode.ExtensionContext) {
    // Enregistre les fournisseurs de complétion, hover et validation pour JSON
    registerCompletionProvider(context);
    registerHoverProvider(context);
    registerValidationJson(context);
}