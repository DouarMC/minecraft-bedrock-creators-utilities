import { dynamicExamplesSourceKeys } from "./schemaEnums";

export const commonSchemas = {
    block_descriptor: {
        type: "object",
        required: ["name"],
        properties: {
            name: {
                description: "L'identifiant du bloc.",
                type: "string",
                "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
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
                type: "molang"
            }
        }
    },
    item_descriptor: {
        type: "object",
        required: ["name"],
        properties: {
            name: {
                description: "L'identifiant de l'item.",
                type: "string",
                "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
            },
            data: {
                description: "La valeur aux value de l'item.",
                type: "integer"
            },
            tags: {
                markdownDescription:
                "**ℹ️ Expression Molang supportée.**\n\n" +
                "Les tags de l'item.",
                type: "molang"
            }
        }
    }
};