import { SchemaType } from "../../../../../types/schema";

const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Ce fichier sert à gérer la disposition des items/blocs dans le menu créatif et dans le livre de recettes. \nType: `Object`",
    "type": "object",
    "required": ["format_version", "minecraft:crafting_items_catalog"],
    "properties": {
        "format_version": {
            "description": "La version du Format à utiliser. \nType: `String`",
            "type": "string",
            enum: ["1.21.60", "1.21.70", "1.21.80", "1.21.90"]
        },
        "minecraft:crafting_items_catalog": {
            "description": "Contient la définition de l'organisation des items dans le menu créatif et dans le livre de recettes. \nType: `Object`",
            "type": "object",
            "required": ["categories"],
            "properties": {
                "categories": {
                    "description": "L'organisation des items pour chaque catégorie. \nType: `Object[]`",
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "category_name": {
                                "description": "La catégorie dans laquelle les items seront placés. \nType: `String`",
                                "type": "string",
                                "enum": ["construction", "nature", "equipment", "items"]
                            },
                            "groups": {
                                "description": "Les groupes d'items à ajouter à la catégorie. \nType: `Object[]`",
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "required": ["items"],
                                    "properties": {
                                        "group_identifier": {
                                            "description": "Champ facultatif pour donner une icône et un nom à un groupe. Sinon, les items sont ajoutés en tant qu'items individuels. \nType: `String`",
                                            "type": "object",
                                            "required": ["name"],
                                            "properties": {
                                                "icon": {
                                                    "description": "L'item ou le bloc qui représente le groupe. \nType: `String | Object`",
                                                    "oneOf": [
                                                        {
                                                            "type": "string",
                                                            "pattern": "^(?:.)+:(?:.)+$"
                                                        },
                                                        {
                                                            "type": "object",
                                                            "required": ["name"],
                                                            "properties": {
                                                                "name": {
                                                                    "description": "Le nom de l'item ou du bloc. Un espace de noms pour l'item est requis. Vous pouvez éventuellement fournir une valeur auxiliaire pour les items qui l'utilisent à la fin. Exemple: namespace:my_item:1 \nType: `String`",
                                                                    "type": "string",
                                                                    "pattern": "^(?:.)+:(?:.)+$"
                                                                }
                                                            }
                                                        }
                                                    ]
                                                },
                                                "name": {
                                                    "description": "Une clé de localisation représentant le nom du groupe qui commence par un espace de noms. L'espace de noms 'minecraft' est réservé pour le jeu Vanilla. Créer de nouveaux noms de groupe commençant par 'minecraft' risque d'être écrasé lors de mises à jour ultérieures. \nType: `String`",
                                                    "type": "string",
                                                    "pattern": "^(?:.)+:(?:.)+$"
                                                }
                                            }
                                        },
                                        "items": {
                                            "description": "Les items à ajouter au groupe. \nType: `(String | Object)[]`",
                                            "type": "array",
                                            "items": {
                                                "oneOf": [
                                                    {
                                                        "type": "string",
                                                        "pattern": "^(?:.)+:(?:.)+$"
                                                    },
                                                    {
                                                        "type": "object",
                                                        "required": ["name"],
                                                        "properties": {
                                                            "name": {
                                                                "description": "Le nom de l'item ou du bloc. Un espace de noms pour l'item est requis. Vous pouvez éventuellement fournir une valeur auxiliaire pour les items qui l'utilisent à la fin. Exemple: namespace:my_item:1 \nType: `String`",
                                                                "type": "string",
                                                                "pattern": "^(?:.)+:(?:.)+$"
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
            }
        }
    }
};

export const craftingItemCatalogSchemaTypeBP: SchemaType = {
    fileMatch: ["**/addon/behavior_pack/item_catalog/crafting_item_catalog.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};