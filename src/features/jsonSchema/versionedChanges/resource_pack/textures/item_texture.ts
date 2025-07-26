import { SchemaType } from "../../../../../types/schema";

const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Ce fichier est utilisé pour définir une texture pour les items. Type: Object",
    "type": "object",
    "required": ["texture_name", "resource_pack_name", "texture_data"],
    "properties": {
        "default_leather_color": {
            "description": "Définit la couleur de base pour les armures en cuir. Type: String",
            "type": "string",
            "pattern": "^#[0-9a-fA-F]{6}$"
        },
        "default_horse_leather_color": {
            "description": "Définit la couleur de base pour les armures de cheval en cuir. Type: String",
            "type": "string",
            "pattern": "^#[0-9a-fA-F]{6}$"
        },
        "resource_pack_name": {
            "description": "Le nom du resource pack auquel ce fichier est associé. Type: String",
            "type": "string"
        },
        "texture_name": {
            "description": "Le type d'appliquement de Textures. Type: String",
            "const": "atlas.items"
        },
        "texture_data": {
            "description": "L'inscription de short-name de Textures. Type: Object",
            "type": "object",
            "additionalProperties": {
                "type": "object",
                "properties": {
                    "textures": {
                        "description": "La/les texture(s) à spécifier. Type: (String | String[])",
                        "oneOf": [
                            {
                                "type": "string"
                            },
                            {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            }
                        ]
                    }
                }
            }
        }
    }
};

export const itemTextureSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/textures/item_texture.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};