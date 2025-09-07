// src/core/project/projectManager.ts
import * as vscode from "vscode";
import { MinecraftProject } from "./MinecraftProject";
import { MinecraftGame } from "../minecraft/MinecraftGame";
import { MinecraftProduct } from "../../types/projectConfig";
import { globals } from "../globals";
import { MinecraftDataManager } from "../minecraft/MinecraftDataManager";

let projectWatcher: vscode.FileSystemWatcher | undefined;

/**
 * Initialise le gestionnaire de projet Minecraft :
 * - Charge Minecraft stable
 * - Charge le projet courant
 * - Installe les watchers
 */
export async function initProjectManager(context: vscode.ExtensionContext): Promise<void> {
    // Charger Minecraft stable
    globals.minecraftStableGame = await MinecraftGame.load(MinecraftProduct.Stable);

    if (!globals.minecraftStableGame?.dataFolder) {
        vscode.window.showWarningMessage(
            "⚠️ Minecraft Stable n'a pas été trouvé sur cette machine. Certaines fonctionnalités peuvent être limitées."
        );
    } else {
        globals.minecraftStableDataManager = new MinecraftDataManager(globals.minecraftStableGame);
    }

    // Charger le projet courant
    await reloadProject();

    // Watcher pour changement des dossiers du workspace
    context.subscriptions.push(
        vscode.workspace.onDidChangeWorkspaceFolders(reloadProject)
    );

    // Watcher pour le fichier .mcbe_project.json
    projectWatcher = vscode.workspace.createFileSystemWatcher("**/.mcbe_project.json");
    projectWatcher.onDidCreate(reloadProject);
    projectWatcher.onDidChange(reloadProject);
    projectWatcher.onDidDelete(reloadProject);
    context.subscriptions.push(projectWatcher);
}

/**
 * Recharge le projet Minecraft courant
 */
export async function reloadProject(): Promise<void> {
    globals.currentMinecraftProject = await MinecraftProject.load();
}

/**
 * Retourne le projet Minecraft courant
 */
export function getCurrentProject(): MinecraftProject | undefined {
    return globals.currentMinecraftProject;
}

/**
 * Retourne l'installation de Minecraft stable
 */
export function getStableGame(): MinecraftGame | undefined {
    return globals.minecraftStableGame;
}

export function getPreviewGame(): MinecraftGame | undefined {
    return globals.minecraftPreviewGame;
}

export function getStableDataManager(): MinecraftDataManager | undefined {
    return globals.minecraftStableDataManager;
}

/**
 * Libère les ressources (watchers, etc.)
 */
export function dispose(): void {
    projectWatcher?.dispose();
}