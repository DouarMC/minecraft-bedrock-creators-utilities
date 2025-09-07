import { MinecraftJsonSchema } from "../../../../../types/minecraftJsonSchema";
import { VersionedSchema } from "../../../model/versioning";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier sert à définir les crédits du jeu.",
    type: "array",
    items: {
        type: "object",
        properties: {
            section: {
                description: "Le titre de la section des crédits.",
                type: "string"
            },
            disciplines: {
                description: "Liste des disciplines de la section des crédits.",
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        discipline: {
                            description: "Le titre de la discipline.",
                            type: "string"
                        },
                        titles: {
                            description: "Les titres de la discipline.",
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    title: {
                                        description: "Le texte du titre.",
                                        type: "string"
                                    },
                                    names: {
                                        description: "Liste des noms des personnes ayant contribué à la discipline.",
                                        type: "array",
                                        items: {
                                            type: "string"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

export const creditsSchemaTypeRP: VersionedSchema = {
    fileMatch: ["**/addon/resource_pack/credits/credits.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};