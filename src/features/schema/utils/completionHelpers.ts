import * as vscode from 'vscode';
import * as JsonParser from 'jsonc-parser';
import { MinecraftJsonSchema } from '../model';

export function getOverwriteRange(document: vscode.TextDocument, node: JsonParser.Node | undefined, position: vscode.Position, currentWord: string): vscode.Range {
    const text = document.getText();
    if (node && (node.type === 'string' || node.type === 'number' || node.type === 'boolean' || node.type === 'null')) {
        return new vscode.Range(
            document.positionAt(node.offset),
            document.positionAt(node.offset + node.length)
        );
    } else {
        let overwriteStart = document.offsetAt(position) - currentWord.length;
        if (overwriteStart > 0 && text[overwriteStart - 1] === '"') {
            overwriteStart--;
        }
        return new vscode.Range(
            document.positionAt(overwriteStart),
            position
        );
    }
}

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

export function collectTypes(schema: MinecraftJsonSchema, types: {[type: string]: boolean}) {
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