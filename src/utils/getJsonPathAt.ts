import { findNodeAtOffset, parseTree, Segment, getNodePath } from "jsonc-parser";
import * as vscode from "vscode";

/**
 * Récupère le chemin JSON (sous forme de tableau de clés) correspondant à la position du curseur.
 * @param document Le document VSCode dans lequel on cherche le chemin JSON
 * @param position La position du curseur dans le document
 * @returns 
 */
export function getJsonPathForCompletionAt(document: vscode.TextDocument, position: vscode.Position): string[] {
    const text = document.getText(); // Récupère le texte du document
    const offset = document.offsetAt(position); // Convertit la position en offset qui esst le nombre de décalage vers la droite pour atteindre la position
    const root = parseTree(text); // Crée l'arbre de syntaxe JSON à partir du texte ce qui permet de naviguer dans la structure JSON
    if (!root) {
        return []; // Si l'arbre n'est pas valide, retourne un tableau vide
    }

    const node = findNodeAtOffset(root, offset, true);  // Récupère le nœud JSON (clé ou valeur) à la position donnée
    if (!node) {
        return []; // Si aucun nœud n'est trouvé, retourne un tableau vide
    }

    // Si le curseur est placé sur le nom (clé) d'une propriété JSON, on récupère le chemin complet vers l'objet parent (excluant la clé elle-même)
    if (node.parent?.type === "property" && node.parent.children?.[0] === node) {
        return getNodePath(node.parent.parent!)
            .map(s => s.toString());
    }

    // Si le curseur est placé sur la valeur d'une propriété JSON, on récupère le chemin vers cette propriété
    if (node.parent?.type === "property" && node.parent.children?.[1] === node) {
        // On récupère le chemin vers l'objet parent
        const parentPath = getNodePath(node.parent.parent!)
            .map(s => s.toString());
        // On ajoute le nom de la propriété (clé) à ce chemin
        const propertyName = node.parent.children[0].value;
        return [...parentPath, propertyName];
    }

    // Si le curseur est placé directement sur un objet JSON lui-même, pas sur une propriété précise, on retourne le chemin vers cet objet
    if (node.type === "object") {
        return getNodePath(node)
            .map(s => s.toString());
    }

    // Cas par défaut : Si le curseur est sur un élément non couvert par les cas précédents, on renvoie simplement le chemin vers le nœud actuel
    return getNodePath(node)
        .map(s => s.toString());
}

export function getJsonPathForHoverAt(document: vscode.TextDocument, position: vscode.Position): string[] {
    const text = document.getText();
    const offset = document.offsetAt(position);
    const root = parseTree(text);
    if (!root) {return [];}

    const node = findNodeAtOffset(root, offset, true);
    if (!node) {return [];}

    // Cas : curseur sur la clé d'une propriété
    if (
        node.type === "string" &&
        node.parent?.type === "property" &&
        node.parent.children?.[0] === node
    ) {
        const path = getNodePath(node.parent.parent!).map(s => s.toString());
        const key = node.value; // On utilise .value pour obtenir le nom exact de la propriété
        return [...path, key];
    }

    // Cas : curseur sur la valeur d'une propriété
    if (
        node.parent?.type === "property" &&
        node.parent.children?.[1] === node
    ) {
        const path = getNodePath(node.parent.parent!).map(s => s.toString());
        const key = node.parent.children[0].value;
        return [...path, key];
    }

    // Cas : curseur sur un objet
    if (node.type === "object") {
        return getNodePath(node).map(s => s.toString());
    }

    // Cas par défaut
    return getNodePath(node).map(s => s.toString());
}