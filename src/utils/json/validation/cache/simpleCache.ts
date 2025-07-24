import { ValidationCache, SchemaValidationResult } from '../types';

/**
 * Implémentation simple d'un cache LRU pour les résultats de validation
 */
export class SimpleCache implements ValidationCache {
    private cache: Map<string, CacheEntry>;
    private maxSize: number;
    private accessOrder: string[];

    constructor(maxSize: number = 1000) {
        this.cache = new Map();
        this.maxSize = maxSize;
        this.accessOrder = [];
    }

    get(key: string): SchemaValidationResult | undefined {
        const entry = this.cache.get(key);
        if (entry) {
            // Marquer comme récemment utilisé
            this.markAsUsed(key);
            return entry.result;
        }
        return undefined;
    }

    set(key: string, result: SchemaValidationResult): void {
        // Éviction si nécessaire
        if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
            this.evictLeastRecentlyUsed();
        }

        this.cache.set(key, {
            result,
            timestamp: Date.now()
        });

        this.markAsUsed(key);
    }

    clear(): void {
        this.cache.clear();
        this.accessOrder = [];
    }

    size(): number {
        return this.cache.size;
    }

    /**
     * Marque une entrée comme récemment utilisée
     */
    private markAsUsed(key: string): void {
        const existingIndex = this.accessOrder.indexOf(key);
        if (existingIndex > -1) {
            this.accessOrder.splice(existingIndex, 1);
        }
        this.accessOrder.push(key);
    }

    /**
     * Éviction de l'entrée la moins récemment utilisée
     */
    private evictLeastRecentlyUsed(): void {
        if (this.accessOrder.length > 0) {
            const lruKey = this.accessOrder.shift()!;
            this.cache.delete(lruKey);
        }
    }

    /**
     * Nettoyage des entrées expirées
     */
    public cleanup(maxAge: number = 300000): void { // 5 minutes par défaut
        const now = Date.now();
        const expiredKeys: string[] = [];

        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > maxAge) {
                expiredKeys.push(key);
            }
        }

        for (const key of expiredKeys) {
            this.cache.delete(key);
            const index = this.accessOrder.indexOf(key);
            if (index > -1) {
                this.accessOrder.splice(index, 1);
            }
        }
    }

    /**
     * Statistiques du cache
     */
    public getStats(): CacheStats {
        return {
            size: this.cache.size,
            maxSize: this.maxSize,
            hitRate: 0, // À implémenter si nécessaire
            oldestEntry: this.getOldestEntryAge(),
            newestEntry: this.getNewestEntryAge()
        };
    }

    private getOldestEntryAge(): number {
        let oldest = Infinity;
        for (const entry of this.cache.values()) {
            oldest = Math.min(oldest, entry.timestamp);
        }
        return oldest === Infinity ? 0 : Date.now() - oldest;
    }

    private getNewestEntryAge(): number {
        let newest = 0;
        for (const entry of this.cache.values()) {
            newest = Math.max(newest, entry.timestamp);
        }
        return newest === 0 ? 0 : Date.now() - newest;
    }
}

interface CacheEntry {
    result: SchemaValidationResult;
    timestamp: number;
}

interface CacheStats {
    size: number;
    maxSize: number;
    hitRate: number;
    oldestEntry: number;
    newestEntry: number;
}
