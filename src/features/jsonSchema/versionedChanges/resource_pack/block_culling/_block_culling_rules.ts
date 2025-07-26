import { SchemaChange, SchemaType } from "../../../../../types/schema";

const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Ce fichier sert à définir les règles de culling de blocs pour un modèle de bloc. \nType: `Object`",
    "type": "object",
    "required": ["format_version", "minecraft:block_culling_rules"],
    "properties": {
        "format_version": {
            "description": "La version du Format à utiliser. \nType: `String`",
            "type": "string",
            enum: [
                "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90"
            ]
        },
        "minecraft:block_culling_rules": {
            "description": "Contient toute la définition de ces règles de Block Culling. \nType: `Object`",
            "type": "object",
            "required": ["description", "rules"],
            "properties": {
                "description": {
                    "description": "Contient la description des Règles de Block Culling. \nType: `Object`",
                    "type": "object",
                    "required": ["identifier"],
                    "properties": {
                        "identifier": {
                            "description": "L'identifiant des Règles de Block Culling. \nType: `String`",
                            "type": "string",
                            "pattern": "^[a-zA-Z0-9_]+:[a-zA-Z0-9_]+$"
                        }
                    }
                },
                "rules": {
                    "description": "La liste des règles de ce Block Culling. \nType: `Object[]`",
                    "type": "array",
                    "items": {
                        "type": "object",
                        "required": ["direction"],
                        "properties": {
                            "geometry_part": {
                                "description": "Spécifie l'os, le cube, et la face à cull. \nType: `Object`",
                                "type": "object",
                                "properties": {
                                    "bone": {
                                        "description": "L'os (dossier de modèle) qui subira le culling. \nType: `String`",
                                        "type": "string"
                                    },
                                    "cube": {
                                        "description": "L'index du cube de modèle de l'os à cull. \nType: `Integer`",
                                        "type": "integer"
                                    },
                                    "face": {
                                        "description": "La face du cube à cull. \nType: `String`",
                                        "type": "string",
                                        "enum": ["up", "down", "north", "east", "south", "west"]
                                    }
                                }
                            },
                            "direction": {
                                "description": "Spécifie la direction du bloc voisin pour vérifier la sélection. Cette direction pivote avec le component transform d'un bloc. \nType: `String`",
                                "type": "string",
                                "enum": ["up", "down", "north", "east", "south", "west"]
                            }
                        }
                    }
                }
            }
        }
    }
};

const versionedChanges: SchemaChange[] = [
    {
        version: "1.21.80",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:block_culling_rules", "properties", "rules", "items", "properties", "condition"],
                value: {
                    "description": "Définit la condition avec les blocs voisins qui déclencheront la suppression de la face ou de la partie. \nType: `String` \n`same_culling_layer`: la condition est validée si le bloc voisin possède la même valeur de `culling_layer` dans le composant `geometry` que le bloc qui subit le culling. Si l'un des culling_layer comparés est `minecraft:culling_layer.undefined`, la condition ne sera jamais validée. \n`same_block`: la condition est validée si le bloc voisin est le même que le bloc qui subit le culling. \n`same_block_permutation`: la condition est validée si le bloc voisin est le même qui subit le culling et possède la même permutation.",
                    "type": "string",
                    "enum": ["same_culling_layer", "same_block", "same_block_permutation"]
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block_culling_rules", "properties", "rules", "items", "properties", "cull_against_full_and_opaque"],
                value: {
                    "description": "Indique si le culling doit être effectué contre les blocs pleins et opaques. \nType: `Boolean`",
                    "default": true,
                    "type": "boolean"
                }
            }
        ]
    }
];

export const blockCullingRulesSchemaTypeRP: SchemaType = {
    fileMatch:  ["**/addon/resource_pack/block_culling/*.json"],
    baseSchema: baseSchema,
    versionedChanges: versionedChanges
};