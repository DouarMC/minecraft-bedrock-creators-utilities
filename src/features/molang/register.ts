import * as vscode from 'vscode';
import { registerMolangEditorCommand } from './molangEditor';
import { registerCodeActionProvider } from './codeActionProvider';
import { registerInMemoryFileSystemProvider } from './InMemoryFileSystemProvider';
import { registerMolangLanguage } from './molangLanguage';

export function registerMolangFeatures(context: vscode.ExtensionContext) {
    // Enregistre les commandes et fonctionnalités liées à Molang
    registerInMemoryFileSystemProvider(context);
    registerMolangEditorCommand(context);
    registerCodeActionProvider(context);
    registerMolangLanguage(context);
}