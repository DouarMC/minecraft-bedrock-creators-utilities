import * as vscode from "vscode";
import { VscodeUtils } from "../../vscode-utils/VscodeUtils";
import { PromptService } from "../../services/prompts/PromptService";
import { ProjectService } from "../../services/projects/ProjectService";
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

            try { // Tente de créer le fichier de configuration VSCode pour le projet, et affiche une erreur si la création échoue
                await ProjectService.createVSCodeSettings(projectFolder);
            } catch (error) {
                if (error instanceof Error) {
                    vscode.window.showErrorMessage(`Erreur lors de la création du fichier de configuration VSCode : ${error.message}`);
                    return;
                }

                return;
            }

            try { // Tente de créer le fichier de configuration du projet Minecraft, et affiche une erreur si la création échoue
                await ProjectService.createMinecraftProjectFile(projectFolder, projectMetadata);
            } catch (error) {
                if (error instanceof Error) {
                    vscode.window.showErrorMessage(`Erreur lors de la création du fichier de configuration du projet : ${error.message}`);
                }

                return;
            }

            // En fonction du type de projet sélectionné, crée la structure de base du projet Minecraft Bedrock correspondante, et affiche une erreur si la création échoue
            if (projectMetadata.type === "addon") {
                try {
                    await ProjectService.createAddonStructure(projectFolder, projectMetadata);
                    // Ouvrir le dossier du projet dans VSCode
                    await vscode.commands.executeCommand("vscode.openFolder", projectFolder, false);

                } catch (error) {
                    if (error instanceof Error) {
                        vscode.window.showErrorMessage(`Erreur lors de la création de la structure du projet Add-on : ${error.message}`);
                        return;
                    }
                }
            } else if (projectMetadata.type === "skin_pack") {
                // TODO
            } else if (projectMetadata.type === "world_template") {
                // TODO
            }

            // Afficher un message de succès une fois que le projet a été initialisé
            vscode.window.showInformationMessage("✅ L'environnement du projet Minecraft Bedrock a été initialisé avec succès !");
        });

        this.extensionContext.subscriptions.push(disposable);
    }
}