import * as vscode from "vscode";
import { VscodeUtils } from "../../core/utils/VscodeUtils";
import { PromptService } from "../../core/ui/PromptService";
import { ProjectService } from "../../core/project/ProjectService";
import { MinecraftProjectType } from "../../types/projectConfig";
import { Feature } from "../../core/features/Feature";

/**
 * Fonctionnalité pour initialiser un projet Minecraft Bedrock.
 */
export class InitProjectFeature extends Feature {
    private static readonly INIT_PROJECT_COMMAND_ID = "minecraft-bedrock-creators-utilities.initProject";

    public register(): void {
        this.registerInitProjectCommand();
    }

    /**
     * Enregistre la commande pour initialiser un projet Minecraft Bedrock.
     */
    private registerInitProjectCommand(): void {
        const disposable = vscode.commands.registerCommand(InitProjectFeature.INIT_PROJECT_COMMAND_ID, async () => {
            const folderUri = await vscode.window.showOpenDialog({
                canSelectFolders: true,
                canSelectFiles: false,
                openLabel: "Choisir le dossier pour créer le projet.",
                canSelectMany: false,
                title: "Sélectionner un dossier pour initialiser le projet Minecraft Bedrock"
            });

            if (folderUri === undefined || folderUri.length === 0) {
                vscode.window.showWarningMessage("Aucun dossier sélectionné. L'initialisation a été annulée.");
                return;
            }

            const projectFolder = folderUri[0];
            if (! await VscodeUtils.isDirectoryEmpty(projectFolder)) {
                vscode.window.showWarningMessage("Le dossier sélectionné n'est pas vide. Choisissez un dossier vide.");
                return;
            }

            const projectMetadata = await PromptService.askProjectMetadata();
            if (projectMetadata === undefined) {
                return;
            }

            await ProjectService.createVSCodeSettings(projectFolder);
            await ProjectService.createMinecraftProjectFile(projectFolder, projectMetadata);

            if (projectMetadata.type === MinecraftProjectType.Addon) {
                await ProjectService.createAddonStructure(projectFolder, projectMetadata);

                await vscode.commands.executeCommand("vscode.openFolder", projectFolder, false);
            }

            vscode.window.showInformationMessage("✅ L'environnement du projet Minecraft Bedrock a été initialisé avec succès !");
        });

        this.extensionContext.subscriptions.push(disposable);
    }
}