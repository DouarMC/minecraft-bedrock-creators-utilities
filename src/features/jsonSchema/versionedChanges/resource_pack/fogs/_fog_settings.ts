import { SchemaType, SchemaChange } from "../../../../../types/schema";
import { dynamicExamplesSourceKeys } from "../../../shared/schemaEnums";
import { schemaPatterns } from "../../../shared/schemaPatterns";

const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Ce fichier sert à configurer des effets de brouillard volumétrique et de rayons lumineux (light shafts). \nType: `Object`",
    "required": ["format_version", "minecraft:fog_settings"],
    "properties": {
        "format_version": {
            "description": "La version du Format à utiliser. \nType: `String`",
            "type": "string",
            enum: [
                "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
            ]
        },
        "minecraft:fog_settings": {
            "description": "Contient la définition des effets de brouillard volumétrique. \nType: `Object`",
            "type": "object",
            "required": ["description"],
            "properties": {
                "description": {
                    "description": "Description de l'effet de brouillard volumétrique. \nType: `Object`",
                    "type": "object",
                    "required": ["identifier"],
                    "properties": {
                        "identifier": {
                            "description": "L'identifiant de l'effet de brouillard volumétrique. \nType: `String`",
                            "type": "string",
                            pattern: schemaPatterns.identifier_with_namespace,
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_fog_ids
                        }
                    }
                },
                "distance": {
                    "description": "Définit les paramètres de brouillard de distance pour différents emplacements de caméra. \nType: `Object`",
                    "type": "object",
                    "properties": {
                        "air": {
                            "description": "Définit les paramètres de brouillard lorsque la caméra se trouve dans les airs. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "fog_color": {
                                    "description": "La couleur que le brouillard prendra. \nType: `Integer[3] | String`",
                                    "oneOf": [
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
                                            "type": "string",
                                            "pattern": "^#[0-9a-fA-F]{6}$"
                                        }
                                    ]
                                },
                                "fog_start": {
                                    "description": "La distance à partir du joueur où le brouillard commencera à apparaître. La valeur de fog_start doit être inférieure ou égale à celle de fog_end. \nType: `Number`",
                                    "type": "number"
                                },
                                "fog_end": {
                                    "description": "La distance à partir du joueur où le brouillard sera complètement opaque. La valeur de fog_end doit être supérieure ou égale à celle de fog_start. \nType: `Number`",
                                    "type": "number",
                                    "minimum": 0
                                },
                                "render_distance_type": {
                                    "description": "Définit comment la valeur de distance est utilisée. \nType: `String` \n'fixed': la distance est mesurée en blocs. \n'render': la distance est dynamique et est multipliée par la distance de rendu du joueur.",
                                    "type": "string",
                                    "enum": ["fixed", "render"]
                                }
                            }
                        },
                        "weather": {
                            "description": "Définit les paramètres de brouillard lorsque la caméra est sous la pluie (pluie, neige...). \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "fog_color": {
                                    "description": "La couleur que le brouillard prendra. \nType: `Integer[3] | String`",
                                    "oneOf": [
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
                                            "type": "string",
                                            "pattern": "^#[0-9a-fA-F]{6}$"
                                        }
                                    ]
                                },
                                "fog_start": {
                                    "description": "La distance à partir du joueur où le brouillard commencera à apparaître. La valeur de fog_start doit être inférieure ou égale à celle de fog_end. \nType: `Number`",
                                    "type": "number"
                                },
                                "fog_end": {
                                    "description": "La distance à partir du joueur où le brouillard sera complètement opaque. La valeur de fog_end doit être supérieure ou égale à celle de fog_start. \nType: `Number`",
                                    "type": "number",
                                    "minimum": 0
                                },
                                "render_distance_type": {
                                    "description": "Définit comment la valeur de distance est utilisée. \nType: `String` \n'fixed': la distance est mesurée en blocs. \n'render': la distance est dynamique et est multipliée par la distance de rendu du joueur.",
                                    "type": "string",
                                    "enum": ["fixed", "render"]
                                }
                            }
                        },
                        "water": {
                            "description": "Définit les paramètres de brouillard lorsque la caméra est sous l'eau. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "fog_color": {
                                    "description": "La couleur que le brouillard prendra. \nType: `Integer[3] | String`",
                                    "oneOf": [
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
                                            "type": "string",
                                            "pattern": "^#[0-9a-fA-F]{6}$"
                                        }
                                    ]
                                },
                                "fog_start": {
                                    "description": "La distance à partir du joueur où le brouillard commencera à apparaître. La valeur de fog_start doit être inférieure ou égale à celle de fog_end. \nType: `Number`",
                                    "type": "number"
                                },
                                "fog_end": {
                                    "description": "La distance à partir du joueur où le brouillard sera complètement opaque. La valeur de fog_end doit être supérieure ou égale à celle de fog_start. \nType: `Number`",
                                    "type": "number",
                                    "minimum": 0
                                },
                                "render_distance_type": {
                                    "description": "Définit comment la valeur de distance est utilisée. \nType: `String` \n'fixed': la distance est mesurée en blocs. \n'render': la distance est dynamique et est multipliée par la distance de rendu du joueur.",
                                    "type": "string",
                                    "enum": ["fixed", "render"]
                                },
                                "transition_fog": {
                                    "description": "Définit les données de brouillard supplémentaires qui se transiteront lentement vers le brouillard de distance du biome actuel. \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "init_fog": {
                                            "description": "Brouillard initial qui se transitionnera lentement vers le brouillard de distance de l'eau du biome lorsque le joueur entre dans l'eau. \nType: `Object`",
                                            "type": "object",
                                            "properties": {
                                                "fog_color": {
                                                    "description": "La couleur que le brouillard prendra. \nType: `Integer[3] | String`",
                                                    "oneOf": [
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
                                                            "type": "string",
                                                            "pattern": "^#[0-9a-fA-F]{6}$"
                                                        }
                                                    ]
                                                },
                                                "fog_start": {
                                                    "description": "La distance à partir du joueur où le brouillard commencera à apparaître. La valeur de fog_start doit être inférieure ou égale à celle de fog_end. \nType: `Number`",
                                                    "type": "number"
                                                },
                                                "fog_end": {
                                                    "description": "La distance à partir du joueur où le brouillard sera complètement opaque. La valeur de fog_end doit être supérieure ou égale à celle de fog_start. \nType: `Number`",
                                                    "type": "number",
                                                    "minimum": 0
                                                },
                                                "render_distance_type": {
                                                    "description": "Définit comment la valeur de distance est utilisée. \nType: `String` \n'fixed': la distance est mesurée en blocs. \n'render': la distance est dynamique et est multipliée par la distance de rendu du joueur.",
                                                    "type": "string",
                                                    "enum": ["fixed", "render"]
                                                }
                                            }
                                        },
                                        "min_percent": {
                                            "description": "Le progrès minimal de la transition du brouillard. Cela détermine à quel point le brouillard a commencé à se former, avec 0 signifiant aucun brouillard et 1 signifiant un brouillard complètement formé. \nType: `Number`",
                                            "type": "number",
                                            "minimum": 0,
                                            "maximum": 1
                                        },
                                        "mid_seconds": {
                                            "description": "Le temps nécessaire pour atteindre un certain progrès de la transition du brouillard, défini par mid_percent. Cela représente la durée avant que la transition atteigne une certaine étape. \nType: `Number`",
                                            "type": "number",
                                            "minimum": 0
                                        },
                                        "mid_percent": {
                                            "description": "Le progrès de la transition du brouillard après mid_seconds secondes. Cela définit combien de la transition du brouillard a été accompli après le temps spécifié. \nType: `Number`",
                                            "type": "number",
                                            "minimum": 0,
                                            "maximum": 1
                                        },
                                        "max_seconds": {
                                            "description": "La durée totale nécessaire pour compléter la transition du brouillard. Cela indique combien de temps il faut pour que la transition du brouillard soit entièrement terminée. \nType: `Number`",
                                            "type": "number",
                                            "minimum": 0
                                        }
                                    }
                                }
                            }
                        },
                        "lava": {
                            "description": "Définit les paramètres de brouillard lorsque la caméra est sous la lave. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "fog_color": {
                                    "description": "La couleur que le brouillard prendra. \nType: `Integer[3] | String`",
                                    "oneOf": [
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
                                            "type": "string",
                                            "pattern": "^#[0-9a-fA-F]{6}$"
                                        }
                                    ]
                                },
                                "fog_start": {
                                    "description": "La distance à partir du joueur où le brouillard commencera à apparaître. La valeur de fog_start doit être inférieure ou égale à celle de fog_end. \nType: `Number`",
                                    "type": "number"
                                },
                                "fog_end": {
                                    "description": "La distance à partir du joueur où le brouillard sera complètement opaque. La valeur de fog_end doit être supérieure ou égale à celle de fog_start. \nType: `Number`",
                                    "type": "number",
                                    "minimum": 0
                                },
                                "render_distance_type": {
                                    "description": "Définit comment la valeur de distance est utilisée. \nType: `String` \n'fixed': la distance est mesurée en blocs. \n'render': la distance est dynamique et est multipliée par la distance de rendu du joueur.",
                                    "type": "string",
                                    "enum": ["fixed", "render"]
                                }
                            }
                        },
                        "lava_resistance": {
                            "description": "Définit les paramètres de brouillard lorsque la caméra est sous la lave et que le joueur a une résistance à la lave. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "fog_color": {
                                    "description": "La couleur que le brouillard prendra. \nType: `Integer[3] | String`",
                                    "oneOf": [
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
                                            "type": "string",
                                            "pattern": "^#[0-9a-fA-F]{6}$"
                                        }
                                    ]
                                },
                                "fog_start": {
                                    "description": "La distance à partir du joueur où le brouillard commencera à apparaître. La valeur de fog_start doit être inférieure ou égale à celle de fog_end. \nType: `Number`",
                                    "type": "number"
                                },
                                "fog_end": {
                                    "description": "La distance à partir du joueur où le brouillard sera complètement opaque. La valeur de fog_end doit être supérieure ou égale à celle de fog_start. \nType: `Number`",
                                    "type": "number",
                                    "minimum": 0
                                },
                                "render_distance_type": {
                                    "description": "Définit comment la valeur de distance est utilisée. \nType: `String` \n'fixed': la distance est mesurée en blocs. \n'render': la distance est dynamique et est multipliée par la distance de rendu du joueur.",
                                    "type": "string",
                                    "enum": ["fixed", "render"]
                                }
                            }
                        },
                        "powder_snow": {
                            "description": "Définit les paramètres de brouillard lorsque la caméra est sous la neige en poudre. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "fog_color": {
                                    "description": "La couleur que le brouillard prendra. \nType: `Integer[3] | String`",
                                    "oneOf": [
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
                                            "type": "string",
                                            "pattern": "^#[0-9a-fA-F]{6}$"
                                        }
                                    ]
                                },
                                "fog_start": {
                                    "description": "La distance à partir du joueur où le brouillard commencera à apparaître. La valeur de fog_start doit être inférieure ou égale à celle de fog_end. \nType: `Number`",
                                    "type": "number"
                                },
                                "fog_end": {
                                    "description": "La distance à partir du joueur où le brouillard sera complètement opaque. La valeur de fog_end doit être supérieure ou égale à celle de fog_start. \nType: `Number`",
                                    "type": "number",
                                    "minimum": 0
                                },
                                "render_distance_type": {
                                    "description": "Définit comment la valeur de distance est utilisée. \nType: `String` \n'fixed': la distance est mesurée en blocs. \n'render': la distance est dynamique et est multipliée par la distance de rendu du joueur.",
                                    "type": "string",
                                    "enum": ["fixed", "render"]
                                }
                            }
                        }
                    }
                },
                "volumetric": {
                    "description": "Définit les paramètres de brouillard volumétrique. \nType: `Object`",
                    "type": "object",
                    "properties": {
                        "density": {
                            "description": "Définit les paramètres de densité pour différents emplacements de caméra. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "air": {
                                    "description": "Valeurs de densité du brouillard lorsque la lumière traverse les blocs d'air. \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "max_density": {
                                            "description": "La quantité maximale d'opacité que le brouillard au sol atteindra (0.0 = complètement transparent et 1.0 = complètement opaque). \nType: `Number`",
                                            "type": "number",
                                            "minimum": 0,
                                            "maximum": 1
                                        },
                                        "max_density_height": {
                                            "description": "La hauteur en blocs à laquelle le brouillard au sol atteindra sa densité maximale. \nType: `Number`",
                                            "type": "number",
                                            "minimum": -64,
                                            "maximum": 320
                                        },
                                        "zero_density_height": {
                                            "description": "La hauteur en blocs à laquelle le brouillard au sol sera complètement transparent et commencera à apparaître. Cette valeur doit être au moins 1 unité plus grande que max_density_height. \nType: `Number`",
                                            "type": "number",
                                            "minimum": -64,
                                            "maximum": 320
                                        },
                                        "uniform": {
                                            "description": "Lorsque cette option est activée (valeur true), la densité sera uniforme à toutes les hauteurs, c'est-à-dire qu'elle ne changera pas avec la hauteur. \nType: `Boolean`",
                                            "type": "boolean"
                                        }
                                    }
                                },
                                "weather": {
                                    "description": "Valeurs de densité du brouillard lorsque la lumière traverse les blocs de pluie (pluie, neige...). \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "max_density": {
                                            "description": "La quantité maximale d'opacité que le brouillard au sol atteindra (0.0 = complètement transparent et 1.0 = complètement opaque). \nType: `Number`",
                                            "type": "number",
                                            "minimum": 0,
                                            "maximum": 1
                                        },
                                        "max_density_height": {
                                            "description": "La hauteur en blocs à laquelle le brouillard au sol atteindra sa densité maximale. \nType: `Number`",
                                            "type": "number",
                                            "minimum": -64,
                                            "maximum": 320
                                        },
                                        "zero_density_height": {
                                            "description": "La hauteur en blocs à laquelle le brouillard au sol sera complètement transparent et commencera à apparaître. Cette valeur doit être au moins 1 unité plus grande que max_density_height. \nType: `Number`",
                                            "type": "number",
                                            "minimum": -64,
                                            "maximum": 320
                                        },
                                        "uniform": {
                                            "description": "Lorsque cette option est activée (valeur true), la densité sera uniforme à toutes les hauteurs, c'est-à-dire qu'elle ne changera pas avec la hauteur. \nType: `Boolean`",
                                            "type": "boolean"
                                        }
                                    }
                                },
                                "water": {
                                    "description": "Valeurs de densité du brouillard lorsque la lumière traverse les blocs d'eau. \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "max_density": {
                                            "description": "La quantité maximale d'opacité que le brouillard au sol atteindra (0.0 = complètement transparent et 1.0 = complètement opaque). \nType: `Number`",
                                            "type": "number",
                                            "minimum": 0,
                                            "maximum": 1
                                        },
                                        "max_density_height": {
                                            "description": "La hauteur en blocs à laquelle le brouillard au sol atteindra sa densité maximale. \nType: `Number`",
                                            "type": "number",
                                            "minimum": -64,
                                            "maximum": 320
                                        },
                                        "zero_density_height": {
                                            "description": "La hauteur en blocs à laquelle le brouillard au sol sera complètement transparent et commencera à apparaître. Cette valeur doit être au moins 1 unité plus grande que max_density_height. \nType: `Number`",
                                            "type": "number",
                                            "minimum": -64,
                                            "maximum": 320
                                        },
                                        "uniform": {
                                            "description": "Lorsque cette option est activée (valeur true), la densité sera uniforme à toutes les hauteurs, c'est-à-dire qu'elle ne changera pas avec la hauteur. \nType: `Boolean`",
                                            "type": "boolean"
                                        }
                                    }
                                },
                                "lava": {
                                    "description": "Valeurs de densité du brouillard lorsque la lumière traverse les blocs de lave. \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "max_density": {
                                            "description": "La quantité maximale d'opacité que le brouillard au sol atteindra (0.0 = complètement transparent et 1.0 = complètement opaque). \nType: `Number`",
                                            "type": "number",
                                            "minimum": 0,
                                            "maximum": 1
                                        },
                                        "max_density_height": {
                                            "description": "La hauteur en blocs à laquelle le brouillard au sol atteindra sa densité maximale. \nType: `Number`",
                                            "type": "number",
                                            "minimum": -64,
                                            "maximum": 320
                                        },
                                        "zero_density_height": {
                                            "description": "La hauteur en blocs à laquelle le brouillard au sol sera complètement transparent et commencera à apparaître. Cette valeur doit être au moins 1 unité plus grande que max_density_height. \nType: `Number`",
                                            "type": "number",
                                            "minimum": -64,
                                            "maximum": 320
                                        },
                                        "uniform": {
                                            "description": "Lorsque cette option est activée (valeur true), la densité sera uniforme à toutes les hauteurs, c'est-à-dire qu'elle ne changera pas avec la hauteur. \nType: `Boolean`",
                                            "type": "boolean"
                                        }
                                    }
                                },
                                "lava_resistance": {
                                    "description": "Valeurs de densité du brouillard lorsque la lumière traverse les blocs de lave et que le joueur a une résistance à la lave. \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "max_density": {
                                            "description": "La quantité maximale d'opacité que le brouillard au sol atteindra (0.0 = complètement transparent et 1.0 = complètement opaque). \nType: `Number`",
                                            "type": "number",
                                            "minimum": 0,
                                            "maximum": 1
                                        },
                                        "max_density_height": {
                                            "description": "La hauteur en blocs à laquelle le brouillard au sol atteindra sa densité maximale. \nType: `Number`",
                                            "type": "number",
                                            "minimum": -64,
                                            "maximum": 320
                                        },
                                        "zero_density_height": {
                                            "description": "La hauteur en blocs à laquelle le brouillard au sol sera complètement transparent et commencera à apparaître. Cette valeur doit être au moins 1 unité plus grande que max_density_height. \nType: `Number`",
                                            "type": "number",
                                            "minimum": -64,
                                            "maximum": 320
                                        },
                                        "uniform": {
                                            "description": "Lorsque cette option est activée (valeur true), la densité sera uniforme à toutes les hauteurs, c'est-à-dire qu'elle ne changera pas avec la hauteur. \nType: `Boolean`",
                                            "type": "boolean"
                                        }
                                    }
                                }
                            }
                        },
                        "media_coefficients": {
                            "description": "Paramètres des coefficients pour le brouillard volumétrique dans différents blocs. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "air": {
                                    "description": "Valeurs des coefficients du brouillard lorsque la lumière traverse l'air. \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "scattering": {
                                            "description": "Proportion de lumière qui est diffusée (répartie) par bloc. Cela définit combien de lumière est dispersée lorsqu'elle passe à travers un bloc d'air. \nType: `Integer[3] | String`",
                                            "oneOf": [
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
                                                    "type": "string",
                                                    "pattern": "^#[0-9a-fA-F]{6}$"
                                                }
                                            ]
                                        },
                                        "absorption": {
                                            "description": "Proportion de lumière qui est absorbée (perdue) par bloc. Cela indique la quantité de lumière qui est absorbée par un bloc d'air, ce qui réduit l'intensité lumineuse. \nType: `Integer[3] | String`",
                                            "oneOf": [
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
                                                    "type": "string",
                                                    "pattern": "^#[0-9a-fA-F]{6}$"
                                                }
                                            ]
                                        }
                                    }
                                },
                                "water": {
                                    "description": "Valeurs des coefficients du brouillard lorsque la lumière traverse l'eau. \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "scattering": {
                                            "description": "Proportion de lumière qui est diffusée (répartie) par bloc. Cela définit combien de lumière est dispersée lorsqu'elle passe à travers un bloc d'eau. \nType: `Integer[3] | String`",
                                            "oneOf": [
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
                                                    "type": "string",
                                                    "pattern": "^#[0-9a-fA-F]{6}$"
                                                }
                                            ]
                                        },
                                        "absorption": {
                                            "description": "Proportion de lumière qui est absorbée (perdue) par bloc. Cela indique la quantité de lumière qui est absorbée par un bloc d'eau, ce qui réduit l'intensité lumineuse. \nType: `Integer[3] | String`",
                                            "oneOf": [
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
                                                    "type": "string",
                                                    "pattern": "^#[0-9a-fA-F]{6}$"
                                                }
                                            ]
                                        }
                                    }
                                },
                                "cloud": {
                                    "description": "Valeurs des coefficients du brouillard lorsque la lumière traverse les nuages. \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "scattering": {
                                            "description": "Proportion de lumière qui est diffusée (répartie) par bloc. Cela définit combien de lumière est dispersée lorsqu'elle passe à travers un bloc de nuages. \nType: `Integer[3] | String`",
                                            "oneOf": [
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
                                                    "type": "string",
                                                    "pattern": "^#[0-9a-fA-F]{6}$"
                                                }
                                            ]
                                        },
                                        "absorption": {
                                            "description": "Proportion de lumière qui est absorbée (perdue) par bloc. Cela indique la quantité de lumière qui est absorbée par un bloc de nuages, ce qui réduit l'intensité lumineuse. \nType: `Integer[3] | String`",
                                            "oneOf": [
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
                                                    "type": "string",
                                                    "pattern": "^#[0-9a-fA-F]{6}$"
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

const versionedChanges: SchemaChange[] = [
    {
        version: "1.21.90",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:fog_settings", "volumetric", "henyey_greenstein_g"],
                value: {
                    "description": "Définit comment la lumière se diffuse dans le brouillard volumétrique (effet 3D de particules dans l'air), selon un modèle physique appelé Heney-Greenstein phase function. \nType: `Object`",
                    "type": "object",
                    "properties": {
                        "air": {
                            "description": "Valeurs de la fonction de phase Henyey-Greenstein pour l'air. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "henyey_greenstein_g": {
                                    "description": "Le paramètre g de la fonction de phase Henyey-Greenstein pour l'air. Il contrôle la direction de la diffusion de la lumière dans le brouillard volumétrique. \nType: `Number`",
                                    "default": 0.75,
                                    "type": "number",
                                    "minimum": -1,
                                    "maximum": 1
                                }
                            }
                        },
                        "water": {
                            "description": "Valeurs de la fonction de phase Henyey-Greenstein pour l'eau. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "henyey_greenstein_g": {
                                    "description": "Le paramètre g de la fonction de phase Henyey-Greenstein pour l'eau. Il contrôle la direction de la diffusion de la lumière dans le brouillard volumétrique. \nType: `Number`",
                                    "default": 0.6,
                                    "type": "number",
                                    "minimum": -1,
                                    "maximum": 1
                                }
                            }
                        }
                    }
                }
            }
        ]
    }
];

export const fogSettingsSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/fogs/*.json"],
    baseSchema: baseSchema,
    versionedChanges: versionedChanges
};