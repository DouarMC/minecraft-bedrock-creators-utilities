import * as vscode from 'vscode';
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from '../../../types/minecraftJsonSchema';
import { validate } from '../diagnostics/doValidation';
import { SchemaCollector } from '../diagnostics/collector';
import { ValidationResult } from '../diagnostics/validate';
import { getNodeFromOffset, isInComment, getCurrentWord } from '../utils/ast';
import { getInsertTextForValue, getFilterTextForValue, fromMarkup, endsWith, getInsertTextForGuessedValue, getSuggestionKind } from './utils/textHelpers';
import { CompletionsCollector } from './collector';
import { getDynamicExampleSourceValues } from './utils/getDynamicExampleSourceValues';

export function evaluateSeparatorAfter(document: vscode.TextDocument, offset: number): string {
    const scanner = JsonParser.createScanner(document.getText(), true);
    scanner.setPosition(offset);
    const token = scanner.scan();
    switch (token) {
        case JsonParser.SyntaxKind.CommaToken:
        case JsonParser.SyntaxKind.CloseBraceToken:
        case JsonParser.SyntaxKind.CloseBracketToken:
        case JsonParser.SyntaxKind.EOF:
            return '';
        default:
            return ', ';
    }
}

export async function doCompletion(document: vscode.TextDocument, position: vscode.Position, schema: MinecraftJsonSchema): Promise<vscode.CompletionList> {
    const result: vscode.CompletionList = new vscode.CompletionList();
    result.items = [];
    result.isIncomplete = false;

    const text = document.getText();
    const offset = document.offsetAt(position);
    const root = JsonParser.parseTree(document.getText());
    let node = getNodeFromOffset(root, offset, true);

    if (isInComment(document, node ? node.offset : 0, offset)) {
		return result;
	}
    if (node && (offset === node.offset + node.length) && offset > 0) {
        const ch = text[offset - 1];
        if (node.type === "object" && ch === "}" || node.type === "array" && ch === "]") {
            // after } or ]
            node = node.parent;
        }
    }

    const currentWord = getCurrentWord(document, offset);
    let overwriteRange: vscode.Range;

    if (node && (node.type === 'string' || node.type === 'number' || node.type === 'boolean' || node.type === 'null')) {
        overwriteRange = new vscode.Range(
            document.positionAt(node.offset),
            document.positionAt(node.offset + node.length)
        );
    } else {
        let overwriteStart = offset - currentWord.length;
        if (overwriteStart > 0 && text[overwriteStart - 1] === '"') {
            overwriteStart--;
        }
        overwriteRange = new vscode.Range(
            document.positionAt(overwriteStart),
            position
        );
    }

    const proposed = new Map<string, vscode.CompletionItem>();
    const collector: CompletionsCollector = {
        add: (suggestion: vscode.CompletionItem) => {
            let label = suggestion.label as string;
            const existing = proposed.get(label);
            if (existing === undefined) {
                label = label.replace(/[\n]/g, '↵');
                if (label.length > 60) {
                    const shortendedLabel = label.substr(0, 57).trim() + '...';
                    if (!proposed.has(shortendedLabel)) {
                        label = shortendedLabel;
                    }
                }
                suggestion.insertText = suggestion.insertText;
                suggestion.range = overwriteRange;
                suggestion.label = label;
                proposed.set(label, suggestion);
                result.items.push(suggestion);
            } else {
                if (!existing.documentation) {
                    existing.documentation = suggestion.documentation;
                }
                if (!existing.detail) {
                    existing.detail = suggestion.detail;
                }
            }
        },
        setAsIncomplete: () => {
            result.isIncomplete = true;
        },
        error: (message: string) => {
            console.error(message);
        },
        getNumberOfProposals: () => {
            return result.items.length;
        }
    };

    let addValue = true;
    let currentKey = '';
    let currentProperty: JsonParser.Node | undefined = undefined;

    if (node && node.type === "string") {
        const parent = node.parent;
        if (parent && parent.type === 'property' && parent.children && parent.children[0] === node) {
            addValue = !(parent.children.length > 1);
            currentProperty = parent;
            // La clé est la valeur du noeud string sans les guillemets
            currentKey = text.substring(node.offset + 1, node.length - 2);
            node = parent.parent;
        }
    }

    // proposals for properties
    if (node && node.type === 'object') {

        // don't suggest keys when the cursor is just before the opening curly brace
        if (node.offset === offset) {
            return result;
        }
        // don't suggest properties that are already present
        const properties = node.children ?? [];
        properties.forEach(property => {
            if (currentProperty === undefined || currentProperty !== property) {
                proposed.set(property.children![0].value, new vscode.CompletionItem("__"));
            }
        });
        let separatorAfter = '';
        if (addValue) {
            separatorAfter = evaluateSeparatorAfter(document, document.offsetAt(overwriteRange.end));
        }

        await getPropertyCompletions(schema, node, addValue, separatorAfter, collector, root, document);
    }

    // proposals for values
    const types: { [type: string]: boolean } = {};
    await getValueCompletions(schema, node, offset, document, collector, types, root);

    return result;
}

