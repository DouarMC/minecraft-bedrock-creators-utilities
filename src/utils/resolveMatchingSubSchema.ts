export interface SchemaError {
    error: string;
}

export interface SchemaValidationResult {
    schema: any;               // Le schéma utilisé (variant ou principal)
    errors: SchemaError[];     // Liste des erreurs détectées
}

export function getErrorsForSchema(schema: any, value: any): SchemaValidationResult {
    // Si le schéma n'est pas un objet, on renvoie un résultat vide
    if (!schema || typeof schema !== 'object') {
        return { schema: null, errors: [] };
    }

    const variants = schema.oneOf || schema.anyOf; // Récupère les variantes oneOf ou anyOf du schéma
    if (Array.isArray(variants)) { // Si on a des variantes
        // Essaye de trouver un sous-schéma qui matche sans erreur
        for (const variant of variants) {
            const errors = validateAgainstSchema(variant, value); // Valide la valeur contre le schéma de la variante
            if (errors.length === 0) { // Si aucune erreur n'est trouvée
                return { schema: variant, errors: [] }; // On retourne le schéma de la variante avec une liste d'erreurs vide
            }
        }

        // Aucun sous-schéma ne matche : on prend le premier pour afficher des erreurs quand même
        return {
            schema,
            errors: [{ error: `Aucune des variantes (${variants.length}) ne correspond à la valeur "${JSON.stringify(value)}"` }]
        };
    }

    // Pas de oneOf/anyOf, validation directe
    const errors = validateAgainstSchema(schema, value); // Valide la valeur contre le schéma principal
    return { schema, errors }; // On retourne le schéma principal et les erreurs de validation potentielles
}

function validateAgainstSchema(schema: any, value: any): SchemaError[] {
    const errors: SchemaError[] = []; // Tableau pour stocker les erreurs de validation

    // Vérification du type
    if (schema.type && !isValueOfType(value, schema.type)) { // Si le type de la valeur ne correspond pas au type attendu du schéma
        const typeDesc = Array.isArray(schema.type) ? schema.type.join(" | ") : schema.type; // Description du type attendu
        errors.push({ error: `Type attendu : ${typeDesc}, obtenu : ${typeof value}` }); // Ajoute une erreur pour le type attendu
    }

    // Vérification enum
    if (Array.isArray(schema.enum) && !schema.enum.includes(value)) { // Si le schéma a une énumération et que la valeur n'est pas incluse
        const allowed = schema.enum.map((v: any) => JSON.stringify(v)).join(", "); // Valeurs autorisées
        errors.push({ error: `Valeur invalide. Valeurs autorisées : ${allowed}` }); // Ajoute une erreur pour la valeur invalide
    }

    // ➕ Tu pourras ajouter ici : pattern, minLength, required, etc.

    return errors;
}

/**
 * Vérifie si la valeur correspond au type spécifié dans le schéma.
 * @param value La valeur à vérifier
 * @param type Le type attendu (peut être un tableau de types)
 * @returns 
 */
export function isValueOfType(value: any, type: string | string[]): boolean {
    const types = Array.isArray(type) ? type : [type]; // Assure que type est toujours un tableau
    return types.some(t => {
        if (t === 'string') {
            return typeof value === 'string';
        }
        if (t === 'number') {
            return typeof value === 'number';
        }
        if (t === 'boolean') {
            return typeof value === 'boolean';
        }
        if (t === 'null') {
            return value === null;
        }
        if (t === 'object') {
            return typeof value === 'object' && value !== null && !Array.isArray(value);
        }
        if (t === 'array') {
            return Array.isArray(value);
        }
        return false;
    });
}
