import { SchemaChange, SchemaType } from "../../../../../types/schema";
import { dynamicExamplesSourceKeys } from "../../../shared/schemaEnums";
import { schemaPatterns } from "../../../shared/schemaPatterns";

const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Décrit les paramètres de lumière directionnelle, ambiante et émissive utilisés pour personnaliser l'apparence du ciel, du soleil, de la lune et de l'éclairage général dans Minecraft. Ces réglages influencent la couleur, l'intensité et l'ambiance lumineuse tout au long du cycle jour/nuit. \nType: `Object`",
    "type": "object",
    "required": ["format_version", "minecraft:lighting_settings"],
    "properties": {
        "format_version": {
            "description": "La version du format à utiliser. \nType: `String`",
            "type": "string",
            enum: [
                "1.21.40", "1.21.60", "1.21.70", "1.21.80"
            ]
        },
        "minecraft:lighting_settings": {
            "description": "Contient toute la définition des paramètres de lumière. \nType: `Object`",
            "type": "object",
            "required": ["description"],
            "properties": {
                "description": {
                    "description": "Contient les propriétés de description des paramètres de lumière. \nType: `Object`",
                    "type": "object",
                    "required": ["identifier"],
                    "properties": {
                        "identifier": {
                            "description": "L'identifiant unique de ces paramètres de lumière. \nType: `String`",
                            "type": "string",
                            pattern: schemaPatterns.identifier_with_namespace,
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_lighting_settings_ids
                        }
                    }
                },
                "directional_lights": {
                    "description": "Contient les paramètres de lumière directionnelle provenant du soleil et de la lune. Ces lumières influencent la direction, la couleur et l'intensité de l'éclairage global, et varient selon l'heure du jour pour simuler le cycle jour/nuit. \nType: `Object`",
                    "type": "object",
                    "properties": {
                        "sun": {
                            "description": "Définit la lumière directionnelle émise par le soleil. Permet de contrôler sa couleur et son intensité lumineuse (illuminance) au fil du temps pour simuler différentes ambiances durant la journée. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "illuminance": {
                                    "description": "Définit l'intensité lumineuse (en lux) émise par la source lumineuse (comme le soleil ou la lune). Cette valeur peut être un nombre unique (fixe tout au long du cycle jour/nuit), ou un objet de paires clé-valeur représentant des keyframes. \nType: `Number | Object` \nNote: 0.0 représente midi, 0.25 le coucher du soleil, 0.5 minuit, 0.75 le lever du soleil, et 1.0 midi à nouveau.",
                                    "oneOf": [
                                        {
                                            "type": "number",
                                            "minimum": 0
                                        },
                                        {
                                            "type": "object",
                                            "patternProperties": {
                                                "^[0-1](\\.\\d+)?$": {
                                                    "type": "number",
                                                    "minimum": 0
                                                }
                                            }
                                        }
                                    ]
                                },
                                "color": {
                                    "description": "Définit la couleur de la lumière émise par la source lumineuse. Cette valeur peut être un tableau de quatre entiers (R, G, B, A) représentant la couleur en RGBA, ou un objet de paires clé-valeur représentant des keyframes. \nType: `Number{4] | Object` \nNote: Les valeurs R, G et B doivent être comprises entre 0 et 255, et A entre 0 et 255.",
                                    "oneOf": [
                                        {
                                            "type": "array",
                                            "items": {
                                                "type": "integer",
                                                "minimum": 0,
                                                "maximum": 255
                                            },
                                            "minItems": 4,
                                            "maxItems": 4
                                        },
                                        {
                                            "type": "object",
                                            "patternProperties": {
                                                "^[0-1](\\.\\d+)?$": {
                                                    "oneOf": [
                                                        {
                                                            "type": "array",
                                                            "items": {
                                                                "type": "integer",
                                                                "minimum": 0,
                                                                "maximum": 255
                                                            },
                                                            "minItems": 4,
                                                            "maxItems": 4
                                                        },
                                                        {
                                                            "type": "string",
                                                            "pattern": "^#[0-9a-fA-F]{8}$"
                                                        }
                                                    ]
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        "moon": {
                            "description": "Définit la lumière directionnelle émise par la lune. Permet de contrôler sa couleur, son intensité lumineuse (illuminance) au fil du temps pour simuler différentes ambiances nocturnes.\nType: `Object`",
                            "type": "object",
                            "properties": {
                                "illuminance": {
                                    "description": "Définit l'intensité lumineuse (en lux) émise par la lune. Cette valeur peut être un nombre unique (fixe tout au long du cycle jour/nuit), ou un objet de paires clé-valeur représentant des keyframes. \nType: `Number | Object` \nNote: 0.0 représente minuit, 0.5 le milieu de la nuit, et 1.0 minuit à nouveau.",
                                    "oneOf": [
                                        {
                                            "type": "number",
                                            "minimum": 0
                                        },
                                        {
                                            "type": "object",
                                            "patternProperties": {
                                                "^[0-1](\\.\\d+)?$": {
                                                    "type": "number",
                                                    "minimum": 0
                                                }
                                            }
                                        }
                                    ]
                                },
                                "color": {
                                    "description": "Définit la couleur de la lumière émise par la lune. Cette valeur peut être un tableau de quatre entiers (R, G, B, A) représentant la couleur en RGBA, ou un objet de paires clé-valeur représentant des keyframes. \nType: `Number{4] | Object` \nNote: Les valeurs R, G et B doivent être comprises entre 0 et 255, et A entre 0 et 255.",
                                    "oneOf": [
                                        {
                                            "type": "array",
                                            "items": {
                                                "type": "integer",
                                                "minimum": 0,
                                                "maximum": 255
                                            },
                                            "minItems": 4,
                                            "maxItems": 4
                                        },
                                        {
                                            "type": "object",
                                            "patternProperties": {
                                                "^[0-1](\\.\\d+)?$": {
                                                    "oneOf": [
                                                        {
                                                            "type": "array",
                                                            "items": {
                                                                "type": "integer",
                                                                "minimum": 0,
                                                                "maximum": 255
                                                            },
                                                            "minItems": 4,
                                                            "maxItems": 4
                                                        },
                                                        {
                                                            "type": "string",
                                                            "pattern": "^#[0-9a-fA-F]{8}$"
                                                        }
                                                    ]
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        "orbital_offset_degrees": {
                            "description": "Définit l'inclinaison orbitale du soleil et/ou de la lune en degrés. Cette valeur modifie l'angle d'apparition des ombres et peut être utilisée pour ajuster la position perçue de la source lumineuse dans le ciel. \nType: `Number | Object`",
                            "oneOf": [
                                {
                                    "type": "number",
                                    "minimum": 0,
                                    "exclusiveMaximum": 360
                                },
                                {
                                    "type": "object",
                                    "patternProperties": {
                                        "^[0-1](\\.\\d+)?$": {
                                            "type": "number",
                                            "minimum": 0,
                                            "exclusiveMaximum": 360
                                        }
                                    }
                                }
                            ]
                        }
                    }
                },
                "emissive": {
                    "description": "Contrôle le comportement de la lumière émise par les matériaux auto-éclairés (emissive). Permet d'ajuster le niveau de désaturation des couleurs avant qu'elles ne soient utilisées dans le calcul de la lumière émise. \nType: `Object`",
                    "type": "object",
                    "properties": {
                        "desaturation": {
                            "description": "Définit le niveau de désaturation appliqué à la couleur albédo lors du calcul de la lumière émise. Une valeur de 0 conserve les couleurs d'origine, tandis qu'une valeur de 1 applique une désaturation complète (niveaux de gris).\nType: `Number`",
                            "type": "number",
                            "minimum": 0,
                            "maximum": 1
                        }
                    }
                },
                "ambient": {
                    "description": "Contrôle la lumière ambiante globale dans la scène. Cela représente une source de lumière diffuse présente partout, même en l'absence de sources directes (soleil, lune, torches, etc.). Elle permet d'éviter que certaines zones soient complètement noires. \nType: `Object`",
                    "type": "object",
                    "properties": {
                        "illuminance": {
                            "description": "Définit l'intensité de la lumière ambiante en lux. Plus la valeur est élevée, plus l'environnement sera éclairé uniformément. \nType: `Number`",
                            "type": "number",
                            "minimum": 0
                        },
                        "color": {
                            "description": "Définit la couleur de la lumière ambiante. Cette valeur peut être une chaîne de caractères représentant une couleur hexadécimale (par exemple, `#888888`), ou un tableau de trois entiers (R, G, B) représentant la couleur en RGB. \nType: `String | Number[3]` \nNote: Les valeurs R, G et B doivent être comprises entre 0 et 255",
                            "oneOf": [
                                {
                                    "type": "string",
                                    "pattern": "^#[0-9a-fA-F]{6}$"
                                },
                                {
                                    "type": "array",
                                    "items": {
                                        "type": "integer",
                                        "minimum": 0,
                                        "maximum": 255
                                    },
                                    "minItems": 3,
                                    "maxItems": 3
                                }
                            ]
                        }
                    }
                }
            }
        }
    }
};

const versionedChanges: SchemaChange[] = [
    {
        version: "1.21.60",
        changes: [
            {
                action: "modify",
                target: ["properties", "minecraft:lighting_settings", "properties", "directional_lights", "properties", "sun", "properties", "color"],
                value: {
                    "description": "Définit la couleur de la lumière émise par la source lumineuse. Cette valeur peut être un tableau de trois entiers (R, G, B) représentant la couleur en RGB, ou un objet de paires clé-valeur représentant des keyframes. \nType: `Number{3] | Object` \nNote: Les valeurs R, G et B doivent être comprises entre 0 et 255.",
                    "oneOf": [
                        {
                            "type": "array",
                            "items": {
                                "type": "integer",
                                "minimum": 0,
                                "maximum": 255
                            },
                            "minItems": 3,
                            "maxItems": 3
                        },
                        {
                            "type": "object",
                            "patternProperties": {
                                "^[0-1](\\.\\d+)?$": {
                                    "oneOf": [
                                        {
                                            "type": "array",
                                            "items": {
                                                "type": "integer",
                                                "minimum": 0,
                                                "maximum": 255
                                            },
                                            "minItems": 3,
                                            "maxItems": 3
                                        },
                                        {
                                            "type": "string",
                                            "pattern": "^#[0-9a-fA-F]{6}$"
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                }
            },
            {
                action: "modify",
                target: ["properties", "minecraft:lighting_settings", "properties", "directional_lights", "properties", "moon", "properties", "color"],
                value: {
                    "description": "Définit la couleur de la lumière émise par la lune. Cette valeur peut être un tableau de quatre entiers (R, G, B) représentant la couleur en RGB, ou un objet de paires clé-valeur représentant des keyframes. \nType: `Number{3] | Object` \nNote: Les valeurs R, G et B doivent être comprises entre 0 et 255.",
                    "oneOf": [
                        {
                            "type": "array",
                            "items": {
                                "type": "integer",
                                "minimum": 0,
                                "maximum": 255
                            },
                            "minItems": 3,
                            "maxItems": 3
                        },
                        {
                            "type": "object",
                            "patternProperties": {
                                "^[0-1](\\.\\d+)?$": {
                                    "oneOf": [
                                        {
                                            "type": "array",
                                            "items": {
                                                "type": "integer",
                                                "minimum": 0,
                                                "maximum": 255
                                            },
                                            "minItems": 3,
                                            "maxItems": 3
                                        },
                                        {
                                            "type": "string",
                                            "pattern": "^#[0-9a-fA-F]{6}$"
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                }
            }
        ]
    },
    {
        version: "1.21.70",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:lighting_settings", "properties", "sky"],
                value: {
                    "description": "Contrôle l'intensité lumineuse émise par le ciel lui-même. Cette valeur agit comme un multiplicateur de l'énergie lumineuse que le ciel contribue à l'éclairage global de la scène. \nType: `Object`",
                    "type": "object",
                    "properties": {
                        "intensity": {
                            "description": "Facteur d'intensité (entre 0.1 et 1.0) qui détermine combien de lumière le ciel apporte à l'environnement. Une valeur plus faible donne un ciel plus sombre ; une valeur de 1.0 utilise la contribution maximale du ciel. \nType: `Number`",
                            "type": "number",
                            "minimum": 0.1,
                            "maximum": 1.0
                        }
                    }
                }
            }
        ]
    },
    {
        version: "1.21.80",
        changes: [
            {
                action: "modify",
                target: ["properties", "minecraft:lighting_settings", "properties", "directional_lights"],
                value: {
                    "description": "Contient les paramètres de lumière directionnelle provenant du soleil, de la lune ou même des lumières de flash dans l'End. Ces lumières influencent la direction, la couleur et l'intensité de l'éclairage global, et varient selon l'heure du jour pour simuler le cycle jour/nuit. \nType: `Object`",
                    "type": "object",
                    "properties": {
                        "orbital": {
                            "description": "Définit les paramètres de lumière directionnelle orbitale, comme le soleil et la lune. Permet de contrôler leur couleur, leur intensité lumineuse (illuminance) et leur inclinaison orbitale au fil du temps pour simuler différentes ambiances durant la journée et la nuit. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "sun": {
                                    "description": "Définit la lumière directionnelle émise par le soleil. Permet de contrôler sa couleur et son intensité lumineuse (illuminance) au fil du temps pour simuler différentes ambiances durant la journée. \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "illuminance": {
                                            "description": "Définit l'intensité lumineuse (en lux) émise par la source lumineuse (comme le soleil ou la lune). Cette valeur peut être un nombre unique (fixe tout au long du cycle jour/nuit), ou un objet de paires clé-valeur représentant des keyframes. \nType: `Number | Object` \nNote: 0.0 représente midi, 0.25 le coucher du soleil, 0.5 minuit, 0.75 le lever du soleil, et 1.0 midi à nouveau.",
                                            "oneOf": [
                                                {
                                                    "type": "number",
                                                    "minimum": 0
                                                },
                                                {
                                                    "type": "object",
                                                    "patternProperties": {
                                                        "^[0-1](\\.\\d+)?$": {
                                                            "type": "number",
                                                            "minimum": 0
                                                        }
                                                    }
                                                }
                                            ]
                                        },
                                        "color": {
                                            "description": "Définit la couleur de la lumière émise par la source lumineuse. Cette valeur peut être un tableau de trois entiers (R, G, B) représentant la couleur en RGB, ou un objet de paires clé-valeur représentant des keyframes. \nType: `Number{3] | Object` \nNote: Les valeurs R, G et B doivent être comprises entre 0 et 255.",
                                            "oneOf": [
                                                {
                                                    "type": "array",
                                                    "items": {
                                                        "type": "integer",
                                                        "minimum": 0,
                                                        "maximum": 255
                                                    },
                                                    "minItems": 3,
                                                    "maxItems": 3
                                                },
                                                {
                                                    "type": "object",
                                                    "patternProperties": {
                                                        "^[0-1](\\.\\d+)?$": {
                                                            "oneOf": [
                                                                {
                                                                    "type": "array",
                                                                    "items": {
                                                                        "type": "integer",
                                                                        "minimum": 0,
                                                                        "maximum": 255
                                                                    },
                                                                    "minItems": 3,
                                                                    "maxItems": 3
                                                                },
                                                                {
                                                                    "type": "string",
                                                                    "pattern": "^#[0-9a-fA-F]{6}$"
                                                                }
                                                            ]
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                },
                                "moon": {
                                    "description": "Définit la lumière directionnelle émise par la lune. Permet de contrôler sa couleur, son intensité lumineuse (illuminance) au fil du temps pour simuler différentes ambiances nocturnes.\nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "illuminance": {
                                            "description": "Définit l'intensité lumineuse (en lux) émise par la lune. Cette valeur peut être un nombre unique (fixe tout au long du cycle jour/nuit), ou un objet de paires clé-valeur représentant des keyframes. \nType: `Number | Object` \nNote: 0.0 représente minuit, 0.5 le milieu de la nuit, et 1.0 minuit à nouveau.",
                                            "oneOf": [
                                                {
                                                    "type": "number",
                                                    "minimum": 0
                                                },
                                                {
                                                    "type": "object",
                                                    "patternProperties": {
                                                        "^[0-1](\\.\\d+)?$": {
                                                            "type": "number",
                                                            "minimum": 0
                                                        }
                                                    }
                                                }
                                            ]
                                        },
                                        "color": {
                                            "description": "Définit la couleur de la lumière émise par la lune. Cette valeur peut être un tableau de quatre entiers (R, G, B) représentant la couleur en RGB, ou un objet de paires clé-valeur représentant des keyframes. \nType: `Number{3] | Object` \nNote: Les valeurs R, G et B doivent être comprises entre 0 et 255.",
                                            "oneOf": [
                                                {
                                                    "type": "array",
                                                    "items": {
                                                        "type": "integer",
                                                        "minimum": 0,
                                                        "maximum": 255
                                                    },
                                                    "minItems": 3,
                                                    "maxItems": 3
                                                },
                                                {
                                                    "type": "object",
                                                    "patternProperties": {
                                                        "^[0-1](\\.\\d+)?$": {
                                                            "oneOf": [
                                                                {
                                                                    "type": "array",
                                                                    "items": {
                                                                        "type": "integer",
                                                                        "minimum": 0,
                                                                        "maximum": 255
                                                                    },
                                                                    "minItems": 3,
                                                                    "maxItems": 3
                                                                },
                                                                {
                                                                    "type": "string",
                                                                    "pattern": "^#[0-9a-fA-F]{6}$"
                                                                }
                                                            ]
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                },
                                "orbital_offset_degrees": {
                                    "description": "Définit l'inclinaison orbitale du soleil et/ou de la lune en degrés. Cette valeur modifie l'angle d'apparition des ombres et peut être utilisée pour ajuster la position perçue de la source lumineuse dans le ciel. \nType: `Number | Object`",
                                    "oneOf": [
                                        {
                                            "type": "number",
                                            "minimum": 0,
                                            "exclusiveMaximum": 360
                                        },
                                        {
                                            "type": "object",
                                            "patternProperties": {
                                                "^[0-1](\\.\\d+)?$": {
                                                    "type": "number",
                                                    "minimum": 0,
                                                    "exclusiveMaximum": 360
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        "flash": {
                            "description": "Définit les paramètres de lumière directionnelle émise par des flashs, comme ceux utilisés dans l'End. Permet de contrôler leur couleur et leur intensité lumineuse (illuminance). \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "illuminance": {
                                    "description": "Définit l'intensité lumineuse (en lux) émise par le flash. \nType: `Number`",
                                    "type": "number",
                                    "minimum": 0
                                },
                                "color": {
                                    "description": "Définit la couleur de la lumière émise par le flash. Cette valeur peut être une chaîne de caractères représentant une couleur hexadécimale (par exemple, `#ffffff`), ou un tableau de trois entiers (R, G, B) représentant la couleur en RGB. \nType: `String | Number[3]` \nNote: Les valeurs R, G et B doivent être comprises entre 0 et 255.",
                                    "oneOf": [
                                        {
                                            "type": "string",
                                            "pattern": "^#[0-9a-fA-F]{6}$"
                                        },
                                        {
                                            "type": "array",
                                            "items": {
                                                "type": "integer",
                                                "minimum": 0,
                                                "maximum": 255
                                            },
                                            "minItems": 3,
                                            "maxItems": 3
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        ]
    }
];

export const lightingSettingsSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/lighting/*.json"],
    baseSchema: baseSchema,
    versionedChanges: versionedChanges
};