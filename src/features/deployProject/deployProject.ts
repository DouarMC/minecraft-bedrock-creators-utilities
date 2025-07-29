import * as vscode from 'vscode';
import { directoryExists } from '../../utils/workspace/directories';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { ProjectMetadata } from '../../types/projectMetadata';
import { promptToLaunchMinecraft } from './launchMinecraft';

async function compileTypeScriptIfNeeded(root: vscode.Uri): Promise<boolean> {
    const scriptsPath = vscode.Uri.joinPath(root, "addon", "scripts");
    if (!(await directoryExists(scriptsPath))) {
        return true;
    }

    try {
        const execPromise = promisify(exec);
        const { stdout, stderr } = await execPromise(`tsc`, { cwd: root.fsPath });
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

async function copyPackIfExists(packPath: vscode.Uri, targetPath: string): Promise<void> {
    if (await directoryExists(packPath)) {
        await vscode.workspace.fs.copy(packPath, vscode.Uri.file(targetPath), { overwrite: true });
    }
}

function getDeployBasePath(minecraftProduct: "stable" | "preview"): string | undefined {
    const localAppData = process.env.LOCALAPPDATA;
    if (!localAppData) return undefined;

    return path.join(
        localAppData,
        "Packages",
        minecraftProduct === "stable"
            ? "Microsoft.MinecraftUWP_8wekyb3d8bbwe"
            : "Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe",
        "LocalState",
        "games",
        "com.mojang"
    );
}

/**
 * Fonction principale de déploiement du projet Minecraft Bedrock.
 */
export async function deployProject(root: vscode.Uri, metadata: ProjectMetadata): Promise<void> {
    vscode.window.showInformationMessage("✨ Déploiement du projet en cours...");

    const { type, id, minecraftProduct } = metadata;

    const basePath = getDeployBasePath(minecraftProduct);
    if (!basePath) {
        vscode.window.showErrorMessage("Impossible de déterminer le dossier LocalAppData.");
        return;
    }

    try {
        switch (type) {
            case "addon": {
                const behaviorPack = vscode.Uri.joinPath(root, "addon", "behavior_pack");
                const resourcePack = vscode.Uri.joinPath(root, "addon", "resource_pack");

                if (await directoryExists(behaviorPack)) {
                    const compiled = await compileTypeScriptIfNeeded(root);
                    if (!compiled) return;

                    await copyPackIfExists(behaviorPack, path.join(basePath, "development_behavior_packs", id));
                }

                if (await directoryExists(resourcePack)) {
                    await copyPackIfExists(resourcePack, path.join(basePath, "development_resource_packs", id));
                }
                break;
            }

            default:
                vscode.window.showWarningMessage(`Type de projet non supporté pour le déploiement : ${type}`);
        }

        vscode.window.showInformationMessage(`✅ Projet "${id}" déployé avec succès !`);
        
        // Proposer de lancer Minecraft après un déploiement réussi
        await promptToLaunchMinecraft(minecraftProduct);
    } catch (error) {
        console.error("Erreur lors du déploiement :", error);
        vscode.window.showErrorMessage("❌ Une erreur est survenue pendant le déploiement. Voir la console.");
    }
}