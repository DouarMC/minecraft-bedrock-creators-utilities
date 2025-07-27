import * as vscode from 'vscode';
import { parseTree } from 'jsonc-parser';
import { validateSchema, SchemaValidationResult } from '../../utils/json/validation';
import { getBlockIds, getBlockModelIds, getLootTablePaths, getCraftingRecipeTagIds, getCullingLayerIds, getAimAssistCategoryIds, getEntityIds, getItemIds, getAimAssistPresetIds, getBiomeIds, getBiomeTags, getDataDrivenItemIds, getEffectIds, getCooldownCategoryIds, getItemTags, getItemGroupIds, getItemGroupIdsWithMinecraftNamespace, getDataDrivenEntityIds } from '../../utils/workspace/getContent';
import { dynamicExamplesSourceKeys } from './shared/schemaEnums';
import { getSchemaAtPosition } from './versioning/schemaContext';
import { findNearestNodeAtPath } from '../../utils/json/findNearestNodeAtPath';
import { getCursorContext } from '../../utils/json/getCursorContext';
import { findNearestObjectAtNode } from '../../utils/json/findNearestObjectAtPath';

/**
 * Enregistre le provider de complétion pour les fichiers JSON
 * @param context Le contexte de l'extension
 */
export function registerCompletionProvider(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            [{ language: "json", scheme: "file" }, { language: "jsonc", scheme: "file" }],
            {
                async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
                    // On récupère le schéma à la position actuelle, le chemin et la valeur à cette position, et le schéma complet
                    const {path, schema: rawSchema, valueAtPath, fullSchema} = getSchemaAtPosition(document, position);
                    
                    // DEBUG LOGS
                    console.log("=== COMPLETION DEBUG ===");
                    console.log("path:", path);
                    console.log("valueAtPath:", valueAtPath);
                    console.log("rawSchema exists:", !!rawSchema);
                    console.log("rawSchema.oneOf exists:", !!rawSchema?.oneOf);
                    console.log("rawSchema.properties:", rawSchema?.properties ? Object.keys(rawSchema.properties) : "none");
                    
                    if (!rawSchema) { // Si pas de schéma trouvé, on ne propose rien
                        console.log("No rawSchema found, returning empty");
                        return [];
                    }

                    // Utilisation du nouveau système de validation pour résoudre le schéma
                    const validationResult: SchemaValidationResult = validateSchema(rawSchema, valueAtPath);
                    const resolvedNode = validationResult.matchedSchema || rawSchema;
                    
                    console.log("resolvedNode exists:", !!resolvedNode);
                    console.log("resolvedNode.properties:", resolvedNode?.properties ? Object.keys(resolvedNode.properties) : "none");
                    
                    if (!resolvedNode) { // Si pas de schéma résolu, on ne propose rien
                        console.log("No resolvedNode found, returning empty");
                        return [];
                    }

                    const cursorContext = getCursorContext(document, position); // Récupère le contexte du curseur

                    // Trouve le bon objet parent à partir du curseur
                    const rootNode = parseTree(document.getText());
                    const nodeAtCursor = rootNode ? findNearestNodeAtPath(rootNode, path) : undefined;
                    const parentObject = findNearestObjectAtNode(nodeAtCursor);

                    // Gestion intelligente des propriétés avec résolution oneOf améliorée
                    let propertiesForCompletion: any = resolvedNode.properties;
                    
                    console.log("Initial propertiesForCompletion:", propertiesForCompletion ? Object.keys(propertiesForCompletion) : "none");

                    // Cas spécial : si nous sommes dans un élément de tableau (path se termine par un nombre),
                    // nous devons vérifier si le schéma parent du tableau a un oneOf pour fusionner toutes les propriétés
                    const isInArrayElement = typeof path[path.length - 1] === 'number';
                    
                    if (isInArrayElement && path.length >= 2) {
                        
                        // Chercher dans le fullSchema pour trouver le schéma du tableau parent
                        const arrayPath = path.slice(0, -1); // Enlever l'index du tableau
                        
                        // Navigation améliorée dans le schéma pour gérer les oneOf imbriqués
                        let arraySchema: any = fullSchema;
                        let navigationLog: string[] = [];
                        
                        for (let i = 0; i < arrayPath.length; i++) {
                            const segment = arrayPath[i];
                            navigationLog.push(`Step ${i}: segment="${segment}"`);
                            
                            if (typeof segment === 'number') {
                                // C'est un index de tableau, on va vers les items
                                if (arraySchema?.items) {
                                    arraySchema = arraySchema.items;
                                    navigationLog.push(`  -> Moved to items`);
                                } else {
                                    navigationLog.push(`  -> No items found`);
                                    arraySchema = undefined;
                                    break;
                                }
                            } else {
                                // C'est une propriété
                                if (arraySchema?.properties && arraySchema.properties[segment]) {
                                    arraySchema = arraySchema.properties[segment];
                                    navigationLog.push(`  -> Found property ${segment}`);
                                } else if (arraySchema?.oneOf) {
                                    // Si on a un oneOf, chercher dans toutes les branches
                                    let found = false;
                                    for (const branch of arraySchema.oneOf) {
                                        if (branch?.properties && branch.properties[segment]) {
                                            arraySchema = branch.properties[segment];
                                            navigationLog.push(`  -> Found ${segment} in oneOf branch`);
                                            found = true;
                                            break;
                                        }
                                    }
                                    if (!found) {
                                        navigationLog.push(`  -> Property ${segment} not found in any oneOf branch`);
                                        arraySchema = undefined;
                                        break;
                                    }
                                } else {
                                    navigationLog.push(`  -> No properties or oneOf found for ${segment}`);
                                    arraySchema = undefined;
                                    break;
                                }
                            }
                        }
                        
                        console.log("  - Navigation log:", navigationLog);
                        console.log("  - arraySchema found:", !!arraySchema);
                        console.log("  - arraySchema.items?.oneOf:", !!arraySchema?.items?.oneOf);
                        
                        if (arraySchema?.items?.oneOf) {
                            // Fusionner les propriétés de TOUTES les branches oneOf pour la completion
                            const allProperties = Object.assign(
                                {},
                                ...arraySchema.items.oneOf
                                    .filter((v: any) => v && v.properties)
                                    .map((v: any) => v.properties)
                            );
                            propertiesForCompletion = allProperties;
                            console.log("  - Merged properties from array oneOf:", Object.keys(allProperties));
                        } else if (rawSchema?.properties) {
                            // Si pas de oneOf au niveau du tableau mais rawSchema a des propriétés,
                            // c'est que la résolution oneOf a déjà été faite
                            propertiesForCompletion = rawSchema.properties;
                            console.log("  - Using rawSchema properties:", Object.keys(rawSchema.properties));
                        }
                    }
                    // Pour les objets normaux (non dans des tableaux), utiliser la logique existante
                    else if (rawSchema.oneOf && typeof valueAtPath === "object" && valueAtPath !== null) {
                        console.log("Entering oneOf logic for normal objects");
                        console.log("rawSchema.oneOf length:", rawSchema.oneOf.length);
                        
                        // Utiliser le nouveau système pour identifier les branches compatibles
                        const compatibleBranches = rawSchema.oneOf.filter((branch: any) => {
                            const hasProperties = !!branch?.properties;
                            console.log("Branch has properties:", hasProperties, branch?.properties ? Object.keys(branch.properties) : "none");
                            
                            if (!branch || !branch.properties) return false;
                            
                            // Tester si cette branche est potentiellement compatible
                            const branchValidation = validateSchema(branch, valueAtPath);
                            const isCompatible = branchValidation.isValid || branchValidation.errors.length < 3;
                            console.log("Branch compatibility:", isCompatible, "errors:", branchValidation.errors.length);
                            return isCompatible;
                        });

                        console.log("Compatible branches count:", compatibleBranches.length);

                        if (compatibleBranches.length > 0) {
                            // Fusionner les propriétés des branches compatibles avec les propriétés communes
                            const branchProperties = Object.assign({}, ...compatibleBranches.map((v: any) => v.properties));
                            propertiesForCompletion = Object.assign({}, propertiesForCompletion || {}, branchProperties);
                            console.log("Using compatible branches properties:", Object.keys(propertiesForCompletion));
                        } else {
                            // Fallback : toutes les propriétés de toutes les branches
                            console.log("Using fallback - all branches");
                            const allBranches = rawSchema.oneOf.filter((v: any) => v && v.properties);
                            console.log("All branches with properties count:", allBranches.length);
                            const allBranchProperties = Object.assign(
                                {},
                                ...allBranches.map((v: any) => v.properties)
                            );
                            propertiesForCompletion = Object.assign({}, propertiesForCompletion || {}, allBranchProperties);
                            console.log("Fallback properties:", Object.keys(propertiesForCompletion));
                        }
                    }

                    // Déterminer le schéma pour les valeurs (nécessaire pour la détection précoce)
                    let schemaForValues = resolvedNode ?? rawSchema;
                    if (cursorContext.isInArrayElement && rawSchema.items) {
                        schemaForValues = rawSchema.items;
                    }

                    // COMPLETION DE PROPRIÉTÉS (CLÉS)
                    // Amélioration : éviter la completion de propriétés quand on est dans une valeur string d'un tableau
                    const isStringValueInArray = cursorContext.isInArrayElement && cursorContext.isInQuotes && 
                        schemaForValues?.type === 'string';
                        
                    // Nouvelle amélioration : détecter quand on est dans des guillemets dans un array qui attend des objets
                    const isInvalidStringInObjectArray = cursorContext.isInArrayElement && cursorContext.isInQuotes &&
                        schemaForValues?.type === 'object';
                    
                    console.log("=== COMPLETION CONDITIONS ===");
                    console.log("propertiesForCompletion exists:", !!propertiesForCompletion);
                    console.log("propertiesForCompletion keys:", propertiesForCompletion ? Object.keys(propertiesForCompletion) : "none");
                    console.log("parentObject?.type:", parentObject?.type);
                    console.log("cursorContext.isStartOfProperty:", cursorContext.isStartOfProperty);
                    console.log("cursorContext.isInQuotes:", cursorContext.isInQuotes);
                    console.log("cursorContext.isProbablyKeyWithoutQuotes:", cursorContext.isProbablyKeyWithoutQuotes);
                    console.log("cursorContext.isAfterColon:", cursorContext.isAfterColon);
                    console.log("cursorContext.isTypingValue:", cursorContext.isTypingValue);
                    
                    if (
                        propertiesForCompletion &&
                        parentObject?.type === 'object' &&
                        (cursorContext.isStartOfProperty || cursorContext.isInQuotes || cursorContext.isProbablyKeyWithoutQuotes) &&
                        !cursorContext.isAfterColon && !cursorContext.isTypingValue &&
                        !isStringValueInArray &&  // Array de strings : pas de completion de propriétés
                        !isInvalidStringInObjectArray  // Array d'objets avec guillemets : pas de completion du tout
                    ) {
                        console.log("ENTERING PROPERTY COMPLETION SECTION");
                        const existingKeys = new Set<string>();
                        for (const prop of parentObject.children ?? []) {
                            const keyNode = prop.children?.[0];
                            if (keyNode?.type === 'string') {
                                existingKeys.add(keyNode.value);
                            }
                        }

                        return Object.entries(propertiesForCompletion)
                            .filter(([key]) => !existingKeys.has(key))
                            .map(([key, propertySchema]) => {
                                const item = new vscode.CompletionItem(key, vscode.CompletionItemKind.Property);
                                item.sortText = '0';
                                item.preselect = true;

                                // Gestion intelligente des guillemets et insertion
                                if (cursorContext.isInQuotes) {
                                    const snippet = generateAdvancedInsertTextForKey(key, propertySchema);
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
                                        item.insertText = new vscode.SnippetString(`${key}": $1`);
                                    }
                                } else {
                                    item.insertText = generateAdvancedInsertTextForKey(key, propertySchema);
                                    const wordRange = document.getWordRangeAtPosition(position);
                                    if (wordRange) {
                                        item.range = wordRange;
                                    }
                                }

                                // Documentation améliorée
                                const description = (propertySchema as any).description || (propertySchema as any).markdownDescription || '';
                                if (description) {
                                    item.documentation = new vscode.MarkdownString(description);
                                }

                                // Ajouter des détails sur le type attendu
                                const typeInfo = getTypeInfo(propertySchema);
                                if (typeInfo) {
                                    item.detail = typeInfo;
                                }

                                return item;
                            });
                    }

                    // COMPLETION DE VALEURS
                    if (cursorContext.isTypingValue || cursorContext.isAfterColon || cursorContext.isInArrayElement) {
                        // Éviter la completion de valeurs quand on tape des strings dans un array qui attend des objets
                        const isInvalidStringInObjectArray = cursorContext.isInArrayElement && cursorContext.isInQuotes &&
                            schemaForValues?.type === 'object';
                            
                        if (isInvalidStringInObjectArray) {
                            // Ne pas proposer de completion dans ce cas invalide
                            return [];
                        }
                        
                        // Logique avancée pour la résolution de schéma (déjà défini plus haut)
                        
                        // Gestion spéciale pour les éléments de tableau avec oneOf
                        if (cursorContext.isInArrayElement && rawSchema.items) {
                            // Re-calculer schemaForValues pour les éléments de tableau avec logique oneOf
                            let arrayItemSchema = rawSchema.items;
                            
                            // Si l'élément de tableau a un oneOf, appliquer la résolution intelligente
                            if (arrayItemSchema.oneOf && typeof valueAtPath === "object" && valueAtPath !== null) {
                                // Utiliser le système de validation pour identifier les branches compatibles
                                const compatibleBranches = arrayItemSchema.oneOf.filter((branch: any) => {
                                    if (!branch) return false;
                                    
                                    // Tester si cette branche est potentiellement compatible avec l'objet actuel
                                    const branchValidation = validateSchema(branch, valueAtPath);
                                    return branchValidation.isValid || branchValidation.errors.length < 3;
                                });

                                if (compatibleBranches.length > 0) {
                                    // Si on a des branches compatibles, utiliser la première (la plus compatible)
                                    schemaForValues = compatibleBranches[0];
                                } else {
                                    // Fallback : essayer de détecter le type voulu par les propriétés existantes
                                    const existingKeys = Object.keys(valueAtPath);
                                    
                                    for (const branch of arrayItemSchema.oneOf) {
                                        if (branch?.type === "object" && branch.properties) {
                                            // Vérifier si cette branche contient les propriétés déjà présentes
                                            const branchHasExistingKeys = existingKeys.every(key => 
                                                branch.properties.hasOwnProperty(key)
                                            );
                                            
                                            if (branchHasExistingKeys) {
                                                schemaForValues = branch;
                                                break;
                                            }
                                        }
                                    }
                                }
                            } else {
                                // Pas de oneOf, utiliser le schéma des items directement
                                schemaForValues = arrayItemSchema;
                            }
                        }

                        // Pour les propriétés spécifiques d'un objet (non-tableau), utiliser le schéma de la propriété
                        // au lieu du schéma de l'objet parent (résout le problème oneOf)
                        if (path.length > 0 && !cursorContext.isInArrayElement) {
                            const propertyName = path[path.length - 1];
                            
                            // Si on a des propriétés disponibles pour completion (issues de la résolution oneOf)
                            if (propertiesForCompletion && propertiesForCompletion[propertyName]) {
                                schemaForValues = propertiesForCompletion[propertyName];
                            }
                            // Sinon, essayer de récupérer la propriété du schéma résolu
                            else if (resolvedNode?.properties && resolvedNode.properties[propertyName]) {
                                schemaForValues = resolvedNode.properties[propertyName];
                            }
                            // Fallback : chercher dans toutes les branches oneOf du parent
                            else if (rawSchema.oneOf && typeof valueAtPath === "object" && valueAtPath !== null) {
                                for (const branch of rawSchema.oneOf) {
                                    if (branch?.type === "object" && branch.properties && branch.properties[propertyName]) {
                                        schemaForValues = branch.properties[propertyName];
                                        break;
                                    }
                                }
                            }
                        }

                        // Collecte des exemples dynamiques
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
                                    case dynamicExamplesSourceKeys.item_group_ids:
                                        dynamicExamples.push(...await getItemGroupIds());
                                        break;
                                    case dynamicExamplesSourceKeys.item_group_ids_with_minecraft_namespace:
                                        dynamicExamples.push(...await getItemGroupIdsWithMinecraftNamespace());
                                        break;
                                    case dynamicExamplesSourceKeys.vanilla_data_driven_entity_ids:
                                        dynamicExamples.push(...await getDataDrivenEntityIds());
                                        break;
                                }
                            }
                        }

                        // Collecte de toutes les valeurs possibles
                        const rawValues = [
                            ...dynamicExamples,
                            ...(schemaForValues.enum ?? []),
                            ...(schemaForValues.examples ?? []),
                            ...(schemaForValues.const !== undefined ? [schemaForValues.const] : []),
                            ...(schemaForValues.default !== undefined ? [schemaForValues.default] : [])
                        ];
                        const uniqueValues = [...new Set(rawValues)];

                        return uniqueValues.map(value => {
                            const label = typeof value === "string" ? value : JSON.stringify(value);
                            const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Value);

                            // Gestion intelligente des guillemets pour les valeurs
                            if (typeof value === "string") {
                                if (cursorContext.isInQuotes) {
                                    // Dans des guillemets, remplacer le contenu et fermer
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
                                    // Pas dans des guillemets, ajouter les guillemets et positionner le curseur après
                                    item.insertText = new vscode.SnippetString(`"${value}"$0`);
                                }
                            } else {
                                // Valeurs non-string (nombres, booléens, etc.)
                                item.insertText = new vscode.SnippetString(`${JSON.stringify(value)}$0`);
                            }

                            // Ajouter des détails sur le type et la source
                            item.detail = getValueTypeDetail(value, schemaForValues);

                            return item;
                        });
                    }

                    return [];
                }
            },
            '"', ':', ' ' // Déclencheurs de complétion améliorés
        )
    );
}

