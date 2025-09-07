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
    const command = getExplorerCommand(folderPath);
    if (!command) {
        vscode.window.showErrorMessage(`⚠️ Plateforme non prise en charge (${process.platform}).`);
        return;
    }

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
    const gameInstance = game === "stable" ? getStableGame() : getPreviewGame();
    const folder = gameInstance?.[folderType];
    if (!folder) {
        vscode.window.showWarningMessage(`⚠️ Le dossier ${description} de Minecraft ${game} n'est pas accessible.`);
        return;
    }
    await openExplorerWithCheck(folder, description);
}