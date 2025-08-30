import * as vscode from "vscode";
import { MinecraftPackageFull, MinecraftPackagePrefix, MinecraftPackageSuffix } from "./minecraftPackages";
import { MinecraftProduct } from '../../types/projectConfig';
import { MinecraftFileTypeDefinition, minecraftFileTypes } from "../data/minecraftFileTypes";

export class MinecraftGame {
    public dataFolder: vscode.Uri | undefined;
    public comMojangFolder: vscode.Uri | undefined;
    public behaviorPackFolders: vscode.Uri[] = [];
    public resourcePackFolders: vscode.Uri[] = [];
    public definitionsFolder: vscode.Uri | undefined;
    public dataDrivenFilesCache: Record<string, vscode.Uri[]>;

    constructor() {
        this.dataFolder = undefined;
        this.comMojangFolder = undefined;

        this.behaviorPackFolders = [];
        this.resourcePackFolders = [];
        this.definitionsFolder = undefined;
        this.dataDrivenFilesCache = {};
    }

    static async load(minecraftProduct: MinecraftProduct = MinecraftProduct.Stable): Promise<MinecraftGame> {
        if (minecraftProduct === MinecraftProduct.Stable) {
            const game = new MinecraftStableGame();
            game.dataFolder = await MinecraftGame.getDataFolder(
                MinecraftStableGame.PACKAGE_PREFIX,
                MinecraftStableGame.PACKAGE_SUFFIX
            );
            game.comMojangFolder = await MinecraftGame.getComMojangFolder(MinecraftPackageFull.Stable);
            game.definitionsFolder = await game.getDefinitionsFolder();
            game.behaviorPackFolders = await game.getVanillaBehaviorPacksFolder();
            game.resourcePackFolders = await game.getVanillaResourcePacksFolder();

            return game;
        } else {
            const game = new MinecraftPreviewGame();
            game.dataFolder = await MinecraftGame.getDataFolder(
                MinecraftPreviewGame.PACKAGE_PREFIX,
                MinecraftPreviewGame.PACKAGE_SUFFIX
            );
            game.comMojangFolder = await MinecraftGame.getComMojangFolder(MinecraftPackageFull.Preview);
            return game;
        }
    }