/**
 * Génère un texte d'insertion avancé pour une clé avec gestion intelligente du curseur
 */
function generateAdvancedInsertTextForKey(key: string, propertySchema: any): vscode.SnippetString {
    let insertText = `"${key}": `;

    if ("default" in propertySchema) {
        insertText += JSON.stringify(propertySchema.default);
    } else if (propertySchema.type === 'object') {
        insertText += `{\n\t$1\n}`;
    } else if (propertySchema.type === 'array') {
        insertText += `[$1]`;
    } else if (propertySchema.type === 'string') {
        // Pour les strings, créer des guillemets vides avec curseur au milieu
        insertText += `"$1"`;
    } else if (propertySchema.type === 'boolean') {
        // Pour les booléens, proposer un choix
        insertText += `\${1|true,false|}`;
    } else if (propertySchema.type === 'number' || propertySchema.type === 'integer') {
        // Pour les nombres, placeholder avec exemple si disponible
        const example = propertySchema.examples?.[0] ?? propertySchema.minimum ?? 0;
        insertText += `\${1:${example}}`;
    } else if (propertySchema.enum) {
        // Pour les enums, proposer un choix
        const enumOptions = propertySchema.enum.map((v: any) => JSON.stringify(v)).join(',');
        insertText += `\${1|${enumOptions}|}`;
    } else {
        insertText += `$1`; // valeur générique
    }

    return new vscode.SnippetString(insertText);
}

