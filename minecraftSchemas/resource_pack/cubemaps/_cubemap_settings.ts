import { MinecraftJsonSchema } from "../../../common/types/MinecraftJsonSchema";
import { VersionedSchema } from "../../../common/types/VersionedSchema";
import { schemaPatterns } from "../../shared/schemaPatterns";

const baseSchema : MinecraftJsonSchema = {
    description: "Ce fichier sert à rendre les images cubemaps (définissable dans textures/environment/overworld_cubemap/cubemap_0.png et les suivantes) qui s'affichent dans le ciel de Minecraft. Il permet de rendre les images comme étant des objets physiques qui intéragissent avec la lumière et des fonctionnalités liés aux Vibrant Visuals.",
    type: "object",
    required: ["format_version", "minecraft:cubemap_settings"],
    properties: {
        format_version: {
            description: "La version du format à utiliser.",
            type: "string",
            enum: ["1.21.130"]
        },
        "minecraft:cubemap_settings": {
            description: "Contient la définition des paramètres d'une Cubemap.",
            type: "object",
            required: ["description"],
            properties: {
                description: {
                    description: "Contient les propriétés de description des paramètres d'une Cubemap.",
                    type: "object",
                    required: ["identifier"],
                    properties: {
                        identifier: {
                            description: "L'identifiant de ces paramètres de Cubemap.",
                            type: "string",
                            pattern: schemaPatterns.identifier_with_namespace
                        }
                    }
                },
                lighting: {
                    description: "Contient les propriétés de l'éclairage de la Cubemap.",
                    type: "object",
                    properties: {
                        ambient_light_illuminance: {
                            description: "Définit l'illuminance de la lumière ambiante de la Cubemap. Plus la valeur est élevée, plus la lumière ambiante sera lumineuse. Peut être un nombre fixe ou keyframé pour des variations selon l'heure du jour.",
                            default: 5.625,
                            oneOf: [
                                {
                                    type: "number",
                                    minimum: 0,
                                    maximum: 100000
                                },
                                {
                                    type: "object",
                                    propertyNames: {
                                        pattern: schemaPatterns.cubemap_keyframe
                                    },
                                    additionalProperties: {
                                        type: "number",
                                        minimum: 0,
                                        maximum: 100000
                                    }
                                }
                            ]
                        },
                        sky_light_contribution: {
                            description: "Définit la contribution de la lumière du ciel à l'éclairage de la Cubemap.",
                            default: 1.0,
                            type: "number",
                            minimum: 0,
                            maximum: 1
                        },
                        directional_light_contribution: {
                            description: "Définit la contribution de la lumière directionnelle à l'éclairage de la Cubemap.",
                            default: 0.0,
                            type: "number",
                            minimum: 0,
                            maximum: 1
                        },
                        affected_by_atmospheric_scattering: {
                            description: "Si cette option est activée, la Cubemap sera affectée par la diffusion atmosphérique.",
                            default: false,
                            type: "boolean"
                        },
                        affected_by_volumetric_scattering: {
                            description: "Si cette option est activée, la Cubemap sera affectée par la diffusion volumétrique. La valeur par défaut est true.",
                            default: true,
                            type: "boolean"
                        }
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