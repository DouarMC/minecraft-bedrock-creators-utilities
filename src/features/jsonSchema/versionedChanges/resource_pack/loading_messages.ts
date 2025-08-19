import { SchemaType } from "../../../../types/schema";

const baseSchema = {
    description: "Ce fichier contient les messages de chargement pour les différentes étapes du jeu.",
    type: "object",
    properties: {
        beginner_loading_messages: {
            description: "Contient les Textes de messages de chargement pour les débutants.",
            type: "array",
            items: {
                type: "string",
                "x-localized": true
            }
        },
        mid_game_loading_messages: {
            description: "Contient les Textes de messages de chargement pour les joueurs un peu expérimentés.",
            type: "array",
            items: {
                type: "string",
                "x-localized": true
            }
        },
        late_game_loading_messages: {
            description: "Contient les Textes de messages de chargement pour les débutants expérimentés.",
            type: "array",
            items: {
                type: "string",
                "x-localized": true
            }
        },
        editor_loading_messages: {
            description: "Contient les Textes de messages de chargement dans le mode Editeur.",
            type: "array",
            items: {
                type: "string",
                "x-localized": true
            }
        },
        realms_loading_messages: {
            description: "Contient les Textes de messages de chargement pour les Realms.",
            type: "array",
            items: {
                type: "string",
                "x-localized": true
            }
        },
        creative_loading_messages: {
            description: "Contient les Textes de messages de chargement pour le mode Créatif.",
            type: "array",
            items: {
                type: "string",
                "x-localized": true
            }
        },
        addons_loading_messages: {
            description: "Contient les Textes de messages de chargement pour les Addons.",
            type: "array",
            items: {
                type: "string",
                "x-localized": true
            }
        },
        store_progress_tooltips: {
            type: "array",
            items: {
                type: "string",
                "x-localized": true
            }
        }
    }
};

export const loadingMessagesSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/loading_messages.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};