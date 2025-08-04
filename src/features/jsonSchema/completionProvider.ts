import * as vscode from 'vscode';
import { parseTree } from 'jsonc-parser';
import { validateSchema, SchemaValidationResult } from '../../utils/json/validation';
import { resolveSchemaAtPath } from '../../utils/json/resolveSchemaAtPath';
import { getBlockIds, getBlockModelIds, getLootTablePaths, getCraftingRecipeTagIds, getCullingLayerIds, getAimAssistCategoryIds, getEntityIds, getItemIds, getAimAssistPresetIds, getBiomeIds, getBiomeTags, getDataDrivenItemIds, getEffectIds, getCooldownCategoryIds, getItemTags, getItemGroupIds, getItemGroupIdsWithMinecraftNamespace, getDataDrivenEntityIds, getCameraPresetIds, getDimensionIds, getEntityFamilyIds, getTradingFilePaths } from '../../utils/workspace/getContent';
import { dynamicExamplesSourceKeys } from './shared/schemaEnums';
import { getSchemaAtPosition } from './versioning/schemaContext';
import { findNearestNodeAtPath } from '../../utils/json/findNearestNodeAtPath';
import { getCursorContext } from '../../utils/json/getCursorContext';
import { findNearestObjectAtNode } from '../../utils/json/findNearestObjectAtPath';
import { ConflictAvoidance } from '../../utils/conflictAvoidance';

/**
 * Enregistre le provider de complétion pour les fichiers JSON avec patterns spécifiques
 * @param context Le contexte de l'extension
 * @param filePatterns Patterns de fichiers spécifiques (optionnel)
 */
