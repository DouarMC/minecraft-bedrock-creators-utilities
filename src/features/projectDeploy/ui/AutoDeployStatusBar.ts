import * as vscode from "vscode";

export class AutoDeployStatusBar {
    private item: vscode.StatusBarItem;

    constructor() {
        this.item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        this.item.name = "Auto-Déploiement";
        this.item.command = "minecraft-bedrock-creators-utilities.toggleWatchDeploy";
        this.update(false); // état initial
        this.item.show();
    }

    update(active: boolean) {
        this.item.text = active ? "🟢 Auto-Déploiement" : "🔴 Auto-Déploiement";
        this.item.tooltip = active
            ? "Cliquez pour désactiver le déploiement automatique."
            : "Cliquez pour activer le déploiement automatique.";
    }

    dispose() {
        this.item.dispose();
    }
}