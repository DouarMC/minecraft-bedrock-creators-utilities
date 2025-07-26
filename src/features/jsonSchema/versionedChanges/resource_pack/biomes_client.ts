import { SchemaType } from "../../../../types/schema";

const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Ce fichier contient les propriétés Client des Biomes (les fichiers client biomes ont la priorité). \nType: `Object`",
    "type": "object",
    "required": ["biomes"],
    "properties": {
        "biomes": {
            "description": "Contient les Biomes auquel on peut attribuer des propriétés. \nType: `Object`",
            "type": "object",
            "additionalProperties": {
                "type": "object",
                "properties": {
                    "fog_identifier": {
                        "description": "L'identifiant du brouillard utilisé dans le biome. \nType: `String`",
                        "type": "string",
                        "pattern": "^[a-zA-Z0-9_]+:[a-zA-Z0-9_]+$"
                    },
                    "fog_ids_to_merge": {
                        "description": "Liste d'identifiants de brouillard à fusionner avec le brouillard principal du biome. \nType: `String[]`",
                        "type": "array",
                        "items": {
                            "type": "string",
                            "pattern": "^[a-zA-Z0-9_]+:[a-zA-Z0-9_]+$"
                        }
                    },
                    "inherit_from_prior_fog": {
                        "description": "Détermine si le brouillard du biome doit hériter du brouillard du biome précédent dans la liste des biomes. \nType: `Boolean`",
                        "type": "boolean"
                    },
                    "remove_all_prior_fog": {
                        "description": "Détermine si le brouillard du biome doit supprimer tous les brouillards précédents dans la liste des biomes. \nType: `Boolean`",
                        "type": "boolean"
                    },
                    "water_surface_color": {
                        "description": "Définit la couleur de la surface de l'eau dans le biome. \nType: `String | Integer[3]`",
                        "oneOf": [
                            {
                                "type": "string",
                                "pattern": "^#[0-9a-fA-F]{6}$"
                            },
                            {
                                "type": "array",
                                "items": {
                                    "type": "integer",
                                    "minimum": 0,
                                    "maximum": 255
                                },
                                "minItems": 3,
                                "maxItems": 3
                            }
                        ]
                    }
                }
            }
        }
    }
};

export const biomesClientSchemaType: SchemaType = {
    fileMatch: ["**/addon/resource_pack/biomes_client.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};