import { dynamicExamplesSourceKeys } from "../../shared/schemaEnums";
import { MinecraftJsonSchema } from "../../../common/types/MinecraftJsonSchema";
import { VersionedSchema } from "../../../common/types/VersionedSchema";

const baseSchema: MinecraftJsonSchema = {
    description: "La liste de toutes les langues utilisés dans ce Pack. On peut y ajouter des langues.",
    type: "array",
    items: {
        type: "string",
        "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_language_ids
    }
};

export const versionedSchema: VersionedSchema = {
    baseSchema: baseSchema,
    versionedChanges: []
};

export default versionedSchema;