import * as vscode from 'vscode';
import { getVersionedSchemaForFile } from '../../schemas/getVersionedSchemaForFile';
import { getJsonPathForCompletionAt } from '../../utils/getJsonPathAt';
import { resolveOneOfToObjectSchema } from '../../utils/resolveOneOfToObjectSchema';
import { resolveSchemaAtPath } from '../../utils/resolveSchemaAtPath';
import { findNodeAtLocation, parseTree } from 'jsonc-parser';

/**
 * Enregistre le provider de complétion pour les fichiers JSON
 * @param context Le contexte de l'extension
 */
export function registerCompletionProvider(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            {language: "json", scheme: "file"}, // Dit qu'on veut des suggestions pour les fichiers JSON
            {
                async provideCompletionItems(document, position) {
                    const schema = getVersionedSchemaForFile(document); // Récupère le schéma JSON pour le fichier actuel
                    if (!schema) { // Si pas de schéma, pas de suggestions
                        return [];
                    }

                    const path = getJsonPathForCompletionAt(document, position); // Récupère le chemin JSON à la position du curseur
                    const node = resolveSchemaAtPath(schema, path); // Récupère la sous-partie du schéma correspondant à la position du curseur
                    if (!node) { // Si pas de nœud, pas de suggestions
                        return [];
                    }

                    const resolvedNode = resolveOneOfToObjectSchema(node) ?? node; // Résout les schémas oneOf/anyOf en un schéma d'objet si possible

                    const line = document.lineAt(position.line).text; // Récupère le texte de la ligne actuelle où se trouve le curseur
                    const beforeCursor = line.slice(0, position.character); // Texte avant le curseur
                    const afterCursor = line.slice(position.character); // Texte après le curseur

                    const isInQuotes = isInsideQuotes(beforeCursor, afterCursor); // Vérifie si le curseur est à l'intérieur de guillemets
                    const isAfterColon = /:\s*$/.test(beforeCursor); // Vérifie si le curseur est après un deux-points
                    const isStartOfProperty = /^[\s{,]*$/.test(beforeCursor) || /^[\s{,]*"[^"]*$/.test(beforeCursor); // Vérifie si on est au début d'une propriété
                    const isTypingValue = isAfterColon || (isInQuotes && /:\s*"[^"]*$/.test(beforeCursor)); // Vérifie si on est en train de taper une valeur
                    const isProbablyKeyWithoutQuotes = /^[\s{,]*[a-zA-Z0-9_]*$/.test(beforeCursor); // Vérifie si on est probablement en train de taper une clé sans guillemets

                    // Parse le document JSON pour obtenir l'arbre syntaxique
                    const root = parseTree(document.getText());
                    
                    // Essaye de trouver le noeud en partant de la fin du chemin
                    let workingPath = [...path];
                    let nodeAtCursor = findNodeAtLocation(root!, workingPath);
                    while (!nodeAtCursor && workingPath.length > 0) {
                        workingPath.pop();
                        nodeAtCursor = findNodeAtLocation(root!, workingPath);
                    }

                    let parentObject: any;
                    if (nodeAtCursor?.type === 'object') {
                        parentObject = nodeAtCursor;
                    } else if (nodeAtCursor?.type === 'array') {
                        const lastChild = nodeAtCursor.children?.at(-1);
                        if (!lastChild || lastChild.type !== 'object') {
                            return [];
                        }
                        parentObject = lastChild;
                    } else {
                        parentObject = findNearestObjectNode(nodeAtCursor);
                    }

                    // Cas 1 : Si on est dans des guillemets ou au début d'une propriété, on propose les clés
                    if (
                        resolvedNode.properties &&
                        parentObject?.type === 'object' &&
                        (isStartOfProperty || isInQuotes || isProbablyKeyWithoutQuotes) &&
                        !isAfterColon &&
                        !isTypingValue
                    ) {
                        // Récupère les propriétés déjà présentes dans l'objet actuel
                        const existingKeys = new Set<string>(); // Ensemble pour stocker les clés déjà existantes

                        // Si on est dans un objet, on récupère les clés existantes pour éviter les doublons
                        if (parentObject?.type === 'object') {
                            for (const prop of parentObject.children ?? []) {
                                const keyNode = prop.children?.[0];
                                if (keyNode?.type === 'string' && typeof keyNode.value === 'string') {
                                    existingKeys.add(keyNode.value);
                                }
                            }
                        }

                        return Object.entries(resolvedNode.properties)
                            .filter(([key]) => key !== "$schema" && !existingKeys.has(key)) // on ignore $schema et les clés déjà existantes
                            .map(([key, value]) => {
                                const item = new vscode.CompletionItem(key, vscode.CompletionItemKind.Property); // Crée un item de complétion pour chaque clé

                                // Forcer la priorité et l'affichage en tête
                                item.sortText = '0';
                                item.preselect = true;

                                // Si on est dans des guillemets
                                if (isInQuotes) {
                                    const snippet = generateInsertTextForKey(key, value); // Génère le texte d'insertion pour la clé
                                    const fullInsert = snippet.value;

                                    // ⚠️ Séparer clé et valeur en analysant précisément le format
                                    // Format attendu : `"clé": valeur`
                                    const match = /^"([^"]+)"\s*:\s*([\s\S]*)$/.exec(fullInsert);
                                    if (!match) {
                                        // Fallback si le format est inattendu
                                        item.insertText = new vscode.SnippetString(`${key}: $1`);
                                        return item;
                                    }

                                    const keyPart = match[1];
                                    const valuePart = match[2];

                                    const range = getQuoteContentRange(document, position); // Récupère le range du contenu entre guillemets
                                    if (range) {
                                        // Étend le range pour inclure la guillemet fermante
                                        const extendedRange = new vscode.Range(
                                            range.start,
                                            new vscode.Position(range.end.line, range.end.character + 1)
                                        );
                                        item.range = extendedRange; // Définit le range de l'item de complétion ce qui permet de remplacer le contenu entre guillemets
                                    }

                                    // 🧠 On insère clé + valeur, mais en laissant VS Code remplacer juste la clé
                                    item.insertText = new vscode.SnippetString(`${keyPart}": ${valuePart}`);

                                } else { // Si on n'est pas dans des guillemets
                                    item.insertText = generateInsertTextForKey(key, value);

                                    // Range pour remplacer le mot actuel s'il existe
                                    const wordRange = document.getWordRangeAtPosition(position);
                                    if (wordRange) {
                                        item.range = wordRange; // Définit le range pour remplacer le mot actuel
                                    }
                                }

                                const description = (value as any).description || (value as any).markdownDescription || '';
                                if (description) {
                                    item.documentation = new vscode.MarkdownString(description); // Ajoute une description si disponible
                                }

                                return item; // Retourne l'item de complétion
                            });
                    }

                    // Cas 2 : Si on est après un deux-points, on propose les valeurs possibles
                    if (isTypingValue || isAfterColon) {
                        // On stocke les valeurs possibles dans un tableau qui sont définit dans le schéma
                        const values = [
                            ...(node.enum ?? []),
                            ...(node.examples ?? []),
                            ...(node.const !== undefined ? [node.const] : []),
                            ...(node.default !== undefined ? [node.default] : [])
                        ];

                        if (values.length > 0) { // Si on a au moins une valeur
                            return values.map(value => {
                                const label = typeof value === "string" ? value : JSON.stringify(value); // Convertit la valeur en chaîne de caractères pour l'affichage
                                const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Value); // Crée un item de complétion pour chaque valeur

                                if (typeof value === "string") { // Si la valeur est une chaîne de caractères
                                    if (isInQuotes) { // Si on est dans des guillemets
                                        item.insertText = new vscode.SnippetString(`${value}"$0`);
                                        const range = getQuoteContentRange(document, position);
                                        if (range) {
                                            const extendedRange = new vscode.Range(
                                                range.start,
                                                new vscode.Position(range.end.line, range.end.character + 1) // inclut la guillemet fermante
                                            );
                                            item.range = extendedRange;
                                        }

                                    } else {
                                        item.insertText = new vscode.SnippetString(`"${value}"$0`); // Si on n'est pas dans des guillemets, on ajoute des guillemets autour de la valeur
                                    }
                                } else { // Si la valeur n'est pas une chaîne de caractères
                                    item.insertText = new vscode.SnippetString(`${JSON.stringify(value)}$0`); // On convertit la valeur en JSON pour l'insertion
                                }

                                return item; // Retourne l'item de complétion
                            });
                        }
                    }

                    return []; // Si aucun cas ne correspond, retourne un tableau vide
                }
            },
            '"', ':' // Déclencheurs de complétion
        )
    );
}

