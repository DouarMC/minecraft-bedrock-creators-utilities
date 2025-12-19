import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { Feature } from "../../core/features/Feature";
import { MinecraftProjectManager } from "../../core/project/MinecraftProjectManager";
import { AddonMinecraftProject } from "../../core/project/MinecraftProject";
import { ProjectService } from "../../core/project/ProjectService";
import { PromptService } from "../../core/ui/PromptService";
import { VscodeUtils } from "../../core/utils/VscodeUtils";
import { MinecraftFileResolverService } from "../../core/minecraft/fileTypes/MinecraftFileResolverService";

export class AddScriptApiFeature extends Feature {
    private static readonly ADD_SCRIPT_API_COMMAND_ID = "minecraft-bedrock-creators-utilities.addScriptApi";

    public register(): void {
        const disposable = vscode.commands.registerCommand(AddScriptApiFeature.ADD_SCRIPT_API_COMMAND_ID, async () => {
            const minecraftProject = MinecraftProjectManager.project;
            if (minecraftProject === undefined) {
                vscode.window.showErrorMessage("Aucun projet Minecraft Bedrock n'est chargé.");
                return;
            }

            if (minecraftProject instanceof AddonMinecraftProject === false) {
                vscode.window.showErrorMessage("L'API de script ne peut être ajoutée qu'aux projets de type 'Addon'.");
                return;
            }

            try {
                minecraftProject.getBehaviorPackFolder();
            } catch (error) {
                vscode.window.showErrorMessage("Il faut un Behavior Pack dans le projet pour ajouter l'API de script.");
                return;
            }

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

            const manifestUri = manifest[0];
            const manifestContent = await vscode.workspace.fs.readFile(manifestUri);
            const manifestJson = JsonParser.parse(manifestContent.toString());

            if (manifestJson.modules === undefined) {
                manifestJson.modules = [];
            }

            const hasScriptModule = manifestJson.modules.some((module: any) => module.type === "script");
            if (hasScriptModule) {
                vscode.window.showInformationMessage("L'API de script est déjà présente dans le manifeste.");
                return;
            }

            // Active l'API de script dans le manifeste
            try {
                await ProjectService.createScriptApiStructure(minecraftProject.folder);
            } catch (error) {
                vscode.window.showErrorMessage(`Erreur lors de la création de la structure de l'API de script : ${error}`);
                return;
            }

            let selectedModules: Record<string, { version: string, npmVersion: string }> | undefined;
            try {
                selectedModules = await PromptService.askScriptApiModules();
            } catch (error) {
                vscode.window.showErrorMessage(`Erreur lors de la sélection des modules de l'API de script : ${error}`);
                return;
            }

            if (selectedModules !== undefined) {
                let packageJsonUri: vscode.Uri;
                try {
                    packageJsonUri = await minecraftProject.getPackageJsonFileUri();
                } catch (error) {
                    vscode.window.showErrorMessage("Le fichier package.json est introuvable dans le projet.");
                    return;
                }

                let packageJsonContent: any;
                try {
                    const content = await vscode.workspace.fs.readFile(packageJsonUri);
                    packageJsonContent = JSON.parse(content.toString());
                } catch (e) {
                    vscode.window.showErrorMessage("Impossible de lire le fichier package.json.");
                    return;
                }

                try {
                    ProjectService.addScriptApiModules(manifestJson, packageJsonContent, selectedModules);
                } catch (error) {
                    vscode.window.showErrorMessage(`Erreur lors de l'ajout des modules de l'API de script : ${error}`);
                }

                await VscodeUtils.writeFile(packageJsonUri, JSON.stringify(packageJsonContent, null, 4));

                await ProjectService.installNpmDependencies(minecraftProject.folder);
            }

            await VscodeUtils.writeFile(manifestUri, JSON.stringify(manifestJson, null, 4));

            vscode.window.showInformationMessage("L'API de script a été ajoutée avec succès au projet.");
        });

        this.extensionContext.subscriptions.push(disposable);
    }
}