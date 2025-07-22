import * as vscode from 'vscode';
import { registerMolangCompletion } from './molangCompletion';
import { registerMolangHover } from './molangHover';

export function registerMolangLanguage(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.languages.setLanguageConfiguration("molang", {
            brackets: [
                ['{', '}'],
                ['[', ']'],
                ['(', ')']
            ],

            // permet de considérer "query.speed" comme un seul mot
            wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\<\>\,\?\/\s]+)/g,  
        })
    );

    registerMolangCompletion(context);
    registerMolangHover(context);
}