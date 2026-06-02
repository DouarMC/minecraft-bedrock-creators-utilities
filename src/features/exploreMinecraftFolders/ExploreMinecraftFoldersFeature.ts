import * as vscode from "vscode";
import { Feature } from "../Feature";
import { PromptService } from "../../services/prompts/PromptService";
import { MinecraftGameManager } from "../../services/minecraft/MinecraftGameManager";
import { MinecraftGame } from "../../core/minecraft/models/games/MinecraftGame";
import { FileSystemUtils } from "../../vscode-utils/FileSystemUtils";

export class ExploreMinecraftFoldersFeature extends Feature {
    /**
     * ID de la commande pour explorer les dossiers Minecraft.
     */
    private static readonly EXPLORE_MINECRAFT_FOLDERS_COMMAND_ID = "minecraft-bedrock-creators-utilities.exploreMinecraftFolders";

    public register(): void {
        const disposable = vscode.commands.registerCommand(ExploreMinecraftFoldersFeature.EXPLORE_MINECRAFT_FOLDERS_COMMAND_ID, async () => {
            const folderToOpenItem = await PromptService.askMinecraftFolderToOpen();
            if (folderToOpenItem === undefined) {
                return; // L'utilisateur a annulé la sélection
            }

            // Récupère le jeu Minecraft correspondant à la sélection de l'utilisateur (Stable ou Preview)
            let minecraftGame: MinecraftGame;
            try {
                minecraftGame = folderToOpenItem.game === "stable" ? MinecraftGameManager.getStableGame() : MinecraftGameManager.getPreviewGame();
            } catch (error) {
                vscode.window.showErrorMessage(`⚠️ Le jeu Minecraft ${folderToOpenItem.game} n'est pas installé. Veuillez l'installer avant d'essayer d'ouvrir ses dossiers.`);
                return;
            }

            if (! await MinecraftGameManager.isInstalled(minecraftGame)) { // Vérifie que le jeu est toujours installé avant d'essayer d'ouvrir ses dossiers
                vscode.window.showErrorMessage(`⚠️ Le jeu Minecraft ${folderToOpenItem.game} n'est pas installé. Veuillez l'installer avant d'essayer d'ouvrir ses dossiers.`);
                return;
            }


            let folderToOpen: vscode.Uri;
            try {
                folderToOpen = folderToOpenItem.folderType === "comMojangFolder"
                    ? await MinecraftGameManager.getComMojangFolder(minecraftGame)
                    : await MinecraftGameManager.getDataFolder(minecraftGame);
            } catch (error) {
                vscode.window.showWarningMessage(`⚠️ Impossible de trouver le dossier ${folderToOpenItem.folderType}. Veuillez vérifier que Minecraft ${folderToOpenItem.game} est correctement installé.`);
                return;
            }

            try {
                await FileSystemUtils.openExplorerWithCheck(folderToOpen);
            } catch (error) {
                vscode.window.showErrorMessage(`❌ Erreur lors de l'ouverture du dossier : ${(error as Error).message}`);
            }
        });

        this.extensionContext.subscriptions.push(disposable);
    }
}