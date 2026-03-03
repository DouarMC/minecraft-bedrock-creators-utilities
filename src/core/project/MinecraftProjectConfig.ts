import { MinecraftProduct, MinecraftProjectType, ProjectMetadata } from "../../types/projectConfig";

/**
 * Représente la configuration d'un projet Minecraft Bedrock, avec les métadonnées et les options spécifiques au projet.
 */
export class MinecraftProjectConfig {
    /**
     * Les métadonnées du projet, incluant le type de projet, l'ID, le nom d'affichage, l'auteur et le produit Minecraft ciblé.
     */
    public metadata: ProjectMetadata;

    /**
     * Les options spécifiques au projet.
     */
    public options: {
        /**
         * Catégorie d'options liées au déploiement du projet.
         */
        deploy: {
            /**
             * Indique si l'extension demandera à l'utilisateur de lancer Minecraft après le déploiement du projet, si Minecraft n'est pas déjà en cours d'exécution.
             */
            prompt_to_launch_minecraft: boolean;
        };
    };

    /**
     * Crée une instance de MinecraftProjectConfig à partir d'un objet brut
     * @throws {Error} Si la configuration est invalide
     * @param rawConfig Le contenu brut de la configuration
     */
    public constructor(rawConfig: any) {
        if (! rawConfig || typeof rawConfig !== "object") { // Vérifie que la configuration est un objet valide
            throw new Error("Configuration de projet invalide : objet JSON attendu.");
        }

        // verifie que metadata est le bon type.
        const metadata = rawConfig.metadata; 
        if (! metadata || typeof metadata !== "object") {
            throw new Error("Configuration de projet invalide : 'metadata' manquant ou invalide.");
        }

        // Vérifie que les champs requis dans metadata sont présents et ont le bon type, et que les valeurs de type et minecraftProduct sont reconnues
        const {type, id, displayName, author, minecraftProduct} = metadata;
        if (typeof type !== "string") {
            throw new Error("Configuration de projet invalide : 'metadata.type' n'est pas une chaîne de caractères.");
        }
        if (! Object.values(MinecraftProjectType).includes(type as MinecraftProjectType)) {
            throw new Error(`Configuration de projet invalide : 'metadata.type' a une valeur non reconnue : ${type}`);
        }
        if (typeof id !== "string") {
            throw new Error("Configuration de projet invalide : 'metadata.id' n'est pas une chaîne de caractères.");
        }
        if (id.trim().length === 0) {
            throw new Error("Configuration de projet invalide : 'metadata.id' est une chaîne vide.");
        }
        if (typeof displayName !== "string") {
            throw new Error("Configuration de projet invalide : 'metadata.displayName' n'est pas une chaîne de caractères.");
        }
        if (typeof author !== "string") {
            throw new Error("Configuration de projet invalide : 'metadata.author' n'est pas une chaîne de caractères.");
        }
        if (typeof minecraftProduct !== "string") {
            throw new Error("Configuration de projet invalide : 'metadata.minecraftProduct' n'est pas une chaîne de caractères.");
        }
        if (! Object.values(MinecraftProduct).includes(minecraftProduct as MinecraftProduct)) {
            throw new Error(`Configuration de projet invalide : 'metadata.minecraftProduct' a une valeur non reconnue : ${minecraftProduct}`);
        }

        // Si toutes les vérifications sont passées, on peut assigner les valeurs à la configuration du projet
        this.metadata = {
            type: type as MinecraftProjectType,
            id,
            displayName,
            author,
            minecraftProduct: minecraftProduct as MinecraftProduct
        };
        
        this.options = typeof rawConfig.options === "object" ? rawConfig.options : {};
    }

    /**
     * Crée une instance de MinecraftProjectConfig à partir d'une chaîne JSON ou d'un objet
     * @param json La chaîne JSON ou l'objet brut
     * @throws {Error} Si la configuration est invalide
     * @returns 
     */
    public static fromJSON(json: string | object): MinecraftProjectConfig {
        const data = typeof json === "string" ? JSON.parse(json) : json;
        return new MinecraftProjectConfig(data);
    }

    /**
     * Exporte en JSON lisible (pour sauvegarde, debug, etc.)
     * @returns 
     */
    public toJSON(): object {
        return {
            metadata: this.metadata,
            options: this.options
        };
    }
}