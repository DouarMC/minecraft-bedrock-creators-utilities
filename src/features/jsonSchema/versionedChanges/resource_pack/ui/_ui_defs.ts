import { SchemaType } from "../../../../../types/schema";

const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Ce fichier sert à réferencer les nouveaux fichiers d'UI crées. \nType: `Object`",
    "type": "object",
    "properties": {
        "ui_defs": {
            "description": "Définitions des fichiers d'UI (chemin.) \nType: `String[]`",
            "type": "array",
            "items": {
                "type": "string"
            }
        }
    }
};

export const _uiDefsSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/ui/_ui_defs.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};