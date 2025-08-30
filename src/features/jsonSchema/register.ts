import * as vscode from 'vscode';
import { createMinecraftDocumentSelector } from './utils/createMinecraftDocumentSelector';
import { registerCompletionProvider } from './completion/completionProvider';
import { registerHoverProvider } from './hover/hoverProvider';
import { registerDiagnosticCollection } from './diagnostics/diagnosticCollection';

export function registerJsonSchemaFeatures(context: vscode.ExtensionContext) {
    // Contient les patterns de fichier pour les schémas Minecraft
    const minecraftDocumentSelector = createMinecraftDocumentSelector();

    registerHoverProvider(context, minecraftDocumentSelector);
    registerCompletionProvider(context, minecraftDocumentSelector);
    registerDiagnosticCollection(context, minecraftDocumentSelector);
}