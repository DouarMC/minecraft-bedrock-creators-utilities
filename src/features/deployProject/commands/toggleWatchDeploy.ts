import * as vscode from 'vscode';
import { deployProject } from '../deployProject';
import { globals } from '../../../globals';

let autoDeployWatcher: vscode.FileSystemWatcher | undefined;
let autoDeployActive = false; 

export function registerToggleWatchDeployCommand(context: vscode.ExtensionContext) {
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    context.subscriptions.push(statusBarItem);
    statusBarItem.name = "Auto-Déploiement";
    statusBarItem.command = 'minecraft-bedrock-creators-utilities.toggleWatchDeploy';

    const updateItem = (active: boolean) => {
        statusBarItem.text = active ? '🟢 Auto-Déploiement' : '🔴 Auto-Déploiement';
        statusBarItem.tooltip = active
            ? 'Cliquez pour désactiver le déploiement automatique.'
            : 'Cliquez pour activer le déploiement automatique.';
        statusBarItem.show();
    };
    updateItem(false); // Initial state

    async function startAutoDeployWatcher(root: vscode.Uri) {
        const pattern = new vscode.RelativePattern(root, 'addon/**/*');
        autoDeployWatcher = vscode.workspace.createFileSystemWatcher(pattern, false, false, false);

        const onChange = async (uri: vscode.Uri) => {
            if (uri.fsPath.endsWith('.js')) return;
            await deployProject();
        };

        autoDeployWatcher.onDidCreate(onChange);
        autoDeployWatcher.onDidChange(onChange);
        autoDeployWatcher.onDidDelete(onChange);

        context.subscriptions.push(autoDeployWatcher);
    }

    function stopAutoDeployWatcher() {
        autoDeployWatcher?.dispose();
        autoDeployWatcher = undefined;
    }

    const toggleWatchDeployCommand = vscode.commands.registerCommand(
        "minecraft-bedrock-creators-utilities.toggleWatchDeploy",
        async () => {
            const minecraftProject = globals.currentMinecraftProject;
            if (minecraftProject === undefined) {
                vscode.window.showErrorMessage("Aucun projet Minecraft Bedrock chargé.");
                return;
            }

            if (autoDeployActive) {
                stopAutoDeployWatcher();
                autoDeployActive = false;
                updateItem(false);
                vscode.window.showInformationMessage("🔴 Déploiement auto désactivé.");
            } else {
                await startAutoDeployWatcher(minecraftProject.folder);
                autoDeployActive = true;
                updateItem(true);
                vscode.window.showInformationMessage("🟢 Déploiement auto activé.");
                await deployProject(); // Déploiement initial quand l'auto-déploiement est activé
            }
        }
    );

    context.subscriptions.push(toggleWatchDeployCommand);
}