import { SchemaType } from "../../../../types/schema";

const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Ce fichier contient les messages de chargement pour les différentes étapes du jeu. \n Type: `Object`",
    "type": "object",
    "properties": {
        "beginner_loading_messages": {
            "description": "Contient les Textes de messages de chargement pour les débutants. \n Type: `String[]`",
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "mid_game_loading_messages": {
            "description": "Contient les Textes de messages de chargement pour les joueurs un peu expérimentés. \n Type: `String[]`",
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "late_game_loading_messages": {
            "description": "Contient les Textes de messages de chargement pour les débutants expérimentés. \n Type: `String[]`",
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "editor_loading_messages": {
            "description": "Contient les Textes de messages de chargement dans le mode Editeur. \n Type: `String[]`",
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "realms_loading_messages": {
            "description": "Contient les Textes de messages de chargement pour les Realms. \n Type: `String[]`",
            "type": "array",
            "items": {
                "type": "string"
            }
        }
    }
};

export const loadingMessagesSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/loading_messages.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};