import * as vscode from "vscode";
import { VersionedSchema } from "../../../../common/types/VersionedSchema";
import { MinecraftFileResolverService } from "../fileTypes/MinecraftFileResolverService";
import * as JsonParser from 'jsonc-parser';
import { cloneDeep, set, unset } from "lodash";
import { MinecraftJsonSchema } from "../../../../common/types/MinecraftJsonSchema";
import { SCHEMA_BASE_URL } from "../../../constants";

export class MinecraftSchemaService {
    /**
     * Cache des schémas versionnés déjà récupérés.
     */
    private static cache: Map<string, VersionedSchema> = new Map();

    /**
     * Renvoie le schéma Minecraft adapté au document donné.
     * @param document Le document VSCode à analyser.
     * @returns 
     */
    public static async getSchemaForDocument(document: vscode.TextDocument): Promise<MinecraftJsonSchema | undefined> {

        // Récuperation du type de fichier Minecraft associé au document
        const fileType = await MinecraftFileResolverService.resolveFileType(document.uri);
        if (! fileType || ! fileType.schemaPath) {
            return undefined;
        }

        // Récupération du schéma versionné depuis l'URL
        const versionedSchema = await this.fetchVersionedSchema(fileType.schemaPath);
        if (! versionedSchema) {
            console.log(`Aucun schéma versionné trouvé pour le chemin : ${fileType.schemaPath}`);
            return undefined;
        }

        // Extraction de la format_version du document
        const formatVersion = this.extractFormatVersion(document);

        // Résolution du schéma adapté à la version
        const resolvedSchema = this.resolveVersionedSchema(versionedSchema, formatVersion);

        return resolvedSchema;
    }

    /**
     * Récupère un schéma versionné depuis une URL, avec mise en cache.
     * @param relativePath Le chemin relatif du schéma à récupérer.
     * @returns 
     */
    private static async fetchVersionedSchema(relativePath: string): Promise<VersionedSchema | undefined> {
        const url = `${SCHEMA_BASE_URL}/${relativePath}`;

        if (this.cache.has(url)) {
            return this.cache.get(url);
        }

        try {
            console.log(`Téléchargement : ${url}`);
            const response = await fetch(url);
            if (! response.ok) {
                throw new Error(response.statusText);
            }

            const schemaData = await response.json() as VersionedSchema;

            this.cache.set(url, schemaData);
            return schemaData;
        } catch (error) {
            console.error("Erreur fetch schema:", error);
            return undefined;
        }
    }

    /**
     * Extrait la format_version du document JSON de façon robuste
     * @param document Le document VSCode à analyser.
     * @returns 
     */
    private static extractFormatVersion(document: vscode.TextDocument): string | number | undefined {
        const text = document.getText();

        // 🚀 Tentative 1: JSON.parse standard (le plus rapide si JSON valide
        try {
            const json = JsonParser.parse(text);
            return json.format_version || undefined;
        } catch {
            // 🛡️ Fallback: Regex simple si JSON invalide
            const match = text.match(/"format_version"\s*:\s*"([^"]+)"/);
            return match ? match[1] : undefined;
        }
    }

    /**
     * Renvoie le schéma adapté à la version donnée.
     * @param versionedSchema Le schéma versionné à résoudre.
     * @param formatVersion La version de format à utiliser.
     * @returns 
     */
    private static resolveVersionedSchema(versionedSchema: VersionedSchema, formatVersion?: string | number): MinecraftJsonSchema {
        const schema = cloneDeep(versionedSchema.baseSchema);

        if (! formatVersion || ! versionedSchema.versionedChanges) {
            return schema;
        }

        for (const changeSet of versionedSchema.versionedChanges) {
            if (this.compareVersions(formatVersion, changeSet.version) >= 0) {
                for (const change of changeSet.changes) {
                    switch (change.action) {
                        case "add":
                        case "modify":
                            const value = cloneDeep(change.value); // ⬅️ éviter toute fuite de référence
                            set(schema, change.target, value);
                            break;
                        case "remove":
                            unset(schema, change.target);
                            break;
                        default:
                            console.warn(`Unknown change action: ${change.action}`);
                    }
                }
            }
        }

        return schema;
    }

    /**
     * Compare deux versions de format en string ou number.
     * @param a La première version à comparer.
     * @param b La deuxième version à comparer.
     * @returns 
     */
    private static compareVersions(a: string | number, b: string | number): number {
        if (typeof a === "string" && typeof b === "string") {
            const aParts = a.split('.').map(Number);
            const bParts = b.split('.').map(Number);
            const maxLength = Math.max(aParts.length, bParts.length);

            for (let i = 0; i < maxLength; i++) {
                const aNum = aParts[i] ?? 0;
                const bNum = bParts[i] ?? 0;

                if (aNum > bNum) {
                    return 1;
                }
                if (aNum < bNum) {
                    return -1;
                }
            }

            return 0;
        } else if (typeof a === "number" && typeof b === "number") {
            if (a > b) {
                return 1;
            }
            if (a < b) {
                return -1;
            }
            return 0;
        }

        return 0; // Si les types ne correspondent pas, on considère qu'ils sont égaux
    }
}