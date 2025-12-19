import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema, MinecraftJsonSchemaType } from "../../../common/types/MinecraftJsonSchema";
import { SchemaUtils } from "./SchemaUtils";
import { CompletionsCollector } from "./CompletionsCollector";
import { DynamicSourceHandlers } from "./DynamicSourceHandlers";

export class SchemaCompletion {
    public static async doCompletion(document: vscode.TextDocument, position: vscode.Position, schema: MinecraftJsonSchema): Promise<vscode.CompletionList | null> {
        const result: vscode.CompletionList = new vscode.CompletionList();
        result.items = [];
        result.isIncomplete = false;

        const text = document.getText();
        const offset = document.offsetAt(position);
        const root = JsonParser.parseTree(document.getText());
        let node = SchemaUtils.getNodeFromOffset(root, offset, true);

        if (SchemaUtils.isInComment(document, node ? node.offset : 0, offset)) {
            return result;
        }
        if (node && (offset === node.offset + node.length) && offset > 0) {
            const ch = text[offset - 1];
            if (node.type === "object" && ch === "}" || node.type === "array" && ch === "]") {
                // after } or ]
                node = node.parent;
            }
        }

        const currentWord = SchemaUtils.getCurrentWord(document, offset);
        const overwriteRange = SchemaUtils.getOverwriteRange(document, node, position, currentWord);

        const proposed = new Map<string, vscode.CompletionItem>();
        const collector: CompletionsCollector = {
            add: (suggestion: vscode.CompletionItem) => {
                let label = suggestion.label as string;
                const existing = proposed.get(label);
                if (existing === undefined) {
                    label = label.replace(/[\n]/g, '↵');
                    if (label.length > 60) {
                        const shortendedLabel = label.substr(0, 57).trim() + '...';
                        if (! proposed.has(shortendedLabel)) {
                            label = shortendedLabel;
                        }
                    }
                    suggestion.insertText = suggestion.insertText;
                    suggestion.range = overwriteRange;
                    suggestion.label = label;
                    proposed.set(label, suggestion);
                    result.items.push(suggestion);
                } else {
                    if (! existing.documentation) {
                        existing.documentation = suggestion.documentation;
                    }
                    if (! existing.detail) {
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

        if (node && node.type === "object") {
            if (node.offset === offset) {
                return result;
            }

            const properties = node.children ?? [];
            for (const property of properties) {
                if (currentProperty === undefined || currentProperty !== property) {
                    proposed.set(property.children![0].value, new vscode.CompletionItem("__"));
                }
            }
            let separatorAfter = "";
            if (addValue) {
                separatorAfter = SchemaUtils.evaluateSeparatorAfter(document, document.offsetAt(overwriteRange.end));
            }

            await this.getPropertyCompletions(schema, node, addValue, separatorAfter, collector, root, document);
        }

        const types: { [type: string]: boolean } = {};
        await this.getValueCompletions(schema, node, offset, document, collector, types, root);

        return result;
    }

    public static async getPropertyCompletions(schema: MinecraftJsonSchema, node: JsonParser.Node, addValue: boolean, separatorAfter: string, collector: CompletionsCollector, rootNode: JsonParser.Node | undefined, document: vscode.TextDocument): Promise<void> {
        const matchingSchemas = SchemaUtils.getMatchingSchemas(schema, document, rootNode, node.offset);

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
                                insertText: this.getInsertTextForProperty(key, propertySchema, addValue, separatorAfter),
                                filterText: this.getFilterTextForValue(key),
                                documentation: this.fromMarkup(propertySchema.description) || ''
                            };
                            if (proposal.insertText && this.endsWith(proposal.insertText, `$1${separatorAfter}`)) {
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
                            insertText: this.getInsertTextForProperty(name, schemaPropertyNames, addValue, separatorAfter),
                            filterText: this.getFilterTextForValue(name),
                            documentation: documentation || this.fromMarkup(schemaPropertyNames.description) || '',
                            sortText: sortText,
                            detail: detail
                        };
                        if (proposal.insertText && this.endsWith(proposal.insertText, `$1${separatorAfter}`)) {
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
                        const dynamicExamples: string[] = await DynamicSourceHandlers.getDynamicExampleSourceValues(schemaPropertyNames["x-dynamic-examples-source"]);
                        for (const example of dynamicExamples) {
                            propertyNameCompletionItem(example, undefined, undefined, undefined);
                        }
                    }
                }
            }
        }
    }

