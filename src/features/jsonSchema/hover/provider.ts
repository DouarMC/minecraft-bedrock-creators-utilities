import * as vscode from 'vscode';
import { findNodeAtLocation, getLocation, parseTree, Node as JsonNode } from 'jsonc-parser';
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

        if (typeof currentPath[currentPath.length - 1] === "number" ) {
            // Si le dernier segment est un index de tableau, on ne peut pas fournir de hover
            return null;
        }

        const root = parseTree(text);
        if (!root) {
            return;
        }

        const currentSchema = navigateToSchemaAtPath(schema, currentPath, root, "hover");
        if (!currentSchema) {
            return null; // Si aucun schéma trouvé, on ne fournit pas de hover
        }

        const hoverContent = new vscode.MarkdownString();
        // Titre principal
        const propertyName = currentPath.length > 0 ? currentPath[currentPath.length - 1] : 'Document';
        hoverContent.appendMarkdown(`### ${propertyName}`);


        if (currentSchema["x-experimental_options"] && currentSchema["x-experimental_options"].length > 0) {
            hoverContent.appendMarkdown(`\n\n**Options expérimentales**:`);
            currentSchema["x-experimental_options"].forEach((option: string) => {
                hoverContent.appendMarkdown(`\n- \`${option}\``);
            });
        }

        if (currentSchema["x-localized"]) {
            hoverContent.appendMarkdown(`\n\n**Texte traduisable**`);
        }

        // Description
        if (currentSchema.description) {
            hoverContent.appendMarkdown(`\n\n${currentSchema.description}`);
        }

        if (currentSchema.default) {
            hoverContent.appendMarkdown(`\n\n**Valeur par défaut**: \`${currentSchema.default}\``);
        }

        if (currentSchema.oneOf && currentSchema.oneOf.length > 1) {
            hoverContent.appendMarkdown(`\n\n**Options disponibles**:`);
            currentSchema.oneOf.forEach((option: any, index: number) => {
                hoverContent.appendMarkdown(`\n- **Option ${index + 1}**:`);
                if (option.description) {
                    hoverContent.appendMarkdown(`\n  ${option.description}`);
                }
                if (option.type) {
                    hoverContent.appendMarkdown(`\n  **Type**: \`${option.type}\``);
                }
                if (option.enum && Array.isArray(option.enum)) {
                    hoverContent.appendMarkdown(`\n  **Valeurs possibles**: ${option.enum.map((value: any) => `\`${value}\``).join(', ')}`);
                }
            });
        } else {
            if (currentSchema.type) {
                hoverContent.appendMarkdown(`\n\n**Type**: \`${currentSchema.type}\``);
            }

            if (currentSchema.enum && Array.isArray(currentSchema.enum)) {
                hoverContent.appendMarkdown(`\n\n**Valeurs possibles**:`);
                currentSchema.enum.forEach((value: any) => {
                    hoverContent.appendMarkdown(`\n• \`${value}\``);
                });
            }
        }

        return new vscode.Hover(hoverContent);
    }
};