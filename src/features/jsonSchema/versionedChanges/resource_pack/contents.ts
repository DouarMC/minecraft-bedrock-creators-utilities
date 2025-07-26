import { SchemaType } from "../../../../types/schema";

const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Ce fichier sert à repertorier tous les fichiers présents dans un Pack pour des meilleures performances. \nType : Object",
    "type": "object",
    "properties": {
        "content": {
            "description": "Liste contenant le chemin d'accès de tous les fichiers présents dans ce Pack. \nType : Object[]",
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "path": {
                        "description": "Le chemin d'accès d'un fichier du pack. \nType : String",
                        "type": "string"
                    }
                }
            }
        }
    }
};

export const contentsSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/contents.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};