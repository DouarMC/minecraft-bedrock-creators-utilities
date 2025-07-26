import { SchemaChange, SchemaType } from "../../../../../types/schema";

const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Ce fichier sert à configurer plusieurs couches PBR (Physically Based Rendering) pour une texture, améliorant ainsi la qualité visuelle. \nType: `Object`",
    "required": ["format_version", "minecraft:texture_set"],
    "properties": {
        "format_version": {
            "description": "La version du Format à utiliser. \nType: `String`",
            "type": "string"
        },
        "minecraft:texture_set": {
            "description": "Contient toute la définition des textures PBR. \nType: `Object`",
            "type": "object",
            "properties": {
                "color": {
                    "description": "Définit la couleur de la texture (en utilisant soit une image RGBA, soit une couleur uniforme) ou définit le nom de la texture d'une couche de TextureSet. \nType: `Integer[4] | String`",
                    "oneOf": [
                        {
                            "type": "array",
                            "minItems": 4,
                            "maxItems": 4,
                            "items": {
                                "type": "integer",
                                "minimum": 0,
                                "maximum": 255
                            }
                        },
                        {
                            "type": "string"
                        }
                    ]
                },
                "normal": {
                    "description": "Applique une carte normale (normal map) à la texture, influençant l'apparence de la surface sans changer sa géométrie. \nType: `String`",
                    "type": "string"
                },
                "heightmap": {
                    "description": "Définit la hauteur de la surface à partir d'une texture, affectant l'élévation des pixels pour donner un effet de relief. \nType: `String`",
                    "type": "string"
                },
                "metalness_emissive_roughness": {
                    "description": "Définit la combinaison de trois propriétés : métallisation, émission de lumière, et rugosité de la surface à travers une texture RGB ou une valeur uniforme. \nType: `Integer[3] | String`",
                    "oneOf": [
                        {
                            "type": "array",
                            "minItems": 3,
                            "maxItems": 3,
                            "items": {
                                "type": "integer",
                                "minimum": 0,
                                "maximum": 255
                            }
                        },
                        {
                            "type": "string"
                        }
                    ]
                }
            }
        }
    }
};

const versionedChanges: SchemaChange[] = [
    {
        version: "1.21.30",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:texture_set", "properties", "metalness_emissive_roughness_subsurface"],
                value: {
                    "description": "Tableau de quatre entiers [Metalness, Emissive, Roughness, Subsurface] (0-255) ou chaîne hexadécimale à 4 chiffres ou une texture, utilisé pour définir comment la lumière réagit avec la surface. \nType: `Integer[4] | String` \n- Metalness : degré de comportement métallique. \n- Emissive : intensité lumineuse émise. \n- Roughness : rugosité de la surface. \n- Subsurface : diffusion sous la surface.",
                    "oneOf": [
                        {
                            "oneOf": [
                                {
                                    "type": "array",
                                    "minItems": 4,
                                    "maxItems": 4,
                                    "items": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 255
                                    }
                                },
                                {
                                    "type": "string",
                                    "pattern": "^#[0-9a-fA-F]{8}$"
                                }
                            ]
                        },
                        {
                            "type": "string"
                        }
                    ]
                }
            }
        ]
    }
];

export const textureSetSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/textures/**/*.json"],
    baseSchema: baseSchema,
    versionedChanges: versionedChanges
};