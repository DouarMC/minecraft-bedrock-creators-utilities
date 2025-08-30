import * as vscode from 'vscode';
import { MinecraftJsonSchema } from '../../../types/minecraftJsonSchema';
import { getMatchingSchemas } from '../completion/doComplete';
import { parseTree } from 'jsonc-parser';
import { getNodeFromOffset } from '../utils/ast';

export function doHover(document: vscode.TextDocument, position: vscode.Position, schema: MinecraftJsonSchema): vscode.Hover | null {
    const offset = document.offsetAt(position);
    const rootNode = parseTree(document.getText());
    let node = getNodeFromOffset(rootNode, offset);
    if (!node || (node.type === 'object' || node.type === 'array') && offset > node.offset + 1 && offset < node.offset + node.length - 1) {
        return null; // No hover if the node is not found or is an empty object/array
    }

    const hoverRangeNode = node;

    // use the property description when hovering over an object key
    if (node.type === "string") {
        const parent = node.parent;
        if (parent && parent.type === "property" && parent.children![0] === node) {
            node = parent.children![1];
            if (!node) {
                return null;
            }
        }
    }

    const hoverRange = new vscode.Range(
        document.positionAt(hoverRangeNode.offset),
        document.positionAt(hoverRangeNode.offset + hoverRangeNode.length)
    );

    const createHover = (contents: vscode.MarkdownString[]) => {
        const result: vscode.Hover = {
            contents: contents,
            range: hoverRange
        };
        return result;
    };

    const matchingSchemas = getMatchingSchemas(schema, document, rootNode);
    let markdownDescription: string | undefined = undefined;
    matchingSchemas.every((s) => {
        if (s.node === node && !s.inverted && s.schema) {
            markdownDescription = markdownDescription || toMarkdown(s.schema.description);
        }
        return true;
    });
    let result = '';
    if (markdownDescription) {
        if (result.length > 0) {
            result += "\n\n";
        }
        result += markdownDescription;
    }
    return createHover([new vscode.MarkdownString(result, true)]);
}

function toMarkdown(plain: string): string;
function toMarkdown(plain: string | undefined): string | undefined;
function toMarkdown(plain: string | undefined): string | undefined {
	if (plain) {
		const res = plain.replace(/([^\n\r])(\r?\n)([^\n\r])/gm, '$1\n\n$3'); // single new lines to \n\n (Markdown paragraph)
		return res.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&"); // escape markdown syntax tokens: http://daringfireball.net/projects/markdown/syntax#backslash
	}
	return undefined;
}