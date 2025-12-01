import { MinecraftJsonSchema } from "../../../common/types/MinecraftJsonSchema";
import { VersionedSchema } from "../../../common/types/VersionedSchema";

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

export const versionedSchema: VersionedSchema = {
    baseSchema: baseSchema,
    versionedChanges: []
};

export default versionedSchema;