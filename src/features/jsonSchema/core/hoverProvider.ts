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
            
            // Resolve schema alternatives first
            current = this.resolveSchemaAlternatives(current);
            
            // Navigation standard dans le schema
            if (current.type === 'object' && current.properties) {
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

    /**
     * Resolves schema alternatives (oneOf/anyOf/allOf) by merging them
     */
    private resolveSchemaAlternatives(schema: any): any {
        if (!schema) return schema;
        
        const alternatives = schema.oneOf || schema.anyOf || schema.allOf;
        if (!alternatives || !Array.isArray(alternatives)) {
            return schema;
        }
        
        console.log(`🔍 resolveSchemaAlternatives: Found alternatives (${schema.oneOf ? 'oneOf' : schema.anyOf ? 'anyOf' : 'allOf'}):`, alternatives.length);
        
        // Merge all alternatives into a single schema for better hover experience
        const merged: any = { ...schema };
        delete merged.oneOf;
        delete merged.anyOf;
        delete merged.allOf;
        
        const mergedProperties: any = {};
        const mergedDescriptions: string[] = [];
        let mergedType: string | undefined;
        
        for (const alternative of alternatives) {
            // Merge properties
            if (alternative.properties) {
                Object.assign(mergedProperties, alternative.properties);
            }
            
            // Collect descriptions for merging
            if (alternative.description) {
                mergedDescriptions.push(alternative.description);
            }
            
            // Merge type information
            if (alternative.type && !mergedType) {
                mergedType = alternative.type;
            }
        }
        
        if (Object.keys(mergedProperties).length > 0) {
            merged.properties = mergedProperties;
        }
        
        if (mergedType) {
            merged.type = mergedType;
        }
        
        // Create merged description for combinators
        if (mergedDescriptions.length > 0) {
            const combinator = schema.oneOf ? 'oneOf' : schema.anyOf ? 'anyOf' : 'allOf';
            merged.description = `${combinator} alternatives:\n${mergedDescriptions.map((desc, i) => `${i + 1}. ${desc}`).join('\n')}`;
        }
        
        return merged;
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
        // Enhanced property name extraction that handles : in key names correctly
        let start = position;
        let end = position;
        
        // Find the start of the current string (going backwards)
        while (start > 0) {
            start--;
            const char = document[start];
            
            if (char === '"') {
                // Check if this quote is escaped
                let escapeCount = 0;
                let checkPos = start - 1;
                while (checkPos >= 0 && document[checkPos] === '\\') {
                    escapeCount++;
                    checkPos--;
                }
                
                // If even number of escapes (including 0), the quote is not escaped
                if (escapeCount % 2 === 0) {
                    break;
                }
            }
        }
        
        // Verify we found an opening quote
        if (start < 0 || document[start] !== '"') return null;
        
        // Find the end of the current string (going forwards)
        end = position;
        while (end < document.length) {
            const char = document[end];
            
            if (char === '"') {
                // Check if this quote is escaped
                let escapeCount = 0;
                let checkPos = end - 1;
                while (checkPos >= 0 && document[checkPos] === '\\') {
                    escapeCount++;
                    checkPos--;
                }
                
                // If even number of escapes (including 0), the quote is not escaped
                if (escapeCount % 2 === 0) {
                    break;
                }
            }
            end++;
        }
        
        // Verify we found a closing quote
        if (end >= document.length || document[end] !== '"') return null;
        
        // Extract the property name (between the quotes)
        const propertyName = document.substring(start + 1, end);
        
        // Verify this is actually a property key by checking for : after the closing quote
        let afterQuote = end + 1;
        while (afterQuote < document.length && /\s/.test(document[afterQuote])) {
            afterQuote++;
        }
        
        if (afterQuote >= document.length || document[afterQuote] !== ':') {
            return null; // Not a property key
        }
        
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