import * as vscode from 'vscode';
import { parseTree, JSONPath } from 'jsonc-parser';

export function getExistingProperties(document: vscode.TextDocument, targetPath: JSONPath): string[] {
    const text = document.getText();
    const root = parseTree(text);
    
    if (!root) {
        return [];
    }
    
    // Naviguer jusqu'à l'objet cible
    let currentNode = root;
    for (const segment of targetPath) {

        if (currentNode.type === 'object' && currentNode.children) {
            // Navigation dans un objet
            const property = currentNode.children.find(child => 
                child.type === 'property' && 
                child.children?.[0]?.value === segment
            );
            if (property && property.children?.[1]) {
                currentNode = property.children[1];
            } else {
                return [];
            }
        } else if (currentNode.type === 'array' && currentNode.children) {
            // 🆕 Navigation dans un array
            const index = typeof segment === 'number' ? segment : parseInt(segment.toString());
            if (!isNaN(index) && currentNode.children[index]) {
                currentNode = currentNode.children[index];
            } else {
                return [];
            }
        } else {
            return [];
        }
    }
    
    // Extraire les noms des propriétés existantes
    const existingProperties: string[] = [];
    if (currentNode.type === 'object' && currentNode.children) {
        for (const child of currentNode.children) {
            if (child.type === 'property' && child.children?.[0]?.value) {
                existingProperties.push(child.children[0].value);
            }
        }
    }
    
    return existingProperties;
}