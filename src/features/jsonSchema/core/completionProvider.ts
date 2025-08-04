import * as vscode from 'vscode';
import { SchemaResolver } from './schemaResolver';
import { JsonContextAnalyzer } from './jsonContextAnalyzer';
import { DynamicExamplesProvider } from './dynamicExamplesProvider';
import { MolangService } from './molangService';

export class JsonSchemaCompletionProvider implements vscode.CompletionItemProvider {
    private schemaResolver: SchemaResolver;
    private jsonContextAnalyzer: JsonContextAnalyzer;
    private dynamicExamplesProvider: DynamicExamplesProvider;

    constructor(
        schemaResolver: SchemaResolver,
        jsonContextAnalyzer: JsonContextAnalyzer,
        dynamicExamplesProvider: DynamicExamplesProvider
    ) {
        this.schemaResolver = schemaResolver;
        this.jsonContextAnalyzer = jsonContextAnalyzer;
        this.dynamicExamplesProvider = dynamicExamplesProvider;
    }

    public async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
    ): Promise<vscode.CompletionItem[]> {
        console.log(`🎯 CompletionProvider: Triggered for file: ${document.uri.fsPath} at position ${position.line}:${position.character}`);
        
        try {
            // 1. Analyser le contexte JSON
            const offset = document.offsetAt(position);
            const context = this.jsonContextAnalyzer.analyzePosition(document.getText(), offset);
            console.log(`📍 CompletionProvider: JSON context:`, context);
            
            // 2. Résoudre le schema pour ce fichier
            const schema = this.schemaResolver.resolveSchemaForFile(
                document.uri.fsPath,
                document.getText()
            );
            console.log(`📋 CompletionProvider: Schema resolved:`, schema ? 'YES' : 'NO');
            
            if (!schema) {
                console.log(`❌ CompletionProvider: No schema found, returning empty completions`);
                return [];
            }
            
            // 3. Générer les suggestions selon le contexte (pas besoin d'AJV ici)
            const completions = await this.generateCompletions(context, schema, document, position);
            console.log(`✅ CompletionProvider: Generated ${completions.length} completions`);
            return completions;
            
        } catch (error) {
            console.error('Erreur dans CompletionProvider:', error);
            return [];
        }
    }

    private async generateCompletions(
        context: any,
        schema: any,
        document: vscode.TextDocument,
        position: vscode.Position
    ): Promise<vscode.CompletionItem[]> {
        const completions: vscode.CompletionItem[] = [];
        
        // Naviguer dans le schema selon le contexte path
        const schemaAtPath = this.getSchemaAtPath(schema, context.path);
        if (!schemaAtPath) {
            return completions;
        }
        
        switch (context.type) {
            case 'property-key':
                completions.push(...await this.getPropertyKeyCompletions(schemaAtPath, context));
                break;
                
            case 'property-value':
                completions.push(...await this.getPropertyValueCompletions(schemaAtPath, context));
                break;
                
            case 'array-item':
                completions.push(...await this.getArrayItemCompletions(schemaAtPath, context));
                break;
                
            case 'root':
                completions.push(...await this.getRootCompletions(schemaAtPath, context));
                break;
        }
        
        return completions;
    }

    private getSchemaAtPath(schema: any, path: string[]): any {
        let current = schema;
        
        for (const segment of path) {
            if (!current) break;
            
            // Handle oneOf/anyOf/allOf during schema navigation
            current = this.resolveSchemaAlternatives(current);
            
            // Navigate in the schema according to type
            if (current.type === 'object' && current.properties) {
                current = current.properties[segment];
            } else if (current.type === 'array' && current.items) {
                current = current.items;
                // Handle items.oneOf in arrays
                if (current.oneOf || current.anyOf || current.allOf) {
                    current = this.resolveSchemaAlternatives(current);
                }
            } else if (current.properties) {
                current = current.properties[segment];
            } else {
                return null;
            }
        }
        
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
        
        // Merge all alternatives into a single schema
        const merged: any = { ...schema };
        delete merged.oneOf;
        delete merged.anyOf;
        delete merged.allOf;
        
        const mergedProperties: any = {};
        const mergedRequired: string[] = [];
        let mergedType: string | undefined;
        
        for (const alternative of alternatives) {
            // Merge properties
            if (alternative.properties) {
                Object.assign(mergedProperties, alternative.properties);
            }
            
            // Merge required arrays (for anyOf, union; for allOf, intersection)
            if (alternative.required) {
                if (schema.allOf) {
                    // For allOf, all requirements must be met
                    mergedRequired.push(...alternative.required);
                } else {
                    // For oneOf/anyOf, add to possible requirements
                    for (const req of alternative.required) {
                        if (!mergedRequired.includes(req)) {
                            mergedRequired.push(req);
                        }
                    }
                }
            }
            
            // Merge type information
            if (alternative.type && !mergedType) {
                mergedType = alternative.type;
            }
        }
        
        if (Object.keys(mergedProperties).length > 0) {
            merged.properties = mergedProperties;
        }
        
        if (mergedRequired.length > 0) {
            merged.required = [...new Set(mergedRequired)];
        }
        
        if (mergedType) {
            merged.type = mergedType;
        }
        
        return merged;
    }

    private async getPropertyKeyCompletions(schema: any, context: any): Promise<vscode.CompletionItem[]> {
        const completions: vscode.CompletionItem[] = [];
        
        if (!schema || !schema.properties) {
            return completions;
        }
        
        // Get required properties for prioritization
        const requiredProperties = new Set(schema.required || []);
        
        // Ajouter toutes les propriétés disponibles
        for (const [propertyName, propertySchema] of Object.entries(schema.properties)) {
            const completion = new vscode.CompletionItem(
                propertyName,
                vscode.CompletionItemKind.Property
            );
            
            completion.detail = (propertySchema as any).type || 'property';
            completion.documentation = (propertySchema as any).description || `Property: ${propertyName}`;
            
            // Enhanced snippet insertion with proper value suggestions
            const valueSnippet = this.generateValueSnippet(propertySchema as any);
            completion.insertText = new vscode.SnippetString(`"${propertyName}": ${valueSnippet}`);
            
            // Prioritize required properties
            if (requiredProperties.has(propertyName)) {
                completion.sortText = `0_${propertyName}`; // Sort required properties first
                completion.detail = `${completion.detail} (required)`;
            } else {
                completion.sortText = `1_${propertyName}`;
            }
            
            completions.push(completion);
        }
        
        return completions;
    }

    /**
     * Generate appropriate value snippets for property insertion
     */
    private generateValueSnippet(propertySchema: any): string {
        if (!propertySchema) {
            return '${1:value}';
        }
        
        // Handle oneOf/anyOf by taking the first alternative
        if (propertySchema.oneOf || propertySchema.anyOf) {
            const alternatives = propertySchema.oneOf || propertySchema.anyOf;
            if (alternatives.length > 0) {
                return this.generateValueSnippet(alternatives[0]);
            }
        }
        
        // Handle allOf by merging (simple case)
        if (propertySchema.allOf && propertySchema.allOf.length > 0) {
            return this.generateValueSnippet(propertySchema.allOf[0]);
        }
        
        // Handle enum values
        if (propertySchema.enum && propertySchema.enum.length > 0) {
            const firstValue = propertySchema.enum[0];
            return typeof firstValue === 'string' ? `"\${1:${firstValue}}"` : `\${1:${firstValue}}`;
        }
        
        // Handle type-based snippets
        switch (propertySchema.type) {
            case 'boolean':
                return '${1|true,false|}';
            case 'string':
                if (propertySchema.format === 'molang') {
                    return '"${1:0.0}"';
                }
                return '"${1:value}"';
            case 'number':
            case 'integer':
                return '${1:0}';
            case 'object':
                return '{\n\t$0\n}';
            case 'array':
                return '[\n\t$0\n]';
            default:
                return '${1:value}';
        }
    }

    private async getPropertyValueCompletions(schema: any, context: any): Promise<vscode.CompletionItem[]> {
        const completions: vscode.CompletionItem[] = [];
        
        if (!schema) {
            return completions;
        }
        
        // Handle oneOf/anyOf alternatives by merging suggestions
        if (schema.oneOf || schema.anyOf || schema.allOf) {
            const alternatives = schema.oneOf || schema.anyOf || schema.allOf;
            const mergedCompletions = new Map<string, vscode.CompletionItem>();
            
            for (const alternative of alternatives) {
                const altCompletions = await this.getPropertyValueCompletions(alternative, context);
                for (const completion of altCompletions) {
                    const key = completion.label.toString();
                    if (!mergedCompletions.has(key)) {
                        mergedCompletions.set(key, completion);
                    }
                }
            }
            
            return Array.from(mergedCompletions.values());
        }
        
        // Enum values
        if (schema.enum) {
            for (const value of schema.enum) {
                const completion = new vscode.CompletionItem(
                    String(value),
                    vscode.CompletionItemKind.EnumMember
                );
                completion.insertText = typeof value === 'string' ? `"${value}"` : String(value);
                completion.detail = 'enum value';
                completions.push(completion);
            }
        }
        
        // Type-based suggestions
        if (schema.type) {
            switch (schema.type) {
                case 'boolean':
                    completions.push(
                        new vscode.CompletionItem('true', vscode.CompletionItemKind.Value),
                        new vscode.CompletionItem('false', vscode.CompletionItemKind.Value)
                    );
                    break;
                case 'string':
                    if (schema.format === 'molang') {
                        // Suggestions Molang basiques
                        const molangSuggestions = ['math.random', 'query.health', 'variable.', 'temp.'];
                        for (const suggestion of molangSuggestions) {
                            const completion = new vscode.CompletionItem(suggestion, vscode.CompletionItemKind.Function);
                            completion.insertText = `"${suggestion}"`;
                            completion.detail = 'Molang expression';
                            completions.push(completion);
                        }
                    } else {
                        const completion = new vscode.CompletionItem('""', vscode.CompletionItemKind.Value);
                        completion.insertText = '""';
                        completion.detail = 'string value';
                        completions.push(completion);
                    }
                    break;
                case 'number':
                case 'integer':
                    const numberCompletion = new vscode.CompletionItem('0', vscode.CompletionItemKind.Value);
                    numberCompletion.detail = schema.type;
                    completions.push(numberCompletion);
                    break;
                case 'object':
                    const objectCompletion = new vscode.CompletionItem('{}', vscode.CompletionItemKind.Struct);
                    objectCompletion.insertText = '{}';
                    objectCompletion.detail = 'object';
                    completions.push(objectCompletion);
                    break;
                case 'array':
                    const arrayCompletion = new vscode.CompletionItem('[]', vscode.CompletionItemKind.Struct);
                    arrayCompletion.insertText = '[]';
                    arrayCompletion.detail = 'array';
                    completions.push(arrayCompletion);
                    break;
            }
        }
        
        return completions;
    }

    private async getArrayItemCompletions(schema: any, context: any): Promise<vscode.CompletionItem[]> {
        const completions: vscode.CompletionItem[] = [];
        
        if (!schema || !schema.items) {
            return completions;
        }
        
        // Handle items.oneOf in arrays by merging alternatives
        let itemsSchema = schema.items;
        if (itemsSchema.oneOf || itemsSchema.anyOf || itemsSchema.allOf) {
            const alternatives = itemsSchema.oneOf || itemsSchema.anyOf || itemsSchema.allOf;
            const mergedCompletions = new Map<string, vscode.CompletionItem>();
            
            for (const alternative of alternatives) {
                const altCompletions = await this.getPropertyValueCompletions(alternative, context);
                for (const completion of altCompletions) {
                    const key = completion.label.toString();
                    if (!mergedCompletions.has(key)) {
                        mergedCompletions.set(key, completion);
                    }
                }
            }
            
            return Array.from(mergedCompletions.values());
        }
        
        // Récursion avec le schema des items
        return this.getPropertyValueCompletions(itemsSchema, context);
    }

    private async getRootCompletions(schema: any, context: any): Promise<vscode.CompletionItem[]> {
        // Pour le root, on suggère la structure de base
        return this.getPropertyKeyCompletions(schema, context);
    }
}