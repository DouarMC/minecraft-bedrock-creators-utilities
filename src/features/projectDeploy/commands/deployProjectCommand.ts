import * as vscode from 'vscode';
import { deployProject } from '../utils/deployProject';
import { getCurrentProject } from '../../../core/project/projectManager';

export function registerDeployProjectCommand(context: vscode.ExtensionContext) {
    const deployProjectCommand = vscode.commands.registerCommand(
        "minecraft-bedrock-creators-utilities.deployProject",
        async () => {
            const minecraftProject = getCurrentProject();
            if (minecraftProject === undefined) {
                vscode.window.showErrorMessage("Aucun projet Minecraft Bedrock est chargé.");
                return;
            }

            await deployProject(minecraftProject);
        }
    );

    context.subscriptions.push(deployProjectCommand);
}