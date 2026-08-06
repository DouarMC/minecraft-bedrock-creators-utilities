import { MinecraftJsonSchema } from "../../../common/types/MinecraftJsonSchema";
import { dynamicExamplesSourceKeys } from "../../shared/schemaEnums";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier sert au Behavior Pack de déclarer les sons pour les utiliser dans le Script.",
    type: "object",
    required: ["format_version", "minecraft:server_sound_definitions"],
    properties: {
        format_version: {
            description: "La version du format à utiliser pour ce fichier.",
            type: "string",
            enum: ["beta"]
        },
        "minecraft:server_sound_definitions": {
            description: "Contient les définitions des son cotés serveur.",
            type: "array",
            items: {
                type: "object",
                required: ["sound_event_name"],
                properties: {
                    sound_event_name: {
                        description: "Le nom de l'événement sonore définit dans `RP/sounds/sound_definitions.json`.",
                        type: "string",
                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                    },
                    duration_info: {
                        description: "Contient les informations sur la durée du son.",
                        type: "object",
                        required: ["mode", "seconds"],
                        properties: {
                            mode: {
                                description:
                                "Définit le mode de calcul de la durée du son." +
                                "\n- `game_time` : le temps est compté en tick." +
                                "\n- `real_time` : le temps est compté en secondes.",
                                type: "string",
                                enum: ["game_time", "real_time"]
                            },
                            seconds: {
                                description: "La durée du son en secondes.",
                                type: "number",
                                minimum: 0
                            },
                            music_info: {
                                description: "Contient les informations sur la musique.",
                                type: "object",
                                properties: {
                                    genres: {
                                        description: "Contient les genres de la musique.",
                                        type: "array",
                                        items: {
                                            type: "string"
                                        }
                                    },
                                    moods: {
                                        description: "Contient les humeurs de la musique.",
                                        type: "array",
                                        items: {
                                            type: "string"
                                        }
                                    },
                                    artist: {
                                        description: "Contient le nom de l'artiste de la musique.",
                                        type: "string"
                                    },
                                    title: {
                                        description: "Contient le titre de la musique.",
                                        type: "string"
                                    }
                                }
                            },
                            tags: {
                                description: "Permet au créateur de definir les filtres et les valeurs en plus.",
                                type: "object",
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
                            }
                        }
                    }
                }
            }
        }
    }
};