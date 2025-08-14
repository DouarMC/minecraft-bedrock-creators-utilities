import { SchemaType, SchemaChange } from "../../../../../types/schema";

const baseSchema = {
    "description": "Ce fichier sert à définir une table d'échanges avec une entité qui peut marchander. \nType: `Object`",
    "type": "object",
    "required": ["tiers"],
    "properties": {
        format_version: {
            description: "La version du Format à utiliser.",
            type: "string",
            enum: [
                "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
            ]
        },
        "tiers": {
            "description": "Contient les différents tiers qui sont des ensemble de transactions pouvant être proposées par l'entité. \nType: `Object[]`",
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "groups": {
                        "description": "Contient les différentes groupes de transactions qui sont un moyen de sélectionner aléatoirement les échanges qu'un marchand peut proposer dans un tier donné. \nType: `Object[]`",
                        "type": "array",
                        "items": {
                            "type": "object",
                            "required": ["trades"],
                            "properties": {
                                "num_to_select": {
                                    "description": "Définit combien d’échanges seront sélectionnés au hasard parmi ceux disponibles. \nType: `Integer` \nNote: Si 'num_to_select': 0, toutes les transactions seront sélectionnées (comportement par défaut).",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "trades": {
                                    "description": "Contients les différentes transactions possibles. \nType: `Object[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "required": ["wants", "gives"],
                                        "properties": {
                                            "max_uses": {
                                                "description": "Définit le nombre de fois que cet échange peut se faire avant que le marchand doit se réapprovisionner. \nType: `Integer` \nNote: Si 'max_uses': 0, l'échange est affiché mais ne peut pas être effectué. \nNote: Si 'max_uses' est négatif, l'échange peut être effectué un nombre infini de fois.",
                                                "default": 7,
                                                "type": "integer"
                                            },
                                            "reward_exp": {
                                                "description": "Définit si le joueur reçoit de l'expérience pour avoir effectué cet échange. \nType: `Boolean`",
                                                "default": true,
                                                "type": "boolean"
                                            },
                                            "trader_exp": {
                                                "description": "Définit le montant d'expérience à récompenser au marchand. \nType: `Integer`",
                                                "default": 1,
                                                "type": "integer"
                                            },
                                            "wants": {
                                                "description": "Item(s) que le marchand veut. \nType: `Object[]`",
                                                "type": "array",
                                                "minItems": 1,
                                                "maxItems": 2,
                                                "items": {
                                                    "type": "object",
                                                    "anyOf": [
                                                        {
                                                            "required": ["item"],
                                                            "properties": {
                                                                "item": {
                                                                    "description": "Item que le marchand veut. \nType: `String`",
                                                                    "type": "string"
                                                                },
                                                                "quantity": {
                                                                    "description": "Quantité de l'item que le marchand veut. \nType: `Integer | Object`",
                                                                    "default": 1,
                                                                    "oneOf": [
                                                                        {
                                                                            "type": "integer"
                                                                        },
                                                                        {
                                                                            "type": "object",
                                                                            "required": ["min", "max"],
                                                                            "properties": {
                                                                                "min": {
                                                                                    "description": "Quantité minimale de l'item que le marchand veut. \nType: `Integer`",
                                                                                    "type": "integer"
                                                                                },
                                                                                "max": {
                                                                                    "description": "Quantité maximale de l'item que le marchand veut. \nType: `Integer`",
                                                                                    "type": "integer"
                                                                                }
                                                                            }
                                                                        }
                                                                    ]
                                                                },
                                                                "price_multiplier": {
                                                                    "description": "Multiplicateur de prix qui dicte comment la quantité de base d'un item est modifiée en raison de certains événements. \nType: `Number`",
                                                                    "default": 0,
                                                                    "type": "number"
                                                                },
                                                                "functions": {
                                                                    "description": "Contient les différentes fonctions qui appliqueront des modifications à l'Item de l'entrée de Loot. \nType: `Object[]`",
                                                                    "type": "array",
                                                                    "items": {
                                                                        "type": "object",
                                                                        "properties": {
                                                                            "function": {
                                                                                "description": "Le type de fonction. \nType: `String`",
                                                                                "type": "string",
                                                                                "enum": [
                                                                                    "enchant_book_for_trading", "enchant_random_gear", "enchant_randomly", "enchant_with_levels", "specific_enchants",
                                                                                    "random_aux_value", "random_block_state", "random_dye", "set_actor_id", "set_banner_details", "set_book_contents", "set_count",
                                                                                    "set_damage", "set_data", "set_data_from_color_index", "set_lore", "set_name", "exploration_map", "fill_container",
                                                                                    "trader_material_type", "set_ominous_bottle_amplifier", "set_armor_trim", "set_potion"
                                                                                ]
                                                                            }
                                                                        },
                                                                        "oneOf": [
                                                                            {
                                                                                "required": ["function"],
                                                                                "properties": {
                                                                                    "function": {
                                                                                        "enum": ["enchant_book_for_trading"]
                                                                                    },
                                                                                    "base_cost": {
                                                                                        "description": "Le coût de base pour l'enchantement. \nType: `Integer`",
                                                                                        "type": "integer"
                                                                                    },
                                                                                    "base_random_cost": {
                                                                                        "description": "Le coût aléatoire de l'enchantement. \nType: `Integer`",
                                                                                        "type": "integer"
                                                                                    },
                                                                                    "per_level_random_cost": {
                                                                                        "description": "Le coût aléatoire par niveau de l'enchantement. \nType: `Integer`",
                                                                                        "type": "integer"
                                                                                    },
                                                                                    "per_level_cost": {
                                                                                        "description": "Le coût par niveau de l'enchantement. \nType: `Integer`",
                                                                                        "type": "integer"
                                                                                    }
                                                                                }
                                                                            },
                                                                            {
                                                                                "required": ["function"],
                                                                                "properties": {
                                                                                    "function": {
                                                                                        "enum": ["enchant_random_gear"]
                                                                                    },
                                                                                    "chance": {
                                                                                        "description": "Facteur modifiant la probabilité que l'objet soit enchanté. Une valeur de 1.0 garantit l'enchantement en difficulté Difficile, mais seulement environ 2/3 du temps en Normal. Valeurs supérieures à 1.0 peuvent contourner cette réduction. \nType: `Number`",
                                                                                        "type": "number",
                                                                                        "minimum": 0
                                                                                    }
                                                                                }
                                                                            },
                                                                            {
                                                                                "required": ["function"],
                                                                                "properties": {
                                                                                    "function": {
                                                                                        "enum": ["enchant_randomly"]
                                                                                    },
                                                                                    "treasure": {
                                                                                        "description": "Définit si l'item peut avoir des enchantements de type trésor (des enchantements impossibles à avoir dans une table d'enchant.) \nType: `Boolean`",
                                                                                        "type": "boolean"
                                                                                    }
                                                                                }
                                                                            },
                                                                            {
                                                                                "required": ["function", "levels"],
                                                                                "properties": {
                                                                                    "function": {
                                                                                        "enum": ["enchant_with_levels"]
                                                                                    },
                                                                                    "levels": {
                                                                                        "description": "Applique un enchantement à l'item comme s'il était enchanté avec une table d'enchant avec un niveau minimum et maximum donné. \nType: `Object`",
                                                                                        "type": "object",
                                                                                        "properties": {
                                                                                            "min": {
                                                                                                "description": "Le niveau minimum. \nType: `Integer`",
                                                                                                "type": "integer"
                                                                                            },
                                                                                            "max": {
                                                                                                "description": "Le niveau maximum. \nType: `Integer`",
                                                                                                "type": "integer"
                                                                                            }
                                                                                        }
                                                                                    },
                                                                                    "treasure": {
                                                                                        "description": "Définit si seulement les enchantements de type trésor peuvent être appliqués. \nType: `Boolean`",
                                                                                        "type": "boolean"
                                                                                    }
                                                                                }
                                                                            },
                                                                            {
                                                                                "required": ["function", "id"],
                                                                                "properties": {
                                                                                    "function": {
                                                                                        "enum": ["set_potion"]
                                                                                    },
                                                                                    "id": {
                                                                                        "description": "L'identifiant de la potion. \nType: `String`",
                                                                                        "type": "string",
                                                                                        "$ref": "https://douarmc.github.io/minecraft_bedrock_json_schemas/common.json#/definitions/potion_effects_id"
                                                                                    }
                                                                                }
                                                                            },
                                                                            {
                                                                                "required": ["function", "enchants"],
                                                                                "properties": {
                                                                                    "function": {
                                                                                        "enum": ["specific_enchants"]
                                                                                    },
                                                                                    "enchants": {
                                                                                        "description": "Les enchantements à appliquer à l'item. \nType: `(String | Object)[]`",
                                                                                        "type": "array",
                                                                                        "items": {
                                                                                            "oneOf": [
                                                                                                {
                                                                                                    "type": "string",
                                                                                                    "$ref": "https://douarmc.github.io/minecraft_bedrock_json_schemas/common.json#/definitions/enchantments_id"
                                                                                                },
                                                                                                {
                                                                                                    "type": "object",
                                                                                                    "properties": {
                                                                                                        "id": {
                                                                                                            "description": "L'identifiant de l'enchantement. \nType: `String`",
                                                                                                            "type": "string",
                                                                                                            "$ref": "https://douarmc.github.io/minecraft_bedrock_json_schemas/common.json#/definitions/enchantments_id"
                                                                                                        },
                                                                                                        "level": {
                                                                                                            "description": "Le niveau de l'enchantement. \nType: `Integer`",
                                                                                                            "type": "integer"
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            ]
                                                                                        }
                                                                                    }
                                                                                }
                                                                            },
                                                                            {
                                                                                "required": ["function", "values"],
                                                                                "properties": {
                                                                                    "function": {
                                                                                        "enum": ["random_aux_value"]
                                                                                    },
                                                                                    "values": {
                                                                                        "description": "La plage des valeurs possibles. \nType: `Object`",
                                                                                        "type": "object",
                                                                                        "properties": {
                                                                                            "min": {
                                                                                                "description": "La valeur minimale. \nType: `Integer`",
                                                                                                "type": "integer"
                                                                                            },
                                                                                            "max": {
                                                                                                "description": "La valeur maximale. \nType: `Integer`",
                                                                                                "type": "integer"
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            },
                                                                            {
                                                                                "required": ["function", "block_state", "values"],
                                                                                "properties": {
                                                                                    "function": {
                                                                                        "enum": ["random_block_state"]
                                                                                    },
                                                                                    "block_state": {
                                                                                        "description": "Le nom de l'état de bloc à définir aléatoirement. \nType: `String`",
                                                                                        "type": "string"
                                                                                    },
                                                                                    "values": {
                                                                                        "description": "L'index de la valeur à définir aléatoirement. \nType: `Object`",
                                                                                        "type": "object",
                                                                                        "properties": {
                                                                                            "min": {
                                                                                                "description": "L'index minimum. \nType: `Integer`",
                                                                                                "type": "integer"
                                                                                            },
                                                                                            "max": {
                                                                                                "description": "L'index maximum. \nType: `Integer`",
                                                                                                "type": "integer"
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            },
                                                                            {
                                                                                "required": ["function"],
                                                                                "properties": {
                                                                                    "function": {
                                                                                        "const": "random_dye"
                                                                                    }
                                                                                }
                                                                            },
                                                                            {
                                                                                "required": ["function"],
                                                                                "properties": {
                                                                                    "function": {
                                                                                        "const": "set_actor_id"
                                                                                    },
                                                                                    "id": {
                                                                                        "description": "L'identifiant de l'entité. \nType: `String`",
                                                                                        "type": "string"
                                                                                    }
                                                                                }
                                                                            },
                                                                            {
                                                                                "required": ["function", "type"],
                                                                                "properties": {
                                                                                    "function": {
                                                                                        "const": "set_banner_details"
                                                                                    },
                                                                                    "type": {
                                                                                        "description": "Le type de bannière. \nType: `String`",
                                                                                        "type": "string",
                                                                                        "enum": ["default", "illager_captain"]
                                                                                    },
                                                                                    "base_color": {
                                                                                        "description": "La couleur de base de la bannière. \nType: `String`",
                                                                                        "type": "string",
                                                                                        "enum": [
                                                                                            "black", "red", "green", "brown", "blue", "purple", "cyan", "silver", "gray", "pink", "lime", "yellow", "light_blue", "magenta", "orange", "white"
                                                                                        ]
                                                                                    },
                                                                                    "patterns": {
                                                                                        "description": "Les motifs de la bannière. \nType: `Object[]`",
                                                                                        "type": "array",
                                                                                        "maxItems": 6,
                                                                                        "items": {
                                                                                            "type": "object",
                                                                                            "properties": {
                                                                                                "pattern": {
                                                                                                    "description": "Le motif de la bannière. \nType: `String`",
                                                                                                    "type": "string",
                                                                                                    "enum": [
                                                                                                        "base", "border", "bricks", "circle", "creeper", "cross", "curly_border", "diagonal_left", "diagonal_right", "diagonal_up_left", "diagonal_up_right", "flower", "gradient", "gradient_up", "half_horizontal", "half_horizontal_bottom", "half_vertical", "half_vertical_right", "mojang", "piglin", "rhombus", "skull", "small_stripes", "square_bottom_left", "square_bottom_right", "square_top_left", "square_top_right", "straight_cross", "stripe_bottom", "stripe_center", "stripe_downleft", "stripe_downright", "stripe_left", "stripe_middle", "stripe_right", "stripe_top", "triangle_bottom", "triangle_top", "triangles_bottom", "triangles_top"
                                                                                                    ]
                                                                                                },
                                                                                                "color": {
                                                                                                    "description": "La couleur du motif. \nType: `String`",
                                                                                                    "type": "string",
                                                                                                    "enum": [
                                                                                                        "black", "red", "green", "brown", "blue", "purple", "cyan", "silver", "gray", "pink", "lime", "yellow", "light_blue", "magenta", "orange", "white"
                                                                                                    ]
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            },
                                                                            {
                                                                                "required": ["function", "author", "title", "pages"],
                                                                                "properties": {
                                                                                    "function": {
                                                                                        "const": "set_book_contents"
                                                                                    },
                                                                                    "author": {
                                                                                        "description": "L'auteur du livre. \nType: `String`",
                                                                                        "type": "string"
                                                                                    },
                                                                                    "title": {
                                                                                        "description": "Le titre du livre. \nType: `String`",
                                                                                        "type": "string"
                                                                                    },
                                                                                    "pages": {
                                                                                        "description": "Le contenu des pages du livre. \nType: `String[]` \nNote: Le contenu d'un texte peut être un rawtext.",
                                                                                        "type": "array",
                                                                                        "items": {
                                                                                            "type": "string"
                                                                                        }
                                                                                    }
                                                                                }
                                                                            },
                                                                            {
                                                                                "required": ["function", "count"],
                                                                                "properties": {
                                                                                    "function": {
                                                                                        "const": "set_count"
                                                                                    },
                                                                                    "count": {
                                                                                        "description": "Le nombre d'items. \nType: `Object`",
                                                                                        "type": "object",
                                                                                        "properties": {
                                                                                            "min": {
                                                                                                "description": "Le nombre minimum. \nType: `Integer`",
                                                                                                "type": "integer"
                                                                                            },
                                                                                            "max": {
                                                                                                "description": "Le nombre maximum. \nType: `Integer`",
                                                                                                "type": "integer"
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            },
                                                                            {
                                                                                "required": ["function", "damage"],
                                                                                "properties": {
                                                                                    "function": {
                                                                                        "const": "set_damage"
                                                                                    },
                                                                                    "damage": {
                                                                                        "description": "Le pourcentage de durabilité restant de l'item. \nType: `(Number | Object)`",
                                                                                        "oneOf": [
                                                                                            {
                                                                                                "type": "number",
                                                                                                "minimum": 0.0,
                                                                                                "maximum": 1.0
                                                                                            },
                                                                                            {
                                                                                                "type": "object",
                                                                                                "properties": {
                                                                                                    "min": {
                                                                                                        "description": "Le pourcentage minimum. \nType: `Number`",
                                                                                                        "type": "number",
                                                                                                        "minimum": 0.0,
                                                                                                        "maximum": 1.0
                                                                                                    },
                                                                                                    "max": {
                                                                                                        "description": "Le pourcentage maximum. \nType: `Number`",
                                                                                                        "type": "number",
                                                                                                        "minimum": 0.0,
                                                                                                        "maximum": 1.0
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                }
                                                                            },
                                                                            {
                                                                                "required": ["function", "data"],
                                                                                "properties": {
                                                                                    "function": {
                                                                                        "const": "set_data"
                                                                                    },
                                                                                    "data": {
                                                                                        "description": "La valeur de la donnée de l'item ou du bloc. \nType: `Integer`",
                                                                                        "type": "integer"
                                                                                    }
                                                                                }
                                                                            },
                                                                            {
                                                                                "required": ["function"],
                                                                                "properties": {
                                                                                    "function": {
                                                                                        "const": "set_data_from_color_index"
                                                                                    }
                                                                                }
                                                                            },
                                                                            {
                                                                                "required": ["function", "lore"],
                                                                                "properties": {
                                                                                    "function": {
                                                                                        "const": "set_lore"
                                                                                    },
                                                                                    "lore": {
                                                                                        "description": "Les lignes de lore du texte. \nType: `String[]`",
                                                                                        "type": "array",
                                                                                        "items": {
                                                                                            "type": "string"
                                                                                        }
                                                                                    }
                                                                                }
                                                                            },
                                                                            {
                                                                                "required": ["function", "name"],
                                                                                "properties": {
                                                                                    "function": {
                                                                                        "const": "set_name"
                                                                                    },
                                                                                    "name": {
                                                                                        "description": "Le nom de l'item. \nType: `String`",
                                                                                        "type": "string"
                                                                                    }
                                                                                }
                                                                            },
                                                                            {
                                                                                "required": ["function", "destination"],
                                                                                "properties": {
                                                                                    "function": {
                                                                                        "const": "exploration_map"
                                                                                    },
                                                                                    "destination": {
                                                                                        "description": "Le nom de la structure. \nType: `String`",
                                                                                        "type": "string",
                                                                                        "enum": [
                                                                                            "buriedtreasure", "endcity", "fortress", "mansion", "mineshaft", "monument", "pillageroutpost", "ruins",
                                                                                            "shipwreck", "stronghold", "temple", "village"
                                                                                        ]
                                                                                    }
                                                                                }
                                                                            },
                                                                            {
                                                                                "required": ["function", "loot_table"],
                                                                                "properties": {
                                                                                    "function": {
                                                                                        "const": "fill_container"
                                                                                    },
                                                                                    "loot_table": {
                                                                                        "description": "Le chemin d'accès de la Loot Table utilisé. \nType: `String`",
                                                                                        "type": "string"
                                                                                    }
                                                                                }
                                                                            },
                                                                            {
                                                                                "required": ["function"],
                                                                                "properties": {
                                                                                    "function": {
                                                                                        "const": "trader_material_type"
                                                                                    }
                                                                                }
                                                                            },
                                                                            {
                                                                                "required": ["function", "amplifier"],
                                                                                "properties": {
                                                                                    "function": {
                                                                                        "const": "set_ominous_bottle_amplifier"
                                                                                    },
                                                                                    "amplifier": {
                                                                                        "description": "L'amplificateur de la bouteille. \nType: `Integer | Object`",
                                                                                        "oneOf": [
                                                                                            {
                                                                                                "type": "integer"
                                                                                            },
                                                                                            {
                                                                                                "type": "object",
                                                                                                "properties": {
                                                                                                    "min": {
                                                                                                        "description": "L'amplificateur minimum. \nType: `Integer`",
                                                                                                        "type": "integer"
                                                                                                    },
                                                                                                    "max": {
                                                                                                        "description": "L'amplificateur maximum. \nType: `Integer`",
                                                                                                        "type": "integer"
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                }
                                                                            },
                                                                            {
                                                                                "required": ["function", "material", "pattern"],
                                                                                "properties": {
                                                                                    "function": {
                                                                                        "const": "set_armor_trim"
                                                                                    },
                                                                                    "material": {
                                                                                        "description": "Le matériau de la personalisation de l'armure. \nType: `String`",
                                                                                        "type": "string",
                                                                                        "$ref": "https://douarmc.github.io/minecraft_bedrock_json_schemas/common.json#/definitions/armor_trim_materials"
                                                                                    },
                                                                                    "pattern": {
                                                                                        "description": "Le motif de la personalisation de l'armure. \nType: `String`",
                                                                                        "type": "string",
                                                                                        "$ref": "https://douarmc.github.io/minecraft_bedrock_json_schemas/common.json#/definitions/armor_trim_patterns"
                                                                                    }
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                },
                                                                "filters": {
                                                                    "description": "Filtre qui doit être validé pour que l'échange soit disponible. \nType: `MinecraftFilter`",
                                                                    "$ref": "https://douarmc.github.io/minecraft_bedrock_json_schemas/common.json#/definitions/minecraft_filter"
                                                                }
                                                            }
                                                        },
                                                        {
                                                            "required": ["choice"],
                                                            "properties": {
                                                                "choice": {
                                                                    "description": "Les choix d'items possibles pour cette entrée. \nType: `Object[]`",
                                                                    "type": "array",
                                                                    "minItems": 1,
                                                                    "items": {
                                                                        "$ref": "#/properties/tiers/items/properties/groups/items/properties/trades/items/properties/wants/items/anyOf/0"
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    ]
                                                }
                                            },
                                            "gives": {
                                                "description": "Item que le marchand donne. \nType: `Object[]`",
                                                "type": "array",
                                                "minItems": 1,
                                                "maxItems": 1,
                                                "items": {
                                                    "type": "object",
                                                    "anyOf": [
                                                        {
                                                            "required": ["item"],
                                                            "properties": {
                                                                "item": {
                                                                    "description": "Item que le marchand veut. \nType: `String`",
                                                                    "type": "string"
                                                                },
                                                                "quantity": {
                                                                    "description": "Quantité de l'item que le marchand veut. \nType: `Integer | Object`",
                                                                    "default": 1,
                                                                    "oneOf": [
                                                                        {
                                                                            "type": "integer"
                                                                        },
                                                                        {
                                                                            "type": "object",
                                                                            "required": ["min", "max"],
                                                                            "properties": {
                                                                                "min": {
                                                                                    "description": "Quantité minimale de l'item que le marchand veut. \nType: `Integer`",
                                                                                    "type": "integer"
                                                                                },
                                                                                "max": {
                                                                                    "description": "Quantité maximale de l'item que le marchand veut. \nType: `Integer`",
                                                                                    "type": "integer"
                                                                                }
                                                                            }
                                                                        }
                                                                    ]
                                                                },
                                                                "price_multiplier": {
                                                                    "description": "Multiplicateur de prix qui dicte comment la quantité de base d'un item est modifiée en raison de certains événements. \nType: `Number`",
                                                                    "default": 0,
                                                                    "type": "number"
                                                                },
                                                                "functions": {
                                                                    "$ref": "#/properties/tiers/items/properties/groups/items/properties/trades/items/properties/wants/items/anyOf/0/properties/functions"
                                                                }
                                                            }
                                                        },
                                                        {
                                                            "required": ["choice"],
                                                            "properties": {
                                                                "choice": {
                                                                    "description": "Les choix d'items possibles pour cette entrée. \nType: `Object[]`",
                                                                    "type": "array",
                                                                    "minItems": 1,
                                                                    "items": {
                                                                        "$ref": "#/properties/tiers/items/properties/groups/items/properties/trades/items/properties/wants/items/anyOf/0"
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
                    "total_exp_required": {
                        "description": "Expérience totale requise pour débloquer ce tier. \nType: `Integer` \nNote: Si un nombre négatif est spécifié, le tier sera débloqué par défaut.",
                        "type": "integer"
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