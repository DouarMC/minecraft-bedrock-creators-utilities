import { SchemaType } from "../../../../../types/schema";

const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Ce fichier sert à définir les valeurs PBR uniforms qui seront les valeurs par défaut des blocs, entités, particules, et les items. Les blocs, entités, particules et items qui n'ont pas de texture set PBR, utiliseront les valeurs définit ici. \nType: `Object`",
    "type": "object",
    "required": ["format_version", "minecraft:pbr_fallback_settings"],
    "properties": {
        "format_version": {
            "description": "La version du format à utiliser. \nType: `String`",
            "type": "string",
            enum: ["1.21.40"]
        }, 
        "minecraft:pbr_fallback_settings": {
            "description": "Contient la définition des paramètres PBR par défaut appliqués aux blocs, entités, particules et items sans texture set PBR. \nType: `Object`",
            "type": "object",
            "properties": {
                "blocks": {
                    "description": "Valeurs PBR par défaut pour tous les blocs ne disposant pas d'un texture set dédiés. \nType: `Object`",
                    "type": "object",
                    "required": ["global_metalness_emissive_roughness_subsurface"],
                    "properties": {
                        "global_metalness_emissive_roughness_subsurface": {
                            "description": "Tableau de quatre entiers [Metalness, Emissive, Roughness, Subsurface] (0-255) ou chaîne hexadécimale à 4 chiffres, utilisé comme valeur de fallback pour les blocs. \nType: `Integer[4] | String` \n- Metalness : degré de comportement métallique. \n- Emissive : intensité lumineuse émise. \n- Roughness : rugosité de la surface. \n- Subsurface : diffusion sous la surface.",
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
                        }
                    }
                },
                "actors": {
                    "description": "Valeurs PBR par défaut pour toutes les entités ne disposant pas d'un texture set dédiés. \nType: `Object`",
                    "type": "object",
                    "required": ["global_metalness_emissive_roughness_subsurface"],
                    "properties": {
                        "global_metalness_emissive_roughness_subsurface": {
                            "description": "Tableau de quatre entiers [Metalness, Emissive, Roughness, Subsurface] (0-255) ou chaîne hexadécimale à 4 chiffres, utilisé comme valeur de fallback pour les entités. \nType: `Integer[4] | String` \n- Metalness : degré de comportement métallique. \n- Emissive : intensité lumineuse émise. \n- Roughness : rugosité de la surface. \n- Subsurface : diffusion sous la surface.",
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
                        }
                    }
                },
                "particles": {
                    "description": "Valeurs PBR par défaut pour toutes les particules ne disposant pas d'un texture set dédiés. \nType: `Object`",
                    "type": "object",
                    "required": ["global_metalness_emissive_roughness_subsurface"],
                    "properties": {
                        "global_metalness_emissive_roughness_subsurface": {
                            "description": "Tableau de quatre entiers [Metalness, Emissive, Roughness, Subsurface] (0-255) ou chaîne hexadécimale à 4 chiffres, utilisé comme valeur de fallback pour les particules. \nType: `Integer[4] | String` \n- Metalness : degré de comportement métallique. \n- Emissive : intensité lumineuse émise. \n- Roughness : rugosité de la surface. \n- Subsurface : diffusion sous la surface.",
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
                        }
                    }
                },
                "items": {
                    "description": "Valeurs PBR par défaut pour tous les items ne disposant pas d'un texture set dédiés. \nType: `Object`",
                    "type": "object",
                    "required": ["global_metalness_emissive_roughness_subsurface"],
                    "properties": {
                        "global_metalness_emissive_roughness_subsurface": {
                            "description": "Tableau de quatre entiers [Metalness, Emissive, Roughness, Subsurface] (0-255) ou chaîne hexadécimale à 4 chiffres, utilisé comme valeur de fallback pour les items. \nType: `Integer[4] | String` \n- Metalness : degré de comportement métallique. \n- Emissive : intensité lumineuse émise. \n- Roughness : rugosité de la surface. \n- Subsurface : diffusion sous la surface.",
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
                        }
                    }
                }
            }
        }
    }
};

export const pbrFallbackSettingsSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/pbr/global.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};