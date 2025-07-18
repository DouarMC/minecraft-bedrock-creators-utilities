import * as vscode from 'vscode';
import { getVersionedSchemaForFile } from '../../core/getVersionedSchemaForFile';
import { getJsonPathForCompletionAt } from '../../utils/json/getJsonPathAt';
import { resolveSchemaAtPath } from '../../utils/json/resolveSchemaAtPath';
import { findNodeAtLocation, parseTree } from 'jsonc-parser';
import { nodeToValue } from '../diagnostics/validationJson';
import { getErrorsForSchema } from '../../utils/json/resolveMatchingSubSchema';
import { getBlockIds, getBlockModelIds, getLootTablePaths, getCraftingRecipeTagIds, getCullingLayerIds, getAimAssistCategoryIds, getEntityIds, getItemIds, getAimAssistPresetIds, getBiomeIds, getBiomeTags, getDataDrivenItemIds, getEffectIds, getCooldownCategoryIds, getItemTags } from '../../utils/workspace/getContent';
import { dynamicExamplesSourceKeys } from '../../schemas/utils/schemaEnums';

/**
 * Enregistre le provider de complétion pour les fichiers JSON
 * @param context Le contexte de l'extension
 */
export function registerCompletionProvider(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            {language: "json", scheme: "file"}, // Dit qu'on veut des suggestions pour les fichiers JSON
            {
                async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
                    const schema = getVersionedSchemaForFile(document); // Récupère le schéma JSON pour le fichier actuel
                    if (!schema) {
                        return [];
                    }

                    // Détermine le chemin JSON hiérarchique (tableau de clés) depuis la racine jusqu'à la position actuelle du curseur pour l'autocomplétion
                    // Ex: ['minecraft:block', 'components', 'minecraft:collision_box']
                    const path = getJsonPathForCompletionAt(document, position);
                    // Parse le contenu textuel du document en arbre de syntaxe abstraite (AST) pour analyser la structure JSON/objet
                    const rootNode = parseTree(document.getText());
                    const rootValue = nodeToValue(rootNode as any); // Convertit l'arbre en valeur JavaScript pour une manipulation plus facile
                    const rawSchema = resolveSchemaAtPath(schema, path, rootValue); // Ex: path=['minecraft:block', 'components'] → retourne le schéma pour cette propriété
                    if (!rawSchema) { // Si aucun schéma n'est trouvé pour le chemin, on ne propose pas de complétion
                        return [];
                    }

                    const valueAtPath = path.reduce((acc, key) => acc?.[key], rootValue); // Exemple équivalent: rootValue?.['minecraft:block']?.['components']?.['minecraft:collision_box']
                    const { schema: resolvedNode } = getErrorsForSchema(rawSchema, valueAtPath);
                    console.log("📍 path", path);
                    console.log("📂 resolvedNode", resolvedNode);

                    if (!resolvedNode) {return [];}

                    const line = document.lineAt(position.line).text;
                    const beforeCursor = line.slice(0, position.character);     
                    const afterCursor = line.slice(position.character);

                    const isInQuotes = isInsideQuotes(beforeCursor, afterCursor);
                    const isAfterColon = /:\s*$/.test(beforeCursor);
                    const isStartOfProperty = /^[\s{,]*$/.test(beforeCursor) || /^[\s{,]*"[^"]*$/.test(beforeCursor);
                    const isTypingValue = isAfterColon || (isInQuotes && /:\s*"[^"]*$/.test(beforeCursor));
                    const isProbablyKeyWithoutQuotes = /^[\s{,]*[a-zA-Z0-9_]*$/.test(beforeCursor);

                    // Trouve le bon objet parent à partir du curseur
                    let workingPath = [...path];
                    let nodeAtCursor = findNodeAtLocation(rootNode!, workingPath);
                    while (!nodeAtCursor && workingPath.length > 0) {
                        workingPath.pop();
                        nodeAtCursor = findNodeAtLocation(rootNode!, workingPath);
                    }

                    let parentObject: any = null;
                    if (nodeAtCursor?.type === 'object') {
                        parentObject = nodeAtCursor;
                    } else if (nodeAtCursor?.type === 'array') {
                        const lastChild = nodeAtCursor.children?.at(-1);
                        if (lastChild?.type === 'object') {parentObject = lastChild;}
                    } else {
                        parentObject = findNearestObjectNode(nodeAtCursor);
                    }

                    // ➤ Complétion de CLÉS
                    if (
                        resolvedNode.properties &&
                        parentObject?.type === 'object' &&
                        (isStartOfProperty || isInQuotes || isProbablyKeyWithoutQuotes) &&
                        !isAfterColon && !isTypingValue
                    ) {
                        const existingKeys = new Set<string>();
                        for (const prop of parentObject.children ?? []) {
                            const keyNode = prop.children?.[0];
                            if (keyNode?.type === 'string') {
                                existingKeys.add(keyNode.value);
                            }
                        }

                        return Object.entries(resolvedNode.properties)
                            .filter(([key]) => !existingKeys.has(key))
                            .map(([key, value]) => {
                                const item = new vscode.CompletionItem(key, vscode.CompletionItemKind.Property);
                                item.sortText = '0';
                                item.preselect = true;

                                if (isInQuotes) {
                                    const snippet = generateInsertTextForKey(key, value);
                                    const fullInsert = snippet.value;
                                    const match = /^"([^"]+)"\s*:\s*([\s\S]*)$/.exec(fullInsert);

                                    if (match) {
                                        const [_, keyPart, valuePart] = match;
                                        const range = getQuoteContentRange(document, position);
                                        if (range) {
                                            const extendedRange = new vscode.Range(
                                                range.start,
                                                new vscode.Position(range.end.line, range.end.character + 1)
                                            );
                                            item.range = extendedRange;
                                        }
                                        item.insertText = new vscode.SnippetString(`${keyPart}": ${valuePart}`);
                                    } else {
                                        item.insertText = new vscode.SnippetString(`${key}: $1`);
                                    }

                                } else {
                                    item.insertText = generateInsertTextForKey(key, value);
                                    const wordRange = document.getWordRangeAtPosition(position);
                                    if (wordRange) {item.range = wordRange;}
                                }

                                const description = (value as any).description || (value as any).markdownDescription || '';
                                if (description) {
                                    item.documentation = new vscode.MarkdownString(description);
                                }

                                return item;
                            });
                    }

                    const isInArrayElement = isInsideArrayElement(beforeCursor, afterCursor);
                    // ➤ Complétion de VALEURS
                    if (isTypingValue || isAfterColon || isInArrayElement) {
                        let schemaForValues = resolvedNode ?? rawSchema;
                        if (isInArrayElement && rawSchema.items) {
                            schemaForValues = rawSchema.items;
                        }

                        let dynamicExamples: any[] = [];
                        if ("x-dynamic-examples-source" in schemaForValues) {
                            const sources = Array.isArray(schemaForValues["x-dynamic-examples-source"])
                                ? schemaForValues["x-dynamic-examples-source"]
                                : [schemaForValues["x-dynamic-examples-source"]];
                            for (const source of sources) {
                                switch (source) {
                                    case dynamicExamplesSourceKeys.block_ids:
                                        dynamicExamples.push(...await getBlockIds());
                                        break;
                                    case dynamicExamplesSourceKeys.loot_table_file_paths:
                                        dynamicExamples.push(...await getLootTablePaths());
                                        break;
                                    case dynamicExamplesSourceKeys.block_model_ids:
                                        dynamicExamples.push(...await getBlockModelIds());
                                        break;
                                    case dynamicExamplesSourceKeys.crafting_recipe_tags:
                                        dynamicExamples.push(...await getCraftingRecipeTagIds());
                                        break;
                                    case dynamicExamplesSourceKeys.culling_layer_ids:
                                        dynamicExamples.push(...await getCullingLayerIds());
                                        break;
                                    case dynamicExamplesSourceKeys.aim_assist_category_ids:
                                        dynamicExamples.push(...await getAimAssistCategoryIds());
                                        break;
                                    case dynamicExamplesSourceKeys.aim_assist_preset_ids:
                                        dynamicExamples.push(...await getAimAssistPresetIds());
                                        break;
                                    case dynamicExamplesSourceKeys.entity_ids:
                                        dynamicExamples.push(...await getEntityIds());
                                        break;
                                    case dynamicExamplesSourceKeys.item_ids:
                                        dynamicExamples.push(...await getItemIds());
                                        break;
                                    case dynamicExamplesSourceKeys.biome_ids:
                                        dynamicExamples.push(...await getBiomeIds());
                                        break;
                                    case dynamicExamplesSourceKeys.biome_tags:
                                        dynamicExamples.push(...await getBiomeTags());
                                        break;
                                    case dynamicExamplesSourceKeys.vanilla_data_driven_item_ids:
                                        dynamicExamples.push(...await getDataDrivenItemIds());
                                        break;
                                    case dynamicExamplesSourceKeys.effect_ids:
                                        dynamicExamples.push(...await getEffectIds());
                                        break;
                                    case dynamicExamplesSourceKeys.cooldown_category_ids:
                                        dynamicExamples.push(...await getCooldownCategoryIds());
                                        break;
                                    case dynamicExamplesSourceKeys.item_tags:
                                        dynamicExamples.push(...await getItemTags());
                                        break;
                                }
                            }
                        }

                        const rawValues = [
                            ...dynamicExamples,
                            ...(schemaForValues.enum ?? []),
                            ...(schemaForValues.examples ?? []),
                            ...(schemaForValues.const !== undefined ? [schemaForValues.const] : []),
                            ...(schemaForValues.default !== undefined ? [schemaForValues.default] : [])
                        ];
                        const uniqueValues = [...new Set(rawValues)]; // Évite les doublons

                        return uniqueValues.map(value => {
                            const label = typeof value === "string" ? value : JSON.stringify(value);
                            const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Value);

                            if (typeof value === "string") {
                                if (isInQuotes) {
                                    item.insertText = new vscode.SnippetString(`${value}"$0`);
                                    const range = getQuoteContentRange(document, position);
                                    if (range) {
                                        const extendedRange = new vscode.Range(
                                            range.start,
                                            new vscode.Position(range.end.line, range.end.character + 1)
                                        );
                                        item.range = extendedRange;
                                    }
                                } else {
                                    item.insertText = new vscode.SnippetString(`"${value}"$0`);
                                }
                            } else {
                                item.insertText = new vscode.SnippetString(`${JSON.stringify(value)}$0`);
                            }

                            return item;
                        });
                    }

                    return [];
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
 * Vérifie si le curseur est à l'intérieur d'un élément de tableau
 * @param beforeCursor Le texte avant le curseur
 * @param afterCursor Le texte après le curseur
 * @returns 
 */
function isInsideArrayElement(beforeCursor: string, afterCursor: string): boolean {
    // Vérifie si le curseur est après une virgule, un crochet ouvrant ou un saut de ligne à l'intérieur d'un tableau
    const before = beforeCursor.trimEnd();
    const after = afterCursor.trimStart();

    const isAfterOpeningBracket = /\[\s*$/.test(before); // Exemple: `tags: [\n|`
    const isAfterComma = /,\s*$/.test(before);           // Exemple: `"...",\n|`
    const isInQuotes = isInsideQuotes(beforeCursor, afterCursor);
    const isLineStart = before === '"' || before.endsWith('\n"');

    return isAfterOpeningBracket || isAfterComma || isInQuotes || isLineStart;
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