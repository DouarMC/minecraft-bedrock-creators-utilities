import * as vscode from 'vscode';
import { ParseError, Node } from 'jsonc-parser';
import { getVersionedSchemaForFile } from './versioning/getVersionedSchemaForFile';
import { validateSchema, SchemaValidationResult } from '../../utils/json/validation';
import { getSchemaAtNodePath } from './versioning/schemaContext';
import { walkJsonTree } from '../../utils/json/walkJsonTree';
import { getJsonTree } from '../../utils/json/optimizedParsing';

export function registerValidationJson(context: vscode.ExtensionContext) {
    const diagnostics = vscode.languages.createDiagnosticCollection("minecraft-bedrock-creators-utilities.jsonValidation");
    context.subscriptions.push(diagnostics);

    vscode.workspace.onDidOpenTextDocument(doc => validateDocument(doc, diagnostics));
    vscode.workspace.onDidChangeTextDocument(e => validateDocument(e.document, diagnostics));
    vscode.workspace.textDocuments.forEach(doc => validateDocument(doc, diagnostics));
}

function validateDocument(document: vscode.TextDocument, diagnostics: vscode.DiagnosticCollection) {
    // Si le document n'est pas un JSON, on ne fait rien
    if (document.languageId !== 'json' && document.languageId !== 'jsonc') {
        diagnostics.delete(document.uri);
        return;
    }

    const schema = getVersionedSchemaForFile(document);
    if (!schema) {
        diagnostics.delete(document.uri);
        return;
    }

    const allDiagnostics: vscode.Diagnostic[] = [];
    const parseErrors: ParseError[] = [];
    
    // Utilisation du parsing optimisé avec cache
    const root = getJsonTree(document);
    if (!root) {
        diagnostics.delete(document.uri);
        return;
    }

    // Explore le JSON en utilisant une fonction récursive pour valider chaque noeud
    walkJsonTree(root, (node, path) => {
        if (!node || node.type === undefined) {
            return;
        }

        const { schema: resolvedSchema, valueAtPath } = getSchemaAtNodePath(document, node, path);
        const validationResult: SchemaValidationResult = validateSchema(resolvedSchema, valueAtPath);

        // Traitement des erreurs avec le nouveau système
        for (const validationError of validationResult.errors) {
            const diagnostic = new vscode.Diagnostic(
                toRange(document, node),
                validationError.error,
                getDiagnosticSeverity(validationError.code)
            );

            // Ajouter des informations supplémentaires du nouveau système
            if (validationError.code) {
                diagnostic.code = validationError.code;
            }
            
            if (validationError.path) {
                diagnostic.source = `JSON Schema (${validationError.path})`;
            } else {
                diagnostic.source = 'JSON Schema';
            }

            // Ajouter métadonnées pour le filtrage intelligent
            (diagnostic as any)._nodePath = path;
            (diagnostic as any)._nodeType = node.type;
            (diagnostic as any)._errorCode = validationError.code;

            allDiagnostics.push(diagnostic);
        }
    });

    // Filtrage intelligent des diagnostics redondants
    const filteredDiagnostics = filterRedundantDiagnostics(allDiagnostics);
    diagnostics.set(document.uri, filteredDiagnostics);
}

/**
 * Filtre les diagnostics redondants pour éviter les doublons entre parents et enfants
 * @param diagnostics Tous les diagnostics collectés
 * @returns Diagnostics filtrés sans redondances
 */
function filterRedundantDiagnostics(diagnostics: vscode.Diagnostic[]): vscode.Diagnostic[] {
    // Grouper les diagnostics par position pour identifier les chevauchements
    const diagnosticsByPosition = new Map<string, vscode.Diagnostic[]>();
    
    for (const diagnostic of diagnostics) {
        const positionKey = `${diagnostic.range.start.line},${diagnostic.range.start.character}-${diagnostic.range.end.line},${diagnostic.range.end.character}`;
        if (!diagnosticsByPosition.has(positionKey)) {
            diagnosticsByPosition.set(positionKey, []);
        }
        diagnosticsByPosition.get(positionKey)!.push(diagnostic);
    }

    const filteredDiagnostics: vscode.Diagnostic[] = [];

    // Traiter chaque groupe de diagnostics à la même position
    for (const [positionKey, positionDiagnostics] of diagnosticsByPosition) {
        if (positionDiagnostics.length === 1) {
            // Une seule erreur à cette position, on la garde
            filteredDiagnostics.push(positionDiagnostics[0]);
            continue;
        }

        // Plusieurs erreurs à la même position, appliquer la logique de filtrage
        const filtered = filterDiagnosticsAtSamePosition(positionDiagnostics);
        filteredDiagnostics.push(...filtered);
    }

    // Filtrage global : éviter les erreurs de propagation entre parent/enfant
    return filterParentChildRedundancy(filteredDiagnostics);
}

/**
 * Filtre les diagnostics à la même position en gardant les plus spécifiques
 */
