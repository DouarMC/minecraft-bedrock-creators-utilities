import * as vscode from 'vscode';
import { directoryExists } from '../../../core/filesystem/directories';
import { exec } from 'child_process';
import { promisify } from 'util';
import { MinecraftProjectType } from '../../../types/projectConfig';
import { promptToLaunchMinecraft } from './promptToLaunchMinecraft';
import { MinecraftProject } from '../../../core/project/MinecraftProject';
import { getPreviewGame, getStableGame } from '../../../core/project/projectManager';

async function compileTypeScriptIfNeeded(minecraftProject: MinecraftProject): Promise<boolean> {
    if (minecraftProject.scriptsFolder === undefined) {
        return true;
    }

    const hasScripts = await directoryExists(minecraftProject.scriptsFolder);
    if (hasScripts === false) {
        return true;
    }

    try {
        const execPromise = promisify(exec);
        const { stdout, stderr } = await execPromise(`tsc`, {cwd: minecraftProject.folder.fsPath});
        if (stderr) {
            console.error(stderr);
            vscode.window.showErrorMessage("Erreur lors de la compilation TypeScript : " + stderr);
            return false;
        }
        return true;
    } catch (error) {
        console.error("Erreur lors de l'exécution de tsc :", error);
        vscode.window.showErrorMessage("Erreur lors de l'exécution de tsc. Veuillez vérifier la console pour plus de détails.");
        return false;
    }
}

async function copyPackIfExists(packPath: vscode.Uri, targetPath: vscode.Uri): Promise<void> {
    if (await directoryExists(packPath)) {
        await vscode.workspace.fs.copy(
            packPath,
            targetPath,
            {
                overwrite: true
            }
        );
    }
}

function getDeployBasePath(minecraftProduct: "stable" | "preview"): vscode.Uri | undefined {
    const game = minecraftProduct === "stable" ? getStableGame() : getPreviewGame();
    return game?.comMojangFolder;
}

/**
 * Fonction principale de déploiement du projet Minecraft Bedrock.
 */
export async function deployProject(minecraftProject: MinecraftProject): Promise<void> {
    try {
        await vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: `Déploiement du projet "${minecraftProject.id}"`,
                cancellable: false
            },
            async (progress) => {
                progress.report({message: "Préparation du déploiement..."});

                const basePath = getDeployBasePath(minecraftProject.minecraftProduct);
                if (basePath === undefined) {
                    vscode.window.showErrorMessage("Impossible de déterminer le dossier LocalAppData.");
                    return;
                }

                if (minecraftProject.type === MinecraftProjectType.Addon) {
                    const behaviorPack = minecraftProject.behaviorPackFolder;
                    const resourcePack = minecraftProject.resourcePackFolder;

                    if (behaviorPack !== undefined && await directoryExists(behaviorPack)) {
                        progress.report({message: "Compilation des scripts TypeScript..."});
                        const compiled = await compileTypeScriptIfNeeded(minecraftProject);
                        if (compiled === false) return;

                        progress.report({message: "Déploiement du Behavior Pack..."});
                        await copyPackIfExists(behaviorPack, vscode.Uri.joinPath(basePath, "development_behavior_packs", minecraftProject.id));
                    }

                    if (resourcePack !== undefined && await directoryExists(resourcePack)) {
                        progress.report({message: "Déploiement du Resource Pack..."});
                        await copyPackIfExists(resourcePack, vscode.Uri.joinPath(basePath, "development_resource_packs", minecraftProject.id));
                    }

                    progress.report({message: "Finalisation du déploiement..."});
                }
            }
        );

        await promptToLaunchMinecraft(minecraftProject);
    } catch (error) {
        console.error("Erreur lors du déploiement du projet :", error);
        vscode.window.showErrorMessage("❌ Erreur lors du déploiement du projet. Vérifiez la console pour plus de détails.");
        return;
    }
}