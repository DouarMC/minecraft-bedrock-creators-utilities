import { dynamicExamplesSourceKeys } from "../../shared/schemaEnums";
import { MinecraftJsonSchema } from "../../../common/types/MinecraftJsonSchema";
import { VersionedSchema } from "../../../common/types/VersionedSchema";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier sert à réferencer les fichiers d'UI qui n'existe pas dans les packs vanilla.",
    type: "object",
    required: ["ui_defs"],
    properties: {
        ui_defs: {
            description: "Définitions des fichiers d'UI.",
            type: "array",
            items: {
                type: "string",
                "x-dynamic-examples-source": dynamicExamplesSourceKeys.project_ui_file_paths
            }
        }
    }
};

export const versionedSchema: VersionedSchema = {
    baseSchema: baseSchema,
    versionedChanges: []
};

export default versionedSchema;