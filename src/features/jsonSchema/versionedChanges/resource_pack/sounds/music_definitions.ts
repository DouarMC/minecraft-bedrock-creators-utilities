import { SchemaType } from "../../../../../types/schema";

const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Ce fichier sert à gérer quand et la façon dont les musiques sont joués. \nType: `Object`",
    "type": "object",
    "additionalProperties": {
        "description": "Définit les paramètres de jeu d'une Musique. \nType: `Object`",
        "type": "object", 
        "properties": {
            "event_name": {
                "description": "L'ensemble de Musiques à jouer défini dans le fichier sound_definitions.json. \nType: `String`",
                "type": "string"
            },
            "min_delay": {
                "description": "Le temps minimum en tick avant que la Musique se joue ou rejoue. \nType: `Number`",
                "type": "number"
            },
            "max_delay": {
                "description": "Le temps maximum en tick avant que la Musique se joue ou rejoue. \nType: `Number`",
                "type": "number"
            }
        }
    }
};

export const musicDefinitionsSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/sounds/music_definitions.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};