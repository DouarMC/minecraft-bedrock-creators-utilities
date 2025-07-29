import * as vscode from "vscode";
import { exec } from "child_process";
import { promisify } from "util";
import { randomUUID } from "crypto";
import { writeJsonFilePretty } from "../../../utils/json/jsonUtils";
import { ProjectMetadata } from "../../../types/projectMetadata";
import { LAST_VERSION_STABLE, LAST_VERSION_PREVIEW } from "../../../utils/data/minecraftVersions";
import { SCRIPT_API_MODULES, SCRIPT_API_MODULES_NAMES, SCRIPT_API_MODULES_NAMES_PREVIEW, SCRIPT_API_MODULES_PREVIEW, SCRIPT_API_MODULES_VERSIONS_PACKAGE, SCRIPT_API_MODULES_VERSIONS_PACKAGE_PREVIEW } from "../../../utils/data/scriptApiModules";

/**
 * Crée un objet de base pour le manifeste d'un pack de comportement ou de ressources.
 * @param type Le type de pack, soit "behavior_pack" soit "resource_pack".
 * @param projectMinecraftProduct La version de Minecraft à utiliser pour le projet, soit "stable" soit "preview".
 * @returns 
 */
function createManifestObject(type: "behavior_pack" | "resource_pack", projectMinecraftProduct: "stable" | "preview"): any {
    // Vérifie le type de pack et crée un manifeste de base en conséquence
    const isBehaviorPack = type === "behavior_pack";
    // Crée un objet de manifeste de base avec les propriétés communes
    const baseManifest = {
        format_version: 2,
        header: {
            name: "pack.name",
            description: "pack.description",
            uuid: randomUUID(),
            version: [0, 0, 1],
            min_engine_version: projectMinecraftProduct === "stable" ? LAST_VERSION_STABLE.split(".").map(Number) : LAST_VERSION_PREVIEW.split(".").map(Number),
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
    addonFolder: vscode.Uri,
    packsAddon: ("behavior_pack" | "resource_pack")[],
    minecraftProduct: "stable" | "preview"
): Promise<{ behaviorManifest?: any, resourceManifest?: any }> {
    let behaviorManifest: any = undefined;
    let resourceManifest: any = undefined;

    for (const pack of packsAddon) {
        const packPath = vscode.Uri.joinPath(addonFolder, pack);
        await vscode.workspace.fs.createDirectory(packPath);

        const manifest = createManifestObject(pack, minecraftProduct);

        if (pack === "behavior_pack") {
            behaviorManifest = manifest;
        } else if (pack === "resource_pack") {
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
    minecraftProduct: "stable" | "preview"
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
    packType: "behavior_pack" | "resource_pack",
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
        `pack.name=${displayName} ${packType === "behavior_pack" ? "BP" : "RP"} [v${version}] - by ${author}\n` +
        `pack.description=${packType === "behavior_pack" ? "Behavior" : "Resource"} Pack for ${displayName} - Created by ${author}`;

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

export async function createAddonStructure(projectFolder: vscode.Uri, metadata: ProjectMetadata, context: vscode.ExtensionContext) {
    const addonFolder = vscode.Uri.joinPath(projectFolder, "addon");
    await vscode.workspace.fs.createDirectory(addonFolder);

    const packsAddon = await vscode.window.showQuickPick(
        ["behavior_pack", "resource_pack"],
        {
            title: "Types de packs de l'addon",
            placeHolder: "Sélectionnez le/les types de packs pour l'addon",
            canPickMany: true
        }
    );

    if (!packsAddon || packsAddon.length === 0) {
        vscode.window.showWarningMessage("Aucun type de pack sélectionné. L'initialisation de l'addon a été annulée.");
        return;
    }

    const packageJsonContent: any = {
        name: metadata.id,
        version: "0.0.1",
        description: `Addon for ${metadata.displayName}`,
        license: "MIT",
        dependencies: {},
        type: "module"
    };

    const { behaviorManifest, resourceManifest } = await createPackFoldersAndManifests(
        addonFolder,
        packsAddon as ("behavior_pack" | "resource_pack")[],
        metadata.minecraftProduct
    );

    configurePackDependencies(behaviorManifest, resourceManifest);


    if (behaviorManifest) {
        const npmDependencies = await addScriptApiIfNeeded(projectFolder, behaviorManifest, metadata.minecraftProduct);
        if (npmDependencies) {
            packageJsonContent.dependencies = npmDependencies;
        }
        const bpPath = vscode.Uri.joinPath(addonFolder, "behavior_pack", "manifest.json");
        await writeJsonFilePretty(bpPath, behaviorManifest);
    }

    if (resourceManifest) {
        const rpPath = vscode.Uri.joinPath(addonFolder, "resource_pack", "manifest.json");
        await writeJsonFilePretty(rpPath, resourceManifest);
    }

    for (const pack of packsAddon) {
        const manifest = pack === "behavior_pack" ? behaviorManifest : resourceManifest;
        if (!manifest) continue;

        await createLangFilesAndIcons(
            projectFolder,
            pack as "behavior_pack" | "resource_pack",
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