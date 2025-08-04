import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addKeywords from 'ajv-keywords';
import { CustomKeywords } from './customKeywords';
import { DynamicExamplesProvider } from './dynamicExamplesProvider';

/**
 * Compilateur AJV centralisé pour tous les schemas JSON
 */
export class AjvCompiler {
    private ajv: Ajv;
    private compiledSchemas = new Map<string, any>();
    private customKeywords: CustomKeywords;
    private dynamicExamplesProvider: DynamicExamplesProvider;

    constructor() {
        // Configuration AJV
        this.ajv = new Ajv({
            allErrors: true,        // Toutes les erreurs
            verbose: true,          // Messages détaillés
            strict: false,          // Pas trop strict pour Minecraft
            validateFormats: true   // Validation des formats
        });

        // Ajouter les plugins
        addFormats(this.ajv);
        addKeywords(this.ajv);
        
        // AJV 8.x gère automatiquement les méta-schemas, on peut juste ajouter l'ID
        this.ajv.addMetaSchema({}, "https://json-schema.org/draft-07/schema#");
    
        // Initialiser les providers
        this.dynamicExamplesProvider = new DynamicExamplesProvider();
        this.customKeywords = new CustomKeywords(this.dynamicExamplesProvider);

        // Ajouter tes custom keywords
        this.setupCustomKeywords();
    }

    private setupCustomKeywords() {
        this.customKeywords.setupKeywords(this.ajv);
    }

    public compileSchema(schema: any, schemaId: string) {
        // Vérifier si déjà en cache
        if (this.compiledSchemas.has(schemaId)) {
            return this.compiledSchemas.get(schemaId);
        }

        // Compiler le schema
        const compiledSchema = this.ajv.compile(schema);
        
        // Mettre en cache
        this.compiledSchemas.set(schemaId, compiledSchema);
        
        return compiledSchema;
    }

    public validate(data: any, schemaId: string) {
        const compiledSchema = this.compiledSchemas.get(schemaId);
        if (!compiledSchema) {
            throw new Error(`Schema ${schemaId} not compiled`);
        }

        const valid = compiledSchema(data);
        const errors = compiledSchema.errors || [];
        
        // Post-process and cluster oneOf validation errors for precise diagnostics
        const processedErrors = this.postProcessOneOfErrors(errors);
        
        return {
            valid,
            errors: processedErrors
        };
    }

    /**
     * Clusters and post-processes oneOf validation errors for more precise diagnostics
     */
    private postProcessOneOfErrors(errors: any[]): any[] {
        const processedErrors: any[] = [];
        const oneOfErrorGroups = new Map<string, any[]>();
        
        // Group oneOf errors by their instancePath
        for (const error of errors) {
            if (error.keyword === 'oneOf') {
                const path = error.instancePath || '';
                if (!oneOfErrorGroups.has(path)) {
                    oneOfErrorGroups.set(path, []);
                }
                oneOfErrorGroups.get(path)!.push(error);
            } else {
                // Keep non-oneOf errors as is
                processedErrors.push(error);
            }
        }
        
        // Process each oneOf error group
        for (const [path, groupErrors] of oneOfErrorGroups) {
            const clusteredError = this.clusterOneOfErrors(groupErrors);
            if (clusteredError) {
                processedErrors.push(clusteredError);
            }
        }
        
        return processedErrors;
    }

    /**
     * Clusters multiple oneOf errors into a single, more meaningful error
     */
    private clusterOneOfErrors(oneOfErrors: any[]): any | null {
        if (oneOfErrors.length === 0) {
            return null;
        }
        
        const firstError = oneOfErrors[0];
        const allowedValues: string[] = [];
        
        // Extract meaningful information from oneOf alternatives
        for (const error of oneOfErrors) {
            if (error.params && error.params.passingSchemas !== undefined) {
                // This is a oneOf error with information about alternatives
                const schemas = error.schema;
                if (Array.isArray(schemas)) {
                    for (const schema of schemas) {
                        if (schema.const !== undefined) {
                            allowedValues.push(String(schema.const));
                        } else if (schema.enum) {
                            allowedValues.push(...schema.enum.map(String));
                        } else if (schema.type) {
                            allowedValues.push(`{${schema.type}}`);
                        }
                    }
                }
            }
        }
        
        // Create a more meaningful error message
        const clusteredError = {
            ...firstError,
            message: allowedValues.length > 0 
                ? `Value must match one of: ${allowedValues.join(', ')}`
                : 'Value must match one of the allowed alternatives',
            params: {
                ...firstError.params,
                allowedValues
            }
        };
        
        return clusteredError;
    }

    public clearCache() {
        this.compiledSchemas.clear();
    }
}