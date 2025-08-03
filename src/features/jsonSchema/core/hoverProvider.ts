import * as vscode from 'vscode';
import { AjvCompiler } from './ajvCompiler';
import { SchemaResolver } from './schemaResolver';
import { JsonContextAnalyzer } from './jsonContextAnalyzer';
import { MolangService } from './molangService';

export class JsonSchemaHoverProvider implements vscode.HoverProvider {
    private ajvCompiler: AjvCompiler;
    private schemaResolver: SchemaResolver;
    private jsonContextAnalyzer: JsonContextAnalyzer;

    constructor(
        ajvCompiler: AjvCompiler,
        schemaResolver: SchemaResolver,
        jsonContextAnalyzer: JsonContextAnalyzer
    ) {
        this.ajvCompiler = ajvCompiler;
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
            
            // 2. Résoudre le schema pour ce fichier
            const schema = this.schemaResolver.resolveSchemaForFile(
                document.uri.fsPath,
                document.getText()
            );
            
            if (!schema) {
                return undefined;
            }
            
            // 3. Obtenir le schema à la position actuelle
            const schemaAtPath = this.getSchemaAtPath(schema, context.path);
            if (!schemaAtPath) {
                return undefined;
            }
            
            // 4. Générer le contenu hover
            const hoverContent = this.generateHoverContent(schemaAtPath, context);
            
            if (hoverContent) {
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

    private generateHoverContent(schema: any, context: any): vscode.MarkdownString | undefined {
        if (!schema) {
            return undefined;
        }
        
        const content = new vscode.MarkdownString();
        content.isTrusted = true;
        
        // Titre avec le nom de la propriété
        if (context.propertyName) {
            content.appendMarkdown(`## \`${context.propertyName}\`\n\n`);
        }
        
        // Description
        if (schema.description) {
            content.appendMarkdown(`${schema.description}\n\n`);
        }
        
        // Type et contraintes
        this.addTypeInformation(content, schema);
        
        // Enum values
        if (schema.enum && schema.enum.length > 0) {
            content.appendMarkdown(`**Valeurs possibles:**\n`);
            for (const value of schema.enum) {
                content.appendMarkdown(`- \`${value}\`\n`);
            }
            content.appendMarkdown('\n');
        }
        
        // Exemples
        if (schema.examples && schema.examples.length > 0) {
            content.appendMarkdown(`**Exemples:**\n`);
            for (const example of schema.examples) {
                content.appendMarkdown(`- \`${JSON.stringify(example)}\`\n`);
            }
            content.appendMarkdown('\n');
        }
        
        // Informations spécifiques Molang
        if (schema.type === 'molang') {
            this.addMolangInformation(content);
        }
        
        // Propriétés requises pour les objets
        if (schema.type === 'object' && schema.required && schema.required.length > 0) {
            content.appendMarkdown(`**Propriétés requises:** ${schema.required.map((r: string) => `\`${r}\``).join(', ')}\n\n`);
        }
        
        return content.value ? content : undefined;
    }

    private addTypeInformation(content: vscode.MarkdownString, schema: any): void {
        let typeInfo = '';
        
        if (schema.type) {
            typeInfo = `**Type:** \`${schema.type}\``;
            
            // Contraintes spécifiques par type
            if (schema.type === 'string') {
                const constraints = [];
                if (schema.minLength !== undefined) constraints.push(`min: ${schema.minLength}`);
                if (schema.maxLength !== undefined) constraints.push(`max: ${schema.maxLength}`);
                if (schema.pattern) constraints.push(`pattern: \`${schema.pattern}\``);
                
                if (constraints.length > 0) {
                    typeInfo += ` (${constraints.join(', ')})`;
                }
            } else if (schema.type === 'number' || schema.type === 'integer') {
                const constraints = [];
                if (schema.minimum !== undefined) constraints.push(`min: ${schema.minimum}`);
                if (schema.maximum !== undefined) constraints.push(`max: ${schema.maximum}`);
                if (schema.multipleOf !== undefined) constraints.push(`multiple of: ${schema.multipleOf}`);
                
                if (constraints.length > 0) {
                    typeInfo += ` (${constraints.join(', ')})`;
                }
            } else if (schema.type === 'array') {
                const constraints = [];
                if (schema.minItems !== undefined) constraints.push(`min items: ${schema.minItems}`);
                if (schema.maxItems !== undefined) constraints.push(`max items: ${schema.maxItems}`);
                
                if (constraints.length > 0) {
                    typeInfo += ` (${constraints.join(', ')})`;
                }
            }
        }
        
        if (typeInfo) {
            content.appendMarkdown(`${typeInfo}\n\n`);
        }
    }

    private addMolangInformation(content: vscode.MarkdownString): void {
        content.appendMarkdown(`**Molang Expression**\n\n`);
        content.appendMarkdown(`Accepts boolean, number, or string values with Molang syntax.\n\n`);
        content.appendMarkdown(`**Available functions:**\n`);
        content.appendMarkdown(`- \`math.*\` - Mathematical functions (abs, cos, sin, etc.)\n`);
        content.appendMarkdown(`- \`query.*\` - Entity and world queries\n`);
        content.appendMarkdown(`- \`variable.*\` - Custom variables\n`);
        content.appendMarkdown(`- \`temp.*\` - Temporary variables\n\n`);
        content.appendMarkdown(`💡 Use Code Actions (Ctrl+.) to open the Molang editor for advanced editing.\n\n`);
    }
}