import * as vscode from "vscode";
import { MinecraftPackageFull, MinecraftPackagePrefix, MinecraftPackageSuffix, minecraftProductConfigs } from "./minecraftPackages";
import { MinecraftProduct } from '../../types/projectConfig';

export class MinecraftGame {
    public dataFolder: vscode.Uri | undefined;
    public comMojangFolder: vscode.Uri | undefined;
    public behaviorPackFolders: vscode.Uri[] = [];
    public resourcePackFolders: vscode.Uri[] = [];
    public definitionsFolder: vscode.Uri | undefined;

    constructor(public product: MinecraftProduct) {}

    static async load(minecraftProduct: MinecraftProduct = MinecraftProduct.Stable): Promise<MinecraftGame> {
        const config = minecraftProductConfigs[minecraftProduct];
        const game = new MinecraftGame(minecraftProduct);

        game.dataFolder = await MinecraftGame.getDataFolder(config.prefix, config.suffix);
        game.comMojangFolder = await MinecraftGame.getComMojangFolder(config.packageFull);

        if (minecraftProduct === MinecraftProduct.Stable) {
            game.definitionsFolder = await game.getDefinitionsFolder();
            game.behaviorPackFolders = await game.getVanillaBehaviorPackFolders();
            game.resourcePackFolders = await game.getVanillaResourcePackFolders();
        }

        return game;
    }

    static async getDataFolder(
        packagePrefix: MinecraftPackagePrefix,
        packageSuffix: MinecraftPackageSuffix
    ): Promise<vscode.Uri | undefined> {
        // Program Files (d’habitude: C:\Program Files)
        const programFiles = process.env.PROGRAMFILES;
        if (programFiles === undefined) {
            console.error("Impossible de déterminer le dossier Program Files.");
            return undefined;
        }

        const windowsAppsUri = vscode.Uri.joinPath(vscode.Uri.file(programFiles), 'WindowsApps');

        try {
            const entries = await vscode.workspace.fs.readDirectory(windowsAppsUri);

            // Cherche un dossier qui commence par le préfixe et se termine par le suffixe
            // Exemple réel : Microsoft.MinecraftUWP_1.21.100.0_x64__8wekyb3d8bbwe
            const match = entries.find(([name, type]) =>
                type === vscode.FileType.Directory &&
                name.startsWith(packagePrefix) &&
                name.endsWith(packageSuffix)
            );

            if (match === undefined) {
                console.warn(`Impossible de trouver Minecraft (${packagePrefix === MinecraftPackagePrefix.Stable ? 'Stable' : 'Preview'}) dans WindowsApps.`);
                return undefined;
            }

            return vscode.Uri.joinPath(windowsAppsUri, match[0], 'data');

        } catch (error: any) {
            // Cas fréquent : ACCES sur WindowsApps
            console.error(
                `Accès refusé au dossier WindowsApps (${error?.code || "EACCES"}). ` +
                `Lance VS Code en mode administrateur ou prends la propriété du dossier si nécessaire.`
            );
            return undefined;
        }
    }

    static async getComMojangFolder(packageFull: MinecraftPackageFull): Promise<vscode.Uri | undefined> {
        const localAppData = process.env.LOCALAPPDATA;
        if (localAppData === undefined) {
            console.error("Impossible de déterminer le dossier Local App Data.");
            return undefined;
        }

        const comMojangUri = vscode.Uri.joinPath(vscode.Uri.file(localAppData), 'Packages', packageFull, 'LocalState', 'games', 'com.mojang');

        try {
            const stat = await vscode.workspace.fs.stat(comMojangUri);
            if (stat.type === vscode.FileType.Directory) {
                return comMojangUri;
            } else {
                console.warn(`Le dossier com.mojang n'existe pas dans ${packageFull}.`);
                return undefined;
            }
        } catch {
            console.warn(`Impossible de trouver le dossier com.mojang dans ${packageFull}.`);
            return undefined;
        }
    }

    async getDefinitionsFolder(): Promise<vscode.Uri | undefined> {
        if (this.dataFolder) {
            const definitionsUri = vscode.Uri.joinPath(this.dataFolder, "definitions");
            try {
                const stat = await vscode.workspace.fs.stat(definitionsUri);
                if (stat.type === vscode.FileType.Directory) {
                    return definitionsUri;
                } else {
                    console.warn("Le dossier definitions n'existe pas dans le dossier data de Minecraft.");
                    return undefined;
                }
            } catch {
                console.warn("Le dossier definitions de Minecraft n'est pas défini.");
                return undefined;
            }
        } else {
            console.warn("Le dossier data de Minecraft n'est pas défini.");
            return undefined;
        }
    }

    async getVanillaBehaviorPackFolders(): Promise<vscode.Uri[]> {
        return this.getVanillaPackFolders("behavior_packs");
    }

    async getVanillaResourcePackFolders(): Promise<vscode.Uri[]> {
        return this.getVanillaPackFolders("resource_packs");
    }

    private async getVanillaPackFolders(kind: "behavior_packs" | "resource_packs"): Promise<vscode.Uri[]> {
        const packFolders: vscode.Uri[] = [];
        if (this.dataFolder === undefined) {
            console.warn("Le dossier data de Minecraft n'est pas défini.");
            return packFolders;
        }

        const baseUri = vscode.Uri.joinPath(this.dataFolder, kind);
        try {
            const entries = await vscode.workspace.fs.readDirectory(baseUri);
            for (const [name, type] of entries) {
                if (type === vscode.FileType.Directory) {
                    packFolders.push(vscode.Uri.joinPath(baseUri, name));
                }
            }
        } catch {
            console.warn(`Le dossier ${kind} de Minecraft n'est pas défini.`);
        }

        return packFolders;
    }

    isInstalled(): boolean {
        return this.dataFolder !== undefined && this.comMojangFolder !== undefined;
    }

    hasVanillaData(): boolean {
        return this.behaviorPackFolders.length > 0 || this.resourcePackFolders.length > 0;
    }
}