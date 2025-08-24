import { SchemaType } from "../../../../types/schema";
import { MinecraftJsonSchema } from "../../types/minecraftJsonSchema";

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

export const contentsSchemaTypeBP: SchemaType = {
    fileMatch: ["**/addon/behavior_pack/contents.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};