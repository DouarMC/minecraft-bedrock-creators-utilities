import * as vscode from 'vscode';
import { parseEnvValue } from '../../utils/envUtils';
import { directoryExists } from '../../utils/workspace/directories';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

/**
 * Inscription de la commande pour déployer le projet Minecraft Bedrock.
 * @param context Le contexte de l'extension VSCode.
 */
export function registerDeployProjectCommand(context: vscode.ExtensionContext) {
    const command = vscode.commands.registerCommand("minecraft-bedrock-creators-utilities.deployProject", async () => {
        vscode.window.showInformationMessage("✨ Déploiement du projet en cours...");

        // Vérification des dossiers de travail ouverts
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            vscode.window.showErrorMessage("Aucun dossier de travail ouvert. Veuillez ouvrir un projet Minecraft Bedrock.");
            return;
        }

        // Base URI du projet
        const root = workspaceFolders[0].uri;
        // Récupération du fichier .env
        const envUri = vscode.Uri.joinPath(root, ".env");

        try {
            // Vérification de l'existence du fichier .env
            const envFile = await vscode.workspace.fs.readFile(envUri);
            const envContent = Buffer.from(envFile).toString("utf8");

            // Extraction des variables d'environnement
            const type = parseEnvValue(envContent, "PROJECT_TYPE");
            const id = parseEnvValue(envContent, "PROJECT_ID");
            const product = parseEnvValue(envContent, "MINECRAFT_PRODUCT") ?? "stable";

            // Vérification des variables d'environnement
            if (!type || !id) {
                vscode.window.showErrorMessage("Le fichier .env est incomplet (PROJECT_TYPE ou PROJECT_ID manquant).");
                return;
            }

            // Récupération du dossier LocalAppData
            const localAppData = process.env.LOCALAPPDATA;
            if (!localAppData) {
                vscode.window.showErrorMessage("Impossible de déterminer le dossier LocalAppData.");
                return;
            }

            // Construction du chemin de base pour le déploiement
            const basePath = path.join(
                localAppData,
                "Packages",
                product === "stable" ? "Microsoft.MinecraftUWP_8wekyb3d8bbwe" : "Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe",
                "LocalState",
                "games",
                "com.mojang"
            );

            switch (type) {
                // Cas pour un projet de type "addon"
                case "addon": {
                    // Récupération du chemin du dossier du behavior_pack
                    const behaviorPack = vscode.Uri.joinPath(root, "addon", "behavior_pack"); 
                    // Vérification de l'existence du dossier behavior_pack
                    if (await directoryExists(behaviorPack)) {
                        // Compile le TypeScript s'il y a du scripts dans le behavior_pack
                        const scriptsPath = vscode.Uri.joinPath(behaviorPack, "scripts");
                        if (await directoryExists(scriptsPath)) {
                            // Exécution de la commande tsc pour compiler les scripts TypeScript
                            const execPromise = promisify(exec);
                            try {
                                const { stdout, stderr } = await execPromise(`tsc`, { cwd: root.fsPath});
                                console.log(stdout);
                                if (stderr) {
                                    console.error(stderr);
                                    vscode.window.showErrorMessage("Erreur lors de la compilation TypeScript : " + stderr);
                                    return;
                                }
                            } catch (error) {
                                console.error("Erreur lors de l'exécution de tsc :", error);
                                vscode.window.showErrorMessage("Erreur lors de l'exécution de tsc. Veuillez vérifier la console pour plus de détails.");
                                return;
                            }
                        }

                        // Copie du behavior_pack dans le dossier de développement
                        await vscode.workspace.fs.copy(behaviorPack, vscode.Uri.file(path.join(basePath, "development_behavior_packs", id)), { overwrite: true });
                    }

                    // Récupération du chemin du dossier du resource_pack
                    const resourcePack = vscode.Uri.joinPath(root, "addon", "resource_pack");
                    // Vérification de l'existence du dossier resource_pack
                    if (await directoryExists(resourcePack)) {
                        // Copie du resource_pack dans le dossier de développement
                        await vscode.workspace.fs.copy(resourcePack, vscode.Uri.file(path.join(basePath, "development_resource_packs", id)), { overwrite: true });
                    }
                    break;
                }
            }

            vscode.window.showInformationMessage(`✅ Projet "${id}" déployé avec succès !`);
        } catch (error) {
            console.error("Erreur lors du déploiement du projet :", error);
            vscode.window.showErrorMessage("Une erreur est survenue lors du déploiement du projet. Veuillez vérifier la console pour plus de détails.");
        }
    });

    context.subscriptions.push(command);
}