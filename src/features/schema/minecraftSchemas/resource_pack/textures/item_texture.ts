import { dynamicExamplesSourceKeys } from "../../../utils/shared/schemaEnums";
import { schemaPatterns } from "../../../utils/shared/schemaPatterns";
import { MinecraftJsonSchema } from "../../../model";
import { VersionedSchema } from "../../../model/versioning";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier sert à créer des références de textures pour les items.",
    type: "object",
    required: ["texture_data"],
    properties: {
        default_leather_color: {
            description: "Définit la couleur par défaut pour les armures en cuir.",
            type: "string",
            pattern: schemaPatterns.color_hex
        },
        default_horse_leather_color: {
            description: "Définit la couleur par défaut pour les armures en cuir de cheval.",
            type: "string",
            pattern: schemaPatterns.color_hex
        },
        resource_pack_name: {
            description: "Le nom du resource pack auquel ce fichier est associé.",
            type: "string"
        },
        texture_name: {
            description: "Définit l'atlas qui est utilisé qui contient les textures en plus petites. L'utilité des atlas est de réduire le nombre de textures que le jeu charge.",
            default: "atlas.items",
            type: "string",
            enum: ["atlas.items"]
        },
        texture_data: {
            description: "Contient les références de textures pour les items.",
            type: "object",
            propertyNames: {
                "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_item_texture_references
            },
            additionalProperties: {
                type: "object",
                required: ["textures"],
                properties: {
                    textures: {
                        description: "La/les texture(s) à spécifier.",
                        oneOf: [
                            {
                                type: "string",
                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.texture_file_paths
                            },
                            {
                                type: "array",
                                items: {
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.texture_file_paths
                                }
                            }
                        ]
                    }
                }
            }
        }
    }
};

export const itemTextureSchemaTypeRP: VersionedSchema = {
    fileMatch: ["**/addon/resource_pack/textures/item_texture.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};