import * as vscode from "vscode";
import { MinecraftProject } from "../../../core/project/MinecraftProject";
import { deployProject } from "../utils/deployProject";
import { AutoDeployStatusBar } from "../ui/AutoDeployStatusBar";
import { startAutoDeployWatcher, stopAutoDeployWatcher } from "../watchers/autoDeployWatcher";

export class AutoDeployManager {
    private active = false;
    private statusBar: AutoDeployStatusBar;

    constructor(private context: vscode.ExtensionContext) {
        this.statusBar = new AutoDeployStatusBar();
        context.subscriptions.push(this.statusBar);
    }

    public isActive(): boolean {
        return this.active;
    }

    public async toggle(minecraftProject: MinecraftProject): Promise<void> {
        if (this.active) {
            this.stop();
            vscode.window.showInformationMessage("🔴 Déploiement auto désactivé.");
        } else {
            await this.start(minecraftProject);
            vscode.window.showInformationMessage("🟢 Déploiement auto activé.");
            await deployProject(minecraftProject); // déploiement initial
        }
    }

    private async start(minecraftProject: MinecraftProject): Promise<void> {
        await startAutoDeployWatcher(this.context, minecraftProject);
        this.active = true;
        this.statusBar.update(true);
    }

    private stop(): void {
        stopAutoDeployWatcher();
        this.active = false;
        this.statusBar.update(false);
    }
}