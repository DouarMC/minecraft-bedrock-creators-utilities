import * as vscode from "vscode";
import { getCurrentProject } from "../../../core/project/projectManager";
import { AutoDeployManager } from "../managers/AutoDeployManager";

let manager: AutoDeployManager | undefined;

export function registerToggleWatchDeployCommand(context: vscode.ExtensionContext) {
    manager = new AutoDeployManager(context);

    const toggleWatchDeployCommand = vscode.commands.registerCommand(
        "minecraft-bedrock-creators-utilities.toggleWatchDeploy",
        async () => {
            const minecraftProject = getCurrentProject();
            if (minecraftProject === undefined) {
                vscode.window.showErrorMessage("Aucun projet Minecraft Bedrock chargé.");
                return;
            }
            await manager?.toggle(minecraftProject);
        }
    );

    context.subscriptions.push(toggleWatchDeployCommand);
}