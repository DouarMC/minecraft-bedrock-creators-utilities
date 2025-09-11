import * as vscode from "vscode";
import { MinecraftProject } from "../../../core/project/MinecraftProject";
import { directoryExists } from "../../../core/filesystem/directories";
import { compileTypeScript } from "../../../core/project/compile/compileTypeScript";
import { createArchive } from "../../../core/filesystem/createArchive";

export async function addonPackager(minecraftProject: MinecraftProject): Promise<void> {
    /**
     * Plan :
     * - Verifier ce qui est dispo : behavior pack, resource pack, scripts
     * - Si scripts, compiler comme lors du deploiement
     * - PAS ENCORE DISPO EN DEPLOY A FAIRE mais ! contents.json et textures_list.json
     * - exporter dans un dossier temporaire dans le projet
     * - Voir le type de zip : mcpack ou mcaddon
     */

    const behaviorPack = minecraftProject.behaviorPackFolder;
    const resourcePack = minecraftProject.resourcePackFolder;

    if (behaviorPack === undefined && resourcePack === undefined) {
        vscode.window.showErrorMessage("Le projet ne contient ni Behavior Pack, ni Resource Pack.");
        return;
    }

    if (behaviorPack !== undefined && await directoryExists(behaviorPack)) {
        const compilantionNoError = await compileTypeScript(minecraftProject);
        if (compilantionNoError === false) {
            vscode.window.showErrorMessage("❌ Le packaging a été annulé en raison d'erreurs de compilation.");
            return;
        }

        
    }
}