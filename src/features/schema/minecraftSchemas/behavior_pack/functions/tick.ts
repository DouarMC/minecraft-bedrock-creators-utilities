import { dynamicExamplesSourceKeys } from "../../../utils/shared/schemaEnums";
import { MinecraftJsonSchema } from "../../../model";
import { VersionedSchema } from "../../../model/versioning";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier sert à executer en boucle des fonctions de commandes.",
    type: "object",
    required: ["values"],
    properties: {
        values: {
            description: "Les chemins d'accès aux fichiers de fonctions à exécuter en boucle.",
            type: "array",
            items: {
                type: "string",
                "x-dynamic-examples-source": dynamicExamplesSourceKeys.mcfunction_file_paths_without_extension
            }
        }
    }
};

export const tickSchemaTypeBP: VersionedSchema = {
    fileMatch: ["**/addon/behavior_pack/functions/tick.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};