import * as vscode from 'vscode';
import { MinecraftFileType } from '../../core/minecraft/fileTypes/MinecraftFileType';
import { VscodeUtils } from '../../vscode-utils/VscodeUtils';
import { minecraftFileRegistry } from '../../core/minecraft/fileTypes/minecraftFileRegistry';
import { minimatch } from 'minimatch';
import { MinecraftPack } from '../../core/minecraft/models/MinecraftPack';
import * as JsonParser from "jsonc-parser";
import { MinecraftFileId } from '../../core/minecraft/fileTypes/MinecraftFileId';
import { MinecraftGame } from '../../core/minecraft/models/games/MinecraftGame';
import { AddonMinecraftProject } from '../../core/minecraft/models/projects/AddonMinecraftProject';
import { MinecraftProject } from '../../core/minecraft/models/projects/MinecraftProject';
import { MinecraftGameManager } from './MinecraftGameManager';

export class MinecraftFileResolverService {
    // Petit cache pour ne pas relire le fichier manifest 100 fois par seconde
    private static packCache: Map<string, MinecraftPack> = new Map();

    public static getAllFileTypes(): MinecraftFileType[] {
        return Object.values(minecraftFileRegistry);
    }

    /**
     * Trouve le pack Minecraft associé à un fichier donné en remontant l'arborescence des dossiers.
     * @param fileUri 
     * @returns 
     */
    private static async resolvePack(fileUri: vscode.Uri): Promise<MinecraftPack | undefined> {
        // On commence par le dossier parent du fichier
        let currentFolder = vscode.Uri.joinPath(fileUri, '..');

        // Protection : On s'arrête si on arrive à la racine du système ou du workspace
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(fileUri);
        const rootPath = workspaceFolder ? workspaceFolder.uri.fsPath : undefined;

        // Boucle : "Tant qu'on n'est pas tout en haut..."
        while (true) {
            // On construit le chemin vers un potentiel "manifest.json" ici
            const manifestUri = vscode.Uri.joinPath(currentFolder, "manifest.json");
            const cacheKey = manifestUri.toString();

            // Si on l'a déjà analysé, on retourne le résultat du cache
            if (MinecraftFileResolverService.packCache.has(cacheKey)) {
                return MinecraftFileResolverService.packCache.get(cacheKey);
            }

            try {
                // On essaie de lire le fichier (ça throw une erreur s'il n'existe pas)
                const contentUint8 = await vscode.workspace.fs.readFile(manifestUri);
                const contentString = new TextDecoder().decode(contentUint8);
                const manifestJson = JsonParser.parse(contentString);

                // On utilise ta classe pour identifier le type !
                const packType = MinecraftPack.determinePackType(manifestJson);
                if (packType) {
                    // On a trouvé un manifest valide.
                    const pack = new MinecraftPack(currentFolder.fsPath, manifestJson, packType);
                    MinecraftFileResolverService.packCache.set(cacheKey, pack);
                    return pack;
                }
            } catch (error) {
                // Pas de manifest ici, ou fichier invalide. On ignore et on continue.
            }

            // Condition de sortie : Si on est arrivé à la racine du workspace, on arrête
            if (rootPath && currentFolder.fsPath === rootPath) {
                break;
            }

            // Sécurité système (ne pas remonter plus haut que la racine du disque)
            const parent = vscode.Uri.joinPath(currentFolder, '..');
            if (parent.fsPath === currentFolder.fsPath) {
                break;
            }
            // Remonter d'un niveau dans l'arborescence
            currentFolder = parent;
        }

        return undefined;
    }

