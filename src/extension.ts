import * as vscode from 'vscode';

// Types / classes principales
import { MinecraftProject } from './core/project/MinecraftProject';
import { MinecraftGame, MinecraftPreviewGame, MinecraftStableGame } from './core/minecraft-install/MinecraftGame';
import { MinecraftProduct } from './types/projectConfig';
import { globals } from './globals';

// Features
import { registerInitProjectCommand } from './features/initProject/register';
import { registerDeployFeatures } from './features/deployProject/register';
import { registerJsonSchemaFeatures } from './features/jsonSchema/register';
import { registerExploreMinecraftFolders } from './features/exploreMinecraftFolders/register';

/**
 * Recharge le projet Minecraft courant.
 */
async function reloadCurrentProject() {
    globals.currentMinecraftProject = await MinecraftProject.load();
}

export async function activate(context: vscode.ExtensionContext) {
    // Initialisation des données de Minecraft
    globals.minecraftStableGame = await MinecraftGame.load(MinecraftProduct.Stable) as MinecraftStableGame;
    await reloadCurrentProject();

    // Recharge si les dossiers du workspace changent
    vscode.workspace.onDidChangeWorkspaceFolders(reloadCurrentProject);

    // Watcher pour .mcbe_project.json
    const projectWatcher = vscode.workspace.createFileSystemWatcher('**/.mcbe_project.json');
    projectWatcher.onDidCreate(reloadCurrentProject);
    projectWatcher.onDidChange(reloadCurrentProject);
    projectWatcher.onDidDelete(reloadCurrentProject);
    context.subscriptions.push(projectWatcher);

    // Enregistrement des fonctionnalités
    registerInitProjectCommand(context);
    registerDeployFeatures(context);
    registerJsonSchemaFeatures(context);
    registerExploreMinecraftFolders(context);
}

export function deactivate() {
    // Optionnel : nettoyer ou libérer des ressources si nécessaire
}