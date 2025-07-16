import { SchemaChange } from "../../../schemaTypes";
import { schemaPatterns } from "../../../../utils/schemas/schemaPatterns";
import { schemaRef } from "../../../../utils/schemas/schemaEnums";
import { commonSchemas } from "../../../../utils/schemas/commonSchemas";

export const baseSchema = {
    $schema: "https://json-schema.org/draft-07/schema#",
    description: "Ce fichier crée ou modifie un Item.",
    type: "object",
    required: ["format_version", "minecraft:item"],
    properties: {
        format_version: {
            description: "La version du format à utiliser.",
            type: "string",
            enum: [
                "1.8.0", "1.9.0", "1.10.0", "1.11.0", "1.12.0", "1.13.0", "1.14.0", "1.14.1", "1.14.20", "1.14.30", "1.15.0", "1.16.0", "1.16.20", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90"
            ],
        },
        "minecraft:item": {
            description: "Contient toute la définition de l'Item.",
            type: "object",
            required: ["description"],
            properties: {
                description: {
                    description: "Contient les propriétés de description de l'Item.",
                    type: "object",
                    required: ["identifier"],
                    properties: {
                        identifier: {
                            description: "L'identifiant de l'Item.",
                            type: "string",
                            pattern: schemaPatterns.identifier_with_namespace
                        }
                    }
                },
                components: {
                    description: "Contient les composants de l'Item.",
                    type: "object",
                    properties: {
                        "minecraft:block": {
                            description: "Transforme l'Item en bloc spécifié.",
                            type: "string"
                        },
                        "minecraft:camera": {
                            description: "Permet à l'Item de placer une caméra.",
                            type: "object",
                            properties: {
                                black_bars_duration: {
                                    type: "number"
                                },
                                black_bars_screen_ratio: {
                                    type: "number"
                                },
                                shutter_duration: {
                                    type: "number"
                                },
                                shutter_screen_ratio: {
                                    type: "number"
                                },
                                picture_duration: {
                                    type: "number"
                                },
                                slide_away_duration: {
                                    type: "number"
                                }
                            }
                        },
                        "minecraft:foil": {
                            description: "Définit si l'Item possède l'effet visuel d'enchantement.",
                            default: false,
                            type: "boolean"
                        },
                        "minecraft:food": {
                            description: "Définit que l'Item est un aliment.",
                            type: "object",
                            properties: {
                                can_always_eat: {
                                    description: "Définit si l'Item peut être mangé à tout moment.",
                                    default: false,
                                    type: "boolean"
                                },
                                cooldown_time: {
                                    description: "Le temps en ticks avant de pouvoir réutiliser l'Item.",
                                    type: "integer"
                                },
                                cooldown_type: {
                                    description: "Le type de cooldown pour l'Item.",
                                    default: "none",
                                    type: "string",
                                    enum: ["chorusfruit", "none"]
                                },
                                effects: {
                                    description: "Les effets que l'Item donne lorsqu'il est mangé.",
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            name: {
                                                description: "L'identifiant de l'effet.",
                                                type: "string"
                                            },
                                            chance: {
                                                description: "La chance que l'effet soit appliqué.",
                                                default: 1,
                                                type: "number",
                                                minimum: 0,
                                                maximum: 1
                                            },
                                            duration: {
                                                description: "La durée de l'effet en secondes.",
                                                oneOf: [
                                                    {
                                                        type: "integer"
                                                    },
                                                    {
                                                        type: "string",
                                                        enum: ["infinite"]
                                                    }
                                                ]
                                            },
                                            amplifier: {
                                                description: "Le niveau d'amplificateur de l'effet.",
                                                type: "integer"
                                            }
                                        }
                                    }
                                },
                                is_meat: {
                                    type: "boolean"
                                },
                                nutrition: {
                                    description: "La quantité de nutrition que l'Item restaure.",
                                    type: "integer"
                                },
                                remove_effects: {
                                    description: "Les effets à retirer lorsque l'Item est mangé.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                on_use_action: {
                                    description: "L'action à effectuer lorsque l'Item est consommé.",
                                    default: "none",
                                    type: "string",
                                    enum: ["chorus_teleport", "suspicious_stew_effect", "none"]
                                },
                                on_use_range: {
                                    description: "Définit la zone de téléportation de l'Item.",
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: {
                                        type: "number"
                                    }
                                },
                                saturation_modifier: {
                                    description: "Le modificateur de saturation de l'Item.",
                                    type: "string",
                                    enum: ["poor", "low", "normal", "good", "max", "supernatural"]
                                },
                                using_converts_to: {
                                    description: "L'item auquel l'Item se transforme après utilisation.",
                                    type: "string"
                                }
                            }
                        },
                        "minecraft:hand_equipped": {
                            description: "Définit si l'Item est équipé à la main comme un outil/arme.",
                            default: false,
                            type: "boolean"
                        },
                        "minecraft:max_damage": {
                            description: "La durabilité maximale de l'Item. Si ce composant n'est pas défini, l'Item n'a pas de durabilité.",
                            type: "integer"
                        },
                        "minecraft:max_stack_size": {
                            description: "La taille maximale d'un stack de ce type d'Item.",
                            default: 64,
                            type: "integer",
                            maximum: 64
                        },
                        "minecraft:seed": {
                            description: "Définit que l'Item est une graine.",
                            type: "object",
                            properties: {
                                crop_result: {
                                    description: "Définit le bloc qui sera planté lorsque la graine est utilisée.",
                                    type: "string"
                                },
                                plant_at: {
                                    description: "Définit les blocs où la graine peut être plantée.",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        {
                                            type: "array",
                                            items: {
                                                type: "string"
                                            }
                                        }
                                    ]
                                },
                                plant_at_any_solid_surface: {
                                    description: "Définit si la graine peut être plantée sur n'importe quelle surface solide.",
                                    default: false,
                                    type: "boolean"
                                },
                                plant_at_face: {
                                    description: "Définit la face des blocs où la graine peut être plantée.",
                                    default: "UP",
                                    type: "string",
                                    enum: ["UP", "DOWN", "NORTH", "SOUTH", "WEST", "EAST"]
                                }
                            }
                        },
                        "minecraft:stacked_by_data": {
                            description: "Définit si l'Item peut être empilé par données aux.",
                            default: false,
                            type: "boolean"
                        },
                        "minecraft:use_duration": {
                            description: "Définit la durée d'utilisation de l'Item en ticks.",
                            type: "integer"
                        }
                    }
                }
            }
        }
    }
};

