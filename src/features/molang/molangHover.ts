import * as vscode from "vscode";
import { molangSymbols } from "./molangSymbols";
import { getMolangDocumentation } from "./utils";

export function registerMolangHover(context: vscode.ExtensionContext) {
    const provider = vscode.languages.registerHoverProvider("molang", {
        provideHover(document, position, token) {
            const wordRange = document.getWordRangeAtPosition(position, /[a-zA-Z0-9_.]+/);
            if (!wordRange) return;

            const word = document.getText(wordRange);

            // Ex: "math.abs" => { kind: "math", name: "abs" }
            const [kind, name] = word.split(".");
            if (!kind || !name) return;

            const symbol = molangSymbols.find(s => s.kind === kind && s.name === name);
            if (!symbol) return;

            const markdown = getMolangDocumentation(symbol);
            return new vscode.Hover(markdown, wordRange);
        }
    });

    context.subscriptions.push(provider);
}