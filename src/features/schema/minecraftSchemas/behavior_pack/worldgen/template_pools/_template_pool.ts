import { dynamicExamplesSourceKeys } from "../../../../utils/shared/schemaEnums";
import { schemaPatterns } from "../../../../utils/shared/schemaPatterns";
import { MinecraftJsonSchema } from "../../../../model";
import { VersionedSchema } from "../../../../model/versioning";

const baseSchema: MinecraftJsonSchema = {
    "x-experimental_options": ["Data Driven Jigsaw Structures"],
    description: "Ce fichier sert à définir une Template Pool pour les structures Jigsaw. Les Template Pools sont des groupes de structures templates liées avec des poids et des processeurs assignés. Pendant la génération du monde, la Jigsaw Structure Start Pool spécifie quelle Template Pool utiliser en premier. Un Structure Template est ensuite choisi aléatoirement dans le pool et placé comme première pièce de structure. Les blocs Jigsaw à l'intérieur de la structure placée peuvent également spécifier des Template Pools à partir desquels les pièces de structure suivantes sont placées récursivement jusqu'à ce que la Jigsaw Structure soit entièrement générée.",
    type: "object",
    required: ["format_version", "minecraft:template_pool"],
    properties: {
        format_version: {
            description: "La version du Format à utiliser.",
            type: "string",
            enum: [
                "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
            ]
        },
        "minecraft:template_pool": {
            description: "Contient la définition de la Template Pool.",
            type: "object",
            required: ["description", "elements"],
            properties: {
                description: {
                    description: "Contient les propriétés de description de la Template Pool.",
                    type: "object",
                    required: ["identifier"],
                    properties: {
                        identifier: {
                            description: "L'identifiant de la Template Pool.",
                            type: "string",
                            pattern: schemaPatterns.identifier_with_namespace,
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_template_pool_ids
                        }
                    }
                },
                elements: {
                    description: "Liste des paires de Structure Template et de liste de processeurs.",
                    type: "array",
                    items: {
                        type: "object",
                        required: ["element"],
                        properties: {
                            element: {
                                description: "Un group de modèle de structure, la liste de processeurs à utiliser lors du placement de la structure, et son poids qui détermine la probabilité que l'élément soit choisi.",
                                oneOf: [
                                    {
                                        type: "object",
                                        required: ["element_type"],
                                        properties: {
                                            element_type: {
                                                description: "Le type de l'élément.",
                                                type: "string",
                                                const: "minecraft:empty_pool_element",
                                                enum: [
                                                    "minecraft:empty_pool_element",
                                                    "minecraft:single_pool_element"
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        type: "object",
                                        required: ["element_type", "location"],
                                        properties: {
                                            element_type: {
                                                description: "Le type de l'élément. \nType: `String`",
                                                type: "string",
                                                const: "minecraft:single_pool_element",
                                                enum: [
                                                    "minecraft:empty_pool_element",
                                                    "minecraft:single_pool_element"
                                                ]
                                            },
                                            location: {
                                                description: "Le chemin du fichier du modèle de structure. Ce chemin est relatif au dossier structures du pack de comportement.",
                                                type: "string"
                                            },
                                            processors: {
                                                description: "L'identifiant de la liste de processeurs à utiliser lors du placement de la structure.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.processor_ids
                                            },
                                            projection: {
                                                description: "Spécifie comment les structures doivent être placées par rapport au terrain.",
                                                type: "string",
                                                enum: ["rigid", "terrain_matching"]
                                            }
                                        }
                                    }
                                ]
                            },
                            weight: {
                                description: "Le probabilité pondérée de choisir l'élément dans le pool. Par exemple, un pool de modèles contenant 2 structures avec des poids de 1 et 3 aura respectivement 25% et 75% de chances d'être choisi.",
                                type: "integer",
                                minimum: 1,
                                maximum: 200
                            }
                        }
                    }
                },
                fallback: {
                    description: "Template Pool de secours à utiliser si aucun élément du pool ne peut être placé avec succès.",
                    default: "minecraft:empty",
                    type: "string"
                }
            }
        }
    }
};

export const templatePoolSchemaTypeBP: VersionedSchema = {
    fileMatch: ["**/addon/behavior_pack/worldgen/template_pools/*.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};