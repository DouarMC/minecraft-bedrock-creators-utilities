import { SchemaType } from "../../../../../types/schema";

const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "La liste de toutes les langues à ajouter ou modifier avec ce Pack. \nType: `Array[]`",
    "type": "array",
    "items": [
        {
            "type": "array",
            "items": [
                {
                    "type": "string",
                    "pattern": "^[a-z]{2}_[A-Z]{2}$"
                },
                {
                    "type": "string"
                }
            ]
        }
    ]
};

export const languagesNamesSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/texts/languages_names.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};