import * as vscode from 'vscode';
import { directoryExists } from '../../../core/filesystem/directories';
import { MinecraftProjectType } from '../../../types/projectConfig';
import { promptToLaunchMinecraft } from '../../../core/project/prompts/promptToLaunchMinecraft';
import { MinecraftProject } from '../../../core/project/MinecraftProject';
import { getPreviewGame, getStableGame } from '../../../core/project/projectManager';
import { compileTypeScript } from '../../../core/project/generators/addon/scriptApi/compileTypeScript';
import { createContentsJsonFile } from '../../../core/project/generators/addon/createContentsJsonFile';
import { copyPack } from '../../../core/project/generators/copyPack';
import { createTexturesListFile } from '../../../core/project/generators/addon/createTexturesListFile';

function getDeployBasePath(minecraftProduct: "stable" | "preview"): vscode.Uri | undefined {
    const game = minecraftProduct === "stable" ? getStableGame() : getPreviewGame();
    return game?.comMojangFolder;
}

/**
 * Fonction principale de déploiement du projet Minecraft Bedrock.
 */
export async function deployProject(minecraftProject: MinecraftProject): Promise<void> {
    try {
        // Crée une barre de progression pendant le déploiement
        await vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: `Déploiement du projet "${minecraftProject.id}"`,
                cancellable: false
            },
            async (progress) => {
                progress.report({message: "Préparation du déploiement..."});

                // Récupère le chemin du dossier com.mojang (LocalAppData)
                const basePath = getDeployBasePath(minecraftProject.minecraftProduct);
                // Si on ne trouve pas le dossier, on arrête le déploiement
                if (basePath === undefined) {
                    vscode.window.showErrorMessage("Impossible de déterminer le dossier LocalAppData.");
                    return;
                }

                // Si le projet est de type Addon, on déploie les packs
                if (minecraftProject.type === MinecraftProjectType.Addon) {
                    // Déploie le Behavior Pack et le Resource Pack
                    const behaviorPack = minecraftProject.behaviorPackFolder;
                    const resourcePack = minecraftProject.resourcePackFolder;

                    // Si le projet contient Behavior Pack et que son dossier existe
                    if (behaviorPack !== undefined && await directoryExists(behaviorPack)) {
                        progress.report({message: "Compilation des scripts TypeScript..."});

                        // Compile les scripts TypeScript avant le déploiement s'il y en a
                        const compilationNoError = await compileTypeScript(minecraftProject);
                        // Si une erreur de compilation est survenue, on arrête le déploiement
                        if (compilationNoError === false) {
                            vscode.window.showErrorMessage("❌ Le déploiement a été annulé en raison d'erreurs de compilation.");
                            return;
                        }

                        // Crée le fichier contents.json s'il n'existe pas
                        progress.report({message: "Création du fichier contents.json du Behavior Pack..."});
                        await createContentsJsonFile(behaviorPack);

                        // Copie le Behavior Pack dans le dossier de Minecraft
                        progress.report({message: "Déploiement du Behavior Pack..."});
                        await copyPack(behaviorPack, vscode.Uri.joinPath(basePath, "development_behavior_packs", minecraftProject.id));
                    }

                    // Si le projet contient Resource Pack et que son dossier existe
                    if (resourcePack !== undefined && await directoryExists(resourcePack)) {
                        // Crée le fichier textures_list.json
                        progress.report({message: "Création du fichier textures_list.json du Resource Pack..."});
                        await createTexturesListFile(resourcePack);

                        // Crée le fichier contents.json s'il n'existe pas
                        progress.report({message: "Création du fichier contents.json du Resource Pack..."});
                        await createContentsJsonFile(resourcePack);

                        // Copie le Resource Pack dans le dossier de Minecraft
                        progress.report({message: "Déploiement du Resource Pack..."});
                        await copyPack(resourcePack, vscode.Uri.joinPath(basePath, "development_resource_packs", minecraftProject.id));
                    }

                    progress.report({message: "Finalisation du déploiement..."});
                    vscode.window.showInformationMessage(`✅ Le projet "${minecraftProject.id}" a été déployé avec succès !`);
                    return;
                }
            }
        );

        // Propose de lancer Minecraft après un déploiement réussi
        await promptToLaunchMinecraft(minecraftProject);
    } catch (error) {
        console.error("Erreur lors du déploiement du projet :", error);
        vscode.window.showErrorMessage("❌ Erreur lors du déploiement du projet. Vérifiez la console pour plus de détails.");
        return;
    }
}