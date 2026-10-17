import * as vscode from "vscode";
import { VscodeUtils } from "../../vscode-utils/VscodeUtils";
import { MinecraftProjectConfig } from "../../core/minecraft/models/projects/MinecraftProjectConfig";
import { MinecraftProject } from "../../core/minecraft/models/projects/MinecraftProject";
import { AddonMinecraftProject } from "../../core/minecraft/models/projects/AddonMinecraftProject";

export class MinecraftProjectLoader {
    /**
     * Le nom du fichier de configuration d'un projet Minecraft, qui doit être présent à la racine du dossier du projet pour qu'il soit reconnu comme un projet Minecraft valide.
     * @verified
     */
    public static readonly CONFIG_FILE_NAME = ".mcbe_project.json";

    /**
     * Charge un projet Minecraft à partir d'un dossier donné, en lisant et validant le fichier de configuration du projet. Le type de projet chargé dépend du champ "metadata.type" dans la configuration.
     * @param folder Le dossier à partir duquel charger le projet Minecraft
     * @throws {Error} Si le dossier ne contient pas un projet Minecraft valide (fichier de configuration manquant ou invalide)
     * @returns 
     */
    public static async load(folder: vscode.Uri): Promise<MinecraftProject> {
        // Vérifie que le dossier contient un projet Minecraft valide en recherchant le fichier de configuration du projet à la racine du dossier
        if (! await this.isProjectFolder(folder)) {
            throw new Error(`Le dossier n'est pas un projet Minecraft valide (fichier de configuration manquant) : ${folder.fsPath}`);
        }

        // Recuperation de la configuration du projet Minecraft
        const projectConfig = await this.getConfig(folder);
        if (! projectConfig) {
            throw new Error(`Impossible de lire ou de parser le fichier de configuration du projet Minecraft : ${folder.fsPath}`);
        }

        const folderPath = folder.fsPath;

        switch (projectConfig.metadata.type) {
            case "addon":
                return new AddonMinecraftProject(folderPath, projectConfig);
            case "skin_pack":
                // return new SkinPackMinecraftProject(folderPath, config); FLAG
            case "world_template":
                // return new WorldTemplateMinecraftProject(folderPath, config); FLAG
            default:
                throw new Error(`Type de projet Minecraft non supporté : ${projectConfig.metadata.type}`);
        }
    }

    /**
     * Vérifie si un dossier donné contient un projet Minecraft valide en recherchant le fichier de configuration du projet à la racine du dossier.
     * @param folder Le dossier à vérifier
     * @returns
     * @verified
     */
    public static async isProjectFolder(folder: vscode.Uri): Promise<boolean> {
        const configUri = vscode.Uri.joinPath(folder, this.CONFIG_FILE_NAME);
        try {
            return await VscodeUtils.isFile(configUri);
        } catch {
            return false;
        }
    }

    /**
     * Lit et parse le fichier de configuration du projet Minecraft à partir d'un dossier donné, en validant sa structure et son contenu
     * @param folder Le dossier à partir duquel lire le fichier de configuration du projet Minecraft
     * @returns 
     * @verified
     */
    private static async getConfig(folder: vscode.Uri): Promise<MinecraftProjectConfig | undefined> {
        const configUri = vscode.Uri.joinPath(folder, this.CONFIG_FILE_NAME);
        try {
            if (! await VscodeUtils.isFile(configUri)) {
                return undefined;
            }
            const fileContent = await vscode.workspace.fs.readFile(configUri);
            const json = JSON.parse(Buffer.from(fileContent).toString("utf8"));
            return MinecraftProjectConfig.fromJSON(json);
        } catch (error) {
            console.error(`[MBCU] Erreur lors de la lecture du fichier de configuration du projet Minecraft : ${configUri.fsPath}`, error);
            return;
        }
    }
}