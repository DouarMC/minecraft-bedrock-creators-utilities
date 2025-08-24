import { SchemaType } from "../../../../../types/schema";
import { dynamicExamplesSourceKeys } from "../../../shared/schemaEnums";
import { schemaPatterns } from "../../../shared/schemaPatterns";
import { MinecraftJsonSchema } from "../../../types/minecraftJsonSchema";

const baseSchema: MinecraftJsonSchema = {
    "description": "Ce fichier définit des controlleurs d'animations de type Ressource. \nType: `Object`",
    "type": "object",
    "required": ["format_version", "animation_controllers"],
    "properties": {
        "format_version": {
            "description": "La version du Format à utiliser. \nType: `String`",
            "type": "string",
            enum: [
                "1.10.0", "1.11.0", "1.12.0", "1.13.0", "1.14.0", "1.14.1", "1.14.20", "1.14.30", "1.15.0", "1.16.0", "1.16.20", "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
            ]
        },
        "animation_controllers": {
            "description": "Contient la définition des Animation Controllers. \nType: `Object`",
            "type": "object",
            "propertyNames": {
                pattern: schemaPatterns.animation_controller_identifier,
                "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_resource_animation_controller_ids
            },
            "additionalProperties": {
                "type": "object",
                "properties": {
                    "initial_state": {
                        "description": "Définit l'état initial de l'Animation Controller. \nType: `String` \nNote: Si l'état initial n'est pas défini, l'état nommé 'default' sera utilisé.",
                        "type": "string"
                    },
                    "states": {
                        "description": "Définit les états de l'animation. \nType: `Object`",
                        "type": "object",
                        "propertyNames": {
                            "examples": ["default"]
                        },
                        "additionalProperties": {
                            "type": "object",
                            "properties": {
                                "transitions": {
                                    "description": "Définit les transitions de l'état actuel vers un autre état si la condition Molang est validé. \nType: `Object[]` \nNote: la première transition valide sera utilisée.",
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "maxProperties": 1,
                                        "additionalProperties": {
                                            "type": "string"
                                        }
                                    }
                                },
                                "animations": {
                                    "description": "Définit les animations à jouer dans cet état. \nType: `(String | Object)[]` \nNote: L'animation mentionnée ici doit être référencé dans la définition de l'entité. \nNote: Possibilité de faire jouer une animation avec une vitesse différente.",
                                    "type": "array",
                                    "oneOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "object",
                                            "additionalProperties": {
                                                "oneOf": [
                                                    {
                                                        "type": "number"
                                                    },
                                                    {
                                                        "type": "string"
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                },
                                "blend_transition": {
                                    "description": "Définit la durée du fondu croisé lors du passage d'un état à un autre. \nType: `Number` \nNote: La transition est un fondu enchaîné.",
                                    "type": "number"
                                },
                                "variables": {
                                    "description": "Définit les variables molang de l'entité à remapper pour cet état. \nType: `Object`",
                                    "type": "object",
                                    "additionalProperties": {
                                        "type": "object",
                                        "properties": {
                                            "input": {
                                                "description": "Source de la valeur utilisée pour cette variable. \nType: `Moiang`",
                                                "type": "string"
                                            },
                                            "remap_curve": {
                                                "description": "Définit la courbe de remappage de la valeur. \nType: `Object`",
                                                "type": "object",
                                                "propertyNames": {
                                                    "pattern": "^\\d+(\\.\\d+)?$"
                                                },
                                                "additionalProperties": {
                                                    "type": "number"
                                                }
                                            }
                                        }
                                    }
                                },
                                "sound_effects": {
                                    "description": "Définit les effets de sons à jouer dans cet état. \nType: `Object[]` \nNote: Les effets de sons mentionnés ici doivent être référencés dans la définition de l'entité.",
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "effect": {
                                                "description": "Nom de l'effet de son à jouer. \nType: `String`",
                                                "type": "string"
                                            },
                                            "locator": {
                                                "description": "Définit dans quel locator l'effet de son doit être joué. \nType: `String`",
                                                "type": "string"
                                            }
                                        }
                                    }
                                },
                                "particle_effects": {
                                    "description": "Définit les effets de particules à jouer dans cet état. \nType: `Object[]` \nNote: Les effets de particules mentionnés ici doivent être référencés dans la définition de l'entité.",
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "effect": {
                                                "description": "Nom de l'effet de particules à jouer. \nType: `String`",
                                                "type": "string"
                                            },
                                            "locator": {
                                                "description": "Définit dans quel locator l'effet de particules doit être joué. \nType: `String`",
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
    }
};

export const animationControllersSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/animation_controllers/*.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};