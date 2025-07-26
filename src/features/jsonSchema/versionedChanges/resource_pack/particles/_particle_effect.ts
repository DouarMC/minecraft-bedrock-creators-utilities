import { SchemaChange, SchemaType } from "../../../../../types/schema";

const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Ce fichier sert à définir un Effet de Particule. \nType: `Object`",
    "type": "object",
    "required": ["format_version", "particle_effect"],
    "properties": {
        "format_version": {
            "description": "La version du Format à utiliser. \nType: `String`",
            "type": "string",
            enum: [
                "1.10.0", "1.11.0", "1.12.0", "1.13.0", "1.14.0", "1.14.1", "1.14.20", "1.14.30", "1.15.0", "1.16.0", "1.16.20", "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90"
            ]
        },
        "particle_effect": {
            "description": "Contient la définition de l'Effet de Particule. \nType: `Object`",
            "type": "object",
            "required": ["description", "components"],
            "properties": {
                "description": {
                    "description": "Contient les propriétés de description de l'Effet de Particule. \nType: `Object`",
                    "type": "object",
                    "required": ["identifier", "basic_render_parameters"],
                    "properties": {
                        "identifier": {
                            "description": "L'identifiant de l'Effet de Particule. \nType: `String`",
                            "type": "string",
                            "pattern": "^[a-zA-Z0-9_]+:[a-zA-Z0-9_]+$"
                        },
                        "basic_render_parameters": {
                            "description": "Contient les paramètres de rendu de base de l'Effet de Particule. \nType: `Object`",
                            "type": "object",
                            "required": ["material", "texture"],
                            "properties": {
                                "material": {
                                    "description": "Le matériau de l'Effet de Particule pour le rendu. \nType: `String`",
                                    "type": "string",
                                    "enum": ["particles_alpha", "particles_blend", "particles_add"]
                                },
                                "texture": {
                                    "description": "Le chemin d'accès de la texture de l'Effet de Particule. \nType: `String`",
                                    "type": "string"
                                }
                            }
                        }
                    }
                },
                "components": {
                    "description": "Les composants de l'Effet de Particule. \nType: `Object`",
                    "type": "object",
                    "properties": {
                        "minecraft:emitter_initialization": {
                            "description": "Ce composant permet à l'émetteur d'exécuter un peu de Molang à la création, principalement pour remplir les variables Molang qui seront utilisées plus tard. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "creation_expression": {
                                    "description": "Ceci est exécuté une fois au démarrage de l'émetteur. \nType: `Molang`",
                                    "oneOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "string"
                                        }
                                    ]
                                },
                                "per_update_expression": {
                                    "description": "Ceci est exécuté une fois par mise à jour de l'émetteur. \nType: `Molang`",
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
                        },
                        "minecraft:emitter_lifetime_events": {
                            "description": "Cela permet aux événements de durée de vie de l'émetteur de déclencher certains événements. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "creation_event": {
                                    "description": "Cet événement se déclenche lorsque l'émetteur est créé. \nType: `String | String[]`",
                                    "oneOf": [
                                        {
                                            "type": "array",
                                            "items": {
                                                "type": "string"
                                            }
                                        },
                                        {
                                            "type": "string"
                                        }
                                    ]
                                },
                                "expiration_event": {
                                    "description": "Cet événement se déclenche lorsque l'émetteur expire. \nType: `String | String[]`",
                                    "oneOf": [
                                        {
                                            "type": "array",
                                            "items": {
                                                "type": "string"
                                            }
                                        },
                                        {
                                            "type": "string"
                                        }
                                    ]
                                },
                                "timeline": {
                                    "description": "Cela permet de déclencher des événements à des moments spécifiques de la durée de vie de l'émetteur. \nType: `Object`",
                                    "type": "object",
                                    "propertyNames": {
                                        "pattern": "^[0-9]+(\\.[0-9]+)?$"
                                    },
                                    "additionalProperties": {
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
                                "travel_distance_events": {
                                    "description": "Une série de distances, par exemple 0.0 ou 1.0, qui déclenchent l'événement. \nType: `Object`",
                                    "type": "object",
                                    "propertyNames": {
                                        "pattern": "^[0-9]+(\\.[0-9]+)?$"
                                    },
                                    "additionalProperties": {
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
                                "looping_travel_distance_events": {
                                    "description": "Une série d'événements qui se produisent à des intervalles définis. \nType: `Object[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "required": ["distance", "effects"],
                                        "properties": {
                                            "distance": {
                                                "description": "La distance à laquelle l'événement se déclenche. \nType: `Number`",
                                                "type": "number",
                                                "minimum": 0.0
                                            },
                                            "effects": {
                                                "description": "Les événements qui se produisent à cette distance. \nType: `String | String[]`",
                                                "oneOf": [
                                                    {
                                                        "type": "array",
                                                        "items": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    {
                                                        "type": "string"
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "minecraft:emitter_lifetime_expression": {
                            "description": "L'émetteur s'activera lorsque l'expression d'activation est différente de zéro, et s'éteindra lorsqu'elle est zéro. Cela est utile pour des situations comme la conduite d'un émetteur attaché à une entité à partir d'une variable d'entité. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "activation_expression": {
                                    "description": "L'expression d'activation de l'émetteur. \nType: `Molang`",
                                    "default": 1,
                                    "oneOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "string"
                                        }
                                    ]
                                },
                                "expiration_expression": {
                                    "description": "L'expression d'expiration de l'émetteur. \nType: `Molang`",
                                    "default": 0,
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
                        },
                        "minecraft:emitter_lifetime_looping": {
                            "description": "L'émetteur bouclera jusqu'à ce qu'il soit supprimé. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "active_time": {
                                    "description": "L'émetteur émettra des particules pour cette durée par boucle. \nType: `Float/Molang`",
                                    "default": 10,
                                    "oneOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "string"
                                        }
                                    ]
                                },
                                "sleep_time": {
                                    "description": "L'émetteur mettra en pause l'émission de particules pour cette durée par boucle. \nType: `Float/Molang`",
                                    "default": 0,
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
                        },
                        "minecraft:emitter_lifetime_once": {
                            "description": "L'émetteur s'exécutera une fois, et une fois que la durée de vie se termine ou que le nombre de particules autorisées à émettre a émis, l'émetteur expire. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "active_time": {
                                    "description": "L'émetteur émettra des particules pour cette durée. \nType: `Molang`",
                                    "default": 10,
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
                        },
                        "minecraft:emitter_local_space": {
                            "description": "Ce composant spécifie le cadre de référence de l'émetteur. S'applique uniquement lorsque l'émetteur est attaché à une entité. Lorsque 'position' est vrai, les particules simuleront dans l'espace de l'entité, sinon elles simuleront dans l'espace mondial. La rotation fonctionne de la même manière pour la rotation. La valeur par défaut est fausse pour les deux, ce qui fait que les particules émettent par rapport à l'émetteur, puis simulent indépendamment de l'émetteur. Notez que la rotation = vrai et la position = fausse est une option invalide. La vélocité ajoutera la vélocité de l'émetteur à la vélocité initiale de la particule. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "position": {
                                    "description": "Définit si les particules simulent dans l'espace de l'entité. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "velocity": {
                                    "description": "Définit si la vélocité de l'émetteur est ajoutée à la vélocité initiale de la particule. \nType: `Boolean`",
                                    "type": "boolean"
                                },
                                "rotation": {
                                    "description": "Définit si les particules simulent dans l'espace de l'entité. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                }
                            }
                        },
                        "minecraft:emitter_rate_instant": {
                            "description": "Cela émettra toutes les particules à la fois, puis plus aucune à moins que l'émetteur ne boucle. \nType: `Object`",
                            "type": "object",
                            "required": ["num_particles"],
                            "properties": {
                                "num_particles": {
                                    "description": "Le nombre de particules à émettre par émission. \nType: `Molang`",
                                    "default": 10,
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
                        },
                        "minecraft:emitter_rate_manual": {
                            "description": "La génération de particules ne se produira que lorsque l'émetteur sera invité à émettre via le jeu lui-même. C'est principalement utilisé par les effets de particules hérités. \nType: `Object`",
                            "type": "object",
                            "required": ["max_particles"],
                            "properties": {
                                "max_particles": {
                                    "description": "Le nombre maximum de particules qui peuvent être actives à la fois pour cet émetteur. \nType: `Float/Molang`",
                                    "default": 50,
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
                        },
                        "minecraft:emitter_rate_steady": {
                            "description": "Les particules sortent à un rythme constant ou Molang au fil du temps. \nType: `Object`",
                            "type": "object",
                            "required": ["spawn_rate", "max_particles"],
                            "properties": {
                                "spawn_rate": {
                                    "description": "Le taux d'émission des particules, en particules/sec. \nType: `Float/Molang`",
                                    "default": 1,
                                    "oneOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "string"
                                        }
                                    ]
                                },
                                "max_particles": {
                                    "description": "Le nombre maximum de particules qui peuvent être actives à la fois pour cet émetteur. \nType: `Float/Molang`",
                                    "default": 50,
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
                        },
                        "minecraft:emitter_shape_box": {
                            "description": "Toutes les particules sortent d'une boîte de la taille spécifiée de l'émetteur. \nType: `Object`",
                            "type": "object",
                            "required": ["half_dimensions"],
                            "properties": {
                                "offset": {
                                    "description": "L'offset de l'émetteur pour émettre les particules. \nType: `Molang[3]`",
                                    "default": [0, 0, 0],
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "oneOf": [
                                            {
                                                "type": "number"
                                            },
                                            {
                                                "type": "string"
                                            }
                                        ]
                                    }
                                },
                                "direction": {
                                    "description": "Spécifie la direction de l'émission des particules. \nType: `String | Molang[3]` \n`inwards`: la direction des particules vers le centre de la boîte \n`outwards`: la direction des particules vers l'extérieur de la boîte",
                                    "default": "outwards",
                                    "oneOf": [
                                        {
                                            "type": "string",
                                            "enum": ["inwards", "outwards"]
                                        },
                                        {
                                            "type": "array",
                                            "minItems": 3,
                                            "maxItems": 3,
                                            "items": {
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
                                "half_dimensions": {
                                    "description": "Les dimensions de la boîte. Ce sont les demi-dimensions, la boîte est formée centrée sur l'émetteur avec la boîte s'étendant dans les 3 axes principaux x/y/z par ces valeurs. \nType: `Molang[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "oneOf": [
                                            {
                                                "type": "number"
                                            },
                                            {
                                                "type": "string"
                                            }
                                        ]
                                    }
                                },
                                "surface_only": {
                                    "description": "Émettre uniquement depuis la surface de la boîte. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                }
                            }
                        },
                        "minecraft:emitter_shape_custom": {
                            "description": "Toutes les particules sont émises en fonction d'un ensemble d'expressions Molang spécifiées. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "offset": {
                                    "description": "L'offset de l'émetteur pour émettre les particules. \nType: `Molang[3]`",
                                    "default": [0, 0, 0],
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "oneOf": [
                                            {
                                                "type": "number"
                                            },
                                            {
                                                "type": "string"
                                            }
                                        ]
                                    }
                                },
                                "direction": {
                                    "description": "La direction des particules. \nType: `Molang[3]`",
                                    "default": "outwards",
                                    "oneOf": [
                                        {
                                            "type": "string",
                                            "enum": ["inwards", "outwards"]
                                        },
                                        {
                                            "type": "array",
                                            "minItems": 3,
                                            "maxItems": 3,
                                            "items": {
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
                                }
                            }
                        },
                        "minecraft:emitter_shape_disc": {
                            "description": "Fait apparaître des particules en utilisant une forme de disque. Les particules peuvent être émises à l'intérieur de la forme ou sur son périmètre extérieur. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "offset": {
                                    "description": "L'offset de l'émetteur pour émettre les particules. \nType: `Molang[3]`",
                                    "default": [0, 0, 0],
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "oneOf": [
                                            {
                                                "type": "number"
                                            },
                                            {
                                                "type": "string"
                                            }
                                        ]
                                    }
                                },
                                "direction": {
                                    "description": "La direction des particules. \nType: `Molang[3]`",
                                    "default": "outwards",
                                    "oneOf": [
                                        {
                                            "type": "string",
                                            "enum": ["inwards", "outwards"]
                                        },
                                        {
                                            "type": "array",
                                            "minItems": 3,
                                            "maxItems": 3,
                                            "items": {
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
                                "radius": {
                                    "description": "Le rayon du disque. \nType: `Molang`",
                                    "default": 1,
                                    "oneOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "string"
                                        }
                                    ]
                                },
                                "surface_only": {
                                    "description": "Émettre uniquement depuis la surface du disque. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "plane_normal": {
                                    "description": "Spécifie la normale du plan du disque, le disque sera perpendiculaire à cette direction. \nType: `String | Molang[3]`",
                                    "default": [0, 1, 0],
                                    "oneOf": [
                                        {
                                            "type": "string",
                                            "enum": ["x", "y", "z"]
                                        },
                                        {
                                            "type": "array",
                                            "minItems": 3,
                                            "maxItems": 3,
                                            "items": {
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
                                }
                            }
                        },
                        "minecraft:emitter_shape_entity_aabb": {
                            "description": "Toutes les particules sortent de la boîte englobante alignée sur les axes (AABB) pour l'entité à laquelle l'émetteur est attaché, ou du point de l'émetteur s'il n'y a pas d'entité. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "surface_only": {
                                    "description": "Émettre uniquement depuis la surface de la boîte. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "direction": {
                                    "description": "La direction des particules. \nType: `Molang[3]`",
                                    "default": "outwards",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
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
                            }
                        },
                        "minecraft:emitter_shape_point": {
                            "description": "Toutes les particules sortent d'un point décalé de l'émetteur. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "offset": {
                                    "description": "L'offset de l'émetteur pour émettre les particules. \nType: `Molang[3]`",
                                    "default": [0, 0, 0],
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "oneOf": [
                                            {
                                                "type": "number"
                                            },
                                            {
                                                "type": "string"
                                            }
                                        ]
                                    }
                                },
                                "direction": {
                                    "description": "La direction des particules. \nType: `Molang[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
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
                            }
                        },
                        "minecraft:emitter_shape_sphere": {
                            "description": "Spécifie l'offset de l'émetteur pour émettre les particules. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "offset": {
                                    "description": "L'offset de l'émetteur pour émettre les particules. \nType: `Molang[3]`",
                                    "default": [0, 0, 0],
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "oneOf": [
                                            {
                                                "type": "number"
                                            },
                                            {
                                                "type": "string"
                                            }
                                        ]
                                    }
                                },
                                "direction": {
                                    "description": "Spécifie la direction de l'émission des particules. \nType: `String | Molang[3]` \n`inwards`: la direction des particules vers le centre de la boîte \n`outwards`: la direction des particules vers l'extérieur de la boîte",
                                    "default": "outwards",
                                    "oneOf": [
                                        {
                                            "type": "string",
                                            "enum": ["inwards", "outwards"]
                                        },
                                        {
                                            "type": "array",
                                            "minItems": 3,
                                            "maxItems": 3,
                                            "items": {
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
                                "radius": {
                                    "description": "Le rayon de la sphère. \nType: `Molang`",
                                    "default": 1,
                                    "oneOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "string"
                                        }
                                    ]
                                },
                                "surface_only": {
                                    "description": "Émettre uniquement depuis la surface de la sphère. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                }
                            }
                        },
                        "minecraft:particle_appearance_billboard": {
                            "description": "Ce composant indique au système de particules de rendre la particule comme un billboard, un rectangle dans le monde faisant face à une direction particulière. \nType: `Object`",
                            "type": "object",
                            "required": ["size"],
                            "properties": {
                                "size": {
                                    "description": "Spécifie la taille du billboard. \nType: `Molang[2]`",
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "oneOf": [
                                            {
                                                "type": "number"
                                            },
                                            {
                                                "type": "string"
                                            }
                                        ]
                                    }
                                },
                                "facing_camera_mode": {
                                    "description": "Spécifie comment le billboard est orienté par rapport à la caméra. \nType: `String` \n`rotate_xyz`: aligné sur la caméra, perpendiculaire à l'axe de vue \n`rotate_y`: aligné sur la caméra, mais tournant autour de l'axe y du monde \n`lookat_xyz`: visé par la caméra, biaisé vers le haut du monde \n`lookat_y`: visé par la caméra, mais tournant autour de l'axe y du monde \n`direction_x`: l'axe x non tourné de la particule est le long du vecteur de direction, l'axe y non tourné tente de viser vers le haut \n`direction_y`: l'axe y non tourné de la particule est le long du vecteur de direction, l'axe x non tourné tente de viser vers le haut \n`direction_z`: le visage du billboard est le long du vecteur de direction, l'axe y non tourné tente de viser vers le haut \n`emitter_transform_xy`: oriente les particules pour correspondre au transformateur de l'émetteur (le plan du billboard correspondra au plan xy du transformateur). \n`emitter_transform_xz`: oriente les particules pour correspondre au transformateur de l'émetteur (le plan du billboard correspondra au plan xz du transformateur). \n`emitter_transform_yz`: oriente les particules pour correspondre au transformateur de l'émetteur (le plan du billboard correspondra au plan yz du transformateur).",
                                    "type": "string",
                                    "enum": ["rotate_xyz", "rotate_y", "lookat_xyz", "lookat_y", "direction_x", "direction_y", "direction_z", "emitter_transform_xy", "emitter_transform_xz", "emitter_transform_yz"]
                                },
                                "direction": {
                                    "description": "Spécifie comment calculer la direction d'une particule, cela sera utilisé par les modes de visage qui nécessitent une direction en entrée (par exemple: lookat_direction et direction) \nType: `Object` \n`derive_from_velocity`: La direction correspond à la direction de la vélocité. \n`custom_direction`: La direction est spécifiée dans la définition json en utilisant un vecteur de flottants ou des expressions Molang. \nNote: Si la sous-section direction n'est pas définie, la valeur par défaut sera le mode \"derive_from_velocity\" avec un \"min_speed_threshold\" de 0.01.",
                                    "type": "object",
                                    "properties": {
                                        "mode": {
                                            "description": "Le mode de direction de la particule. \nType: `String`",
                                            "type": "string",
                                            "enum": ["derive_from_velocity", "custom_direction"]
                                        },
                                        "min_speed_threshold": {
                                            "description": "Utilisé uniquement en mode \"derive_from_velocity\". La direction est définie si la vitesse de la particule est supérieure au seuil. La valeur par défaut est 0.01. \nType: `Float`",
                                            "type": "number"
                                        },
                                        "custom_direction": {
                                            "description": "Utilisé uniquement en mode \"custom_direction\". Spécifie le vecteur de direction. \nType: `Float[3]`",
                                            "type": "array",
                                            "minItems": 3,
                                            "maxItems": 3,
                                            "items": {
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
                                    }
                                },
                                "uv": {
                                    "description": "Spécifie les coordonnées UV pour la particule. \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "texture_width": {
                                            "description": "Spécifie la largeur de la texture. \nType: `integer`",
                                            "default": 1,
                                            "type": "integer"
                                        },
                                        "texture_height": {
                                            "description": "Spécifie la hauteur de la texture. \nType: `integer`",
                                            "default": 1,
                                            "type": "integer"
                                        },
                                        "flipbook": {
                                            "description": "Manière alternative de spécifier une animation flipbook. Une animation flipbook utilise des morceaux de la texture pour animer, en passant le temps d'une image à l'autre. \nType: `Object`",
                                            "type": "object",
                                            "required": ["base_UV", "max_frame"],
                                            "properties": {
                                                "base_UV": {
                                                    "description": "Coordonnées UV de base pour l'animation flipbook. \nType: `Molang[2]`",
                                                    "type": "array",
                                                    "minItems": 2,
                                                    "maxItems": 2,
                                                    "items": {
                                                        "oneOf": [
                                                            {
                                                                "type": "number"
                                                            },
                                                            {
                                                                "type": "string"
                                                            }
                                                        ]
                                                    }
                                                },
                                                "size_UV": {
                                                    "description": "Taille de la zone UV. \nType: `Number[2]`",
                                                    "type": "array",
                                                    "minItems": 2,
                                                    "maxItems": 2,
                                                    "items": {
                                                        "oneOf": [
                                                            {
                                                                "type": "number"
                                                            },
                                                            {
                                                                "type": "string"
                                                            }
                                                        ]
                                                    }
                                                },
                                                "step_UV": {
                                                    "description": "Jusqu'où déplacer le patch UV à chaque image. \nType: `Number[2]`",
                                                    "type": "array",
                                                    "minItems": 2,
                                                    "maxItems": 2,
                                                    "items": {
                                                        "oneOf": [
                                                            {
                                                                "type": "number"
                                                            },
                                                            {
                                                                "type": "string"
                                                            }
                                                        ]
                                                    }
                                                },
                                                "frames_per_second": {
                                                    "description": "Frames par seconde de l'animation flipbook. \nType: `Number`",
                                                    "type": "number"
                                                },
                                                "max_frame": {
                                                    "description": "Le nombre maximum de frames de l'animation flipbook. \nType: `Molang`",
                                                    "oneOf": [
                                                        {
                                                            "type": "number"
                                                        },
                                                        {
                                                            "type": "string"
                                                        }
                                                    ]
                                                },
                                                "stretch_to_lifetime": {
                                                    "description": "Ajuste les frames par seconde pour correspondre à la durée de vie de la particule. \nType: `Boolean`",
                                                    "default": false,
                                                    "type": "boolean"
                                                },
                                                "loop": {
                                                    "description": "Définit si l'animation flipbook doit boucler. \nType: `Boolean`",
                                                    "default": false,
                                                    "type": "boolean"
                                                }
                                            }
                                        },
                                        "uv": {
                                            "description": "Assumant la largeur et la hauteur de la texture spécifiées, utilisez ces coordonnées UV. \nType: `Molang[2]`",
                                            "type": "array",
                                            "minItems": 2,
                                            "maxItems": 2,
                                            "items": {
                                                "oneOf": [
                                                    {
                                                        "type": "number"
                                                    },
                                                    {
                                                        "type": "string"
                                                    }
                                                ]
                                            }
                                        },
                                        "uv_size": {
                                            "description": "La taille de la zone UV. \nType: `Molang[2]`",
                                            "type": "array",
                                            "minItems": 2,
                                            "maxItems": 2,
                                            "items": {
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
                                    }
                                }
                            }
                        },
                        "minecraft:particle_appearance_lighting": {
                            "description": "Ce composant indique au système de particules de rendre la particule en fonction des conditions d'éclairage locales dans le jeu. \nType: `Object`",
                            "type": "object"
                        },
                        "minecraft:particle_appearance_tinting": {
                            "description": "Ce composant définit la teinte de couleur de la particule. \nType: `Object`",
                            "type": "object",
                            "required": ["color"],
                            "properties": {
                                "color": {
                                    "description": "Définit la couleur de la particule. \nType: `Molang[3] | Molang[4] | String | Object`",
                                    "oneOf": [
                                        {
                                            "oneOf": [
                                                {
                                                    "type": "array",
                                                    "minItems": 3,
                                                    "maxItems": 3,
                                                    "items": {
                                                        "oneOf": [
                                                            {
                                                                "type": "number"
                                                            },
                                                            {
                                                                "type": "string"
                                                            }
                                                        ]
                                                    }
                                                },
                                                {
                                                    "type": "array",
                                                    "minItems": 4,
                                                    "maxItems": 4,
                                                    "items": {
                                                        "oneOf": [
                                                            {
                                                                "type": "number"
                                                            },
                                                            {
                                                                "type": "string"
                                                            }
                                                        ]
                                                    }
                                                },
                                                {
                                                    "type": "string",
                                                    "pattern": "^#[0-9a-fA-F]{6}$"
                                                },
                                                {
                                                    "type": "string",
                                                    "pattern": "^#[0-9a-fA-F]{8}$"
                                                }
                                            ]
                                        },
                                        {
                                            "type": "object",
                                            "required": ["gradient", "interpolant"],
                                            "properties": {
                                                "gradient": {
                                                    "description": "Définit un dégradé de couleur pour la particule. \nType: `Molang[3] | Molang[4] | String | Object`",
                                                    "oneOf": [
                                                        {
                                                            "type": "array",
                                                            "oneOf": [
                                                                {
                                                                    "type": "array",
                                                                    "minItems": 3,
                                                                    "maxItems": 3,
                                                                    "items": {
                                                                        "type": "number"
                                                                    }
                                                                },
                                                                {
                                                                    "type": "array",
                                                                    "minItems": 4,
                                                                    "maxItems": 4,
                                                                    "items": {
                                                                        "type": "number"
                                                                    }
                                                                },
                                                                {
                                                                    "type": "string",
                                                                    "pattern": "^#[0-9a-fA-F]{6}$"
                                                                },
                                                                {
                                                                    "type": "string",
                                                                    "pattern": "^#[0-9a-fA-F]{8}$"
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            "type": "object",
                                                            "propertyNames": {
                                                                "pattern": "^[0-9]+(\\.[0-9]+)?$"
                                                            },
                                                            "additionalProperties": {
                                                                "oneOf": [
                                                                    {
                                                                        "type": "array",
                                                                        "oneOf": [
                                                                            {
                                                                                "type": "array",
                                                                                "minItems": 3,
                                                                                "maxItems": 3,
                                                                                "items": {
                                                                                    "type": "number"
                                                                                }
                                                                            },
                                                                            {
                                                                                "type": "array",
                                                                                "minItems": 4,
                                                                                "maxItems": 4,
                                                                                "items": {
                                                                                    "type": "number"
                                                                                }
                                                                            },
                                                                            {
                                                                                "type": "string",
                                                                                "pattern": "^#[0-9a-fA-F]{6}$"
                                                                            },
                                                                            {
                                                                                "type": "string",
                                                                                "pattern": "^#[0-9a-fA-F]{8}$"
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
                                                },
                                                "interpolant": {
                                                    "description": "Définit l'interpolant pour le dégradé de couleur. \nType: `Molang`",
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
                                        }
                                    ]
                                }
                            }
                        },
                        "minecraft:particle_expire_if_in_blocks": {
                            "description": "Les particules expirent lorsqu'elles sont dans un bloc du type de la liste. \nType: `String[]` \nNote: Ce composant peut exister aux côtés de l'expression de durée de vie des particules.",
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "minecraft:particle_expire_if_not_in_blocks": {
                            "description": "Les particules expirent lorsqu'elles ne sont pas dans un bloc du type de la liste. \nType: `String[]` \nNote: Ce composant peut exister aux côtés de l'expression de durée de vie des particules.",
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "minecraft:particle_initial_speed": {
                            "description": "Ce composant indique au système de particules de démarrer la particule avec une vitesse spécifiée. \nType: `Molang | Molang[3]`",
                            "default": 0,
                            "oneOf": [
                                {
                                    "oneOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "string"
                                        }
                                    ]
                                },
                                {
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
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
                        "minecraft:particle_initial_spin": {
                            "description": "Ce composant indique au système de particules de démarrer la particule avec une orientation et un taux de rotation spécifiés. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "rotation": {
                                    "description": "Spécifie la rotation initiale de la particule en degrés. \nType: `Molang`",
                                    "default": 0,
                                    "oneOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "string"
                                        }
                                    ]
                                },
                                "rotation_rate": {
                                    "description": "Spécifie le taux de rotation de la particule en degrés par seconde. \nType: `Molang`",
                                    "default": 0,
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
                        },
                        "minecraft:particle_initialization": {
                            "description": "Ce composant indique au système de particules de démarrer la particule avec une expression de rendu spécifiée. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "per_update_expression": {
                                    "description": "L'expression de rendu de la particule. \nType: `Molang`",
                                    "oneOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "string"
                                        }
                                    ]
                                },
                                "per_render_expression": {
                                    "description": "L'expression de rendu de la particule. \nType: `Molang`",
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
                        },
                        "minecraft:particle_kill_plane": {
                            "description": "Les particules qui traversent ce plan expirent. Le plan est relatif à l'émetteur, mais orienté dans l'espace mondial. Les quatre paramètres sont les 4 éléments habituels d'une équation de plan. \nType: `Number[4]`",
                            "type": "array",
                            "minItems": 4,
                            "maxItems": 4,
                            "items": {
                                "type": "number"
                            }
                        },
                        "minecraft:particle_lifetime_events": {
                            "description": "Ce composant permet de déclencher des événements en fonction de divers événements de durée de vie. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "creation_event": {
                                    "description": "L'événement de création de la particule. \nType: `String | String[]`",
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
                                },
                                "expiration_event": {
                                    "description": "L'événement d'expiration de la particule. \nType: `String | String[]`",
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
                                },
                                "timeline": {
                                    "description": "Série de temps, par exemple 0.0 ou 1.0, qui déclenche l'événement. \nType: `String | String[]`",
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
                            }
                        },
                        "minecraft:particle_lifetime_expression": {
                            "description": "Composant de durée de vie standard. Ces expressions contrôlent la durée de vie de la particule. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "expiration_expression": {
                                    "description": "L'expression d'expiration de la particule. \nType: `Molang`",
                                    "default": 0,
                                    "oneOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "string"
                                        }
                                    ]
                                },
                                "max_lifetime": {
                                    "description": "La durée de vie maximale de la particule. \nType: `Molang`",
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
                        },
                        "minecraft:particle_motion_collision": {
                            "description": "Ce composant permet les collisions entre le terrain et la particule. La détection de collision dans Minecraft consiste à détecter une intersection, à se déplacer vers un point non intersectant à proximité pour la particule (si possible) et à définir sa direction pour ne pas être dirigée vers la collision (généralement perpendiculaire à la surface de collision). \nType: `Object`",
                            "type": "object",
                            "required": ["collision_radius"],
                            "properties": {
                                "enabled": {
                                    "description": "Activer les collisions. \nType: `Molang`",
                                    "oneOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "boolean"
                                        }
                                    ]
                                },
                                "collision_radius": {
                                    "description": "Utilisé pour minimiser l'interpénétration des particules avec l'environnement. Notez que cela doit être inférieur ou égal à 1/2 bloc. \nType: `Number`",
                                    "type": "number",
                                    "minimum": 0.0,
                                    "maximum": 0.5
                                },
                                "collision_drag": {
                                    "description": "Modifie la vitesse de la particule lorsqu'elle a collisionné. Utile pour émuler la friction/traînée lors de la collision, par exemple une particule qui frappe le sol ralentirait jusqu'à s'arrêter. Cette traînée ralentit la particule de cette quantité en blocs/sec lorsqu'elle est en contact. \nType: `Number`",
                                    "type": "number"
                                },
                                "coefficient_of_restitution": {
                                    "description": "Coefficient de restitution de la particule. Utilisé pour déterminer la vitesse de la particule après la collision. 1.0 signifie que la particule rebondit à la même vitesse, 0.0 signifie qu'elle s'arrête. \nType: `Number`",
                                    "type": "number"
                                },
                                "expire_on_contact": {
                                    "description": "Expire la particule lorsqu'elle entre en collision avec un bloc. \nType: `Boolean`",
                                    "type": "boolean"
                                },
                                "events": {
                                    "description": "Déclenche un événement lorsqu'une collision se produit. \nType: `Object | Object[]`",
                                    "oneOf": [
                                        {
                                            "type": "object",
                                            "required": ["event"],
                                            "properties": {
                                                "event": {
                                                    "description": "L'événement à déclencher. \nType: `String`",
                                                    "type": "string"
                                                },
                                                "min_speed": {
                                                    "description": "Vitesse minimale pour déclencher l'événement. \nType: `Number`",
                                                    "default": 2,
                                                    "type": "number"
                                                }
                                            }
                                        },
                                        {
                                            "type": "array",
                                            "items": {
                                                "type": "object",
                                                "required": ["event"],
                                                "properties": {
                                                    "event": {
                                                        "description": "L'événement à déclencher. \nType: `String`",
                                                        "type": "string"
                                                    },
                                                    "min_speed": {
                                                        "description": "Vitesse minimale pour déclencher l'événement. \nType: `Number`",
                                                        "default": 2,
                                                        "type": "number"
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        "minecraft:particle_motion_dynamic": {
                            "description": "Ce composant spécifie les propriétés dynamiques de la particule, d'un point de vue de la simulation, quelles forces agissent sur la particule? Ces dynamiques modifient la vélocité de la particule, qui est une combinaison de la direction de la particule et de la vitesse. La direction de la particule sera toujours dans la direction de la vélocité de la particule. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "linear_acceleration": {
                                    "description": "L'accélération linéaire appliquée à la particule, Les unités sont des blocs/sec/sec. \nType: `Molang[3]`",
                                    "default": [0, 0, 0],
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "oneOf": [
                                            {
                                                "type": "number"
                                            },
                                            {
                                                "type": "string"
                                            }
                                        ]
                                    }
                                },
                                "linear_drag_coefficient": {
                                    "description": "Le coefficient de traînée linéaire appliqué à la particule. \nType: `Molang`",
                                    "default": 0,
                                    "oneOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "string"
                                        }
                                    ]
                                },
                                "rotation_acceleration": {
                                    "description": "L'accélération de rotation appliquée à la particule, Les unités sont des degrés/sec/sec. \nType: `Molang`",
                                    "default": 0,
                                    "oneOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "string"
                                        }
                                    ]
                                },
                                "rotation_drag_coefficient": {
                                    "description": "Le coefficient de traînée de rotation appliqué à la particule. L'équation est rotation_acceleration += -rotation_rate*rotation_drag_coefficient. Utile pour ralentir une rotation, ou pour limiter l'accélération de rotation. Pensez à un disque qui accélère (accélération) mais atteint une vitesse terminale (traînée). Un autre usage est si vous avez une particule qui grandit en taille, avoir la rotation ralentir en raison de la traînée peut ajouter du \"poids\" au mouvement de la particule. \nType: `Molang`",
                                    "default": 0,
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
                        },
                        "minecraft:particle_motion_parametric": {
                            "description": "Ce composant controle directement la particule. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "relative_position": {
                                    "description": "Définir directement la position relative à l'émetteur. \nType: `Molang[3]`",
                                    "default": [0, 0, 0],
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "oneOf": [
                                            {
                                                "type": "number"
                                            },
                                            {
                                                "type": "string"
                                            }
                                        ]
                                    }
                                },
                                "direction": {
                                    "description": "Définir directement la direction 3D de la particule. \nType: `Molang[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "oneOf": [
                                            {
                                                "type": "number"
                                            },
                                            {
                                                "type": "string"
                                            }
                                        ]
                                    }
                                },
                                "rotation": {
                                    "description": "Définir directement la rotation de la particule. \nType: `Molang`",
                                    "default": 0,
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
                        }
                    }
                },
                "curves": {
                    "description": "Les courbes de particules sont des courbes de particules qui peuvent être utilisées pour définir des propriétés de particules qui changent au fil du temps. \nType: `Object`",
                    "oneOf": [
                        {
                            "type": "object",
                            "required": ["type", "nodes", "input"],
                            "properties": {
                                "type": {
                                    "description": "Le type de courbe de particules. \nType: `String` \n`linear`: une série de nœuds, également espacés entre 0 et 1 après l'application de l'entrée/plage horizontale. \n`bezier`: une spline de bezier à 4 nœuds, le premier et le dernier point étant les valeurs à 0 et 1 et les deux points du milieu formant les lignes de pente à 0,33 pour le premier point et 0,66 pour le second. \n`catmull_rom`: une série de courbes qui passent par tous les nœuds sauf le dernier/premier. Les premiers/derniers nœuds sont utilisés pour former la pente des deuxièmes/deuxièmes derniers points respectivement. Tous les points sont également espacés. \n`bezier_chain`: une chaîne de splines de bezier. Une série de points est spécifiée avec leurs pentes correspondantes, et chaque segment utilise sa paire de points et de pentes pour former une spline de bezier. Chaque point, à l'exception du premier/dernier, est partagé entre sa paire de segments de spline.",
                                    "type": "string",
                                    "enum": ["linear", "bezier", "bezier_chain", "catmull_rom"]
                                },
                                "nodes": {
                                    "description": "Les nœuds sonnt les nœuds de contrôle pour la courbe. Ils sont supposés être également espacés; cette notation ne fonctionne que pour les courbes linéaires, de bezier et de catmull_rom. \nType: `Number[]`",
                                    "oneOf": [
                                        {
                                            "type": "array",
                                            "minItems": 3,
                                            "maxItems": 3,
                                            "items": {
                                                "oneOf": [
                                                    {
                                                        "type": "number"
                                                    },
                                                    {
                                                        "type": "string"
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            "type": "object",
                                            "propertyNames": {
                                                "pattern": "^[0-9]+(\\.[0-9]+)?$"
                                            },
                                            "additionalProperties": {
                                                "type": "object",
                                                "properties": {
                                                    "value": {
                                                        "description": "La valeur de la courbe à ce point. \nType: `Molang`",
                                                        "oneOf": [
                                                            {
                                                                "type": "number"
                                                            },
                                                            {
                                                                "type": "string"
                                                            }
                                                        ]
                                                    },
                                                    "left_value": {
                                                        "description": "La valeur de la courbe à ce point. \nType: `Molang`",
                                                        "oneOf": [
                                                            {
                                                                "type": "number"
                                                            },
                                                            {
                                                                "type": "string"
                                                            }
                                                        ]
                                                    },
                                                    "right_value": {
                                                        "description": "La valeur de la courbe à ce point. \nType: `Molang`",
                                                        "oneOf": [
                                                            {
                                                                "type": "number"
                                                            },
                                                            {
                                                                "type": "string"
                                                            }
                                                        ]
                                                    },
                                                    "slope": {
                                                        "description": "La pente de la courbe à ce point. \nType: `Molang`",
                                                        "oneOf": [
                                                            {
                                                                "type": "number"
                                                            },
                                                            {
                                                                "type": "string"
                                                            }
                                                        ]
                                                    },
                                                    "left_slope": {
                                                        "description": "La pente de la courbe à ce point. \nType: `Molang`",
                                                        "oneOf": [
                                                            {
                                                                "type": "number"
                                                            },
                                                            {
                                                                "type": "string"
                                                            }
                                                        ]
                                                    },
                                                    "right_slope": {
                                                        "description": "La pente de la courbe à ce point. \nType: `Molang`",
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
                                            }
                                        }
                                    ]
                                },
                                "input": {
                                    "description": "L'entrée de la courbe. \nType: `Molang`",
                                    "oneOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "string"
                                        }
                                    ]
                                },
                                "horizontal_range": {
                                    "description": "La plage horizontale de la courbe. \nType: `Number`",
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
                        },
                        {
                            "type": "object",
                            "required": ["type", "nodes", "input"],
                            "properties": {
                                "type": {
                                    "description": "Le type de courbe de particules. \nType: `String` \n`linear`: une série de nœuds, également espacés entre 0 et 1 après l'application de l'entrée/plage horizontale. \n`bezier`:",
                                    "type": "string",
                                    "pattern": "^bezier_chain$"
                                },
                                "nodes": {
                                    "description": "Les nœuds sonnt les nœuds de contrôle pour la courbe. Ils sont supposés être également espacés; cette notation ne fonctionne que pour les courbes linéaires, de bezier et de catmull_rom. \nType: `Number[]`",
                                    "oneOf": [
                                        {
                                            "type": "array",
                                            "minItems": 3,
                                            "maxItems": 3,
                                            "items": {
                                                "oneOf": [
                                                    {
                                                        "type": "number"
                                                    },
                                                    {
                                                        "type": "string"
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            "type": "object",
                                            "propertyNames": {
                                                "pattern": "^[0-9]+(\\.[0-9]+)?$"
                                            },
                                            "additionalProperties": {
                                                "type": "object",
                                                "properties": {
                                                    "value": {
                                                        "description": "La valeur de la courbe à ce point. \nType: `Molang`",
                                                        "oneOf": [
                                                            {
                                                                "type": "number"
                                                            },
                                                            {
                                                                "type": "string"
                                                            }
                                                        ]
                                                    },
                                                    "left_value": {
                                                        "description": "La valeur de la courbe à ce point. \nType: `Molang`",
                                                        "oneOf": [
                                                            {
                                                                "type": "number"
                                                            },
                                                            {
                                                                "type": "string"
                                                            }
                                                        ]
                                                    },
                                                    "right_value": {
                                                        "description": "La valeur de la courbe à ce point. \nType: `Molang`",
                                                        "oneOf": [
                                                            {
                                                                "type": "number"
                                                            },
                                                            {
                                                                "type": "string"
                                                            }
                                                        ]
                                                    },
                                                    "slope": {
                                                        "description": "La pente de la courbe à ce point. \nType: `Molang`",
                                                        "oneOf": [
                                                            {
                                                                "type": "number"
                                                            },
                                                            {
                                                                "type": "string"
                                                            }
                                                        ]
                                                    },
                                                    "left_slope": {
                                                        "description": "La pente de la courbe à ce point. \nType: `Molang`",
                                                        "oneOf": [
                                                            {
                                                                "type": "number"
                                                            },
                                                            {
                                                                "type": "string"
                                                            }
                                                        ]
                                                    },
                                                    "right_slope": {
                                                        "description": "La pente de la courbe à ce point. \nType: `Molang`",
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
                                            }
                                        }
                                    ]
                                },
                                "input": {
                                    "description": "L'entrée de la courbe. \nType: `Molang`",
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
                        }
                    ]
                },
                "events": {
                    "description": "Les événements de particules sont des événements qui peuvent être déclenchés par des particules. \nType: `Object`",
                    "type": "object",
                    "additionalProperties": {
                        "type": "object",
                        "properties": {
                            "expression": {
                                "description": "Execute cette expression Molang sur l'émetteur d'événements. \nType: `Molang`",
                                "oneOf": [
                                    {
                                        "type": "number"
                                    },
                                    {
                                        "type": "string"
                                    }
                                ]
                            },
                            "log": {
                                "description": "Pour le débogage, cela enregistrera un message, avec le nom de l'effet de tir et la position de l'événement. Le message de journal s'affichera dans le journal de contenu. \nType: `String`",
                                "type": "string"
                            },
                            "particle_effect": {
                                "description": "Déclenche un effet de particules. \nType: `Object`",
                                "type": "object",
                                "required": ["effect", "type"],
                                "properties": {
                                    "effect": {
                                        "description": "L'identifiant de l'effet de particules à déclencher. \nType: `String`",
                                        "type": "string"
                                    },
                                    "pre_effect_expression": {
                                        "description": "Execute cette expression Molang avant de déclencher l'effet de particules. \nType: `Molang`",
                                        "oneOf": [
                                            {
                                                "type": "number"
                                            },
                                            {
                                                "type": "string"
                                            }
                                        ]
                                    },
                                    "type": {
                                        "description": "Le type de déclenchement de l'effet de particules. \nType: `String`",
                                        "type": "string",
                                        "enum": ["particle", "particle_with_velocity", "emitter", "emitter_bound"]
                                    }
                                }
                            },
                            "sound_effect": {
                                "description": "Déclenche un effet sonore. \nType: `Object`",
                                "type": "object",
                                "required": ["event_name"],
                                "properties": {
                                    "event_name": {
                                        "description": "Le nom de l'événement sonore à déclencher. \nType: `String`",
                                        "type": "string"
                                    }
                                }
                            },
                            "randomize": {
                                "description": "Déclenche un événement aléatoire. \nType: `Object[]`",
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "required": ["weight"],
                                    "properties": {
                                        "log": {
                                            "description": "Pour le débogage, cela enregistrera un message, avec le nom de l'effet de tir et la position de l'événement. Le message de journal s'affichera dans le journal de contenu. \nType: `String`",
                                            "type": "string"
                                        },
                                        "particle_effect": {
                                            "description": "Déclenche un effet de particules. \nType: `Object`",
                                            "type": "object",
                                            "required": ["effect", "type"],
                                            "properties": {
                                                "effect": {
                                                    "description": "L'identifiant de l'effet de particules à déclencher. \nType: `String`",
                                                    "type": "string"
                                                },
                                                "pre_effect_expression": {
                                                    "description": "Execute cette expression Molang avant de déclencher l'effet de particules. \nType: `Molang`",
                                                    "oneOf": [
                                                        {
                                                            "type": "number"
                                                        },
                                                        {
                                                            "type": "string"
                                                        }
                                                    ]
                                                },
                                                "type": {
                                                    "description": "Le type de déclenchement de l'effet de particules. \nType: `String`",
                                                    "type": "string",
                                                    "enum": ["particle", "particle_with_velocity", "emitter", "emitter_bound"]
                                                }
                                            }
                                        },
                                        "weight": {
                                            "description": "Le poids de cet événement. \nType: `Number`",
                                            "type": "number"
                                        },
                                        "sound_effect": {
                                            "description": "Déclenche un effet sonore. \nType: `Object`",
                                            "type": "object",
                                            "required": ["event_name"],
                                            "properties": {
                                                "event_name": {
                                                    "description": "Le nom de l'événement sonore à déclencher. \nType: `String`",
                                                    "type": "string"
                                                }
                                            }
                                        },
                                        "sequence": {
                                            "description": "Déclenche une séquence d'événements. \nType: `Object[]`",
                                            "type": "array",
                                            "items": {
                                                "$ref": "#/properties/particle_effect/properties/events/additionalProperties/properties/randomize/items"
                                            }
                                        },
                                        "randomize": {
                                            "description": "Déclenche un événement aléatoire. \nType: `Object[]`",
                                            "type": "array",
                                            "items": {
                                                "$ref": "#/properties/particle_effect/properties/events/additionalProperties/properties/randomize/items"
                                            }
                                        },
                                        "expression": {
                                            "description": "Execute cette expression Molang sur l'émetteur d'événements. \nType: `Molang`",
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
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

export const particleEffectSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/particles/**/*.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};