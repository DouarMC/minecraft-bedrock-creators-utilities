import * as vscode from "vscode";
import { MinecraftAddonPack, ProjectMetadata } from "../../../types/projectConfig";
import { createPackFoldersAndManifests } from "./addon/createPackFolders";
import { configurePackDependencies } from "./addon/configurePackDependencies";
import { promptAddonPackTypes } from "./addon/promptAddonPackTypes";
import { promptScriptApiModules } from "./addon/promptScriptApiModules";
import { generateScriptApiStructure } from "./addon/generateScriptApiStructure";
import { createLangFilesAndIcons } from "./addon/createLangFilesAndIcons";
import { installDependencies } from "./addon/installDependencies";
import { AddonPackageJson } from "../../../types/addonPackageJson";

async function createAddonFolder(projectFolder: vscode.Uri): Promise<vscode.Uri> {
    const addonFolder = vscode.Uri.joinPath(projectFolder, "addon");
    await vscode.workspace.fs.createDirectory(addonFolder);
    return addonFolder;
}

export async function createAddonStructure(projectFolder: vscode.Uri, metadata: ProjectMetadata, context: vscode.ExtensionContext) {
    const addonFolder = await createAddonFolder(projectFolder);

    const packsAddon = await promptAddonPackTypes();
    if (packsAddon.length === 0) {
        vscode.window.showWarningMessage("Aucun type de pack sélectionné. L'initialisation de l'addon a été annulée.");
        return;
    }

    const packageJsonContent: AddonPackageJson = {
        name: metadata.id,
        version: "0.0.1",
        description: `Addon for ${metadata.displayName}`,
        license: "MIT",
        dependencies: {},
        type: "module"
    };

    const { behaviorManifest, resourceManifest } = await createPackFoldersAndManifests(projectFolder, packsAddon);
    configurePackDependencies(behaviorManifest, resourceManifest);

    if (behaviorManifest !== undefined) {
        const selectedModules = await promptScriptApiModules(metadata.minecraftProduct);

        if (selectedModules) {
            // Ajout des dépendances npm
            for (const [module, version] of Object.entries(selectedModules)) {
                behaviorManifest.dependencies.push({
                    module_name: module,
                    version
                });
                packageJsonContent.dependencies[module] = version;
            }

            await generateScriptApiStructure(projectFolder, behaviorManifest, packageJsonContent.dependencies);
        }

        await vscode.workspace.fs.writeFile(
            vscode.Uri.joinPath(addonFolder, MinecraftAddonPack.BehaviorPack, "manifest.json"),
            Buffer.from(JSON.stringify(behaviorManifest, null, 4), "utf8")
        );
    }

    if (resourceManifest !== undefined) {
        await vscode.workspace.fs.writeFile(
            vscode.Uri.joinPath(addonFolder, MinecraftAddonPack.ResourcePack, "manifest.json"),
            Buffer.from(JSON.stringify(resourceManifest, null, 4), "utf8")
        );
    }

    for (const pack of packsAddon) {
        const manifest = pack === MinecraftAddonPack.BehaviorPack ? behaviorManifest : resourceManifest;
        if (!manifest) continue;

        await createLangFilesAndIcons(
            projectFolder,
            pack,
            metadata.displayName,
            manifest.header.version.join("."),
            metadata.author,
            context
        );
    }

    await vscode.workspace.fs.writeFile(
        vscode.Uri.joinPath(projectFolder, "package.json"),
        Buffer.from(JSON.stringify(packageJsonContent, null, 4), "utf8")
    );

    await installDependencies(projectFolder);
}