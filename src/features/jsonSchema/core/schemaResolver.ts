import { ALL_SCHEMAS } from './schemaRegistry';
import { SchemaType, SchemaModification } from '../../../types/schema';

export class SchemaResolver {
    
    public resolveSchemaForFile(filePath: string, fileContent?: string): any {
        console.log(`🔍 SchemaResolver: Resolving schema for file: ${filePath}`);
        
        // 1. Déterminer le type de schema selon le chemin
        const schemaType = this.getSchemaTypeFromPath(filePath);
        console.log(`📋 SchemaResolver: Schema type found:`, schemaType ? schemaType.fileMatch : 'NONE');
        
        if (!schemaType) {
            console.log(`❌ SchemaResolver: No schema type found for file: ${filePath}`);
            return undefined;
        }
        
        // 2. Extraire la format_version du contenu
        const formatVersion = this.extractFormatVersion(fileContent);
        console.log(`📅 SchemaResolver: Format version extracted: ${formatVersion}`);
        
        // 3. Appliquer les changements versionnés
        const finalSchema = this.applyVersioning(schemaType, formatVersion);
        console.log(`✅ SchemaResolver: Final schema resolved successfully`);
        
        return finalSchema;
    }

    private getSchemaTypeFromPath(filePath: string): SchemaType | undefined {
        // Normaliser le chemin (remplacer les \ par /)
        const normalizedPath = filePath.replace(/\\/g, '/');
        console.log(`🔍 SchemaResolver: Normalized path: ${normalizedPath}`);
        console.log(`🔍 SchemaResolver: Available schemas count: ${ALL_SCHEMAS.length}`);
        
        // Chercher le premier schema qui match
        for (const schema of ALL_SCHEMAS) {
            console.log(`🔍 SchemaResolver: Checking schema with patterns:`, schema.fileMatch);
            for (const pattern of schema.fileMatch) {
                console.log(`🔍 SchemaResolver: Testing pattern "${pattern}" against "${normalizedPath}"`);
                if (this.matchesPattern(normalizedPath, pattern)) {
                    console.log(`✅ SchemaResolver: Pattern "${pattern}" MATCHED!`);
                    return schema;
                } else {
                    console.log(`❌ SchemaResolver: Pattern "${pattern}" did not match`);
                }
            }
        }
        
        return undefined;
    }

