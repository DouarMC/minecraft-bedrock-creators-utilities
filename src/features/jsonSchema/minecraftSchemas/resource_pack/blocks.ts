import { SchemaType } from "../../../../types/schema";
import { dynamicExamplesSourceKeys } from "../../utils/shared/schemaEnums";
import { MinecraftJsonSchema } from "../../../../types/minecraftJsonSchema";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier sert à appliquer des textures référencés (uniquement pour les blocs sans les components `minecraft:geometry` et `minecraft:material_instances`), des sons référencés et autres à des blocs.",
    type: "object",
    required: ["format_version"],
    properties: {
        format_version: {
            description: "La version du Format à utiliser.",
            type: "string",
            enum: [
                "1.8.0", "1.9.0", "1.10.0", "1.11.0", "1.12.0", "1.13.0", "1.14.0", "1.14.1", "1.14.20", "1.14.30", "1.15.0", "1.16.0", "1.16.20", "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40"
            ]
        }
    },
    propertyNames: {
        "x-dynamic-examples-source": [dynamicExamplesSourceKeys.block_ids, dynamicExamplesSourceKeys.vanilla_block_ids_without_namespace]
    },
    additionalProperties: {
        type: "object",
        properties: {
            textures: {
                description: "Définit les références de textures à appliquer aux différentes faces du Bloc.",
                oneOf: [
                    {
                        type: "string",
                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_texture_references
                    },
                    {
                        type: "object",
                        propertyNames: {
                            enum: ["down", "up", "north", "east", "side", "south", "west"]
                        },
                        additionalProperties: {
                            description: "La référence de texture à appliquer sur la face du Bloc.",
                            type: "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_texture_references
                        }
                    }
                ]
            },
            sound: {
                description: "La référence de son de bloc à utiliser. Cette référence doit être définie dans le fichier `sounds.json`.",
                type: "string",
                "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_sound_references
            },
            ambient_occlusion_exponent: {
                description: "Définit l'occlusion ambiante du Bloc.",
                type: "number"
            },
            carried_textures: {
                description: "Définit les textures du Bloc quand il est dans l'inventaire.",
                oneOf: [
                    {
                        type: "string",
                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_texture_references
                    },
                    {
                        type: "object",
                        propertyNames: {
                            enum: ["down", "up", "north", "east", "side", "south", "west"]
                        },
                        additionalProperties: {
                            description: "La référence de texture à appliquer sur la face du Bloc.",
                            type: "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_texture_references
                        }
                    }
                ]
            },
            isotropic: {
                description: "Définit les faces qui seront rotationné aléatoirement.",
                oneOf: [
                    {
                        type: "boolean"
                    },
                    {
                        type: "object",
                        propertyNames: {
                            enum: ["down", "up", "north", "east", "south", "west"]
                        },
                        additionalProperties: {
                            description: "Définit si la face du Bloc sera rotationné aléatoirement.",
                            type: "boolean"
                        }
                    }
                ]
            }
        }
    }
};

export const blocksSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/blocks.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};