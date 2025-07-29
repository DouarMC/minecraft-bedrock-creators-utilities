import * as vscode from "vscode";
import { applyVersionedSchema } from "./applyVersionedSchema";
import { findNodeAtLocation } from "jsonc-parser";
import { schemaTypes } from "./schemaTypes";
import { schemaCache } from "../../../utils/cache/schemaCache";
import { getJsonTree } from "../../../utils/json/optimizedParsing";
import micromatch from "micromatch";

/**
 * Récupère le schéma versionné pour un fichier donné avec cache intelligent.
 * @param document Le document VSCode pour lequel on veut récupérer le schéma.
 * @returns Le schéma versionné optimisé
 */
export function getVersionedSchemaForFile(document: vscode.TextDocument): any | undefined {
    const filePath = document.uri.fsPath;
    const normalizedPath = filePath.replace(/\\/g, "/");

    // Recherche du type de schéma correspondant au chemin du fichier
    const matchedSchemaType = schemaTypes.find(schemaType =>
        schemaType.fileMatch.some(pattern => micromatch.isMatch(normalizedPath, pattern))
    );
    
    if (!matchedSchemaType) {
        return undefined;
    }

    // Extraction de la version de format du document
    let formatVersion: string | undefined = undefined;
    const root = getJsonTree(document);
    
    if (root?.type === "object") {
        const versionNode = findNodeAtLocation(root, ["format_version"]);
        if (versionNode?.type === "string") {
            formatVersion = versionNode.value;
        }
    }

    // Détermination du produit Minecraft pour le cache
    const folderUri = vscode.workspace.getWorkspaceFolder(document.uri)?.uri 
        || vscode.workspace.workspaceFolders?.[0].uri;
    
    // Génération d'un hash simple du schéma de base pour détecter les changements
    const baseSchemaHash = generateSchemaHash(matchedSchemaType);

    // Tentative de récupération depuis le cache
    const minecraftProduct = folderUri ? getMinecraftProductSync(folderUri) : 'release';
    const cachedSchema = schemaCache.get(
        normalizedPath,
        formatVersion,
        minecraftProduct,
        baseSchemaHash
    );

    if (cachedSchema) {
        return cachedSchema;
    }

    // Génération du schéma si pas en cache
    const schema = applyVersionedSchema(matchedSchemaType, formatVersion, document.uri);

    // Mise en cache du schéma généré
    schemaCache.set(
        normalizedPath,
        formatVersion,
        minecraftProduct,
        schema,
        baseSchemaHash
    );

    return schema;
}

/**
 * Génère un hash simple d'un type de schéma pour détecter les changements
 */
function generateSchemaHash(schemaType: any): string {
    // Hash simple basé sur la taille et quelques propriétés clés
    const baseSize = JSON.stringify(schemaType.baseSchema).length;
    const changesCount = schemaType.versionedChanges?.length || 0;
    const previewChangesCount = schemaType.previewVersionedChanges?.length || 0;
    
    return `${baseSize}-${changesCount}-${previewChangesCount}`;
}

/**
 * Version synchrone rapide pour déterminer le produit Minecraft
 */
function getMinecraftProductSync(folderUri: vscode.Uri): string {
    try {
        // Import dynamique pour éviter les dépendances circulaires
        const { projectMetadataCache } = require("../../../utils/cache/projectMetadataCache");
        const metadata = projectMetadataCache.getSync(folderUri);
        return metadata?.minecraftProduct || 'release';
    } catch {
        return 'release';
    }
}