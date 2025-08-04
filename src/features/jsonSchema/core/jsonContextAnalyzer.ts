export interface JsonContext {
    type: 'property-key' | 'property-value' | 'array-item' | 'root';
    path: string[];           // Chemin JSON jusqu'à la position
    isInQuotes: boolean;      // Si le curseur est dans des guillemets
    currentToken: string;     // Le token actuel (mot à compléter)
    arrayIndex?: number;      // Index in array if in array context
    parentSchema?: any;       // Schema du parent pour autocomplétion
    isPrimitive?: boolean;    // If the current token is a primitive value
}

export class JsonContextAnalyzer {
    
    public analyzePosition(document: string, position: number): JsonContext {
        const context = {
            type: this.determineContextType(document, position),
            path: this.extractPath(document, position),
            isInQuotes: this.isInQuotes(document, position),
            currentToken: this.getCurrentToken(document, position),
            arrayIndex: this.getArrayIndex(document, position),
            parentSchema: undefined, // On ajoutera ça plus tard avec le schema
            isPrimitive: this.isPrimitiveToken(document, position)
        };
        
        return context;
    }
    
    private extractPath(document: string, position: number): string[] {
        const path: string[] = [];
        let inString = false;
        let escapeNext = false;
        let braceDepth = 0;
        let bracketDepth = 0;
        
        // Stack pour suivre les clés au fur et à mesure qu'on entre dans les objets
        const keyStack: string[] = [];
        let currentKey = '';
        let collectingKey = false;
        
        // Track array indices
        const arrayIndices: number[] = [];
        let currentArrayItemCount = 0;
        
        for (let i = 0; i < position && i < document.length; i++) {
            const char = document[i];
            
            // Robust escape handling
            if (escapeNext) {
                escapeNext = false;
                if (collectingKey) currentKey += char;
                continue;
            }
            
            if (char === '\\') {
                escapeNext = true;
                if (collectingKey) currentKey += char;
                continue;
            }
            
            // Gestion des strings with better escape handling
            if (char === '"') {
                if (inString) {
                    inString = false;
                    if (collectingKey) {
                        // Vérifier si c'est suivi de ':' (donc c'est une clé)
                        const nextNonSpace = this.findNextNonWhitespace(document, i + 1);
                        if (nextNonSpace !== -1 && document[nextNonSpace] === ':') {
                            // C'est une clé, la stocker pour quand on entrera dans l'objet
                            keyStack.push(currentKey);
                        }
                        currentKey = '';
                        collectingKey = false;
                    }
                } else {
                    inString = true;
                    collectingKey = true;
                    currentKey = '';
                }
                continue;
            }
            
            if (inString) {
                if (collectingKey) currentKey += char;
                continue;
            }
            
            // Gestion des structures JSON
            switch (char) {
                case '{':
                    braceDepth++;
                    // Quand on entre dans un objet, ajouter la clé correspondante au path
                    if (keyStack.length > 0) {
                        path.push(keyStack.pop()!);
                    }
                    break;
                case '}':
                    braceDepth--;
                    // Quand on sort d'un objet, enlever du path
                    if (path.length > 0) {
                        path.pop();
                    }
                    break;
                case '[':
                    bracketDepth++;
                    currentArrayItemCount = 0;
                    break;
                case ']':
                    bracketDepth--;
                    if (arrayIndices.length > 0) {
                        arrayIndices.pop();
                    }
                    break;
                case ',':
                    if (bracketDepth > braceDepth) {
                        // We're in an array
                        currentArrayItemCount++;
                    }
                    break;
            }
        }
        
        return path;
    }

