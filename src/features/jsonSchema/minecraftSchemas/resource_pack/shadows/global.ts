import { SchemaType } from "../../../../../types/schema";
import { MinecraftJsonSchema } from "../../../../../types/minecraftJsonSchema";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier sert à contrôler le style des Ombres du mode graphique `Vibrant Visuals`.",
    type: "object",
    required: ["format_version", "minecraft:shadow_settings"],
    properties: {
        format_version: {
            description: "La version du format à utiliser.",
            type: "string",
            enum: [
                "1.21.80"
            ]
        },
        "minecraft:shadow_settings": {
            description: "Contient la définition des paramètres d'ombres.",
            type: "object",
            properties: {
                shadow_style: {
                    description:
                    "Définit le style d'ombres utilisé en jeu." +
                    "\n\n- `blocky_shadows`: les ombres sont nettes et carrées" +
                    "\n\n- `soft_shadows`: les ombres sont floues et réalistes, comme dans les shaders classiques.",
                    default: "soft_shadows",
                    type: "string",
                    enum: ["blocky_shadows", "soft_shadows"]
                },
                texel_size: {
                    description: "Spécifie la résolution des ombres `blocky_shadows` en unités de texture.",
                    default: 16,
                    type: "integer"
                }
            }
        }
    }
};

export const shadowSettingsSchemaTypeRP: SchemaType ={
    fileMatch: ["**/addon/resource_pack/shadows/global.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};