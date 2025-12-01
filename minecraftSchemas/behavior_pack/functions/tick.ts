import { dynamicExamplesSourceKeys } from "../../shared/schemaEnums";
import { MinecraftJsonSchema } from "../../../common/types/MinecraftJsonSchema";
import { VersionedSchema } from "../../../common/types/VersionedSchema";

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

export const versionedSchema: VersionedSchema = {
    baseSchema: baseSchema,
    versionedChanges: []
};

export default versionedSchema;