import { commonSchemas } from "../../../utils/shared/commonSchemas";
import { dynamicExamplesSourceKeys } from "../../../utils/shared/schemaEnums";
import { schemaPatterns } from "../../../utils/shared/schemaPatterns";
import { MinecraftJsonSchema } from "../../../../../types/minecraftJsonSchema";
import { VersionedSchema } from "../../../model/versioning";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier sert à définir les règles de spawn d'entités qui définissent quand, où et comment les entités apparaissent dans le monde.",
    type: "object",
    required: ["format_version", "minecraft:spawn_rules"],
    properties: {
        format_version: {
            description: "La version du Format à utiliser.",
            type: "string",
            enum: [
                "1.8.0", "1.9.0", "1.10.0", "1.11.0", "1.12.0", "1.13.0", "1.14.0", "1.14.1", "1.14.20", "1.14.30", "1.15.0", "1.16.0", "1.16.20", "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
            ]
        },
        "minecraft:spawn_rules": {
            description: "Contient toute la définition de cette SpawnRules.",
            type: "object",
            required: ["description"],
            properties: {
                description: {
                    description: "Contient la description de cette SpawnRules.",
                    type: "object",
                    required: ["identifier"],
                    properties: {
                        identifier: {
                            description: "Le type d'Entité auquel cette SpawnRules lui sera attribuée. Ne doit pas forcément être un type d'entité.",
                            type: "string",
                            pattern: schemaPatterns.identifier_with_namespace,
                            "x-dynamic-examples-source": [dynamicExamplesSourceKeys.data_driven_spawn_rules_ids, dynamicExamplesSourceKeys.entity_ids]
                        },
                        population_control: {
                            description: "Contrôle les quantités d'apparitions et de disparitions d'Entités.",
                            type: "string",
                            enum: ["animal", "water_animal", "monster", "ambient", "cat", "pillager", "villager"]
                        }
                    }
                },
                conditions: {
                    description: "Contient les règles qui déterminent si un mob peut apparaître. Chaque objet définit un critère comme le biome, la lumière ou le type de bloc.",
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            "minecraft:biome_filter": {
                                description: "Ce composant permet de spécifier dans quels biomes l'entité peut apparaitre.",
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
                            "minecraft:brightness_filter": {
                                description: "Ce composant permet de définir la plage de niveaux de lumière qui provoque l'apparition de l'entité.",
                                type: "object",
                                properties: {
                                    adjust_for_weather: {
                                        description: "Détermine si la météo peut affecter les conditions de niveau de lumière qui provoquent l'apparition de l'entité (par exemple, permettre aux entités hostiles d'apparaître pendant la journée lorsqu'il pleut).",
                                        default: false,
                                        type: "boolean"
                                    },
                                    max: {
                                        description: "Le niveau de lumière maximale.",
                                        default: 15.0,
                                        type: "number"
                                    },
                                    min: {
                                        description: "Le niveau de lumière minimale.",
                                        default: 0.0,
                                        type: "number"
                                    }
                                }
                            },
                            "minecraft:delay_filter": {
                                description: "Permet de définir des délais spécifiques avant l'apparition d'entités.",
                                type: "object",
                                required: ["identifier"],
                                properties: {
                                    max: {
                                        description: "Le delai maximale.",
                                        default: 0,
                                        type: "integer"
                                    },
                                    min: {
                                        description: "Le delai minimale.",
                                        default: 0,
                                        type: "integer"
                                    },
                                    identifier: {
                                        description: "L'identifiant de l'entité qui apparaitra.",
                                        default: "",
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.entity_ids
                                    },
                                    spawn_chance: {
                                        description: "La chance d'apparition de l'entité.",
                                        default: 100,
                                        type: "integer"
                                    }
                                }
                            },
                            "minecraft:density_limit": {
                                description: "Ce composant permet de définir les limites de densité pour le type d'entité spécifié.",
                                type: "object",
                                properties: {
                                    surface: {
                                        description: "Le nombre maximale d'entités de ce type qui peuvent apparaitre à la surface.",
                                        type: "integer"
                                    },
                                    underground: {
                                        description: "Le nombre maximale d'entités de ce type qui peuvent apparaitre sous-terre.",
                                        type: "integer"
                                    }
                                }
                            },
                            "minecraft:difficulty_filter": {
                                description: "Définit les difficultés pour que ce type d'entités apparaissent.",
                                type: "object",
                                properties: {
                                    max: {
                                        description: "Le niveau de difficulté maximale.",
                                        type: "string",
                                        enum: ["peaceful", "easy", "normal", "hard"]
                                    },
                                    min: {
                                        description: "Le niveau de difficulté minimale.",
                                        type: "string",
                                        enum: ["peaceful", "easy", "normal", "hard"]
                                    }
                                }
                            },
                            "minecraft:distance_filter": {
                                description: "Permet de définir des distances spécifiques pour que les entités apparaissent.",
                                type: "object",
                                properties: {
                                    max: {
                                        description: "La distance maximale.",
                                        default: 128,
                                        type: "integer"
                                    },
                                    min: {
                                        description: "La distance minimale.",
                                        default: 24,
                                        type: "integer"
                                    }
                                }
                            },
                            "minecraft:disallow_spawns_in_bubble": {
                                description: "Permet d'empêcher les entités d'apparaître dans les bulles.",
                                type: "object"
                            },
                            "minecraft:height_filter": {
                                description: "Permet de définir des hauteurs spécifiques pour que les entités apparaissent.",
                                type: "object",
                                properties: {
                                    max: {
                                        description: "La hauteur maximale.",
                                        type: "integer"
                                    },
                                    min: {
                                        description: "La hauteur minimale.",
                                        type: "integer"
                                    }
                                }
                            },
                            "minecraft:herd": {
                                description: "Permet de définir la taille du troupeau d'animaux.",
                                oneOf: [
                                    {
                                        type: "object",
                                        properties: {
                                            event: {
                                                description: "L'événement qui peut être déclenché à partir de l'apparition.",
                                                type: "string"
                                            },
                                            event_skip_count: {
                                                description: "Le nombre d'entités apparues avant que l'événement spécifié ne soit déclenché.",
                                                type: "integer"
                                            },
                                            initial_event: {
                                                description: "L'évenement qui se déclenchera sur les 'initial_event_count' premières entités.",
                                                type: "string"
                                            },
                                            initial_event_count: {
                                                description: "Le nombre d'entités sur lesquelles l'évenement 'initial_event' se déclenchera.",
                                                type: "integer"
                                            },
                                            max_size: {
                                                description: "Le nombre maximale d'entités dans un troupeau.",
                                                type: "integer"
                                            },
                                            min_size: {
                                                description: "Le nombre minimale d'entités dans un troupeau.",
                                                type: "integer"
                                            }
                                        }
                                    },
                                    {
                                        type: "array",
                                        items: {
                                            $ref: "#/properties/minecraft:spawn_rules/properties/conditions/items/properties/minecraft:herd/oneOf/0"
                                        }
                                    }
                                ]
                            },
                            "minecraft:mob_event_filter": {
                                description: "Autorise ce type d'entités à apparaitre dans certains evenements.",
                                type: "object",
                                properties: {
                                    event: {
                                        description: "L'evenement en question.",
                                        type: "string",
                                        enum: ["minecraft:pillager_patrols_event", "minecraft:wandering_trader_event", "minecraft:ender_dragon_event"]
                                    }
                                }
                            },
                            "minecraft:permute_type": {
                                description: "Ajoute des permutations de l'entité qui va apparaitre.",
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        weight: {
                                            description: "Le pourcentage de chance d'apparition de cette permutation. S'il existe plusieurs poids, leur somme doit être égale à 100.",
                                            type: "integer"
                                        },
                                        entity_type: {
                                            description: "Le type d'entité à faire apparaitre.",
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.entity_ids
                                        },
                                        guaranteed_count: {
                                            description: "Spécifie le nombre d'entités avec cette permutation qui doit apparaitre avant de choisir aléatoirement les autres permutations.",
                                            type: "integer"
                                        }
                                    }
                                }
                            },
                            "minecraft:player_in_village_filter": {
                                description: "Permet de filtrer les joueurs en fonction de leur position dans un village.",
                                type: "object",
                                properties: {
                                    distance: {
                                        type: "number"
                                    },
                                    village_border_tolerance: {
                                        type: "number"
                                    }
                                }
                            },
                            "minecraft:spawn_event": {
                                description: "L'événement à appliquer à l'entité quand elle apparaitra.",
                                type: "object",
                                properties: {
                                    event: {
                                        description: "L'événement.",
                                        type: "string"
                                    }
                                }
                            },
                            "minecraft:spawns_lava": {
                                description: "Définit si les entités peuvent apparaitre dans la lave.",
                                type: "object"
                            },
                            "minecraft:spawns_on_block_filter": {
                                description: "Permet à une entité d'apparaître sur un bloc particulier.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                    },
                                    commonSchemas.block_descriptor,
                                    {
                                        type: "array",
                                        items: {
                                            oneOf: [
                                                {
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                },
                                                commonSchemas.block_descriptor
                                            ]
                                        }
                                    }
                                ]
                            },
                            "minecraft:spawns_above_block_filter": {
                                description: "Filtre les blocs et la distance minimals en hauteur de ces blocs où peuvent apparaitre les entités.",
                                type: "object",
                                properties: {
                                    blocks: {
                                        description: "Les blocs en questions.",
                                        oneOf: [
                                            {
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                            },
                                            commonSchemas.block_descriptor,
                                            {
                                                type: "array",
                                                items: {
                                                    oneOf: [
                                                        {
                                                            type: "string",
                                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                        },
                                                        commonSchemas.block_descriptor
                                                    ]
                                                }
                                            }
                                        ]
                                    },
                                    distance: {
                                        description: "La distance en question.",
                                        type: "integer"
                                    }
                                }
                            },
                            "minecraft:spawns_on_block_prevented_filter": {
                                description: "Filtre les blocs où ne peuvent pas apparaitre les entités.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                    },
                                    commonSchemas.block_descriptor,
                                    {
                                        type: "array",
                                        items: {
                                            oneOf: [
                                                {
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                },
                                                commonSchemas.block_descriptor
                                            ]
                                        }
                                    }
                                ]
                            },
                            "minecraft:spawns_on_surface": {
                                description: "Définit si les entités peuvent apparaitre à la surface.",
                                type: "object"
                            },
                            "minecraft:spawns_underground": {
                                description: "Définit si les entités peuvent apparaitre sous-terre.",
                                type: "object"
                            },
                            "minecraft:spawns_underwater": {
                                description: "Définit si les entités peuvent apparaitre sous l'eau.",
                                type: "object"
                            },
                            "minecraft:weight": {
                                description: "Permet de définir la priorité de l'apparition de l'entité. Les entités avec des valeurs de poids plus faibles auront moins de chances d'apparaître que les entités avec des valeurs de poids plus élevées.",
                                type: "object",
                                properties: {
                                    default: {
                                        description: "Le poids par défaut.",
                                        type: "number"
                                    },
                                    rarity: {
                                        description: "La rareté de l'entité par rapport à d'autres entités. Une rareté plus élevée signifie que l'entité est moins susceptible d'apparaître par rapport à d'autres entités ayant des poids de spawn similaires.",
                                        type: "number"
                                    }
                                }
                            },
                            "minecraft:world_age_filter": {
                                description: "Définit le temps passé minimum sur le monde pour que cette entité puissent apparaitre.",
                                type: "object",
                                properties: {
                                    min: {
                                        description: "Le temps passé.",
                                        type: "integer"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

export const spawnRulesSchemaTypeBP: VersionedSchema = {
    fileMatch: ["**/addon/behavior_pack/spawn_rules/**/*.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};