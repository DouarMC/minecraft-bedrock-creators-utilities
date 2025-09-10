import { dynamicExamplesSourceKeys } from "../../../utils/shared/schemaEnums";
import { schemaPatterns } from "../../../utils/shared/schemaPatterns";
import { MinecraftJsonSchema } from "../../../model";
import { VersionedSchema } from "../../../model/versioning";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier sert à définir un Effet de Particule.",
    type: "object",
    required: ["format_version", "particle_effect"],
    properties: {
        format_version: {
            description: "La version du Format à utiliser.",
            type: "string",
            enum: [
                "1.10.0", "1.11.0", "1.12.0", "1.13.0", "1.14.0", "1.14.1", "1.14.20", "1.14.30", "1.15.0", "1.16.0", "1.16.20", "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
            ]
        },
        particle_effect: {
            description: "Contient la définition de l'Effet de Particule.",
            type: "object",
            required: ["description", "components"],
            properties: {
                description: {
                    description: "Contient les propriétés de description de l'Effet de Particule.",
                    type: "object",
                    required: ["identifier", "basic_render_parameters"],
                    properties: {
                        identifier: {
                            description: "L'identifiant de l'Effet de Particule.",
                            type: "string",
                            pattern: schemaPatterns.identifier_with_namespace,
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_particle_effect_ids
                        },
                        basic_render_parameters: {
                            description: "Contient la texture et le matériau de l'Effet de Particule.",
                            type: "object",
                            required: ["material", "texture"],
                            properties: {
                                material: {
                                    description: "Le matériau de l'Effet de Particule pour le rendu.",
                                    type: "string",
                                    enum: ["particles_alpha", "particles_blend", "particles_add"]
                                },
                                texture: {
                                    description: "Le chemin d'accès de la texture de l'Effet de Particule.",
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.texture_file_paths
                                }
                            }
                        }
                    }
                },
                components: {
                    description: "Les composants de l'Effet de Particule.",
                    type: "object",
                    properties: {
                        "minecraft:emitter_initialization": {
                            description: "Composant d'émetteur qui execute du Molang au moment où l'émetteur est crée, puis à chaque mise à jour de l'émetteur.",
                            type: "object",
                            "properties": {
                                creation_expression: {
                                    description: "Expression Molang exécutée lorsque l'émetteur est créé.",
                                    type: "molang"
                                },
                                per_update_expression: {
                                    description: "Expression Molang exécutée à chaque tick.",
                                    type: "molang"
                                }
                            }
                        },
                        "minecraft:emitter_lifetime_events": {
                            description: "Compodant d'émetteur qui permet de déclencher des événements à différents moments de la durée de vie de l'émetteur.",
                            type: "object",
                            properties: {
                                creation_event: {
                                    description: "Évènement(s) à déclencher lorsque l'émetteur est créé.",
                                    oneOf: [
                                        {
                                            type: "array",
                                            items: {
                                                type: "string"
                                            }
                                        },
                                        {
                                            type: "string"
                                        }
                                    ]
                                },
                                expiration_event: {
                                    description: "Évènement(s) à déclencher lorsque l'émetteur expire.",
                                    oneOf: [
                                        {
                                            type: "array",
                                            items: {
                                                type: "string"
                                            }
                                        },
                                        {
                                            type: "string"
                                        }
                                    ]
                                },
                                timeline: {
                                    description: "Permet de déclencher des événements à des moments spécifiques de la durée de vie de l'émetteur.",
                                    type: "object",
                                    propertyNames: {
                                        pattern: schemaPatterns.particle_lifetime_keyframe
                                    },
                                    additionalProperties: {
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
                                    }
                                },
                                travel_distance_events: {
                                    description: "Déclenche des événements lorsque l'émetteur a parcouru une certaine distance.",
                                    type: "object",
                                    propertyNames: {
                                        pattern: schemaPatterns.particle_lifetime_keyframe
                                    },
                                    additionalProperties: {
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
                                    }
                                },
                                looping_travel_distance_events: {
                                    description: "Déclenche des événements quand l'émetteur a parcouru une certaine distance et se répète en boucle à chaque intervalle de distance.",
                                    type: "array",
                                    items: {
                                        type: "object",
                                        required: ["distance", "effects"],
                                        properties: {
                                            distance: {
                                                description: "La distance à laquelle l'événement se déclenche.",
                                                type: "number",
                                                minimum: 0.0
                                            },
                                            effects: {
                                                description: "Les événements qui se produisent à cette distance.",
                                                oneOf: [
                                                    {
                                                        type: "array",
                                                        items: {
                                                            type: "string"
                                                        }
                                                    },
                                                    {
                                                        type: "string"
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "minecraft:emitter_lifetime_expression": {
                            description: "L'émetteur s'activera lorsque `activation_expression` est différent de zéro, et s'éteindra lorsque `expiration_expression` est égale à zéro. Cela est utile pour des situations comme la conduite d'un émetteur attaché à une entité à partir d'une variable d'entité.",
                            type: "object",
                            properties: {
                                activation_expression: {
                                    description: "L'expression d'activation de l'émetteur.",
                                    default: 1,
                                    type: "molang"
                                },
                                expiration_expression: {
                                    description: "L'expression d'expiration de l'émetteur.",
                                    default: 0,
                                    type: "molang"
                                }
                            }
                        },
                        "minecraft:emitter_lifetime_looping": {
                            description: "L'émetteur se jouera en boucle, émettant des particules pendant `active_time`, puis s'arrêtant pendant `sleep_time`, puis se répétant. Si `sleep_time` est 0, l'émetteur émettra en continu.",
                            type: "object",
                            properties: {
                                active_time: {
                                    description: "L'émetteur émettra des particules pour cette durée par boucle.",
                                    default: 10,
                                    type: "molang"
                                },
                                sleep_time: {
                                    description: "L'émetteur mettra en pause l'émission de particules pour cette durée par boucle.",
                                    default: 0,
                                    type: "molang"
                                }
                            }
                        },
                        "minecraft:emitter_lifetime_once": {
                            description: "L'émetteur s'exécutera une fois, et une fois que la durée de vie de l'émetteur se termine, l'émetteur expire. Si le nombre maximum de particules est atteint avant la fin du temps, l'émetteur expirera également.",
                            type: "object",
                            properties: {
                                active_time: {
                                    description: "L'émetteur émettra des particules pour cette durée.",
                                    default: 10,
                                    type: "molang"
                                }
                            }
                        },
                        "minecraft:emitter_local_space": {
                            description: "Définit dans quel espace de référence l'émetteur calcule les particules lorsqu'il est attaché à une entité (ou un objet mobile).",
                            type: "object",
                            properties: {
                                position: {
                                    description: "Définit la type de position des particules. Si `true`, les particules simuleront dans l'espace de l'entité. Si `false`, elles simuleront dans l'espace mondial.",
                                    default: false,
                                    type: "boolean"
                                },
                                velocity: {
                                    description: "Définit si la vélocité de l'émetteur est ajoutée à la vitesse initiale des particules.",
                                    type: "boolean"
                                },
                                rotation: {
                                    description: "Définit le type de rotation des particules. Si `true`, les particules simuleront dans l'espace de l'entité. Si `false`, elles simuleront dans l'espace mondial.",
                                    default: false,
                                    type: "boolean"
                                }
                            }
                        },
                        "minecraft:emitter_rate_instant": {
                            description: "Ce composant d'émetteur émet toutes les particules à la fois, puis plus aucune à moins que l'émetteur se joue en boucle.",
                            type: "object",
                            required: ["num_particles"],
                            properties: {
                                num_particles: {
                                    description: "Le nombre de particules à émettre par émission.",
                                    default: 10,
                                    type: "molang"
                                }
                            }
                        },
                        "minecraft:emitter_rate_manual": {
                            description: "Composant d'émetteur qui émet des particules seulement quand il en reçoit l'ordre de le faire via le jeu lui-même. Principalement utilisé par les effets de particules anciennes.",
                            type: "object",
                            required: ["max_particles"],
                            properties: {
                                max_particles: {
                                    description: "Nombre maximum de particules que l'émetteur peut avoir en vie en même temps.",
                                    default: 50,
                                    type: "molang"
                                }
                            }
                        },
                        "minecraft:emitter_rate_steady": {
                            description: "Composant d'émetteur qui émet les particules de manière continue et régulière dans le temps.",
                            type: "object",
                            required: ["spawn_rate", "max_particles"],
                            properties: {
                                spawn_rate: {
                                    description: "Le taux d'émission en particules par seconde.",
                                    default: 1,
                                    type: "molang"
                                },
                                max_particles: {
                                    description: "Nombre maximum de particules que l'émetteur peut avoir en vie en même temps.",
                                    default: 50,
                                    type: "molang"
                                }
                            }
                        },
                        "minecraft:emitter_shape_box": {
                            description: "Ce composant définit la forme de la zone dans laquelle les particules apparaissent. Ici, une boîte (parallélépipède).",
                            type: "object",
                            required: ["half_dimensions"],
                            properties: {
                                offset: {
                                    description: "Décale la boîte par rapport à la position de l'émetteur.",
                                    default: [0, 0, 0],
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: {
                                        type: "molang"
                                    }
                                },
                                direction: {
                                    description:
                                    "Contrôle la direction initiale des particules. Evalué pour chaque particule." +
                                    "\n\n- `inwards`: les particules sont attirées vers le centre de la boîte." +
                                    "\n\n- `outwards`: les particules sont projetées vers l'extérieur de la boîte." +
                                    "\n\n- `[x, y, z]`: une direction personnalisée spécifiée par un vecteur Molang.",
                                    default: "outwards",
                                    oneOf: [
                                        {
                                            type: "string",
                                            enum: ["inwards", "outwards"]
                                        },
                                        {
                                            type: "array",
                                            minItems: 3,
                                            maxItems: 3,
                                            items: {
                                                type: "molang"
                                            }
                                        }
                                    ]
                                },
                                half_dimensions: {
                                    description: "Définit la demi-taille de la boîte (centrée sur l'émetteur).",
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: {
                                        type: "molang"
                                    }
                                },
                                surface_only: {
                                    description: "Si `true`, les particules n'apparaîtront que sur les faces de la boîte. Si `false`, elles peuvent apparaître n'importe où à l'intérieur de la boîte.",
                                    default: false,
                                    type: "boolean"
                                }
                            }
                        },
                        "minecraft:emitter_shape_custom": {
                            description: "Composant qui permet de définir complètement à la main via des expressions Molang où et dans quelle direction les particules sont émises.",
                            type: "object",
                            properties: {
                                offset: {
                                    description: "Définit la position initiale de la particule par rapport à l'émetteur.",
                                    default: [0, 0, 0],
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: {
                                        type: "molang"
                                    }
                                },
                                direction: {
                                    description: "Définit la direction initiale de la particule.",
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: {
                                        type: "molang"
                                    }
                                }
                            }
                        },
                        "minecraft:emitter_shape_disc": {
                            description: "Ce composant fait apparaître les particules dans une forme de disque (cercle 2D).",
                            type: "object",
                            properties: {
                                offset: {
                                    description: "Décale le disque par rapport à l'émetteur.",
                                    default: [0, 0, 0],
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: {
                                        type: "molang"
                                    }
                                },
                                direction: {
                                    description: "Définit la direction initiale des particules. Evalué pour chaque particule." +
                                    "\n\n- `inwards`: les particules sont attirées vers le centre du disque." +
                                    "\n\n- `outwards`: les particules sont projetées vers l'extérieur du disque." +
                                    "\n\n- `[x, y, z]`: une direction personnalisée spécifiée par un vecteur Molang.",
                                    default: "outwards",
                                    oneOf: [
                                        {
                                            type: "string",
                                            enum: ["inwards", "outwards"]
                                        },
                                        {
                                            type: "array",
                                            minItems: 3,
                                            maxItems: 3,
                                            items: {
                                                type: "molang"
                                            }
                                        }
                                    ]
                                },
                                radius: {
                                    description: "Rayon du disque.",
                                    default: 1,
                                    type: "molang"
                                },
                                surface_only: {
                                    description: "Si `true`, les particules n'apparaîtront que sur le bord du disque. Si `false`, elles peuvent apparaître n'importe où à l'intérieur du disque.",
                                    default: false,
                                    type: "boolean"
                                },
                                plane_normal: {
                                    description:
                                    "Définit l'orientation du disque." +
                                    "\n\n- `x`: disque perpendiculaire à l'axe X (posé verticalement, face vers les côtés)." +
                                    "\n\n- `y`: disque perpendiculaire à l'axe Y (comme un cercle au sol)." +
                                    "\n\n- `z`: disque perpendiculaire à l'axe Z.",
                                    default: [0, 1, 0],
                                    oneOf: [
                                        {
                                            type: "string",
                                            enum: ["x", "y", "z"]
                                        },
                                        {
                                            type: "array",
                                            minItems: 3,
                                            maxItems: 3,
                                            items: {
                                                type: "molang"
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        "minecraft:emitter_shape_entity_aabb": {
                            description: "Ce composant fait apparaître les particules dans le volume défini par la hitbox (AABB - Axis-Aligned Bounding Box) de l'entité à laquelle l'émetteur est attaché. Si l'émetteur n'est pas attaché à une entité, les particules spawnent simplement au point de l'émetteur.",
                            type: "object",
                            properties: {
                                surface_only: {
                                    description: "Si `true`, les particules spawnent uniquement sur la surface de la hitbox (utile pour halos ou contours). Si `false`, elles peuvent apparaître n'importe où à l'intérieur de la hitbox.",
                                    default: false,
                                    type: "boolean"
                                },
                                direction: {
                                    description: "Définit la direction initiale des particules. Evalué pour chaque particule." +
                                    "\n\n- `inwards`: les particules sont attirées vers le centre de la hitbox." +
                                    "\n\n- `outwards`: les particules sont projetées vers l'extérieur de la hitbox." +
                                    "\n\n- `[x, y, z]`: une direction personnalisée spécifiée par un vecteur Molang.",
                                    default: "outwards",
                                    oneOf: [
                                        {
                                            type: "string",
                                            enum: ["inwards", "outwards"]
                                        },
                                        {
                                            type: "array",
                                            minItems: 3,
                                            maxItems: 3,
                                            items: {
                                                type: "molang"
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        "minecraft:emitter_shape_point": {
                            description: "Toutes les particules sortent d'un seul point",
                            type: "object",
                            properties: {
                                offset: {
                                    description: "Décale le point d'émission par rapport à la position de l'émetteur. Evalué pour chaque particule.",
                                    default: [0, 0, 0],
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: {
                                        type: "molang"
                                    }
                                },
                                direction: {
                                    description: "La direction initiale des particules.",
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: {
                                        type: "molang"
                                    }
                                }
                            }
                        },
                        "minecraft:emitter_shape_sphere": {
                            description: "Ce composant fait apparaître les particules dans ou sur une sphère, décalée éventuellement par rapport à l'émetteur.",
                            type: "object",
                            properties: {
                                offset: {
                                    description: "Décale la sphère par rapport à l'émetteur.",
                                    default: [0, 0, 0],
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: {
                                        type: "molang"
                                    }
                                },
                                direction: {
                                    description: "Définit la direction initiale des particules. Evalué pour chaque particule." +
                                    "\n\n- `inwards`: les particules sont attirées vers le centre de la sphère." +
                                    "\n\n- `outwards`: les particules sont projetées vers l'extérieur de la sphère." +
                                    "\n\n- `[x, y, z]`: une direction personnalisée spécifiée par un vecteur Molang.",
                                    default: "outwards",
                                    oneOf: [
                                        {
                                            type: "string",
                                            enum: ["inwards", "outwards"]
                                        },
                                        {
                                            type: "array",
                                            minItems: 3,
                                            maxItems: 3,
                                            items: {
                                                type: "molang"
                                            }
                                        }
                                    ]
                                },
                                radius: {
                                    description: "Le rayon de la sphère.",
                                    default: 1,
                                    type: "molang"
                                },
                                surface_only: {
                                    description: "Si `true`, les particules n'apparaîtront que sur la surface de la sphère. Si `false`, elles peuvent apparaître n'importe où à l'intérieur de la sphère.",
                                    default: false,
                                    type: "boolean"
                                }
                            }
                        },
                        "minecraft:particle_appearance_billboard": {
                            description: "Ce composant dit au moteur comment dessiner la particule sous forme de billboard, c'est-à-dire un petit rectangle plat (quad) qui s'affiche dans le monde. Le billboard peut être orienté, redimensionné et texturé de différentes façons.",
                            type: "object",
                            required: ["size"],
                            properties: {
                                size: {
                                    description: "Définit la taille du quad `[largeur, hauteur]`.",
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "molang"
                                    }
                                },
                                facing_camera_mode: {
                                    description:
                                    "Contrôle comment le billboard est orienté par rapport à la caméra." +
                                    "\n\n- `rotate_xyz`: le billboard fait toujours face à la caméra, en tournant sur tous les axes." +
                                    "\n\n- `rotate_y`: tourne autour de l'axe Y mais reste plat horizontalement" +
                                    "\n\n- `lookat_xyz`: regarde la caméra mais garde un biais vers le haut du monde." +
                                    "\n\n- `lookat_y`: regarde la caméra mais reste plat horizontalement." +
                                    "\n\n- `direction_x`, `direction_y`, `direction_z`: oriente le billboard selon une direction fixe dans l'espace mondial." +
                                    "\n\n- `emitter_transform_xy`, `emitter_transform_xz`, `emitter_transform_yz`: oriente le billboard selon l'orientation de l'émetteur dans le plan spécifié.",
                                    type: "string",
                                    enum: ["rotate_xyz", "rotate_y", "lookat_xyz", "lookat_y", "direction_x", "direction_y", "direction_z", "emitter_transform_xy", "emitter_transform_xz", "emitter_transform_yz"]
                                },
                                direction: {
                                    description: "Définit comment calculer la direction du billboard.",
                                    type: "object",
                                    properties: {
                                        mode: {
                                            description:
                                            "Le mode de direction de la particule." +
                                            "\n\n- `derive_from_velocity`: la direction est dérivée de la vélocité de la particule." +
                                            "\n\n- `custom_direction`: la direction est spécifiée manuellement via un vecteur.",
                                            type: "string",
                                            enum: ["derive_from_velocity", "custom_direction"]
                                        },
                                        min_speed_threshold: {
                                            description: "Utilisé uniquement en mode `derive_from_velocity`. La direction est définie si la vitesse de la particule est supérieure au seuil.",
                                            default: 0.01,
                                            type: "number"
                                        },
                                        custom_direction: {
                                            description: "Utilisé uniquement en mode `custom_direction`. Spécifie le vecteur de direction.",
                                            type: "array",
                                            minItems: 3,
                                            maxItems: 3,
                                            items: {
                                                type: "molang"
                                            }
                                        }
                                    }
                                },
                                uv: {
                                    description: "Permet de définir quelle partie de la texture s'applique.",
                                    type: "object",
                                    properties: {
                                        texture_width: {
                                            description: "Spécifie la largeur de la texture.",
                                            default: 1,
                                            type: "integer"
                                        },
                                        texture_height: {
                                            description: "Spécifie la hauteur de la texture.",
                                            default: 1,
                                            type: "integer"
                                        },
                                        flipbook: {
                                            description: "Manière alternative de spécifier une animation flipbook. Une animation flipbook utilise des morceaux de la texture pour animer, en passant le temps d'une image à l'autre.",
                                            type: "object",
                                            required: ["base_UV", "max_frame"],
                                            properties: {
                                                base_UV: {
                                                    description: "Coordonnées UV de base pour l'animation flipbook.",
                                                    type: "array",
                                                    minItems: 2,
                                                    maxItems: 2,
                                                    items: {
                                                        type: "molang"
                                                    }
                                                },
                                                size_UV: {
                                                    description: "Taille de la zone UV.",
                                                    type: "array",
                                                    minItems: 2,
                                                    maxItems: 2,
                                                    items: {
                                                        type: "molang"
                                                    }
                                                },
                                                step_UV: {
                                                    description: "Jusqu'où déplacer le patch UV à chaque image.",
                                                    type: "array",
                                                    minItems: 2,
                                                    maxItems: 2,
                                                    items: {
                                                        type: "molang"
                                                    }
                                                },
                                                frames_per_second: {
                                                    description: "Frames par seconde de l'animation flipbook.",
                                                    type: "integer"
                                                },
                                                max_frame: {
                                                    description: "Le nombre maximum de frames de l'animation flipbook.",
                                                    type: "molang"
                                                },
                                                stretch_to_lifetime: {
                                                    description: "Ajuste les frames par seconde pour correspondre à la durée de vie de la particule.",
                                                    default: false,
                                                    type: "boolean"
                                                },
                                                loop: {
                                                    description: "Définit si l'animation flipbook doit boucler.",
                                                    default: false,
                                                    type: "boolean"
                                                }
                                            }
                                        },
                                        uv: {
                                            description: "Coordonnée du coin supérieur gauche de la zone UV.",
                                            type: "array",
                                            minItems: 2,
                                            maxItems: 2,
                                            items: {
                                                type: "molang"
                                            }
                                        },
                                        uv_size: {
                                            description: "La taille de la zone UV.",
                                            type: "array",
                                            minItems: 2,
                                            maxItems: 2,
                                            items: {
                                                type: "molang"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "minecraft:particle_appearance_lighting": {
                            description: "Ce composant indique au système de particules de rendre la particule en fonction des conditions d'éclairage locales dans le jeu.",
                            type: "object"
                        },
                        "minecraft:particle_appearance_tinting": {
                            description: "Ce composant définit la teinte de couleur de la particule.",
                            type: "object",
                            required: ["color"],
                            properties: {
                                color: {
                                    description: "Définit la couleur de la particule.",
                                    oneOf: [
                                        {
                                            oneOf: [
                                                {
                                                    type: "array",
                                                    minItems: 3,
                                                    maxItems: 3,
                                                    items: {
                                                        type: "molang"
                                                    }
                                                },
                                                {
                                                    type: "array",
                                                    minItems: 4,
                                                    maxItems: 4,
                                                    items: {
                                                        type: "molang"
                                                    }
                                                },
                                                {
                                                    type: "string",
                                                    pattern: schemaPatterns.color_hex
                                                },
                                                {
                                                    type: "string",
                                                    pattern: schemaPatterns.color_hex_rgba
                                                }
                                            ]
                                        },
                                        {
                                            type: "object",
                                            required: ["gradient", "interpolant"],
                                            properties: {
                                                gradient: {
                                                    description: "Définit un dégradé de couleur pour la particule.",
                                                    oneOf: [
                                                        {
                                                            type: "array",
                                                            oneOf: [
                                                                {
                                                                    type: "array",
                                                                    minItems: 3,
                                                                    maxItems: 3,
                                                                    items: {
                                                                        type: "number"
                                                                    }
                                                                },
                                                                {
                                                                    type: "array",
                                                                    minItems: 4,
                                                                    maxItems: 4,
                                                                    items: {
                                                                        type: "number"
                                                                    }
                                                                },
                                                                {
                                                                    type: "string",
                                                                    pattern: schemaPatterns.color_hex
                                                                },
                                                                {
                                                                    type: "string",
                                                                    pattern: schemaPatterns.color_hex_rgba
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            type: "object",
                                                            propertyNames: {
                                                                pattern: schemaPatterns.particle_lifetime_keyframe
                                                            },
                                                            additionalProperties: {
                                                                type: "array",
                                                                oneOf: [
                                                                    {
                                                                        type: "array",
                                                                        minItems: 3,
                                                                        maxItems: 3,
                                                                        items: {
                                                                            type: "number"
                                                                        }
                                                                    },
                                                                    {
                                                                        type: "array",
                                                                        minItems: 4,
                                                                        maxItems: 4,
                                                                        items: {
                                                                            type: "number"
                                                                        }
                                                                    },
                                                                    {
                                                                        type: "string",
                                                                        pattern: schemaPatterns.color_hex
                                                                    },
                                                                    {
                                                                        type: "string",
                                                                        pattern: schemaPatterns.color_hex_rgba
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
                                                },
                                                interpolant: {
                                                    description: "Définit l'interpolant pour le dégradé de couleur.",
                                                    type: "molang"
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        "minecraft:particle_expire_if_in_blocks": {
                            description: "Les particules expirent lorsqu'elles sont dans un bloc du type de la liste. Ce composant peut exister aux côtés de l'expression de durée de vie des particules.",
                            type: "array",
                            items: {
                                type: "string",
                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                            }
                        },
                        "minecraft:particle_expire_if_not_in_blocks": {
                            description: "Les particules expirent lorsqu'elles ne sont pas dans un bloc du type de la liste. Ce composant peut exister aux côtés de l'expression de durée de vie des particules.",
                            type: "array",
                            items: {
                                type: "string",
                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                            }
                        },
                        "minecraft:particle_initial_speed": {
                            description: "Ce composant indique au système de particules de démarrer la particule avec une vitesse spécifiée.",
                            default: 0,
                            oneOf: [
                                {
                                    type: "molang"
                                },
                                {
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: {
                                        type: "molang"
                                    }
                                }
                            ]
                        },
                        "minecraft:particle_initial_spin": {
                            description: "Ce composant indique au système de particules de démarrer la particule avec une orientation et un taux de rotation spécifiés.",
                            type: "object",
                            properties: {
                                rotation: {
                                    description: "Spécifie la rotation initiale de la particule en degrés.",
                                    default: 0,
                                    type: "molang"
                                },
                                rotation_rate: {
                                    description: "Spécifie le taux de rotation de la particule en degrés par seconde.",
                                    default: 0,
                                    type: "molang"
                                }
                            }
                        },
                        "minecraft:particle_initialization": {
                            description: "Ce composant indique au système de particules de démarrer la particule avec une expression de rendu spécifiée.",
                            type: "object",
                            properties: {
                                per_update_expression: {
                                    description: "L'expression de rendu de la particule.",
                                    type: "molang"
                                },
                                per_render_expression: {
                                    description: "L'expression de rendu de la particule.",
                                    type: "molang"
                                }
                            }
                        },
                        "minecraft:particle_kill_plane": {
                            description: "Les particules qui traversent ce plan expirent. Le plan est relatif à l'émetteur, mais orienté dans l'espace mondial. Les quatre paramètres sont les 4 éléments habituels d'une équation de plan.",
                            type: "array",
                            minItems: 4,
                            maxItems: 4,
                            items: {
                                type: "number"
                            }
                        },
                        "minecraft:particle_lifetime_events": {
                            description: "Ce composant permet de déclencher des événements en fonction de divers événements de durée de vie.",
                            type: "object",
                            properties: {
                                creation_event: {
                                    description: "L'événement de création de la particule.",
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
                                expiration_event: {
                                    description: "L'événement d'expiration de la particule.",
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
                                timeline: {
                                    description: "Série de temps, par exemple 0.0 ou 1.0, qui déclenche l'événement.",
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
                                }
                            }
                        },
                        "minecraft:particle_lifetime_expression": {
                            description: "Composant de durée de vie standard. Ces expressions contrôlent la durée de vie de la particule.",
                            type: "object",
                            properties: {
                                expiration_expression: {
                                    description: "L'expression d'expiration de la particule.",
                                    default: 0,
                                    type: "molang"
                                },
                                max_lifetime: {
                                    description: "La durée de vie maximale de la particule.",
                                    type: "molang"
                                }
                            }
                        },
                        "minecraft:particle_motion_collision": {
                            description: "Ce composant permet les collisions entre le terrain et la particule. La détection de collision dans Minecraft consiste à détecter une intersection, à se déplacer vers un point non intersectant à proximité pour la particule (si possible) et à définir sa direction pour ne pas être dirigée vers la collision (généralement perpendiculaire à la surface de collision).",
                            type: "object",
                            required: ["collision_radius"],
                            properties: {
                                enabled: {
                                    description: "Activer les collisions.",
                                    type: "molang"
                                },
                                collision_radius: {
                                    description: "Utilisé pour minimiser l'interpénétration des particules avec l'environnement. Notez que cela doit être inférieur ou égal à 1/2 bloc.",
                                    type: "number",
                                    minimum: 0.0,
                                    maximum: 0.5
                                },
                                collision_drag: {
                                    description: "Modifie la vitesse de la particule lorsqu'elle a collisionné. Utile pour émuler la friction/traînée lors de la collision, par exemple une particule qui frappe le sol ralentirait jusqu'à s'arrêter. Cette traînée ralentit la particule de cette quantité en blocs/sec lorsqu'elle est en contact.",
                                    type: "number"
                                },
                                coefficient_of_restitution: {
                                    description: "Coefficient de restitution de la particule. Utilisé pour déterminer la vitesse de la particule après la collision. 1.0 signifie que la particule rebondit à la même vitesse, 0.0 signifie qu'elle s'arrête.",
                                    type: "number"
                                },
                                expire_on_contact: {
                                    description: "Expire la particule lorsqu'elle entre en collision avec un bloc.",
                                    type: "boolean"
                                },
                                events: {
                                    description: "Déclenche un événement lorsqu'une collision se produit.",
                                    oneOf: [
                                        {
                                            type: "object",
                                            required: ["event"],
                                            properties: {
                                                event: {
                                                    description: "L'événement à déclencher.",
                                                    type: "string"
                                                },
                                                min_speed: {
                                                    description: "Vitesse minimale pour déclencher l'événement.",
                                                    default: 2,
                                                    type: "number"
                                                }
                                            }
                                        },
                                        {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                required: ["event"],
                                                properties: {
                                                    event: {
                                                        description: "L'événement à déclencher.",
                                                        type: "string"
                                                    },
                                                    min_speed: {
                                                        description: "Vitesse minimale pour déclencher l'événement.",
                                                        default: 2,
                                                        type: "number"
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        "minecraft:particle_motion_dynamic": {
                            description: "Ce composant spécifie les propriétés dynamiques de la particule, d'un point de vue de la simulation, quelles forces agissent sur la particule? Ces dynamiques modifient la vélocité de la particule, qui est une combinaison de la direction de la particule et de la vitesse. La direction de la particule sera toujours dans la direction de la vélocité de la particule.",
                            type: "object",
                            properties: {
                                linear_acceleration: {
                                    description: "L'accélération linéaire appliquée à la particule, Les unités sont des blocs/sec.",
                                    default: [0, 0, 0],
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: {
                                        type: "molang"
                                    }
                                },
                                linear_drag_coefficient: {
                                    description: "Le coefficient de traînée linéaire appliqué à la particule.",
                                    default: 0,
                                    type: "molang"
                                },
                                rotation_acceleration: {
                                    description: "L'accélération de rotation appliquée à la particule, Les unités sont des degrés/sec/sec.",
                                    default: 0,
                                    type: "molang"
                                },
                                rotation_drag_coefficient: {
                                    description: "Le coefficient de traînée de rotation appliqué à la particule. L'équation est `rotation_acceleration += -rotation_rate*rotation_drag_coefficient`. Utile pour ralentir une rotation, ou pour limiter l'accélération de rotation. Pensez à un disque qui accélère (accélération) mais atteint une vitesse terminale (traînée). Un autre usage est si vous avez une particule qui grandit en taille, avoir la rotation ralentir en raison de la traînée peut ajouter du poids au mouvement de la particule.",
                                    default: 0,
                                    type: "molang"
                                }
                            }
                        },
                        "minecraft:particle_motion_parametric": {
                            description: "Ce composant controle directement la particule.",
                            type: "object",
                            properties: {
                                relative_position: {
                                    description: "Définir directement la position relative à l'émetteur.",
                                    default: [0, 0, 0],
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: {
                                        type: "molang"
                                    }
                                },
                                direction: {
                                    description: "Définir directement la direction 3D de la particule.",
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: {
                                        type: "molang"
                                    }
                                },
                                rotation: {
                                    description: "Définir directement la rotation de la particule.",
                                    default: 0,
                                    type: "molang"
                                }
                            }
                        }
                    }
                },
                curves: {
                    description: "Les courbes de particules sont des courbes de particules qui peuvent être utilisées pour définir des propriétés de particules qui changent au fil du temps.",
                    oneOf: [
                        {
                            type: "object",
                            required: ["type", "nodes", "input"],
                            properties: {
                                type: {
                                    description:
                                    "Le type de courbe de particules." +
                                    "\n\n`linear`: une série de nœuds, également espacés entre 0 et 1 après l'application de l'entrée/plage horizontale." +
                                    "\n\n`bezier`: une spline de bezier à 4 nœuds, le premier et le dernier point étant les valeurs à 0 et 1 et les deux points du milieu formant les lignes de pente à 0,33 pour le premier point et 0,66 pour le second." +
                                    "\n\n`catmull_rom`: une série de courbes qui passent par tous les nœuds sauf le dernier/premier. Les premiers/derniers nœuds sont utilisés pour former la pente des deuxièmes/deuxièmes derniers points respectivement. Tous les points sont également espacés." +
                                    "\n\n`bezier_chain`: une chaîne de splines de bezier. Une série de points est spécifiée avec leurs pentes correspondantes, et chaque segment utilise sa paire de points et de pentes pour former une spline de bezier. Chaque point, à l'exception du premier/dernier, est partagé entre sa paire de segments de spline.",
                                    type: "string",
                                    enum: ["linear", "bezier", "bezier_chain", "catmull_rom"]
                                },
                                nodes: {
                                    description: "Les nœuds sonnt les nœuds de contrôle pour la courbe. Ils sont supposés être également espacés; cette notation ne fonctionne que pour les courbes linéaires, de bezier et de catmull_rom.",
                                    oneOf: [
                                        {
                                            type: "array",
                                            minItems: 3,
                                            maxItems: 3,
                                            items: {
                                                type: "molang"
                                            }
                                        },
                                        {
                                            type: "object",
                                            propertyNames: {
                                                pattern: schemaPatterns.particle_lifetime_keyframe
                                            },
                                            additionalProperties: {
                                                type: "object",
                                                properties: {
                                                    value: {
                                                        description: "La valeur de la courbe à ce point.",
                                                        type: "molang"
                                                    },
                                                    left_value: {
                                                        description: "La valeur de la courbe à ce point.",
                                                        type: "molang"
                                                    },
                                                    right_value: {
                                                        description: "La valeur de la courbe à ce point.",
                                                        type: "molang"
                                                    },
                                                    slope: {
                                                        description: "La pente de la courbe à ce point.",
                                                        type: "molang"
                                                    },
                                                    left_slope: {
                                                        description: "La pente de la courbe à ce point.",
                                                        type: "molang"
                                                    },
                                                    right_slope: {
                                                        description: "La pente de la courbe à ce point.",
                                                        type: "molang"
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                },
                                input: {
                                    description: "L'entrée de la courbe.",
                                    type: "molang"
                                },
                                horizontal_range: {
                                    description: "La plage horizontale de la courbe.",
                                    type: "molang"
                                }
                            }
                        },
                        {
                            type: "object",
                            required: ["type", "nodes", "input"],
                            properties: {
                                type: {
                                    description: "Le type de courbe de particules.",
                                    type: "string",
                                    pattern: "^bezier_chain$"
                                },
                                nodes: {
                                    description: "Les nœuds sonnt les nœuds de contrôle pour la courbe. Ils sont supposés être également espacés; cette notation ne fonctionne que pour les courbes linéaires, de bezier et de catmull_rom.",
                                    oneOf: [
                                        {
                                            type: "array",
                                            minItems: 3,
                                            maxItems: 3,
                                            items: {
                                                type: "molang"
                                            }
                                        },
                                        {
                                            type: "object",
                                            propertyNames: {
                                                pattern: schemaPatterns.particle_lifetime_keyframe
                                            },
                                            additionalProperties: {
                                                type: "object",
                                                properties: {
                                                    value: {
                                                        description: "La valeur de la courbe à ce point.",
                                                        type: "molang"
                                                    },
                                                    left_value: {
                                                        description: "La valeur de la courbe à ce point.",
                                                        type: "molang"
                                                    },
                                                    right_value: {
                                                        description: "La valeur de la courbe à ce point.",
                                                        type: "molang"
                                                    },
                                                    slope: {
                                                        description: "La pente de la courbe à ce point.",
                                                        type: "molang"
                                                    },
                                                    left_slope: {
                                                        description: "La pente de la courbe à ce point.",
                                                        type: "molang"
                                                    },
                                                    right_slope: {
                                                        description: "La pente de la courbe à ce point.",
                                                        type: "molang"
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                },
                                input: {
                                    description: "L'entrée de la courbe.",
                                    type: "molang"
                                }
                            }
                        }
                    ]
                },
                events: {
                    description: "Les événements de particules sont des événements qui peuvent être déclenchés par des particules.",
                    type: "object",
                    additionalProperties: {
                        type: "object",
                        properties: {
                            expression: {
                                description: "Execute cette expression Molang sur l'émetteur d'événements.",
                                type: "molang"
                            },
                            log: {
                                description: "Pour le débogage, cela enregistrera un message, avec le nom de l'effet de tir et la position de l'événement. Le message de journal s'affichera dans le journal de contenu.",
                                type: "string"
                            },
                            particle_effect: {
                                description: "Déclenche un effet de particules.",
                                type: "object",
                                required: ["effect", "type"],
                                properties: {
                                    effect: {
                                        description: "L'identifiant de l'effet de particules à déclencher.",
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.particle_effect_ids
                                    },
                                    pre_effect_expression: {
                                        description: "Execute cette expression Molang avant de déclencher l'effet de particules.",
                                        type: "molang"
                                    },
                                    type: {
                                        description: "Le type de déclenchement de l'effet de particules.",
                                        type: "string",
                                        enum: ["particle", "particle_with_velocity", "emitter", "emitter_bound"]
                                    }
                                }
                            },
                            sound_effect: {
                                description: "Déclenche un effet sonore.",
                                type: "object",
                                required: ["event_name"],
                                properties: {
                                    event_name: {
                                        description: "Le nom de l'événement sonore à déclencher.",
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    }
                                }
                            },
                            randomize: {
                                description: "Déclenche un événement aléatoire.",
                                type: "array",
                                items: {
                                    type: "object",
                                    required: ["weight"],
                                    properties: {
                                        log: {
                                            description: "Pour le débogage, cela enregistrera un message, avec le nom de l'effet de tir et la position de l'événement. Le message de journal s'affichera dans le journal de contenu.",
                                            type: "string"
                                        },
                                        particle_effect: {
                                            description: "Déclenche un effet de particules.",
                                            type: "object",
                                            required: ["effect", "type"],
                                            properties: {
                                                effect: {
                                                    description: "L'identifiant de l'effet de particules à déclencher.",
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.particle_effect_ids
                                                },
                                                pre_effect_expression: {
                                                    description: "Execute cette expression Molang avant de déclencher l'effet de particules.",
                                                    type: "molang"
                                                },
                                                type: {
                                                    description: "Le type de déclenchement de l'effet de particules.",
                                                    type: "string",
                                                    enum: ["particle", "particle_with_velocity", "emitter", "emitter_bound"]
                                                }
                                            }
                                        },
                                        weight: {
                                            description: "Le poids de cet événement.",
                                            type: "number"
                                        },
                                        sound_effect: {
                                            description: "Déclenche un effet sonore.",
                                            type: "object",
                                            required: ["event_name"],
                                            properties: {
                                                event_name: {
                                                    description: "Le nom de l'événement sonore à déclencher.`",
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                                }
                                            }
                                        },
                                        sequence: {
                                            $ref: "#/properties/particle_effect/properties/events/additionalProperties/properties/sequence"
                                        },
                                        randomize: {
                                            $ref: "#/properties/particle_effect/properties/events/additionalProperties/properties/randomize"
                                        },
                                        expression: {
                                            description: "Execute cette expression Molang sur l'émetteur d'événements.",
                                            type: "molang"
                                        }
                                    }
                                }
                            },
                            sequence: {
                                description: "Déclenche une séquence d'événements.",
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        log: {
                                            description: "Pour le débogage, cela enregistrera un message, avec le nom de l'effet de tir et la position de l'événement. Le message de journal s'affichera dans le journal de contenu.",
                                            type: "string"
                                        },
                                        particle_effect: {
                                            description: "Déclenche un effet de particules.",
                                            type: "object",
                                            required: ["effect", "type"],
                                            properties: {
                                                effect: {
                                                    description: "L'identifiant de l'effet de particules à déclencher.",
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.particle_effect_ids
                                                },
                                                pre_effect_expression: {
                                                    description: "Execute cette expression Molang avant de déclencher l'effet de particules.",
                                                    type: "molang"
                                                },
                                                type: {
                                                    description: "Le type de déclenchement de l'effet de particules.",
                                                    type: "string",
                                                    enum: ["particle", "particle_with_velocity", "emitter", "emitter_bound"]
                                                }
                                            }
                                        },
                                        sound_effect: {
                                            description: "Déclenche un effet sonore.",
                                            type: "object",
                                            required: ["event_name"],
                                            properties: {
                                                event_name: {
                                                    description: "Le nom de l'événement sonore à déclencher.`",
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                                }
                                            }
                                        },
                                        sequence: {
                                            $ref: "#/properties/particle_effect/properties/events/additionalProperties/properties/sequence"
                                        },
                                        randomize: {
                                            $ref: "#/properties/particle_effect/properties/events/additionalProperties/properties/randomize"
                                        },
                                        expression: {
                                            description: "Execute cette expression Molang sur l'émetteur d'événements.",
                                            type: "molang"
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

export const particleEffectSchemaTypeRP: VersionedSchema = {
    fileMatch: ["**/addon/resource_pack/particles/**/*.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};