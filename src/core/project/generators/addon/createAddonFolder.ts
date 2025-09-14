import * as vscode from 'vscode';

export async function createAddonFolder(projectFolder: vscode.Uri): Promise<vscode.Uri> {
    const addonFolder = vscode.Uri.joinPath(projectFolder, "addon");
    await vscode.workspace.fs.createDirectory(addonFolder);
    return addonFolder;
}