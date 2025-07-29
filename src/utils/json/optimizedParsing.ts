import * as vscode from "vscode";
import { parseTree, Node } from "jsonc-parser";
import { nodeToValue } from "./nodeToValue";
import { documentCache } from "../cache/documentCache";

/**
 * Interface pour les données JSON parsées et optimisées
 */
export interface ParsedJsonData {
    /** Arbre JSON parsé */
    tree: Node | undefined;
    /** Valeur JavaScript correspondante */
    value: any;
    /** Indique si les données proviennent du cache */
    fromCache: boolean;
}

/**
 * Parse un document JSON avec mise en cache intelligente
 * Cette fonction remplace les appels directs à parseTree() pour optimiser les performances
 */
export function parseJsonDocument(document: vscode.TextDocument): ParsedJsonData {
    // Tentative de récupération depuis le cache
    const cached = documentCache.get(document);
    if (cached && cached.jsonTree !== undefined) {
        return {
            tree: cached.jsonTree,
            value: cached.rootValue,
            fromCache: true
        };
    }

    // Parsing du document si pas en cache
    const content = document.getText();
    const tree = parseTree(content);
    const value = tree ? nodeToValue(tree) : undefined;

    // Mise en cache des résultats
    documentCache.set(document, tree, value);

    return {
        tree,
        value,
        fromCache: false
    };
}

/**
 * Récupère uniquement l'arbre JSON d'un document (version optimisée de parseTree)
 */
export function getJsonTree(document: vscode.TextDocument): Node | undefined {
    const parsed = parseJsonDocument(document);
    return parsed.tree;
}

/**
 * Récupère uniquement la valeur JavaScript d'un document
 */
export function getJsonValue(document: vscode.TextDocument): any {
    const parsed = parseJsonDocument(document);
    return parsed.value;
}

/**
 * Version optimisée qui combine le parsing et la conversion en valeur
 * Évite les double conversions quand on a besoin des deux
 */
export function getJsonTreeAndValue(document: vscode.TextDocument): { tree: Node | undefined; value: any } {
    const parsed = parseJsonDocument(document);
    return {
        tree: parsed.tree,
        value: parsed.value
    };
}

/**
 * Invalide le cache pour un document spécifique
 * À utiliser quand on sait qu'un document a changé de manière non-détectable par la version
 */
export function invalidateDocumentCache(document: vscode.TextDocument): void {
    documentCache.invalidate(document);
}

/**
 * Statistiques de performance du parsing JSON
 */
export function getParsingStats(): {
    cacheHitRate: number;
    cacheSize: number;
    totalRequests: number;
} {
    const stats = documentCache.getStats();
    // Note: Pour avoir un vrai taux de hit, il faudrait instrumenter les appels
    // Pour l'instant, on retourne les informations disponibles
    return {
        cacheHitRate: 0, // À implémenter si nécessaire
        cacheSize: stats.size,
        totalRequests: 0 // À implémenter si nécessaire
    };
}
