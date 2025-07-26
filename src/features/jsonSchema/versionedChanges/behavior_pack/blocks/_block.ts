import { schemaPatterns } from "../../../shared/schemaPatterns";
import { schemaEnums, dynamicExamplesSourceKeys } from "../../../shared/schemaEnums";
import { commonSchemas } from "../../../shared/commonSchemas";
import { SchemaChange, SchemaType } from "../../../../../types/schema";

const baseSchema = {
    "$schema": "https://json-schema.org/draft-07/schema#",
    "description": "Ce fichier crée un Bloc personnalisé.",
    "type": "object",
    "required": ["format_version", "minecraft:block"],
    "properties": {
        "format_version": {
            "description": "La version du format à utiliser.",
            "type": "string",
            "enum": [
                "1.8.0", "1.9.0", "1.10.0", "1.11.0", "1.12.0", "1.13.0", "1.14.0", "1.14.1", "1.14.20", "1.14.30", "1.15.0", "1.16.0", "1.16.20", "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90"
            ]
        },
        "minecraft:block": {
            "description": "Contient toute la définition du Bloc.",
            "type": "object",
            "required": ["description"],
            "properties": {
                "description": {
                    "description": "Contient les propeiétés de Descriptions du Bloc.",
                    "type": "object",
                    "required": ["identifier"],
                    "properties": {
                        "identifier": {
                            "description": "L'identifiant du Bloc.",
                            "type": "string",
                            "pattern": schemaPatterns.identifier_with_namespace
                        },
                        "menu_category": {
                            "description": "Définit les informations sur la localisation du Bloc dans l'inventaire créatif ou commande.",
                            "type": "object",
                            "properties": {
                                "category": {
                                    "description": "La catégorie de l'inventaire créatif ou commande dans laquelle le Bloc sera placé.",
                                    "default": "none",
                                    "type": "string",
                                    "enum": schemaEnums.menu_categories
                                },
                                "group": {
                                    "description": "Le groupe d'items du menu créatif où le Bloc sera placé.",
                                    "type": "string",
                                    "maxLength": 256,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_group_ids
                                }
                            }
                        }
                    }
                },
                "components": {
                    "description": "Contient les composants du Bloc.",
                    "type": "object",
                    "properties": {
                        "minecraft:block_light_absorption": {
                            "description": "Définit la quantité de lumière absorbée par le Bloc. (0-16)",
                            "default": 16,
                            "oneOf": [
                                {
                                    "type": "number",
                                    "minimum": 0,
                                    "maximum": 16
                                },
                                {
                                    "type": "object",
                                    "required": ["filter_level"],
                                    "properties": {
                                        "filter_level": {
                                            "description": "Le niveau de filtre de lumière du Bloc. (0-16)",
                                            "default": 16,
                                            "type": "number",
                                            "minimum": 0,
                                            "maximum": 16
                                        }
                                    }
                                }
                            ]
                        },
                        "minecraft:block_light_emission": {
                            "description": "Définit la quantité de lumière émise par le Bloc. (0-1)",
                            "default": 0,
                            "oneOf": [
                                {
                                    "type": "number",
                                    "minimum": 0,
                                    "maximum": 1
                                },
                                {
                                    "type": "object",
                                    "required": ["emission"],
                                    "properties": {
                                        "emission": {
                                            "description": "Le niveau d'émission de lumière du Bloc. (0-1)",
                                            "default": 0,
                                            "type": "number",
                                            "minimum": 0,
                                            "maximum": 1
                                        }
                                    }
                                }
                            ]
                        },
                        "minecraft:custom_components": {
                            "description": "Définit les composants personnalisés qu'utilise ce Bloc.",
                            "type": "array",
                            "items": {
                                "type": "string",
                                "pattern": schemaPatterns.identifier_with_namespace
                            }
                        },
                        "minecraft:destroy_time": {
                            "description": "Définit le temps nécessaire pour détruire le Bloc.",
                            "default": 0,
                            "oneOf": [
                                {
                                    "type": "number",
                                    "minimum": 0
                                },
                                {
                                    "type": "object",
                                    "required": ["destroy_time"],
                                    "properties": {
                                        "destroy_time": {
                                            "description": "Le temps en secondes pour détruire le Bloc.",
                                            "default": 0,
                                            "type": "number",
                                            "minimum": 0
                                        }
                                    }
                                }
                            ]
                        },
                        "minecraft:entity_fall_on": {
                            "description": "Définit la distance de chute minimale d'une entité qui tombe sur ce Bloc pour déclencher un événement de composant personnalisé.",
                            "type": "object",
                            "required": ["min_fall_distance"],
                            "properties": {
                                "min_fall_distance": {
                                    "description": "La distance de chute minimale d'une entité qui tombe sur ce Bloc pour déclencher un événement de composant personnalisé.",
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:explosion_resistance": {
                            "description": "Définit la résistance du Bloc aux explosions.",
                            "default": 0,
                            "oneOf": [
                                {
                                    "type": "number",
                                    "minimum": 0
                                },
                                {
                                    "type": "object",
                                    "required": ["resistance"],
                                    "properties": {
                                        "resistance": {
                                            "description": "La résistance du Bloc aux explosions.",
                                            "default": 0,
                                            "type": "number",
                                            "minimum": 0
                                        }
                                    }
                                }
                            ]
                        },
                        "minecraft:flammable": {
                            "description": "Définit les propriétés inflammables du Bloc.",
                            "type": "object",
                            "required": ["flame_odds", "burn_odds"],
                            "properties": {
                                "flame_odds": {
                                    "description": "La probabilité que le Bloc prenne feu lorsqu'il est exposé à une source de feu.",
                                    "default": 0,
                                    "type": "integer",
                                    "minimum": 0
                                },
                                "burn_odds": {
                                    "description": "La probabilité que le Bloc soit consumé par les flammes quand il est en feu.",
                                    "default": 0,
                                    "type": "integer",
                                    "minimum": 0
                                }
                            }
                        },
                        "minecraft:friction": {
                            "description": "Définit la friction du Bloc.",
                            "default": 0.1,
                            "oneOf": [
                                {
                                    "type": "number",
                                    "minimum": 0.1,
                                    "maximum": 1
                                },
                                {
                                    "type": "object",
                                    "required": ["friction"],
                                    "properties": {
                                        "friction": {
                                            "description": "La friction du Bloc.",
                                            "default": 0.1,
                                            "type": "number",
                                            "minimum": 0.1,
                                            "maximum": 1
                                        }
                                    }
                                }
                            ]
                        },
                        "minecraft:loot": {
                            "description": "Définit la Loot Table (table de butin) utilisée quand le Bloc est détruit.",
                            "oneOf": [
                                {
                                    "type": "string",
                                    "pattern": schemaPatterns.loot_tables_file,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.loot_table_file_paths
                                },
                                {
                                    "type": "object",
                                    "required": ["loot_table"],
                                    "properties": {
                                        "loot_table": {
                                            "description": "La Loot Table utilisée pour le Bloc.",
                                            "type": "string",
                                            "pattern": schemaPatterns.loot_tables_file,
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.loot_table_file_paths
                                        }
                                    }
                                }
                            ]
                        },
                        "minecraft:map_color": {
                            "description": "Définit la couleur du Bloc sur une carte.",
                            "oneOf": [
                                {
                                    "type": "string",
                                    "pattern": schemaPatterns.color_hex
                                },
                                {
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 255
                                    }
                                },
                                {
                                    "type": "object",
                                    "required": ["map_color"],
                                    "properties": {
                                        "map_color": {
                                            "description": "La couleur du Bloc sur une carte.",
                                            "oneOf": [
                                                {
                                                    "type": "string",
                                                    "pattern": schemaPatterns.color_hex
                                                },
                                                {
                                                    "type": "array",
                                                    "minItems": 3,
                                                    "maxItems": 3,
                                                    "items": {
                                                        "type": "integer",
                                                        "minimum": 0,
                                                        "maximum": 255
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                }
                            ]
                        },
                        "minecraft:movable": {
                            "markdownDescription":
                            `[ℹ️**Expérimentale**]: Upcoming Creator Features\n\n` +
                            "Définit comment le Bloc réagit lorsqu'il est poussé par un piston.",
                            "type": "object",
                            "required": ["movement_type"],
                            "properties": {
                                "movement_type": {
                                    "markdownDescription":
                                    "Définit le type de mouvement du Bloc lorsqu'il est poussé par un piston.\n\n" +
                                    "`push_pull`: La valeur par défaut. Le Bloc peut être poussé et tiré par un piston.\n\n" +
                                    "`push`: Le Bloc ne sera seulement poussé par un piston et ignorera les pistons collants\n\n" +
                                    "`popped`: Le Bloc sera détruit quand il est déplacé par un piston.\n\n" +
                                    "`immovable`: Le Bloc ne sera pas affecté par les pistons, il ne peut pas être poussé ou tiré.",
                                    "type": "string",
                                    "enum": ["push_pull", "push", "popped", "immovable"]
                                },
                                "sticky": {
                                    "markdownDescription":
                                    "Définit comment le loc doit gérer les blocs adjacents autour de lui lorsqu'il est poussé par un autre bloc comme un piston.\n\n" +
                                    "`none`: Valeur par défaut. N'ajoute aucun comportement en particulier.\n\n" +
                                    "`same`: Les blocs adjacents seront poussés ou tirés avec le Bloc. Celà exclut les autres blocs avec la propriété `same`. Celà ne marchera qu'avec un `movement_type` définit sur `push_pull`",
                                    "default": "none",
                                    "type": "string",
                                    "enum": ["none", "same"]
                                }
                            }
                        },
                        "minecraft:random_offset": {
                            "markdownDescription":
                            "[ℹ️**Expérimentale**]: Upcoming Creator Features\n\n" +
                            "Définit un décalage aléatoire pour la position du Bloc.",
                            "type": "object",
                            "properties": {
                                "x": {
                                    "description": "Les paramètres de décalage aléatoire en X.",
                                    "type": "object",
                                    "properties": {
                                        "range": {
                                            "description": "La plage de décalage aléatoire.",
                                            "type": "object",
                                            "properties": {
                                                "min": {
                                                    "description": "La valeur minimale du décalage aléatoire.",
                                                    "default": 0,
                                                    "type": "number",
                                                    "minimum": -8,
                                                    "maximum": 8
                                                },
                                                "max": {
                                                    "description": "La valeur maximale du décalage aléatoire.",
                                                    "default": 0,
                                                    "type": "number",
                                                    "minimum": -8,
                                                    "maximum": 8
                                                }
                                            }
                                        },
                                        "steps": {
                                            "description": "Le nombre de pas/étapes pour le décalage aléatoire",
                                            "type": "integer"
                                        }
                                    }
                                },
                                "y": {
                                    "description": "Les paramètres de décalage aléatoire en Y.",
                                    "type": "object",
                                    "properties": {
                                        "range": {
                                            "description": "La plage de décalage aléatoire.",
                                            "type": "object",
                                            "properties": {
                                                "min": {
                                                    "description": "La valeur minimale du décalage aléatoire.",
                                                    "default": 0,
                                                    "type": "number",
                                                    "minimum": -8,
                                                    "maximum": 8
                                                },
                                                "max": {
                                                    "description": "La valeur maximale du décalage aléatoire.",
                                                    "default": 0,
                                                    "type": "number",
                                                    "minimum": -8,
                                                    "maximum": 8
                                                }
                                            }
                                        },
                                        "steps": {
                                            "description": "Le nombre de pas/étapes pour le décalage aléatoire",
                                            "type": "integer"
                                        }
                                    }
                                },
                                "z": {
                                    "description": "Les paramètres de décalage aléatoire en Z.",
                                    "type": "object",
                                    "properties": {
                                        "range": {
                                            "description": "La plage de décalage aléatoire.",
                                            "type": "object",
                                            "properties": {
                                                "min": {
                                                    "description": "La valeur minimale du décalage aléatoire.",
                                                    "default": 0,
                                                    "type": "number",
                                                    "minimum": -8,
                                                    "maximum": 8
                                                },
                                                "max": {
                                                    "description": "La valeur maximale du décalage aléatoire.",
                                                    "default": 0,
                                                    "type": "number",
                                                    "minimum": -8,
                                                    "maximum": 8
                                                }
                                            }
                                        },
                                        "steps": {
                                            "description": "Le nombre de pas/étapes pour le décalage aléatoire",
                                            "type": "integer"
                                        }
                                    }
                                }
                            }
                        },
                        "minecraft:tick": {
                            "markdownDescription": "Définit les paramètres pour le déclenchement de l'événement `onTick` des composants personnalisés de ce Bloc.",
                            "type": "object",
                            "properties": {
                                "looping": {
                                    "description": "Définit si l'événement se joue en boucle.",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "interval_range": {
                                    "description": "La plage de valeurs en ticks pour le déclenchement d'évenement, la valeur sera choisi au hasard.",
                                    "default": [0, 0],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "integer",
                                        "minimum": 0
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "material_instance": {
            "oneOf": [
                {
                    "type": "string"
                },
                {
                    "type": "object",
                    "properties": {
                        "ambient_occlusion": {
                            "description": "Définit si des ombres doivent être créées autour et sous le Bloc.",
                            "default": true,
                            "type": "boolean"
                        },
                        "face_dimming": {
                            "description": "Définit si ce matériau doit être atténué par la direction dans laquelle il est orienté.",
                            "default": true,
                            "type": "boolean"
                        },
                        "render_method": {
                            markdownDescription:
                            "Définit la méthode de rendu utilisée pour le Bloc.\n\n" +
                            "`opaque`: Utilisé pour une texture de bloc standard sans couche alpha. Ne permet pas la transparence ni la translucidité. Exemples: Terre, Pierre, Béton\n\n" +
                            "`double_sided`: Utilisé pour désactiver complètement l'élimination de la face arrière.\n\n" +
                            "`blend`: Utilisé pour un bloc comme un vitrail. Permet la transparence et la translucidité (textures légèrement transparentes). Exemples: Verre, Balise, Bloc de miel\n\n" +
                            "`alpha_test`: Utilisé pour un bloc comme le verre vanilla (non teinté). Ne permet pas la translucidité, mais uniquement des textures totalement opaques ou transparentes. Désactive également l'élimination des faces arrière. Exemples: Vignes, Rails, Pousses d'arbres\n\n" +
                            "`alpha_test_single_sided`: Variante d'`alpha_test` qui conserve les mêmes propriétés (zones entièrement opaques ou transparentes, sans translucidité), **mais avec élimination des faces arrière activée**. Cela le rend plus adapté à des blocs plats comme les portes ou les trappes, où seule la face visible est rendue. Permet aussi la suppression des faces à distance. Exemples: Portes, Trappes\n\n" +
                            "`alpha_test_to_opaque`: Utilise un rendu `alpha_test` pour les joueurs qui sont à moins de la motié de la render distance, et un rendu `opaque` pour les joueurs qui sont plus loin. Exemples: Feuilles\n\n" +
                            "`alpha_test_single_sided_to_opaque`: Utilise un rendu `alpha_test_single_sided` pour les joueurs qui sont à moins de la motié de la render distance, et un rendu `opaque` pour les joueurs qui sont plus loin. Exemples: Varech\n\n" +
                            "`blend_to_opaque`: Utilise un rendu `blend` pour les joueurs qui sont à moins de la motié de la render distance, et un rendu `opaque` pour les joueurs qui sont plus loin.",
                            default: "opaque",
                            type: "string",
                            enum: ["opaque", "double_sided", "blend", "alpha_test", "alpha_test_single_sided", "alpha_test_to_opaque", "alpha_test_single_sided_to_opaque", "blend_to_opaque"]
                        },
                        "texture": {
                            description: "La référence à la texture utilisée pour cette face du Bloc.",
                            type: "string"
                        },
                        "tint_method": {
                            description: "Définit la méthode de teinte utilisée pour la couleur du Bloc.",
                            default: "none",
                            type: "string",
                            enum: schemaEnums.tint_methods
                        }
                    }
                }
            ]
        }
    }
};

const versionedChanges: SchemaChange[] = [
    {
        version: "1.18.10",
        changes: [
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:block_light_absorption"],
                notes: "Remplacé par block_light_filter"
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:block_light_filter"],
                value: {
                    description: "Définit le niveau de filtre de lumière du Bloc. (0-15)",
                    default: 15,
                    oneOf: [
                        {type: "number", minimum: 0, maximum: 15},
                        {
                            type: "object",
                            required: ["filter_level"],
                            properties: {
                                filter_level: {
                                    description: "Niveau de filtre de lumière du bloc, de 0 (aucun filtre) à 15 (filtre maximum).",
                                    default: 15,
                                    type: "number",
                                    minimum: 0,
                                    maximum: 15
                                }
                            }
                        }
                    ]
                }
            }
        ]
    },
    {
        version: "1.19.10",
        changes: [
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:block_light_filter"],
                notes: "Remplacé par light_dampening"
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:light_dampening"],
                value: {
                    description: "Définit le niveau d'atténuation de la lumière du Bloc. (0-15)",
                    default: 15,
                    type: "number",
                    minimum: 0,
                    maximum: 15
                }
            },
            {
                action: "modify",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:flammable"],
                value: {
                    markdownDescription: "Définit les propriétés inflammables du Bloc. En mettant cette valeur sur `true`, le Bloc utilisera les valeurs par défaut pour `catch_chance_modifier` et `destroy_chance_modifier`",
                    default: false,
                    oneOf: [
                        {
                            type: "boolean"
                        },
                        {
                            type: "object",
                            required: ["catch_chance_modifier", "destroy_chance_modifier"],
                            properties: {
                                catch_chance_modifier: {
                                    description: "La probabilité que le Bloc prenne feu lorsqu'il est exposé à une source de feu.",
                                    default: 5,
                                    type: "integer",
                                    minimum: 0
                                },
                                destroy_chance_modifier: {
                                    description: "La probabilité que le Bloc soit consumé par les flammes quand il est en feu.",
                                    default: 20,
                                    type: "integer",
                                    minimum: 0
                                }
                            }
                        }
                    ]
                }
            },
            {
                action: "modify",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:map_color"],
                value: {
                    description: "Définit la couleur du Bloc sur une carte.",
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
                        },
                        {
                            type: "object",
                            required: ["color"],
                            properties: {
                                color: {
                                    description: "La couleur du Bloc sur une carte.",
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
                                },
                                tint_method: {
                                    description: "La méthode de teinte utilisée sur la couleur du Bloc.",
                                    type: "string",
                                    enum: schemaEnums.tint_methods
                                }
                            }
                        }
                    ]
                }
            }
        ]
    },
    {
        version: "1.19.20",
        changes: [
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:block_light_emission"],
                notes: "Remplacé par light_emission"
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:light_emission"],
                value: {
                    description: "Définit la quantité de lumière émise par le Bloc. (0-15)",
                    default: 0,
                    type: "integer",
                    minimum: 0,
                    maximum: 15
                }
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:destroy_time"],
                notes: "Remplacé par destructible_by_mining"
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:destructible_by_mining"],
                value: {
                    markdownDescription: "Définit les propriétés de destruction du Bloc par le minage. Si cette valeur est `true`, le Bloc utilisera les valeurs par défaut pour `seconds_to_destroy`",
                    default: true,
                    oneOf: [
                        {
                            type: "boolean"
                        },
                        {
                            type: "object",
                            required: ["seconds_to_destroy"],
                            properties: {
                                seconds_to_destroy: {
                                    description: "Le temps en secondes pour détruire le Bloc.",
                                    default: 0,
                                    type: "number",
                                    minimum: 0
                                }
                            }
                        }
                    ]
                }
            },
            {
                action: "modify",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:friction"],
                value: {
                    description: "Définit la friction du Bloc. (0.0-0.9)",
                    default: 0.4,
                    type: "number",
                    minimum: 0,
                    maximum: 0.9
                }
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:explosion_resistance"],
                notes: "Remplacé par destructible_by_explosion"
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:destructible_by_explosion"],
                value: {
                    markdownDescription: "Définit les propriétés de destruction du Bloc par les explosions. Si cette valeur est `true`, le Bloc utilisera les valeurs par défaut pour `explosion_resistance`. Si cette valeur est `false`, le Bloc ne sera pas affecté par les explosions.",
                    default: true,
                    oneOf: [
                        {
                            type: "boolean"
                        },
                        {
                            type: "object",
                            required: ["explosion_resistance"],
                            properties: {
                                explosion_resistance: {
                                    description: "La résistance du Bloc aux explosions.",
                                    default: 0,
                                    type: "number",
                                    minimum: 0
                                }
                            }
                        }
                    ]
                }
            }
        ]
    },
    {
        version: "1.19.40",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "description", "properties", "menu_category", "properties", "is_hidden_in_commands"],
                value: {
                    description: "Indique si le Bloc doit être caché dans les commandes.",
                    default: false,
                    type: "boolean"
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:geometry"],
                value: {
                    description: "Définit le modèle utilisé pour le Bloc.",
                    oneOf: [
                        {
                            type: "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_model_ids
                        },
                        {
                            type: "object",
                            required: ["identifier"],
                            properties: {
                                identifier: {
                                    description: "L'identifiant du modèle pour le Bloc.",
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_model_ids
                                },
                                bone_visibility: {
                                    description: "Définit la visibilité de chaque os du modèle. Par défaut, tous les os sont visibles.",
                                    type: "object",
                                    additionalProperties: {
                                        type: "boolean"
                                    }
                                },
                                culling: {
                                    description: "L'identifiant des règles de Block Culling à utiliser pour le Bloc.",
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_culling_rules_ids
                                },
                                culling_layer: {
                                    description: "Paramètre qui définit l'identifiant de la couche de culling du Bloc. Utile pour les fichiers des règles de Block Culling.",
                                    default: "minecraft:culling_layer.undefined",
                                    type: "string",
                                    pattern: schemaPatterns.culling_layer_identifier,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.culling_layer_ids
                                }
                            }
                        }
                    ]
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:material_instances"],
                value: {
                    markdownDescription: "Permet d'assigner des textures et des propriétés de rendu spécifiques aux différentes faces du Bloc. Utilisez `*` pour définir des propriétés par défaut pour toutes les faces.",
                    type: "object",
                    properties: {
                        "*": {$ref: "#/definitions/material_instance"},
                        up: {$ref: "#/definitions/material_instance"},
                        down: {$ref: "#/definitions/material_instance"},
                        north: {$ref: "#/definitions/material_instance"},
                        south: {$ref: "#/definitions/material_instance"},
                        east: {$ref: "#/definitions/material_instance"},
                        west: {$ref: "#/definitions/material_instance"}
                    },
                    additionalProperties: {$ref: "#/definitions/material_instance"}
                }
            }
        ]
    },
    {
        version: "1.19.50",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:collision_box"],
                value: {
                    markdownDescription: "Définit la boîte de collision du Bloc. Si cette valeur est `true`, le Bloc utilisera les valeurs par défaut pour `origin` et `size`.",
                    default: true,
                    oneOf: [
                        {
                            type: "boolean"
                        },
                        {
                            type: "object",
                            properties: {
                                origin: {
                                    description: "La position de l'origine de la boîte de collision du Bloc.",
                                    default: [-8, 0, -8],
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: [
                                        {
                                            type: "number",
                                            minimum: -8,
                                            maximum: 8
                                        },
                                        {
                                            type: "number",
                                            minimum: 0,
                                            maximum: 16
                                        },
                                        {
                                            type: "number",
                                            minimum: -8,
                                            maximum: 8
                                        }
                                    ]
                                },
                                size: {
                                    description: "La taille de la boîte de collision du Bloc.",
                                    default: [16, 16, 16],
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: {
                                        type: "number"
                                    }
                                }
                            }
                        }
                    ]
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:crafting_table"],
                value: {
                    markdownDescription: "Rend le Bloc utilisable comme une table de craft ce qui ouvre l'interface de craft quand on clique dessus et permet d'utiliser des recettes de de types `recipe_shaped` et `recipe_shapeless`.",
                    type: "object",
                    required: ["crafting_tags"],
                    properties: {
                        crafting_tags: {
                            description: "Définit les tags de crafting associés au Bloc. Les recettes de craft qui possèdent au moins un de ces tags seront utilisables sur le Bloc.",
                            type: "array",
                            maxItems: 64,
                            items: {
                                type: "string",
                                maxLength: 64,
                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.crafting_recipe_tags
                            }
                        },
                        table_name: {
                            markdownDescription:
                            "**ℹ️ Texte traduisable**\n\n" +
                            "Le nom de la table de craft qui sera affiché dans l'UI. Si cette valeur n'est pas définie, le nom du Bloc sera utilisé.",
                            type: "string"
                        }
                    }
                }
            }
        ]
    },
    {
        version: "1.19.60",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:selection_box"],
                value: {
                    markdownDescription: "Définit la boîte de sélection du Bloc. Si cette valeur est `true`, le Bloc utilisera les valeurs par défaut pour `origin` et `size`.",
                    default: true,
                    oneOf: [
                        {
                            type: "boolean"
                        },
                        {
                            type: "object",
                            properties: {
                                origin: {
                                    description: "La position de l'origine de la boîte de sélection du Bloc.",
                                    default: [-8, 0, -8],
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: [
                                        {
                                            type: "number",
                                            minimum: -8,
                                            maximum: 8
                                        },
                                        {
                                            type: "number",
                                            minimum: 0,
                                            maximum: 16
                                        },
                                        {
                                            type: "number",
                                            minimum: -8,
                                            maximum: 8
                                        }
                                    ]
                                },
                                size: {
                                    description: "La taille de la boîte de sélection du Bloc.",
                                    default: [16, 16, 16],
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: {
                                        type: "number"
                                    }
                                }
                            }
                        }
                    ]
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:display_name"],
                value: {
                    markdownDescription:
                    "**ℹ️ Texte traduisable**\n\n" +
                    "Le nom affiché du Bloc dans l'inventaire et les menus. Si cette valeur n'est pas définie, le nom du Bloc sera utilisé.",
                    type: "string"
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:placement_filter"],
                value: {
                    description: "Définit les conditions de placement du Bloc.",
                    type: "object",
                    properties: {
                        conditions: {
                            description: "Liste des conditions où le Bloc peut être placé/survivre.",
                            type: "array",
                            maxItems: 64,
                            items: {
                                type: "object",
                                properties: {
                                    allowed_faces: {
                                        description: "Liste des faces sur lesquelles le Bloc peut être placé.",
                                        type: "array",
                                        items: {
                                            type: "string",
                                            enum: ["up", "down", "north", "south", "east", "west", "side", "all"]
                                        }
                                    },
                                    block_filter: {
                                        description: "Liste des blocs auquels le Bloc peut être placé à côté.",
                                        type: "array",
                                        maxItems: 64,
                                        items: {
                                            oneOf: [
                                                {
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                },
                                                commonSchemas.block_descriptor
                                            ]
                                        }
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
        version: "1.19.70",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "description", "properties", "properties"],
                value: {
                    description: "Contient les états du Bloc.",
                    type: "object",
                    patternProperties: {
                        [schemaPatterns.identifier_with_namespace]: {
                            oneOf: [
                                {
                                    type: "array",
                                    items: {
                                        oneOf: [
                                            {
                                                type: "string"
                                            },
                                            {
                                                type: "integer"
                                            },
                                            {
                                                type: "boolean"
                                            }
                                        ]
                                    }
                                },
                                {
                                    type: "object",
                                    required: ["values"],
                                    properties: {
                                        values: {
                                            description: "Les tranches de valeurs integers minimales et maximales pour l'état du Bloc.",
                                            type: "object",
                                            properties: {
                                                min: {
                                                    description: "La valeur minimale de l'état du Bloc.",
                                                    type: "integer",
                                                },
                                                max: {
                                                    description: "La valeur maximale de l'état du Bloc.",
                                                    type: "integer"
                                                }
                                            }
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
                target: ["properties", "minecraft:block", "properties", "permutations"],
                value: {
                    description: "Définit les permutations du Bloc.",
                    type: "array",
                    items: {
                        type: "object",
                        required: ["condition", "components"],
                        properties: {
                            condition: {
                                markdownDescription:
                                "**ℹ️ Expression Molang supportée.**\n\n" +
                                "La condition Molang qui doit être remplie pour que cette permutation soit appliquée.",
                                type: "molang"
                            },
                            components: {
                                description: "Les composants du Bloc pour cette permutation.",
                                $ref: "#/properties/minecraft:block/properties/components"
                            }
                        }
                    }
                }
            }
        ]
    },
    {
        version: "1.19.80",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:transformation"],
                value: {
                    description: "Définit la transformation appliquée au Bloc lors de son rendu.",
                    type: "object",
                    properties: {
                        translation: {
                            description: "La translation appliquée au Bloc.",
                            type: "array",
                            minItems: 3,
                            maxItems: 3,
                            items: {
                                type: "number"
                            }
                        },
                        rotation: {
                            description: "La rotation appliquée au Bloc.",
                            type: "array",
                            minItems: 3,
                            maxItems: 3,
                            items: {
                                type: "number",
                                multipleOf: 90
                            }
                        },
                        scale: {
                            description: "L'échelle appliquée au Bloc.",
                            type: "array",
                            minItems: 3,
                            maxItems: 3,
                            items: {
                                type: "number"
                            }
                        },
                        rotation_pivot: {
                            description: "Le point de pivot de rotation appliqué au Bloc.",
                            type: "array",
                            minItems: 3,
                            maxItems: 3,
                            items: {
                                type: "number"
                            }
                        },
                        scale_pivot: {
                            description: "Le point de pivot d'échelle appliqué au Bloc.",
                            type: "array",
                            minItems: 3,
                            maxItems: 3,
                            items: {
                                type: "number"
                            }
                        }
                    }
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:geometry", "oneOf", "1", "properties", "uv_lock"],
                value: {
                    // Description for hover, stable mode (experimental)
                    description: 
                    "[ℹ️**Expérimentale**]: `Upcoming Creator Features`\n\n" +
                    "Définit si l'orientation UV de tous les os du modèle est vérouillée, ou si l'orientation UV de certains os spécifiques est verrouillée. Pour des raisons de performance, il est recommandé d'utiliser un booléen. Notez que pour les cubes utilisant des UVs en boîte, plutôt que des UVs par face, `uv_lock` n'est pris en charge que si les faces du cube sont carrées.",
                    markdownDescription:
                    "[ℹ️**Expérimentale**]: `Upcoming Creator Features`\n\n" +
                    "Définit si l'orientation UV de tous les os du modèle est vérouillée, ou si l'orientation UV de certains os spécifiques est verrouillée. Pour des raisons de performance, il est recommandé d'utiliser un booléen. Notez que pour les cubes utilisant des UVs en boîte, plutôt que des UVs par face, `uv_lock` n'est pris en charge que si les faces du cube sont carrées.",
                    oneOf: [
                        {
                            type: "boolean"
                        },
                        {
                            type: "array",
                            items: {
                                type: "string"
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
                action: "modify",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:geometry", "oneOf", "1", "properties", "bone_visibility"],
                value: {
                    description:
                    "ℹ️ Expression Molang supportée\n\n" +
                    "Définit la visivilité de chaque os du modèle. Par défaut, tous les os sont visibles.",
                    type: "object",
                    additionalProperties: {
                        type: "molang"
                    }
                }
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "description", "properties", "properties"],
                notes: "Renommé en `states`"
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "description", "properties", "states"],
                value: {
                    description: "Contient les états du Bloc.",
                    type: "object",
                    patternProperties: {
                        [schemaPatterns.identifier_with_namespace]: {
                            oneOf: [
                                {
                                    oneOf: [
                                        {
                                            type: "array",
                                            items: {
                                                type: "string"
                                            }
                                        },
                                        {
                                            type: "array",
                                            items: {
                                                type: "integer"
                                            }
                                        },
                                        {
                                            type: "array",
                                            items: {
                                                type: "boolean"
                                            }
                                        }
                                    ]
                                },
                                {
                                    type: "object",
                                    required: ["values"],
                                    properties: {
                                        values: {
                                            description: "Les tranches de valeurs integers minimales et maximales pour l'état du Bloc.",
                                            type: "object",
                                            properties: {
                                                min: {
                                                    description: "La valeur minimale de l'état du Bloc.",
                                                    type: "integer",
                                                },
                                                max: {
                                                    description: "La valeur maximale de l'état du Bloc.",
                                                    type: "integer"
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
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
                target: ["properties", "minecraft:block", "properties", "description", "properties", "traits"],
                value: {
                    description: "Contient les traits du Bloc. Les traits ajoutes des états de Blocs built-in qui prennent une valeur en fonction d'un certain contexte.",
                    type: "object",
                    properties: {
                        "minecraft:placement_direction": {
                            description: "Trait qui peut ajouter des états de Blocs contenant des informations sur la rotation du joueur lorsque le bloc est placé.",
                            type: "object",
                            properties: {
                                enabled_states: {
                                    markdownDescription:
                                    "La liste des états built-in à activer.\n\n" +
                                    "`minecraft:cardinal_direction`: Définit l'orientation cardinale lors du placement d'un Bloc.\n\n" +
                                    "`minecraft:facing_direction`: Définit toutes les directions de placement du Bloc.",
                                    type: "array",
                                    items: {
                                        type: "string",
                                        enum: ["minecraft:cardinal_direction", "minecraft:facing_direction"]
                                    }
                                },
                                y_rotation_offset: {
                                    description: "Ajoute un décalage de rotation en Y pour les états de Bloc.",
                                    default: 0,
                                    type: "number",
                                    enum: [0, 90, 180, 270]
                                }
                            }
                        },
                        "minecraft:placement_position": {
                            description: "Trait qui peut ajouter des états de Blocs contenant des informations sur la position du Bloc lors de son placement.",
                            type: "object",
                            properties: {
                                enabled_states: {
                                    markdownDescription:
                                    "La liste des états built-in à activer.\n\n" +
                                    "`minecraft:block_face`: Indique sur quelle face du Bloc le Bloc est placé.\n\n" +
                                    "`minecraft:vertical_half`: Indique dans quelle moitié verticale de l'espace le bloc est placé.",
                                    type: "array",
                                    items: {
                                        type: "string",
                                        enum: ["minecraft:block_face", "minecraft:vertical_half"]
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
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:redstone_conductivity"],
                value: {
                    description: "Définit les propriétés basiques de redstone du Bloc. Si ce composant n'est pas définit, les valeurs par défaut seront utilisées.",
                    type: "object",
                    properties: {
                        allows_wire_to_step_down: {
                            description: "Spécifie si les fils de redstone peuvent descendre en escalier sur ce Bloc.",
                            default: true,
                            type: "boolean"
                        },
                        redstone_conductor: {
                            description: "Spécifie si le Bloc peut être alimenté par la redstone.",
                            default: false,
                            type: "boolean"
                        }
                    }
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:destructible_by_mining", "oneOf", "1", "properties", "item_specific_speeds"],
                value: {
                    description: "Liste facultative d'objets pour définir les vitesses de destruction du Bloc par des items spécifiques.",
                    type: "array",
                    items: {
                        type: "object",
                        required: ["item", "destroy_speed"],
                        properties: {
                            item: {
                                description: "L'item ou les items pour lesquels la vitesse de destruction est définie.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                    },
                                    commonSchemas.item_descriptor
                                ]
                            },
                            destroy_speed: {
                                description: "La vitesse de destruction du Bloc avec l'item spécifié.",
                                type: "number"
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
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:item_visual"],
                value: {
                    description: "Définit le modèle et les textures de l'item utilisé pour représenter le Bloc.",
                    type: "object",
                    properties: {
                        geometry: {
                            $ref: "#/properties/minecraft:block/properties/components/properties/minecraft:geometry"
                        },
                        material_instances: {
                            $ref: "#/properties/minecraft:block/properties/components/properties/minecraft:material_instances"
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
                target: ["properties", "minecraft:block", "properties", "description", "properties", "menu_category", "properties", "group"],
                value: {
                    description: "Le groupe d'items du menu créatif où le Bloc sera placé.",
                    type: "string",
                    maxLength: 256,
                    pattern: schemaPatterns.identifier_with_namespace,
                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_group_ids_with_minecraft_namespace
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:liquid_detection"],
                value: {
                    description: "Définit le comportement du Bloc lors du contact avec des liquides.",
                    type: "object",
                    required: ["detection_rules"],
                    properties: {
                        detection_rules: {
                            description: "Liste des règles de détection des liquides pour le Bloc.",
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    can_contain_liquid: {
                                        markdownDescription: "Indique si le Bloc peut contenir un liquide. Par exemple, si le type de liquide est `water`, le Bloc peut être rempli d'eau.",
                                        default: false,
                                        type: "boolean"
                                    },
                                    liquid_type: {
                                        markdownDescription: "Le type de liquide auquel cette règle s'applique. Actuellement, seul `water` est supporté.",
                                        default: "water",
                                        type: "string",
                                        enum: ["water"]
                                    },
                                    on_liquid_touches: {
                                        markdownDescription:
                                        "Définit le comportement du Bloc lorsqu'il est touché par un liquide.\n\n" +
                                        "`blocking`: La valeur par défaut. Le Bloc arrête le liquide et ne permet pas à celui-ci de le traverser.\n\n" +
                                        "`broken`: Le Bloc est complètement détruit lorsque le liquide le touche.\n\n" +
                                        "`popped`: Le Bloc est détruit, mais laisse tomber son item lorsqu'il est touché par le liquide.\n\n" +
                                        "`no_reaction`: Le Bloc n'est pas affecté par le liquide, et visuellement le liquide le traverse sans interagir avec lui.",
                                        default: "blocking",
                                        type: "string",
                                        enum: ["blocking", "broken", "popped", "no_reaction"]
                                    },
                                    stops_liquid_flowing_from_direction: {
                                        markdownDescription: "Lorsque le Bloc contient un liquide, cette propriété contrôle les directions dans lesquelles le liquide ne peut pas s'écouler depuis le Bloc. Elle contrôle également les directions dans lesquelles un Bloc peut arrêter l'écoulement du liquide si `no_reaction` est défini pour le champ `on_liquid_touches`.",
                                        type: "array",
                                        items: {
                                            type: "string",
                                            enum: ["up", "down", "north", "south", "east", "west"]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            {
                action: "modify",
                target: ["definitions", "material_instance", "oneOf", "1", "properties", "ambient_occlusion"],
                value: {
                    markdownDescription: "Définit si l'occlusion ambiante est activée pour le Bloc. Si cette valeur est `true`, le Bloc sera affecté par l'occlusion ambiante. Peut être de type `float` pour définir un niveau d'occlusion ambiante personnalisé.",
                    default: true,
                    oneOf: [
                        {
                            type: "boolean"
                        },
                        {
                            type: "number"
                        }
                    ]
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:replaceable"],
                value: {
                    description: "Si ce Bloc possède ce composant, il peut être remplacé par d'autres blocs quand ils sont placés à sa place.",
                    type: "object"
                }
            }
        ]
    },
    {
        version: "1.21.70",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:destruction_particles"],
                value: {
                    description: "Définit les particules qui seront générées lorsque le Bloc est détruit.",
                    type: "object",
                    properties: {
                        texture: {
                            markdownDescription: "La référence de la texture utilisé pour les particules de destruction du Bloc. Si cette valeur n'est pas définie, la texture `material_instance` de la face `down` du Bloc sera utilisée (ou `*` si aucune face n'est définie).",
                            type: "string"
                        },
                        tint_method: {
                            description: "La méthode de teinte à utiliser pour la couleur des particules de destruction du Bloc.",
                            default: "none",
                            type: "string",
                            enum: schemaEnums.tint_methods
                        }
                    }
                }
            },
            {
                action: "add",
                target: ["definitions", "material_instance", "oneOf", "1", "properties", "isotropic"],
                value: {
                    markdownDescription: "Définit si la texture du Bloc est isotrope, c'est-à-dire si elle a des faces randomisées. Si cette valeur est `true`, la texture du Bloc sera appliquée de manière isotrope, ce qui signifie que les faces du Bloc auront des textures aléatoires.",
                    default: false,
                    type: "boolean"
                }
            }
        ]
    },
    {
        version: "1.21.90",
        changes: [
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:custom_components"],
                notes: "Remplacé par les composants personnalisés V2."
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:destruction_particles", "properties", "particle_count"],
                value: {
                    markdownDescription:
                    `[ℹ️**Expérimentale**]: Upcoming Creator Features\n\n` +
                    "Définit le nombre de particules à générer lors de la destruction du Bloc.",
                    default: 100,
                    type: "integer",
                    minimum: 0,
                    maximum: 255
                }
            }
        ]
    }
];

const previewVersionedChanges: SchemaChange[] = [
    {
        version: "1.21.90",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:geometry", "oneOf", "1", "properties", "uv_lock"],
                value: {
                    markdownDescription: "Définit si l'orientation UV de tous les os du modèle est vérouillée, ou si l'orientation UV de certains os spécifiques est verrouillée. Pour des raisons de performance, il est recommandé d'utiliser un booléen. Notez que pour les cubes utilisant des UVs en boîte, plutôt que des UVs par face, `uv_lock` n'est pris en charge que si les faces du cube sont carrées.",
                    oneOf: [
                        {
                            type: "boolean"
                        },
                        {
                            type: "array",
                            items: {
                                type: "string"
                            }
                        }
                    ]
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:destruction_particles", "properties", "particle_count"],
                value: {
                    description: "Définit le nombre de particules à générer lors de la destruction du Bloc.",
                    default: 100,
                    type: "integer",
                    minimum: 0,
                    maximum: 255
                }
            }
        ]
    },
    {
        version: "1.0.0",
        changes: [
            {
                action: "modify",
                target: ["properties", "format_version", "enum"],
                value: [
                    "1.8.0", "1.9.0", "1.10.0", "1.11.0", "1.12.0", "1.13.0", "1.14.0", "1.14.1", "1.14.20", "1.14.30", "1.15.0", "1.16.0", "1.16.20", "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
                ]
            }
        ]
    },
    {
        version: "1.21.100",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:movable"],
                value: {
                    markdownDescription: "Définit comment le Bloc réagit lorsqu'il est poussé par un piston.",
                    type: "object",
                    required: ["movement_type"],
                    properties: {
                        movement_type: {
                            markdownDescription:
                            "Définit le type de mouvement du Bloc lorsqu'il est poussé par un piston.\n\n" +
                            "`push_pull`: La valeur par défaut. Le Bloc peut être poussé et tiré par un piston.\n\n" +
                            "`push`: Le Bloc ne sera seulement poussé par un piston et ignorera les pistons collants\n\n" +
                            "`popped`: Le Bloc sera détruit quand il est déplacé par un piston.\n\n" +
                            "`immovable`: Le Bloc ne sera pas affecté par les pistons, il ne peut pas être poussé ou tiré.",
                            type: "string",
                            enum: ["push_pull", "push", "popped", "immovable"]
                        },
                        sticky: {
                            markdownDescription:
                            "Définit comment le loc doit gérer les blocs adjacents autour de lui lorsqu'il est poussé par un autre bloc comme un piston.\n\n" +
                            "`none`: Valeur par défaut. N'ajoute aucun comportement en particulier.\n\n" +
                            "`same`: Les blocs adjacents seront poussés ou tirés avec le Bloc. Celà exclut les autres blocs avec la propriété `same`. Celà ne marchera qu'avec un `movement_type` définit sur `push_pull`",
                            default: "none",
                            type: "string",
                            enum: ["none", "same"]
                        }
                    }
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:random_offset"],
                value: {
                    description: "Définit un décalage aléatoire pour la position du Bloc.",
                    type: "object",
                    properties: {
                        x: {
                            description: "Les paramètres de décalage aléatoire en X.",
                            type: "object",
                            properties: {
                                range: {
                                    description: "La plage de décalage aléatoire.",
                                    type: "object",
                                    properties: {
                                        min: {
                                            description: "La valeur minimale du décalage aléatoire.",
                                            default: 0,
                                            type: "number",
                                            minimum: -8,
                                            maximum: 8
                                        },
                                        max: {
                                            description: "La valeur maximale du décalage aléatoire.",
                                            default: 0,
                                            type: "number",
                                            minimum: -8,
                                            maximum: 8
                                        }
                                    }
                                },
                                steps: {
                                    description: "Le nombre de pas/étapes pour le décalage aléatoire",
                                    type: "integer"
                                }
                            }
                        },
                        y: {
                            description: "Les paramètres de décalage aléatoire en Y.",
                            type: "object",
                            properties: {
                                range: {
                                    description: "La plage de décalage aléatoire.",
                                    type: "object",
                                    properties: {
                                        min: {
                                            description: "La valeur minimale du décalage aléatoire.",
                                            default: 0,
                                            type: "number",
                                            minimum: -8,
                                            maximum: 8
                                        },
                                        max: {
                                            description: "La valeur maximale du décalage aléatoire.",
                                            default: 0,
                                            type: "number",
                                            minimum: -8,
                                            maximum: 8
                                        }
                                    }
                                },
                                steps: {
                                    description: "Le nombre de pas/étapes pour le décalage aléatoire",
                                    type: "integer"
                                }
                            }
                        },
                        z: {
                            description: "Les paramètres de décalage aléatoire en Z.",
                            type: "object",
                            properties: {
                                range: {
                                    description: "La plage de décalage aléatoire.",
                                    type: "object",
                                    properties: {
                                        min: {
                                            description: "La valeur minimale du décalage aléatoire.",
                                            default: 0,
                                            type: "number",
                                            minimum: -8,
                                            maximum: 8
                                        },
                                        max: {
                                            description: "La valeur maximale du décalage aléatoire.",
                                            default: 0,
                                            type: "number",
                                            minimum: -8,
                                            maximum: 8
                                        }
                                    }
                                },
                                steps: {
                                    description: "Le nombre de pas/étapes pour le décalage aléatoire",
                                    type: "integer"
                                }
                            }
                        }
                    }
                }
            }
        ]
    }
];

export const blockSchemaTypeBP: SchemaType = {
    fileMatch: ["**/addon/behavior_pack/blocks/**/*.json"],
    baseSchema: baseSchema,
    versionedChanges: versionedChanges,
    previewVersionedChanges: previewVersionedChanges
};