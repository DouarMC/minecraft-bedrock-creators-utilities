import { schemaRef } from "./schemaEnums";

export const commonSchemas = {
    block_descriptor: {
        type: "object",
        properties: {
            name: {
                description: "L'identifiant du bloc.",
                type: "string",
                $ref: schemaRef.block_ids
            },
            states: {
                description: "Les états du bloc.",
                type: "object",
                additionalProperties: {
                    oneOf: [
                        {
                            type: "string"
                        },
                        {
                            type: "integer"
                        },
                        {
                            type: "number"
                        },
                        {
                            type: "boolean"
                        }
                    ]
                }
            },
            tags: {
                markdownDescription:
                "**ℹ️ Expression Molang supportée.**\n\n" +
                "Les tags du bloc.",
                oneOf: [
                    {
                        type: "string"
                    },
                    {
                        type: "number"
                    },
                    {
                        type: "boolean"
                    }
                ],
                "x-molang": true
            }
        }
    },
    item_descriptor: {
        type: "object",
        properties: {
            name: {
                description: "L'identifiant de l'item.",
                type: "string"
            },
            data: {
                description: "La valeur aux value de l'item.",
                type: "integer"
            },
            tags: {
                markdownDescription:
                "**ℹ️ Expression Molang supportée.**\n\n" +
                "Les tags de l'item.",
                oneOf: [
                    {
                        type: "string"
                    },
                    {
                        type: "number"
                    },
                    {
                        type: "boolean"
                    }
                ],
                "x-molang": true
            }
        }
    }
};