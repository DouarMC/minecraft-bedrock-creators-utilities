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
        let depth = 0;
        let inString = false;
        let escapeNext = false;
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
                        path.push(currentKey);
                        currentKey = '';
                        collectingKey = false;
                    }
                } else {
                    inString = true;
                    collectingKey = true;
                }
                continue;
            }
            
            if (inString) {
                if (collectingKey) currentKey += char;
                continue;
            }
            
            // Navigation dans la structure JSON
            if (char === '{') {
                depth++;
            } else if (char === '}') {
                depth--;
                if (path.length > 0) path.pop();
            } else if (char === '[') {
                depth++;
            } else if (char === ']') {
                depth--;
                if (path.length > 0) path.pop();
            }
        }
        
        return path;
    }
    
    private determineContextType(document: string, position: number): JsonContext['type'] {
        // Analyser les caractères autour de la position
        let i = position - 1;
        
        // Remonter pour ignorer les espaces
        while (i >= 0 && /\s/.test(document[i])) {
            i--;
        }
        
        if (i < 0) return 'root';
        
        const prevChar = document[i];
        
        // Chercher vers l'avant pour voir ce qui suit
        let j = position;
        while (j < document.length && /\s/.test(document[j])) {
            j++;
        }
        
        const nextChar = j < document.length ? document[j] : '';
        
        // Logique de détermination du contexte
        if (prevChar === '{' || prevChar === ',') {
            return 'property-key';
        } else if (prevChar === ':') {
            return 'property-value';
        } else if (prevChar === '[' || (prevChar === ',' && this.isInArray(document, position))) {
            return 'array-item';
        } else if (this.isInQuotes(document, position)) {
            // Dans une string, déterminer si c'est une clé ou valeur
            return this.isPropertyKey(document, position) ? 'property-key' : 'property-value';
        }
        
        return 'root';
    }

    private isInArray(document: string, position: number): boolean {
        let depth = 0;
        for (let i = position - 1; i >= 0; i--) {
            if (document[i] === ']') depth++;
            else if (document[i] === '[') {
                depth--;
                if (depth < 0) return true;
            }
            else if (document[i] === '}') depth++;
            else if (document[i] === '{') {
                depth--;
                if (depth < 0) return false;
            }
        }
        return false;
    }

    private isPropertyKey(document: string, position: number): boolean {
        // Chercher le prochain caractère non-espace après la string
        let i = position;
        while (i < document.length && document[i] !== '"') i++;
        i++; // Passer le guillemet fermant
        while (i < document.length && /\s/.test(document[i])) i++;
        
        return i < document.length && document[i] === ':';
    }
    
    private getCurrentToken(document: string, position: number): string {
        // Chercher le début du token (vers la gauche)
        let start = position;
        while (start > 0) {
            const char = document[start - 1];
            if (char.match(/[\s,:{}\[\]"]/)) {
                break;
            }
            start--;
        }
        
        // Chercher la fin du token (vers la droite)
        let end = position;
        while (end < document.length) {
            const char = document[end];
            if (char.match(/[\s,:{}\[\]"]/)) {
                break;
            }
            end++;
        }
        
        return document.substring(start, end);
    }
    
    private isInQuotes(document: string, position: number): boolean {
        let quoteCount = 0;
        let i = 0;
        
        // Compter les guillemets non-échappés jusqu'à la position
        while (i < position && i < document.length) {
            if (document[i] === '"') {
                // Vérifier si le guillemet n'est pas échappé
                let backslashCount = 0;
                let j = i - 1;
                while (j >= 0 && document[j] === '\\') {
                    backslashCount++;
                    j--;
                }
                // Si nombre pair de backslashes, le guillemet n'est pas échappé
                if (backslashCount % 2 === 0) {
                    quoteCount++;
                }
            }
            i++;
        }
        
        // Si nombre impair de guillemets, on est dans une string
        return quoteCount % 2 === 1;
    }
}