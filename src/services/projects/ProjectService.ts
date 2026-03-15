import * as vscode from 'vscode';
import { VscodeUtils } from '../../vscode-utils/VscodeUtils';
import { MinecraftProjectConfig } from '../../core/minecraft/models/projects/MinecraftProjectConfig';
import { AddonMinecraftProject } from '../../core/minecraft/models/projects/AddonMinecraftProject';
import { AddonPackageJson } from '../../types/addonPackageJson';
import { PromptService } from '../prompts/PromptService';
import { randomUUID } from 'crypto';
import { promisify } from 'util';
import { exec } from 'child_process';
import { MinecraftGameManager } from '../minecraft/MinecraftGameManager';
import { FileSystemUtils } from '../../vscode-utils/FileSystemUtils';
import { MinecraftFileResolverService } from '../minecraft/MinecraftFileResolverService';
import { MinecraftGame } from '../../core/minecraft/models/games/MinecraftGame';
import { ProjectMetadata } from '../../types/projectConfig';
import { MinecraftProjectLoader } from './MinecraftProjectLoader';
import { MinecraftAddonPackType } from '../../core/minecraft/models/MinecraftTypes';
import { MinecraftProject } from '../../core/minecraft/models/projects/MinecraftProject';

export class ProjectService {
    /**
     * Copie un fichier modèle depuis le dossier des templates de l'extension vers une destination donnée
     * @param templateRelativePath Le chemin relatif du fichier modèle dans le dossier des templates
     * @param destination L'URI de destination où copier le fichier
     * @throws {Error} Si le fichier modèle est introuvable ou si la copie échoue
     */
    public static async copyTemplateFile(templateRelativePath: string, destination: vscode.Uri): Promise<void> {
        const extensionContext = VscodeUtils.getContext();
        const templateUri = vscode.Uri.joinPath(extensionContext.extensionUri, "assets", "templates", templateRelativePath);

        try { // Vérifie que le fichier modèle existe avant de tenter de le copier
            if (! await VscodeUtils.pathExists(templateUri)) {
                throw new Error(`Le fichier modèle '${templateRelativePath}' est introuvable dans l'extension.`);
            }
        } catch (error) {
            throw error;
        }

        try { // Tente de copier le fichier modèle à la destination, en écrasant s'il existe déjà un fichier à cet emplacement
            await vscode.workspace.fs.copy(templateUri, destination, { overwrite: true });
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la copie du fichier modèle '${templateRelativePath}' : ${error.message}`);
            }
        }
    }

    /**
     * Crée le dossier .vscode et y ajoute le fichier settings.json
     * @param projectFolder L'URI du dossier du projet
     * @throws {Error} Si la copie du fichier modèle échoue
     */
    public static async createVSCodeSettings(projectFolder: vscode.Uri): Promise<void> {
        const vscodeFolder = vscode.Uri.joinPath(projectFolder, ".vscode"); // Chemin avec .vscode
        try {
            await vscode.workspace.fs.createDirectory(vscodeFolder); // Crée le dossier .vscode
        } catch (error) {
            if (error instanceof vscode.FileSystemError && error.code === "FileExists") {
                // Si le dossier existe déjà, on ignore l'erreur
                console.log("Le dossier .vscode existe déjà, il sera utilisé tel quel.");
            } else {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la création du dossier .vscode : ${error.message}`);
                }