function filterDiagnosticsAtSamePosition(diagnostics: vscode.Diagnostic[]): vscode.Diagnostic[] {
    // Prioriser par spécificité : leaf nodes > parent nodes
    const priorityOrder = ['string', 'number', 'boolean', 'null', 'property', 'array', 'object'];
    
    // Grouper par type de nœud
    const byNodeType = new Map<string, vscode.Diagnostic[]>();
    for (const diag of diagnostics) {
        const nodeType = (diag as any)._nodeType || 'unknown';
        if (!byNodeType.has(nodeType)) {
            byNodeType.set(nodeType, []);
        }
        byNodeType.get(nodeType)!.push(diag);
    }

    // Prendre le type le plus spécifique qui a des erreurs
    for (const nodeType of priorityOrder) {
        if (byNodeType.has(nodeType)) {
            const candidates = byNodeType.get(nodeType)!;
            
            // Si plusieurs erreurs du même type, prendre les plus critiques
            const critical = candidates.filter(d => 
                d.severity === vscode.DiagnosticSeverity.Error
            );
            
            if (critical.length > 0) {
                return critical;
            }
            
            // Sinon prendre les warnings
            const warnings = candidates.filter(d => 
                d.severity === vscode.DiagnosticSeverity.Warning
            );
            
            if (warnings.length > 0) {
                return warnings.slice(0, 1); // Limiter à 1 warning par position
            }
        }
    }

    // Fallback : prendre le premier diagnostic
    return [diagnostics[0]];
}

/**
 * Filtre les redondances entre nœuds parents et enfants
 */
function filterParentChildRedundancy(diagnostics: vscode.Diagnostic[]): vscode.Diagnostic[] {
    const filtered: vscode.Diagnostic[] = [];
    
    for (const diagnostic of diagnostics) {
        const nodePath = (diagnostic as any)._nodePath as string[] || [];
        const errorCode = (diagnostic as any)._errorCode as string;
        
        // Vérifier s'il y a un diagnostic plus spécifique (chemin plus long) avec le même type d'erreur
        const hasMoreSpecificError = diagnostics.some(other => {
            const otherPath = (other as any)._nodePath as string[] || [];
            const otherErrorCode = (other as any)._errorCode as string;
            
            // Si l'autre diagnostic a un chemin plus long (plus spécifique)
            // et commence par le même chemin, et a un code d'erreur similaire
            if (otherPath.length > nodePath.length && 
                isPathPrefix(nodePath, otherPath) &&
                areRelatedErrorCodes(errorCode, otherErrorCode)) {
                return true;
            }
            
            return false;
        });
        
        if (!hasMoreSpecificError) {
            filtered.push(diagnostic);
        }
    }
    
    return filtered;
}

/**
 * Vérifie si pathA est un préfixe de pathB
 */
function isPathPrefix(pathA: string[], pathB: string[]): boolean {
    if (pathA.length >= pathB.length) {
        return false;
    }
    
    for (let i = 0; i < pathA.length; i++) {
        if (pathA[i] !== pathB[i]) {
            return false;
        }
    }
    
    return true;
}

/**
 * Vérifie si deux codes d'erreur sont liés (même problème sous-jacent)
 */
function areRelatedErrorCodes(codeA: string, codeB: string): boolean {
    if (!codeA || !codeB) {
        return false;
    }
    
    // Codes qui sont liés par propagation parent-enfant
    const relatedGroups = [
        ['TYPE_MISMATCH'], // Erreur de type se propage
        ['ONEOF_NO_MATCH', 'ONEOF_MULTIPLE_MATCHES'], // Erreurs oneOf liées
        ['ANYOF_NO_MATCH'], // Erreur anyOf
        ['MISSING_REQUIRED_PROPERTIES'], // Propriétés manquantes
        ['ENUM_MISMATCH'] // Erreur d'énumération
    ];
    
    for (const group of relatedGroups) {
        if (group.includes(codeA) && group.includes(codeB)) {
            return true;
        }
    }
    
    return codeA === codeB;
}

function toRange(document: vscode.TextDocument, node: Node): vscode.Range {
    return new vscode.Range(
        document.positionAt(node.offset),
        document.positionAt(node.offset + node.length)
    );
}

/**
 * Détermine la sévérité du diagnostic basée sur le code d'erreur
 * @param errorCode Le code d'erreur du nouveau système de validation
 * @returns La sévérité appropriée pour VS Code
 */
function getDiagnosticSeverity(errorCode?: string): vscode.DiagnosticSeverity {
    if (!errorCode) {
        return vscode.DiagnosticSeverity.Warning;
    }

    // Erreurs critiques (Error)
    const criticalErrors = [
        'TYPE_MISMATCH',
        'ONEOF_MULTIPLE_MATCHES',
        'ONEOF_NO_MATCH',
        'ANYOF_NO_MATCH',
        'MISSING_REQUIRED_PROPERTIES',
        'ENUM_MISMATCH'
    ];

    // Erreurs de contraintes (Warning)
    const constraintErrors = [
        'STRING_TOO_SHORT',
        'STRING_TOO_LONG',
        'NUMBER_TOO_SMALL',
        'NUMBER_TOO_LARGE',
        'ARRAY_TOO_SHORT',
        'ARRAY_TOO_LONG',
        'PATTERN_MISMATCH',
        'NOT_MULTIPLE_OF',
        'ADDITIONAL_PROPERTIES_NOT_ALLOWED'
    ];

    // Informations (Info)
    const infoMessages = [
        'MAX_DEPTH_EXCEEDED',
        'INVALID_PATTERN',
        'ARRAY_ITEMS_NOT_UNIQUE'
    ];

    if (criticalErrors.includes(errorCode)) {
        return vscode.DiagnosticSeverity.Error;
    } else if (constraintErrors.includes(errorCode)) {
        return vscode.DiagnosticSeverity.Warning;
    } else if (infoMessages.includes(errorCode)) {
        return vscode.DiagnosticSeverity.Information;
    }

    // Par défaut, warning
    return vscode.DiagnosticSeverity.Warning;
}