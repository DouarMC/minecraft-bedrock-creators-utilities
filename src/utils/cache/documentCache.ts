import * as vscode from "vscode";
import { Node } from "jsonc-parser";

/**
 * Interface pour les données mises en cache par document
 */
export interface DocumentCacheData {
    /** Version du document pour détecter les changements */
    version: number;
    /** Contenu du document mis en cache */
    content: string;
    /** Arbre JSON parsé */
    jsonTree: Node | undefined;
    /** Valeur JavaScript de l'arbre */
    rootValue: any;
    /** Timestamp de création du cache */
    timestamp: number;
}

/**
 * Cache intelligent pour les données de document avec invalidation automatique
 */
export class DocumentCache {
    private cache = new Map<string, DocumentCacheData>();
    private maxSize = 50; // Limite pour éviter une consommation mémoire excessive
    private maxAge = 5 * 60 * 1000; // 5 minutes en millisecondes

    /**
     * Récupère les données mises en cache pour un document
     */
    get(document: vscode.TextDocument): DocumentCacheData | undefined {
        const key = this.getKey(document);
        const cached = this.cache.get(key);
        
        if (!cached) {
            return undefined;
        }

        // Vérification de la version du document
        if (cached.version !== document.version) {
            this.cache.delete(key);
            return undefined;
        }

        // Vérification de l'âge du cache
        if (Date.now() - cached.timestamp > this.maxAge) {
            this.cache.delete(key);
            return undefined;
        }

        return cached;
    }

    /**
     * Met en cache les données d'un document
     */
    set(document: vscode.TextDocument, jsonTree: Node | undefined, rootValue: any): void {
        const key = this.getKey(document);
        
        // Nettoyage du cache si trop plein
        this.cleanup();

        const cacheData: DocumentCacheData = {
            version: document.version,
            content: document.getText(),
            jsonTree,
            rootValue,
            timestamp: Date.now()
        };

        this.cache.set(key, cacheData);
    }

    /**
     * Invalide le cache pour un document spécifique
     */
    invalidate(document: vscode.TextDocument): void {
        const key = this.getKey(document);
        this.cache.delete(key);
    }

    /**
     * Invalide tout le cache
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * Nettoyage automatique du cache
     */
    private cleanup(): void {
        const now = Date.now();
        
        // Suppression des entrées expirées
        for (const [key, data] of this.cache.entries()) {
            if (now - data.timestamp > this.maxAge) {
                this.cache.delete(key);
            }
        }

        // Si le cache est encore trop plein, supprimer les plus anciennes
        if (this.cache.size >= this.maxSize) {
            const entries = Array.from(this.cache.entries());
            entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
            
            const toDelete = entries.slice(0, Math.floor(this.maxSize * 0.3));
            toDelete.forEach(([key]) => this.cache.delete(key));
        }
    }

    /**
     * Génère une clé unique pour un document
     */
    private getKey(document: vscode.TextDocument): string {
        return `${document.uri.toString()}:${document.version}`;
    }

    /**
     * Retourne les statistiques du cache pour le debugging
     */
    getStats(): { size: number; maxSize: number; keys: string[] } {
        return {
            size: this.cache.size,
            maxSize: this.maxSize,
            keys: Array.from(this.cache.keys())
        };
    }
}

// Instance globale du cache de documents
export const documentCache = new DocumentCache();
