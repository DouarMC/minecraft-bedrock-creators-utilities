import { dynamicExamplesSourceKeys } from "../../../utils/shared/schemaEnums";
import { MinecraftJsonSchema } from "../../../../../types/minecraftJsonSchema";
import { VersionedSchema } from "../../../model/versioning";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier sert à créer des variables globales pour l'ensemble des fichiers d'UI.",
    type: "object",
    propertyNames: {
        pattern: "^\\$.*$",
        "x-dynamic-examples-source": dynamicExamplesSourceKeys.vanilla_ui_global_variables
    }
};

export const _globalVariablesSchemaTypeRP: VersionedSchema = {
    fileMatch: ["**/addon/resource_pack/ui/_global_variables.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};