import { schemaPatterns } from "../../../utils/schemaPatterns";

export const baseSchema = {
    $schema: "https://json-schema.org/draft-07/schema#",
    description: "Ce fichier crée des animations de type Behavior.",
    type: "object",
    required: ["format_version", "animations"],
    properties: {
        format_version: {
            description: "La version du format à utiliser.",
            type: "string",
            enum: [
                "1.8.0", "1.9.0", "1.10.0", "1.11.0", "1.12.0", "1.13.0", "1.14.0", "1.14.1", "1.14.20", "1.14.30", "1.15.0", "1.16.0", "1.16.20", "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90"
            ]
        },
        animations: {
            description: "Contient la définition des Animations.",
            type: "object",
            propertyNames: {
                pattern: schemaPatterns.animation_identifier
            },
            additionalProperties: {
                type: "object",
                properties: {
                    loop: {
                        description: "Définit si l'animation doit boucler, se jouer qu'une seule fois, ou si elle doit s'arrêter et se figer à la dernière frame",
                        oneOf: [
                            {
                                type: "boolean"
                            },
                            {
                                type: "string",
                                enum: ["hold_on_last_frame"]
                            }
                        ]
                    },
                    start_delay: {
                        markdownDescription:
                        "**ℹ️ Expression Molang supportée.**\n\n" +
                        "Définit le delai en secondes à attendre avant de jouer l'animation.",
                        type: "molang"
                    },
                    loop_delay: {
                        markdownDescription:
                        "**ℹ️ Expression Molang supportée.**\n\n" +
                        "Définit le delai en secondes à attendre avant de relancer l'animation si elle est en boucle.",
                        type: "molang"
                    },
                    anim_time_update: {
                        markdownDescription:
                        "**ℹ️ Expression Molang supportée.**\n\n" +
                        "Définit l'écoulement du temps lors de la lecture de l'animation. Par défaut, il s'agit de `query.anim_time + query.delta_time`, ce qui signifie une progression en secondes.",
                        type: "molang"
                    },
                    timeline: {
                        description: "Définit la timeline de l'animation. À chaque keyframe, il est possible d'executer des commandes, des événements d'entité, ou des expressions Molang arbitraires",
                        type: "object",
                        additionalProperties: {
                            oneOf: [
                                {
                                    type: "molang"
                                },
                                {
                                    type: "array",
                                    items: {
                                        type: "molang"
                                    }
                                }
                            ]
                        }
                    },
                    animation_length: {
                        description: "Remplace la valeur calculée (définie comme le temps maximal d'une image clé ou d'un événement) et définit la durée de l'animation en secondes.",
                        type: "number",
                        minimum: 0
                    }
                }
            }
        }
    }
};