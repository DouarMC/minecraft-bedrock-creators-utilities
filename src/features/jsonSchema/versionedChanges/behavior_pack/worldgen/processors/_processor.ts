import { SchemaType } from "../../../../../../types/schema";
import { commonSchemas } from "../../../../shared/commonSchemas";
import { dynamicExamplesSourceKeys } from "../../../../shared/schemaEnums";
import { schemaPatterns } from "../../../../shared/schemaPatterns";
import { experimentalOptions, MinecraftJsonSchema } from "../../../../types/minecraftJsonSchema";

const baseSchema: MinecraftJsonSchema = {
    "x-experimental_options": [experimentalOptions.data_driven_jigsaw_structures],
    description: "Ce fichier sert à créer une liste de processeurs qui peuvent être utilisés pour modifier les structures Jigsaw lorsqu'elles sont placées dans le monde. Les processeurs sont des fonctions qui s'exécutent lors de la mise en place d'un modèle de structure dans le monde. Actuellement, le seul processeur pris en charge est le processeur de règles de bloc, qui décrit comment les blocs individuels des modèles de structure doivent être modifiés lorsqu'ils sont placés dans le monde. Par exemple, vous pouvez vouloir remplacer aléatoirement la moitié des blocs de Pierre par de la Pierre Moussue. Ou vous pouvez remplacer le Gravier par du Gravier Suspect et ajouter une table de butin.",
    type: "object",
    required: ["format_version", "minecraft:processor_list"],
    properties: {
        format_version: {
            description: "La version du Format à utiliser.",
            type: "string",
            enum: [
                "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
            ]
        },
        "minecraft:processor_list": {
            description: "Contient la définition de la liste de processeurs.",
            type: "object",
            required: ["description", "processors"],
            properties: {
                description: {
                    description: "Contient les propeiétés de description de la liste de processeurs.",
                    type: "object",
                    required: ["identifier"],
                    properties: {
                        identifier: {
                            description: "L'identifiant de la liste de processeurs. Cet identifiant peut être référencé par les Template Pools lors de l'appariement des processeurs avec les Modèles de Structure.",
                            type: "string",
                            pattern: schemaPatterns.identifier_with_namespace,
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_processor_ids
                        }
                    }
                },
                processors: {
                    description: "Une liste de processeurs qui seront exécutés lors de la mise en place des structures associées. Les règles sont exécutées dans l'ordre tel que défini dans la liste.",
                    type: "array",
                    items: {
                        oneOf: [
                            {
                                type: "object",
                                required: ["processor_type", "rules"],
                                properties: {
                                    processor_type: {
                                        type: "string",
                                        const: "minecraft:rule",
                                        enum: ["minecraft:block_ignore", "minecraft:rule", "minecraft:capped", "minecraft:protected_blocks"]
                                    },
                                    rules: {
                                        description: "Liste des règles de bloc évaluées sur tous les blocs d'un Modèle de Structure. Les règles de bloc sont évaluées dans l'ordre. Si une règle de bloc réussit et que l'état de sortie est défini, le bloc d'état de sortie sera utilisé comme bloc de prédicat d'entrée pour les règles suivantes.",
                                        type: "array",
                                        items: {
                                            type: "object",
                                            required: ["output_state"],
                                            properties: {
                                                input_predicate: {
                                                    description: "Prédicat d'entrée évalué sur le bloc de Modèle de Structure.",
                                                    oneOf: [
                                                        {
                                                            type: "object",
                                                            required: ["predicate_type"],
                                                            properties: {
                                                                predicate_type: {
                                                                    description: "Le type de prédicat à évaluer.",
                                                                    type: "string",
                                                                    const: "minecraft:always_true",
                                                                    enum: [
                                                                        "minecraft:always_true", "minecraft:block_match", "minecraft:random_block_match", "minecraft:tag_match", "minecraft:blockstate_match", "minecraft:random_blockstate_match"
                                                                    ]
                                                                }
                                                            }
                                                        },
                                                        {
                                                            type: "object",
                                                            required: ["predicate_type", "block"],
                                                            properties: {
                                                                predicate_type: {
                                                                    description: "Le type de prédicat à évaluer.",
                                                                    type: "string",
                                                                    const: "minecraft:block_match",
                                                                    enum: [
                                                                        "minecraft:always_true", "minecraft:block_match", "minecraft:random_block_match", "minecraft:tag_match", "minecraft:blockstate_match", "minecraft:random_blockstate_match"
                                                                    ]
                                                                },
                                                                block: {
                                                                    description: "Le bloc à évaluer.",
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                }
                                                            }
                                                        },
                                                        {
                                                            type: "object",
                                                            required: ["predicate_type", "block", "probability"],
                                                            properties: {
                                                                predicate_type: {
                                                                    description: "Le type de prédicat à évaluer.",
                                                                    type: "string",
                                                                    const: "minecraft:random_block_match",
                                                                    enum: [
                                                                        "minecraft:always_true", "minecraft:block_match", "minecraft:random_block_match", "minecraft:tag_match", "minecraft:blockstate_match", "minecraft:random_blockstate_match"
                                                                    ]
                                                                },
                                                                block: {
                                                                    description: "Le bloc à évaluer.",
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                probability: {
                                                                    description: "Probabilité d'évaluation à vrai lorsque le bloc correspond.",
                                                                    type: "number",
                                                                    minimum: 0.0,
                                                                    maximum: 1.0
                                                                }
                                                            }
                                                        },
                                                        {
                                                            type: "object",
                                                            required: ["predicate_type", "tag"],
                                                            properties: {
                                                                predicate_type: {
                                                                    description: "Le type de prédicat à évaluer.",
                                                                    type: "string",
                                                                    const: "minecraft:tag_match",
                                                                    enum: [
                                                                        "minecraft:always_true", "minecraft:block_match", "minecraft:random_block_match", "minecraft:tag_match", "minecraft:blockstate_match", "minecraft:random_blockstate_match"
                                                                    ]
                                                                },
                                                                tag: {
                                                                    description: "Le tag à évaluer.",
                                                                    type: "string"
                                                                }
                                                            }
                                                        },
                                                        {
                                                            type: "object",
                                                            required: ["predicate_type", "block_state"],
                                                            properties: {
                                                                predicate_type: {
                                                                    description: "Le type de prédicat à évaluer.",
                                                                    type: "string",
                                                                    const: "minecraft:blockstate_match",
                                                                    enum: [
                                                                        "minecraft:always_true", "minecraft:block_match", "minecraft:random_block_match", "minecraft:tag_match", "minecraft:blockstate_match", "minecraft:random_blockstate_match"
                                                                    ]
                                                                },
                                                                block_state: {
                                                                    description: "L'état de bloc à évaluer.",
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
                                                        {
                                                            type: "object",
                                                            required: ["predicate_type", "block_state", "probability"],
                                                            properties: {
                                                                predicate_type: {
                                                                    description: "Le type de prédicat à évaluer.",
                                                                    type: "string",
                                                                    const: "minecraft:random_blockstate_match",
                                                                    enum: [
                                                                        "minecraft:always_true", "minecraft:block_match", "minecraft:random_block_match", "minecraft:tag_match", "minecraft:blockstate_match", "minecraft:random_blockstate_match"
                                                                    ]
                                                                },
                                                                block_state: {
                                                                    description: "L'état de bloc à évaluer.",
                                                                    oneOf: [
                                                                        {
                                                                            type: "string",
                                                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                        },
                                                                        commonSchemas.block_descriptor
                                                                    ]
                                                                },
                                                                probability: {
                                                                    description: "Probabilité d'évaluation à vrai lorsque l'état du bloc correspond.",
                                                                    type: "number",
                                                                    minimum: 0.0,
                                                                    maximum: 1.0
                                                                }
                                                            }
                                                        }
                                                    ]
                                                },
                                                block_entity_modifier: {
                                                    description: "Un modificateur d'état de bloc pour les entités de bloc lorsque tous les prédicats correspondent.",
                                                    oneOf: [
                                                        {
                                                            type: "object",
                                                            required: ["type"],
                                                            properties: {
                                                                type: {
                                                                    type: "string",
                                                                    const: "minecraft:passthrough",
                                                                    enum: ["minecraft:passthrough", "minecraft:append_loot"]
                                                                }
                                                            }
                                                        },
                                                        {
                                                            type: "object",
                                                            required: ["type", "loot_table"],
                                                            properties: {
                                                                type: {
                                                                    type: "string",
                                                                    const: "minecraft:append_loot",
                                                                    enum: ["minecraft:passthrough", "minecraft:append_loot"]
                                                                },
                                                                loot_table: {
                                                                    description: "La table de butin à ajouter.",
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.loot_table_file_paths
                                                                }
                                                            }
                                                        }
                                                    ]
                                                },
                                                location_predicate: {
                                                    description: "Prédicat de localisation évalué sur le bloc du monde.",
                                                    oneOf: [
                                                        {
                                                            type: "object",
                                                            required: ["predicate_type"],
                                                            properties: {
                                                                predicate_type: {
                                                                    description: "Le type de prédicat à évaluer.",
                                                                    type: "string",
                                                                    const: "minecraft:always_true",
                                                                    enum: [
                                                                        "minecraft:always_true", "minecraft:block_match", "minecraft:random_block_match", "minecraft:tag_match", "minecraft:blockstate_match", "minecraft:random_blockstate_match"
                                                                    ]
                                                                }
                                                            }
                                                        },
                                                        {
                                                            type: "object",
                                                            required: ["predicate_type", "block"],
                                                            properties: {
                                                                predicate_type: {
                                                                    description: "Le type de prédicat à évaluer.",
                                                                    type: "string",
                                                                    const: "minecraft:block_match",
                                                                    enum: [
                                                                        "minecraft:always_true", "minecraft:block_match", "minecraft:random_block_match", "minecraft:tag_match", "minecraft:blockstate_match", "minecraft:random_blockstate_match"
                                                                    ]
                                                                },
                                                                block: {
                                                                    description: "Le bloc à évaluer.",
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                }
                                                            }
                                                        },
                                                        {
                                                            type: "object",
                                                            required: ["predicate_type", "block", "probability"],
                                                            properties: {
                                                                predicate_type: {
                                                                    description: "Le type de prédicat à évaluer.",
                                                                    type: "string",
                                                                    const: "minecraft:random_block_match",
                                                                    enum: [
                                                                        "minecraft:always_true", "minecraft:block_match", "minecraft:random_block_match", "minecraft:tag_match", "minecraft:blockstate_match", "minecraft:random_blockstate_match"
                                                                    ]
                                                                },
                                                                block: {
                                                                    description: "Le bloc à évaluer.",
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                probability: {
                                                                    description: "Probabilité d'évaluation à vrai lorsque le bloc correspond.",
                                                                    type: "number",
                                                                    minimum: 0.0,
                                                                    maximum: 1.0
                                                                }
                                                            }
                                                        },
                                                        {
                                                            type: "object",
                                                            required: ["predicate_type", "tag"],
                                                            properties: {
                                                                predicate_type: {
                                                                    description: "Le type de prédicat à évaluer.",
                                                                    type: "string",
                                                                    const: "minecraft:tag_match",
                                                                    enum: [
                                                                        "minecraft:always_true", "minecraft:block_match", "minecraft:random_block_match", "minecraft:tag_match", "minecraft:blockstate_match", "minecraft:random_blockstate_match"
                                                                    ]
                                                                },
                                                                tag: {
                                                                    description: "Le tag à évaluer.",
                                                                    type: "string"
                                                                }
                                                            }
                                                        },
                                                        {
                                                            type: "object",
                                                            required: ["predicate_type", "block_state"],
                                                            properties: {
                                                                predicate_type: {
                                                                    description: "Le type de prédicat à évaluer.",
                                                                    type: "string",
                                                                    const: "minecraft:blockstate_match",
                                                                    enum: [
                                                                        "minecraft:always_true", "minecraft:block_match", "minecraft:random_block_match", "minecraft:tag_match", "minecraft:blockstate_match", "minecraft:random_blockstate_match"
                                                                    ]
                                                                },
                                                                block_state: {
                                                                    description: "L'état de bloc à évaluer.",
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
                                                        {
                                                            type: "object",
                                                            required: ["predicate_type", "block_state", "probability"],
                                                            properties: {
                                                                predicate_type: {
                                                                    description: "Le type de prédicat à évaluer.",
                                                                    type: "string",
                                                                    const: "minecraft:random_blockstate_match",
                                                                    enum: [
                                                                        "minecraft:always_true", "minecraft:block_match", "minecraft:random_block_match", "minecraft:tag_match", "minecraft:blockstate_match", "minecraft:random_blockstate_match"
                                                                    ]
                                                                },
                                                                block_state: {
                                                                    description: "L'état de bloc à évaluer.",
                                                                    oneOf: [
                                                                        {
                                                                            type: "string",
                                                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                        },
                                                                        commonSchemas.block_descriptor
                                                                    ]
                                                                },
                                                                probability: {
                                                                    description: "Probabilité d'évaluation à vrai lorsque l'état du bloc correspond.",
                                                                    type: "number",
                                                                    minimum: 0.0,
                                                                    maximum: 1.0
                                                                }
                                                            }
                                                        }
                                                    ]
                                                },
                                                position_predicate: {
                                                    description: "Prédicat de position évalué sur la distance entre l'origine du monde de la structure et le bloc du monde.",
                                                    oneOf: [
                                                        {
                                                            type: "object",
                                                            required: ["predicate_type"],
                                                            properties: {
                                                                predicate_type: {
                                                                    type: "string",
                                                                    const: "minecraft:always_true",
                                                                    enum: ["minecraft:always_true", "minecraft:axis_aligned_linear_pos"]
                                                                }
                                                            }
                                                        },
                                                        {
                                                            type: "object",
                                                            required: ["predicate_type"],
                                                            properties: {
                                                                predicate_type: {
                                                                    type: "string",
                                                                    const: "minecraft:axis_aligned_linear_pos",
                                                                    enum: ["minecraft:always_true", "minecraft:axis_aligned_linear_pos"]
                                                                },
                                                                axis: {
                                                                    type: "string",
                                                                    enum: ["x", "y", "z"]
                                                                },
                                                                min_chance: {
                                                                    type: "number",
                                                                    minimum: 0.0,
                                                                    exclusiveMaximum: 1.0
                                                                },
                                                                max_chance: {
                                                                    type: "number",
                                                                    minimum: 0.0,
                                                                    exclusiveMaximum: 1.0
                                                                },
                                                                max_dist: {
                                                                    type: "integer",
                                                                    minimum: 0
                                                                },
                                                                min_dist: {
                                                                    type: "integer",
                                                                    minimum: 0
                                                                }
                                                            }
                                                        }
                                                    ]
                                                },
                                                output_state: {
                                                    description: "Bloc à remplacer le bloc du monde si tous les prédicats sont vrais.",
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
                                type: "object",
                                required: ["processor_type", "value"],
                                properties: {
                                    processor_type: {
                                        type: "string",
                                        const: "minecraft:protected_blocks",
                                        enum: ["minecraft:block_ignore", "minecraft:rule", "minecraft:capped", "minecraft:protected_blocks"]
                                    },
                                    value: {
                                        description: "Le tag de blocs qui seront protégés.",
                                        type: "string"
                                    }
                                }
                            },
                            {
                                type: "object",
                                required: ["processor_type", "blocks"],
                                properties: {
                                    processor_type: {
                                        type: "string",
                                        const: "minecraft:block_ignore",
                                        enum: ["minecraft:block_ignore", "minecraft:rule", "minecraft:capped", "minecraft:protected_blocks"]
                                    },
                                    blocks: {
                                        description: "Une liste de blocs évaluées sur tous les blocs d'un Modèle de Structure. Si un bloc correspond à la liste fournie, le bloc sera ignoré pour le traitement.",
                                        type: "array",
                                        items: {
                                            type: "string"
                                        }
                                    }
                                }
                            },
                            {
                                type: "object",
                                required: ["processor_type", "delegate", "limit"],
                                properties: {
                                    processor_type: {
                                        type: "string",
                                        const: "minecraft:capped",
                                        enum: ["minecraft:block_ignore", "minecraft:rule", "minecraft:capped", "minecraft:protected_blocks"]
                                    },
                                    delegate: {
                                        description: "Le processeur qui sera exécuté.",
                                        oneOf: [
                                            {
                                                $ref: "#/properties/minecraft:processor_list/properties/processors/items/oneOf/0/properties"
                                            },
                                            {
                                                $ref: "#/properties/minecraft:processor_list/properties/processors/items/oneOf/1/properties"
                                            },
                                            {
                                                $ref: "#/properties/minecraft:processor_list/properties/processors/items/oneOf/2/properties"
                                            }
                                        ]
                                    },
                                    limit: {
                                        description: "Le nombre maximum de fois que ce délégué peut être appliqué.",
                                        oneOf: [
                                            {
                                                type: "integer"
                                            },
                                            {
                                                type: "object",
                                                required: ["type", "value"],
                                                properties: {
                                                    type: {
                                                        type: "string",
                                                        const: "constant",
                                                        enum: ["constant", "uniform"]
                                                    },
                                                    value: {
                                                        description: "Valeur constante.",
                                                        type: "integer"
                                                    }
                                                }
                                            },
                                            {
                                                type: "object",
                                                required: ["type", "min_inclusive", "max_inclusive"],
                                                properties: {
                                                    type: {
                                                        type: "string",
                                                        const: "uniform",
                                                        enum: ["constant", "uniform"]
                                                    },
                                                    min_inclusive: {
                                                        description: "Valeur minimale.",
                                                        type: "integer" 
                                                    },
                                                    max_inclusive: {
                                                        description: "Valeur maximale.",
                                                        type: "integer"
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }
    }
};

export const processorSchemaTypeBP: SchemaType = {
    fileMatch: ["**/addon/behavior_pack/worldgen/processors/*.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};