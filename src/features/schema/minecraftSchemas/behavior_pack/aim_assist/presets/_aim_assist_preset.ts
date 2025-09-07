import { dynamicExamplesSourceKeys } from "../../../../utils/shared/schemaEnums";
import { schemaPatterns } from "../../../../utils/shared/schemaPatterns";
import { MinecraftJsonSchema } from "../../../../../../types/minecraftJsonSchema";
import { VersionedSchema } from "../../../../model/versioning";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier crée des presets d'assistance à la visée (Aim-Assist).",
    type: "object",
    required: ["format_version", "minecraft:aim_assist_preset"],
    properties: {
        format_version: {
            description: "La version du format à utiliser.",
            type: "string",
            enum: [
                "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
            ]
        },
        "minecraft:aim_assist_preset": {
            description: "Contient la définition du preset d'Aim-Assist.",
            type: "object",
            required: ["identifier"],
            properties: {
                identifier: {
                    description: "L'identifiant du preset d'Aim-Assist.",
                    type: "string",
                    pattern: schemaPatterns.identifier_with_namespace,
                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_aim_assist_preset_ids
                },
                item_settings: {
                    description: "La catégorie d'Aim-Assist à utiliser pour des items spécifiques que le joueur tient dans sa main.",
                    type: "object",
                    propertyNames: {
                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                    },
                    additionalProperties: {
                        type: "string",
                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.aim_assist_category_ids
                    }
                },
                default_item_settings: {
                    description: "La catégorie d'Aim-Assist à utiliser pour les items qui ne sont pas définis dans `item_settings` que le joueur tient dans sa main.",
                    type: "string",
                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.aim_assist_category_ids
                },
                hand_settings: {
                    description: "La catégorie d'Aim-Assist à utiliser pour les joueurs qui n'ont pas d'item dans leur main.",
                    type: "string",
                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.aim_assist_category_ids
                },
                exclusion_list: {
                    description: "Liste des blocs/entités qui ne doivent pas être affectés par l'Aim-Assist.",
                    type: "array",
                    items: {
                        type: "string",
                        "x-dynamic-examples-source": [dynamicExamplesSourceKeys.block_ids, dynamicExamplesSourceKeys.entity_ids]
                    }
                },
                liquid_targeting_list: {
                    description: "Liste des items qui cibleront les blocs liquides avec l'Aim-Assist lorsqu'ils sont tenus dans la main.",
                    type: "array",
                    items: {
                        type: "string",
                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                    }
                }
            }
        }
    }
};

export const aimAssistPresetSchemaTypeBP: VersionedSchema = {
    fileMatch: ["**/addon/behavior_pack/aim_assist/presets/**/*.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};