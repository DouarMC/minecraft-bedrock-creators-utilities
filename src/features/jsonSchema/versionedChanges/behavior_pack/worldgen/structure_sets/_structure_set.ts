import { SchemaType } from "../../../../../../types/schema";
import { dynamicExamplesSourceKeys } from "../../../../shared/schemaEnums";

const baseSchema = {
    "description": "[EXPERIMENTALE]: Data Driven Jigsaw Structures \nCe fichier sert à définir un Structure Set. Un Structure Set contient un ensemble de Structures Jigsaw et des règles pour déterminer comment ces structures doivent être placées dans le monde par rapport à d'autres instances de structures du même ensemble. Chaque structure dans un ensemble est associée à un poids qui influence la fréquence à laquelle elle est choisie. \nType: `Object`",
    "type": "object",
    "required": ["format_version", "minecraft:structure_set"],
    "properties": {
        "format_version": {
            "description": "La version du Format à utiliser. \nType: `String`",
            "type": "string",
            enum: [
                "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
            ]
        },
        "minecraft:structure_set": {
            "description": "Contient la définition du Structure Set. \nType: `Object`",
            "type": "object",
            "required": ["description", "placement", "structures"],
            "properties": {
                "description": {
                    "description": "Contient les propriétés de description du Structure Set. \nType: `Object`",
                    "type": "object",
                    "required": ["identifier"],
                    "properties": {
                        "identifier": {
                            "description": "L'identifiant du Structure Set. \nType: `String`",
                            "type": "string",
                            "pattern": "^[a-zA-Z0-9_]+:[a-zA-Z0-9_]+$",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_structure_set_ids
                        }
                    }
                },
                "placement": {
                    "description": "Décrit où les structures de l'ensemble apparaissent les unes par rapport aux autres. Actuellement, le seul type de placement pris en charge est random_spread, qui disperse les structures de manière aléatoire avec une séparation et un espacement donnés. \nType: `Object`",
                    "type": "object",
                    "required": ["type", "separation", "salt", "spacing"],
                    "properties": {
                        "separation": {
                            "description": "Remplissage (en chunks) dans chaque cellule de grille. Les structures ne seront pas générées dans la zone de remplissage. \nType: `Integer`",
                            "type": "integer",
                            "minimum": 0
                        },
                        "type": {
                            "description": "Type de placement pour le Structure Set Jigsaw. \nType: `String`",
                            "type": "string",
                            "enum": ["minecraft:random_spread"]
                        },
                        "salt": {
                            "description": "Graine utilisée pour le générateur aléatoire pour fournir un motif de dispersion unique. Ceci est utilisé pour éviter les chevauchements dans le cas où plusieurs ensembles de structures utilisent les mêmes valeurs de placement. \nType: `Integer`",
                            "type": "integer"
                        },
                        "spacing": {
                            "description": "Taille de la cellule de grille (en chunks) à utiliser lors de la génération de la structure. Les structures tenteront de se générer à une position aléatoire dans chaque cellule. \nType: `Integer`",
                            "type": "integer",
                            "minimum": 1
                        },
                        "spread_type": {
                            "description": "Algorithme de dispersion utilisé lors du placement des structures. \nType: `String`",
                            "type": "string",
                            "enum": ["linear", "triangular"]
                        }
                    }
                },
                "structures": {
                    "description": "Liste pondérée des Structures Jigsaw dans l'ensemble. \nType: `Object[]`",
                    "type": "array",
                    "items": {
                        "type": "object",
                        "required": ["structure", "weight"],
                        "properties": {
                            "structure": {
                                "description": "L'identifiant de la Structure Jigsaw. \nType: `String`",
                                "type": "string"
                            },
                            "weight": {
                                "description": "Poids de la Structure Jigsaw dans l'ensemble. Les poids plus élevés sont plus susceptibles d'être sélectionnés. \nType: `Integer`",
                                "type": "integer",
                                "minimum": 1,
                                "maximum": 200
                            }
                        }
                    }
                }
            }
        }
    }
};

export const structureSetSchemaTypeBP: SchemaType = {
    fileMatch: ["**/addon/behavior_pack/worldgen/structure_sets/*.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};