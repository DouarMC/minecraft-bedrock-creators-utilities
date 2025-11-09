import * as vscode from "vscode";
import { VscodeUtils } from "../utils/VscodeUtils";
import { minecraftFileRegistry, MinecraftFileTypeKey } from "./fileTypes/minecraftFileRegistry";

export abstract class MinecraftGame {
    /**
     * Nom du dossier d'installation du jeu Minecraft Bedrock.
     */
    protected abstract readonly installFolderName: string;
    /**
     * Nom du dossier des données utilisateur du jeu Minecraft Bedrock.
     */
    protected abstract readonly userDataFolderName: string;

    /**
     * Vérifie si le jeu Minecraft Bedrock est installé sur le système en utilisant les conventions de dossiers standards.
     * @returns 
     */
    public async isInstalled(): Promise<boolean> {
        try {
            await this.getDataFolder();
            await this.getComMojangFolder();
            return true;
        } catch(error) {
            console.log("Minecraft Bedrock n'est pas installé.", error);
            return false;
        }
    }

    /**
     * Récupère le dossier des données du jeu Minecraft Bedrock.
     * @throws {Error} Si le dossier des données ne peut pas être trouvé.
     * @returns 
     */
    public async getDataFolder(): Promise<vscode.Uri> {
        VscodeUtils.ensureWindowsPlatform();

        const minecraftInstallFolder = vscode.Uri.file(`C:\\XboxGames\\${this.installFolderName}`);

        if (! await VscodeUtils.isDirectory(minecraftInstallFolder)) {
            throw new Error(`Le dossier d'installation de ${this.installFolderName} est introuvable.`);
        }

        const dataFolder = vscode.Uri.joinPath(minecraftInstallFolder, "Content", "data");
        if (! await VscodeUtils.isDirectory(dataFolder)) {
            throw new Error(`Le dossier des données de ${this.installFolderName} est introuvable.`);
        }

        return dataFolder;
    }

    /**
     * Récupère le dossier com.mojang du jeu Minecraft Bedrock.
     * @throws {Error} Si le dossier com.mojang ne peut pas être trouvé.
     * @returns 
     */
    public async getComMojangFolder(): Promise<vscode.Uri> {
        VscodeUtils.ensureWindowsPlatform();

        const appData = process.env.APPDATA;
        if (! appData) {
            throw new Error("Impossible de déterminer le dossier AppData.");
        }

        const comMojangFolder = vscode.Uri.joinPath(vscode.Uri.file(appData), this.userDataFolderName, "Users", "Shared", "games", "com.mojang");

        if (! await VscodeUtils.isDirectory(comMojangFolder)) {
            throw new Error(`Le dossier com.mojang de ${this.userDataFolderName} est introuvable.`);
        }

        return comMojangFolder;
    }

    /**
     * Récupère le dossier definitions du jeu Minecraft Bedrock.
     * @throws {Error} Si le dossier definitions ne peut pas être trouvé.
     * @returns
     */
    public async getDefinitionsFolder(): Promise<vscode.Uri> {
        const dataFolder = await this.getDataFolder();
        const definitionsFolder = vscode.Uri.joinPath(dataFolder, "definitions");

        if (! await VscodeUtils.isDirectory(definitionsFolder)) {
            throw new Error("Le dossier definitions est introuvable.");
        }

        return definitionsFolder;
    }

    /**
     * Récupère les dossiers des behavior packs vanilla du jeu Minecraft Bedrock.
     * @throws {Error} Si les dossiers des behavior packs ne peuvent pas être trouvés.
     * @returns 
     */
    public async getVanillaBehaviorPackFolders(): Promise<vscode.Uri[]> {
        const dataFolder = await this.getDataFolder();
        const behaviorPacksFolder = vscode.Uri.joinPath(dataFolder, "behavior_packs");
        if (! await VscodeUtils.isDirectory(behaviorPacksFolder)) {
            throw new Error("Le dossier `behavior_packs` n'existe pas ou n'est pas un répertoire valide.");
        }

        const behaviorPackUris: vscode.Uri[] = [];
        const behaviorPackEntries = await vscode.workspace.fs.readDirectory(behaviorPacksFolder);
        for (const [name, type] of behaviorPackEntries) {
            if (type === vscode.FileType.Directory) {
                behaviorPackUris.push(vscode.Uri.joinPath(behaviorPacksFolder, name));
            }
        }

        return behaviorPackUris;
    }

    /**
     * Récupère les dossiers des resource packs vanilla du jeu Minecraft Bedrock.
     * @throws {Error} Si les dossiers des resource packs ne peuvent pas être trouvés.
     * @returns 
     */
    public async getVanillaResourcePackFolders(): Promise<vscode.Uri[]> {
        const dataFolder = await this.getDataFolder();
        const resourcePacksFolder = vscode.Uri.joinPath(dataFolder, "resource_packs");
        if (! await VscodeUtils.isDirectory(resourcePacksFolder)) {
            throw new Error("Le dossier `resource_packs` n'existe pas ou n'est pas un répertoire valide.");
        }

        const resourcePackUris: vscode.Uri[] = [];
        const resourcePackEntries = await vscode.workspace.fs.readDirectory(resourcePacksFolder);
        for (const [name, type] of resourcePackEntries) {
            if (type === vscode.FileType.Directory) {
                resourcePackUris.push(vscode.Uri.joinPath(resourcePacksFolder, name));
            }
        }

        return resourcePackUris;
    }

    /**
     * Récupère les fichiers data-driven du jeu pour le type de fichier donné
     * @throws {Error} Si le type de fichier est inconnu
     * @param dataDrivenFileTypeKey La clé du type de fichier data-driven
     * @returns 
     */
    public async getDataDrivenFiles(dataDrivenFileTypeKey: MinecraftFileTypeKey): Promise<vscode.Uri[]> {
        const dataDrivenFiles: vscode.Uri[] = [];

        const dataDrivenFileType = minecraftFileRegistry[dataDrivenFileTypeKey];
        if (! dataDrivenFileType) {
            throw new Error(`Type de fichier data-driven inconnu : ${dataDrivenFileTypeKey}`);
        }

        const searchParentFolders: vscode.Uri[] = [];
        if (dataDrivenFileType.searchInDefinitionsFolder === true) {
            searchParentFolders.push(await this.getDefinitionsFolder());
        }

        if (dataDrivenFileType.packType === "behavior_pack") {
            searchParentFolders.push(...await this.getVanillaBehaviorPackFolders());
        } else if (dataDrivenFileType.packType === "resource_pack") {
            searchParentFolders.push(...await this.getVanillaResourcePackFolders());
        }

        for (const parentFolder of searchParentFolders) {
            const fullUri = VscodeUtils.resolveRelativePath(parentFolder, dataDrivenFileType.pathFolder);
            if (! await VscodeUtils.isDirectory(fullUri)) {
                continue;
            }

            const collectedFiles = await VscodeUtils.collectFiles({
                folderUri: fullUri,
                recursive: dataDrivenFileType.subFolder,
                fileNames: dataDrivenFileType.fileNames,
                fileExtensions: dataDrivenFileType.fileExtension,
                excludeFileNames: dataDrivenFileType.excludeFileNames
            });

            dataDrivenFiles.push(...collectedFiles);
        }

        return dataDrivenFiles;
    }
}