                throw error;
            }
        }



        await ProjectService.copyTemplateFile("vscode-folder/settings.json", vscode.Uri.joinPath(vscodeFolder, "settings.json"));
    }

    /**
     * Crée le fichier .mcbe_project.json à la racine du projet
     * @param projectFolder L'URI du dossier du projet
     * @param metadata Les métadonnées du projet
     * @throws {Error} Si la validation de la configuration du projet échoue ou si la création du fichier échoue
     */
    public static async createMinecraftProjectFile(projectFolder: vscode.Uri, metadata: ProjectMetadata): Promise<void> {
        let mcbeProjectContent: MinecraftProjectConfig;

        try { // Tente de créer une instance de MinecraftProjectConfig avec les métadonnées fournies, ce qui validera la configuration du projet et lèvera une erreur si elle est invalide
            mcbeProjectContent = new MinecraftProjectConfig({
                metadata: metadata,
                options: {deploy: {prompt_to_launch_minecraft: true}}
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la validation de la configuration du projet : ${error.message}`);
            }

            throw error;
        }

        try { // Tente d'écrire le fichier de configuration du projet à la racine du projet, en écrasant s'il existe déjà un fichier à cet emplacement
            await VscodeUtils.writeFile(
                vscode.Uri.joinPath(projectFolder, MinecraftProjectLoader.CONFIG_FILE_NAME),
                JSON.stringify(mcbeProjectContent, null, 4)
            );
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la création du fichier de configuration du projet : ${error.message}`);
            }

            throw error;
        }
    }

    /**
     * Crée un objet package.json de base pour un projet Minecraft Bedrock.
     * @param metadata 
     * @returns 
     */
    private static createBasePackageJson(metadata: ProjectMetadata): AddonPackageJson {
        return {
            name: metadata.id,
            version: "0.0.1",
            description: `Package for ${metadata.displayName} project.`,
            license: "MIT",
            dependencies: {},
            type: "module"
        };
    }

    /**
     * Crée le dossier "addon" dans le projet et renvoie son URI. Si le dossier existe déjà, il est utilisé tel quel.
     * @param projectFolder L'URI du dossier du projet
     * @returns
     * @throws {Error} Si la création du dossier échoue pour une raison autre que le fait que le dossier existe déjà
     */
    private static async createAddonFolder(projectFolder: vscode.Uri): Promise<vscode.Uri> {
        const addonFolder = vscode.Uri.joinPath(projectFolder, "addon"); // Chemin du dossier "addon" à créer
        try {
            await vscode.workspace.fs.createDirectory(addonFolder); // Tente de créer le dossier "addon"
        } catch (error) {
            if (error instanceof vscode.FileSystemError && error.code === "FileExists") {
                // Si le dossier existe déjà, on ignore l'erreur
            } else {
                // Pour toute autre erreur, on la remonte
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la création du dossier "addon" : ${error.message}`);
                }

                throw error;
            }
        }

        return addonFolder;
    }

    /**
     * Crée le dossier du pack de comportement et renvoie son URI. Si le dossier existe déjà, il est utilisé tel quel.
     * @param projectFolder L'URI du dossier du projet
     * @returns
     * @throws {Error} Si la création du dossier échoue pour une raison autre que le fait que le dossier existe déjà
     */
    private static async createBehaviorPackFolder(projectFolder: vscode.Uri): Promise<vscode.Uri> {
        const behaviorPackFolder = vscode.Uri.joinPath(projectFolder, "addon", "behavior_pack"); // Chemin du dossier du pack de comportement à créer

        try { // Tente de créer le dossier du pack de comportement
            await vscode.workspace.fs.createDirectory(behaviorPackFolder);
        } catch (error) {
            if (error instanceof vscode.FileSystemError && error.code === "FileExists") {
                // Si le dossier existe déjà, on ignore l'erreur
            } else {
                // Pour toute autre erreur, on la remonte
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la création du dossier du pack de comportement : ${error.message}`);
                }

                throw error;
            }
        }

        return behaviorPackFolder;
    }

    /**
     * Crée le dossier du pack de ressources et renvoie son URI. Si le dossier existe déjà, il est utilisé tel quel.
     * @param projectFolder L'URI du dossier du projet
     * @returns 
     * @throws {Error} Si la création du dossier échoue pour une raison autre que le fait que le dossier existe déjà
     */
    private static async createResourcePackFolder(projectFolder: vscode.Uri): Promise<vscode.Uri> {
        const resourcePackFolder = vscode.Uri.joinPath(projectFolder, "addon", "resource_pack"); // Chemin du dossier du pack de ressources à créer
        try {
            await vscode.workspace.fs.createDirectory(resourcePackFolder);
        } catch (error) {
            if (error instanceof vscode.FileSystemError && error.code === "FileExists") {
                // Si le dossier existe déjà, on ignore l'erreur
            } else {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la création du dossier du pack de ressources : ${error.message}`);
                }

                throw error;
            }
        }

        return resourcePackFolder;
    }

    /**
     * Active l'API Script dans le manifeste du pack de comportement.
     * @param behaviorManifest Le manifeste du pack de comportement
     * @returns 
     */
    private static enableScriptApiInManifest(behaviorManifest: any): void {
        // Si le manifeste du pack de comportement contient déjà un module de type "script", on considère que l'API Script est déjà activée et on ne fait rien
        const hasScriptModule = behaviorManifest.modules.some((module: any) => module.type === "script");
        if (hasScriptModule) {
            return;
        }

        behaviorManifest.modules = behaviorManifest.modules || []; // On crée le tableau des modules s'il n'existe pas déjà
        // On ajoute un module de type "script" au manifeste du pack de comportement.
        behaviorManifest.modules.push({
            type: "script",
            uuid: randomUUID(),
            version: [0, 0, 1],
            language: "javascript",
            entry: "scripts/main.js"
        });
    }

    /**
     * Crée la base du manifeste du pack de comportement.
     * @param moduleTypes Les types de modules à inclure dans le manifeste
     * @returns 
     */
    private static createBaseBehaiovrPackManifest(moduleTypes: ("script" | "data")[]): any {
        // On crée un objet de base pour le manifeste du pack de comportement
        const behaviorManifest: any = { 
            format_version: 2,
            header: {
                name: "pack.name",
                description: "pack.description",
                uuid: randomUUID(),
                version: [0, 0, 1],
                min_engine_version: [1, 21, 120]
            },
            modules: []
        };

        for (const type of moduleTypes) { // Pour chaque type de module sélectionné par l'utilisateur, on ajoute le module correspondant au manifeste du pack de comportement
            if (type === "data") { // Si le type de module est "data", on ajoute un module de type "data" au manifeste du pack de comportement
                behaviorManifest.modules.push({
                    type: "data",
                    uuid: randomUUID(),
                    version: [0, 0, 1]
                });
            } else if (type === "script") { // Si le type de module est "script", on ajoute un module de type "script" au manifeste du pack de comportement, et on active l'API Script dans le manifeste du pack de comportement
                this.enableScriptApiInManifest(behaviorManifest);
            }
        }

        return behaviorManifest;
    }

    /**
     * Crée la base du manifeste du pack de ressources.
     * @returns 
     */
    private static createBaseResourcePackManifest(): any {
        const resourceManifest: any = {
            format_version: 2,
            header: {
                name: "pack.name",
                description: "pack.description",
                uuid: randomUUID(),
                version: [0, 0, 1],
                min_engine_version: [1, 21, 120]
            },
            modules: [
                {
                    type: "resources",
                    uuid: randomUUID(),
                    version: [0, 0, 1]
                }
            ]
        };

        return resourceManifest;
    }

    /**
     * Crée le fichier main.ts pour l'API Script.
     * @param scriptsPath Le chemin du dossier scripts
     * @throws {Error} Si la copie du fichier modèle échoue
     */
    private static async createMainTsFile(scriptsPath: vscode.Uri): Promise<void> {
        try {
            await this.copyTemplateFile("script-api/main.ts", vscode.Uri.joinPath(scriptsPath, "main.ts"));
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la création du fichier main.ts de l'API Script : ${error.message}`);
            }

            throw error;
        }
    }

    /**
     * Crée le fichier tsconfig.json pour l'API Script à partir du fichier modèle tsconfig.template.json.
     * @param projectFolder L'URI du dossier du projet
     * @throws {Error} Si la copie du fichier modèle échoue
     */
    private static async createTsConfigFile(projectFolder: vscode.Uri): Promise<void> {
        try {
            await this.copyTemplateFile("script-api/tsconfig.template.json", vscode.Uri.joinPath(projectFolder, "tsconfig.json"));
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la création du fichier tsconfig.json de l'API Script : ${error.message}`);
            }

            throw error;
        }
    }

    /**
     * Crée le fichier types/minecraft-env/index.d.ts pour l'API Script.
     * @param projectFolder L'URI du dossier du projet
     * @throws {Error} Si la copie du fichier modèle échoue
     */
    private static async createMinecraftEnvTypesFile(projectFolder: vscode.Uri): Promise<void> {
        // Crée le dossier types/minecraft-env s'il n'existe pas déjà, en ignorant l'erreur si le dossier existe déjà
        const minecraftEnvPath = vscode.Uri.joinPath(projectFolder, "types", "minecraft-env");
        try {
            await vscode.workspace.fs.createDirectory(minecraftEnvPath);
        } catch (error) {
            if (error instanceof vscode.FileSystemError && error.code === "FileExists") {
                // Si le dossier existe déjà, on ignore l'erreur
            } else {
                // Pour toute autre erreur, on la remonte
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la création du dossier "types/minecraft-env" : ${error.message}`);
                }

                throw error;
            }
        }

        try { // Tente de copier le fichier modèle index.d.ts que j'ai crée moi meme pour les types quickjs minecraft
            await this.copyTemplateFile("script-api/types/minecraft-env/index.d.ts", vscode.Uri.joinPath(minecraftEnvPath, "index.d.ts"));
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la création du fichier types/minecraft-env/index.d.ts de l'API Script : ${error.message}`);
            }

            throw error;
        }
    }

    /**
     * Génère la structure de l'API Script dans le projet.
     * @param projectFolder L'URI du dossier du projet
     * @throws {Error} Si la création des fichiers ou dossiers échoue
     */
    public static async createScriptApiStructure(projectFolder: vscode.Uri): Promise<void> {
        // Crée le dossier scripts dans addon
        const scriptsPath = vscode.Uri.joinPath(projectFolder, "addon", "scripts");
        try {
            await vscode.workspace.fs.createDirectory(scriptsPath);
        } catch (error) {
            if (error instanceof vscode.FileSystemError && error.code === "FileExists") {
                // Si le dossier existe déjà, on ignore l'erreur
            } else {
                // Pour toute autre erreur, on la remonte
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la création du dossier "scripts" : ${error.message}`);
                }

                throw error;
            }
        }

        // Crée le fichier main.ts
        try {
            await this.createMainTsFile(scriptsPath);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la création du fichier main.ts de l'API Script : ${error.message}`);
            }

            throw error;
        }

        // Crée le fichier tsconfig.json
        try {
            await this.createTsConfigFile(projectFolder);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la création du fichier tsconfig.json de l'API Script : ${error.message}`);
            }

            throw error;
        }

        try { // Tente de crée le dossier types/minecraft-env et le fichier index.d.ts pour les types de l'API Script quickjs
            await this.createMinecraftEnvTypesFile(projectFolder);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la création du fichier types/minecraft-env/index.d.ts de l'API Script : ${error.message}`);
            }

            throw error;
        }
    }

    /**
     * Ajoute les modules Script API sélectionnés au manifeste du pack de comportement et au package.json.
     * @param behaviorManifest Le manifeste du pack de comportement
     * @param packageJson Le contenu du package.json
     * @param modules Les modules à ajouter avec leurs versions
     */
    public static addScriptApiModules(behaviorManifest: any, packageJson: any, modules: Record<string, { version: string, npmVersion: string }>): void {
        behaviorManifest.dependencies = behaviorManifest.dependencies || [];
        for (const [moduleName, moduleInfo] of Object.entries(modules)) {
            const hasDependency = behaviorManifest.dependencies.some((dep: any) => dep.module_name === moduleName);
            if (! hasDependency) {
                behaviorManifest.dependencies.push({
                    module_name: moduleName,
                    version: moduleInfo.version
                });
            }
            if (packageJson.dependencies === undefined) {
                packageJson.dependencies = {};
            }
            if (packageJson.dependencies[moduleName] === undefined) {
                packageJson.dependencies[moduleName] = moduleInfo.npmVersion;
            } else if (packageJson.dependencies[moduleName] !== moduleInfo.npmVersion) {
                // Met à jour la version si différente
                packageJson.dependencies[moduleName] = moduleInfo.npmVersion;
            }
        }
    }

    /**
     * Crée le fichier pack_icon.png dans le dossier du pack.
     * @param packFolder L'URI du dossier du pack
     * @throws {Error} Si la création du fichier échoue pour une raison autre que le fait que le fichier existe déjà
     */
    public static async createPackIconFile(packFolder: vscode.Uri): Promise<void> {
        try {
            const extensionContext = VscodeUtils.getContext();
            const iconSource = vscode.Uri.joinPath(extensionContext.extensionUri, "assets", "icons", "default_pack_icon.png");
            const iconTarget = vscode.Uri.joinPath(packFolder, "pack_icon.png");

            await vscode.workspace.fs.copy(iconSource, iconTarget);
        } catch (error) {
            if (error instanceof vscode.FileSystemError && error.code === "FileExists") {
                // Si le fichier existe déjà, on ignore l'erreur
            } else {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la création du fichier pack_icon.png : ${error.message}`);
                }

                throw error;
            }
        }
    }

    /**
     * Crée le fichier en_US.lang pour le pack donné.
     * @param packFolder L'URI du dossier du pack
     * @param projectMetadata Les métadonnées du projet
     * @param packType Le type de pack (BehaviorPack ou ResourcePack)
     * 
     * @throws {Error} Si la création des fichiers échoue
     */
    public static async createEnUsLangFile(packFolder: vscode.Uri, projectMetadata: ProjectMetadata, packType: MinecraftAddonPackType): Promise<void> {
        // Crée le dossier "texts"
        const textsFolder = vscode.Uri.joinPath(packFolder, "texts");
        try {
            await vscode.workspace.fs.createDirectory(textsFolder);
        } catch (error) {
            if (error instanceof vscode.FileSystemError && error.code === "FileExists") {
                // Si le dossier existe déjà, on ignore l'erreur
            } else if (error instanceof Error) {
                throw new Error(`Erreur lors de la création du dossier "texts" : ${error.message}`);
            }

            throw error;
        }

        // languages.json
        const languagesPath = vscode.Uri.joinPath(textsFolder, "languages.json");
        try {
            await VscodeUtils.writeFile(languagesPath, JSON.stringify(["en_US"], null, 4));
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la création du fichier languages.json : ${error.message}`);
            }

            throw error;
        }

        // en_US.lang
        const displayName = projectMetadata.displayName;
        const author = projectMetadata.author;
        const packLabel = packType === "behavior_pack" ? "BP" : "RP";
        const langContent =
            `pack.name=${displayName} ${packLabel} [v0.0.1] - by ${author}` +
            `\npack.description=Pack for ${displayName} - Created by ${author}`;
        const enUSPath = vscode.Uri.joinPath(textsFolder, "en_US.lang");
        try {
            await VscodeUtils.writeFile(enUSPath, langContent);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la création du fichier en_US.lang : ${error.message}`);
            }

            throw error;
        }
    }

    /**
     * Configure les dépendances entre le pack de comportement et le pack de ressources.
     * @param behaviorManifest Le manifeste du pack de comportement
     * @param resourceManifest Le manifeste du pack de ressources
     */
    private static configurePackDependencies(behaviorManifest: any, resourceManifest: any): void {
        if (behaviorManifest && resourceManifest) { // Si les deux packs existent, on configure les dépendances entre eux dans leurs manifestes respectifs
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

            resourceManifest.header.pack_scope = "world"; // Le resource pack est logiquement utilisable que dans des mondes.
        } else if (resourceManifest) {
            resourceManifest.header.pack_scope = "any"; // Si il n'y a pas de pack de comportement, le pack de ressources peut être utilisé partout (dans des addons tiers, dans des mondes, etc.)
        }
    }

    /**
     * Installe les dépendances npm dans le dossier du projet.
     * @param projectFolder L'URI du dossier du projet
     * @throws {Error} Si npm n'est pas installé ou si l'installation des dépendances échoue pour une autre raison
     */
    public static async installNpmDependencies(projectFolder: vscode.Uri): Promise<void> {
        const execPromise = promisify(exec);
        try {
            await execPromise("npm -v"); // vérifie npm
            const { stderr } = await execPromise("npm install --legacy-peer-deps", { cwd: projectFolder.fsPath });
            if (stderr) console.error(stderr);

            vscode.window.showInformationMessage("📦 Modules npm installés !");
        } catch (error) {
            if (error instanceof Error) {
                const isNpmNotFound = error.message.includes("npm") || (error as any).code === "ENOENT";
                if (isNpmNotFound) {
                    throw new Error("Node.js (et npm) est requis pour installer les dépendances. Installez-le depuis https://nodejs.org/");
                } else {
                    throw new Error(`Erreur lors de l'installation des dépendances npm : ${error.message}`);
                }
            }

            throw error;
        }
    }

    /**
     * Génère la structure de base d'un projet Minecraft Bedrock de type Addon, avec les fichiers de configuration nécessaires et les dossiers de pack de comportement et de ressources.
     * @param projectFolder L'URI du dossier du projet
     * @param metadata Les métadonnées du projet
     * @returns
     * @throws {Error} Si la création de la structure du projet échoue à n'importe quelle étape
     */
    public static async createAddonStructure(projectFolder: vscode.Uri, metadata: ProjectMetadata): Promise<void> {
        // Crée la base de l'objet qui sera écrit dans le package.json à la racine du projet, avec les informations de base du projet
        const packageJsonContent = this.createBasePackageJson(metadata);

        // Création du dossier "addon"
        let addonFolder: vscode.Uri;
        try {
            addonFolder = await this.createAddonFolder(projectFolder);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la création du dossier "addon" : ${error.message}`);
            }

            throw error;
        }

        // Sélection des types de packs
        const packsAddon = await PromptService.askAddonPackTypes();
        if (packsAddon.length === 0) {
            throw new Error("Aucun type de pack sélectionné pour l'addon. L'initialisation de l'addon a été annulée.");
        }


        const isBehaviorPack = packsAddon.includes("behavior_pack"); // Variable indiquant si le pack de comportement doit être créé
        const isResourcePack = packsAddon.includes("resource_pack"); // Variable indiquant si le pack de ressources doit être créé

        let behaviorManifest: any = undefined; // Variable qui contiendra le manifeste du pack de comportement s'il est créé
        let resourceManifest: any = undefined; // Variable qui contiendra le manifeste du pack de ressources s'il est créé

        // Gestion de la création du pack de comportement
        if (isBehaviorPack === true) {
            let behaviorPackFolder: vscode.Uri;
            try { // Tente de créer le dossier du pack de comportement et récupère son URI
                behaviorPackFolder = await this.createBehaviorPackFolder(projectFolder);
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la création du dossier du pack de comportement : ${error.message}`);
                }

                throw error;
            }

            // Demande à l'utilisateur les types de modules à inclure dans le pack de comportement (data, script)
            const behaviorPackModuleTypes = await PromptService.askBehaviorPackModuleTypes();
            if (behaviorPackModuleTypes.length === 0) {
                throw new Error("Aucun type de module sélectionné pour le pack de comportement. L'initialisation de l'addon a été annulée.");
            }

            // On crée l'objet manifest behaviorManifest de base en fonction des types de modules sélectionnés par l'utilisateur
            behaviorManifest = await this.createBaseBehaiovrPackManifest(behaviorPackModuleTypes);

            // Si le module script a été selectionné, on crée la structure de base de l'API Script dans le projet, et on ajoute les modules Script API sélectionnés par l'utilisateur au manifeste du pack de comportement et au package.json
            if (behaviorPackModuleTypes.includes("script")) {
                try { // Tente de créer la structure de l'API Script dans le projet
                    await this.createScriptApiStructure(projectFolder);
                } catch (error) {
                    if (error instanceof Error) {
                        throw new Error(`Erreur lors de la création de la structure de l'API Script : ${error.message}`);
                    }

                    throw error;
                }

                try { // Gestion des modules Script API à inclure dans le projet
                    const selectedModules = await PromptService.askScriptApiModules(metadata.minecraftProduct); // Demande à l'utilisateur les modules Script API à inclure dans le projet, avec leurs versions
                    if (selectedModules !== undefined) {
                        this.addScriptApiModules(behaviorManifest, packageJsonContent, selectedModules);
                    }
                } catch (error) {
                    if (error instanceof Error) {
                        throw new Error(`Erreur lors de la sélection des modules Script API : ${error.message}`);
                    }

                    throw error;
                }
            }

            try { // Tente de créer le fichier pack_icon.png pour le pack de comportement
                await this.createPackIconFile(behaviorPackFolder);
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la création du fichier pack_icon.png du pack de comportement : ${error.message}`);
                }

                throw error;
            }

            try { // Tente de créer le fichier en_US.lang pour le pack de comportement
                await this.createEnUsLangFile(behaviorPackFolder, metadata, "behavior_pack");
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la création du fichier en_US.lang du pack de comportement : ${error.message}`);
                }

                throw error;
            }
        }

        // Gestion de la création du pack de ressources
        if (isResourcePack === true) {
            // Tente de créer le dossier du pack de ressources et récupère son URI
            let resourcePackFolder: vscode.Uri;
            try {
                resourcePackFolder = await this.createResourcePackFolder(projectFolder);
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la création du dossier du pack de ressources : ${error.message}`);
                }

                throw error;
            }

            // On crée l'objet manifest de base pour le pack de ressources
            resourceManifest = this.createBaseResourcePackManifest();

            try { // Tente de créer le fichier pack_icon.png pour le pack de ressources
                await this.createPackIconFile(resourcePackFolder); 
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la création du fichier pack_icon.png du pack de ressources : ${error.message}`);
                }

                throw error;
            }

            try { // Tente de créer le fichier en_US.lang pour le pack de ressources
                await this.createEnUsLangFile(resourcePackFolder, metadata, "resource_pack");
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la création du fichier en_US.lang du pack de ressources : ${error.message}`);
                }

                throw error;
            }
        }

        // Configure les dépendances entre le pack de comportement et le pack de ressources dans leurs manifestes respectifs, et configure le scope du pack de ressources si il n'y a pas de pack de comportement
        this.configurePackDependencies(behaviorManifest, resourceManifest);

        if (behaviorManifest !== undefined) { // Si le manifeste du pack de comportement a été créé, on l'écrit dans le fichier manifest.json du dossier du pack de comportement
            const behaviorManifestPath = vscode.Uri.joinPath(addonFolder, "behavior_pack", "manifest.json");
            try {
                await VscodeUtils.writeFile(behaviorManifestPath, JSON.stringify(behaviorManifest, null, 4));
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de l'écriture du manifeste du pack de comportement : ${error.message}`);
                }

                throw error;
            }
        }

        if (resourceManifest !== undefined) { // Si le manifeste du pack de ressources a été créé, on l'écrit dans le fichier manifest.json du dossier du pack de ressources
            const resourceManifestPath = vscode.Uri.joinPath(addonFolder, "resource_pack", "manifest.json");
            try {
                await VscodeUtils.writeFile(resourceManifestPath, JSON.stringify(resourceManifest, null, 4));
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de l'écriture du manifeste du pack de ressources : ${error.message}`);
                }

                throw error;
            }
        }


        try { // Écriture du fichier package.json à la racine du projet
            await VscodeUtils.writeFile(
                vscode.Uri.joinPath(projectFolder, "package.json"),
                JSON.stringify(packageJsonContent, null, 4)
            );
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la création du fichier package.json : ${error.message}`);
            }

            throw error;
        }

        try { // Installation des dépendances npm
            await this.installNpmDependencies(projectFolder);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de l'installation des dépendances npm : ${error.message}`);
            }

            throw error;
        }
    }

    /**
     * Renvoie le chemin de base pour le déploiement du projet Minecraft selon le produit Minecraft.
     * @param minecraftProject Le projet Minecraft à déployer
     * @returns
     * @throws {Error} Si une erreur survient lors de la récupération du chemin de base pour le déploiement
     */
    public static async getDeployBasePath(minecraftProject: MinecraftProject): Promise<vscode.Uri> {
        let game: MinecraftGame;
        try {
            game = minecraftProject.minecraftProduct === "stable" ? MinecraftGameManager.getStableGame() : MinecraftGameManager.getPreviewGame();
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la récupération du chemin de base pour le déploiement : ${error.message}`);
            }

            throw error;
        }

        let comMojangFolder: vscode.Uri;
        try {
            comMojangFolder = await MinecraftGameManager.getComMojangFolder(game);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la récupération du chemin de base pour le déploiement : ${error.message}`);
            }

            throw error;
        }

        return comMojangFolder;
    }

    /**
     * Indique si une compilation TypeScript est nécessaire pour le projet donné.
     * @param minecraftProject Le projet Minecraft Bedrock de type Addon
     * @returns
     * @throws {Error} Si une erreur survient lors de la vérification de l'existence du dossier "scripts"
     */
    public static async isTypeScriptCompilationNeeded(minecraftProject: AddonMinecraftProject): Promise<boolean> {
        let scriptsFolder: vscode.Uri | undefined;
        try {
            scriptsFolder = VscodeUtils.getUriFromPath(minecraftProject.getScriptsPath());
            if (! await VscodeUtils.isDirectory(scriptsFolder)) {
                throw new Error(`Le chemin "scripts" existe mais n'est pas un dossier : ${scriptsFolder.fsPath}`);
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la vérification de l'existence du dossier "scripts" : ${error.message}`);
            }

            throw error;
        }

        if (! scriptsFolder) {
            return false; // Si le dossier "scripts" n'existe pas, il n'y a pas besoin de compiler du TypeScript
        }

        return true; // Si le dossier "scripts" existe, on considère qu'il peut contenir des fichiers TypeScript à compiler, donc on retourne true pour indiquer qu'une compilation TypeScript est nécessaire
    }

    /**
     * Compile les fichiers TypeScript du projet donné.
     * @param minecraftProject Le projet Minecraft Bedrock de type Addon
     * @throws {Error} Si une erreur survient lors de la compilation
     */
    public static async compileTypeScript(minecraftProject: AddonMinecraftProject): Promise<void> {
        const execPromise = promisify(exec);
        const { stdout, stderr } = await execPromise(`tsc`, {cwd: minecraftProject.folder});

        if (stderr) {
            throw new Error(stderr);
        }
    }

    /**
     * Crée le fichier contents.json dans le pack donné s'il n'existe pas.
     * @param packPath Le chemin du pack
     * @throws {Error} Si la création du fichier échoue ou si la vérification du fichier échoue
     */
    public static async createContentsJsonFile(packPath: vscode.Uri): Promise<void> {
        const contentsJsonUri = vscode.Uri.joinPath(packPath, "contents.json");

        let contentsJsonExists = false;
        try {
            contentsJsonExists = await VscodeUtils.isFile(contentsJsonUri);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la vérification de l'existence du fichier contents.json : ${error.message}`);
            }

            throw error;
        }

        if (! contentsJsonExists) {
            // Si le fichier contents.json n'existe pas, on le crée avec un contenu de base (un objet JSON vide)
            const contentsJson = {};
            try {
                await VscodeUtils.writeFile(
                    contentsJsonUri,
                    JSON.stringify(contentsJson, null, 4)
                );
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la création du fichier contents.json : ${error.message}`);
                }

                throw error;
            }
        }
    }

    /**
     * Crée le fichier textures_list.json dans le Resource Pack du projet donné.
     * @param minecraftProject Le projet Minecraft Bedrock de type Addon
     * @throws {Error} Si la création du fichier échoue ou si le projet n'as pas de Resource Pack
     */
    public static async createTexturesListFile(minecraftProject: AddonMinecraftProject): Promise<void> {
        function getTextureRelativePath(uri: vscode.Uri): string | null {
            const match = /[\/\\](textures[\/\\].+\.(tga|png|jpg|jpeg))$/i.exec(uri.fsPath);
            if (!match) {return null;}
            // Uniformise les slashs pour être cross-platform
            return match[1].replace(/\\/g, '/');
        }


        const textureFilePaths: string[] = [];
        let resourcePackFolder: vscode.Uri | undefined = undefined;
        try {
            resourcePackFolder = VscodeUtils.getUriFromPath(minecraftProject.getResourcePackPath());
            if (! await VscodeUtils.isDirectory(resourcePackFolder)) {
                throw new Error(`Le chemin du pack de ressources existe mais n'est pas un dossier : ${resourcePackFolder.fsPath}`);
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la récupération du chemin du pack de ressources pour la création du fichier textures_list.json : ${error.message}`);
            }

            throw error;
        }
        if (! resourcePackFolder) {
            throw new Error("Le projet ne contient pas de pack de ressources. Impossible de créer le fichier textures_list.json.");
        }
        
        const texturesUris = await MinecraftFileResolverService.getDataDrivenFiles("resource_pack/textures/*.{tga,png,jpg,jpeg}", minecraftProject);
        for (const uri of texturesUris) {
            const relativePath = getTextureRelativePath(uri);
            if (relativePath) {
                textureFilePaths.push(relativePath);
            }
        }

        const texturesFolder = vscode.Uri.joinPath(resourcePackFolder, "textures");
        let texturesFolderExists = false;
        try {
            texturesFolderExists = await VscodeUtils.isDirectory(texturesFolder);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la vérification de l'existence du dossier "textures" : ${error.message}`);
            }

            throw error;
        }

        // Si le dossier "textures" n'existe pas, on le crée pour pouvoir y placer le fichier textures_list.json
        if (! texturesFolderExists) {
            try {
                await vscode.workspace.fs.createDirectory(texturesFolder);
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la création du dossier "textures" : ${error.message}`);
                }

                throw error;
            }
        }

        // On crée le fichier textures_list.json dans le dossier "textures" du pack de ressources, avec la liste des chemins relatifs des fichiers de textures du pack de ressources
        const texturesListUri = vscode.Uri.joinPath(texturesFolder, "textures_list.json");
        try {
            await VscodeUtils.writeFile(
                texturesListUri,
                JSON.stringify(textureFilePaths, null, 4)
            );
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la création du fichier textures_list.json : ${error.message}`);
            }

            throw error;
        }
    }

    /**
     * Prépare le projet Minecraft Bedrock pour la sortie (compilation TypeScript, création de fichiers nécessaires).
     * @param minecraftProject Le projet Minecraft à préparer
     * @throws {Error} S'il manque resource et behavior pack pour un addon, ou si la préparation échoue pour une autre raison
     */
    public static async prepareProjectForOutput(minecraftProject: MinecraftProject): Promise<void> {
        if (minecraftProject instanceof AddonMinecraftProject) { // Ici se passe la préparation pour les projets Addons
            let behaviorPack: vscode.Uri | undefined = undefined; // Variable qui contiendra le chemin du pack de comportement s'il existe
            let resourcePack: vscode.Uri | undefined = undefined; // Variable qui contiendra le chemin du pack de ressources s'il existe

            try { // Tentative de récupérer le chemin du pack de comportement, il peut ne pas exister et c'est pas grave, mais si une erreur survient lors de la récupération du chemin du pack de comportement, on veut le savoir
                if (await VscodeUtils.isDirectory(VscodeUtils.getUriFromPath(minecraftProject.getBehaviorPackPath()))) {
                    behaviorPack = VscodeUtils.getUriFromPath(minecraftProject.getBehaviorPackPath());
                }
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la récupération du chemin du pack de comportement : ${error.message}`);
                }
            }

            try { // Tentative de récupérer le chemin du pack de ressources, il peut ne pas exister et c'est pas grave, mais si une erreur survient lors de la récupération du chemin du pack de ressources, on veut le savoir
                if (await VscodeUtils.isDirectory(VscodeUtils.getUriFromPath(minecraftProject.getResourcePackPath()))) {
                    resourcePack = VscodeUtils.getUriFromPath(minecraftProject.getResourcePackPath());
                }
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la récupération du chemin du pack de ressources : ${error.message}`);
                }
            }

            // On envoie une erreur si il n'y a ni pack de comportement ni pack de ressources
            if (behaviorPack === undefined && resourcePack === undefined) {
                throw new Error("Le projet ne contient ni pack de comportement ni pack de ressources à préparer.");
            }

            if (behaviorPack) { // Taches de préparation pour le pack de comportement s'il existe
                // On verifie si une compilation TypeScript est nécéssaire
                let isTypeScriptCompilationNeeded = false;
                try {
                    isTypeScriptCompilationNeeded = await this.isTypeScriptCompilationNeeded(minecraftProject);
                } catch (error) {
                    if (error instanceof Error) {
                        throw new Error(`Erreur lors de la vérification de la nécessité de compiler du TypeScript : ${error.message}`);
                    }

                    throw error;
                }

                // Si une compilation TypeScript est nécessaire, on compile les fichiers TypeScript du projet
                if (isTypeScriptCompilationNeeded) {
                    try {
                        await this.compileTypeScript(minecraftProject);
                    } catch (error) {
                        if (error instanceof Error) {
                            throw new Error(`Erreur lors de la compilation TypeScript : ${error.message}`);
                        }

                        throw error;
                    }
                }

                try { // on tente de créer le fichier contents.json dans le pack de comportement
                    await this.createContentsJsonFile(behaviorPack);
                } catch (error) {
                    if (error instanceof Error) {
                        throw new Error(`Erreur lors de la création du fichier contents.json du pack de comportement : ${error.message}`);
                    }

                    throw error;
                }
            }

            if (resourcePack) { // Taches de préparation pour le pack de ressources s'il existe
                try { // on tente de créer le fichier textures_list.json dans le pack de ressources
                    await this.createTexturesListFile(minecraftProject);
                } catch (error) {
                    if (error instanceof Error) {
                        throw new Error(`Erreur lors de la création du fichier textures_list.json du pack de ressources : ${error.message}`);
                    }

                    throw error;
                }

                try { // on tente de créer le fichier contents.json dans le pack de ressources
                    await this.createContentsJsonFile(resourcePack);
                } catch (error) {
                    if (error instanceof Error) {
                        throw new Error(`Erreur lors de la création du fichier contents.json du pack de ressources : ${error.message}`);
                    }

                    throw error;
                }
            }
        }
    }

    /**
     * Déploie le projet Minecraft Bedrock dans le dossier de développement de Minecraft.
     * @param minecraftProject Le projet Minecraft à déployer
     * @throws {Error} S'il y a un probleme lors de la préaparation
     */
    public static async deployProject(minecraftProject: MinecraftProject): Promise<void> {
        try { // Préparation du projet avant déploiement (compilation, création de fichiers, etc.)
            await this.prepareProjectForOutput(minecraftProject);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la préparation du projet pour le déploiement : ${error.message}`);
            }

            throw error;
        }

        // Chemin de déploiement en fonction du produit Minecraft ciblé (stable ou preview)
        let deployBasePath: vscode.Uri;
        try {
            deployBasePath = await this.getDeployBasePath(minecraftProject);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la récupération du chemin de base pour le déploiement : ${error.message}`);
            }

            throw error;
        }

        if (minecraftProject instanceof AddonMinecraftProject) {
            let behaviorPack: vscode.Uri | undefined = undefined;
            let resourcePack: vscode.Uri | undefined = undefined;
            try {
                if (await VscodeUtils.isDirectory(VscodeUtils.getUriFromPath(minecraftProject.getBehaviorPackPath()))) {
                    behaviorPack = VscodeUtils.getUriFromPath(minecraftProject.getBehaviorPackPath());
                }
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la récupération du chemin du pack de comportement pour le déploiement : ${error.message}`);
                }

                throw error;
            }
            try {
                if (await VscodeUtils.isDirectory(VscodeUtils.getUriFromPath(minecraftProject.getResourcePackPath()))) {
                    resourcePack = VscodeUtils.getUriFromPath(minecraftProject.getResourcePackPath());
                }
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la récupération du chemin du pack de ressources pour le déploiement : ${error.message}`);
                }

                throw error;
            }

            if (behaviorPack === undefined && resourcePack === undefined) {
                throw new Error("Le projet ne contient ni pack de comportement ni pack de ressources à déployer.");
            }

            // Deploiment du behavior pack
            if (behaviorPack) {
                try {
                    await vscode.workspace.fs.copy(
                        behaviorPack,
                        vscode.Uri.joinPath(deployBasePath, "development_behavior_packs", minecraftProject.id),
                        { overwrite: true }
                    );
                } catch (error) {
                    if (error instanceof Error) {
                        throw new Error(`Erreur lors du déploiement du pack de comportement : ${error.message}`);
                    }

                    throw error;
                }
            }

            // Deploiment du resource pack
            if (resourcePack) {
                try {
                    await vscode.workspace.fs.copy(
                        resourcePack,
                        vscode.Uri.joinPath(deployBasePath, "development_resource_packs", minecraftProject.id),
                        { overwrite: true }
                    );
                } catch (error) {
                    if (error instanceof Error) {
                        throw new Error(`Erreur lors du déploiement du pack de ressources : ${error.message}`);
                    }

                    throw error;
                }
            }
        }
        // TODO gérére les autres types de projets 
    }

    /**
     * Exporte le projet Minecraft Bedrock.
     * @param minecraftProject Le projet Minecraft à exporter
     * @throws {Error} S'il manque resource et behavior pack pour un addon
     */
    public static async exportProject(minecraftProject: MinecraftProject): Promise<void> {
        try { // Préparation du projet avant exportation (compilation, création de fichiers, etc.)
            await this.prepareProjectForOutput(minecraftProject);
        } catch (error: any) {
            throw new Error(`Échec de la préparation du projet pour l'exportation : ${error.message}`);
        }

        if (minecraftProject instanceof AddonMinecraftProject) { // Cas des projets de type Addon
            let behaviorPack: vscode.Uri | undefined = undefined;
            let resourcePack: vscode.Uri | undefined = undefined;
            try {
                if (await VscodeUtils.isDirectory(VscodeUtils.getUriFromPath(minecraftProject.getBehaviorPackPath()))) {
                    behaviorPack = VscodeUtils.getUriFromPath(minecraftProject.getBehaviorPackPath());
                }
            } catch (error) {
                console.log("Il n'y a pas de Behavior Pack à exporter.", error);
            }
            try {
                if (await VscodeUtils.isDirectory(VscodeUtils.getUriFromPath(minecraftProject.getResourcePackPath()))) {
                    resourcePack = VscodeUtils.getUriFromPath(minecraftProject.getResourcePackPath());
                }
            } catch (error) {
                console.log("Il n'y a pas de Resource Pack à exporter.", error);
            }

            if (behaviorPack === undefined && resourcePack === undefined) {
                throw new Error("Le projet ne contient ni pack de comportement ni pack de ressources à exporter.");
            }

            // Création du dossier d'exportation à la racine du projet
            const exportFolder = VscodeUtils.getUriFromPath(minecraftProject.folder + "/export");
            if (! await VscodeUtils.pathExists(exportFolder)) {
                await vscode.workspace.fs.createDirectory(exportFolder);
            }

            if (behaviorPack) { // Si le pack de comportement existe, on le zippe dans le dossier d'exportation avec comme nom <id_du_projet>_bp.mcpack
                const behaviorPackName = `${minecraftProject.id}_bp.mcpack`;
                const behaviorPackExportPath = vscode.Uri.joinPath(exportFolder, behaviorPackName);
                await FileSystemUtils.createArchive(
                    [{source: behaviorPack, metadataPath: ""}],
                    behaviorPackExportPath
                );
            }

            if (resourcePack) { // Si le pack de ressources existe, on le zippe dans le dossier d'exportation avec comme nom <id_du_projet>_rp.mcpack
                const resourcePackName = `${minecraftProject.id}_rp.mcpack`;
                const resourcePackExportPath = vscode.Uri.joinPath(exportFolder, resourcePackName);
                await FileSystemUtils.createArchive(
                    [{source: resourcePack, metadataPath: ""}],
                    resourcePackExportPath
                );
            }

            const entries = []; // Tableau qui contiendra les entrées à zipper pour créer un .mcaddon
            if (behaviorPack) {
                entries.push({source: behaviorPack, metadataPath: `${minecraftProject.id}_bp`});
            }
            if (resourcePack) {
                entries.push({source: resourcePack, metadataPath: `${minecraftProject.id}_rp`});
            }

            if (entries.length > 0) { // Si il y a au moins un pack à inclure dans le .mcaddon, on crée le .mcaddon dans le dossier d'exportation avec comme nom <id_du_projet>.mcaddon
                const mcaddonName = `${minecraftProject.id}.mcaddon`;
                const mcaddonExportPath = vscode.Uri.joinPath(exportFolder, mcaddonName);
                await FileSystemUtils.createArchive(
                    entries,
                    mcaddonExportPath
                );
            }
        }
        // todo
    }
}