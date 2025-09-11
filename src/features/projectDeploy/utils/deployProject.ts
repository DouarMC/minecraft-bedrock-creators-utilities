import * as vscode from 'vscode';
import { directoryExists } from '../../../core/filesystem/directories';
import { MinecraftProjectType } from '../../../types/projectConfig';
import { promptToLaunchMinecraft } from './promptToLaunchMinecraft';
import { MinecraftProject } from '../../../core/project/MinecraftProject';
import { getPreviewGame, getStableGame } from '../../../core/project/projectManager';
import { compileTypeScript } from '../../../core/project/compile/compileTypeScript';

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
                        const compilationNoError = await compileTypeScript(minecraftProject);
                        if (compilationNoError === false) {
                            vscode.window.showErrorMessage("❌ Le déploiement a été annulé en raison d'erreurs de compilation.");
                            return;
                        }

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