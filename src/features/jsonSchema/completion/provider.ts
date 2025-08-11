import * as vscode from 'vscode';
import { getLocation, parseTree, Node as JsonNode } from 'jsonc-parser';
import { navigateToSchemaAtPath } from '../utils/navigateToSchemaAtPath';
import { createPropertyCompletions } from './utils/createPropertyCompletions';
import { createValueCompletions } from './utils/createValueCompletions';
import { getSchemaForDocument } from '../utils/getSchemaForDocument';

export const completionProvider: vscode.CompletionItemProvider = {
    async provideCompletionItems(document, position, token, context) {
        // 🎯 EXACTEMENT le même début que hover !
        const text = document.getText();
        const offset = document.offsetAt(position);
        const location = getLocation(text, offset);

        // 🎯 Détection du type de fichier (fonction réutilisable)
        const schema = getSchemaForDocument(document);
        if (!schema) return null;

        // 🎯 ÉTAPE 3 : Navigation conditionnelle selon le contexte
        let targetPath = [...location.path];
        let suggestingProperties = false;

        if (location.isAtPropertyKey && targetPath[targetPath.length - 1] === "") {
            // Cas 1 : Nouvelle propriété - enlever le "" et suggérer properties
            targetPath = targetPath.slice(0, -1);
            suggestingProperties = true;
        } else {
            // Cas 2 & 3 : Valeur - garder le path complet pour le type de valeur
            suggestingProperties = false;
        }

        // --- Ajout : récupération du node courant ---
        const root = parseTree(text);
        if (!root) {
            return;
        }
        
        // 🎯 Navigation dans le schéma (fonction réutilisable)
        const currentSchema = navigateToSchemaAtPath(schema, targetPath, root, "completion");
        if (!currentSchema) {
            return null; // Pas de schéma trouvé
        }

        if (suggestingProperties) {
            return await createPropertyCompletions(currentSchema, document, position, targetPath);
        } else {
            return await createValueCompletions(currentSchema, document, position);
        }
    }
};