import * as vscode from "vscode";
import { Feature } from "../../core/features/Feature";
import { MinecraftProjectManager } from "../../core/project/MinecraftProjectManager";
import { ProjectService } from "../../core/project/ProjectService";

/**
 * Fonctionnalité pour basculer le déploiement automatique d'un projet Minecraft Bedrock lorsque des changements sont détectés dans le dossier "addon" du projet. Cette fonctionnalité utilise un watcher pour surveiller les changements de fichiers et déclencher le déploiement automatique en conséquence. L'état du déploiement automatique est affiché dans la barre de statut de VSCode, permettant aux utilisateurs de voir rapidement s'il est activé ou désactivé, et de cliquer pour basculer son état.
 */
export class ToggleAutoDeployFeature extends Feature {
    /**
     * Identifiant de la commande pour basculer le déploiement automatique
     */
    private static readonly TOGGLE_AUTO_DEPLOY_COMMAND_ID = "minecraft-bedrock-creators-utilities.toggleAutoDeploy";

    /**
     * État actuel du déploiement automatique ("on" ou "off")
     */
    private toggleState: "on" | "off" = "off";

    /**
     * Élément de la barre de statut pour afficher l'état du déploiement automatique
     */
    private statusBarItem: vscode.StatusBarItem =  vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);

    /**
     * Watcher pour surveiller les changements dans le dossier "addon" du projet Minecraft
     */
    private watcher: vscode.FileSystemWatcher | undefined;
    
    public register(): void {
        // Vérifie si un projet Minecraft est chargé avant d'enregistrer la commande
        const minecraftProject = MinecraftProjectManager.project;
        if (minecraftProject === undefined) {
            console.warn("Aucun projet Minecraft Bedrock chargé. La fonctionnalité de basculement du déploiement automatique ne sera pas enregistrée.");
            return;
        }

        // Enregistre la commande pour basculer le déploiement automatique
        const disposable = vscode.commands.registerCommand(ToggleAutoDeployFeature.TOGGLE_AUTO_DEPLOY_COMMAND_ID, async () => {
            // Bascule l'état du déploiement automatique
            this.toggleState = this.toggleState === "on" ? "off" : "on";

            if (this.toggleState === "on") { // Si le déploiement automatique est activé, démarre le watcher
                await this.startWatcherIfPossible();
                vscode.window.showInformationMessage("🟢 Déploiement automatique activé.");
            } else { // Si le déploiement automatique est désactivé, arrête le watcher
                this.stopWatcher();
                vscode.window.showInformationMessage("🔴 Déploiement automatique désactivé.");
            }

            this.updateStatusBar(); // Met à jour l'affichage de la barre de statut pour refléter le nouvel état du déploiement automatique
        });

        this.extensionContext.subscriptions.push(disposable, this.statusBarItem); // Assure que la commande et l'élément de la barre de statut sont correctement nettoyés lorsque l'extension est désactivée

        this.statusBarItem.command = ToggleAutoDeployFeature.TOGGLE_AUTO_DEPLOY_COMMAND_ID; // Associe la commande de basculement à l'élément de la barre de statut pour permettre aux utilisateurs de cliquer dessus pour activer/désactiver le déploiement automatique
        this.updateStatusBar(); // Met à jour l'affichage de la barre de statut pour refléter l'état initial du déploiement automatique
        this.statusBarItem.show(); // Affiche l'élément de la barre de statut pour que les utilisateurs puissent voir et interagir avec le contrôle du déploiement automatique dès que l'extension est activée
    }

    /**
     * Met à jour l'affichage de la barre de statut en fonction de l'état du déploiement automatique
     */
    private updateStatusBar(): void {
        this.statusBarItem.text = this.toggleState === "on" ? "🟢 Auto-Deploy" : "🔴 Auto-Deploy";
        this.statusBarItem.tooltip = this.toggleState === "on"
            ? "Le déploiement automatique est activé. Cliquez pour le désactiver."
            : "Le déploiement automatique est désactivé. Cliquez pour l'activer.";
    }

    /**
     * Démarre le watcher si un projet est chargé
     * @returns 
     */
    private async startWatcherIfPossible(): Promise<void> {
        // Vérifie à nouveau si un projet Minecraft est chargé avant de démarrer le watcher
        const minecraftProject = MinecraftProjectManager.project;
        if (minecraftProject === undefined) {
            vscode.window.showWarningMessage("Aucun projet chargé, impossible d'activer le déploiement automatique.");
            this.toggleState = "off";
            this.updateStatusBar();
            return;
        }

        let pattern = new vscode.RelativePattern(minecraftProject.folder, "addon/**/*"); // Surveille tous les fichiers dans le dossier "addon" et ses sous-dossiers
        /**
         * Liste des fichiers à ignorer pour éviter les déploiements inutiles
         */
        let ignoredFiles: string[] = ["contents.json", "textures_list.json"];

        // Configure le watcher pour surveiller les changements dans le dossier "addon" du projet Minecraft
        this.watcher = vscode.workspace.createFileSystemWatcher(pattern, false, false, false);
        // Fonction de rappel pour gérer les changements détectés par le watcher
        const onChange = async (uri: vscode.Uri) => {
            if (uri.fsPath.endsWith(".js")) { // Ignore les fichiers JavaScript
                return;
            }
            if (ignoredFiles.some(name => uri.fsPath.endsWith(name))) { // Ignore les fichiers de configuration spécifiques
                return;
            }

            try { // Tente de déployer le projet lorsque des changements sont détectés
                await ProjectService.deployProject(minecraftProject);
            } catch (error: any) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                vscode.window.showErrorMessage(`Échec du déploiement automatique du projet "${minecraftProject.id}": ${errorMessage}`);
            }
        };

        this.watcher.onDidCreate(onChange); // Déclenche le déploiement automatique lorsque de nouveaux fichiers sont créés
        this.watcher.onDidChange(onChange); // Déclenche le déploiement automatique lorsque des fichiers existants sont modifiés
        this.watcher.onDidDelete(onChange); // Déclenche le déploiement automatique lorsque des fichiers sont supprimés

        this.extensionContext.subscriptions.push(this.watcher); // Assure que le watcher est correctement nettoyé lorsque l'extension est désactivée

        // Tentative de déploiement initial
        try {
            await ProjectService.deployProject(minecraftProject);
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            vscode.window.showErrorMessage(`Échec du déploiement initial du projet "${minecraftProject.id}": ${errorMessage}`);
        }
    }

    /**
     * Arrête le watcher s'il est actif
     */
    private stopWatcher(): void {
        if (this.watcher) {
            this.watcher.dispose();
            this.watcher = undefined;
        }
    }
}