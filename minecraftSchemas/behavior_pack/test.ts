import { MinecraftJsonSchema } from "../../common/types/MinecraftJsonSchema";
import { SchemaChange, VersionedSchema } from "../../common/types/VersionedSchema";

const baseSchema: MinecraftJsonSchema = {
    description: "Fichier Test",
    type: "object",
    properties: {
        format_version: {
            description: "La version du format à utiliser.",
            type: "string",
            enum: [
                "1.8.0", "1.9.0", "1.10.0", "1.11.0", "1.12.0", "1.13.0", "1.14.0", "1.14.1", "1.14.20", "1.14.30", "1.15.0", "1.16.0", "1.16.20", "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100", "1.21.110", "1.21.120", "1.21.130", "1.26.0", "1.26.10",
            ]
        },
        "minecraft:test": {
            description: "Contient definition des tests",
            type: "object",
            properties: {
                description: {
                    description: "Description du test",
                    type: "string"
                },

                components: {
                    description: "Contient les composants du test",
                    type: "object",
                    properties: {
                        "minecraft:example_component": {
                            description: "Un composant d'exemple pour les tests",
                            type: "object"
                        }
                    }
                }
            }
        }
    }
};

const versionedChanges: SchemaChange[] = [
    {
        version: "1.26.0",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:test", "properties", "components", "properties", "minecraft:xxx_component"],
                value: {
                    description: "Un composant d'exemple pour les tests",
                    type: "number"
                }
            }
        ]
    }
];

export const versionedSchema: VersionedSchema = {
    baseSchema: baseSchema,
    versionedChanges: versionedChanges
};

export default versionedSchema;