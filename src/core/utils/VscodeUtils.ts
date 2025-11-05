import * as vscode from "vscode";

export class VscodeUtils {
    private static context: vscode.ExtensionContext | undefined;

    public static initializeContext(context: vscode.ExtensionContext): void {
        this.context = context;
    }

    public static getContext(): vscode.ExtensionContext {
        if (! this.context) {
            throw new Error("ExtensionContext not initialized. Did you call VscodeUtils.initialize() in activate()?");
        }
        return this.context;
    }

    /**
     * Vérifie si un URI est un dossier
     * @throws {Error} Lève une erreur si le dossier ne peut pas être vérifié.
     * @param uri L'URI à vérifier
     * @returns 
     */
    public static async isDirectory(uri: vscode.Uri): Promise<boolean> {
        try {
            const stat = await vscode.workspace.fs.stat(uri);
            return stat.type === vscode.FileType.Directory;
        } catch(error: any) {
            if (error instanceof vscode.FileSystemError) {
                if (error.code === "FileNotFound") {
                    return false;
                }

                if (error.code === "NoPermissions") {
                    throw new Error(`Accès refusé au dossier : ${uri.fsPath}`, { cause: error });
                }

                throw new Error(`Erreur du système de fichiers (${error.code}) : ${uri.fsPath}`, { cause: error });
            }

            throw new Error(`Erreur lors de la vérification du dossier : ${uri.fsPath}`, { cause: error });
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

    public static async collectFiles(options: {
        folderUri: vscode.Uri;
        recursive?: boolean;
        fileNames?: string[];
        fileExtensions?: string[];
        excludeFileNames?: string[];
    }): Promise<vscode.Uri[]> {
        const {
            folderUri,
            recursive = false,
            fileNames = [],
            fileExtensions = [],
            excludeFileNames = []
        } = options;

        let entries: [string, vscode.FileType][];
        try {
            entries = await vscode.workspace.fs.readDirectory(folderUri);
        } catch (error) {
            throw new Error(`Impossible d'accéder au dossier : ${folderUri.fsPath}`, { cause: error });
        }

        const collectedFiles: vscode.Uri[] = [];

        for (const [name, type] of entries) {
            if (type === vscode.FileType.File) {
                const dotIndex = name.lastIndexOf(".");
                const baseName = dotIndex > -1 ? name.substring(0, dotIndex) : name;
                const extension = dotIndex > -1 ? name.substring(dotIndex) : "";

                const isIncluded =
                    (fileNames.length === 0 || fileNames.includes(baseName)) &&
                    (fileExtensions.length === 0 || fileExtensions.includes(extension)) &&
                    (excludeFileNames.length === 0 || !excludeFileNames.includes(baseName));
                
                if (isIncluded === true) {
                    collectedFiles.push(vscode.Uri.joinPath(folderUri, name));
                }
            } else if (recursive === true && type === vscode.FileType.Directory) {
                const subFolderUri = vscode.Uri.joinPath(folderUri, name);
                const subFiles = await this.collectFiles({
                    folderUri: subFolderUri,
                    recursive,
                    fileNames,
                    fileExtensions,
                    excludeFileNames
                });
                collectedFiles.push(...subFiles);
            }
        }

        return collectedFiles;
    }

    /**
     * Écrit du contenu dans un fichier à un URI donné
     * @param uri L'URI du fichier
     * @param content Le contenu à écrire
     * @throws {Error} Lève une erreur si le chemin parent du fichier n'existe pas
     */
    public static async writeFile(uri: vscode.Uri, content: string): Promise<void> {
        const parentPath = uri.with({ path: uri.path.substring(0, uri.path.lastIndexOf("/")) });
        if (! await this.pathExists(parentPath)) {
            throw new vscode.FileSystemError(`Le dossier parent n'existe pas : ${parentPath.fsPath}`);
        }

        const contentEncoded = await vscode.workspace.encode(content, {
            encoding: "utf8"
        });

        await vscode.workspace.fs.writeFile(uri, contentEncoded);
    }
}