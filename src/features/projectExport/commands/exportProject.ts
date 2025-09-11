import * as vscode from 'vscode';
import { getCurrentProject } from '../../../core/project/projectManager';
import { MinecraftProjectType } from '../../../types/projectConfig';


async function exportProject(): Promise<void> {
    const currentProject = getCurrentProject();
    if (currentProject === undefined) {
        vscode.window.showWarningMessage("Aucun projet Minecraft Bedrock n'est actuellement ouvert.");
        return;
    }

    if (currentProject.type === MinecraftProjectType.Addon) {
        // Logique d'exportation pour les projets de type Addon
    }
}

export function registerExportProjectCommand(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand(
        "minecraft-bedrock-creators-utilities.exportProject",
        exportProject
    );
}