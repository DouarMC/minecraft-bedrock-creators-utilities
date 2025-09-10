import { MinecraftJsonSchema } from "../../model";
import { VersionedSchema } from "../../model/versioning";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier sert à repertorier tous les fichiers présents dans un Pack pour des meilleures performances.",
    type: "object",
    properties: {
        content: {
            description: "Liste contenant le chemin d'accès de tous les fichiers présents dans ce Pack.",
            type: "array",
            items: {
                type: "object",
                properties: {
                    path: {
                        description: "Le chemin d'accès d'un fichier du pack.",
                        type: "string"
                    }
                }
            }
        }
    }
};

export const contentsSchemaTypeRP: VersionedSchema = {
    fileMatch: ["**/addon/resource_pack/contents.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};