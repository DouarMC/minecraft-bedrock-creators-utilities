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

    // --- ONEOF (strict, via helper) ---
    if (Array.isArray(schema.oneOf)) {
        const result = findMatchingOneOfBranch(schema, value);
        if (result.matchedBranches === 1) {
            const matchedSchema = schema.oneOf[result.matchingIndex!];
            return getErrorsForSchema(matchedSchema, value);
        }
        if (result.matchedBranches > 1) {
            return {
                schema,
                errors: [{
                    error: "L'objet correspond à plusieurs branches 'oneOf', ce qui n'est pas autorisé par JSON Schema."
                }]
            };
        }
        return {
            schema,
            errors: [{
                error: "Aucune des variantes 'oneOf' ne correspond à la valeur."
            }]
        };
    }

    // --- ANYOF (tolérant) ---
    if (Array.isArray(schema.anyOf)) {
        for (const variant of schema.anyOf) {
            const result = getErrorsForSchema(variant, value);
            if (result.errors.length === 0) {
                return { schema: result.schema, errors: [] };
            }
        }
        return {
            schema,
            errors: [{
                error: "Aucune des variantes 'anyOf' ne correspond à la valeur."
            }]
        };
    }

    // Le reste ne bouge pas
    const errors = validateAgainstSchema(schema, value);
    if (schema.type && !isValueOfType(value, schema.type)) {
        return { schema: null, errors };
    }
    return { schema, errors };
}

