import { dynamicExamplesSourceKeys } from "../../shared/schemaEnums";
import { schemaPatterns } from "../../shared/schemaPatterns";
import { MinecraftJsonSchema } from "../../../common/types/MinecraftJsonSchema";
import { VersionedSchema, SchemaChange } from "../../../common/types/VersionedSchema";

const baseSchema: MinecraftJsonSchema = {
    description: "Définit les propriétés du client du biome.",
    type: "object",
    required: ["format_version", "minecraft:client_biome"],
    properties: {
        format_version: {
            description: "La version du Format à utiliser.",
            type: "string",
            enum: [
                "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100", "1.21.110", "1.21.120", "1.21.130", "1.26.0", "1.26.10", "1.26.20"
            ]
        },
        "minecraft:client_biome": {
            description: "Contient toute la définition du client du biome.",
            type: "object",
            required: ["description", "components"],
            properties: {
                description: {
                    description: "Contient toute la description du biome.",
                    type: "object",
                    required: ["identifier"],
                    properties: {
                        identifier: {
                            description: "L'identifiant du biome.",
                            type: "string",
                            "x-dynamic-examples-source": [dynamicExamplesSourceKeys.biome_ids, dynamicExamplesSourceKeys.vanilla_biome_ids_without_namespace]
                        }
                    }
                },
                components: {
                    "description": "Contient les composants du client du Biome.",
                    type: "object",
                    properties: {
                        "minecraft:ambient_sounds": {
                            description: "Définit les sons ambiants du biome. Ces sons doivent être dans les `individual_named_sounds` dans un fichier `sounds.json`.",
                            type: "object",
                            properties: {
                                addition: {
                                    description: "Son nommé qui se joue occasionnellement à la position de l'auditeur.",
                                    type: "string"
                                },
                                loop: {
                                    description: "Son nommé qui se joue en boucle tant que la position de l'auditeur est à l'intérieur du biome.",
                                    type: "string"
                                },
                                mood: {
                                    description: "Son nommé qui se joue rarement à une position de bloc d'air proche lorsque le niveau de lumière est faible. Les biomes sans son d'ambiance d'humeur utiliseront le son `ambient.cave`.",
                                    default: "ambient.cave",
                                    type: "string"
                                }
                            }
                        },
                        "minecraft:biome_music": {
                            description: "Définit comment la musique est jouée dans le biome.",
                            type: "object",
                            properties: {
                                music_definition: {
                                    description: "Définit la musique à jouer dans le biome. Si ce n'est pas définit ou si la musique n'est pas trouvée, une musique par défaut détérminée par la dimension sera jouée. Si des strings vides sont fournies, aucune musique ne sera jouée. La référence doit être une musique définie dans le fichier `music_definitions.json`. Les sons doivent êtres de type `.ogg`.",
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.music_references
                                },
                                volume_multiplier: {
                                    description: "Multiplicateur temporaire et progressif appliqué au volume de la musique lorsqu'on se trouve dans ce biome. Doit être une valeur comprise entre 0 et 1, inclus.",
                                    type: "number",
                                    minimum: 0.0,
                                    maximum: 1.0
                                }
                            }
                        },
                        "minecraft:fog_appearance": {
                            description: "Définit les paramètres de brouillard utilisés pendant le rendu. Les biomes sans ce composant auront des paramètres de brouillard par défaut.",
                            type: "object",
                            required: ["fog_identifier"],
                            properties: {
                                fog_identifier: {
                                    description: "Identifier du brouillard à utiliser.",
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.fog_ids
                                }
                            }
                        },
                        "minecraft:foliage_appearance": {
                            description: "Définit la couleur de la végétation ou la carte de couleur utilisée pendant le rendu. Les biomes sans ce composant auront un comportement de végétation par défaut.",
                            type: "object",
                            properties: {
                                color: {
                                    description: "La couleur RGB de la végétation ou la carte de couleur utilisée pendant le rendu.",
                                    oneOf: [
                                        {
                                            oneOf: [
                                                {
                                                    type: "string",
                                                    pattern: schemaPatterns.color_hex
                                                },
                                                {
                                                    type: "array",
                                                    minItems: 3,
                                                    maxItems: 3,
                                                    items: {
                                                        type: "integer",
                                                        minimum: 0,
                                                        maximum: 255
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            type: "object",
                                            required: ["color_map"],
                                            properties: {
                                                color_map: {
                                                    description: "Carte de couleur de textures/colormap pour déterminer la couleur de la végétation.",
                                                    type: "string",
                                                    enum: ["foliage", "birch", "evergreen", "mangrove_swamp_foliage", "swamp_foliage"]
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        "minecraft:grass_appearance": {
                            description: "Définit la couleur de l'herbe ou la carte de couleur utilisée pendant le rendu. Les biomes sans ce composant auront un comportement d'herbe par défaut.",
                            type: "object",
                            properties: {
                                color: {
                                    description: "Couleur RGB de l'herbe.",
                                    oneOf: [
                                        {
                                            oneOf: [
                                                {
                                                    type: "string",
                                                    pattern: schemaPatterns.color_hex
                                                },
                                                {
                                                    type: "array",
                                                    minItems: 3,
                                                    maxItems: 3,
                                                    items: {
                                                        type: "integer",
                                                        "minimum": 0,
                                                        "maximum": 255
                                                    }
                                                },
                                                {
                                                    type: "object",
                                                    required: ["color_map"],
                                                    properties: {
                                                        color_map: {
                                                            description: "Carte de couleur de textures/colormap pour déterminer la couleur de l'herbe.",
                                                            type: "string",
                                                            enum: ["grass", "swamp_grass"]
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
                            description: "Définit la couleur du ciel utilisée pendant le rendu. Les biomes sans ce composant auront un comportement de couleur de ciel par défaut.",
                            type: "object",
                            required: ["sky_color"],
                            properties: {
                                sky_color: {
                                    description: "La couleur RGB du ciel.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            pattern: schemaPatterns.color_hex
                                        },
                                        {
                                            type: "array",
                                            minItems: 3,
                                            maxItems: 3,
                                            items: {
                                                type: "integer",
                                                minimum: 0,
                                                maximum: 255
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        "minecraft:water_appearance": {
                            description: "Définit la couleur de la surface de l'eau utilisée pendant le rendu. Les biomes sans ce composant auront un comportement de couleur de surface d'eau par défaut.",
                            type: "object",
                            properties: {
                                surface_color: {
                                    description: "La couleur RGB de la surface de l'eau.",
                                    "oneOf": [
                                        {
                                            type: "string",
                                            pattern: schemaPatterns.color_hex
                                        },
                                        {
                                            type: "array",
                                            minItems: 3,
                                            maxItems: 3,
                                            items: {
                                                type: "integer",
                                                minimum: 0,
                                                maximum: 255
                                            }
                                        }
                                    ]
                                },
                                surface_opacity: {
                                    description: "Opacité de la surface de l'eau (doit être comprise entre 0 pour invisible et 1 pour opaque, inclus).",
                                    type: "number",
                                    minimum: 0.0,
                                    maximum: 1.0
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
                    description: "Définit les paramètres d'atmosphère utilisés avec le mode `Vibrant Visuals`. Les biomes sans ce composant auront des paramètres d'atmosphère par défaut.",
                    type: "object",
                    required: ["atmosphere_identifier"],
                    properties: {
                        atmosphere_identifier: {
                            description: "Identifiant de l'atmosphère à utiliser.",
                            default: "minecraft:default_atmospherics",
                            type: "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.atmosphere_settings_ids
                        }
                    }
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:client_biome", "properties", "components", "properties", "minecraft:color_grading_identifier"],
                value: {
                    description: "Définit les paramètres de color grading utilisés avec le mode `Vibrant Visuals`. Les biomes sans ce composant auront des paramètres de color grading par défaut.",
                    type: "object",
                    required: ["color_grading_identifier"],
                    properties: {
                        color_grading_identifier: {
                            description: "Identifiant du color grading à utiliser.",
                            default: "minecraft:default_color_grading",
                            type: "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.color_grading_settings_ids
                        }
                    }
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:client_biome", "properties", "components", "properties", "minecraft:dry_foliage_color"],
                value: {
                    description: "Définit la couleur de la végétation sèche utilisée pendant le rendu. Les biomes sans ce composant auront un comportement de couleur de végétation sèche par défaut.",
                    type: "object",
                    required: ["color"],
                    properties: {
                        color: {
                            description: "La couleur RGB de la végétation sèche.",
                            oneOf: [
                                {
                                    type: "string",
                                    pattern: schemaPatterns.color_hex
                                },
                                {
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: {
                                        type: "integer",
                                        minimum: 0,
                                        maximum: 255
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
                    description: "Définit les paramètres d'éclairage utilisés avec le mode `Vibrant Visuals`. Les biomes sans ce composant auront des paramètres d'éclairage par défaut.",
                    type: "object",
                    required: ["lighting_identifier"],
                    properties: {
                        lighting_identifier: {
                            description: "Identifiant des paramètres d'éclairage à utiliser.",
                            type: "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.lighting_settings_ids
                        }
                    }
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:client_biome", "properties", "components", "properties", "minecraft:water_identifier"],
                value: {
                    description: "Définit les paramètres de l'eau utilisés avec le mode `Vibrant Visuals`. Les biomes sans ce composant auront des paramètres d'eau par défaut.",
                    type: "object",
                    required: ["water_identifier"],
                    properties: {
                        water_identifier: {
                            description: "Identifiant des paramètres d'eau à utiliser.",
                            type: "string",
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
    },
    {
        version: "1.21.100",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:client_biome", "properties", "components", "properties", "minecraft:grass_appearance", "properties", "grass_is_shaded"],
                value: {
                    description: "Définit si un assombrissement est appliqué à l'herbe. Si `true`, l'herbe sera assombrie par la lumière du soleil. Si `false`, l'herbe ne sera pas assombrie.",
                    default: false,
                    type: "boolean"
                }
            }
        ]
    },
    {
        version: "1.21.110",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:client_biome", "properties", "components", "properties", "minecraft:precipitation"],
                value: {
                    description: "Définit l'apparence des précipitations du Biome. Les biomes sans ce composant auront des valeurs par défaut. Un seul type de précipitation peut être défini par biome.",
                    type: "object",
                    properties: {
                        ash: {
                            description: "Densité des particules de cendres dans l'air de ce biome. Utilisé dans le biome `soulsand_valley`.",
                            type: "number"
                        },
                        blue_spores: {
                            description: "Densité des particules de spores bleues dans l'air de ce biome. Utilisé dans le biome `warped_forest`.",
                            type: "number"
                        },
                        red_spores: {
                            description: "Densité des particules de spores rouges dans l'air de ce biome. Utilisé dans le biome `crimson_forest`.",
                            type: "number"
                        },
                        white_ash: {
                            description: "Densité des particules de cendres blanches dans l'air de ce biome. Utilisé dans le biome `basalt_deltas`.",
                            type: "number"
                        }
                    }
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:client_biome", "properties", "components", "properties", "minecraft:biome_music", "properties", "underwater_music"],
                value: {
                    description: "Définit si la musique sous-marine est activée dans ce biome.",
                    default: false,
                    type: "boolean"
                }
            }
        ]
    },
    {
        version: "1.21.120",
        changes: [
            {
                action: "modify",
                target: ["properties", "minecraft:client_biome", "properties", "components", "properties", "minecraft:ambient_sounds", "properties", "addition"],
                value: {
                    description: "Son nommé qui se joue occasionnellement à la position de l'auditeur.",
                    default: {
                        asset: "",
                        chance: 1
                    },
                    type: "object",
                    required: ["asset", "chance"],
                    properties: {
                        asset: {
                            description: "Le son nommé à jouer.",
                            type: "string",
                            minLength: 1
                        },
                        chance: {
                            description: "Probabilité que le son soit joué à chaque intervalle, entre 0.0 et 1.0",
                            type: "number",
                            minimum: 0.0,
                            maximum: 1.0
                        }
                    }
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:client_biome", "properties", "components", "properties", "minecraft:ambient_sounds", "properties", "underwater_addition"],
                value: {
                    description: "Son nommé qui se joue occasionnellement à la position de l'auditeur lorsqu'il est sous l'eau.",
                    default: {
                        asset: "",
                        chance: 1
                    },
                    type: "object",
                    required: ["asset", "chance"],
                    properties: {
                        asset: {
                            description: "Le son nommé à jouer.",
                            type: "string",
                            minLength: 1
                        },
                        chance: {
                            description: "Probabilité que le son soit joué à chaque intervalle, entre 0.0 et 1.0",
                            type: "number",
                            minimum: 0.0,
                            maximum: 1.0
                        }
                    }
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:client_biome", "properties", "components", "properties", "minecraft:ambient_sounds", "properties", "underwater_loop"],
                value: {
                    description: "Son nommé qui se joue en boucle tant que la position de l'auditeur est à l'intérieur du biome et sous l'eau.",
                    default: "",
                    type: "string"
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:client_biome", "properties", "components", "properties", "minecraft:ambient_sounds", "properties", "underwater_mood"],
                value: {
                    description: "Son nommé qui se joue rarement à une position de bloc d'air proche lorsque le niveau de lumière est faible et que l'auditeur est sous l'eau.",
                    default: "",
                    type: "string"
                }
            }
        ]
    },
    {
        version: "1.21.130",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:client_biome", "properties", "components", "properties", "minecraft:cubemap_identifier"],
                value: {
                    description: "Définit les paramètres de cubemap utilisés avec le mode `Vibrant Visuals`. Les biomes sans ce composant auront des paramètres de cubemap par défaut.",
                    type: "object",
                    required: ["cubemap_identifier"],
                    properties: {
                        cubemap_identifier: {
                            description: "Identifiant des paramètres de cubemap à utiliser.",
                            type: "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.cubemap_settings_ids
                        }
                    }
                }
            }
        ]
    }
];

export const versionedSchema: VersionedSchema = {
    baseSchema: baseSchema,
    versionedChanges: versionedChanges
};

export default versionedSchema;