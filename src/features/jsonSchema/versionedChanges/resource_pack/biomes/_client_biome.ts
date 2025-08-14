import { SchemaChange, SchemaType } from "../../../../../types/schema";
import { dynamicExamplesSourceKeys } from "../../../shared/schemaEnums";
import { schemaPatterns } from "../../../shared/schemaPatterns";

const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "desscription": "Définit les propriétés du client du biome. \nType: `Object`",
    "type": "object",
    "required": ["format_version", "minecraft:client_biome"],
    "properties": {
        "format_version": {
            "description": "La version du Format à utiliser. \nType: `String`",
            "type": "string",
            enum: [
                "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
            ]
        },
        "minecraft:client_biome": {
            "description": "Contient toute la définition du client du biome. \nType: `Object`",
            "type": "object",
            "required": ["description", "components"],
            "properties": {
                "description": {
                    "description": "Contient toute la description du biome. \nType: `Object`",
                    "type": "object",
                    "required": ["identifier"],
                    "properties": {
                        "identifier": {
                            "description": "L'identifiant du biome. \nType: `String`",
                            "type": "string",
                            "x-dynamic-examples-source": [dynamicExamplesSourceKeys.biome_ids, dynamicExamplesSourceKeys.vanilla_biome_ids_without_namespace]
                        }
                    }
                },
                "components": {
                    "description": "Contient les composants du client du Biome. \nType: `Object`",
                    "type": "object",
                    "properties": {
                        "minecraft:ambient_sounds": {
                            "description": "Définit les sons ambiants du biome. Ces sons doivent être dans les 'individual_named_sounds' dans un fichier 'sounds.json'. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "addition": {
                                    "description": "Son nommé qui se joue occasionnellement à la position de l'auditeur. \nType: `String`",
                                    "type": "string"
                                },
                                "loop": {
                                    "description": "Son nommé qui se joue en boucle tant que la position de l'auditeur est à l'intérieur du biome. \nType: `String`",
                                    "type": "string"
                                },
                                "mood": {
                                    "description": "Son nommé qui se joue rarement à une position de bloc d'air proche lorsque le niveau de lumière est faible. Les biomes sans son d'ambiance d'humeur utiliseront le son 'ambient.cave'. \nType: `String`",
                                    "type": "string"
                                }
                            }
                        },
                        "minecraft:biome_music": {
                            "description": "Définit comment la musique est jouée dans le biome. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "volume_multiplier": {
                                    "description": "Multiplicateur temporaire et progressif appliqué au volume de la musique lorsqu'on se trouve dans ce biome. Doit être une valeur comprise entre 0 et 1, inclus. \nType: `Number`",
                                    "type": "number",
                                    "minimum": 0.0,
                                    "maximum": 1.0
                                }
                            }
                        },
                        "minecraft:fog_appearance": {
                            "description": "Définit les paramètres de brouillard utilisés pendant le rendu. Les biomes sans ce composant auront des paramètres de brouillard par défaut. \nType: `Object`",
                            "type": "object",
                            "required": ["fog_identifier"],
                            "properties": {
                                "fog_identifier": {
                                    "description": "Identifier du brouillard à utiliser. \nType: `String`",
                                    "type": "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.fog_ids
                                }
                            }
                        },
                        "minecraft:foliage_appearance": {
                            "description": "Définit la couleur de la végétation ou la carte de couleur utilisée pendant le rendu. Les biomes sans ce composant auront un comportement de végétation par défaut. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "color": {
                                    "description": "La couleur RGB de la végétation ou la carte de couleur utilisée pendant le rendu. \nType: `String | Integer[3] | Object`",
                                    "oneOf": [
                                        {
                                            "oneOf": [
                                                {
                                                    "type": "string",
                                                    "pattern": "^#[0-9a-fA-F]{6}$"
                                                },
                                                {
                                                    "type": "array",
                                                    "minItems": 3,
                                                    "maxItems": 3,
                                                    "items": {
                                                        "type": "integer",
                                                        "minimum": 0,
                                                        "maximum": 255
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            "type": "object",
                                            "required": ["color_map"],
                                            "properties": {
                                                "color_map": {
                                                    "description": "Carte de couleur de textures/colormap pour déterminer la couleur de la végétation. \nType: `String`",
                                                    "type": "string",
                                                    "enum": ["foliage", "birch", "evergreen", "mangrove_swamp_foliage", "swamp_foliage"]
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        "minecraft:grass_appearance": {
                            "description": "Définit la couleur de l'herbe ou la carte de couleur utilisée pendant le rendu. Les biomes sans ce composant auront un comportement d'herbe par défaut. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "color": {
                                    "description": "Couleur RGB de l'herbe. \nType: `String | Integer[3]`",
                                    "oneOf": [
                                        {
                                            "oneOf": [
                                                {
                                                    "type": "string",
                                                    "pattern": "^#[0-9a-fA-F]{6}$"
                                                },
                                                {
                                                    "type": "array",
                                                    "minItems": 3,
                                                    "maxItems": 3,
                                                    "items": {
                                                        "type": "integer",
                                                        "minimum": 0,
                                                        "maximum": 255
                                                    }
                                                },
                                                {
                                                    "type": "object",
                                                    "required": ["color_map"],
                                                    "properties": {
                                                        "color_map": {
                                                            "description": "Carte de couleur de textures/colormap pour déterminer la couleur de l'herbe. \nType: `String`",
                                                            "type": "string",
                                                            "enum": ["grass", "swamp_grass"]
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        },
                        "minecraft:sky_color": {
                            "description": "Définit la couleur du ciel utilisée pendant le rendu. Les biomes sans ce composant auront un comportement de couleur de ciel par défaut. \nType: `Object`",
                            "type": "object",
                            "required": ["sky_color"],
                            "properties": {
                                "sky_color": {
                                    "description": "La couleur RGB du ciel. \nType: `String | Integer[3]`",
                                    "oneOf": [
                                        {
                                            "type": "string",
                                            "pattern": "^#[0-9a-fA-F]{6}$"
                                        },
                                        {
                                            "type": "array",
                                            "minItems": 3,
                                            "maxItems": 3,
                                            "items": {
                                                "type": "integer",
                                                "minimum": 0,
                                                "maximum": 255
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        "minecraft:water_appearance": {
                            "description": "Définit la couleur de la surface de l'eau utilisée pendant le rendu. Les biomes sans ce composant auront un comportement de couleur de surface d'eau par défaut. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "surface_color": {
                                    "description": "La couleur RGB de la surface de l'eau. \nType: `String | Integer[3]`",
                                    "oneOf": [
                                        {
                                            "type": "string",
                                            "pattern": "^#[0-9a-fA-F]{6}$"
                                        },
                                        {
                                            "type": "array",
                                            "minItems": 3,
                                            "maxItems": 3,
                                            "items": {
                                                "type": "integer",
                                                "minimum": 0,
                                                "maximum": 255
                                            }
                                        }
                                    ]
                                },
                                "surface_opacity": {
                                    "description": "Opacité de la surface de l'eau (doit être comprise entre 0 pour invisible et 1 pour opaque, inclus). \nType: `Number`",
                                    "type": "number",
                                    "minimum": 0.0,
                                    "maximum": 1.0
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

const versionedChanges: SchemaChange[] = [
    {
        version: "1.21.70",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:client_biome", "properties", "components", "properties", "minecraft:atmosphere_identifier"],
                value: {
                    "description": "Définit les paramètres d'atmosphère utilisés pendant le rendu différé. Les biomes sans ce composant auront des paramètres d'atmosphère par défaut. \nType: `Object`",
                    "type": "object",
                    "required": ["atmosphere_identifier"],
                    "properties": {
                        "atmosphere_identifier": {
                            "description": "Identifiant de l'atmosphère à utiliser. \nType: `String`",
                            "type": "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.atmosphere_settings_ids
                        }
                    }
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:client_biome", "properties", "components", "properties", "minecraft:color_grading_identifier"],
                value: {
                    "description": "Définit les paramètres de color grading utilisés pendant le rendu différé. Les biomes sans ce composant auront des paramètres de color grading par défaut. \nType: `Object`",
                    "type": "object",
                    "required": ["color_grading_identifier"],
                    "properties": {
                        "color_grading_identifier": {
                            "description": "Identifiant du color grading à utiliser. \nType: `String`",
                            "type": "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.color_grading_settings_ids
                        }
                    }
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:client_biome", "properties", "components", "properties", "minecraft:dry_foliage_color"],
                value: {
                    "description": "Définit la couleur de la végétation sèche utilisée pendant le rendu. Les biomes sans ce composant auront un comportement de couleur de végétation sèche par défaut. \nType: `Object`",
                    "type": "object",
                    "required": ["color"],
                    "properties": {
                        "color": {
                            "description": "La couleur RGB de la végétation sèche. \nType: `String | Integer[3]`",
                            "oneOf": [
                                {
                                    "type": "string",
                                    "pattern": "^#[0-9a-fA-F]{6}$"
                                },
                                {
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 255
                                    }
                                }
                            ]
                        }
                    }
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:client_biome", "properties", "components", "properties", "minecraft:lighting_identifier"],
                value: {
                    "description": "Définit les paramètres d'éclairage utilisés pendant le rendu différé. Les biomes sans ce composant auront des paramètres d'éclairage par défaut. \nType: `Object`",
                    "type": "object",
                    "required": ["lighting_identifier"],
                    "properties": {
                        "lighting_identifier": {
                            "description": "Identifiant de l'éclairage à utiliser. \nType: `String`",
                            "type": "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.lighting_settings_ids
                        }
                    }
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:client_biome", "properties", "components", "properties", "minecraft:water_identifier"],
                value: {
                    "description": "Définit les paramètres de l'eau utilisés pendant le rendu différé. Les biomes sans ce composant auront des paramètres d'eau par défaut. \nType: `Object`",
                    "type": "object",
                    "required": ["water_identifier"],
                    "properties": {
                        "water_identifier": {
                            "description": "Identifiant de l'eau à utiliser. \nType: `String`",
                            "type": "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.water_settings_ids
                        }
                    }
                }
            }
        ]
    },
    {
        version: "1.21.90",
        changes: [
            {
                action: "modify",
                target: ["properties", "minecraft:client_biome", "properties", "description", "properties", "identifier"],
                value: {
                    description: "L'identifiant du biome.",
                    type: "string",
                    pattern: schemaPatterns.identifier_with_namespace,
                    "x-dynamic-examples-source": [dynamicExamplesSourceKeys.biome_ids]
                }
            }
        ]
    }
];

export const clientBiomeSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/biomes/*.json"],
    baseSchema: baseSchema,
    versionedChanges: versionedChanges
};