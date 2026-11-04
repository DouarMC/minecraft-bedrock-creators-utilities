import { MinecraftJsonSchema } from "../../../../common/types/MinecraftJsonSchema";
import { VersionedSchema } from "../../../../common/types/VersionedSchema";
import { schemaPatterns } from "../../../shared/schemaPatterns";

const baseSchema: MinecraftJsonSchema = {
    "x-experimental_options": ["Point of Interest (POI)"],
    description: "Ce fichier permet de définir un tag de POI.",
    type: "object",
    required: ["format_version", "minecraft:poi_tag"],
    properties: {
        format_version: {
            description: "La version du format de fichier.",
            type: "string",
            enum: ["1.26.40", "1.26.50", "1.26.60"]
        },
        "minecraft:poi_tag": {
            description: "Contient la définition du tag de POI.",
            type: "object",
            required: ["description"],
            properties: {
                description: {
                    description: "Contient les informations de description du tag de POI.",
                    type: "object",
                    required: ["identifier"],
                    properties: {
                        identifier: {
                            description: "L'identifiant unique du tag de POI.",
                            type: "string",
                            pattern: schemaPatterns.identifier_with_namespace,
                            // flag faire dynamic examples source
                        }
                    }
                },
                children: {
                    description: "Liste des tags enfants qui héritent de tous les tags et significations de ce tag.",
                    default: [],
                    type: "array",
                    items: {
                        type: "string",
                        // flag faire dynamic examples source
                    }
                },
                parents: {
                    description: "Liste des tags parents dont ce tag héritera de tous les tags et significations.",
                    default: [],
                    type: "array",
                    items: {
                        type: "string",
                        // flag faire dynamic examples source
                    }
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