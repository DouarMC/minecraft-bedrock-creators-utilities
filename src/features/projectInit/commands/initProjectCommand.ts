import * as vscode from "vscode";
import { MinecraftProjectType } from "../../../types/projectConfig";
import { createMinecraftProjectFile, createVSCodeSettingsFile, createAddonStructure } from "../generators";
import { isFolderEmpty } from "../../../core/filesystem/directories";
import { promptProjectMetadata } from "../prompts/promptProjectMetadata";

async function initProject(context: vscode.ExtensionContext): Promise<void> {
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
    if ((await isFolderEmpty(projectFolder)) === false) {
        vscode.window.showWarningMessage("Le dossier sélectionné n'est pas vide. Choisissez un dossier vide.");
        return;
    }

    const projectMetadata = await promptProjectMetadata();
    if (projectMetadata === undefined) return;

    await createVSCodeSettingsFile(projectFolder);
    await createMinecraftProjectFile(projectFolder, projectMetadata);

    if (projectMetadata.type === MinecraftProjectType.Addon) {
        await createAddonStructure(projectFolder, projectMetadata, context);

        // Ouvrir directement le projet fraîchement créé
        await vscode.commands.executeCommand("vscode.openFolder", projectFolder, false);
    }

    vscode.window.showInformationMessage("✅ L'environnement du projet Minecraft Bedrock a été initialisé avec succès !");
}

export function registerInitProjectCommand(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand(
        "minecraft-bedrock-creators-utilities.initProject",
        () => initProject(context)
    );

    context.subscriptions.push(disposable);
}