import { TypeValidator, SchemaError, ValidationContext } from '../types';

/**
 * Validateur pour le type string
 */
class StringTypeValidator implements TypeValidator {
    type = 'string' as const;

    validate(value: any, schema: any, context: ValidationContext): SchemaError[] {
        if (typeof value !== 'string') {
            return [{
                error: `Type attendu : string, obtenu : ${typeof value}`,
                path: context.path.join('.'),
                code: 'TYPE_MISMATCH'
            }];
        }
        return [];
    }
}

/**
 * Validateur pour le type number
 */
class NumberTypeValidator implements TypeValidator {
    type = 'number' as const;

    validate(value: any, schema: any, context: ValidationContext): SchemaError[] {
        if (typeof value !== 'number') {
            return [{
                error: `Type attendu : number, obtenu : ${typeof value}`,
                path: context.path.join('.'),
                code: 'TYPE_MISMATCH'
            }];
        }
        return [];
    }
}

/**
 * Validateur pour le type integer
 */
class IntegerTypeValidator implements TypeValidator {
    type = 'integer' as const;

    validate(value: any, schema: any, context: ValidationContext): SchemaError[] {
        if (typeof value !== 'number' || !Number.isInteger(value)) {
            return [{
                error: `Type attendu : integer, obtenu : ${typeof value}${typeof value === 'number' ? ' (non-entier)' : ''}`,
                path: context.path.join('.'),
                code: 'TYPE_MISMATCH'
            }];
        }
        return [];
    }
}

/**
 * Validateur pour le type boolean
 */
class BooleanTypeValidator implements TypeValidator {
    type = 'boolean' as const;

    validate(value: any, schema: any, context: ValidationContext): SchemaError[] {
        if (typeof value !== 'boolean') {
            return [{
                error: `Type attendu : boolean, obtenu : ${typeof value}`,
                path: context.path.join('.'),
                code: 'TYPE_MISMATCH'
            }];
        }
        return [];
    }
}

/**
 * Validateur pour le type object
 */
class ObjectTypeValidator implements TypeValidator {
    type = 'object' as const;

    validate(value: any, schema: any, context: ValidationContext): SchemaError[] {
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
            return [{
                error: `Type attendu : object, obtenu : ${value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value}`,
                path: context.path.join('.'),
                code: 'TYPE_MISMATCH'
            }];
        }
        return [];
    }
}

/**
 * Validateur pour le type array
 */
class ArrayTypeValidator implements TypeValidator {
    type = 'array' as const;

    validate(value: any, schema: any, context: ValidationContext): SchemaError[] {
        if (!Array.isArray(value)) {
            return [{
                error: `Type attendu : array, obtenu : ${typeof value}`,
                path: context.path.join('.'),
                code: 'TYPE_MISMATCH'
            }];
        }
        return [];
    }
}

/**
 * Validateur pour le type null
 */
class NullTypeValidator implements TypeValidator {
    type = 'null' as const;

    validate(value: any, schema: any, context: ValidationContext): SchemaError[] {
        if (value !== null) {
            return [{
                error: `Type attendu : null, obtenu : ${typeof value}`,
                path: context.path.join('.'),
                code: 'TYPE_MISMATCH'
            }];
        }
        return [];
    }
}

/**
 * Validateur pour le type molang (spécifique à Minecraft)
 */
class MolangTypeValidator implements TypeValidator {
    type = 'molang' as const;

    validate(value: any, schema: any, context: ValidationContext): SchemaError[] {
        const validTypes = ['string', 'number', 'boolean'];
        if (!validTypes.includes(typeof value)) {
            return [{
                error: `Une expression Molang doit être une chaîne, un nombre ou un booléen (ex: "query.health > 0", true, 2.5), obtenu : ${typeof value}`,
                path: context.path.join('.'),
                code: 'MOLANG_TYPE_MISMATCH'
            }];
        }
        return [];
    }
}

/**
 * Collection de tous les validateurs de type
 */
export const TypeValidators = new Map<string, TypeValidator>([
    ['string', new StringTypeValidator()],
    ['number', new NumberTypeValidator()],
    ['integer', new IntegerTypeValidator()],
    ['boolean', new BooleanTypeValidator()],
    ['object', new ObjectTypeValidator()],
    ['array', new ArrayTypeValidator()],
    ['null', new NullTypeValidator()],
    ['molang', new MolangTypeValidator()]
]);

/**
 * Fonction utilitaire pour valider contre des types multiples
 */
export function validateMultipleTypes(value: any, types: string[], context: ValidationContext): SchemaError[] {
    for (const type of types) {
        const validator = TypeValidators.get(type);
        if (validator) {
            const errors = validator.validate(value, {}, context);
            if (errors.length === 0) {
                return []; // Au moins un type correspond
            }
        }
    }

    // Aucun type ne correspond
    const typeList = types.join(' ou ');
    return [{
        error: `Type attendu : ${typeList}, obtenu : ${typeof value}`,
        path: context.path.join('.'),
        code: 'TYPE_MISMATCH'
    }];
}

/**
 * Fonction utilitaire pour vérifier si une valeur correspond à un type
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