    static async getDataFolder(
        packagePrefix: MinecraftPackagePrefix,
        packageSuffix: MinecraftPackageSuffix
    ): Promise<vscode.Uri | undefined> {
        // Program Files (d’habitude: C:\Program Files)
        const programFiles = process.env.PROGRAMFILES;
        if (programFiles === undefined) {
            vscode.window.showErrorMessage('❌ Impossible de déterminer le dossier Program Files.');
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
                vscode.window.showWarningMessage(
                    `⚠️ Impossible de trouver Minecraft (${packagePrefix === MinecraftPackagePrefix.Stable ? 'Stable' : 'Preview'}) dans WindowsApps.`
                );
                return undefined;
            }

            return vscode.Uri.joinPath(windowsAppsUri, match[0], 'data');

        } catch (error: any) {
            // Cas fréquent : EACCES sur WindowsApps
            vscode.window.showErrorMessage(
                `❌ Accès refusé au dossier WindowsApps (${error?.code || 'EACCES'}). ` +
                `Lance VS Code en mode administrateur ou prends la propriété du dossier si nécessaire.`
            );
            return undefined;
        }
    }

    static async getComMojangFolder(packageFull: MinecraftPackageFull): Promise<vscode.Uri | undefined> {
        const localAppData = process.env.LOCALAPPDATA;
        if (localAppData === undefined) {
            vscode.window.showErrorMessage('❌ Impossible de déterminer le dossier Local App Data.');
            return undefined;
        }

        const comMojangUri = vscode.Uri.joinPath(vscode.Uri.file(localAppData), 'Packages', packageFull, 'LocalState', 'games', 'com.mojang');

        try {
            const stat = await vscode.workspace.fs.stat(comMojangUri);
            if (stat.type === vscode.FileType.Directory) {
                return comMojangUri;
            } else {
                vscode.window.showWarningMessage(`⚠️ Le dossier com.mojang n'existe pas dans ${packageFull}.`);
                return undefined;
            }
        } catch {
            vscode.window.showWarningMessage(`⚠️ Impossible de trouver le dossier com.mojang dans ${packageFull}.`);
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

    async getVanillaBehaviorPacksFolder(): Promise<vscode.Uri[]> {
        const behaviorPackfolders: vscode.Uri[] = [];
        if (this.dataFolder) {
            const behaviorPacksUri = vscode.Uri.joinPath(this.dataFolder, "behavior_packs");
            try {
                const entries = await vscode.workspace.fs.readDirectory(behaviorPacksUri);
                for (const [name, type] of entries) {
                    if (type === vscode.FileType.Directory) {
                        behaviorPackfolders.push(vscode.Uri.joinPath(behaviorPacksUri, name));
                    }
                }
            } catch {
                console.warn("Le dossier behavior_packs de Minecraft n'est pas défini.");
            }
        } else {
            console.warn("Le dossier data de Minecraft n'est pas défini.");
        }

        return behaviorPackfolders;
    }

    async getVanillaResourcePacksFolder(): Promise<vscode.Uri[]> {
        const resourcePackfolders: vscode.Uri[] = [];
        if (this.dataFolder) {
            const resourcePacksUri = vscode.Uri.joinPath(this.dataFolder, "resource_packs");
            try {
                const entries = await vscode.workspace.fs.readDirectory(resourcePacksUri);
                for (const [name, type] of entries) {
                    if (type === vscode.FileType.Directory) {
                        resourcePackfolders.push(vscode.Uri.joinPath(resourcePacksUri, name));
                    }
                }
            } catch {
                console.warn("Le dossier resource_packs de Minecraft n'est pas défini.");
            }
        } else {
            console.warn("Le dossier data de Minecraft n'est pas défini.");
        }

        return resourcePackfolders;
    }

    async getDataDrivenFiles(minecraftFileType: keyof typeof minecraftFileTypes): Promise<vscode.Uri[]> {
        async function collectFiles(
            folderUri: vscode.Uri,
            recursive: boolean,
            fileNames: string[],
            fileExtensions: string[],
            excludeFileNames: string[]
        ): Promise<vscode.Uri[]> {
            const collectedFiles: vscode.Uri[] = [];
            try {
                const entries = await vscode.workspace.fs.readDirectory(folderUri);
                for (const [name, type] of entries) {
                    if (type === vscode.FileType.File) {
                        const dotIndex = name.lastIndexOf(".");
                        const baseName = dotIndex > -1 ? name.substring(0, dotIndex) : name;
                        const fileExtension = dotIndex > -1 ? name.substring(dotIndex) : "";

                        if (
                            (fileNames.length === 0 || fileNames.includes(baseName)) &&
                            (fileExtensions.length === 0 || fileExtensions.includes(fileExtension)) &&
                            (excludeFileNames.length === 0 || !excludeFileNames.includes(baseName))
                        ) {
                            collectedFiles.push(vscode.Uri.joinPath(folderUri, name)); // ✅ garder nom complet
                        }
                    } else if (type === vscode.FileType.Directory && recursive) {
                        const subFolderUri = vscode.Uri.joinPath(folderUri, name);
                        const subFiles = await collectFiles(subFolderUri, recursive, fileNames, fileExtensions, excludeFileNames);
                        collectedFiles.push(...subFiles);
                    }
                }
            } catch {
                console.warn(`Le dossier ${folderUri.fsPath} n'existe pas ou ne peut pas être lu.`);
            }
            return collectedFiles;
        }

        // ✅ vérifie si déjà en cache
        if (this.dataDrivenFilesCache[minecraftFileType]) {
            return this.dataDrivenFilesCache[minecraftFileType];
        }

        const results: vscode.Uri[] = [];
        if (this.dataFolder !== undefined) {
            const typeFileLocation = minecraftFileTypes[minecraftFileType] as MinecraftFileTypeDefinition;

            const processPackType = async (folders: vscode.Uri[], typeFileLocation: MinecraftFileTypeDefinition) => {
                for (const packUri of folders) {
                    let currentUri = packUri;
                    for (const segment of typeFileLocation.pathFolder.split("/")) {
                        if (segment.length > 0) {
                            currentUri = vscode.Uri.joinPath(currentUri, segment);
                        }
                    }
                    try {
                        const folderStat = await vscode.workspace.fs.stat(currentUri);
                        if (folderStat.type !== vscode.FileType.Directory) continue;

                        const files = await collectFiles(
                            currentUri,
                            typeFileLocation.subFolder,
                            typeFileLocation.fileNames,
                            typeFileLocation.fileExtension,
                            typeFileLocation.excludeFileNames
                        );
                        results.push(...files);
                    } catch {
                        continue;
                    }
                }
            };

            if (typeFileLocation.searchInDefinitionsFolder === true && this.definitionsFolder) {
                await processPackType([this.definitionsFolder], typeFileLocation);
            }

            if (typeFileLocation.packType === "behavior_pack") {
                await processPackType(this.behaviorPackFolders, typeFileLocation);
            } else if (typeFileLocation.packType === "resource_pack") {
                await processPackType(this.resourcePackFolders, typeFileLocation);
            }
        }

        // ✅ stocker en cache avant de renvoyer
        this.dataDrivenFilesCache[minecraftFileType] = results;
        return results;
    }
}

export class MinecraftStableGame extends MinecraftGame {
    static readonly PACKAGE_PREFIX = MinecraftPackagePrefix.Stable;
    static readonly PACKAGE_SUFFIX = MinecraftPackageSuffix.Stable;
}

export class MinecraftPreviewGame extends MinecraftGame {
    static readonly PACKAGE_PREFIX = MinecraftPackagePrefix.Preview;
    static readonly PACKAGE_SUFFIX = MinecraftPackageSuffix.Preview;
}