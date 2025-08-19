import { SchemaChange, SchemaType } from "../../../../../types/schema";
import { schemaPatterns } from "../../../shared/schemaPatterns";

const baseSchema = {
    description: "Ce fichier sert à définir les règles de culling de blocs utilisables pour les blocs avec le composant `minecraft:geometry`.",
    type: "object",
    required: ["format_version", "minecraft:block_culling_rules"],
    properties: {
        format_version: {
            description: "La version du Format à utiliser.",
            type: "string",
            enum: [
                "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80"
            ]
        },
        "minecraft:block_culling_rules": {
            description: "Contient toute la définition de ces règles de Block Culling.",
            type: "object",
            required: ["description", "rules"],
            properties: {
                description: {
                    description: "Contient la description des Règles de Block Culling.",
                    type: "object",
                    required: ["identifier"],
                    properties: {
                        identifier: {
                            description: "L'identifiant des Règles de Block Culling.",
                            type: "string",
                            pattern: schemaPatterns.identifier_with_namespace
                        }
                    }
                },
                rules: {
                    description: "La liste des règles de ce Block Culling.",
                    type: "array",
                    items: {
                        type: "object",
                        required: ["direction", "geometry_part"],
                        properties: {
                            direction: {
                                description: "Spécifie la face du bloc où un bloc voisin doit être adjacente pour que le culling soit effectué.",
                                type: "string",
                                enum: ["up", "down", "north", "east", "south", "west"]
                            },
                            geometry_part: {
                                description: "Spécifie l'os, le cube, et la face du modèle à cull.",
                                type: "object",
                                required: ["bone"],
                                properties: {
                                    bone: {
                                        description: "L'os (dossier du modèle) qui subira le culling. Si seul `bone` est défini, le culling sera effectué sur l'ensemble de l'os. Si `cube` et `face` sont définis, le culling sera effectué uniquement sur la face du cube de l'os spécifié.",
                                        type: "string"
                                    },
                                    cube: {
                                        description: "L'index du cube du modèle de l'os à cull.",
                                        type: "integer"
                                    },
                                    face: {
                                        description: "La face du cube à cull.",
                                        type: "string",
                                        enum: ["up", "down", "north", "east", "south", "west"]
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

const versionedChanges: SchemaChange[] = [
    {
        version: "1.21.80",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:block_culling_rules", "properties", "rules", "items", "properties", "condition"],
                value: {
                    description:
                    "Définit la condition avec les blocs voisins à valider pour que le culling soit effectué." +
                    "\n\n- `same_culling_layer`: la condition est validée si le bloc voisin possède la même valeur de `culling_layer` dans le composant `minecraft:geometry` que le bloc qui subit le culling. Si l'un des `culling_layer` comparés est `minecraft:culling_layer.undefined`, la condition ne sera jamais validée." +
                    "\n\n- `same_block`: la condition est validée si le bloc voisin est du même type que le bloc qui subit le culling." +
                    "\n\n- `same_block_permutation`: la condition est validée si le bloc voisin est du même type que le bloc qui subit le culling et possède la même permutation.",
                    type: "string",
                    enum: ["same_culling_layer", "same_block", "same_block_permutation"]
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block_culling_rules", "properties", "rules", "items", "properties", "cull_against_full_and_opaque"],
                value: {
                    description: "Indique si le culling doit être effectué contre les blocs pleins et opaques.",
                    default: true,
                    type: "boolean"
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