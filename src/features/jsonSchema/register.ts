import * as vscode from 'vscode';
import { createMinecraftDocumentSelector } from './utils/createMinecraftDocumentSelector';
import { registerCompletionProvider } from './completionProvider';
import { registerHoverProvider } from './hoverProvider';
import { registerDiagnosticCollection } from './diagnosticCollection';

export function registerJsonSchemaFeatures(context: vscode.ExtensionContext) {
    // Contient les patterns de fichier pour les schémas Minecraft
    const minecraftDocumentSelector = createMinecraftDocumentSelector();

    registerHoverProvider(context, minecraftDocumentSelector);
    registerCompletionProvider(context, minecraftDocumentSelector);
    registerDiagnosticCollection(context, minecraftDocumentSelector);
}