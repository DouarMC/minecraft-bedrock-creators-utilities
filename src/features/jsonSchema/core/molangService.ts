import * as vscode from 'vscode';
import { molangSymbols } from '../../molang/molangSymbols';
import { getMolangDocumentation } from '../../molang/utils';

export class MolangService {
    /**
     * Génère les suggestions de completion pour Molang dans le contexte JSON
     */
    public static getMolangCompletions(): vscode.CompletionItem[] {
        const completions: vscode.CompletionItem[] = [];
        
        // Ajouter toutes les fonctions Molang
        for (const symbol of molangSymbols) {
            const item = new vscode.CompletionItem(
                `${symbol.kind}.${symbol.name}`,
                vscode.CompletionItemKind.Function
            );
            
            // Documentation
            item.documentation = getMolangDocumentation(symbol);
            item.detail = `${symbol.returnType} - ${symbol.description}`;
            
            // Snippet avec paramètres si nécessaire
            const requiredParams = (symbol.parameters ?? []).filter(p => !p.optional);
            if (requiredParams.length > 0) {
                item.insertText = new vscode.SnippetString(`"${symbol.kind}.${symbol.name}($1)"`);
            } else {
                item.insertText = `"${symbol.kind}.${symbol.name}"`;
            }
            
            completions.push(item);
        }
        
        // Ajouter les suggestions basiques
        const basicSuggestions = ['true', 'false', '0', '1', '0.0', '1.0'];
        for (const suggestion of basicSuggestions) {
            const item = new vscode.CompletionItem(suggestion, vscode.CompletionItemKind.Constant);
            item.insertText = `"${suggestion}"`;
            item.detail = 'Molang basic value';
            completions.push(item);
        }
        
        return completions;
    }
    
    /**
     * Valide la syntaxe Molang (version améliorée)
     */
    public static validateMolangSyntax(value: string): boolean {
        // Pour l'instant, garder la validation simple
        // Plus tard on pourra intégrer un vrai parser Molang
        const molangPattern = /^[a-zA-Z0-9_.()[\]'"\s+\-*/=<>!&|?:,]*$/;
        return molangPattern.test(value);
    }
    
    /**
     * Obtient la documentation pour un symbole Molang spécifique
     */
    public static getMolangHover(symbolName: string): vscode.MarkdownString | undefined {
        const [kind, name] = symbolName.split('.');
        if (!kind || !name) return undefined;
        
        const symbol = molangSymbols.find(s => s.kind === kind && s.name === name);
        if (!symbol) return undefined;
        
        return getMolangDocumentation(symbol);
    }
}