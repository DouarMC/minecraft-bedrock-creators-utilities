import * as vscode from 'vscode';
import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

import { globals } from '../../globals';

/**
 * Ouvre l'explorateur de fichiers Windows à un chemin spécifique
 */
async function openExplorer(folderPath: string): Promise<void> {
    const execPromise = promisify(exec);
    
    // Commande pour ouvrir l'explorateur Windows
    const command = `explorer "${folderPath}"`;
    
    // Lancer la commande sans attendre les erreurs (explorer peut retourner des codes d'erreur même en cas de succès)
    await execPromise(command).catch(() => {
        // Ignorer les erreurs d'explorer, car il peut retourner des codes d'erreur même quand ça marche
    });
}

/**
 * Vérifie si un dossier existe avant de l'ouvrir
 */
async function openExplorerWithCheck(folder: vscode.Uri, description: string): Promise<void> {
    const folderPath = folder.fsPath;
    try {
        // Vérifier d'abord si le dossier existe avec Node.js fs
        await fs.promises.access(folderPath, fs.constants.F_OK);
        
        // Le dossier existe, on peut l'ouvrir
        await openExplorer(folderPath);
        vscode.window.showInformationMessage(`📂 Ouverture du dossier ${description}`);
        
    } catch (error) {
        // Le dossier n'existe pas
        console.error(`Erreur lors de l'accès au dossier ${description}:`, error);
        vscode.window.showWarningMessage(
            `⚠️ Dossier ${description} introuvable à l'emplacement :\n${folderPath}\n\nVérifiez que Minecraft est installé.`
        );
    }
}

/**
 * Ouvre le dossier des packs Minecraft Stable (com.mojang)
 */
export async function openMinecraftStablePacksFolder(): Promise<void> {
    const comMojangFolder = globals.minecraftStableGame?.comMojangFolder;
    if (comMojangFolder === undefined) {
        vscode.window.showWarningMessage("⚠️ Le dossier com.mojang de Minecraft Stable n'est pas accessible.");
        return;
    } else {
        await openExplorerWithCheck(comMojangFolder, "des packs Minecraft Stable");
        return;
    }
}

/**
 * Ouvre le dossier des packs Minecraft Preview (com.mojang)
 */
export async function openMinecraftPreviewPacksFolder(): Promise<void> {
    const comMojangFolder = globals.minecraftPreviewGame?.comMojangFolder;
    if (comMojangFolder === undefined) {
        vscode.window.showWarningMessage("⚠️ Le dossier com.mojang de Minecraft Preview n'est pas accessible.");
        return;
    } else {
        await openExplorerWithCheck(comMojangFolder, "des packs Minecraft Preview");
        return;
    }
}

/**
 * Trouve et ouvre le dossier des ressources vanilla Minecraft Stable
 */
export async function openMinecraftStableVanillaFolder(): Promise<void> {
    const dataFolder = globals.minecraftStableGame?.dataFolder;
    if (dataFolder === undefined) {
        vscode.window.showWarningMessage("⚠️ Le dossier data de Minecraft Stable n'est pas accessible.");
        return;
    } else {
        await openExplorerWithCheck(dataFolder, "des ressources vanilla Minecraft Stable");
        return;
    }
}

/**
 * Trouve et ouvre le dossier des ressources vanilla Minecraft Preview
 */
export async function openMinecraftPreviewVanillaFolder(): Promise<void> {
    const dataFolder = globals.minecraftPreviewGame?.dataFolder;
    if (dataFolder === undefined) {
        vscode.window.showWarningMessage("⚠️ Le dossier data de Minecraft Preview n'est pas accessible.");
        return;
    } else {
        await openExplorerWithCheck(dataFolder, "des ressources vanilla Minecraft Preview");
        return;
    }
}
