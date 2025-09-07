import * as vscode from "vscode";
import { MinecraftFileTypeDefinition, MinecraftFileTypeKey, minecraftFileRegistry } from "../minecraft/fileTypes/minecraftFileRegistry";
import { MinecraftProject } from "./MinecraftProject";
import { collectFiles } from "../filesystem/collectFiles";
import { MinecraftProjectType } from "../../types/projectConfig";

export class MinecraftProjectFileResolver {
    constructor(private project: MinecraftProject) {}

    private async collectPackFiles(packUri: vscode.Uri | undefined, minecraftTypeDef: MinecraftFileTypeDefinition): Promise<vscode.Uri[]> {
        if (packUri === undefined) return [];

        let currentUri = packUri;
        for (const segment of minecraftTypeDef.pathFolder.split("/")) {
            if (segment.length > 0) {
                currentUri = vscode.Uri.joinPath(currentUri, segment);
            }
        }

        try {
            const folderStat = await vscode.workspace.fs.stat(currentUri);
            if (folderStat.type !== vscode.FileType.Directory) return [];

            return collectFiles(
                currentUri,
                minecraftTypeDef.subFolder,
                minecraftTypeDef.fileNames,
                minecraftTypeDef.fileExtension,
                minecraftTypeDef.excludeFileNames
            );
        } catch {
            return [];
        }
    }

    async getDataDrivenFilesFromProject(minecraftFileType: MinecraftFileTypeKey): Promise<vscode.Uri[]> {
        if (this.project.type !== MinecraftProjectType.Addon) {
            return [];
        }

        const minecraftTypeDef = minecraftFileRegistry[minecraftFileType] as MinecraftFileTypeDefinition;

        let folder: vscode.Uri | undefined;
        switch (minecraftTypeDef.packType) {
            case "behavior_pack":
                folder = this.project.behaviorPackFolder;
                break;
            case "resource_pack":
                folder = this.project.resourcePackFolder;
                break;
            default:
                // on ameliora plus tard avec world_template et skin_pack
                folder = undefined;
                break;
        }

        return this.collectPackFiles(folder, minecraftTypeDef);
    }
}