    /**
     * Détermine le type de fichier en fonction de son URI et des patterns définis.
     * @param fileUri L'URI du fichier à analyser.
     */
    public static async resolveFileType(fileUri: vscode.Uri): Promise<MinecraftFileType | undefined> {
        if (! VscodeUtils.isFile(fileUri)) {
            console.log("L'URI fourni ne correspond pas à un fichier.", fileUri.fsPath);
            return undefined;
        }

        // Identifier le Pack (BP, RP, Skin ?)
        const pack = await this.resolvePack(fileUri);
        if (! pack) {
            console.log("Ce fichier ne fait partie d'aucun pack Minecraft connu (pas de manifest).");
            return undefined;
        }

        const candidateTypes = this.getAllFileTypes().filter(
            type => type.packType === pack.packType
        );

        const relativePath = vscode.workspace.asRelativePath(fileUri, false);

        for (const fileType of candidateTypes) {
            for (const pattern of fileType.patterns) {
                if (minimatch(relativePath, pattern, {dot: true, nocase: true})) {
                    if (fileType.excludePatterns) {
                        const isExcluded = fileType.excludePatterns.some(excludePattern =>
                            minimatch(relativePath, excludePattern, {dot: true, nocase: true})   
                        );
                        if (isExcluded) continue;
                    }

                    return fileType;
                }
            }
        }

        console.log("Aucun type de fichier Minecraft ne correspond à ce fichier :", relativePath);
        return undefined;
    }

    /**
     * Récupère tous les fichiers data-driven d'un type donné associés à un projet ou au jeu lui-même.
     * @param minecraftFileId 
     * @param target
     */
    public static async getDataDrivenFiles(minecraftFileId: MinecraftFileId, target: MinecraftGame | MinecraftProject) : Promise<vscode.Uri[]> {
        const dataDrivenFiles: vscode.Uri[] = []; // Les fichiers data-driven trouvés à retourner

        // Identifier le type de fichier data-driven pour savoir où chercher
        const dataDrivenFileType = minecraftFileRegistry[minecraftFileId];
        if (! dataDrivenFileType) {
            return dataDrivenFiles;
        }

        let researchFolders: vscode.Uri[] = []; // Les dossiers racines à partir desquels on va lancer la recherche
        switch (dataDrivenFileType.packType) {
            case "behavior_pack":
                if (target instanceof MinecraftGame) { // Si la cible est le jeu lui-même, on cherche dans les dossiers vanilla
                    researchFolders = await MinecraftGameManager.getVanillaBehaviorPackFolders(target);
                    if (dataDrivenFileType.searchInDefinitionsFolder === true) {
                        researchFolders.push(await MinecraftGameManager.getDefinitionsFolder(target));
                    }
                } else {
                    if (target instanceof AddonMinecraftProject === false) {
                        console.warn("Le projet fourni n'est pas un AddonMinecraftProject. Impossible de récupérer les fichiers data-driven.");
                        return dataDrivenFiles;
                    }

                    const bpPath = target.getBehaviorPackPath();
                    const bpUri = VscodeUtils.getUriFromPath(bpPath);
                    try {
                        if (await VscodeUtils.isDirectory(bpUri)) {
                            researchFolders = [bpUri];
                        }
                    } catch (error) {
                        if (error instanceof Error) {
                            throw new Error(`Erreur lors de l'accès au dossier de Behavior Pack du projet : ${error.message}`);
                        }

                        throw error;
                    }
                }
                break;
            case "resource_pack":
                if (target instanceof MinecraftGame) {
                    researchFolders = await MinecraftGameManager.getVanillaResourcePackFolders(target);
                    if (dataDrivenFileType.searchInDefinitionsFolder === true) {
                        researchFolders.push(await MinecraftGameManager.getDefinitionsFolder(target));
                    }
                } else {
                    if (target instanceof AddonMinecraftProject === false) {
                        console.warn("Le projet fourni n'est pas un AddonMinecraftProject. Impossible de récupérer les fichiers data-driven.");
                        return dataDrivenFiles;
                    }

                    const rpPath = target.getResourcePackPath();
                    const rpUri = VscodeUtils.getUriFromPath(rpPath);
                    try {
                        if (await VscodeUtils.isDirectory(rpUri)) {
                            researchFolders = [rpUri];
                        }
                    } catch (error) {
                        if (error instanceof Error) {
                            throw new Error(`Erreur lors de l'accès au dossier de Resource Pack du projet : ${error.message}`);
                        }
                    }
                }
                break;
            case "skin_pack":
                /* TODO
                if (target instanceof SkinPackMinecraftProject) {
                }
                */
                break;
            case "world_template":
                /* TODO
                if (target instanceof WorldTemplateMinecraftProject) {
                }
                */
                break;
        }

        // 2. Lancer la recherche pour chaque dossier racine trouvé
        // On utilise Promise.all pour paralléliser la recherche (performance)
        const searchPromises = researchFolders.map(async (folder) => {
            const folderSpecificFiles: vscode.Uri[] = [];

            // On vérifie si ce dossier est indexé par le workspace VS Code
            const workspaceFolder = vscode.workspace.getWorkspaceFolder(folder);
            const isIndexed = !!workspaceFolder;

            for (const pattern of dataDrivenFileType.patterns) {
                if (isIndexed) {
                    // CAS 1 : PROJET UTILISATEUR (Rapide & Indexé)
                    // On utilise l'API puissante de VS Code.
                    // RelativePattern gère tout seul le fait de chercher DANS folderUri.
                    const relativePattern = new vscode.RelativePattern(folder, pattern);

                    // On peut passer les exclusions directement à findFiles pour optimiser
                    const exclude = dataDrivenFileType.excludePatterns ? `{${dataDrivenFileType.excludePatterns.join(',')}}` : null;

                    const foundFiles = await vscode.workspace.findFiles(relativePattern, exclude);
                    folderSpecificFiles.push(...foundFiles);
                } else {
                    // CAS 2 : VANILLA / EXTERNE (Non indexé)
                    // findFiles ne marche pas ici. On utilise un scanneur manuel.
                    const found = await this.findFilesManual(folder, pattern, dataDrivenFileType.excludePatterns);
                    folderSpecificFiles.push(...found);
                }
            }

            return folderSpecificFiles;
        });

        // 3. Attendre toutes les recherches et aplatir le tableau
        const results = await Promise.all(searchPromises);
        for (const fileList of results) {
            dataDrivenFiles.push(...fileList);
        }

        return dataDrivenFiles;
    }

