import * as vscode from 'vscode';
import {
    openMinecraftStablePacksFolder,
    openMinecraftPreviewPacksFolder,
    openMinecraftStableVanillaFolder,
    openMinecraftPreviewVanillaFolder
} from './exploreMinecraftFolders';

/**
 * Enregistre les commandes d'exploration des dossiers Minecraft
 */
export function registerExploreMinecraftFolders(context: vscode.ExtensionContext): void {
    // Commande : Ouvrir le dossier des packs Minecraft Stable
    const openStablePacksCommand = vscode.commands.registerCommand(
        'minecraft-bedrock-creators-utilities.openMinecraftStablePacksFolder',
        async () => {
            await openMinecraftStablePacksFolder();
        }
    );

    // Commande : Ouvrir le dossier des packs Minecraft Preview
    const openPreviewPacksCommand = vscode.commands.registerCommand(
        'minecraft-bedrock-creators-utilities.openMinecraftPreviewPacksFolder',
        async () => {
            await openMinecraftPreviewPacksFolder();
        }
    );

    // Commande : Ouvrir le dossier des ressources vanilla Minecraft Stable
    const openStableVanillaCommand = vscode.commands.registerCommand(
        'minecraft-bedrock-creators-utilities.openMinecraftStableVanillaFolder',
        async () => {
            await openMinecraftStableVanillaFolder();
        }
    );

    // Commande : Ouvrir le dossier des ressources vanilla Minecraft Preview
    const openPreviewVanillaCommand = vscode.commands.registerCommand(
        'minecraft-bedrock-creators-utilities.openMinecraftPreviewVanillaFolder',
        async () => {
            await openMinecraftPreviewVanillaFolder();
        }
    );

    // Ajouter toutes les commandes au contexte
    context.subscriptions.push(
        openStablePacksCommand,
        openPreviewPacksCommand,
        openStableVanillaCommand,
        openPreviewVanillaCommand
    );
}
