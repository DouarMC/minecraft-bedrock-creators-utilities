import { dynamicExamplesSourceKeys } from "../../../utils/shared/schemaEnums";
import { MinecraftJsonSchema } from "../../../model";
import { VersionedSchema } from "../../../model/versioning";

const baseSchema: MinecraftJsonSchema = {
    description: "La liste de toutes les langues utilisés dans ce Pack.",
    type: "array",
    items: {
        type: "string",
        "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_language_ids
    }
};

export const languagesSchemaTypeBP: VersionedSchema = {
    fileMatch: ["**/addon/behavior_pack/texts/languages.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};