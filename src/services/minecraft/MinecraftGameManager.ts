import * as vscode from "vscode";
import { MinecraftProject } from "../../core/minecraft/models/projects/MinecraftProject";
import { MinecraftGame } from "../../core/minecraft/models/games/MinecraftGame";
import { MinecraftPreviewGame } from "../../core/minecraft/models/games/MinecraftPreviewGame";
import { MinecraftStableGame } from "../../core/minecraft/models/games/MinecraftStableGame";
import { FileSystemUtils } from "../../vscode-utils/FileSystemUtils";
import { VscodeUtils } from "../../vscode-utils/VscodeUtils";


export class MinecraftGameManager {
    private static stableGame: MinecraftStableGame | undefined;
    private static previewGame: MinecraftPreviewGame | undefined;

    /**
     * Initialise les installations de Minecraft Bedrock.
     */
    public static async initialize(): Promise<void> {
        const stableGame = new MinecraftStableGame();
        const previewGame = new MinecraftPreviewGame();
        
        if (await this.isInstalled(stableGame)) {
            this.stableGame = stableGame;
        }
        if (await this.isInstalled(previewGame)) {
            this.previewGame = previewGame;
        }
    }

    /**
     * Récupère l'installation de Minecraft Bedrock Preview.
     * @throws {Error} Si Minecraft Bedrock Preview n'est pas installé.
     * @returns 
     */
    public static getStableGame(): MinecraftStableGame {
        if (! this.stableGame) {
            throw new Error("Minecraft Bedrock Stable n'est pas installé.");
        }

        return this.stableGame;
    }

    /**
     * Récupère l'installation de Minecraft Bedrock Preview.
     * @throws {Error} Si Minecraft Bedrock Preview n'est pas installé.
     * @returns 
     */
    public static getPreviewGame(): MinecraftPreviewGame {
        if (! this.previewGame) {
            throw new Error("Minecraft Bedrock Preview n'est pas installé.");
        }

        return this.previewGame;
    }

    public static getMinecraftGameForProject(minecraftProject: MinecraftProject): MinecraftGame | undefined {
        const minecraftProduct = minecraftProject.minecraftProduct;
        if (minecraftProduct === "stable") {
            return this.stableGame;
        } else if (minecraftProduct === "preview") {
            return this.previewGame;
        } else {
            return undefined;
        }
    }

    public static async isInstalled(game: MinecraftGame): Promise<boolean> {
        try {
            FileSystemUtils.ensureWindowsPlatform();
        } catch (error) {
            console.log("La vérification de l'installation de Minecraft n'est disponible que sur Windows.", error);
            return false;
        }

        try {
            await this.getComMojangFolder(game);
            await this.getDataFolder(game);
            return true;
        } catch(error) {
            console.log(`Minecraft ${game} n'est pas installé.`, error);
            return false;
        }
    }

    /**
     * Récupère le dossier des données du jeu Minecraft Bedrock.
     * @param game Le jeu Minecraft (Stable ou Preview) pour lequel récupérer le dossier des données.
     * @returns
     * @throws {Error} Si le dossier des données ne peut pas être trouvé.
     */
    public static async getDataFolder(game: MinecraftGame): Promise<vscode.Uri> {
        const minecraftInstallFolder = vscode.Uri.file(`C:\\XboxGames\\${game.installFolderName}`);

        try {
            if (! await VscodeUtils.isDirectory(minecraftInstallFolder)) {
                throw new Error(`Le dossier d'installation de ${game.installFolderName} est introuvable.`);
            }
        } catch (error) {
            throw new Error(`Le dossier d'installation de ${game.installFolderName} est introuvable.`);
        }

        const dataFolder = vscode.Uri.joinPath(minecraftInstallFolder, "Content", "data");
        try {
            if (! await VscodeUtils.isDirectory(dataFolder)) {
                throw new Error(`Le dossier des données de ${game.installFolderName} est introuvable.`);
            }
        } catch (error) {
            throw new Error(`Le dossier des données de ${game.installFolderName} est introuvable.`);
        }

        return dataFolder;
    }

    public static async getComMojangFolder(game: MinecraftGame): Promise<vscode.Uri> {
        const appData = process.env.APPDATA;
        if (! appData) {
            throw new Error("Impossible de déterminer le dossier AppData.");
        }

        const comMojangFolder = vscode.Uri.joinPath(vscode.Uri.file(appData), game.userDataFolderName, "Users", "Shared", "games", "com.mojang");

        try {
            if (! await VscodeUtils.isDirectory(comMojangFolder)) {
                throw new Error(`Le dossier com.mojang de ${game.userDataFolderName} est introuvable.`);
            }
        } catch (error) {
            throw new Error(`Le dossier com.mojang de ${game.userDataFolderName} est introuvable.`);
        }

        return comMojangFolder;
    }

    /**
     * Récupère le dossier definitions du jeu Minecraft Bedrock.
     * @param game Le jeu Minecraft (Stable ou Preview) pour lequel récupérer le dossier definitions.
     * @throws {Error} Si le dossier definitions ne peut pas être trouvé.
     * @returns 
     */
    public static async getDefinitionsFolder(game: MinecraftGame): Promise<vscode.Uri> {
        const dataFolder = await this.getDataFolder(game);
        const definitionsFolder = vscode.Uri.joinPath(dataFolder, "definitions");

        try {
            if (! await VscodeUtils.isDirectory(definitionsFolder)) {
                throw new Error(`Le dossier definitions de ${game.installFolderName} est introuvable.`);
            }
        } catch (error) {
            throw new Error(`Le dossier definitions de ${game.installFolderName} est introuvable.`);
        }

        return definitionsFolder;
    }

    public static async getVanillaBehaviorPackFolders(game: MinecraftGame): Promise<vscode.Uri[]> {
        let dataFolder: vscode.Uri;
        try {
            dataFolder = await this.getDataFolder(game);
        } catch (error) {
            throw new Error(`Impossible de trouver le dossier des données de ${game.installFolderName}. Assurez-vous que le jeu est correctement installé.`);
        }

        const behaviorPacksFolder = vscode.Uri.joinPath(dataFolder, "behavior_packs");
        try {
            if (! await VscodeUtils.isDirectory(behaviorPacksFolder)) {
                throw new Error(`Le dossier des behavior packs de ${game.installFolderName} est introuvable.`);
            }
        } catch (error) {
            throw new Error(`Le dossier des behavior packs de ${game.installFolderName} est introuvable.`);
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

    public static async getVanillaResourcePackFolders(game: MinecraftGame): Promise<vscode.Uri[]> {
        let dataFolder: vscode.Uri;
        try {
            dataFolder = await this.getDataFolder(game);
        } catch (error) {
            throw new Error(`Impossible de trouver le dossier des données de ${game.installFolderName}. Assurez-vous que le jeu est correctement installé.`);
        }

        const resourcePacksFolder = vscode.Uri.joinPath(dataFolder, "resource_packs");
        try {
            if (! await VscodeUtils.isDirectory(resourcePacksFolder)) {
                throw new Error(`Le dossier des resource packs de ${game.installFolderName} est introuvable.`);
            }
        } catch (error) {
            throw new Error(`Le dossier des resource packs de ${game.installFolderName} est introuvable.`);
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
}