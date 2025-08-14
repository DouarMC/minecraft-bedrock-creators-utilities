import { SchemaType } from "../../../../../types/schema";

const baseSchema = {
    "description": "Ce fichier sert à définir les crédits du jeu. \nType : `Object[]`",
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "section": {
                "description": "Le titre de la section des crédits. \nType : `String`",
                "type": "string"
            },
            "disciplines": {
                "description": "Liste des disciplines de la section des crédits. \nType : `Object[]`",
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "discipline": {
                            "description": "Le titre de la discipline. \nType : `String`",
                            "type": "string"
                        },
                        "titles": {
                            "description": "Les titres de la discipline. \nType : `Object[]`",
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "title": {
                                        "description": "Le texte du titre. \nType : `String`",
                                        "type": "string"
                                    },
                                    "names": {
                                        "description": "Liste des noms des personnes ayant contribué à la discipline. \nType : `String[]`",
                                        "type": "array",
                                        "items": {
                                            "type": "string"
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

export const creditsSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/credits/credits.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};