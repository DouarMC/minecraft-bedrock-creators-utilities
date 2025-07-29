import * as vscode from "vscode";
import { validateSchema } from "../../utils/json/validation";
import { getSchemaAtPosition } from "./versioning/schemaContext";
import { resolveSchemaAtPath } from "../../utils/json/resolveSchemaAtPath";
import { getJsonTree } from "../../utils/json/optimizedParsing";
import { parseTree } from "jsonc-parser";
import { nodeToValue } from "../../utils/json/nodeToValue";
import { ConflictAvoidance } from "../../utils/conflictAvoidance";

export function registerHoverProvider(
    context: vscode.ExtensionContext,
    filePatterns?: Array<{ language: string; pattern: string }>
) {
    // Utilise des patterns spécifiques si fournis, sinon les patterns par défaut
    const documentSelector = filePatterns || [
        { language: "json", scheme: "file" }, 
        { language: "jsonc", scheme: "file" }
    ];

    context.subscriptions.push(
        vscode.languages.registerHoverProvider(
            documentSelector,
            {
                provideHover(document, position) {
                    // Vérification rapide : est-ce un fichier Minecraft ?
                    if (!ConflictAvoidance.shouldHandleDocument(document)) {
                        return;
                    }

                    // Vérification : VS Code est-il encore en train de traiter le document ?
                    if (ConflictAvoidance.isVSCodeProcessingDocument(document)) {
                        return; // Laisser VS Code finir son traitement
                    }

                    const { path, schema: rawSchema, fullSchema, valueAtPath } = getSchemaAtPosition(document, position);
                    if (!rawSchema || !fullSchema) {
                        return;
                    }

                    // Détection simple : on veut le hover uniquement sur les clés d'objets
                    if (!isHoveringOnPropertyKey(document, position)) {
                        return;
                    }

                    // Récupérer le schéma original (avec oneOf intact) via la navigation brute
                    const unresolvedSchema = getUnresolvedSchema(fullSchema, path);

                    // Utilisation du système de validation pour résoudre le schéma
                    const validationResult = validateSchema(rawSchema, valueAtPath);
                    const resolvedSchema = validationResult.matchedSchema || rawSchema;

                    // Fournir le hover pour la propriété
                    return providePropertyHover(path, rawSchema, valueAtPath, resolvedSchema, unresolvedSchema);
                }
            }
        )
    );
}

/**
 * Récupère le schéma non-résolu (avant validation oneOf) directement du schéma de base
 */
// Récupère le schéma original (avec oneOf intact) en parcourant simplement les propriétés
function getUnresolvedSchema(fullSchema: any, path: (string | number)[]): any {
    if (path.length === 0) return null;
    let current: any = fullSchema;
    for (const segment of path) {
        if (typeof segment === 'string') {
            // Direct property
            if (current.properties && current.properties[segment]) {
                current = current.properties[segment];
                continue;
            }
            // Try oneOf/anyOf branches
            const branches = current.oneOf || current.anyOf;
            if (branches && Array.isArray(branches)) {
                let found = false;
                for (const branch of branches) {
                    if (branch.properties && branch.properties[segment]) {
                        current = branch.properties[segment];
                        found = true;
                        break;
                    }
                }
                if (found) continue;
            }
            return null;
        } else if (typeof segment === 'number') {
            // Array item index
            if (current.items) {
                if (Array.isArray(current.items)) {
                    current = current.items[segment] || current.items[0];
                } else {
                    current = current.items;
                }
                continue;
            }
            return null;
        } else {
            return null;
        }
    }
    return current;
}

/**
 * Récupère le schéma parent avec un oneOf intact, avant résolution
 */
function getParentSchemaWithOneOf(fullSchema: any, path: (string | number)[], valueAtPath: any): any {
    if (path.length === 0) return null;
    
    // Créer le chemin du parent (sans la dernière propriété)
    const parentPath = path.slice(0, -1);
    const propertyName = path[path.length - 1] as string;
    
    try {
        // Résoudre le schéma du parent
        const root = parseTree('{}'); 
        if (!root) return null;
        const rootValue = nodeToValue(root);
        
        let parentSchema = fullSchema?.baseSchema;
        if (!parentSchema) return null;
        
        // Naviguer vers le parent
        parentSchema = resolveSchemaAtPath(parentSchema, parentPath, rootValue);
        
        if (!parentSchema || !parentSchema.properties) return null;
        
        // Récupérer le schéma de la propriété AVANT résolution oneOf
        const propertySchema = parentSchema.properties[propertyName];
        
        // Si ce schéma a un oneOf/anyOf et que notre rawSchema n'en a pas,
        // alors on a perdu l'info du oneOf parent
        if (propertySchema && (propertySchema.oneOf || propertySchema.anyOf)) {
            return propertySchema;
        }
        
        return null;
    } catch (error) {
        console.warn('Erreur lors de la récupération du schéma parent:', error);
        return null;
    }
}

