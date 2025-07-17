import micromatch from "micromatch";
import { SchemaType, schemaTypes } from "./schemaTypes";

/**
 * Renvoie le type de schéma correspondant au chemin du fichier.
 * @param filePath Le chemin du fichier à vérifier.
 * @returns 
 */
export function findMatchingSchemaType(filePath: string): SchemaType | undefined {
    const normalizedPath = filePath.replace(/\\/g, "/"); // Normalise le chemin pour éviter les problèmes de séparateurs de fichiers

    // Renvoie le premier SchemaType dont le fileMatch correspond au chemin normalisé
    return schemaTypes.find(schemaType =>
        micromatch.some(normalizedPath, schemaType.fileMatch)
    );
}