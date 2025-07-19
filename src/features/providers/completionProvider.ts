import * as vscode from 'vscode';
import { findNodeAtOffset, parseTree } from 'jsonc-parser';
import { getErrorsForSchema } from '../../utils/json/getErrorsForSchema';
import { getBlockIds, getBlockModelIds, getLootTablePaths, getCraftingRecipeTagIds, getCullingLayerIds, getAimAssistCategoryIds, getEntityIds, getItemIds, getAimAssistPresetIds, getBiomeIds, getBiomeTags, getDataDrivenItemIds, getEffectIds, getCooldownCategoryIds, getItemTags } from '../../utils/workspace/getContent';
import { dynamicExamplesSourceKeys } from '../../schemas/utils/schemaEnums';
import { getSchemaAtPosition } from '../../core/schemaContext';
import { findNearestNodeAtPath } from '../../utils/json/findNearestNodeAtPath';
import { getCursorContext } from '../../utils/json/getCursorContext';
import { findNearestObjectAtNode } from '../../utils/json/findNearestObjectAtPath';
import { find } from 'lodash';

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
                    // On récupère le schéma à la position actuelle, le chemin et la valeur à cette position, et le schéma complet
                    const {path, schema: rawSchema, valueAtPath, fullSchema} = getSchemaAtPosition(document, position);
                    if (!rawSchema) { // Si pas de schéma trouvé, on ne propose rien
                        return [];
                    }

                    const { schema: resolvedNode } = getErrorsForSchema(rawSchema, valueAtPath); // Résout le schéma à la position actuelle
                    if (!resolvedNode) { // Si pas de schéma résolu, on ne propose rien
                        return [];
                    }

                    const cursorContext = getCursorContext(document, position); // Récupère le contexte du curseur (est-ce qu'on est en train de taper une clé, une valeur, etc.)

                    // Trouve le bon objet parent à partir du curseur
                    const rootNode = parseTree(document.getText());
                    const nodeAtCursor = rootNode ? findNearestNodeAtPath(rootNode, path) : undefined; // Trouve le nœud JSON le plus proche à partir du chemin
                    const parentObject = findNearestObjectAtNode(nodeAtCursor); // Trouve l'objet parent le plus proche du nœud à la position du curseur

                    // ➤ Complétion de CLÉS, vérifie que le schéma résolu est un objet avec des propriétés → donc que la complétion peut proposer des clés valides.
                    // et que Le curseur se trouve dans un objet JSON.
                    // et que l'utilisateur est en train de taper une clé (soit au début d'une propriété, soit dans des guillemets, soit probablement une clé sans guillemets),
                    // et qu'on n'est pas après un deux-points (donc pas en train de taper une valeur).
                    if (
                        resolvedNode.properties &&
                        parentObject?.type === 'object' &&
                        (cursorContext.isStartOfProperty || cursorContext.isInQuotes || cursorContext.isProbablyKeyWithoutQuotes) &&
                        !cursorContext.isAfterColon && !cursorContext.isTypingValue
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

                                if (cursorContext.isInQuotes) {
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
                                    if (wordRange) {
                                        item.range = wordRange;
                                    }
                                }

                                const description = (value as any).description || (value as any).markdownDescription || '';
                                if (description) {
                                    item.documentation = new vscode.MarkdownString(description);
                                }

                                return item;
                            });
                    }

                    // Complétion de VALEURS
                    if (cursorContext.isTypingValue || cursorContext.isAfterColon || cursorContext.isInArrayElement) {
                        let schemaForValues = resolvedNode ?? rawSchema;
                        if (cursorContext.isInArrayElement && rawSchema.items) {
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
                                if (cursorContext.isInQuotes) {
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