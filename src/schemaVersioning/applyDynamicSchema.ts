import { applyVersionedChanges } from './applyVersionedChanges';
import { SchemaType } from './registry';
import * as vscode from 'vscode';

function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

export async function applyDynamicSchema(formatVersion: string | null, extensionPath: string, schemaType: SchemaType) {
    try {
        const base = deepClone(schemaType.baseSchema);
        // const versionedSchema = applyVersionedChanges(base, formatVersion, schemaType.versionedChanges);
        const versionedSchema = schemaType.versionedChanges.length === 0 || !formatVersion
            ? base
            : applyVersionedChanges(base, formatVersion, schemaType.versionedChanges);

        const config = vscode.workspace.getConfiguration('json');
        const existingSchemas = config.get<any[]>('schemas') || [];

        const fileMatchSet = new Set(schemaType.fileMatch);
        const newSchemaStr = JSON.stringify(versionedSchema);

        console.log("COUBEHHHHHH");

        let hasChanged = true;
        const filtered = existingSchemas.filter(s => {
            const sFileMatch = s.fileMatch ?? [];
            const sameMatch = sFileMatch.length === schemaType.fileMatch.length &&
                sFileMatch.every((m: string) => fileMatchSet.has(m));
            
            if (sameMatch) {
                const currentSchemaStr = JSON.stringify(s.schema ?? {});
                if (currentSchemaStr === newSchemaStr) {
                    hasChanged = false;
                }
                return false; // remove the old one
            }

            return true;
        });

        /*
        if (!hasChanged) {
            return; // ✅ Le schéma est déjà en place, inutile de réécrire
        } // ✅ Le schéma est déjà en place, inutile de réécrire
        */

        console.log("FEUR");

        filtered.push({
            fileMatch: schemaType.fileMatch,
            schema: versionedSchema
        });

        console.log("RADO");

        await config.update('schemas', filtered, vscode.ConfigurationTarget.Workspace);

        console.log("JSOPPOPP");
    } catch (error) {
        console.error("❌ Erreur lors de l'application du schéma dynamique :", error);
        vscode.window.showErrorMessage('Erreur pendant la génération du schéma dynamique. Voir la console.');
    }
}
