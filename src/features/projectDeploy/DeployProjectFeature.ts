import * as vscode from "vscode";
import { Feature } from "../../core/features/Feature";
import { MinecraftProjectManager } from "../../core/project/MinecraftProjectManager";

export class DeployProjectFeature extends Feature {
    private static readonly DEPLOY_PROJECT_COMMAND_ID = "minecraft-bedrock-creators-utilities.deployProject";

    public register(): void {

    }

    private registerDeployProjectCommand(): void {
        const disposable = vscode.commands.registerCommand(DeployProjectFeature.DEPLOY_PROJECT_COMMAND_ID, async () => {
            const minecraftProject = MinecraftProjectManager.project;
            if (minecraftProject === undefined) {
                vscode.window.showErrorMessage("Aucun projet Minecraft Bedrock est chargé.");
                return;
            }


        });
    }
}