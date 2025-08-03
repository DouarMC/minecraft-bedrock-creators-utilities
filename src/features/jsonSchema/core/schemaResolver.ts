import { ALL_SCHEMAS } from './schemaRegistry';
import { SchemaType, SchemaModification } from '../../../types/schema';

export class SchemaResolver {
    
    public resolveSchemaForFile(filePath: string, fileContent?: string): any {
        // 1. Déterminer le type de schema selon le chemin
        const schemaType = this.getSchemaTypeFromPath(filePath);
        
        // 2. Extraire la format_version du contenu
        const formatVersion = this.extractFormatVersion(fileContent);
        
        // 3. Appliquer les changements versionnés
        const finalSchema = this.applyVersioning(schemaType, formatVersion);
        
        return finalSchema;
    }

    private getSchemaTypeFromPath(filePath: string): SchemaType | undefined {
        // Normaliser le chemin (remplacer les \ par /)
        const normalizedPath = filePath.replace(/\\/g, '/');
        
        // Chercher le premier schema qui match
        for (const schema of ALL_SCHEMAS) {
            for (const pattern of schema.fileMatch) {
                if (this.matchesPattern(normalizedPath, pattern)) {
                    return schema;
                }
            }
        }
        
        return undefined;
    }

    private matchesPattern(filePath: string, pattern: string): boolean {
        // Convertir le pattern glob en regex
        let regexPattern = pattern
            // Échapper les caractères spéciaux sauf * et **
            .replace(/[.+^${}()|[\]\\]/g, '\\$&')
            // ** = n'importe quel chemin (y compris vide)
            .replace(/\*\*/g, '§DOUBLESTAR§')
            // * = n'importe quoi sauf /
            .replace(/\*/g, '[^/]*')
            // Remettre ** 
            .replace(/§DOUBLESTAR§/g, '.*');
        
        // Si le pattern commence par **, permettre qu'il match n'importe où dans le chemin
        if (pattern.startsWith('**/')) {
            regexPattern = '(^|.*/)' + regexPattern.substring(2);
        }
        
        const regex = new RegExp('^' + regexPattern + '$');
        return regex.test(filePath);
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
        
        return result;
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