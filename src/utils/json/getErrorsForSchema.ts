// LEGACY FILE - Utilise maintenant le nouveau système de validation modulaire
// Pour de nouvelles implémentations, utilisez directement le nouveau système :
// import { ValidationEngine, validateSchema } from './validation/index.js';

import { 
    getErrorsForSchema as newGetErrorsForSchema,
    validateSchema,
    isValueOfType,
    ValidationEngine,
    createValidationEngine
} from './validation/index';

export interface SchemaError {
    error: string;
}

export interface SchemaValidationResult {
    schema: any;               // Le schéma utilisé (variant ou principal)
    errors: SchemaError[];     // Liste des erreurs détectées
}

/**
 * FONCTION LEGACY - Utilise maintenant le nouveau système de validation
 * @deprecated Utilisez validateSchema() du nouveau système pour de meilleures performances
 */
export function getErrorsForSchema(schema: any, value: any): SchemaValidationResult {
    return newGetErrorsForSchema(schema, value);
}

// Réexportation des fonctions utilitaires pour compatibilité
export { isValueOfType };

// Nouvelles fonctions recommandées pour remplacer l'ancien système
export { 
    validateSchema,
    ValidationEngine,
    createValidationEngine
};

/**
 * Fonction utilitaire maintenue pour compatibilité
 * @deprecated Utilisez isValueOfType du nouveau système
 */
function isValueOfTypeLocal(value: any, type: string | string[]): boolean {
    return isValueOfType(value, type);
}

/**
 * Interface OneOfMatchResult maintenue pour compatibilité
 * @deprecated Le nouveau système gère oneOf automatiquement
 */
interface OneOfMatchResult {
    matchedBranches: number;
    matchingIndex?: number;
    errorsPerBranch: string[][];
}

/**
 * Fonction helper maintenue pour compatibilité
 * @deprecated Le nouveau système gère oneOf automatiquement avec une meilleure logique
 */
function findMatchingOneOfBranch(schema: any, value: any): OneOfMatchResult {
    // Délégation vers le nouveau système pour validation oneOf
    const result = validateSchema(schema, value);
    
    if (!Array.isArray(schema.oneOf)) {
        return { matchedBranches: 0, errorsPerBranch: [] };
    }

    // Simulation de l'ancien format pour compatibilité
    const errorsPerBranch: string[][] = [];
    let matchedBranches = 0;
    let matchingIndex: number | undefined;

    if (result.isValid) {
        matchedBranches = 1;
        matchingIndex = 0; // Simplifié pour compatibilité
    }

    // Remplir les erreurs par branche (simplifié)
    for (let i = 0; i < schema.oneOf.length; i++) {
        errorsPerBranch[i] = result.errors.map(e => e.error);
    }

    return {
        matchedBranches,
        matchingIndex,
        errorsPerBranch
    };
}

/**
 * Fonction helper maintenue pour compatibilité
 * @deprecated Le nouveau système gère les correspondances strictes automatiquement
 */
function isStrictMatch(schema: any, value: any): boolean {
    const result = validateSchema(schema, value);
    return result.isValid;
}