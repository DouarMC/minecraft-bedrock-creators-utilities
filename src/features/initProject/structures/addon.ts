import * as vscode from "vscode";
import { exec } from "child_process";
import { promisify } from "util";
import { randomUUID } from "crypto";
import { writeJsonFilePretty } from "../../../utils/json/jsonUtils";
import { MinecraftAddonPack, MinecraftProduct, ProjectMetadata } from "../../../types/projectConfig";
import { SCRIPT_API_MODULES, SCRIPT_API_MODULES_NAMES, SCRIPT_API_MODULES_NAMES_PREVIEW, SCRIPT_API_MODULES_PREVIEW, SCRIPT_API_MODULES_VERSIONS_PACKAGE, SCRIPT_API_MODULES_VERSIONS_PACKAGE_PREVIEW } from "../../../utils/data/scriptApiModules";

/**
 * Crée un objet de base pour le manifeste d'un pack de comportement ou de ressources.
 * @param type Le type de pack, soit "behavior_pack" soit "resource_pack".
 * @returns 
 */
function createManifestObject(type: MinecraftAddonPack): any {
    // Vérifie le type de pack et crée un manifeste de base en conséquence
    const isBehaviorPack = type === "behavior_pack";
    // Crée un objet de manifeste de base avec les propriétés communes
    const baseManifest = {
        format_version: 2,
        header: {
            name: "pack.name",
            description: "pack.description",
            uuid: randomUUID(),
            version: [0, 0, 1]
        },
        modules: [
            {
                type: isBehaviorPack ? "data" : "resources", // Définit le type de module en fonction du type de pack
                uuid: randomUUID(),
                version: [0, 0, 1]
            }
        ]
    };

    return baseManifest;
}

async function createPackFoldersAndManifests(
    projectFolder: vscode.Uri,
    packsAddon: MinecraftAddonPack[]
): Promise<{ behaviorManifest?: any, resourceManifest?: any }> {
    let behaviorManifest: any = undefined;
    let resourceManifest: any = undefined;

    for (const pack of packsAddon) {
        const packPath = vscode.Uri.joinPath(projectFolder, "addon", pack);
        await vscode.workspace.fs.createDirectory(packPath);

        const manifest = createManifestObject(pack);

        if (pack === MinecraftAddonPack.BehaviorPack) {
            behaviorManifest = manifest;
        } else if (pack === MinecraftAddonPack.ResourcePack) {
            resourceManifest = manifest;
        }
    }

    return { behaviorManifest, resourceManifest };
}

function configurePackDependencies(behaviorManifest?: any, resourceManifest?: any): void {
    if (behaviorManifest && resourceManifest) {
        behaviorManifest.dependencies = behaviorManifest.dependencies ?? [];
        resourceManifest.dependencies = resourceManifest.dependencies ?? [];

        behaviorManifest.dependencies.push({
            uuid: resourceManifest.header.uuid,
            version: resourceManifest.header.version
        });

        resourceManifest.dependencies.push({
            uuid: behaviorManifest.header.uuid,
            version: behaviorManifest.header.version
        });

        resourceManifest.header.pack_scope = "world";
    } else if (resourceManifest) {
        resourceManifest.header.pack_scope = "any";
    }
}

async function addScriptApiIfNeeded(
    projectFolder: vscode.Uri,
    behaviorManifest: any,
    minecraftProduct: MinecraftProduct
): Promise<Record<string, string> | undefined> {
    const hasScriptApi = await vscode.window.showQuickPick(["Oui", "Non"], {
        title: "Inclure l'API Script",
        placeHolder: "Voulez-vous inclure l'API Script dans le pack de comportement ?",
        canPickMany: false
    });

    if (hasScriptApi !== "Oui") return;

    const moduleNames = minecraftProduct === "stable"
        ? SCRIPT_API_MODULES_NAMES
        : SCRIPT_API_MODULES_NAMES_PREVIEW;

    const moduleVersions = minecraftProduct === "stable"
        ? SCRIPT_API_MODULES
        : SCRIPT_API_MODULES_PREVIEW;

    const packageVersions = minecraftProduct === "stable"
        ? SCRIPT_API_MODULES_VERSIONS_PACKAGE
        : SCRIPT_API_MODULES_VERSIONS_PACKAGE_PREVIEW;

    const selectedModules = await vscode.window.showQuickPick(moduleNames, {
        title: "Modules de l'API Script",
        placeHolder: "Sélectionnez les modules à inclure",
        canPickMany: true
    });

    if (!selectedModules || selectedModules.length === 0) return;

    const npmDependencies: Record<string, string> = {};

    behaviorManifest.modules.push({
        type: "script",
        uuid: randomUUID(),
        version: [0, 0, 1],
        language: "javascript",
        entry: "scripts/main.js"
    });

    for (const module of selectedModules) {
        const version = await vscode.window.showQuickPick(moduleVersions[module], {
            title: `Version du module ${module}`,
            placeHolder: `Sélectionnez la version du module ${module}`
        });

        if (version) {
            behaviorManifest.dependencies.push({
                module_name: module,
                version
            });
            npmDependencies[module] = packageVersions[module][version];
        }
    }

    // Crée le dossier scripts et main.ts
    const scriptsPath = vscode.Uri.joinPath(projectFolder, "addon", "scripts");
    await vscode.workspace.fs.createDirectory(scriptsPath);

    await vscode.workspace.fs.writeFile(
        vscode.Uri.joinPath(scriptsPath, "main.ts"),
        Buffer.from(`// Script principal\nconsole.warn("Hello from main.ts!");`, "utf8")
    );

    // Crée le fichier tsconfig.json
    const tsconfigContent = {
        compilerOptions: {
            target: "ES2020",
            module: "ESNext",
            moduleResolution: "Node",
            outDir: "addon/behavior_pack/scripts",
            rootDir: "addon/scripts",
            strict: true,
            allowJs: false
        },
        include: ["addon/scripts/**/*.ts"]
    };

    await vscode.workspace.fs.writeFile(
        vscode.Uri.joinPath(projectFolder, "tsconfig.json"),
        Buffer.from(JSON.stringify(tsconfigContent, null, 4), "utf8")
    );

    return npmDependencies;
}

