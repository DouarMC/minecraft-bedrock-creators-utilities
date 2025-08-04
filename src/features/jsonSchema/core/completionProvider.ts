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
            
            // Naviguer dans le schema selon le type
            if (current.type === 'object' && current.properties) {
                current = current.properties[segment];
            } else if (current.type === 'array' && current.items) {
                current = current.items;
            } else if (current.properties) {
                current = current.properties[segment];
            } else {
                return null;
            }
        }
        
        return current;
    }

    private async getPropertyKeyCompletions(schema: any, context: any): Promise<vscode.CompletionItem[]> {
        const completions: vscode.CompletionItem[] = [];
        
        if (!schema || !schema.properties) {
            return completions;
        }
        
        // Ajouter toutes les propriétés disponibles
        for (const [propertyName, propertySchema] of Object.entries(schema.properties)) {
            const completion = new vscode.CompletionItem(
                propertyName,
                vscode.CompletionItemKind.Property
            );
            
            completion.detail = (propertySchema as any).type || 'property';
            completion.documentation = (propertySchema as any).description || `Property: ${propertyName}`;
            completion.insertText = `"${propertyName}": `;
            completion.sortText = propertyName;
            
            completions.push(completion);
        }
        
        return completions;
    }

    private async getPropertyValueCompletions(schema: any, context: any): Promise<vscode.CompletionItem[]> {
        const completions: vscode.CompletionItem[] = [];
        
        if (!schema) {
            return completions;
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
        
        // Récursion avec le schema des items
        return this.getPropertyValueCompletions(schema.items, context);
    }

    private async getRootCompletions(schema: any, context: any): Promise<vscode.CompletionItem[]> {
        // Pour le root, on suggère la structure de base
        return this.getPropertyKeyCompletions(schema, context);
    }
}