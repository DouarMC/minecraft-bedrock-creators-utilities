import * as vscode from "vscode";
import { Feature } from "../Feature";

interface BrArchiveEntry {
    name: string;
    data: Uint8Array;
}

export class BrArchiveExtractorFeature extends Feature {
    private static readonly EXTRACT_BRARCHIVE_COMMAND_ID = "minecraft-bedrock-creators-utilities.extractBrArchive";
    private static readonly MAGIC_BYTES = Buffer.from("7d2725b1a0527026", "hex");
    private static readonly HEADER_SIZE = 16;
    private static readonly ENTRY_SIZE = 256;

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
                const fileData = await vscode.workspace.fs.readFile(archiveUri);
                const buffer = Buffer.from(fileData.buffer, fileData.byteOffset, fileData.byteLength);

                // Décodage binaire natif sans aucune librairie externe
                const entries = this.parseBrArchive(buffer);

                if (entries.length === 0) {
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
                        const total = entries.length;
                        const textDecoder = new TextDecoder("utf-8");
                        const textEncoder = new TextEncoder();

                        for (let i = 0; i < total; i++) {
                            const entry = entries[i];
                            const destinationFileUri = vscode.Uri.joinPath(targetFolderUri, entry.name);

                            let bytesToWrite: Uint8Array = entry.data;

                            // Beautify automatique pour les fichiers .json minifiés
                            if (entry.name.endsWith(".json")) {
                                try {
                                    const rawJson = textDecoder.decode(entry.data);
                                    const parsed = JSON.parse(rawJson);
                                    bytesToWrite = textEncoder.encode(JSON.stringify(parsed, null, 2));
                                } catch {
                                    bytesToWrite = entry.data;
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
                    `Extraction terminée : ${entries.length} fichiers extraits !`,
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

    /**
     * Décode le format binaire .brarchive (Little-Endian)
     */
    private parseBrArchive(buffer: Buffer): BrArchiveEntry[] {
        if (buffer.length < BrArchiveExtractorFeature.HEADER_SIZE) {
            throw new Error("Le fichier est trop court pour être un .brarchive valide.");
        }

        // 1. Vérification de la signature (8 premiers octets : 7d 27 25 b1 a0 52 70 26)
        const magic = buffer.subarray(0, 8);
        if (!magic.equals(BrArchiveExtractorFeature.MAGIC_BYTES)) {
            throw new Error(`Signature .brarchive invalide (${magic.toString("hex")}).`);
        }

        // 2. Lecture du nombre d'entrées et de la version
        const numEntries = buffer.readUInt32LE(8);
        const version = buffer.readUInt32LE(12);

        if (version !== 1) {
            console.warn(`Version .brarchive non standard détectée : ${version}`);
        }

        const dataBlockStart = BrArchiveExtractorFeature.HEADER_SIZE + (numEntries * BrArchiveExtractorFeature.ENTRY_SIZE);
        if (buffer.length < dataBlockStart) {
            throw new Error("Archive corrompue : la table d'index dépasse la taille du fichier.");
        }

        const entries: BrArchiveEntry[] = [];

        // 3. Lecture de chaque entrée (256 octets par entrée)
        for (let i = 0; i < numEntries; i++) {
            const entryOffset = BrArchiveExtractorFeature.HEADER_SIZE + (i * BrArchiveExtractorFeature.ENTRY_SIZE);

            const nameLength = buffer.readUInt8(entryOffset);
            const name = buffer.toString("utf8", entryOffset + 1, entryOffset + 1 + nameLength);

            const relativeDataOffset = buffer.readUInt32LE(entryOffset + 248);
            const dataLength = buffer.readUInt32LE(entryOffset + 252);

            // On ignore les fichiers fantômes de taille 0 (ex: .png/.fsb externes)
            if (dataLength === 0) {
                continue;
            }

            const start = dataBlockStart + relativeDataOffset;
            const end = start + dataLength;

            if (end > buffer.length) {
                throw new Error(`Données tronquées pour l'entrée "${name}".`);
            }

            entries.push({
                name,
                data: buffer.subarray(start, end)
            });
        }

        return entries;
    }
}