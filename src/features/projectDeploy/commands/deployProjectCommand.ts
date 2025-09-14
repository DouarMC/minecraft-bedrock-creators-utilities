import * as vscode from 'vscode';
import { deployProject } from '../utils/deployProject';
import { getCurrentProject } from '../../../core/project/projectManager';

export function registerDeployProjectCommand(context: vscode.ExtensionContext) {
    const deployProjectCommand = vscode.commands.registerCommand(
        "minecraft-bedrock-creators-utilities.deployProject",
        async () => {
            // Récupère le projet Minecraft courant
            const minecraftProject = getCurrentProject();
            // Si aucun projet n'est ouvert, affiche un message d'erreur
            if (minecraftProject === undefined) {
                vscode.window.showErrorMessage("Aucun projet Minecraft Bedrock est chargé.");
                return;
            }

            // Lance le déploiement du projet
            await deployProject(minecraftProject);
        }
    );

    context.subscriptions.push(deployProjectCommand);
}