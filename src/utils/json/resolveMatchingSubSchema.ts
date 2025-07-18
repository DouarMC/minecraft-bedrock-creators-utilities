export interface SchemaError {
    error: string;
}

export interface SchemaValidationResult {
    schema: any;               // Le schéma utilisé (variant ou principal)
    errors: SchemaError[];     // Liste des erreurs détectées
}

export function getErrorsForSchema(schema: any, value: any): SchemaValidationResult {
    if (!schema || typeof schema !== 'object') {
        return { schema: null, errors: [] };
    }

    const variants = schema.oneOf || schema.anyOf;
    if (Array.isArray(variants)) {
        const compatibleVariants = variants
            .map(variant => {
                const result = getErrorsForSchema(variant, value); // 🔁 récursif ici
                const isCompatible = variant.type ? isValueOfType(value, variant.type) : true;

                return {
                    variant: result.schema,
                    isCompatible,
                    errors: result.errors
                };
            })
            .sort((a, b) => {
                if (a.isCompatible !== b.isCompatible) {
                    return b.isCompatible ? 1 : -1;
                }
                return a.errors.length - b.errors.length;
            });

        const best = compatibleVariants.find(v => v.isCompatible) ?? compatibleVariants[0];
        if (!best || !best.isCompatible) {
            return { schema, errors: [{ error: `Aucune des variantes 'oneOf' ne correspond au type de la valeur.` }] };
        }

        return {
            schema: best.variant,
            errors: best.errors
        };
    }

    const errors = validateAgainstSchema(schema, value);
    return { schema, errors };
}

function validateAgainstSchema(schema: any, value: any): SchemaError[] {
    const errors: SchemaError[] = []; // Tableau pour stocker les erreurs de validation

    // Support spécial : molang peut être string, number ou boolean
    if (schema.type === "molang") {
        const t = typeof value;
        const isValid = t === "string" || t === "number" || t === "boolean";
        if (!isValid) {
            return [{ error: `Une expression Molang doit être une chaîne, un nombre ou un booléen (ex: "query.health > 0", true, 2.5)` }];
        }

        return []; // Pas d'erreur pour molang
    }

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

        // // Validation des noms de propriétés
        if (schema.propertyNames) {
            const nameSchema = schema.propertyNames;
            for (const key of Object.keys(value)) {
                if (nameSchema.pattern) {
                    const regex = new RegExp(nameSchema.pattern);
                    if (!regex.test(key)) {
                        errors.push({
                            error: `Le nom de propriété "${key}" ne respecte pas le pattern "${nameSchema.pattern}"`
                        });
                    }
                }
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

        if (schema.items) {
            for (let i = 0; i < value.length; i++) {
                const itemValue = value[i];
                const itemSchema = schema.items;

                // Si items.oneOf existe → on cherche un variant compatible
                if (Array.isArray(itemSchema.oneOf)) {
                    const subVariants = itemSchema.oneOf.map((variant: any) => ({
                        variant,
                        isValid: validateAgainstSchema(variant, itemValue).length === 0
                    }));

                    if (!subVariants.some((v: any) => v.isValid)) {
                        errors.push({
                            error: `Élément ${i} invalide : aucun des types attendus ne correspond.`
                        });
                    }
                } else {
                    const subErrors = validateAgainstSchema(itemSchema, itemValue);
                    errors.push(...subErrors.map(e => ({
                        error: `Élément ${i} invalide : ${e.error}`
                    })));
                }
            }
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
