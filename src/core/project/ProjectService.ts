import * as vscode from 'vscode';
import { VscodeUtils } from '../utils/VscodeUtils';
import { MinecraftProjectConfig } from './MinecraftProjectConfig';
import { ProjectMetadata } from '../../types/projectConfig';
import { MinecraftProject } from './MinecraftProject';

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
}