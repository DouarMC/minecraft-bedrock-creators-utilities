import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

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
async function openExplorerWithCheck(folderPath: string, description: string): Promise<void> {
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
    const localAppData = process.env.LOCALAPPDATA;
    if (!localAppData) {
        vscode.window.showErrorMessage("❌ Impossible de déterminer le dossier LocalAppData.");
        return;
    }
    
    const folderPath = path.join(
        localAppData,
        "Packages",
        "Microsoft.MinecraftUWP_8wekyb3d8bbwe",
        "LocalState",
        "games",
        "com.mojang"
    );
    
    await openExplorerWithCheck(folderPath, "des packs Minecraft Stable");
}

/**
 * Ouvre le dossier des packs Minecraft Preview (com.mojang)
 */
export async function openMinecraftPreviewPacksFolder(): Promise<void> {
    const localAppData = process.env.LOCALAPPDATA;
    if (!localAppData) {
        vscode.window.showErrorMessage("❌ Impossible de déterminer le dossier LocalAppData.");
        return;
    }
    
    const folderPath = path.join(
        localAppData,
        "Packages",
        "Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe",
        "LocalState",
        "games",
        "com.mojang"
    );
    
    await openExplorerWithCheck(folderPath, "des packs Minecraft Preview");
}

/**
 * Trouve et ouvre le dossier des ressources vanilla Minecraft Stable
 */
export async function openMinecraftStableVanillaFolder(): Promise<void> {
    const programFiles = process.env.PROGRAMFILES;
    if (!programFiles) {
        vscode.window.showErrorMessage("❌ Impossible de déterminer le dossier Program Files.");
        return;
    }
    
    try {
        const windowsAppsPath = path.join(programFiles, "WindowsApps");
        const baseUri = vscode.Uri.file(windowsAppsPath);
        
        // Cherche le dossier Minecraft UWP (la version peut varier)
        const entries = await vscode.workspace.fs.readDirectory(baseUri);
        const minecraftFolder = entries.find(([name, type]) => 
            type === vscode.FileType.Directory && 
            name.startsWith("Microsoft.MinecraftUWP_") && 
            name.includes("_x64__8wekyb3d8bbwe")
        );
        
        if (!minecraftFolder) {
            vscode.window.showWarningMessage("⚠️ Dossier Minecraft Stable introuvable dans Program Files\\WindowsApps");
            return;
        }
        
        const folderPath = path.join(windowsAppsPath, minecraftFolder[0], "data");
        await openExplorerWithCheck(folderPath, "des ressources vanilla Minecraft Stable");
        
    } catch (error) {
        vscode.window.showErrorMessage(
            "❌ Accès refusé au dossier WindowsApps. " +
            "Vous devez exécuter VS Code en tant qu'administrateur pour accéder aux ressources vanilla."
        );
    }
}

/**
 * Trouve et ouvre le dossier des ressources vanilla Minecraft Preview
 */
export async function openMinecraftPreviewVanillaFolder(): Promise<void> {
    const programFiles = process.env.PROGRAMFILES;
    if (!programFiles) {
        vscode.window.showErrorMessage("❌ Impossible de déterminer le dossier Program Files.");
        return;
    }
    
    try {
        const windowsAppsPath = path.join(programFiles, "WindowsApps");
        const baseUri = vscode.Uri.file(windowsAppsPath);
        
        // Cherche le dossier Minecraft Preview (la version peut varier)
        const entries = await vscode.workspace.fs.readDirectory(baseUri);
        const minecraftFolder = entries.find(([name, type]) => 
            type === vscode.FileType.Directory && 
            name.startsWith("Microsoft.MinecraftWindowsBeta_") && 
            name.includes("_x64__8wekyb3d8bbwe")
        );
        
        if (!minecraftFolder) {
            vscode.window.showWarningMessage("⚠️ Dossier Minecraft Preview introuvable dans Program Files\\WindowsApps");
            return;
        }
        
        const folderPath = path.join(windowsAppsPath, minecraftFolder[0], "data");
        await openExplorerWithCheck(folderPath, "des ressources vanilla Minecraft Preview");
        
    } catch (error) {
        vscode.window.showErrorMessage(
            "❌ Accès refusé au dossier WindowsApps. " +
            "Vous devez exécuter VS Code en tant qu'administrateur pour accéder aux ressources vanilla."
        );
    }
}
