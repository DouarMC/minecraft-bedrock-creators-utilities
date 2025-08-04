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
        return {
            valid,
            errors: compiledSchema.errors || []
        };
    }

    public clearCache() {
        this.compiledSchemas.clear();
    }
}