import * as vscode from "vscode";
import { ProjectMetadata } from "../../types/projectMetadata";
import * as fs from "fs";

export async function getMinecraftProjectMetadata(folder: vscode.Uri): Promise<ProjectMetadata | undefined> {
    const fileUri = vscode.Uri.joinPath(folder, ".minecraft-project.json");

    try {
        const content = await vscode.workspace.fs.readFile(fileUri);
        const text = new TextDecoder().decode(content);
        const json = JSON.parse(text) as ProjectMetadata;

        if (!json.type || !json.id || !json.minecraftProduct) {
            vscode.window.showErrorMessage(".minecraft-project.json est incomplet.");
            return;
        }

        return json;
    } catch (error) {
        vscode.window.showErrorMessage("Impossible de lire le fichier .minecraft-project.json.");
        console.error(error);
        return;
    }
}

export function getMinecraftProjectMetadataSync(folder: vscode.Uri): ProjectMetadata | undefined {
    const fileUri = vscode.Uri.joinPath(folder, ".minecraft-project.json");

    try {
        const content = fs.readFileSync(fileUri.fsPath);
        const text = new TextDecoder().decode(content);
        const json = JSON.parse(text) as ProjectMetadata;

        if (!json.type || !json.id || !json.minecraftProduct) {
            vscode.window.showErrorMessage(".minecraft-project.json est incomplet.");
            return;
        }

        return json;
    } catch (error) {
        vscode.window.showErrorMessage("Impossible de lire le fichier .minecraft-project.json.");
        console.error(error);
        return;
    }
}