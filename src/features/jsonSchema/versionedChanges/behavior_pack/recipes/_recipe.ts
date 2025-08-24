import { SchemaChange, SchemaType } from "../../../../../types/schema";
import { schemaPatterns } from "../../../shared/schemaPatterns";
import { MinecraftJsonSchema } from "../../../types/minecraftJsonSchema";
import { dynamicExamplesSourceKeys } from "../../../shared/schemaEnums";

const baseSchema: MinecraftJsonSchema = {
    oneOf: [
        {
            description: "Ce fichier sert à créer une recette.",
            type: "object",
            required: ["format_version", "minecraft:recipe_furnace"],
            properties: {
                format_version: {
                    description: "La version du Format à utiliser.",
                    type: "string",
                    enum: [
                        "1.12.0", "1.13.0", "1.14.0", "1.14.1", "1.14.20", "1.14.30", "1.15.0", "1.16.0", "1.16.20", "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
                    ]
                },
                "minecraft:recipe_furnace": {
                    description: "Définit une recette de Cuisson.",
                    type: "object",
                    required: ["description", "tags", "input", "output"],
                    properties: {
                        description: {
                            description: "Contient les propriétés de description de la recette.",
                            type: "object",
                            required: ["identifier"],
                            properties: {
                                identifier: {
                                    description: "L'identifiant de la recette.",
                                    type: "string",
                                    pattern: schemaPatterns.identifier_with_namespace,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_recipe_ids
                                }
                            }
                        },
                        tags: {
                            description: "Les blocs qui possède un des tags définis ici peuvent utiliser cette recette.",
                            type: "array",
                            items: {
                                type: "string",
                                examples: ["furnace", "blast_furnace", "smoker", "campfire", "soul_campfire"]
                            }
                        },
                        input: {
                            description: "L'item servant d'ingrédient pour cette recette.",
                            type: "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                        },
                        output: {
                            description: "L'item produit par cette recette.",
                            oneOf: [
                                {
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                },
                                {
                                    type: "object",
                                    required: ["item"],
                                    properties: {
                                        item: {
                                            description: "L'identifiant de l'item.",
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                        },
                                        data: {
                                            description: "La donnée de l'item.",
                                            type: "integer"
                                        },
                                        count: {
                                            description: "Le nombre d'items produits.",
                                            type: "integer"
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
            description: "Ce fichier sert à créer une recette.",
            type: "object",
            required: ["format_version", "minecraft:recipe_brewing_container"],
            properties: {
                format_version: {
                    description: "La version du Format à utiliser.",
                    type: "string",
                    enum: [
                        "1.12.0", "1.13.0", "1.14.0", "1.14.1", "1.14.20", "1.14.30", "1.15.0", "1.16.0", "1.16.20", "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
                    ]
                },
                "minecraft:recipe_brewing_container": {
                    description: "Définit une recette de brewing uniquement sur les potions.",
                    type: "object",
                    required: ["description", "tags", "reagent", "input", "output"],
                    properties: {
                        description: {
                            description: "Contient les propriétés de description de la recette.",
                            type: "object",
                            required: ["identifier"],
                            properties: {
                                identifier: {
                                    description: "L'identifiant de la recette.",
                                    type: "string",
                                    pattern: schemaPatterns.identifier_with_namespace,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_recipe_ids
                                }
                            }
                        },
                        tags: {
                            description: "Les blocs qui possède un des tags définis ici peuvent utiliser cette recette.",
                            type: "array",
                            items: {
                                type: "string",
                                examples: ["brewing_stand"]
                            }
                        },
                        reagent: {
                            description: "L'item servant d'ingrédient pour cette recette.",
                            type: "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                        },
                        input: {
                            description: "L'item à mettre dans le brewing stand.",
                            type: "string",
                            enum: [
                                "minecraft:potion", "minecraft:splash_potion", "minecraft:lingering_potion"
                            ]
                        },
                        output: {
                            description: "L'item produit par cette recette.",
                            type: "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                        }
                    }
                }
            }
        },
        {
            description: "Ce fichier sert à créer une recette.",
            type: "object",
            required: ["format_version", "minecraft:recipe_brewing_mix"],
            properties: {
                format_version: {
                    description: "La version du Format à utiliser.",
                    type: "string",
                    enum: [
                        "1.12.0", "1.13.0", "1.14.0", "1.14.1", "1.14.20", "1.14.30", "1.15.0", "1.16.0", "1.16.20", "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
                    ]
                },
                "minecraft:recipe_brewing_mix": {
                    description: "Définit une recette de brewing.",
                    type: "object",
                    required: ["description", "tags", "input", "output", "reagent"],
                    properties: {
                        description: {
                            description: "Contient les propriétés de description de la recette.",
                            type: "object",
                            required: ["identifier"],
                            properties: {
                                identifier: {
                                    description: "L'identifiant de la recette.",
                                    type: "string",
                                    pattern: schemaPatterns.identifier_with_namespace,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_recipe_ids
                                }
                            }
                        },
                        tags: {
                            description: "Les blocs qui possède un des tags définis ici peuvent utiliser cette recette.",
                            type: "array",
                            items: {
                                type: "string",
                                examples: ["brewing_stand"]
                            }
                        },
                        reagent: {
                            description: "L'item servant d'ingrédient pour cette recette.",
                            type: "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                        },
                        input: {
                            description: "L'item servant d'ingrédient pour cette recette.",
                            type: "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                        },
                        output: {
                            description: "L'item produit par cette recette.",
                            type: "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                        }
                    }
                }
            }
        },
        {
            description: "Ce fichier sert à créer une recette.",
            type: "object",
            required: ["format_version", "minecraft:recipe_shaped"],
            properties: {
                format_version: {
                    description: "La version du Format à utiliser.",
                    type: "string",
                    enum: [
                        "1.12.0", "1.13.0", "1.14.0", "1.14.1", "1.14.20", "1.14.30", "1.15.0", "1.16.0", "1.16.20", "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
                    ]
                },
                "minecraft:recipe_shaped": {
                    description: "Définit une recette de craftage avec un pattern.",
                    type: "object",
                    required: ["description", "tags", "pattern", "key", "result"],
                    properties: {
                        description: {
                            description: "Contient les propriétés de description de la recette.",
                            type: "object",
                            required: ["identifier"],
                            properties: {
                                identifier: {
                                    description: "L'identifiant de la recette.",
                                    type: "string",
                                    pattern: schemaPatterns.identifier_with_namespace,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_recipe_ids
                                }
                            }
                        },
                        tags: {
                            description: "Les blocs qui possède un des tags définis ici peuvent utiliser cette recette.",
                            type: "array",
                            items: {
                                type: "string",
                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.crafting_recipe_tags
                            }
                        },
                        group: {
                            description: "On ne connait pas l'utilité de cette propriété.",
                            type: "string"
                        },
                        priority: {
                            description: "Permet de définir un ordre de préférence entre plusieurs recettes pouvant s'appliquer dans une même situation, en privilégiant celle avec la valeur de priorité la plus basse.",
                            type: "integer"
                        },
                        pattern: {
                            description: "Le pattern de cette recette de craft.",
                            type: "array",
                            maxItems: 3,
                            items: {
                                type: "string",
                                maxLength: 3
                            }
                        },
                        assume_symmetry: {
                            description: "Si vrai, la recette est symétrique.",
                            type: "boolean"
                        },
                        key: {
                            description: "Les items utilisés dans le pattern qu'on associe à une clé.",
                            type: "object",
                            propertyNames: {
                                maxLength: 1
                            },
                            additionalProperties: {
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            item: {
                                                description: "L'item associé à cette clé.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                            },
                                            data: {
                                                description: "La data de l'item.",
                                                type: "integer"
                                            },
                                            tag: {
                                                description: "Les items qui possèdent ce tag peuvent être utilisés pour cette recette.",
                                                type: "molang"
                                            }
                                        }
                                    }
                                ]
                            }
                        },
                        result: {
                            description: "L'item produit par cette recette.",
                            oneOf: [
                                {
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                },
                                {
                                    type: "object",
                                    required: ["item"],
                                    properties: {
                                        item: {
                                            description: "L'identifiant de l'item.",
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                        },
                                        data: {
                                            description: "La donnée de l'item.",
                                            type: "integer"
                                        },
                                        count: {
                                            description: "Le nombre d'items produits.",
                                            type: "integer"
                                        }
                                    }
                                },
                                {
                                    type: "array",
                                    items: {
                                        oneOf: [
                                            {
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                            },
                                            {
                                                type: "object",
                                                required: ["item"],
                                                properties: {
                                                    item: {
                                                        description: "L'identifiant de l'item.",
                                                        type: "string",
                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                                    },
                                                    data: {
                                                        description: "La donnée de l'item.",
                                                        type: "integer"
                                                    },
                                                    count: {
                                                        description: "Le nombre d'items produits.",
                                                        type: "integer"
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        {
            description: "Ce fichier sert à créer une recette.",
            type: "object",
            required: ["format_version", "minecraft:recipe_shapeless"],
            properties: {
                format_version: {
                    description: "La version du Format à utiliser.",
                    type: "string",
                    enum: [
                        "1.12.0", "1.13.0", "1.14.0", "1.14.1", "1.14.20", "1.14.30", "1.15.0", "1.16.0", "1.16.20", "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
                    ]
                },
                "minecraft:recipe_shapeless": {
                    description: "Définit une recette de craftage sans forme.",
                    type: "object",
                    required: ["description", "tags", "ingredients", "result"],
                    properties: {
                        description: {
                            description: "Contient les propriétés de description de la recette.",
                            type: "object",
                            required: ["identifier"],
                            properties: {
                                identifier: {
                                    description: "L'identifiant de la recette.",
                                    type: "string",
                                    pattern: schemaPatterns.identifier_with_namespace,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_recipe_ids
                                }
                            }
                        },
                        tags: {
                            description: "Les blocs qui possède un des tags définis ici peuvent utiliser cette recette.",
                            type: "array",
                            items: {
                                type: "string",
                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.crafting_recipe_tags
                            }
                        },
                        group: {
                            description: "On ne connait pas l'utilité de cette propriété.",
                            type: "string"
                        },
                        priority: {
                            description: "Permet de définir un ordre de préférence entre plusieurs recettes pouvant s'appliquer dans une même situation, en privilégiant celle avec la valeur de priorité la plus basse.",
                            type: "integer"
                        },
                        ingredients: {
                            description: "Les items utilisés pour cette recette.",
                            type: "array",
                            items: {
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            item: {
                                                description: "L'identifiant de l'item.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                            },
                                            tag: {
                                                description: "L'identifiant du tag des items qui peuvent être utilisés dans ce contexte.",
                                                type: "molang"
                                            },
                                            data: {
                                                description: "La donnée de l'item.",
                                                type: "integer"
                                            },
                                            count: {
                                                description: "Le nombre d'items produits.",
                                                type: "integer"
                                            }
                                        }
                                    }
                                ]
                            }
                        },
                        result: {
                            description: "L'item produit par cette recette.",
                            oneOf: [
                                {
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                },
                                {
                                    type: "object",
                                    required: ["item"],
                                    properties: {
                                        item: {
                                            description: "L'identifiant de l'item.",
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                        },
                                        data: {
                                            description: "La donnée de l'item.",
                                            type: "integer"
                                        },
                                        count: {
                                            description: "Le nombre d'items produits.",
                                            type: "integer"
                                        }
                                    }
                                },
                                {
                                    type: "array",
                                    items: {
                                        oneOf: [
                                            {
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                            },
                                            {
                                                type: "object",
                                                required: ["item"],
                                                properties: {
                                                    item: {
                                                        description: "L'identifiant de l'item.",
                                                        type: "string",
                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                                    },
                                                    data: {
                                                        description: "La donnée de l'item.",
                                                        type: "integer"
                                                    },
                                                    count: {
                                                        description: "Le nombre d'items produits.",
                                                        type: "integer"
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        {
            description: "Ce fichier sert à créer une recette.",
            type: "object",
            required: ["format_version", "minecraft:recipe_smithing_transform"],
            properties: {
                format_version: {
                    description: "La version du Format à utiliser.",
                    type: "string",
                    enum: [
                        "1.12.0", "1.13.0", "1.14.0", "1.14.1", "1.14.20", "1.14.30", "1.15.0", "1.16.0", "1.16.20", "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
                    ]
                },
                "minecraft:recipe_smithing_transform": {
                    description: "Définit une recette de transformation d'item en utilisant une table de forge.",
                    type: "object",
                    required: ["description", "tags", "template", "base", "addition", "result"],
                    properties: {
                        description: {
                            description: "Contient les propriétés de description de la recette.",
                            type: "object",
                            required: ["identifier"],
                            properties: {
                                identifier: {
                                    description: "L'identifiant de la recette.",
                                    type: "string",
                                    pattern: schemaPatterns.identifier_with_namespace,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_recipe_ids
                                }
                            }
                        },
                        tags: {
                            description: "Les blocs qui possède un des tags définis ici peuvent utiliser cette recette.",
                            type: "array",
                            items: {
                                type: "string",
                                examples: ["smithing_table"]
                            }
                        },
                        template: {
                            description: "L'item servant de modèle requis pour cette recette de transformation. L'item doit avoir le tag `minecraft:transform_templates`.",
                            type: "string"
                        },
                        base: {
                            description: "L'item à tranformer. Ces propriétés seront copiées à l'item 'result'. L'item doit être une armure ou un outil. L'item doit avoir le tag `minecraft:transformable_items`.",
                            type: "string"
                        },
                        addition: {
                            description: "Le matériau requis pour la transformation.",
                            type: "string",
                            enum: [
                                "minecraft:netherite_ingot"
                            ]
                        },
                        result: {
                            description: "L'item produit par cette recette.",
                            oneOf: [
                                {
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                },
                                {
                                    type: "object",
                                    required: ["item"],
                                    properties: {
                                        item: {
                                            description: "L'identifiant de l'item.",
                                            type: "string"
                                        },
                                        data: {
                                            description: "La donnée de l'item.",
                                            type: "integer"
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
            description: "Ce fichier sert à créer une recette.",
            type: "object",
            required: ["format_version", "minecraft:recipe_smithing_trim"],
            properties: {
                format_version: {
                    description: "La version du Format à utiliser.",
                    type: "string",
                    enum: [
                        "1.12.0", "1.13.0", "1.14.0", "1.14.1", "1.14.20", "1.14.30", "1.15.0", "1.16.0", "1.16.20", "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
                    ]
                },
                "minecraft:recipe_smithing_trim": {
                    description: "Définit une recette de personnalisation d'item en utilisant une table de forge.",
                    type: "object",
                    required: ["description", "tags", "template", "base", "addition"],
                    properties: {
                        description: {
                            description: "Contient les propriétés de description de la recette.",
                            type: "object",
                            required: ["identifier"],
                            properties: {
                                identifier: {
                                    description: "L'identifiant de la recette.",
                                    type: "string",
                                    pattern: schemaPatterns.identifier_with_namespace,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_recipe_ids
                                }
                            }
                        },
                        tags: {
                            description: "Les blocs qui possède un des tags définis ici peuvent utiliser cette recette.",
                            type: "array",
                            items: {
                                type: "string",
                                examples: ["smithing_table"]
                            }
                        },
                        template: {
                            description: "L'item modèle requis pour cette recette de personnalisation. L'item doit avoir le tag 'minecraft:trim_templates'.",
                            type: "string"
                        },
                        base: {
                            description: "L'item à personnaliser. Ces propriétés seront gardés. L'item doit être une armure. L'item doit avoir le tag 'minecraft:trimmable_armors'.",
                            type: "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                        },
                        addition: {
                            description: "Le matériau requis pour la personnalisation. L'item doit avoir le tag 'minecraft:trim_materials'.",
                            type: "string"
                        }
                    }
                }
            }
        }
    ]
};

const versionedChanges: SchemaChange[] = [
    {
        version: "1.20.10",
        changes: [
            {
                action: "modify",
                target: ["oneOf", "4", "properties", "minecraft:recipe_shaped", "required"],
                value: ["description", "tags", "pattern", "key", "result", "unlock"]
            },
            {
                action: "add",
                target: ["oneOf", "4", "properties", "minecraft:recipe_shaped", "properties", "unlock"],
                value: {
                    description: "Les conditions pour que cette recette soit considérée comme débloquée.",
                    oneOf: [
                        {
                            type: "object",
                            properties: {
                                item: {
                                    description: "L'item à posséder pour débloquer cette recette.",
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                },
                                data: {
                                    description: "La data de l'item.",
                                    type: "integer"
                                },
                                context: {
                                    description: "Le contexte qui doit être valide pour rendre cette recette est débloquée.",
                                    type: "string",
                                    enum: ["PlayerInWater", "PlayerHasManyItems", "AlwaysUnlocked"]
                                }
                            }
                        },
                        {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    item: {
                                        description: "L'item à posséder pour débloquer cette recette.",
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                    },
                                    data: {
                                        description: "La data de l'item.",
                                        type: "integer"
                                    },
                                    context: {
                                        description: "Le contexte qui doit être valide pour rendre cette recette est débloquée.",
                                        type: "string",
                                        enum: ["PlayerInWater", "PlayerHasManyItems", "AlwaysUnlocked"]
                                    }
                                }
                            }
                        }
                    ]
                }
            },
            {
                action: "modify",
                target: ["oneOf", "5", "properties", "minecraft:recipe_shapeless", "required"],
                value: ["description", "tags", "ingredients", "result", "unlock"]
            },
            {
                action: "add",
                target: ["oneOf", "5", "properties", "minecraft:recipe_shapeless", "properties", "unlock"],
                value: {
                    description: "Les conditions pour que cette recette soit considérée comme débloquée.",
                    oneOf: [
                        {
                            type: "object",
                            properties: {
                                item: {
                                    description: "L'item à posséder pour débloquer cette recette.",
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                },
                                data: {
                                    description: "La data de l'item.",
                                    type: "integer"
                                },
                                context: {
                                    description: "Le contexte qui doit être valide pour rendre cette recette est débloquée.",
                                    type: "string",
                                    enum: ["PlayerInWater", "PlayerHasManyItems", "AlwaysUnlocked"]
                                }
                            }
                        },
                        {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    item: {
                                        description: "L'item à posséder pour débloquer cette recette.",
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                    },
                                    data: {
                                        description: "La data de l'item.",
                                        type: "integer"
                                    },
                                    context: {
                                        description: "Le contexte qui doit être valide pour rendre cette recette est débloquée.",
                                        type: "string",
                                        enum: ["PlayerInWater", "PlayerHasManyItems", "AlwaysUnlocked"]
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        ]
    }
];

export const recipeSchemaTypeBP: SchemaType = {
    fileMatch: ["**/addon/behavior_pack/recipes/**/*.json"],
    baseSchema: baseSchema,
    versionedChanges: versionedChanges
};