function validateAgainstSchema(schema: any, value: any): SchemaError[] {
    const errors: SchemaError[] = []; // Tableau pour stocker les erreurs de validation

    // Vérification du type
    if (schema.type && !isValueOfType(value, schema.type)) { // Si le type de la valeur ne correspond pas au type attendu du schéma
        const schemaType = schema.type; // Description du type attendu
        let errorMessage: string;
        if (schemaType === "molang") { // Si le type attendu est "molang"
            errorMessage = `Une expression Molang doit être une chaîne, un nombre ou un booléen (ex: "query.health > 0", true, 2.5)`;
        } else {
            errorMessage = `Type attendu : ${schemaType}, obtenu : ${typeof value}`;
        }

        errors.push({ error: errorMessage }); // Ajoute une erreur pour le type invalide
    }

    // Vérification enum
    if (Array.isArray(schema.enum) && !schema.enum.includes(value)) { // Si le schéma a une énumération et que la valeur n'est pas incluse
        const allowed = schema.enum.map((v: any) => JSON.stringify(v)).join(", "); // Valeurs autorisées
        errors.push({ error: `Valeur invalide. Valeurs autorisées : ${allowed}` }); // Ajoute une erreur pour la valeur invalide
    }

    // Vérification des erreurs pour les valeurs de type string
    if (typeof value === "string") {
        // Vérification de la longueur minimale de la chaîne
        if (schema.minLength !== undefined && value.length < schema.minLength) {
            errors.push({ error: `La valeur "${value}" est trop courte (longueur minimale : ${schema.minLength})` }); // Ajoute une erreur pour la longueur minimale
        }

        // Vérification de la longueur maximale de la chaîne
        if (schema.maxLength !== undefined && value.length > schema.maxLength) {
            errors.push({ error: `La valeur "${value}" est trop longue (longueur maximale : ${schema.maxLength})` }); // Ajoute une erreur pour la longueur maximale
        }

        // Vérification du pattern de la chaîne
        if (schema.pattern) {
            const regex = new RegExp(schema.pattern); // Crée une expression régulière à partir du pattern du schéma
            if (!regex.test(value)) { // Si la valeur ne correspond pas au pattern
                errors.push({ error: `La valeur "${value}" ne correspond pas au pattern "${schema.pattern}"` }); // Ajoute une erreur pour le pattern
            }
        }
    }

    // Vérification des erreurs pour les valeurs de type number
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

        if (schema.multipleOf !== undefined) { // Si le schéma a un multipleOf
            const multiple = schema.multipleOf;
            const quotient = value / multiple;
            // Pour les flottants, on tolère une petite marge d'erreur à cause de la précision binaire
            const isMultiple = Math.abs(quotient - Math.round(quotient)) < 1e-8;
            if (!isMultiple) { // Si la valeur n'est pas un multiple du multipleOf
                errors.push({ error: `La valeur ${value} n'est pas un multiple de ${multiple}` }); // Ajoute une erreur pour le multiple
            }
        }
    }

    // Vérification des erreurs pour les valeurs de type Object
    if (typeof value === "object" && value !== null) {
        // Vérification des clés requises
        if (schema.required) {
            const missingKeys = schema.required.filter((key: string) => !(key in value)); // Vérifie les clés requises
            if (missingKeys.length > 0) {
                errors.push({ error: `Clés manquantes : ${missingKeys.join(", ")}` }); // Ajoute une erreur pour les clés manquantes
            }
        }

        // Validation des noms de propriétés
        if (schema.propertyNames && typeof schema.propertyNames === 'object') {
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

    // Vérification des erreurs pour les valeurs de type Array
    if (Array.isArray(value)) {
        // Vérification du nombre minimum d'éléments dans le tableau
        if (schema.minItems !== undefined && value.length < schema.minItems) {
            errors.push({ error: `Le tableau contient ${value.length} éléments, mais ${schema.minItems} minimum sont requis.` }); // Ajoute une erreur pour le nombre minimum d'éléments
        }

        // Vérification du nombre maximum d'éléments dans le tableau
        if (schema.maxItems !== undefined && value.length > schema.maxItems) {
            errors.push({ error: `Le tableau contient ${value.length} éléments, mais ${schema.maxItems} maximum sont autorisés.` }); // Ajoute une erreur pour le nombre maximum d'éléments
        }

        if (schema.items) {
            for (let i = 0; i < value.length; i++) {
                const itemValue = value[i];
                const itemSchema = Array.isArray(schema.items)
                    ? schema.items[i] ?? {}
                    : schema.items;

                const { errors: subErrors } = getErrorsForSchema(itemSchema, itemValue);

                if (subErrors.length > 0) {
                    errors.push(...subErrors.map(e => ({
                        error: `Élément ${i + 1} invalide : ${e.error}`
                    })));
                }
            }
        }
    }

    return errors;
}

/**
 * Vérifie si la valeur correspond au type spécifié dans le schéma.
 * @param value La valeur à vérifier
 * @param type Le type attendu (peut être un tableau de types)
 * @returns 
 */
function isValueOfType(value: any, type: string | string[]): boolean {
    const types = Array.isArray(type) ? type : [type]; // Assure que type est toujours un tableau
    return types.some(t => {
        if (t === "molang") {
            return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
        }
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

interface OneOfMatchResult {
    matchedBranches: number;
    matchingIndex?: number; // Index de la seule branche valide, sinon undefined
    errorsPerBranch: string[][];
}

function findMatchingOneOfBranch(schema: any, value: any): OneOfMatchResult {
    // On ne gère que les schémas avec oneOf ici.
    if (!Array.isArray(schema.oneOf)) {
        return { matchedBranches: 0, errorsPerBranch: [] };
    }

    const errorsPerBranch: string[][] = [];
    const matchingIndices: number[] = [];

    for (let i = 0; i < schema.oneOf.length; i++) {
        const branch = schema.oneOf[i];
        const { errors } = getErrorsForSchema(branch, value);

        errorsPerBranch[i] = errors.map(e => e.error);

        // Si la branche n'a aucune erreur, c'est un match strict
        if (errors.length === 0) {
            matchingIndices.push(i);
        }
    }

    return {
        matchedBranches: matchingIndices.length,
        matchingIndex: matchingIndices.length === 1 ? matchingIndices[0] : undefined,
        errorsPerBranch
    };
}
