import * as vscode from 'vscode';
import { MinecraftFileType } from './MinecraftFileType';
import { VscodeUtils } from '../../utils/VscodeUtils';
import { minecraftFileRegistry } from './minecraftFileRegistry';
import { MinecraftFileId } from './MinecraftFileId';
import { minimatch } from 'minimatch';
import { MinecraftPack } from '../MinecraftPack';
import * as JsonParser from "jsonc-parser";

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
                    const pack = new MinecraftPack(currentFolder, manifestJson, packType);
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
            console.log("L'URI fourni ne correspond pas à un fichier.");
            return undefined;
        }

        // Identifier le Pack (BP, RP, Skin ?)
        const pack = await this.resolvePack(fileUri);
        if (! pack) {
            console.log("Ce fichier ne fait partie d'aucun pack Minecraft connu (pas de manifest).");
            return undefined;
        }

        console.log(`Fichier détecté dans un ${pack.packType} !`);

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
    }
}