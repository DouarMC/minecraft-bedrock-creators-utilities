import * as vscode from "vscode";
import { getVersionedSchemaForFile } from "./getVersionedSchemaForFile";
import { getJsonPathAt } from "../../../utils/json/getJsonPathAt";
import { JSONPath, Node, parseTree } from "jsonc-parser";
import { nodeToValue } from "../../../utils/json/nodeToValue";
import { resolveSchemaAtPath } from "../../../utils/json/resolveSchemaAtPath";
import { SchemaContext } from "../../../types/schema";

/**
 * Fournit tout le contexte JSON + schéma à une position du curseur dans un document.
 * @param document Le document dans lequel on veut obtenir le contexte
 * @param position La position du curseur dans le document
 */
export function getSchemaAtPosition(document: vscode.TextDocument, position: vscode.Position): SchemaContext {
    const fullSchema = getVersionedSchemaForFile(document); // Récupère le schéma complet avec les changements versionnés
    // Si le schéma n'est pas disponible, retourne un contexte vide
    if (!fullSchema) {
        return {
            path: [],
            schema: undefined,
            fullSchema: undefined,
            valueAtPath: undefined
        };
    }

    const rawPath = getJsonPathAt(document, position); // On récupère le chemin JSON brut à la position du curseur ✅
    
    const root = parseTree(document.getText()); // On obtient le noeud racine de l'arbre JSON
    const rootValue = nodeToValue(root as Node); // On convertit le noeud racine en valeur JS

    // Ce bloc corrige un bug VS Code : quand le curseur est placé juste après une clé et un :, la fonction getJsonPathAt() retourne un chemin trop court.
    const currentLine = document.lineAt(position.line).text;
    
    const colonMatch = currentLine.slice(0, position.character).match(/"([^"]+)"\s*:\s*$/);

    if (colonMatch && colonMatch[1]) { // Si on trouve une clé avant le curseur, on l'ajoute au chemin
        const key = colonMatch[1]; // La clé trouvée avant le curseur
        const pathCandidate = [...rawPath, key]; // On crée un candidat de chemin en ajoutant la clé trouvée

        // Vérifie si ce chemin est valide dans le schéma
        const testSchema = resolveSchemaAtPath(fullSchema, pathCandidate, rootValue); // On teste le chemin candidat dans le schéma complet
        
        if (testSchema && typeof testSchema === 'object') { // Si le schéma est valide, on utilise le candidat
            rawPath.push(key); // corrige le chemin
        }
    }

    const path = rawPath[rawPath.length - 1] === "" ? rawPath.slice(0, -1) : rawPath;  // On enlève le dernier élément vide du chemin si présent
    const valueAtPath = path.reduce((acc, key) => acc?.[key], rootValue); // On récupère la valeur à l'emplacement du chemin dans le document
    const schema = resolveSchemaAtPath(fullSchema, path, rootValue); // On résout le schéma à l'emplacement du chemin dans le document

    return {
        path,
        schema,
        fullSchema,
        valueAtPath
    };
}

export function getSchemaAtNodePath(document: vscode.TextDocument, node: Node, path: JSONPath): SchemaContext {
    const fullSchema = getVersionedSchemaForFile(document);
    if (!fullSchema) {
        return {
            path: [],
            schema: undefined,
            fullSchema: undefined,
            valueAtPath: undefined
        };
    }

    const root = parseTree(document.getText());
    const rootValue = nodeToValue(root as Node);
    const valueAtPath = path.reduce((acc, key) => acc?.[key], rootValue);
    const schema = resolveSchemaAtPath(fullSchema, path, rootValue);

    return {
        path,
        schema,
        fullSchema,
        valueAtPath
    };
}