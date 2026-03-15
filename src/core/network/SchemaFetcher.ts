import { VersionedSchema } from "../../../common/types/VersionedSchema";
import { ExtensionConfig } from "../ExtensionConfig";

/**
 * Classe responsable de la récupération des schémas Minecraft depuis une URL, avec mise en cache.
 */
export class SchemaFetcher {
    /**
     * Cache des schémas versionnés déjà récupérés.
     */
    private static cache: Map<string, VersionedSchema> = new Map();

    /**
     * Récupère un schéma versionné depuis une URL, avec mise en cache.
     * @param relativePath Le chemin relatif du schéma à récupérer.
     * @returns 
     */
    public static async fetchVersioned(relativePath: string): Promise<VersionedSchema | undefined> {
        const url = `${ExtensionConfig.SCHEMA_BASE_URL}/${relativePath}`;

        if (this.cache.has(url)) {
            return this.cache.get(url);
        }

        try {
            const response = await fetch(url);
            if (! response.ok) {
                throw new Error(response.statusText);
            }

            const schemaData = await response.json() as VersionedSchema;
            this.cache.set(url, schemaData);
            return schemaData;
        } catch (error) {
            console.error(`[SchemaFetcher] Error fetching ${url}:`, error);
            return undefined;
        }
    }
}