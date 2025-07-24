import { 
    SchemaValidationResult, 
    SchemaError, 
    ValidationContext, 
    OneOfMatchResult 
} from '../types';
import type { ValidationEngine } from '../validationEngine';

/**
 * Validateur spécialisé pour oneOf avec logique de correspondance intelligente
 */
export class OneOfValidator {
    /**
     * Valide une valeur contre un schéma oneOf
     */
    static validate(
        schema: any, 
        value: any, 
        context: ValidationContext, 
        engine: ValidationEngine
    ): SchemaValidationResult {
        if (!Array.isArray(schema.oneOf)) {
            return {
                schema,
                errors: [{
                    error: "Le schéma oneOf doit être un tableau",
                    path: context.path.join('.'),
                    code: 'INVALID_ONEOF_SCHEMA'
                }],
                isValid: false
            };
        }

        const matchResult = this.findMatchingBranches(schema.oneOf, value, context, engine);

        // Correspondance exacte (exactement une branche)
        if (matchResult.matchedBranches === 1) {
            const matchedSchema = schema.oneOf[matchResult.matchingIndex!];
            return engine.validate(matchedSchema, value, context.path);
        }

        // Aucune correspondance
        if (matchResult.matchedBranches === 0) {
            return {
                schema,
                errors: [{
                    error: this.generateNoMatchError(matchResult),
                    path: context.path.join('.'),
                    code: 'ONEOF_NO_MATCH'
                }],
                isValid: false
            };
        }

        // Correspondances multiples
        return {
            schema,
            errors: [{
                error: this.generateMultipleMatchError(matchResult),
                path: context.path.join('.'),
                code: 'ONEOF_MULTIPLE_MATCHES'
            }],
            isValid: false
        };
    }

    /**
     * Trouve les branches correspondantes avec scoring intelligent
     */
    private static findMatchingBranches(
        branches: any[], 
        value: any, 
        context: ValidationContext, 
        engine: ValidationEngine
    ): OneOfMatchResult {
        const errorsPerBranch: SchemaError[][] = [];
        const matchingIndices: number[] = [];
        const scores: number[] = [];

        for (let i = 0; i < branches.length; i++) {
            const branch = branches[i];
            
            // Pré-validation stricte pour éliminer rapidement les branches incompatibles
            if (!this.isStrictMatch(branch, value)) {
                errorsPerBranch[i] = [{
                    error: "Ne correspond pas aux contraintes strictes de la branche",
                    path: context.path.join('.'),
                    code: 'STRICT_MATCH_FAILED'
                }];
                scores[i] = 0;
                continue;
            }

            // Validation complète de la branche
            const result = engine.validate(branch, value, context.path);
            errorsPerBranch[i] = result.errors;

            if (result.isValid) {
                matchingIndices.push(i);
                scores[i] = this.calculateMatchScore(branch, value);
            } else {
                scores[i] = this.calculatePartialScore(branch, value, result.errors);
            }
        }

        // Déterminer la meilleure correspondance
        let bestMatch: { index: number; score: number } | undefined;
        if (scores.length > 0) {
            const maxScore = Math.max(...scores);
            const bestIndex = scores.indexOf(maxScore);
            bestMatch = { index: bestIndex, score: maxScore };
        }

        return {
            matchedBranches: matchingIndices.length,
            matchingIndex: matchingIndices.length === 1 ? matchingIndices[0] : undefined,
            errorsPerBranch,
            bestMatch
        };
    }

    /**
     * Validation stricte préliminaire pour éliminer rapidement les branches incompatibles
     */
    private static isStrictMatch(schema: any, value: any): boolean {
        // Vérification du type racine
        if (schema.type && !this.isValueOfType(value, schema.type)) {
            return false;
        }
        
        // Vérification de l'enum racine
        if (schema.enum && !schema.enum.includes(value)) {
            return false;
        }
        
        // Vérifications spécifiques aux objets
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            return this.isStrictObjectMatch(schema, value);
        }
        
        // Vérifications spécifiques aux tableaux
        if (Array.isArray(value)) {
            return this.isStrictArrayMatch(schema, value);
        }
        
