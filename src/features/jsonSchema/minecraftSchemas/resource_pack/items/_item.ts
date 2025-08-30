import { SchemaType } from "../../../../../types/schema";
import { dynamicExamplesSourceKeys } from "../../../utils/shared/schemaEnums";
import { schemaPatterns } from "../../../utils/shared/schemaPatterns";
import { MinecraftJsonSchema } from "../../../../../types/minecraftJsonSchema";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier sert à définir les propriétés client d'un item.",
    type: "object",
    required: ["format_version", "minecraft:item"],
    properties: {
        format_version: {
            description: "La version du Format à utiliser.",
            type: "string",
            enum: [
                "1.8.0", "1.9.0", "1.10.0", "1.11.0", "1.12.0", "1.13.0", "1.14.0", "1.14.1", "1.14.20", "1.14.30", "1.15.0", "1.16.0", "1.16.20"
            ]
        },
        "minecraft:item": {
            description: "Contient la définition des propriétés d'un item.",
            type: "object",
            properties: {
                description: {
                    description: "Contient les propriétés de description d'un item.",
                    type: "object",
                    properties: {
                        identifier: {
                            description: "L'identifiant de l'item.",
                            type: "string",
                            pattern: schemaPatterns.identifier_with_namespace,
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.old_format_item_ids
                        },
                        category: {
                            description: "La catégorie du menu de l'inventaire dans lequel l'item sera affiché.",
                            default: "Items",
                            type: "string",
                            enum: ["Construction", "Equipment", "Items", "Nature", "commands"]
                        }
                    }
                },
                components: {
                    description: "Contient les composants du client d'un item.",
                    type: "object",
                    properties: {
                        "minecraft:hover_text_color": {
                            description: "La couleur du texte de l'item.",
                            type: "string",
                            enum: [
                                "black", "dark_blue", "dark_green", "dark_aqua", "dark_red", "dark_purple", "gold", "gray", "dark_gray", "blue", "green", "aqua", "red", "light_purple", "yellow", "white", "minecoin_gold", "material_quartz", "material_iron", "material_netherite", "material_redstone", "material_copper", "material_gold", "material_emerald", "material_diamond", "material_lapis", "material_amethyst", "material_resin"
                            ]
                        },
                        "minecraft:icon": {
                            description: "L'icône de l'item. Le référence de texture ici est doit être défini dans un fichier 'item_texture.json'.",
                            type: "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_texture_references
                        },
                        "minecraft:rarity": {
                            description: "Définit la rareté de cet Item ce qui affecte la couleur de l'item dans l'inventaire.",
                            type: "string",
                            enum: ["common", "uncommon", "rare", "epic"]
                        },
                        "minecraft:use_animation": {
                            description: "L'animation de l'item lorsqu'il est utilisé.",
                            type: "string",
                            enum: ["block","bow","brush","camera","crossbow","drink","eat","none","spear","spyglass"]
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