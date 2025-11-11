import * as vscode from 'vscode';
import { VscodeUtils } from '../utils/VscodeUtils';
import { MinecraftProjectConfig } from './MinecraftProjectConfig';
import { MinecraftAddonPack, ProjectMetadata } from '../../types/projectConfig';
import { AddonMinecraftProject, MinecraftProject } from './MinecraftProject';
import { AddonPackageJson } from '../../types/addonPackageJson';
import { PromptService } from '../ui/PromptService';
import { randomUUID } from 'crypto';
import { promisify } from 'util';
import { exec } from 'child_process';
import { MinecraftGameManager } from '../minecraft/MinecraftGameManager';

export class ProjectService {
    /**
     * Copie un fichier modèle depuis le dossier des templates de l'extension vers une destination donnée
     * @param templateRelativePath Le chemin relatif du fichier modèle dans le dossier des templates
     * @param destination L'URI de destination où copier le fichier
     * @throws {Error} Si le fichier modèle n'existe pas
     */
    public static async copyTemplateFile(templateRelativePath: string, destination: vscode.Uri): Promise<void> {
        const extensionContext = VscodeUtils.getContext();
        const templateUri = vscode.Uri.joinPath(extensionContext.extensionUri, "templates", templateRelativePath);
        if (! await VscodeUtils.pathExists(templateUri)) {
            throw new Error(`Le fichier modèle '${templateRelativePath}' est introuvable dans l'extension.`);
        }

        await vscode.workspace.fs.copy(templateUri, destination, { overwrite: true });
    }

    /**
     * Crée le dossier .vscode et y ajoute le fichier settings.json
     * @param projectFolder L'URI du dossier du projet
     * @throws {Error} Si la copie du fichier modèle échoue
     */
    public static async createVSCodeSettings(projectFolder: vscode.Uri): Promise<void> {
        const vscodeFolder = vscode.Uri.joinPath(projectFolder, ".vscode");
        await vscode.workspace.fs.createDirectory(vscodeFolder);
        await ProjectService.copyTemplateFile("vscode-folder/settings.json", vscode.Uri.joinPath(vscodeFolder, "settings.json"));
    }

