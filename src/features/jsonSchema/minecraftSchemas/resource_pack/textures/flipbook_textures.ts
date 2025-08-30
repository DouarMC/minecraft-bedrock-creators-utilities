import { SchemaType } from "../../../../../types/schema";
import { dynamicExamplesSourceKeys } from "../../../utils/shared/schemaEnums";
import { MinecraftJsonSchema } from "../../../../../types/minecraftJsonSchema";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier sert à créer une animation de texture des blocs.",
    type: "array",
    items: {
        type: "object",
        required: ["flipbook_texture", "atlas_tile", "ticks_per_frame"],
        properties: {
            flipbook_texture: {
                description: "Chemin vers le fichier texture.",
                type: "string",
                "x-dynamic-examples-source": dynamicExamplesSourceKeys.texture_file_paths
            },
            atlas_tile: {
                description: "La reférence de texture definit dans `terrain_texture.json` qui recevra ces paramètres d'animation.",
                type: "string",
                "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_texture_references
            },
            ticks_per_frame: {
                description: "Combien de ticks doivent s'écouler avant que l'image suivante ne soit affichée.",
                type: "integer"
            },
            atlas_index: {
                type: "integer"
            },
            atlas_tile_variant: {
                type: "integer"
            },
            frames: {
                type: "array",
                items: {
                    type: "integer"
                }
            },
            replicate: {
                type: "integer"
            },
            blend_frames: {
                default: true,
                type: "boolean"
            }
        }
    }
};

export const flipbookTexturesSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/textures/flipbook_textures.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};