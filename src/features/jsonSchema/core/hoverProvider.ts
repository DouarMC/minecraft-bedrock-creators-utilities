import * as vscode from 'vscode';
import { SchemaResolver } from './schemaResolver';
import { JsonContextAnalyzer } from './jsonContextAnalyzer';

export class JsonSchemaHoverProvider implements vscode.HoverProvider {
    private schemaResolver: SchemaResolver;
    private jsonContextAnalyzer: JsonContextAnalyzer;

    constructor(
        schemaResolver: SchemaResolver,
        jsonContextAnalyzer: JsonContextAnalyzer
    ) {
        this.schemaResolver = schemaResolver;
        this.jsonContextAnalyzer = jsonContextAnalyzer;
    }

    public provideHover(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.Hover | undefined {
        try {
            // 1. Analyser le contexte JSON
            const offset = document.offsetAt(position);
            const context = this.jsonContextAnalyzer.analyzePosition(document.getText(), offset);
            
            console.log(`🔍 HoverProvider: Context type: ${context.type}, Path: ${JSON.stringify(context.path)}`);
            
            // 🎯 IMPORTANT: Hover seulement sur les clés de propriétés, pas les valeurs
            if (context.type !== 'property-key') {
                console.log(`❌ HoverProvider: Not on property key, skipping hover`);
                return undefined;
            }
            
            // 2. Vérifier qu'on est vraiment sur le nom d'une propriété
            if (!this.isOnPropertyName(document.getText(), offset)) {
                console.log(`❌ HoverProvider: Not on property name, skipping hover`);
                return undefined;
            }
            
            // 3. Résoudre le schema pour ce fichier
            const schema = this.schemaResolver.resolveSchemaForFile(
                document.uri.fsPath,
                document.getText()
            );
            
            if (!schema) {
                console.log(`❌ HoverProvider: No schema found`);
                return undefined;
            }
            
            // 4. Pour le hover, on veut la description de la propriété elle-même
            // Le path nous donne le contexte parent, et on cherche la propriété actuelle dans ce contexte
            const currentPropertyName = this.getCurrentPropertyName(document.getText(), offset);
            console.log(`🔍 HoverProvider: Current property name: "${currentPropertyName}"`);
            
            if (!currentPropertyName) {
                console.log(`❌ HoverProvider: Could not extract property name`);
                return undefined;
            }
            
            // Le path nous donne déjà le bon contexte parent
            const parentSchema = this.getSchemaAtPath(schema, context.path);
            console.log(`🔍 HoverProvider: Parent schema found:`, !!parentSchema);
            console.log(`🔍 HoverProvider: Path used:`, context.path);
            
            if (!parentSchema || !parentSchema.properties) {
                console.log(`❌ HoverProvider: No parent schema or properties at path: ${JSON.stringify(context.path)}`);
                console.log(`Available schema:`, parentSchema);
                return undefined;
            }
            
            // Obtenir la définition de la propriété actuelle dans le schéma parent
            const propertySchema = parentSchema.properties[currentPropertyName];
            if (!propertySchema) {
                console.log(`❌ HoverProvider: No schema found for property: "${currentPropertyName}"`);
                console.log(`Available properties:`, Object.keys(parentSchema.properties));
                return undefined;
            }
            
            console.log(`✅ HoverProvider: Found property schema for: "${currentPropertyName}"`);
            
            // 5. Générer le contenu hover pour cette propriété
            const hoverContent = this.generateHoverContent(propertySchema, context, currentPropertyName);
            
            if (hoverContent) {
                console.log(`✅ HoverProvider: Generated hover content`);
                return new vscode.Hover(hoverContent);
            }
            
        } catch (error) {
            console.error('Erreur dans HoverProvider:', error);
        }
        
        return undefined;
    }

    private getSchemaAtPath(schema: any, path: string[]): any {
        let current = schema;
        
        for (const segment of path) {
            if (!current) break;
            
            console.log(`🔍 getSchemaAtPath: Looking for segment "${segment}" in schema:`, current);
            
            // Gestion des oneOf/anyOf/allOf
            if (current.oneOf || current.anyOf || current.allOf) {
                const alternatives = current.oneOf || current.anyOf || current.allOf;
                console.log(`🔍 getSchemaAtPath: Found alternatives (${current.oneOf ? 'oneOf' : current.anyOf ? 'anyOf' : 'allOf'}):`, alternatives.length);
                
                // Chercher dans chaque alternative celle qui a la propriété
                for (const alternative of alternatives) {
                    if (alternative.properties && alternative.properties[segment]) {
                        console.log(`✅ getSchemaAtPath: Found segment "${segment}" in alternative`);
                        current = alternative.properties[segment];
                        break;
                    }
                }
                
                // Si on n'a pas trouvé dans les alternatives, essayer de fusionner les propriétés
                if (!current.properties) {
                    const mergedProperties: any = {};
                    for (const alternative of alternatives) {
                        if (alternative.properties) {
                            Object.assign(mergedProperties, alternative.properties);
                        }
                    }
                    if (mergedProperties[segment]) {
                        console.log(`✅ getSchemaAtPath: Found segment "${segment}" in merged properties`);
                        current = mergedProperties[segment];
                    } else {
                        console.log(`❌ getSchemaAtPath: Segment "${segment}" not found in alternatives`);
                        return null;
                    }
                } else {
                    continue; // On a déjà trouvé dans la boucle précédente
                }
            }
            // Navigation standard dans le schema
            else if (current.type === 'object' && current.properties) {
                current = current.properties[segment];
            } else if (current.type === 'array' && current.items) {
                current = current.items;
            } else if (current.properties) {
                current = current.properties[segment];
            } else {
                console.log(`❌ getSchemaAtPath: No navigation possible for segment "${segment}"`);
                return null;
            }
        }
        
        console.log(`✅ getSchemaAtPath: Final schema:`, current);
        return current;
    }

    private isOnPropertyName(document: string, position: number): boolean {
        // Vérifier qu'on est dans les guillemets d'une clé de propriété
        let i = position;
        let foundOpenQuote = false;
        let foundCloseQuote = false;
        
        // Chercher vers la gauche pour trouver le guillemet d'ouverture de la string
        while (i >= 0) {
            if (document[i] === '"') {
                // Vérifier que ce n'est pas échappé
                if (i === 0 || document[i - 1] !== '\\') {
                    foundOpenQuote = true;
                    break;
                }
            }
            // Arrêter la recherche si on sort du contexte d'une propriété
            if (document[i] === '{' || document[i] === ',' || document[i] === '}') {
                break;
            }
            i--;
        }
        
        if (!foundOpenQuote) return false;
        
        // Chercher vers la droite pour trouver le guillemet de fermeture de la string
        i = position;
        while (i < document.length) {
            if (document[i] === '"') {
                // Vérifier que ce n'est pas échappé
                if (i === 0 || document[i - 1] !== '\\') {
                    foundCloseQuote = true;
                    break;
                }
            }
            i++;
        }
        
        if (!foundCloseQuote) return false;
        
        // Vérifier qu'après le guillemet de fermeture, il y a ':' (ignorer les espaces)
        i++;
        while (i < document.length && /\s/.test(document[i])) {
            i++;
        }
        
        return i < document.length && document[i] === ':';
    }

    private getCurrentPropertyName(document: string, position: number): string | null {
        // Trouver le début et la fin de la string qui contient le curseur
        let start = position;
        let end = position;
        
        // Aller vers la gauche pour trouver le guillemet d'ouverture
        // On doit ignorer les ':' qui sont DANS la string
        while (start > 0) {
            start--;
            if (document[start] === '"') {
                // Vérifier que ce n'est pas un guillemet échappé
                if (start === 0 || document[start - 1] !== '\\') {
                    break;
                }
            }
        }
        
        // Vérifier qu'on a trouvé un guillemet d'ouverture
        if (document[start] !== '"') return null;
        
        // Aller vers la droite pour trouver le guillemet de fermeture
        while (end < document.length) {
            if (document[end] === '"') {
                // Vérifier que ce n'est pas un guillemet échappé
                if (end === 0 || document[end - 1] !== '\\') {
                    break;
                }
            }
            end++;
        }
        
        // Vérifier qu'on a trouvé un guillemet de fermeture
        if (end >= document.length || document[end] !== '"') return null;
        
        // Extraire le nom de la propriété (entre les guillemets)
        const propertyName = document.substring(start + 1, end);
        console.log(`🔍 getCurrentPropertyName: Extracted "${propertyName}" from position ${position}`);
        return propertyName;
    }

    private generateHoverContent(schema: any, context: any, propertyName?: string): vscode.MarkdownString | undefined {
        if (!schema) {
            return undefined;
        }

        const content = new vscode.MarkdownString();
        content.isTrusted = true;
        content.supportHtml = true;

        // Title - utiliser le nom de la propriété si fourni
        let title = propertyName || schema.title || context.path[context.path.length - 1] || 'Property';
        content.appendMarkdown(`### ${title}\n\n`);

        // Type information
        if (schema.type) {
            content.appendMarkdown(`**Type:** \`${schema.type}\`\n\n`);
        }

        // Description
        if (schema.description) {
            content.appendMarkdown(`${schema.description}\n\n`);
        }

        // Format information (for Molang)
        if (schema.format === 'molang') {
            content.appendMarkdown(`**Format:** Molang expression\n\n`);
            content.appendMarkdown(`This field accepts Molang expressions for dynamic values.\n\n`);
        }

        // Enum values
        if (schema.enum && schema.enum.length > 0) {
            content.appendMarkdown(`**Allowed values:**\n`);
            for (const value of schema.enum) {
                content.appendMarkdown(`- \`${value}\`\n`);
            }
            content.appendMarkdown(`\n`);
        }

        // Default value
        if (schema.default !== undefined) {
            content.appendMarkdown(`**Default:** \`${JSON.stringify(schema.default)}\`\n\n`);
        }

        // Examples
        if (schema.examples && schema.examples.length > 0) {
            content.appendMarkdown(`**Examples:**\n`);
            for (const example of schema.examples) {
                content.appendMarkdown(`\`\`\`json\n${JSON.stringify(example, null, 2)}\n\`\`\`\n`);
            }
        }

        // Additional constraints
        if (schema.minimum !== undefined) {
            content.appendMarkdown(`**Minimum:** ${schema.minimum}\n`);
        }
        if (schema.maximum !== undefined) {
            content.appendMarkdown(`**Maximum:** ${schema.maximum}\n`);
        }
        if (schema.minLength !== undefined) {
            content.appendMarkdown(`**Minimum length:** ${schema.minLength}\n`);
        }
        if (schema.maxLength !== undefined) {
            content.appendMarkdown(`**Maximum length:** ${schema.maxLength}\n`);
        }

        return content;
    }
}