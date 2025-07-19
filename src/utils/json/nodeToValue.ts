import { Node } from "jsonc-parser";

export function nodeToValue(node: Node): any {
    switch (node.type) {
        case 'string':
        case 'number':
        case 'boolean':
            return node.value;
        case 'null':
            return null;
        case 'object': {
            const obj: Record<string, any> = {};
            if (node.children) {
                for (const prop of node.children) {
                    const key = prop.children?.[0]?.value;
                    const valNode = prop.children?.[1];
                    if (typeof key === 'string' && valNode) {
                        obj[key] = nodeToValue(valNode);
                    }
                }
            }
            return obj;
        }
        case 'array': {
            return (node.children ?? []).map(child => nodeToValue(child));
        }
        default:
            return undefined;
    }
}