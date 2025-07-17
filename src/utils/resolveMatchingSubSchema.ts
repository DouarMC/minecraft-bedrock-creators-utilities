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
        // Étape 1 : on filtre les variants de type compatible
        const compatibleVariants = variants
            .map(variant => ({
                variant,
                isCompatible: variant.type ? isValueOfType(value, variant.type) : true,
                errors: validateAgainstSchema(variant, value),
            }))
            .sort((a, b) => {
                // Priorité : compatible > moins d'erreurs
                if (a.isCompatible !== b.isCompatible) {
                    return b.isCompatible ? 1 : -1;
                }
                return a.errors.length - b.errors.length;
            });

        const best = compatibleVariants[0];
        return {
            schema: best.variant,
            errors: best.errors
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

    if (typeof value === "string") {
        if (schema.minLength !== undefined && value.length < schema.minLength) {
            errors.push({ error: `La valeur "${value}" est trop courte (longueur minimale : ${schema.minLength})` }); // Ajoute une erreur pour la longueur minimale
        }

        if (schema.maxLength !== undefined && value.length > schema.maxLength) {
            errors.push({ error: `La valeur "${value}" est trop longue (longueur maximale : ${schema.maxLength})` }); // Ajoute une erreur pour la longueur maximale
        }

        if (schema.pattern) {
            const regex = new RegExp(schema.pattern); // Crée une expression régulière à partir du pattern du schéma
            if (!regex.test(value)) { // Si la valeur ne correspond pas au pattern
                errors.push({ error: `La valeur "${value}" ne correspond pas au pattern "${schema.pattern}"` }); // Ajoute une erreur pour le pattern
            }
        }
    }

    if (typeof value === "number") {
        if (schema.minimum !== undefined && value < schema.minimum) { // Si la valeur est inférieure au minimum autorisé
            errors.push({ error: `La valeur ${value} est inférieure au minimum autorisé (${schema.minimum})`});
        }

        if (schema.maximum !== undefined && value > schema.maximum) { // Si la valeur est supérieure au maximum autorisé
            errors.push({ error: `La valeur ${value} est supérieure au maximum autorisé (${schema.maximum})`});
        }

        if (schema.exclusiveMinimum !== undefined && value <= schema.exclusiveMinimum) { // Si la valeur est inférieure ou égale à l'exclusif minimum
            errors.push({ error: `La valeur ${value} doit être strictement supérieure à l'exclusif minimum (${schema.exclusiveMinimum})`});
        }

        if (schema.exclusiveMaximum !== undefined && value >= schema.exclusiveMaximum) { // Si la valeur est supérieure ou égale à l'exclusif maximum
            errors.push({ error: `La valeur ${value} doit être strictement inférieure à l'exclusif maximum (${schema.exclusiveMaximum})`});
        }

        if (schema.multipleOf !== undefined) {
            const multiple = schema.multipleOf;
            const quotient = value / multiple;
            // Pour les flottants, on tolère une petite marge d'erreur à cause de la précision binaire
            const isMultiple = Math.abs(quotient - Math.round(quotient)) < 1e-8;
            if (!isMultiple) { // Si la valeur n'est pas un multiple du multipleOf
                errors.push({ error: `La valeur ${value} n'est pas un multiple de ${multiple}` }); // Ajoute une erreur pour le multiple
            }
        }
    }

    if (typeof value === "object" && value !== null) {
        if (schema.required) {
            const missingKeys = schema.required.filter((key: string) => !(key in value)); // Vérifie les clés requises
            if (missingKeys.length > 0) {
                errors.push({ error: `Clés manquantes : ${missingKeys.join(", ")}` }); // Ajoute une erreur pour les clés manquantes
            }
        }
    }

    if (Array.isArray(value)) {
        if (schema.minItems !== undefined && value.length < schema.minItems) {
            errors.push({ error: `Le tableau contient ${value.length} éléments, mais ${schema.minItems} minimum sont requis.` }); // Ajoute une erreur pour le nombre minimum d'éléments
        }

        if (schema.maxItems !== undefined && value.length > schema.maxItems) {
            errors.push({ error: `Le tableau contient ${value.length} éléments, mais ${schema.maxItems} maximum sont autorisés.` }); // Ajoute une erreur pour le nombre maximum d'éléments
        }
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
        if (t === 'integer') {
            return typeof value === 'number' && Number.isInteger(value); // Vérifie si c'est un entier
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
