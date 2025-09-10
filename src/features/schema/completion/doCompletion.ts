import * as vscode from 'vscode';
import * as JsonParser from "jsonc-parser";
import { MinecraftJsonSchema } from '../model';
import { getNodeFromOffset, isInComment, getCurrentWord } from '../utils/ast';
import { CompletionsCollector } from './collector';
import { getOverwriteRange, evaluateSeparatorAfter} from '../utils/completionHelpers';
import { getPropertyCompletions } from './propertyCompletions';
import { getValueCompletions } from './valueCompletions';

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
    const overwriteRange = getOverwriteRange(document, node, position, currentWord);

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