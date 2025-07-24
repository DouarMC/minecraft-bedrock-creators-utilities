import { schemaPatterns } from "../../../../shared/schemaPatterns";
import { SchemaType } from "../../../../../../types/schema";

const baseSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    description: "Ce fichier sert à créer un preset de Caméra.",
    type: "object",
    required: ["format_version", "minecraft:camera_preset"],
    properties: {
        format_version: {
            description: "La version du format à utiliser.",
            type: "string",
            enum: [
                "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90"
            ]
        },
        "minecraft:camera_preset": {
            description: "Contient la définition d'un preset de caméra.",
            type: "object",
            properties: {
                identifier: {
                    description: "L'identifiant du preset de caméra.",
                    type: "string",
                    pattern: schemaPatterns.identifier_with_namespace
                },
                inherit_from: {
                    description: "L'identifiant du preset de caméra dont celui-ci hérite de ses propriétés.",
                    type: "string",
                    pattern: schemaPatterns.identifier_with_namespace
                },
                pos_x: {
                    description: "La position X par défaut de la caméra de type `free`.",
                    default: 0,
                    type: "number"
                },
                pos_y: {
                    description: "La position Y par défaut de la caméra de type `free`.",
                    default: 0,
                    type: "number"
                },
                pos_z: {
                    description: "La position Z par défaut de la caméra de type `free`.",
                    default: 0,
                    type: "number"
                },
                rot_x: {
                    description: "La rotation X par défaut de la caméra de type `free`.",
                    default: 0,
                    type: "number",
                    minimum: -90,
                    maximum: 90
                },
                rot_y: {
                    description: "La rotation Y par défaut de la caméra de type `free`.",
                    default: 0,
                    type: "number"
                },
                rotation_speed: {
                    description: "Définit la vitesse de rotation de la caméra en degrés par seconde. Si la valeur est `0`, le suivi est parfait toujours aligné avec la cible.",
                    default: 0,
                    type: "number",
                    minimum: 0
                },
                snap_to_target: {
                    description: "Définit si la caméra doit s'aligner immédiatement avec la cible puis suivre à la vitesse définie par `rotation_speed`.",
                    type: "boolean"
                },
                horizontal_rotation_limit: {
                    description: "Définit la limite de rotation horizontale (gauche/droite). La somme des valeurs ne peut dépasser 360°.",
                    type: "array",
                    minItems: 2,
                    maxItems: 2,
                    items: {
                        type: "number",
                        minimum: 0,
                        maximum: 360
                    }
                },
                vertical_rotation_limit: {
                    description: "Définit la limite de rotation verticale (haut/bas). La somme des valeurs ne peut dépasser 180°.",
                    type: "array",
                    minItems: 2,
                    maxItems: 2,
                    items: {
                        type: "number",
                        minimum: 0,
                        maximum: 180
                    }
                },
                continue_targeting: {
                    description: "Définit si la caméra doit continuer à suivre la cible même si elle sort des limites de rotation ou de suivi.",
                    default: false,
                    type: "boolean"
                },
                tracking_radius: {
                    description: "Rayon (en blocs) autour de la caméra où elle peut détecter la cible.",
                    default: 50,
                    type: "number"
                },
                listener: {
                    description: "Définit la position qui sera utilisé pour l'écoute des sons.",
                    type: "string",
                    enum: ["camera", "player"]
                },
                player_effects: {
                    description: "Définit si ce Preset de Caméra contiendra les effets de potions du joueur comme Vision Nocturne ou Cécité.",
                    default: false,
                    type: "boolean"
                },
                view_offset: {
                    description: "Point d'ancrage qui est au centre de l'écran. Définit le décalage du joueur entre le centre de l'écran et lui.",
                    type: "array",
                    minItems: 2,
                    maxItems: 2,
                    items: {
                        type: "number",
                        minimum: -64,
                        maximum: 64
                    }
                },
                entity_offset: {
                    description: "Le décalage d'entité définit le point de pivot de la caméra sur le joueur (0, 0, 0 étant son centre) et est uniquement compatible avec le préréglage follow_orbit pour permettre une rotation précise autour du joueur.",
                    type: "array",
                    minItems: 3,
                    maxItems: 3,
                    items: {
                        type: "number",
                        minimum: -64,
                        maximum: 64
                    }
                },
                starting_rot_x: {
                    description: "Définit la rotation X initiale autour du joueur.",
                    type: "number"
                },
                starting_rot_y: {
                    description: "Définit la rotation Y initiale autour du joueur.",
                    type: "number"
                },
                radius: {
                    description: "Distance entre la caméra et le joueur.",
                    default: 10,
                    type: "number",
                    minimum: 0.10000000149011612,
                    maximum: 64
                },
                yaw_limits_min: {
                    description: "Définit la limite minimale de rotation horizontale (gauche/droite).",
                    type: "number",
                    minimum: -180,
                    maximum: 179.89999389648438
                },
                yaw_limits_max: {
                    description: "Définit la limite maximale de rotation horizontale (gauche/droite).",
                    type: "number",
                    minimum: -179.89999389648438,
                    maximum: 180.0
                },
                align_target_and_camera_forward: {
                    description: "**OBSOLETE** - Utilisez `snap_to_target` à la place. Définit si la caméra doit s'aligner avec la direction de la cible.",
                    type: "boolean"
                },
                aim_assist: {
                    description: "Définit le preset d'aim-assist à utiliser pour ce preset de caméra.",
                    type: "object",
                    properties: {
                        preset: {
                            description: "L'identifiant du preset d'aim-assist à utiliser.",
                            type: "string",
                            pattern: schemaPatterns.identifier_with_namespace
                        },
                        distance: {
                            type: "number"
                        },
                        target_mode: {
                            type: "string",
                            enum: ["angle", "distance"]
                        },
                        angle: {
                            oneOf: [
                                {
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                                {
                                    type: "object",
                                    properties: {
                                        x: {
                                            type: "number"
                                        },
                                        y: {
                                            type: "number"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                },
                control_scheme: {
                    description: "Définit le schéma de controle par défaut à utiliser pour ce preset de Caméra.",
                    type: "string",
                    enum: [
                        "locked_player_relative_strafe",
                        "camera_relative",
                        "camera_relative_strafe",
                        "player_relative",
                        "player_relative_strafe"
                    ]
                }
            }
        }
    }
};

export const cameraPresetSchemaTypeBP: SchemaType = {
    fileMatch: ["**/addon/behavior_pack/cameras/presets/**/*.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};