import { schemaPatterns } from "../../../utils/shared/schemaPatterns";
import { dynamicExamplesSourceKeys } from "../../../utils/shared/schemaEnums";
import { commonSchemas } from "../../../utils/shared/commonSchemas";
import { MinecraftJsonSchema } from "../../../../../types/minecraftJsonSchema";
import { VersionedSchema, SchemaChange } from "../../../model/versioning";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier définit une décoration (Feature).",
    type: "object",
    required: ["format_version"],
    properties: {
        format_version: {
            description: "La version du Format à utiliser.",
            type: "string",
            enum: [
                "1.13.0", "1.14.0", "1.14.1", "1.14.20", "1.14.30", "1.15.0", "1.16.0", "1.16.20", "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
            ]
        }
    },
    oneOf: [
        {
            required: ["minecraft:aggregate_feature"],
            properties: {
                "minecraft:aggregate_feature": {
                    description: "Définition d'une Feature qui place une plusieurs features dans un ordre arbitraire. Toutes les Features à placer utilisent la même position d'entrée. Les Features ne doivent pas dépendre les unes des autres, car leur ordre de placement n'est pas garanti. Réussi si au moins une Feature est placée avec succès. Échoue si toutes les Features échouent à être placées.",
                    type: "object",
                    required: ["description", "features"],
                    properties: {
                        description: {
                            description: "Contient l'identifiant de la Feature. Est de la forme `namespace:name` où name doit correspondre au nom du fichier.",
                            type: "object",
                            required: ["identifier"],
                            properties: {
                                identifier: {
                                    description: "L'identifiant de la Feature.",
                                    type: "string",
                                    pattern: schemaPatterns.identifier_with_namespace,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_feature_ids
                                }
                            }
                        },
                        features: {
                            description: "Liste des Features à placer une par une. Aucune garantie d'ordre. Toutes les Features utilisent la même position d'entrée.",
                            type: "array",
                            minItems: 1,
                            items: {
                                type: "string",
                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.feature_ids
                            }
                        },
                        early_out: {
                            description:
                            "Contrôle le comportement de la Feature si une feature est placée avec succès ou échoue." +
                             "\n\n- `none`: Continue de placer les Features jusqu'à ce que toutes les Features aient été placées." +
                             "\n\n- `first_failure`: Arrête de placer les Features une fois qu'une Feature a échoué." +
                             "\n\n- `first_success`: Arrête de placer les Features une fois qu'une Feature a réussi.",
                            default: "none",
                            type: "string",
                            enum: ["none", "first_failure", "first_success"]
                        }
                    }
                }
            }
        },
        {
            required: ["minecraft:cave_carver_feature"],
            properties: {
                "minecraft:cave_carver_feature": {
                    description: "Définition d'une Feature qui creuse une grotte à travers le monde dans le chunk actuel, et dans chaque chunk autour du chunk actuel dans un motif radial de 8.",
                    type: "object",
                    required: ["description"],
                    properties: {
                        description: {
                            description: "Contient l'identifiant de la Feature.",
                            type: "object",
                            required: ["identifier"],
                            properties: {
                                identifier: {
                                    description: "L'identifiant de la Feature. Doit être de la forme 'namespace:feature_id' où feature_id doit correspondre au nom du fichier.",
                                    type: "string",
                                    pattern: schemaPatterns.identifier_with_namespace,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_feature_ids
                                }
                            }
                        },
                        fill_with: {
                            description: "Le bloc à utiliser pour remplir la grotte.",
                            oneOf: [
                                {
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                },
                                commonSchemas.block_descriptor
                            ]
                        },
                        width_modifier: {
                            description: "De combien de blocs augmenter la largeur de la grotte à partir du point central de la grotte.",
                            type: "molang"
                        },
                        skip_carve_chance: {
                            description: "La chance de ne pas creuser la grotte (1 / valeur).",
                            type: "integer",
                            minimum: 1
                        },
                        height_limit: {
                            description: "La limite de hauteur où nous tentons de creuser.",
                            type: "integer"
                        },
                        y_scale: {
                            description: "L'échelle en y.",
                            type: "number"
                        },
                        horizontal_radius_multiplier: {
                            description: "Le multiplicateur de rayon horizontal.",
                            type: "number"
                        },
                        vertical_radius_multiplier: {
                            description: "Le multiplicateur de rayon vertical.",
                            type: "number"
                        },
                        floor_level: {
                            description: "Le niveau du sol.",
                            type: "number"
                        }
                    }
                }
            }
        },
        {
            required: ["minecraft:fossil_feature"],
            properties: {
                "minecraft:fossil_feature": {
                    description: "Définition d'une Feature qui génère une structure squelettique composée de blocs d'os et de blocs de minerai configurables.",
                    type: "object",
                    required: ["description", "ore_block", "max_empty_corners"],
                    properties: {
                        description: {
                            description: "Contient l'identifiant de la Feature.",
                            type: "object",
                            required: ["identifier"],
                            properties: {
                                identifier: {
                                    description: "L'identifiant de la Feature. Doit être de la forme 'namespace:feature_id' où feature_id doit correspondre au nom du fichier.",
                                    type: "string",
                                    pattern: schemaPatterns.identifier_with_namespace,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_feature_ids
                                }
                            }
                        },
                        ore_block: {
                            description: "Le bloc à utiliser pour les blocs de minerai.",
                            oneOf: [
                                {
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                },
                                commonSchemas.block_descriptor
                            ]
                        },
                        max_empty_corners: {
                            description: "Le nombre maximum de coins vides autorisés dans la structure.",
                            type: "integer"
                        }
                    }
                }
            }
        },
        {
            required: ["minecraft:geode_feature"],
            properties: {
                "minecraft:geode_feature": {
                    description: "Définition d'une Feature qui génère une formation rocheuse pour simuler une géode.",
                    type: "object",
                    required: ["description", "filler", "inner_layer", "alternate_inner_layer", "middle_layer", "outer_layer", "min_outer_wall_distance", "max_outer_wall_distance", "min_distribution_points", "max_distribution_points", "min_point_offset", "max_point_offset", "max_radius", "crack_point_offset", "generate_crack_chance", "base_crack_size", "noise_multiplier", "use_potential_placements_chance", "use_alternate_layer0_chance", "placements_require_layer0_alternate", "invalid_blocks_threshold"],
                    properties: {
                        description: {
                            description: "Contient l'identifiant de la Feature.",
                            type: "object",
                            required: ["identifier"],
                            properties: {
                                identifier: {
                                    description: "L'identifiant de la Feature. Doit être de la forme 'namespace:feature_id' où feature_id doit correspondre au nom du fichier.",
                                    "type": "string",
                                    pattern: schemaPatterns.identifier_with_namespace,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_feature_ids
                                }
                            }
                        },
                        filler: {
                            description: "Le bloc à utiliser pour remplir l'intérieur de la géode.",
                            oneOf: [
                                {
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                },
                                commonSchemas.block_descriptor
                            ]
                        },
                        inner_layer: {
                            description: "Le bloc à utiliser pour la couche intérieure de la géode.",
                            oneOf: [
                                {
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                },
                                commonSchemas.block_descriptor
                            ]
                        },
                        alternate_inner_layer: {
                            description: "Le bloc qui a une chance de se générer à la place de 'inner_layer'.",
                            oneOf: [
                                {
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                },
                                commonSchemas.block_descriptor
                            ]
                        },
                        middle_layer: {
                            description: "Le bloc à utiliser pour la couche intermédiaire de la géode.",
                            oneOf: [
                                {
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                },
                                commonSchemas.block_descriptor
                            ]
                        },
                        outer_layer: {
                            description: "Le bloc qui forme la coquille extérieure de la géode.",
                            oneOf: [
                                {
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                },
                                commonSchemas.block_descriptor
                            ]
                        },
                        inner_placements: {
                            description: "Une liste de blocs qui peuvent être replacés lors de la génération de la géode. Omettez ce champ pour autoriser n'importe quel bloc à être remplacé.",
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
                        },
                        min_outer_wall_distance: {
                            description: "La distance minimale que chaque point de distribution doit avoir par rapport à la paroi extérieure.",
                            type: "integer",
                            minimum: 0,
                            maximum: 10
                        },
                        max_outer_wall_distance: {
                            description: "La distance maximale que chaque point de distribution doit avoir par rapport à la paroi extérieure.",
                            type: "integer",
                            minimum: 0,
                            maximum: 20
                        },
                        min_distribution_points: {
                            description: "Le nombre minimum de points de distribution à générer. Le champ de distance est la zone constituée de tous les points ayant une distance minimale par rapport à tous les points de distribution.",
                            type: "integer",
                            minimum: 1,
                            maximum: 10
                        },
                        max_distribution_points: {
                            description: "Le nombre maximum de points de distribution à générer. Le champ de distance est la zone constituée de tous les points ayant une distance minimale par rapport à tous les points de distribution.",
                            type: "integer",
                            minimum: 1,
                            maximum: 20
                        },
                        min_point_offset: {
                            description: "La valeur minimale possible du décalage aléatoire appliqué à la position de chaque point de distribution.",
                            type: "integer",
                            minimum: 0,
                            maximum: 10
                        },
                        max_point_offset: {
                            description: "La valeur maximale possible du décalage aléatoire appliqué à la position de chaque point de distribution.",
                            type: "integer",
                            minimum: 0,
                            maximum: 10
                        },
                        max_radius: {
                            description: "Le rayon maximal possible de la géode générée.",
                            type: "integer"
                        },
                        crack_point_offset: {
                            description: "Un décalage appliqué à chaque point de distribution qui forme l'ouverture de la fissure de la géode.",
                            type: "integer",
                            minimum: 0,
                            maximum: 10
                        },
                        generate_crack_chance: {
                            description: "La probabilité qu'une fissure se génère dans la géode.",
                            type: "number",
                            minimum: 0,
                            maximum: 1
                        },
                        base_crack_size: {
                            description: "A quelle doit être la taille de l'ouverture de la fissure de la géode lors de sa génération.",
                            type: "number",
                            minimum: 0,
                            maximum: 5
                        },
                        noise_multiplier: {
                            description: "Un multiplicateur appliqué au bruit qui est appliqué aux points de distribution dans la géode. Plus élevé = plus bruyant.",
                            type: "number"
                        },
                        use_potential_placements_chance: {
                            description: "La probabilité qu'un bloc de la géode soit remplacé par un bloc de la liste 'inner_placements'.",
                            type: "number",
                            minimum: 0,
                            maximum: 1
                        },
                        use_alternate_layer0_chance: {
                            description: "La probabilité qu'un bloc de la couche intérieure de la géode soit remplacé par 'alternate_inner_layer'.",
                            type: "number",
                            minimum: 0,
                            maximum: 1
                        },
                        placements_require_layer0_alternate: {
                            description: "Si vrai, le bloc de placement potentiel ne sera placé que sur les blocs de couche0 alternatifs qui sont placés. Les blocs de placement potentiels sont des blocs qui dépendent de l'existence d'un autre bloc pour être placés. Ces derniers sont les blocs alternatifs de la couche0.",
                            type: "boolean"
                        },
                        invalid_blocks_threshold: {
                            description: "Le seuil de blocs invalides pour qu'une géode ait un point de distribution avant d'abandonner complètement la génération.",
                            type: "integer"
                        }
                    }
                }
            }
        },
        {
            required: ["minecraft:growing_plant_feature"],
            properties: {
                "minecraft:growing_plant_feature": {
                    description: "Définition d'une Feature qui place une plante en croissance dans le monde.",
                    type: "object",
                    required: ["description", "height_distribution", "growth_direction", "body_blocks", "head_blocks"],
                    properties: {
                        description: {
                            description: "Contient l'identifiant de la Feature.",
                            type: "object",
                            required: ["identifier"],
                            properties: {
                                identifier: {
                                    description: "L'identifiant de la Feature. Doit être de la forme 'namespace:feature_id' où feature_id doit correspondre au nom du fichier.",
                                    type: "string",
                                    pattern: schemaPatterns.identifier_with_namespace,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_feature_ids
                                }
                            }
                        },
                        height_distribution: {
                            description: "Collection de hauteurs pondérées que le placement sélectionnera.",
                            type: "array",
                            minItems: 1,
                            items: {
                                type: "array",
                                minItems: 2,
                                maxItems: 2,
                                items: [
                                    {
                                        type: "object",
                                        required: ["range_min", "range_max"],
                                        properties: {
                                            range_min: {
                                                description: "Hauteur minimale de la plante.",
                                                type: "integer"
                                            },
                                            range_max: {
                                                description: "Hauteur maximale de la plante.",
                                                type: "integer"
                                            }
                                        }
                                    },
                                    {
                                        type: "integer"
                                    }
                                ]
                            }
                        },
                        growth_direction: {
                            description: "La direction de croissance de la plante.",
                            type: "string",
                            enum: ["UP", "DOWN"]
                        },
                        age: {
                            description: "L'âge de la tête de la plante.",
                            type: "object",
                            required: ["range_min", "range_max"],
                            properties: {
                                range_min: {
                                    description: "Âge minimal de la tête de la plante.",
                                    type: "integer"
                                },
                                range_max: {
                                    description: "Âge maximal de la tête de la plante.",
                                    type: "integer"
                                }
                            }
                        },
                        body_blocks: {
                            description: "Collection de descripteurs de blocs pondérés que le placement sélectionnera pour le corps de la plante.",
                            type: "array",
                            items: {
                                type: "array",
                                minItems: 2,
                                maxItems: 2,
                                items: [
                                    {
                                        oneOf: [
                                            {
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                            },
                                            commonSchemas.block_descriptor
                                        ]
                                    },
                                    {
                                        type: "integer"
                                    }
                                ]
                            }
                        },
                        head_blocks: {
                            description: "Collection de descripteurs de blocs pondérés que le placement sélectionnera pour la tête de la plante.",
                            type: "array",
                            items: {
                                type: "array",
                                minItems: 2,
                                maxItems: 2,
                                items: [
                                    {
                                        oneOf: [
                                            {
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                            },
                                            commonSchemas.block_descriptor
                                        ]
                                    },
                                    {
                                        type: "integer"
                                    }
                                ]
                            }
                        },
                        allow_water: {
                            description: "Si vrai, la plante peut être placée dans l'eau.",
                            type: "boolean"
                        }
                    }
                }
            }
        },
        {
            required: ["minecraft:multiface_feature"],
            properties: {
                "minecraft:multiface_feature": {
                    description: "Définition d'une Feature qui place un ou plusieurs blocs multiface sur des sols/murs/plafonds.",
                    type: "object",
                    required: ["description", "places_block", "search_range", "can_place_on_floor", "can_place_on_ceiling", "can_place_on_wall", "chance_of_spreading"],
                    properties: {
                        description: {
                            description: "Contient l'identifiant de la Feature.",
                            type: "object",
                            required: ["identifier"],
                            properties: {
                                identifier: {
                                    description: "L'identifiant de la Feature. Doit être de la forme 'namespace:feature_id' où feature_id doit correspondre au nom du fichier.",
                                    type: "string",
                                    pattern: schemaPatterns.identifier_with_namespace,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_feature_ids
                                }
                            }
                        },
                        places_block: {
                            description: "Le bloc à placer.",
                            oneOf: [
                                {
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                },
                                commonSchemas.block_descriptor
                            ]
                        },
                        search_range: {
                            description: "De combien de blocs cette Feature peut rechercher une position valide pour se placer.",
                            type: "integer",
                            minimum: 1,
                            maximum: 64
                        },
                        can_place_on_floor: {
                            description: "Peut-il être placé sur le sol?",
                            type: "boolean"
                        },
                        can_place_on_ceiling: {
                            description: "Peut-il être placé au plafond?",
                            type: "boolean"
                        },
                        can_place_on_wall: {
                            description: "Peut-il être placé sur un mur?",
                            type: "boolean"
                        },
                        chance_of_spreading: {
                            description: "Pour chaque bloc placé par cette Feature, quelle est la probabilité que ce bloc se propage à un autre?",
                            type: "number",
                            minimum: 0,
                            maximum: 1
                        },
                        can_place_on: {
                            description: "Une liste de blocs sur lesquels le bloc de cette Feature peut être placé. Omettez ce champ pour autoriser n'importe quel bloc à être placé.",
                            type: "array",
                            minItems: 1,
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
                    }
                }
            }
        },
        {
            required: ["minecraft:nether_cave_carver_feature"],
            properties: {
                "minecraft:nether_cave_carver_feature": {
                    description: "Définition d'une Feature qui creuse une grotte à travers le Nether dans le chunk actuel, et dans chaque chunk autour du chunk actuel dans un motif radial de 8.",
                    type: "object",
                    required: ["description"],
                    properties: {
                        description: {
                            description: "Contient l'identifiant de la Feature.",
                            type: "object",
                            required: ["identifier"],
                            properties: {
                                identifier: {
                                    description: "L'identifiant de la Feature. Doit être de la forme 'namespace:feature_id' où feature_id doit correspondre au nom du fichier.",
                                    "type": "string",
                                    pattern: schemaPatterns.identifier_with_namespace,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_feature_ids
                                }
                            }
                        },
                        fill_with: {
                            description: "Le bloc à utiliser pour remplir la grotte.",
                            oneOf: [
                                {
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                },
                                commonSchemas.block_descriptor
                            ]
                        },
                        width_modifier: {
                            description: "De combien de blocs augmenter la largeur de la grotte à partir du point central de la grotte.",
                            type: "molang"
                        },
                        skip_carve_chance: {
                            description: "La chance de ne pas creuser la grotte (1 / valeur).",
                            type: "integer",
                            minimum: 1
                        },
                        height_limit: {
                            description: "La limite de hauteur où nous tentons de creuser.",
                            type: "integer"
                        },
                        y_scale: {
                            description: "L'échelle en y.",
                            type: "number"
                        },
                        horizontal_radius_multiplier: {
                            description: "Le multiplicateur de rayon horizontal.",
                            type: "number"
                        },
                        vertical_radius_multiplier: {
                            description: "Le multiplicateur de rayon vertical.",
                            type: "number"
                        },
                        floor_level: {
                            description: "Le niveau du sol.",
                            type: "number"
                        }
                    }
                }
            }
        },
        {
            required: ["minecraft:ore_feature"],
            properties: {
                "minecraft:ore_feature": {
                    description: "Définition d'une Feature qui place une veine de blocs pour simuler des gisements de minerai.",
                    type: "object",
                    required: ["description", "count"],
                    properties: {
                        description: {
                            description: "Contient l'identifiant de la Feature.",
                            type: "object",
                            required: ["identifier"],
                            properties: {
                                identifier: {
                                    description: "L'identifiant de la Feature. Doit être de la forme 'namespace:feature_id' où feature_id doit correspondre au nom du fichier.",
                                    type: "string",
                                    pattern: schemaPatterns.identifier_with_namespace,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_feature_ids
                                }
                            }
                        },
                        count: {
                            description: "Le nombre de blocs à placer dans la veine.",
                            type: "integer",
                            minimum: 1
                        },
                        discard_chance_on_air_exposure: {
                            description: "La chance qu'un bloc de minerai soit supprimé lorsqu'il est exposé à l'air.",
                            type: "number",
                            minimum: 0,
                            maximum: 1
                        },
                        replace_rules: {
                            description: "Collection de règles de remplacement qui seront vérifiées dans l'ordre de définition. Si une règle est résolue, le reste ne sera pas résolu pour cette position de bloc.",
                            type: "array",
                            minItems: 1,
                            items: {
                                type: "object",
                                required: ["places_block"],
                                properties: {
                                    places_block: {
                                        description: "Le bloc à placer.",
                                        oneOf: [
                                            {
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                            },
                                            commonSchemas.block_descriptor
                                        ]
                                    },
                                    may_replace: {
                                        description: "Les blocs qui peuvent être remplacés par le bloc de cette règle. Omettez ce champ pour autoriser n'importe quel bloc à être remplacé.",
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
                                }
                            }
                        }
                    }
                }
            }
        },
        {
            required: ["minecraft:partially_exposed_blob_feature"],
            properties: {
                "minecraft:partially_exposed_blob_feature": {
                    description: "Définition d'une Feature qui génère un blob du bloc spécifié avec les dimensions spécifiées. Pour la plupart, le blob est intégré dans la surface spécifiée, cependant un seul côté est autorisé à être exposé.",
                    type: "object",
                    required: ["description", "placement_radius_around_floor", "placement_probability_per_valid_position", "places_block"],
                    properties: {
                        description: {
                            description: "Contient l'identifiant de la Feature.",
                            type: "object",
                            required: ["identifier"],
                            properties: {
                                identifier: {
                                    description: "L'identifiant de la Feature. Doit être de la forme 'namespace:feature_id' où feature_id doit correspondre au nom du fichier.",
                                    type: "string",
                                    pattern: schemaPatterns.identifier_with_namespace
                                }
                            }
                        },
                        placement_radius_around_floor: {
                            description: "Le rayon autour du sol où le bloc peut être placé.",
                            type: "integer",
                            minimum: 1,
                            maximum: 8
                        },
                        placement_probability_per_valid_position: {
                            description: "La probabilité de tenter de placer un bloc à chaque position dans les limites de placement.",
                            type: "number",
                            minimum: 0,
                            maximum: 1
                        },
                        exposed_face: {
                            description: "Définit une face de bloc qui est autorisée à être exposée à l'air et/ou à l'eau. Les autres faces doivent être intégrées pour que les blocs soient placés par cette Feature. Par défaut, la face ascendante.",
                            type: "string",
                            enum: ["up", "down", "north", "south", "east", "west"]
                        },
                        places_block: {
                            description: "Le bloc à placer.",
                            oneOf: [
                                {
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                },
                                commonSchemas.block_descriptor
                            ]
                        }
                    }
                }
            }
        },
        {
            required: ["minecraft:scatter_feature"],
            properties: {
                "minecraft:scatter_feature": {
                    description: "Définition d'une Feature qui réparit une Feature à travers un chunk.",
                    type: "object",
                    required: ["description", "places_feature"],
                    properties: {
                        description: {
                            description: "Contient l'identifiant de la Feature.",
                            type: "object",
                            required: ["identifier"],
                            properties: {
                                identifier: {
                                    description: "L'identifiant de la Feature. Doit être de la forme 'namespace:feature_id' où feature_id doit correspondre au nom du fichier.",
                                    type: "string",
                                    pattern: schemaPatterns.identifier_with_namespace,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_feature_ids
                                }
                            }
                        },
                        places_feature: {
                            description: "La Feature à placer.",
                            type: "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.feature_ids
                        },
                        project_input_to_floor: {
                            description: "Si vrai, projette l'entrée de la Feature sur le sol avant de placer la Feature. Si faux ou non défini, l'entrée de la Feature est utilisée telle quelle.",
                            type: "boolean"
                        },
                        iterations: { 
                            description: "Nombre d'itérations pour générer des positions dispersées.",
                            type: "molang"
                        },
                        scatter_chance: {
                            description: "Probabilité que cette dispersion se produise. Non évalué à chaque itération; soit aucune itération ne sera exécutée, soit toutes le seront.",
                            oneOf: [
                                {
                                    type: "molang"
                                },
                                {
                                    type: "object",
                                    required: ["numerator", "denominator"],
                                    properties: {
                                        numerator: {
                                            description: "Le numérateur de la probabilité.",
                                            type: "integer",
                                            minimum: 1
                                        },
                                        denominator: {
                                            description: "Le dénominateur de la probabilité.",
                                            type: "integer",
                                            minimum: 1
                                        }
                                    }
                                }
                            ]
                        },
                        x: {
                            description: "Distribution pour la coordonnée (évaluée à chaque itération).",
                            oneOf: [
                                {
                                    type: "molang"
                                },
                                {
                                    type: "object",
                                    required: ["distribution", "extent"],
                                    properties: {
                                        distribution: {
                                            description: "Type de distribution à utiliser.",
                                            type: "string",
                                            enum: ["uniform", "gaussian", "inverse_gaussian", "triangle", "fixed_grid", "jittered_grid"]
                                        },
                                        extent: {
                                            description: "Les bornes inférieure et supérieure (incluses) définissent la plage de dispersion, en tant que décalage par rapport au point d'entrée autour duquel la feature est dispersée.",
                                            type: "array",
                                            minItems: 2,
                                            maxItems: 2,
                                            items: {
                                                type: "molang"
                                            }
                                        },
                                        step_size: {
                                            description: "Lorsque le type de distribution est 'grid', définit la distance entre les étapes le long de cet axe.",
                                            type: "integer",
                                            "minimum": 1
                                        },
                                        grid_offset: {
                                            description: "Lorsque le type de distribution est 'grid', définit le décalage le long de cet axe.",
                                            type: "integer",
                                            minimum: 0
                                        }
                                    }
                                }
                            ]
                        },
                        y: {
                            description: "Distribution pour la coordonnée (évaluée à chaque itération).",
                            oneOf: [
                                {
                                    type: "molang"
                                },
                                {
                                    type: "object",
                                    required: ["distribution", "extent"],
                                    properties: {
                                        distribution: {
                                            description: "Type de distribution à utiliser.",
                                            type: "string",
                                            enum: ["uniform", "gaussian", "inverse_gaussian", "triangle", "fixed_grid", "jittered_grid"]
                                        },
                                        extent: {
                                            description: "Les bornes inférieure et supérieure (incluses) définissent la plage de dispersion, en tant que décalage par rapport au point d'entrée autour duquel la feature est dispersée.",
                                            type: "array",
                                            minItems: 2,
                                            maxItems: 2,
                                            items: {
                                                type: "molang"
                                            }
                                        },
                                        step_size: {
                                            description: "Lorsque le type de distribution est 'grid', définit la distance entre les étapes le long de cet axe.",
                                            type: "integer",
                                            "minimum": 1
                                        },
                                        grid_offset: {
                                            description: "Lorsque le type de distribution est 'grid', définit le décalage le long de cet axe.",
                                            type: "integer",
                                            minimum: 0
                                        }
                                    }
                                }
                            ]
                        },
                        z: {
                            description: "Distribution pour la coordonnée (évaluée à chaque itération).",
                            oneOf: [
                                {
                                    type: "molang"
                                },
                                {
                                    type: "object",
                                    required: ["distribution", "extent"],
                                    properties: {
                                        distribution: {
                                            description: "Type de distribution à utiliser.",
                                            type: "string",
                                            enum: ["uniform", "gaussian", "inverse_gaussian", "triangle", "fixed_grid", "jittered_grid"]
                                        },
                                        extent: {
                                            description: "Les bornes inférieure et supérieure (incluses) définissent la plage de dispersion, en tant que décalage par rapport au point d'entrée autour duquel la feature est dispersée.",
                                            type: "array",
                                            minItems: 2,
                                            maxItems: 2,
                                            items: {
                                                type: "molang"
                                            }
                                        },
                                        step_size: {
                                            description: "Lorsque le type de distribution est 'grid', définit la distance entre les étapes le long de cet axe.",
                                            type: "integer",
                                            "minimum": 1
                                        },
                                        grid_offset: {
                                            description: "Lorsque le type de distribution est 'grid', définit le décalage le long de cet axe.",
                                            type: "integer",
                                            minimum: 0
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        {
            required: ["minecraft:sequence_feature"],
            properties: {
                "minecraft:sequence_feature": {
                    description: "Définition d'une Feature qui balaie un recherche de volume pour un emplacement de placement valide pour sa Feature référencée.",
                    type: "object",
                    required: ["description", "places_feature", "search_volume", "search_axis"],
                    properties: {
                        description: {
                            description: "Contient l'identifiant de la Feature.",
                            type: "object",
                            required: ["identifier"],
                            properties: {
                                identifier: {
                                    description: "L'identifiant de la Feature. Doit être de la forme 'namespace:feature_id' où feature_id doit correspondre au nom du fichier.",
                                    type: "string",
                                    pattern: schemaPatterns.identifier_with_namespace,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_feature_ids
                                }
                            }
                        },
                        places_feature: {
                            description: "La Feature à placer.",
                            type: "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.feature_ids
                        },
                        search_volume: {
                            description: "Boîte de collision alignée sur les axes qui sera recherchée pour des positions de placement valides. Exprimé comme des décalages par rapport à la position d'entrée.",
                            type: "object",
                            required: ["min", "max"],
                            properties: {
                                min: {
                                    description: "Extension minimale du volume de collision exprimée en [x, y, z]",
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: {
                                        type: "integer"
                                    }
                                },
                                max: {
                                    description: "Extension maximale du volume de collision exprimée en [x, y, z]",
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: {
                                        type: "integer"
                                    }
                                }
                            }
                        },
                        search_axis: {
                            description: "Axe que la recherche balayera à travers le 'search_volume'",
                            type: "string",
                            enum: ["-x", "+x", "-y", "+y", "-z", "+z"]
                        },
                        required_successes: {
                            description: "Nombre de positions valides que la recherche doit trouver pour placer la Feature référencée.",
                            type: "integer",
                            minimum: 1
                        }
                    }
                }
            }
        },
        {
            required: ["minecraft:sequence_feature"],
            properties: {
                "minecraft:sequence_feature": {
                    description: "Définition d'une Feature sequentiellement qui place une collection de features dans l'ordre où elles apparaissent dans les données.",
                    type: "object",
                    required: ["description", "features"],
                    properties: {
                        description: {
                            description: "Contient l'identifiant de la Feature.`",
                            type: "object",
                            required: ["identifier"],
                            properties: {
                                identifier: {
                                    description: "L'identifiant de la Feature. Doit être de la forme 'namespace:feature_id' où feature_id doit correspondre au nom du fichier.",
                                    type: "string",
                                    pattern: schemaPatterns.identifier_with_namespace
                                }
                            }
                        },
                        features: {
                            description: "La liste des features à placer.",
                            type: "array",
                            minItems: 1,
                            items: {
                                type: "string",
                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.feature_ids
                            }
                        }
                    }
                }
            }
        },
        {
            required: ["minecraft:single_block_feature"],
            properties: {
                "minecraft:single_block_feature": {
                    description: "Définition d'une Feature qui place un seul bloc dans le monde.",
                    type: "object",
                    required: ["description", "places_block", "enforce_placement_rules", "enforce_survivability_rules"],
                    properties: {
                        description: {
                            description: "Contient l'identifiant de la Feature.",
                            type: "object",
                            required: ["identifier"],
                            properties: {
                                identifier: {
                                    description: "L'identifiant de la Feature. Doit être de la forme 'namespace:feature_id' où feature_id doit correspondre au nom du fichier.",
                                    type: "string",
                                    pattern: schemaPatterns.identifier_with_namespace
                                }
                            }
                        },
                        places_block: {
                            description: "Le bloc à placer.`",
                            oneOf: [
                                {
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                },
                                commonSchemas.block_descriptor
                            ]
                        },
                        enforce_placement_rules: {
                            description: "Si vrai, applique les règles de placement du bloc.",
                            type: "boolean"
                        },
                        enforce_survivability_rules: {
                            description: "Si vrai, applique les règles de survie du bloc.",
                            type: "boolean"
                        },
                        may_attach_to: {
                            description: "Les blocs auxquels le bloc de cette Feature peut être attaché. Omettez ce champ pour autoriser n'importe quel bloc à être attaché.",
                            type: "object",
                            properties: {
                                min_sides_must_attach: {
                                    description: "Le nombre minimum de côtés du bloc de cette Feature qui doivent être attachés à un bloc valide.",
                                    type: "integer",
                                    minimum: 1,
                                    maximum: 4
                                },
                                auto_rotate: {
                                    description: "Si vrai, faites pivoter automatiquement le bloc pour le fixer de manière sensée.",
                                    type: "boolean"
                                },
                                top: {
                                    description: "Le ou les blocs qui peuvent être placés au-dessus du bloc de cette Feature.",
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
                                bottom: {
                                    description: "Le ou les blocs qui peuvent être placés en dessous du bloc de cette Feature.",
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
                                north: {
                                    description: "Le ou les blocs qui peuvent être placés au nord du bloc de cette Feature.",
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
                                east: {
                                    description: "Le ou les blocs qui peuvent être placés à l'est du bloc de cette Feature.",
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
                                south: {
                                    description: "Le ou les blocs qui peuvent être placés au sud du bloc de cette Feature.",
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
                                west: {
                                    description: "Le ou les blocs qui peuvent être placés à l'ouest du bloc de cette Feature.",
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
                                all: {
                                    description: "Le ou les blocs qui peuvent être placés de tous les côtés du bloc de cette Feature.",
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
                                sides: {
                                    description: "Le ou les blocs qui peuvent être placés sur les côtés du bloc de cette Feature.",
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
                                }
                            }
                        },
                        may_replace: {
                            description: "Les blocs qui peuvent être remplacés par le bloc de cette Feature. Omettez ce champ pour autoriser n'importe quel bloc à être remplacé.",
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
                    }
                }
            }
        },
        {
            required: ["minecraft:snap_to_surface_feature"],
            properties: {
                "minecraft:snap_to_surface_feature": {
                    description: "Définition d'une Feature qui accroche la valeur y d'une position de placement de fonction au sol ou au plafond dans la plage de recherche verticale fournie.",
                    type: "object",
                    required: ["description", "feature_to_snap", "vertical_search_range"],
                    properties: {
                        description: {
                            description: "Contient l'identifiant de la Feature.",
                            type: "object",
                            required: ["identifier"],
                            properties: {
                                identifier: {
                                    description: "L'identifiant de la Feature. Doit être de la forme 'namespace:feature_id' où feature_id doit correspondre au nom du fichier.",
                                    type: "string",
                                    pattern: schemaPatterns.identifier_with_namespace
                                }
                            }
                        },
                        feature_to_snap: {
                            description: "La Feature à placer.",
                            type: "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.feature_ids
                        },
                        vertical_search_range: {
                            description: "La plage de recherche verticale pour un sol ou un plafond pour accrocher la Feature.",
                            type: "integer"
                        },
                        surface: {
                            description: "Définit la surface à laquelle la valeur y de la position de placement sera accrochée.",
                            type: "string",
                            enum: ["ceiling", "floor", "random_horizontal"]
                        },
                        allow_air_placement: {
                            description: "Détermine si la Feature peut être placée dans l'air.",
                            default: true,
                            type: "boolean"
                        },
                        allow_underwater_placement: {
                            description: "Détermine si la Feature peut être placée sous l'eau.",
                            default: false,
                            type: "boolean"
                        }
                    }
                }
            }
        },
        {
            required: ["minecraft:structure_template_feature"],
            properties: {
                "minecraft:structure_template_feature": {
                    description: "Définition d'une Feature qui place une structure dans le monde. La structure doit être stockée sous forme de fichier .mcstructure dans le sous-répertoire 'structures' d'un pack de comportement.",
                    type: "object",
                    required: ["description", "structure_name", "constraints"],
                    properties: {
                        description: {
                            description: "Contient l'identifiant de la Feature.",
                            type: "object",
                            required: ["identifier"],
                            properties: {
                                identifier: {
                                    description: "L'identifiant de la Feature. Doit être de la forme 'namespace:feature_id' où feature_id doit correspondre au nom du fichier.",
                                    type: "string",
                                    pattern: schemaPatterns.identifier_with_namespace
                                }
                            }
                        },
                        structure_name: {
                            description: "L'identifiant de la structure à placer.",
                            type: "string"
                        },
                        adjustment_radius: {
                            description: "De combien la structure est autorisée à se déplacer lors de la recherche d'une position de placement valide. La recherche est radiale, s'arrêtant lorsque la position valide la plus proche est trouvée. Par défaut à 0 si omis.",
                            default: 0,
                            type: "integer"
                        },
                        facing_direction: {
                            description: "La direction que la structure doit regarder lorsqu'elle est placée dans le monde. Par défaut à 'random' si omis.",
                            default: "random",
                            type: "string",
                            enum: ["north", "south", "east", "west", "random"]
                        },
                        constraints: {
                            description: "Les contraintes spécifiques qui doivent être satisfaites lors du placement de cette structure.",
                            type: "object",
                            properties: {
                                grounded: {
                                    description: "Si spécifié, garantit que la structure est au sol.",
                                    type: "object"
                                },
                                unburied: {
                                    description: "Si spécifié, garantit que la structure n'est pas enterrée.",
                                    type: "object"
                                },
                                block_intersection: {
                                    description: "Si spécifié, garantit que la structure n'interagit pas avec les blocs spécifiés.",
                                    type: "object",
                                    required: ["block_allowlist"],
                                    properties: {
                                        block_allowlist: {
                                            description: "Les blocs qui peuvent être placés dans la structure.",
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
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        {
            required: ["minecraft:surface_relative_threshold_feature"],
            properties: {
                "minecraft:surface_relative_threshold_feature": {
                    description: "Définition d'une Feature qui détermine si la position de placement est au-dessus ou au-dessous du niveau de surface estimé du monde, et place une Feature si c'est le cas. Si la position fournie est au-dessus de la surface configurée ou si la surface n'est pas disponible, le placement échouera. Cette Feature ne fonctionne que pour les générateurs Overworld utilisant la génération de monde 1.18 ou ultérieure.",
                    type: "object",
                    required: ["description", "feature_to_place"],
                    properties: {
                        description: {
                            description: "Contient l'identifiant de la Feature.",
                            type: "object",
                            required: ["identifier"],
                            properties: {
                                identifier: {
                                    description: "L'identifiant de la Feature. Doit être de la forme 'namespace:feature_id' où feature_id doit correspondre au nom du fichier.",
                                    type: "string",
                                    pattern: schemaPatterns.identifier_with_namespace
                                }
                            }
                        },
                        feature_to_place: {
                            description: "La Feature à placer si la position de placement est au-dessus ou au-dessous du niveau de surface estimé du monde.",
                            type: "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.feature_ids
                        },
                        minimum_distance_below_surface: {
                            description: "La distance minimale en blocs que la position de placement doit être en dessous du niveau de surface estimé du monde pour que la Feature soit placée",
                            default: 0,
                            type: "integer"
                        }
                    }
                }
            }
        },
        {
            required: ["minecraft:tree_feature"],
            properties: {
                "minecraft:tree_feature": {
                    description: "Définition d'une Feature qui place un arbre dans le monde.",
                    type: "object",
                    required: ["description"],
                    properties: {
                        description: {
                            description: "Contient l'identifiant de la Feature.",
                            type: "object",
                            required: ["identifier"],
                            properties: {
                                identifier: {
                                    description: "L'identifiant de la Feature. Doit être de la forme 'namespace:feature_id' où feature_id doit correspondre au nom du fichier.",
                                    type: "string",
                                    pattern: schemaPatterns.identifier_with_namespace,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_feature_ids
                                }
                            }
                        },
                        base_block: {
                            description: "Le ou les blocs qui peuvent être placés en dessous du tronc de l'arbre.",
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
                        base_cluster: {
                            description: "Liste des blocs que le cluster de base d'un arbre peut remplacer.",
                            type: "object",
                            required: ["may_replace", "num_clusters", "cluster_radius"],
                            properties: {
                                may_replace: {
                                    description: "Les blocs qui peuvent être remplacés par le cluster de base de l'arbre.",
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
                                },
                                num_clusters: {
                                    description: "Le nombre de clusters d'arbres à placer.",
                                    type: "integer",
                                    minimum: 1
                                },
                                cluster_radius: {
                                    description: "Le rayon où les clusters d'arbres peuvent être générés.",
                                    type: "integer",
                                    minimum: 0
                                }
                            }
                        },
                        may_grow_on: {
                            description: "Liste des blocs sur lesquels un arbre peut pousser.",
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
                        },
                        may_replace: {
                            description: "Les blocs qui peuvent être remplacés par l'arbre.",
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
                        },
                        may_grow_through: {
                            description: "Liste des blocs à travers lesquels un arbre peut pousser.",
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
                        },
                        acacia_trunk: {
                            description: "Définit les propriétés du tronc d'acacia.",
                            type: "object",
                            required: ["trunk_width", "trunk_height", "trunk_lean", "trunk_block"],
                            properties: {
                                trunk_width: {
                                    description: "La largeur du tronc d'acacia.",
                                    type: "integer"
                                },
                                trunk_height: {
                                    description: "Configuration de la hauteur du tronc d'acacia.",
                                    type: "object",
                                    required: ["base"],
                                    properties: {
                                        base: {
                                            description: "La hauteur minimale du tronc d'acacia.`",
                                            type: "integer",
                                            minimum: 1
                                        },
                                        intervals: {
                                            description: "Intervalle utilisé pour randomiser la hauteur du tronc, la valeur de chaque intervalle créera un nombre aléatoire où (0 <= rand < interval), et sera ajoutée à la hauteur.",
                                            type: "array",
                                            items: {
                                                type: "integer",
                                                minimum: 1
                                            }   
                                        },
                                        min_height_for_canopy: {
                                            description: "Hauteur minimale pour placer la canopée.",
                                            type: "integer",
                                            minimum: 1
                                        }
                                    }
                                },
                                trunk_lean: {
                                    description: "Configuration de l'inclinaison du tronc d'acacia.",
                                    type: "object",
                                    required: ["allow_diagonal_growth", "lean_height", "lean_steps", "lean_length"],
                                    properties: {
                                        allow_diagonal_growth: {
                                            description: "Si vrai, les branches diagonales seront créées.",
                                            type: "boolean"
                                        },
                                        lean_height: {
                                            description: "Nombre de blocs sous la hauteur de l'arbre auxquels des branches diagonales peuvent être créées.",
                                            oneOf: [
                                                {
                                                    type: "integer"
                                                },
                                                {
                                                    type: "object",
                                                    properties: {
                                                        range_min: {
                                                            description: "Valeur minimale.",
                                                            type: "integer"
                                                        },
                                                        range_max: {
                                                            description: "Valeur maximale.",
                                                            type: "integer"
                                                        }
                                                    }
                                                }
                                            ]
                                        },
                                        lean_steps: {
                                            description: "Nombre d'étapes prises dans la direction X/Z lors de la création d'une branche diagonale.",
                                            oneOf: [
                                                {
                                                    type: "integer"
                                                },
                                                {
                                                    type: "object",
                                                    properties: {
                                                        range_min: {
                                                            description: "Valeur minimale.",
                                                            type: "integer"
                                                        },
                                                        range_max: {
                                                            description: "Valeur maximale.",
                                                            type: "integer"
                                                        }
                                                    }
                                                }
                                            ]
                                        },
                                        lean_length: {
                                            description: "Longueur pour la branche diagonale dans l'axe Y.",
                                            oneOf: [
                                                {
                                                    type: "integer"
                                                },
                                                {
                                                    type: "object",
                                                    properties: {
                                                        range_min: {
                                                            description: "Valeur minimale.",
                                                            type: "integer"
                                                        },
                                                        range_max: {
                                                            description: "Valeur maximale.",
                                                            type: "integer"
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                },
                                trunk_block: {
                                    description: "Le bloc qui forme le tronc d'acacia.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                branches: {
                                    description: "Configuration des branches de l'arbre d'acacia.",
                                    type: "object",
                                    required: ["branch_length", "branch_position", "branch_chance"],
                                    properties: {
                                        branch_length: {
                                            description: "Longueur pour les branches de l'arbre d'acacia dans l'axe Y.",
                                            type: "integer"
                                        },
                                        branch_position: {
                                            description: "Position Y  du début pour les branches de l'arbre d'acacia.",
                                            type: "integer"
                                        },
                                        branch_chance: {
                                            description: "Probabilité de créer une branche.",
                                            type: "object",
                                            required: ["numerator", "denominator"],
                                            properties: {
                                                numerator: {
                                                    description: "Le numérateur de la probabilité.",
                                                    type: "integer"
                                                },
                                                denominator: {
                                                    description: "Le dénominateur de la probabilité.",
                                                    type: "integer"
                                                }
                                            }
                                        },
                                        branch_canopy: {
                                            description: "Configuration de la canopée de l'arbre d'acacia.",
                                            type: "object",
                                            properties: {
                                                acacia_canopy: {
                                                    description: "Configuration de la canopée.",
                                                    type: "object",
                                                    required: ["canopy_size", "leaf_block"],
                                                    properties: {
                                                        canopy_size: {
                                                            description: "La taille de la canopée.",
                                                            type: "integer",
                                                            minimum: 1
                                                        },
                                                        leaf_block: {
                                                            description: "Le bloc qui forme la canopée.",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        },
                                                        simplify_canopy: {
                                                            description: "Si 'true', la canopée utilise un motif simple.",
                                                            type: "boolean"
                                                        }
                                                    }
                                                },
                                                canopy: {
                                                    description: "Configuration de la canopée.",
                                                    type: "object",
                                                    required: ["canopy_offset"],
                                                    properties: {
                                                        canopy_offset: {
                                                            description: "Position relative de la canopée par rapport au tronc.",
                                                            type: "object",
                                                            required: ["min", "max"],
                                                            properties: {
                                                                min: {
                                                                    description: "Position minimale de la canopée par rapport au tronc.",
                                                                    type: "integer"
                                                                },
                                                                max: {
                                                                    description: "Position maximale de la canopée par rapport au tronc.`",
                                                                    type: "integer"
                                                                }
                                                            }
                                                        },
                                                        min_width: {
                                                            description: "Largeur minimale pour la canopée.",
                                                            type: "integer",
                                                            minimum: 0
                                                        },
                                                        canopy_slope: {
                                                            description: "Configuration de la pente de la canopée.",
                                                            type: "object",
                                                            properties: {
                                                                rise: {
                                                                    description: "Le numérateur de la pente.",
                                                                    type: "integer",
                                                                    minimum: 1
                                                                },
                                                                run: {
                                                                    description: "Le dénominateur de la pente.",
                                                                    type: "integer",
                                                                    minimum: 1
                                                                }
                                                            }
                                                        },
                                                        variation_chance: {
                                                            description: "Détermine la chance de créer des blocs de feuilles pour chaque couche de la canopée. Les nombres plus grands créent un arbre plus dense.",
                                                            oneOf: [
                                                                {
                                                                    type: "object",
                                                                    required: ["numerator", "denominator"],
                                                                    properties: {
                                                                        numerator: {
                                                                            description: "Le numérateur de la probabilité.",
                                                                            type: "integer"
                                                                        },
                                                                        denominator: {
                                                                            description: "Le dénominateur de la probabilité.",
                                                                            type: "integer"
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    type: "array",
                                                                    items: {
                                                                        type: "object",
                                                                        required: ["numerator", "denominator"],
                                                                        properties: {
                                                                            numerator: {
                                                                                description: "Le numérateur de la probabilité.",
                                                                                type: "integer"
                                                                            },
                                                                            denominator: {
                                                                                description: "Le dénominateur de la probabilité.",
                                                                                type: "integer"
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            ]
                                                        },
                                                        leaf_block: {
                                                            description: "Le bloc qui forme la canopée.",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        },
                                                        canopy_decoration: {
                                                            description: "Configuration de la décoration de la canopée.",
                                                            type: "object",
                                                            required: ["decoration_chance"],
                                                            properties: {
                                                                decoration_chance: {
                                                                    description: "Probabilité de décorer la canopée.",
                                                                    type: "object",
                                                                    required: ["numerator", "denominator"],
                                                                    properties: {
                                                                        numerator: {
                                                                            description: "Le numérateur de la probabilité.",
                                                                            type: "integer"
                                                                        },
                                                                        denominator: {
                                                                            description: "Le dénominateur de la probabilité.",
                                                                            type: "integer"
                                                                        }
                                                                    }
                                                                },
                                                                decoration_block: {
                                                                    description: "Le bloc à utilisé pour la décoration de la canopée.",
                                                                    oneOf: [
                                                                        {
                                                                            type: "string",
                                                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                        },
                                                                        commonSchemas.block_descriptor
                                                                    ]
                                                                },
                                                                num_steps: {
                                                                    description: "Nombre de blocs de décoration à placer.",
                                                                    type: "integer"
                                                                },
                                                                step_direction: {
                                                                    description: "Direction pour étaler les blocs de décoration.",
                                                                    type: "string",
                                                                    enum: ["down", "up", "out", "away"]
                                                                }
                                                            }
                                                        }
                                                    }
                                                },
                                                cherry_canopy: {
                                                    description: "Configuration de la canopée de cerisier.",
                                                    type: "object",
                                                    required: ["leaf_block", "height", "radius", "wide_bottom_layer_hole_chance", "corner_hole_chance", "hanging_leaves_chance", "hanging_leaves_extension_chance"],
                                                    properties: {
                                                        leaf_block: {
                                                            description: "Le bloc qui forme la canopée de cerisier.",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        },
                                                        height: {
                                                            description: "Nombre de couches pour la canopée.",
                                                            type: "integer"
                                                        },
                                                        radius: {
                                                            description: "Le rayon de la canopée de cerisier.",
                                                            type: "integer"
                                                        },
                                                        trunk_width: {
                                                            description: "La largeur du tronc de cerisier.",
                                                            type: "integer",
                                                            minimum: 1
                                                        },
                                                        wide_bottom_layer_hole_chance: {
                                                            description: "Probabilité que la canopée ait un trou dans la couche inférieure.",
                                                            type: "object",
                                                            required: ["numerator", "denominator"],
                                                            properties: {
                                                                numerator: {
                                                                    description: "Le numérateur de la probabilité.",
                                                                    type: "integer"
                                                                },
                                                                denominator: {
                                                                    description: "Le dénominateur de la probabilité.",
                                                                    type: "integer"
                                                                }
                                                            }
                                                        },
                                                        corner_hole_chance: {
                                                            description: "Probabilité que la canopée ait un trou dans le coin.",
                                                            type: "object",
                                                            required: ["numerator", "denominator"],
                                                            properties: {
                                                                numerator: {
                                                                    description: "Le numérateur de la probabilité.",
                                                                    type: "integer"
                                                                },
                                                                denominator: {
                                                                    description: "Le dénominateur de la probabilité.",
                                                                    type: "integer"
                                                                }
                                                            }
                                                        },
                                                        hanging_leaves_chance: {
                                                            description: "Probabilité que la canopée ait des feuilles suspendues.",
                                                            type: "object",
                                                            required: ["numerator", "denominator"],
                                                            properties: {
                                                                numerator: {
                                                                    description: "Le numérateur de la probabilité.",
                                                                    type: "integer"
                                                                },
                                                                denominator: {
                                                                    description: "Le dénominateur de la probabilité.",
                                                                    type: "integer"
                                                                }
                                                            }
                                                        },
                                                        hanging_leaves_extension_chance: {
                                                            description: "Probabilité que les feuilles suspendues s'étendent plus bas.",
                                                            type: "object",
                                                            required: ["numerator", "denominator"],
                                                            properties: {
                                                                numerator: {
                                                                    description: "Le numérateur de la probabilité.",
                                                                    type: "integer"
                                                                },
                                                                denominator: {
                                                                    description: "Le dénominateur de la probabilité.",
                                                                    type: "integer"
                                                                }
                                                            }
                                                        }
                                                    }
                                                },
                                                fancy_canopy: {
                                                    description: "Configuration de la canopée fantaisie.",
                                                    type: "object",
                                                    required: ["height", "radius", "leaf_block"],
                                                    properties: {
                                                        height: {
                                                            description: "Nombre de couches pour la canopée.",
                                                            type: "integer",
                                                            minimum: 1
                                                        },
                                                        radius: {
                                                            description: "Le rayon de la canopée fantaisie.",
                                                            type: "integer",
                                                            minimum: 0
                                                        },
                                                        leaf_block: {
                                                            description: "Le bloc qui forme la canopée fantaisie.",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        }
                                                    }
                                                },
                                                mangrove_canopy: {
                                                    description: "Configuration de la canopée de mangrove.",
                                                    type: "object",
                                                    required: ["canopy_height", "canopy_radius", "leaf_placement_attempts", "hanging_block", "hanging_block_placement_chance"],
                                                    properties: {
                                                        canopy_height: {
                                                            description: "Nombre de couches pour la canopée.",
                                                            type: "integer"
                                                        },
                                                        canopy_radius: {
                                                            description: "Le rayon de la canopée de mangrove.",
                                                            type: "integer"
                                                        },
                                                        leaf_placement_attempts: {
                                                            description: "Nombre maximum de tentatives pour placer les feuilles.",
                                                            type: "integer",
                                                            minimum: 1
                                                        },
                                                        leaf_blocks: {
                                                            description: "Les blocs avec un poids de chance pour la canopée de mangrove.",
                                                            type: "array",
                                                            items: {
                                                                type: "array",
                                                                minItems: 2,
                                                                maxItems: 2,
                                                                items: [
                                                                    {
                                                                        oneOf: [
                                                                            {
                                                                                type: "string",
                                                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                            },
                                                                            commonSchemas.block_descriptor
                                                                        ]
                                                                    },
                                                                    {
                                                                        type: "number"
                                                                    }
                                                                ]
                                                            }
                                                        },
                                                        canopy_decoration: {
                                                            description: "Configuration de la décoration de la canopée de mangrove.",
                                                            type: "object",
                                                            required: ["decoration_chance"],
                                                            properties: {
                                                                decoration_chance: {
                                                                    description: "Probabilité de décorer le tronc.",
                                                                    type: "object",
                                                                    required: ["numerator", "denominator"],
                                                                    properties: {
                                                                        numerator: {
                                                                            description: "Le numérateur de la probabilité.",
                                                                            type: "integer"
                                                                        },
                                                                        denominator: {
                                                                            description: "Le dénominateur de la probabilité.",
                                                                            type: "integer"
                                                                        }
                                                                    }
                                                                },
                                                                decoration_block: {
                                                                    description: "Le bloc à utilisé pour la décoration de la canopée de mangrove.",
                                                                    oneOf: [
                                                                        {
                                                                            type: "string",
                                                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                        },
                                                                        commonSchemas.block_descriptor
                                                                    ]
                                                                },
                                                                num_steps: {
                                                                    description: "Nombre de blocs de décoration à placer.",
                                                                    type: "integer"
                                                                },
                                                                step_direction: {
                                                                    description: "Direction pour étaler les blocs de décoration.",
                                                                    type: "string",
                                                                    enum: ["down", "up", "out", "away"]
                                                                }
                                                            }
                                                        },
                                                        hanging_block: {
                                                            description: "Le bloc à utiliser comme bloc suspendu.",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        },
                                                        hanging_block_placement_chance: {
                                                            description: "Probabilité de placer un bloc suspendu.",
                                                            type: "object",
                                                            required: ["numerator", "denominator"],
                                                            properties: {
                                                                numerator: {
                                                                    description: "Le numérateur de la probabilité.",
                                                                    type: "integer"
                                                                },
                                                                denominator: {
                                                                    description: "Le dénominateur de la probabilité.",
                                                                    type: "integer"
                                                                }
                                                            }
                                                        }
                                                    }
                                                },
                                                mega_canopy: {
                                                    description: "Configuration de la canopée géante.",
                                                    type: "object",
                                                    required: ["canopy_height", "base_radius", "leaf_block"],
                                                    properties: {
                                                        canopy_height: {
                                                            description: "Nombre de couches pour la canopée géante.",
                                                            type: "integer"
                                                        },
                                                        base_radius: {
                                                            description: "Le rayon de la base de la canopée géante.",
                                                            type: "integer",
                                                            minimum: 0
                                                        },
                                                        core_width: {
                                                            description: "La largeur du tronc de la canopée géante.",
                                                            type: "integer",
                                                            minimum: 1
                                                        },
                                                        simplify_canopy: {
                                                            description: "Si `true`, la canopée utilise un motif simple.",
                                                            type: "boolean"
                                                        },
                                                        leaf_block: {
                                                            description: "Le bloc qui forme la canopée géante. \nType: `BlockDescriptor`",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        }
                                                    }
                                                },
                                                mega_pine_canopy: {
                                                    description: "Configuration de la canopée de pin géant.",
                                                    type: "object",
                                                    required: ["canopy_height", "base_radius", "radius_step_modifier", "leaf_block"],
                                                    properties: {
                                                        canopy_height: {
                                                            description: "Nombre de couches pour la canopée de pin géant.",
                                                            type: "integer"
                                                        },
                                                        base_radius: {
                                                            description: "Le rayon de la base de la canopée de pin géant.",
                                                            type: "integer",
                                                            minimum: 0
                                                        },
                                                        radius_step_modifier: {
                                                            description: "Modificateur pour le rayon de la base de la canopée de pin géant.",
                                                            type: "number",
                                                            minimum: 0
                                                        },
                                                        core_width: {
                                                            description: "La largeur du tronc de la canopée de pin géant.",
                                                            type: "integer",
                                                            minimum: 1
                                                        },
                                                        leaf_block: {
                                                            description: "Le bloc qui forme la canopée de pin géant.",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        }
                                                    }
                                                },
                                                pine_canopy: {
                                                    description: "Configuration de la canopée de pin.",
                                                    type: "object",
                                                    required: ["canopy_height", "base_radius", "leaf_block"],
                                                    properties: {
                                                        canopy_height: {
                                                            description: "Nombre de couches pour la canopée de pin.",
                                                            type: "integer"
                                                        },
                                                        base_radius: {
                                                            description: "Le rayon de la base de la canopée de pin.",
                                                            type: "integer",
                                                            minimum: 1
                                                        },
                                                        leaf_block: {
                                                            description: "Le bloc qui forme la canopée de pin.",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        }
                                                    }
                                                },
                                                roofed_canopy: {
                                                    description: "Configuration de la canopée de forêt sombre.",
                                                    type: "object",
                                                    required: ["canopy_height", "core_width", "outer_radius", "inner_radius", "leaf_block"],
                                                    properties: {
                                                        canopy_height: {
                                                            description: "Nombre de couches pour la canopée de forêt sombre.",
                                                            type: "integer",
                                                            minimum: 3
                                                        },
                                                        core_width: {
                                                            description: "La largeur du tronc de la canopée de forêt sombre.",
                                                            type: "integer",
                                                            minimum: 1
                                                        },
                                                        outer_radius: {
                                                            description: "Le rayon de la base et de la couche supérieure de la canopée de forêt sombre.",
                                                            type: "integer",
                                                            minimum: 0
                                                        },
                                                        inner_radius: {
                                                            description: "Le rayon des couches intermédiaires de la canopée de forêt sombre.",
                                                            type: "integer",
                                                            minimum: 0
                                                        },
                                                        leaf_block: {
                                                            description: "Le bloc qui forme la canopée de forêt sombre.",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        }
                                                    }
                                                },
                                                spruce_canopy: {
                                                    description: "Configuration de la canopée d'épicéa.",
                                                    type: "object",
                                                    required: ["lower_offset", "upper_offset", "max_radius", "leaf_block"],
                                                    properties: {
                                                        lower_offset: {
                                                            description: "Décalage de la position minimale de la canopée par rapport au tronc.",
                                                            type: "integer"
                                                        },
                                                        upper_offset: {
                                                            description: "Décalage de la position maximale de la canopée par rapport au tronc.",
                                                            type: "integer"
                                                        },
                                                        max_radius: {
                                                            description: "Rayon maximal de la canopée d'épicéa.",
                                                            type: "integer",
                                                            minimum: 0
                                                        },
                                                        leaf_block: {
                                                            description: "Le bloc qui forme la canopée d'épicéa.",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        cherry_trunk: {
                            description: "Définit les propriétés du tronc de cerisier.",
                            type: "object",
                            required: ["trunk_block", "trunk_height", "branches"],
                            properties: {
                                trunk_block: {
                                    description: "Le bloc qui forme le tronc de cerisier.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                trunk_height: {
                                    description: "Configuration de la hauteur du tronc de cerisier.`",
                                    type: "object",
                                    required: ["base"],
                                    properties: {
                                        base: {
                                            description: "La hauteur minimale du tronc de cerisier.",
                                            type: "integer",
                                            minimum: 2
                                        },
                                        intervals: {
                                            description: "Intervalle utilisé pour randomiser la hauteur du tronc, la valeur de chaque intervalle créera un nombre aléatoire où (0 <= rand < interval), et sera ajoutée à la hauteur.",
                                            type: "array",
                                            items: {
                                                type: "integer",
                                                minimum: 1
                                            }   
                                        }
                                    }
                                },
                                branches: {
                                    description: "Configuration des branches de l'arbre de cerisier.",
                                    type: "object",
                                    required: ["branch_horizontal_length", "branch_start_offset_from_top", "branch_end_offset_from_top"],
                                    properties: {
                                        tree_type_weights: {
                                            description: "Configuration de l'objet pour choisir une variante d'arbre basée sur un nombre aléatoire pondéré.",
                                            type: "object",
                                            required: ["one_branch", "two_branches", "two_branches_and_trunk"],
                                            properties: {
                                                one_branch: {
                                                    description: "Poids pour la variante d'arbre avec une branche.",
                                                    type: "integer",
                                                    minimum: 0
                                                },  
                                                two_branches: {
                                                    description: "Poids pour la variante d'arbre avec deux branches.",
                                                    type: "integer",
                                                    minimum: 0
                                                },
                                                two_branches_and_trunk: {
                                                    description: "Poids pour la variante d'arbre avec trois branches.",
                                                    type: "integer",
                                                    minimum: 0
                                                }
                                            }
                                        },
                                        branch_horizontal_length: {
                                            description: "Longueur de la branche dans l'axe X/Z.",
                                            type: "integer"
                                        },
                                        branch_start_offset_from_top: {
                                            description: "Position de départ de la branche par rapport au haut de l'arbre.",
                                            type: "integer"
                                        },
                                        branch_end_offset_from_top: {
                                            description: "Position de fin de la branche par rapport au haut de l'arbre.",
                                            type: "integer"
                                        },
                                        branch_canopy: {
                                            description: "Configuration de la canopée de l'arbre.",
                                            type: "object",
                                            properties: {
                                                acacia_canopy: {
                                                    description: "Configuration de la canopée.",
                                                    type: "object",
                                                    required: ["canopy_size", "leaf_block"],
                                                    properties: {
                                                        canopy_size: {
                                                            description: "La taille de la canopée.",
                                                            type: "integer",
                                                            minimum: 1
                                                        },
                                                        leaf_block: {
                                                            description: "Le bloc qui forme la canopée.",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        },
                                                        simplify_canopy: {
                                                            description: "Si 'true', la canopée utilise un motif simple.",
                                                            type: "boolean"
                                                        }
                                                    }
                                                },
                                                canopy: {
                                                    description: "Configuration de la canopée.",
                                                    type: "object",
                                                    required: ["canopy_offset"],
                                                    properties: {
                                                        canopy_offset: {
                                                            description: "Position relative de la canopée par rapport au tronc.",
                                                            type: "object",
                                                            required: ["min", "max"],
                                                            properties: {
                                                                min: {
                                                                    description: "Position minimale de la canopée par rapport au tronc.",
                                                                    type: "integer"
                                                                },
                                                                max: {
                                                                    description: "Position maximale de la canopée par rapport au tronc.`",
                                                                    type: "integer"
                                                                }
                                                            }
                                                        },
                                                        min_width: {
                                                            description: "Largeur minimale pour la canopée.",
                                                            type: "integer",
                                                            minimum: 0
                                                        },
                                                        canopy_slope: {
                                                            description: "Configuration de la pente de la canopée.",
                                                            type: "object",
                                                            properties: {
                                                                rise: {
                                                                    description: "Le numérateur de la pente.",
                                                                    type: "integer",
                                                                    minimum: 1
                                                                },
                                                                run: {
                                                                    description: "Le dénominateur de la pente.",
                                                                    type: "integer",
                                                                    minimum: 1
                                                                }
                                                            }
                                                        },
                                                        variation_chance: {
                                                            description: "Détermine la chance de créer des blocs de feuilles pour chaque couche de la canopée. Les nombres plus grands créent un arbre plus dense.",
                                                            oneOf: [
                                                                {
                                                                    type: "object",
                                                                    required: ["numerator", "denominator"],
                                                                    properties: {
                                                                        numerator: {
                                                                            description: "Le numérateur de la probabilité.",
                                                                            type: "integer"
                                                                        },
                                                                        denominator: {
                                                                            description: "Le dénominateur de la probabilité.",
                                                                            type: "integer"
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    type: "array",
                                                                    items: {
                                                                        type: "object",
                                                                        required: ["numerator", "denominator"],
                                                                        properties: {
                                                                            numerator: {
                                                                                description: "Le numérateur de la probabilité.",
                                                                                type: "integer"
                                                                            },
                                                                            denominator: {
                                                                                description: "Le dénominateur de la probabilité.",
                                                                                type: "integer"
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            ]
                                                        },
                                                        leaf_block: {
                                                            description: "Le bloc qui forme la canopée.",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        },
                                                        canopy_decoration: {
                                                            description: "Configuration de la décoration de la canopée.",
                                                            type: "object",
                                                            required: ["decoration_chance"],
                                                            properties: {
                                                                decoration_chance: {
                                                                    description: "Probabilité de décorer la canopée.",
                                                                    type: "object",
                                                                    required: ["numerator", "denominator"],
                                                                    properties: {
                                                                        numerator: {
                                                                            description: "Le numérateur de la probabilité.",
                                                                            type: "integer"
                                                                        },
                                                                        denominator: {
                                                                            description: "Le dénominateur de la probabilité.",
                                                                            type: "integer"
                                                                        }
                                                                    }
                                                                },
                                                                decoration_block: {
                                                                    description: "Le bloc à utilisé pour la décoration de la canopée.",
                                                                    oneOf: [
                                                                        {
                                                                            type: "string",
                                                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                        },
                                                                        commonSchemas.block_descriptor
                                                                    ]
                                                                },
                                                                num_steps: {
                                                                    description: "Nombre de blocs de décoration à placer.",
                                                                    type: "integer"
                                                                },
                                                                step_direction: {
                                                                    description: "Direction pour étaler les blocs de décoration.",
                                                                    type: "string",
                                                                    enum: ["down", "up", "out", "away"]
                                                                }
                                                            }
                                                        }
                                                    }
                                                },
                                                cherry_canopy: {
                                                    description: "Configuration de la canopée de cerisier.",
                                                    type: "object",
                                                    required: ["leaf_block", "height", "radius", "wide_bottom_layer_hole_chance", "corner_hole_chance", "hanging_leaves_chance", "hanging_leaves_extension_chance"],
                                                    properties: {
                                                        leaf_block: {
                                                            description: "Le bloc qui forme la canopée de cerisier.",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        },
                                                        height: {
                                                            description: "Nombre de couches pour la canopée.",
                                                            type: "integer"
                                                        },
                                                        radius: {
                                                            description: "Le rayon de la canopée de cerisier.",
                                                            type: "integer"
                                                        },
                                                        trunk_width: {
                                                            description: "La largeur du tronc de cerisier.",
                                                            type: "integer",
                                                            minimum: 1
                                                        },
                                                        wide_bottom_layer_hole_chance: {
                                                            description: "Probabilité que la canopée ait un trou dans la couche inférieure.",
                                                            type: "object",
                                                            required: ["numerator", "denominator"],
                                                            properties: {
                                                                numerator: {
                                                                    description: "Le numérateur de la probabilité.",
                                                                    type: "integer"
                                                                },
                                                                denominator: {
                                                                    description: "Le dénominateur de la probabilité.",
                                                                    type: "integer"
                                                                }
                                                            }
                                                        },
                                                        corner_hole_chance: {
                                                            description: "Probabilité que la canopée ait un trou dans le coin.",
                                                            type: "object",
                                                            required: ["numerator", "denominator"],
                                                            properties: {
                                                                numerator: {
                                                                    description: "Le numérateur de la probabilité.",
                                                                    type: "integer"
                                                                },
                                                                denominator: {
                                                                    description: "Le dénominateur de la probabilité.",
                                                                    type: "integer"
                                                                }
                                                            }
                                                        },
                                                        hanging_leaves_chance: {
                                                            description: "Probabilité que la canopée ait des feuilles suspendues.",
                                                            type: "object",
                                                            required: ["numerator", "denominator"],
                                                            properties: {
                                                                numerator: {
                                                                    description: "Le numérateur de la probabilité.",
                                                                    type: "integer"
                                                                },
                                                                denominator: {
                                                                    description: "Le dénominateur de la probabilité.",
                                                                    type: "integer"
                                                                }
                                                            }
                                                        },
                                                        hanging_leaves_extension_chance: {
                                                            description: "Probabilité que les feuilles suspendues s'étendent plus bas.",
                                                            type: "object",
                                                            required: ["numerator", "denominator"],
                                                            properties: {
                                                                numerator: {
                                                                    description: "Le numérateur de la probabilité.",
                                                                    type: "integer"
                                                                },
                                                                denominator: {
                                                                    description: "Le dénominateur de la probabilité.",
                                                                    type: "integer"
                                                                }
                                                            }
                                                        }
                                                    }
                                                },
                                                fancy_canopy: {
                                                    description: "Configuration de la canopée fantaisie.",
                                                    type: "object",
                                                    required: ["height", "radius", "leaf_block"],
                                                    properties: {
                                                        height: {
                                                            description: "Nombre de couches pour la canopée.",
                                                            type: "integer",
                                                            minimum: 1
                                                        },
                                                        radius: {
                                                            description: "Le rayon de la canopée fantaisie.",
                                                            type: "integer",
                                                            minimum: 0
                                                        },
                                                        leaf_block: {
                                                            description: "Le bloc qui forme la canopée fantaisie.",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        }
                                                    }
                                                },
                                                mangrove_canopy: {
                                                    description: "Configuration de la canopée de mangrove.",
                                                    type: "object",
                                                    required: ["canopy_height", "canopy_radius", "leaf_placement_attempts", "hanging_block", "hanging_block_placement_chance"],
                                                    properties: {
                                                        canopy_height: {
                                                            description: "Nombre de couches pour la canopée.",
                                                            type: "integer"
                                                        },
                                                        canopy_radius: {
                                                            description: "Le rayon de la canopée de mangrove.",
                                                            type: "integer"
                                                        },
                                                        leaf_placement_attempts: {
                                                            description: "Nombre maximum de tentatives pour placer les feuilles.",
                                                            type: "integer",
                                                            minimum: 1
                                                        },
                                                        leaf_blocks: {
                                                            description: "Les blocs avec un poids de chance pour la canopée de mangrove.",
                                                            type: "array",
                                                            items: {
                                                                type: "array",
                                                                minItems: 2,
                                                                maxItems: 2,
                                                                items: [
                                                                    {
                                                                        oneOf: [
                                                                            {
                                                                                type: "string",
                                                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                            },
                                                                            commonSchemas.block_descriptor
                                                                        ]
                                                                    },
                                                                    {
                                                                        type: "number"
                                                                    }
                                                                ]
                                                            }
                                                        },
                                                        canopy_decoration: {
                                                            description: "Configuration de la décoration de la canopée de mangrove.",
                                                            type: "object",
                                                            required: ["decoration_chance"],
                                                            properties: {
                                                                decoration_chance: {
                                                                    description: "Probabilité de décorer le tronc.",
                                                                    type: "object",
                                                                    required: ["numerator", "denominator"],
                                                                    properties: {
                                                                        numerator: {
                                                                            description: "Le numérateur de la probabilité.",
                                                                            type: "integer"
                                                                        },
                                                                        denominator: {
                                                                            description: "Le dénominateur de la probabilité.",
                                                                            type: "integer"
                                                                        }
                                                                    }
                                                                },
                                                                decoration_block: {
                                                                    description: "Le bloc à utilisé pour la décoration de la canopée de mangrove.",
                                                                    oneOf: [
                                                                        {
                                                                            type: "string",
                                                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                        },
                                                                        commonSchemas.block_descriptor
                                                                    ]
                                                                },
                                                                num_steps: {
                                                                    description: "Nombre de blocs de décoration à placer.",
                                                                    type: "integer"
                                                                },
                                                                step_direction: {
                                                                    description: "Direction pour étaler les blocs de décoration.",
                                                                    type: "string",
                                                                    enum: ["down", "up", "out", "away"]
                                                                }
                                                            }
                                                        },
                                                        hanging_block: {
                                                            description: "Le bloc à utiliser comme bloc suspendu.",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        },
                                                        hanging_block_placement_chance: {
                                                            description: "Probabilité de placer un bloc suspendu.",
                                                            type: "object",
                                                            required: ["numerator", "denominator"],
                                                            properties: {
                                                                numerator: {
                                                                    description: "Le numérateur de la probabilité.",
                                                                    type: "integer"
                                                                },
                                                                denominator: {
                                                                    description: "Le dénominateur de la probabilité.",
                                                                    type: "integer"
                                                                }
                                                            }
                                                        }
                                                    }
                                                },
                                                mega_canopy: {
                                                    description: "Configuration de la canopée géante.",
                                                    type: "object",
                                                    required: ["canopy_height", "base_radius", "leaf_block"],
                                                    properties: {
                                                        canopy_height: {
                                                            description: "Nombre de couches pour la canopée géante.",
                                                            type: "integer"
                                                        },
                                                        base_radius: {
                                                            description: "Le rayon de la base de la canopée géante.",
                                                            type: "integer",
                                                            minimum: 0
                                                        },
                                                        core_width: {
                                                            description: "La largeur du tronc de la canopée géante.",
                                                            type: "integer",
                                                            minimum: 1
                                                        },
                                                        simplify_canopy: {
                                                            description: "Si `true`, la canopée utilise un motif simple.",
                                                            type: "boolean"
                                                        },
                                                        leaf_block: {
                                                            description: "Le bloc qui forme la canopée géante. \nType: `BlockDescriptor`",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        }
                                                    }
                                                },
                                                mega_pine_canopy: {
                                                    description: "Configuration de la canopée de pin géant.",
                                                    type: "object",
                                                    required: ["canopy_height", "base_radius", "radius_step_modifier", "leaf_block"],
                                                    properties: {
                                                        canopy_height: {
                                                            description: "Nombre de couches pour la canopée de pin géant.",
                                                            type: "integer"
                                                        },
                                                        base_radius: {
                                                            description: "Le rayon de la base de la canopée de pin géant.",
                                                            type: "integer",
                                                            minimum: 0
                                                        },
                                                        radius_step_modifier: {
                                                            description: "Modificateur pour le rayon de la base de la canopée de pin géant.",
                                                            type: "number",
                                                            minimum: 0
                                                        },
                                                        core_width: {
                                                            description: "La largeur du tronc de la canopée de pin géant.",
                                                            type: "integer",
                                                            minimum: 1
                                                        },
                                                        leaf_block: {
                                                            description: "Le bloc qui forme la canopée de pin géant.",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        }
                                                    }
                                                },
                                                pine_canopy: {
                                                    description: "Configuration de la canopée de pin.",
                                                    type: "object",
                                                    required: ["canopy_height", "base_radius", "leaf_block"],
                                                    properties: {
                                                        canopy_height: {
                                                            description: "Nombre de couches pour la canopée de pin.",
                                                            type: "integer"
                                                        },
                                                        base_radius: {
                                                            description: "Le rayon de la base de la canopée de pin.",
                                                            type: "integer",
                                                            minimum: 1
                                                        },
                                                        leaf_block: {
                                                            description: "Le bloc qui forme la canopée de pin.",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        }
                                                    }
                                                },
                                                roofed_canopy: {
                                                    description: "Configuration de la canopée de forêt sombre.",
                                                    type: "object",
                                                    required: ["canopy_height", "core_width", "outer_radius", "inner_radius", "leaf_block"],
                                                    properties: {
                                                        canopy_height: {
                                                            description: "Nombre de couches pour la canopée de forêt sombre.",
                                                            type: "integer",
                                                            minimum: 3
                                                        },
                                                        core_width: {
                                                            description: "La largeur du tronc de la canopée de forêt sombre.",
                                                            type: "integer",
                                                            minimum: 1
                                                        },
                                                        outer_radius: {
                                                            description: "Le rayon de la base et de la couche supérieure de la canopée de forêt sombre.",
                                                            type: "integer",
                                                            minimum: 0
                                                        },
                                                        inner_radius: {
                                                            description: "Le rayon des couches intermédiaires de la canopée de forêt sombre.",
                                                            type: "integer",
                                                            minimum: 0
                                                        },
                                                        leaf_block: {
                                                            description: "Le bloc qui forme la canopée de forêt sombre.",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        }
                                                    }
                                                },
                                                spruce_canopy: {
                                                    description: "Configuration de la canopée d'épicéa.",
                                                    type: "object",
                                                    required: ["lower_offset", "upper_offset", "max_radius", "leaf_block"],
                                                    properties: {
                                                        lower_offset: {
                                                            description: "Décalage de la position minimale de la canopée par rapport au tronc.",
                                                            type: "integer"
                                                        },
                                                        upper_offset: {
                                                            description: "Décalage de la position maximale de la canopée par rapport au tronc.",
                                                            type: "integer"
                                                        },
                                                        max_radius: {
                                                            description: "Rayon maximal de la canopée d'épicéa.",
                                                            type: "integer",
                                                            minimum: 0
                                                        },
                                                        leaf_block: {
                                                            description: "Le bloc qui forme la canopée d'épicéa.",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        fallen_trunk: {
                            description: "Définit les propriétés du tronc tombé.",
                            type: "object",
                            required: ["log_length", "trunk_block"],
                            properties: {
                                log_length: {
                                    description: "Longueur du tronc tombé.",
                                    type: "integer"
                                },
                                stump_height: {
                                    description: "Hauteur de la souche.",
                                    type: "integer"
                                },
                                height_modifier: {
                                    description: "Modificateur pour la longueur du tronc tombé.",
                                    type: "number"
                                },
                                trunk_block: {
                                    description: "Le bloc qui forme le tronc tombé.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                log_decoration_feature: {
                                    description: "Feature qui peut être utilisée pour décorer le tronc tombé.",
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.feature_ids
                                },
                                trunk_decoration: {
                                    description: "Configuration de la décoration du tronc tombé.",
                                    type: "object",
                                    required: ["decoration_chance"],
                                    properties: {
                                        decoration_chance: {
                                            description: "Probabilité de décorer le tronc tombé.",
                                            type: "object",
                                            required: ["numerator", "denominator"],
                                            properties: {
                                                numerator: {
                                                    description: "Le numérateur de la probabilité.",
                                                    type: "integer"
                                                },
                                                denominator: {
                                                    description: "Le dénominateur de la probabilité.",
                                                    type: "integer"
                                                }
                                            }
                                        },
                                        decoration_block: {
                                            description: "Le bloc à utilisé pour la décoration du tronc tombé.",
                                            oneOf: [
                                                {
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                },
                                                commonSchemas.block_descriptor
                                            ]
                                        },
                                        num_steps: {
                                            description: "Nombre de blocs de décoration à placer.",
                                            type: "integer"
                                        },
                                        step_direction: {
                                            description: "Direction pour étaler les blocs de décoration.",
                                            type: "string",
                                            enum: ["down", "up", "out", "away"]
                                        }
                                    }
                                }
                            }
                        },
                        fancy_trunk: {
                            description: "Définit les propriétés du tronc fantaisie.",
                            type: "object",
                            required: ["trunk_height", "trunk_width", "branches", "trunk_block", "width_scale", "foliage_altitude_factor"],
                            properties: {
                                trunk_height: {
                                    description: "Configuration de la hauteur du tronc fantaisie.",
                                    type: "object",
                                    required: ["base", "variance", "scale"],
                                    properties: {
                                        base: {
                                            description: "La hauteur minimale du tronc fantaisie.",
                                            type: "integer",
                                            minimum: 1
                                        },
                                        variance: {
                                            description: "Variance de la hauteur du tronc fantaisie",
                                            type: "integer",
                                            minimum: 1
                                        },
                                        scale: {
                                            description: "Hauteur finale de l'arbre multipliée par cette échelle. L'échelle maximale prise en charge est de 1.",
                                            type: "number",
                                            maximum: 1
                                        }
                                    }
                                },
                                trunk_width: {
                                    description: "La largeur du tronc fantaisie.",
                                    type: "integer",
                                    minimum: 1
                                },
                                branches: {
                                    description: "Configuration de l'objet pour les branches de l'arbre fantaisie.",
                                    type: "object",
                                    required: ["slope", "density", "min_altitude_factor"],
                                    properties: {
                                        slope: {
                                            description: "Pente pour la branche, où 0 est horizontal et 1 est vertical.",
                                            type: "number"
                                        },
                                        density: {
                                            description: "Densité de la végétation.",
                                            type: "number"
                                        },
                                        min_altitude_factor: {
                                            description: "Hauteur minimale pour les branches. Représentée par un pourcentage de la hauteur de l'arbre.",
                                            type: "number",
                                            minimum: 0,
                                            maximum: 1
                                        }
                                    }
                                },
                                trunk_block: {
                                    description: "Le bloc qui forme le tronc de l'arbre fantaisie.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                width_scale: {
                                    description: "Modificateur d'échelle pour le rayon de l'arbre.",
                                    type: "number",
                                    minimum: 0
                                },
                                foliage_altitude_factor: {
                                    description: "Hauteur minimale pour la végétation. Représentée par un pourcentage de la hauteur de l'arbre.",
                                    type: "number",
                                    minimum: 0,
                                    maximum: 1
                                }
                            }
                        },
                        mangrove_trunk: {
                            description: "Définit les propriétés du tronc de mangrove.",
                            type: "object",
                            required: ["trunk_width", "trunk_height", "trunk_block"],
                            properties: {
                                trunk_width: {
                                    description: "La largeur du tronc de l'arbre de mangrove.",
                                    type: "integer"
                                },
                                trunk_height: {
                                    description: "Configuration de la hauteur du tronc de l'arbre de mangrove.",
                                    type: "object",
                                    required: ["base", "height_rand_a", "height_rand_b"],
                                    properties: {
                                        base: {
                                            description: "Hauteur minimale pour le tronc de l'arbre.",
                                            type: "integer",
                                            minimum: 1
                                        },
                                        height_rand_a: {
                                            description: "Modificateur de hauteur A pour le tronc de l'arbre.",
                                            type: "integer",
                                            minimum: 1
                                        },
                                        height_rand_b: {
                                            description: "Modificateur de hauteur B pour le tronc de l'arbre.",
                                            type: "integer",
                                            minimum: 1
                                        }
                                    }
                                },
                                trunk_block: {
                                    description: "Le bloc qui forme le tronc de l'arbre de mangrove.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                branches: {
                                    description: "Configuration de l'objet pour les branches de l'arbre de mangrove.",
                                    type: "object",
                                    required: ["branch_length", "branch_steps", "branch_chance"],
                                    properties: {
                                        branch_length: {
                                            description: "Longueur de la branche dans l'axe Y.",
                                            type: "integer"
                                        },
                                        branch_steps: {
                                            description: "Nombre de branches à placer.",
                                            type: "integer"
                                        },
                                        branch_chance: {
                                            description: "Probabilité de créer une branche.",
                                            type: "object",
                                            required: ["numerator", "denominator"],
                                            properties: {
                                                numerator: {
                                                    description: "Le numérateur de la probabilité.",
                                                    type: "integer"
                                                },
                                                denominator: {
                                                    description: "Le dénominateur de la probabilité.",
                                                    type: "integer"
                                                }
                                            }
                                        }
                                    }
                                },
                                trunk_decoration: {
                                    description: "Configuration de l'objet pour la décoration du tronc de l'arbre de mangrove.",
                                    type: "object",
                                    required: ["decoration_chance"],
                                    properties: {
                                        decoration_chance: {
                                            description: "Probabilité de décorer le tronc.",
                                            type: "object",
                                            required: ["numerator", "denominator"],
                                            properties: {
                                                numerator: {
                                                    description: "Le numérateur de la probabilité.",
                                                    type: "integer"
                                                },
                                                denominator: {
                                                    "description": "Le dénominateur de la probabilité. \nType: `Integer`",
                                                    "type": "integer"
                                                }
                                            }
                                        },
                                        decoration_block: {
                                            description: "Le bloc à utilisé pour la décoration du tronc de l'arbre de mangrove.",
                                            oneOf: [
                                                {
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                },
                                                commonSchemas.block_descriptor
                                            ]
                                        },
                                        num_steps: {
                                            description: "Nombre de blocs de décoration à placer.",
                                            type: "integer"
                                        },
                                        step_direction: {
                                            description: "Direction pour étaler les blocs de décoration.",
                                            type: "string",
                                            enum: ["down", "up", "out", "away"]
                                        }
                                    }
                                }
                            }
                        },
                        mega_trunk: {
                            description: "Définit les propriétés du tronc géant.",
                            type: "object",
                            required: ["trunk_width", "trunk_height", "trunk_block"],
                            properties: {
                                trunk_width: {
                                    description: "La largeur du tronc de l'arbre géant.",
                                    type: "integer"
                                },
                                trunk_height: {
                                    description: "Configuration de la hauteur du tronc de l'arbre géant.",
                                    type: "object",
                                    required: ["base", "intervals"],
                                    properties: {
                                        base: {
                                            description: "Hauteur minimale pour le tronc de l'arbre géant.",
                                            type: "integer",
                                            minimum: 1
                                        },
                                        intervals: {
                                            description: "Intervalle utilisé pour randomiser la hauteur du tronc, la valeur de chaque intervalle créera un nombre aléatoire où (0 <= rand < interval), et sera ajoutée à la hauteur.",
                                            type: "array",
                                            items: {
                                                type: "integer",
                                                minimum: 1
                                            }   
                                        }
                                    }
                                },
                                trunk_block: {
                                    description: "Le bloc qui forme le tronc de l'arbre géant.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                trunk_decoration: {
                                    description: "Configuration de la décoration du tronc de l'arbre géant.",
                                    type: "object",
                                    required: ["decoration_chance"],
                                    properties: {
                                        decoration_chance: {
                                            description: "Probabilité de décorer le tronc.",
                                            type: "object",
                                            required: ["numerator", "denominator"],
                                            properties: {
                                                numerator: {
                                                    description: "Le numérateur de la probabilité.",
                                                    type: "integer"
                                                },
                                                denominator: {
                                                    description: "Le dénominateur de la probabilité.",
                                                    type: "integer"
                                                }
                                            }
                                        },
                                        decoration_block: {
                                            description: "Le bloc à utilisé pour la décoration du tronc.",
                                            oneOf: [
                                                {
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                },
                                                commonSchemas.block_descriptor
                                            ]
                                        },
                                        num_steps: {
                                            description: "Nombre de blocs de décoration à placer.",
                                            type: "integer"
                                        },
                                        step_direction: {
                                            description: "Direction pour étaler les blocs de décoration.",
                                            type: "string",
                                            enum: ["down", "up", "out", "away"]
                                        }
                                    }
                                },
                                branches: {
                                    description: "Configuration des branches de l'arbre.",
                                    type: "object",
                                    required: ["branch_length", "branch_slope", "branch_interval", "branch_altitude_factor"],
                                    properties: {
                                        branch_length: {
                                            description: "Longueur pour les branches de l'arbre dans l'axe Y.",
                                            type: "integer",
                                            minimum: 1
                                        },
                                        branch_slope: {
                                            description: "Pente pour les branches de l'arbre, où 0 est horizontal et 1 est vertical.",
                                            type: "number"
                                        },
                                        branch_interval: {
                                            description: "Intervalle pour les branches de l'arbre."
                                        },
                                        branch_altitude_factor: {
                                            description: "Altitude à laquelle les branches peuvent apparaître, par rapport à la hauteur de l'arbre.",
                                            type: "object",
                                            required: ["min", "max"],
                                            properties: {
                                                min: {
                                                    description: "Altitude minimale à laquelle les branches peuvent apparaître.",
                                                    type: "number",
                                                    minimum: 0,
                                                    maximum: 1
                                                },
                                                max: {
                                                    description: "Altitude maximale à laquelle les branches peuvent apparaître.",
                                                    type: "number",
                                                    minimum: 0,
                                                    maximum: 1
                                                }
                                            }
                                        },
                                        branch_canopy: {
                                            description: "Configuration de la canopée de l'arbre.",
                                            type: "object",
                                            properties: {
                                                acacia_canopy: {
                                                    description: "Configuration de la canopée.",
                                                    type: "object",
                                                    required: ["canopy_size", "leaf_block"],
                                                    properties: {
                                                        canopy_size: {
                                                            description: "La taille de la canopée.",
                                                            type: "integer",
                                                            minimum: 1
                                                        },
                                                        leaf_block: {
                                                            description: "Le bloc qui forme la canopée.",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        },
                                                        simplify_canopy: {
                                                            description: "Si 'true', la canopée utilise un motif simple.",
                                                            type: "boolean"
                                                        }
                                                    }
                                                },
                                                canopy: {
                                                    description: "Configuration de la canopée.",
                                                    type: "object",
                                                    required: ["canopy_offset"],
                                                    properties: {
                                                        canopy_offset: {
                                                            description: "Position relative de la canopée par rapport au tronc.",
                                                            type: "object",
                                                            required: ["min", "max"],
                                                            properties: {
                                                                min: {
                                                                    description: "Position minimale de la canopée par rapport au tronc.",
                                                                    type: "integer"
                                                                },
                                                                max: {
                                                                    description: "Position maximale de la canopée par rapport au tronc.`",
                                                                    type: "integer"
                                                                }
                                                            }
                                                        },
                                                        min_width: {
                                                            description: "Largeur minimale pour la canopée.",
                                                            type: "integer",
                                                            minimum: 0
                                                        },
                                                        canopy_slope: {
                                                            description: "Configuration de la pente de la canopée.",
                                                            type: "object",
                                                            properties: {
                                                                rise: {
                                                                    description: "Le numérateur de la pente.",
                                                                    type: "integer",
                                                                    minimum: 1
                                                                },
                                                                run: {
                                                                    description: "Le dénominateur de la pente.",
                                                                    type: "integer",
                                                                    minimum: 1
                                                                }
                                                            }
                                                        },
                                                        variation_chance: {
                                                            description: "Détermine la chance de créer des blocs de feuilles pour chaque couche de la canopée. Les nombres plus grands créent un arbre plus dense.",
                                                            oneOf: [
                                                                {
                                                                    type: "object",
                                                                    required: ["numerator", "denominator"],
                                                                    properties: {
                                                                        numerator: {
                                                                            description: "Le numérateur de la probabilité.",
                                                                            type: "integer"
                                                                        },
                                                                        denominator: {
                                                                            description: "Le dénominateur de la probabilité.",
                                                                            type: "integer"
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    type: "array",
                                                                    items: {
                                                                        type: "object",
                                                                        required: ["numerator", "denominator"],
                                                                        properties: {
                                                                            numerator: {
                                                                                description: "Le numérateur de la probabilité.",
                                                                                type: "integer"
                                                                            },
                                                                            denominator: {
                                                                                description: "Le dénominateur de la probabilité.",
                                                                                type: "integer"
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            ]
                                                        },
                                                        leaf_block: {
                                                            description: "Le bloc qui forme la canopée.",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        },
                                                        canopy_decoration: {
                                                            description: "Configuration de la décoration de la canopée.",
                                                            type: "object",
                                                            required: ["decoration_chance"],
                                                            properties: {
                                                                decoration_chance: {
                                                                    description: "Probabilité de décorer la canopée.",
                                                                    type: "object",
                                                                    required: ["numerator", "denominator"],
                                                                    properties: {
                                                                        numerator: {
                                                                            description: "Le numérateur de la probabilité.",
                                                                            type: "integer"
                                                                        },
                                                                        denominator: {
                                                                            description: "Le dénominateur de la probabilité.",
                                                                            type: "integer"
                                                                        }
                                                                    }
                                                                },
                                                                decoration_block: {
                                                                    description: "Le bloc à utilisé pour la décoration de la canopée.",
                                                                    oneOf: [
                                                                        {
                                                                            type: "string",
                                                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                        },
                                                                        commonSchemas.block_descriptor
                                                                    ]
                                                                },
                                                                num_steps: {
                                                                    description: "Nombre de blocs de décoration à placer.",
                                                                    type: "integer"
                                                                },
                                                                step_direction: {
                                                                    description: "Direction pour étaler les blocs de décoration.",
                                                                    type: "string",
                                                                    enum: ["down", "up", "out", "away"]
                                                                }
                                                            }
                                                        }
                                                    }
                                                },
                                                cherry_canopy: {
                                                    description: "Configuration de la canopée de cerisier.",
                                                    type: "object",
                                                    required: ["leaf_block", "height", "radius", "wide_bottom_layer_hole_chance", "corner_hole_chance", "hanging_leaves_chance", "hanging_leaves_extension_chance"],
                                                    properties: {
                                                        leaf_block: {
                                                            description: "Le bloc qui forme la canopée de cerisier.",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        },
                                                        height: {
                                                            description: "Nombre de couches pour la canopée.",
                                                            type: "integer"
                                                        },
                                                        radius: {
                                                            description: "Le rayon de la canopée de cerisier.",
                                                            type: "integer"
                                                        },
                                                        trunk_width: {
                                                            description: "La largeur du tronc de cerisier.",
                                                            type: "integer",
                                                            minimum: 1
                                                        },
                                                        wide_bottom_layer_hole_chance: {
                                                            description: "Probabilité que la canopée ait un trou dans la couche inférieure.",
                                                            type: "object",
                                                            required: ["numerator", "denominator"],
                                                            properties: {
                                                                numerator: {
                                                                    description: "Le numérateur de la probabilité.",
                                                                    type: "integer"
                                                                },
                                                                denominator: {
                                                                    description: "Le dénominateur de la probabilité.",
                                                                    type: "integer"
                                                                }
                                                            }
                                                        },
                                                        corner_hole_chance: {
                                                            description: "Probabilité que la canopée ait un trou dans le coin.",
                                                            type: "object",
                                                            required: ["numerator", "denominator"],
                                                            properties: {
                                                                numerator: {
                                                                    description: "Le numérateur de la probabilité.",
                                                                    type: "integer"
                                                                },
                                                                denominator: {
                                                                    description: "Le dénominateur de la probabilité.",
                                                                    type: "integer"
                                                                }
                                                            }
                                                        },
                                                        hanging_leaves_chance: {
                                                            description: "Probabilité que la canopée ait des feuilles suspendues.",
                                                            type: "object",
                                                            required: ["numerator", "denominator"],
                                                            properties: {
                                                                numerator: {
                                                                    description: "Le numérateur de la probabilité.",
                                                                    type: "integer"
                                                                },
                                                                denominator: {
                                                                    description: "Le dénominateur de la probabilité.",
                                                                    type: "integer"
                                                                }
                                                            }
                                                        },
                                                        hanging_leaves_extension_chance: {
                                                            description: "Probabilité que les feuilles suspendues s'étendent plus bas.",
                                                            type: "object",
                                                            required: ["numerator", "denominator"],
                                                            properties: {
                                                                numerator: {
                                                                    description: "Le numérateur de la probabilité.",
                                                                    type: "integer"
                                                                },
                                                                denominator: {
                                                                    description: "Le dénominateur de la probabilité.",
                                                                    type: "integer"
                                                                }
                                                            }
                                                        }
                                                    }
                                                },
                                                fancy_canopy: {
                                                    description: "Configuration de la canopée fantaisie.",
                                                    type: "object",
                                                    required: ["height", "radius", "leaf_block"],
                                                    properties: {
                                                        height: {
                                                            description: "Nombre de couches pour la canopée.",
                                                            type: "integer",
                                                            minimum: 1
                                                        },
                                                        radius: {
                                                            description: "Le rayon de la canopée fantaisie.",
                                                            type: "integer",
                                                            minimum: 0
                                                        },
                                                        leaf_block: {
                                                            description: "Le bloc qui forme la canopée fantaisie.",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        }
                                                    }
                                                },
                                                mangrove_canopy: {
                                                    description: "Configuration de la canopée de mangrove.",
                                                    type: "object",
                                                    required: ["canopy_height", "canopy_radius", "leaf_placement_attempts", "hanging_block", "hanging_block_placement_chance"],
                                                    properties: {
                                                        canopy_height: {
                                                            description: "Nombre de couches pour la canopée.",
                                                            type: "integer"
                                                        },
                                                        canopy_radius: {
                                                            description: "Le rayon de la canopée de mangrove.",
                                                            type: "integer"
                                                        },
                                                        leaf_placement_attempts: {
                                                            description: "Nombre maximum de tentatives pour placer les feuilles.",
                                                            type: "integer",
                                                            minimum: 1
                                                        },
                                                        leaf_blocks: {
                                                            description: "Les blocs avec un poids de chance pour la canopée de mangrove.",
                                                            type: "array",
                                                            items: {
                                                                type: "array",
                                                                minItems: 2,
                                                                maxItems: 2,
                                                                items: [
                                                                    {
                                                                        oneOf: [
                                                                            {
                                                                                type: "string",
                                                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                            },
                                                                            commonSchemas.block_descriptor
                                                                        ]
                                                                    },
                                                                    {
                                                                        type: "number"
                                                                    }
                                                                ]
                                                            }
                                                        },
                                                        canopy_decoration: {
                                                            description: "Configuration de la décoration de la canopée de mangrove.",
                                                            type: "object",
                                                            required: ["decoration_chance"],
                                                            properties: {
                                                                decoration_chance: {
                                                                    description: "Probabilité de décorer le tronc.",
                                                                    type: "object",
                                                                    required: ["numerator", "denominator"],
                                                                    properties: {
                                                                        numerator: {
                                                                            description: "Le numérateur de la probabilité.",
                                                                            type: "integer"
                                                                        },
                                                                        denominator: {
                                                                            description: "Le dénominateur de la probabilité.",
                                                                            type: "integer"
                                                                        }
                                                                    }
                                                                },
                                                                decoration_block: {
                                                                    description: "Le bloc à utilisé pour la décoration de la canopée de mangrove.",
                                                                    oneOf: [
                                                                        {
                                                                            type: "string",
                                                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                        },
                                                                        commonSchemas.block_descriptor
                                                                    ]
                                                                },
                                                                num_steps: {
                                                                    description: "Nombre de blocs de décoration à placer.",
                                                                    type: "integer"
                                                                },
                                                                step_direction: {
                                                                    description: "Direction pour étaler les blocs de décoration.",
                                                                    type: "string",
                                                                    enum: ["down", "up", "out", "away"]
                                                                }
                                                            }
                                                        },
                                                        hanging_block: {
                                                            description: "Le bloc à utiliser comme bloc suspendu.",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        },
                                                        hanging_block_placement_chance: {
                                                            description: "Probabilité de placer un bloc suspendu.",
                                                            type: "object",
                                                            required: ["numerator", "denominator"],
                                                            properties: {
                                                                numerator: {
                                                                    description: "Le numérateur de la probabilité.",
                                                                    type: "integer"
                                                                },
                                                                denominator: {
                                                                    description: "Le dénominateur de la probabilité.",
                                                                    type: "integer"
                                                                }
                                                            }
                                                        }
                                                    }
                                                },
                                                mega_canopy: {
                                                    description: "Configuration de la canopée géante.",
                                                    type: "object",
                                                    required: ["canopy_height", "base_radius", "leaf_block"],
                                                    properties: {
                                                        canopy_height: {
                                                            description: "Nombre de couches pour la canopée géante.",
                                                            type: "integer"
                                                        },
                                                        base_radius: {
                                                            description: "Le rayon de la base de la canopée géante.",
                                                            type: "integer",
                                                            minimum: 0
                                                        },
                                                        core_width: {
                                                            description: "La largeur du tronc de la canopée géante.",
                                                            type: "integer",
                                                            minimum: 1
                                                        },
                                                        simplify_canopy: {
                                                            description: "Si `true`, la canopée utilise un motif simple.",
                                                            type: "boolean"
                                                        },
                                                        leaf_block: {
                                                            description: "Le bloc qui forme la canopée géante. \nType: `BlockDescriptor`",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        }
                                                    }
                                                },
                                                mega_pine_canopy: {
                                                    description: "Configuration de la canopée de pin géant.",
                                                    type: "object",
                                                    required: ["canopy_height", "base_radius", "radius_step_modifier", "leaf_block"],
                                                    properties: {
                                                        canopy_height: {
                                                            description: "Nombre de couches pour la canopée de pin géant.",
                                                            type: "integer"
                                                        },
                                                        base_radius: {
                                                            description: "Le rayon de la base de la canopée de pin géant.",
                                                            type: "integer",
                                                            minimum: 0
                                                        },
                                                        radius_step_modifier: {
                                                            description: "Modificateur pour le rayon de la base de la canopée de pin géant.",
                                                            type: "number",
                                                            minimum: 0
                                                        },
                                                        core_width: {
                                                            description: "La largeur du tronc de la canopée de pin géant.",
                                                            type: "integer",
                                                            minimum: 1
                                                        },
                                                        leaf_block: {
                                                            description: "Le bloc qui forme la canopée de pin géant.",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        }
                                                    }
                                                },
                                                pine_canopy: {
                                                    description: "Configuration de la canopée de pin.",
                                                    type: "object",
                                                    required: ["canopy_height", "base_radius", "leaf_block"],
                                                    properties: {
                                                        canopy_height: {
                                                            description: "Nombre de couches pour la canopée de pin.",
                                                            type: "integer"
                                                        },
                                                        base_radius: {
                                                            description: "Le rayon de la base de la canopée de pin.",
                                                            type: "integer",
                                                            minimum: 1
                                                        },
                                                        leaf_block: {
                                                            description: "Le bloc qui forme la canopée de pin.",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        }
                                                    }
                                                },
                                                roofed_canopy: {
                                                    description: "Configuration de la canopée de forêt sombre.",
                                                    type: "object",
                                                    required: ["canopy_height", "core_width", "outer_radius", "inner_radius", "leaf_block"],
                                                    properties: {
                                                        canopy_height: {
                                                            description: "Nombre de couches pour la canopée de forêt sombre.",
                                                            type: "integer",
                                                            minimum: 3
                                                        },
                                                        core_width: {
                                                            description: "La largeur du tronc de la canopée de forêt sombre.",
                                                            type: "integer",
                                                            minimum: 1
                                                        },
                                                        outer_radius: {
                                                            description: "Le rayon de la base et de la couche supérieure de la canopée de forêt sombre.",
                                                            type: "integer",
                                                            minimum: 0
                                                        },
                                                        inner_radius: {
                                                            description: "Le rayon des couches intermédiaires de la canopée de forêt sombre.",
                                                            type: "integer",
                                                            minimum: 0
                                                        },
                                                        leaf_block: {
                                                            description: "Le bloc qui forme la canopée de forêt sombre.",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        }
                                                    }
                                                },
                                                spruce_canopy: {
                                                    description: "Configuration de la canopée d'épicéa.",
                                                    type: "object",
                                                    required: ["lower_offset", "upper_offset", "max_radius", "leaf_block"],
                                                    properties: {
                                                        lower_offset: {
                                                            description: "Décalage de la position minimale de la canopée par rapport au tronc.",
                                                            type: "integer"
                                                        },
                                                        upper_offset: {
                                                            description: "Décalage de la position maximale de la canopée par rapport au tronc.",
                                                            type: "integer"
                                                        },
                                                        max_radius: {
                                                            description: "Rayon maximal de la canopée d'épicéa.",
                                                            type: "integer",
                                                            minimum: 0
                                                        },
                                                        leaf_block: {
                                                            description: "Le bloc qui forme la canopée d'épicéa.",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        trunk: {
                            description: "Définit les propriétés du tronc.",
                            type: "object",
                            required: ["trunk_height", "trunk_block"],
                            properties: {
                                trunk_height: {
                                    description: "La hauteur du tronc.",
                                    type: "integer"
                                },
                                height_modifier: {
                                    description: "Modificateur de hauteur pour le tronc.",
                                    type: "number"
                                },
                                can_be_submerged: {
                                    description: "Spécifie si le tronc peut être submergé.",
                                    oneOf: [
                                        {
                                            type: "object",
                                            required: ["max_depth"],
                                            properties: {
                                                max_depth: {
                                                    description: "Profondeur maximale à laquelle le tronc peut être submergé.",
                                                    type: "integer",
                                                    minimum: 1
                                                }
                                            }
                                        },
                                        {
                                            type: "boolean"
                                        }
                                    ]
                                },
                                trunk_block: {
                                    description: "Le bloc qui forme le tronc.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                trunk_decoration: {
                                    description: "Configuration de la décoration du tronc.",
                                    type: "object",
                                    required: ["decoration_chance"],
                                    properties: {
                                        decoration_chance: {
                                            description: "Probabilité de décorer le tronc.",
                                            type: "object",
                                            required: ["numerator", "denominator"],
                                            properties: {
                                                numerator: {
                                                    description: "Le numérateur de la probabilité.",
                                                    type: "integer"
                                                },
                                                denominator: {
                                                    description: "Le dénominateur de la probabilité.",
                                                    type: "integer"
                                                }
                                            }
                                        },
                                        decoration_block: {
                                            description: "Le bloc à utilisé pour la décoration du tronc.",
                                            oneOf: [
                                                {
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                },
                                                commonSchemas.block_descriptor
                                            ]
                                        },
                                        num_steps: {
                                            description: "Nombre de blocs de décoration à placer.",
                                            type: "integer"
                                        },
                                        step_direction: {
                                            description: "Direction pour étaler les blocs de décoration.",
                                            type: "string",
                                            enum: ["down", "up", "out", "away"]
                                        }
                                    }
                                }
                            }
                        },
                        acacia_canopy: {
                            description: "Configuration de la canopée.",
                            type: "object",
                            required: ["canopy_size", "leaf_block"],
                            properties: {
                                canopy_size: {
                                    description: "La taille de la canopée.",
                                    type: "integer",
                                    minimum: 1
                                },
                                leaf_block: {
                                    description: "Le bloc qui forme la canopée.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                simplify_canopy: {
                                    description: "Si 'true', la canopée utilise un motif simple.",
                                    type: "boolean"
                                }
                            }
                        },
                        canopy: {
                            description: "Configuration de la canopée.",
                            type: "object",
                            required: ["canopy_offset"],
                            properties: {
                                canopy_offset: {
                                    description: "Position relative de la canopée par rapport au tronc.",
                                    type: "object",
                                    required: ["min", "max"],
                                    properties: {
                                        min: {
                                            description: "Position minimale de la canopée par rapport au tronc.",
                                            type: "integer"
                                        },
                                        max: {
                                            description: "Position maximale de la canopée par rapport au tronc.",
                                            type: "integer"
                                        }
                                    }
                                },
                                min_width: {
                                    description: "Largeur minimale pour la canopée.",
                                    type: "integer",
                                    minimum: 0
                                },
                                canopy_slope: {
                                    description: "Configuration de la pente de la canopée.",
                                    type: "object",
                                    properties: {
                                        rise: {
                                            description: "Le numérateur de la pente.",
                                            type: "integer",
                                            minimum: 1
                                        },
                                        run: {
                                            description: "Le dénominateur de la pente.",
                                            type: "integer",
                                            minimum: 1
                                        }
                                    }
                                },
                                variation_chance: {
                                    description: "Détermine la chance de créer des blocs de feuilles pour chaque couche de la canopée. Les nombres plus grands créent un arbre plus dense.",
                                    oneOf: [
                                        {
                                            type: "object",
                                            required: ["numerator", "denominator"],
                                            properties: {
                                                numerator: {
                                                    description: "Le numérateur de la probabilité.",
                                                    type: "integer"
                                                },
                                                denominator: {
                                                    description: "Le dénominateur de la probabilité.`",
                                                    type: "integer"
                                                }
                                            }
                                        },
                                        {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                required: ["numerator", "denominator"],
                                                properties: {
                                                    numerator: {
                                                        description: "Le numérateur de la probabilité.",
                                                        type: "integer"
                                                    },
                                                    denominator: {
                                                        description: "Le dénominateur de la probabilité.",
                                                        type: "integer"
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                },
                                leaf_block: {
                                    description: "Le bloc qui forme la canopée.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                canopy_decoration: {
                                    description: "Configuration de la décoration de la canopée.",
                                    type: "object",
                                    required: ["decoration_chance"],
                                    properties: {
                                        decoration_chance: {
                                            description: "Probabilité de décorer la canopée.",
                                            type: "object",
                                            required: ["numerator", "denominator"],
                                            properties: {
                                                numerator: {
                                                    description: "Le numérateur de la probabilité.",
                                                    type: "integer"
                                                },
                                                denominator: {
                                                    description: "Le dénominateur de la probabilité.",
                                                    type: "integer"
                                                }
                                            }
                                        },
                                        decoration_block: {
                                            description: "Le bloc à utilisé pour la décoration de la canopée.",
                                            oneOf: [
                                                {
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                },
                                                commonSchemas.block_descriptor
                                            ]
                                        },
                                        num_steps: {
                                            description: "Nombre de blocs de décoration à placer.",
                                            type: "integer"
                                        },
                                        step_direction: {
                                            description: "Direction pour étaler les blocs de décoration.",
                                            type: "string",
                                            enum: ["down", "up", "out", "away"]
                                        }
                                    }
                                }
                            }
                        },
                        cherry_canopy: {
                            description: "Configuration de la canopée de cerisier.",
                            type: "object",
                            required: ["leaf_block", "height", "radius", "wide_bottom_layer_hole_chance", "corner_hole_chance", "hanging_leaves_chance", "hanging_leaves_extension_chance"],
                            properties: {
                                leaf_block: {
                                    description: "Le bloc qui forme la canopée de cerisier.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                height: {
                                    description: "Nombre de couches pour la canopée.",
                                    type: "integer"
                                },
                                radius: {
                                    description: "Le rayon de la canopée de cerisier.",
                                    type: "integer"
                                },
                                trunk_width: {
                                    description: "La largeur du tronc de cerisier.",
                                    type: "integer",
                                    minimum: 1
                                },
                                wide_bottom_layer_hole_chance: {
                                    description: "Probabilité que la canopée ait un trou dans la couche inférieure.",
                                    type: "object",
                                    required: ["numerator", "denominator"],
                                    properties: {
                                        numerator: {
                                            description: "Le numérateur de la probabilité.",
                                            type: "integer"
                                        },
                                        denominator: {
                                            description: "Le dénominateur de la probabilité.",
                                            type: "integer"
                                        }
                                    }
                                },
                                corner_hole_chance: {
                                    description: "Probabilité que la canopée ait un trou dans le coin.",
                                    type: "object",
                                    required: ["numerator", "denominator"],
                                    properties: {
                                        numerator: {
                                            description: "Le numérateur de la probabilité.",
                                            type: "integer"
                                        },
                                        denominator: {
                                            description: "Le dénominateur de la probabilité.",
                                            type: "integer"
                                        }
                                    }
                                },
                                hanging_leaves_chance: {
                                    description: "Probabilité que la canopée ait des feuilles suspendues.",
                                    type: "object",
                                    required: ["numerator", "denominator"],
                                    properties: {
                                        numerator: {
                                            description: "Le numérateur de la probabilité.",
                                            type: "integer"
                                        },
                                        denominator: {
                                            description: "Le dénominateur de la probabilité.",
                                            type: "integer"
                                        }
                                    }
                                },
                                hanging_leaves_extension_chance: {
                                    description: "Probabilité que les feuilles suspendues s'étendent plus bas.",
                                    type: "object",
                                    required: ["numerator", "denominator"],
                                    properties: {
                                        numerator: {
                                            description: "Le numérateur de la probabilité.",
                                            type: "integer"
                                        },
                                        denominator: {
                                            description: "Le dénominateur de la probabilité.",
                                            type: "integer"
                                        }
                                    }
                                }
                            }
                        },
                        fancy_canopy: {
                            description: "Configuration de la canopée fantaisie.",
                            type: "object",
                            required: ["height", "radius", "leaf_block"],
                            properties: {
                                height: {
                                    description: "Nombre de couches pour la canopée.",
                                    type: "integer",
                                    minimum: 1
                                },
                                radius: {
                                    description: "Le rayon de la canopée fantaisie.",
                                    type: "integer",
                                    minimum: 0
                                },
                                leaf_block: {
                                    description: "Le bloc qui forme la canopée fantaisie.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                }
                            }
                        },
                        mangrove_canopy: {
                            description: "Configuration de la canopée de mangrove.",
                            type: "object",
                            required: ["canopy_height", "canopy_radius", "leaf_placement_attempts", "hanging_block", "hanging_block_placement_chance"],
                            properties: {
                                canopy_height: {
                                    description: "Nombre de couches pour la canopée.",
                                    type: "integer"
                                },
                                canopy_radius: {
                                    description: "Le rayon de la canopée de mangrove.",
                                    type: "integer"
                                },
                                leaf_placement_attempts: {
                                    description: "Nombre maximum de tentatives pour placer les feuilles.",
                                    type: "integer",
                                    minimum: 1
                                },
                                leaf_blocks: {
                                    description: "Les blocs avec un poids de chance pour la canopée de mangrove.",
                                    type: "array",
                                    items: {
                                        type: "array",
                                        minItems: 2,
                                        maxItems: 2,
                                        items: [
                                            {
                                                oneOf: [
                                                    {
                                                        type: "string",
                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                    },
                                                    commonSchemas.block_descriptor
                                                ]
                                            },
                                            {
                                                type: "number"
                                            }
                                        ]
                                    }
                                },
                                canopy_decoration: {
                                    description: "Configuration de la décoration de la canopée de mangrove.",
                                    type: "object",
                                    required: ["decoration_chance"],
                                    properties: {
                                        decoration_chance: {
                                            description: "Probabilité de décorer le tronc.",
                                            type: "object",
                                            required: ["numerator", "denominator"],
                                            properties: {
                                                numerator: {
                                                    description: "Le numérateur de la probabilité.",
                                                    type: "integer"
                                                },
                                                denominator: {
                                                    description: "Le dénominateur de la probabilité.",
                                                    type: "integer"
                                                }
                                            }
                                        },
                                        decoration_block: {
                                            description: "Le bloc à utilisé pour la décoration de la canopée de mangrove.",
                                            oneOf: [
                                                {
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                },
                                                commonSchemas.block_descriptor
                                            ]
                                        },
                                        num_steps: {
                                            description: "Nombre de blocs de décoration à placer.",
                                            type: "integer"
                                        },
                                        step_direction: {
                                            description: "Direction pour étaler les blocs de décoration.",
                                            type: "string",
                                            enum: ["down", "up", "out", "away"]
                                        }
                                    }
                                },
                                hanging_block: {
                                    description: "Le bloc à utiliser comme bloc suspendu.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                hanging_block_placement_chance: {
                                    description: "Probabilité de placer un bloc suspendu.",
                                    type: "object",
                                    required: ["numerator", "denominator"],
                                    properties: {
                                        numerator: {
                                            description: "Le numérateur de la probabilité.",
                                            type: "integer"
                                        },
                                        denominator: {
                                            description: "Le dénominateur de la probabilité.",
                                            type: "integer"
                                        }
                                    }
                                }
                            }
                        },
                        mega_canopy: {
                            description: "Configuration de la canopée géante.",
                            type: "object",
                            required: ["canopy_height", "base_radius", "leaf_block"],
                            properties: {
                                canopy_height: {
                                    description: "Nombre de couches pour la canopée géante.",
                                    type: "integer"
                                },
                                base_radius: {
                                    description: "Le rayon de la base de la canopée géante.",
                                    type: "integer",
                                    minimum: 0
                                },
                                core_width: {
                                    description: "La largeur du tronc de la canopée géante.",
                                    type: "integer",
                                    minimum: 1
                                },
                                simplify_canopy: {
                                    description: "Si 'true', la canopée utilise un motif simple.",
                                    type: "boolean"
                                },
                                leaf_block: {
                                    "description": "Le bloc qui forme la canopée géante.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                }
                            }
                        },
                        mega_pine_canopy: {
                            description: "Configuration de la canopée de pin géant.",
                            type: "object",
                            required: ["canopy_height", "base_radius", "radius_step_modifier", "leaf_block"],
                            properties: {
                                canopy_height: {
                                    description: "Nombre de couches pour la canopée de pin géant.",
                                    type: "integer"
                                },
                                base_radius: {
                                    description: "Le rayon de la base de la canopée de pin géant.",
                                    type: "integer",
                                    minimum: 0
                                },
                                radius_step_modifier: {
                                    description: "Modificateur pour le rayon de la base de la canopée de pin géant.",
                                    type: "number",
                                    minimum: 0
                                },
                                core_width: {
                                    description: "La largeur du tronc de la canopée de pin géant.",
                                    type: "integer",
                                    minimum: 1
                                },
                                leaf_block: {
                                    description: "Le bloc qui forme la canopée de pin géant.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                }
                            }
                        },
                        pine_canopy: {
                            description: "Configuration de la canopée de pin.",
                            type: "object",
                            required: ["canopy_height", "base_radius", "leaf_block"],
                            properties: {
                                canopy_height: {
                                    description: "Nombre de couches pour la canopée de pin.",
                                    type: "integer"
                                },
                                base_radius: {
                                    description: "Le rayon de la base de la canopée de pin.",
                                    type: "integer",
                                    minimum: 1
                                },
                                leaf_block: {
                                    description: "Le bloc qui forme la canopée de pin.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                }
                            }
                        },
                        roofed_canopy: {
                            description: "Configuration de la canopée de forêt sombre.",
                            type: "object",
                            required: ["canopy_height", "core_width", "outer_radius", "inner_radius", "leaf_block"],
                            properties: {
                                canopy_height: {
                                    description: "Nombre de couches pour la canopée de forêt sombre.",
                                    type: "integer",
                                    minimum: 3
                                },
                                core_width: {
                                    description: "La largeur du tronc de la canopée de forêt sombre.",
                                    type: "integer",
                                    minimum: 1
                                },
                                outer_radius: {
                                    description: "Le rayon de la base et de la couche supérieure de la canopée de forêt sombre.",
                                    type: "integer",
                                    minimum: 0
                                },
                                inner_radius: {
                                    description: "Le rayon des couches intermédiaires de la canopée de forêt sombre.",
                                    type: "integer",
                                    minimum: 0
                                },
                                leaf_block: {
                                    description: "Le bloc qui forme la canopée de forêt sombre.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                }
                            }
                        },
                        spruce_canopy: {
                            description: "Configuration de la canopée d'épicéa.",
                            type: "object",
                            required: ["lower_offset", "upper_offset", "max_radius", "leaf_block"],
                            properties: {
                                lower_offset: {
                                    description: "Décalage de la position minimale de la canopée par rapport au tronc.",
                                    type: "integer"
                                },
                                upper_offset: {
                                    description: "Décalage de la position maximale de la canopée par rapport au tronc.",
                                    type: "integer"
                                },
                                max_radius: {
                                    description: "Rayon maximal de la canopée d'épicéa.",
                                    type: "integer",
                                    minimum: 0
                                },
                                leaf_block: {
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                }
                            }
                        },
                        random_spread_canopy: {
                            description: "Configuration de la canopée à propagation aléatoire.",
                            type: "object",
                            required: ["canopy_height", "canopy_radius", "leaf_placement_attempts", "leaf_blocks"],
                            properties: {
                                canopy_height: {
                                    description: "Nombre de couches pour la canopée.",
                                    type: "integer"
                                },
                                canopy_radius: {
                                    description: "Le rayon de la canopée à propagation aléatoire.",
                                    type: "integer"
                                },
                                leaf_placement_attempts: {
                                    description: "Nombre maximum de tentatives pour placer les feuilles.",
                                    type: "integer",
                                    minimum: 1
                                },
                                leaf_blocks: {
                                    description: "Les blocs avec un poids de chance pour la canopée à propagation aléatoire.",
                                    type: "array",
                                    items: {
                                        type: "array",
                                        minItems: 2,
                                        maxItems: 2,
                                        items: [
                                            {
                                                oneOf: [
                                                    {
                                                        type: "string",
                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                    },
                                                    commonSchemas.block_descriptor
                                                ]
                                            },
                                            {
                                                type: "number"
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        mangrove_roots: {
                            description: "Configuration des racines de mangrove.",
                            type: "object",
                            required: ["max_root_width", "max_root_length", "root_block", "muddy_root_block", "mud_block", "y_offset", "roots_may_grow_through"],
                            properties: {
                                max_root_width: {
                                    description: "Largeur maximale que les racines peuvent occuper. La largeur augmente jusqu'à la largeur maximale en descendant. Lorsqu'une largeur maximale est atteinte, les racines poussent verticalement.",
                                    type: "integer",
                                    minimum: 1
                                },
                                max_root_length: {
                                    description: "Longueur maximale que les racines peuvent occuper.",
                                    type: "integer",
                                    minimum: 1
                                },
                                root_block: {
                                    description: "Le bloc qui forme les racines de mangrove.`",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                above_root: {
                                    description: "Configuration des blocs décorant le dessus des racines.",
                                    type: "object",
                                    properties: {
                                        above_root_chance: {
                                            description: "Probabilité de placer un bloc au-dessus des racines.",
                                            type: "object",
                                            required: ["numerator", "denominator"],
                                            properties: {
                                                numerator: {
                                                    description: "Le numérateur de la probabilité. \nType: `Integer`",
                                                    type: "integer"
                                                },
                                                denominator: {
                                                    description: "Le dénominateur de la probabilité. \nType: `Integer`",
                                                    type: "integer"
                                                }
                                            }
                                        },
                                        above_root_block: {
                                            description: "Le bloc à utilisé pour la décoration du dessus des racines. \nType: `BlockDescriptor`",
                                            oneOf: [
                                                {
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                },
                                                commonSchemas.block_descriptor
                                            ]
                                        }
                                    }
                                },
                                muddy_root_block: {
                                    description: "Le bloc utilisé pour les racines boueuses.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                mud_block: {
                                    description: "Le bloc utilisé pour la boue.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                y_offset: {
                                    description: "Décalage de la racine par rapport au tronc.",
                                    type: "integer"
                                },
                                roots_may_grow_through: {
                                    description: "Liste des blocs à travers lesquels une racine peut pousser.",
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
                                },
                                root_decoration: {
                                    description: "Configuration de la décoration des racines.",
                                    type: "object",
                                    required: ["decoration_chance"],
                                    properties: {
                                        decoration_chance: {
                                            description: "Probabilité de décorer les racines.",
                                            type: "object",
                                            required: ["numerator", "denominator"],
                                            properties: {
                                                numerator: {
                                                    description: "Le numérateur de la probabilité.",
                                                    type: "integer"
                                                },
                                                denominator: {
                                                    description: "Le dénominateur de la probabilité.",
                                                    type: "integer"
                                                }
                                            }
                                        },
                                        decoration_block: {
                                            description: "Le bloc à utilisé pour la décoration des racines.",
                                            oneOf: [
                                                {
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                },
                                                commonSchemas.block_descriptor
                                            ]
                                        },
                                        num_steps: {
                                            description: "Nombre de blocs de décoration à placer.",
                                            type: "integer"
                                        },
                                        step_direction: {
                                            description: "Direction pour étaler les blocs de décoration.",
                                            type: "string",
                                            enum: ["down", "up", "out", "away"]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        {
            required: ["minecraft:underwater_cave_carver_feature"],
            properties: {
                "minecraft:underwater_cave_carver_feature": {
                    description: "Définition d'une Feature qui creuse une grotte sous-marine à travers le monde dans le chunk actuel, et dans chaque chunk autour du chunk actuel dans un motif radial de 8.",
                    type: "object",
                    required: ["description"],
                    properties: {
                        description: {
                            description: "Contient l'identifiant de la Feature.",
                            type: "object",
                            required: ["identifier"],
                            properties: {
                                identifier: {
                                    description: "L'identifiant de la Feature. Doit être de la forme 'namespace:feature_id' où feature_id doit correspondre au nom du fichier.",
                                    type: "string",
                                    pattern: schemaPatterns.identifier_with_namespace,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_feature_ids
                                }
                            }
                        },
                        fill_with: {
                            description: "Le bloc à utiliser pour remplir la grotte.",
                            oneOf: [
                                {
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                },
                                commonSchemas.block_descriptor
                            ]
                        },
                        width_modifier: {
                            description: "De combien de blocs augmenter la largeur de la grotte à partir du point central de la grotte.",
                            type: "molang"
                        },
                        skip_carve_chance: {
                            description: "La chance de ne pas creuser la grotte (1 / valeur).",
                            type: "integer",
                            minimum: 1
                        },
                        height_limit: {
                            description: "La limite de hauteur où nous tentons de creuser.",
                            type: "integer"
                        },
                        y_scale: {
                            description: "L'échelle en y.",
                            type: "number"
                        },
                        horizontal_radius_multiplier: {
                            description: "Le multiplicateur de rayon horizontal.",
                            type: "number"
                        },
                        vertical_radius_multiplier: {
                            description: "Le multiplicateur de rayon vertical.",
                            type: "number"
                        },
                        floor_level: {
                            description: "Le niveau du sol.",
                            type: "number"
                        },
                        replace_air_with: {
                            description: "Le bloc à utiliser pour remplacer l'air.",
                            oneOf: [
                                {
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                },
                                commonSchemas.block_descriptor
                            ]
                        }
                    }
                }
            }
        },
        {
            required: ["minecraft:vegetation_patch_feature"],
            properties: {
                "minecraft:vegetation_patch_feature": {
                    description: "Définition d'une Feature qui disperse de la végétation dans une zone. L'apparence de la végétation peut être modifiée en ajustant le rayon et la profondeur qu'elle générera.",
                    type: "object",
                    required: ["description", "replaceable_blocks", "ground_block", "vegetation_feature", "depth", "vertical_range", "horizontal_radius"],
                    properties: {
                        description: {
                            description: "Contient l'identifiant de la Feature.",
                            type: "object",
                            required: ["identifier"],
                            properties: {
                                identifier: {
                                    description: "L'identifiant de la Feature. Doit être de la forme 'namespace:feature_id' où feature_id doit correspondre au nom du fichier.",
                                    type: "string",
                                    pattern: schemaPatterns.identifier_with_namespace,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_feature_ids
                                }
                            }
                        },
                        replaceable_blocks: {
                            description: "Les blocs qui peuvent être remplacés par les blocs de sol sur le patch.",
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
                        },
                        ground_block: {
                            description: "Le bloc utilisé pour créer une base pour le patch de végétation.",
                            oneOf: [
                                {
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                },
                                commonSchemas.block_descriptor
                            ]
                        },
                        vegetation_feature: {
                            description: "La Feature qui sera placée par le patch.",
                            type: "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.feature_ids
                        },
                        surface: {
                            description: "Détermine si un patch de végétation poussera du plafond ou du sol.",
                            type: "string"
                        },
                        depth: {
                            description: "Profondeur de la base couverte par les blocs de sol.",
                            type: "integer"
                        },
                        extra_deep_block_chance: {
                            description: "Probabilité de placer les blocs de sol un bloc plus profond. Ajoute un peu de hasard au bas du patch.",
                            type: "number"
                        },
                        vertical_range: {
                            description: "Plage verticale utilisée pour déterminer une position de surface appropriée pour le patch.",
                            type: "integer"
                        },
                        vegetation_chance: {
                            description: "Détermine la chance de créer de la végétation pour chaque bloc de sol. Les nombres plus grands créent un patch de végétation plus dense.",
                            type: "number"
                        },
                        horizontal_radius: {
                            description: "La zone horizontale que le patch de végétation couvrira.",
                            type: "integer"
                        },
                        extra_edge_column_chance: {
                            description: "Probabilité de placer de la végétation sur le bord du rayon du patch.",
                            type: "number",
                            minimum: 0
                        },
                        waterlogged: {
                            description: "Détermine si les blocs de sol sont waterlogués.",
                            type: "boolean"
                        }
                    }
                }
            }
        },
        {
            required: ["minecraft:weighted_random_feature"],
            properties: {
                "minecraft:weighted_random_feature": {
                    description: "Définition d'une Feature qui sélectionne et place aléatoirement une Feature basée sur une valeur de poids. Les poids sont relatifs, avec des valeurs plus élevées rendant la sélection plus probable.",
                    type: "object",
                    required: ["description", "features"],
                    properties: {
                        description: {
                            description: "Contient l'identifiant de la Feature.",
                            type: "object",
                            required: ["identifier"],
                            properties: {
                                identifier: {
                                    description: "L'identifiant de la Feature. Doit être de la forme 'namespace:feature_id' où feature_id doit correspondre au nom du fichier.",
                                    type: "string",
                                    pattern: schemaPatterns.identifier_with_namespace,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_feature_ids
                                }
                            }
                        },
                        features: {
                            description: "Les Features à sélectionner et placer.",
                            type: "array",
                            items: {
                                type: "array",
                                minItems: 2,
                                maxItems: 2,
                                items: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.feature_ids
                                    },
                                    {
                                        type: "number"
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        }
    ]
};

const versionedChanges: SchemaChange[] = [
    {
        version: "1.21.10",
        changes: [
            {
                action: "modify",
                target: ["oneOf", "10"],
                value: {
                    required: ["minecraft:scatter_feature"],
                    properties: {
                        "minecraft:scatter_feature": {
                            description: "Définition d'une Feature qui réparit une Feature à travers un chunk.",
                            type: "object",
                            required: ["description", "places_feature", "distribution"],
                            properties: {
                                description: {
                                    description: "Contient l'identifiant de la Feature.",
                                    type: "object",
                                    required: ["identifier"],
                                    properties: {
                                        identifier: {
                                            description: "L'identifiant de la Feature. Doit être de la forme 'namespace:feature_id' où feature_id doit correspondre au nom du fichier.",
                                            type: "string",
                                            pattern: schemaPatterns.identifier_with_namespace,
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_feature_ids
                                        }
                                    }
                                },
                                places_feature: {
                                    description: "La Feature à placer.`",
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.feature_ids
                                },
                                project_input_to_floor: {
                                    description: "Si vrai, projette l'entrée de la Feature sur le sol avant de placer la Feature. Si faux ou non défini, l'entrée de la Feature est utilisée telle quelle.",
                                    type: "boolean"
                                },
                                distribution: {
                                    description: "Les paramètres qui contrôlent la dispersion initiale de la feature, définissant comment et où elle est répartie dans le monde.",
                                    type: "object",
                                    required: ["iterations", "z", "x", "y"],
                                    properties: {
                                        iterations: {
                                            description: "Nombre d'itérations pour générer des positions dispersées.",
                                            type: "molang"
                                        },
                                        scatter_chance: {
                                            description: "Probabilité que cette dispersion se produise. Non évalué à chaque itération; soit aucune itération ne sera exécutée, soit toutes le seront.",
                                            oneOf: [
                                                {
                                                    type: "molang"
                                                },
                                                {
                                                    type: "object",
                                                    required: ["numerator", "denominator"],
                                                    properties: {
                                                        numerator: {
                                                            description: "Le numérateur de la probabilité.",
                                                            type: "integer",
                                                            minimum: 1
                                                        },
                                                        denominator: {
                                                            description: "Le dénominateur de la probabilité.",
                                                            type: "integer",
                                                            minimum: 1
                                                        }
                                                    }
                                                }
                                            ]
                                        },
                                        coordinate_eval_order: {
                                            description: "L'ordre dans lequel les coordonnées seront évaluées. Doit être utilisé lorsqu'une coordonnée dépend d'une autre. Si omis, les valeurs par défaut à 'xzy'.",
                                            default: "xzy",
                                            type: "string",
                                            enum: ["xzy", "xyz", "yxz", "yzx", "zxy", "zyx"]
                                        },
                                        x: {
                                            description: "Distribution pour la coordonnée (évaluée à chaque itération).",
                                            oneOf: [
                                                {
                                                    type: "molang"
                                                },
                                                {
                                                    type: "object",
                                                    required: ["distribution", "extent"],
                                                    properties: {
                                                        distribution: {
                                                            description: "Type de distribution à utiliser.",
                                                            type: "string",
                                                            enum: ["uniform", "gaussian", "inverse_gaussian", "triangle", "fixed_grid", "jittered_grid"]
                                                        },
                                                        extent: {
                                                            description: "Les bornes inférieure et supérieure (incluses) définissent la plage de dispersion, en tant que décalage par rapport au point d'entrée autour duquel la feature est dispersée.",
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "molang"
                                                            }
                                                        },
                                                        step_size: {
                                                            description: "Lorsque le type de distribution est 'grid', définit la distance entre les étapes le long de cet axe.",
                                                            type: "integer",
                                                            minimum: 1
                                                        },
                                                        grid_offset: {
                                                            description: "Lorsque le type de distribution est 'grid', définit le décalage le long de cet axe.",
                                                            type: "integer",
                                                            minimum: 0
                                                        }
                                                    }
                                                }
                                            ]
                                        },
                                        y: {
                                            description: "Distribution pour la coordonnée (évaluée à chaque itération).",
                                            oneOf: [
                                                {
                                                    type: "molang"
                                                },
                                                {
                                                    type: "object",
                                                    required: ["distribution", "extent"],
                                                    properties: {
                                                        distribution: {
                                                            description: "Type de distribution à utiliser.",
                                                            type: "string",
                                                            enum: ["uniform", "gaussian", "inverse_gaussian", "triangle", "fixed_grid", "jittered_grid"]
                                                        },
                                                        extent: {
                                                            description: "Les bornes inférieure et supérieure (incluses) définissent la plage de dispersion, en tant que décalage par rapport au point d'entrée autour duquel la feature est dispersée.",
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "molang"
                                                            }
                                                        },
                                                        step_size: {
                                                            description: "Lorsque le type de distribution est 'grid', définit la distance entre les étapes le long de cet axe.",
                                                            type: "integer",
                                                            minimum: 1
                                                        },
                                                        grid_offset: {
                                                            description: "Lorsque le type de distribution est 'grid', définit le décalage le long de cet axe.",
                                                            type: "integer",
                                                            minimum: 0
                                                        }
                                                    }
                                                }
                                            ]
                                        },
                                        z: {
                                            description: "Distribution pour la coordonnée (évaluée à chaque itération).",
                                            oneOf: [
                                                {
                                                    type: "molang"
                                                },
                                                {
                                                    type: "object",
                                                    required: ["distribution", "extent"],
                                                    properties: {
                                                        distribution: {
                                                            description: "Type de distribution à utiliser.",
                                                            type: "string",
                                                            enum: ["uniform", "gaussian", "inverse_gaussian", "triangle", "fixed_grid", "jittered_grid"]
                                                        },
                                                        extent: {
                                                            description: "Les bornes inférieure et supérieure (incluses) définissent la plage de dispersion, en tant que décalage par rapport au point d'entrée autour duquel la feature est dispersée.",
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "molang"
                                                            }
                                                        },
                                                        step_size: {
                                                            description: "Lorsque le type de distribution est 'grid', définit la distance entre les étapes le long de cet axe.",
                                                            type: "integer",
                                                            minimum: 1
                                                        },
                                                        grid_offset: {
                                                            description: "Lorsque le type de distribution est 'grid', définit le décalage le long de cet axe.",
                                                            type: "integer",
                                                            minimum: 0
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
                }
            }
        ]
    },
    {
        version: "1.21.40",
        changes: [
            {
                action: "modify",
                target: ["oneOf", "13"],
                value: {
                    required: ["minecraft:single_block_feature"],
                    properties: {
                        "minecraft:single_block_feature": {
                            description: "Définition d'une Feature qui place un seul bloc dans le monde.",
                            type: "object",
                            required: ["description", "places_block", "enforce_placement_rules", "enforce_survivability_rules"],
                            properties: {
                                description: {
                                    description: "Contient l'identifiant de la Feature.",
                                    type: "object",
                                    required: ["identifier"],
                                    properties: {
                                        identifier: {
                                            description: "L'identifiant de la Feature. Doit être de la forme 'namespace:feature_id' où feature_id doit correspondre au nom du fichier.",
                                            type: "string",
                                            pattern: schemaPatterns.identifier_with_namespace,
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_feature_ids
                                        }
                                    }
                                },
                                places_block: {
                                    description: "Le bloc à placer.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor,
                                        {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                required: ["block", "weight"],
                                                properties: {
                                                    block: {
                                                        description: "Le bloc à placer.",
                                                        oneOf: [
                                                            {
                                                                type: "string",
                                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                            },
                                                            commonSchemas.block_descriptor
                                                        ]
                                                    },
                                                    weight: {
                                                        description: "Poids de chances du bloc.",
                                                        type: "integer"
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                },
                                enforce_placement_rules: {
                                    description: "Si vrai, applique les règles de placement du bloc.",
                                    type: "boolean"
                                },
                                enforce_survivability_rules: {
                                    description: "Si vrai, applique les règles de survie du bloc.",
                                    type: "boolean"
                                },
                                may_attach_to: {
                                    description: "Les blocs auxquels le bloc de cette Feature peut être attaché. Omettez ce champ pour autoriser n'importe quel bloc à être attaché.",
                                    type: "object",
                                    properties: {
                                        min_sides_must_attach: {
                                            description: "Le nombre minimum de côtés du bloc de cette Feature qui doivent être attachés à un bloc valide.",
                                            type: "integer",
                                            minimum: 1,
                                            maximum: 4
                                        },
                                        auto_rotate: {
                                            description: "Si vrai, faites pivoter automatiquement le bloc pour le fixer de manière sensée.",
                                            type: "boolean"
                                        },
                                        top: {
                                            description: "Le ou les blocs qui peuvent être placés au-dessus du bloc de cette Feature.",
                                            oneOf: [
                                                {
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                },
                                                commonSchemas.block_descriptor,
                                                {
                                                    type: "array",
                                                    items: {
                                                        type: "object",
                                                        required: ["block", "weight"],
                                                        properties: {
                                                            block: {
                                                                description: "Le bloc à placer.",
                                                                oneOf: [
                                                                    {
                                                                        type: "string",
                                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                    },
                                                                    commonSchemas.block_descriptor
                                                                ]
                                                            },
                                                            weight: {
                                                                description: "Poids de chances du bloc.",
                                                                type: "integer"
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        },
                                        bottom: {
                                            description: "Le ou les blocs qui peuvent être placés en dessous du bloc de cette Feature.",
                                            oneOf: [
                                                {
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                },
                                                commonSchemas.block_descriptor,
                                                {
                                                    type: "array",
                                                    items: {
                                                        type: "object",
                                                        required: ["block", "weight"],
                                                        properties: {
                                                            block: {
                                                                description: "Le bloc à placer.",
                                                                oneOf: [
                                                                    {
                                                                        type: "string",
                                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                    },
                                                                    commonSchemas.block_descriptor
                                                                ]
                                                            },
                                                            weight: {
                                                                description: "Poids de chances du bloc.",
                                                                type: "integer"
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        },
                                        north: {
                                            description: "Le ou les blocs qui peuvent être placés au nord du bloc de cette Feature.",
                                            oneOf: [
                                                {
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                },
                                                commonSchemas.block_descriptor,
                                                {
                                                    type: "array",
                                                    items: {
                                                        type: "object",
                                                        required: ["block", "weight"],
                                                        properties: {
                                                            block: {
                                                                description: "Le bloc à placer.",
                                                                oneOf: [
                                                                    {
                                                                        type: "string",
                                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                    },
                                                                    commonSchemas.block_descriptor
                                                                ]
                                                            },
                                                            weight: {
                                                                description: "Poids de chances du bloc.",
                                                                type: "integer"
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        },
                                        east: {
                                            description: "Le ou les blocs qui peuvent être placés à l'est du bloc de cette Feature.",
                                            oneOf: [
                                                {
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                },
                                                commonSchemas.block_descriptor,
                                                {
                                                    type: "array",
                                                    items: {
                                                        type: "object",
                                                        required: ["block", "weight"],
                                                        properties: {
                                                            block: {
                                                                description: "Le bloc à placer.",
                                                                oneOf: [
                                                                    {
                                                                        type: "string",
                                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                    },
                                                                    commonSchemas.block_descriptor
                                                                ]
                                                            },
                                                            weight: {
                                                                description: "Poids de chances du bloc.",
                                                                type: "integer"
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        },
                                        south: {
                                            description: "Le ou les blocs qui peuvent être placés au sud du bloc de cette Feature.",
                                            oneOf: [
                                                {
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                },
                                                commonSchemas.block_descriptor,
                                                {
                                                    type: "array",
                                                    items: {
                                                        type: "object",
                                                        required: ["block", "weight"],
                                                        properties: {
                                                            block: {
                                                                description: "Le bloc à placer.",
                                                                oneOf: [
                                                                    {
                                                                        type: "string",
                                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                    },
                                                                    commonSchemas.block_descriptor
                                                                ]
                                                            },
                                                            weight: {
                                                                description: "Poids de chances du bloc.",
                                                                type: "integer"
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        },
                                        west: {
                                            description: "Le ou les blocs qui peuvent être placés à l'ouest du bloc de cette Feature.",
                                            oneOf: [
                                                {
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                },
                                                commonSchemas.block_descriptor,
                                                {
                                                    type: "array",
                                                    items: {
                                                        type: "object",
                                                        required: ["block", "weight"],
                                                        properties: {
                                                            block: {
                                                                description: "Le bloc à placer.",
                                                                oneOf: [
                                                                    {
                                                                        type: "string",
                                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                    },
                                                                    commonSchemas.block_descriptor
                                                                ]
                                                            },
                                                            weight: {
                                                                description: "Poids de chances du bloc.",
                                                                type: "integer"
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        },
                                        all: {
                                            description: "Le ou les blocs qui peuvent être placés de tous les côtés du bloc de cette Feature.",
                                            oneOf: [
                                                {
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                },
                                                commonSchemas.block_descriptor,
                                                {
                                                    type: "array",
                                                    items: {
                                                        type: "object",
                                                        required: ["block", "weight"],
                                                        properties: {
                                                            block: {
                                                                description: "Le bloc à placer.",
                                                                oneOf: [
                                                                    {
                                                                        type: "string",
                                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                    },
                                                                    commonSchemas.block_descriptor
                                                                ]
                                                            },
                                                            weight: {
                                                                description: "Poids de chances du bloc.",
                                                                type: "integer"
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        },
                                        sides: {
                                            description: "Le ou les blocs qui peuvent être placés sur les côtés du bloc de cette Feature.",
                                            oneOf: [
                                                {
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                },
                                                commonSchemas.block_descriptor,
                                                {
                                                    type: "array",
                                                    items: {
                                                        type: "object",
                                                        required: ["block", "weight"],
                                                        properties: {
                                                            block: {
                                                                description: "Le bloc à placer.",
                                                                oneOf: [
                                                                    {
                                                                        type: "string",
                                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                    },
                                                                    commonSchemas.block_descriptor
                                                                ]
                                                            },
                                                            weight: {
                                                                description: "Poids de chances du bloc.",
                                                                type: "integer"
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        },
                                        diagonal: {
                                            description: "Le ou les blocs qui peuvent être placés en diagonale du bloc de cette Feature.",
                                            oneOf: [
                                                {
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                },
                                                commonSchemas.block_descriptor,
                                                {
                                                    type: "array",
                                                    items: {
                                                        type: "object",
                                                        required: ["block", "weight"],
                                                        properties: {
                                                            block: {
                                                                description: "Le bloc à placer.",
                                                                oneOf: [
                                                                    {
                                                                        type: "string",
                                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                    },
                                                                    commonSchemas.block_descriptor
                                                                ]
                                                            },
                                                            weight: {
                                                                description: "Poids de chances du bloc.",
                                                                type: "integer"
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                },
                                may_replace: {
                                    description: "Les blocs qui peuvent être remplacés par le bloc de cette Feature. Omettez ce champ pour autoriser n'importe quel bloc à être remplacé.",
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
                                },
                                randomize_rotation: {
                                    description: "Si vrai, faites pivoter le bloc de manière aléatoire.",
                                    type: "boolean"
                                },
                                may_not_attach_to: {
                                    description: "Les blocs qui ne peuvent pas être placés à proximité du bloc de cette Feature. Omettez ce champ pour autoriser n'importe quel bloc à être placé.",
                                    type: "object",
                                    properties: {
                                        top: {
                                            description: "Le ou les blocs qui ne peuvent pas être placés au-dessus du bloc de cette Feature.",
                                            oneOf: [
                                                {
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                },
                                                commonSchemas.block_descriptor,
                                                {
                                                    type: "array",
                                                    items: {
                                                        type: "object",
                                                        required: ["block", "weight"],
                                                        properties: {
                                                            block: {
                                                                description: "Le bloc à placer.",
                                                                oneOf: [
                                                                    {
                                                                        type: "string",
                                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                    },
                                                                    commonSchemas.block_descriptor
                                                                ]
                                                            },
                                                            weight: {
                                                                description: "Poids de chances du bloc.",
                                                                type: "integer"
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        },
                                        bottom: {
                                            description: "Le ou les blocs qui ne peuvent pas être placés en dessous du bloc de cette Feature.",
                                            oneOf: [
                                                {
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                },
                                                commonSchemas.block_descriptor,
                                                {
                                                    type: "array",
                                                    items: {
                                                        type: "object",
                                                        required: ["block", "weight"],
                                                        properties: {
                                                            block: {
                                                                description: "Le bloc à placer.",
                                                                oneOf: [
                                                                    {
                                                                        type: "string",
                                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                    },
                                                                    commonSchemas.block_descriptor
                                                                ]
                                                            },
                                                            weight: {
                                                                description: "Poids de chances du bloc.",
                                                                type: "integer"
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        },
                                        north: {
                                            description: "Le ou les blocs qui ne peuvent pas être placés au nord du bloc de cette Feature.",
                                            oneOf: [
                                                {
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                },
                                                commonSchemas.block_descriptor,
                                                {
                                                    type: "array",
                                                    items: {
                                                        type: "object",
                                                        required: ["block", "weight"],
                                                        properties: {
                                                            block: {
                                                                description: "Le bloc à placer.",
                                                                oneOf: [
                                                                    {
                                                                        type: "string",
                                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                    },
                                                                    commonSchemas.block_descriptor
                                                                ]
                                                            },
                                                            weight: {
                                                                description: "Poids de chances du bloc.",
                                                                type: "integer"
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        },
                                        east: {
                                            description: "Le ou les blocs qui ne peuvent pas être placés à l'est du bloc de cette Feature.",
                                            oneOf: [
                                                {
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                },
                                                commonSchemas.block_descriptor,
                                                {
                                                    type: "array",
                                                    items: {
                                                        type: "object",
                                                        required: ["block", "weight"],
                                                        properties: {
                                                            block: {
                                                                description: "Le bloc à placer.",
                                                                oneOf: [
                                                                    {
                                                                        type: "string",
                                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                    },
                                                                    commonSchemas.block_descriptor
                                                                ]
                                                            },
                                                            weight: {
                                                                description: "Poids de chances du bloc.",
                                                                type: "integer"
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        },
                                        south: {
                                            description: "Le ou les blocs qui ne peuvent pas être placés au sud du bloc de cette Feature.",
                                            oneOf: [
                                                {
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                },
                                                commonSchemas.block_descriptor,
                                                {
                                                    type: "array",
                                                    items: {
                                                        type: "object",
                                                        required: ["block", "weight"],
                                                        properties: {
                                                            block: {
                                                                description: "Le bloc à placer.",
                                                                oneOf: [
                                                                    {
                                                                        type: "string",
                                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                    },
                                                                    commonSchemas.block_descriptor
                                                                ]
                                                            },
                                                            weight: {
                                                                description: "Poids de chances du bloc.",
                                                                type: "integer"
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        },
                                        west: {
                                            description: "Le ou les blocs qui ne peuvent pas être placés à l'ouest du bloc de cette Feature.",
                                            oneOf: [
                                                {
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                },
                                                commonSchemas.block_descriptor,
                                                {
                                                    type: "array",
                                                    items: {
                                                        type: "object",
                                                        required: ["block", "weight"],
                                                        properties: {
                                                            block: {
                                                                description: "Le bloc à placer.",
                                                                oneOf: [
                                                                    {
                                                                        type: "string",
                                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                    },
                                                                    commonSchemas.block_descriptor
                                                                ]
                                                            },
                                                            weight: {
                                                                description: "Poids de chances du bloc.",
                                                                type: "integer"
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        },
                                        all: {
                                            description: "Le ou les blocs qui ne peuvent pas être placés de tous les côtés du bloc de cette Feature.",
                                            oneOf: [
                                                {
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                },
                                                commonSchemas.block_descriptor,
                                                {
                                                    type: "array",
                                                    items: {
                                                        type: "object",
                                                        required: ["block", "weight"],
                                                        properties: {
                                                            block: {
                                                                description: "Le bloc à placer.",
                                                                oneOf: [
                                                                    {
                                                                        type: "string",
                                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                    },
                                                                    commonSchemas.block_descriptor
                                                                ]
                                                            },
                                                            weight: {
                                                                description: "Poids de chances du bloc.",
                                                                type: "integer"
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        },
                                        sides: {
                                            description: "Le ou les blocs qui ne peuvent pas être placés sur les côtés du bloc de cette Feature.",
                                            oneOf: [
                                                {
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                },
                                                commonSchemas.block_descriptor,
                                                {
                                                    type: "array",
                                                    items: {
                                                        type: "object",
                                                        required: ["block", "weight"],
                                                        properties: {
                                                            block: {
                                                                description: "Le bloc à placer.",
                                                                oneOf: [
                                                                    {
                                                                        type: "string",
                                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                    },
                                                                    commonSchemas.block_descriptor
                                                                ]
                                                            },
                                                            weight: {
                                                                description: "Poids de chances du bloc.",
                                                                type: "integer"
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        },
                                        diagonal: {
                                            description: "Le ou les blocs qui ne peuvent pas être placés en diagonale du bloc de cette Feature.",
                                            oneOf: [
                                                {
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                },
                                                commonSchemas.block_descriptor,
                                                {
                                                    type: "array",
                                                    items: {
                                                        type: "object",
                                                        required: ["block", "weight"],
                                                        properties: {
                                                            block: {
                                                                description: "Le bloc à placer.",
                                                                oneOf: [
                                                                    {
                                                                        type: "string",
                                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                    },
                                                                    commonSchemas.block_descriptor
                                                                ]
                                                            },
                                                            weight: {
                                                                description: "Poids de chances du bloc.",
                                                                type: "integer"
                                                            }
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
                }
            }
        ]
    }
];

export const featureSchemaTypeBP: VersionedSchema = {
    fileMatch: ["**/addon/behavior_pack/features/**/*.json"],
    baseSchema: baseSchema,
    versionedChanges: versionedChanges
};