import * as vscode from 'vscode';
import * as JsonParser from 'jsonc-parser';
import { MinecraftJsonSchema } from '../model';
import { CompletionsCollector } from './collector';
import { fromMarkup, getInsertTextForValue, getSuggestionKind } from './utils/textHelpers';
import { getDynamicExampleSourceValues } from './dynamicSources';
import { collectTypes, evaluateSeparatorAfter, findItemAtOffset } from '../utils/completionHelpers';
import { getMatchingSchemas } from '../utils/schemaMatching';

export async function getValueCompletions(schema: MinecraftJsonSchema, node: JsonParser.Node | undefined, offset: number, document: vscode.TextDocument, collector: CompletionsCollector, types: { [type: string]: boolean }, rootNode: JsonParser.Node | undefined): Promise<void> {
    let offsetForSeparator = offset;
    let parentKey: string | undefined = undefined;
    let valueNode: JsonParser.Node | undefined = undefined;

    if (node && (node.type === 'string' || node.type === 'number' || node.type === 'boolean' || node.type === 'null')) {
        offsetForSeparator = node.offset + node.length;
        valueNode = node;
        node = node.parent;
    }

    if (!node) {
        await addSchemaValueCompletions(schema, '', collector, types, document);
        return;
    }

    if ((node.type === "property") && offset > (node.colonOffset || 0)) {
        const valueNode = node.children![1];
        if (valueNode && offset > (valueNode.offset + valueNode.length)) {
            return; // we are past the value node
        }
        parentKey = node.children![0].value;
        node = node.parent;
    }

    if (node && (parentKey !== undefined || node.type === 'array')) {
        const separatorAfter = evaluateSeparatorAfter(document, offsetForSeparator);

        const matchingSchemas = getMatchingSchemas(schema, document, rootNode, node.offset, valueNode);
        for (const s of matchingSchemas) {
            if (s.node === node && !s.inverted && s.schema) {
                if (node.type === 'array' && s.schema.items) {
                    let c = collector;
                    if (Array.isArray(s.schema.items)) {
                        const index = findItemAtOffset(node, document, offset);
                        if (index < s.schema.items.length) {
                            await addSchemaValueCompletions(s.schema.items[index], separatorAfter, c, types, document);
                        }
                    } else {
                        await addSchemaValueCompletions(s.schema.items, separatorAfter, c, types, document);
                    }
                }
                if (parentKey !== undefined) {
                    let propertyMatched = false;
                    if (s.schema.properties) {
                        const propertySchema = s.schema.properties[parentKey];
                        if (propertySchema) {
                            propertyMatched = true;
                            await addSchemaValueCompletions(propertySchema, separatorAfter, collector, types, document);
                        }
                    }
                    if (s.schema.additionalProperties && !propertyMatched) {
                        const propertySchema = s.schema.additionalProperties;
                        await addSchemaValueCompletions(propertySchema, separatorAfter, collector, types, document);
                    }
                }
            }
        }
        if (types["boolean"]) {
            addBooleanValueCompletion(true, separatorAfter, collector);
            addBooleanValueCompletion(false, separatorAfter, collector);
        }
        if (types["null"]) {
            collector.add({
                kind: getSuggestionKind("null"),
                label: "null",
                insertText: "null" + separatorAfter,
                documentation: ""
            });
        }
    }
}

export async function addSchemaValueCompletions(
    schema: MinecraftJsonSchema,
    separatorAfter: string,
    collector: CompletionsCollector,
    types: { [type: string]: boolean},
    document: vscode.TextDocument
): Promise<void> {
    if (typeof schema === "object") {
        addEnumValueCompletions(schema, separatorAfter, collector);
        await addDefaultValueCompletions(schema, separatorAfter, collector, document);
        collectTypes(schema, types);
        if (Array.isArray(schema.oneOf)) {
            for (const subSchema of schema.oneOf) {
                await addSchemaValueCompletions(subSchema, separatorAfter, collector, types, document);
            }
        }
    }
}

export function getLabelForValue(value: any): string {
    return JSON.stringify(value);
}

export function addEnumValueCompletions(schema: MinecraftJsonSchema, separatorAfter: string, collector: CompletionsCollector): void {
    if (schema.const !== undefined) {
        collector.add({
            kind: getSuggestionKind(schema.type),
            label: getLabelForValue(schema.const),
            insertText: getInsertTextForValue(schema.const, separatorAfter),
            documentation: fromMarkup(schema.description) || '',
        });
    }

    if (Array.isArray(schema.enum)) {
        for (let i = 0, length = schema.enum.length; i < length; i++) {
            const enm = schema.enum[i];
            let documentation = fromMarkup(schema.description) || '';
            collector.add({
                kind: getSuggestionKind(schema.type),
                label: getLabelForValue(enm),
                insertText: getInsertTextForValue(enm, separatorAfter),
                documentation: documentation
            });
        }
    }
}

export async function addDefaultValueCompletions(
    schema: MinecraftJsonSchema,
    separatorAfter: string,
    collector: CompletionsCollector,
    document?: vscode.TextDocument,
    arrayDepth = 0
): Promise<void> {
    let hasProposals = false;
    if (schema.default !== undefined) {
        let type = schema.type;
        let value = schema.default;
        for (let i = arrayDepth; i > 0; i--) {
            value = [value];
            type = 'array';
        }
        const completionItem: vscode.CompletionItem = {
            kind: getSuggestionKind(type),
            label: getLabelForValue(value),
            insertText: getInsertTextForValue(value, separatorAfter),
            detail: "Default value"
        };
        collector.add(completionItem);
        hasProposals = true;
    }

    if (Array.isArray(schema.examples)) {
        schema.examples.forEach((example) => {
            let type = schema.type;
            let value = example;
            for (let i = arrayDepth; i > 0; i--) {
                value = [value];
                type = 'array';
            }
            collector.add({
                kind: getSuggestionKind(type),
                label: getLabelForValue(value),
                insertText: getInsertTextForValue(value, separatorAfter)
            });
            hasProposals = true;
        });
    }

    if (schema["x-dynamic-examples-source"] !== undefined && document) {
        const dynamicExamples = await getDynamicExampleSourceValues(
            schema["x-dynamic-examples-source"],
            document,
            schema
        );
        dynamicExamples.forEach((example) => {
            let type = schema.type;
            let value = example as any;
            for (let i = arrayDepth; i > 0; i--) {
                value = [value];
                type = 'array';
            }
            collector.add({
                kind: getSuggestionKind(type),
                label: getLabelForValue(value),
                insertText: getInsertTextForValue(value, separatorAfter)
            });
            hasProposals = true;
        });
    }

    if (!hasProposals && typeof schema.items === "object" && !Array.isArray(schema.items) && arrayDepth < 5 /* beware of recursion */) {
        await addDefaultValueCompletions(schema.items, separatorAfter, collector, document, arrayDepth + 1);
    }
}

export function addBooleanValueCompletion(value: boolean, separatorAfter: string, collector: CompletionsCollector): void {
    collector.add({
        kind: getSuggestionKind("boolean"),
        label: value ? "true" : "false",
        insertText: getInsertTextForValue(value, separatorAfter),
        documentation: ""
    });
}