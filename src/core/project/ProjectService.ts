import * as vscode from 'vscode';
import { VscodeUtils } from '../utils/VscodeUtils';
import { MinecraftProjectConfig } from './MinecraftProjectConfig';
import { MinecraftAddonPack, ProjectMetadata } from '../../types/projectConfig';
import { MinecraftProject } from './MinecraftProject';
import { AddonPackageJson } from '../../types/addonPackageJson';
import { PromptService } from '../ui/PromptService';
import { describe } from 'node:test';
import { randomUUID } from 'crypto';

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
        }
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
     * Crée la base du manifeste du pack de comportement.
     * @param moduleTypes Les types de modules à inclure dans le manifeste
     * @returns 
     */
    private static createBaseBehaiovrPackManifest(moduleTypes: ("script" | "data")[]): any {
        const formatVersion = 2;
        const header = {
            name: "pack.name",
            description: "pack.description",
            uuid: randomUUID(),
            version: [0, 0, 1],
            min_engine_version: [1, 21, 120]
        };
        const modules = moduleTypes.map(type => {
            if (type === "data") {
                return {
                    type: "data",
                    uuid: randomUUID(),
                    version: [0, 0, 1]
                };
            } else {
                return {
                    type: "script",
                    uuid: randomUUID(),
                    version: [0, 0, 1],
                    language: "javascript",
                    entry: "scripts/main.js"
                };
            }
        });
        return {
            format_version: formatVersion,
            header: header,
            modules: modules
        }
    }

    /**
     * Crée le fichier main.ts pour l'API Script.
     * @param scriptsPath Le chemin du dossier scripts
     */
    private static async createMainTsFile(scriptsPath: vscode.Uri): Promise<void> {
        await this.copyTemplateFile("script-api/main.ts", vscode.Uri.joinPath(scriptsPath, "main.ts"));
    }

    /**
     * Crée le fichier tsconfig.json pour l'API Script.
     * @param projectFolder L'URI du dossier du projet
     */
    private static async createTsConfigFile(projectFolder: vscode.Uri): Promise<void> {
        await this.copyTemplateFile("script-api/tsconfig.template.json", vscode.Uri.joinPath(projectFolder, "tsconfig.json"));
    }

    public static async createScriptApiStructure(projectFolder: vscode.Uri): Promise<void> {
        // Crée le dossier scripts
        const scriptsPath = vscode.Uri.joinPath(projectFolder, "addon", "scripts");
        await vscode.workspace.fs.createDirectory(scriptsPath);

        // Crée le fichier main.ts
        await this.createMainTsFile(scriptsPath);
        // Crée le fichier tsconfig.json
        await this.createTsConfigFile(projectFolder);

        
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

            }
        }
    }
}