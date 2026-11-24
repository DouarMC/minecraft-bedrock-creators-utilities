import * as vscode from 'vscode';
import { promisify } from 'util';
import { exec } from 'child_process';
import { ProjectTemplateService } from './ProjectTemplateService';
import { VscodeUtils } from '../../vscode-utils/VscodeUtils';

export class ScriptApiService {
    private static async createMainTsFile(scriptsPath: vscode.Uri): Promise<void> {
        try {
            await ProjectTemplateService.copyTemplateFile('script-api/main.ts', vscode.Uri.joinPath(scriptsPath, 'main.ts'));
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la création du fichier main.ts de l'API Script : ${error.message}`);
            }

            throw error;
        }
    }

    private static async createTsConfigFile(projectFolder: vscode.Uri): Promise<void> {
        try {
            await ProjectTemplateService.copyTemplateFile('script-api/tsconfig.template.json', vscode.Uri.joinPath(projectFolder, 'tsconfig.json'));
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la création du fichier tsconfig.json de l'API Script : ${error.message}`);
            }

            throw error;
        }
    }

    private static async createMinecraftEnvTypesFile(projectFolder: vscode.Uri): Promise<void> {
        const minecraftEnvPath = vscode.Uri.joinPath(projectFolder, 'types', 'minecraft-env');
        try {
            await vscode.workspace.fs.createDirectory(minecraftEnvPath);
        } catch (error) {
            if (error instanceof vscode.FileSystemError && error.code === 'FileExists') {
                // The types folder already exists.
            } else {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la création du dossier "types/minecraft-env" : ${error.message}`);
                }

                throw error;
            }
        }

        try {
            await ProjectTemplateService.copyTemplateFile(
                'script-api/types/minecraft-env/index.d.ts',
                vscode.Uri.joinPath(minecraftEnvPath, 'index.d.ts')
            );
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la création du fichier types/minecraft-env/index.d.ts de l'API Script : ${error.message}`);
            }

            throw error;
        }
    }

    public static async createScriptApiStructure(projectFolder: vscode.Uri): Promise<void> {
        const scriptsPath = vscode.Uri.joinPath(projectFolder, 'addon', 'scripts');
        try {
            await vscode.workspace.fs.createDirectory(scriptsPath);
        } catch (error) {
            if (error instanceof vscode.FileSystemError && error.code === 'FileExists') {
                // The scripts folder already exists.
            } else {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la création du dossier "scripts" : ${error.message}`);
                }

                throw error;
            }
        }

        try {
            await this.createMainTsFile(scriptsPath);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la création du fichier main.ts de l'API Script : ${error.message}`);
            }

            throw error;
        }

        try {
            await this.createTsConfigFile(projectFolder);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la création du fichier tsconfig.json de l'API Script : ${error.message}`);
            }

            throw error;
        }

        try {
            await this.createMinecraftEnvTypesFile(projectFolder);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la création du fichier types/minecraft-env/index.d.ts de l'API Script : ${error.message}`);
            }

            throw error;
        }
    }

    public static async installNpmDependencies(projectFolder: vscode.Uri): Promise<void> {
        const execPromise = promisify(exec);
        try {
            await execPromise('npm -v');
            const { stderr } = await execPromise('npm install --legacy-peer-deps', { cwd: projectFolder.fsPath });
            if (stderr) console.error(stderr);

            vscode.window.showInformationMessage('📦 Modules npm installés !');
        } catch (error) {
            if (error instanceof Error) {
                const isNpmNotFound = error.message.includes('npm') || (error as any).code === 'ENOENT';
                if (isNpmNotFound) {
                    throw new Error('Node.js (et npm) est requis pour installer les dépendances. Installez-le depuis https://nodejs.org/');
                } else {
                    throw new Error(`Erreur lors de l'installation des dépendances npm : ${error.message}`);
                }
            }

            throw error;
        }
    }
}
