import * as vscode from "vscode";
import * as path from "path";
import * as JsonParser from "jsonc-parser";
import { Feature } from "../Feature";
import { MinecraftProjectManager } from "../../services/projects/MinecraftProjectManager";
import { AddonMinecraftProject } from "../../core/minecraft/models/projects/AddonMinecraftProject";
import { ProjectService } from "../../services/projects/ProjectService";
import { PromptService } from "../../services/prompts/PromptService";
import { VscodeUtils } from "../../vscode-utils/VscodeUtils";
import { MinecraftFileResolverService } from "../../services/minecraft/MinecraftFileResolverService";
import { MinecraftProject } from "../../core/minecraft/models/projects/MinecraftProject";

export class AddScriptApiFeature extends Feature {
    /**
     * Identifiant de la commande pour ajouter l'API de script au projet.
     */
    private static readonly ADD_SCRIPT_API_COMMAND_ID = "minecraft-bedrock-creators-utilities.addScriptApi";

    public register(): void {
        const disposable = vscode.commands.registerCommand(AddScriptApiFeature.ADD_SCRIPT_API_COMMAND_ID, async () => {
            // Vérifie qu'un projet Minecraft Bedrock est chargé
            let minecraftProject: MinecraftProject;
            try {
                minecraftProject = MinecraftProjectManager.getProject();
            } catch (error) {
                vscode.window.showErrorMessage("Aucun projet Minecraft Bedrock n'est chargé. Veuillez charger un projet avant de tenter d'ajouter l'API de script.");
                return;
            }

            // L'API de script ne peut être ajoutée que pour les projets de type Addon
            if (minecraftProject instanceof AddonMinecraftProject === false) {
                vscode.window.showErrorMessage("L'API de script ne peut être ajoutée qu'aux projets de type 'Addon'.");
                return;
            }

            // Récupère le dossier du Behavior Pack du projet
            try {
                if (! await VscodeUtils.isDirectory(minecraftProject.getBehaviorPackPath())) {
                    vscode.window.showErrorMessage("Le projet ne contient pas de dossier de Behavior Pack valide. Assurez-vous que le projet est correctement structuré.");
                    return;
                }
            } catch (error) {
                if (error instanceof Error) {
                    vscode.window.showErrorMessage("Erreur lors de la vérification du dossier de Behavior Pack : " + error.message);
                }
                return;
            }

            // Récupère le manifeste du Behavior Pack
            let manifest: any;
            try {
                manifest = await MinecraftFileResolverService.getDataDrivenFiles("behavior_pack/manifest.json", minecraftProject);
            } catch (error) {
                vscode.window.showErrorMessage("Impossible de lire le manifeste du Behavior Pack. Assurez-vous qu'il existe.");
                return;
            }
            if (manifest.length === 0) {
                vscode.window.showErrorMessage("Le manifeste du Behavior Pack est introuvable.");
                return;
            }

            const manifestUri = manifest[0]; // On prend le premier manifeste trouvé, il devrait n'y en avoir qu'un
            const manifestContent = await vscode.workspace.fs.readFile(manifestUri); // Lit le contenu du manifeste
            const manifestJson = JsonParser.parse(manifestContent.toString()); // Parse le contenu du manifeste en JSON

            // Vérifie si le manifeste contient déjà une section "modules" et si l'API de script est déjà présente
            if (manifestJson.modules === undefined) {
                manifestJson.modules = [];
            }

            // Vérifie si l'API de script est déjà présente dans le manifeste
            const hasScriptModule = manifestJson.modules.some((module: any) => module.type === "script");
            if (hasScriptModule) {
                vscode.window.showInformationMessage("L'API de script est déjà présente dans le manifeste.");
                return;
            }

            // Active l'API de script dans le manifeste, et ajoute les modules sélectionnés par l'utilisateur
            try {
                await ProjectService.createScriptApiStructure(VscodeUtils.getUriFromPath(minecraftProject.folder));
            } catch (error) {
                if (error instanceof Error) {
                    vscode.window.showErrorMessage("Erreur lors de la création de la structure de l'API de script : " + error.message);
                }
                return;
            }

            // Demande à l'utilisateur de sélectionner les modules de l'API de script à ajouter au projet
            let selectedModules: Record<string, { version: string, npmVersion: string }> | undefined;
            try {
                selectedModules = await PromptService.askScriptApiModules(minecraftProject.minecraftProduct);
            } catch (error) {
                if (error instanceof Error) {
                    vscode.window.showErrorMessage("Erreur lors de la sélection des modules de l'API de script : " + error.message);
                }
                return;
            }

            // Si l'utilisateur a sélectionné des modules, on les ajoute au manifeste et au package.json du projet
            if (selectedModules !== undefined) {
                // On récupère le package.json du projet pour y ajouter les modules de l'API de script en dépendances, et ainsi les installer via npm
                let packageJsonUri: vscode.Uri;
                try {
                    packageJsonUri = VscodeUtils.getUriFromPath(path.join(minecraftProject.folder, "package.json"));
                } catch (error) {
                    if (error instanceof Error) {
                        vscode.window.showErrorMessage("Erreur lors de la récupération du package.json du projet : " + error.message);
                    }
                    return;
                }

                let packageJsonContent: any;
                try {
                    const content = await vscode.workspace.fs.readFile(packageJsonUri);
                    packageJsonContent = JSON.parse(content.toString());
                } catch (error) {
                    vscode.window.showErrorMessage("Impossible de lire le fichier package.json.");
                    return;
                }

                try { // Ajoute les modules de l'API de script au manifeste et au package.json du projet
                    ProjectService.addScriptApiModules(manifestJson, packageJsonContent, selectedModules);
                } catch (error) {
                    vscode.window.showErrorMessage(`Erreur lors de l'ajout des modules de l'API de script : ${error}`);
                    return;
                }

                // Enregistre les modifications dans le manifeste et le package.json du projet
                await VscodeUtils.writeFile(packageJsonUri, JSON.stringify(packageJsonContent, null, 4));

                // Installe les dépendances npm des modules de l'API de script ajoutés au projet
                await ProjectService.installNpmDependencies(VscodeUtils.getUriFromPath(minecraftProject.folder));
            }

            // Enregistre les modifications dans le manifeste du projet
            await VscodeUtils.writeFile(manifestUri, JSON.stringify(manifestJson, null, 4));

            vscode.window.showInformationMessage("L'API de script a été ajoutée avec succès au projet.");
        });

        this.extensionContext.subscriptions.push(disposable);
    }
}