import { SchemaType } from "../../../../types/schema";

const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Ce fichier sert à appliquer des textures référencés (uniquement pour les blocs sans les components minecraft:geometry et minecraft:material_instances), des sons référencés et autres à des blocs. \n Type: `Object`",
    "type": "object",
    "required": ["format_version"],
    "properties": {
        "format_version": {
            "description": "La version du Format à utiliser.",
            "oneOf": [
                {
                    "$ref": "https://douarmc.github.io/minecraft_bedrock_json_schemas/common.json#/definitions/minecraft_version"
                },
                {
                    "type": "array",
                    "minItems": 3,
                    "maxItems": 3,
                    "items": {
                        "type": "integer"
                    }
                }
            ]
        }
    },
    "additionalProperties": {
        "type": "object",
        "properties": {
            "textures": {
                "description": "Définit les références de textures à appliquer aux différentes faces du Bloc. \nType: `String | Object`",
                "oneOf": [
                    {
                        "type": "string"
                    },
                    {
                        "type": "object",
                        "propertyNames": {
                            "enum": ["down", "up", "north", "east", "south", "west"]
                        },
                        "additionalProperties": {
                            "description": "La référence de texture à appliquer sur la face du Bloc. \n Type: `String`",
                            "type": "string"
                        }
                    }
                ]
            },
            "sound": {
                "description": "Les sons fait par le Bloc. \n Type: `String` \n Note: Il faut mettre une référence de son crée dans le fichier `sounds.json`.",
                "type": "string"
            },
            "ambient_occlusion_exponent": {
                "description": "Définit l'occlusion ambiante du Bloc. \n Type: `Number`",
                "type": "number"
            },
            "carried_textures": {
                "description": "Définit les textures du Bloc quand il est dans l'inventaire. \n Type: `String | Object`",
                "$ref": "#/additionalProperties/properties/textures"
            },
            "isotropic": {
                "description": "Définit les faces qui seront rotationné aléatoirement. \n Type: `Boolean | Object`",
                "oneOf": [
                    {
                        "type": "boolean"
                    },
                    {
                        "type": "object",
                        "propertyNames": {
                            "enum": ["down", "up", "north", "east", "south", "west"]
                        },
                        "additionalProperties": {
                            "description": "Définit si la face du Bloc sera rotationné aléatoirement. \n Type: `Boolean`",
                            "type": "boolean"
                        }
                    }
                ]
            }
        }
    }
};

export const blocksSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/blocks.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};