    /**
     * Scanne récursivement un dossier externe (Vanilla) pour trouver les fichiers correspondants.
     * Utilise l'API FS de VS Code, donc compatible Web/Remote.
     * @param root 
     * @param pattern 
     * @param excludes 
     */
    private static async findFilesManual(root: vscode.Uri, pattern: string, excludes?: string[]): Promise<vscode.Uri[]> {
        const results: vscode.Uri[] = [];

        // Fonction récursive locale
        const walk = async (currentUri: vscode.Uri) => {
            try {
                const entries = await vscode.workspace.fs.readDirectory(currentUri);

                for (const [name, type] of entries) {
                    const fileUri = vscode.Uri.joinPath(currentUri, name);

                    // Calculer le chemin relatif pour le matching (ex: "entities/cow.json")
                    // On retire le prefixe racine
                    const relativePath = fileUri.fsPath.replace(root.fsPath, '').replace(/^[\\\/]/, '').replace(/\\/g, '/');

                    if (type === vscode.FileType.Directory) {
                        // Optimisation : Ne pas descendre si le dossier est exclu
                        if (excludes && excludes.some(ex => minimatch(relativePath + '/', ex))) {
                            continue;
                        }
                        // Récursion
                        await walk(fileUri);
                    } else if (type === vscode.FileType.File) {
                        // Vérification du pattern
                        if (minimatch(relativePath, pattern, { dot: true, nocase: true })) {
                            // Vérification de l'exclusion
                            if (!excludes || !excludes.some(ex => minimatch(relativePath, ex))) {
                                results.push(fileUri);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error(`Erreur lors de la lecture du répertoire ${currentUri.fsPath}:`, error);
            }
        };

        await walk(root);
        return results;
    }
}