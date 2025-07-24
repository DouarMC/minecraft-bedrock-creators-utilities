import { 
    SchemaValidationResult, 
    SchemaError, 
    ValidationContext, 
    SchemaValidatorOptions,
    ValidationCache,
    CustomValidator,
    TypeValidator,
    ConstraintValidator
} from './types';
import { TypeValidators, validateMultipleTypes } from './validators/typeValidators';
import { ConstraintValidators } from './validators/constraintValidators';
import { OneOfValidator } from './validators/oneOfValidator';
import { AnyOfValidator } from './validators/anyOfValidator';
import { SimpleCache } from './cache/simpleCache';

/**
 * Moteur de validation JSON Schema modulaire et extensible
 */
export class ValidationEngine {
    private typeValidators: Map<string, TypeValidator>;
    private constraintValidators: Map<string, ConstraintValidator>;
    private customValidators: Map<string, CustomValidator>;
    private cache: ValidationCache;
    private options: Required<SchemaValidatorOptions>;

    constructor(options: SchemaValidatorOptions = {}) {
        this.options = {
            strictMode: options.strictMode ?? true,
            maxDepth: options.maxDepth ?? 50,
            enableCache: options.enableCache ?? true,
            customValidators: options.customValidators ?? new Map()
        };

        this.typeValidators = new Map();
        this.constraintValidators = new Map();
        this.customValidators = this.options.customValidators;
        this.cache = new SimpleCache();

        this.initializeDefaultValidators();
    }

    /**
     * Valide une valeur contre un schéma JSON Schema
     */
    public validate(schema: any, value: any, initialPath: string[] = []): SchemaValidationResult {
        if (!schema || typeof schema !== 'object') {
            return this.createResult(null, [], false);
        }

        const context = this.createContext(schema, initialPath);
        
        // Vérification du cache
        if (this.options.enableCache) {
            const cacheKey = this.generateCacheKey(schema, value, context);
            const cached = this.cache.get(cacheKey);
            if (cached) {
                return cached;
            }
        }

        const result = this.validateWithContext(schema, value, context);

        // Mise en cache du résultat
        if (this.options.enableCache && context.path.length < 10) {
            const cacheKey = this.generateCacheKey(schema, value, context);
            this.cache.set(cacheKey, result);
        }

        return result;
    }

    /**
     * Validation avec contexte
     */
    private validateWithContext(schema: any, value: any, context: ValidationContext): SchemaValidationResult {
        // Protection contre la récursion infinie
        if (context.path.length > this.options.maxDepth) {
            return this.createResult(schema, [{ 
                error: 'Profondeur de validation maximale atteinte',
                path: context.path.join('.'),
                code: 'MAX_DEPTH_EXCEEDED'
            }], false);
        }

        // Gestion des références JSON Schema ($ref)
        if (schema.$ref) {
            const resolvedSchema = this.resolveReference(schema.$ref, context.rootSchema);
            if (resolvedSchema) {
                return this.validateWithContext(resolvedSchema, value, context);
            }
        }

        // Validation oneOf (priorité la plus haute)
        if (Array.isArray(schema.oneOf)) {
            return OneOfValidator.validate(schema, value, context, this);
        }

        // Validation anyOf
        if (Array.isArray(schema.anyOf)) {
            return AnyOfValidator.validate(schema, value, context, this);
        }

        // Validation allOf
        if (Array.isArray(schema.allOf)) {
            return this.validateAllOf(schema, value, context);
        }

        // Validation custom
        const customResult = this.tryCustomValidators(schema, value, context);
        if (customResult) {
            return customResult;
        }

        // Validation standard
        return this.validateStandard(schema, value, context);
    }

    /**
     * Validation standard (type + contraintes)
     */
    private validateStandard(schema: any, value: any, context: ValidationContext): SchemaValidationResult {
        const errors: SchemaError[] = [];

        // Validation du type
        if (schema.type) {
            if (Array.isArray(schema.type)) {
                const typeErrors = validateMultipleTypes(value, schema.type, context);
                errors.push(...typeErrors);
            } else {
                const typeValidator = this.getTypeValidator(schema.type);
                if (typeValidator) {
                    const typeErrors = typeValidator.validate(value, schema, context);
                    errors.push(...typeErrors);
                }
            }
        }

        // Validation des contraintes
        for (const [constraint, constraintValue] of Object.entries(schema)) {
            if (constraint === 'type' || constraint === 'oneOf' || constraint === 'anyOf' || constraint === 'allOf') {
                continue; // Déjà traité
            }

            const constraintValidator = this.constraintValidators.get(constraint);
            if (constraintValidator && constraintValue !== undefined) {
                const constraintErrors = constraintValidator.validate(value, constraintValue, schema, context);
                errors.push(...constraintErrors);
            }
        }

        // Validation des propriétés d'objet
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            const objectErrors = this.validateObjectProperties(schema, value, context);
            errors.push(...objectErrors);
        }