export async function createLangFilesAndIcons(
    folder: vscode.Uri,
    packType: MinecraftAddonPack,
    displayName: string,
    version: string,
    author: string,
    context: vscode.ExtensionContext
): Promise<void> {
    const packFolder = vscode.Uri.joinPath(folder, "addon", packType);

    // 📁 Crée le dossier "texts"
    const textsFolder = vscode.Uri.joinPath(packFolder, "texts");
    await vscode.workspace.fs.createDirectory(textsFolder);

    // 🗂 languages.json
    const languagesPath = vscode.Uri.joinPath(textsFolder, "languages.json");
    await vscode.workspace.fs.writeFile(
        languagesPath,
        Buffer.from(JSON.stringify(["en_US"], null, 4), "utf8")
    );

    // 🗣 en_US.lang
    const langContent =
        `pack.name=${displayName} ${packType === MinecraftAddonPack.BehaviorPack ? "BP" : "RP"} [v${version}] - by ${author}\n` +
        `pack.description=${packType === MinecraftAddonPack.BehaviorPack ? "Behavior" : "Resource"} Pack for ${displayName} - Created by ${author}`;

    const enUSPath = vscode.Uri.joinPath(textsFolder, "en_US.lang");
    await vscode.workspace.fs.writeFile(
        enUSPath,
        Buffer.from(langContent, "utf8")
    );

    // 🖼️ pack_icon.png
    const iconSource = vscode.Uri.joinPath(context.extensionUri, "resources", "default_pack_icon.png");
    const iconTarget = vscode.Uri.joinPath(packFolder, "pack_icon.png");

    await vscode.workspace.fs.copy(iconSource, iconTarget);
}

async function promptAddonPackTypes(): Promise<MinecraftAddonPack[]> {
    const packAddons: MinecraftAddonPack[] = [];

    const PACK_TYPE_ITEMS: vscode.QuickPickItem[] = [
        {
            label: MinecraftAddonPack.BehaviorPack,
            description: "Pack de comportement.",
            detail: "Contient les comportements, entités, et scripts.",
            alwaysShow: true
        },
        {
            label: MinecraftAddonPack.ResourcePack,
            description: "Pack de ressources.",
            detail: "Contient les textures, sons, et modèles.",
            alwaysShow: true
        }
    ];

    const packAddonItems = await vscode.window.showQuickPick(
        PACK_TYPE_ITEMS,
        {
            title: "Types de packs de l'addon",
            placeHolder: "Sélectionnez le/les types de packs pour l'addon",
            canPickMany: true,
            ignoreFocusOut: true
        }
    );

    if (packAddonItems !== undefined) {
        for (const item of packAddonItems) {
            packAddons.push(item.label as MinecraftAddonPack);
        }
    }

    return packAddons;
}

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

    const packageJsonContent = {
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
        const npmDependencies = await addScriptApiIfNeeded(projectFolder, behaviorManifest, metadata.minecraftProduct);
        if (npmDependencies) {
            packageJsonContent.dependencies = npmDependencies;
        }
        await writeJsonFilePretty(
            vscode.Uri.joinPath(addonFolder, MinecraftAddonPack.BehaviorPack, "manifest.json"),
            behaviorManifest
        );
    }

    if (resourceManifest !== undefined) {
        await writeJsonFilePretty(
            vscode.Uri.joinPath(addonFolder, MinecraftAddonPack.ResourcePack, "manifest.json"),
            resourceManifest
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

    // npm install
    try {
        const execPromise = promisify(exec);

        // Vérifie si npm est disponible
        await execPromise("npm -v");

        // Exécute npm install dans le dossier du projet
        const { stdout, stderr } = await execPromise("npm install", { cwd: projectFolder.fsPath });

        if (stderr) console.error(stderr);
        vscode.window.showInformationMessage("📦 Modules npm installés !");
    } catch (error: any) {
        // Vérifie si le problème vient du fait que npm n'est pas reconnu
        const isNpmNotFound = error?.message?.includes("npm") || error?.code === "ENOENT";

        if (isNpmNotFound) {
            vscode.window.showErrorMessage(
                "❌ Node.js (et npm) est requis pour initialiser les dépendances. Installez-le depuis https://nodejs.org/"
            );
        } else {
            console.error("npm install failed:", error);
            vscode.window.showErrorMessage("❌ npm install a échoué.");
        }
    }
}