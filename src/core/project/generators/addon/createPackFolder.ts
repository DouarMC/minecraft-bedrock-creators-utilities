import * as vscode from "vscode";
import { MinecraftAddonPack } from "../../../../types/projectConfig";

export async function createPackFolder(projectFolder: vscode.Uri, packType: MinecraftAddonPack): Promise<vscode.Uri> {
    const packFolder = vscode.Uri.joinPath(projectFolder, "addon", packType);
    await vscode.workspace.fs.createDirectory(packFolder);
    return packFolder;
}