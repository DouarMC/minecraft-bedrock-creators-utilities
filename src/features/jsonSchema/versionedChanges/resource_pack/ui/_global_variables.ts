import { SchemaType } from "../../../../../types/schema";
import { dynamicExamplesSourceKeys } from "../../../shared/schemaEnums";
import { MinecraftJsonSchema } from "../../../types/minecraftJsonSchema";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier sert à créer des variables globales pour l'ensemble des fichiers d'UI.",
    type: "object",
    propertyNames: {
        pattern: "^\\$.*$",
        "x-dynamic-examples-source": dynamicExamplesSourceKeys.vanilla_ui_global_variables
    }
};

export const _globalVariablesSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/ui/_global_variables.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};