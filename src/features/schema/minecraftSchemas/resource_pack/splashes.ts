import { MinecraftJsonSchema } from "../../model";
import { VersionedSchema } from "../../model/versioning";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier contient les textes de Splashs qui s'affichent sur le logo Minecraft au menu principal.",
    type: "object",
    required: ["splashes"],
    properties: {
        canMerge: {
            description: "Définit si les valeurs de splashes de ce fichier doivent être fusionnées avec celles existantes.",
            default: false,
            type: "boolean"
        },
        splashes: {
            description: "Contient les textes de Splashs.",
            type: "array",
            items: {
                type: "string"
            }
        },
        conditional: {
            description: "Contient les textes de Splashs qui s'affichent en fonction de certaines conditions, comme le mode démo ou la plateforme.",
            type: "array",
            items: {
                type: "object",
                required: ["requires", "splashes"],
                properties: {
                    requires: {
                        description: "Condition pour afficher le Splash.",
                        type: "object",
                        properties: {
                            trialMode: {
                                description: "Affiche le Splash uniquement en mode démo.",
                                type: "boolean"
                            },
                            platforms: {
                                description: "Affiche le Splash uniquement sur les plateformes spécifiées.",
                                type: "array",
                                items: {
                                    type: "string",
                                    enum: [
                                        "Windows 10",
                                        "Xbox One",
                                        "PlayStation 4",
                                        "Nintendo Switch",
                                        "iOS",
                                        "Android"
                                    ]
                                }
                            },
                            treatments: {
                                type: "array",
                                items: {
                                    type: "string",
                                    enum: [
                                        "Beta",
                                        "Preview",
                                        "Release"
                                    ]
                                }
                            },
                            stores: {
                                type: "array",
                                items: {
                                    type: "string",
                                    enum: [
                                        "Microsoft Store"
                                    ]
                                }
                            }
                        }
                    },
                    splashes: {
                        description: "Contient les textes de Splashs conditionnels.",
                        type: "array",
                        items: {
                            type: "string"
                        }
                    }
                }
            }
        }
    }
};

export const splashesSchemaTypeRP: VersionedSchema = {
    fileMatch: ["**/addon/resource_pack/splashes.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};