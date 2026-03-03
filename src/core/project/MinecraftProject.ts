import * as vscode from "vscode";
import { MinecraftProjectType } from "../../types/projectConfig";
import { VscodeUtils } from "../utils/VscodeUtils";
import { MinecraftProjectConfig } from "./MinecraftProjectConfig";

export class MinecraftProject {
    /**
     * Contient le nom du fichier de configuration du projet Minecraft, qui doit être présent à la racine du dossier du projet pour que celui-ci soit reconnu comme un projet Minecraft valide. Ce fichier contient les métadonnées et les options spécifiques au projet.
     */
    public static readonly PROJECT_CONFIG_FILE_NAME = ".mcbe_project.json";

    public readonly folder: vscode.Uri;
    public config: MinecraftProjectConfig;

    public constructor(projectFolder: vscode.Uri, config: MinecraftProjectConfig) {
        this.folder = projectFolder;
        this.config = config;
    }

    /**
     * Charge le projet Minecraft à partir du dossier de travail ouvert
     * @throws {Error} Si aucun dossier de travail n'est ouvert, ou si la configuration est invalide
     * @param folder Le dossier du projet
     * @returns 
     */
    public static async load(folder: vscode.Uri): Promise<MinecraftProject> {
        if (! await this.isMinecraftProjectFolder(folder)) {
            throw new Error("Le dossier de travail ouvert n'est pas un dossier de projet Minecraft.");
        }

        const config = await this.getConfigFromFile(folder);

        if (config.metadata.type === MinecraftProjectType.Addon) {
            return new AddonMinecraftProject(folder, config);
        } else if (config.metadata.type === MinecraftProjectType.SkinPack) {
            return new SkinPackMinecraftProject(folder, config);
        } else {
            return new WorldTemplateMinecraftProject(folder, config);
        }
    }

    /**
     * Vérifie si le fichier de configuration du projet existe dans le dossier donné
     * @param projectFolder Le dossier du projet
     * @throws {Error} Si une erreur survient lors de la vérification du fichier
     * @returns 
     */
    public static async isProjectConfigFileExists(projectFolder: vscode.Uri): Promise<boolean> {
        const projectConfigUri = vscode.Uri.joinPath(projectFolder, MinecraftProject.PROJECT_CONFIG_FILE_NAME);
        return await VscodeUtils.isFile(projectConfigUri);
    }

    /**
     * Vérifie si le dossier donné est un dossier de projet Minecraft
     * @param folder Le dossier à vérifier
     * @throws {Error} Si une erreur survient lors de la vérification du fichier de configuration
     * @returns 
     */
    public static async isMinecraftProjectFolder(folder: vscode.Uri): Promise<boolean> {
        return await this.isProjectConfigFileExists(folder);
    }

    /**
     * Récupère la configuration à partir du fichier de configuration du dossier donné
     * @param projectFolder Le dossier du projet
     * @throws {Error} Si le fichier de configuration est introuvable ou illisible, ou si la configuration est invalide
     * @returns 
     */
    public static async getConfigFromFile(projectFolder: vscode.Uri): Promise<MinecraftProjectConfig> {
        const projectConfigUri = vscode.Uri.joinPath(projectFolder, MinecraftProject.PROJECT_CONFIG_FILE_NAME);
        if (! VscodeUtils.isFile(projectConfigUri)) {
            throw new Error(`Le fichier de configuration du projet est introuvable : ${projectConfigUri.fsPath}`);
        }

        const fileContent = await vscode.workspace.fs.readFile(projectConfigUri);
        const json = JSON.parse(Buffer.from(fileContent).toString("utf8"));
        return MinecraftProjectConfig.fromJSON(json);
    }

    public get id(): string { return this.config.metadata.id; }
    public get minecraftProduct() { return this.config.metadata.minecraftProduct; }
    public get options() { return this.config.options; }

    /**
     * Récupère l'URI du fichier de configuration du projet
     * @throws {Error} Si le fichier de configuration est introuvable
     * @returns 
     */
    public async getConfigFileUri(): Promise<vscode.Uri> {
        const projectConfigUri = vscode.Uri.joinPath(this.folder, MinecraftProject.PROJECT_CONFIG_FILE_NAME);
        if (! await VscodeUtils.isFile(projectConfigUri)) {
            throw new Error(`Le fichier de configuration du projet est introuvable : ${projectConfigUri.fsPath}`);
        }
        return projectConfigUri;
    }

    /**
     * Récupère l'URI du fichier package.json du projet
     * @throws {Error} Si le fichier package.json est introuvable
     * @returns 
     */
    public async getPackageJsonFileUri(): Promise<vscode.Uri> {
        const packageJsonUri = vscode.Uri.joinPath(this.folder, "package.json");
        if (! await VscodeUtils.isFile(packageJsonUri)) {
            throw new Error(`Le fichier 'package.json' est introuvable dans le projet : ${packageJsonUri.fsPath}`);
        }

        return packageJsonUri;
    }
}

