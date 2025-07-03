import * as vscode from 'vscode';

let watcher: vscode.FileSystemWatcher | undefined;
let statusBarItem: vscode.StatusBarItem;

function updateStatusBar(active: boolean) {
    statusBarItem.text = active ? '🟢 Auto-Déploiement' : '🔴 Auto-Déploiement';
    statusBarItem.tooltip = active
        ? 'Cliquez pour désactiver le déploiement automatique à chaque changement.'
        : 'Cliquez pour activer le déploiement automatique à chaque changement.';
}

/**
 * Inscrit la commande pour surveiller les changements dans le projet Minecraft Bedrock et déployer automatiquement le projet.
 * @param context Le contexte de l'extension VSCode.
 */
export function registerWatchDeployCommand(context: vscode.ExtensionContext) {
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBarItem.command = 'minecraft-bedrock-creators-utilities.toggleWatchDeploy';    
    updateStatusBar(false);
    statusBarItem.show();

    const command = vscode.commands.registerCommand("minecraft-bedrock-creators-utilities.toggleWatchDeploy", async () => {
        if (watcher) {
            // 🔴 Désactiver le watcher
            watcher.dispose();
            watcher = undefined;
            updateStatusBar(false);
            vscode.window.showInformationMessage("⛔ Mode surveillance désactivé.");
        } else {
            // 🟢 Activer le watcher
            // Récupération des dossiers de travail ouverts
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders || workspaceFolders.length === 0) {
                vscode.window.showErrorMessage("Aucun dossier de travail ouvert. Veuillez ouvrir un projet Minecraft Bedrock.");
                return;
            }

            // Base URI du projet
            const root = workspaceFolders[0].uri;
            // Crée un watcher pour surveiller les changements dans le dossier "addon"
            const addonGlob = new vscode.RelativePattern(root, 'addon/**/*');

            watcher = vscode.workspace.createFileSystemWatcher(addonGlob, false, false, false);

            // Fonction de gestion des changements dans le projet
            const onChange = async (uri: vscode.Uri) => {
                // Ignore les fichiers JavaScript car ils sont souvent générés et ne nécessitent pas de déploiement
                if (uri.fsPath.endsWith(".js")) {
                    return;
                }

                console.log(`📁 Changement détecté : ${uri.fsPath}`);
                vscode.commands.executeCommand("minecraft-bedrock-creators-utilities.deployProject", uri);
            };

            // Enregistrement des événements de création, modification et suppression
            watcher.onDidCreate(onChange);
            watcher.onDidChange(onChange);
            watcher.onDidDelete(onChange);

            // Ajout du watcher aux subscriptions du contexte de l'extension
            context.subscriptions.push(watcher);
            updateStatusBar(true);
            vscode.window.showInformationMessage("🟢 Mode surveillance activé. Déploiement automatique à chaque changement.");
        }
    });

    context.subscriptions.push(command);
}