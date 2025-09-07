import { VersionedSchema } from "../../../../model/versioning";
import { dynamicExamplesSourceKeys } from "../../../../utils/shared/schemaEnums";
import { schemaPatterns } from "../../../../utils/shared/schemaPatterns";
import { MinecraftJsonSchema } from "../../../../../../types/minecraftJsonSchema";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier crée des catégories pour les comportements d'assistance à la visée (Aim-Assist).",
    type: "object",
    required: ["format_version", "minecraft:aim_assist_categories"],
    properties: {
        format_version: {
            description: "La version du format à utiliser.",
            type: "string",
            enum: [
                "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
            ]
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
                                description: "L'identifiant de la catégorie d'Aim-Assist.",
                                type: "string",
                                pattern: schemaPatterns.identifier_with_namespace,
                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_aim_assist_category_ids
                            },
                            priorities: {
                                description: "Les priorités pour les entités et les blocs dans cette catégorie. Un bloc ou une entité qui possède une priorité plus élevée sera priorisé pour être ciblé par rapport à ceux qui en ont une plus basse.",
                                type: "object",
                                properties: {
                                    block_default: {
                                        description: "La priorité pour tous les blocs qui ne sont pas définis dans `blocks`.",
                                        type: "integer",
                                        minimum: 0,
                                        maximum: 100
                                    },
                                    blocks: {
                                        description: "La priotité pour chaque bloc.",
                                        type: "object",
                                        propertyNames: {
                                            pattern: schemaPatterns.identifier_with_namespace,
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        additionalProperties: {
                                            type: "integer",
                                            minimum: 0,
                                            maximum: 100
                                        }
                                    },
                                    entity_default: {
                                        description: "La priorité pour toutes les entités qui ne sont pas définies dans `entities`.",
                                        type: "integer",
                                        minimum: 0,
                                        maximum: 100
                                    },
                                    entities: {
                                        description: "La priorité pour chaque entité.",
                                        type: "object",
                                        propertyNames: {
                                            pattern: schemaPatterns.identifier_with_namespace,
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.entity_ids
                                        },
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

export const aimAssistCategoriesSchemaTypeBP: VersionedSchema = {
    fileMatch: ["**/addon/behavior_pack/aim_assist/categories/categories.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};