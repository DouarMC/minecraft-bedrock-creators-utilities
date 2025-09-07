import * as vscode from "vscode";

/**
 * Vérifie si un répertoire existe à l'URI spécifié.
 * @param uri L'URI du répertoire à vérifier.
 * @returns 
 */
export async function directoryExists(uri: vscode.Uri): Promise<boolean> {
    try {
        const stat = await vscode.workspace.fs.stat(uri);
        // Vérifie que c'est bien un dossier
        return stat.type === vscode.FileType.Directory;
    } catch (error) {
        // Si l'appel échoue (le dossier n'existe pas)
        return false;
    }
}

export async function isFolderEmpty(folderUri: vscode.Uri): Promise<boolean> {
    const entries = await vscode.workspace.fs.readDirectory(folderUri);
    return entries.length === 0;
}