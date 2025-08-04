import { dynamicExamplesSourceKeys } from "../shared/schemaEnums";

import { 
    getBlockIds, 
    getEntityIds,
    getItemIds,
    getBiomeIds,
    // ... toutes les autres fonctions
} from '../../../utils/workspace/getContent';

export interface DynamicExamplesCache {
    data: any[];
    timestamp: number;
}

export class DynamicExamplesProvider {
    private cache = new Map<string, DynamicExamplesCache>();
    private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    /**
     * Obtient les exemples pour une source donnée
     */
    public async getExamples(source: string | string[]): Promise<any[]> {
        const sources = Array.isArray(source) ? source : [source];
        const allExamples: any[] = [];

        for (const singleSource of sources) {
            const examples = await this.getExamplesForSingleSource(singleSource);
            allExamples.push(...examples);
        }

        // Supprimer les doublons
        return [...new Set(allExamples)];
    }

    private async getExamplesForSingleSource(source: string): Promise<any[]> {
        // Vérifier le cache
        const cached = this.cache.get(source);
        if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
            return cached.data;
        }

        // Obtenir les données
        let data: any[] = [];
        
        try {
            switch (source) {
                case dynamicExamplesSourceKeys.block_ids:
                    data = await getBlockIds();
                    break;
                case dynamicExamplesSourceKeys.entity_ids:
                    data = await getEntityIds();
                    break;
                // ... autres sources
                default:
                    console.warn(`Source d'exemples dynamiques inconnue: ${source}`);
                    data = [];
            }
        } catch (error) {
            console.error(`Erreur lors de l'obtention des exemples pour ${source}:`, error);
            data = [];
        }

        // Mettre en cache
        this.cache.set(source, {
            data,
            timestamp: Date.now()
        });

        return data;
    }

    /**
     * Vide le cache
     */
    public clearCache(): void {
        this.cache.clear();
    }

    /**
     * Vide le cache pour une source spécifique
     */
    public clearCacheForSource(source: string): void {
        this.cache.delete(source);
    }
}