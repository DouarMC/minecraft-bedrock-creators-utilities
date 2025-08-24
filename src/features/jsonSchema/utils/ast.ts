import * as vscode from 'vscode';
import * as JsonParser from 'jsonc-parser';

export function getNodeFromOffset(rootNode: JsonParser.Node | undefined, offset: number, includeRightBound = false): JsonParser.Node | undefined {
    if (rootNode) {
        return JsonParser.findNodeAtOffset(rootNode, offset, includeRightBound);
    }
    return undefined;
}

export function isInComment(document: vscode.TextDocument, start: number, offset: number): boolean {
    const scanner = JsonParser.createScanner(document.getText(), false);
    scanner.setPosition(start);
    let token = scanner.scan();
    while (token !== JsonParser.SyntaxKind.EOF && (scanner.getTokenOffset() + scanner.getTokenLength() < offset)) {
        token = scanner.scan();
    }
    return (token === JsonParser.SyntaxKind.LineCommentTrivia || token === JsonParser.SyntaxKind.BlockCommentTrivia) && scanner.getTokenOffset() <= offset;
}

export function getCurrentWord(document: vscode.TextDocument, offset: number): string {
    let i = offset - 1;
    const text = document.getText();
    while (i >= 0 && ' \t\n\r\v":{[,]}'.indexOf(text.charAt(i)) === -1) {
        i--;
    }
    return text.substring(i + 1, offset);
}