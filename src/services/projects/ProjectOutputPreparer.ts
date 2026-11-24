import * as vscode from 'vscode';
import { promisify } from 'util';
import { exec, execFile } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { AddonMinecraftProject } from '../../core/minecraft/models/projects/AddonMinecraftProject';
import { MinecraftProject } from '../../core/minecraft/models/projects/MinecraftProject';
import { MinecraftFileResolverService } from '../minecraft/MinecraftFileResolverService';
import { VscodeUtils } from '../../vscode-utils/VscodeUtils';

export class ProjectOutputPreparer {
    /**
     * Indique si une compilation TypeScript est nécessaire pour le projet donné.
     */
    private static async isTypeScriptCompilationNeeded(minecraftProject: AddonMinecraftProject): Promise<boolean> {
        let scriptsFolder: vscode.Uri | undefined;
        try {
            scriptsFolder = VscodeUtils.getUriFromPath(minecraftProject.getScriptsPath());
            if (!await VscodeUtils.isDirectory(scriptsFolder)) {
                return false;
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la vérification de l'existence du dossier "scripts" : ${error.message}`);
            }

            throw error;
        }

        return true;
    }

    /**
     * Compile les fichiers TypeScript du projet donné.
     */
    private static async compileTypeScript(minecraftProject: AddonMinecraftProject): Promise<void> {
        const localCompilerPath = path.join(minecraftProject.folder, 'node_modules', 'typescript', 'bin', 'tsc');
        try {
            await fs.promises.access(localCompilerPath);
        } catch (error) {
            if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) {
                throw error;
            }

            const execPromise = promisify(exec);
            const { stderr } = await execPromise('tsc', { cwd: minecraftProject.folder });
            if (stderr) {
                throw new Error(stderr);
            }

            return;
        }

        const execFilePromise = promisify(execFile);
        const { stderr } = await execFilePromise(process.execPath, [localCompilerPath], { cwd: minecraftProject.folder });
        if (stderr) {
            throw new Error(stderr);
        }
    }

    /**
     * Crée le fichier contents.json dans le pack donné s'il n'existe pas.
     */
    private static async createContentsJsonFile(packPath: vscode.Uri): Promise<void> {
        const contentsJsonUri = vscode.Uri.joinPath(packPath, 'contents.json');

        let contentsJsonExists = false;
        try {
            contentsJsonExists = await VscodeUtils.isFile(contentsJsonUri);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la vérification de l'existence du fichier contents.json : ${error.message}`);
            }

            throw error;
        }

        if (!contentsJsonExists) {
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
     */
    private static async createTexturesListFile(minecraftProject: AddonMinecraftProject): Promise<void> {
        function getTextureRelativePath(uri: vscode.Uri): string | null {
            const match = /[\/\\](textures[\/\\].+\.(tga|png|jpg|jpeg))$/i.exec(uri.fsPath);
            if (!match) {return null;}
            return match[1].replace(/\\/g, '/');
        }

        const textureFilePaths: string[] = [];
        let resourcePackFolder: vscode.Uri | undefined = undefined;
        try {
            resourcePackFolder = VscodeUtils.getUriFromPath(minecraftProject.getResourcePackPath());
            if (!await VscodeUtils.isDirectory(resourcePackFolder)) {
                throw new Error(`Le chemin du pack de ressources existe mais n'est pas un dossier : ${resourcePackFolder.fsPath}`);
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la récupération du chemin du pack de ressources pour la création du fichier textures_list.json : ${error.message}`);
            }

            throw error;
        }
        if (!resourcePackFolder) {
            throw new Error("Le projet ne contient pas de pack de ressources. Impossible de créer le fichier textures_list.json.");
        }

        const texturesUris = await MinecraftFileResolverService.getDataDrivenFiles("resource_pack/textures/*.{tga,png,jpg,jpeg}", minecraftProject);
        for (const uri of texturesUris) {
            const relativePath = getTextureRelativePath(uri);
            if (relativePath) {
                textureFilePaths.push(relativePath);
            }
        }

        const texturesFolder = vscode.Uri.joinPath(resourcePackFolder, 'textures');
        let texturesFolderExists = false;
        try {
            texturesFolderExists = await VscodeUtils.isDirectory(texturesFolder);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la vérification de l'existence du dossier "textures" : ${error.message}`);
            }

            throw error;
        }

        if (!texturesFolderExists) {
            try {
                await vscode.workspace.fs.createDirectory(texturesFolder);
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la création du dossier "textures" : ${error.message}`);
                }

                throw error;
            }
        }

        const texturesListUri = vscode.Uri.joinPath(texturesFolder, 'textures_list.json');
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
     */
    public static async prepareProjectForOutput(minecraftProject: MinecraftProject): Promise<void> {
        if (minecraftProject instanceof AddonMinecraftProject) {
            let behaviorPack: vscode.Uri | undefined = undefined;
            let resourcePack: vscode.Uri | undefined = undefined;

            try {
                if (await VscodeUtils.isDirectory(VscodeUtils.getUriFromPath(minecraftProject.getBehaviorPackPath()))) {
                    behaviorPack = VscodeUtils.getUriFromPath(minecraftProject.getBehaviorPackPath());
                }
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la récupération du chemin du pack de comportement : ${error.message}`);
                }
            }

            try {
                if (await VscodeUtils.isDirectory(VscodeUtils.getUriFromPath(minecraftProject.getResourcePackPath()))) {
                    resourcePack = VscodeUtils.getUriFromPath(minecraftProject.getResourcePackPath());
                }
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la récupération du chemin du pack de ressources : ${error.message}`);
                }
            }

            if (behaviorPack === undefined && resourcePack === undefined) {
                throw new Error("Le projet ne contient ni pack de comportement ni pack de ressources à préparer.");
            }

            if (behaviorPack) {
                let isTypeScriptCompilationNeeded = false;
                try {
                    isTypeScriptCompilationNeeded = await this.isTypeScriptCompilationNeeded(minecraftProject);
                } catch (error) {
                    if (error instanceof Error) {
                        throw new Error(`Erreur lors de la vérification de la nécessité de compiler du TypeScript : ${error.message}`);
                    }

                    throw error;
                }

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

                try {
                    await this.createContentsJsonFile(behaviorPack);
                } catch (error) {
                    if (error instanceof Error) {
                        throw new Error(`Erreur lors de la création du fichier contents.json du pack de comportement : ${error.message}`);
                    }

                    throw error;
                }
            }

            if (resourcePack) {
                try {
                    await this.createTexturesListFile(minecraftProject);
                } catch (error) {
                    if (error instanceof Error) {
                        throw new Error(`Erreur lors de la création du fichier textures_list.json du pack de ressources : ${error.message}`);
                    }

                    throw error;
                }

                try {
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
}
