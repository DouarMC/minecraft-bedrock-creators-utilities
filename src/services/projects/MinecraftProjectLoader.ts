import * as vscode from "vscode";
import { VscodeUtils } from "../../vscode-utils/VscodeUtils";
import { MinecraftProjectConfig } from "../../core/minecraft/models/projects/MinecraftProjectConfig";
import { MinecraftProject } from "../../core/minecraft/models/projects/MinecraftProject";
import { AddonMinecraftProject } from "../../core/minecraft/models/projects/AddonMinecraftProject";

export class MinecraftProjectLoader {
    /**
     * Le nom du fichier de configuration d'un projet Minecraft, qui doit être présent à la racine du dossier du projet pour qu'il soit reconnu comme un projet Minecraft valide.
     */
    public static readonly CONFIG_FILE_NAME = ".mcbe_project.json";

    /**
     * Charge un projet Minecraft à partir d'un dossier donné, en lisant et validant le fichier de configuration du projet. Le type de projet chargé dépend du champ "metadata.type" dans la configuration.
     * @param folder Le dossier à partir duquel charger le projet Minecraft
     * @returns 
     */
    public static async load(folder: vscode.Uri): Promise<MinecraftProject | undefined> {
        // Vérifie que le dossier contient un projet Minecraft valide en recherchant le fichier de configuration du projet à la racine du dossier
        if (! await this.isProjectFolder(folder)) {
            console.warn(`[MBCU] Le dossier n'est pas un projet Minecraft valide (fichier de configuration manquant) : ${folder.fsPath}`);
            return;
        }

        // Recuperation de la configuration du projet Minecraft
        const config = await this.getConfig(folder);
        if (! config) {
            return;
        }

        const folderPath = folder.fsPath;

        switch (config.metadata.type) {
            case "addon":
                return new AddonMinecraftProject(folderPath, config);
            case "skin_pack":
                // return new SkinPackMinecraftProject(folderPath, config); FLAG
            case "world_template":
                // return new WorldTemplateMinecraftProject(folderPath, config); FLAG
        }
    }

    /**
     * Vérifie si un dossier donné contient un projet Minecraft valide en recherchant le fichier de configuration du projet à la racine du dossier.
     * @param folder Le dossier à vérifier
     * @returns 
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
     */
    private static async getConfig(folder: vscode.Uri): Promise<MinecraftProjectConfig | undefined> {
        const configUri = vscode.Uri.joinPath(folder, this.CONFIG_FILE_NAME);
        try {
            if (! await VscodeUtils.isFile(configUri)) {
                return;
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