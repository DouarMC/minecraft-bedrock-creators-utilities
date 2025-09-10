import * as vscode from 'vscode';
import { copyTemplateFile } from '../../../core/filesystem/copyTemplateFile';

export async function createVSCodeSettingsFile(folder: vscode.Uri): Promise<void> {
    // Création du dossier .vscode s'il n'existe pas
    const vscodeFolder = vscode.Uri.joinPath(folder, ".vscode");
    await vscode.workspace.fs.createDirectory(vscodeFolder);

    await copyTemplateFile("vscode-folder/settings.json", vscode.Uri.joinPath(vscodeFolder, "settings.json"));
}