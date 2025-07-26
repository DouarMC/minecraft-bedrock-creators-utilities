import { SchemaType } from "../../../../../types/schema";

const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Ce fichier sert à créer des variables globales pour l'ensemble des fichiers d'UI. \nType: `Object`",
    "type": "object",
    "propertyNames": {
        "pattern": "^\\$.*$"
    }
};

export const _globalVariablesSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/ui/_global_variables.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};