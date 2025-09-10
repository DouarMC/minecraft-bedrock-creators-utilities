import { dynamicExamplesSourceKeys } from "../../utils/shared/schemaEnums";
import { schemaPatterns } from "../../utils/shared/schemaPatterns";
import { MinecraftJsonSchema } from "../../model";
import { VersionedSchema } from "../../model/versioning";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier contient les propriétés Client des Biomes (les fichiers client biomes ont la priorité).",
    type: "object",
    required: ["biomes"],
    properties: {
        biomes: {
            description: "Contient les Biomes auquel on peut attribuer des propriétés.",
            type: "object",
            properties: {
                default: {
                    description: "Les valeurs par défaut pour les propriétés des biomes qui n'ont pas été définies.",
                    type: "object",
                    properties: {
                        fog_identifier: {
                            description: "L'identifiant des paramètres de brouillard pour le biome",
                            type: "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.fog_ids
                        },
                        fog_ids_to_merge: {
                            description: "Liste d'identifiants de brouillard à fusionner avec le brouillard principal du biome.",
                            type: "array",
                            items: {
                                type: "string",
                                pattern: schemaPatterns.identifier_with_namespace
                            },
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.fog_ids
                        },
                        inherit_from_prior_fog: {
                            description: "Détermine si le brouillard du biome doit hériter du brouillard du biome précédent dans la liste des biomes.",
                            default: false,
                            type: "boolean"
                        },
                        remove_all_prior_fog: {
                            description: "Détermine si le brouillard du biome doit supprimer tous les brouillards précédents dans la liste des biomes.",
                            default: false,
                            type: "boolean"
                        },
                        water_surface_color: {
                            description: "Définit la couleur de la surface de l'eau dans le biome.",
                            type: "string",
                            pattern: schemaPatterns.color_hex
                        },
                        water_surface_transparency: {
                            description: "Définit la transparence de la surface de l'eau dans le biome.",
                            type: "number",
                            minimum: 0,
                            maximum: 1
                        }
                    }
                }
            },
            propertyNames: {
                "x-dynamic-examples-source": dynamicExamplesSourceKeys.biome_ids
            },
            additionalProperties: {
                type: "object",
                properties: {
                    fog_identifier: {
                        description: "L'identifiant des paramètres de brouillard pour le biome",
                        type: "string",
                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.fog_ids
                    },
                    fog_ids_to_merge: {
                        description: "Liste d'identifiants de brouillard à fusionner avec le brouillard principal du biome.",
                        type: "array",
                        items: {
                            type: "string",
                            pattern: schemaPatterns.identifier_with_namespace
                        },
                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.fog_ids
                    },
                    inherit_from_prior_fog: {
                        description: "Détermine si le brouillard du biome doit hériter du brouillard du biome précédent dans la liste des biomes.",
                        default: false,
                        type: "boolean"
                    },
                    remove_all_prior_fog: {
                        description: "Détermine si le brouillard du biome doit supprimer tous les brouillards précédents dans la liste des biomes.",
                        default: false,
                        type: "boolean"
                    },
                    water_surface_color: {
                        description: "Définit la couleur de la surface de l'eau dans le biome.",
                        type: "string",
                        pattern: schemaPatterns.color_hex
                    },
                    water_surface_transparency: {
                        description: "Définit la transparence de la surface de l'eau dans le biome.",
                        type: "number",
                        minimum: 0,
                        maximum: 1
                    }
                }
            }
        }
    }
};

export const biomesClientSchemaType: VersionedSchema = {
    fileMatch: ["**/addon/resource_pack/biomes_client.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};