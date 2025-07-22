import * as vscode from 'vscode';
import { MolangSymbol } from "../../types/molang";

export function getMolangDocumentation(symbol: MolangSymbol): vscode.MarkdownString {
    return new vscode.MarkdownString([
        `**${symbol.kind}.${symbol.name}**`,
        ``,
        symbol.description,
        ...(symbol.parameters?.length
            ? [
                ``,
                "**Paramètres :**",
                ...symbol.parameters.map((p) => {
                    const optionalText = p.optional ? " (optionnel)" : "";
                    const variadicPrefix = p.variadic ? "..." : "";
                    return `- \`${variadicPrefix}${p.name}: ${p.type}\`${optionalText} — ${p.description ?? ""}`;
                })
            ]
            : []),
        ...(symbol.examples?.length
            ? [
                ``,
                "**Exemples :**",
                ...symbol.examples.map((e) => `\`\`\`molang\n${e}\n\`\`\``)
            ]
            : [])
    ].join("\n"));
}