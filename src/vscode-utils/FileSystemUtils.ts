import { promisify } from "util";
import { exec } from "child_process";
import * as vscode from "vscode";
import * as fs from "fs";
import * as zipLib from "zip-lib";

interface ArchiveEntry {
    /**
     * Le dossier ou fichier sur le disque
     */
    source: vscode.Uri;

    /**
     * comment il apparaît dans le zip ("" = contenu du dossier à la racine)
     */
    metadataPath?: string;
}

export class FileSystemUtils {
    public static getExplorerCommand(folderPath: string): string | undefined {
        switch (process.platform) {
            case "win32": return `explorer "${folderPath}"`;
            case "darwin": return `open "${folderPath}"`;
            case "linux": return `xdg-open "${folderPath}"`;
            default: return undefined;
        }
    }

    /**
     * Ouvre l'explorateur de fichiers à un chemin spécifique
     * @param folderPath 
     * @throws {Error} Lève une erreur si la plateforme n'est pas prise en charge.
     */
    public static async openExplorer(folderPath: string): Promise<void> {
        const command = this.getExplorerCommand(folderPath);

        if (command === undefined) {
            throw new Error(`Plateforme non prise en charge (${process.platform}).`);
        }

        const execPromise = promisify(exec);

        await execPromise(command).catch(() => {
            // Ignorer les erreurs d'explorer, car il peut retourner des codes d'erreur même quand ça marche
        });
    }

    /**
     * Ouvre l'explorateur de fichiers à un dossier spécifique après vérification de son existence
     * @param folder L'URI du dossier à ouvrir
     * @throws {Error} Lève une erreur si le dossier n'existe pas ou ne peut pas être accédé.
     */
    public static async openExplorerWithCheck(folder: vscode.Uri): Promise<void> {
        const folderPath = folder.fsPath;

        try {
            await fs.promises.access(folderPath, fs.constants.F_OK);
            await this.openExplorer(folderPath);
        } catch (error) {
            throw new Error(`Erreur lors de l'accès au dossier ${folderPath}:`, { cause: error });
        }
    }

    /**
     * Vérifie que la plateforme courante est Windows.
     * @throws {Error} Lève une erreur si la plateforme n'est pas Windows.
     */
    public static ensureWindowsPlatform(): void {
        if (process.platform !== "win32") {
            throw new Error("Cette fonctionnalité n'est accessible que sur Windows.");
        }
    }

    public static async createArchive(entries: ArchiveEntry[], desintation: vscode.Uri): Promise<void> {
        const zip = new zipLib.Zip();

        for (const entry of entries) {
            const fsPath = entry.source.fsPath;
            const targetPath = entry.metadataPath;

            if (targetPath === "") {
                // contenu du dossier à la racine
                zip.addFolder(fsPath, "");
            } else if (targetPath) {
                // dossier sous un chemin virtuel
                zip.addFolder(fsPath, targetPath);
            } else {
                // dossier lui-même (comportement zip-lib par défaut)
                zip.addFolder(fsPath);
            }
        }

        await zip.archive(desintation.fsPath);
    }
}