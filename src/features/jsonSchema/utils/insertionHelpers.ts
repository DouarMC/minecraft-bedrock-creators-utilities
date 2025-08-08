import * as vscode from 'vscode';

export function analyzeInsertionContext(document: vscode.TextDocument, position: vscode.Position) {
    const line = document.lineAt(position.line);
    const beforeCursor = line.text.substring(0, position.character);
    const afterCursor = line.text.substring(position.character);
    
    // 🎯 Détection simple : on est dans des guillemets si on a un " non fermé
    const quotes = beforeCursor.match(/"/g) || [];
    const isInQuotes = quotes.length % 2 === 1;
    
    return {
        isInQuotes,
        beforeCursor,
        afterCursor
    };
}

export function createQuoteAwareRange(
    document: vscode.TextDocument,
    position: vscode.Position,
    context: { afterCursor: string }
): vscode.Range | undefined {
    const line = document.lineAt(position.line);
    const lineText = line.text;
    const beforeCursor = lineText.substring(0, position.character);
    
    // Trouver le dernier guillemet d'ouverture
    const lastQuoteIndex = beforeCursor.lastIndexOf('"');
    
    if (lastQuoteIndex >= 0) {
        const startPos = new vscode.Position(position.line, lastQuoteIndex + 1);
        
        let endCharacter = position.character;
        
        // Vérifier s'il y a un guillemet de fermeture à inclure
        if (context.afterCursor.startsWith('"')) {
            endCharacter = position.character + 1;
        } else {
            const nextQuoteIndex = context.afterCursor.indexOf('"');
            if (nextQuoteIndex >= 0) {
                endCharacter = position.character + nextQuoteIndex + 1;
            }
        }
        
        const endPos = new vscode.Position(position.line, endCharacter);
        return new vscode.Range(startPos, endPos);
    }
    
    return undefined;
}