import * as vscode from 'vscode';
import { AddonMinecraftProject } from '../../core/minecraft/models/projects/AddonMinecraftProject';
import { MinecraftGame } from '../../core/minecraft/models/games/MinecraftGame';
import { MinecraftProject } from '../../core/minecraft/models/projects/MinecraftProject';
import { VscodeUtils } from '../../vscode-utils/VscodeUtils';
import { MinecraftGameManager } from '../minecraft/MinecraftGameManager';
import { ProjectOutputPreparer } from './ProjectOutputPreparer';

export class ProjectDeployer {
    private static async getDeployBasePath(minecraftProject: MinecraftProject): Promise<vscode.Uri> {
        let game: MinecraftGame;
        try {
            game = minecraftProject.minecraftProduct === "stable"
                ? MinecraftGameManager.getStableGame()
                : MinecraftGameManager.getPreviewGame();
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la récupération du chemin de base pour le déploiement : ${error.message}`);
            }

            throw error;
        }

        let comMojangFolder: vscode.Uri;
        try {
            comMojangFolder = await MinecraftGameManager.getComMojangFolder(game);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la récupération du chemin de base pour le déploiement : ${error.message}`);
            }

            throw error;
        }

        return comMojangFolder;
    }

    public static async deployProject(minecraftProject: MinecraftProject): Promise<void> {
        try {
            await ProjectOutputPreparer.prepareProjectForOutput(minecraftProject);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la préparation du projet pour le déploiement : ${error.message}`);
            }

            throw error;
        }

        let deployBasePath: vscode.Uri;
        try {
            deployBasePath = await this.getDeployBasePath(minecraftProject);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la récupération du chemin de base pour le déploiement : ${error.message}`);
            }

            throw error;
        }

        if (minecraftProject instanceof AddonMinecraftProject) {
            let behaviorPack: vscode.Uri | undefined = undefined;
            let resourcePack: vscode.Uri | undefined = undefined;
            try {
                if (await VscodeUtils.isDirectory(VscodeUtils.getUriFromPath(minecraftProject.getBehaviorPackPath()))) {
                    behaviorPack = VscodeUtils.getUriFromPath(minecraftProject.getBehaviorPackPath());
                }
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la récupération du chemin du pack de comportement pour le déploiement : ${error.message}`);
                }

                throw error;
            }
            try {
                if (await VscodeUtils.isDirectory(VscodeUtils.getUriFromPath(minecraftProject.getResourcePackPath()))) {
                    resourcePack = VscodeUtils.getUriFromPath(minecraftProject.getResourcePackPath());
                }
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la récupération du chemin du pack de ressources pour le déploiement : ${error.message}`);
                }

                throw error;
            }

            if (behaviorPack === undefined && resourcePack === undefined) {
                throw new Error("Le projet ne contient ni pack de comportement ni pack de ressources à déployer.");
            }

            if (behaviorPack) {
                try {
                    await vscode.workspace.fs.copy(
                        behaviorPack,
                        vscode.Uri.joinPath(deployBasePath, "development_behavior_packs", minecraftProject.id),
                        { overwrite: true }
                    );
                } catch (error) {
                    if (error instanceof Error) {
                        throw new Error(`Erreur lors du déploiement du pack de comportement : ${error.message}`);
                    }

                    throw error;
                }
            }

            if (resourcePack) {
                try {
                    await vscode.workspace.fs.copy(
                        resourcePack,
                        vscode.Uri.joinPath(deployBasePath, "development_resource_packs", minecraftProject.id),
                        { overwrite: true }
                    );
                } catch (error) {
                    if (error instanceof Error) {
                        throw new Error(`Erreur lors du déploiement du pack de ressources : ${error.message}`);
                    }

                    throw error;
                }
            }
        }
    }
}
