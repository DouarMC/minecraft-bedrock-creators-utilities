import { SchemaType } from "../../../../../types/schema";

const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "La liste de toutes les langues utilisés dans ce Pack. \nType : String[]",
    "type": "array",
    "items": {
        "type": "string",
        "pattern": "^[a-z]{2}_[A-Z]{2}$"
    }
};

export const languagesSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/texts/languages.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};