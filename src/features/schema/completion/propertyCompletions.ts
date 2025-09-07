import * as vscode from 'vscode';
import * as JsonParser from 'jsonc-parser';
import { MinecraftJsonSchema } from '../model';
import { CompletionsCollector } from './collector';
import { getMatchingSchemas } from '../utils/schemaMatching';
import { getFilterTextForValue } from './utils/textHelpers';
import { fromMarkup, endsWith } from './utils/textHelpers';
import { getDynamicExampleSourceValues } from './dynamicSources';
import { getInsertTextForValue, getInsertTextForGuessedValue } from './utils/textHelpers';

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
                    const dynamicExamples = await getDynamicExampleSourceValues(
                        schemaPropertyNames["x-dynamic-examples-source"],
                        document,
                        schemaPropertyNames
                    );
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
            value = '$1'; break;
            case 'string':
            value = '"$1"'; break;
            case 'object':
            value = '{$1}'; break;
            case 'array':
            value = '[$1]'; break;
            case 'number':
            case 'integer':
            value = '${1:0}'; break;
            case 'null':
            value = '${1:null}'; break;
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