import * as vscode from "vscode";
import { MinecraftAddonPack, ProjectMetadata } from "../../../types/projectConfig";
import { configurePackDependencies } from "../../../core/project/generators/addon/configurePackDependencies";
import { promptAddonPackTypes } from "../../../core/project/prompts/promptAddonPackTypes";
import { promptScriptApiModules } from "../../../core/project/prompts/promptScriptApiModules";
import { generateScriptApiStructure } from "../../../core/project/generators/addon/scriptApi/generateScriptApiStructure";
import { installDependencies } from "../../../core/project/generators/addon/scriptApi/installDependencies";
import { enableScriptApiInManifest } from "../../../core/project/generators/addon/scriptApi/enableScriptApiInManifest";
import { addScriptApiModules } from "../../../core/project/generators/addon/scriptApi/addScriptApiModules";
import { createAddonFolder } from "../../../core/project/generators/addon/createAddonFolder";
import { createBasePackageJson } from "../../../core/project/generators/packageJsonUtils";
import { createManifestObject } from "../../../core/project/generators/addon/createManifest";
import { createPackIconFile } from "../../../core/project/generators/createPackIconFile";
import { createPackFolder } from "../../../core/project/generators/addon/createPackFolder";
import { createEnUsLangFile } from "../../../core/project/generators/createEnUsLangFile";

export async function createAddonStructure(projectFolder: vscode.Uri, metadata: ProjectMetadata) {
    // Base du package.json
    const packageJsonContent = createBasePackageJson(metadata);

    // Création du dossier "addon"
    const addonFolder = await createAddonFolder(projectFolder);

    // Sélection des types de packs
    const packsAddon = await promptAddonPackTypes();
    if (packsAddon.length === 0) {
        vscode.window.showWarningMessage("Aucun type de pack sélectionné. L'initialisation de l'addon a été annulée.");
        return;
    }

    const isBehaviorPack = packsAddon.includes(MinecraftAddonPack.BehaviorPack);
    const isResourcePack = packsAddon.includes(MinecraftAddonPack.ResourcePack);

    let behaviorManifest: any = undefined;
    let resourceManifest: any = undefined;

    if (isBehaviorPack === true) {
        // Crée le dossier du pack de comportement
        const behaviorPackFolder = await createPackFolder(projectFolder, MinecraftAddonPack.BehaviorPack);
        
        // Crée la base du manifeste du pack de comportement
        behaviorManifest = createManifestObject(MinecraftAddonPack.BehaviorPack);

        // Proposer Script API si le pack de comportement est sélectionné
        const enableScriptApi = await vscode.window.showQuickPick(
            ["Oui", "Non"],
            {
                title: "Activer l'API Script",
                placeHolder: "Voulez-vous activer l'API Script dans le pack de comportement ?",
                canPickMany: false,
                ignoreFocusOut: true
            }
        );

        if (enableScriptApi === "Oui") {
            await generateScriptApiStructure(projectFolder);
            enableScriptApiInManifest(behaviorManifest);

            const selectedModules = await promptScriptApiModules(metadata.minecraftProduct);
            if (selectedModules !== undefined) {
                addScriptApiModules(behaviorManifest, packageJsonContent, selectedModules);
            }
        }

        await createPackIconFile(behaviorPackFolder);
        await createEnUsLangFile(behaviorPackFolder, metadata, MinecraftAddonPack.BehaviorPack);
    }

    if (isResourcePack === true) {
        // Crée le dossier du pack de ressources
        const resourcePackFolder = await createPackFolder(projectFolder, MinecraftAddonPack.ResourcePack);
        // Crée la base du manifeste du pack de ressources
        resourceManifest = createManifestObject(MinecraftAddonPack.ResourcePack);

        await createPackIconFile(resourcePackFolder);
        await createEnUsLangFile(resourcePackFolder, metadata, MinecraftAddonPack.ResourcePack);
    }

    // Configuration des dépendances entre packs si nécessaire
    configurePackDependencies(behaviorManifest, resourceManifest);

    if (behaviorManifest !== undefined) {
        // Écriture du manifeste du pack de comportement
        await vscode.workspace.fs.writeFile(
            vscode.Uri.joinPath(addonFolder, MinecraftAddonPack.BehaviorPack, "manifest.json"),
            Buffer.from(JSON.stringify(behaviorManifest, null, 4), "utf8")
        );
    }

    if (resourceManifest !== undefined) {
        // Écriture du manifeste du pack de ressources
        await vscode.workspace.fs.writeFile(
            vscode.Uri.joinPath(addonFolder, MinecraftAddonPack.ResourcePack, "manifest.json"),
            Buffer.from(JSON.stringify(resourceManifest, null, 4), "utf8")
        );
    }

    // Écriture du fichier package.json
    await vscode.workspace.fs.writeFile(
        vscode.Uri.joinPath(projectFolder, "package.json"),
        Buffer.from(JSON.stringify(packageJsonContent, null, 4), "utf8")
    );

    // Installation des dépendances npm
    await installDependencies(projectFolder);
}