import * as vscode from 'vscode';
import { registerCompletionProvider } from './completionProvider';
import { registerHoverProvider } from './hoverProvider';
import { registerValidationJson } from './validationJson';
import { ConflictAvoidance } from '../../utils/conflictAvoidance';

export function registerJsonSchemaFeatures(context: vscode.ExtensionContext) {
    // Utilise le document selector optimisé pour éviter les conflits
    const documentSelector = ConflictAvoidance.createOptimizedDocumentSelector() as vscode.DocumentFilter[];
    
    // Conversion en format compatible avec les providers
    const filePatterns = documentSelector.map(selector => ({
        language: selector.language as string,
        pattern: selector.pattern as string
    }));

    // Enregistre les fournisseurs avec des patterns spécifiques pour éviter les conflits
    registerCompletionProvider(context, filePatterns);
    registerHoverProvider(context, filePatterns);
    registerValidationJson(context, filePatterns);
}