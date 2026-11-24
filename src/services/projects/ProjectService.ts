import * as vscode from 'vscode';
import { VscodeUtils } from '../../vscode-utils/VscodeUtils';
import { MinecraftProjectConfig } from '../../core/minecraft/models/projects/MinecraftProjectConfig';
import { ProjectMetadata } from '../../types/projectConfig';
import { MinecraftProjectLoader } from './MinecraftProjectLoader';
import { ProjectTemplateService } from './ProjectTemplateService';

export class ProjectService {
    public static async createVSCodeSettings(projectFolder: vscode.Uri): Promise<void> {
        const vscodeFolder = vscode.Uri.joinPath(projectFolder, '.vscode');
        try {
            await vscode.workspace.fs.createDirectory(vscodeFolder);
        } catch (error) {
            if (error instanceof vscode.FileSystemError && error.code === 'FileExists') {
                console.log('Le dossier .vscode existe déjà, il sera utilisé tel quel.');
            } else {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la création du dossier .vscode : ${error.message}`);
                }

                throw error;
            }
        }

        await ProjectTemplateService.copyTemplateFile(
            'vscode-folder/settings.json',
            vscode.Uri.joinPath(vscodeFolder, 'settings.json')
        );
    }

    public static async createMinecraftProjectFile(projectFolder: vscode.Uri, metadata: ProjectMetadata): Promise<void> {
        let mcbeProjectContent: MinecraftProjectConfig;

        try {
            mcbeProjectContent = new MinecraftProjectConfig({
                metadata: metadata,
                options: { deploy: { prompt_to_launch_minecraft: true } }
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la validation de la configuration du projet : ${error.message}`);
            }

            throw error;
        }

        try {
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
}
