import { SchemaType } from "../../../../types/schema";

const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Ce fichier sert à créer des références de sons à utiliser pour les blocs, entités, environnements, etc. \nType: `Object`",
    "type": "object",
    "properties": {
        "block_sounds": {
            "description": "Définit les sons des blocs. \nType: `Object`",
            "type": "object",
            "additionalProperties": {
                "type": "object",
                "properties": {
                    "events": {
                        "description": "Définit les sons à jouer pour les événements spécifiques. \nType: `Object`",
                        "type": "object",
                        "properties": {
                            "break": {
                                "description": "Définit le son à jouer lorsqu'un bloc est cassé. \nType: `String | Object`",
                                "oneOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "object",
                                        "properties": {
                                            "sound": {
                                                "description": "Définit le son à jouer. \nType: `String`",
                                                "type": "string"
                                            },
                                            "volume": {
                                                "description": "Définit le volume du son. \nType: `Number | Number[2]`",
                                                "oneOf": [
                                                    {
                                                        "type": "number"
                                                    },
                                                    {
                                                        "type": "array",
                                                        "minItems": 2,
                                                        "maxItems": 2,
                                                        "items": {
                                                            "type": "number"
                                                        }
                                                    }
                                                ]
                                            },
                                            "pitch": {
                                                "description": "Définit le pitch du son. \nType: `Number | Number[2]`",
                                                "oneOf": [
                                                    {
                                                        "type": "number"
                                                    },
                                                    {
                                                        "type": "array",
                                                        "minItems": 2,
                                                        "maxItems": 2,
                                                        "items": {
                                                            "type": "number"
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                ]
                            },
                            "hit": {
                                "description": "Définit le son à jouer lorsqu'un bloc est touché. \nType: `String | Object`",
                                "oneOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "object",
                                        "properties": {
                                            "sound": {
                                                "description": "Définit le son à jouer. \nType: `String`",
                                                "type": "string"
                                            },
                                            "volume": {
                                                "description": "Définit le volume du son. \nType: `Number | Number[2]`",
                                                "oneOf": [
                                                    {
                                                        "type": "number"
                                                    },
                                                    {
                                                        "type": "array",
                                                        "minItems": 2,
                                                        "maxItems": 2,
                                                        "items": {
                                                            "type": "number"
                                                        }
                                                    }
                                                ]
                                            },
                                            "pitch": {
                                                "description": "Définit le pitch du son. \nType: `Number | Number[2]`",
                                                "oneOf": [
                                                    {
                                                        "type": "number"
                                                    },
                                                    {
                                                        "type": "array",
                                                        "minItems": 2,
                                                        "maxItems": 2,
                                                        "items": {
                                                            "type": "number"
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                ]
                            },
                            "place": {
                                "description": "Définit le son à jouer lorsqu'un bloc est placé. \nType: `String | Object`",
                                "oneOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "object",
                                        "properties": {
                                            "sound": {
                                                "description": "Définit le son à jouer. \nType: `String`",
                                                "type": "string"
                                            },
                                            "volume": {
                                                "description": "Définit le volume du son. \nType: `Number | Number[2]`",
                                                "oneOf": [
                                                    {
                                                        "type": "number"
                                                    },
                                                    {
                                                        "type": "array",
                                                        "minItems": 2,
                                                        "maxItems": 2,
                                                        "items": {
                                                            "type": "number"
                                                        }
                                                    }
                                                ]
                                            },
                                            "pitch": {
                                                "description": "Définit le pitch du son. \nType: `Number | Number[2]`",
                                                "oneOf": [
                                                    {
                                                        "type": "number"
                                                    },
                                                    {
                                                        "type": "array",
                                                        "minItems": 2,
                                                        "maxItems": 2,
                                                        "items": {
                                                            "type": "number"
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    },
                    "volume": {
                        "description": "Définit le volume par défaut des sons. \nType: `Number`",
                        "type": "number"
                    },
                    "pitch": {
                        "description": "Définit le pitch par défaut des sons. \nType: `Number`",
                        "type": "number"
                    },
                    "base": {
                        "description": "Définit une référence de son de bloc à utiliser comme base pour cette référence. \nType: `String`",
                        "type": "string"
                    }
                }
            }
        },
        "interactive_sounds": {
            "description": "Sons liés aux mouvemennts du jouueur ou d'entités sur des blocs ou sur elles mêmes. \nType: `Object`",
            "type": "object",
            "properties": {
                "block_sounds": {
                    "description": "Définit les sons à jouer pour les interactions avec les blocs. \nType: `Object`",
                    "type": "object",
                    "additionalProperties": {
                        "type": "object",
                        "properties": {
                            "events": {
                                "description": "Définit les sons à jouer pour les événements spécifiques des blocs. \nType: `Object`",
                                "type": "object",
                                "additionalProperties": {
                                    "type": "object",
                                    "properties": {
                                        "sound": {
                                            "description": "Définit le son à jouer. \nType: `String`",
                                            "type": "string"
                                        },
                                        "volume": {
                                            "description": "Définit le volume du son. \nType: `Number | Number[2]`",
                                            "oneOf": [
                                                {
                                                    "type": "number"
                                                },
                                                {
                                                    "type": "array",
                                                    "minItems": 2,
                                                    "maxItems": 2,
                                                    "items": {
                                                        "type": "number"
                                                    }
                                                }
                                            ]
                                        },
                                        "pitch": {
                                            "description": "Définit le pitch du son. \nType: `Number | Number[2]`",
                                            "oneOf": [
                                                {
                                                    "type": "number"
                                                },
                                                {
                                                    "type": "array",
                                                    "minItems": 2,
                                                    "maxItems": 2,
                                                    "items": {
                                                        "type": "number"
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            "pitch": {
                                "description": "Définit le pitch par défaut des sons des blocs. \nType: `Number`",
                                "type": "number"
                            },
                            "volume": {
                                "description": "Définit le volume par défaut des sons des blocs. \nType: `Number`",
                                "type": "number"
                            }
                        }
                    }
                },
                "entity_sounds": {
                    "description": "Définit les sons à jouer pour les interactions avec les entités. \nType: `Object`",
                    "type": "object",
                    "properties": {
                        "defaults": {
                            "description": "Définit les sons par défaut pour les entités. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "events": {
                                    "description": "Définit les sons à jouer pour les événements spécifiques des entités. \nType: `Object`",
                                    "type": "object"
                                },
                                "volume": {
                                    "description": "Définit le volume par défaut des sons des entités. \nType: `Number`",
                                    "type": "number"
                                },
                                "pitch": {
                                    "description": "Définit le pitch par défaut des sons des entités. \nType: `Number`",
                                    "type": "number"
                                }
                            }
                        },
                        "entities": {
                            "description": "Définit les sons spécifiques pour chaque entité. \nType: `Object`",
                            "type": "object",
                            "additionalProperties": {
                                "type": "object",
                                "properties": {
                                    "events": {
                                        "description": "Définit les sons à jouer pour les événements spécifiques de l'entité. \nType: `Object`",
                                        "type": "object"
                                    },
                                    "volume": {
                                        "description": "Définit le volume par défaut des sons de l'entité. \nType: `Number`",
                                        "type": "number"
                                    },
                                    "pitch": {
                                        "description": "Définit le pitch par défaut des sons de l'entité. \nType: `Number`",
                                        "type": "number"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "individual_event_sounds": {
            "description": "Sons spécifiques déclenchés par des événements uniques dans le jeu. Ils ne sont pas liés à une interaction physique avec un bloc, mais à une action spécifique. \nType: `Object`",
            "type": "object",
            "properties": {
                "events": {
                    "description": "Définit les sons à jouer pour les événements spécifiques. \nType: `Object`",
                    "type": "object",
                    "additionalProperties": {
                        "type": "object",
                        "properties": {
                            "sound": {
                                "description": "Définit le son à jouer. \nType: `String`",
                                "type": "string"
                            },
                            "volume": {
                                "description": "Définit le volume du son. \nType: `Number | Number[2]`",
                                "oneOf": [
                                    {
                                        "type": "number"
                                    },
                                    {
                                        "type": "array",
                                        "minItems": 2,
                                        "maxItems": 2,
                                        "items": {
                                            "type": "number"
                                        }
                                    }
                                ]
                            },
                            "pitch": {
                                "description": "Définit le pitch du son. \nType: `Number | Number[2]`",
                                "oneOf": [
                                    {
                                        "type": "number"
                                    },
                                    {
                                        "type": "array",
                                        "minItems": 2,
                                        "maxItems": 2,
                                        "items": {
                                            "type": "number"
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        },
        "individual_named_sounds": {
            "description": "Sons généraux et ambiant du jeu. \nType: `Object`",
            "type": "object",
            "properties": {
                "sounds": {
                    "description": "Définit les sons à jouer pour les événements spécifiques. \nType: `Object`",
                    "type": "object",
                    "additionalProperties": {
                        "type": "object",
                        "properties": {
                            "sound": {
                                "description": "Définit le son à jouer. \nType: `String`",
                                "type": "string"
                            },
                            "volume": {
                                "description": "Définit le volume du son. \nType: `Number | Number[2]`",
                                "oneOf": [
                                    {
                                        "type": "number"
                                    },
                                    {
                                        "type": "array",
                                        "minItems": 2,
                                        "maxItems": 2,
                                        "items": {
                                            "type": "number"
                                        }
                                    }
                                ]
                            },
                            "pitch": {
                                "description": "Définit le pitch du son. \nType: `Number | Number[2]`",
                                "oneOf": [
                                    {
                                        "type": "number"
                                    },
                                    {
                                        "type": "array",
                                        "minItems": 2,
                                        "maxItems": 2,
                                        "items": {
                                            "type": "number"
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        },
        "entity_sounds": {
            "description": "Sons liés aux entités (mobs, créatures). \nType: `Object`",
            "type": "object",
            "properties": {
                "defaults": {
                    "description": "Définit les sons par défaut pour les entités. \nType: `Object`",
                    "type": "object",
                    "properties": {
                        "events": {
                            "description": "Définit les sons à jouer pour les événements spécifiques des entités. \nType: `Object`",
                            "type": "object"
                        },
                        "volume": {
                            "description": "Définit le volume par défaut des sons des entités. \nType: `Number`",
                            "type": "number"
                        },
                        "pitch": {
                            "description": "Définit le pitch par défaut des sons des entités. \nType: `Number`",
                            "type": "number"
                        }
                    }
                },
                "entities": {
                    "description": "Définit les sons spécifiques pour chaque entité. \nType: `Object`",
                    "type": "object",
                    "additionalProperties": {
                        "type": "object",
                        "properties": {
                            "events": {
                                "description": "Définit les sons à jouer pour les événements spécifiques de l'entité. \nType: `Object`",
                                "type": "object"
                            },
                            "volume": {
                                "description": "Définit le volume par défaut des sons de l'entité. \nType: `Number`",
                                "type": "number"
                            },
                            "pitch": {
                                "description": "Définit le pitch par défaut des sons de l'entité. \nType: `Number`",
                                "type": "number"
                            },
                            "variants": {
                                "description": "Définit les sons à jouer en fonction des variantes de l'entité. \nType: `Object`",
                                "type": "object",
                                "properties": {
                                    "key": {
                                        "description": "La requête Molang qui permet de récupérer un résultat qui sera utilisé pour choisir le son à jouer. \nType: `Molang`",
                                        "default": null,
                                        "type": "string"
                                    },
                                    "map": {
                                        "description": "Définit les sons à jouer pour chaque variante de l'entité. \nType: `Object`",
                                        "type": "object",
                                        "additionalProperties": {
                                            "type": "object",
                                            "properties": {
                                                "volume": {
                                                    "description": "Définit le volume du son pour cette variante. \nType: `Number | Number[2]`",
                                                    "oneOf": [
                                                        {
                                                            "type": "number"
                                                        },
                                                        {
                                                            "type": "array",
                                                            "minItems": 2,
                                                            "maxItems": 2,
                                                            "items": {
                                                                "type": "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                "pitch": {
                                                    "description": "Définit le pitch du son pour cette variante. \nType: `Number | Number[2]`",
                                                    "oneOf": [
                                                        {
                                                            "type": "number"
                                                        },
                                                        {
                                                            "type": "array",
                                                            "minItems": 2,
                                                            "maxItems": 2,
                                                            "items": {
                                                                "type": "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                "events": {
                                                    "description": "Définit les sons à jouer pour les événements spécifiques de cette variante. \nType: `Object`",
                                                    "type": "object",
                                                    "properties": {
                                                        "break": {
                                                            "description": "Définit le son à jouer lorsqu'un bloc est cassé par cette entité. \nType: `String | Object`",
                                                            "oneOf": [
                                                                {
                                                                    "type": "string"
                                                                },
                                                                {
                                                                    "type": "object",
                                                                    "properties": {
                                                                        "sound": {
                                                                            "description": "Définit le son à jouer. \nType: `String`",
                                                                            "type": "string"
                                                                        },
                                                                        "volume": {
                                                                            "description": "Définit le volume du son. \nType: `Number | Number[2]`",
                                                                            "oneOf": [
                                                                                {
                                                                                    "type": "number"
                                                                                },
                                                                                {
                                                                                    "type": "array",
                                                                                    "minItems": 2,
                                                                                    "maxItems": 2,
                                                                                    "items": {
                                                                                        "type": "number"
                                                                                    }
                                                                                }
                                                                            ]
                                                                        },
                                                                        "pitch": {
                                                                            "description": "Définit le pitch du son. \nType: `Number | Number[2]`",
                                                                            "oneOf": [
                                                                                {
                                                                                    "type": "number"
                                                                                },
                                                                                {
                                                                                    "type": "array",
                                                                                    "minItems": 2,
                                                                                    "maxItems": 2,
                                                                                    "items": {
                                                                                        "type": "number"
                                                                                    }
                                                                                }
                                                                            ]
                                                                        }
                                                                    }
                                                                }
                                                            ]
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
            }
        }
    }
};

export const soundsSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/sounds.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};