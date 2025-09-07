import * as vscode from "vscode";
import { MinecraftProjectConfig } from "../../../types/projectConfig";

/**
 * Récupère les métadonnées du projet de manière asynchrone avec cache intelligent
 */
export async function loadMinecraftProjectConfig(projectFolder: vscode.Uri): Promise<MinecraftProjectConfig | undefined> {
    const projectConfigUri = vscode.Uri.joinPath(projectFolder, ".mcbe_project.json");
    try {
        const stat = await vscode.workspace.fs.stat(projectConfigUri);
        if (stat.type === vscode.FileType.File) {
            const fileContent = await vscode.workspace.fs.readFile(projectConfigUri);
            const json = JSON.parse(Buffer.from(fileContent).toString("utf8"));
            return json as MinecraftProjectConfig;
        }
    } catch (err) {
        // Le fichier n'existe pas ou n'est pas lisible
        return undefined;
    }

    return undefined;
}