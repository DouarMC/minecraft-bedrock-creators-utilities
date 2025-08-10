import { parseTree, findNodeAtOffset } from 'jsonc-parser';
import * as vscode from 'vscode';

export function getNodeValueAtPosition(document: vscode.TextDocument, position: vscode.Position): any {
    const text = document.getText();
    const offset = document.offsetAt(position);
    const root = parseTree(text);
    if (!root) return undefined;
    const node = findNodeAtOffset(root, offset);
    return node ? node.value : undefined;
}