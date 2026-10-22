import * as vscode from "vscode";
import { Feature } from "../Feature";
import { BrArchiveUtils } from "../../core/minecraft/BrArchiveUtils";

export class BrArchiveExtractorFeature extends Feature {
    private static readonly EXTRACT_BRARCHIVE_COMMAND_ID = "minecraft-bedrock-creators-utilities.extractBrArchive";

    public register(): void {
        const disposable = vscode.commands.registerCommand(BrArchiveExtractorFeature.EXTRACT_BRARCHIVE_COMMAND_ID, async () => {
            // 1. Sélection du fichier .brarchive
            const brArchiveFileUri = await vscode.window.showOpenDialog({
                canSelectFolders: false,
                canSelectFiles: true,
                filters: {
                    "Fichiers Bedrock Archive": ["brarchive"]
                },
                openLabel: "Choisir le fichier .brarchive à décompresser",
                canSelectMany: false,
                title: "Sélectionner un fichier .brarchive à extraire"
            });

            if (brArchiveFileUri === undefined || brArchiveFileUri.length === 0) {
                vscode.window.showWarningMessage("Aucun fichier .brarchive sélectionné. L'extraction a été annulée.");
                return;
            }

            // 2. Sélection du dossier de destination
            const outputFolderUri = await vscode.window.showOpenDialog({
                canSelectFolders: true,
                canSelectFiles: false,
                openLabel: "Extraire ici",
                canSelectMany: false,
                title: "Sélectionner le dossier de destination pour l'extraction"
            });

            if (outputFolderUri === undefined || outputFolderUri.length === 0) {
                vscode.window.showWarningMessage("Aucun dossier de destination sélectionné. L'extraction a été annulée.");
                return;
            }

            const archiveUri = brArchiveFileUri[0];
            const targetFolderUri = outputFolderUri[0];

            try {
                // Lecture de l'index via BrArchiveUtils et filtrage des fichiers fantômes de taille 0 (ex: .png externes)
                const allEntries = await BrArchiveUtils.readIndex(archiveUri.fsPath);
                const extractableEntries = allEntries.filter(entry => entry.length > 0);

                if (extractableEntries.length === 0) {
                    vscode.window.showInformationMessage("Aucun fichier extractible trouvé dans cette archive .brarchive.");
                    return;
                }

                await vscode.window.withProgress(
                    {
                        location: vscode.ProgressLocation.Notification,
                        title: "Extraction du fichier .brarchive...",
                        cancellable: false
                    },
                    async (progress) => {
                        const total = extractableEntries.length;
                        const textEncoder = new TextEncoder();

                        for (let i = 0; i < total; i++) {
                            const entry = extractableEntries[i];
                            const destinationFileUri = vscode.Uri.joinPath(targetFolderUri, entry.name);

                            const rawBuffer = await BrArchiveUtils.readEntryBuffer(
                                archiveUri.fsPath,
                                entry.absoluteOffset,
                                entry.length
                            );

                            let bytesToWrite: Uint8Array = rawBuffer;

                            // Beautify automatique pour les vrais fichiers .json texte (ignore les binaires MCB)
                            if (entry.name.endsWith(".json") && !BrArchiveUtils.isMcbBuffer(rawBuffer)) {
                                try {
                                    const parsed = JSON.parse(rawBuffer.toString("utf8"));
                                    bytesToWrite = textEncoder.encode(JSON.stringify(parsed, null, 2));
                                } catch {
                                    bytesToWrite = rawBuffer;
                                }
                            }

                            await vscode.workspace.fs.writeFile(destinationFileUri, bytesToWrite);

                            if (i % 20 === 0 || i === total - 1) {
                                progress.report({
                                    increment: (20 / total) * 100,
                                    message: `${i + 1}/${total} fichiers (${entry.name})`
                                });
                            }
                        }
                    }
                );

                const action = await vscode.window.showInformationMessage(
                    `Extraction terminée : ${extractableEntries.length} fichiers extraits !`,
                    "Ouvrir dans l'explorateur système"
                );

                if (action === "Ouvrir dans l'explorateur système") {
                    await vscode.commands.executeCommand("revealFileInOS", targetFolderUri);
                }

            } catch (error) {
                vscode.window.showErrorMessage("Erreur lors de l'extraction du .brarchive : " + error);
            }
        });

        this.extensionContext.subscriptions.push(disposable);
    }
}