    /**
     * Crée le fichier .mcbe_project.json à la racine du projet
     * @param projectFolder L'URI du dossier du projet
     * @param metadata Les métadonnées du projet
     */
    public static async createMinecraftProjectFile(projectFolder: vscode.Uri, metadata: ProjectMetadata): Promise<void> {
        const mcbeProjectContent = new MinecraftProjectConfig({
            metadata: metadata,
            options: {deploy: {prompt_to_launch_minecraft: true}}
        });

        await VscodeUtils.writeFile(
            vscode.Uri.joinPath(projectFolder, MinecraftProject.PROJECT_CONFIG_FILE_NAME),
            JSON.stringify(mcbeProjectContent, null, 4)
        );
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
     * Crée le dossier "addon" dans le projet.
     * @param projectFolder L'URI du dossier du projet
     * @returns 
     */
    private static async createAddonFolder(projectFolder: vscode.Uri): Promise<vscode.Uri> {
        const addonFolder = vscode.Uri.joinPath(projectFolder, "addon");
        await vscode.workspace.fs.createDirectory(addonFolder);
        return addonFolder;
    }

    /**
     * Crée le dossier du pack de comportement.
     * @param projectFolder L'URI du dossier du projet
     * @returns 
     */
    private static async createBehaviorPackFolder(projectFolder: vscode.Uri): Promise<vscode.Uri> {
        const behaviorPackFolder = vscode.Uri.joinPath(projectFolder, "addon", MinecraftAddonPack.BehaviorPack);
        await vscode.workspace.fs.createDirectory(behaviorPackFolder);
        return behaviorPackFolder;
    }

    /**
     * Crée le dossier du pack de ressources.
     * @param projectFolder L'URI du dossier du projet
     * @returns 
     */
    private static async createResourcePackFolder(projectFolder: vscode.Uri): Promise<vscode.Uri> {
        const resourcePackFolder = vscode.Uri.joinPath(projectFolder, "addon", MinecraftAddonPack.ResourcePack);
        await vscode.workspace.fs.createDirectory(resourcePackFolder);
        return resourcePackFolder;
    }

    /**
     * Active l'API Script dans le manifeste du pack de comportement.
     * @param behaviorManifest Le manifeste du pack de comportement
     * @returns 
     */
    private static enableScriptApiInManifest(behaviorManifest: any): void {
        const hasScriptModule = behaviorManifest.modules.some((module: any) => module.type === "script");
        if (hasScriptModule) {
            return;
        }

        behaviorManifest.modules = behaviorManifest.modules || [];
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

        for (const type of moduleTypes) {
            if (type === "data") {
                behaviorManifest.modules.push({
                    type: "data",
                    uuid: randomUUID(),
                    version: [0, 0, 1]
                });
            } else if (type === "script") {
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
        await this.copyTemplateFile("script-api/main.ts", vscode.Uri.joinPath(scriptsPath, "main.ts"));
    }

    /**
     * Crée le fichier tsconfig.json pour l'API Script.
     * @param projectFolder L'URI du dossier du projet
     * @throws {Error} Si la copie du fichier modèle échoue
     */
    private static async createTsConfigFile(projectFolder: vscode.Uri): Promise<void> {
        await this.copyTemplateFile("script-api/tsconfig.template.json", vscode.Uri.joinPath(projectFolder, "tsconfig.json"));
    }

    /**
     * Crée le fichier types/minecraft-env/index.d.ts pour l'API Script.
     * @param projectFolder L'URI du dossier du projet
     * @throws {Error} Si la copie du fichier modèle échoue
     */
    private static async createMinecraftEnvTypesFile(projectFolder: vscode.Uri): Promise<void> {
        const minecraftEnvPath = vscode.Uri.joinPath(projectFolder, "types", "minecraft-env");
        await vscode.workspace.fs.createDirectory(minecraftEnvPath);
        await this.copyTemplateFile("script-api/types/minecraft-env/index.d.ts", vscode.Uri.joinPath(minecraftEnvPath, "index.d.ts"));
    }

    /**
     * Génère la structure de l'API Script dans le projet.
     * @param projectFolder L'URI du dossier du projet
     * @throws {Error} Si la création des fichiers ou dossiers échoue
     */
    public static async createScriptApiStructure(projectFolder: vscode.Uri): Promise<void> {
        // Crée le dossier scripts
        const scriptsPath = vscode.Uri.joinPath(projectFolder, "addon", "scripts");
        await vscode.workspace.fs.createDirectory(scriptsPath);

        // Crée le fichier main.ts
        await this.createMainTsFile(scriptsPath);
        // Crée le fichier tsconfig.json
        await this.createTsConfigFile(projectFolder);

        // Crée le fichier types/minecraft-env/index.d.ts
        await this.createMinecraftEnvTypesFile(projectFolder);
    }

    /**
     * Ajoute les modules Script API sélectionnés au manifeste du pack de comportement et au package.json.
     * @param behaviorManifest Le manifeste du pack de comportement
     * @param packageJson Le contenu du package.json
     * @param modules Les modules à ajouter avec leurs versions
     */
    public static addScriptApiModules(behaviorManifest: any, packageJson: any, modules: Record<string, string>): void {
        behaviorManifest.dependencies = behaviorManifest.dependencies || [];
        for (const [moduleName, moduleVersion] of Object.entries(modules)) {
            const hasDependency = behaviorManifest.dependencies.some((dep: any) => dep.module_name === moduleName);
            if (! hasDependency) {
                behaviorManifest.dependencies.push({
                    module_name: moduleName,
                    version: moduleVersion
                });
            }
            if (packageJson.dependencies === undefined) {
                packageJson.dependencies = {};
            }
            if (packageJson.dependencies[moduleName] === undefined) {
                packageJson.dependencies[moduleName] = moduleVersion;
            } else if (packageJson.dependencies[moduleName] !== moduleVersion) {
                // Met à jour la version si différente
                packageJson.dependencies[moduleName] = moduleVersion;
            }
        }
    }

    /**
     * Crée le fichier pack_icon.png dans le dossier du pack.
     * @param packFolder L'URI du dossier du pack
     */
    public static async createPackIconFile(packFolder: vscode.Uri): Promise<void> {
        const extensionContext = VscodeUtils.getContext();
        const iconSource = vscode.Uri.joinPath(extensionContext.extensionUri, "resources", "default_pack_icon.png");
        const iconTarget = vscode.Uri.joinPath(packFolder, "pack_icon.png");
        await vscode.workspace.fs.copy(iconSource, iconTarget);
    }

    /**
     * Crée le fichier en_US.lang pour le pack donné.
     * @param packFolder L'URI du dossier du pack
     * @param projectMetadata Les métadonnées du projet
     * @param packType Le type de pack (BehaviorPack ou ResourcePack)
     * 
     * @throws {Error} Si la création des fichiers échoue
     */
    public static async createEnUsLangFile(packFolder: vscode.Uri, projectMetadata: ProjectMetadata, packType: MinecraftAddonPack): Promise<void> {
        // Crée le dossier "texts"
        const textsFolder = vscode.Uri.joinPath(packFolder, "texts");
        await vscode.workspace.fs.createDirectory(textsFolder);

        // 🗂 languages.json
        const languagesPath = vscode.Uri.joinPath(textsFolder, "languages.json");
        await VscodeUtils.writeFile(languagesPath, JSON.stringify(["en_US"], null, 4));

        // 🗣 en_US.lang
        const displayName = projectMetadata.displayName;
        const author = projectMetadata.author;
        const packLabel = packType === MinecraftAddonPack.BehaviorPack ? "BP" : "RP";
        const langContent =
            `pack.name=${displayName} ${packLabel} [v0.0.1] - by ${author}` +
            `\npack.description=Pack for ${displayName} - Created by ${author}`;
        const enUSPath = vscode.Uri.joinPath(textsFolder, "en_US.lang");
        await VscodeUtils.writeFile(enUSPath, langContent);
    }

    /**
     * Configure les dépendances entre le pack de comportement et le pack de ressources.
     * @param behaviorManifest Le manifeste du pack de comportement
     * @param resourceManifest Le manifeste du pack de ressources
     */
    private static configurePackDependencies(behaviorManifest: any, resourceManifest: any): void {
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

    /**
     * Installe les dépendances npm dans le dossier du projet.
     * @param projectFolder L'URI du dossier du projet
     */
    private static async installNpmDependencies(projectFolder: vscode.Uri): Promise<void> {
        const execPromise = promisify(exec);
        try {
            await execPromise("npm -v"); // vérifie npm
            const { stderr } = await execPromise("npm install", { cwd: projectFolder.fsPath });
            if (stderr) console.error(stderr);

            vscode.window.showInformationMessage("📦 Modules npm installés !");
        } catch (error: any) {
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

    public static async createAddonStructure(projectFolder: vscode.Uri, metadata: ProjectMetadata): Promise<void> {
        // Base du package.json
        const packageJsonContent = this.createBasePackageJson(metadata);

        // Création du dossier "addon"
        const addonFolder = await this.createAddonFolder(projectFolder);

        // Sélection des types de packs
        const packsAddon = await PromptService.askAddonPackTypes();
        if (packsAddon.length === 0) {
            vscode.window.showWarningMessage("Aucun type de pack sélectionné. L'initialisation de l'addon a été annulée.");
            return;
        }

        const isBehaviorPack = packsAddon.includes(MinecraftAddonPack.BehaviorPack);
        const isResourcePack = packsAddon.includes(MinecraftAddonPack.ResourcePack);

        let behaviorManifest: any = undefined;
        let resourceManifest: any = undefined;

        if (isBehaviorPack === true) {
            const behaviorPackFolder = await this.createBehaviorPackFolder(projectFolder);

            const behaviorPackModuleTypes = await PromptService.askBehaviorPackModuleTypes();
            if (behaviorPackModuleTypes.length === 0) {
                vscode.window.showWarningMessage("Aucun type de module sélectionné pour le pack de comportement. L'initialisation de l'addon a été annulée.");
                return;
            }

            behaviorManifest = await this.createBaseBehaiovrPackManifest(behaviorPackModuleTypes);

            if (behaviorPackModuleTypes.includes("script")) {
                await this.createScriptApiStructure(projectFolder);

                const selectedModules = await PromptService.askScriptApiModules();
                if (selectedModules !== undefined) {
                    this.addScriptApiModules(behaviorManifest, packageJsonContent, selectedModules);
                }
            }

            await this.createPackIconFile(behaviorPackFolder);
            await this.createEnUsLangFile(behaviorPackFolder, metadata, MinecraftAddonPack.BehaviorPack);
        }

        if (isResourcePack === true) {
            const resourcePackFolder = await this.createResourcePackFolder(projectFolder);
            resourceManifest = this.createBaseResourcePackManifest();

            await this.createPackIconFile(resourcePackFolder);
            await this.createEnUsLangFile(resourcePackFolder, metadata, MinecraftAddonPack.ResourcePack);
        }

        this.configurePackDependencies(behaviorManifest, resourceManifest);

        if (behaviorManifest !== undefined) {
            const behaviorManifestPath = vscode.Uri.joinPath(addonFolder, MinecraftAddonPack.BehaviorPack, "manifest.json");
            await VscodeUtils.writeFile(behaviorManifestPath, JSON.stringify(behaviorManifest, null, 4));
        }

        if (resourceManifest !== undefined) {
            const resourceManifestPath = vscode.Uri.joinPath(addonFolder, MinecraftAddonPack.ResourcePack, "manifest.json");
            await VscodeUtils.writeFile(resourceManifestPath, JSON.stringify(resourceManifest, null, 4));
        }

        // Écriture du fichier package.json à la racine du projet
        await VscodeUtils.writeFile(
            vscode.Uri.joinPath(projectFolder, "package.json"),
            JSON.stringify(packageJsonContent, null, 4)
        );

        // Installation des dépendances npm
        await this.installNpmDependencies(projectFolder);
    }

    /**
     * Renvoie le chemin de base pour le déploiement du projet Minecraft selon le produit Minecraft.
     * @param minecraftProject Le projet Minecraft à déployer
     * @returns 
     */
    public static async getDeployBasePath(minecraftProject: MinecraftProject): Promise<vscode.Uri> {
        const game = minecraftProject.minecraftProduct === "stable" ? MinecraftGameManager.getStableGame() : MinecraftGameManager.getPreviewGame();

        return await game.getComMojangFolder();
    }

    /**
     * Indique si une compilation TypeScript est nécessaire pour le projet donné.
     * @param minecraftProject Le projet Minecraft Bedrock de type Addon
     * @returns 
     */
    public static async isTypeScriptCompilationNeeded(minecraftProject: AddonMinecraftProject): Promise<boolean> {
        try {
            await minecraftProject.getScriptsFolder();
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Compile les fichiers TypeScript du projet donné.
     * @param minecraftProject Le projet Minecraft Bedrock de type Addon
     * @throws {Error} Si une erreur survient lors de la compilation
     */
    public static async compileTypeScript(minecraftProject: AddonMinecraftProject): Promise<void> {
        const execPromise = promisify(exec);
        const { stdout, stderr } = await execPromise(`tsc`, {cwd: minecraftProject.folder.fsPath});

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

        if (! await VscodeUtils.isFile(contentsJsonUri)) {
            const contentsJson = {};
            await VscodeUtils.writeFile(
                contentsJsonUri,
                JSON.stringify(contentsJson, null, 4)
            );
        }
    }

    /**
     * Crée le fichier textures_list.json dans le Resource Pack du projet donné.
     * @param minecraftProject Le projet Minecraft Bedrock de type Addon
     * @throws {Error} Si la création du fichier échoue
     */
    public static async createTexturesListFile(minecraftProject: AddonMinecraftProject): Promise<void> {
        function getTextureRelativePath(uri: vscode.Uri): string | null {
            const match = /[\/\\](textures[\/\\].+\.(tga|png|jpg|jpeg))$/i.exec(uri.fsPath);
            if (!match) {return null;}
            // Uniformise les slashs pour être cross-platform
            return match[1].replace(/\\/g, '/');
        }


        const textureFilePaths: string[] = [];
        const resourcePackPath = await minecraftProject.getResourcePackFolder();
        const texturesUris = await minecraftProject.getDataDrivenFiles("resource_pack/textures/*.{tga,png,jpg,jpeg}");
        for (const uri of texturesUris) {
            const relativePath = getTextureRelativePath(uri);
            if (relativePath) {
                textureFilePaths.push(relativePath);
            }
        }

        const texturesListUri = vscode.Uri.joinPath(resourcePackPath, "textures", "textures_list.json");
        await VscodeUtils.writeFile(
            texturesListUri,
            JSON.stringify(textureFilePaths, null, 4)
        );
    }

    /**
     * Prépare le projet Minecraft Bedrock pour la sortie (compilation TypeScript, création de fichiers nécessaires).
     * @param minecraftProject Le projet Minecraft à préparer
     * @throws {Error} S'il manque resource et behavior pack pour un addon
     */
    public static async prepareProjectForOutput(minecraftProject: MinecraftProject): Promise<void> {
        if (minecraftProject instanceof AddonMinecraftProject) {
            let behaviorPack: vscode.Uri | undefined = undefined;
            let resourcePack: vscode.Uri | undefined = undefined;
            try {
                behaviorPack = await minecraftProject.getBehaviorPackFolder();
            } catch (error) {
                console.log("Il n'y a pas de Behavior Pack à préparer.", error);
            }
            try {
                resourcePack = await minecraftProject.getResourcePackFolder();
            } catch (error) {
                console.log("Il n'y a pas de Resource Pack à préparer.", error);
            }

            if (behaviorPack === undefined && resourcePack === undefined) {
                throw new Error("Le projet ne contient ni pack de comportement ni pack de ressources à préparer.");
            }

            if (behaviorPack) {
                if (await this.isTypeScriptCompilationNeeded(minecraftProject)) {
                    await this.compileTypeScript(minecraftProject);
                }

                await this.createContentsJsonFile(behaviorPack);
            }

            if (resourcePack) {
                await this.createTexturesListFile(minecraftProject);
                await this.createContentsJsonFile(resourcePack);
            }
        }
    }

    /**
     * Déploie le projet Minecraft Bedrock.
     * @param minecraftProject Le projet Minecraft à déployer
     * @throws {Error} S'il manque resource et behavior pack pour un addon
     */
    public static async deployProject(minecraftProject: MinecraftProject): Promise<void> {
        // Préparation du projet avant déploiement (compilation, création de fichiers, etc.)
        await this.prepareProjectForOutput(minecraftProject);

        // Chemin de déploiement
        const deployBasePath = await this.getDeployBasePath(minecraftProject);

        if (minecraftProject instanceof AddonMinecraftProject) {
            let behaviorPack: vscode.Uri | undefined = undefined;
            let resourcePack: vscode.Uri | undefined = undefined;
            try {
                behaviorPack = await minecraftProject.getBehaviorPackFolder();
            } catch (error) {
                console.log("Il n'y a pas de Behavior Pack à déployer.", error);
            }
            try {
                resourcePack = await minecraftProject.getResourcePackFolder();
            } catch (error) {
                console.log("Il n'y a pas de Resource Pack à déployer.", error);
            }

            if (behaviorPack === undefined && resourcePack === undefined) {
                throw new Error("Le projet ne contient ni pack de comportement ni pack de ressources à déployer.");
            }

            // Deploiment du behavior pack
            if (behaviorPack) {
                await vscode.workspace.fs.copy(
                    behaviorPack,
                    vscode.Uri.joinPath(deployBasePath, "development_behavior_packs", minecraftProject.id),
                    { overwrite: true }
                );
            }

            // Deploiment du resource pack
            if (resourcePack) {
                await vscode.workspace.fs.copy(
                    resourcePack,
                    vscode.Uri.joinPath(deployBasePath, "development_resource_packs", minecraftProject.id),
                    { overwrite: true }
                );
            }
        }
    }
}