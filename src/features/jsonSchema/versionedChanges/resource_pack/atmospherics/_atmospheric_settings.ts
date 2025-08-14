import { SchemaType } from "../../../../../types/schema";
import { dynamicExamplesSourceKeys } from "../../../shared/schemaEnums";
import { schemaPatterns } from "../../../shared/schemaPatterns";

const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Ce fichier sert à définir les paramètres d'Atmosphères qui contrôlent tout ce qui touche à l'apparence du ciel et de la brume dans Minecraft Bedrock. \nType: `Object`",
    "type": "object",
    "required": ["format_version", "minecraft:atmosphere_settings"],
    "properties": {
        "format_version": {
            "description": "La version du format à utiliser. \nType: `String`",
            "type": "string",
            enum: ["1.21.40"]
        },
        "minecraft:atmosphere_settings": {
            "description": "Contient toute la définition des paramètres d'Atmosphères. \nType: `Object`",
            "type": "object",
            "required": ["description"],
            "properties": {
                "description": {
                    "description": "Contient les propriétés de description des paramètres d'atmosphères. \nType: `Object`",
                    "type": "object",
                    "required": ["identifier"],
                    "properties": {
                        "identifier": {
                            "description": "L'identifiant unique de ces paramètres d'atmosphères. \nType: `String`",
                            "type": "string",
                            "pattern": schemaPatterns.identifier_with_namespace,
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_atmosphere_settings_ids
                        }
                    }
                },
                "horizon_blend_stops": {
                    "description": "Définit la manière dont l'atmosphère se dégrade verticalement, du sol jusqu'au zénith. \nType: `Object`",
                    "type": "object",
                    "properties": {
                        "min": {
                            "description": "Hauteur minimale (relative) où l'atmosphère commence au-dessus de l'horizon. Peut être une valeur fixe ou keyframée (0.0-1.0). \nType: `Number | Object`",
                            "oneOf": [
                                {
                                    "type": "number",
                                    "minimum": 0,
                                    "maximum": 1
                                },
                                {
                                    "type": "object",
                                    "patternProperties": {
                                        "^[0-1](\\.\\d+)?$": {
                                            "type": "number",
                                            "minimum": 0,
                                            "maximum": 1
                                        }
                                    }
                                }
                            ]
                        },
                        "start": {
                            "description": "Hauteur (relative) à partir de laquelle la couleur du zénith domine l'atmosphère. Peut être fixe ou keyframée (0.0-1.0). \nType: `Number | Object`",
                            "oneOf": [
                                {
                                    "type": "number",
                                    "minimum": 0,
                                    "maximum": 1
                                },
                                {
                                    "type": "object",
                                    "patternProperties": {
                                        "^[0-1](\\.\\d+)?$": {
                                            "type": "number",
                                            "minimum": 0,
                                            "maximum": 1
                                        }
                                    }
                                }
                            ]
                        },
                        "mie_start": {
                            "description": "Hauteur (relative) où commence la diffusion Mie (brume/halo) dans l'atmosphère. Peut être fixe ou keyframée (0.0-1.0). \nType: `Number | Object`",
                            "oneOf": [
                                {
                                    "type": "number",
                                    "minimum": 0,
                                    "maximum": 1
                                },
                                {
                                    "type": "object",
                                    "patternProperties": {
                                        "^[0-1](\\.\\d+)?$": {
                                            "type": "number",
                                            "minimum": 0,
                                            "maximum": 1
                                        }
                                    }
                                }
                            ]
                        },
                        "max": {
                            "description": "Hauteur maximale (relative) de l'atmosphère avant l'espace. Peut être fixe ou keyframée (0.0-1.0). \nType: `Number | Object`",
                            "oneOf": [
                                {
                                    "type": "number",
                                    "minimum": 0,
                                    "maximum": 1
                                },
                                {
                                    "type": "object",
                                    "patternProperties": {
                                        "^[0-1](\\.\\d+)?$": {
                                            "type": "number",
                                            "minimum": 0,
                                            "maximum": 1
                                        }
                                    }
                                }
                            ]
                        }
                    }
                },
                "rayleigh_strength": {
                    "description": "Contrôle la force de la diffusion Rayleigh dans l'atmosphère. Plus la valeur est élevée, plus le ciel apparaîtra bleu et lumineux (comme un vrai ciel clair en journée). Vous pouvez définir un nombre fixe ou varier cette valeur au fil du cycle jour/nuit avec des keyframes. \nType: `Number | Object`",
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
                "sun_mie_strength": {
                    "description": "Détermine l'intensité de la diffusion Mie autour du soleil. Une valeur élevée crée un halo ou un voile lumineux plus épais quand le soleil est bas à l'horizon (coucher/lever). Peut être un nombre fixe ou keyframé pour des variations selon l'heure. \nType: `Number | Object`",
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
                "moon_mie_strength": {
                    "description": "Gère la diffusion Mie autour de la lune. En cas de forte valeur, la lune aura un halo brillant visible dans la nuit. Peut être défini comme une valeur unique ou animée par des keyframes pour simuler des nuits brumeuses. \nType: `Number | Object`",
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
                "sun_glare_shape": {
                    "description": "Ajuste la forme et l'étendue de l'éblouissement solaire. Une valeur faible donne un éclat serré et intense, une valeur élevée produit un halo large et doux lorsque vous regardez vers le soleil. Peut être fixe ou varier au fil du temps avec des keyframes. \nType: `Number | Object`",
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
                "sky_zenith_color": {
                    "description": "Couleur du ciel directement au zénith (au-dessus de votre tête). Vous pouvez indiquer soit un tableau RGB (trois entiers 0-255) pour une couleur fixe, soit un objet de keyframes (clé : moment du cycle entre 0.0 et 1.0) pour faire évoluer cette couleur au fil de la journée. \nType: `String | Number[3] | Object`",
                    "oneOf": [
                        {
                            "type": "string",
                            "pattern": "^#[0-9a-fA-F]{6}$"
                        },
                        {
                            "type": "array",
                            "minItems": 3,
                            "maxItems": 3,
                            "items": {
                                "type": "integer",
                                "minimum": 0,
                                "maximum": 255
                            }
                        },
                        {
                            "type": "object",
                            "patternProperties": {
                                "^[0-1](\\.\\d+)?$": {
                                    "oneOf": [
                                        {
                                            "type": "string",
                                            "pattern": "^#[0-9a-fA-F]{6}$"
                                        },
                                        {
                                            "type": "array",
                                            "minItems": 3,
                                            "maxItems": 3,
                                            "items": {
                                                "type": "integer",
                                                "minimum": 0,
                                                "maximum": 255
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                },
                "sky_horizon_color": {
                    "description": "Couleur du ciel à l'horizon (là où le ciel rejoint le sol). Utilisez un tableau RGB pour une couleur unique, ou un objet de keyframes pour animer ce ton en fonction de l'heure (coucher de soleil, crépuscule, etc.). \nType: `String | Number[3] | Object`",
                    "oneOf": [
                        {
                            "type": "string",
                            "pattern": "^#[0-9a-fA-F]{6}$"
                        },
                        {
                            "type": "array",
                            "minItems": 3,
                            "maxItems": 3,
                            "items": {
                                "type": "integer",
                                "minimum": 0,
                                "maximum": 255
                            }
                        },
                        {
                            "type": "object",
                            "patternProperties": {
                                "^[0-1](\\.\\d+)?$": {
                                    "oneOf": [
                                        {
                                            "type": "string",
                                            "pattern": "^#[0-9a-fA-F]{6}$"
                                        },
                                        {
                                            "type": "array",
                                            "minItems": 3,
                                            "maxItems": 3,
                                            "items": {
                                                "type": "integer",
                                                "minimum": 0,
                                                "maximum": 255
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
};

export const atmosphericSettingsSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/atmospherics/*.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};