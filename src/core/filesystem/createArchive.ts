import * as vscode from 'vscode';
import * as zipLib from 'zip-lib';

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

export async function createArchive(entries: ArchiveEntry[], desintation: vscode.Uri): Promise<void> {
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