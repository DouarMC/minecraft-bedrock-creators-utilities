import { SchemaType } from "../../../../../types/schema";
import { dynamicExamplesSourceKeys } from "../../../shared/schemaEnums";
import { MinecraftJsonSchema } from "../../../types/minecraftJsonSchema";

const baseSchema: MinecraftJsonSchema = {
    description: "La liste de toutes les langues utilisés dans ce Pack. On peut y ajouter des langues.",
    type: "array",
    items: {
        type: "string",
        "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_language_ids
    }
};

export const languagesSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/texts/languages.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};