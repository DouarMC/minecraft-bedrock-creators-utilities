import * as vscode from "vscode";
import { resolveSchemaAtPath } from "../../utils/json/resolveSchemaAtPath";
import { parseTree, findNodeAtOffset } from "jsonc-parser";
import { resolveOneOfToObjectSchema } from "../../utils/json/resolveOneOfToObjectSchema";
import { getSchemaAtPosition } from "./versioning/schemaContext";
import { getErrorsForSchema } from "../../utils/json/getErrorsForSchema";

export function registerHoverProvider(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(
            [{ language: "json", scheme: "file" }, { language: "jsonc", scheme: "file" }],
            {
                provideHover(document, position) {
                    const { path, schema, fullSchema, valueAtPath } = getSchemaAtPosition(document, position);
                    if (!fullSchema || !path.length) {
                        return;
                    }

                    const offset = document.offsetAt(position); // Convertit la position en offset
                    const root = parseTree(document.getText()); // Parse le document JSON pour obtenir l'arbre syntaxique
                    if (!root) { // Si l'arbre n'est pas valide, on ne peut pas fournir de hover
                        return;
                    }

                    const node = findNodeAtOffset(root, offset, true); // Trouve le nœud à l'offset donné
                    if (!node || node.parent?.type !== "property" || node.parent.children?.[0] !== node) { // Vérifie si le nœud est une propriété
                        return;
                    }
                    
                    const key = path[path.length - 1]; // Récupère la dernière clé du chemin
                    const parentPath = path.slice(0, -1); // Récupère le chemin du parent en enlevant la dernière clé

                    // 1. Résout le schéma "parent" à ce chemin
                    const rawNodeSchema = resolveSchemaAtPath(fullSchema, parentPath);

                    // 2. Récupère la valeur JS de l'objet parent (ex: { branch: "x", valX: ... })
                    const parentValue = valueAtPath; // valueAtPath dans getSchemaAtPosition = valeur à ce chemin

                    // 3. Applique getErrorsForSchema pour trouver la branche oneOf/anyOf active
                    const { schema: resolvedParentSchema } = getErrorsForSchema(rawNodeSchema, parentValue);

                    // 4. Recherche la clé dans properties (et patternProperties/additionalProperties si tu veux compléter)
                    if (resolvedParentSchema?.properties && resolvedParentSchema.properties[key]) {
                        const propSchema = resolvedParentSchema.properties[key];
                        const desc = propSchema.markdownDescription || propSchema.description;
                        if (desc) {
                            return new vscode.Hover(new vscode.MarkdownString(desc));
                        }
                    }

                    
                    return;
                }
            }
        )
    );
}