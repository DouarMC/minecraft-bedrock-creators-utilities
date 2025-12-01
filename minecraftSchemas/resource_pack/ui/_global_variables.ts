import { dynamicExamplesSourceKeys } from "../../shared/schemaEnums";
import { MinecraftJsonSchema } from "../../../common/types/MinecraftJsonSchema";
import { VersionedSchema } from "../../../common/types/VersionedSchema";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier sert à créer des variables globales pour l'ensemble des fichiers d'UI.",
    type: "object",
    propertyNames: {
        pattern: "^\\$.*$",
        "x-dynamic-examples-source": dynamicExamplesSourceKeys.vanilla_ui_global_variables
    }
};

export const versionedSchema: VersionedSchema = {
    baseSchema: baseSchema,
    versionedChanges: []
};

export default versionedSchema;