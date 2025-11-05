import * as vscode from "vscode";
import { MinecraftProject } from "./MinecraftProject";

export class ProjectManager {
    /**
     * Le projet Minecraft actuellement chargé, ou undefined s'il n'y en a pas.
     */
    private static currentProject: MinecraftProject | undefined;

    /**
     * Recharge le projet Minecraft à partir du dossier de workspace ouvert.
     * @returns 
     */
    public static async reload(): Promise<void> {
        const folder = vscode.workspace.workspaceFolders?.[0]?.uri;
        if (! folder) {
            console.warn("[MBCU] Aucun dossier de workspace ouvert — aucun projet à charger.");
            this.currentProject = undefined;
            return;
        }

        try {
            this.currentProject = await MinecraftProject.load(folder);
            console.log(`[MBCU] Projet Minecraft chargé : ${this.currentProject.id}`);
        } catch (error) {
            console.error("[MBCU] Échec du chargement du projet Minecraft :", error);
            this.currentProject = undefined;
        }
    }

    /**
     * Renvoie le projet actuellement chargé, ou undefined s'il n'y en a pas.
     */
    public static get project(): MinecraftProject | undefined {
        return this.currentProject;
    }

    /**
     * Indique si un projet est actuellement chargé.
     * @returns 
     */
    public static hasProject(): boolean {
        return this.currentProject !== undefined;
    }

    /**
     * Efface le projet actuellement chargé.
     */
    public static clear(): void {
        this.currentProject = undefined;
    }
}