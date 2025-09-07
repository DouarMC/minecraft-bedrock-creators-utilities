import * as vscode from 'vscode';
import { createMinecraftDocumentSelector } from './utils/createMinecraftDocumentSelector';
import { registerCompletionProvider } from './completion/completionProvider';
import { registerHoverProvider } from './hover/hoverProvider';
import { registerDiagnosticsProvider } from './diagnostics/diagnosticCollection';

export function registerSchemaFeatures(context: vscode.ExtensionContext) {
    // Contient les patterns de fichier pour les schémas Minecraft
    const minecraftDocumentSelector = createMinecraftDocumentSelector();

    registerHoverProvider(context, minecraftDocumentSelector);
    registerCompletionProvider(context, minecraftDocumentSelector);

    context.subscriptions.push(
        registerDiagnosticsProvider(context, minecraftDocumentSelector)
    );
}