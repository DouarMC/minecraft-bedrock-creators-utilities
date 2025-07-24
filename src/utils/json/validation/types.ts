/**
 * Types et interfaces pour le système de validation JSON Schema
 */

export interface SchemaError {
    error: string;
    path?: string;
    code?: string;
}

export interface SchemaValidationResult {
    schema: any;               // Le schéma utilisé (variant ou principal)
    errors: SchemaError[];     // Liste des erreurs détectées
    isValid: boolean;          // Indicateur de validité
    matchedSchema?: any;       // Schéma spécifique qui a matché (pour oneOf/anyOf)
}

export interface ValidationContext {
    path: string[];            // Chemin actuel dans l'objet JSON
    rootSchema: any;           // Schéma racine pour les références
    visited: Set<string>;      // Pour éviter les boucles infinies
    strictMode: boolean;       // Mode de validation strict
}

export interface OneOfMatchResult {
    matchedBranches: number;
    matchingIndex?: number;    // Index de la seule branche valide
    errorsPerBranch: SchemaError[][];
    bestMatch?: {
        index: number;
        score: number;         // Score de correspondance (0-1)
    };
}

export interface AnyOfMatchResult {
    hasMatch: boolean;
    matchingIndices: number[];
    bestMatch?: {
        index: number;
        schema: any;
        errors: SchemaError[];
    };
}

export interface SchemaValidatorOptions {
    strictMode?: boolean;
    maxDepth?: number;
    enableCache?: boolean;
    customValidators?: Map<string, CustomValidator>;
}

export interface CustomValidator {
    validate(schema: any, value: any, context: ValidationContext): SchemaError[];
    supports(schema: any): boolean;
}

export interface ValidatorPlugin {
    name: string;
    priority: number;
    validator: CustomValidator;
}

export type SchemaType = 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array' | 'null' | 'molang';

export interface TypeValidator {
    type: SchemaType;
    validate(value: any, schema: any, context: ValidationContext): SchemaError[];
}

export interface ConstraintValidator {
    constraint: string;
    validate(value: any, constraintValue: any, schema: any, context: ValidationContext): SchemaError[];
}

export interface ValidationCache {
    get(key: string): SchemaValidationResult | undefined;
    set(key: string, result: SchemaValidationResult): void;
    clear(): void;
    size(): number;
}
