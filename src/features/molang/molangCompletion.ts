import * as vscode from 'vscode';
import { molangSymbols } from './molangSymbols';
import { getMolangDocumentation } from './utils';

export function registerMolangCompletion(context: vscode.ExtensionContext) {
	const provider = vscode.languages.registerCompletionItemProvider(
		"molang",
		{
			provideCompletionItems(document, position) {
				const items: vscode.CompletionItem[] = molangSymbols.map(symbol => {
					const item = new vscode.CompletionItem(
                        `${symbol.kind}.${symbol.name}`,
                        vscode.CompletionItemKind.Function // ou .Property si tu veux
                    );

					item.detail = symbol.returnType; // Détail de la fonction
					item.documentation = getMolangDocumentation(symbol);

					const requiredParams = (symbol.parameters ?? []).filter(p => !p.optional);
					if (requiredParams.length > 0) {
						item.insertText = new vscode.SnippetString(`${symbol.kind}.${symbol.name}($1)`);
					} else {
						item.insertText = new vscode.SnippetString(`${symbol.kind}.${symbol.name}`);
					}

					item.range = document.getWordRangeAtPosition(position);
					return item;
				});

				return items;
			}
		}
	);

	context.subscriptions.push(provider);
}
