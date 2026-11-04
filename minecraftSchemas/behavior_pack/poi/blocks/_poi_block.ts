import { MinecraftJsonSchema } from "../../../../common/types/MinecraftJsonSchema";
import { VersionedSchema } from "../../../../common/types/VersionedSchema";
import { dynamicExamplesSourceKeys } from "../../../shared/schemaEnums";
import { schemaPatterns } from "../../../shared/schemaPatterns";

const baseSchema: MinecraftJsonSchema = {
    "x-experimental_options": ["Point of Interest (POI)"],
    description: "Ce fichier permet d'assigner une POI à une liste de blocs.",
    type: "object",
    required: ["format_version", "minecraft:poi_block"],
    properties: {
        format_version: {
            description: "La version du format de fichier.",
            type: "string",
            enum: ["1.26.40", "1.26.50", "1.26.60"]
        },
        "minecraft:poi_block": {
            description: "Contient la définition de la POI et la liste des blocs associés.",
            type: "object",
            required: ["description", "blocks"],
            properties: {
                description: {
                    description: "Contient les informations de description de la POI.",
                    type: "object",
                    required: ["identifier"],
                    properties: {
                        identifier: {
                            description: "L'identifiant unique de la POI.",
                            type: "string",
                            pattern: schemaPatterns.identifier_with_namespace,
                            // flag faire dynamic examples source
                        }
                    }
                },
                blocks: {
                    description: "La liste des blocs qui représentent cette POI dans un monde. Il faut faire attention à sélectionner des blocs qui seront rares/infréquents dans le monde.",
                    type: "array",
                    items: {
                        type: "string",
                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                    }
                },
                tags: {
                    description: "Liste des tags pour la POI. Les tags sont utilisés pour indiquer la fonctionnalité. Par exemple, `minecraft:bee_home` est utilisé pour indiquer un bloc valide pour la maison d'une abeille.",
                    default: [],
                    type: "array",
                    items: {
                        type: "string",
                        // flag faire dynamic examples source
                    }
                },
                tickets: {
                    description: "Le nombre d'entités qui peuvent réserver une POI de ce type.",
                    default: 0,
                    type: "integer",
                    minimum: 0,
                    maximum: 255
                },
                usable_distance: {
                    description: "Représente la distance générale à partir de laquelle cette POI devrait être utilisable.",
                    default: 1,
                    type: "integer",
                    minimum: 0,
                    maximum: 255
                }
            }
        }
    }
};

export const versionedSchema: VersionedSchema = {
    baseSchema: baseSchema,
    versionedChanges: []
};

export default versionedSchema;