    private matchesPattern(filePath: string, pattern: string): boolean {
        console.log(`🔍 matchesPattern: Testing "${filePath}" against "${pattern}"`);
        
        // Approche plus simple : utiliser micromatch ou une logique basique
        // Pour les patterns **/xxx, on vérifie juste si le chemin contient xxx
        if (pattern.startsWith('**/')) {
            const suffix = pattern.substring(3); // Enlever "**/", garder le reste
            
            // Convertir le suffix en regex, mais traiter **/ spécialement
            let suffixRegex = suffix
                // Remplacer **/ par un placeholder spécial
                .replace(/\*\*\//g, '§DOUBLESTARSLASH§')
                // Échapper les caractères spéciaux
                .replace(/[.+^${}()|[\]\\]/g, '\\$&')
                // Remplacer * par [^/]*
                .replace(/\*/g, '[^/]*')
                // Remettre **/ comme (?:.*/)? (optionnel avec le /)
                .replace(/§DOUBLESTARSLASH§/g, '(?:.*/)?');
            
            // Vérifier si le chemin CONTIENT ce pattern
            const regex = new RegExp('(^|.*/)' + suffixRegex + '$');
            const matches = regex.test(filePath);
            
            console.log(`🔍 matchesPattern: Suffix pattern: (^|.*/)${suffixRegex}$`);
            console.log(`🔍 matchesPattern: Result: ${matches}`);
            return matches;
        } else {
            // Pattern normal - match exact
            let regexPattern = pattern
                .replace(/\*\*/g, '§DOUBLESTAR§')
                .replace(/[.+^${}()|[\]\\]/g, '\\$&')
                .replace(/\*/g, '[^/]*')
                .replace(/§DOUBLESTAR§/g, '.*');
            
            const regex = new RegExp('^' + regexPattern + '$');
            const matches = regex.test(filePath);
            
            console.log(`🔍 matchesPattern: Full pattern: ^${regexPattern}$`);
            console.log(`🔍 matchesPattern: Result: ${matches}`);
            return matches;
        }
    }

    private extractFormatVersion(content?: string): string | undefined {
        if (!content) return undefined;
        
        try {
            const json = JSON.parse(content);
            return json.format_version;
        } catch {
            return undefined;
        }
    }

    private applyVersioning(schemaType: SchemaType | undefined, version?: string): any {
        if (!schemaType) {
            return undefined;
        }
        
        // Si pas de version, retourner le schema de base
        if (!version) {
            return schemaType.baseSchema;
        }
        
        // Appliquer le versioning (tu peux réutiliser ta logique existante)
        return this.applyVersionedChanges(schemaType, version);
    }

    private applyVersionedChanges(schemaType: SchemaType, formatVersion: string): any {
        // Copier le schema de base
        const result = JSON.parse(JSON.stringify(schemaType.baseSchema));
        
        // Parcourir tous les changements versionnés
        for (const changeSet of schemaType.versionedChanges) {
            // Si la version du fichier >= version du changement, appliquer
            if (this.compareVersions(formatVersion, changeSet.version) >= 0) {
                this.applyChanges(result, changeSet.changes);
            }
        }
        
        // Handle oneOf/anyOf/allOf during schema resolution by merging versioned changes
        this.mergeVersionedCombinators(result, formatVersion);
        
        return result;
    }

    /**
     * Merge versioned changes with base schemas based on format_version for combinators
     */
    private mergeVersionedCombinators(schema: any, formatVersion: string): void {
        if (!schema || typeof schema !== 'object') {
            return;
        }
        
        // Process oneOf/anyOf/allOf recursively
        if (schema.oneOf || schema.anyOf || schema.allOf) {
            const alternatives = schema.oneOf || schema.anyOf || schema.allOf;
            
            for (const alternative of alternatives) {
                if (alternative.format_version) {
                    // Check if this alternative should be included based on version
                    if (this.compareVersions(formatVersion, alternative.format_version) >= 0) {
                        this.mergeVersionedCombinators(alternative, formatVersion);
                    }
                } else {
                    this.mergeVersionedCombinators(alternative, formatVersion);
                }
            }
        }
        
        // Recursively process properties and items
        if (schema.properties) {
            for (const property of Object.values(schema.properties)) {
                this.mergeVersionedCombinators(property, formatVersion);
            }
        }
        
        if (schema.items) {
            this.mergeVersionedCombinators(schema.items, formatVersion);
        }
        
        // Handle patternProperties and additionalProperties
        if (schema.patternProperties) {
            for (const pattern of Object.values(schema.patternProperties)) {
                this.mergeVersionedCombinators(pattern, formatVersion);
            }
        }
        
        if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
            this.mergeVersionedCombinators(schema.additionalProperties, formatVersion);
        }
    }

    private compareVersions(a: string, b: string): number {
        const aParts = a.split('.').map(Number);
        const bParts = b.split('.').map(Number);
        const maxLength = Math.max(aParts.length, bParts.length);

        for (let i = 0; i < maxLength; i++) {
            const aNum = aParts[i] ?? 0;
            const bNum = bParts[i] ?? 0;

            if (aNum > bNum) return 1;
            if (aNum < bNum) return -1;
        }

        return 0;
    }

    private applyChanges(schema: any, changes: SchemaModification[]): void {
        for (const change of changes) {
            switch (change.action) {
                case "add":
                case "modify":
                    this.setNestedValue(schema, change.target, change.value);
                    break;
                case "remove":
                    this.deleteNestedValue(schema, change.target);
                    break;
            }
        }
    }

    private setNestedValue(obj: any, path: string[], value: any): void {
        // Naviguer jusqu'au parent
        let current = obj;
        for (let i = 0; i < path.length - 1; i++) {
            if (!current[path[i]]) {
                current[path[i]] = {};
            }
            current = current[path[i]];
        }
        // Définir la valeur finale
        current[path[path.length - 1]] = value;
    }

    private deleteNestedValue(obj: any, path: string[]): void {
        // Naviguer jusqu'au parent
        let current = obj;
        for (let i = 0; i < path.length - 1; i++) {
            if (!current[path[i]]) return;
            current = current[path[i]];
        }
        // Supprimer la propriété
        delete current[path[path.length - 1]];
    }
}