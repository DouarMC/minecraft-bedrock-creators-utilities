import * as vscode from 'vscode';
import { getCurrentProject } from '../../../core/project/projectManager';
import { MinecraftProjectType } from '../../../types/projectConfig';
import { addonPackager } from '../packagers/addonPackager';

async function exportProject(): Promise<void> {
    // Récupère le projet Minecraft ouvert
    const currentProject = getCurrentProject();
    if (currentProject === undefined) {
        vscode.window.showWarningMessage("Aucun projet Minecraft Bedrock n'est actuellement ouvert.");
        return;
    }

    // Si le projet est de type Addon, on lance son packager
    if (currentProject.type === MinecraftProjectType.Addon) {
        await addonPackager(currentProject);
    }
}

export function registerExportProjectCommand(context: vscode.ExtensionContext) {
    const command = vscode.commands.registerCommand(
        "minecraft-bedrock-creators-utilities.exportProject",
        exportProject
    );

    context.subscriptions.push(command);
}