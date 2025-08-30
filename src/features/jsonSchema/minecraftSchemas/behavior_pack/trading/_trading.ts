import { SchemaType, SchemaChange } from "../../../../../types/schema";
import { commonSchemas } from "../../../utils/shared/commonSchemas";
import { dynamicExamplesSourceKeys } from "../../../utils/shared/schemaEnums";
import { schemaPatterns } from "../../../utils/shared/schemaPatterns";
import { MinecraftJsonSchema } from "../../../../../types/minecraftJsonSchema";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier sert à définir une table d'échanges avec une entité qui peut marchander.",
    type: "object",
    required: ["tiers"],
    properties: {
        format_version: {
            description: "La version du Format à utiliser.",
            type: "string",
            enum: [
                "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
            ]
        },
        tiers: {
            description: "Contient les différents tiers qui sont des ensemble de transactions pouvant être proposées par l'entité.",
            type: "array",
            items: {
                type: "object",
                properties: {
                    groups: {
                        description: "Contient les différentes groupes de transactions qui sont un moyen de sélectionner aléatoirement les échanges qu'un marchand peut proposer dans un tier donné.",
                        type: "array",
                        items: {
                            type: "object",
                            required: ["trades"],
                            properties: {
                                num_to_select: {
                                    description: "Définit combien d'échanges seront sélectionnés au hasard parmi ceux disponibles. Si `num_to_select = 0`, toutes les transactions seront sélectionnées (comportement par défaut).",
                                    default: 0,
                                    type: "integer"
                                },
                                trades: {
                                    description: "Contients les différentes transactions possibles.",
                                    type: "array",
                                    items: {
                                        type: "object",
                                        required: ["wants", "gives"],
                                        properties: {
                                            max_uses: {
                                                description: "Définit le nombre de fois que cet échange peut se faire avant que le marchand doit se réapprovisionner. Si 'max_uses': 0, l'échange est affiché mais ne peut pas être effectué. Si 'max_uses' est négatif, l'échange peut être effectué un nombre infini de fois.",
                                                default: 7,
                                                type: "integer"
                                            },
                                            reward_exp: {
                                                description: "Définit si le joueur reçoit de l'expérience pour avoir effectué cet échange.",
                                                default: true,
                                                type: "boolean"
                                            },
                                            trader_exp: {
                                                description: "Définit le montant d'expérience à récompenser au marchand.",
                                                default: 1,
                                                type: "integer"
                                            },
                                            wants: {
                                                description: "Item(s) que le marchand veut.",
                                                type: "array",
                                                minItems: 1,
                                                maxItems: 2,
                                                items: {
                                                    oneOf: [
                                                        {
                                                            type: "object",
                                                            required: ["item"],
                                                            properties: {
                                                                item: {
                                                                    description: "Item que le marchand veut.",
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                                                },
                                                                quantity: {
                                                                    description: "Quantité de l'item que le marchand veut.",
                                                                    default: 1,
                                                                    oneOf: [
                                                                        {
                                                                            type: "integer"
                                                                        },
                                                                        {
                                                                            type: "object",
                                                                            required: ["min", "max"],
                                                                            properties: {
                                                                                min: {
                                                                                    description: "Quantité minimale de l'item que le marchand veut.",
                                                                                    type: "integer"
                                                                                },
                                                                                max: {
                                                                                    description: "Quantité maximale de l'item que le marchand veut.",
                                                                                    type: "integer"
                                                                                }
                                                                            }
                                                                        }
                                                                    ]
                                                                },
                                                                price_multiplier: {
                                                                    description: "Multiplicateur de prix qui dicte comment la quantité de base d'un item est modifiée en raison de certains événements.",
                                                                    default: 0,
                                                                    type: "number"
                                                                },
                                                                functions: {
                                                                    description: "Contient les différentes fonctions qui appliqueront des modifications à l'Item avant qu'il ne soit utilisé dans l'échange.",
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
                                                                            },
                                                                            {
                                                                                type: "object",
                                                                                required: ["function"],
                                                                                properties: {
                                                                                    function: {
                                                                                        description: "Le type de fonction.",
                                                                                        type: "string",
                                                                                        enum: ["enchant_book_for_trading"]
                                                                                    },
                                                                                    base_cost: {
                                                                                        description: "Le coût de base pour l'enchantement.",
                                                                                        type: "integer"
                                                                                    },
                                                                                    base_random_cost: {
                                                                                        description: "Le coût aléatoire de l'enchantement.",
                                                                                        type: "integer"
                                                                                    },
                                                                                    per_level_random_cost: {
                                                                                        description: "Le coût aléatoire par niveau de l'enchantement.",
                                                                                        type: "integer"
                                                                                    },
                                                                                    per_level_cost: {
                                                                                        description: "Le coût par niveau de l'enchantement.",
                                                                                        type: "integer"
                                                                                    }
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                },
                                                                filters: {
                                                                    description: "Filtre qui doit être validé pour que l'échange soit disponible.",
                                                                    ...commonSchemas.minecraft_filter
                                                                }
                                                            }
                                                        },
                                                        {
                                                            type: "object",
                                                            required: ["choice"],
                                                            properties: {
                                                                choice: {
                                                                    description: "Les choix d'items possibles pour cette entrée.",
                                                                    type: "array",
                                                                    minItems: 1,
                                                                    items: {
                                                                        $ref: "#/properties/tiers/items/properties/groups/items/properties/trades/items/properties/wants/items/oneOf/0"
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    ]
                                                }
                                            },
                                            gives: {
                                                description: "Item que le marchand donne.",
                                                type: "array",
                                                minItems: 1,
                                                maxItems: 1,
                                                items: {
                                                    oneOf: [
                                                        {
                                                            type: "object",
                                                            required: ["item"],
                                                            properties: {
                                                                item: {
                                                                    description: "Item que le marchand veut.",
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                                                },
                                                                quantity: {
                                                                    description: "Quantité de l'item que le marchand veut.",
                                                                    default: 1,
                                                                    oneOf: [
                                                                        {
                                                                            type: "integer"
                                                                        },
                                                                        {
                                                                            type: "object",
                                                                            required: ["min", "max"],
                                                                            properties: {
                                                                                min: {
                                                                                    description: "Quantité minimale de l'item que le marchand veut.",
                                                                                    type: "integer"
                                                                                },
                                                                                max: {
                                                                                    description: "Quantité maximale de l'item que le marchand veut.",
                                                                                    type: "integer"
                                                                                }
                                                                            }
                                                                        }
                                                                    ]
                                                                },
                                                                price_multiplier: {
                                                                    description: "Multiplicateur de prix qui dicte comment la quantité de base d'un item est modifiée en raison de certains événements.",
                                                                    default: 0,
                                                                    type: "number"
                                                                },
                                                                functions: {
                                                                    description: "Contient les différentes fonctions qui appliqueront des modifications à l'Item que le marchand donne.",
                                                                    $ref: "#/properties/tiers/items/properties/groups/items/properties/trades/items/properties/wants/items/oneOf/0/properties/functions"
                                                                }
                                                            }
                                                        },
                                                        {
                                                            type: "object",
                                                            required: ["choice"],
                                                            properties: {
                                                                choice: {
                                                                    description: "Les choix d'items possibles pour cette entrée.",
                                                                    type: "array",
                                                                    minItems: 1,
                                                                    items: {
                                                                        $ref: "#/properties/tiers/items/properties/groups/items/properties/trades/items/properties/wants/items/oneOf/0"
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
                    },
                    total_exp_required: {
                        description: "Expérience totale requise pour débloquer ce tier. Si un nombre négatif est spécifié, le tier sera débloqué par défaut.",
                        type: "integer"
                    }
                }
            }
        }
    }
};

const versionedChanges: SchemaChange[] = [
    {
        version: "1.21.30",
        changes: [
            {
                action: "add",
                target: ["properties", "tiers", "items", "required"],
                value: ["groups", "total_exp_required"]
            }
        ]
    }
];

export const tradingSchemaTypeBP: SchemaType = {
    fileMatch: ["**/addon/behavior_pack/trading/**/*.json"],
    baseSchema: baseSchema,
    versionedChanges: versionedChanges
};