export interface IApplicableSchema {
	node: JsonParser.Node;
	inverted?: boolean;
	schema: MinecraftJsonSchema;
}

export function getMatchingSchemas(schema: MinecraftJsonSchema, document: vscode.TextDocument, rootNode?: JsonParser.Node, focusOffset: number = -1, exclude?: JsonParser.Node): IApplicableSchema[] {
    if (rootNode) {
        const matchingSchemas = new SchemaCollector(focusOffset, exclude);
        validate(rootNode, schema, new ValidationResult(), matchingSchemas, document, schema); // <-- AJOUTÉ schema en tant que racine
        return matchingSchemas.schemas;
    }
    return [];
}

export async function getPropertyCompletions(schema: MinecraftJsonSchema, node: JsonParser.Node, addValue: boolean, separatorAfter: string, collector: CompletionsCollector, rootNode: JsonParser.Node | undefined, document: vscode.TextDocument): Promise<void> {
    const matchingSchemas = getMatchingSchemas(schema, document, rootNode, node.offset);

    for (const s of matchingSchemas) {
        if (s.node === node && !s.inverted) {
            const schemaProperties = s.schema.properties;
            if (schemaProperties !== undefined) {
                Object.keys(schemaProperties).forEach((key: string) => {
                    const propertySchema = schemaProperties[key];
                    if (typeof propertySchema === "object") {
                        const proposal: vscode.CompletionItem = {
                            kind: vscode.CompletionItemKind.Property,
                            label: key,
                            insertText: getInsertTextForProperty(key, propertySchema, addValue, separatorAfter),
                            filterText: getFilterTextForValue(key),
                            documentation: fromMarkup(propertySchema.description) || ''
                        };
                        if (proposal.insertText && endsWith(proposal.insertText, `$1${separatorAfter}`)) {
                            proposal.command = {
                                title: "Suggest",
                                command: "editor.action.triggerSuggest"
                            };
                        }
                        collector.add(proposal);
                    }
                });
            }

            const schemaPropertyNames = s.schema.propertyNames;
            if (typeof schemaPropertyNames === "object") {
                const propertyNameCompletionItem = (name: string, documentation: string | vscode.MarkdownString | undefined, detail: string | undefined, sortText: string | undefined) => {
                    const proposal: vscode.CompletionItem = {
                        kind: vscode.CompletionItemKind.Property,
                        label: name,
                        insertText: getInsertTextForProperty(name, schemaPropertyNames, addValue, separatorAfter),
                        filterText: getFilterTextForValue(name),
                        documentation: documentation || fromMarkup(schemaPropertyNames.description) || '',
                        sortText: sortText,
                        detail: detail
                    };
                    if (proposal.insertText && endsWith(proposal.insertText, `$1${separatorAfter}`)) {
                        proposal.command = {
                            title: "Suggest",
                            command: "editor.action.triggerSuggest"
                        };
                    }
                    collector.add(proposal);
                };

                if (schemaPropertyNames.enum !== undefined) {
                    for (let i = 0; i < schemaPropertyNames.enum.length; i++) {
                        let enumDescription = undefined;
                        propertyNameCompletionItem(schemaPropertyNames.enum[i], enumDescription, undefined, undefined);
                    }
                }

                if (schemaPropertyNames.const !== undefined) {
                    propertyNameCompletionItem(schemaPropertyNames.const, undefined, undefined, undefined);
                }

                if (schemaPropertyNames["x-dynamic-examples-source"] !== undefined) {
                    const dynamicExamples = await getDynamicExampleSourceValues(schemaPropertyNames["x-dynamic-examples-source"]);
                    dynamicExamples.forEach((example) => {
                        propertyNameCompletionItem(example, undefined, undefined, undefined);
                    });
                }
            }
        }
    }
}

