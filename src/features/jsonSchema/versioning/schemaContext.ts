import * as vscode from "vscode";
import { getVersionedSchemaForFile } from "./getVersionedSchemaForFile";
import { getJsonPathAt } from "../../../utils/json/getJsonPathAt";
import { JSONPath, Node } from "jsonc-parser";
import { resolveSchemaAtPath, resolveSchemaAtPathUnresolved } from "../../../utils/json/resolveSchemaAtPath";
import { SchemaContext } from "../../../types/schema";
import { getJsonTreeAndValue } from "../../../utils/json/optimizedParsing";

/**
 * Fournit tout le contexte JSON + schéma à une position du curseur dans un document.
 * Version optimisée avec cache intelligent pour de meilleures performances.
 * @param document Le document dans lequel on veut obtenir le contexte
 * @param position La position du curseur dans le document
 */
export function getSchemaAtPosition(document: vscode.TextDocument, position: vscode.Position): SchemaContext {
    const fullSchema = getVersionedSchemaForFile(document);
    if (!fullSchema) {
        return {
            path: [],
            schema: undefined,
            fullSchema: undefined,
            valueAtPath: undefined
        };
    }

    const rawPath = getJsonPathAt(document, position);
    
    // Utilisation du parsing optimisé avec cache
    const { tree: root, value: rootValue } = getJsonTreeAndValue(document);

    // Ce bloc corrige un bug VS Code : quand le curseur est placé juste après une clé et un :, la fonction getJsonPathAt() retourne un chemin trop court.
    const currentLine = document.lineAt(position.line).text;
    
    const colonMatch = currentLine.slice(0, position.character).match(/"([^"]+)"\s*:\s*$/);

    if (colonMatch && colonMatch[1]) {
        const key = colonMatch[1];
        const pathCandidate = [...rawPath, key];

        // Vérifie si ce chemin est valide dans le schéma
        const testSchema = resolveSchemaAtPath(fullSchema, pathCandidate, rootValue);
        
        if (testSchema && typeof testSchema === 'object') {
            rawPath.push(key);
        }
    }

    const path = rawPath[rawPath.length - 1] === "" ? rawPath.slice(0, -1) : rawPath;
    const valueAtPath = path.reduce((acc, key) => acc?.[key], rootValue);
    const schema = resolveSchemaAtPath(fullSchema, path, rootValue);
    const unresolvedSchema = resolveSchemaAtPathUnresolved(fullSchema, path); // Sans résolution oneOf

    return {
        path,
        schema,
        unresolvedSchema,
        fullSchema,
        valueAtPath
    };
}

/**
 * Version optimisée de getSchemaAtNodePath avec cache
 */
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

    // Utilisation du parsing optimisé avec cache
    const { value: rootValue } = getJsonTreeAndValue(document);
    const valueAtPath = path.reduce((acc, key) => acc?.[key], rootValue);
    const schema = resolveSchemaAtPath(fullSchema, path, rootValue);
    const unresolvedSchema = resolveSchemaAtPathUnresolved(fullSchema, path); // Sans résolution oneOf

    return {
        path,
        schema,
        unresolvedSchema,
        fullSchema,
        valueAtPath
    };
}