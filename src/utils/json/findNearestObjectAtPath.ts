import { Node } from "jsonc-parser";

/**
 * A partir du noeud courant, trouve l’objet le plus proche de ce noeud.
 * @param node Le nœud à partir duquel commencer la recherche.
 * @returns 
 */
export function findNearestObjectAtNode(node: Node | undefined): Node | undefined {
    if (!node) {
        return undefined;
    }

    if (node.type === 'object')  {
        return node;
    }

    if (node.type === "array") {
        const lastChild = node.children?.at(-1);
        if (lastChild?.type === "object") {
            return lastChild;
        }
    }

    let current: Node | undefined = node;
    while (current) {
        if (current.type === "object") {
            return current;
        }
        current = current.parent;
    }

    return undefined;
}