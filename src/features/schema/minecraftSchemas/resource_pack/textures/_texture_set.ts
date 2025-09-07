import { schemaPatterns } from "../../../utils/shared/schemaPatterns";
import { MinecraftJsonSchema } from "../../../../../types/minecraftJsonSchema";
import { VersionedSchema, SchemaChange } from "../../../model/versioning";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier sert à configurer plusieurs couches PBR (Physically Based Rendering) pour une texture, améliorant ainsi la qualité visuelle. Utile pour les graphismes `Ray Traced` et `Vibrant Visuals`.",
    type: "object",
    required: ["format_version", "minecraft:texture_set"],
    properties: {
        format_version: {
            description: "La version du Format à utiliser.",
            type: "string",
            enum: [
                "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
            ]
        },
        "minecraft:texture_set": {
            description: "Contient toute la définition des textures PBR.",
            type: "object",
            properties: {
                color: {
                    description: "Définit la couleur de la texture (en utilisant soit une image RGBA, soit une couleur uniforme) ou définit le nom de la texture d'une couche de TextureSet.",
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
                            type: "string"
                        }
                    ]
                },
                normal: {
                    description: "Applique une carte normale (normal map) à la texture, influençant l'apparence de la surface sans changer sa géométrie.",
                    type: "string"
                },
                heightmap: {
                    description: "Définit la hauteur de la surface à partir d'une texture, affectant l'élévation des pixels pour donner un effet de relief.",
                    type: "string"
                },
                metalness_emissive_roughness: {
                    description: "Définit la combinaison de trois propriétés : métallisation, émission de lumière, et rugosité de la surface à travers une texture RGB ou une valeur uniforme.",
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
                            type: "string"
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
                    description: "Tableau de quatre entiers [Metalness, Emissive, Roughness, Subsurface] (0-255) ou chaîne hexadécimale à 4 chiffres ou une texture, utilisé pour définir comment la lumière réagit avec la surface.",
                    oneOf: [
                        {
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
                        },
                        {
                            type: "string"
                        }
                    ]
                }
            }
        ]
    }
];

export const textureSetSchemaTypeRP: VersionedSchema = {
    fileMatch: ["**/addon/resource_pack/textures/**/*.json"],
    baseSchema: baseSchema,
    versionedChanges: versionedChanges
};