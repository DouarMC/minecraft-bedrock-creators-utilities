import { 
    SchemaValidationResult, 
    SchemaError, 
    ValidationContext, 
    AnyOfMatchResult 
} from '../types';
import type { ValidationEngine } from '../validationEngine';

/**
 * Validateur spécialisé pour anyOf avec logique de correspondance optimisée
 */
export class AnyOfValidator {
    /**
     * Valide une valeur contre un schéma anyOf
     */
    static validate(
        schema: any, 
        value: any, 
        context: ValidationContext, 
        engine: ValidationEngine
    ): SchemaValidationResult {
        if (!Array.isArray(schema.anyOf)) {
            return {
                schema,
                errors: [{
                    error: "Le schéma anyOf doit être un tableau",
                    path: context.path.join('.'),
                    code: 'INVALID_ANYOF_SCHEMA'
                }],
                isValid: false
            };
        }

        const matchResult = this.findMatchingBranches(schema.anyOf, value, context, engine);

        // Au moins une correspondance trouvée
        if (matchResult.hasMatch) {
            const bestMatch = matchResult.bestMatch!;
            return {
                schema: bestMatch.schema,
                errors: [],
                isValid: true,
                matchedSchema: bestMatch.schema
            };
        }

        // Aucune correspondance
        return {
            schema,
            errors: [{
                error: this.generateNoMatchError(matchResult),
                path: context.path.join('.'),
                code: 'ANYOF_NO_MATCH'
            }],
            isValid: false
        };
    }

    /**
     * Trouve les branches correspondantes avec optimisation early-exit
     */
    private static findMatchingBranches(
        branches: any[], 
        value: any, 
        context: ValidationContext, 
        engine: ValidationEngine
    ): AnyOfMatchResult {
        const matchingIndices: number[] = [];
        const allErrors: SchemaError[][] = [];
        let bestMatch: { index: number; schema: any; errors: SchemaError[] } | undefined;
        let bestScore = -1;

        for (let i = 0; i < branches.length; i++) {
            const branch = branches[i];
            
            // Pré-validation rapide pour optimiser les performances
            if (!this.isQuickMatch(branch, value)) {
                allErrors[i] = [{
                    error: "Ne correspond pas aux critères de base",
                    path: context.path.join('.'),
                    code: 'QUICK_MATCH_FAILED'
                }];
                continue;
            }

            // Validation complète de la branche
            const result = engine.validate(branch, value, context.path);
            allErrors[i] = result.errors;

            if (result.isValid) {
                matchingIndices.push(i);
                
                // Calculer le score pour déterminer la meilleure correspondance
                const score = this.calculateMatchScore(branch, value);
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = {
                        index: i,
                        schema: branch,
                        errors: result.errors
                    };
                }

                // Optimisation : si nous avons une correspondance parfaite, on peut s'arrêter
                if (this.isPerfectMatch(branch, value)) {
                    break;
                }
            }
        }

        return {
            hasMatch: matchingIndices.length > 0,
            matchingIndices,
            bestMatch
        };
    }

    /**
     * Vérification rapide pour éliminer les branches évidemment incompatibles
     */
    private static isQuickMatch(schema: any, value: any): boolean {
        // Vérification du type si défini
        if (schema.type && !this.isValueOfType(value, schema.type)) {
            return false;
        }
        
        // Vérification de l'enum si défini
        if (schema.enum && !schema.enum.includes(value)) {
            return false;
        }
        
        // Vérification des contraintes de base pour les strings
        if (typeof value === 'string') {
            if (schema.minLength !== undefined && value.length < schema.minLength) {
                return false;
            }
            if (schema.maxLength !== undefined && value.length > schema.maxLength) {
                return false;
            }
        }
        
        // Vérification des contraintes de base pour les numbers
        if (typeof value === 'number') {
            if (schema.minimum !== undefined && value < schema.minimum) {
                return false;
            }
            if (schema.maximum !== undefined && value > schema.maximum) {
                return false;
            }
        }
        
        // Vérification des contraintes de base pour les arrays
        if (Array.isArray(value)) {
            if (schema.minItems !== undefined && value.length < schema.minItems) {
                return false;
            }
            if (schema.maxItems !== undefined && value.length > schema.maxItems) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * Détermine si une correspondance est parfaite (pas besoin de chercher plus)
     */
    private static isPerfectMatch(schema: any, value: any): boolean {
        // Une correspondance est considérée comme parfaite si :
        // 1. Le type est exact
        // 2. Il y a une contrainte enum qui correspond
        // 3. Il y a une contrainte const qui correspond
        
        if (schema.const !== undefined) {
            return schema.const === value;
        }
        
        if (schema.enum && schema.enum.length === 1) {
            return schema.enum[0] === value;
        }
        
        // Correspondance parfaite de type avec contraintes strictes
        if (schema.type && !Array.isArray(schema.type)) {
            if (schema.additionalProperties === false && 
                typeof value === 'object' && 
                value !== null && 
                schema.properties) {
                const allowedProps = Object.keys(schema.properties);
                const actualProps = Object.keys(value);
                return actualProps.every(prop => allowedProps.includes(prop)) &&
                       actualProps.length === allowedProps.length;
            }
        }
        
        return false;
    }

    /**
     * Calcule un score de correspondance pour prioriser les meilleures correspondances
     */
    private static calculateMatchScore(schema: any, value: any): number {
        let score = 1.0; // Score de base
        
        // Bonus pour la spécificité du type
        if (schema.type) {
            if (!Array.isArray(schema.type)) {
                score += 0.2; // Type unique = plus spécifique
            }
        }
        
        // Bonus élevé pour les contraintes exactes
        if (schema.const !== undefined) {
            score += 0.5;
        }
        
        if (schema.enum) {
            score += 0.3 / schema.enum.length; // Plus l'enum est restrictif, plus le score est élevé
        }
        
        // Bonus pour les contraintes strictes
        if (schema.additionalProperties === false) {
            score += 0.1;
        }
        
        // Bonus pour la correspondance de propriétés dans les objets
        if (typeof value === 'object' && value !== null && schema.properties) {
            const matchingProps = Object.keys(value).filter(key => 
                schema.properties[key] !== undefined
            );
            score += matchingProps.length * 0.02;
        }
        
        // Bonus pour les patterns qui correspondent
        if (typeof value === 'string' && schema.pattern) {
            try {
                const regex = new RegExp(schema.pattern);
                if (regex.test(value)) {
                    score += 0.15;
                }
            } catch (e) {
                // Pattern invalide, pas de bonus
            }
        }
        
        return score;
    }

    /**
     * Génère un message d'erreur détaillé pour aucune correspondance
     */
    private static generateNoMatchError(result: AnyOfMatchResult): string {
        return `Aucune des variantes 'anyOf' ne correspond à la valeur fournie.`;
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