export function registerCompletionProvider(
    context: vscode.ExtensionContext, 
    filePatterns?: Array<{ language: string; pattern: string }>
) {
    // Utilise des patterns spécifiques si fournis, sinon les patterns par défaut
    const documentSelector = filePatterns || [
        { language: "json", scheme: "file" }, 
        { language: "jsonc", scheme: "file" }
    ];

    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            documentSelector,
            {
                async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
                    // Vérification rapide : est-ce un fichier Minecraft ?
                    if (!ConflictAvoidance.shouldHandleDocument(document)) {
                        return [];
                    }

                    // Vérification : VS Code est-il encore en train de traiter le document ?
                    if (ConflictAvoidance.isVSCodeProcessingDocument(document)) {
                        // Attendre un court instant pour éviter les conflits
                        await ConflictAvoidance.waitForNativeValidation(document);
                    }

                    // On récupère le schéma à la position actuelle, le chemin et la valeur à cette position, et le schéma complet
                    const {path, schema: rawSchema, unresolvedSchema, valueAtPath, fullSchema} = getSchemaAtPosition(document, position);
                    
                    if (!rawSchema) { // Si pas de schéma trouvé, on ne propose rien
                        return [];
                    }

                    // Utilisation du nouveau système de validation pour résoudre le schéma
                    const validationResult: SchemaValidationResult = validateSchema(rawSchema, valueAtPath);
                    let resolvedNode = validationResult.matchedSchema || rawSchema;
                    
                    // IMPORTANT: Résolution supplémentaire des $ref pour l'autocomplétion
                    // Le système de validation ne résout pas toujours les $ref dans le contexte des definitions
                    // On utilise resolveSchemaAtPath qui gère correctement les $ref
                    let unresolvedNode = unresolvedSchema || rawSchema; // Utiliser unresolvedSchema de schemaContext
                    try {
                        const fullyResolvedSchema = resolveSchemaAtPath(fullSchema, path, valueAtPath);
                        if (fullyResolvedSchema && fullyResolvedSchema !== resolvedNode) {
                            resolvedNode = fullyResolvedSchema;
                        }
                    } catch (error) {
                        // Si la résolution échoue, on garde le schéma déjà résolu
                        console.debug('Error resolving schema with resolveSchemaAtPath:', error);
                    }
                    
                    if (!resolvedNode) { // Si pas de schéma résolu, on ne propose rien
                        return [];
                    }

                    const cursorContext = getCursorContext(document, position); // Récupère le contexte du curseur
                    

                    // Trouve le bon objet parent à partir du curseur
                    const rootNode = parseTree(document.getText());
                    const nodeAtCursor = rootNode ? findNearestNodeAtPath(rootNode, path) : undefined;
                    const parentObject = findNearestObjectAtNode(nodeAtCursor);

                    // Gestion intelligente des propriétés avec résolution oneOf améliorée
                    let propertiesForCompletion: any = resolvedNode.properties;

                    // Résolution manuelle spéciale pour les $ref vers definitions
                    if (resolvedNode?.$ref && resolvedNode.$ref.startsWith('#/definitions/')) {
                        const definitionPath = resolvedNode.$ref.slice(2).split('/'); // Enlever '#/' et diviser
                        let refSchema: any = fullSchema;
                        
                        for (const segment of definitionPath) {
                            if (refSchema && refSchema[segment]) {
                                refSchema = refSchema[segment];
                            } else {
                                refSchema = undefined;
                                break;
                            }
                        }
                        if (refSchema) {
                            resolvedNode = refSchema;
                            propertiesForCompletion = resolvedNode.properties;
                        } else {
                            // Si la référence n'est pas trouvée, on garde le schéma original
                        }
                    }

                    // NOUVEAU: Gestion spéciale des schémas oneOf pour l'autocomplétion
                    if ((resolvedNode?.oneOf || unresolvedNode?.oneOf) && !propertiesForCompletion) {
                        const allProperties: any = {};
                        
                        const oneOfSource = resolvedNode?.oneOf || unresolvedNode?.oneOf;
                        for (const branch of oneOfSource) {
                            if (branch?.properties) {
                                // Fusionner toutes les propriétés de toutes les branches oneOf
                                Object.assign(allProperties, branch.properties);
                            }
                        }
                        
                        if (Object.keys(allProperties).length > 0) {
                            propertiesForCompletion = allProperties;
                        }
                    }

                    // Cas spécial : si nous sommes dans un élément de tableau (path contient un nombre),
                    // nous devons vérifier si le schéma parent du tableau a un oneOf pour fusionner toutes les propriétés
                    const isInArrayElement = path.some(segment => typeof segment === 'number');
                    
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
                        
                        if (arraySchema?.items?.oneOf) {
                            // Utiliser la nouvelle logique intelligente pour les éléments de tableau oneOf
                            const mergedProperties = mergeOneOfPropertiesWithEnums(arraySchema.items.oneOf, valueAtPath);
                            propertiesForCompletion = mergedProperties;
                        } else if (arraySchema?.oneOf) {
                            // Utiliser la nouvelle logique intelligente pour les éléments de tableau oneOf
                            const mergedProperties = mergeOneOfPropertiesWithEnums(arraySchema.oneOf, valueAtPath);
                            propertiesForCompletion = mergedProperties;
                        } else if (rawSchema?.properties) {
                            // Si pas de oneOf au niveau du tableau mais rawSchema a des propriétés,
                            // c'est que la résolution oneOf a déjà été faite
                            propertiesForCompletion = rawSchema.properties;
                        }
                    }
                    // Pour les objets normaux (non dans des tableaux), utiliser la logique existante
                    else if (rawSchema.oneOf && typeof valueAtPath === "object" && valueAtPath !== null) {
                        // Nouvelle logique améliorée pour oneOf avec fusion intelligente des enums
                        const mergedProperties = mergeOneOfPropertiesWithEnums(rawSchema.oneOf, valueAtPath);
                        propertiesForCompletion = Object.assign({}, propertiesForCompletion || {}, mergedProperties);
                    }

                    // Déterminer le schéma pour les valeurs (nécessaire pour la détection précoce)
                    // Utiliser unresolvedNode pour préserver les oneOf non résolus
                    let schemaForValues = unresolvedNode?.oneOf ? unresolvedNode : (resolvedNode ?? rawSchema);
                    
                    // NOUVELLE LOGIQUE: Gestion spéciale pour les arrays avec items positionnels ET uniformes
                    // Le problème est que rawSchema peut déjà être résolu au niveau de l'élément final
                    // Nous devons analyser le fullSchema avec le path pour trouver les oneOf dans les items
                    if (cursorContext.isInArrayElement && path.length >= 2) {
                        console.debug('Analyzing array items for oneOf (positional + uniform)...');
                        
                        // Reconstruire le schéma en naviguant dans fullSchema avec le path
                        let currentSchema: any = fullSchema;
                        let navigationPath: any[] = [];
                        
                        for (let i = 0; i < path.length; i++) {
                            const segment = path[i];
                            navigationPath.push(segment);
                            
                            console.debug(`Navigation step ${i}: segment="${segment}", currentSchema type:`, currentSchema?.type);
                            
                            if (typeof segment === 'number') {
                                // C'est un index de tableau
                                if (currentSchema?.items) {
                                    console.debug(`  -> Array items detected, isArray:`, Array.isArray(currentSchema.items));
                                    
                                    // CAS 1: Items positionnels (items: [schema1, schema2, ...])
                                    if (Array.isArray(currentSchema.items)) {
                                        // Items positionnels : utiliser le schéma à l'index spécifique
                                        if (segment < currentSchema.items.length) {
                                            const positionalSchema = currentSchema.items[segment];
                                            console.debug(`  -> Using positional schema at index ${segment}:`, {
                                                hasOneOf: !!positionalSchema?.oneOf,
                                                schema: positionalSchema
                                            });
                                            
                                            // Si c'est le dernier segment du path (notre position finale)
                                            // ET que ce schéma positionnel a un oneOf, l'utiliser !
                                            if (i === path.length - 1 && positionalSchema?.oneOf) {
                                                console.debug('🎯 Found oneOf in positional schema!');
                                                schemaForValues = positionalSchema;
                                                break;
                                            }
                                            
                                            currentSchema = positionalSchema;
                                        } else {
                                            console.debug(`  -> Index ${segment} out of bounds for positional items`);
                                            break;
                                        }
                                    } 
                                    // CAS 2: Items uniformes (items: {oneOf: [...]}) 
                                    else {
                                        console.debug(`  -> Using uniform items schema:`, {
                                            hasOneOf: !!currentSchema.items?.oneOf,
                                            itemsSchema: currentSchema.items
                                        });
                                        
                                        // Si c'est le dernier segment du path ET que les items ont un oneOf, l'utiliser !
                                        if (i === path.length - 1 && currentSchema.items?.oneOf) {
                                            console.debug('🎯 Found oneOf in uniform items schema!');
                                            schemaForValues = currentSchema.items;
                                            break;
                                        }
                                        
                                        // Items uniforme : tous les éléments ont le même schéma
                                        currentSchema = currentSchema.items;
                                    }
                                } 
                                // CAS 3: Pas d'items direct, mais oneOf qui peut contenir une branche array
                                else if (currentSchema?.oneOf) {
                                    console.debug(`  -> No direct items, but oneOf detected. Looking for array branch...`);
                                    
                                    // Chercher la branche array dans le oneOf
                                    let arrayBranch = null;
                                    for (const branch of currentSchema.oneOf) {
                                        if (branch?.type === 'array' && branch.items) {
                                            arrayBranch = branch;
                                            console.debug(`  -> Found array branch in oneOf:`, {
                                                hasItems: !!branch.items,
                                                itemsHasOneOf: !!branch.items?.oneOf
                                            });
                                            break;
                                        }
                                    }
                                    
                                    if (arrayBranch) {
                                        // Si c'est le dernier segment ET que cette branche array a des items avec oneOf
                                        if (i === path.length - 1 && arrayBranch.items?.oneOf) {
                                            console.debug('🎯 Found oneOf in array branch items!');
                                            schemaForValues = arrayBranch.items;
                                            break;
                                        }
                                        
                                        // Continuer la navigation avec les items de la branche array
                                        currentSchema = arrayBranch.items;
                                    } else {
                                        console.debug(`  -> No array branch found in oneOf`);
                                        break;
                                    }
                                } 
                                else {
                                    console.debug(`  -> No items found for array index ${segment}`);
                                    break;
                                }
                            } else {
                                // C'est une propriété
                                if (currentSchema?.properties && currentSchema.properties[segment]) {
                                    currentSchema = currentSchema.properties[segment];
                                    console.debug(`  -> Found property ${segment}`);
                                } else if (currentSchema?.oneOf) {
                                    // Chercher dans les branches oneOf
                                    let found = false;
                                    for (const branch of currentSchema.oneOf) {
                                        if (branch?.properties && branch.properties[segment]) {
                                            currentSchema = branch.properties[segment];
                                            console.debug(`  -> Found ${segment} in oneOf branch`);
                                            found = true;
                                            break;
                                        }
                                    }
                                    if (!found) {
                                        console.debug(`  -> Property ${segment} not found in any oneOf branch`);
                                        break;
                                    }
                                } else {
                                    console.debug(`  -> Property ${segment} not found`);
                                    break;
                                }
                            }
                        }
                    }
                    
                    // NOUVEAU: Gestion spéciale des tableaux vides
                    // Quand on est dans un tableau vide "[]", il n'y a pas d'index numérique dans le path
                    // mais cursorContext.isInArrayElement est true
                    if (cursorContext.isInArrayElement && !path.some(p => typeof p === 'number')) {
                        console.debug('🔍 Detected empty array context, looking for array schema...');
                        
                        // Naviguer dans fullSchema pour trouver le schéma du tableau actuel
                        let currentSchema: any = fullSchema;
                        for (const segment of path) {
                            if (typeof segment === 'string') {
                                if (currentSchema?.properties && currentSchema.properties[segment]) {
                                    currentSchema = currentSchema.properties[segment];
                                    console.debug(`  -> Found property ${segment}`);
                                } else if (currentSchema?.oneOf) {
                                    // Chercher dans les branches oneOf
                                    let found = false;
                                    for (const branch of currentSchema.oneOf) {
                                        if (branch?.properties && branch.properties[segment]) {
                                            currentSchema = branch.properties[segment];
                                            console.debug(`  -> Found ${segment} in oneOf branch`);
                                            found = true;
                                            break;
                                        }
                                    }
                                    if (!found) {
                                        console.debug(`  -> Property ${segment} not found in any oneOf branch`);
                                        currentSchema = null;
                                        break;
                                    }
                                } else {
                                    console.debug(`  -> Property ${segment} not found`);
                                    currentSchema = null;
                                    break;
                                }
                            }
                        }
                        
                        if (currentSchema) {
                            console.debug('Found array schema:', {
                                hasOneOf: !!currentSchema.oneOf,
                                type: currentSchema.type,
                                schema: currentSchema
                            });
                            
                            // Si c'est un oneOf, chercher la branche array
                            if (currentSchema.oneOf) {
                                for (const branch of currentSchema.oneOf) {
                                    if (branch?.type === 'array' && branch.items) {
                                        console.debug('🎯 Found array branch in oneOf for empty array!');
                                        schemaForValues = branch.items;
                                        break;
                                    }
                                }
                            }
                            // Si c'est directement un array
                            else if (currentSchema.type === 'array' && currentSchema.items) {
                                console.debug('🎯 Found direct array schema for empty array!');
                                schemaForValues = currentSchema.items;
                            }
                        }
                    }
                    
                    // Fallback original pour la rétrocompatibilité
                    if (cursorContext.isInArrayElement && rawSchema.items) {
                        // DEBUG: Analyser la structure des items pour arrays positionnels
                        console.debug('Array items analysis (fallback):', {
                            itemsIsArray: Array.isArray(rawSchema.items),
                            itemsLength: Array.isArray(rawSchema.items) ? rawSchema.items.length : 'N/A',
                            path,
                            lastPathElement: path[path.length - 1],
                            isLastPathElementNumber: typeof path[path.length - 1] === 'number'
                        });
                        
                        // Gestion spéciale pour les arrays avec items positionnels (items: [schema1, schema2, ...])
                        if (Array.isArray(rawSchema.items)) {
                            const arrayIndex = path[path.length - 1];
                            if (typeof arrayIndex === 'number' && arrayIndex < rawSchema.items.length) {
                                const fallbackSchema = rawSchema.items[arrayIndex];
                                if (!schemaForValues?.oneOf && fallbackSchema?.oneOf) {
                                    schemaForValues = fallbackSchema;
                                    console.debug('Using positional item schema (fallback):', {
                                        arrayIndex,
                                        selectedSchema: schemaForValues,
                                        hasOneOf: !!schemaForValues?.oneOf
                                    });
                                }
                            }
                        }
                    }

                    // DEBUG: Vérifier le schéma pour les valeurs
                    console.debug('SchemaForValues DEBUG:', {
                        schemaForValuesHasOneOf: !!schemaForValues?.oneOf,
                        schemaForValuesType: schemaForValues?.type,
                        schemaForValuesOneOfLength: schemaForValues?.oneOf?.length,
                        unresolvedNodeHasOneOf: !!unresolvedNode?.oneOf,
                        firstBranch: schemaForValues?.oneOf?.[0]
                    });
                    
                    // DEBUG: Vérifier le contenu détaillé du oneOf
                    if (schemaForValues?.oneOf) {
                        console.debug('OneOf branches detailed:', {
                            totalBranches: schemaForValues.oneOf.length,
                            branch0: schemaForValues.oneOf[0],
                            branch1: schemaForValues.oneOf[1]
                        });
                    }

                    // COMPLETION DE PROPRIÉTÉS (CLÉS)
                    // Amélioration : éviter la completion de propriétés quand on est dans une valeur string d'un tableau
                    const isStringValueInArray = cursorContext.isInArrayElement && cursorContext.isInQuotes && 
                        (schemaForValues?.type === 'string' || 
                         // NOUVEAU: Vérifier si le oneOf contient une branche string avec x-dynamic-examples-source
                         (schemaForValues?.oneOf && schemaForValues.oneOf.some((branch: any) => 
                             branch?.type === 'string' && "x-dynamic-examples-source" in branch)));
                        
                    // Nouvelle amélioration : détecter quand on est dans des guillemets dans un array qui attend des objets
                    const isInvalidStringInObjectArray = cursorContext.isInArrayElement && cursorContext.isInQuotes &&
                        schemaForValues?.type === 'object';
                    
                    // Solution universelle : détecter précisément quand on nomme une clé libre d'additionalProperties
                    const isInsideExistingObject = typeof valueAtPath === 'object' && valueAtPath !== null;
                    
                    // Fonction pour détecter si on est dans un contexte additionalProperties avec x-key-suggestions
                    const getAdditionalPropertiesContext = () => {
                        // Vérifier si on est dans un contexte où on peut taper une clé d'objet
                        const isTypingKey = (cursorContext.isStartOfProperty || 
                                           cursorContext.isInQuotes || 
                                           cursorContext.isProbablyKeyWithoutQuotes) && 
                                          !cursorContext.isAfterColon && 
                                          !cursorContext.isTypingValue;
                        
                        if (!isTypingKey) return null;
                        
                        // Ne pas traiter si on est clairement dans un objet existant avec des propriétés définies
                        if (isInsideExistingObject && typeof valueAtPath === 'object' && valueAtPath !== null) {
                            // Vérifier si c'est un objet vide {} - dans ce cas, on peut proposer des clés
                            const isEmptyObject = Object.keys(valueAtPath).length === 0;
                            if (!isEmptyObject) return null;
                        }
                        
                        // Obtenir le chemin vers le schéma parent (l'objet qui contient additionalProperties)
                        let parentPath = path.slice();
                        
                        // Si le dernier élément du path est une clé string qu'on est en train de taper, l'enlever
                        if (parentPath.length > 0 && typeof parentPath[parentPath.length - 1] === 'string') {
                            parentPath = parentPath.slice(0, -1);
                        }
                        
                        let currentSchema: any = fullSchema;
                        
                        // Naviguer jusqu'à la section parent
                        for (const segment of parentPath) {
                            if (typeof segment === 'number') {
                                currentSchema = currentSchema?.items;
                            } else {
                                currentSchema = currentSchema?.properties?.[segment];
                            }
                            if (!currentSchema) return null;
                        }
                        
                        // Vérifier si cette section a additionalProperties
                        if (!currentSchema?.additionalProperties) return null;
                        
                        // Si on a une clé spécifique et qu'elle est définie dans properties, ce n'est pas additionalProperties
                        const currentKey = path[path.length - 1];
                        if (typeof currentKey === 'string' && 
                            currentSchema?.properties && 
                            currentSchema.properties[currentKey]) {
                            return null; // C'est une propriété définie, pas additionalProperties
                        }
                        
                        return {
                            schema: currentSchema,
                            hasKeySuggestions: !!currentSchema["x-key-suggestions"]
                        };
                    };
                    
                    const additionalPropsContext = getAdditionalPropertiesContext();
                    const isNamingAdditionalPropertyKey = !!additionalPropsContext && !additionalPropsContext.hasKeySuggestions;
                    const isNamingKeyWithSuggestions = !!additionalPropsContext && additionalPropsContext.hasKeySuggestions;
                    
                    // DEBUG: Ajouter des logs pour le debug
                    console.debug('AdditionalProperties Context:', {
                        additionalPropsContext,
                        isNamingAdditionalPropertyKey,
                        isNamingKeyWithSuggestions,
                        cursorContext: {
                            isStartOfProperty: cursorContext.isStartOfProperty,
                            isInQuotes: cursorContext.isInQuotes,
                            isProbablyKeyWithoutQuotes: cursorContext.isProbablyKeyWithoutQuotes,
                            isAfterColon: cursorContext.isAfterColon,
                            isTypingValue: cursorContext.isTypingValue
                        },
                        path,
                        valueAtPath,
                        isInsideExistingObject
                    });
                    
                    // NOUVEAU: Bloquer la completion de propriétés dans les tableaux vides quand string est possible
                    const isInEmptyArrayWithStringOption = cursorContext.isInArrayElement && 
                        !cursorContext.isInQuotes && 
                        !path.some(p => typeof p === 'number') && // Tableau vide (pas d'index)
                        schemaForValues?.oneOf && 
                        schemaForValues.oneOf.some((branch: any) => branch?.type === 'string');
                    
                    console.debug('Empty array detection:', {
                        isInArrayElement: cursorContext.isInArrayElement,
                        isInQuotes: cursorContext.isInQuotes,
                        hasNumericIndex: path.some(p => typeof p === 'number'),
                        hasOneOf: !!schemaForValues?.oneOf,
                        hasStringBranch: schemaForValues?.oneOf?.some((branch: any) => branch?.type === 'string'),
                        isInEmptyArrayWithStringOption
                    });
                    
                    if (
                        propertiesForCompletion &&
                        parentObject?.type === 'object' &&
                        (cursorContext.isStartOfProperty || cursorContext.isInQuotes || cursorContext.isProbablyKeyWithoutQuotes) &&
                        !cursorContext.isAfterColon && !cursorContext.isTypingValue &&
                        !isStringValueInArray &&  // Array de strings : pas de completion de propriétés
                        !isInvalidStringInObjectArray &&  // Array d'objets avec guillemets : pas de completion du tout
                        !isNamingAdditionalPropertyKey &&  // Bloquer SEULEMENT les clés additionalProperties SANS suggestions
                        !isInEmptyArrayWithStringOption  // NOUVEAU: Bloquer dans les tableaux vides quand string est possible
                    ) {
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

                    // COMPLETION DES CLÉS ADDITIONALPROPERTIES AVEC X-KEY-SUGGESTIONS
                    if (isNamingKeyWithSuggestions) {
                        
                        const currentSchema = additionalPropsContext!.schema;
                        
                        // Vérifier si ce schéma a x-key-suggestions
                        if (currentSchema?.["x-key-suggestions"]) {
                            const keySuggestionSource = currentSchema["x-key-suggestions"];
                            let keySuggestions: string[] = [];
                            
                            // Collecter les suggestions de clés basées sur la source
                            switch (keySuggestionSource) {
                                case dynamicExamplesSourceKeys.block_ids:
                                    keySuggestions = await getBlockIds();
                                    break;
                                case dynamicExamplesSourceKeys.entity_ids:
                                    keySuggestions = await getEntityIds();
                                    break;
                                case dynamicExamplesSourceKeys.item_ids:
                                    keySuggestions = await getItemIds();
                                    break;
                                // Ajouter d'autres sources selon les besoins
                            }
                            
                            // Créer les items de completion pour les clés suggérées
                            if (keySuggestions.length > 0) {
                                // Obtenir les clés existantes pour éviter les doublons
                                const existingKeys = new Set<string>();
                                if (parentObject?.children) {
                                    for (const prop of parentObject.children) {
                                        const keyNode = prop.children?.[0];
                                        if (keyNode?.type === 'string') {
                                            existingKeys.add(keyNode.value);
                                        }
                                    }
                                }
                                
                                return keySuggestions
                                    .filter(key => !existingKeys.has(key))
                                    .map(key => {
                                        const item = new vscode.CompletionItem(key, vscode.CompletionItemKind.Property);
                                        item.sortText = '1'; // Légèrement moins priorité que les propriétés définies
                                        
                                        // Gestion intelligente des guillemets et insertion
                                        if (cursorContext.isInQuotes) {
                                            // L'utilisateur tape déjà dans des guillemets
                                            const snippet = generateAdvancedInsertTextForKey(key, currentSchema.additionalProperties);
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
                                            // L'utilisateur ne tape pas encore dans des guillemets
                                            item.insertText = generateAdvancedInsertTextForKey(key, currentSchema.additionalProperties);
                                            const wordRange = document.getWordRangeAtPosition(position);
                                            if (wordRange) {
                                                item.range = wordRange;
                                            }
                                        }

                                        // Documentation
                                        const additionalPropsDesc = currentSchema.additionalProperties?.description || 
                                                                   currentSchema.additionalProperties?.markdownDescription || '';
                                        if (additionalPropsDesc) {
                                            item.documentation = new vscode.MarkdownString(additionalPropsDesc);
                                        }

                                        // Détails sur le type attendu pour la valeur
                                        const typeInfo = getTypeInfo(currentSchema.additionalProperties);
                                        if (typeInfo) {
                                            item.detail = typeInfo;
                                        }

                                        return item;
                                    });
                            }
                        }
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
                            // CORRECTION: Supprimer la condition sur valueAtPath pour permettre la résolution
                            // des propriétés string avec x-dynamic-examples-source dans les schemas oneOf
                            else if (rawSchema.oneOf) {
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
                        
                        // NOUVEAU: Gestion des oneOf au niveau des valeurs de propriétés (avec support des oneOf imbriqués)
                        // Ceci résout le problème où une propriété peut être soit un string avec x-dynamic-examples-source
                        // soit un objet (comme dans les features: fill_with peut être string ou block_descriptor)
                        
                        // Fonction récursive pour collecter les sources dynamiques dans les oneOf imbriqués
                        const collectDynamicSourcesFromSchema = async (schema: any): Promise<void> => {
                            if (!schema) return;
                            
                            // Vérifier si ce schéma a directement x-dynamic-examples-source
                            if ("x-dynamic-examples-source" in schema) {
                                const sources = Array.isArray(schema["x-dynamic-examples-source"])
                                    ? schema["x-dynamic-examples-source"]
                                    : [schema["x-dynamic-examples-source"]];
                                
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
                                        case dynamicExamplesSourceKeys.camera_preset_ids:
                                            dynamicExamples.push(...await getCameraPresetIds());
                                            break;
                                        case dynamicExamplesSourceKeys.dimension_ids:
                                            dynamicExamples.push(...await getDimensionIds());
                                            break;
                                        case dynamicExamplesSourceKeys.entity_family_ids:
                                            dynamicExamples.push(...await getEntityFamilyIds());
                                            break;
                                        case dynamicExamplesSourceKeys.trading_file_paths:
                                            dynamicExamples.push(...await getTradingFilePaths());
                                            break;
                                    }
                                }
                            }
                            
                            // Vérifier récursivement dans les oneOf imbriqués
                            if (schema.oneOf && Array.isArray(schema.oneOf)) {
                                for (const branch of schema.oneOf) {
                                    await collectDynamicSourcesFromSchema(branch);
                                }
                            }
                        };
                        
                        // Appeler la fonction pour collecter les sources dynamiques
                        if (schemaForValues.oneOf && Array.isArray(schemaForValues.oneOf)) {
                            await collectDynamicSourcesFromSchema(schemaForValues);
                        }
                        // Gestion classique pour les schémas sans oneOf
                        else if ("x-dynamic-examples-source" in schemaForValues) {
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
                                    case dynamicExamplesSourceKeys.camera_preset_ids:
                                        dynamicExamples.push(...await getCameraPresetIds());
                                        break;
                                    case dynamicExamplesSourceKeys.dimension_ids:
                                        dynamicExamples.push(...await getDimensionIds());
                                        break;
                                    case dynamicExamplesSourceKeys.entity_family_ids:
                                        dynamicExamples.push(...await getEntityFamilyIds());
                                        break;
                                    case dynamicExamplesSourceKeys.trading_file_paths:
                                        dynamicExamples.push(...await getTradingFilePaths());
                                        break;
                                }
                            }
                        }

                        // Collecte de toutes les valeurs possibles
                        let rawValues: any[] = [...dynamicExamples];
                        
                        // NOUVEAU: Gestion des oneOf pour collecter toutes les valeurs possibles
                        if (schemaForValues.oneOf && Array.isArray(schemaForValues.oneOf)) {
                            // Collecter les enum, examples, const, default de toutes les branches oneOf
                            for (const branch of schemaForValues.oneOf) {
                                if (branch) {
                                    rawValues.push(
                                        ...(branch.enum ?? []),
                                        ...(branch.examples ?? []),
                                        ...(branch.const !== undefined ? [branch.const] : []),
                                        ...(branch.default !== undefined ? [branch.default] : [])
                                    );
                                }
                            }
                        } else {
                            // Gestion classique pour les schémas sans oneOf
                            rawValues.push(
                                ...(schemaForValues.enum ?? []),
                                ...(schemaForValues.examples ?? []),
                                ...(schemaForValues.const !== undefined ? [schemaForValues.const] : []),
                                ...(schemaForValues.default !== undefined ? [schemaForValues.default] : [])
                            );
                        }
                        
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