    /**
     * Get the current array index if we're in an array context
     */
    private getArrayIndex(document: string, position: number): number | undefined {
        let bracketDepth = 0;
        let braceDepth = 0;
        let inString = false;
        let escapeNext = false;
        let arrayItemCount = 0;
        
        for (let i = 0; i < position && i < document.length; i++) {
            const char = document[i];
            
            if (escapeNext) {
                escapeNext = false;
                continue;
            }
            
            if (char === '\\') {
                escapeNext = true;
                continue;
            }
            
            if (char === '"') {
                inString = !inString;
                continue;
            }
            
            if (inString) {
                continue;
            }
            
            switch (char) {
                case '{':
                    braceDepth++;
                    break;
                case '}':
                    braceDepth--;
                    break;
                case '[':
                    bracketDepth++;
                    if (bracketDepth > braceDepth) {
                        arrayItemCount = 0;
                    }
                    break;
                case ']':
                    bracketDepth--;
                    break;
                case ',':
                    if (bracketDepth > braceDepth) {
                        arrayItemCount++;
                    }
                    break;
            }
        }
        
        return bracketDepth > braceDepth ? arrayItemCount : undefined;
    }

    /**
     * Detect if the current token is a primitive value
     */
    private isPrimitiveToken(document: string, position: number): boolean {
        const token = this.getCurrentToken(document, position);
        
        // Check if it's a boolean, number, or null
        return /^(true|false|null|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)$/.test(token);
    }

    private findNextNonWhitespace(document: string, start: number): number {
        for (let i = start; i < document.length; i++) {
            if (!/\s/.test(document[i])) {
                return i;
            }
        }
        return -1;
    }

    private determineContextType(document: string, position: number): 'property-key' | 'property-value' | 'array-item' | 'root' {
        // Vérifier d'abord si on est dans une string
        const inString = this.isInQuotes(document, position);
        
        if (inString) {
            // Si on est dans une string, déterminer si c'est une clé ou une valeur
            return this.isPropertyKey(document, position) ? 'property-key' : 'property-value';
        }
        
        // Si on n'est pas dans une string, analyser le contexte autour
        let i = position - 1;
        let lastMeaningfulChar = '';
        
        // Rechercher le dernier caractère significatif (ignorer les espaces)
        while (i >= 0 && /\s/.test(document[i])) {
            i--;
        }
        
        if (i >= 0) {
            lastMeaningfulChar = document[i];
        }
        
        // Déterminer le contexte selon le caractère précédent
        switch (lastMeaningfulChar) {
            case '{':
            case ',':
                return 'property-key';
            case ':':
                return 'property-value';
            case '[':
                return 'array-item';
            default:
                return 'root';
        }
    }
    
    private isPropertyKey(document: string, position: number): boolean {
        // Vérifier si la string actuelle est suivie de ':' (donc c'est une clé)
        let i = position;
        
        // Aller à la fin de la string courante
        while (i < document.length && document[i] !== '"') {
            if (document[i] === '\\') {
                i++; // Ignorer le caractère échappé
            }
            i++;
        }
        
        if (i >= document.length) return false;
        
        // Maintenant on est sur le guillemet de fermeture, chercher ':'
        i++;
        while (i < document.length && /\s/.test(document[i])) {
            i++;
        }
        
        return i < document.length && document[i] === ':';
    }
    
    private isInQuotes(document: string, position: number): boolean {
        let quoteCount = 0;
        let i = 0;
        
        while (i < position && i < document.length) {
            const char = document[i];
            
            if (char === '"') {
                // Count consecutive backslashes before this quote
                let escapeCount = 0;
                let checkPos = i - 1;
                while (checkPos >= 0 && document[checkPos] === '\\') {
                    escapeCount++;
                    checkPos--;
                }
                
                // If even number of escapes (including 0), the quote is not escaped
                if (escapeCount % 2 === 0) {
                    quoteCount++;
                }
            }
            i++;
        }
        
        return quoteCount % 2 === 1;
    }
    
    private getCurrentToken(document: string, position: number): string {
        let start = position;
        let end = position;
        
        // Chercher le début du token
        while (start > 0) {
            const char = document[start - 1];
            if (/[\s{}[\],:"]/.test(char)) {
                break;
            }
            start--;
        }
        
        // Chercher la fin du token
        while (end < document.length) {
            const char = document[end];
            if (/[\s{}[\],:"]/.test(char)) {
                break;
            }
            end++;
        }
        
        return document.substring(start, end);
    }
}