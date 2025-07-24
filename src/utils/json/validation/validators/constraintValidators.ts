import { ConstraintValidator, SchemaError, ValidationContext } from '../types';

/**
 * Validateur pour la contrainte enum
 */
class EnumConstraintValidator implements ConstraintValidator {
    constraint = 'enum';

    validate(value: any, constraintValue: any[], schema: any, context: ValidationContext): SchemaError[] {
        if (!Array.isArray(constraintValue)) {
            return [];
        }

        if (!constraintValue.includes(value)) {
            const allowed = constraintValue.map(v => JSON.stringify(v)).join(", ");
            return [{
                error: `Valeur invalide. Valeurs autorisées : ${allowed}`,
                path: context.path.join('.'),
                code: 'ENUM_MISMATCH'
            }];
        }

        return [];
    }
}

/**
 * Validateur pour la contrainte required (propriétés requises)
 */
class RequiredConstraintValidator implements ConstraintValidator {
    constraint = 'required';

    validate(value: any, constraintValue: string[], schema: any, context: ValidationContext): SchemaError[] {
        if (!Array.isArray(constraintValue) || typeof value !== 'object' || value === null) {
            return [];
        }

        const missingKeys = constraintValue.filter(key => !(key in value));
        if (missingKeys.length > 0) {
            return [{
                error: `Clés manquantes : ${missingKeys.join(", ")}`,
                path: context.path.join('.'),
                code: 'MISSING_REQUIRED_PROPERTIES'
            }];
        }

        return [];
    }
}

/**
 * Validateur pour la contrainte minLength
 */
class MinLengthConstraintValidator implements ConstraintValidator {
    constraint = 'minLength';

    validate(value: any, constraintValue: number, schema: any, context: ValidationContext): SchemaError[] {
        if (typeof value !== 'string' || typeof constraintValue !== 'number') {
            return [];
        }

        if (value.length < constraintValue) {
            return [{
                error: `La valeur "${value}" est trop courte (longueur minimale : ${constraintValue})`,
                path: context.path.join('.'),
                code: 'STRING_TOO_SHORT'
            }];
        }

        return [];
    }
}

/**
 * Validateur pour la contrainte maxLength
 */
class MaxLengthConstraintValidator implements ConstraintValidator {
    constraint = 'maxLength';

    validate(value: any, constraintValue: number, schema: any, context: ValidationContext): SchemaError[] {
        if (typeof value !== 'string' || typeof constraintValue !== 'number') {
            return [];
        }

        if (value.length > constraintValue) {
            return [{
                error: `La valeur "${value}" est trop longue (longueur maximale : ${constraintValue})`,
                path: context.path.join('.'),
                code: 'STRING_TOO_LONG'
            }];
        }

        return [];
    }
}

/**
 * Validateur pour la contrainte pattern
 */
class PatternConstraintValidator implements ConstraintValidator {
    constraint = 'pattern';

    validate(value: any, constraintValue: string, schema: any, context: ValidationContext): SchemaError[] {
        if (typeof value !== 'string' || typeof constraintValue !== 'string') {
            return [];
        }

        try {
            const regex = new RegExp(constraintValue);
            if (!regex.test(value)) {
                return [{
                    error: `La valeur "${value}" ne correspond pas au pattern "${constraintValue}"`,
                    path: context.path.join('.'),
                    code: 'PATTERN_MISMATCH'
                }];
            }
        } catch (error) {
            return [{
                error: `Pattern regex invalide : "${constraintValue}"`,
                path: context.path.join('.'),
                code: 'INVALID_PATTERN'
            }];
        }

        return [];
    }
}

/**
 * Validateur pour la contrainte minimum
 */
class MinimumConstraintValidator implements ConstraintValidator {
    constraint = 'minimum';

    validate(value: any, constraintValue: number, schema: any, context: ValidationContext): SchemaError[] {
        if (typeof value !== 'number' || typeof constraintValue !== 'number') {
            return [];
        }

        if (value < constraintValue) {
            return [{
                error: `La valeur ${value} est inférieure au minimum autorisé (${constraintValue})`,
                path: context.path.join('.'),
                code: 'NUMBER_TOO_SMALL'
            }];
        }

        return [];
    }
}

