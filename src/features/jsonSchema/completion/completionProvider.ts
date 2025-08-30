import * as vscode from 'vscode';
import { getSchemaForDocument } from '../utils/getSchemaForDocument';
import { doCompletion } from './doComplete';

export function registerCompletionProvider( context: vscode.ExtensionContext, documentSelector: vscode.DocumentSelector) {
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            documentSelector,
            {
                async provideCompletionItems(document, position, token, context) {
                    const schema = getSchemaForDocument(document);
                    if (!schema) {
                        return null;
                    }

                    const completionList = await doCompletion(document, position, schema);

                    return completionList;
                }
            }
        )
    );
}