import { MinecraftJsonSchema } from "../../../model";
import { VersionedSchema } from "../../../model/versioning";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier sert à créer des élements UI.",
    type: "object",
    "properties": {
        "namespace": {
            "description": "Namespace pour les éléments UI définit dans ce fichier. \nType: `String`",
            "type": "string"
        }
    }
};

export const uiElementSchemaTypeRP: VersionedSchema = {
    fileMatch: ["**/addon/resource_pack/ui/**/*.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};