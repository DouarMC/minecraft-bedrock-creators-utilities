import * as vscode from "vscode";

/**
 * Classe utilitaire pour les opérations liées à VSCode, comme la gestion du contexte de l'extension, la manipulation de fichiers et de dossiers, etc.
 */
export class VscodeUtils {
    /**
     * Le contexte de l'extension, initialisé dans la fonction activate de l'extension. Permet d'accéder à des fonctionnalités de VSCode comme les commandes, les événements, etc.
     */
    private static context: vscode.ExtensionContext | undefined;

    /**
     * Initialise le contexte de l'extension. Doit être appelé dans la fonction activate de l'extension.
     * @param context 
     */
    public static initializeContext(context: vscode.ExtensionContext): void {
        this.context = context;
    }

    /**
     * Récupère le contexte de l'extension
     * @returns
     * @throws {Error} Si le contexte n'a pas été initialisé
     */
    public static getContext(): vscode.ExtensionContext {
        if (! this.context) {
            throw new Error("Le contexte de l'extension n'a pas été initialisé. Assurez-vous d'appeler VscodeUtils.initializeContext(context) dans la fonction activate de votre extension.");
        }
        return this.context;
    }

    /**
     * Vérifie si un URI est un dossier
     * @throws {Error} Lève une erreur si le dossier ne peut pas être vérifié.
     * @param uri L'URI à vérifier. Peut être une chaîne de caractères ou un vscode.Uri.
     * @returns 
     */
    public static async isDirectory(uri: vscode.Uri | string): Promise<boolean> {
        const uriObj = typeof uri === "string" ? vscode.Uri.file(uri) : uri;

        try {
            const stat = await vscode.workspace.fs.stat(uriObj);
            return stat.type === vscode.FileType.Directory;
        } catch(error: any) {
            if (error instanceof vscode.FileSystemError) {
                if (error.code === "FileNotFound") {
                    return false;
                }

                if (error.code === "NoPermissions") {
                    throw new Error(`Accès refusé au dossier : ${uriObj.fsPath}`, { cause: error });
                }

                throw new Error(`Erreur du système de fichiers (${error.code}) : ${uriObj.fsPath}`, { cause: error });
            }

            throw new Error(`Erreur lors de la vérification du dossier : ${uriObj.fsPath}`, { cause: error });
        }
    }

    /**
     * Vérifie si un dossier est vide
     * @throws {Error} Lève une erreur si le dossier ne peut pas être vérifié ou n'est pas un dossier.
     * @param folderUri 
     */
    public static async isDirectoryEmpty(folderUri: vscode.Uri): Promise<boolean> {
        if (! await this.isDirectory(folderUri)) {
            throw new Error(`L'URI spécifié n'est pas un dossier : ${folderUri.fsPath}`);
        }

        const entries = await vscode.workspace.fs.readDirectory(folderUri);
        return entries.length === 0;
    }

    /**
     * Vérifie si un URI est un fichier
     * @param uri L'URI à vérifier
     * @throws {Error} Lève une erreur si le fichier ne peut pas être vérifié.
     * @returns 
     */
    public static async isFile(uri: vscode.Uri): Promise<boolean> {
        try {
            const stat = await vscode.workspace.fs.stat(uri);
            return stat.type === vscode.FileType.File;
        } catch(error: any) {
            if (error instanceof vscode.FileSystemError) {
                if (error.code === "FileNotFound") {
                    return false;
                }

                if (error.code === "NoPermissions") {
                    throw new Error(`Accès refusé au fichier : ${uri.fsPath}`, { cause: error });
                }

                throw new Error(`Erreur du système de fichiers (${error.code}) : ${uri.fsPath}`, { cause: error });
            }

            throw new Error(`Erreur lors de la vérification du fichier : ${uri.fsPath}`, { cause: error });
        }
    }

    /**
     * Convertit un chemin de fichier en URI
     * @param path Le chemin de fichier à convertir
     * @returns 
     */
    public static getUriFromPath(path: string): vscode.Uri {
        return vscode.Uri.file(path);
    }

    /**
     * Vérifie si un chemin existe
     * @param uri L'URI à vérifier
     * @throws {Error} Lève une erreur si le chemin ne peut pas être vérifié.
     * @returns 
     */
    public static async pathExists(uri: vscode.Uri): Promise<boolean> {
        try {
            await vscode.workspace.fs.stat(uri);
            return true;
        } catch(error: any) {
            if (error instanceof vscode.FileSystemError) {
                if (error.code === "FileNotFound") {
                    return false;
                }

                if (error.code === "NoPermissions") {
                    throw new Error(`Accès refusé au chemin : ${uri.fsPath}`, { cause: error });
                }

                throw new Error(`Erreur du système de fichiers (${error.code}) : ${uri.fsPath}`, { cause: error });
            }

            throw new Error(`Erreur lors de la vérification du chemin : ${uri.fsPath}`, { cause: error });
        }
    }

    public static resolveRelativePath(baseUri: vscode.Uri, relativePath: string): vscode.Uri {
        return vscode.Uri.joinPath(baseUri, ...relativePath.split('/'));
    }

    /**
     * Écrit du contenu dans un fichier à un URI donné
     * @param uri L'URI du fichier
     * @param content Le contenu à écrire
     * @throws {Error} Lève une erreur si le chemin parent du fichier n'existe pas
     */
    public static async writeFile(uri: vscode.Uri, content: string): Promise<void> {
        const parentPath = vscode.Uri.joinPath(uri, '..');
        if (! await this.pathExists(parentPath)) {
            throw vscode.FileSystemError.FileNotFound(`Le dossier parent n'existe pas : ${parentPath.fsPath}`);
        }

        const contentEncoded = await vscode.workspace.encode(content, {
            encoding: "utf8"
        });

        await vscode.workspace.fs.writeFile(uri, contentEncoded);
    }
}