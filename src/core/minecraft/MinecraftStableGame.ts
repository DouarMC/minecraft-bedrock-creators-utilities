import * as vscode from "vscode";
import { VscodeUtils } from "../utils/VscodeUtils";
import { minecraftFileRegistry, MinecraftFileTypeKey } from "./fileTypes/minecraftFileRegistry";

export class MinecraftStableGame {
    public static readonly packagePrefix = "Microsoft.MinecraftUWP";
    public static readonly packageSuffix = "8wekyb3d8bbwe";

    public static get packageFull(): string {
        return `${this.packagePrefix}_${this.packageSuffix}`;
    }

    /**
     * Renvoie le dossier `data` de Minecraft Stable.
     * @throws {Error} Lève une erreur si le dossier ne peut pas être déterminé.
     * @returns L'URI du dossier, ou `undefined` si Minecraft n'est pas installé.
     */
    public static async getDataFolder(): Promise<vscode.Uri> {
        const programFiles = process.env.PROGRAMFILES;
        if (programFiles === undefined) {
            throw new Error("Impossible de déterminer le dossier Program Files.");
        }

        const windowsAppsUri = vscode.Uri.joinPath(vscode.Uri.file(programFiles), 'WindowsApps');

        try {
            const entries = await vscode.workspace.fs.readDirectory(windowsAppsUri);

            const match = entries.find(([name, type]) =>
                type === vscode.FileType.Directory &&
                name.startsWith(this.packagePrefix) &&
                name.endsWith(this.packageSuffix)
            );

            if (match === undefined) {
                throw new Error("Minecraft Stable n'est pas installé sur cette machine.");
            }

            const dataUri = vscode.Uri.joinPath(windowsAppsUri, match[0], 'data');

            if (await VscodeUtils.isDirectory(dataUri) === false) {
                throw new Error("Le dossier `data` de Minecraft Stable n'existe pas ou n'est pas un répertoire valide.");
            }

            return dataUri;
        } catch (error) {
            throw new Error("Erreur lors de la lecture du dossier WindowsApps.", {cause: error});
        }
    }

    /**
     * Renvoie le dossier `com.mojang` de Minecraft Stable.
     * @throws {Error} Lève une erreur si le dossier ne peut pas être déterminé.
     * @returns L'URI du dossier com.mojang.
     */
    public static async getComMojangFolder(): Promise<vscode.Uri> {
        const localAppData = process.env.LOCALAPPDATA;
        if (localAppData === undefined) {
            throw new Error("Impossible de déterminer le dossier Local AppData.");
        }

        const comMojangUri = vscode.Uri.joinPath(vscode.Uri.file(localAppData), 'Packages', this.packageFull, 'LocalState', 'games', 'com.mojang');

        if (await VscodeUtils.isDirectory(comMojangUri) === false) {
            throw new Error("Le dossier `com.mojang` de Minecraft Stable n'existe pas ou n'est pas un répertoire valide.");
        }

        return comMojangUri;
    }

    /**
     * Renvoie le dossier `definitions` de Minecraft Stable.
     * @throws {Error} Lève une erreur si le dossier ne peut pas être déterminé.
     * @returns L'URI du dossier definitions.
     */
    public static async getDefinitionsFolder(): Promise<vscode.Uri> {
        const dataFolder = await this.getDataFolder();
        const definitionsUri = vscode.Uri.joinPath(dataFolder, "definitions");

        if (await VscodeUtils.isDirectory(definitionsUri) === false) {
            throw new Error("Le dossier `definitions` de Minecraft Stable n'existe pas ou n'est pas un répertoire valide.");
        }

        return definitionsUri;
    }

    /**
     * Renvoie les dossiers des behavior packs vanilla de Minecraft Stable.
     * @throws {Error} Lève une erreur si les dossiers ne peuvent pas être déterminés.
     * @returns Les URIs des dossiers des behavior packs.
     */
    public static async getVanillaBehaviorPackFolders(): Promise<vscode.Uri[]> {
        const dataFolder = await this.getDataFolder();
        const behaviorPacksUri = vscode.Uri.joinPath(dataFolder, "behavior_packs");
        if (await VscodeUtils.isDirectory(behaviorPacksUri) === false) {
            throw new Error("Le dossier `behavior_packs` de Minecraft Stable n'existe pas ou n'est pas un répertoire valide.");
        }

        const behaviorPackUris: vscode.Uri[] = [];
        const entries = await vscode.workspace.fs.readDirectory(behaviorPacksUri);
        for (const [name, type] of entries) {
            if (type === vscode.FileType.Directory) {
                behaviorPackUris.push(vscode.Uri.joinPath(behaviorPacksUri, name));
            }
        }

        return behaviorPackUris;
    }

    /**
     * Renvoie les dossiers des resource packs vanilla de Minecraft Stable.
     * @throws {Error} Lève une erreur si les dossiers ne peuvent pas être déterminés.
     * @returns Les URIs des dossiers des resource packs.
     */
    public static async getVanillaResourcePackFolders(): Promise<vscode.Uri[]> {
        const dataFolder = await this.getDataFolder();
        const resourcePacksUri = vscode.Uri.joinPath(dataFolder, "resource_packs");
        if (await VscodeUtils.isDirectory(resourcePacksUri) === false) {
            throw new Error("Le dossier `resource_packs` de Minecraft Stable n'existe pas ou n'est pas un répertoire valide.");
        }

        const resourcePackUris: vscode.Uri[] = [];
        const entries = await vscode.workspace.fs.readDirectory(resourcePacksUri);
        for (const [name, type] of entries) {
            if (type === vscode.FileType.Directory) {
                resourcePackUris.push(vscode.Uri.joinPath(resourcePacksUri, name));
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
    public static async getDataDrivenFiles(dataDrivenFileTypeKey: MinecraftFileTypeKey): Promise<vscode.Uri[]> {
        const dataDrivenFiles: vscode.Uri[] = [];

        const dataDrivenFileType = minecraftFileRegistry[dataDrivenFileTypeKey];
        if (! dataDrivenFileType) {
            throw new Error(`Type de fichier inconnu : ${dataDrivenFileTypeKey}`);
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
                throw new Error(`Le dossier ${fullUri.fsPath} n'existe pas ou n'est pas un répertoire valide.`);
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