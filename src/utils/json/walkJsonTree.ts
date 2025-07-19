import { Node } from "jsonc-parser";

/**
 * Fonction récursive pour parcourir l'arbre JSON et appliquer un callback à chaque nœud.
 * @param node Le nœud JSON actuel.
 * @param callback La fonction à appeler pour chaque nœud.
 * @param path Le chemin actuel dans l'arbre JSON, utilisé pour la validation.
 */
export function walkJsonTree(
    node: Node,
    callback: (node: Node, path: string[]) => void,
    path: string[] = []
): void {
    if (node.type === 'property' && node.children?.length === 2) {
        const key = node.children[0].value;
        const valueNode = node.children[1];
        walkJsonTree(valueNode, callback, [...path, key]);
    } else if (node.type === 'array') {
        callback(node, path); // Appelle aussi sur le tableau lui-même
        node.children?.forEach((child, index) => {
            walkJsonTree(child, callback, [...path, String(index)]);
        });
    } else if (node.type === 'object') {
        callback(node, path); // Appelle aussi sur l'objet lui-même
        node.children?.forEach(child => {
            walkJsonTree(child, callback, path); // les clés sont ajoutées dans les "property"
        });
    } else {
        callback(node, path); // Valeur simple (string, number, boolean, etc.)
    }
}