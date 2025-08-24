import { SchemaType } from "../../../../../../types/schema";
import { commonSchemas } from "../../../../shared/commonSchemas";
import { dynamicExamplesSourceKeys } from "../../../../shared/schemaEnums";
import { schemaPatterns } from "../../../../shared/schemaPatterns";
import { experimentalOptions, MinecraftJsonSchema } from "../../../../types/minecraftJsonSchema";

const baseSchema: MinecraftJsonSchema = {
    "x-experimental_options": [experimentalOptions.data_driven_jigsaw_structures],
    description: "Ce fichier sert à créer une structure Jigsaw qui est une grande structure composée de plusieurs modèles de structure, chacun contenant des blocs Jigsaw pour déterminer leur placement relatif et leurs contraintes. Ces structures ont également des règles guidant comment et où elles sont générées dans le monde.",
    type: "object",
    required: ["format_version", "minecraft:jigsaw"],
    properties: {
        format_version: {
            description: "La version du Format à utiliser.",
            type: "string",
            enum: [
                "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
            ]
        },
        "minecraft:jigsaw": {
            description: "Contient la définition de la structure Jigsaw.",
            type: "object",
            required: ["description", "step", "start_pool", "max_depth", "start_height"],
            properties: {
                description: {
                    description: "Contient les propeiétés de description de la structure Jigsaw.",
                    type: "object",
                    required: ["identifier"],
                    properties: {
                        identifier: {
                            description: "L'identifiant de la structure Jigsaw.",
                            type: "string",
                            pattern: schemaPatterns.identifier_with_namespace,
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_jigsaw_structure_ids
                        }
                    }
                },
                biome_filters: {
                    description: "Les biomes exprimés sous forme de filtres de conditions pour lesquels la structure Jigsaw peut être générée.",
                    oneOf: [
                        {
                            ...commonSchemas.minecraft_filter
                        },
                        {
                            type: "array",
                            items: {
                                ...commonSchemas.minecraft_filter
                            }
                        }
                    ]
                },
                step: {
                    description: "Spécifie la phase de génération du monde dans laquelle la structure est générée. C'est utilisé comme concept de regroupement pour garder des fonctionnalités de génération de monde similaires généralement regroupées.",
                    type: "string",
                    enum: [
                        "raw_generation", "lakes", "local_modifications", "underground_structures", "surface_structures", "strongholds", "underground_ores", "underground_decoration", "fluid_springs", "vegetal_decoration", "top_layer_modification"
                    ]
                },
                terrain_adaptation: {
                    description: "Comment le terrain doit s'adapter par rapport à la structure Jigsaw générée.",
                    default: "none",
                    type: "string",
                    enum: [
                        "none", "bury", "beard_thin", "beard_box", "encapsulate"
                    ]
                },
                start_pool: {
                    description: "Le premier Pool de modèle à utiliser lors de la génération de la structure Jigsaw.",
                    type: "string",
                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.template_pool_ids
                },
                max_distance_from_center: {
                    description: "Définit la distance maximale des pièces de la structure Jigsaw par rapport au début de la structure.",
                    oneOf: [
                        {
                            type: "integer",
                            minimum: 1,
                            maximum: 128
                        },
                        {
                            type: "object",
                            required: ["horizontal"],
                            properties: {
                                horizontal: {
                                    description: "La distance maximale sur l'axe horizontal (XZ).",
                                    type: "integer",
                                    minimum: 1,
                                    maximum: 128
                                },
                                vertical: {
                                    description: "La distance maximale sur l'axe vertical (Y).",
                                    default: 2147483647,
                                    type: "integer",
                                    minimum: 1,
                                    maximum: 2147483647
                                }
                            }
                        }
                    ]
                },
                start_height: {
                    description: "La hauteur du monde à laquelle la structure Jigsaw doit commencer à être générée.",
                    oneOf: [
                        {
                            type: "object",
                            required: ["type", "max", "min"],
                            properties: {
                                type: {
                                    description: "Le type de valeur de hauteur.",
                                    const: "uniform",
                                    type: "string",
                                    enum: ["uniform", "constant"]
                                },
                                max: {
                                    description: "La valeur maximale de la distribution uniforme.",
                                    oneOf: [
                                        {
                                            type: "object",
                                            required: ["absolute"],
                                            properties: {
                                                absolute: {
                                                    description: "Décalage par rapport à la position verticale ancrée.",
                                                    type: "integer"
                                                }
                                            }
                                        },
                                        {
                                            type: "object",
                                            required: ["above_bottom"],
                                            properties: {
                                                above_bottom: {
                                                    description: "Décalage par rapport à la position verticale ancrée.",
                                                    type: "integer"
                                                }
                                            }
                                        },
                                        {
                                            type: "object",
                                            required: ["below_top"],
                                            properties: {
                                                below_top: {
                                                    description: "Décalage par rapport à la position verticale ancrée.",
                                                    type: "integer"
                                                }
                                            }
                                        },
                                        {
                                            type: "object",
                                            required: ["from_sea"],
                                            properties: {
                                                from_sea: {
                                                    description: "Décalage par rapport à la position verticale ancrée.",
                                                    type: "integer"
                                                }
                                            }
                                        }
                                    ]
                                },
                                min: {
                                    description: "La valeur minimale de la distribution uniforme.",
                                    oneOf: [
                                        {
                                            type: "object",
                                            required: ["absolute"],
                                            properties: {
                                                absolute: {
                                                    description: "Décalage par rapport à la position verticale ancrée.",
                                                    type: "integer"
                                                }
                                            }
                                        },
                                        {
                                            type: "object",
                                            required: ["above_bottom"],
                                            properties: {
                                                above_bottom: {
                                                    description: "Décalage par rapport à la position verticale ancrée.",
                                                    type: "integer"
                                                }
                                            }
                                        },
                                        {
                                            type: "object",
                                            required: ["below_top"],
                                            properties: {
                                                below_top: {
                                                    description: "Décalage par rapport à la position verticale ancrée.",
                                                    type: "integer"
                                                }
                                            }
                                        },
                                        {
                                            type: "object",
                                            required: ["from_sea"],
                                            properties: {
                                                from_sea: {
                                                    description: "Décalage par rapport à la position verticale ancrée.",
                                                    type: "integer"
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            type: "object",
                            required: ["type", "value"],
                            properties: {
                                type: {
                                    description: "Le type de valeur de hauteur.",
                                    const: "constant",
                                    type: "string",
                                    enum: ["uniform", "constant"]
                                },
                                value: {
                                    description: "La point d'ancrage constant.",
                                    oneOf: [
                                        {
                                            type: "object",
                                            required: ["absolute"],
                                            properties: {
                                                absolute: {
                                                    description: "Décalage par rapport à la position verticale ancrée.",
                                                    type: "integer"
                                                }
                                            }
                                        },
                                        {
                                            type: "object",
                                            required: ["above_bottom"],
                                            properties: {
                                                above_bottom: {
                                                    description: "Décalage par rapport à la position verticale ancrée.",
                                                    type: "integer"
                                                }
                                            }
                                        },
                                        {
                                            type: "object",
                                            required: ["below_top"],
                                            properties: {
                                                below_top: {
                                                    description: "Décalage par rapport à la position verticale ancrée.",
                                                    type: "integer"
                                                }
                                            }
                                        },
                                        {
                                            type: "object",
                                            required: ["from_sea"],
                                            properties: {
                                                from_sea: {
                                                    description: "Décalage par rapport à la position verticale ancrée.",
                                                    type: "integer"
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                },
                start_jigsaw_name: {
                    description: "Le nom du bloc Jigsaw de départ est le nom du bloc Jigsaw à partir du pool de départ à placer en premier.",
                    type: "string"
                },
                max_depth: {
                    description: "La profondeur maximale de récursion pour la génération de la structure Jigsaw. Par exemple, une structure Jigsaw qui construit une route avec une profondeur maximale de 5 n'aura que des chemins qui sont un maximum de 5 modèles de structures de longueur dans n'importe quelle direction à partir de l'origine.",
                    type: "integer",
                    minimum: 0,
                    maximum: 20
                },
                heightmap_projection: {
                    description: "La hauteur de la carte utilisée pour calculer la hauteur de départ relative. Par exemple, une heightmap_projection de ocean_floor et une start_height de 10 signifie que la structure Jigsaw commencera à générer 10 blocs au-dessus du fond marin.",
                    default: "none",
                    type: "string",
                    enum: ["none", "world_surface", "ocean_floor"]
                },
                dimension_padding: {
                    description: "Le rembourrage dimensionnel empêche la structure d'être coupée en haut ou en bas du monde.",
                    default: 0,
                    oneOf: [
                        {
                            type: "integer"
                        },
                        {
                            type: "object",
                            properties: {
                                top: {
                                    description: "Le rembourrage du sommet du monde.",
                                    type: "integer"
                                },
                                bottom: {
                                    description: "Le rembourrage du bas du monde.",
                                    type: "integer"
                                }
                            }
                        }
                    ]
                },
                pool_aliases: {
                    description: "Les alias de pool sont utilisés pour déterminer quel pool de modèles peut être un substitut.",
                    type: "array",
                    items: {
                        oneOf: [
                            {
                                type: "object",
                                required: ["type", "alias", "target"],
                                properties: {
                                    type: {
                                        description: "Le type de pool.",
                                        const: "direct",
                                        type: "string",
                                        enum: ["direct", "random", "random_group"]
                                    },
                                    alias: {
                                        description: "Alias de Direct pool.",
                                        type: "string"
                                    },
                                    target: {
                                        description: "Pool de cible",
                                        type: "string"
                                    }
                                }
                            },
                            {
                                type: "object",
                                required: ["type", "alias", "targets"],
                                properties: {
                                    type: {
                                        description: "Le type de pool.",
                                        const: "random",
                                        type: "string",
                                        enum: ["direct", "random", "random_group"]
                                    },
                                    alias: {
                                        description: "Alias de Random pool.",
                                        type: "string"
                                    },
                                    targets: {
                                        description: "Liste de potentelles pools.",
                                        type: "array",
                                        items: {
                                            type: "object",
                                            required: ["weight", "data"],
                                            properties: {
                                                weight: {
                                                    description: "Le poids de chance.",
                                                    type: "integer"
                                                },
                                                data: {
                                                    type: "string"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                type: "object",
                                required: ["type", "groups"],
                                properties: {
                                    type: {
                                        description: "Le type de pool.",
                                        const: "random_group",
                                        type: "string",
                                        enum: ["direct", "random", "random_group"]
                                    },
                                    groups: {
                                        description: "Alias pour un groupe de pools.",
                                        type: "array",
                                        items: {
                                            type: "object",
                                            required: ["weight", "data"],
                                            properties: {
                                                weight: {
                                                    description: "Le poids de chance.",
                                                    type: "integer"
                                                },
                                                data: {
                                                    type: "string"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        ]
                    }
                },
                liquid_settings: {
                    description: "Comment gérer les blocs gorgés d'eau qui se chevauchent avec le liquide existant.",
                    default: "apply_waterlogging",
                    type: "string",
                    enum: ["apply_waterlogging", "ignore_waterlogging"]
                }
            }
        }
    }
};

export const jigsawStructureSchemaTypeBP: SchemaType = {
    fileMatch: ["**/addon/behavior_pack/worldgen/structures/*.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};