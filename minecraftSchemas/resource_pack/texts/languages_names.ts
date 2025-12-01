import { dynamicExamplesSourceKeys } from "../../shared/schemaEnums";
import { MinecraftJsonSchema } from "../../../common/types/MinecraftJsonSchema";
import { VersionedSchema } from "../../../common/types/VersionedSchema";

const baseSchema: MinecraftJsonSchema = {
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

export const versionedSchema: VersionedSchema = {
    baseSchema: baseSchema,
    versionedChanges: []
};

export default versionedSchema;