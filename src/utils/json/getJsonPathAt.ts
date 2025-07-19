import { getLocation, parseTree, findNodeAtOffset, getNodePath, Node, JSONPath } from "jsonc-parser";
import * as vscode from "vscode";

/**
 * Retourne le chemin JSON (JSONPath) à une position donnée dans un document.
 * Gère les cas où le curseur est sur une valeur, une clé, ou entre les guillemets d'une clé.
 */
export function getJsonPathAt(document: vscode.TextDocument, position: vscode.Position): JSONPath {
    const text = document.getText(); // Récupère le texte complet du document
    const offset = document.offsetAt(position); // Convertit la position en offset
    const root = parseTree(text); // Parse le texte JSON pour obtenir l'arbre syntaxique
    if (!root) { // Si l'arbre n'est pas valide, retourne un chemin vide
        return [];
    }

    const node = findNodeAtOffset(root, offset, true); // Trouve le nœud à l'offset donné

    if (!node) { // Si aucun nœud n'est trouvé, retourne un chemin vide
        return [];
    }

    const location = getLocation(text, offset); // Obtient la localisation du curseur dans le texte
 
    /**
     * Cas : le curseur est dans une **clé de propriété** (entre les guillemets)
     * Ex: {
     *  "format_|"
     * }}
     * Renvoie : ["format_"]
     */
    if (location.isAtPropertyKey && node.type === "string") { // Si le curseur est sur une clé  
        const property = node.parent; // // On récupère le nœud parent, qui est une propriété (clé + valeur)

        if (property?.type === "property" && property.children?.[0] === node) {
            // Vérifie que ce nœud est bien la **clé** de la propriété
            const parentPath = getNodePath(property.parent!); // On récupère le chemin de l'objet parent
            return [...parentPath, node.value]; // On renvoie ce chemin + la clé en cours d’écriture
        }
    }

    /**
     * Cas : le curseur est sur une **valeur** (après les deux-points)
     * Ex: {
     *  "format_version": "1.2|0.30"
     * }
     * Renvoie : ["format_version", "1.20.30"]
     */
    if (node.parent?.type === "property" && node.parent.children?.[1] === node) { // Si le parent du noeud est une propriété (clé + valeur), et que son enfant valeur est le noeud actuel
        const parentPath = getNodePath(node.parent.parent!); // On récupère le chemin de l'objet parent
        const key = node.parent.children?.[0]?.value; // On récupère la clé de la propriété
        return [...parentPath, key]; // On renvoie ce chemin + la clé de la propriété
    }

    /**
     * Cas : Le curseur sur la **clé** (gauche d’une propriété, `"clé":`)
     * Ex: {
     *  "format_version": |"1.20.30"
     * }
     */
    if (node.parent?.type === "property" && node.parent.children?.[0] === node) { // Si le parent du noeud est une propriété (clé + valeur), et que son enfant clé est le noeud actuel
        const parentPath = getNodePath(node.parent.parent!); // On récupère le chemin de l'objet parent
        const key = node.value; // On récupère la clé de la propriété
        return [...parentPath, key]; // On renvoie ce chemin + la clé de la propriété
    }

    // 📌 4. Par défaut (curseur sur un objet, tableau, etc.)
    /**
     * Cas : le curseur est sur un **objet** ou un **tableau**
     */
    return getNodePath(node); // Renvoie le chemin du nœud actuel, qui est un objet ou un tableau ou etc.
}