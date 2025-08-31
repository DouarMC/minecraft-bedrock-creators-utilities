import * as vscode from "vscode";
import { ProjectMetadata, MinecraftProjectType, MinecraftProduct, MinecraftProjectConfig } from "../../types/projectConfig";

import { createAddonStructure } from "./structures/addon";
import { isFolderEmpty } from "../../utils/workspace/directories";

/**
 * Affiche une série de boîtes de dialogue pour recueillir les métadonnées du projet Minecraft Bedrock auprès de l'utilisateur.
 * @returns 
 */
async function promptProjectMetadata(): Promise<ProjectMetadata | undefined> {
    const PROJECT_TYPE_ITEMS: vscode.QuickPickItem[] = [
        {
            label: MinecraftProjectType.Addon,
            description: "Un addon pour Minecraft Bedrock.",
            detail: "Peut contenir un pack de comportements et/ou un pack de ressources.",
            alwaysShow: true
        },
        {
            label:  MinecraftProjectType.SkinPack,
            description: "Un pack de skins pour Minecraft Bedrock.",
            detail: "Contient des skins personnalisés pour les personnages du jeu.",
            alwaysShow: true
        },
        {
            label: MinecraftProjectType.WorldTemplate,
            description: "Un modèle de monde pour Minecraft Bedrock.",
            detail: "Permet de créer et partager des mondes personnalisés et préconfigurés.",
            alwaysShow: true
        }
    ];
    const selectedProjectTypeItem = await vscode.window.showQuickPick(
        PROJECT_TYPE_ITEMS,
        {
            title: "Type du projet",
            placeHolder: "Sélectionnez le type du projet",
            canPickMany: false,
            ignoreFocusOut: true
        }
    );
    if (selectedProjectTypeItem === undefined) return; // L'utilisateur a annulé la sélection

    const id = await vscode.window.showInputBox({
        title: "ID du projet",
        prompt: "Entrez l'id du projet",
        placeHolder: "mon_pack",
        ignoreFocusOut: true
    });
    if (!id) return;

    const displayName = await vscode.window.showInputBox({
        title: "Nom d'affichage du projet",
        prompt: "Entrez le nom d'affichage du projet",
        placeHolder: id,
        ignoreFocusOut: true
    });
    if (!displayName) return;

    const author = await vscode.window.showInputBox({
        title: "Auteur du projet",
        prompt: "Entrez l'auteur du projet",
        placeHolder: "Mon Nom",
        ignoreFocusOut: true
    });
    if (!author) return;

    const MINECRAFT_PRODUCT_ITEMS: vscode.QuickPickItem[] = [
        {
            label: "stable",
            description: "Version stable de Minecraft.",
            detail: "Recommandé pour la plupart des utilisateurs.",
            alwaysShow: true
        },
        {
            label: "preview",
            description: "Version preview (beta) de Minecraft.",
            detail: "Contient les dernières fonctionnalités, mais peut être instable.",
            alwaysShow: true
        }
    ];
    const selectedMinecraftProductItem = await vscode.window.showQuickPick(
        MINECRAFT_PRODUCT_ITEMS,
        {
            title: "Produit Minecraft",
            placeHolder: "Sélectionnez le produit Minecraft",
            canPickMany: false,
            ignoreFocusOut: true
        }
    );
    if (selectedMinecraftProductItem === undefined) return;

    return {
        type: selectedProjectTypeItem.label as MinecraftProjectType,
        id: id,
        displayName: displayName,
        author: author,
        minecraftProduct: selectedMinecraftProductItem.label as MinecraftProduct
    };
}

async function createMinecraftProjectFile(folder: vscode.Uri, metadata: ProjectMetadata): Promise<void> {
    const mcbeProjectContent: MinecraftProjectConfig = {
        metadata: metadata,
        options: {
            deploy: {
                prompt_to_launch_minecraft: true
            }
        }
    };

    await vscode.workspace.fs.writeFile(
        vscode.Uri.joinPath(folder, ".mcbe_project.json"),
        Buffer.from(JSON.stringify(mcbeProjectContent, null, 4), "utf8")
    );
}

async function createVSCodeSettingsFile(folder: vscode.Uri): Promise<void> {
    const vscodeFolder = vscode.Uri.joinPath(folder, ".vscode");
    await vscode.workspace.fs.createDirectory(vscodeFolder);

    const settingsContent = {
        "files.associations": {
            "*.json": "jsonc"
        },
        "editor.tabSize": 4,
        
        "typescript.preferences.includePackageJsonAutoImports": "off",
        "typescript.preferences.autoImportFileExcludePatterns": [
            "**/node_modules/**"
        ],
        "javascript.preferences.autoImportFileExcludePatterns": ["**/node_modules/**"],

        "[typescript]": {
            "editor.snippetSuggestions": "none",
            "editor.wordBasedSuggestions": "off"
        }
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
export function registerInitProjectCommand(context: vscode.ExtensionContext) {
    // Inscrit la commande qui gère l'initialisation de l'environnement du projet
    const initProjectCommand = vscode.commands.registerCommand("minecraft-bedrock-creators-utilities.initProject", async () => {
        // Ouvre une boîte de dialogue pour sélectionner un dossier qui sera utilisé pour initialiser l'environnement
        const folderUri = await vscode.window.showOpenDialog({
            canSelectFolders: true,
            canSelectFiles: false,
            openLabel: "Choisir le dossier pour créer le projet.",
            canSelectMany: false,
            title: "Sélectionner un dossier pour initialiser l'environnement du projet Minecraft Bedrock"
        });

        // Vérifie si un dossier a été sélectionné, sinon affiche un message d'avertissement
        if (!folderUri || folderUri.length === 0) {
            vscode.window.showWarningMessage("Aucun dossier sélectionné. L'initialisation de l'environnement a été annulée.");
            return;
        }

        const projectFolder = folderUri[0]; // Récupère le dossier sélectionné
        if (await isFolderEmpty(projectFolder) === false) { // Si le dossier n'est pas vide, affiche un message d'avertissement et annule l'initialisation
            vscode.window.showWarningMessage("Le dossier sélectionné n'est pas vide. Veuillez choisir un dossier vide pour initialiser le projet.");
            return;
        }

        const projectMetadata = await promptProjectMetadata();
        if (!projectMetadata) return;

        await createVSCodeSettingsFile(projectFolder);
        await createMinecraftProjectFile(projectFolder, projectMetadata);

        if (projectMetadata.type === MinecraftProjectType.Addon) {
            await createAddonStructure(projectFolder, projectMetadata, context);
            await vscode.commands.executeCommand("vscode.openFolder", projectFolder, false);
        }

        // Affiche un message d'information à l'utilisateur
        vscode.window.showInformationMessage("L'environnement a été initialisé avec succès !");
    });

    context.subscriptions.push(initProjectCommand);
}