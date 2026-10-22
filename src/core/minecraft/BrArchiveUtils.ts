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

    private static readonly MCB_MAGIC = Buffer.from("7f4d4342", "hex"); // "\x7FMCB"

    private static indexCache = new Map<string, BrArchiveIndexEntry[]>();

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

                // IMPORTANT : On garde même les entrées avec dataLength === 0 (ex: les .png référencés dans les .brarchive de textures)
                entries.push({
                    name,
                    absoluteOffset: dataBlockStart + relDataOffset,
                    length: dataLength
                });
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

    public static async readEntryText(archiveFsPath: string, absoluteOffset: number, length: number): Promise<string> {
        if (length === 0) {
            return "";
        }
        const handle = await fs.open(archiveFsPath, "r");
        try {
            const entryBuffer = Buffer.alloc(length);
            await handle.read(entryBuffer, 0, length, absoluteOffset);
            return entryBuffer.toString("utf8");
        } finally {
            await handle.close();
        }
    }

    public static createEntryUri(archiveUri: vscode.Uri, entry: BrArchiveIndexEntry, virtualRelativePath: string): vscode.Uri {
        const query = new URLSearchParams({
            entry: entry.name,
            virtualPath: virtualRelativePath,
            offset: entry.absoluteOffset.toString(),
            length: entry.length.toString()
        }).toString();

        return archiveUri.with({ query });
    }

    public static isBrArchiveEntryUri(uri: vscode.Uri): boolean {
        return uri.path.endsWith(".brarchive") && uri.query.includes("offset=");
    }

    /**
     * Retourne "/<virtualPath>" si l'URI provient d'un .brarchive, sinon retourne uri.fsPath.
     * Permet aux Regex (comme /[\/\\](textures[\/\\].+\.png)$/i) de fonctionner à l'identique !
     */
    public static getVirtualOrFsPath(uri: vscode.Uri): string {
        if (this.isBrArchiveEntryUri(uri)) {
            const params = new URLSearchParams(uri.query);
            const virtualPath = params.get("virtualPath");
            if (virtualPath) {
                return "/" + virtualPath;
            }
        }
        return uri.fsPath;
    }

    /**
     * Vérifie si un Buffer commence par la signature binaire MCB (7F 4D 43 42)
     */
    public static isMcbBuffer(buffer: Buffer): boolean {
        return buffer.length >= 12 && buffer.subarray(0, 4).equals(this.MCB_MAGIC);
    }

    /**
     * Lit les octets bruts d'une entrée dans un .brarchive
     */
    public static async readEntryBuffer(archiveFsPath: string, absoluteOffset: number, length: number): Promise<Buffer> {
        if (length === 0) {
            return Buffer.alloc(0);
        }
        const handle = await fs.open(archiveFsPath, "r");
        try {
            const entryBuffer = Buffer.alloc(length);
            await handle.read(entryBuffer, 0, length, absoluteOffset);
            return entryBuffer;
        } finally {
            await handle.close();
        }
    }

    /**
     * Décode un binaire compilé MCB en un squelette JSON compatible avec DynamicSourceHandlers
     */
    public static parseMcbToMinimalJson(buffer: Buffer): any {
        // 1. Lecture du format_version dans le header MCB (octets 4 à 12)
        const major = buffer.readUInt16LE(4);
        const minor = buffer.readUInt16LE(6);
        const patch = buffer.readUInt32LE(8);
        const format_version = `${major}.${minor}.${patch}`;

        // 2. Extraction rapide de toutes les chaînes ASCII lisibles du binaire (longueur >= 3)
        // Dans MCB, les chaînes sont en UTF-8/ASCII pur précédées de leur longueur
        const rawLatin1 = buffer.subarray(12).toString("latin1");
        const asciiStrings = rawLatin1.match(/[a-zA-Z0-9_.:/\-$]{3,}/g) ?? [];

        // La 1ère chaîne est le root type (ex: "minecraft:item", "particle_effect", "minecraft:camera_preset")
        const rootType = asciiStrings[0] ?? "";

        // La 2ème chaîne contenant ":" est l'identifiant (ex: "minecraft:shelf_mushroom")
        const identifier = asciiStrings.slice(1).find(s => s.includes(":")) ?? asciiStrings[1] ?? "";

        // 3. Construction du squelette JSON minimal selon le rootType pour que DynamicSourceHandlers s'y retrouve
        const result: any = { format_version };

        if (rootType === "minecraft:item") {
            // Cherche d'éventuels item groups (ex: "minecraft:mushrooms_for_stew" ou "itemGroup.name...")
            const otherNamespaceStrings = asciiStrings.slice(2).filter(s => s.includes(":") && s !== identifier);
            result["minecraft:item"] = {
                description: {
                    identifier,
                    menu_category: {
                        group: otherNamespaceStrings[0]
                    }
                },
                components: {}
            };
        } else if (rootType === "minecraft:camera_preset" || rootType === "minecraft:aim_assist_preset") {
            // Ces schémas ont "identifier" directement sous la clé racine (sans "description")
            result[rootType] = { identifier };
        } else if (rootType) {
            // Cas général : "particle_effect", "minecraft:voxel_shape", "minecraft:biome", etc.
            result[rootType] = {
                description: {
                    identifier
                }
            };
        }

        return result;
    }
}