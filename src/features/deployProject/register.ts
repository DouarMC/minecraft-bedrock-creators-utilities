import * as vscode from 'vscode';
import { getMinecraftProjectMetadata } from '../../utils/workspace/getMinecraftProjectMetadata';
import { toggleAutoDeploy } from './autoDeployWatcher';
import { deployProject } from './deployProject';
import { setStatusBarItem } from './autoDeployWatcher';

/**
 * Inscrit toutes les commandes liées au déploiement (manuel et auto).
 */
export function registerDeployFeatures(context: vscode.ExtensionContext) {
    // ✅ Crée l’élément status bar dès le démarrage
    const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    item.text = '🔴 Auto-Déploiement';
    item.tooltip = 'Cliquez pour activer le déploiement automatique.';
    item.command = 'minecraft-bedrock-creators-utilities.toggleWatchDeploy';
    item.show();
    setStatusBarItem(item); // Enregistre l'élément dans le contexte pour qu'il soit nettoyé à la désactivation de l'extension
    context.subscriptions.push(item);

    context.subscriptions.push(
        vscode.commands.registerCommand("minecraft-bedrock-creators-utilities.deployProject", async () => {
            const folders = vscode.workspace.workspaceFolders;
            if (!folders?.length) {
                vscode.window.showErrorMessage("Aucun dossier ouvert.");
                return;
            }

            const root = folders[0].uri;
            const metadata = await getMinecraftProjectMetadata(root);
            if (!metadata) {
                vscode.window.showErrorMessage("Le dossier actuel n'est pas un projet Minecraft Bedrock.");
                return;
            }

            await deployProject(root, metadata);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand("minecraft-bedrock-creators-utilities.toggleWatchDeploy", async () => {
            const folders = vscode.workspace.workspaceFolders;
            if (!folders?.length) {
                vscode.window.showErrorMessage("Aucun dossier ouvert.");
                return;
            }

            const root = folders[0].uri;
            const metadata = await getMinecraftProjectMetadata(root);
            if (!metadata) {
                vscode.window.showErrorMessage("Le dossier actuel n'est pas un projet Minecraft Bedrock.");
                return;
            }

            await toggleAutoDeploy(root, metadata, context);
        })
    );
}