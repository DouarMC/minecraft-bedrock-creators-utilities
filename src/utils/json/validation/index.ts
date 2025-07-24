import { ValidationEngine } from './validationEngine';
import { SchemaValidationResult, SchemaError } from './types';

/**
 * Instance globale du moteur de validation pour compatibilité avec l'ancien système
 */
const globalValidationEngine = new ValidationEngine({
    strictMode: true,
    enableCache: true,
    maxDepth: 50
});

/**
 * Interface de compatibilité avec l'ancien système getErrorsForSchema
 * @deprecated Utilisez ValidationEngine directement pour de meilleures performances
 */
export interface LegacySchemaError {
    error: string;
}

export interface LegacySchemaValidationResult {
    schema: any;
    errors: LegacySchemaError[];
}

/**
 * Fonction de compatibilité avec l'ancien système
 * @param schema Le schéma JSON Schema
 * @param value La valeur à valider
 * @returns Résultat de validation dans l'ancien format
 */
export function getErrorsForSchema(schema: any, value: any): LegacySchemaValidationResult {
    const result = globalValidationEngine.validate(schema, value);
    
    return {
        schema: result.matchedSchema || result.schema,
        errors: result.errors.map(error => ({
            error: error.error
        }))
    };
}

/**
 * Fonction améliorée qui retourne le résultat complet
 * @param schema Le schéma JSON Schema
 * @param value La valeur à valider
 * @returns Résultat de validation complet
 */
export function validateSchema(schema: any, value: any): SchemaValidationResult {
    return globalValidationEngine.validate(schema, value);
}

/**
 * Crée une nouvelle instance du moteur de validation avec des options personnalisées
 * @param options Options de configuration du moteur
 * @returns Nouvelle instance du moteur de validation
 */
export function createValidationEngine(options?: {
    strictMode?: boolean;
    enableCache?: boolean;
    maxDepth?: number;
}): ValidationEngine {
    return new ValidationEngine(options);
}

/**
 * Nettoie le cache du moteur global
 */
export function clearValidationCache(): void {
    globalValidationEngine.clearCache();
}

/**
 * Obtient la taille du cache du moteur global
 */
export function getValidationCacheSize(): number {
    return globalValidationEngine.getCacheSize();
}

/**
 * Fonction utilitaire pour vérifier si une valeur correspond à un type
 * @param value La valeur à vérifier
 * @param type Le type attendu
 * @returns true si la valeur correspond au type
 */
export function isValueOfType(value: any, type: string | string[]): boolean {
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

// Réexportation des types et classes principales
export { ValidationEngine } from './validationEngine';
export { 
    SchemaError, 
    SchemaValidationResult, 
    ValidationContext,
    SchemaValidatorOptions,
    CustomValidator,
    TypeValidator,
    ConstraintValidator
} from './types';
export { TypeValidators } from './validators/typeValidators';
export { ConstraintValidators } from './validators/constraintValidators';
export { OneOfValidator } from './validators/oneOfValidator';
export { AnyOfValidator } from './validators/anyOfValidator';
export { validateMultipleTypes } from './validators/typeValidators';
export { SimpleCache } from './cache/simpleCache';
