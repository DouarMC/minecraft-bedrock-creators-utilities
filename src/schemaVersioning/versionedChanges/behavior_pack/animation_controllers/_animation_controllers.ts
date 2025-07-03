import { schemaPatterns } from "../../../../utils/schemas/schemaPatterns";

export const baseSchema = {
    $schema: "https://json-schema.org/draft-07/schema#",
    description: "Ce fichier crée des contrôleurs d'animation de type Behavior.",
    type: "object",
    required: ["format_version", "animation_controllers"],
    properties: {
        format_version: {
            description: "La version du format à utiliser.",
            type: "string",
            enum: [
                "1.8.0", "1.9.0", "1.10.0", "1.11.0", "1.12.0", "1.13.0", "1.14.0", "1.14.1", "1.14.20", "1.14.30", "1.15.0", "1.16.0", "1.16.20", "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90"
            ]
        },
        animation_controllers: {
            description: "Contient la définition des Animation Controllers.",
            type: "object",
            propertyNames: {
                pattern: schemaPatterns.animation_controller_identifier
            },
            additionalProperties: {
                type: "object",
                properties: {
                    initial_state: {
                        markdownDescription: "Définit l'état initial de l'Animation Controller. Si l'état initial n'est pas défini, l'état `default` sera utilisé.",
                        type: "string"
                    },
                    states: {
                        description: "Définit les états de l'Animation Controller.",
                        type: "object",
                        propertyNames: {
                            examples: ["default"]
                        },
                        additionalProperties: {
                            type: "object",
                            properties: {
                                transitions: {
                                    description: "Définit les transitions de l'état actuel vers un autre état si la condition Molang est validé.",
                                    type: "array",
                                    items: {
                                        type: "object",
                                        maxProperties: 1,
                                        additionalProperties: {
                                            type: "string",
                                            "x-molang": true
                                        }
                                    }
                                },
                                animations: {
                                    description: "Définit les animations à jouer dans l'état actuel. L'animation mentionnée ici doit être référencé dans la définition de l'entité. Possibilité de faire jouer une animation avec une vitesse différente.",
                                    type: "array",
                                    items: {
                                        oneOf: [
                                            {
                                                type: "string"
                                            },
                                            {
                                                type: "object",
                                                additionalProperties: {
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "string"
                                                        }
                                                    ],
                                                    "x-molang": true
                                                }
                                            }
                                        ]
                                    }
                                },
                                blend_transition: {
                                    description: "Définit la durée du fondu croisé lors de la transition entre deux états.",
                                    type: "number"
                                },
                                on_entry: {
                                    description: "Définit les commandes, événements d'entité, ou expressions Molang à exécuter lorsque l'état est entré.",
                                    type: "array",
                                    items: {
                                        type: "string",
                                        "x-molang": true
                                    }
                                },
                                on_exit: {
                                    description: "Définit les commandes, événements d'entité, ou expressions Molang à exécuter lorsque l'état est quitté.",
                                    type: "array",
                                    items: {
                                        type: "string",
                                        "x-molang": true
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