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
    // Création du dossier "addon"
    const addonFolder = await createAddonFolder(projectFolder);

    // Sélection des types de packs
    const packsAddon = await promptAddonPackTypes();
    if (packsAddon.length === 0) {
        vscode.window.showWarningMessage("Aucun type de pack sélectionné. L'initialisation de l'addon a été annulée.");
        return;
    }

    // Base du package.json
    const packageJsonContent: AddonPackageJson = {
        name: metadata.id,
        version: "0.0.1",
        description: `Addon for ${metadata.displayName}`,
        license: "MIT",
        dependencies: {},
        type: "module"
    };

    // Création des dossiers de packs et des objets manifestes
    const { behaviorManifest, resourceManifest } = await createPackFoldersAndManifests(projectFolder, packsAddon);
    // Configuration des dépendances entre packs si nécessaire
    configurePackDependencies(behaviorManifest, resourceManifest);

    // Ajout des modules Script API si le pack de comportement est présent
    if (behaviorManifest !== undefined) {
        // Demande des modules Script API à inclure si l'utilisateur a choisi d'en inclure
        const selectedModules = await promptScriptApiModules(metadata.minecraftProduct);

        // Si des modules ont été sélectionnés, on les ajoute au manifeste et au package.json
        if (selectedModules !== undefined) {
            // Ajout  des modules au manifeste et au package.json
            for (const [module, version] of Object.entries(selectedModules)) {
                // Ajout au manifeste
                behaviorManifest.dependencies.push({
                    module_name: module,
                    version: version
                });
                // Ajout au package.json
                packageJsonContent.dependencies[module] = version;
            }

            // Génération de la structure de l'API Script dans le pack de comportement
            await generateScriptApiStructure(projectFolder, behaviorManifest);
        }

        // Écriture du manifeste du pack de comportement
        await vscode.workspace.fs.writeFile(
            vscode.Uri.joinPath(addonFolder, MinecraftAddonPack.BehaviorPack, "manifest.json"),
            Buffer.from(JSON.stringify(behaviorManifest, null, 4), "utf8")
        );
    }

    // Écriture du manifeste du pack de ressources s'il existe
    if (resourceManifest !== undefined) {
        // Écriture du manifeste du pack de ressources
        await vscode.workspace.fs.writeFile(
            vscode.Uri.joinPath(addonFolder, MinecraftAddonPack.ResourcePack, "manifest.json"),
            Buffer.from(JSON.stringify(resourceManifest, null, 4), "utf8")
        );
    }

    // Création des fichiers de langue et des icônes pour chaque pack
    for (const pack of packsAddon) {
        const manifest = pack === MinecraftAddonPack.BehaviorPack ? behaviorManifest : resourceManifest;
        if (manifest === undefined) continue;

        await createLangFilesAndIcons(
            projectFolder,
            pack,
            metadata.displayName,
            manifest.header.version.join("."),
            metadata.author,
            context
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