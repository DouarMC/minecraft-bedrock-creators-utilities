import * as vscode from 'vscode';
import { analyzeInsertionContext, createQuoteAwareRange } from '../../utils/insertionHelpers';

interface CreateValueItemParams {
    label: string;
    kind: vscode.CompletionItemKind;
    detail: string;
    documentation: string;
    insertValue: any;
    needsQuotes: boolean;
    isSnippet?: boolean;
    isDefault?: boolean;
}

function applySmartValueInsertion(
    item: vscode.CompletionItem,
    value: any,
    needsQuotes: boolean,
    document?: vscode.TextDocument,
    position?: vscode.Position,
    isSnippet = false
): void {
    const valueStr = typeof value === "string" ? value : JSON.stringify(value);

    if (!document || !position) {
        item.insertText = needsQuotes ? `"${valueStr}"` : valueStr;
        return;
    }
    const context = analyzeInsertionContext(document, position);
    if (context.isInQuotes && needsQuotes) {
        const replaceRange = createQuoteAwareRange(document, position, context);
        if (replaceRange) {
            item.range = replaceRange;
            item.insertText = new vscode.SnippetString(`${valueStr}"`);
        } else {
            item.insertText = isSnippet ? new vscode.SnippetString(valueStr) : valueStr;
        }
    } else {
        if (needsQuotes) {
            item.insertText = new vscode.SnippetString(`"${valueStr}"`);
        } else {
            item.insertText = isSnippet ? new vscode.SnippetString(valueStr) : valueStr;
        }
    }
}

// Helper pour créer un CompletionItem
function createValueItem(params: CreateValueItemParams, document?: vscode.TextDocument, position?: vscode.Position): vscode.CompletionItem {
    const item = new vscode.CompletionItem(params.label, params.kind);
    item.documentation = params.documentation;
    if (params.isDefault === true) {
        item.label = {
            label: params.label,
            description: "Default value"
        };
    }
    applySmartValueInsertion(item, params.insertValue, params.needsQuotes, document, position, params.isSnippet);
    return item;
}

// --- Handlers de complétion ---
function handleDefault(schema: any, seen: Set<string>, items: vscode.CompletionItem[], document?: vscode.TextDocument, position?: vscode.Position) {
    if (schema.default !== undefined) {
        const key = String(schema.default);
        if (!seen.has(key)) {
            seen.add(key);
            items.push(createValueItem({
                insertValue: schema.default,
                kind: vscode.CompletionItemKind.Value,
                label: key,
                documentation: "Default value for this property",
                detail: 'Default value',
                needsQuotes: typeof schema.default === 'string',
                isSnippet: true,
                isDefault: true
            }, document, position));
        }

        console.log("DFDF : ", typeof schema.default);
    }
}

function handleEnum(schema: any, seen: Set<string>, items: vscode.CompletionItem[], document?: vscode.TextDocument, position?: vscode.Position) {
    if (schema.enum) {
        for (const enumValue of schema.enum) {
            const key = String(enumValue);
            if (!seen.has(key)) {
                seen.add(key);
                items.push(createValueItem({
                    insertValue: enumValue,
                    kind: vscode.CompletionItemKind.Enum,
                    label: key,
                    documentation: "One of the allowed values for this property",
                    detail: 'Enum value',
                    needsQuotes: typeof enumValue === 'string',
                    isSnippet: true
                }, document, position));
            }
        }
    }
}

function handleTypeSnippets(schema: any, seen: Set<string>, items: vscode.CompletionItem[], document?: vscode.TextDocument, position?: vscode.Position) {
    let valueItemParams: CreateValueItemParams | undefined;
    switch (schema.type) {
        case "object":
            valueItemParams = {
                insertValue: '{\n\t$0\n}',
                kind: vscode.CompletionItemKind.Snippet,
                label: '{}',
                documentation: 'Create an empty object',
                detail: 'Empty object',
                needsQuotes: false,
                isSnippet: true
            };
            break;
        case "string":
            valueItemParams = {
                insertValue: '"$0"',
                kind: vscode.CompletionItemKind.Snippet,
                label: '""',
                documentation: 'Create an empty string',
                detail: 'Empty string',
                needsQuotes: false,
                isSnippet: true
            };
            break;
        case "array":
            valueItemParams = {
                insertValue: '[$0]',
                kind: vscode.CompletionItemKind.Snippet,
                label: '[]',
                documentation: 'Create an empty array',
                detail: 'Empty array',
                needsQuotes: false,
                isSnippet: true
            };
            break;
        case "boolean":
            for (const boolValue of [true, false]) {
                const key = String(boolValue);
                if (!seen.has(key)) {
                    seen.add(key);
                    items.push(createValueItem({
                        insertValue: boolValue,
                        kind: vscode.CompletionItemKind.Value,
                        label: key,
                        documentation: 'Boolean value',
                        detail: 'Boolean value',
                        needsQuotes: false,
                        isSnippet: false
                    }, document, position));
                }
            }
            break;
    }
    if (valueItemParams && !seen.has(valueItemParams.label)) {
        seen.add(valueItemParams.label);
        items.push(createValueItem(valueItemParams, document, position));
    }
}

// --- Fonction principale ---
export function createValueCompletions(schema: any, document: vscode.TextDocument, position: vscode.Position): vscode.CompletionItem[] {
    const completionItems: vscode.CompletionItem[] = [];
    const seen = new Set<string>();

    handleDefault(schema, seen, completionItems, document, position);
    handleEnum(schema, seen, completionItems, document, position);

    // N’ajoute les snippets génériques QUE si enum n’est pas défini
    if (!schema.enum) {
        handleTypeSnippets(schema, seen, completionItems, document, position);
    }

    // Plus tard, tu pourras ajouter handleExamples, handleXDynamicExamples, etc.

    return completionItems;
}