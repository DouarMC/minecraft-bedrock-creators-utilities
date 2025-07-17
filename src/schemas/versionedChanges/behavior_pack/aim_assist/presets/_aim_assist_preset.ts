import { schemaPatterns } from "../../../../utils/schemaPatterns";

export const baseSchema = {
    $schema: "https://json-schema.org/draft-07/schema#",
    description: "Ce fichier crée des presets d'assistance à la visée (Aim-Assist).",
    type: "object",
    required: ["format_version", "minecraft:aim_assist_preset"],
    properties: {
        format_version: {
            description: "La version du format à utiliser.",
            type: "string",
            enum: ["1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90"]
        },
        "minecraft:aim_assist_preset": {
            description: "Contient la définition du preset d'Aim-Assist.",
            type: "object",
            required: ["identifier"],
            properties: {
                identifier: {
                    description: "L'identifiant du preset d'Aim-Assist.",
                    type: "string",
                    pattern: schemaPatterns.identifier_with_namespace
                },
                item_settings: {
                    description: "La catégorie d'Aim-Assist à utiliser pour des items spécifiques que le joueur tient dans sa main.",
                    type: "object",
                    additionalProperties: {
                        type: "string"
                    }
                },
                default_item_settings: {
                    description: "La catégorie d'Aim-Assist à utiliser par défaut pour les items que le joueur tient dans sa main.",
                    type: "string"
                },
                hand_settings: {
                    description: "La catégorie d'Aim-Assist à utiliser pour les joueurs qui n'ont pas d'item dans leur main.",
                    type: "string"
                },
                exclusion_list: {
                    description: "Liste des blocs/entités qui ne doivent pas être affectés par l'Aim-Assist.",
                    type: "array",
                    items: {
                        type: "string"
                    }
                },
                liquid_targeting_list: {
                    description: "Liste des items qui cibleront les blocs liquides avec l'Aim-Assist lorsqu'ils sont tenus dans la main.",
                    type: "array",
                    items: {
                        type: "string"
                    }
                }
            }
        }
    }
};