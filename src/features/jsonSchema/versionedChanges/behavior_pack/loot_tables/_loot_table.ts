import { SchemaType } from "../../../../../types/schema";

const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Ce fichier permet de définir une Loot Table. \nType: `Object`",
    "type": "object",
    "required": ["pools"],
    "properties": {
        "pools": {
            "description": "Répertorie toutes les Pools de la Loot Table. Une Pool correspond à un ensemble de règles déterminant les Items générés. \nType: `Object[]`",
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "conditions": {
                        "description": "Contient toutes les conditions à valider pour que cette Pool s'execute. (ou modificateur de Pool) \nType: `Object[]`",
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "condition": {
                                    "description": "Le type de condition. \nType: `String`",
                                    "type": "string",
                                    "enum": [
                                        "killed_by_player", "killed_by_player_or_pets", "random_chance", "random_chance_with_looting", "random_difficulty_chance", "random_regional_difficulty_chance", "match_tool", "killed_by_entity", "entity_properties", "entity_killed", "damaged_by_entity"
                                    ]
                                }
                            },
                            "oneOf": [
                                {
                                    "required": ["condition"],
                                    "properties": {
                                        "condition": {
                                            "enum": ["killed_by_player", "killed_by_player_or_pets"]
                                        }
                                    }
                                },
                                {
                                    "required": ["condition", "value"],
                                    "properties": {
                                        "condition": {
                                            "enum": ["has_mark_variant", "has_variant"]
                                        },
                                        "value": {
                                            "description": "La valeur de la condition. \nType: `Integer`",
                                            "type": "integer"
                                        }
                                    }
                                },
                                {
                                    "required": ["condition", "chance"],
                                    "properties": {
                                        "condition": {
                                            "enum": ["random_chance"]
                                        },
                                        "chance": {
                                            "description": "Le pourcentage de chance. \nType: `Number`",
                                            "type": "number",
                                            "minimum": 0,
                                            "maximum": 1
                                        }
                                    }
                                },
                                {
                                    "required": ["condition"],
                                    "properties": {
                                        "condition": {
                                            "enum": ["random_difficulty_chance"]
                                        },
                                        "default_chance": {
                                            "description": "La chance par défaut. \nType: `Number`",
                                            "type": "number",
                                            "minimum": 0,
                                            "maximum": 1
                                        },
                                        "peaceful": {
                                            "description": "La chance en mode pacifique. \nType: `Number`",
                                            "type": "number",
                                            "minimum": 0,
                                            "maximum": 1
                                        },
                                        "easy": {
                                            "description": "La chance en mode facile. \nType: `Number`",
                                            "type": "number",
                                            "minimum": 0,
                                            "maximum": 1
                                        },
                                        "normal": {
                                            "description": "La chance en mode normal. \nType: `Number`",
                                            "type": "number",
                                            "minimum": 0,
                                            "maximum": 1
                                        },
                                        "hard": {
                                            "description": "La chance en mode difficile. \nType: `Number`",
                                            "type": "number",
                                            "minimum": 0,
                                            "maximum": 1
                                        }
                                    }
                                },
                                {
                                    "required": ["condition", "chance", "looting_multiplier"],
                                    "properties": {
                                        "condition": {
                                            "enum": ["random_chance_with_looting"]
                                        },
                                        "chance": {
                                            "description": "Le pourcentage de chance. \nType: `Number`",
                                            "type": "number",
                                            "minimum": 0,
                                            "maximum": 1
                                        },
                                        "looting_multiplier": {
                                            "description": "Le multiplicateur de chance. \nType: `Number`",
                                            "type": "number",
                                            "minimum": 0,
                                            "maximum": 1
                                        }
                                    }
                                },
                                {
                                    "required": ["condition", "max_chance"],
                                    "properties": {
                                        "condition": {
                                            "enum": ["random_regional_difficulty_chance"]
                                        },
                                        "max_chance": {
                                            "description": "La chance maximale. \nType: `Number`",
                                            "type": "number",
                                            "minimum": 0,
                                            "maximum": 1
                                        }
                                    }
                                },
                                {
                                    "required": ["condition"],
                                    "properties": {
                                        "condition": {
                                            "enum": ["match_tool"]
                                        },
                                        "count": {
                                            "description": "Le nombre d'item. \nType: `Integer`",
                                            "oneOf": [
                                                {
                                                    "type": "object",
                                                    "properties": {
                                                        "range_min": {
                                                            "description": "Le nombre minimum. \nType: `Integer`",
                                                            "type": "integer"
                                                        },
                                                        "range_max": {
                                                            "description": "Le nombre maximum. \nType: `Integer`",
                                                            "type": "integer"
                                                        }
                                                    }
                                                },
                                                {
                                                    "type": "integer"
                                                }
                                            ]
                                        },
                                        "durability": {
                                            "description": "La durabilité. \nType: `Integer`",
                                            "type": "object",
                                            "properties": {
                                                "range_min": {
                                                    "description": "La durabilité minimale. \nType: `Integer`",
                                                    "type": "integer"
                                                },
                                                "range_max": {
                                                    "description": "La durabilité maximale. \nType: `Integer`",
                                                    "type": "integer"
                                                }
                                            }
                                        },
                                        "enchantments": {
                                            "description": "Les enchantements. \nType: `Object[]`",
                                            "type": "array",
                                            "items": {
                                                "type": "object",
                                                "properties": {
                                                    "enchantment": {
                                                        "description": "Le type d'enchantement. \nType: `String`",
                                                        "type": "string",
                                                        "$ref": "https://douarmc.github.io/minecraft_bedrock_json_schemas/common.json#/definitions/enchantments_id"
                                                    },
                                                    "levels": {
                                                        "description": "Le niveau de l'enchantement. \nType: `Integer | Object`",
                                                        "oneOf": [
                                                            {
                                                                "type": "object",
                                                                "properties": {
                                                                    "range_min": {
                                                                        "description": "Le niveau minimum. \nType: `Integer`",
                                                                        "type": "integer"
                                                                    },
                                                                    "range_max": {
                                                                        "description": "Le niveau maximum. \nType: `Integer`",
                                                                        "type": "integer"
                                                                    }
                                                                }
                                                            },
                                                            {
                                                                "type": "integer"
                                                            }
                                                        ]
                                                    }
                                                }
                                            }
                                        },
                                        "item": {
                                            "description": "Le nom de l'item. \nType: `String`",
                                            "type": "string"
                                        },
                                        "minecraft:match_tool_filter_all": {
                                            "description": "Les items qui ont tous les tags ici seront acceptés. \nType: `String[]`",
                                            "type": "array",
                                            "items": {
                                                "type": "string",
                                                "oneOf": [
                                                    {
                                                        "$ref": "https://douarmc.github.io/minecraft_bedrock_json_schemas/common.json#/definitions/vanilla_item_tags_id"
                                                    },
                                                    {
                                                        "not": {
                                                            "$ref": "https://douarmc.github.io/minecraft_bedrock_json_schemas/common.json#/definitions/vanilla_item_tags_id"
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        "minecraft:match_tool_filter_any": {
                                            "description": "Les items qui ont au moins un des tags ici seront acceptés. \nType: `String[]`",
                                            "type": "array",
                                            "items": {
                                                "type": "string",
                                                "oneOf": [
                                                    {
                                                        "$ref": "https://douarmc.github.io/minecraft_bedrock_json_schemas/common.json#/definitions/vanilla_item_tags_id"
                                                    },
                                                    {
                                                        "not": {
                                                            "$ref": "https://douarmc.github.io/minecraft_bedrock_json_schemas/common.json#/definitions/vanilla_item_tags_id"
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        "minecraft:match_tool_filter_none": {
                                            "description": "Les items qui n'ont aucun des tags ici seront acceptés. \nType: `String[]`",
                                            "type": "array",
                                            "items": {
                                                "type": "string",
                                                "oneOf": [
                                                    {
                                                        "$ref": "https://douarmc.github.io/minecraft_bedrock_json_schemas/common.json#/definitions/vanilla_item_tags_id"
                                                    },
                                                    {
                                                        "not": {
                                                            "$ref": "https://douarmc.github.io/minecraft_bedrock_json_schemas/common.json#/definitions/vanilla_item_tags_id"
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                },
                                {
                                    "required": ["condition", "entity_type"],
                                    "properties": {
                                        "condition": {
                                            "enum": ["killed_by_entity", "entity_killed", "damaged_by_entity"]
                                        },
                                        "entity_type": {
                                            "description": "Le type d'entité. \nType: `String`",
                                            "type": "string"
                                        }
                                    }
                                },
                                {
                                    "required": ["condition", "entity", "properties"],
                                    "properties": {
                                        "condition": {
                                            "enum": ["entity_properties"]
                                        },
                                        "entity": {
                                            "description": "L'entité. \nType: `String`",
                                            "type": "string",
                                            "enum": ["this"]
                                        },
                                        "properties": {
                                            "description": "Les valeurs des propriétés que doit avoir l'entité. \nType: `Object`",
                                            "type": "object",
                                            "propertyNames": {
                                                "type": "string",
                                                "pattern": "^[a-zA-Z0-9_]+:[a-zA-Z0-9_]+$"
                                            },
                                            "additionalProperties": {
                                                "oneOf": [
                                                    {
                                                        "type": "boolean"
                                                    },
                                                    {
                                                        "type": "number"
                                                    },
                                                    {
                                                        "type": "string"
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    "rolls": {
                        "description": "Le nombre de lancers aléatoires. \nType: `Integer | Object`",
                        "oneOf": [
                            {
                                "type": "object", 
                                "properties": {
                                    "min": {
                                        "description": "Le nombre minimum de lancers. \nType: `Integer`",
                                        "type": "integer"
                                    },
                                    "max": {
                                        "description": "Le nombre maximum de lancers. \nType: `Integer`",
                                        "type": "integer"
                                    }
                                }
                            },
                            {
                                "type": "integer"
                            }
                        ]
                    },
                    "bonus_rolls": {
                        "description": "Le nombre de lancer en bonus quand le joueur a l'effet de Chance. \nType: `Integer`",
                        "type": "integer"
                    },
                    "tiers": {
                        "description": "La Pool devient hierachisé. Elle suit un ordre pour choisir une seule des entrées de Loot à partir d'un index choisi aléatoirement. \nType: `Object`",
                        "type": "object",
                        "properties": {
                            "initial_range": {
                                "description": "Définit la range pour choisir l'index initial. \nType: `Integer`",
                                "type": "number"
                            },
                            "bonus_rolls": {
                                "description": "Le nombre de lancer pour avoir une chance de passer à l'index suivant. \nType: `Integer`",
                                "type": "integer"
                            },
                            "bonus_chance": {
                                "description": "Le pourcentage de chance que l'index incrémente lors d'un lancer. \nType: `Number`",
                                "type": "number",
                                "minimum": 0,
                                "maximum": 1
                            }
                        }
                    },
                    "entries": {
                        "description": "Contient toutes les entrées de Loot. \nType: `Object[]`",
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "conditions": {
                                    "description": "Contient toutes les conditions à valider pour que cette entrée de Loot s'execute. (ou modificateur de Loot) \nType: `Object[]`",
                                    "$ref": "#/properties/pools/items/properties/conditions"
                                },
                                "type": {
                                    "description": "Définit le type de Loot. \nType: `String` \n`item`: L'entrée est un item. \n`loot_table`: L'entrée est une autre Loot Table. \n`empty`: L'entrée est vide.",
                                    "type": "string",
                                    "enum": ["item", "loot_table", "empty"]
                                },
                                "name": {
                                    "description": "Définit l'item de cette entrée de Loot si le type est `item` ou le chemin d'accès de la Loot Table si le type est `loot_table`. \nType: `String`",
                                    "type": "string"
                                },
                                "weight": {
                                    "description": "Définit le poids de chance de cette entrée. \nType: `Integer`",
                                    "type": "integer",
                                    "minimum": 0
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
                                                    "enchant_random_gear", "enchant_randomly", "enchant_with_levels", "specific_enchants", "looting_enchant",
                                                    "random_aux_value", "random_block_state", "random_dye", "set_actor_id", "set_banner_details", "set_book_contents", "set_count",
                                                    "set_damage", "set_data", "set_data_from_color_index", "set_lore", "set_name", "exploration_map", "fill_container", "furnace_smelt",
                                                    "trader_material_type", "set_ominous_bottle_amplifier", "set_armor_trim", "set_potion"
                                                ]
                                            }
                                        },
                                        "oneOf": [
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
                                                        "$ref": "../common.schema.json#/definitions/potion_effects_id"
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
                                                                    "$ref": "../common.schema.json#/definitions/enchantments_id"
                                                                },
                                                                {
                                                                    "type": "object",
                                                                    "properties": {
                                                                        "id": {
                                                                            "description": "L'identifiant de l'enchantement. \nType: `String`",
                                                                            "type": "string",
                                                                            "$ref": "../common.schema.json#/definitions/enchantments_id"
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
                                                "required": ["function", "count"],
                                                "properties": {
                                                    "function": {
                                                        "enum": ["looting_enchant"]
                                                    },
                                                    "count": {
                                                        "description": "Définit le nombre d'items supllémentaires à renvoyer si l'entité est tuée par un item avec l'enchant Looting. \nType: `Object`",
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
                                                        "const": "furnace_smelt"
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
                                                        "$ref": "../common.schema.json#/definitions/armor_trim_materials"
                                                    },
                                                    "pattern": {
                                                        "description": "Le motif de la personalisation de l'armure. \nType: `String`",
                                                        "type": "string",
                                                        "$ref": "../common.schema.json#/definitions/armor_trim_patterns"
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    "quality": {
                        "description": "Définit le poids de l'entrée en fonction de la chance du joueur. \nType: `Integer`",
                        "type": "integer"
                    }
                }
            }
        }
    },
    "examples": [
        {
            "pools": [
                {
                    "rolls": 1,
                    "entries": [
                        {
                            "type": "item",
                            "name": "minecraft:stick"
                        }
                    ]
                }
            ]
        }
    ]
};

export const lootTableSchemaTypeBP: SchemaType = {
    fileMatch: ["**/addon/behavior_pack/loot_tables/**/*.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};