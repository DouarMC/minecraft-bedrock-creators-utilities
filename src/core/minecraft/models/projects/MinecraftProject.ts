import { MinecraftProduct } from "../MinecraftTypes";
import { MinecraftProjectConfig } from "./MinecraftProjectConfig";

/**
 * Classe abstraite représentant un projet Minecraft Bedrock.
 */
export abstract class MinecraftProject {
    /**
     * Chemin du dossier racine du projet Minecraft Bedrock.
     */
    public readonly folder: string;

    /**
     * Configuration du projet Minecraft Bedrock.
     */
    public config: MinecraftProjectConfig;

    public constructor(projectFolder: string, config: MinecraftProjectConfig) {
        this.folder = projectFolder;
        this.config = config;
    }

    /**
     * Retourne l'identifiant unique du projet Minecraft Bedrock.
     */
    public get id(): string { 
        return this.config.metadata.id; 
    }

    /**
     * Retourne le type de produit Minecraft associé au projet (stable ou preview).
     */
    public get minecraftProduct(): MinecraftProduct { 
        return this.config.metadata.minecraftProduct; 
    }

    /**
     * Retourne les options de configuration du projet Minecraft Bedrock.
     */
    public get options() { 
        return this.config.options; 
    }
}