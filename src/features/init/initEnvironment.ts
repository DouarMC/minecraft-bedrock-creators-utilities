import { randomUUID } from "crypto";
import * as vscode from "vscode";
import { exec } from "child_process";
import { promisify } from "util";
import { writeJsonFilePretty } from "../../utils/jsonUtils";
import { SCRIPT_API_MODULES, SCRIPT_API_MODULES_NAMES, SCRIPT_API_MODULES_NAMES_PREVIEW, SCRIPT_API_MODULES_PREVIEW, SCRIPT_API_MODULES_VERSIONS_PACKAGE, SCRIPT_API_MODULES_VERSIONS_PACKAGE_PREVIEW } from "../../utils/scriptApiModules";
import { LAST_VERSION_STABLE, LAST_VERSION_PREVIEW } from "../../utils/minecraftVersions";

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

/**
 * Enregistre la commande pour initialiser l'environnement du projet Minecraft Bedrock.
 * Cette commande permet à l'utilisateur de sélectionner un dossier, de choisir le type de projet,
 * de nommer le projet et de spécifier la version de Minecraft à utiliser.
 * Elle crée ensuite un fichier .env et les structures de dossiers nécessaires pour le projet.
 * @param context Le contexte de l'extension VS Code, utilisé pour enregistrer la commande.
 */
