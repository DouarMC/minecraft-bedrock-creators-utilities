import * as vscode from 'vscode';
import { analyzeInsertionContext, createQuoteAwareRange } from '../../utils/insertionHelpers';

// Dans createValueCompletions.ts, après les imports
function applySmartValueInsertion(
    item: vscode.CompletionItem,
    value: string,
    needsQuotes: boolean,
    document?: vscode.TextDocument,
    position?: vscode.Position,
    isSnippet = false // 🆕 Nouveau paramètre
): void {
    if (!document || !position) {
        item.insertText = needsQuotes ? `"${value}"` : value;
        return;
    }

    const context = analyzeInsertionContext(document, position);
    
    if (context.isInQuotes && needsQuotes) {
        const replaceRange = createQuoteAwareRange(document, position, context);
        
        if (replaceRange) {
            item.range = replaceRange;
            item.insertText = new vscode.SnippetString(`${value}"`);
        } else {
            item.insertText = isSnippet ? new vscode.SnippetString(value) : value;
        }
    } else {
        if (needsQuotes) {
            item.insertText = new vscode.SnippetString(`"${value}"`);
        } else {
            item.insertText = isSnippet ? new vscode.SnippetString(value) : value;
        }
    }
}

export function createValueCompletions(
    schema: any,
    document?: vscode.TextDocument,
    position?: vscode.Position
): vscode.CompletionItem[] {
    const completionItems: vscode.CompletionItem[] = [];

    // 🎯 FACTORISATION : Fonction helper pour créer les items
    const createValueItem = (
        label: string,
        kind: vscode.CompletionItemKind,
        detail: string,
        documentation: string,
        insertValue: string,
        needsQuotes: boolean,
        isSnippet = false
    ) => {
        const item = new vscode.CompletionItem(label, kind);
        item.detail = detail;
        item.documentation = documentation;
        applySmartValueInsertion(item, insertValue, needsQuotes, document, position, isSnippet);
        return item;
    };

    if (schema.enum) {
        for (const enumValue of schema.enum) {
            const item = createValueItem(
                String(enumValue),
                vscode.CompletionItemKind.Enum,
                'Enum value',
                'One of the allowed values for this property',
                String(enumValue),
                true
            );
            completionItems.push(item);
        }
    } else if (schema.type === 'object') {
        const item = createValueItem(
            '{}',
            vscode.CompletionItemKind.Snippet,
            'Empty object',
            'Create an empty object',
            '{\n\t$0\n}',
            false,
            true
        );
        completionItems.push(item);
    } else if (schema.type === 'string') {
        const item = createValueItem(
            '""',
            vscode.CompletionItemKind.Snippet,
            'Empty string',
            schema.description || 'String value',
            '$0',
            true,
            true
        );
        completionItems.push(item);
    } else if (schema.type === 'array') {
        const item = createValueItem(
            '[]',
            vscode.CompletionItemKind.Snippet,
            'Empty array',
            'Create an empty array',
            '[\n\t$0\n]',
            false,
            true
        );
        completionItems.push(item);
    } else if (schema.type === 'boolean') {
        completionItems.push(
            createValueItem('true', vscode.CompletionItemKind.Keyword, 'Boolean value', '', 'true', false),
            createValueItem('false', vscode.CompletionItemKind.Keyword, 'Boolean value', '', 'false', false)
        );
    } else if (schema.type === 'number' || schema.type === 'integer') {
        const constraints = [];
        if (schema.minimum !== undefined) constraints.push(`min: ${schema.minimum}`);
        if (schema.maximum !== undefined) constraints.push(`max: ${schema.maximum}`);
        
        const item = createValueItem(
            '0',
            vscode.CompletionItemKind.Snippet,
            `${schema.type} value`,
            constraints.length > 0 ? `Constraints: ${constraints.join(', ')}` : '',
            '$0',
            false,
            true
        );
        completionItems.push(item);
    }

    return completionItems;
}