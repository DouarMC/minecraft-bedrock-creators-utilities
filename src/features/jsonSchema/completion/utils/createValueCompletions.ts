import * as vscode from 'vscode';
import { analyzeInsertionContext, createQuoteAwareRange } from '../../utils/insertionHelpers';
import { resolveOneOfBranch } from '../../utils/resolveOneOfBranch';
import { getNodeValueAtPosition } from '../../utils/getNodeValueAtPosition';
import { isTypeValid } from '../../diagnostics/helpers';
import { getDynamicExampleSourceValues } from './getDynamicExampleSourceValues';
import { values } from 'lodash';

interface CreateValueItemParams {
    label: string;
    kind: vscode.CompletionItemKind;
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
function createValueItem(params: CreateValueItemParams, document: vscode.TextDocument, position: vscode.Position): vscode.CompletionItem {
    const item = new vscode.CompletionItem(params.label, params.kind);
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
function handleDefault(schema: any, seen: Set<string>, items: vscode.CompletionItem[], document: vscode.TextDocument, position: vscode.Position) {
    if (schema.default !== undefined) {
        const key = String(schema.default);
        if (!seen.has(key)) {
            seen.add(key);
            items.push(createValueItem({
                insertValue: schema.default,
                kind: vscode.CompletionItemKind.Value,
                label: key,
                needsQuotes: typeof schema.default === 'string',
                isSnippet: true,
                isDefault: true
            }, document, position));
        }
    }
}

function handleEnum(schema: any, seen: Set<string>, items: vscode.CompletionItem[], document: vscode.TextDocument, position: vscode.Position) {
    if (schema.enum) {
        for (const enumValue of schema.enum) {
            const key = String(enumValue);
            if (!seen.has(key)) {
                seen.add(key);
                items.push(createValueItem({
                    insertValue: enumValue,
                    kind: vscode.CompletionItemKind.Enum,
                    label: key,
                    needsQuotes: typeof enumValue === 'string',
                    isSnippet: true
                }, document, position));
            }
        }
    }
}

function handleTypeSnippets(schema: any, seen: Set<string>, items: vscode.CompletionItem[], document: vscode.TextDocument, position: vscode.Position) {
    let valueItemParams: CreateValueItemParams | undefined;
    switch (schema.type) {
        case "object":
            valueItemParams = {
                insertValue: '{\n\t$0\n}',
                kind: vscode.CompletionItemKind.Snippet,
                label: '{}',
                needsQuotes: false,
                isSnippet: true
            };
            break;
        case "string":
            valueItemParams = {
                insertValue: '"$0"',
                kind: vscode.CompletionItemKind.Snippet,
                label: '""',
                needsQuotes: false,
                isSnippet: true
            };
            break;
        case "array":
            valueItemParams = {
                insertValue: '[$0]',
                kind: vscode.CompletionItemKind.Snippet,
                label: '[]',
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

async function handleOneOf(schema: any, seen: Set<string>, items: vscode.CompletionItem[], document: vscode.TextDocument, position: vscode.Position) {
    if (schema.oneOf && Array.isArray(schema.oneOf)) {
        for (const subSchema of schema.oneOf) {
            items.push(...await createValueCompletions(subSchema, document, position, seen));
        }
    }
}

async function handleDynamicExamples(schema: any, seen: Set<string>, items: vscode.CompletionItem[], document: vscode.TextDocument, position: vscode.Position) {
    if (schema["x-dynamic-examples-source"]) {
        const dynamicValues = await getDynamicExampleSourceValues(schema["x-dynamic-examples-source"]);
        for (const value of dynamicValues) {
            const key = String(value);
            if (!seen.has(key)) {
                seen.add(key);
                items.push(createValueItem({
                    insertValue: value,
                    kind: vscode.CompletionItemKind.Value,
                    label: key,
                    needsQuotes: typeof value === 'string',
                    isSnippet: true
                }, document, position));
            }
        }

        console.warn(`Dynamic examples source "${schema["x-dynamic-examples-source"]}" is not yet implemented.`);
    } else {
        console.log("NOOOOOO OUINNN ");
    }
}

// --- Fonction principale ---
export async function createValueCompletions(schema: any, document: vscode.TextDocument, position: vscode.Position, seen?: Set<string>): Promise<vscode.CompletionItem[]> {
    const completionItems: vscode.CompletionItem[] = [];
    seen = seen ?? new Set<string>();

    handleDefault(schema, seen, completionItems, document, position);
    await handleOneOf(schema, seen, completionItems, document, position);
    handleEnum(schema, seen, completionItems, document, position);
    await handleDynamicExamples(schema, seen, completionItems, document, position);

    // N’ajoute les snippets génériques QUE si enum n’est pas défini
    if (!schema.enum) {
        handleTypeSnippets(schema, seen, completionItems, document, position);
    }

    return completionItems;
}