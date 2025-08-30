import * as vscode from 'vscode';
import { MinecraftJsonSchema, MinecraftJsonSchemaType } from '../../../../types/minecraftJsonSchema';

export function getInsertTextForPlainText(text: string): string {
    return text.replace(/[\\\$\}]/g, '\\$&');   // escape $, \ and }
}

export function getInsertTextForValue(value: any, separatorAfter: string): string {
    const text = JSON.stringify(value, null, '\t');
    if (text === '{}') {
        return '{$1}' + separatorAfter;
    } else if (text === '[]') {
        return '[$1]' + separatorAfter;
    }
    return getInsertTextForPlainText(text + separatorAfter);
}

export function getInsertTextForGuessedValue(value: any, separatorAfter: string): string {
    switch (typeof value) {
        case "object":
            if (value === null) {
                return '${1:null}' + separatorAfter;
            }
            return getInsertTextForValue(value, separatorAfter);
        case "string":
            let snippetValue = JSON.stringify(value);
            snippetValue = snippetValue.substring(1, snippetValue.length - 2); // remove quotes
            snippetValue = getInsertTextForPlainText(snippetValue); // escape \ and }
            return '"${1:' + snippetValue + '}"' + separatorAfter;
        case "number":
        case "boolean":
            return '${1:' + JSON.stringify(value) + '}' + separatorAfter;
    }
    return getInsertTextForValue(value, separatorAfter);
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

export function getFilterTextForValue(value: any): string {
    return JSON.stringify(value);
}

export function endsWith(haystack: string | vscode.SnippetString, needle: string): boolean {
    if (typeof haystack === 'object') {
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

export function fromMarkup(markupString: string | undefined) {
    if (markupString) {
        return new vscode.MarkdownString(markupString, true);
    }
    return undefined;
}

export function getLabelForValue(value: any): string {
    return JSON.stringify(value);
}

export function getSuggestionKind(type: MinecraftJsonSchemaType | undefined): vscode.CompletionItemKind {
    if (!type) {
        return vscode.CompletionItemKind.Value;
    }
    switch (type) {
        case "string": return vscode.CompletionItemKind.Value;
        case "object": return vscode.CompletionItemKind.Module;
        // case "property": return vscode.CompletionItemKind.Property;
        default: return vscode.CompletionItemKind.Value;
    }
}