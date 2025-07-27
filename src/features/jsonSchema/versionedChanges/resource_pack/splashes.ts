import { SchemaType } from "../../../../types/schema";

const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Ce fichier contient les textes de Splashs qui s'affichent sur le logo Minecraft au menu principal. \nType: `Object`",
    "type": "object",
    "required": ["splashes"],
    "properties": {
        "canMerge": {
            "description": "Si 'true', les entrées du fichier sont fusionnées avec celles existantes au lieu de les remplacer. \nType: `Boolean`",
            "default": false,
            "type": "boolean"
        },
        "splashes": {
            "description": "Contient les Textes de Splashs. \nType: `Array`",
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "conditional": {
            "description": "Contient les Textes de Splashs conditionnels. \nType: `Object[]`",
            "type": "array",
            "items": {
                "type": "object",
                "required": ["requires", "splashes"],
                "properties": {
                    "requires": {
                        "description": "Condition pour afficher le Splash. \nType: `Object`",
                        "type": "object",
                        "properties": {
                            "trialMode": {
                                "description": "Affiche le Splash uniquement en mode démo. \nType: `Boolean`",
                                "type": "boolean"
                            },
                            "platforms": {
                                "description": "Affiche le Splash uniquement sur les plateformes spécifiées. \nType: `String[]`",
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            }
                        }
                    },
                    "splashes": {
                        "description": "Contient les Textes de Splashs conditionnels. \nType: `String`",
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    }
                }
            }
        }
    }
};

export const splashesSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/splashes.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};