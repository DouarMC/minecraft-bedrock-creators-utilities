import * as vscode from "vscode";
import { Feature } from "../../core/features/Feature";
import { MinecraftProjectManager } from "../../core/project/MinecraftProjectManager";
import { ProjectService } from "../../core/project/ProjectService";

export class ToggleAutoDeployFeature extends Feature {
    private static readonly TOGGLE_AUTO_DEPLOY_COMMAND_ID = "minecraft-bedrock-creators-utilities.toggleAutoDeploy";

    private toggleState: "on" | "off" = "off";
    private statusBarItem: vscode.StatusBarItem =  vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    private watcher: vscode.FileSystemWatcher | undefined;
    
    public register(): void {
        const minecraftProject = MinecraftProjectManager.project;
        if (minecraftProject === undefined) {
            console.warn("Aucun projet Minecraft Bedrock chargé. La fonctionnalité de basculement du déploiement automatique ne sera pas enregistrée.");
            return;
        }

        const disposable = vscode.commands.registerCommand(ToggleAutoDeployFeature.TOGGLE_AUTO_DEPLOY_COMMAND_ID, async () => {
            // Bascule l'état du déploiement automatique
            this.toggleState = this.toggleState === "on" ? "off" : "on";

            if (this.toggleState === "on") {
                await this.startWatcherIfPossible();
                vscode.window.showInformationMessage("🟢 Déploiement automatique activé.");
            } else {
                this.stopWatcher();
                vscode.window.showInformationMessage("🔴 Déploiement automatique désactivé.");
            }

            this.updateStatusBar();
        });

        this.extensionContext.subscriptions.push(disposable, this.statusBarItem);

        this.statusBarItem.command = ToggleAutoDeployFeature.TOGGLE_AUTO_DEPLOY_COMMAND_ID;
        this.updateStatusBar();
        this.statusBarItem.show();
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
        const minecraftProject = MinecraftProjectManager.project;
        if (minecraftProject === undefined) {
            vscode.window.showWarningMessage("Aucun projet chargé — impossible d'activer le déploiement automatique.");
            this.toggleState = "off";
            this.updateStatusBar();
            return;
        }

        let pattern = new vscode.RelativePattern(minecraftProject.folder, "addon/**/*");
        let ignoredFiles: string[] = ["contents.json", "textures_list.json"];

        this.watcher = vscode.workspace.createFileSystemWatcher(pattern, false, false, false);

        const onChange = async (uri: vscode.Uri) => {
            if (uri.fsPath.endsWith(".js")) return;
            if (ignoredFiles.some(name => uri.fsPath.endsWith(name))) return;

            try {
                // await ProjectService.deployProject(minecraftProject);
                await vscode.commands.executeCommand("minecraft-bedrock-creators-utilities.deployProject");
            } catch (error: any) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                vscode.window.showErrorMessage(`Échec du déploiement automatique du projet "${minecraftProject.id}": ${errorMessage}`);
            }
        };

        this.watcher.onDidCreate(onChange);
        this.watcher.onDidChange(onChange);
        this.watcher.onDidDelete(onChange);

        this.extensionContext.subscriptions.push(this.watcher);

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