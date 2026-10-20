import * as vscode from "vscode";
import * as fs from "fs/promises";

export interface BrArchiveIndexEntry {
    name: string;
    absoluteOffset: number;
    length: number;
}

export class BrArchiveUtils {
    private static readonly MAGIC_BYTES = Buffer.from("7d2725b1a0527026", "hex");
    private static readonly HEADER_SIZE = 16;
    private static readonly ENTRY_SIZE = 256;

    // Petit cache en mémoire pour les index uniquement (quelques Ko) afin de rendre l'autocomplétion instantanée
    private static indexCache = new Map<string, BrArchiveIndexEntry[]>();

    /**
     * Lit UNIQUEMENT la table d'index (noms + offsets) d'un fichier .brarchive sans charger les JSON en RAM.
     */
    public static async readIndex(archiveFsPath: string): Promise<BrArchiveIndexEntry[]> {
        const cached = this.indexCache.get(archiveFsPath);
        if (cached) {
            return cached;
        }

        const handle = await fs.open(archiveFsPath, "r");
        try {
            const headerBuf = Buffer.alloc(this.HEADER_SIZE);
            const { bytesRead } = await handle.read(headerBuf, 0, this.HEADER_SIZE, 0);
            if (bytesRead < this.HEADER_SIZE || !headerBuf.subarray(0, 8).equals(this.MAGIC_BYTES)) {
                return [];
            }

            const numEntries = headerBuf.readUInt32LE(8);
            const tableSize = numEntries * this.ENTRY_SIZE;
            const dataBlockStart = this.HEADER_SIZE + tableSize;

            const tableBuf = Buffer.alloc(tableSize);
            await handle.read(tableBuf, 0, tableSize, this.HEADER_SIZE);

            const entries: BrArchiveIndexEntry[] = [];
            for (let i = 0; i < numEntries; i++) {
                const offset = i * this.ENTRY_SIZE;
                const nameLen = tableBuf.readUInt8(offset);
                const name = tableBuf.toString("utf8", offset + 1, offset + 1 + nameLen).replace(/\\/g, "/");
                const relDataOffset = tableBuf.readUInt32LE(offset + 248);
                const dataLength = tableBuf.readUInt32LE(offset + 252);

                if (dataLength > 0) {
                    entries.push({
                        name,
                        absoluteOffset: dataBlockStart + relDataOffset,
                        length: dataLength
                    });
                }
            }

            this.indexCache.set(archiveFsPath, entries);
            return entries;
        } catch (error) {
            console.error(`Erreur lors de la lecture de l'index .brarchive (${archiveFsPath}):`, error);
            return [];
        } finally {
            await handle.close();
        }
    }

    /**
     * Lit à la volée UNIQUEMENT les octets d'une entrée spécifique dans un .brarchive et retourne son texte UTF-8.
     */
    public static async readEntryText(archiveFsPath: string, absoluteOffset: number, length: number): Promise<string> {
        const handle = await fs.open(archiveFsPath, "r");
        try {
            const entryBuffer = Buffer.alloc(length);
            await handle.read(entryBuffer, 0, length, absoluteOffset);
            return entryBuffer.toString("utf8");
        } finally {
            await handle.close();
        }
    }

    /**
     * Crée un vscode.Uri pointant vers le .brarchive avec les métadonnées d'extraction dans query
     */
    public static createEntryUri(archiveUri: vscode.Uri, entry: BrArchiveIndexEntry, virtualRelativePath: string): vscode.Uri {
        const query = new URLSearchParams({
            entry: entry.name,
            virtualPath: virtualRelativePath,
            offset: entry.absoluteOffset.toString(),
            length: entry.length.toString()
        }).toString();

        return archiveUri.with({ query });
    }

    /**
     * Vérifie si un vscode.Uri représente une entrée virtuelle à l'intérieur d'un .brarchive
     */
    public static isBrArchiveEntryUri(uri: vscode.Uri): boolean {
        return uri.path.endsWith(".brarchive") && uri.query.includes("offset=");
    }
}