        return true;
    }

    /**
     * Validation stricte pour les objets
     */
    private static isStrictObjectMatch(schema: any, value: any): boolean {
        // Vérifier les propriétés avec enum
        if (schema.properties) {
            for (const [propName, propSchema] of Object.entries(schema.properties)) {
                if (propName in value && (propSchema as any).enum) {
                    const propValue = value[propName];
                    if (!(propSchema as any).enum.includes(propValue)) {
                        return false;
                    }
                }
            }
        }
        
        // Vérifier additionalProperties si strictement défini à false
        if (schema.additionalProperties === false && schema.properties) {
            const allowedProps = Object.keys(schema.properties);
            const actualProps = Object.keys(value);
            if (actualProps.some(prop => !allowedProps.includes(prop))) {
                return false;
            }
        }
        
        // Vérifier les propriétés requises critiques
        if (schema.required) {
            const criticalRequired = schema.required.filter((key: string) => 
                schema.properties?.[key]?.enum || schema.properties?.[key]?.const
            );
            if (criticalRequired.some((key: string) => !(key in value))) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * Validation stricte pour les tableaux
     */
    private static isStrictArrayMatch(schema: any, value: any[]): boolean {
        // Vérification des contraintes de longueur
        if (schema.minItems !== undefined && value.length < schema.minItems) {
            return false;
        }
        if (schema.maxItems !== undefined && value.length > schema.maxItems) {
            return false;
        }
        
        return true;
    }

    /**
     * Calcule un score de correspondance pour une branche valide
     */
    private static calculateMatchScore(schema: any, value: any): number {
        let score = 1.0; // Score de base pour une correspondance valide
        
        // Bonus pour la spécificité du type
        if (schema.type) {
            const types = Array.isArray(schema.type) ? schema.type : [schema.type];
            score += 0.1 / types.length; // Plus spécifique = score plus élevé
        }
        
        // Bonus pour les contraintes enum
        if (schema.enum) {
            score += 0.2;
        }
        
        // Bonus pour les propriétés spécifiques dans les objets
        if (typeof value === 'object' && value !== null && schema.properties) {
            const matchingProps = Object.keys(value).filter(key => 
                schema.properties[key] !== undefined
            );
            score += matchingProps.length * 0.05;
        }
        
        // Bonus pour additionalProperties: false (plus strict)
        if (schema.additionalProperties === false) {
            score += 0.1;
        }
        
        return score;
    }

    /**
     * Calcule un score partiel pour une branche invalide (pour diagnostics)
     */
    private static calculatePartialScore(schema: any, value: any, errors: SchemaError[]): number {
        let score = 0;
        
        // Score basé sur le type
        if (schema.type && this.isValueOfType(value, schema.type)) {
            score += 0.3;
        }
        
        // Pénalité basée sur le nombre d'erreurs
        score -= errors.length * 0.1;
        
        return Math.max(0, score);
    }

    /**
     * Génère un message d'erreur détaillé pour aucune correspondance
     */
    private static generateNoMatchError(result: OneOfMatchResult): string {
        if (result.bestMatch) {
            const bestErrors = result.errorsPerBranch[result.bestMatch.index];
            const mainError = bestErrors.length > 0 ? bestErrors[0].error : "Erreur inconnue";
            return `Aucune des variantes 'oneOf' ne correspond. La plus proche (branche ${result.bestMatch.index + 1}) échoue : ${mainError}`;
        }
        
        return `Aucune des variantes 'oneOf' ne correspond à la valeur fournie.`;
    }

    /**
     * Génère un message d'erreur pour correspondances multiples
     */
    private static generateMultipleMatchError(result: OneOfMatchResult): string {
        return `L'objet correspond à plusieurs branches 'oneOf' (${result.matchedBranches} correspondances), ce qui n'est pas autorisé par JSON Schema.`;
    }

    /**
     * Vérifie si une valeur correspond à un type donné
     */
    private static isValueOfType(value: any, type: string | string[]): boolean {
        const types = Array.isArray(type) ? type : [type];
        return types.some(t => {
            switch (t) {
                case 'string': return typeof value === 'string';
                case 'number': return typeof value === 'number';
                case 'integer': return typeof value === 'number' && Number.isInteger(value);
                case 'boolean': return typeof value === 'boolean';
                case 'object': return typeof value === 'object' && value !== null && !Array.isArray(value);
                case 'array': return Array.isArray(value);
                case 'null': return value === null;
                case 'molang': return ['string', 'number', 'boolean'].includes(typeof value);
                default: return false;
            }
        });
    }
}
