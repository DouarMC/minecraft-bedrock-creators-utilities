import { dynamicExamplesSourceKeys } from "../../../utils/shared/schemaEnums";
import { schemaPatterns } from "../../../utils/shared/schemaPatterns";
import { MinecraftJsonSchema } from "../../../../../types/minecraftJsonSchema";
import { VersionedSchema } from "../../../model/versioning";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier permet de définir une Loot Table.",
    type: "object",
    required: ["pools"],
    properties: {
        pools: {
            description: "Répertorie toutes les Pools de la Loot Table. Une Pool correspond à un ensemble de règles déterminant les Items générés.",
            type: "array",
            items: {
                type: "object",
                properties: {
                    conditions: {
                        description: "Contient toutes les conditions à valider pour que cette Pool s'execute. (ou modificateur de Pool)",
                        type: "array",
                        items: {
                            oneOf: [
                                {
                                    type: "object",
                                    required: ["condition"],
                                    properties: {
                                        condition: {
                                            description: "Le type de condition.",
                                            type: "string",
                                            enum: ["killed_by_player", "killed_by_player_or_pets", "is_baby"]
                                        }
                                    }
                                },
                                {
                                    type: "object",
                                    required: ["condition", "value"],
                                    properties: {
                                        condition: {
                                            description: "Le type de condition.",
                                            type: "string",
                                            enum: ["has_mark_variant", "has_variant"]
                                        },
                                        value: {
                                            description: "La valeur de la condition.",
                                            type: "integer"
                                        }
                                    }
                                },
                                {
                                    type: "object",
                                    required: ["condition", "chance"],
                                    properties: {
                                        condition: {
                                            description: "Le type de condition.",
                                            type: "string",
                                            enum: ["random_chance"]
                                        },
                                        chance: {
                                            description: "Le pourcentage de chance.",
                                            type: "number",
                                            minimum: 0,
                                            maximum: 1
                                        }
                                    }
                                },
                                {
                                    type: "object",
                                    required: ["condition"],
                                    properties: {
                                        condition: {
                                            description: "Le type de condition.",
                                            type: "string",
                                            enum: ["random_difficulty_chance"]
                                        },
                                        default_chance: {
                                            description: "La chance par défaut.",
                                            type: "number",
                                            minimum: 0,
                                            maximum: 1
                                        },
                                        peaceful: {
                                            description: "La chance en mode pacifique.",
                                            type: "number",
                                            minimum: 0,
                                            maximum: 1
                                        },
                                        easy: {
                                            description: "La chance en mode facile.",
                                            type: "number",
                                            minimum: 0,
                                            maximum: 1
                                        },
                                        normal: {
                                            description: "La chance en mode normal.",
                                            type: "number",
                                            minimum: 0,
                                            maximum: 1
                                        },
                                        hard: {
                                            description: "La chance en mode difficile.",
                                            type: "number",
                                            minimum: 0,
                                            maximum: 1
                                        }
                                    }
                                },
                                {
                                    type: "object",
                                    required: ["condition", "chance", "looting_multiplier"],
                                    properties: {
                                        condition: {
                                            description: "Le type de condition.",
                                            type: "string",
                                            enum: ["random_chance_with_looting"]
                                        },
                                        chance: {
                                            description: "Le pourcentage de chance.",
                                            type: "number",
                                            minimum: 0,
                                            maximum: 1
                                        },
                                        looting_multiplier: {
                                            description: "Le multiplicateur de chance.",
                                            type: "number",
                                            minimum: 0,
                                            maximum: 1
                                        }
                                    }
                                },
                                {
                                    type: "object",
                                    required: ["condition", "max_chance"],
                                    properties: {
                                        condition: {
                                            description: "Le type de condition.",
                                            type: "string",
                                            enum: ["random_regional_difficulty_chance"]
                                        },
                                        max_chance: {
                                            description: "La chance maximale.",
                                            type: "number",
                                            minimum: 0,
                                            maximum: 1
                                        }
                                    }
                                },
                                {
                                    type: "object",
                                    required: ["condition"],
                                    properties: {
                                        condition: {
                                            description: "Le type de condition.",
                                            type: "string",
                                            enum: ["match_tool"]
                                        },
                                        count: {
                                            description: "Le nombre d'item.",
                                            oneOf: [
                                                {
                                                    type: "object",
                                                    properties: {
                                                        range_min: {
                                                            description: "Le nombre minimum.",
                                                            type: "integer"
                                                        },
                                                        range_max: {
                                                            description: "Le nombre maximum.",
                                                            type: "integer"
                                                        }
                                                    }
                                                },
                                                {
                                                    type: "integer"
                                                }
                                            ]
                                        },
                                        durability: {
                                            description: "La durabilité.",
                                            type: "object",
                                            properties: {
                                                range_min: {
                                                    description: "La durabilité minimale.",
                                                    type: "integer"
                                                },
                                                range_max: {
                                                    description: "La durabilité maximale.",
                                                    type: "integer"
                                                }
                                            }
                                        },
                                        enchantments: {
                                            description: "Les enchantements.",
                                            type: "array",
                                            items: {
                                                type: "object",
                                                required: ["enchantment"],
                                                properties: {
                                                    enchantment: {
                                                        description: "Le type d'enchantement.",
                                                        type: "string",
                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.vanilla_enchantment_ids
                                                    },
                                                    levels: {
                                                        description: "Le niveau de l'enchantement.",
                                                        oneOf: [
                                                            {
                                                                type: "object",
                                                                properties: {
                                                                    range_min: {
                                                                        description: "Le niveau minimum.",
                                                                        type: "integer"
                                                                    },
                                                                    range_max: {
                                                                        description: "Le niveau maximum.",
                                                                        type: "integer"
                                                                    }
                                                                }
                                                            },
                                                            {
                                                                type: "integer"
                                                            }
                                                        ]
                                                    }
                                                }
                                            }
                                        },
                                        item: {
                                            description: "Le nom de l'item.",
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                        },
                                        "minecraft:match_tool_filter_all": {
                                            description: "Les items qui ont tous les tags ici seront acceptés.",
                                            type: "array",
                                            items: {
                                                type: "string"
                                            }
                                        },
                                        "minecraft:match_tool_filter_any": {
                                            description: "Les items qui ont au moins un des tags ici seront acceptés.",
                                            type: "array",
                                            items: {
                                                type: "string"
                                            }
                                        },
                                        "minecraft:match_tool_filter_none": {
                                            description: "Les items qui n'ont aucun des tags ici seront acceptés.",
                                            type: "array",
                                            items: {
                                                type: "string"
                                            }
                                        }
                                    }
                                },
                                {
                                    type: "object",
                                    required: ["condition", "entity_type"],
                                    properties: {
                                        condition: {
                                            description: "Le type de condition.",
                                            type: "string",
                                            enum: ["killed_by_entity", "entity_killed", "damaged_by_entity", "passenger_of_entity"]
                                        },
                                        entity_type: {
                                            description: "Le type d'entité.",
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.entity_ids
                                        }
                                    }
                                },
                                {
                                    required: ["condition", "entity", "properties"],
                                    properties: {
                                        condition: {
                                            description: "Le type de condition.",
                                            type: "string",
                                            enum: ["entity_properties"]
                                        },
                                        entity: {
                                            description: "L'entité.",
                                            type: "string",
                                            enum: ["this"]
                                        },
                                        properties: {
                                            description: "Les valeurs des propriétés que doit avoir l'entité.",
                                            type: "object",
                                            propertyNames: {
                                                type: "string",
                                                pattern: schemaPatterns.identifier_with_namespace
                                            },
                                            additionalProperties: {
                                                oneOf: [
                                                    {
                                                        type: "boolean"
                                                    },
                                                    {
                                                        type: "number"
                                                    },
                                                    {
                                                        type: "string"
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    rolls: {
                        description: "Le nombre de lancers aléatoires.",
                        oneOf: [
                            {
                                type: "object", 
                                properties: {
                                    min: {
                                        description: "Le nombre minimum de lancers.",
                                        type: "integer"
                                    },
                                    max: {
                                        description: "Le nombre maximum de lancers.",
                                        type: "integer"
                                    }
                                }
                            },
                            {
                                type: "integer"
                            }
                        ]
                    },
                    bonus_rolls: {
                        description: "Le nombre de lancer en bonus quand le joueur a l'effet de Chance.",
                        type: "integer"
                    },
                    tiers: {
                        description: "La Pool devient hierachisé. Elle suit un ordre pour choisir une seule des entrées de Loot à partir d'un index choisi aléatoirement.`",
                        type: "object",
                        properties: {
                            initial_range: {
                                description: "Définit la range pour choisir l'index initial.",
                                type: "number"
                            },
                            bonus_rolls: {
                                description: "Le nombre de lancer pour avoir une chance de passer à l'index suivant.",
                                type: "integer"
                            },
                            bonus_chance: {
                                description: "Le pourcentage de chance que l'index incrémente lors d'un lancer.",
                                type: "number",
                                minimum: 0,
                                maximum: 1
                            }
                        }
                    },
                    entries: {
                        description: "Contient toutes les entrées de Loot.",
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                conditions: {
                                    description: "Contient toutes les conditions à valider pour que cette entrée de Loot s'execute. (ou modificateur de Loot).",
                                    $ref: "#/properties/pools/items/properties/conditions"
                                },
                                type: {
                                    description:
                                    "Définit le type de Loot." +
                                    "\n\n- `item`: L'entrée est un item." +
                                    "\n\n- `loot_table`: L'entrée est une autre Loot Table." +
                                    "\n\n- `empty`: L'entrée est vide.",
                                    type: "string",
                                    enum: ["item", "loot_table", "empty"]
                                },
                                name: {
                                    description: "Définit l'item de cette entrée de Loot si le type est `item` ou le chemin d'accès de la Loot Table si le type est `loot_table`.",
                                    type: "string"
                                },
                                weight: {
                                    description: "Définit le poids de chance de cette entrée.",
                                    type: "integer",
                                    minimum: 0
                                },
                                functions: {
                                    description: "Contient les différentes fonctions qui appliqueront des modifications à l'Item de l'entrée de Loot.",
                                    type: "array",
                                    items: {
                                        oneOf: [
                                            {
                                                type: "object",
                                                required: ["function"],
                                                properties: {
                                                    function: {
                                                        description: "Le type de fonction.",
                                                        type: "string",
                                                        enum: ["enchant_random_gear"]
                                                    },
                                                    chance: {
                                                        description: "Facteur modifiant la probabilité que l'objet soit enchanté. Une valeur de 1.0 garantit l'enchantement en difficulté Difficile, mais seulement environ 2/3 du temps en Normal. Valeurs supérieures à 1.0 peuvent contourner cette réduction.",
                                                        type: "number",
                                                        minimum: 0
                                                    }
                                                }
                                            },
                                            {
                                                type: "object",
                                                required: ["function"],
                                                properties: {
                                                    function: {
                                                        description: "Le type de fonction.",
                                                        type: "string",
                                                        enum: ["enchant_randomly"]
                                                    },
                                                    treasure: {
                                                        description: "Définit si l'item peut avoir des enchantements de type trésor (des enchantements impossibles à avoir dans une table d'enchant.)",
                                                        type: "boolean"
                                                    }
                                                }
                                            },
                                            {
                                                type: "object",
                                                required: ["function", "levels"],
                                                properties: {
                                                    function: {
                                                        description: "Le type de fonction.",
                                                        type: "string",
                                                        enum: ["enchant_with_levels"]
                                                    },
                                                    levels: {
                                                        description: "Applique un enchantement à l'item comme s'il était enchanté avec une table d'enchant avec un niveau minimum et maximum donné.",
                                                        type: "object",
                                                        properties: {
                                                            min: {
                                                                description: "Le niveau minimum.",
                                                                type: "integer"
                                                            },
                                                            max: {
                                                                description: "Le niveau maximum.",
                                                                type: "integer"
                                                            }
                                                        }
                                                    },
                                                    treasure: {
                                                        description: "Définit si seulement les enchantements de type trésor peuvent être appliqués.",
                                                        type: "boolean"
                                                    }
                                                }
                                            },
                                            {
                                                type: "object",
                                                required: ["function", "id"],
                                                properties: {
                                                    function: {
                                                        description: "Le type de fonction.",
                                                        type: "string",
                                                        enum: ["set_potion"]
                                                    },
                                                    id: {
                                                        description: "L'identifiant de la potion.",
                                                        type: "string",
                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.effect_ids
                                                    }
                                                }
                                            },
                                            {
                                                type: "object",
                                                required: ["function", "enchants"],
                                                properties: {
                                                    function: {
                                                        description: "Le type de fonction.",
                                                        type: "string",
                                                        enum: ["specific_enchants"]
                                                    },
                                                    enchants: {
                                                        description: "Les enchantements à appliquer à l'item.",
                                                        type: "array",
                                                        items: {
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.vanilla_enchantment_ids
                                                                },
                                                                {
                                                                    type: "object",
                                                                    required: ["id"],
                                                                    properties: {
                                                                        id: {
                                                                            description: "L'identifiant de l'enchantement.",
                                                                            type: "string",
                                                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.vanilla_enchantment_ids
                                                                        },
                                                                        level: {
                                                                            description: "Le niveau de l'enchantement. \nType: `Integer`",
                                                                            type: "integer"
                                                                        }
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                type: "object",
                                                required: ["function", "count"],
                                                properties: {
                                                    function: {
                                                        description: "Le type de fonction.",
                                                        type: "string",
                                                        enum: ["looting_enchant"]
                                                    },
                                                    count: {
                                                        description: "Définit le nombre d'items supllémentaires à renvoyer si l'entité est tuée par un item avec l'enchant Looting.",
                                                        type: "object",
                                                        properties: {
                                                            min: {
                                                                description: "Le nombre minimum.",
                                                                type: "integer"
                                                            },
                                                            max: {
                                                                description: "Le nombre maximum.",
                                                                type: "integer"
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                type: "object",
                                                required: ["function", "values"],
                                                properties: {
                                                    function: {
                                                        description: "Le type de fonction.",
                                                        type: "string",
                                                        enum: ["random_aux_value"]
                                                    },
                                                    values: {
                                                        description: "La plage des valeurs possibles.",
                                                        type: "object",
                                                        properties: {
                                                            min: {
                                                                description: "La valeur minimale.",
                                                                type: "integer"
                                                            },
                                                            max: {
                                                                description: "La valeur maximale.",
                                                                type: "integer"
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                required: ["function", "block_state", "values"],
                                                properties: {
                                                    function: {
                                                        description: "Le type de fonction.",
                                                        type: "string",
                                                        enum: ["random_block_state"]
                                                    },
                                                    block_state: {
                                                        description: "Le nom de l'état de bloc à définir aléatoirement.",
                                                        type: "string",
                                                        pattern: schemaPatterns.identifier_with_namespace
                                                    },
                                                    values: {
                                                        description: "L'index de la valeur à définir aléatoirement.",
                                                        type: "object",
                                                        properties: {
                                                            min: {
                                                                description: "L'index minimum.",
                                                                type: "integer"
                                                            },
                                                            max: {
                                                                description: "L'index maximum.",
                                                                type: "integer"
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                type: "object",
                                                required: ["function"],
                                                properties: {
                                                    function: {
                                                        description: "Le type de fonction.",
                                                        type: "string",
                                                        enum: ["random_dye"]
                                                    }
                                                }
                                            },
                                            {
                                                type: "object",
                                                required: ["function"],
                                                properties: {
                                                    function: {
                                                        description: "Le type de fonction.",
                                                        type: "string",
                                                        enum: ["set_actor_id"]
                                                    },
                                                    id: {
                                                        description: "L'identifiant de l'entité.",
                                                        type: "string",
                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.entity_ids
                                                    }
                                                }
                                            },
                                            {
                                                type: "object",
                                                required: ["function", "type"],
                                                properties: {
                                                    function: {
                                                        description: "Le type de fonction.",
                                                        type: "string",
                                                        enum: ["set_banner_details"]
                                                    },
                                                    type: {
                                                        description: "Le type de bannière.",
                                                        type: "string",
                                                        enum: ["default", "illager_captain"]
                                                    },
                                                    base_color: {
                                                        description: "La couleur de base de la bannière.",
                                                        type: "string",
                                                        enum: [
                                                            "black", "red", "green", "brown", "blue", "purple", "cyan", "silver", "gray", "pink", "lime", "yellow", "light_blue", "magenta", "orange", "white"
                                                        ]
                                                    },
                                                    patterns: {
                                                        description: "Les motifs de la bannière.",
                                                        type: "array",
                                                        maxItems: 6,
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                pattern: {
                                                                    description: "Le motif de la bannière.",
                                                                    type: "string",
                                                                    enum: [
                                                                        "base", "border", "bricks", "circle", "creeper", "cross", "curly_border", "diagonal_left", "diagonal_right", "diagonal_up_left", "diagonal_up_right", "flower", "gradient", "gradient_up", "half_horizontal", "half_horizontal_bottom", "half_vertical", "half_vertical_right", "mojang", "piglin", "rhombus", "skull", "small_stripes", "square_bottom_left", "square_bottom_right", "square_top_left", "square_top_right", "straight_cross", "stripe_bottom", "stripe_center", "stripe_downleft", "stripe_downright", "stripe_left", "stripe_middle", "stripe_right", "stripe_top", "triangle_bottom", "triangle_top", "triangles_bottom", "triangles_top"
                                                                    ]
                                                                },
                                                                color: {
                                                                    description: "La couleur du motif.",
                                                                    type: "string",
                                                                    enum: [
                                                                        "black", "red", "green", "brown", "blue", "purple", "cyan", "silver", "gray", "pink", "lime", "yellow", "light_blue", "magenta", "orange", "white"
                                                                    ]
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                type: "object",
                                                required: ["function", "author", "title", "pages"],
                                                properties: {
                                                    function: {
                                                        description: "Le type de fonction.",
                                                        type: "string",
                                                        enum: ["set_book_contents"]
                                                    },
                                                    author: {
                                                        description: "L'auteur du livre.",
                                                        type: "string"
                                                    },
                                                    title: {
                                                        description: "Le titre du livre.",
                                                        type: "string"
                                                    },
                                                    pages: {
                                                        description: "Le contenu des pages du livre. Le contenu d'un texte peut être un rawtext.",
                                                        type: "array",
                                                        items: {
                                                            type: "string",
                                                            "x-localized": true
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                type: "object",
                                                required: ["function", "count"],
                                                properties: {
                                                    function: {
                                                        description: "Le type de fonction.",
                                                        type: "string",
                                                        enum: ["set_count"]
                                                    },
                                                    count: {
                                                        description: "Le nombre d'items.",
                                                        type: "object",
                                                        properties: {
                                                            min: {
                                                                description: "Le nombre minimum.",
                                                                type: "integer"
                                                            },
                                                            max: {
                                                                description: "Le nombre maximum.",
                                                                type: "integer"
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                type: "object",
                                                required: ["function", "damage"],
                                                properties: {
                                                    function: {
                                                        description: "Le type de fonction.",
                                                        type: "string",
                                                        enum: ["set_damage"]
                                                    },
                                                    damage: {
                                                        description: "Le pourcentage de durabilité restant de l'item.",
                                                        oneOf: [
                                                            {
                                                                type: "number",
                                                                minimum: 0.0,
                                                                maximum: 1.0
                                                            },
                                                            {
                                                                type: "object",
                                                                properties: {
                                                                    min: {
                                                                        description: "Le pourcentage minimum.",
                                                                        type: "number",
                                                                        minimum: 0.0,
                                                                        maximum: 1.0
                                                                    },
                                                                    max: {
                                                                        description: "Le pourcentage maximum.",
                                                                        type: "number",
                                                                        minimum: 0.0,
                                                                        maximum: 1.0
                                                                    }
                                                                }
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                type: "object",
                                                required: ["function", "data"],
                                                properties: {
                                                    function: {
                                                        description: "Le type de fonction.",
                                                        type: "string",
                                                        enum: ["set_data"]
                                                    },
                                                    data: {
                                                        description: "La valeur de la donnée de l'item ou du bloc.",
                                                        type: "integer"
                                                    }
                                                }
                                            },
                                            {
                                                type: "object",
                                                required: ["function"],
                                                properties: {
                                                    function: {
                                                        description: "Le type de fonction.",
                                                        type: "string",
                                                        enum: ["set_data_from_color_index"]
                                                    }
                                                }
                                            },
                                            {
                                                type: "object",
                                                required: ["function", "lore"],
                                                properties: {
                                                    function: {
                                                        description: "Le type de fonction.",
                                                        type: "string",
                                                        enum: ["set_lore"]
                                                    },
                                                    lore: {
                                                        description: "Les lignes de lore du texte.",
                                                        type: "array",
                                                        items: {
                                                            type: "string"
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                type: "object",
                                                required: ["function", "name"],
                                                properties: {
                                                    function: {
                                                        description: "Le type de fonction.",
                                                        type: "string",
                                                        enum: ["set_name"]
                                                    },
                                                    name: {
                                                        description: "Le nom de l'item.",
                                                        type: "string"
                                                    }
                                                }
                                            },
                                            {
                                                type: "object",
                                                required: ["function", "destination"],
                                                properties: {
                                                    function: {
                                                        description: "Le type de fonction.",
                                                        type: "string",
                                                        enum: ["exploration_map"]
                                                    },
                                                    destination: {
                                                        description: "Le nom de la structure.",
                                                        type: "string",
                                                        enum: [
                                                            "buriedtreasure", "endcity", "fortress", "mansion", "mineshaft", "monument", "pillageroutpost", "ruins",
                                                            "shipwreck", "stronghold", "temple", "village"
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                type: "object",
                                                required: ["function", "loot_table"],
                                                properties: {
                                                    function: {
                                                        description: "Le type de fonction.",
                                                        type: "string",
                                                        enum: ["fill_container"]
                                                    },
                                                    loot_table: {
                                                        description: "Le chemin d'accès de la Loot Table utilisé.",
                                                        type: "string",
                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.loot_table_file_paths
                                                    }
                                                }
                                            },
                                            {
                                                type: "object",
                                                required: ["function"],
                                                properties: {
                                                    function: {
                                                        description: "Le type de fonction.",
                                                        type: "string",
                                                        enum: ["furnace_smelt"]
                                                    }
                                                }
                                            },
                                            {
                                                type: "object",
                                                required: ["function"],
                                                properties: {
                                                    function: {
                                                        description: "Le type de fonction.",
                                                        type: "string",
                                                        enum: ["trader_material_type"]
                                                    }
                                                }
                                            },
                                            {
                                                type: "object",
                                                required: ["function", "amplifier"],
                                                properties: {
                                                    function: {
                                                        description: "Le type de fonction.",
                                                        type: "string",
                                                        enum: ["set_ominous_bottle_amplifier"],
                                                    },
                                                    amplifier: {
                                                        description: "L'amplificateur de la bouteille.",
                                                        oneOf: [
                                                            {
                                                                type: "integer"
                                                            },
                                                            {
                                                                type: "object",
                                                                properties: {
                                                                    min: {
                                                                        description: "L'amplificateur minimum.",
                                                                        type: "integer"
                                                                    },
                                                                    max: {
                                                                        description: "L'amplificateur maximum.",
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
                                                required: ["function", "material", "pattern"],
                                                properties: {
                                                    function: {
                                                        description: "Le type de fonction.",
                                                        type: "string",
                                                        enum: ["set_armor_trim"]
                                                    },
                                                    material: {
                                                        description: "Le matériau de la personalisation de l'armure.",
                                                        type: "string",
                                                        enum: [
                                                            "amethyst", "copper", "diamond", "emerald", "gold", "iron", "lapis", "netherite", "resin", "quartz", "redstone"
                                                        ]
                                                    },
                                                    pattern: {
                                                        description: "Le motif de la personalisation de l'armure.",
                                                        type: "string",
                                                        enum: [
                                                            "sentry", "vex", "wild", "coast", "dune", "wayfinder", "raiser", "shaper", "host", "ward", "silence", "tide", "snout", "rib", "eye", "spire", "flow", "bolt"
                                                        ]
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    quality: {
                        description: "Définit le poids de l'entrée en fonction de la chance du joueur.",
                        type: "integer"
                    }
                }
            }
        }
    }
};

export const lootTableSchemaTypeBP: VersionedSchema = {
    fileMatch: ["**/addon/behavior_pack/loot_tables/**/*.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};