import { SchemaType } from "../../../../../types/schema";
import { dynamicExamplesSourceKeys } from "../../../shared/schemaEnums";

const baseSchema = {
    description: "Fichier qui permet d'associer des noms de langues à leurs identfiants de langue.",
    type: "array",
    items: [
        {
            type: "array",
            items: [
                {
                    type: "string",
                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.language_ids
                },
                {
                    type: "string"
                }
            ]
        }
    ]
};

export const languagesNamesSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/texts/language_names.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};