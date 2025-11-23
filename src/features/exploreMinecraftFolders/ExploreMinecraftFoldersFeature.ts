import * as vscode from "vscode";
import { Feature } from "../../core/features/Feature";
import { PromptService } from "../../core/ui/PromptService";
import { MinecraftGameManager } from "../../core/minecraft/MinecraftGameManager";
import { MinecraftGame } from "../../core/minecraft/MinecraftGame";
import { FileSystemUtils } from "../../core/utils/FileSystemUtils";

export class ExploreMinecraftFoldersFeature extends Feature {
    private static readonly EXPLORE_MINECRAFT_FOLDERS_COMMAND_ID = "minecraft-bedrock-creators-utilities.exploreMinecraftFolders";

    public register(): void {
        const disposable = vscode.commands.registerCommand(ExploreMinecraftFoldersFeature.EXPLORE_MINECRAFT_FOLDERS_COMMAND_ID, async () => {
            const folderToOpenItem = await PromptService.askMinecraftFolderToOpen();
            if (folderToOpenItem === undefined) {
                return; // L'utilisateur a annulé la sélection
            }


            let minecraftGame: MinecraftGame;
            try {
                minecraftGame = folderToOpenItem.game === "stable" ? MinecraftGameManager.getStableGame() : MinecraftGameManager.getPreviewGame();
            } catch (error) {
                vscode.window.showWarningMessage(`⚠️ Le jeu Minecraft ${folderToOpenItem.game} n'est pas installé. Veuillez l'installer avant d'essayer d'ouvrir ses dossiers.`);
                return;
            }
            if (await minecraftGame.isInstalled() === false) {
                vscode.window.showWarningMessage(`⚠️ Le jeu Minecraft ${folderToOpenItem.game} n'est pas installé. Veuillez l'installer avant d'essayer d'ouvrir ses dossiers.`);
                return;
            }

            let folderToOpen: vscode.Uri;
            try {
                folderToOpen = folderToOpenItem.folderType === "comMojangFolder"
                    ? await minecraftGame.getComMojangFolder()
                    : await minecraftGame.getDataFolder();
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