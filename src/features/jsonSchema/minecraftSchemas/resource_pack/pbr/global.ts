import { SchemaType } from "../../../../../types/schema";
import { schemaPatterns } from "../../../utils/shared/schemaPatterns";
import { MinecraftJsonSchema } from "../../../../../types/minecraftJsonSchema";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier sert à définir les valeurs PBR uniforms qui seront les valeurs par défaut des blocs, entités, particules, et les items. Les blocs, entités, particules et items qui n'ont pas de texture set PBR, utiliseront les valeurs définit ici.",
    type: "object",
    required: ["format_version", "minecraft:pbr_fallback_settings"],
    properties: {
        format_version: {
            description: "La version du format à utiliser.",
            type: "string",
            enum: ["1.21.40"]
        }, 
        "minecraft:pbr_fallback_settings": {
            description: "Contient la définition des paramètres PBR par défaut appliqués aux blocs, entités, particules et items sans texture set PBR.",
            type: "object",
            properties: {
                blocks: {
                    description: "Valeurs PBR par défaut pour tous les blocs ne disposant pas d'un texture set dédiés.",
                    type: "object",
                    required: ["global_metalness_emissive_roughness_subsurface"],
                    properties: {
                        global_metalness_emissive_roughness_subsurface: {
                            description: "Tableau de quatre entiers [Metalness, Emissive, Roughness, Subsurface] (0-255) ou chaîne hexadécimale à 4 chiffres, utilisé comme valeur de fallback pour les blocs.",
                            oneOf: [
                                {
                                    type: "array",
                                    minItems: 4,
                                    maxItems: 4,
                                    items: {
                                        type: "integer",
                                        minimum: 0,
                                        maximum: 255
                                    }
                                },
                                {
                                    type: "string",
                                    pattern: schemaPatterns.color_hex_rgba
                                }
                            ]
                        }
                    }
                },
                actors: {
                    description: "Valeurs PBR par défaut pour toutes les entités ne disposant pas d'un texture set dédiés.",
                    type: "object",
                    required: ["global_metalness_emissive_roughness_subsurface"],
                    properties: {
                        global_metalness_emissive_roughness_subsurface: {
                            description: "Tableau de quatre entiers [Metalness, Emissive, Roughness, Subsurface] (0-255) ou chaîne hexadécimale à 4 chiffres, utilisé comme valeur de fallback pour les blocs.",
                            oneOf: [
                                {
                                    type: "array",
                                    minItems: 4,
                                    maxItems: 4,
                                    items: {
                                        type: "integer",
                                        minimum: 0,
                                        maximum: 255
                                    }
                                },
                                {
                                    type: "string",
                                    pattern: schemaPatterns.color_hex_rgba
                                }
                            ]
                        }
                    }
                },
                particles: {
                    description: "Valeurs PBR par défaut pour toutes les particules ne disposant pas d'un texture set dédiés.",
                    type: "object",
                    required: ["global_metalness_emissive_roughness_subsurface"],
                    properties: {
                        global_metalness_emissive_roughness_subsurface: {
                            description: "Tableau de quatre entiers [Metalness, Emissive, Roughness, Subsurface] (0-255) ou chaîne hexadécimale à 4 chiffres, utilisé comme valeur de fallback pour les blocs.",
                            oneOf: [
                                {
                                    type: "array",
                                    minItems: 4,
                                    maxItems: 4,
                                    items: {
                                        type: "integer",
                                        minimum: 0,
                                        maximum: 255
                                    }
                                },
                                {
                                    type: "string",
                                    pattern: schemaPatterns.color_hex_rgba
                                }
                            ]
                        }
                    }
                },
                items: {
                    description: "Valeurs PBR par défaut pour tous les items ne disposant pas d'un texture set dédiés.",
                    type: "object",
                    required: ["global_metalness_emissive_roughness_subsurface"],
                    properties: {
                        global_metalness_emissive_roughness_subsurface: {
                            description: "Tableau de quatre entiers [Metalness, Emissive, Roughness, Subsurface] (0-255) ou chaîne hexadécimale à 4 chiffres, utilisé comme valeur de fallback pour les blocs.",
                            oneOf: [
                                {
                                    type: "array",
                                    minItems: 4,
                                    maxItems: 4,
                                    items: {
                                        type: "integer",
                                        minimum: 0,
                                        maximum: 255
                                    }
                                },
                                {
                                    type: "string",
                                    pattern: schemaPatterns.color_hex_rgba
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