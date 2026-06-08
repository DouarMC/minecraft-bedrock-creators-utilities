import { MinecraftJsonSchema } from "../../../common/types/MinecraftJsonSchema";
import { SchemaChange, VersionedSchema } from "../../../common/types/VersionedSchema";
import { dynamicExamplesSourceKeys } from "../../shared/schemaEnums";
import { schemaPatterns } from "../../shared/schemaPatterns";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier sert à définir les propriétés d'éclairage local pour les blocs comme les torches.",
    type: "object",
    required: ["format_version", "minecraft:local_light_settings"],
    properties: {
        format_version: {
            description: "La version du Format à utiliser.",
            type: "string",
            enum: [
                "1.21.120"
            ]
        },
        "minecraft:local_light_settings": {
            description: "Contient la définition des propriétés d'éclairage local.",
            type: "object",
            propertyNames: {
                type: "string",
                "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
            },
            additionalProperties: {
                type: "object",
                required: ["light_type"],
                properties: {
                    light_color: {
                        description: "La couleur de la lumière émise par le bloc, définie comme un tableau de trois entiers [R, G, B] (0-255) ou une chaîne hexadécimale à 6 chiffres.",
                        oneOf: [
                            {
                                type: "array",
                                minItems: 3,
                                maxItems: 3,
                                items: {
                                    type: "integer",
                                    minimum: 0,
                                    maximum: 255
                                }
                            },
                            {
                                type: "string",
                                pattern: schemaPatterns.color_hex
                            }
                        ]
                    },
                    light_type: {
                        description:
                        "Définit le type de lumière local émise par le bloc." +
                        "\n- `static_light`: la lumière émise se propage de bloc en bloc, elle n'affiche pas d'ombres dynamiques et pas de reflets luisants. Exemple : bloc de lave, glowstone." +
                        "\n- `point_light`: la lumière est émise depuis le centre du bloc et rayonne dans toutes les directions, elle affiche des ombres dynamiques et des reflets luisants. Exemple : torches, lanternes.",
                        type: "string",
                        enum: [
                            "static_light",
                            "point_light"
                        ]
                    }
                }
            }
        }
    }
};

const versionedChanges: SchemaChange[] = [];

export const versionedSchema: VersionedSchema = {
    baseSchema: baseSchema,
    versionedChanges: versionedChanges
};

export default versionedSchema;