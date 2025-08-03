import * as vscode from 'vscode';
import { AjvCompiler } from './ajvCompiler';
import { SchemaResolver } from './schemaResolver';
import { JsonContextAnalyzer } from './jsonContextAnalyzer';
import { DynamicExamplesProvider } from './dynamicExamplesProvider';
import { MolangService } from './molangService';

export class JsonSchemaCompletionProvider implements vscode.CompletionItemProvider {
    private ajvCompiler: AjvCompiler;
    private schemaResolver: SchemaResolver;
    private jsonContextAnalyzer: JsonContextAnalyzer;
    private dynamicExamplesProvider: DynamicExamplesProvider;

    constructor(
        ajvCompiler: AjvCompiler,
        schemaResolver: SchemaResolver,
        jsonContextAnalyzer: JsonContextAnalyzer,
        dynamicExamplesProvider: DynamicExamplesProvider
    ) {
        this.ajvCompiler = ajvCompiler;
        this.schemaResolver = schemaResolver;
        this.jsonContextAnalyzer = jsonContextAnalyzer;
        this.dynamicExamplesProvider = dynamicExamplesProvider;
    }

    public async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
    ): Promise<vscode.CompletionItem[]> {
        try {
            // 1. Analyser le contexte JSON
            const offset = document.offsetAt(position);
            const context = this.jsonContextAnalyzer.analyzePosition(document.getText(), offset);
            
            // 2. Résoudre le schema pour ce fichier
            const schema = this.schemaResolver.resolveSchemaForFile(
                document.uri.fsPath,
                document.getText()
            );
            
            if (!schema) {
                return [];
            }
            
            // 3. Compiler le schema
            const schemaId = document.uri.fsPath;
            this.ajvCompiler.compileSchema(schema, schemaId);
            
            // 4. Générer les suggestions selon le contexte
            return await this.generateCompletions(context, schema, document, position);
            
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
            if (current.properties && current.properties[segment]) {
                current = current.properties[segment];
            } else if (current.items) {
                current = current.items;
            } else {
                return null;
            }
        }
        
        return current;
    }

    private async getPropertyKeyCompletions(schema: any, context: any): Promise<vscode.CompletionItem[]> {
        const completions: vscode.CompletionItem[] = [];
        
        if (!schema.properties) {
            return completions;
        }
        
        // Générer des suggestions pour chaque propriété du schema
        for (const [propertyName, propertySchema] of Object.entries(schema.properties)) {
            const item = new vscode.CompletionItem(propertyName, vscode.CompletionItemKind.Property);
            
            // Description de la propriété
            if ((propertySchema as any).description) {
                item.documentation = new vscode.MarkdownString((propertySchema as any).description);
            }
            
            // Détail du type
            if ((propertySchema as any).type) {
                item.detail = `Type: ${(propertySchema as any).type}`;
            }
            
            // Marquer comme requis si nécessaire
            if (schema.required && schema.required.includes(propertyName)) {
                item.detail = (item.detail || '') + ' (required)';
            }
            
            // Snippet avec guillemets
            item.insertText = new vscode.SnippetString(`"${propertyName}": $0`);
            
            completions.push(item);
        }
        
        return completions;
    }

    private async getPropertyValueCompletions(schema: any, context: any): Promise<vscode.CompletionItem[]> {
        const completions: vscode.CompletionItem[] = [];
        
        // Enum values
        if (schema.enum) {
            for (const enumValue of schema.enum) {
                const item = new vscode.CompletionItem(String(enumValue), vscode.CompletionItemKind.EnumMember);
                item.insertText = typeof enumValue === 'string' ? `"${enumValue}"` : String(enumValue);
                completions.push(item);
            }
        }
        
        // Dynamic examples from x-dynamic-example-source
        if (schema['x-dynamic-example-source']) {
            try {
                const examples = await this.dynamicExamplesProvider.getExamples(schema['x-dynamic-example-source']);
                for (const example of examples) {
                    const item = new vscode.CompletionItem(String(example), vscode.CompletionItemKind.Value);
                    item.insertText = `"${example}"`;
                    item.detail = 'Dynamic example';
                    completions.push(item);
                }
            } catch (error) {
                console.warn('Erreur lors de la récupération des exemples dynamiques:', error);
            }
        }
        
        // Molang type
        if (schema.type === 'molang') {
            completions.push(...MolangService.getMolangCompletions());
        }
        
        // Basic type suggestions
        if (schema.type === 'boolean') {
            completions.push(
                new vscode.CompletionItem('true', vscode.CompletionItemKind.Constant),
                new vscode.CompletionItem('false', vscode.CompletionItemKind.Constant)
            );
        }
        
        return completions;
    }

    private async getArrayItemCompletions(schema: any, context: any): Promise<vscode.CompletionItem[]> {
        // Pour les arrays, utiliser le schema des items
        if (schema.items) {
            return await this.getPropertyValueCompletions(schema.items, context);
        }
        return [];
    }

    private async getRootCompletions(schema: any, context: any): Promise<vscode.CompletionItem[]> {
        // Pour la racine, suggérer les propriétés principales
        return await this.getPropertyKeyCompletions(schema, context);
    }
}