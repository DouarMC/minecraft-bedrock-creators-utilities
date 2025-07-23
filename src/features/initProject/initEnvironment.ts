import * as vscode from "vscode";
import { ProjectMetadata } from "../../types/projectMetadata";

import { createAddonStructure } from "./structures/addon";

async function promptProjectMetadata(): Promise<ProjectMetadata | undefined> {
    const type = await vscode.window.showQuickPick(
        ["addon", "skin_pack", "world_template"] as const,
        {
            title: "Type du projet",
            placeHolder: "Sélectionnez le type du projet",
            canPickMany: false
        }
    );

    if (type === undefined) return;
    if (type !== "addon") return;

    const id = await vscode.window.showInputBox({
        title: "ID du projet",
        prompt: "Entrez l'id du projet",
        placeHolder: "mon_pack"
    });

    if (!id) return;

    const displayName = await vscode.window.showInputBox({
        title: "Nom d'affichage du projet",
        prompt: "Entrez le nom d'affichage du projet",
        placeHolder: id
    });

    if (!displayName) return;

    const author = await vscode.window.showInputBox({
        title: "Auteur du projet",
        prompt: "Entrez l'auteur du projet",
        placeHolder: "Mon Nom"
    });

    if (!author) return;

    const minecraftProduct = await vscode.window.showQuickPick(
        ["stable", "preview"] as const,
        {
            title: "Version de Minecraft",
            placeHolder: "Sélectionnez la version de Minecraft",
            canPickMany: false
        }
    ) as "stable" | "preview" | undefined;

    if (!minecraftProduct) return;

    return {
        type: type,
        id: id,
        displayName: displayName,
        author: author,
        minecraftProduct: minecraftProduct
    };
}

async function createMinecraftProjectFile(folder: vscode.Uri, metadata: ProjectMetadata): Promise<void> {
    const fileUri = vscode.Uri.joinPath(folder, ".minecraft-project.json");
    await vscode.workspace.fs.writeFile(
        fileUri,
        Buffer.from(JSON.stringify(metadata, null, 4), "utf8")
    );
}

async function createVSCodeSettings(folder: vscode.Uri): Promise<void> {
    const vscodeFolder = vscode.Uri.joinPath(folder, ".vscode");
    await vscode.workspace.fs.createDirectory(vscodeFolder);

    const settingsContent = {
        "files.associations": {
            "*.json": "jsonc"
        },
        "editor.tabSize": 4
    };

    await vscode.workspace.fs.writeFile(
        vscode.Uri.joinPath(vscodeFolder, "settings.json"),
        Buffer.from(JSON.stringify(settingsContent, null, 4), "utf8")
    );
}

/**
 * Enregistre la commande pour initialiser l'environnement du projet Minecraft Bedrock.
 * Cette commande permet à l'utilisateur de sélectionner un dossier, de choisir le type de projet,
 * de nommer le projet et de spécifier la version de Minecraft à utiliser.
 * Elle crée ensuite un fichier .env et les structures de dossiers nécessaires pour le projet.
 * @param context Le contexte de l'extension VS Code, utilisé pour enregistrer la commande.
 */
export function registerInitEnvironmentCommand(context: vscode.ExtensionContext) {
    // Inscrit la commande qui gère l'initialisation de l'environnement du projet
    const initEnvCommand = vscode.commands.registerCommand("minecraft-bedrock-creators-utilities.initEnvironment", async () => {
        // Ouvre une boîte de dialogue pour sélectionner un dossier qui sera utilisé pour initialiser l'environnement
        const folderUri = await vscode.window.showOpenDialog({
            canSelectFolders: true,
            openLabel: "Choisir le dossier pour initialiser l'environnement",
            canSelectMany: false
        });

        // Vérifie si un dossier a été sélectionné, sinon affiche un message d'avertissement
        if (!folderUri || folderUri.length === 0) {
            vscode.window.showWarningMessage("Aucun dossier sélectionné. L'initialisation de l'environnement a été annulée.");
            return;
        }

        const selectedFolder = folderUri[0]; // Récupère le dossier sélectionné

        const metadata = await promptProjectMetadata();
        if (!metadata) return;

        await createVSCodeSettings(selectedFolder);
        await createMinecraftProjectFile(selectedFolder, metadata);

        if (metadata.type === "addon") {
            await createAddonStructure(selectedFolder, metadata, context);
            await vscode.commands.executeCommand("vscode.openFolder", selectedFolder, false);
        }

        // Affiche un message d'information à l'utilisateur
        vscode.window.showInformationMessage("L'environnement a été initialisé avec succès !");
    });

    context.subscriptions.push(initEnvCommand);
}