/**
 * Validateur pour la contrainte maximum
 */
class MaximumConstraintValidator implements ConstraintValidator {
    constraint = 'maximum';

    validate(value: any, constraintValue: number, schema: any, context: ValidationContext): SchemaError[] {
        if (typeof value !== 'number' || typeof constraintValue !== 'number') {
            return [];
        }

        if (value > constraintValue) {
            return [{
                error: `La valeur ${value} est supérieure au maximum autorisé (${constraintValue})`,
                path: context.path.join('.'),
                code: 'NUMBER_TOO_LARGE'
            }];
        }

        return [];
    }
}

/**
 * Validateur pour la contrainte exclusiveMinimum
 */
class ExclusiveMinimumConstraintValidator implements ConstraintValidator {
    constraint = 'exclusiveMinimum';

    validate(value: any, constraintValue: number, schema: any, context: ValidationContext): SchemaError[] {
        if (typeof value !== 'number' || typeof constraintValue !== 'number') {
            return [];
        }

        if (value <= constraintValue) {
            return [{
                error: `La valeur ${value} doit être strictement supérieure à l'exclusif minimum (${constraintValue})`,
                path: context.path.join('.'),
                code: 'NUMBER_NOT_GREATER_THAN_EXCLUSIVE_MINIMUM'
            }];
        }

        return [];
    }
}

/**
 * Validateur pour la contrainte exclusiveMaximum
 */
class ExclusiveMaximumConstraintValidator implements ConstraintValidator {
    constraint = 'exclusiveMaximum';

    validate(value: any, constraintValue: number, schema: any, context: ValidationContext): SchemaError[] {
        if (typeof value !== 'number' || typeof constraintValue !== 'number') {
            return [];
        }

        if (value >= constraintValue) {
            return [{
                error: `La valeur ${value} doit être strictement inférieure à l'exclusif maximum (${constraintValue})`,
                path: context.path.join('.'),
                code: 'NUMBER_NOT_LESS_THAN_EXCLUSIVE_MAXIMUM'
            }];
        }

        return [];
    }
}

/**
 * Validateur pour la contrainte multipleOf
 */
class MultipleOfConstraintValidator implements ConstraintValidator {
    constraint = 'multipleOf';

    validate(value: any, constraintValue: number, schema: any, context: ValidationContext): SchemaError[] {
        if (typeof value !== 'number' || typeof constraintValue !== 'number' || constraintValue <= 0) {
            return [];
        }

        const quotient = value / constraintValue;
        // Pour les flottants, on tolère une petite marge d'erreur à cause de la précision binaire
        const isMultiple = Math.abs(quotient - Math.round(quotient)) < 1e-8;
        
        if (!isMultiple) {
            return [{
                error: `La valeur ${value} n'est pas un multiple de ${constraintValue}`,
                path: context.path.join('.'),
                code: 'NOT_MULTIPLE_OF'
            }];
        }

        return [];
    }
}

/**
 * Validateur pour la contrainte minItems (tableaux)
 */
class MinItemsConstraintValidator implements ConstraintValidator {
    constraint = 'minItems';

    validate(value: any, constraintValue: number, schema: any, context: ValidationContext): SchemaError[] {
        if (!Array.isArray(value) || typeof constraintValue !== 'number') {
            return [];
        }

        if (value.length < constraintValue) {
            return [{
                error: `Le tableau contient ${value.length} éléments, mais ${constraintValue} minimum sont requis.`,
                path: context.path.join('.'),
                code: 'ARRAY_TOO_SHORT'
            }];
        }

        return [];
    }
}

/**
 * Validateur pour la contrainte maxItems (tableaux)
 */
class MaxItemsConstraintValidator implements ConstraintValidator {
    constraint = 'maxItems';

    validate(value: any, constraintValue: number, schema: any, context: ValidationContext): SchemaError[] {
        if (!Array.isArray(value) || typeof constraintValue !== 'number') {
            return [];
        }

        if (value.length > constraintValue) {
            return [{
                error: `Le tableau contient ${value.length} éléments, mais ${constraintValue} maximum sont autorisés.`,
                path: context.path.join('.'),
                code: 'ARRAY_TOO_LONG'
            }];
        }

        return [];
    }
}

