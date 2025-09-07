import { dynamicExamplesSourceKeys } from "../../../utils/shared/schemaEnums";
import { schemaPatterns } from "../../../utils/shared/schemaPatterns";
import { MinecraftJsonSchema } from "../../../../../types/minecraftJsonSchema";
import { VersionedSchema } from "../../../model/versioning";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier sert à créer des références de textures pour les Blocs.",
    type: "object",
    required: ["texture_data"],
    properties: {
        default_leather_color: {
            description: "Définit la couleur par défaut pour les armures en cuir.",
            type: "string",
            pattern: schemaPatterns.color_hex
        },
        default_horse_leather_color: {
            description: "Définit la couleur par défaut pour les armures en cuir de cheval.",
            type: "string",
            pattern: schemaPatterns.color_hex
        },
        resource_pack_name: {
            description: "Le nom du resource pack auquel ce fichier est associé.",
            type: "string"
        },
        texture_name: {
            description: "Définit l'atlas qui est utilisé qui contient les textures en plus petites. L'utilité des atlas est de réduire le nombre de textures que le jeu charge.",
            default: "atlas.terrain",
            type: "string",
            enum: ["atlas.terrain"]
        },
        padding: {
            description: "Définit le padding pour les textures. Le padding est l'espace entre les textures dans l'atlas.",
            default: 8,
            type: "number",
        },
        num_mip_levels: {
            description: "Définit le nombre de niveaux de mip d'un atlas de textures. Les mipmaps sont utilisés par Minecraft pour réduire la résolution des textures à mesure qu'elles s'éloignent de la caméra. Cela réduit l'aliasing des textures distantes et peut améliorer les performances. À chaque niveau de mip, la résolution de la texture est divisée par deux.",
            default: 4,
            type: "number"
        },
        texture_data: {
            description: "Contient les références de textures pour les blocs.",
            type: "object",
            propertyNames: {
                "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_block_texture_references
            },
            additionalProperties: {
                type: "object",
                required: ["textures"],
                properties: {
                    additive: {
                        description: "Si `true`, les textures seront superposées les unes sur les autres. Si `false`, elles seront utilisées séparément.",
                        default: false,
                        type: "boolean"
                    },
                    textures: {
                        description: "La/les texture(s) à spécifier pour cette référence.",
                        oneOf: [
                            {
                                type: "string",
                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.texture_file_paths
                            },
                            {
                                type: "object",
                                required: ["path"],
                                properties: {
                                    path: {
                                        description: "Le chemin d'accès de la Texture.",
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.texture_file_paths
                                    },
                                    overlay_color: {
                                        description: "Ajoute une couleur par-dessus la texture, en utilisant la transparence de la texture pour doser l'intensité de la couleur. Rend la texture finale totalement opaque, même si la texture d'origine était transparente.",
                                        type: "string",
                                        pattern: schemaPatterns.color_hex
                                    },
                                    tint_color: {
                                        description: "Teinte la texture en multipliant chaque couleur de pixel par la couleur indiquée, tout en conservant la transparence d'origine. (Exemple : utilisé pour teinter les nénuphars en vert dans le jeu vanilla.)",
                                        type: "string",
                                        pattern: schemaPatterns.color_hex
                                    },
                                    quad: {
                                        description: "Détermine si seul le quart supérieur gauche de la texture doit être affiché. Peut être un booléen (`true` ou `false`) ou un nombre (`0` = false, tout autre nombre = true).",
                                        default: false,
                                        oneOf: [
                                            {
                                                type: "boolean"
                                            },
                                            {
                                                type: "number"
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                type: "object",
                                required: ["variations"],
                                properties: {
                                    variations: {
                                        description: "Définit les différentes variations de textures pour cette référece. Le composant `minecraft:material_instances` ne supporte pas les variations de textures, il faut utiliser cette référence dans le fichier `blocks.json`.",
                                        type: "array",
                                        items: {
                                            type: "object",
                                            required: ["path"],
                                            properties: {
                                                weight: {
                                                    description: "La chance relative que ce son soit choisi dans la liste. Par exemple, s'il y a deux entrées dans la liste, une avec `weight`: 10 et l'autre avec `weight`: 2, la première sera choisis environ 5 fois plus souvent que la seconde.",
                                                    type: "number",
                                                    minimum: 0.05,
                                                    maximum: 1000000
                                                },
                                                path: {
                                                    description: "Le chemin d'accès de la Texture.",
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.texture_file_paths
                                                },
                                                overlay_color: {
                                                    description: "Ajoute une couleur par-dessus la texture, en utilisant la transparence de la texture pour doser l'intensité de la couleur. Rend la texture finale totalement opaque, même si la texture d'origine était transparente.",
                                                    type: "string",
                                                    pattern: schemaPatterns.color_hex
                                                },
                                                tint_color: {
                                                    description: "Teinte la texture en multipliant chaque couleur de pixel par la couleur indiquée, tout en conservant la transparence d'origine. (Exemple : utilisé pour teinter les nénuphars en vert dans le jeu vanilla.)",
                                                    type: "string",
                                                    pattern: schemaPatterns.color_hex
                                                },
                                                quad: {
                                                    description: "Détermine si seul le quart supérieur gauche de la texture doit être affiché. Peut être un booléen (`true` ou `false`) ou un nombre (`0` = false, tout autre nombre = true).",
                                                    default: false,
                                                    oneOf: [
                                                        {
                                                            type: "boolean"
                                                        },
                                                        {
                                                            type: "number"
                                                        }
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                type: "array",
                                items: {
                                    oneOf: [
                                        {
                                            $ref: "#/properties/texture_data/additionalProperties/properties/textures/oneOf/0" 
                                        },
                                        {
                                            $ref: "#/properties/texture_data/additionalProperties/properties/textures/oneOf/1"
                                        },
                                        {
                                            $ref: "#/properties/texture_data/additionalProperties/properties/textures/oneOf/2"
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

export const terrainTextureSchemaTypeRP: VersionedSchema = {
    fileMatch: ["**/addon/resource_pack/textures/terrain_texture.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};