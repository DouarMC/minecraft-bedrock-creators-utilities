import * as vscode from 'vscode';

export interface CursorContext {
    beforeCursor: string;
    afterCursor: string;
    isInQuotes: boolean;
    isAfterColon: boolean;
    isStartOfProperty: boolean;
    isTypingValue: boolean;
    isProbablyKeyWithoutQuotes: boolean;
    isInArrayElement: boolean;
}

/**
 * Analyse le texte autour du curseur pour comprendre ce que l’utilisateur est en train d'écrire.
 * @param document Le document dans lequel se trouve le curseur
 * @param position La position du curseur dans le document
 * @returns 
 */
export function getCursorContext(document: vscode.TextDocument, position: vscode.Position): CursorContext {
    const line = document.lineAt(position.line).text;
    const beforeCursor = line.slice(0, position.character);
    const afterCursor = line.slice(position.character);

    // Pour détecter les éléments de tableau, nous devons analyser plus de contexte
    // Récupérer le texte depuis le début du document jusqu'au curseur
    const fullTextBeforeCursor = document.getText(new vscode.Range(
        new vscode.Position(0, 0),
        position
    ));
    
    // Récupérer le texte depuis le curseur jusqu'à la fin du document  
    const fullTextAfterCursor = document.getText(new vscode.Range(
        position,
        new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length)
    ));

    const isInQuotes = isInsideQuotes(beforeCursor, afterCursor);
    const isAfterColon = /:\s*$/.test(beforeCursor);
    const isStartOfProperty = /^[\s{,]*$/.test(beforeCursor) || /^[\s{,]*"[^"]*$/.test(beforeCursor);
    const isTypingValue = isAfterColon || (isInQuotes && /:\s*"[^"]*$/.test(beforeCursor));
    const isProbablyKeyWithoutQuotes = /^[\s{,]*[a-zA-Z0-9_]*$/.test(beforeCursor);
    
    // Utiliser le contexte complet pour détecter les éléments de tableau
    const isInArrayElement = isInsideArrayElement(fullTextBeforeCursor, fullTextAfterCursor);

    return {
        beforeCursor,
        afterCursor,
        isInQuotes,
        isAfterColon,
        isStartOfProperty,
        isTypingValue,
        isProbablyKeyWithoutQuotes,
        isInArrayElement
    };
}

/**
 * Vérifie si le curseur est à l'intérieur de guillemets
 * @param beforeCursor Le texte avant le curseur
 * @param afterCursor Le texte après le curseur
 * @returns 
 */
function isInsideQuotes(beforeCursor: string, afterCursor: string): boolean {
    // Compte le nombre de guillemets non échappés avant le curseur
    const quotesBeforeCount = (beforeCursor.match(/(?<!\\)"/g) || []).length;
    
    // Si le nombre est impair, on est probablement à l'intérieur d'une chaîne
    const inQuotes = quotesBeforeCount % 2 === 1;

    // Vérifie s'il y a un guillemet fermant après le curseur (mais pas immédiatement une nouvelle clé)
    const hasClosingQuote = /^[^"]*"/.test(afterCursor);

    // On est à l'intérieur de guillemets uniquement si on est entre une ouverture et une fermeture
    return inQuotes && hasClosingQuote;
}

/**
 * Vérifie si le curseur est à l'intérieur d'un élément de tableau
 * @param beforeCursor Le texte avant le curseur
 * @param afterCursor Le texte après le curseur
 * @returns 
 */
function isInsideArrayElement(beforeCursor: string, afterCursor: string): boolean {
    // Vérifie si le curseur est après une virgule, un crochet ouvrant ou un saut de ligne à l'intérieur d'un tableau
    const before = beforeCursor.trimEnd();
    const after = afterCursor.trimStart();

    // Comptage des crochets pour s'assurer qu'on est bien dans un tableau
    const openBrackets = (beforeCursor.match(/\[/g) || []).length;
    const closeBrackets = (beforeCursor.match(/\]/g) || []).length;
    const insideArray = openBrackets > closeBrackets;

    if (!insideArray) {
        return false;
    }

    const isAfterOpeningBracket = /\[\s*$/.test(before); // Exemple: `tags: [\n|`
    const isAfterComma = /,\s*$/.test(before);           // Exemple: `"...",\n|`
    const isInQuotes = isInsideQuotes(beforeCursor, afterCursor);
    const isLineStart = before === '"' || before.endsWith('\n"');

    // Vérification supplémentaire : si on est dans des guillemets, s'assurer qu'on n'est pas dans une propriété d'objet
    if (isInQuotes) {
        // Analyser le contexte plus finement pour distinguer array vs propriété d'objet
        const beforeQuotes = beforeCursor.substring(0, beforeCursor.lastIndexOf('"'));
        
        // Chercher le dernier crochet ouvrant et le dernier deux-points
        const lastOpenBracket = beforeQuotes.lastIndexOf('[');
        const lastColon = beforeQuotes.lastIndexOf(':');
        
        // Si il y a un crochet ouvrant APRÈS le dernier deux-points, on est dans un array
        // Sinon, si le deux-points est plus récent, on est dans une propriété d'objet
        if (lastOpenBracket > lastColon) {
            // On est dans un array : le crochet ouvrant est plus récent que le deux-points
            return true;
        } else if (lastColon > lastOpenBracket) {
            // On est dans une propriété d'objet : le deux-points est plus récent
            return false;
        }
        // Si aucun des deux n'est trouvé, continuer avec la logique normale
    }

    return isAfterOpeningBracket || isAfterComma || isInQuotes || isLineStart;
}