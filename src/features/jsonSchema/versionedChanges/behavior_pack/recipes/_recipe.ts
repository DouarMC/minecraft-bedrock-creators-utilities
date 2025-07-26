import { SchemaChange, SchemaType } from "../../../../../types/schema";

const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Ce fichier sert à créer une recette. \n Type : Object",
    "type": "object",
    "required": ["format_version"],
    "properties": {
        "format_version": {
            "description": "La version du Format à utiliser. \nType: `String`",
            "type": "string",
            enum: [
                "1.12.0", "1.13.0", "1.14.0", "1.14.1", "1.14.20", "1.14.30", "1.15.0", "1.16.0", "1.16.20", "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90"
            ]
        }
    },
    "oneOf": [
        {
            "required": ["minecraft:recipe_furnace"],
            "properties": {
                "minecraft:recipe_furnace": {
                    "description": "Définit une recette de Cuisson. \n Type : Object",
                    "type": "object",
                    "properties": {
                        "description": {
                            "description": "Contient les propriétés de description de la recette. \n Type : Object",
                            "type": "object",
                            "required": ["identifier"],
                            "properties": {
                                "identifier": {
                                    "description": "L'identifiant de la recette. \n Type : String",
                                    "type": "string",
                                    "pattern": "^[a-zA-Z0-9_]+:[a-zA-Z0-9_]+$"
                                }
                            }
                        },
                        "tags": {
                            "description": "Les blocs qui possède un des tags définis ici peuvent utiliser cette recette. \n Type : String[]",
                            "type": "array",
                            "items": {
                                "type": "string",
                                "enum": ["furnace", "blast_furnace", "smoker", "campfire", "soul_campfire"]
                            }
                        },
                        "input": {
                            "description": "L'item servant d'ingrédient pour cette recette. \n Type : (String | Object)",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "item": {
                                            "description": "L'identifiant de l'item. \n Type: String",
                                            "type": "string"
                                        },
                                        "tag": {
                                            "description": "L'identifiant du tag des items qui peuvent être utilisés dans ce contexte. Type: `String | Molang String`",
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
                                        },
                                        "data": {
                                            "description": "La donnée de l'item. \n Type: Integer",
                                            "type": "integer"
                                        }
                                    }
                                }
                            ]
                        },
                        "output": {
                            "description": "L'item produit par cette recette. \n Type : (String | Object)",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "item": {
                                            "description": "L'identifiant de l'item. \n Type: String",
                                            "type": "string"
                                        },
                                        "data": {
                                            "description": "La donnée de l'item. \n Type: Integer",
                                            "type": "integer"
                                        },
                                        "count": {
                                            "description": "Le nombre d'items produits. \n Type: Integer",
                                            "type": "integer"
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
            "required": ["minecraft:recipe_brewing_container"],
            "properties": {
                "minecraft:recipe_brewing_container": {
                    "description": "Définit une recette de brewing uniquement sur les potions. \n Type : Object",
                    "type": "object",
                    "required": ["description"],
                    "properties": {
                        "description": {
                            "description": "Contient les propriétés de description de la recette. \n Type : Object",
                            "type": "object",
                            "properties": {
                                "identifier": {
                                    "description": "L'identifiant de la recette. \n Type : String",
                                    "type": "string",
                                    "pattern": "^[a-zA-Z0-9_]+:[a-zA-Z0-9_]+$"
                                }
                            }
                        },
                        "tags": {
                            "description": "Les blocs qui possède un des tags définis ici peuvent utiliser cette recette. \n Type : String[]",
                            "const": ["brewing_stand"]
                        },
                        "reagent": {
                            "description": "L'item servant d'ingrédient pour cette recette. \n Type : (String | Object)",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "item": {
                                            "description": "L'identifiant de l'item. \n Type: String",
                                            "type": "string"
                                        },
                                        "tag": {
                                            "description": "L'identifiant du tag des items qui peuvent être utilisés dans ce contexte. \n Type: `String | Molang String`",
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
                                        },
                                        "data": {
                                            "description": "La donnée de l'item. \n Type: Integer",
                                            "type": "integer"
                                        }
                                    }
                                }
                            ]
                        },
                        "input": {
                            "description": "L'item à mettre dans le brewing stand. \n Type : String",
                            "type": "string",
                            "oneOf": [
                                {
                                    "enum": [
                                        "minecraft:potion",
                                        "minecraft:splash_potion",
                                        "minecraft:lingering_potion"
                                    ]
                                },
                                {
                                    "pattern": "^minecraft:potion_type:.*$"
                                }
                            ]
                        },
                        "output": {
                            "description": "L'item produit par cette recette. \n Type : String",
                            "type": "string"
                        }
                    }
                }
            }
        },
        {
            "required": ["minecraft:recipe_brewing_mix"],
            "properties": {
                "minecraft:recipe_brewing_mix": {
                    "description": "Définit une recette de brewing. \n Type : Object",
                    "type": "object",
                    "required": ["description"],
                    "properties": {
                        "description": {
                            "description": "Contient les propriétés de description de la recette. \n Type : Object",
                            "type": "object",
                            "properties": {
                                "identifier": {
                                    "description": "L'identifiant de la recette. \n Type : String",
                                    "type": "string",
                                    "pattern": "^[a-zA-Z0-9_]+:[a-zA-Z0-9_]+$"
                                }
                            }
                        },
                        "tags": {
                            "description": "Les blocs qui possède un des tags définis ici peuvent utiliser cette recette. \n Type : String[]",
                            "const": ["brewing_stand"]
                        },
                        "reagent": {
                            "description": "L'item servant d'ingrédient pour cette recette. \n Type : (String | Object)",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "item": {
                                            "description": "L'identifiant de l'item. \n Type: String",
                                            "type": "string"
                                        },
                                        "tag": {
                                            "description": "L'identifiant du tag des items qui peuvent être utilisés dans ce contexte. \n Type: `String | Molang String`",
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
                                        },
                                        "data": {
                                            "description": "La donnée de l'item. \n Type: Integer",
                                            "type": "integer"
                                        }
                                    }
                                }
                            ]
                        },
                        "input": {
                            "description": "L'item servant d'ingrédient pour cette recette. \n Type : (String | Object)",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "item": {
                                            "description": "L'identifiant de l'item. \n Type: String",
                                            "type": "string"
                                        },
                                        "tag": {
                                            "description": "L'identifiant du tag des items qui peuvent être utilisés dans ce contexte. \n Type: `String | Molang String`",
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
                                        },
                                        "data": {
                                            "description": "La donnée de l'item. \n Type: Integer",
                                            "type": "integer"
                                        }
                                    }
                                }
                            ]
                        },
                        "output": {
                            "description": "L'item produit par cette recette. \n Type : (String | Object)",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "item": {
                                            "description": "L'identifiant de l'item. \n Type: String",
                                            "type": "string"
                                        },
                                        "data": {
                                            "description": "La donnée de l'item. \n Type: Integer",
                                            "type": "integer"
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
            "required": ["minecraft:recipe_shaped"],
            "properties": {
                "minecraft:recipe_shaped": {
                    "description": "Définit une recette de craftage avec un pattern. \n Type : Object",
                    "type": "object",
                    "required": ["description"],
                    "properties": {
                        "description": {
                            "description": "Contient les propriétés de description de la recette. \n Type : Object",
                            "type": "object",
                            "properties": {
                                "identifier": {
                                    "description": "L'identifiant de la recette. \n Type : String",
                                    "type": "string",
                                    "pattern": "^[a-zA-Z0-9_]+:[a-zA-Z0-9_]+$"
                                }
                            }
                        },
                        "tags": {
                            "description": "Les blocs qui possède un des tags définis ici peuvent utiliser cette recette. \n Type : String[]",
                            "type": "array",
                            "items": {
                                "type": "string",
                                "examples": ["crafting_table"]
                            }
                        },
                        "group": {
                            "description": "On ne connait pas l'utilité de cette propriété. \n Type : String",
                            "type": "string"
                        },
                        "priority": {
                            "description": "Permet de définir un ordre de préférence entre plusieurs recettes pouvant s'appliquer dans une même situation, en privilégiant celle avec la valeur de priorité la plus basse. \n Type : Integer",
                            "type": "integer"
                        },
                        "pattern": {
                            "description": "Le pattern de cette recette de craft. \n Type : String[(1 | 2 | 3)]",
                            "type": "array",
                            "maxItems": 3,
                            "items": {
                                "type": "string",
                                "maxLength": 3
                            }
                        },
                        "assume_symmetry": {
                            "description": "Si vrai, la recette est symétrique. \n Type : Boolean",
                            "type": "boolean"
                        },
                        "key": {
                            "description": "Les items utilisés dans le pattern qu'on associe à une clé. \n Type : Object",
                            "type": "object",
                            "propertyNames": {
                                "maxLength": 1
                            },
                            "additionalProperties": {
                                "oneOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "object",
                                        "properties": {
                                            "item": {
                                                "description": "L'item associé à cette clé. \n Type : String",
                                                "type": "string"
                                            },
                                            "data": {
                                                "description": "La data de l'item. \n Type : Integer",
                                                "type": "integer"
                                            },
                                            "tag": {
                                                "description": "Les items qui possèdent ce tag peuvent être utilisés pour cette recette. \n Type : `String | Molang String`",
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
                                ]
                            }
                        },
                        "result": {
                            "description": "L'item produit par cette recette. \n Type : (String | Object | (String | Object)[])",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "item": {
                                            "description": "L'identifiant de l'item. \n Type: String",
                                            "type": "string"
                                        },
                                        "data": {
                                            "description": "La donnée de l'item. \n Type: Integer",
                                            "type": "integer"
                                        },
                                        "count": {
                                            "description": "Le nombre d'items produits. \n Type: Integer",
                                            "type": "integer"
                                        }
                                    }
                                },
                                {
                                    "type": "array",
                                    "items": {
                                        "oneOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "$ref": "#/oneOf/3/properties/minecraft:recipe_shaped/properties/result/oneOf/1"
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
            "required": ["minecraft:recipe_shapeless"],
            "properties": {
                "minecraft:recipe_shapeless": {
                    "description": "Définit une recette de craftage sans forme. \n Type : Object",
                    "type": "object",
                    "required": ["description"],
                    "properties": {
                        "description": {
                            "description": "Contient les propriétés de description de la recette. \n Type : Object",
                            "type": "object",
                            "required": ["identifier"],
                            "properties": {
                                "identifier": {
                                    "description": "L'identifiant de la recette. \n Type : String",
                                    "type": "string",
                                    "pattern": "^[a-zA-Z0-9_]+:[a-zA-Z0-9_]+$"
                                }
                            }
                        },
                        "tags": {
                            "description": "Les blocs qui possède un des tags définis ici peuvent utiliser cette recette. \n Type : String[]",
                            "type": "array",
                            "items": {
                                "type": "string",
                                "examples": ["crafting_table", "stonecutter"]
                            }
                        },
                        "group": {
                            "description": "On ne connait pas l'utilité de cette propriété. \n Type : String",
                            "type": "string"
                        },
                        "priority": {
                            "description": "Permet de définir un ordre de préférence entre plusieurs recettes pouvant s'appliquer dans une même situation, en privilégiant celle avec la valeur de priorité la plus basse. \n Type : Integer",
                            "type": "integer"
                        },
                        "ingredients": {
                            "description": "Les items utilisés pour cette recette. \n Type : (String | Object)[]",
                            "type": "array",
                            "items": {
                                "oneOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "object",
                                        "properties": {
                                            "item": {
                                                "description": "L'identifiant de l'item. \n Type: String",
                                                "type": "string"
                                            },
                                            "tag": {
                                                "description": "L'identifiant du tag des items qui peuvent être utilisés dans ce contexte. \n Type: `String | Molang String`",
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
                                            },
                                            "data": {
                                                "description": "La donnée de l'item. \n Type: Integer",
                                                "type": "integer"
                                            },
                                            "count": {
                                                "description": "Le nombre d'items produits. \n Type: Integer",
                                                "type": "integer"
                                            }
                                        }
                                    }
                                ]
                            }
                        },
                        "result": {
                            "description": "L'item produit par cette recette. \n Type : (String | Object | (String | Object)[])",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "item": {
                                            "description": "L'identifiant de l'item. \n Type: String",
                                            "type": "string"
                                        },
                                        "data": {
                                            "description": "La donnée de l'item. \n Type: Integer",
                                            "type": "integer"
                                        },
                                        "count": {
                                            "description": "Le nombre d'items produits. \n Type: Integer",
                                            "type": "integer"
                                        }
                                    }
                                },
                                {
                                    "type": "array",
                                    "items": {
                                        "oneOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "$ref": "#/oneOf/3/properties/minecraft:recipe_shaped/properties/result/oneOf/1"
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
            "required": ["minecraft:recipe_smithing_transform"],
            "properties": {
                "minecraft:recipe_smithing_transform": {
                    "description": "Définit une recette de transformation d'item en utilisant une table de forge. \n Type : Object",
                    "type": "object",
                    "required": ["description"],
                    "properties": {
                        "description": {
                            "description": "Contient les propriétés de description de la recette. \n Type : Object",
                            "type": "object",
                            "required": ["identifier"],
                            "properties": {
                                "identifier": {
                                    "description": "L'identifiant de la recette. \n Type : String",
                                    "type": "string",
                                    "pattern": "^[a-zA-Z0-9_]+:[a-zA-Z0-9_]+$"
                                }
                            }
                        },
                        "tags": {
                            "description": "Les blocs qui possède un des tags définis ici peuvent utiliser cette recette. \n Type : String[]",
                            "const": ["smithing_table"]
                        },
                        "template": {
                            "description": "L'item servant de modèle requis pour cette recette de transformation. \n Type: String \n Note: L'item doit avoir le tag 'minecraft:transform_templates'.",
                            "type": "string"
                        },
                        "base": {
                            "description": "L'item à tranformer. Ces propriétés seront copiées à l'item 'result'. \n Type: String \n Note: L'item doit être une armure ou un outil. \n Note: L'item doit avoir le tag 'minecraft:transformable_items'.",
                            "type": "string"
                        },
                        "addition": {
                            "description": "Le matériau requis pour la transformation. \n Type: String",
                            "const": "minecraft:netherite_ingot"
                        },
                        "result": {
                            "description": "L'item produit par cette recette. Type : (String | Object)",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "item": {
                                            "description": "L'identifiant de l'item. \n Type: String",
                                            "type": "string"
                                        },
                                        "data": {
                                            "description": "La donnée de l'item. \n Type: Integer",
                                            "type": "integer"
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
            "required": ["minecraft:recipe_smithing_trim"],
            "properties": {
                "minecraft:recipe_smithing_trim": {
                    "description": "Définit une recette de personnalisation d'item en utilisant une table de forge. \n Type : Object",
                    "type": "object",
                    "required": ["description"],
                    "properties": {
                        "description": {
                            "description": "Contient les propriétés de description de la recette. \n Type : Object",
                            "type": "object",
                            "required": ["identifier"],
                            "properties": {
                                "identifier": {
                                    "description": "L'identifiant de la recette. \n Type : String",
                                    "type": "string",
                                    "pattern": "^[a-zA-Z0-9_]+:[a-zA-Z0-9_]+$"
                                }
                            }
                        },
                        "tags": {
                            "description": "Les blocs qui possède un des tags définis ici peuvent utiliser cette recette. \n Type : String[]",
                            "const": ["smithing_table"]
                        },
                        "template": {
                            "description": "L'item modèle requis pour cette recette de personnalisation. \n Type: String \n Note: L'item doit avoir le tag 'minecraft:trim_templates'.",
                            "type": "string"
                        },
                        "base": {
                            "description": "L'item à personnaliser. Ces propriétés seront gardés. \n Type: String \n Note: L'item doit être une armure. \n Note: L'item doit avoir le tag 'minecraft:trimmable_armors'.",
                            "type": "string"
                        },
                        "addition": {
                            "description": "Le matériau requis pour la personnalisation. \n Type: String \n Note: L'item doit avoir le tag 'minecraft:trim_materials'.",
                            "type": "string"
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
                value: ["description", "unlock"]
            },
            {
                action: "add",
                target: ["oneOf", "4", "properties", "minecraft:recipe_shaped", "properties", "unlock"],
                value: {
                    "description": "Les conditions pour que cette recette soit considérée comme débloquée. \n Type : (Object | Array)",
                    "oneOf": [
                        {
                            "type": "object",
                            "properties": {
                                "item": {
                                    "description": "L'item à posséder pour débloquer cette recette. \n Type : String",
                                    "type": "string"
                                },
                                "data": {
                                    "description": "La data de l'item. \n Type : Integer",
                                    "type": "integer"
                                },
                                "context": {
                                    "description": "Le contexte qui doit être valide pour rendre cette recette est débloquée. \n Type : String",
                                    "type": "string",
                                    "enum": ["PlayerInWater", "PlayerHasManyItems", "AlwaysUnlocked"]
                                }
                            }
                        },
                        {
                            "type": "array",
                            "items": {
                                "$ref": "#/oneOf/3/properties/minecraft:recipe_shaped/properties/unlock/oneOf/0"
                            }
                        }
                    ]
                }
            },
            {
                action: "modify",
                target: ["oneOf", "5", "properties", "minecraft:recipe_shapeless", "required"],
                value: ["description", "unlock"]
            },
            {
                action: "add",
                target: ["oneOf", "5", "properties", "minecraft:recipe_shapeless", "properties", "unlock"],
                value: {
                    "description": "Les conditions pour que cette recette soit considérée comme débloquée. \n Type : (Object | Array)",
                    "oneOf": [
                        {
                            "type": "object",
                            "properties": {
                                "item": {
                                    "description": "L'item à posséder pour débloquer cette recette. \n Type : String",
                                    "type": "string"
                                },
                                "data": {
                                    "description": "La data de l'item. \n Type : Integer",
                                    "type": "integer"
                                },
                                "context": {
                                    "description": "Le contexte qui doit être valide pour rendre cette recette est débloquée. \n Type : String",
                                    "type": "string",
                                    "enum": ["PlayerInWater", "PlayerHasManyItems", "AlwaysUnlocked"]
                                }
                            }
                        },
                        {
                            "type": "array",
                            "items": {
                                "$ref": "#/oneOf/4/properties/minecraft:recipe_shaped/properties/unlock/oneOf/0"
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