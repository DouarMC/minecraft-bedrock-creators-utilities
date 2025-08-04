export interface JsonContext {
    type: 'property-key' | 'property-value' | 'array-item' | 'root';
    path: string[];           // Chemin JSON jusqu'à la position
    isInQuotes: boolean;      // Si le curseur est dans des guillemets
    currentToken: string;     // Le token actuel (mot à compléter)
    parentSchema?: any;       // Schema du parent pour autocomplétion
}

export class JsonContextAnalyzer {
    
    public analyzePosition(document: string, position: number): JsonContext {
        return {
            type: this.determineContextType(document, position),
            path: this.extractPath(document, position),
            isInQuotes: this.isInQuotes(document, position),
            currentToken: this.getCurrentToken(document, position),
            parentSchema: undefined // On ajoutera ça plus tard avec le schema
        };
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
        
        for (let i = 0; i < position && i < document.length; i++) {
            const char = document[i];
            
            // Gestion des échappements
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
            
            // Gestion des strings
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
                    break;
                case ']':
                    bracketDepth--;
                    break;
            }
        }
        
        return path;
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
            if (document[i] === '"' && (i === 0 || document[i-1] !== '\\')) {
                quoteCount++;
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