import { SchemaType } from "../../../../../types/schema";

const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Ce fichier sert à lister les textures utilisées dans ce Resource Pack. \n Type: `(Path String)[]`",
    "type": "array",
    "items": {
        "type": "string",
        "pattern": "^textures\\/.*"
    }
};

export const texturesListSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/textures/textures_list.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};