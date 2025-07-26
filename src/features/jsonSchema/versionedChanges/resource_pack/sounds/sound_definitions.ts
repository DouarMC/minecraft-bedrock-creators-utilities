import { SchemaType } from "../../../../../types/schema";

const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Ce fichier sert à référencer les sons. \nType: `Object`",
    "type": "object",
    "required": ["sound_definitions"],
    "properties": {
        "format_version": {
            "description": "La version du format à utiliser pour ce fichier. \nType: `String`",
            "type": "string"
        },
        "sound_definitions": {
            "description": "Contient la définition des sons du jeu. \nType: `Object`",
            "type": "object",
            "additionalProperties": {
                "type": "object",
                "properties": {
                    "__use_legacy_max_distance": {
                        "description": "Définit si le distance maximale obsolète doit être utilisée. \nType: `Boolean`",
                        "type": "boolean"
                    },
                    "category": {
                        "description": "La catégorie du son. \nType: `String`",
                        "type": "string", 
                        "enum": ["weather", "block", "bucket", "bottle", "ui", "player", "hostile", "music", "record", "neutral"]
                    },
                    "max_distance": {
                        "description": "La distance maximale à laquelle le son peut être entendu. \nType: `Number | Null`",
                        "oneOf": [
                            {"type": "number"},
                            {"type": "null"}
                        ]
                    },
                    "min_distance": {
                        "description": "La distance minimale à laquelle le son peut être entendu. \nType: `Number | Null`",
                        "oneOf": [
                            {"type": "number"},
                            {"type": "null"}
                        ]
                    },
                    "sounds": {
                        "description": "Le ou les chemins des fichiers audio. \nType: `(String | Object)[]`",
                        "type": "array",
                        "items": {
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "name": {
                                            "description": "Le chemin du fichier audio. \nType: `String`",
                                            "type": "string"
                                        },
                                        "stream": {
                                            "description": "Définit si le fichier audio doit être streamé. \nType: `Boolean`",
                                            "type": "boolean"
                                        },
                                        "volume": {
                                            "description": "Le volume du son. \nType: `Number`",
                                            "type": "number"
                                        },
                                        "load_on_low_memory": {
                                            "description": "Définit si le fichier audio doit être chargé en mémoire basse. \nType: `Boolean`",
                                            "type": "boolean"
                                        },
                                        "pitch": {
                                            "description": "La hauteur du son. \nType: `Number`",
                                            "type": "number"
                                        },
                                        "is3D": {
                                            "description": "Définit si le son est en 3D. \nType: `Boolean`",
                                            "type": "boolean"
                                        },
                                        "interruptible": {
                                            "description": "Définit si le son peut être interrompu. \nType: `Boolean`",
                                            "type": "boolean"
                                        },
                                        "weight": {
                                            "description": "Le poids du son. \nType: `Number`",
                                            "type": "number"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        }
    }
};

export const soundDefinitionsSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/sounds/sound_definitions.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};