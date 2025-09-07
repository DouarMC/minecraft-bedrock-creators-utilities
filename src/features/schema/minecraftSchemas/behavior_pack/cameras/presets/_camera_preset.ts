import { schemaPatterns } from "../../../../utils/shared/schemaPatterns";
import { dynamicExamplesSourceKeys } from "../../../../utils/shared/schemaEnums";
import { MinecraftJsonSchema } from "../../../../../../types/minecraftJsonSchema";
import { VersionedSchema } from "../../../../model/versioning";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier sert à créer un preset de Caméra.",
    type: "object",
    required: ["format_version", "minecraft:camera_preset"],
    properties: {
        format_version: {
            description: "La version du format à utiliser.",
            type: "string",
            enum: [
                "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
            ]
        },
        "minecraft:camera_preset": {
            description: "Contient la définition d'un preset de caméra.",
            type: "object",
            required: ["identifier"],
            properties: {
                identifier: {
                    description: "L'identifiant du preset de caméra.",
                    type: "string",
                    pattern: schemaPatterns.identifier_with_namespace,
                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_camera_preset_ids
                },
                inherit_from: {
                    description: "L'identifiant du preset de caméra dont celui-ci hérite de ses propriétés.",
                    type: "string",
                    pattern: schemaPatterns.identifier_with_namespace,
                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.inheritable_camera_preset_ids
                },
                pos_x: {
                    description: "La position X par défaut de la caméra. Utile pour les caméras de type: `free`",
                    default: 0,
                    type: "number"
                },
                pos_y: {
                    description: "La position Y par défaut de la caméra. Utile pour les caméras de type: `free`",
                    default: 0,
                    type: "number"
                },
                pos_z: {
                    description: "La position Z par défaut de la caméra. Utile pour les caméras de type: `free`",
                    default: 0,
                    type: "number"
                },
                rot_x: {
                    description: "La rotation X par défaut de la caméra. Utile pour les caméras de type: `free`",
                    default: 0,
                    type: "number",
                    minimum: -90,
                    maximum: 90
                },
                rot_y: {
                    description: "La rotation Y par défaut de la caméra. Utile pour les caméras de type: `free`",
                    default: 0,
                    type: "number"
                },
                rotation_speed: {
                    description: "Contrôle la vitesse de rotation de la caméra lors du suivi d'une cible (en degrés par seconde). Détermine la fluidité du mouvement de suivi : une valeur de `0` rend le suivi parfait et instantané (la caméra reste toujours alignée avec la cible), tandis qu'une valeur plus élevée crée un mouvement de rotation plus lent et fluide vers la cible. Fonctionne en combinaison avec `snap_to_target`, `continue_targeting` et `tracking_radius`. Utile pour les caméras de type: `free`",
                    default: 0,
                    type: "number",
                    minimum: 0,
                    maximum: 360
                },
                snap_to_target: {
                    description: "Si activé, la caméra s'aligne instantanément avec la cible au début, puis la suit à la vitesse définie par `rotation_speed`. Si désactivé, la caméra tourne progressivement vers la cible dès le départ. Utile pour les caméras de type: `free`",
                    default: false,
                    type: "boolean"
                },
                horizontal_rotation_limit: {
                    description: "Limite l'angle de rotation horizontale (gauche/droite) lors du suivi d'une cible. Format : [limite_gauche, limite_droite] en degrés. La somme ne peut dépasser 360°. Utile pour les caméras de type: `free`",
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
                    description: "Limite l'angle de rotation verticale (haut/bas) lors du suivi d'une cible. Format : [limite_bas, limite_haut] en degrés. La somme ne peut dépasser 180°. Utile pour les caméras de type: `free`",
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
                    description: "Si activé, la caméra continue de suivre la cible même si elle sort des limites de rotation définies ou du rayon de suivi. Si désactivé, la caméra s'arrête de suivre quand ces limites sont atteintes. Utile pour les caméras de type: `free`",
                    default: false,
                    type: "boolean"
                },
                tracking_radius: {
                    description: "Rayon (en blocs) autour de la caméra où elle peut détecter la cible. Utile pour les caméras de type: `free`",
                    default: 50,
                    type: "number"
                },
                listener: {
                    description: "Définit la position qui sera utilisé pour l'écoute des sons.",
                    type: "string",
                    enum: ["camera", "player"]
                },
                player_effects: {
                    description: "Si activé, les effets de potion du joueur (Vision Nocturne, Cécité, etc.) affectent le rendu visuel de la caméra. Si désactivé, la caméra affiche toujours une vue normale sans effets.",
                    default: false,
                    type: "boolean"
                },
                view_offset: {
                    description: "Décale visuellement le joueur par rapport au centre de l'écran. Format : [décalage_horizontal, décalage_vertical]. Exemple : [2, -1] décale le joueur vers la droite et vers le bas. Utile pour les caméras de type : `first_person`, `fixed_boom`, `follow_orbit`, `third_person`, `third_person_front`.",
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
                    description: "Déplace le point de pivot de la caméra sur le joueur. Format : [X, Y, Z] où (0, 0, 0) = centre du joueur. Exemple : [0, 1.5, 0] place le pivot à la hauteur de la tête. Principalement utilisé avec `follow_orbit` pour des rotations précises. Utile pour les caméras de type : `first_person`, `fixed_boom`, `follow_orbit`, `third_person`, `third_person_front`.",
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
                    description: "Angle de rotation vertical initial de la caméra autour du joueur (en degrés). Détermine la hauteur de vue de départ : valeur positive = vue depuis le haut, négative = vue depuis le bas. Utile pour les caméras de type: `fixed_boom`, `follow_orbit`.",
                    type: "number"
                },
                starting_rot_y: {
                    description: "Angle de rotation horizontale initial de la caméra autour du joueur (en degrés). Détermine la position de départ : 0° = face au joueur, 90° = côté droit, 180° = derrière, 270° = côté gauche. Utile pour les caméras de type: `fixed_boom`, `follow_orbit`.",
                    type: "number"
                },
                radius: {
                    description: "Distance entre la caméra et le joueur. Utile pour les caméras de type: `follow_orbit`, `third_person`, `third_person_front`.",
                    default: 10,
                    type: "number",
                    minimum: 0.10000000149011612,
                    maximum: 64
                },
                yaw_limits_min: {
                    description: "Définit la limite minimale de rotation horizontale (gauche/droite). Utilisé pour les caméras de type: `follow_orbit`, `third_person`, `third_person_front`.",
                    type: "number",
                    minimum: -180,
                    maximum: 179.89999389648438
                },
                yaw_limits_max: {
                    description: "Définit la limite maximale de rotation horizontale (gauche/droite). Utilisé pour les caméras de type: `follow_orbit`, `third_person`, `third_person_front`.",
                    type: "number",
                    minimum: -179.89999389648438,
                    maximum: 180.0
                },
                align_target_and_camera_forward: {
                    "x-deprecated": true,
                    description: "**OBSOLETE** - Utilisez `snap_to_target` à la place. Définit si la caméra doit s'aligner avec la direction de la cible.",
                    type: "boolean"
                },
                aim_assist: {
                    description: "Configure l'assistance à la visée pour ce preset de caméra.",
                    type: "object",
                    properties: {
                        preset: {
                            description: "L'identifiant du preset d'aim-assist à utiliser.",
                            type: "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.aim_assist_preset_ids
                        },
                        distance: {
                            description: "Distance maximale à laquelle l'assistance à la visée est active.",
                            type: "number",
                            minimum: 1,
                            maximum: 16
                        },
                        target_mode: {
                            description: "Mode de ciblage de l'assistance : `angle` pour cibler dans un cône d'angle, `distance` pour cibler dans un rayon de distance.",
                            type: "string",
                            enum: ["angle", "distance"]
                        },
                        angle: {
                            description: "Angle de ciblage pour l'assistance à la visée. Format : [angle_horizontal, angle_vertical] ou {x: horizontal, y: vertical}.",
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
                    description: "Définit comment les contrôles réagissent avec cette caméra :\n\n" +
                    "- `player_relative` : Clavier A/D tournent le joueur | Manette stick gauche tourne | Tactile joystick tourne\n" +
                    "- `player_relative_strafe` : Clavier A/D = strafe, souris regarde | Manette stick gauche = strafe, stick droit regarde | Tactile joystick = strafe, glisser écran regarde\n" +
                    "- `locked_player_relative_strafe` : Comme strafe + souris contrôle rotation/visée | Manette stick droit = rotation + visée | Tactile glisser = rotation + visée\n" +
                    "- `camera_relative` : Joueur suit automatiquement la direction de mouvement | Contrôles identiques sur toutes plateformes\n" +
                    "- `camera_relative_strafe` : Mouvement sans rotation auto, souris/stick droit/tactile pour regarder",
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

export const cameraPresetSchemaTypeBP: VersionedSchema = {
    fileMatch: ["**/addon/behavior_pack/cameras/presets/**/*.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};