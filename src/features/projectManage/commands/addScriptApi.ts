import * as vscode from "vscode";
import * as JsonParser from "jsonc-parser";
import { getCurrentProject } from "../../../core/project/projectManager";
import { MinecraftProjectType } from "../../../types/projectConfig";
import { generateScriptApiStructure } from "../../../core/project/generators/addon/scriptApi/generateScriptApiStructure";
import { promptScriptApiModules } from "../../../core/project/prompts/promptScriptApiModules";
import { enableScriptApiInManifest } from "../../../core/project/generators/addon/scriptApi/enableScriptApiInManifest";
import { addScriptApiModules } from "../../../core/project/generators/addon/scriptApi/addScriptApiModules";
import { installDependencies } from "../../../core/project/generators/addon/scriptApi/installDependencies";

async function addScriptApi(): Promise<void> {
    // Récupération du projet courant
    const currentProject = getCurrentProject();
    // Si aucun projet n'est ouvert, on arrête le processus
    if (currentProject === undefined) {
        vscode.window.showWarningMessage("Aucun projet Minecraft Bedrock n'est actuellement ouvert.");
        return;
    }

    // Vérification que le projet est de type "Addon"
    if (currentProject.type !== MinecraftProjectType.Addon) {
        vscode.window.showWarningMessage("L'API de script ne peut être ajoutée qu'aux projets de type 'Addon'.");
        return;
    }

    // Vérification que le projet contient un Behavior Pack
    const manifest = await currentProject.fileResolver.getDataDrivenFilesFromProject("behavior_pack/manifest.json");
    if (manifest.length === 0) {
        vscode.window.showWarningMessage("Il faut un Behavior Pack dans le projet pour ajouter l'API de script.");
        return;
    }

    // Récupération du manifeste behavior pack
    const manifestUri = manifest[0];
    const manifestContent = await vscode.workspace.fs.readFile(manifestUri);
    const manifestJson = JsonParser.parse(manifestContent.toString());

    // Ajoute modules si nécessaire
    if (manifestJson.modules === undefined) {
        manifestJson.modules = [];
    }

    // Vérification que l'API de script n'est pas déjà activée
    const hasScriptModule = manifestJson.modules.some((module: any) => module.type === "script");
    if (hasScriptModule) {
        vscode.window.showInformationMessage("L'API de script est déjà présente dans le manifeste.");
        return;
    }

    // Active l'API de script dans le manifeste
    enableScriptApiInManifest(manifestJson);
    // Génère la structure de l'API de script si elle n'existe pas déjà
    await generateScriptApiStructure(currentProject.folder);

    // Propose à l'utilisateur les modules à ajouter
    const selectedModules = await promptScriptApiModules(currentProject.minecraftProduct);
    // Si l'utilisateur a sélectionné des modules, on les ajoute au package.json et on installe les dépendances
    if (selectedModules !== undefined) {
        const keys = Object.keys(selectedModules);
        // Si au moins un module est sélectionné
        if (keys.length > 0) {
            // Récupère le package.json du projet
            const packageJsonUri = await currentProject.getPackageJsonFile();
            // Si le package.json n'existe pas, on arrête le processus
            if (packageJsonUri === undefined) {
                vscode.window.showWarningMessage("Le fichier package.json est introuvable dans le projet.");
                return;
            }
            const packageJsonContent = await vscode.workspace.fs.readFile(packageJsonUri);
            const packageJson = JsonParser.parse(packageJsonContent.toString());

            // Ajoute les modules sélectionnés au package.json et au manifeste
            addScriptApiModules(manifestJson, packageJson, selectedModules);
            // Recrée le package.json avec les nouveaux modules
            await vscode.workspace.fs.writeFile(
                packageJsonUri,
                Buffer.from(JSON.stringify(packageJson, null, 4), "utf8")
            );

            // Installe les dépendances via npm
            await installDependencies(currentProject.folder);
        }
    }

    // Recrée le manifeste avec l'API de script activée et les modules ajoutés
    await vscode.workspace.fs.writeFile(
        manifestUri,
        Buffer.from(JSON.stringify(manifestJson, null, 4), "utf8")
    );
}

export function registerAddScriptApiCommand(context: vscode.ExtensionContext) {
    const command = vscode.commands.registerCommand(
        "minecraft-bedrock-creators-utilities.addScriptApi",
        addScriptApi
    );

    context.subscriptions.push(command);
}