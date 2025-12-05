import * as vscode from 'vscode';

export interface CompletionsCollector {
    add(suggestion: vscode.CompletionItem): void;
    error(message: string): void;
    setAsIncomplete(): void;
    getNumberOfProposals(): number;
}