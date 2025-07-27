import { SchemaType } from "../../../../../types/schema";
import { dynamicExamplesSourceKeys } from "../../../shared/schemaEnums";
import { schemaPatterns } from "../../../shared/schemaPatterns";

const baseSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    description: "Ce fichier permet de définir les propriétés d'une Dimension.",
    type: "object",
    required: ["format_version", "minecraft:dimension"],
    properties: {
        format_version: {
            description: "La version du format à utiliser.",
            type: "string",
            enum: [
                "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90"
            ]
        },
        "minecraft:dimension": {
            description: "Contient la définition de la Dimension.",
            type: "object",
            required: ["description", "components"],
            properties: {
                description: {
                    description: "Contient toutes les propriétés de descriptions de la Dimension.",
                    type: "object",
                    required: ["identifier"],
                    properties: {
                        identifier: {
                            description: "L'identifiant de la Dimension.",
                            type: "string",
                            pattern: schemaPatterns.identifier_with_namespace,
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.dimension_ids
                        }
                    }
                },
                components: {
                    description: "Contient les composants de la Dimension.",
                    type: "object",
                    required: ["minecraft:generation"],
                    properties: {
                        "minecraft:dimension_bounds": {
                            description: "Définit les limites d'hauteur de la Dimension.",
                            type: "object",
                            required: ["min", "max"],
                            properties: {
                                min: {
                                    description: "La limite minimale qui doit être un multiple de 16.",
                                    type: "integer",
                                    multipleOf: 16,
                                    minimum: -512,
                                    maximum: 512
                                },
                                max: {
                                    description: "La limite maximale qui doit être un multiple de 16.",
                                    type: "integer",
                                    multipleOf: 16,
                                    minimum: -512,
                                    maximum: 512
                                }
                            }
                        },
                        "minecraft:generation": {
                            description: "Définit le type de génération de cette Dimension.",
                            type: "object",
                            required: ["generator_type"],
                            properties: {
                                generator_type: {
                                    description: "Contient le type de génération de la Dimension. Seule `void` est supportée.",
                                    type: "string",
                                    enum: [
                                        "void"
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

export const dimensionSchemaTypeBP: SchemaType = {
    fileMatch: ["**/addon/behavior_pack/dimensions/**/*.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};