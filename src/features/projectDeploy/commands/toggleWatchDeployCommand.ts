import * as vscode from "vscode";
import { getCurrentProject } from "../../../core/project/projectManager";
import { AutoDeployManager } from "../managers/AutoDeployManager";

export function registerToggleWatchDeployCommand(context: vscode.ExtensionContext) {
    // Initialise le gestionnaire d'auto-déploiement si ce n'est pas déjà fait
    const manager = new AutoDeployManager(context);

    const toggleWatchDeployCommand = vscode.commands.registerCommand(
        "minecraft-bedrock-creators-utilities.toggleWatchDeploy",
        async () => {
            // Récupère le projet courant
            const minecraftProject = getCurrentProject();
            if (minecraftProject === undefined) {
                vscode.window.showErrorMessage("Aucun projet Minecraft Bedrock chargé.");
                return;
            }

            // Bascule l'état de l'auto-déploiement pour le projet courant
            await manager.toggle(minecraftProject);
        }
    );

    context.subscriptions.push(toggleWatchDeployCommand);
}