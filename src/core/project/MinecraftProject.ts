import * as vscode from "vscode";
import { MinecraftProjectConfig, MinecraftProjectType } from "../../types/projectConfig";
import { getMinecraftProjectConfig } from "./getMinecraftProjectConfig";
import { MinecraftFileTypeDefinition, minecraftFileTypes } from "../data/minecraftFileTypes";
import { collectFiles } from "../filesystem/collectFiles";

export class MinecraftProject {
    folder: vscode.Uri;
    config: MinecraftProjectConfig;

    constructor(projectFolder: vscode.Uri, config: MinecraftProjectConfig) {
        this.folder = projectFolder;
        this.config = config;
    }

    static async load(): Promise<MinecraftProject | undefined> {
        const folder = vscode.workspace.workspaceFolders?.[0]?.uri;
        if (!folder) return undefined;
        const projectConfig = await getMinecraftProjectConfig(folder);
        if (!projectConfig) return undefined;

        return new MinecraftProject(folder, projectConfig);
    }

    get configFileUri() {
        return vscode.Uri.joinPath(this.folder, ".mcbe_project.json");
    }

    get id() {
        return this.config.metadata.id;
    }

    get minecraftProduct() {
        return this.config.metadata.minecraftProduct;
    }

    get options() {
        return this.config.options;
    }

    get type() {
        return this.config.metadata.type;
    }

    get addonFolder() {
        if (this.type !== MinecraftProjectType.Addon) {
            return undefined;
        }

        return vscode.Uri.joinPath(this.folder, "addon");
    }

    get behaviorPackFolder() {
        if (this.type !== MinecraftProjectType.Addon) {
            return undefined;
        }
        return vscode.Uri.joinPath(this.addonFolder!, "behavior_pack");
    }

    get resourcePackFolder() {
        if (this.type !== MinecraftProjectType.Addon) {
            return undefined;
        }
        return vscode.Uri.joinPath(this.addonFolder!, "resource_pack");
    }

    get scriptsFolder() {
        if (this.type !== MinecraftProjectType.Addon) {
            return undefined;
        }
        return vscode.Uri.joinPath(this.addonFolder!, "scripts");
    }

    async getDataDrivenFilesFromProject(minecraftFileType: keyof typeof minecraftFileTypes): Promise<vscode.Uri[]> {
        const results: vscode.Uri[] = [];
        if (this.type === MinecraftProjectType.Addon) {
            const typeFileLocation = minecraftFileTypes[minecraftFileType] as MinecraftFileTypeDefinition;
            const processPackType = async (packUri: vscode.Uri, typeFileLocation: MinecraftFileTypeDefinition) => {
                let currentUri = packUri;
                for (const segment of typeFileLocation.pathFolder.split("/")) {
                    if (segment.length > 0) {
                        currentUri = vscode.Uri.joinPath(currentUri, segment);
                    }
                }
                try {
                    const folderStat = await vscode.workspace.fs.stat(currentUri);
                    if (folderStat.type !== vscode.FileType.Directory) return; // Ce n'est pas un dossier, on ignore

                    const files = await collectFiles(
                        currentUri,
                        typeFileLocation.subFolder,
                        typeFileLocation.fileNames,
                        typeFileLocation.fileExtension,
                        typeFileLocation.excludeFileNames
                    );
                    results.push(...files);
                } catch (error) {
                    return;
                }
            };

            if (typeFileLocation.packType === "behavior_pack") {
                await processPackType(this.behaviorPackFolder!, typeFileLocation);
            } else if (typeFileLocation.packType === "resource_pack") {
                await processPackType(this.resourcePackFolder!, typeFileLocation);
            }
        }

        return results;
    }
}