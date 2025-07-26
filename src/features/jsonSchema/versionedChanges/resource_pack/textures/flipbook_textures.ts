import { SchemaType } from "../../../../../types/schema";

const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Ce fichier sert à créer une animation de texture des blocs. \nType: `Object[]`",
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "flipbook_texture": {
                "description": "Chemin vers le fichier graphique pour une ou plusieurs faces d'un bloc. \nType: `String`",
                "type": "string"
            },
            "atlas_tile": {
                "description": "Nom du graphique qui sera affiché sur le bloc s'il y a un problème avec l'animation. \nType: `String`",
                "type": "string"
            },
            "atlas_index": {
                "description": "Index de la première image à afficher lors du démarrage de l'animation. S'il y a un problème, alors seule cette image sera affichée. \nType: `Integer`",
                "type": "integer"
            },
            "atlas_tile_variant": {
                "description": "Graphique alternatif qui sera affiché sur le bloc s'il y a un problème avec l'animation. \nType: `Integer`",
                "type": "integer"
            },
            "ticks_per_frame": {
                "description": "Combien de ticks (1/20ème de seconde) de temps de jeu doivent s'écouler avant que l'image suivante ne soit affichée. \nType: `Integer`",
                "type": "integer"
            },
            "frames": {
                "description": "Liste avec l'index d'image à utiliser sur chaque image, ou le nombre total d'images à répéter les un après les autres. \nType: `Integer[]`",
                "type": "array",
                "items": {
                    "type": "integer"
                }
            },
            "replicate": {
                "description": "Changement de la taille de la partie de la texture utilisée. Ne peut prendre que des valeurs qui sont des multiples de deux. Si l'image a moins de pixels, elle les étend. \nType: `Integer`",
                "type": "integer",
                "default": 1
            },
            "blend_frames": {
                "description": "Définit si la transition des images doit être fluide ou non. \nType: `Boolean`",
                "type": "boolean",
                "default": true
            }
        }
    }
};

export const flipbookTexturesSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/textures/flipbook_textures.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};