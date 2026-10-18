import * as vscode from "vscode";
import { Feature } from "../Feature";
import { MinecraftProjectManager } from "../../services/projects/MinecraftProjectManager";
import { ProjectService } from "../../services/projects/ProjectService";
import { MinecraftProject } from "../../core/minecraft/models/projects/MinecraftProject";

export class ExportProjectFeature extends Feature {
    /**
     * Identifiant de la commande d'exportation du projet.
     */
    private static readonly EXPORT_PROJECT_COMMAND_ID = "minecraft-bedrock-creators-utilities.exportProject";

    public register(): void {
        const disposable = vscode.commands.registerCommand(ExportProjectFeature.EXPORT_PROJECT_COMMAND_ID, async () => {
            // Vérifier qu'un projet Minecraft Bedrock est chargé
            let minecraftProject: MinecraftProject;
            try {
                minecraftProject = MinecraftProjectManager.getProject();
            } catch (error) {
                vscode.window.showErrorMessage("Aucun projet Minecraft Bedrock n'est chargé. Veuillez charger un projet avant de tenter de l'exporter.");
                return;
            }

            await vscode.window.withProgress(
                {
                    location: vscode.ProgressLocation.Notification,
                    title: `Exportation du projet "${minecraftProject.id}"`,
                    cancellable: false
                },
                async (progress) => {
                    try {
                        progress.report({ message: "Exportation en cours..." });
                        await ProjectService.exportProject(minecraftProject);
                        vscode.window.showInformationMessage(`Le projet "${minecraftProject.id}" a été exporté avec succès.`);
                    } catch (error) {
                        if (error instanceof Error) {
                            vscode.window.showErrorMessage(`Échec de l'exportation du projet : ${error.message}`);
                        }
                    }
                }
            );
        });

        this.extensionContext.subscriptions.push(disposable);
    }
}