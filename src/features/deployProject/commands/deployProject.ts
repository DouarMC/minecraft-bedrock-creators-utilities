import * as vscode from 'vscode';
import { globals } from '../../../core/globals';
import { deployProject } from '../deployProject';

export function registerDeployProjectCommand(context: vscode.ExtensionContext) {
    const deployProjectCommand = vscode.commands.registerCommand(
        "minecraft-bedrock-creators-utilities.deployProject",
        async () => {
            const minecraftProject = globals.currentMinecraftProject;
            if (minecraftProject === undefined) {
                vscode.window.showErrorMessage("Aucun projet Minecraft Bedrock chargé.");
                return;
            }

            await deployProject();
        }
    );

    context.subscriptions.push(deployProjectCommand);
}