    public static getInsertTextForProperty(key: string, propertySchema: MinecraftJsonSchema | undefined, addValue: boolean, separatorAfter: string): vscode.SnippetString {
        const propertyText = this.getInsertTextForValue(key, '');
        if (!addValue) {
            return new vscode.SnippetString(propertyText);
        }
        const resultText = propertyText + ': ';

        let value;
        let nValueProposals = 0;
        if (propertySchema !== undefined) {
            if (propertySchema.enum !== undefined) {
                if (!value && propertySchema.enum.length === 1) {
                    value = this.getInsertTextForGuessedValue(propertySchema.enum[0], '');
                }
                nValueProposals = propertySchema.enum.length;
            }

            if (propertySchema.const !== undefined) {
                if (!value) {
                    value = this.getInsertTextForGuessedValue(propertySchema.const, '');
                }
                nValueProposals++;
            }

            if (propertySchema.default !== undefined) {
                if (!value) {
                    value = this.getInsertTextForGuessedValue(propertySchema.default, '');
                }
                nValueProposals++;
            }

            if (Array.isArray(propertySchema.examples) && propertySchema.examples.length) {
                if (!value) {
                    value = this.getInsertTextForGuessedValue(propertySchema.examples[0], '');
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
                    case 'boolean': value = '$1'; break;
                    case 'string': value = '"$1"'; break;
                    case 'object': value = '{$1}'; break;
                    case 'array': value = '[$1]'; break;
                    case 'number':
                    case "integer": value = '${1:0}'; break;
                    case "null": value = '${1:null}'; break;
                    default: return new vscode.SnippetString(propertyText);
                }
            }
        }
        if (! value || nValueProposals > 1) {
            value = '$1';
        }
        return new vscode.SnippetString(resultText + value + separatorAfter);
    }

    public static getInsertTextForValue(value: any, separatorAfter: string): string {
        const text = JSON.stringify(value, null, '\t');
        if (text === "{}") {
            return '{$1}' + separatorAfter;
        } else if (text === "[]") {
            return '[$1]' + separatorAfter;
        }
        return this.getInsertTextForPlainText(text + separatorAfter);
    }

