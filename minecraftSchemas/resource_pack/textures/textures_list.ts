import { dynamicExamplesSourceKeys } from "../../shared/schemaEnums";
import { MinecraftJsonSchema } from "../../../common/types/MinecraftJsonSchema";
import { VersionedSchema } from "../../../common/types/VersionedSchema";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier sert à lister les textures utilisées dans ce Resource Pack.",
    type: "array",
    items: {
        type: "string",
        pattern: "^textures\\/.*",
        "x-dynamic-examples-source": dynamicExamplesSourceKeys.project_texture_file_paths
    }
};

export const versionedSchema: VersionedSchema = {
    baseSchema: baseSchema,
    versionedChanges: []
};

export default versionedSchema;