/**
 * Fusionne intelligemment les propriétés des branches oneOf en combinant les enums
 * des propriétés ayant le même nom
 */
function mergeOneOfPropertiesWithEnums(oneOfBranches: any[], currentValue: any): any {
    const mergedProperties: any = {};
    const propertyEnums: { [key: string]: Set<any> } = {};
    
    // Collecter toutes les propriétés et leurs enums
    oneOfBranches.forEach(branch => {
        if (!branch || !branch.properties) return;
        
        Object.keys(branch.properties).forEach(propName => {
            const propSchema = branch.properties[propName];
            
            // Si cette propriété n'existe pas encore, l'ajouter
            if (!mergedProperties[propName]) {
                mergedProperties[propName] = { ...propSchema };
                
                // Initialiser le set d'enums si la propriété a un enum
                if (propSchema.enum && Array.isArray(propSchema.enum)) {
                    propertyEnums[propName] = new Set(propSchema.enum);
                }
            } else {
                // La propriété existe déjà, fusionner les enums si applicable
                if (propSchema.enum && Array.isArray(propSchema.enum)) {
                    if (!propertyEnums[propName]) {
                        propertyEnums[propName] = new Set();
                    }
                    propSchema.enum.forEach((enumValue: any) => {
                        propertyEnums[propName].add(enumValue);
                    });
                }
                
                // Fusionner les autres propriétés du schéma (description, etc.)
                mergedProperties[propName] = {
                    ...mergedProperties[propName],
                    ...propSchema
                };
            }
        });
    });
    
    // Appliquer les enums fusionnés
    Object.keys(propertyEnums).forEach(propName => {
        if (propertyEnums[propName].size > 0) {
            mergedProperties[propName].enum = Array.from(propertyEnums[propName]);
        }
    });
    
    return mergedProperties;
}