        // Validation des éléments de tableau
        if (Array.isArray(value) && schema.items) {
            const arrayErrors = this.validateArrayItems(schema, value, context);
            errors.push(...arrayErrors);
        }

        return this.createResult(schema, errors, errors.length === 0);
    }

    /**
     * Validation des propriétés d'un objet
     */
    private validateObjectProperties(schema: any, value: any, context: ValidationContext): SchemaError[] {
        const errors: SchemaError[] = [];

        if (schema.properties) {
            for (const [propName, propSchema] of Object.entries(schema.properties)) {
                if (propName in value) {
                    const newContext = {
                        ...context,
                        path: [...context.path, propName]
                    };
                    const propResult = this.validateWithContext(propSchema, value[propName], newContext);
                    errors.push(...propResult.errors);
                }
            }
        }

        return errors;
    }

    /**
     * Validation des éléments d'un tableau
     */
    private validateArrayItems(schema: any, value: any[], context: ValidationContext): SchemaError[] {
        const errors: SchemaError[] = [];

        for (let i = 0; i < value.length; i++) {
            const itemSchema = Array.isArray(schema.items) ? schema.items[i] ?? {} : schema.items;
            const newContext = {
                ...context,
                path: [...context.path, i.toString()]
            };
            const itemResult = this.validateWithContext(itemSchema, value[i], newContext);
            errors.push(...itemResult.errors.map(error => ({
                ...error,
                path: newContext.path.join('.'),
                error: `Élément ${i + 1} : ${error.error}`
            })));
        }

        return errors;
    }

    /**
     * Validation allOf
     */
    private validateAllOf(schema: any, value: any, context: ValidationContext): SchemaValidationResult {
        const errors: SchemaError[] = [];
        let mergedSchema = { ...schema };

        for (const subSchema of schema.allOf) {
            const result = this.validateWithContext(subSchema, value, context);
            errors.push(...result.errors);
            
            // Fusionner les schémas pour allOf
            mergedSchema = { ...mergedSchema, ...subSchema };
        }

        return this.createResult(mergedSchema, errors, errors.length === 0);
    }

    /**
     * Essaie les validateurs personnalisés
     */
    private tryCustomValidators(schema: any, value: any, context: ValidationContext): SchemaValidationResult | null {
        for (const [name, validator] of this.customValidators) {
            if (validator.supports(schema)) {
                const errors = validator.validate(schema, value, context);
                return this.createResult(schema, errors, errors.length === 0);
            }
        }
        return null;
    }

    /**
     * Initialise les validateurs par défaut
     */
    private initializeDefaultValidators(): void {
        // Chargement des validateurs de type
        TypeValidators.forEach((validator: TypeValidator, type: string) => {
            this.typeValidators.set(type, validator);
        });

        // Chargement des validateurs de contrainte
        ConstraintValidators.forEach((validator: ConstraintValidator, constraint: string) => {
            this.constraintValidators.set(constraint, validator);
        });
    }

    /**
     * Crée un contexte de validation
     */
    private createContext(rootSchema: any, path: string[]): ValidationContext {
        return {
            path,
            rootSchema,
            visited: new Set(),
            strictMode: this.options.strictMode
        };
    }

    /**
     * Crée un résultat de validation
     */
    private createResult(schema: any, errors: SchemaError[], isValid: boolean): SchemaValidationResult {
        return {
            schema,
            errors,
            isValid,
            matchedSchema: isValid ? schema : undefined
        };
    }

    /**
     * Génère une clé de cache
     */
    private generateCacheKey(schema: any, value: any, context: ValidationContext): string {
        const schemaStr = JSON.stringify(schema);
        const valueStr = JSON.stringify(value);
        const pathStr = context.path.join('.');
        return `${schemaStr}:${valueStr}:${pathStr}`;
    }

    /**
     * Résout une référence JSON Schema
     */
    private resolveReference(ref: string, rootSchema: any): any {
        // Implémentation simplifiée - à améliorer selon les besoins
        if (ref.startsWith('#/')) {
            const path = ref.substring(2).split('/');
            let current = rootSchema;
            for (const part of path) {
                current = current?.[part];
            }
            return current;
        }
        return null;
    }

    /**
     * Obtient un validateur de type
     */
    private getTypeValidator(type: string): TypeValidator | null {
        return this.typeValidators.get(type) || null;
    }

    /**
     * Méthodes publiques pour l'extension du moteur
     */
    public registerTypeValidator(type: string, validator: TypeValidator): void {
        this.typeValidators.set(type, validator);
    }

    public registerConstraintValidator(constraint: string, validator: ConstraintValidator): void {
        this.constraintValidators.set(constraint, validator);
    }

    public registerCustomValidator(name: string, validator: CustomValidator): void {
        this.customValidators.set(name, validator);
    }

    public clearCache(): void {
        this.cache.clear();
    }

    public getCacheSize(): number {
        return this.cache.size();
    }
}
