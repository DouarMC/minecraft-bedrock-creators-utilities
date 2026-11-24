import * as vscode from "vscode";
import { VscodeUtils } from "../../vscode-utils/VscodeUtils";
import { PromptService } from "../../services/prompts/PromptService";
import { ProjectService } from "../../services/projects/ProjectService";
import { AddonProjectScaffolder } from "../../services/projects/AddonProjectScaffolder";
import { ProjectInitializationCleanup } from "../../services/projects/ProjectInitializationCleanup";
import { AddonSetupPromptResult, collectAddonSetupOptions } from "./AddonSetupPromptFlow";
import { Feature } from "../Feature";

/**
 * Fonctionnalité pour initialiser un projet Minecraft Bedrock.
 */
export class InitProjectFeature extends Feature {
    /**
     * Identifiant de la commande pour initialiser un projet Minecraft Bedrock.
     */
    private static readonly INIT_PROJECT_COMMAND_ID = "minecraft-bedrock-creators-utilities.initProject";

    public register(): void {
        this.registerInitProjectCommand();
    }

    /**
     * Enregistre la commande pour initialiser un projet Minecraft Bedrock.
     */
    private registerInitProjectCommand(): void {
        const disposable = vscode.commands.registerCommand(InitProjectFeature.INIT_PROJECT_COMMAND_ID, async () => {
            // Demander à l'utilisateur de sélectionner un dossier pour le projet
            const folderUri = await vscode.window.showOpenDialog({
                canSelectFolders: true,
                canSelectFiles: false,
                openLabel: "Choisir le dossier pour créer le projet.",
                canSelectMany: false,
                title: "Sélectionner un dossier pour initialiser le projet Minecraft Bedrock"
            });

            // Vérifier si un dossier a été sélectionné, sinon afficher un message d'avertissement et annuler l'initialisation
            if (folderUri === undefined || folderUri.length === 0) {
                vscode.window.showWarningMessage("Aucun dossier sélectionné. L'initialisation a été annulée.");
                return;
            }

            // Vérifier si le dossier sélectionné est vide, sinon afficher un message d'avertissement et annuler l'initialisation
            const projectFolder = folderUri[0];
            try {
                if (! await VscodeUtils.isDirectoryEmpty(projectFolder)) {
                    vscode.window.showWarningMessage("Le chemin sélectionné n'est pas un dossier. Choisissez un dossier vide.");
                    return;
                }
            } catch (error) {
                if (error instanceof Error) {
                    vscode.window.showErrorMessage(`Erreur lors de la vérification du dossier : ${error.message}`);
                    return;
                }

                return;
            }

            // Demander les métadonnées du projet à l'utilisateur (ID, nom d'affichage, auteur, type de projet)
            const projectMetadata = await PromptService.askProjectMetadata();
            // Si l'utilisateur annule la saisie des métadonnées, on annule l'initialisation du projet
            if (projectMetadata === undefined) {
                return;
            }

            let setupResult: AddonSetupPromptResult;
            try {
                setupResult = await collectAddonSetupOptions(projectMetadata.minecraftProduct, {
                    askAddonPackTypes: () => PromptService.askAddonPackTypes(),
                    askBehaviorPackModuleTypes: () => PromptService.askBehaviorPackModuleTypes(),
                    askScriptApiModules: (minecraftProduct) => PromptService.askScriptApiModules(minecraftProduct)
                });
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                vscode.window.showErrorMessage(`Erreur lors de la configuration de l'Add-on : ${errorMessage}`);
                return;
            }

            if (setupResult.status === "cancelled") {
                const message = setupResult.reason === "pack-types"
                    ? "Aucun pack sélectionné. L'initialisation a été annulée."
                    : "Aucun module sélectionné. L'initialisation a été annulée.";
                vscode.window.showWarningMessage(message);
                return;
            }

            try {
                await ProjectService.createVSCodeSettings(projectFolder);
                await ProjectService.createMinecraftProjectFile(projectFolder, projectMetadata);
                await AddonProjectScaffolder.create(projectFolder, projectMetadata, setupResult.options);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                try {
                    await ProjectInitializationCleanup.removeGeneratedEntries(projectFolder);
                } catch (cleanupError) {
                    const cleanupErrorMessage = cleanupError instanceof Error ? cleanupError.message : String(cleanupError);
                    vscode.window.showErrorMessage(
                        `Erreur lors de l'initialisation du projet : ${errorMessage}. ${cleanupErrorMessage}`
                    );
                    return;
                }

                vscode.window.showErrorMessage(`Erreur lors de l'initialisation du projet : ${errorMessage}`);
                return;
            }

            try {
                await vscode.commands.executeCommand("vscode.openFolder", projectFolder, false);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                vscode.window.showWarningMessage(`Le projet a été créé, mais n'a pas pu être ouvert : ${errorMessage}`);
            }

            // Afficher un message de succès une fois que le projet a été initialisé
            vscode.window.showInformationMessage("✅ L'environnement du projet Minecraft Bedrock a été initialisé avec succès !");
        });

        this.extensionContext.subscriptions.push(disposable);
    }
}