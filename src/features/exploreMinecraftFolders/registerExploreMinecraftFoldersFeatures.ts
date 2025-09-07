import * as vscode from 'vscode';
import { openMinecraftFolder } from './exploreMinecraftFolders';

interface ExplorerCommandInfo {
    id: string;
    game: "stable" | "preview";
    folderType: "comMojangFolder" | "dataFolder";
    description: string;
}

/**
 * Enregistre les commandes d'exploration des dossiers Minecraft
 */
export function registerExploreMinecraftFoldersFeatures(context: vscode.ExtensionContext): void {
    const commands: ExplorerCommandInfo[] = [
        {
            id: 'minecraft-bedrock-creators-utilities.openMinecraftStablePacksFolder',
            game: "stable",
            folderType: "comMojangFolder",
            description: "des packs Minecraft Stable"
        },
        {
            id: 'minecraft-bedrock-creators-utilities.openMinecraftPreviewPacksFolder',
            game: "preview",
            folderType: "comMojangFolder",
            description: "des packs Minecraft Preview"
        },
        {
            id: 'minecraft-bedrock-creators-utilities.openMinecraftStableVanillaFolder',
            game: "stable",
            folderType: "dataFolder",
            description: "des ressources vanilla Minecraft Stable"
        },
        {
            id: 'minecraft-bedrock-creators-utilities.openMinecraftPreviewVanillaFolder',
            game: "preview",
            folderType: "dataFolder",
            description: "des ressources vanilla Minecraft Preview"
        }
    ];

    for (const commandInfo of commands) {
        const disposable = vscode.commands.registerCommand(commandInfo.id, async () => {
            await openMinecraftFolder(commandInfo.game, commandInfo.folderType, commandInfo.description);
        });
        context.subscriptions.push(disposable);
    }
}