    public static getInsertTextForPlainText(text: string): string {
        return text.replace(/[\\\$\}]/g, '\\$&');   // escape $, \ and }
    }

    public static getInsertTextForGuessedValue(value: any, separatorAfter: string): string {
        switch (typeof value) {
            case "object":
                if (value === null) {
                    return '${1:null}' + separatorAfter;
                }
                return this.getInsertTextForValue(value, separatorAfter);
            case "string":
                let snippetValue = JSON.stringify(value);
                snippetValue = snippetValue.substring(1, snippetValue.length - 2); // remove quotes
                snippetValue = this.getInsertTextForPlainText(snippetValue); // escape \ and }
                return '"${1:' + snippetValue + '}"' + separatorAfter;
            case "number":
            case "boolean":
                return '${1:' + JSON.stringify(value) + '}' + separatorAfter;
        }
        return this.getInsertTextForValue(value, separatorAfter);
    }

    public static getFilterTextForValue(value: any): string {
        return JSON.stringify(value);
    }

    public static fromMarkup(markupString: string | undefined): vscode.MarkdownString | undefined {
        if (markupString === undefined) {
            return undefined;
        }

        return new vscode.MarkdownString(markupString, true);
    }

    public static endsWith(haystack: string | vscode.SnippetString, needle: string): boolean {
        if (typeof haystack === "object") {
            haystack = haystack.value;
        }

        const diff = haystack.length - needle.length;
        if (diff > 0) {
            return haystack.lastIndexOf(needle) === diff;
        } else if (diff === 0) {
            return haystack === needle;
        } else {
            return false;
        }
    }

    public static async getValueCompletions(schema: MinecraftJsonSchema, node: JsonParser.Node | undefined, offset: number, document: vscode.TextDocument, collector: CompletionsCollector, types: { [type: string]: boolean }, rootNode: JsonParser.Node | undefined): Promise<void> {
        let offsetForSeparator = offset;
        let parentKey: string | undefined = undefined;
        let valueNode: JsonParser.Node | undefined = undefined;

        if (node && (node.type === 'string' || node.type === 'number' || node.type === 'boolean' || node.type === 'null')) {
            offsetForSeparator = node.offset + node.length;
            valueNode = node;
            node = node.parent;
        }

        if (! node) {
            await this.addSchemaValueCompletions(schema, '', collector, types, document);
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
            const separatorAfter = SchemaUtils.evaluateSeparatorAfter(document, offsetForSeparator);

            const matchingSchemas = SchemaUtils.getMatchingSchemas(schema, document, rootNode, node.offset, valueNode);
            for (const s of matchingSchemas) {
                if (s.node === node && !s.inverted && s.schema) {
                    if (node.type === 'array' && s.schema.items) {
                        let c = collector;
                        if (Array.isArray(s.schema.items)) {
                            const index = SchemaUtils.findItemAtOffset(node, document, offset);
                            if (index < s.schema.items.length) {
                                await this.addSchemaValueCompletions(s.schema.items[index], separatorAfter, c, types, document);
                            }
                        } else {
                            await this.addSchemaValueCompletions(s.schema.items, separatorAfter, c, types, document);
                        }
                    }
                    if (parentKey !== undefined) {
                        let propertyMatched = false;
                        if (s.schema.properties) {
                            const propertySchema = s.schema.properties[parentKey];
                            if (propertySchema) {
                                propertyMatched = true;
                                await this.addSchemaValueCompletions(propertySchema, separatorAfter, collector, types, document);
                            }
                        }
                        if (s.schema.additionalProperties && !propertyMatched) {
                            const propertySchema = s.schema.additionalProperties;
                            await this.addSchemaValueCompletions(propertySchema, separatorAfter, collector, types, document);
                        }
                    }
                }
            }

            if (types["boolean"]) {
                await this.addBooleanValueCompletion(true, separatorAfter, collector);
                await this.addBooleanValueCompletion(false, separatorAfter, collector);
            }

            if (types["null"]) {
                collector.add({
                    kind: this.getSuggestionKind("null"),
                    label: "null",
                    insertText: "null" + separatorAfter,
                    documentation: ""
                });
            }
        }
    }

    public static async addSchemaValueCompletions(
        schema: MinecraftJsonSchema,
        separatorAfter: string,
        collector: CompletionsCollector,
        types: { [type: string]: boolean },
        document: vscode.TextDocument
    ): Promise<void> {
        if (typeof schema === "object") {
            this.addEnumValueCompletions(schema, separatorAfter, collector);
            await this.addDefaultValueCompletions(schema, separatorAfter, collector, document);
            SchemaUtils.collectTypes(schema, types);
            if (Array.isArray(schema.oneOf)) {
                for (const subschema of schema.oneOf) {
                    await this.addSchemaValueCompletions(subschema, separatorAfter, collector, types, document);
                }
            }
        }
    }

    public static addEnumValueCompletions(schema: MinecraftJsonSchema, separatorAfter: string, collector: CompletionsCollector): void {
        if (schema.const !== undefined) {
            collector.add({
                kind: this.getSuggestionKind(schema.type),
                label: this.getLabelForValue(schema.const),
                insertText: this.getInsertTextForValue(schema.const, separatorAfter),
                documentation: this.fromMarkup(schema.description) || '',
            });
        }

        if (Array.isArray(schema.enum)) {
            for (let i = 0, length = schema.enum.length; i < length; i++) {
                const enm = schema.enum[i];
                let documentation = this.fromMarkup(schema.description) || '';
                collector.add({
                    kind: this.getSuggestionKind(schema.type),
                    label: this.getLabelForValue(enm),
                    insertText: this.getInsertTextForValue(enm, separatorAfter),
                    documentation: documentation
                });
            }
        }
    }

    public static getSuggestionKind(type: MinecraftJsonSchemaType | undefined): vscode.CompletionItemKind {
        if (type === undefined) {
            return vscode.CompletionItemKind.Value;
        }
        switch (type) {
            case "string": return vscode.CompletionItemKind.Value;
            case "object": return vscode.CompletionItemKind.Module;
            default: return vscode.CompletionItemKind.Value;
        }
    }

    public static getLabelForValue(value: any): string {
        return JSON.stringify(value);
    }

    public static async addDefaultValueCompletions(
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
                kind: this.getSuggestionKind(type),
                label: this.getLabelForValue(value),
                insertText: this.getInsertTextForValue(value, separatorAfter),
                detail: "Default value"
            };
            collector.add(completionItem);
            hasProposals = true;
        }

        if (Array.isArray(schema.examples)) {
            for (const example of schema.examples) {
                let type = schema.type;
                let value = example;
                for (let i = arrayDepth; i > 0; i--) {
                    value = [value];
                    type = 'array';
                }
                collector.add({
                    kind: this.getSuggestionKind(type),
                    label: this.getLabelForValue(value),
                    insertText: this.getInsertTextForValue(value, separatorAfter)
                });
                hasProposals = true;
            }
        }

        if (schema["x-dynamic-examples-source"] !== undefined && document) {
            const dynamicExamples: string[] = await DynamicSourceHandlers.getDynamicExampleSourceValues(schema["x-dynamic-examples-source"]);
            for (const example of dynamicExamples) {
                let type = schema.type;
                let value = example as any;
                for (let i = arrayDepth; i > 0; i--) {
                    value = [value];
                    type = 'array';
                }
                collector.add({
                    kind: this.getSuggestionKind(type),
                    label: this.getLabelForValue(value),
                    insertText: this.getInsertTextForValue(value, separatorAfter)
                });
                hasProposals = true;
            }
        }

        if (!hasProposals && typeof schema.items === "object" && !Array.isArray(schema.items) && arrayDepth < 5) {
            await this.addDefaultValueCompletions(schema.items, separatorAfter, collector, document, arrayDepth + 1);
        }
    }

    public static async addBooleanValueCompletion(value: boolean, separatorAfter: string, collector: CompletionsCollector): Promise<void> {
        collector.add({
            kind: this.getSuggestionKind("boolean"),
            label: value ? "true" : "false",
            insertText: this.getInsertTextForValue(value, separatorAfter),
            documentation: ""
        });
    }
}