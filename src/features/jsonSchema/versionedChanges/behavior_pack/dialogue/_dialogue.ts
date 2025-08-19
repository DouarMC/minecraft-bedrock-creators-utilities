import { SchemaType } from "../../../../../types/schema";

const baseSchema = {
    description: "Ce fichier définit un dialogue pour les NPCs.",
    type: "object",
    required: ["format_version", "minecraft:npc_dialogue"],
    properties: {
        format_version: {
            description: "La version du format à utiliser.",
            type: "string",
            enum: [
                "1.14.0", "1.14.1", "1.14.20", "1.14.30", "1.15.0", "1.16.0", "1.16.20", "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
            ]
        },
        "minecraft:npc_dialogue": {
            description: "Contient la définition du Dialogue.",
            type: "object",
            required: ["scenes"],
            properties: {
                scenes: {
                    description: "Contient toutes les scènes du Dialogues.",
                    type: "array",
                    items: {
                        type: "object",
                        required: ["scene_tag", "text"],
                        properties: {
                            scene_tag: {
                                description: "L'identifiant de la scène.",
                                type: "string"
                            },
                            npc_name: {
                                description: "Le nom du NPC qui parle dans cette scène.",
                                type: "string",
                                "x-localized": true
                            },
                            text: {
                                description: "Le texte de la scène.",
                                type: "string",
                                "x-localized": true
                            },
                            on_open_commands: {
                                description: "Les commandes à exécuter lorsque la scène est ouverte.",
                                type: "array",
                                items: {
                                    type: "string"
                                }
                            },
                            on_close_commands: {
                                description: "Les commandes à exécuter lorsque la scène est fermée.",
                                type: "array",
                                items: {
                                    type: "string"
                                }
                            },
                            buttons: {
                                description: "Les boutons disponibles dans cette scène.",
                                type: "array",
                                items: {
                                    type: "object",
                                    required: ["name", "commands"],
                                    properties: {
                                        name: {
                                            description: "Le texte du bouton.",
                                            type: "string",
                                            "x-localized": true
                                        },
                                        commands: {
                                            description: "Les commandes à exécuter lorsque le bouton est cliqué.",
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
    }
};

export const dialogueSchemaTypeBP: SchemaType = {
    fileMatch: ["**/addon/behavior_pack/dialogue/**/*.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};