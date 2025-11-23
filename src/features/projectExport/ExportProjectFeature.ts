import * as vscode from "vscode";
import { Feature } from "../../core/features/Feature";
import { MinecraftProjectManager } from "../../core/project/MinecraftProjectManager";
import { ProjectService } from "../../core/project/ProjectService";

export class ExportProjectFeature extends Feature {
    private static readonly EXPORT_PROJECT_COMMAND_ID = "minecraft-bedrock-creators-utilities.exportProject";

    public register(): void {
        const disposable = vscode.commands.registerCommand(ExportProjectFeature.EXPORT_PROJECT_COMMAND_ID, async () => {
            const minecraftProject = MinecraftProjectManager.project;
            if (minecraftProject === undefined) {
                vscode.window.showErrorMessage("Aucun projet Minecraft Bedrock n'est chargé.");
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
                    } catch (error: any) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        vscode.window.showErrorMessage(`Échec de l'exportation du projet "${minecraftProject.id}": ${errorMessage}`);
                    }
                }
            );
        });

        this.extensionContext.subscriptions.push(disposable);
    }
}