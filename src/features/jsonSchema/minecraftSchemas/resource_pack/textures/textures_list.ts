import { SchemaType } from "../../../../../types/schema";
import { dynamicExamplesSourceKeys } from "../../../utils/shared/schemaEnums";
import { MinecraftJsonSchema } from "../../../../../types/minecraftJsonSchema";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier sert à lister les textures utilisées dans ce Resource Pack.",
    type: "array",
    items: {
        type: "string",
        pattern: "^textures\\/.*",
        "x-dynamic-examples-source": dynamicExamplesSourceKeys.project_texture_file_paths
    }
};

export const texturesListSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/textures/textures_list.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};