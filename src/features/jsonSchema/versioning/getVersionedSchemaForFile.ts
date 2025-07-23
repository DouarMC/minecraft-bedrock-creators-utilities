import * as vscode from "vscode";
import { applyVersionedSchema } from "./applyVersionedSchema";
import { findNodeAtLocation, parseTree } from "jsonc-parser";
import { schemaTypes } from "./schemaTypes";
import micromatch from "micromatch";

/**
 * Récupère le schéma versionné pour un fichier donné.
 * @param document Le document VSCode pour lequel on veut récupérer le schéma.
 * @returns 
 */
export function getVersionedSchemaForFile(document: vscode.TextDocument): any | undefined {
    const filePath = document.uri.fsPath; // Récupère le chemin du fichier
    const normalizedPath = filePath.replace(/\\/g, "/"); // Normalise le chemin pour éviter les problèmes de séparateurs de fichiers

    // Cherche le type de schéma correspondant au chemin du fichier
    const matchedSchemaType  = schemaTypes.find(schemaType =>
        schemaType.fileMatch.some(pattern => micromatch.isMatch(normalizedPath, pattern))
    );
    if (!matchedSchemaType ) { // Si aucun type de schéma ne correspond, on retourne undefined
        return;
    }

    let formatVersion: string | undefined = undefined; // Initialisation de la version de format
    const root = parseTree(document.getText()); // Parse le texte du document pour obtenir l'arbre JSON
    if (root?.type === "object") {
        const versionNode = findNodeAtLocation(root, ["format_version"]); // Cherche le nœud de version dans l'arbre JSON
        if (versionNode?.type === "string") {
            formatVersion = versionNode.value; // Si le nœud de version est trouvé et est une chaîne, on l'utilise comme version de format
        }
    }
    
    return applyVersionedSchema(matchedSchemaType, formatVersion); // On renvoie le schéma appliqué avec les modifications versionnées
}