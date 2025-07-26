import { SchemaType } from "../../../../../types/schema";

const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Ce fichier sert à créer des références de textures pour les Blocs. \nType: `Object`",
    "type": "object",
    "required": ["texture_name", "resource_pack_name", "padding", "num_mip_levels", "texture_data"],
    "properties": {
        "default_leather_color": {
            "description": "Définit la couleur de base pour les armures en cuir. \nType: String",
            "type": "string",
            "pattern": "^#[0-9a-fA-F]{6}$"
        },
        "default_horse_leather_color": {
            "description": "Définit la couleur de base pour les armures de cheval en cuir. \nType: String",
            "type": "string",
            "pattern": "^#[0-9a-fA-F]{6}$"
        },
        "resource_pack_name": {
            "description": "Le nom du resource pack auquel ce fichier est associé. \nType: `String`",
            "type": "string"
        },
        "texture_name": {
            "description": "Le type d'appliquement de Textures. \nType: `String`",
            "const": "atlas.terrain"
        },
        "padding": {
            "description": "Empêcher les textures de déborder visuellement les unes dans les autres. \nType: `Number`",
            "type": "number",
            "default": 8
        },
        "num_mip_levels": {
            "description": "Qualité de la texture vue de loin ou sous un angle. \nType: `Number`",
            "type": "number",
            "default": 4
        },
        "texture_data": {
            "description": "L'inscription de short-name de Textures. \nType: `Object`",
            "type": "object",
            "additionalProperties": {
                "type": "object",
                "properties": {
                    "additive": {
                        "description": "Définit que s'il y a plusieurs textures dans un bloc, elles seront superposées les unes sur les autres. \nType: `Boolean`",
                        "default": false,
                        "type": "boolean"
                    },
                    "textures": {
                        "description": "La/les texture(s) à spécifier. \nType: `String | Object | (String | Object)[]`",
                        "oneOf": [
                            {
                                "type": "string"
                            },
                            {
                                "type": "object",
                                "oneOf": [
                                    {
                                        "required": ["path"],
                                        "properties": {
                                            "path": {
                                                "description": "Le chemin d'accès de la Texture. \nType: `String`",
                                                "type": "string"
                                            },
                                            "overlay_color": {
                                                "description": "La couleur à ajouté sur la texture. \nType: `String`",
                                                "type": "string",
                                                "pattern": "^#([A-Fa-f0-9]{6})$"
                                            },
                                            "tint_color": {
                                                "description": "Définit la couleur qui teinte la texture. C'est différent de `overlay_color` car ce dernier ajoute une couleur par-dessus la texture ce qui peut rendre cette dernière opaque. \nType: `String`",
                                                "type": "string",
                                                "pattern": "^#([A-Fa-f0-9]{6})$"
                                            },
                                            "quad": {
                                                "description": "Définit si seulement le quart supérieur gauche de la texture doit être utilisé. \nType: `Boolean`",
                                                "default": false,
                                                "type": "boolean"
                                            }
                                        }
                                    },
                                    {
                                        "required": ["variations"],
                                        "properties": {
                                            "variations": {
                                                "description": "Définit les dofférentes variations de textures pour cette référece. \nType: `Object[]`",
                                                "type": "array",
                                                "items": {
                                                    "type": "object",
                                                    "required": ["weight"],
                                                    "properties": {
                                                        "weight": {
                                                            "description": "Le poids de chance de la variation. \nType: `Number`",
                                                            "type": "number"
                                                        },
                                                        "path": {
                                                            "description": "Le chemin d'accès de la Texture. \nType: `String`",
                                                            "type": "string"
                                                        },
                                                        "overlay_color": {
                                                            "description": "La couleur à ajouté sur la texture. \nType: `String`",
                                                            "type": "string",
                                                            "pattern": "^#([A-Fa-f0-9]{6})$"
                                                        },
                                                        "tint_color": {
                                                            "description": "Définit la couleur qui teinte la texture. C'est différent de `overlay_color` car ce dernier ajoute une couleur par-dessus la texture ce qui peut rendre cette dernière opaque. \nType: `String`",
                                                            "type": "string",
                                                            "pattern": "^#([A-Fa-f0-9]{6})$"
                                                        },
                                                        "quad": {
                                                            "description": "Définit si seulement le quart supérieur gauche de la texture doit être utilisé. \nType: `Boolean`",
                                                            "default": false,
                                                            "type": "boolean"
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                ]
                            },
                            {
                                "type": "array",
                                "items": {
                                    "oneOf": [
                                        {
                                            "$ref": "#/properties/texture_data/additionalProperties/properties/textures/oneOf/0"
                                        },
                                        {
                                            "$ref": "#/properties/texture_data/additionalProperties/properties/textures/oneOf/1"
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            }
        }
    }
};

export const terrainTextureSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/textures/terrain_texture.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};