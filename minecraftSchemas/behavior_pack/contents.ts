import { MinecraftJsonSchema } from "../../common/types/MinecraftJsonSchema";
import { VersionedSchema } from "../../common/types/VersionedSchema";

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

export const versionedSchema: VersionedSchema = {
    baseSchema: baseSchema,
    versionedChanges: []
};

export default versionedSchema;