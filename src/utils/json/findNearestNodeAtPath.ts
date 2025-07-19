import { findNodeAtLocation, JSONPath, Node } from "jsonc-parser";

/**
 * Essaie de trouver le nœud le plus proche du curseur via le path JSON.
 * @param root La racine du document JSON.
 * @param path Le chemin JSON à partir de la racine.
 * @returns 
 */
export function findNearestNodeAtPath(root: Node, path: JSONPath): Node | undefined {
    let workingPath = [...path];
    let node = findNodeAtLocation(root, workingPath);
    while (!node && workingPath.length > 0) {
        workingPath.pop();
        node = findNodeAtLocation(root, workingPath);
    }
    return node;
}