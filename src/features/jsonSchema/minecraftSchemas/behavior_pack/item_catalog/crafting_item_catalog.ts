import { SchemaType } from "../../../../../types/schema";
import { dynamicExamplesSourceKeys } from "../../../utils/shared/schemaEnums";
import { schemaPatterns } from "../../../utils/shared/schemaPatterns";
import { MinecraftJsonSchema } from "../../../../../types/minecraftJsonSchema";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier sert à gérer la disposition des items/blocs dans le menu créatif et dans le livre de recettes.",
    type: "object",
    required: ["format_version", "minecraft:crafting_items_catalog"],
    properties: {
        format_version: {
            description: "La version du Format à utiliser.",
            type: "string",
            enum: ["1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"]
        },
        "minecraft:crafting_items_catalog": {
            description: "Contient la définition de l'organisation des items dans le menu créatif et dans le livre de recettes.",
            type: "object",
            required: ["categories"],
            properties: {
                categories: {
                    description: "L'organisation des items pour chaque catégorie.",
                    type: "array",
                    items: {
                        type: "object",
                        required: ["category_name", "groups"],
                        properties: {
                            category_name: {
                                description: "La catégorie dans laquelle les items seront placés.",
                                type: "string",
                                enum: ["construction", "nature", "equipment", "items"]
                            },
                            groups: {
                                description: "Les groupes d'items à ajouter à la catégorie.",
                                type: "array",
                                items: {
                                    type: "object",
                                    required: ["items"],
                                    properties: {
                                        group_identifier: {
                                            description: "Champ facultatif pour donner une icône et un nom à un groupe. Sinon, les items sont ajoutés en tant qu'items individuels.",
                                            type: "object",
                                            required: ["name"],
                                            properties: {
                                                icon: {
                                                    description: "L'item ou le bloc qui sera utilisé pour l'icône du groupe.",
                                                    oneOf: [
                                                        {
                                                            type: "string",
                                                            pattern: schemaPatterns.identifier_with_namespace,
                                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                                        },
                                                        {
                                                            type: "object",
                                                            required: ["name"],
                                                            properties: {
                                                                name: {
                                                                    description: "L'item/bloc qui sera utilisé pour l'icône du groupe. Un namespace pour l'item est requis. Vous pouvez éventuellement fournir une valeur auxiliaire pour les items qui l'utilisent à la fin. Exemple: namespace:my_item:1.",
                                                                    type: "string",
                                                                    pattern: schemaPatterns.identifier_with_namespace,
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                                                }
                                                            }
                                                        }
                                                    ]
                                                },
                                                name: {
                                                    description: "L'identifiant du groupe. Il doit avoir un namespace.",
                                                    type: "string",
                                                    pattern: schemaPatterns.identifier_with_namespace,
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_group_ids
                                                }
                                            }
                                        },
                                        items: {
                                            description: "Les items à ajouter au groupe. Si `group_identifier` n'est pas défini, ces items seront dans un groupe perdu, ce qui signifie qu'ils seront affichés individuellement dans la catégorie mais à la suite. Les items qui sont déjà dans un groupe ne peuvent pas être ajoutés à un autre groupe.",
                                            type: "array",
                                            items: {
                                                oneOf: [
                                                    {
                                                        type: "string",
                                                        pattern: schemaPatterns.identifier_with_namespace,
                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                                    },
                                                    {
                                                        type: "object",
                                                        required: ["name"],
                                                        properties: {
                                                            name: {
                                                                description: "Le nom de l'item ou du bloc. Un namespace pour l'item est requis. Vous pouvez éventuellement fournir une valeur auxiliaire pour les items qui l'utilisent à la fin. Exemple: namespace:my_item:1.",
                                                                type: "string",
                                                                pattern: schemaPatterns.identifier_with_namespace,
                                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
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