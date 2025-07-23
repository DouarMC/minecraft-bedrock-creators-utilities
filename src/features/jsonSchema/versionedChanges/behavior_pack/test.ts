import { SchemaType } from "../../../../types/schema";

const baseSchema = {
    $schema: "https://json-schema.org/draft-07/schema#",
    description: "Schéma de test pour tous les edge-cases.",
    type: "object",
    properties: {
        // Test 1 : oneOf sur un objet avec required différents
        obj_oneof: {
            description: "Objet qui utilise un oneOf avec required différents.",
            oneOf: [
                {
                    type: "object",
                    properties: {
                        foo: { type: "string", description: "La propriété foo (branche 1)" },
                        baz: { type: "number", description: "La propriété baz (branche 1)" }
                    },
                    required: ["foo"]
                },
                {
                    type: "object",
                    properties: {
                        bar: { type: "string", description: "La propriété bar (branche 2)" },
                        qux: { type: "boolean", description: "La propriété qux (branche 2)" }
                    },
                    required: ["bar"]
                }
            ]
        },

        // Test 2 : tableau avec items.oneOf
        arr_oneof: {
            description: "Tableau dont chaque élément est un objet issu d'un oneOf.",
            type: "array",
            items: {
                oneOf: [
                    {
                        type: "object",
                        properties: {
                            type: { enum: ["a"], description: "Type = a" },
                            valA: { type: "string", description: "valeur spécifique à a" }
                        },
                        required: ["type"]
                    },
                    {
                        type: "object",
                        properties: {
                            type: { enum: ["b"], description: "Type = b" },
                            valB: { type: "number", description: "valeur spécifique à b" }
                        },
                        required: ["type"]
                    }
                ]
            }
        },

        // Test 3 : propriétés dynamiques avec patternProperties & additionalProperties
        dyn: {
            description: "Objet avec patternProperties et additionalProperties.",
            type: "object",
            properties: {
                known: { type: "string", description: "Propriété connue" }
            },
            patternProperties: {
                "^mod_.*$": { type: "number", description: "N'importe quelle clé commençant par mod_" }
            },
            additionalProperties: { type: "boolean", description: "Toutes les autres propriétés" }
        },

        // Test 4 : $ref vers une définition
        ref_test: {
            $ref: "#/definitions/myBranch"
        }
    },
    definitions: {
        myBranch: {
            oneOf: [
                {
                    type: "object",
                    properties: {
                        branch: { 
                            enum: ["x"], 
                            description: "Type de branche X (seule la valeur 'x' est acceptée)" 
                        },
                        valX: { 
                            type: "string", 
                            description: "Valeur spécifique à la branche X (chaîne de caractères)" 
                        }
                    },
                    required: ["branch"]
                },
                {
                    type: "object",
                    properties: {
                        branch: { 
                            enum: ["y"], 
                            description: "Type de branche Y (seule la valeur 'y' est acceptée)" 
                        },
                        valY: { 
                            type: "number", 
                            description: "Valeur spécifique à la branche Y (nombre)" 
                        }
                    },
                    required: ["branch"]
                }
            ]
        }
    }
};

export const testSchemaType: SchemaType = {
    fileMatch: ["**/addon/test.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};