import { JSONPath } from 'jsonc-parser';
import * as vscode from 'vscode';
import { getExistingProperties } from './getExistingProperties';
import { analyzeInsertionContext, createQuoteAwareRange } from '../../utils/insertionHelpers';

function sortPropertiesByPriority(
    properties: Record<string, any>,
    requiredProps: string[],
    existingProperties: string[]
): [string, any][] {
    const allProps = Object.entries(properties);

    // 🎯 FILTRAGE : Exclure les propriétés déjà présentes
    const availableProps = allProps.filter(([name]) => !existingProperties.includes(name));
    
    // Séparer required vs optional
    const required = availableProps.filter(([name]) => requiredProps.includes(name));
    const optional = availableProps.filter(([name]) => !requiredProps.includes(name));
    
    // Required en premier, puis alphabétique
    return [
        ...required.sort(([a], [b]) => a.localeCompare(b)),
        ...optional.sort(([a], [b]) => a.localeCompare(b))
    ];
}

function getDefaultSnippet(propertySchema: any, propertyType: string): string {
    if (propertySchema && propertySchema.default !== undefined) {
        // Pour les strings, ajoute les guillemets si besoin
        if (propertyType === 'string') {
            return `"${propertySchema.default}"`;
        }
        // Pour les objets/arrays, tu pourrais faire mieux plus tard (ex: JSON.stringify)
        return String(propertySchema.default);
    }
    return '$0';
}

function applyInQuotesInsertion(
    item: vscode.CompletionItem,
    propertyName: string,
    propertyType: string,
    document: vscode.TextDocument,
    position: vscode.Position,
    context: { afterCursor: string },
    propertySchema?: any
): void {
    const replaceRange = createQuoteAwareRange(document, position, context);

    if (replaceRange) {
        item.range = replaceRange;

        // Utilise la valeur par défaut si elle existe
        const defaultSnippet = getDefaultSnippet(propertySchema, propertyType);

        if (propertyType === 'object') {
            item.insertText = new vscode.SnippetString(`${propertyName}": ${defaultSnippet === '$0' ? '{\n\t$0\n}' : defaultSnippet}`);
        } else if (propertyType === 'string') {
            item.insertText = new vscode.SnippetString(`${propertyName}": ${defaultSnippet}`);
        } else if (propertyType === 'array') {
            item.insertText = new vscode.SnippetString(`${propertyName}": ${defaultSnippet === '$0' ? '[\n\t$0\n]' : defaultSnippet}`);
        } else {
            item.insertText = new vscode.SnippetString(`${propertyName}": ${defaultSnippet}`);
        }
    }
}

function applyNormalInsertion(
    item: vscode.CompletionItem,
    propertyName: string,
    propertyType: string,
    propertySchema?: any
): void {
    const defaultSnippet = getDefaultSnippet(propertySchema, propertyType);

    if (propertyType === 'object') {
        item.insertText = new vscode.SnippetString(`"${propertyName}": ${defaultSnippet === '$0' ? '{\n\t$0\n}' : defaultSnippet}`);
    } else if (propertyType === 'string') {
        item.insertText = new vscode.SnippetString(`"${propertyName}": ${defaultSnippet}`);
    } else if (propertyType === 'array') {
        item.insertText = new vscode.SnippetString(`"${propertyName}": ${defaultSnippet === '$0' ? '[\n\t$0\n]' : defaultSnippet}`);
    } else {
        item.insertText = new vscode.SnippetString(`"${propertyName}": ${defaultSnippet}`);
    }
}

// Après analyzeInsertionContext et avant createPropertyCompletionItem
function applySmartInsertion(
    item: vscode.CompletionItem,
    propertyName: string,
    propertyType: string,
    document: vscode.TextDocument,
    position: vscode.Position,
    propertySchema?: any
): void {
    const context = analyzeInsertionContext(document, position);

    if (context.isInQuotes) {
        applyInQuotesInsertion(item, propertyName, propertyType, document, position, context, propertySchema);
    } else {
        applyNormalInsertion(item, propertyName, propertyType, propertySchema);
    }
}

// Dans createPropertyCompletions.ts, après analyzeInsertionContext
function createPropertyCompletionItem(
    propertyName: string,
    propertySchema: any,
    isRequired: boolean,
    document: vscode.TextDocument,
    position: vscode.Position
): vscode.CompletionItem {
    const item = new vscode.CompletionItem(propertyName, vscode.CompletionItemKind.Property);
    const propertyType = (propertySchema as any)?.type;
    
    // 🎯 Meilleur détail avec required/optional
    const typeInfo = `${propertyType || 'unknown'}`;
    item.detail = isRequired ? `${typeInfo} (required)` : `${typeInfo} (optional)`;
    item.documentation = (propertySchema as any)?.description || `Property: ${propertyName}`;
    
    // 🎯 Icône et tri différents pour required
    if (isRequired) {
        item.kind = vscode.CompletionItemKind.Field;
        item.sortText = `0_${propertyName}`;
    } else {
        item.kind = vscode.CompletionItemKind.Property;
        item.sortText = `1_${propertyName}`;
    }

    // 🎯 Logique d'insertion intelligente
    applySmartInsertion(item, propertyName, propertyType, document, position, propertySchema);
    
    // 🎯 Re-trigger completion après insertion
    item.command = { 
        command: 'editor.action.triggerSuggest', 
        title: 'Re-trigger completions' 
    };
    
    return item;
}

export function createPropertyCompletions(
    schema: any,
    document: vscode.TextDocument,
    position: vscode.Position,
    targetPath: JSONPath
): vscode.CompletionItem[] {
    // Vérification de base
    if (schema.type !== 'object') return [];

    const hasKeySources = 
        (schema.properties && Object.keys(schema.properties).length > 0) ||
        (schema.propertyNames !== null) ||
        (schema.patternProperties && Object.keys(schema.patternProperties).length > 0);
    
    if (!hasKeySources) return [];

    // 🎯 Récupération et tri des propriétés
    const props = schema.properties ?? {};
    const existingProperties = getExistingProperties(document, targetPath);
    const requiredProps = schema.required || [];
    const sortedProps = sortPropertiesByPriority(props, requiredProps, existingProperties);
    
    // 🎯 Création des items de completion
    const completionItems: vscode.CompletionItem[] = [];
    
    for (const [propertyName, propertySchema] of sortedProps) {
        const isRequired = requiredProps.includes(propertyName);
        completionItems.push(
            createPropertyCompletionItem(propertyName, propertySchema, isRequired, document, position)
        );
    }

    if (schema.propertyNames && schema.additionalProperties !== false) {
        const existing = new Set([
            ...existingProperties,
            ...sortedProps.map(([name]) => name)
        ]);

        // enum
        if (Array.isArray(schema.propertyNames.enum)) {
            for (const enumName of schema.propertyNames.enum) {
                if (!existing.has(enumName)) {
                    completionItems.push(
                        createPropertyCompletionItem(enumName, schema.additionalProperties, false, document, position)
                    );
                }
            }
        }

        // examples
        if (Array.isArray(schema.propertyNames.examples)) {
            for (const exampleName of schema.propertyNames.examples) {
                if (!existing.has(exampleName)) {
                    completionItems.push(
                        createPropertyCompletionItem(exampleName, schema.additionalProperties, false, document, position)
                    );
                }
            }
        }
    }
    
    return completionItems;
}