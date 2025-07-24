import * as vscode from "vscode";
import { validateSchema } from "../../utils/json/validation";
import { getSchemaAtPosition } from "./versioning/schemaContext";

export function registerHoverProvider(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(
            [{ language: "json", scheme: "file" }, { language: "jsonc", scheme: "file" }],
            {
                provideHover(document, position) {
                    const { path, schema: rawSchema, fullSchema, valueAtPath } = getSchemaAtPosition(document, position);
                    if (!rawSchema || !fullSchema) {
                        return;
                    }

                    // Détection simple : on veut le hover uniquement sur les clés d'objets
                    if (!isHoveringOnPropertyKey(document, position)) {
                        return;
                    }

                    // Utilisation du système de validation pour résoudre le schéma
                    const validationResult = validateSchema(rawSchema, valueAtPath);
                    const resolvedSchema = validationResult.matchedSchema || rawSchema;

                    // Fournir le hover pour la propriété
                    return providePropertyHover(path, rawSchema, valueAtPath, resolvedSchema);
                }
            }
        )
    );
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
    resolvedSchema: any
): vscode.Hover | undefined {
    if (path.length === 0) return;

    const propertyName = path[path.length - 1] as string;
    
    // Pour le hover, le rawSchema/resolvedSchema EST déjà le schéma de la propriété
    // car getSchemaAtPosition nous retourne le schéma à la position exacte
    const propertySchema = resolvedSchema || rawSchema;
    
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