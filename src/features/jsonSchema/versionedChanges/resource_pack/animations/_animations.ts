import { SchemaType } from "../../../../../types/schema";
import { dynamicExamplesSourceKeys } from "../../../shared/schemaEnums";
import { schemaPatterns } from "../../../shared/schemaPatterns";

const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Ce fichier définit un Animation de type Ressource. \nType: `Object`",
    "type": "object",
    "required": ["format_version", "animations"],
    "properties": {
        "format_version": {
            "description": "La version du Format à utiliser. \nType: `String`",
            "type": "string",
            enum: [
                "1.8.0", "1.9.0", "1.10.0", "1.11.0", "1.12.0", "1.13.0", "1.14.0", "1.14.1", "1.14.20", "1.14.30", "1.15.0", "1.16.0", "1.16.20", "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
            ]
        },
        "animations": {
            "description": "Définit les animations. \nType: `Object`",
            "type": "object",
            "propertyNames": {
                pattern: schemaPatterns.animation_identifier,
                "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_resource_animation_ids
            },
            "additionalProperties": {
                "type": "object",
                "properties": {
                    "loop": {
                        "description": "Définit si l'animation doit s'arrêter, se jouer en boucle, ou si elle doit s'arrêter et se figer à la dernière frame. \nType: `Boolean | String`",
                        "oneOf": [
                            {
                                "type": "boolean"
                            },
                            {
                                "type": "string",
                                "enum": ["hold_on_last_frame"]
                            }
                        ]
                    },
                    "start_delay": {
                        "description": "Combien de temps en secondes attendre avant de jouer cette animation. \nType: `Molang` \nNote: Cette expression est évaluée une fois avant de jouer, et seulement réévaluée si on lui demande de jouer depuis le début. \nUne animation en boucle devrait utiliser 'loop_delay' si elle veut un délai entre les boucles.",
                        type: "molang"
                    },
                    "loop_delay": {
                        "description": "Combien de temps en secondes attendre avant de relancer cette animation. \nType: `Molang` \nNote: Cette expression est évaluée après chaque boucle et seulement réévaluée sur une animation en boucle.",
                        type: "molang"
                    },
                    "anim_time_update": {
                        "description": "Détermine l'écoulement du temps lors de la lecture de l'animation. \nType: `Molang` \nNote: Par défaut, il s'agit de 'query.anim_time + query.delta_time', ce qui signifie une progression en secondes.",
                        type: "molang"
                    },
                    "blend_weight": {
                        type: "molang"
                    },
                    "override_previous_animation": {
                        "description": "Définit si les os de cette animation doivent revenir à leur pose par défaut avant d'appliquer cette animation. \nType: `Boolean`",
                        "type": "boolean"
                    },
                    "bones": {
                        "description": "Définit les os de l'animation. \nType: `Object`",
                        "type": "object",
                        "additionalProperties": {
                            "type": "object",
                            "properties": {
                                "relative_to": {
                                    "description": "Si c'est défini, la rotation de l'os est relative à l'entité plutôt qu'à son os parent. \nType: `Object`",
                                    "properties": {
                                        "rotation": {
                                            "description": "Définit que la rotation de l'os est relative à l'entité plutôt qu'à son os parent. \nType: `String`",
                                            "const": "entity"
                                        }
                                    }
                                },
                                "position": {
                                    "description": "Définit la position relative de l'os. \nType: `Molang | Molang[] | Object` \nNote: La position peut être la même pendant toute l'animation ou changer à chaque frame.",
                                    "oneOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "array",
                                            "items": {
                                                "oneOf": [
                                                    {
                                                        "type": "string"
                                                    },
                                                    {
                                                        "type": "number"
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            "type": "object",
                                            "propertyNames": {
                                                "pattern": "^\\d+(\\.\\d+)?$"
                                            },
                                            "additionalProperties": {
                                                "oneOf": [
                                                    {
                                                        "type": "array",
                                                        "minItems": 3,
                                                        "maxItems": 3,
                                                        "items": {
                                                            "oneOf": [
                                                                {
                                                                    "type": "string"
                                                                },
                                                                {
                                                                    "type": "number"
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        "type": "object",
                                                        "properties": {
                                                            "lerp_mode": {
                                                                "type": "string",
                                                                "enum": ["linear", "catmullrom"]
                                                            },
                                                            "pre": {
                                                                "type": "array",
                                                                "minItems": 3,
                                                                "maxItems": 3,
                                                                "items": {
                                                                    "oneOf": [
                                                                        {
                                                                            "type": "string"
                                                                        },
                                                                        {
                                                                            "type": "number"
                                                                        }
                                                                    ]
                                                                }
                                                            },
                                                            "post": {
                                                                "type": "array",
                                                                "minItems": 3,
                                                                "maxItems": 3,
                                                                "items": {
                                                                    "oneOf": [
                                                                        {
                                                                            "type": "string"
                                                                        },
                                                                        {
                                                                            "type": "number"
                                                                        }
                                                                    ]
                                                                }
                                                            }
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                },
                                "rotation": {
                                    "description": "Définit la rotation de l'os. \nType: `Molang | Molang[] | Object` \nNote: La rotation peut être la même pendant toute l'animation ou changer à chaque frame.",
                                    "oneOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "array",
                                            "items": {
                                                "oneOf": [
                                                    {
                                                        "type": "string"
                                                    },
                                                    {
                                                        "type": "number"
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            "type": "object",
                                            "propertyNames": {
                                                "pattern": "^\\d+(\\.\\d+)?$"
                                            },
                                            "additionalProperties": {
                                                "oneOf": [
                                                    {
                                                        "type": "array",
                                                        "minItems": 3,
                                                        "maxItems": 3,
                                                        "items": {
                                                            "oneOf": [
                                                                {
                                                                    "type": "string"
                                                                },
                                                                {
                                                                    "type": "number"
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        "type": "object",
                                                        "properties": {
                                                            "lerp_mode": {
                                                                "type": "string",
                                                                "enum": ["linear", "catmullrom"]
                                                            },
                                                            "pre": {
                                                                "type": "array",
                                                                "minItems": 3,
                                                                "maxItems": 3,
                                                                "items": {
                                                                    "oneOf": [
                                                                        {
                                                                            "type": "string"
                                                                        },
                                                                        {
                                                                            "type": "number"
                                                                        }
                                                                    ]
                                                                }
                                                            },
                                                            "post": {
                                                                "type": "array",
                                                                "minItems": 3,
                                                                "maxItems": 3,
                                                                "items": {
                                                                    "oneOf": [
                                                                        {
                                                                            "type": "string"
                                                                        },
                                                                        {
                                                                            "type": "number"
                                                                        }
                                                                    ]
                                                                }
                                                            }
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                },
                                "scale": {
                                    "description": "Définit l'échelle de l'os. \nType: `Molang | Molang[] | Object` \nNote: L'échelle peut être la même pendant toute l'animation ou changer à chaque frame.",
                                    "oneOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "array",
                                            "items": {
                                                "oneOf": [
                                                    {
                                                        "type": "string"
                                                    },
                                                    {
                                                        "type": "number"
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            "type": "object",
                                            "propertyNames": {
                                                "pattern": "^\\d+(\\.\\d+)?$"
                                            },
                                            "additionalProperties": {
                                                "oneOf": [
                                                    {
                                                        "type": "array",
                                                        "minItems": 3,
                                                        "maxItems": 3,
                                                        "items": {
                                                            "oneOf": [
                                                                {
                                                                    "type": "string"
                                                                },
                                                                {
                                                                    "type": "number"
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        "type": "object",
                                                        "properties": {
                                                            "lerp_mode": {
                                                                "type": "string",
                                                                "enum": ["linear", "catmullrom"]
                                                            },
                                                            "pre": {
                                                                "type": "array",
                                                                "minItems": 3,
                                                                "maxItems": 3,
                                                                "items": {
                                                                    "oneOf": [
                                                                        {
                                                                            "type": "string"
                                                                        },
                                                                        {
                                                                            "type": "number"
                                                                        }
                                                                    ]
                                                                }
                                                            },
                                                            "post": {
                                                                "type": "array",
                                                                "minItems": 3,
                                                                "maxItems": 3,
                                                                "items": {
                                                                    "oneOf": [
                                                                        {
                                                                            "type": "string"
                                                                        },
                                                                        {
                                                                            "type": "number"
                                                                        }
                                                                    ]
                                                                }
                                                            }
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    "particle_effects": {
                        "description": "Définit les effets de particules de l'animation. \nType: `Object`",
                        "type": "object",
                        "propertyNames": {
                            "pattern": "^\\d+(\\.\\d+)?$"
                        },
                        "additionalProperties": {
                            "oneOf": [
                                {
                                    "type": "object",
                                    "required": ["effect"],
                                    "properties": {
                                        "effect": {
                                            "description": "L'identifiant de l'effet de particules à jouer. \nType: `String`",
                                            "type": "string"
                                        },
                                        "locator": {
                                            "description": "Le nom d'un locator sur l'acteur où l'effet doit être situé. \nType: `String`",
                                            "type": "string"
                                        },
                                        "pre_effect_script": {
                                            "description": "Un script Molang qui sera exécuté lorsque l'émetteur de particules est initialisé. \nType: `Molang`",
                                            "oneOf": [
                                                {
                                                    "type": "string"
                                                },
                                                {
                                                    "type": "number"
                                                }
                                            ]
                                        },
                                        "bind_to_actor": {
                                            "description": "Si défini sur false, l'effet sera généré dans le monde sans être lié à un acteur (par défaut, un effet est lié à l'acteur). \nType: `Boolean`",
                                            "type": "boolean",
                                            "default": true
                                        }
                                    }
                                },
                                {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "required": ["effect"],
                                        "properties": {
                                            "effect": {
                                                "description": "L'identifiant de l'effet de particules à jouer. \nType: `String`",
                                                "type": "string"
                                            },
                                            "locator": {
                                                "description": "Le nom d'un locator sur l'acteur où l'effet doit être situé. \nType: `String`",
                                                "type": "string"
                                            },
                                            "pre_effect_script": {
                                                "description": "Un script Molang qui sera exécuté lorsque l'émetteur de particules est initialisé. \nType: `Molang`",
                                                "oneOf": [
                                                    {
                                                        "type": "string"
                                                    },
                                                    {
                                                        "type": "number"
                                                    }
                                                ]
                                            },
                                            "bind_to_actor": {
                                                "description": "Si défini sur false, l'effet sera généré dans le monde sans être lié à un acteur (par défaut, un effet est lié à l'acteur). \nType: `Boolean`",
                                                "type": "boolean",
                                                "default": true
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    "sound_effects": {
                        "description": "Définit les effets de sons à joué pendant l'animation. \nType: `Object`",
                        "type": "object",
                        "propertyNames": {
                            "pattern": "^\\d+(\\.\\d+)?$"
                        },
                        "additionalProperties": {
                            "oneOf": [
                                {
                                    "type": "object",
                                    "required": ["effect"],
                                    "properties": {
                                        "effect": {
                                            "description": "L'identifiant de l'effet sonore à jouer. \nType: `String` \nNote: les sons valides doivent être listés dans le fichier json de définition de ressource de l'entité.",
                                            "type": "string"
                                        },
                                        "locator": {
                                            "description": "Le nom d'un locator sur l'acteur où le son doit être situé. \nType: `String`",
                                            "type": "string"
                                        }
                                    }
                                },
                                {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "required": ["effect"],
                                        "properties": {
                                            "effect": {
                                                "description": "L'identifiant de l'effet sonore à jouer. \nType: `String` \nNote: les sons valides doivent être listés dans le fichier json de définition de ressource de l'entité.",
                                                "type": "string"
                                            },
                                            "locator": {
                                                "description": "Le nom d'un locator sur l'acteur où le son doit être situé. \nType: `String`",
                                                "type": "string"
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    "timeline": {
                        "description": "Définit les frames de l'animation. \nType: `Object`",
                        "type": "object",
                        "propertyNames": {
                            "pattern": "^\\d+(\\.\\d+)?$"
                        },
                        "additionalProperties": {
                            "description": "Définit une frame de l'animation où une slash commande, un déclencheur d'événement ou une expresion Molang arbitraire peut être défini. \nType: `String | String[]`",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    }
                                }
                            ]
                        }
                    },
                    "animation_length": {
                        "description": "Remplace la valeur calculée (définie comme le temps maximal d'une image clé ou d'un événement) et définit la durée de l'animation en secondes. \nType: `Number`",
                        "type": "number",
                        "minimum": 0.0
                    }
                }
            }
        }
    }
};

export const animationsSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/animations/*.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};