import { SchemaChange } from "./SchemaChange";
import { MinecraftJsonSchema } from "../MinecraftJsonSchema";

/**
 * Schéma JSON versionné :
 * - un fichier cible (fileMatch)
 * - un schéma de base
 * - une liste de changements versionnés
 */
export interface VersionedSchema {
    fileMatch: string[];
    baseSchema: MinecraftJsonSchema;
    versionedChanges: SchemaChange[];
}