/**
 * Vérifie si le curseur est à l'intérieur de guillemets
 * @param beforeCursor Le texte avant le curseur
 * @param afterCursor Le texte après le curseur
 * @returns 
 */
function isInsideQuotes(beforeCursor: string, afterCursor: string): boolean {
    // Compte le nombre de guillemets non échappés avant le curseur
    const quotesBeforeCount = (beforeCursor.match(/(?<!\\)"/g) || []).length;
    
    // Si le nombre est impair, on est probablement à l'intérieur d'une chaîne
    const inQuotes = quotesBeforeCount % 2 === 1;

    // Vérifie s'il y a un guillemet fermant après le curseur (mais pas immédiatement une nouvelle clé)
    const hasClosingQuote = /^[^"]*"/.test(afterCursor);

    // On est à l'intérieur de guillemets uniquement si on est entre une ouverture et une fermeture
    return inQuotes && hasClosingQuote;
}

/**
 * Retourne le range du contenu entre guillemets
 * @param document Le document/fichier actuel
 * @param position La position du curseur
 * @returns 
 */
function getQuoteContentRange(document: vscode.TextDocument, position: vscode.Position): vscode.Range | null {
    const line = document.lineAt(position.line).text; // Récupère le texte de la ligne actuelle

    let openQuote = -1;
    for (let i = position.character - 1; i >= 0; i--) {
        if (line[i] === '"' && (i === 0 || line[i-1] !== '\\')) {
            openQuote = i;
            break;
        }
    }

    let closeQuote = -1;
    for (let i = position.character; i < line.length; i++) {
        if (line[i] === '"' && (i === 0 || line[i-1] !== '\\')) {
            closeQuote = i;
            break;
        }
    }

    if (openQuote !== -1 && closeQuote !== -1) {
        return new vscode.Range(
            new vscode.Position(position.line, openQuote + 1),
            new vscode.Position(position.line, closeQuote)
        );
    }

    if (openQuote !== -1) {
        return new vscode.Range(
            new vscode.Position(position.line, openQuote + 1),
            new vscode.Position(position.line, line.length)
        );
    }

    return null; // Pas de guillemets trouvés
}

/**
 * Génère le texte d'insertion pour une clé avec sa valeur
 * @param key La clé à insérer
 * @param value La valeur associée à la clé
 * @returns 
 */
function generateInsertTextForKey(key: string, value: any): vscode.SnippetString {
    let insertText = `"${key}": `;

    if ("default" in value) {
        insertText += JSON.stringify(value.default);
    } else if (value.type === 'object') {
        insertText += `{\n\t$1\n}`;
    } else if (value.type === 'array') {
        insertText += `[$1]`;
    } else if (value.type === 'string') {
        insertText += `"$1"`;
    } else if (value.type === 'boolean') {
        insertText += `$1`; // l'utilisateur pourra taper true / false
    } else {
        insertText += `$1`; // valeur générique
    }

    return new vscode.SnippetString(insertText);
}

/**
 * Trouve le nœud parent le plus proche de type "object"
 */
function findNearestObjectNode(node: any): any {
    let current = node;
    while (current) {
        if (current.type === 'object') {
            return current;
        }
        current = current.parent;
    }
    return null;
}