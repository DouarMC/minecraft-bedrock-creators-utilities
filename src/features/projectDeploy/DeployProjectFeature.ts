import * as vscode from "vscode";
import { Feature } from "../../core/features/Feature";
import { MinecraftProjectManager } from "../../core/project/MinecraftProjectManager";
import { ProjectService } from "../../core/project/ProjectService";

export class DeployProjectFeature extends Feature {
    private static readonly DEPLOY_PROJECT_COMMAND_ID = "minecraft-bedrock-creators-utilities.deployProject";

    public register(): void {
        this.registerDeployProjectCommand();
    }

    /**
     * Inscrit la commande de déploiement du projet Minecraft Bedrock.
     */
    private registerDeployProjectCommand(): void {
        const disposable = vscode.commands.registerCommand(DeployProjectFeature.DEPLOY_PROJECT_COMMAND_ID, async () => {
            const minecraftProject = MinecraftProjectManager.project;
            if (minecraftProject === undefined) {
                vscode.window.showErrorMessage("Aucun projet Minecraft Bedrock est chargé.");
                return;
            }

            await vscode.window.withProgress(
                {
                    location: vscode.ProgressLocation.Notification,
                    title: `Déploiement du projet "${minecraftProject.id}"`,
                    cancellable: false
                },
                async (progress) => {
                    try {
                        progress.report({ message: "Déploiement en cours..." });
                        await ProjectService.deployProject(minecraftProject);
                        vscode.window.showInformationMessage(`Le projet "${minecraftProject.id}" a été déployé avec succès.`);
                    } catch (error: any) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        vscode.window.showErrorMessage(`Échec du déploiement du projet "${minecraftProject.id}": ${errorMessage}`);
                    }
                }
            );
        });

        this.extensionContext.subscriptions.push(disposable);
    }
}