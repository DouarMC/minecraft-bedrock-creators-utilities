// utils/workspace/isMinecraftProject.ts
import * as vscode from "vscode";

export async function isMinecraftProject(): Promise<boolean> {
    if (!vscode.workspace.workspaceFolders) return false;

    const projectRoot = vscode.workspace.workspaceFolders[0].uri;
    const fileUri = vscode.Uri.joinPath(projectRoot, ".minecraft-project.json");

    try {
        const stat = await vscode.workspace.fs.stat(fileUri);
        return stat.type === vscode.FileType.File;
    } catch {
        return false;
    }
}