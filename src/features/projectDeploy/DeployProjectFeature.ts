import * as vscode from "vscode";
import { Feature } from "../Feature";
import { MinecraftProjectManager } from "../../services/projects/MinecraftProjectManager";
import { ProjectService } from "../../services/projects/ProjectService";

/**
 * Fonctionnalité pour déployer un projet Minecraft Bedrock dans les fichiers du jeu.
 */
export class DeployProjectFeature extends Feature {
    /**
     * Identifiant de la commande pour déployer un projet Minecraft Bedrock.
     */
    public static readonly DEPLOY_PROJECT_COMMAND_ID = "minecraft-bedrock-creators-utilities.deployProject";

    public register(): void {
        this.registerDeployProjectCommand();
    }

    /**
     * Inscrit la commande de déploiement du projet Minecraft Bedrock.
     */
    private registerDeployProjectCommand(): void {
        const disposable = vscode.commands.registerCommand(DeployProjectFeature.DEPLOY_PROJECT_COMMAND_ID, async () => {
            // On vérifie d'abord qu'un projet Minecraft est chargé avant de tenter de le déployer
            const minecraftProject = MinecraftProjectManager.project;
            if (minecraftProject === undefined) {
                vscode.window.showErrorMessage("Aucun projet Minecraft Bedrock est chargé.");
                return;
            }

            // Afficher une notification de progression pendant le déploiement du projet
            await vscode.window.withProgress(
                {
                    location: vscode.ProgressLocation.Notification,
                    title: `Déploiement du projet "${minecraftProject.id}"`,
                    cancellable: false
                },
                async (progress) => {
                    progress.report({ message: "Déploiement en cours..." });
                    try {
                        await ProjectService.deployProject(minecraftProject);
                    } catch (error) {
                        let errorMessage: string;
                        if (error instanceof Error) {
                            errorMessage = error.message;
                        } else {
                            errorMessage = String(error);
                        }

                        vscode.window.showErrorMessage(`Échec du déploiement du projet "${minecraftProject.id}": ${errorMessage}`);
                    }

                    vscode.window.showInformationMessage(`Le projet "${minecraftProject.id}" a été déployé avec succès.`);
                }
            );
        });

        this.extensionContext.subscriptions.push(disposable);
    }
}