export function registerInitEnvironmentCommand(context: vscode.ExtensionContext) {
    // Inscrit la commande qui gère l'initialisation de l'environnement du projet
    const initEnvCommand = vscode.commands.registerCommand("minecraft-bedrock-creators-utilities.initEnvironment", async () => {
        vscode.window.showInformationMessage("➡️ Initialize Environment command called");

        // Ouvre une boîte de dialogue pour sélectionner un dossier qui sera utilisé pour initialiser l'environnement
        const folderUri = await vscode.window.showOpenDialog({
            canSelectFolders: true,
            openLabel: "Choisir le dossier pour initialiser l'environnement",
            canSelectMany: false
        });

        // Vérifie si un dossier a été sélectionné, sinon affiche un message d'avertissement
        if (!folderUri || folderUri.length === 0) {
            vscode.window.showWarningMessage("Aucun dossier sélectionné. L'initialisation de l'environnement a été annulée.");
            return;
        }

        const selectedFolder = folderUri[0]; // Récupère le dossier sélectionné

        // On demande le type de projet
        const projectType = await vscode.window.showQuickPick(
            ["addon", "skin_pack", "world_template"],
            {
                title: "Type du projet",
                placeHolder: "Sélectionnez le type du projet",
                canPickMany: false
            }
        );

        // On demande l'id du projet
        const projectId = await vscode.window.showInputBox({
            title: "ID du projet",
            prompt: "Entrez l'id du projet",
            placeHolder: "mon_pack"
        });

        // On demande le nom d'affichage du projet
        const projectDisplayName = await vscode.window.showInputBox({
            title: "Nom d'affichage du projet",
            prompt: "Entrez le nom d'affichage du projet",
            placeHolder: projectId || "Mon Pack" // Définit une valeur par défaut si l'id du projet n'est pas fourni
        });

        // On demande l'auteur du projet
        const projectAuthor = await vscode.window.showInputBox({
            title: "Auteur du projet",
            prompt: "Entrez l'auteur du projet",
            placeHolder: "Mon Nom"
        });

        // Demande la version de Minecraft à utiliser pour le projet
        const projectMinecraftProduct = await vscode.window.showQuickPick(
            ["stable", "preview"],
            {
                title: "Version de Minecraft",
                placeHolder: "Sélectionnez la version de Minecraft",
                canPickMany: false
            }
        );
        
        try {
            // Crée le dossier .vscode dans le dossier sélectionné
            await vscode.workspace.fs.createDirectory(vscode.Uri.joinPath(selectedFolder, ".vscode"));

            // Crée le fichier settings.json dans le dossier .vscode
            const settingsContent = {
                "files.associations": {
                    "*.json": "jsonc" // Associe les fichiers .json à la syntaxe JSON avec commentaires
                },
                "editor.tabSize": 4, // Définit la taille des tabulations à 4 espaces
            };
            await vscode.workspace.fs.writeFile(
                vscode.Uri.joinPath(selectedFolder, ".vscode", "settings.json"), // Le chemin du fichier settings.json
                Buffer.from(JSON.stringify(settingsContent, null, 4), "utf8") // Le contenu du fichier settings.json
            );

            // Crée un fichier .env dans le dossier sélectionné
            const envContent =
            `PROJECT_TYPE="${projectType}"\n` +
            `PROJECT_ID="${projectId}"\n` +
            `PROJECT_DISPLAY_NAME="${projectDisplayName}"\n` +
            `PROJECT_AUTHOR="${projectAuthor}"\n` +
            `MINECRAFT_PRODUCT="${projectMinecraftProduct}"`;
            await vscode.workspace.fs.writeFile(
                vscode.Uri.joinPath(selectedFolder, ".env"), // Le chemin du fichier .env
                Buffer.from(envContent, "utf8") // Le contenu du fichier .env
            );

            // Si le type de projet est addon, on crée les dossiers et fichiers nécessaires
            if (projectType === "addon") {
                const packageJsonContent = {
                    name: projectId,
                    version: "0.0.1",
                    description: `Addon for ${projectDisplayName}`,
                    license: "MIT",
                    dependencies: {},
                    type: "module"
                };

                // Crée le dossier "addon" dans le dossier sélectionné
                await vscode.workspace.fs.createDirectory(vscode.Uri.joinPath(selectedFolder, "addon"));

                // On demande les types de packs de l'addon
                const packsAddon = await vscode.window.showQuickPick(
                    ["behavior_pack", "resource_pack"],
                    {
                        title: "Types de packs de l'addon",
                        placeHolder: "Sélectionnez le/les types de packs pour l'addon",
                        canPickMany: true
                    }
                );
                // Vérifie si des packs ont été sélectionnés, sinon affiche un message d'avertissement
                if (!packsAddon || packsAddon.length === 0) {
                    vscode.window.showWarningMessage("Aucun type de pack sélectionné. L'initialisation de l'addon a été annulée.");
                    return;
                }

                // Variables pour stocker les contenus des manifestes des packs de comportement et de ressources
                let behaviorPackManifestContentRaw = undefined;
                let resourcePackManifestContentRaw = undefined;
                // Crée les dossiers pour chaque pack sélectionné
                for (const pack of packsAddon) {
                    // Crée le dossier pour le pack de comportement ou de ressources
                    const packPath = vscode.Uri.joinPath(selectedFolder, "addon", pack);
                    await vscode.workspace.fs.createDirectory(packPath);

                    // Crée le fichier manifest.json pour le pack de comportement ou de ressources
                    const manifest = createManifestObject(pack as "behavior_pack" | "resource_pack", projectMinecraftProduct as "stable" | "preview");
                    if (pack === "behavior_pack") {
                        behaviorPackManifestContentRaw = manifest;
                    } else if (pack === "resource_pack") {
                        resourcePackManifestContentRaw = manifest;
                    }
                }

                // Si les deux packs sont sélectionnés, on crée les dépendances entre eux
                if (behaviorPackManifestContentRaw && resourcePackManifestContentRaw) {
                    behaviorPackManifestContentRaw.dependencies = [];
                    resourcePackManifestContentRaw.dependencies = [];

                    behaviorPackManifestContentRaw.dependencies.push({
                        uuid: resourcePackManifestContentRaw.header.uuid,
                        version: resourcePackManifestContentRaw.header.version
                    });
                    resourcePackManifestContentRaw.dependencies.push({
                        uuid: behaviorPackManifestContentRaw.header.uuid,
                        version: behaviorPackManifestContentRaw.header.version
                    });

                    resourcePackManifestContentRaw.header.pack_scope = "world"; // Définit le scope du pack de ressources, ici pour le monde
                } else if (resourcePackManifestContentRaw) { // Si seul le pack de ressources est sélectionné
                    resourcePackManifestContentRaw.header.pack_scope = "any"; // Définit le scope du pack de ressources, ici pour n'importe quel contexte
                }

                // Si le manifeste des packs de comportement est défini, on crée les fichiers manifest.json et contents.json
                if (behaviorPackManifestContentRaw) {
                    // Demande à l'utilisateur s'il souhaite inclure l'API Script dans le pack de comportement
                    const hasScriptApi = await vscode.window.showQuickPick(
                        ["Oui", "Non"],
                        {
                            title: "Inclure l'API Script",
                            placeHolder: "Voulez-vous inclure l'API Script dans le pack de comportement ?",
                            canPickMany: false
                        }
                    );
                    // Si l'utilisateur a choisi d'inclure l'API Script, on ajoute les modules nécessaires
                    if (hasScriptApi === "Oui") {
                        // Récupère les modules de l'API Script à inclure
                        const scriptApiModules = await vscode.window.showQuickPick(
                            projectMinecraftProduct === "stable" ? SCRIPT_API_MODULES_NAMES : SCRIPT_API_MODULES_NAMES_PREVIEW, // Propose les noms des modules de l'API Script en fonction de la version de Minecraft
                            {
                                title: "Modules de l'API Script",
                                placeHolder: "Sélectionnez les modules de l'API Script à inclure",
                                canPickMany: true
                            }
                        );
                        // Si des modules ont été sélectionnés, on les ajoute au manifeste du pack de comportement
                        if (scriptApiModules && scriptApiModules.length > 0) {
                            // On ajoute la capacité "script" au manifeste du pack de comportement
                            behaviorPackManifestContentRaw.modules.push({
                                type: "script",
                                uuid: randomUUID(),
                                version: [0, 0, 1],
                                language: "javascript",
                                entry: "scripts/main.js"
                            });
                            // Variable pour stocker les dépendances npm
                            const npmDependencies: Record<string, string> = {};
                            // Pour chaque module sélectionné, on demande la version à utiliser
                            for (const module of scriptApiModules) {
                                const version = await vscode.window.showQuickPick(
                                    projectMinecraftProduct === "stable" ? SCRIPT_API_MODULES[module] : SCRIPT_API_MODULES_PREVIEW[module],
                                    {
                                        title: `Version du module ${module}`,
                                        placeHolder: `Sélectionnez la version du module ${module}`,
                                        canPickMany: false
                                    }
                                );
                                // Si une version a été sélectionnée, on l'ajoute au manifeste du pack de comportement et aux dépendances npm
                                if (version) {
                                    if (behaviorPackManifestContentRaw.dependencies === undefined) {
                                        behaviorPackManifestContentRaw.dependencies = [];
                                    }
                                    behaviorPackManifestContentRaw.dependencies.push({
                                        module_name: module,
                                        version: version
                                    });
                                    npmDependencies[module] = projectMinecraftProduct === "stable" ? SCRIPT_API_MODULES_VERSIONS_PACKAGE[module][version] : SCRIPT_API_MODULES_VERSIONS_PACKAGE_PREVIEW[module][version];
                                }
                            }
                            // Ajoute les dépendances npm au fichier package.json du projet
                            packageJsonContent.dependencies = npmDependencies;

                            // Crée le dossier "scripts" pour les scripts de l'API Script
                            const scriptsPath = vscode.Uri.joinPath(selectedFolder, "addon", "scripts");
                            await vscode.workspace.fs.createDirectory(scriptsPath);

                            // Crée le fichier main.ts dans le dossier "scripts"
                            const mainTsContent =
                            `// Entrée du script principal pour le projet ${projectId}\n\n` +
                            `console.warn("Hello from main.ts!");`;
                            await vscode.workspace.fs.writeFile(
                                vscode.Uri.joinPath(scriptsPath, "main.ts"),
                                Buffer.from(mainTsContent, "utf8") // Crée un fichier main.ts avec le contenu du script principal
                            );

                            // Crée le fichier tsconfig.json pour le projet TypeScript
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
                                vscode.Uri.joinPath(selectedFolder, "tsconfig.json"),
                                Buffer.from(JSON.stringify(tsconfigContent, null, 4), "utf8") // Crée un fichier tsconfig.json avec la configuration TypeScript
                            );
                        }
                    }

                    // Crée le fichier manifest.json pour le pack de comportement
                    await writeJsonFilePretty(
                        vscode.Uri.joinPath(selectedFolder, "addon", "behavior_pack", "manifest.json"),
                        behaviorPackManifestContentRaw
                    );
                    // Crée un fichier contents.json pour le pack de comportement
                    await vscode.workspace.fs.writeFile(
                        vscode.Uri.joinPath(selectedFolder, "addon", "behavior_pack", "contents.json"),
                        Buffer.from(JSON.stringify({}, null, 4), "utf8") // Crée un fichier contents.json vide
                    );

                    // Crée le dossier "texts" pour les fichiers de langue
                    await vscode.workspace.fs.createDirectory(
                        vscode.Uri.joinPath(selectedFolder, "addon", "behavior_pack", "texts")
                    );

                    await vscode.workspace.fs.writeFile(
                        vscode.Uri.joinPath(selectedFolder, "addon", "behavior_pack", "texts", "languages.json"),
                        Buffer.from(JSON.stringify(["en_US"], null, 4), "utf8") // Crée un fichier languages.json avec la langue par défaut
                    );

                    // Crée un fichier en_US.lang avec le contenu de la langue, en mettant le nom et la description du pack
                    const enUsLangContent =
                    `pack.name=${projectDisplayName} BP [v${behaviorPackManifestContentRaw.header.version.join(".")}] - by ${projectAuthor}\n` +
                    `pack.description=Behavior Pack for ${projectDisplayName} - Created by ${projectAuthor}`;
                    await vscode.workspace.fs.writeFile(
                        vscode.Uri.joinPath(selectedFolder, "addon", "behavior_pack", "texts", "en_US.lang"),
                        Buffer.from(enUsLangContent, "utf8") // Crée un fichier en_US.lang avec le contenu de la langue
                    );

                    // Copie l'icône par défaut du pack de ressources
                    await vscode.workspace.fs.copy(
                        vscode.Uri.joinPath(context.extensionUri, "resources", "default_pack_icon.png"),
                        vscode.Uri.joinPath(selectedFolder, "addon", "behavior_pack", "pack_icon.png"),
                    );
                }
                // Si le manifeste des packs de ressources est défini, on crée les fichiers manifest.json et contents.json
                if (resourcePackManifestContentRaw) {
                    // Crée le fichier manifest.json pour le pack de ressources
                    await writeJsonFilePretty(
                        vscode.Uri.joinPath(selectedFolder, "addon", "resource_pack", "manifest.json"),
                        resourcePackManifestContentRaw
                    );
                    // Crée un fichier contents.json pour le pack de ressources
                    await vscode.workspace.fs.writeFile(
                        vscode.Uri.joinPath(selectedFolder, "addon", "resource_pack", "contents.json"),
                        Buffer.from(JSON.stringify({}, null, 4), "utf8") // Crée un fichier contents.json vide
                    );

                    // Crée le dossier "texts" pour les fichiers de langue
                    await vscode.workspace.fs.createDirectory(
                        vscode.Uri.joinPath(selectedFolder, "addon", "resource_pack", "texts")
                    );

                    // Crée le fichier languages.json pour les langues supportées
                    await vscode.workspace.fs.writeFile(
                        vscode.Uri.joinPath(selectedFolder, "addon", "resource_pack", "texts", "languages.json"),
                        Buffer.from(JSON.stringify(["en_US"], null, 4), "utf8")
                    );

                    // Crée un fichier en_US.lang avec le contenu de la langue, en mettant le nom et la description du pack
                    const enUsLangContent =
                    `pack.name=${projectDisplayName} RP [v${resourcePackManifestContentRaw.header.version.join(".")}] - by ${projectAuthor}\n` +
                    `pack.description=Resource Pack for ${projectDisplayName} - Created by ${projectAuthor}`;
                    await vscode.workspace.fs.writeFile(
                        vscode.Uri.joinPath(selectedFolder, "addon", "resource_pack", "texts", "en_US.lang"),
                        Buffer.from(enUsLangContent, "utf8") // Crée un fichier en_US.lang avec le contenu de la langue
                    );

                    // Copie l'icône par défaut du pack de ressources
                    await vscode.workspace.fs.copy(
                        vscode.Uri.joinPath(context.extensionUri, "resources", "default_pack_icon.png"),
                        vscode.Uri.joinPath(selectedFolder, "addon", "resource_pack", "pack_icon.png"),
                    );
                }

                // Crée le fichier package.json dans le dossier sélectionné
                await vscode.workspace.fs.writeFile(
                    vscode.Uri.joinPath(selectedFolder, "package.json"),
                    Buffer.from(JSON.stringify(packageJsonContent, null, 4), "utf8")
                );
                
                // Rend la commande npm install asynchrone en utilisant promisify
                const execPromise = promisify(exec);
                try {
                    const { stdout, stderr } = await execPromise("npm install", { cwd: selectedFolder.fsPath });
                    vscode.window.showInformationMessage("Modules npm installés avec succès !");
                    console.log(stdout);
                    if (stderr) {
                        console.error(stderr);
                    }
                } catch (error: any) {
                    console.error(`Erreur lors de npm install: ${error.message}`);
                    vscode.window.showErrorMessage("Erreur lors de l'installation des modules npm. Vérifiez la console.");
                }
            }

            // Ouvre le dossier sélectionné dans l'éditeur
            await vscode.commands.executeCommand("vscode.openFolder", selectedFolder, false);
            // Affiche un message de succès à l'utilisateur
            vscode.window.showInformationMessage("L'environnement a été initialisé avec succès !");
        } catch (error) {
            console.error("Erreur lors de l'initialisation de l'environnement :", error);
            vscode.window.showErrorMessage("Une erreur est survenue lors de l'initialisation de l'environnement. Veuillez vérifier la console pour plus de détails.");
        }
    });

    context.subscriptions.push(initEnvCommand);
}