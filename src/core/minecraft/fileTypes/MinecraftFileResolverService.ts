import * as vscode from 'vscode';
import { MinecraftFileType } from './MinecraftFileType';
import { VscodeUtils } from '../../utils/VscodeUtils';
import { minecraftFileRegistry } from './minecraftFileRegistry';
import { MinecraftFileId } from './MinecraftFileId';
import { minimatch } from 'minimatch';

export class MinecraftFileResolverService {
    public getAllFileTypes(): MinecraftFileType[] {
        return Object.values(minecraftFileRegistry);
    }

    /**
     * Détermine le type de fichier en fonction de son URI et des patterns définis.
     * @param fileUri L'URI du fichier à analyser.
     */
    public resolveFileType(fileUri: vscode.Uri): MinecraftFileType | undefined {
        if (! VscodeUtils.isFile(fileUri)) {
            console.log("L'URI fourni ne correspond pas à un fichier.");
            return undefined;
        }

        // Récupérer le dossier de travail (Workspace Folder)
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(fileUri);
        if (! workspaceFolder) {
            console.log("Le fichier n'appartient à aucun dossier de travail.");
            return undefined;
        }

        // Obtenir le chemin relatif (Crucial pour les patterns comme "**/entities/*.json") asRelativePath renvoie le chemin sans la racine (ex: "behavior_pack/entities/mob.json")
        const relativePath = vscode.workspace.asRelativePath(fileUri, false);

        // Parcourir tous les types de fichiers enregistrés
        for (const fileType of this.getAllFileTypes()) {
            // Vérifier chaque pattern associé au type de fichier
            for (const pattern of fileType.patterns) {
                // Utilisation de minimatch pour tester la correspondance (très rapide)
                if (minimatch(relativePath, pattern, {dot: true, nocase: true})) {

                    // Vérifier les exclusions si elles existent
                    if (fileType.excludePatterns) {
                        const isExcluded = fileType.excludePatterns.some(excludePattern =>
                            minimatch(relativePath, excludePattern, {dot: true, nocase: true})   
                        );
                        if (isExcluded) continue; // Passe au type suivant si exclu
                    }

                    return fileType; // Type de fichier trouvé
                }
            }
        }

        console.log("Aucun type de fichier Minecraft correspondant trouvé pour le fichier :", relativePath);
        return undefined; // Aucun type de fichier correspondant trouvé
    }
}