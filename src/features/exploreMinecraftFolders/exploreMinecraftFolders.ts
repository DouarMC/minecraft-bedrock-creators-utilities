import * as vscode from 'vscode';
import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { getStableGame, getPreviewGame } from '../../core/project/projectManager';

function getExplorerCommand(folderPath: string): string | undefined {
    switch (process.platform) {
        case "win32": return `explorer "${folderPath}"`;
        case "darwin": return `open "${folderPath}"`;
        case "linux": return `xdg-open "${folderPath}"`;
        default: return undefined;
    }
}

/**
 * Ouvre l'explorateur de fichiers Windows à un chemin spécifique
 */
async function openExplorer(folderPath: string): Promise<void> {
    // Récupère la commande adaptée à la plateforme courante (Windows, macOS, Linux)
    const command = getExplorerCommand(folderPath);
    // Si la plateforme n'est pas prise en charge, affiche un message d'erreur
    if (command === undefined) {
        vscode.window.showErrorMessage(`⚠️ Plateforme non prise en charge (${process.platform}).`);
        return;
    }

    // Promisifie exec pour pouvoir utiliser async/await
    const execPromise = promisify(exec);
    // Lancer la commande sans attendre les erreurs (explorer peut retourner des codes d'erreur même en cas de succès)
    await execPromise(command).catch(() => {
        // Ignorer les erreurs d'explorer, car il peut retourner des codes d'erreur même quand ça marche
    });
}

/**
 * Vérifie si un dossier existe avant de l'ouvrir
 */
async function openExplorerWithCheck(folder: vscode.Uri, description: string): Promise<void> {
    // Récupère le chemin du dossier
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

export async function openMinecraftFolder(game: "stable" | "preview", folderType: "comMojangFolder" | "dataFolder", description: string): Promise<void> {
    // Récupère l'instance du jeu Minecraft (stable ou preview)
    const gameInstance = game === "stable" ? getStableGame() : getPreviewGame();
    // Récupère le dossier demandé
    const folder = gameInstance?.[folderType];
    // Si le dossier n'est pas défini, affiche un message d'erreur
    if (!folder) {
        vscode.window.showWarningMessage(`⚠️ Le dossier ${description} de Minecraft ${game} n'est pas accessible.`);
        return;
    }

    // Ouvre l'explorateur de fichiers à l'emplacement du dossier
    await openExplorerWithCheck(folder, description);
}