import * as vscode from "vscode";

/**
 * Interface pour les données de schéma mises en cache
 */
export interface SchemaCacheData {
    /** Le schéma compilé et optimisé */
    schema: any;
    /** Version de format utilisée pour générer ce schéma */
    formatVersion: string | undefined;
    /** Produit Minecraft (release/preview) */
    minecraftProduct: string | undefined;
    /** Timestamp de création du cache */
    timestamp: number;
    /** Hash du schéma de base pour détecter les changements */
    baseSchemaHash: string;
}

/**
 * Cache intelligent pour les schémas versionnés avec invalidation basée sur le contenu
 */
export class SchemaCache {
    private cache = new Map<string, SchemaCacheData>();
    private maxSize = 100; // Plus de schémas car ils sont réutilisés souvent
    private maxAge = 10 * 60 * 1000; // 10 minutes car les schémas changent rarement

    /**
     * Récupère un schéma mis en cache
     */
    get(
        filePath: string, 
        formatVersion: string | undefined, 
        minecraftProduct: string | undefined,
        baseSchemaHash: string
    ): any | undefined {
        const key = this.getKey(filePath, formatVersion, minecraftProduct);
        const cached = this.cache.get(key);
        
        if (!cached) {
            return undefined;
        }

        // Vérification de l'âge du cache
        if (Date.now() - cached.timestamp > this.maxAge) {
            this.cache.delete(key);
            return undefined;
        }

        // Vérification du hash du schéma de base
        if (cached.baseSchemaHash !== baseSchemaHash) {
            this.cache.delete(key);
            return undefined;
        }

        return cached.schema;
    }

    /**
     * Met en cache un schéma
     */
    set(
        filePath: string,
        formatVersion: string | undefined,
        minecraftProduct: string | undefined,
        schema: any,
        baseSchemaHash: string
    ): void {
        const key = this.getKey(filePath, formatVersion, minecraftProduct);
        
        // Nettoyage du cache si nécessaire
        this.cleanup();

        const cacheData: SchemaCacheData = {
            schema,
            formatVersion,
            minecraftProduct,
            timestamp: Date.now(),
            baseSchemaHash
        };

        this.cache.set(key, cacheData);
    }

    /**
     * Invalide les schémas pour un type de fichier spécifique
     */
    invalidateByFilePattern(pattern: string): void {
        const regex = new RegExp(pattern);
        for (const [key] of this.cache.entries()) {
            if (regex.test(key)) {
                this.cache.delete(key);
            }
        }
    }

    /**
     * Invalide les schémas pour un produit Minecraft spécifique
     */
    invalidateByProduct(minecraftProduct: string): void {
        for (const [key, data] of this.cache.entries()) {
            if (data.minecraftProduct === minecraftProduct) {
                this.cache.delete(key);
            }
        }
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
     * Génère une clé unique pour un schéma
     */
    private getKey(filePath: string, formatVersion: string | undefined, minecraftProduct: string | undefined): string {
        const normalizedPath = this.normalizeFilePath(filePath);
        return `${normalizedPath}:${formatVersion || 'latest'}:${minecraftProduct || 'release'}`;
    }

    /**
     * Normalise un chemin de fichier pour la mise en cache
     */
    private normalizeFilePath(filePath: string): string {
        // Extraction du pattern de fichier pour permettre la réutilisation entre fichiers similaires
        const normalized = filePath.replace(/\\/g, "/").toLowerCase();
        
        // Groupement par type de fichier Minecraft
        if (normalized.includes('/entities/')) return 'minecraft:entity';
        if (normalized.includes('/items/')) return 'minecraft:item';
        if (normalized.includes('/blocks/')) return 'minecraft:block';
        if (normalized.includes('/biomes/')) return 'minecraft:biome';
        if (normalized.includes('/animations/')) return 'minecraft:animation';
        if (normalized.includes('/animation_controllers/')) return 'minecraft:animation_controller';
        if (normalized.includes('/loot_tables/')) return 'minecraft:loot_table';
        if (normalized.includes('/recipes/')) return 'minecraft:recipe';
        if (normalized.includes('/spawn_rules/')) return 'minecraft:spawn_rules';
        if (normalized.includes('/trading/')) return 'minecraft:trading';
        if (normalized.includes('/manifest.json')) return 'minecraft:manifest';
        
        // Si aucun pattern spécifique, utiliser le chemin complet
        return normalized;
    }

    /**
     * Retourne les statistiques du cache pour le debugging
     */
    getStats(): { 
        size: number; 
        maxSize: number; 
        entries: Array<{ key: string; age: number; product: string | undefined }> 
    } {
        const now = Date.now();
        const entries = Array.from(this.cache.entries()).map(([key, data]) => ({
            key,
            age: now - data.timestamp,
            product: data.minecraftProduct
        }));

        return {
            size: this.cache.size,
            maxSize: this.maxSize,
            entries
        };
    }
}

// Instance globale du cache de schémas
export const schemaCache = new SchemaCache();
