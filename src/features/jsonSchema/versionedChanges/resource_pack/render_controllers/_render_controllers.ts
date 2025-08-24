import { SchemaType } from "../../../../../types/schema";
import { dynamicExamplesSourceKeys } from "../../../shared/schemaEnums";
import { schemaPatterns } from "../../../shared/schemaPatterns";
import { MinecraftJsonSchema } from "../../../types/minecraftJsonSchema";

const baseSchema: MinecraftJsonSchema = {
    description: "Définit les Render Controllers pour les entités (ou attachables).",
    type: "object",
    required: ["format_version", "render_controllers"],
    properties: {
        format_version: {
            description: "La version du Format à utiliser.",
            type: "string",
            enum: [
                "1.8.0", "1.9.0", "1.10.0", "1.11.0", "1.12.0", "1.13.0", "1.14.0", "1.14.1", "1.14.20", "1.14.30", "1.15.0", "1.16.0", "1.16.20", "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
            ]
        },
        render_controllers: {
            description: "Contient la définition de chaque Render Controller.",
            type: "object",
            propertyNames: {
                pattern: schemaPatterns.render_controller_identifier,
                "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_render_controller_ids
            },
            additionalProperties: {
                type: "object",
                properties: {
                    arrays: {
                        description: "Les listes de tous les modèles, textures et matérielles pour les variations.",
                        type: "object",
                        properties: {
                            geometries: {
                                type: "object",
                                additionalProperties: {
                                    type: "array",
                                    items: {
                                        type: "string",
                                        pattern: "^(Geometry|geometry).*"
                                    }
                                }
                            },
                            materials: {
                                type: "object",
                                additionalProperties: {
                                    type: "array",
                                    items: {
                                        type: "string",
                                        pattern: "^(Material|material).*"
                                    }
                                }
                            },
                            textures: {
                                type: "object",
                                additionalProperties: {
                                    type: "array",
                                    items: {
                                        type: "string",
                                        pattern: "^(Texture|texture).*"
                                    }
                                }
                            }
                        }
                    },
                    geometry: {
                        description: "Le modèle.",
                        type: "molang",
                        examples: ["Geometry.default"]
                    },
                    materials: {
                        description: "Les Materiaux.",
                        type: "array",
                        items: {
                            type: "object",
                            additionalProperties: {
                                type: "molang",
                                examples: ["Material.default"]
                            }
                        }
                    },
                    textures: {
                        description: "Les textures.",
                        type: "array",
                        items: {
                            type: "string",
                            examples: ["Texture.default"]
                        }
                    },
                    part_visibility: {
                        description: "Définis les parties visibles du modèle à l'aide de requête Molang.",
                        type: "array",
                        items: {
                            type: "object",
                            additionalProperties: {
                                type: "molang"
                            }
                        }
                    },
                    color: {
                        description: "Définit la couleur principale du Modèle.",
                        type: "object",
                        properties: {
                            r: {
                                description: "Le niveau de couleur de Rouge.",
                                type: "molang"
                            },
                            g: {
                                description: "Le niveau de couleur de Vert.",
                                type: "molang"
                            },
                            b: {
                                description: "Le niveau de couleur de Bleu.",
                                type: "molang"
                            },
                            a: {
                                description: "Le niveau de transparence Alpha.",
                                type: "molang"
                            }
                        }
                    },
                    is_hurt_color: {
                        description: "Définit La couleur à superposer sur l'Entité lorsqu'elle est blessée.",
                        type: "object",
                        properties: {
                            r: {
                                description: "Le niveau de couleur de Rouge.",
                                type: "molang"
                            },
                            g: {
                                description: "Le niveau de couleur de Vert.",
                                type: "molang"
                            },
                            b: {
                                description: "Le niveau de couleur de Bleu.",
                                type: "molang"
                            },
                            a: {
                                description: "Le niveau de transparence Alpha.",
                                type: "molang"
                            }
                        }
                    },
                    on_fire_color: {
                        description: "Définit la couleur principale du Modèle quand l'entité brule.",
                        properties: {
                            r: {
                                description: "Le niveau de couleur de Rouge.",
                                type: "molang"
                            },
                            g: {
                                description: "Le niveau de couleur de Vert.",
                                type: "molang"
                            },
                            b: {
                                description: "Le niveau de couleur de Bleu.",
                                type: "molang"
                            },
                            a: {
                                description: "Le niveau de transparence Alpha.",
                                type: "molang"
                            }
                        }
                    },
                    overlay_color: {
                        description: "Définit la couleur de superposition supplémentaire du Modèle.",
                        properties: {
                            r: {
                                description: "Le niveau de couleur de Rouge.",
                                type: "molang"
                            },
                            g: {
                                description: "Le niveau de couleur de Vert.",
                                type: "molang"
                            },
                            b: {
                                description: "Le niveau de couleur de Bleu.",
                                type: "molang"
                            },
                            a: {
                                description: "Le niveau de transparence Alpha.",
                                type: "molang"
                            }
                        }
                    },
                    ignore_lighting: {
                        description: "Définir si le modèle de l'entité ignore l'éclairage.",
                        type: "boolean"
                    },
                    rebuild_animation_matrices: {
                        description: "Définit si les matrices d'animations doivent être reconstruites ou non.",
                        type: "boolean"
                    },
                    uv_anim: {
                        description: "Spécifie comment animer les coordonnées de texture UV (U pour horizontal et V pour vertical) d'un objet 3D pendant une animation.",
                        type: "object",
                        properties: {
                            offset: {
                                description: "Contrôle le décalage des coordonnées de texture UV.",
                                type: "array",
                                items: {
                                    type: "molang"
                                }
                            },
                            scale: {
                                description: "Contrôle l'échelle des coordonnées de texture UV.",
                                type: "array",
                                items: {
                                    type: "molang"
                                }
                            }
                        }
                    },
                    light_color_multiplier: {
                        description: "Spécifie un multiplicateur de couleur de lumière à appliquer au modèle.",
                        type: "molang"
                    },
                    filter_lighting: {
                        description: "Définit si l'éclairage d'ambiance doit être appliqué au modèle.",
                        type: "molang"
                    }
                }
            }
        }
    }
};

export const renderControllerSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/render_controllers/**/*.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};