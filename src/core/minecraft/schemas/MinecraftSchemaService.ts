import * as vscode from "vscode";
import { MinecraftFileResolverService } from "../../../services/minecraft/MinecraftFileResolverService";
import * as JsonParser from 'jsonc-parser';
import { MinecraftJsonSchema } from "../../../../common/types/MinecraftJsonSchema";
import { SchemaFetcher } from "../../network/SchemaFetcher";
import { VersionResolver } from "../versioning/VersionResolver";

export class MinecraftSchemaService {
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
        const versionedSchema = await SchemaFetcher.fetchVersioned(fileType.schemaPath);
        if (! versionedSchema) {
            console.log(`Aucun schéma versionné trouvé pour le chemin : ${fileType.schemaPath}`);
            return undefined;
        }

        // Extraction de la format_version du document
        const formatVersion = this.extractFormatVersion(document);

        // Résolution du schéma adapté à la version
        return VersionResolver.resolve(versionedSchema, formatVersion);
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
}