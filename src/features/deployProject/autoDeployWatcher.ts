import * as vscode from 'vscode';
import { ProjectMetadata } from '../../types/projectMetadata';
import { deployProject } from './deployProject';

let watcher: vscode.FileSystemWatcher | undefined;

let statusBarItem: vscode.StatusBarItem | undefined;

export function getStatusBarItem() {
    return statusBarItem;
}

export function setStatusBarItem(item: vscode.StatusBarItem) {
    statusBarItem = item;
}

/**
 * Met à jour l'affichage de la barre d'état selon l'état du watcher.
 */
function updateStatusBar(active: boolean) {
    if (!statusBarItem) return;

    statusBarItem.text = active ? '🟢 Auto-Déploiement' : '🔴 Auto-Déploiement';
    statusBarItem.tooltip = active
        ? 'Cliquez pour désactiver le déploiement automatique.'
        : 'Cliquez pour activer le déploiement automatique.';
}

/**
 * Active le watcher sur le dossier addon.
 */
async function startWatcher(root: vscode.Uri) {
    const addonGlob = new vscode.RelativePattern(root, 'addon/**/*');

    watcher = vscode.workspace.createFileSystemWatcher(addonGlob, false, false, false);

    const onChange = async (uri: vscode.Uri) => {
        if (uri.fsPath.endsWith('.js')) return;
        vscode.commands.executeCommand("minecraft-bedrock-creators-utilities.deployProject");
    };

    watcher.onDidCreate(onChange);
    watcher.onDidChange(onChange);
    watcher.onDidDelete(onChange);
}

/**
 * Désactive le watcher actuel.
 */
function stopWatcher() {
    watcher?.dispose();
    watcher = undefined;
}

/**
 * Toggle l’état de l’auto-déploiement.
 */
export async function toggleAutoDeploy(root: vscode.Uri, metadata: ProjectMetadata, context: vscode.ExtensionContext) {
    if (!statusBarItem) {
        statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        statusBarItem.command = 'minecraft-bedrock-creators-utilities.toggleWatchDeploy';
        statusBarItem.show();
    }

    if (watcher) {
        stopWatcher();
        updateStatusBar(false);
        vscode.window.showInformationMessage("⛔ Déploiement auto désactivé.");
    } else {
        await startWatcher(root);
        context.subscriptions.push(watcher!);
        updateStatusBar(true);
        vscode.window.showInformationMessage("🟢 Déploiement auto activé.");

        await deployProject(root, metadata);
    }
}