import * as vscode from "vscode";
import { deployProject } from "../utils/deployProject";
import { MinecraftProject } from "../../../core/project/MinecraftProject";

let watcher: vscode.FileSystemWatcher | undefined;

const ignoredFiles = ["contents.json", "textures_list.json"];

/**
 * Démarre le watcher qui écoute les changements dans le dossier addon/
 */
export async function startAutoDeployWatcher(context: vscode.ExtensionContext, minecraftProject: MinecraftProject): Promise<void> {
    // pattern = tous les fichiers dans addon/
    const pattern = new vscode.RelativePattern(minecraftProject.folder, "addon/**/*");

    watcher = vscode.workspace.createFileSystemWatcher(pattern, false, false, false);

    const onChange = async (uri: vscode.Uri) => {
        // éviter de redéployer à cause des .js compilés
        if (uri.fsPath.endsWith(".js")) return;
        // éviter de redéployer à cause des fichiers ignorés
        if (ignoredFiles.some(name => uri.fsPath.endsWith(name))) return;

        await deployProject(minecraftProject);
    };

    watcher.onDidCreate(onChange);
    watcher.onDidChange(onChange);
    watcher.onDidDelete(onChange);

    context.subscriptions.push(watcher);
}

/**
 * Stoppe le watcher s’il existe
 */
export function stopAutoDeployWatcher(): void {
    watcher?.dispose();
    watcher = undefined;
}