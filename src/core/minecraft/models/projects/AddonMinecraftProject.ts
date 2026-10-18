import { MinecraftProject } from "./MinecraftProject";
import * as path from "path";

/**
 * Classe représentant un projet Minecraft Bedrock de type "Addon".
 */
export class AddonMinecraftProject extends MinecraftProject {
    /**
     * Retourne le chemin du dossier "addon" du projet.
     * @returns 
     */
    public getAddonPath(): string {
        return path.join(this.folder, "addon");
    }

    /**
     * Retourne le chemin du dossier "behavior_pack" du projet.
     * @returns 
     */
    public getBehaviorPackPath(): string {
        return path.join(this.getAddonPath(), "behavior_pack");
    }

    /**
     * Retourne le chemin du dossier "resource_pack" du projet.
     * @returns
     */
    public getResourcePackPath(): string {
        return path.join(this.getAddonPath(), "resource_pack");
    }

    /**
     * Retourne le chemin du dossier "scripts" du projet.
     * @returns 
     */
    public getScriptsPath(): string {
        return path.join(this.getAddonPath(), "scripts");   
    }
}