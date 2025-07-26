import { SchemaType } from "../../../../../types/schema";

const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Ce fichier sert à contrôler le style des Ombres. \nType: `Object`",
    "type": "object",
    "required": ["format_version", "minecraft:shadow_settings"],
    "properties": {
        "format_version": {
            "description": "La version du format à utiliser. \nType: `String`",
            "type": "string"
        },
        "minecraft:shadow_settings": {
            "description": "Contient la définition des paramètres d'ombres. \nType: `Object`",
            "type": "object",
            "properties": {
                "shadow_style": {
                    "description": "Définit le style d'ombres utilisé en jeu. \nType: `String` \n- `soft`: Les ombres sont floues, réalistes, comme dans les shaders classiques. \n- `blocky`: Les ombres sont nettes, “carrées” et suivent la grille des pixels.",
                    "type": "string",
                    "enum": ["blocky_shadows", "soft_shadows"]
                },
                "texel_size": {
                    "description": "Spécifie la “taille” des pixels des ombres (en général, la résolution des textures de blocs est : 16 ou 32). \nType: `Integer`",
                    "type": "integer"
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