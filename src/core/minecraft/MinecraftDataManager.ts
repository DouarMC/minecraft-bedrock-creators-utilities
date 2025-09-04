import * as vscode from "vscode";
import { MinecraftGame } from "./MinecraftGame";
import { MinecraftFileTypeDefinition, MinecraftFileTypeKey, minecraftFileRegistry } from "./fileTypes/minecraftFileRegistry";

export class MinecraftDataManager {
    private cache: Partial<Record<MinecraftFileTypeKey, vscode.Uri[]>> = {};

    constructor(private game: MinecraftGame) {}

    clearCache(): void {
        this.cache = {};
    }

    async getFiles(minecraftFileType: MinecraftFileTypeKey): Promise<vscode.Uri[]> {
        // Vérifier cache
        if (this.cache[minecraftFileType]) {
            return this.cache[minecraftFileType]!;
        }

        const results: vscode.Uri[] = [];
        const typeDef = minecraftFileRegistry[minecraftFileType] as MinecraftFileTypeDefinition;

        const processPackType = async (folders: vscode.Uri[]) => {
            for (const packUri of folders) {
                let currentUri = packUri;
                for (const segment of typeDef.pathFolder.split("/")) {
                    if (segment.length > 0) {
                        currentUri = vscode.Uri.joinPath(currentUri, segment);
                    }
                }
                try {
                    const folderStat = await vscode.workspace.fs.stat(currentUri);
                    if (folderStat.type !== vscode.FileType.Directory) continue;

                    const files = await this.collectFiles(
                        currentUri,
                        typeDef.subFolder,
                        typeDef.fileNames,
                        typeDef.fileExtension,
                        typeDef.excludeFileNames
                    );
                    results.push(...files);
                } catch {
                    continue;
                }
            }
        };

        // definitions folder
        if (typeDef.searchInDefinitionsFolder && this.game.definitionsFolder) {
            await processPackType([this.game.definitionsFolder]);
        }

        // packs
        if (typeDef.packType === "behavior_pack") {
            await processPackType(this.game.behaviorPackFolders);
        } else if (typeDef.packType === "resource_pack") {
            await processPackType(this.game.resourcePackFolders);
        }

        this.cache[minecraftFileType] = results;
        return results;
    }

    private async collectFiles(
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
                        collectedFiles.push(vscode.Uri.joinPath(folderUri, name));
                    }
                } else if (type === vscode.FileType.Directory && recursive) {
                    const subFolderUri = vscode.Uri.joinPath(folderUri, name);
                    const subFiles = await this.collectFiles(
                        subFolderUri,
                        recursive,
                        fileNames,
                        fileExtensions,
                        excludeFileNames
                    );
                    collectedFiles.push(...subFiles);
                }
            }
        } catch {
            console.warn(`Le dossier ${folderUri.fsPath} n'existe pas ou ne peut pas être lu.`);
        }
        return collectedFiles;
    }
}