export function getInsertTextForProperty(key: string, propertySchema: MinecraftJsonSchema | undefined, addValue: boolean, separatorAfter: string): vscode.SnippetString {
    const propertyText = getInsertTextForValue(key, '');
    if (!addValue) {
        return new vscode.SnippetString(propertyText);
    }
    const resultText = propertyText + ': ';

    let value;
    let nValueProposals = 0;
    if (propertySchema !== undefined) {
        if (propertySchema.enum !== undefined) {
            if (!value && propertySchema.enum.length === 1) {
                value = getInsertTextForGuessedValue(propertySchema.enum[0], '');
            }
            nValueProposals = propertySchema.enum.length;
        }

        if (propertySchema.const !== undefined) {
            if (!value) {
                value = getInsertTextForGuessedValue(propertySchema.const, '');
            }
            nValueProposals++;
        }

        if (propertySchema.default !== undefined) {
            if (!value) {
                value = getInsertTextForGuessedValue(propertySchema.default, '');
            }
            nValueProposals++;
        }

        if (Array.isArray(propertySchema.examples) && propertySchema.examples.length) {
            if (!value) {
                value = getInsertTextForGuessedValue(propertySchema.examples[0], '');
            }
            nValueProposals += propertySchema.examples.length;
        }

        if (nValueProposals === 0) {
            let type = Array.isArray(propertySchema.type) ? propertySchema.type[0] : propertySchema.type;
            if (!type) {
                if (propertySchema.properties) {
                    type = 'object';
                } else if (propertySchema.items) {
                    type = 'array';
                }
            }
            switch (type) {
                case 'boolean':
                    value = '$1';
                    break;
                case 'string':
                    value = '"$1"';
                    break;
                case 'object':
                    value = '{$1}';
                    break;
                case 'array':
                    value = '[$1]';
                    break;
                case 'number':
                case 'integer':
                    value = '${1:0}';
                    break;
                case 'null':
                    value = '${1:null}';
                    break;
                default:
                    return new vscode.SnippetString(propertyText);
            }
        }
    }
    if (!value || nValueProposals > 1) {
        value = '$1';
    }
    return new vscode.SnippetString(resultText + value + separatorAfter);
}

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
        await addSchemaValueCompletions(schema, '', collector, types);
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
        console.log("Matching schemas found:", matchingSchemas.length);
        for (const s of matchingSchemas) {
            if (s.node === node && !s.inverted && s.schema) {
                console.log("11111");
                if (node.type === 'array' && s.schema.items) {
                    let c = collector;
                    if (Array.isArray(s.schema.items)) {
                        const index = findItemAtOffset(node, document, offset);
                        if (index < s.schema.items.length) {
                            await addSchemaValueCompletions(s.schema.items[index], separatorAfter, c, types);
                        }
                    } else {
                        await addSchemaValueCompletions(s.schema.items, separatorAfter, c, types);
                    }
                }
                if (parentKey !== undefined) {
                    let propertyMatched = false;
                    if (s.schema.properties) {
                        const propertySchema = s.schema.properties[parentKey];
                        if (propertySchema) {
                            propertyMatched = true;
                            await addSchemaValueCompletions(propertySchema, separatorAfter, collector, types);
                        }
                    }
                    if (s.schema.additionalProperties && !propertyMatched) {
                        const propertySchema = s.schema.additionalProperties;
                        await addSchemaValueCompletions(propertySchema, separatorAfter, collector, types);
                    }
                }
            }
        }
        if (types["boolean"]) {
            console.log("22222");
            addBooleanValueCompletion(true, separatorAfter, collector);
            addBooleanValueCompletion(false, separatorAfter, collector);
        }
        if (types["null"]) {
            console.log("3333");
            collector.add({
                kind: getSuggestionKind("null"),
                label: "null",
                insertText: "null" + separatorAfter,
                documentation: ""
            });
        }
    }
}

export async function addSchemaValueCompletions(schema: MinecraftJsonSchema, separatorAfter: string, collector: CompletionsCollector, types: { [type: string]: boolean}): Promise<void> {
    if (typeof schema === "object") {
        addEnumValueCompletions(schema, separatorAfter, collector);
        await addDefaultValueCompletions(schema, separatorAfter, collector);
        collectTypes(schema, types);
        if (Array.isArray(schema.oneOf)) {
            for (const subSchema of schema.oneOf) {
                await addSchemaValueCompletions(subSchema, separatorAfter, collector, types);
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

export async function addDefaultValueCompletions(schema: MinecraftJsonSchema, separatorAfter: string, collector: CompletionsCollector, arrayDepth = 0): Promise<void> {
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

    if (schema["x-dynamic-examples-source"] !== undefined) {
        const dynamicExamples = await getDynamicExampleSourceValues(schema["x-dynamic-examples-source"]);
        dynamicExamples.forEach((example) => {
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

    if (!hasProposals && typeof schema.items === "object" && !Array.isArray(schema.items) && arrayDepth < 5 /* beware of recursion */) {
        await addDefaultValueCompletions(schema.items, separatorAfter, collector, arrayDepth + 1);
    }
}

function collectTypes(schema: MinecraftJsonSchema, types: {[type: string]: boolean}) {
    if (Array.isArray(schema.enum) || schema.const !== undefined) {
        return;
    }
    const type = schema.type;
    if (Array.isArray(type)) {
        type.forEach(t => types[t] = true);
    } else if (type) {
        types[type] = true;
    }
}

export function findItemAtOffset(node: JsonParser.Node, document: vscode.TextDocument, offset: number) {
    const scanner = JsonParser.createScanner(document.getText(), true);
    const children = node.children!;
    for (let i = children.length - 1; i >= 0; i--) {
        const child = children[i];
        if (offset > child.offset + child.length) {
            scanner.setPosition(child.offset + child.length);
            const token = scanner.scan();
            if (token === JsonParser.SyntaxKind.CommaToken && offset >= scanner.getTokenOffset() + scanner.getTokenLength()) {
                return i + 1; // next item
            }
            return i; // current item
        } else if (offset >= child.offset) {
            return i; // current item
        }
    }
    return 0; // first item
}

export function addBooleanValueCompletion(value: boolean, separatorAfter: string, collector: CompletionsCollector): void {
    collector.add({
        kind: getSuggestionKind("boolean"),
        label: value ? "true" : "false",
        insertText: getInsertTextForValue(value, separatorAfter),
        documentation: ""
    });
}