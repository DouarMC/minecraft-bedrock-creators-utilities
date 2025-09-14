import * as vscode from "vscode";
import { MinecraftProjectType } from "../../../types/projectConfig";
import { createMinecraftProjectFile } from "../../../core/project/generators/createMinecraftProjectFile";
import { createVSCodeSettingsFile } from "../../../core/project/generators/createVSCodeSettingsFile";
import { createAddonStructure } from "../structures/createAddonStructure";
import { isFolderEmpty } from "../../../core/filesystem/directories";
import { promptProjectMetadata } from "../../../core/project/prompts/promptProjectMetadata";

async function initProject(): Promise<void> {
    // Sélection du dossier où créer le projet
    const folderUri = await vscode.window.showOpenDialog({
        canSelectFolders: true,
        canSelectFiles: false,
        openLabel: "Choisir le dossier pour créer le projet.",
        canSelectMany: false,
        title: "Sélectionner un dossier pour initialiser le projet Minecraft Bedrock"
    });

    // Vérification de la sélection
    if (folderUri === undefined || folderUri.length === 0) {
        vscode.window.showWarningMessage("Aucun dossier sélectionné. L'initialisation a été annulée.");
        return;
    }

    // Vérification que le dossier est vide
    const projectFolder = folderUri[0];
    if ((await isFolderEmpty(projectFolder)) === false) {
        vscode.window.showWarningMessage("Le dossier sélectionné n'est pas vide. Choisissez un dossier vide.");
        return;
    }

    // Récupération des métadonnées du projet de l'utilisateur
    const projectMetadata = await promptProjectMetadata();
    if (projectMetadata === undefined) return;

    // Création du fichier settings.json dans .vscode
    await createVSCodeSettingsFile(projectFolder);
    // Création du fichier minecraft-project.json à la racine du projet
    await createMinecraftProjectFile(projectFolder, projectMetadata);

    // Si le projet est de type "Addon", création de la structure d'addon
    if (projectMetadata.type === MinecraftProjectType.Addon) {
        await createAddonStructure(projectFolder, projectMetadata);

        // Ouvrir directement le projet fraîchement créé
        await vscode.commands.executeCommand("vscode.openFolder", projectFolder, false);
    }

    vscode.window.showInformationMessage("✅ L'environnement du projet Minecraft Bedrock a été initialisé avec succès !");
}

export function registerInitProjectCommand(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand(
        "minecraft-bedrock-creators-utilities.initProject",
        () => initProject()
    );

    context.subscriptions.push(disposable);
}