/**
 * Classe représentant un projet Minecraft Bedrock de type Addon
 */
export class AddonMinecraftProject extends MinecraftProject {
    /**
     * Récupère le dossier "addon" du projet
     * @throws {Error} Si le dossier "addon" est introuvable
     * @returns 
     */
    public async getAddonFolder(): Promise<vscode.Uri> {
        const addonFolderUri = vscode.Uri.joinPath(this.folder, "addon");

        let isDirectory: boolean;
        try {
            isDirectory = await VscodeUtils.isDirectory(addonFolderUri);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Le dossier 'addon' est inaccessible dans le projet : ${error.message}`);
            }

            throw error;
        }

        if (isDirectory === false) {
            throw new Error("Le dossier 'addon' est introuvable dans le projet.");
        }

        return addonFolderUri;
    }

    /**
     * Récupère le dossier "behavior_pack" du projet ou ne retourne pas d'URI s'il n'existe pas
     * @throws {Error} Si le dossier "addon" est introuvable/inaccessible, ou si le dossier "behavior_pack" est inaccessible
     * @returns 
     */
    public async getBehaviorPackFolder(): Promise<vscode.Uri | undefined> {
        // On tente de récuperer le dossier addon
        let addonFolderUri: vscode.Uri;
        try {
            addonFolderUri = await this.getAddonFolder();
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Impossible de récupérer le dossier 'behavior_pack' : ${error.message}`);
            }

            throw error;
        }

        // Si le dossier addon est récupéré, on peut tenter de récupérer le dossier behavior_pack à l'intérieur
        const behaviorPackFolderUri = vscode.Uri.joinPath(addonFolderUri, "behavior_pack");
        let isBehaviorPackDirectory: boolean;
        try {
            isBehaviorPackDirectory = await VscodeUtils.isDirectory(behaviorPackFolderUri);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Le dossier 'behavior_pack' est inaccessible dans le projet : ${error.message}`);
            }

            throw error;
        }

        if (isBehaviorPackDirectory === false) {
            return undefined; // Si le dossier behavior_pack n'existe pas, on retourne undefined au lieu de lancer une erreur, car ce dossier est optionnel dans un projet Addon
        }

        return behaviorPackFolderUri;
    }

    /**
     * Récupère le dossier "resource_pack" du projet
     * @throws {Error} Si le dossier "addon" est introuvable/inaccessible, ou si le dossier "resource_pack" est inaccessible
     * @returns
     */
    public async getResourcePackFolder(): Promise<vscode.Uri | undefined> {
        let addonFolderUri: vscode.Uri;
        try {
            addonFolderUri = await this.getAddonFolder();
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Impossible de récupérer le dossier 'resource_pack' : ${error.message}`);
            }

            throw error;
        }

        const resourcePackFolderUri = vscode.Uri.joinPath(addonFolderUri, "resource_pack");
        let isResourcePackDirectory: boolean;
        try {
            isResourcePackDirectory = await VscodeUtils.isDirectory(resourcePackFolderUri);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Le dossier 'resource_pack' est inaccessible dans le projet : ${error.message}`);
            }

            throw error;
        }

        if (isResourcePackDirectory === false) {
            return undefined; // Si le dossier resource_pack n'existe pas, on retourne undefined au lieu de lancer une erreur, car ce dossier est optionnel dans un projet Addon
        }

        return resourcePackFolderUri;
    }

    /**
     * Récupère le dossier "scripts" du projet
     * @throws {Error} Si le dossier "addon" est introuvable ou si le dossier "scripts" est inaccessible
     * @returns 
     */
    public async getScriptsFolder(): Promise<vscode.Uri | undefined> {
        let addonFolderUri: vscode.Uri;
        try {
            addonFolderUri = await this.getAddonFolder();
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Impossible de récupérer le dossier 'scripts' : ${error.message}`);
            }

            throw error;
        }

        const scriptsFolderUri = vscode.Uri.joinPath(addonFolderUri, "scripts");
        let isScriptsDirectory: boolean;
        try {
            isScriptsDirectory = await VscodeUtils.isDirectory(scriptsFolderUri);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Le dossier 'scripts' est inaccessible dans le projet : ${error.message}`);
            }

            throw error;
        }

        if (isScriptsDirectory === false) {
            return undefined; // Si le dossier scripts n'existe pas, on retourne undefined au lieu de lancer une erreur, car ce dossier est optionnel dans un projet Addon
        }

        return scriptsFolderUri;
    }
}

export class SkinPackMinecraftProject extends MinecraftProject {
    // TODO
}

export class WorldTemplateMinecraftProject extends MinecraftProject {
    // TODO
}