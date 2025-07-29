import { documentCache } from "./documentCache";
import { projectMetadataCache } from "./projectMetadataCache";
import { schemaCache } from "./schemaCache";

/**
 * Gestionnaire centralisé de tous les caches
 */
export class CacheManager {
    /**
     * Invalide tous les caches
     */
    static clearAll(): void {
        documentCache.clear();
        projectMetadataCache.clear();
        schemaCache.clear();
    }

    /**
     * Nettoie les ressources de tous les caches
     */
    static dispose(): void {
        documentCache.clear();
        projectMetadataCache.dispose();
        schemaCache.clear();
    }

    /**
     * Retourne les statistiques globales des caches
     */
    static getGlobalStats(): {
        documents: any;
        projects: any;
        schemas: any;
    } {
        return {
            documents: documentCache.getStats(),
            projects: projectMetadataCache.getStats(),
            schemas: schemaCache.getStats()
        };
    }

    /**
     * Force une invalidation intelligente basée sur le type de changement
     */
    static invalidateByChangeType(changeType: 'schema' | 'project' | 'document', identifier?: string): void {
        switch (changeType) {
            case 'schema':
                if (identifier) {
                    schemaCache.invalidateByFilePattern(identifier);
                } else {
                    schemaCache.clear();
                }
                break;
            case 'project':
                projectMetadataCache.clear();
                schemaCache.clear(); // Les schémas dépendent des métadonnées projet
                break;
            case 'document':
                documentCache.clear();
                break;
        }
    }
}

// Export des instances pour usage direct
export { documentCache } from "./documentCache";
export { projectMetadataCache } from "./projectMetadataCache";
export { schemaCache } from "./schemaCache";
