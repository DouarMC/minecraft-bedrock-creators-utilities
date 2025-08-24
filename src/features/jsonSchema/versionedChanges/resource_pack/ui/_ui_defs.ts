import { SchemaType } from "../../../../../types/schema";
import { dynamicExamplesSourceKeys } from "../../../shared/schemaEnums";
import { MinecraftJsonSchema } from "../../../types/minecraftJsonSchema";

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

export const _uiDefsSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/ui/_ui_defs.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};