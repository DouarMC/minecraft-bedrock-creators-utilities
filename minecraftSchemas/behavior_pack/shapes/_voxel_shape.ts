import { MinecraftJsonSchema } from "../../../common/types/MinecraftJsonSchema";
import { SchemaChange, VersionedSchema } from "../../../common/types/VersionedSchema";
import { schemaPatterns } from "../../shared/schemaPatterns";

const baseSchema: MinecraftJsonSchema = {
    "x-experimental_options": ["Experimental Voxel Shape Features"],
    description: "Ce fichier sert à créer des Voxel Shapes pour les blocs.",
    type: "object",
    required: ["format_version", "minecraft:voxel_shape"],
    properties: {
        format_version: {
            description: "La version du Format à utiliser.",
            type: "string",
            enum: [
                "1.21.110", "1.21.110", "1.21.120", "1.21.130", "1.26.0", "1.26.10", "1.26.20"
            ]
        },
        "minecraft:voxel_shape": {
            description: "Contient la définition du Voxel Shape.",
            type: "object",
            required: ["description", "shape"],
            properties: {
                description: {
                    description: "Contient les propriétés de description du Voxel Shape.",
                    type: "object",
                    required: ["identifier"],
                    properties: {
                        identifier: {
                            description: "L'identifiant du Voxel Shape.",
                            type: "string",
                            pattern: schemaPatterns.identifier_with_namespace_exclude_minecraft,
                            maxLength: 256
                        }
                    }
                },
                shape: {
                    description: "Contient la définition de la forme du Voxel Shape.",
                    type: "object",
                    required: ["boxes"],
                    properties: {
                        boxes: {
                            description:
                            "Une liste de boîtes définissant la forme du Voxel Shape. Chaque boîte est définie par ses coordonnées min et max (x, y, z)." +
                            "\n\nNotes :" +
                            "\n- Les coordonnées de chaque boîte doivent être comprises dans les limites strictes de (-14, -14, -14) à (30, 30, 30) pixels." +
                            "\n- Au moins une boîte doit obligatoirement intersecter ou chevaucher le cube de base du bloc (0 à 16 pixels sur les trois axes)." +
                            "\n- L'étendue totale de la forme finale (la taille globale bout en bout) ne peut pas dépasser 30 pixels sur n'importe quel axe (1 bloc + 14 pixels).",
                            type: "array",
                            minItems: 1,
                            maxItems: 32,
                            items: {
                                type: "object",
                                required: ["min", "max"],
                                properties: {
                                    min: {
                                        description: "Les coordonnées minimales de la boîte (x, y, z).",
                                        oneOf: [
                                            {
                                                type: "array",
                                                minItems: 3,
                                                maxItems: 3,
                                                items: {
                                                    type: "number"
                                                }
                                            },
                                            {
                                                type: "object",
                                                properties: {
                                                    x: {
                                                        default: 0,
                                                        type: "number"
                                                    },
                                                    y: {
                                                        default: 0,
                                                        type: "number"
                                                    },
                                                    z: {
                                                        default: 0,
                                                        type: "number"
                                                    }
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
    }
};

const versionedChanges: SchemaChange[] = [];

export const versionedSchema: VersionedSchema = {
    baseSchema: baseSchema,
    versionedChanges: versionedChanges
};

export default versionedSchema;
