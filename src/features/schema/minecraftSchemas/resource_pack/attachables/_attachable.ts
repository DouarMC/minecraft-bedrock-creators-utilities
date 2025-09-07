import { dynamicExamplesSourceKeys } from "../../../utils/shared/schemaEnums";
import { schemaPatterns } from "../../../utils/shared/schemaPatterns";
import { MinecraftJsonSchema } from "../../../../../types/minecraftJsonSchema";
import { VersionedSchema, SchemaChange } from "../../../model/versioning";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier sert à définir l'attachable d'un Item (semblable aux entités).",
    type: "object",
    required: ["format_version", "minecraft:attachable"],
    properties: {
        format_version: {
            description: "La version du Format à utiliser.",
            type: "string",
            enum: [
                "1.8.0", "1.9.0", "1.10.0", "1.11.0", "1.12.0", "1.13.0", "1.14.0", "1.14.1", "1.14.20", "1.14.30", "1.15.0", "1.16.0", "1.16.20", "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
            ]
        },
        "minecraft:attachable": {
            description: "Contient toute la définition de l'Attachable.",
            type: "object",
            required: ["description"],
            properties: {
                description: {
                    description: "Contient les propeiétés de descriptions de l'Attachable.",
                    type: "object",
                    required: ["identifier"],
                    properties: {
                        identifier: {
                            description: "L'identifiant de cet Attachable. Cet Attachable sera associé automatiquement à l'Item avec le même identifiant.",
                            type: "string",
                            pattern: schemaPatterns.identifier_with_namespace,
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_attachable_ids
                        },
                        materials: {
                            description: "Les Materiels à référencer pour cet Attachable.",
                            type: "object",
                            properties: {
                                default: {
                                    description: "Le Materiel par défaut de l'Attachable.",
                                    type: "string",
                                    examples: ["armor", "entity_alphatest", "elytra", "armor_leather"]
                                },
                                enchanted: {
                                    description: "Le Materiel enchanté de l'Attachable.",
                                    type: "string",
                                    examples: ["armor_enchanted", "entity_alphatest_glint", "elytra_glint", "armor_leather_enchanted"]
                                }
                            },
                            additionalProperties: {
                                type: "string"
                            }
                        },
                        textures: {
                            description: "Les Textures à référencer pour cet Attachable.",
                            type: "object",
                            properties: {
                                default: {
                                    description: "La Texture par défaut de l'Attachable.",
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.texture_file_paths
                                },
                                enchanted: {
                                    description: "La Texture enchantée de l'Attachable. \n Type: `String`",
                                    type: "string",
                                    examples: ["textures/misc/enchanted_item_glint", "textures/misc/enchanted_actor_glint"],
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.texture_file_paths
                                }
                            },
                            additionalProperties: {
                                type: "string",
                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.texture_file_paths
                            }
                        },
                        geometry: {
                            description: "Les Modèles à référencer pour cet Attachable.",
                            type: "object",
                            properties: {
                                default: {
                                    description: "Le Modèle par défaut de l'Attachable.",
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.model_ids
                                }
                            },
                            additionalProperties: {
                                type: "string",
                                pattern: "^geometry\\..*"
                            }
                        },
                        animations: {
                            description: "Les animations et controlleurs d'animations à référencer pour cet Attachable.",
                            type: "object",
                            additionalProperties: {
                                type: "string",
                                pattern: [schemaPatterns.animation_identifier, schemaPatterns.animation_controller_identifier],
                                "x-dynamic-examples-source": [dynamicExamplesSourceKeys.resource_animation_ids, dynamicExamplesSourceKeys.resource_animation_controller_ids]
                            }
                        },
                        render_controllers: {
                            description: "La liste des render controllers.",
                            type: "array",
                            items: {
                                oneOf: [
                                    {
                                        type: "string",
                                        pattern: schemaPatterns.render_controller_identifier,
                                        examples: ["controller.render.armor", "controller.render.item_default"],
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.render_controller_ids
                                    },
                                    {
                                        type: "object",
                                        propertyNames: {
                                            type: "string",
                                            pattern: "^controller\\.render\\..*",
                                            examples: ["controller.render.armor", "controller.render.item_default"],
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.render_controller_ids
                                        },
                                        additionalProperties: {
                                            type: "string"
                                        }
                                    }
                                ]
                            }
                        },
                        scripts: {
                            description: "Définit certains scripts que l'Attachable execute à certains moments.",
                            type: "object",
                            properties: {
                                parent_setup: {
                                    description: "Définit la visibilité des éléments du parent avec l'aide de variables Molang.",
                                    type: "string"
                                },
                                scale: {
                                    description: "Définit la taille du modèle de l'Attachable.",
                                    type: "molang"
                                },
                                scaleX: {
                                    description: "Définit la taille X du modèle de l'Attachable.",
                                    type: "molang"
                                },
                                scaleY: {
                                    description: "Définit la taille Y du modèle de l'Attachable.",
                                    type: "molang"
                                },
                                scaleZ: {
                                    description: "Définit la taille Z du modèle de l'Attachable.",
                                    type: "molang"
                                },
                                initialize: {
                                    description: "Ce script s'exécute lors de la première initialisation de l'Attachable, c'est-à-dire lorsqu'elle apparaît et à chaque fois qu'elle est chargée.",
                                    type: "array",
                                    items: {
                                        type: "molang"
                                    }
                                },
                                pre_animation: {
                                    description: "Ce script s'exécute chaque image avant la lecture des animations. Ceci est utile pour calculer les variables qui seront utilisées dans les animations et qui doivent être calculées avant l'exécution de l'animation.",
                                    type: "array",
                                    items: {
                                        type: "molang"
                                    }
                                },
                                animate: {
                                    description: "Ce script s'exécute chaque image après `pre_animation`. C'est ici que vous exécutez des animations et des contrôleurs d'animation. Chaque image, chaque animation ou contrôleur d'animation de cette clé sera exécuté.",
                                    type: "array",
                                    items: {
                                        oneOf: [
                                            {
                                                type: "molang"
                                            },
                                            {
                                                type: "object",
                                                additionalProperties: {
                                                    type: "molang"
                                                }
                                            }
                                        ]
                                    }
                                },
                                should_update_bones_and_effects_offscreen: {
                                    description: "Si `true`, les os et les effets seront toujours mis à jour si l'Attachable est hors écran.",
                                    default: false,
                                    type: "molang"
                                },
                                should_update_effects_offscreen: {
                                    description: "Si `true`, les effets seront toujours mis à jour si l'Attachable est hors écran.",
                                    default: false,
                                    type: "molang"
                                }
                            }
                        },
                        particle_effects: {
                            description: "Les effets de particules à référencer pour l'Attachable.",
                            type: "object",
                            additionalProperties: {
                                type: "string"
                            }
                        },
                        sound_effects: {
                            description: "Les effets de sons à référencer pour l'Attachable.",
                            type: "object",
                            additionalProperties: {
                                type: "string"
                            }
                        }
                    }
                }
            }
        }
    }
};

