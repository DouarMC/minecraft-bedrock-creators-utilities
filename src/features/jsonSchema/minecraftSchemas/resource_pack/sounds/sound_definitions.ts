import { SchemaType } from "../../../../../types/schema";
import { dynamicExamplesSourceKeys } from "../../../utils/shared/schemaEnums";
import { MinecraftJsonSchema } from "../../../../../types/minecraftJsonSchema";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier sert à référencer les sons pour les utiliser dans divers contextes.",
    type: "object",
    required: ["format_version", "sound_definitions"],
    properties: {
        format_version: {
            description: "La version du format à utiliser pour ce fichier.",
            type: "string",
            enum: [
                "1.14.0", "1.14.1", "1.14.20", "1.14.30", "1.15.0", "1.16.0", "1.16.20", "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
            ]
        },
        sound_definitions: {
            description: "Contient la définition des références de son.",
            type: "object",
            propertyNames: {
                "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_sound_references
            },
            additionalProperties: {
                type: "object",
                required: ["sounds"],
                properties: {
                    sounds: {
                        description: "Le ou les chemins des fichiers audio.",
                        type: "array",
                        items: {
                            oneOf: [
                                {
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_file_paths_without_extension
                                },
                                {
                                    type: "object",
                                    required: ["name"],
                                    properties: {
                                        name: {
                                            description: "Le chemin du fichier audio.",
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_file_paths_without_extension
                                        },
                                        stream: {
                                            description: "Définit si le fichier audio doit être streamé. Un fichier audio streamé est utile pour les sons longs ou les musiques, utile pour ne pas surcharger la mémoire (RAM), mais peut causer un léger délai au lancement du son.",
                                            default: false,
                                            type: "boolean"
                                        },
                                        volume: {
                                            description: "Définit le volume du son. Une valeur de `1.0` signifie que le son est joué à son volume d'origine. Une valeur de `0.0` signifie que le son est silencieux. Les sons dans les packs de ressources personnalisés peuvent avoir des valeurs supérieures à `1.0`.",
                                            default: 1.0,
                                            type: "number",
                                            minimum: 0.0
                                        },
                                        load_on_low_memory: {
                                            "x-deprecated": true,
                                            description: "Définit s'il faut forcer le chargement du son même lorsque la mémoire est presque faible.",
                                            type: "boolean"
                                        },
                                        pitch: {
                                            description: "Définit le facteur de vitesse de lecture du son. Une valeur de `1.0` signifie que le son est joué à sa vitesse d'origine. Une valeur de `0.5` signifie que le son est joué à moitié plus lentement, et une valeur de `2.0` signifie que le son est joué deux fois plus vite.",
                                            default: 1.0,
                                            type: "number",
                                            exclusiveMinimum: 0.0
                                        },
                                        is3D: {
                                            description: "Définit si le son est 3D. Un son 3D possède une position dans l'espace, on entends le son plus fort/faible selon la distance et direction de la caméra. Un son 2D est un son qui n'a pas de position dans l'espace, il est joué de la même manière peu importe la position du joueur. Ignoré avec `category` sur `music` et `ui` car ces sons sont toujours 2D.",
                                            default: true,
                                            type: "boolean"
                                        },
                                        weight: {
                                            description: "S'il y a plus d'un son dans la liste, le son à jouer est choisi aléatoirement. `weight` (valeur entière comme 5) donnera la chance relative que ce son soit choisi dans la liste. Par exemple, s'il y a deux sons dans la liste, un avec `weight`: 10 et l'autre avec `weight`: 2, le premier sera joué environ 5 fois plus souvent que le second.",
                                            default: 1,
                                            type: "number"
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    __use_legacy_max_distance: {
                        default: false,
                        type: "boolean"
                    },
                    category: {
                        description: "La catégorie du son.",
                        type: "string", 
                        enum: ["weather", "block", "bucket", "bottle", "ui", "player", "hostile", "music", "record", "neutral"]
                    },
                    max_distance: {
                        description: "Distance à partir de laquelle le son est au volume minimum.",
                        default: 0.0,
                        oneOf: [
                            {
                                type: "number"
                            },
                            {
                                type: "null"
                            }
                        ]
                    },
                    min_distance: {
                        description: "Distance à partir de laquelle le volume commence à diminuer.",
                        oneOf: [
                            {
                                type: "number"
                            },
                            {
                                type: "null"
                            }
                        ]
                    }
                }
            }
        }
    }
};

export const soundDefinitionsSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/sounds/sound_definitions.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};