/**
 * Retourne des informations sur le type attendu pour une propriété
 */
function getTypeInfo(propertySchema: any): string {
    if (!propertySchema) return '';

    const type = propertySchema.type;
    if (Array.isArray(type)) {
        return `Type: ${type.join(' | ')}`;
    }
    
    if (type) {
        let info = `Type: ${type}`;
        
        if (propertySchema.enum) {
            info += ` (${propertySchema.enum.length} options)`;
        }
        
        if (type === 'string' && propertySchema.pattern) {
            info += ` (pattern: ${propertySchema.pattern})`;
        }
        
        if ((type === 'number' || type === 'integer') && propertySchema.minimum !== undefined) {
            info += ` (min: ${propertySchema.minimum})`;
        }
        
        return info;
    }

    if (propertySchema.oneOf) {
        return `OneOf (${propertySchema.oneOf.length} options)`;
    }
    
    if (propertySchema.anyOf) {
        return `AnyOf (${propertySchema.anyOf.length} options)`;
    }

    return '';
}

/**
 * Retourne des détails sur le type d'une valeur
 */
function getValueTypeDetail(value: any, schema: any): string {
    const valueType = typeof value;
    let detail = `${valueType}`;

    if (valueType === 'string' && schema.pattern) {
        detail += ' (matches pattern)';
    }

    if (schema.enum && schema.enum.includes(value)) {
        detail += ' (enum value)';
    }

    if (schema.examples && schema.examples.includes(value)) {
        detail += ' (example)';
    }

    if (schema.default === value) {
        detail += ' (default)';
    }

    return detail;
}

/**
 * Retourne le range du contenu entre guillemets (version améliorée)
 */
function getQuoteContentRange(document: vscode.TextDocument, position: vscode.Position): vscode.Range | null {
    const line = document.lineAt(position.line).text;

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

    return null;
}