export const versionedChanges: SchemaChange[] = [
    {
        version: "1.20.0",
        changes: [
            {
                action: "add",
                target: "properties.minecraft:item.properties.description.properties.category",
                value: {
                    description: "Définit dans quelle catégorie l'Item est classé.",
                    default: "items",
                    type: "string",
                    enum: ["construction", "equipment", "items", "nature", "commands", "all", "none"]
                }
            },
            {
                action: "remove",
                target: "properties.minecraft:item.properties.components.properties.minecraft:block"
            },
            {
                action: "remove",
                target: "properties.minecraft:item.properties.components.properties.minecraft:camera"
            },
            {
                action: "remove",
                target: "properties.minecraft:item.properties.components.properties.minecraft:foil"
            },
            {
                action: "remove",
                target: "properties.minecraft:item.properties.components.properties.minecraft:food"
            },
            {
                action: "remove",
                target: "properties.minecraft:item.properties.components.properties.minecraft:hand_equipped"
            },
            {
                action: "remove",
                target: "properties.minecraft:item.properties.components.properties.minecraft:max_damage"
            },
            {
                action: "remove",
                target: "properties.minecraft:item.properties.components.properties.minecraft:max_stack_size"
            },
            {
                action: "remove",
                target: "properties.minecraft:item.properties.components.properties.minecraft:seed"
            },
            {
                action: "remove",
                target: "properties.minecraft:item.properties.components.properties.minecraft:stacked_by_data"
            },
            {
                action: "remove",
                target: "properties.minecraft:item.properties.components.properties.minecraft:use_duration"
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:display_name",
                value: {
                    description: "Le nom affiché de l'Item dans l'inventaire et les menus.",
                    type: "object",
                    required: ["value"],
                    properties: {
                        value: {
                            markdownDescription:
                            "**ℹ️ Texte traduisable**\n\n" +
                            "Le texte affiché pour l'Item. Si cette valeur n'est pas définie, le nom de l'Item sera utilisé.",
                            type: "string"
                        }
                    }
                }
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:durability",
                value: {
                    description: "Définit la durabilité de l'Item.",
                    type: "object",
                    required: ["max_durability"],
                    properties: {
                        max_durability: {
                            description: "La durabilité maximale de l'Item. Si ce composant n'est pas défini, l'Item n'a pas de durabilité.",
                            type: "integer",
                            minimum: 0
                        },
                        damage_chance: {
                            description: "Le pourcentage de chance que l'Item soit endommagé à chaque utilisation.",
                            default: 100,
                            oneOf: [
                                {
                                    type: "integer",
                                    minimum: 0,
                                    maximum: 100
                                },
                                {
                                    type: "object",
                                    properties: {
                                        min: {
                                            description: "Le pourcentage minimum de chance que l'Item soit endommagé.",
                                            type: "integer",
                                            minimum: 0,
                                            maximum: 100
                                        },
                                        max: {
                                            description: "Le pourcentage maximum de chance que l'Item soit endommagé.",
                                            type: "integer",
                                            minimum: 0,
                                            maximum: 100
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:entity_placer",
                value: {
                    description: "Permet à l'Item de placer une entité lorsqu'il est utilisé.",
                    type: "object",
                    required: ["entity"],
                    properties: {
                        dispense_on: {
                            description: "Définit les blocs sur lesquels l'Item peut être utilisé pour placer l'entité à l'aide d'un distributeur.",
                            type: "array",
                            items: {
                                oneOf: [
                                    {
                                        type: "string"
                                    },
                                    commonSchemas.block_descriptor
                                ]
                            }
                        },
                        entity: {
                            description: "L'entité à placer lorsque l'Item est utilisé.",
                            type: "string"
                        },
                        use_on: {
                            description: "Définit les blocs sur lesquels l'Item peut être utilisé pour placer l'entité.",
                            type: "array",
                            items: {
                                oneOf: [
                                    {
                                        type: "string"
                                    },
                                    commonSchemas.block_descriptor
                                ]
                            }
                        }
                    }
                }
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:fuel",
                value: {
                    description: "Définit que l'Item peut être utilisé comme combustible dans un four.",
                    type: "object",
                    required: ["duration"],
                    properties: {
                        duration: {
                            description: "La durée de combustion de l'Item en secondes.",
                            type: "number",
                            minimum: 0.05
                        }
                    }
                }
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:icon",
                value: {
                    markdownDescription: "Définit la texture qui sera utilisée pour l'icône de l'Item. La texture ici est une référence qui doit être définie dans le fichier `item_texture.json`.",
                    oneOf: [
                        {
                            type: "string"
                        },
                        {
                            type: "object",
                            required: ["texture"],
                            properties: {
                                texture: {
                                    description: "La référence de la texture de l'icône de l'Item.",
                                    type: "string"
                                }
                            }
                        }
                    ]
                }
            }
        ]
    },
    {
        version: "1.20.10",
        changes: [
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:block_placer",
                value: {
                    description: "Permet de placer un bloc lorsque l'Item est utilisé.",
                    type: "object",
                    required: ["block"],
                    properties: {
                        block: {
                            description: "L'identifiant du bloc à placer.",
                            type: "string"
                        },
                        use_on: {
                            description: "Définit les blocs sur lesquels l'Item peut être utilisé pour placer le bloc.",
                            type: "array",
                            items: {
                                oneOf: [
                                    {
                                        type: "string"
                                    },
                                    commonSchemas.block_descriptor
                                ]
                            }
                        }
                    }
                }
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:can_destroy_in_creative",
                value: {
                    description: "Définit si l'Item peut détruire des blocs en mode créatif.",
                    default: true,
                    oneOf: [
                        {
                            type: "boolean"
                        },
                        {
                            type: "object",
                            required: ["value"],
                            properties: {
                                value: {
                                    description: "Définit si l'Item peut détruire des blocs en mode créatif.",
                                    type: "boolean"
                                }
                            }
                        }
                    ]
                }
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:cooldown",
                value: {
                    description: "Définit le temps de recharge de réutilisation de l'Item.",
                    type: "object",
                    required: ["category", "duration"],
                    properties: {
                        category: {
                            description: "Définit à quelle catégorie de recharge l'Item appartient. Cela permet de regrouper les Items ayant le même temps de recharge pour qu'ils ne puissent pas être utilisés simultanément.",
                            type: "string"
                        },
                        duration: {
                            description: "Le temps de recharge de l'Item en secondes.",
                            type: "number"
                        }
                    }
                }
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:hover_text_color",
                value: {
                    description: "Définit la couleur du texte affiché lorsque l'on survole l'Item dans l'inventaire.",
                    oneOf: [
                        {
                            type: "string",
                            enum: [
                                "black", "dark_blue", "dark_green", "dark_aqua", "dark_red", "dark_purple", "gold", "gray", "dark_gray", "blue", "green", "aqua", "red", "light_purple", "yellow", "white", "minecoin_gold", "material_quartz", "material_iron", "material_netherite", "material_redstone", "material_copper", "material_gold", "material_emerald", "material_diamond", "material_lapis", "material_amethyst", "material_resin"
                            ]
                        },
                        {
                            type: "object",
                            required: ["value"],
                            properties: {
                                value: {
                                    description: "La couleur du texte affiché lorsque l'on survole l'Item dans l'inventaire.",
                                    type: "string",
                                    enum: [
                                        "black", "dark_blue", "dark_green", "dark_aqua", "dark_red", "dark_purple", "gold", "gray", "dark_gray", "blue", "green", "aqua", "red", "light_purple", "yellow", "white", "minecoin_gold", "material_quartz", "material_iron", "material_netherite", "material_redstone", "material_copper", "material_gold", "material_emerald", "material_diamond", "material_lapis", "material_amethyst", "material_resin"
                                    ]
                                }
                            }
                        }
                    ]
                }
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:max_stack_size",
                value: {
                    description: "La taille maximale d'un stack de ce type d'Item.",
                    default: 64,
                    oneOf: [
                        {
                            type: "integer",
                            minimum: 1,
                            maximum: 64
                        },
                        {
                            type: "object",
                            required: ["value"],
                            properties: {
                                value: {
                                    description: "La taille maximale d'un stack de ce type d'Item.",
                                    type: "integer",
                                    minimum: 1,
                                    maximum: 64
                                }
                            }
                        }
                    ]
                }
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:projectile",
                value: {
                    description: "Permet à l'Item d'être utilisé comme projectile.",
                    type: "object",
                    properties: {
                        minimum_critical_power: {
                            description: "La puissance minimale du projectile pour qu'il soit considéré comme critique.",
                            type: "number"
                        },
                        projectile_entity: {
                            description: "L'entité projectile qui sera lancée lorsque l'Item est utilisé.",
                            type: "string"
                        }
                    }
                }
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:record",
                value: {
                    description: "Permet à l'Item d'être utilisé comme un disque de musique.",
                    type: "object",
                    properties: {
                        comparator_signal: {
                            description: "Le signal de comparateur émis par le Jukebox lorsque cet Item y est inséré.",
                            default: 1,
                            type: "integer",
                            minimum: 1,
                            maximum: 13
                        },
                        duration: {
                            description: "La durée de la musique en secondes.",
                            type: "number"
                        },
                        sound_event: {
                            description: "L'événement sonore qui sera joué lorsque l'Item est utilisé dans un Jukebox.",
                            type: "string"
                        }
                    }
                }
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:repairable",
                value: {
                    description: "Définit les items qui peuvent être utilisés pour réparer cet Item.",
                    type: "object",
                    required: ["repair_items"],
                    properties: {
                        repair_items: {
                            description: "Les items qui peuvent être utilisés pour réparer cet Item.",
                            type: "array",
                            items: {
                                oneOf: [
                                    {
                                        oneOf: [
                                            {
                                                type: "string"
                                            },
                                            commonSchemas.item_descriptor
                                        ]
                                    },
                                    {
                                        type: "object",
                                        required: ["items", "repair_amount"],
                                        properties: {
                                            items: {
                                                description: "Les items qui peuvent être utilisés pour réparer cet Item.",
                                                type: "array",
                                                items: {
                                                    oneOf: [
                                                        {
                                                            type: "string"
                                                        },
                                                        commonSchemas.item_descriptor
                                                    ]
                                                }
                                            },
                                            repair_amount: {
                                                markdownDescription:
                                                "**ℹ️ Expression Molang supportée.**\n\n" +
                                                "La quantité de durabilité restaurée par l'utilisation de ces items pour réparer cet Item.",
                                                oneOf: [
                                                    {
                                                        type: "string"
                                                    },
                                                    {
                                                        type: "number"
                                                    },
                                                    {
                                                        type: "boolean"
                                                    }
                                                ],
                                                "x-molang": true
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
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:shooter",
                value: {
                    description: "Permet à l'Item d'être utilisé comme arme qui peut tirer des projectiles.",
                    type: "object",
                    properties: {
                        ammunition: {
                            description: "Définit les items qui peuvent être utilisés comme munitions pour cette arme.",
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    item: {
                                        description: "L'item qui peut être utilisé comme munition.",
                                        oneOf: [
                                            {
                                                type: "string"
                                            },
                                            commonSchemas.item_descriptor
                                        ]
                                    },
                                    use_offhand: {
                                        description: "Définit si l'item peut être utilisé comme munition s'il se trouve dans la main gauche.",
                                        default: false,
                                        type: "boolean"
                                    },
                                    search_inventory: {
                                        description: "Définit si la recherche de munitions doit être effectuée dans l'inventaire du joueur.",
                                        default: false,
                                        type: "boolean"
                                    },
                                    use_in_creative: {
                                        description: "Définit si les munitions sont consommées lorsque l'arme est utilisée en mode créatif.",
                                        default: false,
                                        type: "boolean"
                                    }
                                }
                            }
                        },
                        max_draw_duration: {
                            description: "Définit la durée maximale pendant laquelle l'arme peut être tenue avant de se libérer automatiquement.",
                            default: 0,
                            type: "number"
                        },
                        scale_power_by_draw_duration: {
                            description: "Définit si la puissance du projectile est proportionnelle à la durée de maintien de l'arme.",
                            default: false,
                            type: "boolean"
                        },
                        charge_on_draw: {
                            description: "Définit si l'arme doit être chargée avant de tirer.",
                            default: false,
                            type: "boolean"
                        }
                    }
                }
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:throwable",
                value: {
                    description: "Permet à l'Item d'être utilisé comme projectile jetable.",
                    type: "object",
                    properties: {
                        do_swing_animation: {
                            description: "Définit si l'animation de swing doit être jouée lorsque l'Item est jeté.",
                            default: false,
                            type: "boolean"
                        },
                        launch_power_scale: {
                            description: "Le facteur de mise à l'échelle de la puissance du lancer de l'Item.",
                            default: 1,
                            type: "number"
                        },
                        max_draw_duration: {
                            description: "La durée maximale pendant laquelle l'Item peut être maintenu avant d'être lancé.",
                            default: 0,
                            type: "number"
                        },
                        max_launch_power: {
                            description: "La puissance maximale du lancer de l'Item.",
                            default: 1,
                            type: "number"
                        },
                        min_draw_duration: {
                            description: "La durée minimale pendant laquelle l'Item doit être maintenu avant d'être lancé.",
                            default: 0,
                            type: "number"
                        },
                        scale_power_by_draw_duration: {
                            description: "Définit si la puissance du lancer de l'Item est proportionnelle à la durée de maintien.",
                            default: false,
                            type: "boolean"
                        }
                    }
                }
            }
        ]
    },
    {
        version: "1.20.20",
        changes: [
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:wearable",
                value: {
                    description: "Définit que l'Item peut être porté par le joueur dans un slot d'équipement.",
                    type: "object",
                    properties: {
                        dispensable: {
                            description: "Définit si l'Item peut être placé dans un slot d'équipement à l'aide d'un distributeur.",
                            type: "boolean"
                        },
                        protection: {
                            description: "Le niveau de protection que l'Item offre au joueur lorsqu'il est porté.",
                            default: 0,
                            type: "integer"
                        },
                        slot: {
                            description: "Le slot d'équipement dans lequel l'Item peut être porté.",
                            type: "string",
                            enum: [
                                "slot.armor.chest", "slot.armor.feet", "slot.armor.head", "slot.armor.legs", "slot.weapon.offhand"
                            ]
                        }
                    }
                }
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:hand_equipped",
                value: {
                    description: "Définit si l'Item est équipé à la main comme un outil/arme.",
                    default: false,
                    oneOf: [
                        {
                            type: "boolean"
                        },
                        {
                            type: "object",
                            required: ["value"],
                            properties: {
                                value: {
                                    description: "Définit si l'Item est équipé à la main comme un outil/arme.",
                                    type: "boolean"
                                }
                            }
                        }
                    ]
                }
            },
            {
                action: "remove",
                target: "properties.minecraft:item.properties.description.properties.category",
                notes: "Remplacé par l'objet menu_category."
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.description.properties.menu_category",
                value: {
                    description: "Définit les informations sur la localisation de l'Item dans l'inventaire créatif ou commande.",
                    type: "object",
                    properties: {
                        category: {
                            description: "La catégorie de l'inventaire créatif ou commande dans laquelle le Bloc sera placé.",
                            default: "none",
                            type: "string",
                            $ref: schemaRef.menu_categories
                        },
                        group: {
                            description: "Le groupe d'items du menu créatif où l'Item sera placé.",
                            type: "string",
                            maxLength: 256
                        },
                        is_hidden_in_commands: {
                            description: "Indique si l'Item doit être caché dans les commandes.",
                            default: false,
                            type: "boolean"
                        }
                    }
                }
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:glint",
                value: {
                    description: "Définit si l'Item doit avoir un effet de scintillement d'enchantement.",
                    default: false,
                    oneOf: [
                        {
                            type: "boolean"
                        },
                        {
                            type: "object",
                            required: ["value"],
                            properties: {
                                value: {
                                    description: "Définit si l'Item doit avoir un effet de scintillement d'enchantement.",
                                    type: "boolean"
                                }
                            }
                        }
                    ]
                }
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:use_duration",
                value: {
                    description: "Définit la durée d'utilisation de l'Item en secondes.",
                    oneOf: [
                        {
                            type: "number"
                        },
                        {
                            type: "object",
                            required: ["value"],
                            properties: {
                                value: {
                                    description: "La durée d'utilisation de l'Item en secondes.",
                                    type: "number"
                                }
                            }
                        }
                    ]
                }
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:stacked_by_data",
                value: {
                    description: "Définit si l'Item peut être empilé par des data aux.",
                    oneOf: [
                        {
                            type: "boolean"
                        },
                        {
                            type: "object",
                            required: ["value"],
                            properties: {
                                value: {
                                    description: "Définit si l'Item peut être empilé par des data aux.",
                                    type: "boolean"
                                }
                            }
                        }
                    ]
                }
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:use_animation",
                value: {
                    description: "Définit l'animation utilisée lorsque l'Item est utilisé.",
                    oneOf: [
                        {
                            type: "string",
                            enum: [
                                "block", "bow", "brush", "camera", "crossbow", "drink", "eat", "none", "spear", "spyglass"
                            ]
                        },
                        {
                            type: "object",
                            required: ["value"],
                            properties: {
                                value: {
                                    description: "L'animation utilisée lorsque l'Item est utilisé.",
                                    type: "string",
                                    enum: [
                                        "block", "bow", "brush", "camera", "crossbow", "drink", "eat", "none", "spear", "spyglass"
                                    ]
                                }
                            }
                        }
                    ]
                }
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:allow_off_hand",
                value: {
                    description: "Définit si l'Item peut être utilisé dans la main gauche.",
                    default: false,
                    oneOf: [
                        {
                            type: "boolean"
                        },
                        {
                            type: "object",
                            required: ["value"],
                            properties: {
                                value: {
                                    description: "Définit si l'Item peut être utilisé dans la main gauche.",
                                    type: "boolean"
                                }
                            }
                        }
                    ]
                }
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:should_despawn",
                value: {
                    description: "Définit si l'Item doit disparaître après un certain temps s'il n'est pas ramassé.",
                    default: true,
                    oneOf: [
                        {
                            type: "boolean"
                        },
                        {
                            type: "object",
                            required: ["value"],
                            properties: {
                                value: {
                                    description: "Définit si l'Item doit disparaître après un certain temps s'il n'est pas ramassé.",
                                    type: "boolean"
                                }
                            }
                        }
                    ]
                }
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:liquid_clipped",
                value: {
                    description: "Définit si cet Item peut intéragir avec les blocs de liquide.",
                    oneOf: [
                        {
                            type: "boolean"
                        },
                        {
                            type: "object",
                            properties: {
                                value: {
                                    description: "Définit si cet Item peut intéragir avec les blocs de liquide.",
                                    type: "boolean"
                                }
                            }
                        }
                    ]
                }
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:damage",
                value: {
                    description: "Définit le nombre de dégâts supplémentaires infligés par l'Item lorsqu'il est utilisé comme arme.",
                    oneOf: [
                        {
                            type: "integer",
                            minimum: 0
                        },
                        {
                            type: "object",
                            required: ["value"],
                            properties: {
                                value: {
                                    description: "Le nombre de dégâts supplémentaires infligés par l'Item lorsqu'il est utilisé comme arme.",
                                    type: "integer",
                                    minimum: 0
                                }
                            }
                        }
                    ]
                }
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:digger",
                value: {
                    description: "Apporte des changements de vitesse de minage de blocs lorsque l'Item est utilisé comme outil.",
                    type: "object",
                    properties: {
                        destroy_speeds: {
                            description: "La liste des blocs et la vitesse de minage associée.",
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    block: {
                                        description: "Le bloc pour lequel la vitesse de minage est définie.",
                                        oneOf: [
                                            {
                                                type: "string"
                                            },
                                            commonSchemas.block_descriptor
                                        ]
                                    },
                                    speed: {
                                        description: "Le multiplicateur de vitesse de minage pour le bloc spécifié.",
                                        type: "integer"
                                    }
                                }
                            }
                        },
                        use_efficiency: {
                            description: "Définit si l'enchantement d'efficacité doit être pris en compte pour la vitesse de minage.",
                            type: "boolean"
                        }
                    }
                }
            }
        ]
    },
    {
        version: "1.20.30",
        changes: [
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:enchantable",
                value: {
                    description: "Définit que l'Item peut être enchanté.",
                    type: "object",
                    properties: {
                        slot: {
                            description: "Définit quels types d'enchantements peuvent être appliqués à l'Item.",
                            type: "string",
                            enum: [
                                "none", "all", "sword", "spear", "bow", "crossbow", "g_armor", "armor_head", "cosmetic_head", "armor_torso", "armor_legs", "armor_feet", "elytra", "shield", "g_tool", "g_digging", "pickaxe", "shovel", "axe", "hoe", "shears", "flintsteel", "fishing_rod", "carrot_stick"
                            ]
                        },
                        value: {
                            description: "Définit la valeur d'enchantements de l'Item. Ceci est utilisé par les tables d'enchantements pour déterminer la qualité et quantité d'enchantements.",
                            type: "integer",
                            minimum: 0
                        }
                    }
                }
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:food",
                value: {
                    description: "Définit que l'Item est un aliment qui peut être consommé par le joueur.",
                    type: "object",
                    properties: {
                        can_always_eat: {
                            description: "Définit si l'Item peut être consommé même si le joueur n'a pas faim.",
                            default: false,
                            type: "boolean"
                        },
                        nutrition: {
                            description: "La quantité de faim restaurée lorsque l'Item est consommé.",
                            default: 0,
                            type: "integer",
                            minimum: 0
                        },
                        saturation_modifier: {
                            description: "Le multiplicateur de saturation de la nourriture. Plus la valeur est élevée, plus la saturation est restaurée.",
                            default: 0,
                            type: "number"
                        },
                        using_converts_to: {
                            description: "L'Item qui sera obtenu après avoir consommé cet Item. Par exemple, une pomme peut être consommée et donner un noyau de pomme.",
                            type: "string"
                        }
                    }
                }
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:interact_button",
                value: {
                    markdownDescription:
                    "**ℹ️ Texte traduisable**\n\n" +
                    "Définit si le bouton d'interaction doit être affiché lorsque l'Item est utilisé et peut définir quel texte doit être affiché.",
                    oneOf: [
                        {
                            type: "boolean"
                        },
                        {
                            type: "string"
                        }
                    ]
                }
            }
        ]
    },
    {
        version: "1.20.50",
        changes: [
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:tags",
                value: {
                    description: "Définit les tags associés à l'Item.",
                    type: "object",
                    required: ["tags"],
                    properties: {
                        tags: {
                            description: "Les tags associés à l'Item.",
                            type: "array",
                            items: {
                                type: "string"
                            }
                        }
                    }
                }
            },
            {
                action: "remove",
                target: "properties.minecraft:item.properties.components.properties.minecraft:use_duration",
                notes: "Remplacé par use_modifiers."
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:use_modifiers",
                value: {
                    description: "Définit les modificateurs d'utilisation de l'Item comme la durée d'utilisation, et la vitesse du joueur lorsqu'il utilise l'Item.",
                    type: "object",
                    properties: {
                        movement_modifier: {
                            description: "Le multiplicateur de vitesse du joueur lorsqu'il utilise l'Item.",
                            type: "number",
                            minimum: 0,
                            maximum: 1
                        },
                        use_duration: {
                            description: "La durée d'utilisation de l'Item en secondes.",
                            type: "number",
                            minimum: 0
                        }
                    }
                }
            }
        ]
    },
    {
        version: "1.20.60",
        changes: [
            {
                action: "modify",
                target: "properties.minecraft:item.properties.components.properties.minecraft:icon.oneOf.1",
                value: {
                    type: "object",
                    required: ["textures"],
                    properties: {
                        textures: {
                            description: "Contient les textures de l'Item.",
                            type: "object",
                            required: ["default"],
                            properties: {
                                default: {
                                    description: "La texture par défaut de l'Item.",
                                    type: "string"
                                },
                                icon_trim: {
                                    description: "La texture qui sera superposée sur l'icône de l'Item si ce dernier possède une personnalisation d'armure.",
                                    type: "string"
                                },
                                amethyst_palette: {
                                    description: "Le chemin d'accès vers la texture de la palette d'améthyste de l'Item.",
                                    type: "string"
                                },
                                copper_palette: {
                                    description: "Le chemin d'accès vers la texture de la palette de cuivre de l'Item.",
                                    type: "string"
                                },
                                diamond_palette: {
                                    description: "Le chemin d'accès vers la texture de la palette de diamant de l'Item.",
                                    type: "string"
                                },
                                emerald_palette: {
                                    description: "Le chemin d'accès vers la texture de la palette d'émeraude de l'Item.",
                                    type: "string"
                                },
                                gold_palette: {
                                    description: "Le chemin d'accès vers la texture de la palette d'or de l'Item.",
                                    type: "string"
                                },
                                iron_palette: {
                                    description: "Le chemin d'accès vers la texture de la palette de fer de l'Item.",
                                    type: "string"
                                },
                                lapis_palette: {
                                    description: "Le chemin d'accès vers la texture de la palette de lapis-lazuli de l'Item.",
                                    type: "string"
                                },
                                netherite_palette: {
                                    description: "Le chemin d'accès vers la texture de la palette de netherite de l'Item.",
                                    type: "string"
                                },
                                quartz_palette: {
                                    description: "Le chemin d'accès vers la texture de la palette de quartz de l'Item.",
                                    type: "string"
                                },
                                redstone_palette: {
                                    description: "Le chemin d'accès vers la texture de la palette de redstone de l'Item.",
                                    type: "string"
                                },
                                resin_palette: {
                                    description: "Le chemin d'accès vers la texture de la palette de résine de l'Item.",
                                    type: "string"
                                }
                            }
                        }
                    }
                }
            }
        ]
    },
    {
        version: "1.21.10",
        changes: [
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:custom_components",
                value: {
                    description: "Définit les composants personnalisés qu'utiise l'Item.",
                    type: "array",
                    items: {
                        type: "string",
                        pattern: schemaPatterns.identifier_with_namespace
                    }
                }
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:damage_absorption",
                value: {
                    markdownDescription: "Permet à l'Item d'absorber les dégâts destinés au porteur de cet Item. Celà consomme de la durabilité à l'Item donc l'item doit avoir le composant `minecraft:durability`.",
                    type: "object",
                    required: ["absorbable_causes"],
                    properties: {
                        absorbable_causes: {
                            description: "La liste des sources de dégâts que l'Item peut absorber.",
                            type: "array",
                            items: {
                                type: "string",
                                $ref: schemaRef.entity_damage_causes
                            }
                        }
                    }
                }
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:durability_sensor",
                value: {
                    description: "Définit des effets de particules et de son à jouer lorsque l'Item atteint des seuils de durabilité.",
                    type: "object",
                    required: ["durability_thresholds"],
                    properties: {
                        durability_thresholds: {
                            description: "La liste des seuils de durabilité à surveiller.",
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    durability: {
                                        description: "Le seuil de durabilité à surveiller.",
                                        type: "integer",
                                        minimum: 0
                                    },
                                    particle_type: {
                                        description: "L'effet de particule à jouer lorsque le seuil de durabilité est atteint.",
                                        type: "string"
                                    },
                                    sound_event: {
                                        description: "L'événement sonore à jouer lorsque le seuil de durabilité est atteint.",
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        ]
    },
    {
        version: "1.21.30",
        changes: [
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:dyeable",
                value: {
                    description: "Permet à l'Item d'être teinté avec des colorants.",
                    type: "object",
                    properties: {
                        default_color: {
                            description: "La couleur par défaut de l'Item lorsqu'il n'est pas teinté.",
                            oneOf: [
                                {
                                    type: "string",
                                    pattern: schemaPatterns.color_hex
                                },
                                {
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: {
                                        type: "integer",
                                        minimum: 0,
                                        maximum: 255
                                    }
                                }
                            ]
                        }
                    }
                }
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:rarity",
                value: {
                    markdownDescription: "Définit la rareté de l'Item. Le composant `minecraft:hover_text_color` a la priorité sur la couleur du texte de l'Item.",
                    oneOf: [
                        {
                            type: "string",
                            enum: ["common", "uncommon", "rare", "epic"]
                        },
                        {
                            type: "object",
                            required: ["value"],
                            properties: {
                                value: {
                                    description: "La rareté de l'Item.",
                                    type: "string",
                                    enum: ["common", "uncommon", "rare", "epic"]
                                }
                            }
                        }
                    ]
                }
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:icon.oneOf.1.properties.textures.properties.dyed",
                value: {
                    description: "Définit la texture à superposer sur l'icône de l'Item lorsqu'il est teinté.",
                    type: "string"
                }
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:bundle_interaction",
                value: {
                    markdownDescription: "Active l'interaction de l'Item avec les items qu'il contient. L'Item doit avoir le composant `minecraft:storage_item`.",
                    type: "object",
                    required: ["num_viewable_slots"],
                    properties: {
                        num_viewable_slots: {
                            description: "Définit le nombre de slots visibles dans l'interface de l'Item.",
                            type: "integer",
                            minimum: 1,
                            maximum: 64
                        }
                    }
                }
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:storage_item",
                value: {
                    description: "Permet à l'Item de pouvoir stocker d'autres Items à l'intérieur de lui-même. Le composant `minecraft:bundle_interaction` doit être utilisé pour activer l'interaction avec les Items stockés.",
                    type: "object",
                    properties: {
                        allow_nested_storage_items: {
                            description: "Définit si l'Item peut contenir d'autres Items de stockage à l'intérieur de lui-même.",
                            type: "boolean"
                        },
                        allowed_items: {
                            description: "La liste des Items autorisés à être stockés dans cet Item.",
                            type: "array",
                            items: {
                                oneOf: [
                                    {
                                        type: "string"
                                    },
                                    commonSchemas.item_descriptor
                                ]
                            }
                        },
                        banned_items: {
                            description: "La liste des Items interdits à être stockés dans cet Item.",
                            type: "array",
                            items: {
                                oneOf: [
                                    {
                                        type: "string"
                                    },
                                    commonSchemas.item_descriptor
                                ]
                            }
                        },
                        max_slots: {
                            description: "Le nombre maximum de slots disponibles pour stocker des Items dans cet Item.",
                            type: "integer",
                            minimum: 1,
                            maximum: 64
                        },
                        max_weight_limit: {
                            description: "Le poids maximum d'items pouvant être stockés dans cet Item. Le poids est calculé en fonction de la quantité d'Items stockés et de leur poids individuel.",
                            type: "integer",
                            minimum: 1,
                            maximum: 64
                        },
                        weight_in_storage_item: {
                            description: "Définit le poids de l'Item lorsqu'il est stocké dans un Item de stockage.",
                            type: "integer",
                            minimum: 0,
                            maximum: 64
                        }
                    }
                }
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:icon.oneOf.1.properties.textures.properties.bundle_open_back",
                value: {
                    description: "Définit la texture à utiliser pour l'arrière de l'icône de l'Item lorsqu'il est ouvert dans un Item de stockage.",
                    type: "string"
                }
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:icon.oneOf.1.properties.textures.properties.bundle_open_front",
                value: {
                    description: "Définit la texture à utiliser pour l'avant de l'icône de l'Item lorsqu'il est ouvert dans un Item de stockage.",
                    type: "string"
                }
            }
        ]
    },
    {
        version: "1.21.40",
        changes: [
            {
                action: "modify",
                target: "properties.minecraft:item.properties.components.properties.minecraft:block_placer",
                value: {
                    markdownDescription: "Permet de placer un bloc lorsque l'Item est utilisé. Si l'item ne possède pas le composant `minecraft:icon`, le bloc définit dans `block` sera utilisé comme icône de l'Item.",
                    type: "object",
                    required: ["block"],
                    properties: {
                        block: {
                            description: "L'identifiant du bloc à placer.",
                            type: "string"
                        },
                        replace_block_item: {
                            description: "Définit si l'Item remplace l'Item utilisé pour placer le bloc. Il faut que l'Item et le bloc possèdent le meme identifiant.",
                            type: "boolean"
                        },
                        use_on: {
                            description: "Définit les blocs sur lesquels l'Item peut être utilisé pour placer le bloc.",
                            type: "array",
                            items: {
                                oneOf: [
                                    {
                                        type: "string"
                                    },
                                    commonSchemas.block_descriptor
                                ]
                            }
                        }
                    }
                }
            }
        ]
    },
    {
        version: "1.21.50",
        changes: [
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:compostable",
                value: {
                    description: "Définit que l'Item peut être composté dans un composteur.",
                    type: "object",
                    properties: {
                        composting_chance: {
                            description: "La chance que l'Item soit composté avec succès.",
                            default: 100,
                            type: "integer",
                            minimum: 1,
                            maximum: 100
                        }
                    }
                }
            }
        ]
    },
    {
        version: "1.21.60",
        changes: [
            {
                action: "modify",
                target: "properties.minecraft:item.properties.description.properties.menu_category.properties.group",
                value: {
                    description: "Le groupe d'items du menu créatif où l'Item sera placé.",
                    type: "string",
                    maxLength: 256,
                    pattern: schemaPatterns.identifier_with_namespace
                }
            },
            {
                action: "remove",
                target: "properties.minecraft:item.properties.components.properties.minecraft:storage_item.properties.max_weight_limit",
                notes: "Remplacé par le composant `minecraft:storage_weight_limit`."
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:storage_weight_limit",
                value: {
                    description: "Définit le poids maximum d'items pouvant être stockés dans cet Item. Le poids est calculé en fonction de la quantité d'Items stockés et de leur poids individuel.",
                    type: "object",
                    required: ["max_weight_limit"],
                    properties: {
                        max_weight_limit: {
                            description: "Le poids maximum d'items pouvant être stockés dans cet Item.",
                            default: 64,
                            type: "integer",
                            minimum: 1,
                            maximum: 64
                        }
                    }
                }
            },
            {
                action: "remove",
                target: "properties.minecraft:item.properties.components.properties.minecraft:storage_item.properties.weight_in_storage_item",
                notes: "Remplacé par le composant `minecraft:storage_weight_modifier`."
            },
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:storage_weight_modifier",
                value: {
                    description: "Définit le poids de l'Item lorsqu'il est stocké dans un Item de stockage.",
                    type: "object",
                    required: ["weight_in_storage_item"],
                    properties: {
                        weight_in_storage_item: {
                            description: "Le poids de l'Item de stockage lorsqu'il est stocké dans un Item de stockage. Un poids de 0 signifie que l'Item ne peut pas être stocké dans un Item de stockage.",
                            default: 4,
                            type: "integer",
                            minimum: 0,
                            maximum: 64
                        }
                    }
                }
            }
        ]
    },
    {
        version: "1.21.90",
        changes: [
            {
                action: "add",
                target: "properties.minecraft:item.properties.components.properties.minecraft:wearable.properties.hides_player_location",
                value: {
                    description: "Définit si l'Item doit cacher la position du joueur dans la barre de localisation lorsqu'il est porté.",
                    default: false,
                    type: "boolean"
                }
            },
            {
                action: "remove",
                target: "properties.minecraft:item.properties.components.properties.minecraft:custom_components",
                notes: "Remplacé par les composants personnalisés V2."
            }
        ]
    }
];