const versionedChanges: SchemaChange[] = [
    {
        version: "1.10.0",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:attachable", "properties", "description", "properties", "item"],
                value: {
                    description: "Définit l'Item auquel cet Attachable. Il est possible de définir une requête Molang qu doit être valide pour que l'Attachable soit associé à l'Item.",
                    oneOf: [
                        {
                            type: "string"
                        },
                        {
                            type: "object",
                            additionalProperties: {
                                type: "string"
                            }
                        }
                    ]
                }
            }
        ]
    },
    {
        version: "1.20.60",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:attachable", "properties", "description", "properties", "textures", "properties", "bolt_trim"],
                value: {
                    description: "Le chemin d'accès au fichier de texture de la garniture `bolt` utilisé pour l'armor-trim.",
                    type: "string"
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:attachable", "properties", "description", "properties", "textures", "properties", "coast_trim"],
                value: {
                    description: "Le chemin d'accès au fichier de texture de la garniture 'coast' utilisé pour l'armor-trim.",
                    type: "string"
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:attachable", "properties", "description", "properties", "textures", "properties", "dune_trim"],
                value: {
                    description: "Le chemin d'accès au fichier de texture de la garniture 'dune' utilisé pour l'armor-trim.",
                    type: "string"
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:attachable", "properties", "description", "properties", "textures", "properties", "eye_trim"],
                value: {
                    description: "Le chemin d'accès au fichier de texture de la garniture 'eye' utilisé pour l'armor-trim.",
                    type: "string"
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:attachable", "properties", "description", "properties", "textures", "properties", "flow_trim"],
                value: {
                    description: "Le chemin d'accès au fichier de texture de la garniture 'flow' utilisé pour l'armor-trim.",
                    type: "string"
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:attachable", "properties", "description", "properties", "textures", "properties", "host_trim"],
                value: {
                    description: "Le chemin d'accès au fichier de texture de la garniture 'host' utilisé pour l'armor-trim.",
                    type: "string"
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:attachable", "properties", "description", "properties", "textures", "properties", "raiser_trim"],
                value: {
                    description: "Le chemin d'accès au fichier de texture de la garniture 'raiser' utilisé pour l'armor-trim.",
                    type: "string"
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:attachable", "properties", "description", "properties", "textures", "properties", "rib_trim"],
                value: {
                    description: "Le chemin d'accès au fichier de texture de la garniture 'rib' utilisé pour l'armor-trim.",
                    type: "string"
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:attachable", "properties", "description", "properties", "textures", "properties", "sentry_trim"],
                value: {
                    description: "Le chemin d'accès au fichier de texture de la garniture 'sentry' utilisé pour l'armor-trim.",
                    type: "string"
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:attachable", "properties", "description", "properties", "textures", "properties", "shaper_trim"],
                value: {
                    description: "Le chemin d'accès au fichier de texture de la garniture 'shaper' utilisé pour l'armor-trim.",
                    type: "string"
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:attachable", "properties", "description", "properties", "textures", "properties", "silence_trim"],
                value: {
                    description: "Le chemin d'accès au fichier de texture de la garniture 'silence' utilisé pour l'armor-trim.",
                    type: "string"
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:attachable", "properties", "description", "properties", "textures", "properties", "snout_trim"],
                value: {
                    description: "Le chemin d'accès au fichier de texture de la garniture 'snout' utilisé pour l'armor-trim.",
                    type: "string"
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:attachable", "properties", "description", "properties", "textures", "properties", "spire_trim"],
                value: {
                    description: "Le chemin d'accès au fichier de texture de la garniture 'spire' utilisé pour l'armor-trim.",
                    type: "string"
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:attachable", "properties", "description", "properties", "textures", "properties", "tide_trim"],
                value: {
                    description: "Le chemin d'accès au fichier de texture de la garniture 'tide' utilisé pour l'armor-trim.",
                    type: "string"
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:attachable", "properties", "description", "properties", "textures", "properties", "vex_trim"],
                value: {
                    description: "Le chemin d'accès au fichier de texture de la garniture 'vex' utilisé pour l'armor-trim.",
                    type: "string"
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:attachable", "properties", "description", "properties", "textures", "properties", "ward_trim"],
                value: {
                    description: "Le chemin d'accès au fichier de texture de la garniture 'ward' utilisé pour l'armor-trim.",
                    type: "string"
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:attachable", "properties", "description", "properties", "textures", "properties", "wayfinder_trim"],
                value: {
                    description: "Le chemin d'accès au fichier de texture de la garniture 'wayfinder' utilisé pour l'armor-trim.",
                    type: "string"
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:attachable", "properties", "description", "properties", "textures", "properties", "wild_trim"],
                value: {
                    description: "Le chemin d'accès au fichier de texture de la garniture 'wild' utilisé pour l'armor-trim. \n Type: String",
                    type: "string"
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:attachable", "properties", "description", "properties", "textures", "properties", "amethyst_palette"],
                value: {
                    description: "Le chemin d'accès au fichier de texture de la palette d'amethyste utilisé pour l'armor-trim.",
                    type: "string"
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:attachable", "properties", "description", "properties", "textures", "properties", "copper_palette"],
                value: {
                    description: "Le chemin d'accès au fichier de texture de la palette de cuivre utilisé pour l'armor-trim.",
                    type: "string"
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:attachable", "properties", "description", "properties", "textures", "properties", "diamond_palette"],
                value: {
                    description: "Le chemin d'accès au fichier de texture de la palette de diamant utilisé pour l'armor-trim.",
                    type: "string"
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:attachable", "properties", "description", "properties", "textures", "properties", "emerald_palette"],
                value: {
                    description: "Le chemin d'accès au fichier de texture de la palette d'émeraude utilisé pour l'armor-trim.",
                    type: "string"
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:attachable", "properties", "description", "properties", "textures", "properties", "gold_palette"],
                value: {
                    description: "Le chemin d'accès au fichier de texture de la palette d'or utilisé pour l'armor-trim.",
                    type: "string"
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:attachable", "properties", "description", "properties", "textures", "properties", "iron_palette"],
                value: {
                    description: "Le chemin d'accès au fichier de texture de la palette de fer utilisé pour l'armor-trim.",
                    type: "string"
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:attachable", "properties", "description", "properties", "textures", "properties", "lapis_palette"],
                value: {
                    description: "Le chemin d'accès au fichier de texture de la palette de lapis utilisé pour l'armor-trim.",
                    type: "string"
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:attachable", "properties", "description", "properties", "textures", "properties", "netherite_palette"],
                value: {
                    description: "Le chemin d'accès au fichier de texture de la palette de netherite utilisé pour l'armor-trim.",
                    type: "string"
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:attachable", "properties", "description", "properties", "textures", "properties", "quartz_palette"],
                value: {
                    description: "Le chemin d'accès au fichier de texture de la palette de quartz utilisé pour l'armor-trim.",
                    type: "string"
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:attachable", "properties", "description", "properties", "textures", "properties", "redstone_palette"],
                value: {
                    description: "Le chemin d'accès au fichier de texture de la palette de redstone utilisé pour l'armor-trim.",
                    type: "string"
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:attachable", "properties", "description", "properties", "textures", "properties", "resin_palette"],
                value: {
                    description: "Le chemin d'accès au fichier de texture de la palette de résine utilisé pour l'armor-trim.",
                    type: "string"
                }
            }
        ]
    },
    {
        version: "1.21.30",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:attachable", "properties", "description", "properties", "materials", "properties", "dyed"],
                value: {
                    description: "Le Material pour l'armure teinte.",
                    default: "entity_alphatest_change_color",
                    type: "string"
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:attachable", "properties", "description", "properties", "textures", "properties", "dyed"],
                value: {
                    description: "La Texture pour l'armure teinte.",
                    type: "string"
                }
            }
        ]
    }
];

export const attachableSchemaTypeRP: VersionedSchema = {
    fileMatch: ["**/addon/resource_pack/attachables/*.json"],
    baseSchema: baseSchema,
    versionedChanges: versionedChanges
};