/**
 * Validateur pour la contrainte uniqueItems (tableaux)
 */
class UniqueItemsConstraintValidator implements ConstraintValidator {
    constraint = 'uniqueItems';

    validate(value: any, constraintValue: boolean, schema: any, context: ValidationContext): SchemaError[] {
        if (!Array.isArray(value) || constraintValue !== true) {
            return [];
        }

        const seen = new Set();
        const duplicates: number[] = [];

        for (let i = 0; i < value.length; i++) {
            const serialized = JSON.stringify(value[i]);
            if (seen.has(serialized)) {
                duplicates.push(i);
            } else {
                seen.add(serialized);
            }
        }

        if (duplicates.length > 0) {
            return [{
                error: `Le tableau contient des éléments dupliqués aux positions : ${duplicates.map(i => i + 1).join(', ')}`,
                path: context.path.join('.'),
                code: 'ARRAY_ITEMS_NOT_UNIQUE'
            }];
        }

        return [];
    }
}

/**
 * Validateur pour la contrainte propertyNames
 */
class PropertyNamesConstraintValidator implements ConstraintValidator {
    constraint = 'propertyNames';

    validate(value: any, constraintValue: any, schema: any, context: ValidationContext): SchemaError[] {
        if (typeof value !== 'object' || value === null || typeof constraintValue !== 'object') {
            return [];
        }

        const errors: SchemaError[] = [];
        
        for (const key of Object.keys(value)) {
            // Validation du pattern si défini
            if (constraintValue.pattern) {
                try {
                    const regex = new RegExp(constraintValue.pattern);
                    if (!regex.test(key)) {
                        errors.push({
                            error: `Le nom de propriété "${key}" ne respecte pas le pattern "${constraintValue.pattern}"`,
                            path: context.path.join('.'),
                            code: 'PROPERTY_NAME_PATTERN_MISMATCH'
                        });
                    }
                } catch (error) {
                    errors.push({
                        error: `Pattern regex invalide pour propertyNames : "${constraintValue.pattern}"`,
                        path: context.path.join('.'),
                        code: 'INVALID_PROPERTY_NAME_PATTERN'
                    });
                }
            }
        }

        return errors;
    }
}

/**
 * Validateur pour la contrainte additionalProperties
 */
class AdditionalPropertiesConstraintValidator implements ConstraintValidator {
    constraint = 'additionalProperties';

    validate(value: any, constraintValue: any, schema: any, context: ValidationContext): SchemaError[] {
        if (typeof value !== 'object' || value === null) {
            return [];
        }

        // Si additionalProperties est false, vérifier qu'il n'y a pas de propriétés supplémentaires
        if (constraintValue === false) {
            const allowedProps = Object.keys(schema.properties || {});
            const actualProps = Object.keys(value);
            const extraProps = actualProps.filter(prop => !allowedProps.includes(prop));

            if (extraProps.length > 0) {
                return [{
                    error: `Propriétés supplémentaires non autorisées : ${extraProps.join(', ')}`,
                    path: context.path.join('.'),
                    code: 'ADDITIONAL_PROPERTIES_NOT_ALLOWED'
                }];
            }
        }

        return [];
    }
}

/**
 * Collection de tous les validateurs de contrainte
 */
export const ConstraintValidators = new Map<string, ConstraintValidator>([
    ['enum', new EnumConstraintValidator()],
    ['required', new RequiredConstraintValidator()],
    ['minLength', new MinLengthConstraintValidator()],
    ['maxLength', new MaxLengthConstraintValidator()],
    ['pattern', new PatternConstraintValidator()],
    ['minimum', new MinimumConstraintValidator()],
    ['maximum', new MaximumConstraintValidator()],
    ['exclusiveMinimum', new ExclusiveMinimumConstraintValidator()],
    ['exclusiveMaximum', new ExclusiveMaximumConstraintValidator()],
    ['multipleOf', new MultipleOfConstraintValidator()],
    ['minItems', new MinItemsConstraintValidator()],
    ['maxItems', new MaxItemsConstraintValidator()],
    ['uniqueItems', new UniqueItemsConstraintValidator()],
    ['propertyNames', new PropertyNamesConstraintValidator()],
    ['additionalProperties', new AdditionalPropertiesConstraintValidator()]
]);
