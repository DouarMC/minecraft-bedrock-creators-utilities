import { SchemaType } from "../../../../../types/schema";

const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Ce fichier sert à définir les propriétés client d'un item. \nType: `Object`",
    "type": "object",
    "required": ["format_version", "minecraft:item"],
    "properties": {
        "format_version": {
            "description": "La version du Format à utiliser. \nType: `String`",
            "type": "string",
            enum: [
                "1.10", "1.10.0", "1.14", "1.14.0", "1.16", "1.16.0"
            ]
        },
        "minecraft:item": {
            "description": "Contient la définition des propriétés d'un item. \nType: `Object`",
            "type": "object",
            "properties": {
                "description": {
                    "description": "Contient les propriétés de description d'un item. \nType: `Object`",
                    "type": "object",
                    "properties": {
                        "identifier": {
                            "description": "L'identifiant de l'item. \nType: `String`",
                            "type": "string",
                            "pattern": "^[a-zA-Z0-9_]+:[a-zA-Z0-9_]+$"
                        },
                        "category": {
                            "description": "La catégorie du menu de l'inventaire dans lequel l'item sera affiché. \nType: `String`",
                            "type": "string",
                            "default": "Items",
                            "enum": ["Construction", "Equipment", "Items", "Nature", "commands"]
                        }
                    }
                },
                "components": {
                    "description": "Contient les composants du client d'un item. \nType: `Object`",
                    "type": "object",
                    "properties": {
                        "minecraft:hover_text_color": {
                            "description": "La couleur du texte de l'item. \nType: `String`",
                            "type": "string"
                        },
                        "minecraft:icon": {
                            "description": "L'icône de l'item. Le référence de texture ici est doit être défini dans un fichier 'item_texture.json' \nType: `String`",
                            "type": "string"
                        },
                        "minecraft:rarity": {
                            "description": "Définit la rareté de cet Item ce qui affecte la couleur de l'item dans l'inventaire. \nType: `String`",
                            "type": "string",
                            "enum": ["common", "uncommon", "rare", "epic"]
                        },
                        "minecraft:use_animation": {
                            "description": "L'animation de l'item lorsqu'il est utilisé. \nType: `String`",
                            "type": "string",
                            "enum": ["block","bow","brush","camera","crossbow","drink","eat","none","spear","spyglass"]
                        }
                    }
                }
            }
        }
    }
};

export const itemSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/items/*.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};