/**
 * Vérifie si le curseur est positionné sur une clé de propriété (et non sur une valeur)
 */
function isHoveringOnPropertyKey(document: vscode.TextDocument, position: vscode.Position): boolean {
    const line = document.lineAt(position.line).text;
    const beforeCursor = line.slice(0, position.character);
    const afterCursor = line.slice(position.character);

    // Vérifier si on est dans des guillemets AVANT un deux-points
    // Patterns à détecter : "ma_propriété"| : ou "ma_prop|été" :
    const isInQuotesBeforeColon = isInsideQuotes(beforeCursor, afterCursor) && 
                                 line.slice(position.character).includes(':');

    // Vérifier si on est juste après les guillemets d'une propriété
    // Pattern : "ma_propriété"|  :
    const isJustAfterPropertyQuotes = /"\s*$/.test(beforeCursor) && 
                                     /^\s*:/.test(afterCursor);

    return isInQuotesBeforeColon || isJustAfterPropertyQuotes;
}

/**
 * Vérifie si le curseur est à l'intérieur de guillemets
 */
function isInsideQuotes(beforeCursor: string, afterCursor: string): boolean {
    // Compter les guillemets non échappés avant le curseur
    let quoteCount = 0;
    for (let i = 0; i < beforeCursor.length; i++) {
        if (beforeCursor[i] === '"' && (i === 0 || beforeCursor[i-1] !== '\\')) {
            quoteCount++;
        }
    }
    
    // Si nombre impair, on est dans des guillemets
    const isInQuotes = quoteCount % 2 === 1;
    
    // Vérifier qu'il y a bien une fermeture de guillemets après
    const hasClosingQuote = afterCursor.includes('"');
    
    return isInQuotes && hasClosingQuote;
}

/**
 * Fournit des informations de hover pour les propriétés (clés d'objets)
 */
function providePropertyHover(
    path: (string | number)[],
    rawSchema: any,
    valueAtPath: any,
    resolvedSchema: any,
    unresolvedSchema?: any
): vscode.Hover | undefined {
    if (path.length === 0) return;

    const propertyName = path[path.length - 1] as string;
    
    // DEBUG: Ajoutons des informations pour comprendre le problème
    console.log('=== HOVER DEBUG ===');
    console.log('Property name:', propertyName);
    console.log('Raw schema:', rawSchema);
    console.log('Resolved schema:', resolvedSchema);
    console.log('Unresolved schema:', unresolvedSchema);
    console.log('Value at path:', valueAtPath);
    console.log('==================');
    
    // SOLUTION FINALE : Utiliser unresolvedSchema pour récupérer la description oneOf originale
    
    let propertySchema: any;
    
    // Si on a un unresolvedSchema avec oneOf/anyOf et que le rawSchema n'en a pas,
    // alors le oneOf a été résolu et on a perdu la description
    if (unresolvedSchema && (unresolvedSchema.oneOf || unresolvedSchema.anyOf) && 
        (!rawSchema?.oneOf && !rawSchema?.anyOf)) {
        
        propertySchema = {
            ...resolvedSchema,
            // Récupérer la description du schéma non-résolu (oneOf original)
            description: unresolvedSchema.description || resolvedSchema?.description,
            markdownDescription: unresolvedSchema.markdownDescription || resolvedSchema?.markdownDescription,
            title: unresolvedSchema.title || resolvedSchema?.title,
            examples: unresolvedSchema.examples || resolvedSchema?.examples,
            default: unresolvedSchema.default !== undefined ? unresolvedSchema.default : resolvedSchema?.default
        };
    } else if (rawSchema?.oneOf || rawSchema?.anyOf) {
        // Cas direct : le rawSchema a un oneOf/anyOf (cas où aucune branche n'est valide)
        propertySchema = {
            ...resolvedSchema,
            description: rawSchema.description || resolvedSchema?.description,
            markdownDescription: rawSchema.markdownDescription || resolvedSchema?.markdownDescription,
            title: rawSchema.title || resolvedSchema?.title,
            examples: rawSchema.examples || resolvedSchema?.examples
        };
    } else {
        // Cas normal : cloner le schéma résolu ou brut
        const base = resolvedSchema || rawSchema;
        propertySchema = { ...base };
    }
    
    if (!propertySchema) return;


    // Construire le contenu du hover
    const hoverContent = buildPropertyHoverContent(propertyName, propertySchema);
    
    if (hoverContent) {
        return new vscode.Hover(hoverContent);
    }

    return;
}

