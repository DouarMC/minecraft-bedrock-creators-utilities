import * as vscode from "vscode";
import { MinecraftProjectType } from "../../types/projectConfig";
import { VscodeUtils } from "../utils/VscodeUtils";
import { MinecraftProjectConfig } from "./MinecraftProjectConfig";
import { minecraftFileRegistry, MinecraftFileTypeKey } from "../minecraft/_fileTypes/minecraftFileRegistry";


export class MinecraftProject {
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

export class AddonMinecraftProject extends MinecraftProject {
    /**
     * Récupère le dossier "addon" du projet
     * @throws {Error} Si le dossier "addon" est introuvable
     * @returns 
     */
    public async getAddonFolder(): Promise<vscode.Uri> {
        const addonFolderUri = vscode.Uri.joinPath(this.folder, "addon");
        if (! await VscodeUtils.isDirectory(addonFolderUri)) {
            throw new Error("Le dossier 'addon' est introuvable dans le projet.");
        }

        return addonFolderUri;
    }

    /**
     * Récupère le dossier "behavior_pack" du projet
     * @throws {Error} Si le dossier "behavior_pack" et/ou "addon" est introuvable
     * @returns 
     */
    public async getBehaviorPackFolder(): Promise<vscode.Uri> {
        const behaviorPackFolderUri = vscode.Uri.joinPath(await this.getAddonFolder(), "behavior_pack");
        if (! await VscodeUtils.isDirectory(behaviorPackFolderUri)) {
            throw new Error("Le dossier 'behavior_pack' est introuvable dans le projet.");
        }

        return behaviorPackFolderUri;
    }

    /**
     * Récupère le dossier "resource_pack" du projet
     * @throws {Error} Si le dossier "resource_pack" et/ou "addon" est introuvable
     * @returns
     */
    public async getResourcePackFolder(): Promise<vscode.Uri> {
        const resourcePackFolderUri = vscode.Uri.joinPath(await this.getAddonFolder(), "resource_pack");
        if (! await VscodeUtils.isDirectory(resourcePackFolderUri)) {
            throw new Error("Le dossier 'resource_pack' est introuvable dans le projet.");
        }

        return resourcePackFolderUri;
    }

    /**
     * Récupère le dossier "scripts" du projet
     * @throws {Error} Si le dossier "scripts" et/ou "addon" est introuvable
     * @returns 
     */
    public async getScriptsFolder(): Promise<vscode.Uri> {
        const scriptsFolderUri = vscode.Uri.joinPath(await this.getAddonFolder(), "scripts");
        if (! await VscodeUtils.isDirectory(scriptsFolderUri)) {
            throw new Error("Le dossier 'scripts' est introuvable dans le projet.");
        }

        return scriptsFolderUri;
    }

    /**
     * Récupère les fichiers data-driven du projet pour le type de fichier donné
     * @throws {Error} Si le type de fichier est inconnu
     * @param dataDrivenFileTypeKey 
     */
    public async getDataDrivenFiles(dataDrivenFileTypeKey: MinecraftFileTypeKey): Promise<vscode.Uri[]> {
        const dataDrivenFiles: vscode.Uri[] = [];

        const dataDrivenFileType = minecraftFileRegistry[dataDrivenFileTypeKey];
        if (! dataDrivenFileType) {
            throw new Error(`Type de fichier inconnu : ${dataDrivenFileTypeKey}`);
        }

        const folder = dataDrivenFileType.packType === "behavior_pack"
            ? await this.getBehaviorPackFolder()
            : await this.getResourcePackFolder();
        
        const collectedFiles = await VscodeUtils.collectFiles({
            folderUri: folder,
            recursive: dataDrivenFileType.subFolder,
            fileNames: dataDrivenFileType.fileNames,
            fileExtensions: dataDrivenFileType.fileExtension,
            excludeFileNames: dataDrivenFileType.excludeFileNames
        });
        
        dataDrivenFiles.push(...collectedFiles);

        return dataDrivenFiles;
    }
}

export class SkinPackMinecraftProject extends MinecraftProject {
    // À implémenter plus tard
}

export class WorldTemplateMinecraftProject extends MinecraftProject {
    // À implémenter plus tard
}