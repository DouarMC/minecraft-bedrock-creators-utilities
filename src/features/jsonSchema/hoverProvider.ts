import * as vscode from "vscode";
import { resolveSchemaAtPath } from "../../utils/json/resolveSchemaAtPath";
import { parseTree, findNodeAtOffset } from "jsonc-parser";
import { resolveOneOfToObjectSchema } from "../../utils/json/resolveOneOfToObjectSchema";
import { getSchemaAtPosition } from "./versioning/schemaContext";

export function registerHoverProvider(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.languages.registerHoverProvider("json", {
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

                const rawNodeSchema = resolveSchemaAtPath(fullSchema, parentPath);
                const nodeSchema = resolveOneOfToObjectSchema(rawNodeSchema) ?? rawNodeSchema; // Résout les schémas "oneOf" en un schéma d'objet, ou utilise le schéma brut si non applicable

                if (!nodeSchema || !nodeSchema.properties) { // Si le schéma du nœud ou ses propriétés ne sont pas définis, on ne peut pas fournir de hover
                    return;
                }

                const propSchema = nodeSchema.properties[key]; // Récupère le schéma de la propriété à partir du schéma du nœud
                if (propSchema?.description || propSchema?.markdownDescription) { // Si la propriété a une description ou une description Markdown, on peut fournir un hover
                    const desc = propSchema.markdownDescription || propSchema.description;
                    return new vscode.Hover(new vscode.MarkdownString(desc));
                }
                
                return;
            }
        })
    );
}