/**
 * Construit le contenu Markdown pour le hover d'une propriété
 */
function buildPropertyHoverContent(propertyName: string, propertySchema: any): vscode.MarkdownString | undefined {
    const markdown = new vscode.MarkdownString();
    markdown.isTrusted = true;

    // Titre avec le nom de la propriété
    markdown.appendMarkdown(`**${propertyName}**\n\n`);

    // Description principale
    const description = propertySchema.markdownDescription || propertySchema.description;
    if (description) {
        markdown.appendMarkdown(`${description}\n\n`);
    }

    // Informations sur le type
    const typeInfo = getDetailedTypeInfo(propertySchema);
    if (typeInfo) {
        markdown.appendMarkdown(`*${typeInfo}*\n\n`);
    }

    // Valeur par défaut
    if (propertySchema.default !== undefined) {
        markdown.appendMarkdown(`**Default:** \`${JSON.stringify(propertySchema.default)}\`\n\n`);
    }

    // Énumération
    if (propertySchema.enum && propertySchema.enum.length > 0) {
        const enumValues = propertySchema.enum.map((v: any) => `\`${JSON.stringify(v)}\``).join(', ');
        markdown.appendMarkdown(`**Allowed values:** ${enumValues}\n\n`);
    }

    // Exemples
    if (propertySchema.examples && propertySchema.examples.length > 0) {
        const examples = propertySchema.examples.map((v: any) => `\`${JSON.stringify(v)}\``).join(', ');
        markdown.appendMarkdown(`**Examples:** ${examples}\n\n`);
    }

    // Contraintes pour les nombres
    if (propertySchema.type === 'number' || propertySchema.type === 'integer') {
        const constraints = [];
        if (propertySchema.minimum !== undefined) constraints.push(`min: ${propertySchema.minimum}`);
        if (propertySchema.maximum !== undefined) constraints.push(`max: ${propertySchema.maximum}`);
        if (constraints.length > 0) {
            markdown.appendMarkdown(`**Constraints:** ${constraints.join(', ')}\n\n`);
        }
    }

    // Pattern pour les strings
    if (propertySchema.type === 'string' && propertySchema.pattern) {
        markdown.appendMarkdown(`**Pattern:** \`${propertySchema.pattern}\`\n\n`);
    }

    return markdown.value ? markdown : undefined;
}

/**
 * Retourne des informations détaillées sur le type d'un schéma
 */
function getDetailedTypeInfo(schema: any): string {
    if (!schema) return '';

    const type = schema.type;
    if (Array.isArray(type)) {
        return `Type: ${type.join(' | ')}`;
    }
    
    if (type) {
        let info = `Type: ${type}`;
        
        if (schema.enum) {
            info += ` (${schema.enum.length} options)`;
        }
        
        if (type === 'string' && schema.pattern) {
            info += ` (pattern)`;
        }
        
        if ((type === 'number' || type === 'integer') && (schema.minimum !== undefined || schema.maximum !== undefined)) {
            info += ` (constrained)`;
        }
        
        if (type === 'array' && schema.items) {
            info += ` (items)`;
        }

        if (type === 'object' && schema.properties) {
            const propCount = Object.keys(schema.properties).length;
            info += ` (${propCount} properties)`;
        }
        
        return info;
    }

    if (schema.oneOf) {
        return `OneOf (${schema.oneOf.length} options)`;
    }
    
    if (schema.anyOf) {
        return `AnyOf (${schema.anyOf.length} options)`;
    }

    if (schema.allOf) {
        return `AllOf (${schema.allOf.length} schemas)`;
    }

    return '';
}