import { dynamicExamplesSourceKeys } from "../../../../utils/schemaEnums";

export const baseSchema = {
    $schema: "https://json-schema.org/draft-07/schema#",
    description: "Ce fichier crée des catégories pour les comportements d'assistance à la visée (Aim-Assist).",
    type: "object",
    required: ["format_version", "minecraft:aim_assist_categories"],
    properties: {
        format_version: {
            description: "La version du format à utiliser.",
            type: "string",
            enum: ["1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90"]
        },
        "minecraft:aim_assist_categories": {
            description: "Contient la définition des catégories d'Aim-Assist.",
            type: "object",
            required: ["categories"],
            properties: {
                categories: {
                    description: "Les catégories d'Aim-Assist pouvant être utilisées par les presets d'Aim-Assist.",
                    type: "array",
                    items: {
                        type: "object",
                        required: ["name", "priorities"],
                        properties: {
                            name: {
                                description: "Le nom de la catégorie d'Aim-Assist.",
                                type: "string",
                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.aim_assist_category_ids
                            },
                            entity_default: {
                                description: "La priorité par défaut de la catégorie d'Aim-Assist pour les entités.",
                                type: "integer"
                            },
                            block_default: {
                                description: "La priorité par défaut de la catégorie d'Aim-Assist pour les blocs.",
                                type: "integer"
                            },
                            priorities: {
                                description: "Les priorités pour les entités et les blocs dans cette catégorie.",
                                type: "object",
                                properties: {
                                    block_default: {
                                        description: "La priorité par défaut pour les blocs dans cette catégorie.",
                                        type: "integer",
                                        minimum: 0,
                                        maximum: 100
                                    },
                                    blocks: {
                                        description: "Les priorités spécifiques pour les blocs dans cette catégorie.",
                                        type: "object",
                                        additionalProperties: {
                                            type: "integer",
                                            minimum: 0,
                                            maximum: 100
                                        }
                                    },
                                    entity_default: {
                                        description: "La priorité par défaut pour les entités dans cette catégorie.",
                                        type: "integer",
                                        minimum: 0,
                                        maximum: 100
                                    },
                                    entities: {
                                        description: "Les priorités spécifiques pour les entités dans cette catégorie.",
                                        type: "object",
                                        additionalProperties: {
                                            type: "integer",
                                            minimum: 0,
                                            maximum: 100
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