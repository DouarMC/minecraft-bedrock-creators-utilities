import * as vscode from 'vscode';
import { getLocation } from 'jsonc-parser';
import { navigateToSchemaAtPath } from '../utils/navigateToSchemaAtPath';
import { getSchemaForDocument } from '../utils/getSchemaForDocument';


export const hoverProvider: vscode.HoverProvider = {
    provideHover(document, position, token) {
        const text = document.getText();
        const offset = document.offsetAt(position);
        const location = getLocation(text, offset);

        // 🎯 Détection du type de fichier (fonction réutilisable)
        const schema = getSchemaForDocument(document);
        if (!schema) return null;

        // 🎯 Navigation dans le schéma (fonction réutilisable)
        let currentPath = [...location.path];
        if (currentPath.length > 0 && currentPath[currentPath.length - 1] === "") {
            currentPath = currentPath.slice(0, -1);
        }

        const currentSchema = navigateToSchemaAtPath(schema, currentPath);
        if (!currentSchema) {
            return null; // Si aucun schéma trouvé, on ne fournit pas de hover
        }

        const hoverContent = new vscode.MarkdownString();
        
        // Titre principal
        const propertyName = currentPath.length > 0 ? currentPath[currentPath.length - 1] : 'Document';
        hoverContent.appendMarkdown(`## ${propertyName}`);
        
        // Type
        if (currentSchema.type) {
            hoverContent.appendMarkdown(`\n\n**Type**: \`${currentSchema.type}\``);
        }
        
        // Description
        if (currentSchema.description) {
            hoverContent.appendMarkdown(`\n\n${currentSchema.description}`);
        }
        
        // Enum (valeurs possibles)
        if (currentSchema.enum && Array.isArray(currentSchema.enum)) {
            hoverContent.appendMarkdown(`\n\n**Valeurs possibles**:`);
            currentSchema.enum.forEach((value: any) => {
                hoverContent.appendMarkdown(`\n• \`${value}\``);
            });
        }

        // Contraintes numériques
        if (currentSchema.type === 'number' || currentSchema.type === 'integer') {
            const constraints = [];
            if (currentSchema.minimum !== undefined) constraints.push(`min: ${currentSchema.minimum}`);
            if (currentSchema.maximum !== undefined) constraints.push(`max: ${currentSchema.maximum}`);
            if (constraints.length > 0) {
                hoverContent.appendMarkdown(`\n\n**Contraintes**: ${constraints.join(', ')}`);
            }
        }
        
        // Pattern pour les strings
        if (currentSchema.type === 'string' && currentSchema.pattern) {
            hoverContent.appendMarkdown(`\n\n**Pattern**: \`${currentSchema.pattern}\``);
        }
        
        // Required (si on est dans un objet)
        if (currentSchema.type === 'object' && currentSchema.required && currentSchema.required.length > 0) {
            hoverContent.appendMarkdown(`\n\n**Propriétés requises**: ${currentSchema.required.map((r: string) => `\`${r}\``).join(', ')}`);
        }

        return new vscode.Hover(hoverContent);
    }
};