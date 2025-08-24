import { SchemaChange, SchemaType } from "../../../../../types/schema";
import { dynamicExamplesSourceKeys } from "../../../shared/schemaEnums";
import { schemaPatterns } from "../../../shared/schemaPatterns";
import { MinecraftJsonSchema } from "../../../types/minecraftJsonSchema";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier sert à définir les données du Client de l'Entité.",
    type: "object",
    required: ["format_version", "minecraft:client_entity"],
    properties: {
        format_version: {
            description: "La version du Format à utiliser.",
            type: "string",
            enum: [
                "1.8.0", "1.9.0", "1.10.0", "1.11.0", "1.12.0", "1.13.0", "1.14.0", "1.14.1", "1.14.20", "1.14.30", "1.15.0", "1.16.0", "1.16.20", "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
            ]
        },
        "minecraft:client_entity": {
            description: "Contient toute la définition du Client de l'Entité.",
            type: "object",
            required: ["description"],
            properties: {
                description: {
                    description: "Contient les propeiétés de descriptions du Client de l'Entité.",
                    type: "object",
                    required: ["identifier"],
                    properties: {
                        identifier: {
                            description: "L'identifiant de l'Entité.",
                            type: "string",
                            pattern: schemaPatterns.identifier_with_namespace,
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.entity_ids
                        },
                        min_engine_version: {
                            description: "Définit la version minimale du moteur Bedrock pour ce Client d'Entité. Si il y a plusieurs définitions pour le même Client de l'Entité, la version la plus élevée sera utilisée à condition que le moteur Bedrock soit compatible.",
                            type: "string"
                        },
                        materials: {
                            description: "Les Materiels à référencer pour cet Entité.",
                            type: "object",
                            properties: {
                                default: {
                                    description: "Le Materiel par défaut à utiliser.",
                                    type: "string"
                                }
                            },
                            additionalProperties: {
                                type: "string"
                            }
                        },
                        textures: {
                            description: "Les Textures à référencer pour cet Entité.",
                            type: "object",
                            properties: {
                                default: {
                                    description: "La Texture par défaut à utiliser.",
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.texture_file_paths
                                }
                            },
                            additionalProperties: {
                                type: "string",
                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.texture_file_paths
                            }
                        },
                        geometry: {
                            description: "Les Modèles à référencer pour cet Entité.",
                            type: "object",
                            properties: {
                                default: {
                                    description: "Le Modèle par défaut à utiliser.",
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.model_ids
                                }
                            },
                            additionalProperties: {
                                type: "string",
                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.model_ids
                            }
                        },
                        animations: {
                            description: "Les animations à référencer.",
                            type: "object",
                            additionalProperties: {
                                type: "string",
                                pattern: schemaPatterns.animation_identifier,
                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.resource_animation_ids
                            }
                        },
                        animation_controllers: {
                            description: "Les contrôleurs d'animation à référencer.",
                            type: "array",
                            items: {
                                type: "object",
                                maxProperties: 1,
                                additionalProperties: {
                                    type: "string",
                                    pattern: schemaPatterns.animation_controller_identifier,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.resource_animation_controller_ids
                                }
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
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.render_controller_ids
                                    },
                                    {
                                        type: "object",
                                        propertyNames: {
                                            type: "string",
                                            pattern: schemaPatterns.render_controller_identifier,
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
                            description: "Définie certains script molang que l'Entité execute à certains moments.",
                            type: "object",
                            properties: {
                                scale: {
                                    description: "Définit la taille du modèle de l'entité.",
                                    type: "molang"
                                },
                                scaleX: {
                                    description: "Définit la taille X du modèle de l'entité.",
                                    type: "molang"
                                },
                                scaleY: {
                                    description: "Définit la taille Y du modèle de l'entité.",
                                    type: "molang"
                                },
                                scaleZ: {
                                    description: "Définit la taille Z du modèle de l'entité.",
                                    type: "molang"
                                },
                                initialize: {
                                    description: "Ce script s'exécute lors de la première initialisation de l'entité, c'est-à-dire lorsqu'elle apparaît et à chaque fois qu'elle est chargée.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                pre_animation: {
                                    description: "Ce script s'exécute chaque image avant la lecture des animations. Ceci est utile pour calculer les variables qui seront utilisées dans les animations et qui doivent être calculées avant l'exécution de l'animation.",
                                    type: "array",
                                    items: {
                                        type: "molang"
                                    }
                                },
                                should_update_bones_and_effects_offscreen: {
                                    description: "Si `true`, les os et les effets seront toujours mis à jour si le client de l'Entité est hors écran.",
                                    default: false,
                                    type: "molang"
                                },
                                should_update_effects_offscreen: {
                                    description: "Si `true`, les effets seront toujours mis à jour si le client de l'Entité est hors écran.",
                                    default: false,
                                    type: "molang"
                                }
                            }
                        },
                        particle_effects: {
                            description: "Les effets de particules à référencer pour le client de l'Entité.",
                            type: "object",
                            additionalProperties: {
                                type: "string",
                                pattern: schemaPatterns.identifier_with_namespace,
                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.particle_effect_ids
                            }
                        },
                        sound_effects: {
                            description: "Les effets de sons à référencer pour l'Entité.",
                            type: "object",
                            additionalProperties: {
                                type: "string",
                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references,
                            }
                        },
                        enable_attachables: {
                            description: "Définie si l'entité peut équiper des Attachables. Si `true`, l'armure et les items tenus par l'entité seront affichés.",
                            type: "boolean"
                        },
                        held_item_ignores_lighting: {
                            description: "Définie si l'Item tenu par cet Entité doit être entièrement éclairé, ou alors être éclairé en fonction de l'éclairage ambiant.",
                            type: "boolean"
                        },
                        hide_armor: {
                            description: "Définit si l'armure de l'Entité doit être caché ou non. Ce paramètre a la priorité sur `enable_attachables`.",
                            type: "boolean"
                        },
                        spawn_egg: {
                            description: "Définit la texture de l'icône de l'oeuf d'apparition de cet Entité.",
                            type: "object",
                            oneOf: [
                                {
                                    required: ["base_color", "overlay_color"],
                                    properties: {
                                        base_color: {
                                            description: "La couleur d'arrière plan de la texture de l'Oeuf d'apparition.",
                                            type: "string",
                                            pattern: schemaPatterns.color_hex
                                        },
                                        overlay_color: {
                                            description: "La couleur de sur-couche de la texture de l'Oeuf d'apparition.",
                                            type: "string",
                                            pattern: schemaPatterns.color_hex
                                        }
                                    }
                                },
                                {
                                    required: ["texture"],
                                    properties: {
                                        texture: {
                                            description: "La texture pour l'icône de texture d'Oeuf d'apparition.",
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_texture_references
                                        },
                                        texture_index: {
                                            description: "L'index de la texture de la référence à utiliser si la référence contient plusieurs textures.",
                                            type: "integer",
                                            minimum: 0
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
};

const versionedChanges: SchemaChange[] = [
    {
        version: "1.10.0",
        changes: [
            {
                action: "remove",
                target: ["properties", "minecraft:client_entity", "properties", "description", "properties", "animation_controllers"]
            },
            {
                action: "modify",
                target: ["properties", "minecraft:client_entity", "properties", "description", "properties", "animations"],
                value: {
                    description: "Les animations et controlleurs d'animations à référencer.",
                    type: "object",
                    additionalProperties: {
                        type: "string",
                        pattern: [schemaPatterns.animation_identifier, schemaPatterns.animation_controller_identifier],
                        "x-dynamic-examples-source": [dynamicExamplesSourceKeys.resource_animation_ids, dynamicExamplesSourceKeys.resource_animation_controller_ids]
                    }
                }
            }
        ]
    }
];

export const clientEntitySchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/entity/*.json"],
    baseSchema: baseSchema,
    versionedChanges: versionedChanges
};