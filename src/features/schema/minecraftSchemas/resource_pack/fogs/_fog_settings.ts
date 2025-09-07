import { schemaPatterns } from "../../../utils/shared/schemaPatterns";
import { MinecraftJsonSchema } from "../../../../../types/minecraftJsonSchema";
import { VersionedSchema, SchemaChange } from "../../../model/versioning";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier sert à configurer des effets de brouillard volumétrique et de rayons lumineux (light shafts).",
    type: "object",
    required: ["format_version", "minecraft:fog_settings"],
    properties: {
        format_version: {
            description: "La version du Format à utiliser.",
            type: "string",
            enum: [
                "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
            ]
        },
        "minecraft:fog_settings": {
            description: "Contient la définition des effets de brouillard volumétrique.",
            type: "object",
            required: ["description"],
            properties: {
                description: {
                    description: "Description de l'effet de brouillard volumétrique.",
                    type: "object",
                    required: ["identifier"],
                    properties: {
                        identifier: {
                            description: "L'identifiant de l'effet de brouillard volumétrique.",
                            type: "string",
                            pattern: schemaPatterns.identifier_with_namespace
                        }
                    }
                },
                distance: {
                    description: "Définit les paramètres de brouillard de distance pour différents emplacements de caméra.",
                    type: "object",
                    properties: {
                        air: {
                            description: "Définit les paramètres de brouillard lorsque la caméra se trouve dans l'air.",
                            type: "object",
                            required: ["render_distance_type", "fog_color", "fog_start", "fog_end"],
                            properties: {
                                fog_color: {
                                    description: "La couleur que le brouillard prendra.",
                                    oneOf: [
                                        {
                                            type: "array",
                                            minItems: 3,
                                            maxItems: 3,
                                            items: {
                                                type: "integer",
                                                minimum: 0,
                                                maximum: 255
                                            }
                                        },
                                        {
                                            type: "string",
                                            pattern: schemaPatterns.color_hex
                                        }
                                    ]
                                },
                                fog_start: {
                                    description: "La distance à partir du joueur où le brouillard commencera à apparaître. La valeur de `fog_start` doit être inférieure ou égale à celle de `fog_end`.",
                                    type: "number"
                                },
                                fog_end: {
                                    description: "La distance à partir du joueur où le brouillard sera complètement opaque. La valeur de `fog_end` doit être supérieure ou égale à celle de `fog_start`.",
                                    type: "number",
                                    minimum: 0
                                },
                                render_distance_type: {
                                    description:
                                    "Définit comment la valeur de distance est utilisée" +
                                    "\n\n- `fixed`: la distance est mesurée en blocs." +
                                    "\n\n- `render`: la distance est dynamique et est multipliée par la distance de rendu du joueur. `1.0` correspond à la distance de rendu du joueur.",
                                    type: "string",
                                    enum: ["fixed", "render"]
                                }
                            }
                        },
                        weather: {
                            description: "Définit les paramètres de brouillard lorsque la caméra se trouve dans la pluie ou la neige.",
                            type: "object",
                            required: ["render_distance_type", "fog_color", "fog_start", "fog_end"],
                            properties: {
                                fog_color: {
                                    description: "La couleur que le brouillard prendra.",
                                    oneOf: [
                                        {
                                            type: "array",
                                            minItems: 3,
                                            maxItems: 3,
                                            items: {
                                                type: "integer",
                                                minimum: 0,
                                                maximum: 255
                                            }
                                        },
                                        {
                                            type: "string",
                                            pattern: schemaPatterns.color_hex
                                        }
                                    ]
                                },
                                fog_start: {
                                    description: "La distance à partir du joueur où le brouillard commencera à apparaître. La valeur de `fog_start` doit être inférieure ou égale à celle de `fog_end`.",
                                    type: "number"
                                },
                                fog_end: {
                                    description: "La distance à partir du joueur où le brouillard sera complètement opaque. La valeur de `fog_end` doit être supérieure ou égale à celle de `fog_start`.",
                                    type: "number",
                                    minimum: 0
                                },
                                render_distance_type: {
                                    description:
                                    "Définit comment la valeur de distance est utilisée" +
                                    "\n\n- `fixed`: la distance est mesurée en blocs." +
                                    "\n\n- `render`: la distance est dynamique et est multipliée par la distance de rendu du joueur. `1.0` correspond à la distance de rendu du joueur.",
                                    type: "string",
                                    enum: ["fixed", "render"]
                                }
                            }
                        },
                        water: {
                            description: "Définit les paramètres de brouillard lorsque la caméra est sous l'eau.",
                            type: "object",
                            required: ["render_distance_type", "fog_color", "fog_start", "fog_end"],
                            properties: {
                                fog_color: {
                                    description: "La couleur que le brouillard prendra.",
                                    oneOf: [
                                        {
                                            type: "array",
                                            minItems: 3,
                                            maxItems: 3,
                                            items: {
                                                type: "integer",
                                                minimum: 0,
                                                maximum: 255
                                            }
                                        },
                                        {
                                            type: "string",
                                            pattern: schemaPatterns.color_hex
                                        }
                                    ]
                                },
                                fog_start: {
                                    description: "La distance à partir du joueur où le brouillard commencera à apparaître. La valeur de `fog_start` doit être inférieure ou égale à celle de `fog_end`.",
                                    type: "number"
                                },
                                fog_end: {
                                    description: "La distance à partir du joueur où le brouillard sera complètement opaque. La valeur de `fog_end` doit être supérieure ou égale à celle de `fog_start`.",
                                    type: "number",
                                    minimum: 0
                                },
                                render_distance_type: {
                                    description:
                                    "Définit comment la valeur de distance est utilisée" +
                                    "\n\n- `fixed`: la distance est mesurée en blocs." +
                                    "\n\n- `render`: la distance est dynamique et est multipliée par la distance de rendu du joueur. `1.0` correspond à la distance de rendu du joueur.",
                                    type: "string",
                                    enum: ["fixed", "render"]
                                },
                                transition_fog: {
                                    description: "Définit les données de brouillard supplémentaires qui se transiteront lentement vers le brouillard de distance du biome actuel.",
                                    type: "object",
                                    required: ["init_fog", "min_percent", "mid_seconds", "mid_percent", "max_seconds"],
                                    properties: {
                                        init_fog: {
                                            description: "Brouillard initial qui se transitionnera lentement vers le brouillard de distance de l'eau du biome lorsque le joueur entre dans l'eau.",
                                            type: "object",
                                            properties: {
                                                fog_color: {
                                                    description: "La couleur que le brouillard prendra.",
                                                    oneOf: [
                                                        {
                                                            type: "array",
                                                            minItems: 3,
                                                            maxItems: 3,
                                                            items: {
                                                                type: "integer",
                                                                minimum: 0,
                                                                maximum: 255
                                                            }
                                                        },
                                                        {
                                                            type: "string",
                                                            pattern: schemaPatterns.color_hex
                                                        }
                                                    ]
                                                },
                                                fog_start: {
                                                    description: "La distance à partir du joueur où le brouillard commencera à apparaître. La valeur de `fog_start` doit être inférieure ou égale à celle de `fog_end`.",
                                                    type: "number"
                                                },
                                                fog_end: {
                                                    description: "La distance à partir du joueur où le brouillard sera complètement opaque. La valeur de `fog_end` doit être supérieure ou égale à celle de `fog_start`.",
                                                    type: "number",
                                                    minimum: 0
                                                },
                                                render_distance_type: {
                                                    description:
                                                    "Définit comment la valeur de distance est utilisée" +
                                                    "\n\n- `fixed`: la distance est mesurée en blocs." +
                                                    "\n\n- `render`: la distance est dynamique et est multipliée par la distance de rendu du joueur. `1.0` correspond à la distance de rendu du joueur.",
                                                    type: "string",
                                                    enum: ["fixed", "render"]
                                                }
                                            }
                                        },
                                        min_percent: {
                                            description: "Le progrès minimal de la transition du brouillard. Cela détermine à quel point le brouillard a commencé à se former, avec 0 signifiant aucun brouillard et 1 signifiant un brouillard complètement formé.",
                                            type: "number",
                                            minimum: 0,
                                            maximum: 1
                                        },
                                        mid_seconds: {
                                            description: "Le temps nécessaire pour atteindre un certain progrès de la transition du brouillard, défini par mid_percent. Cela représente la durée avant que la transition atteigne une certaine étape.",
                                            type: "number",
                                            minimum: 0
                                        },
                                        mid_percent: {
                                            description: "Le progrès de la transition du brouillard après mid_seconds secondes. Cela définit combien de la transition du brouillard a été accompli après le temps spécifié.",
                                            type: "number",
                                            minimum: 0,
                                            maximum: 1
                                        },
                                        max_seconds: {
                                            description: "La durée totale nécessaire pour compléter la transition du brouillard. Cela indique combien de temps il faut pour que la transition du brouillard soit entièrement terminée.",
                                            type: "number",
                                            minimum: 0
                                        }
                                    }
                                }
                            }
                        },
                        lava: {
                            description: "Définit les paramètres de brouillard lorsque la caméra se trouve sous la lave.",
                            type: "object",
                            required: ["render_distance_type", "fog_color", "fog_start", "fog_end"],
                            properties: {
                                fog_color: {
                                    description: "La couleur que le brouillard prendra.",
                                    oneOf: [
                                        {
                                            type: "array",
                                            minItems: 3,
                                            maxItems: 3,
                                            items: {
                                                type: "integer",
                                                minimum: 0,
                                                maximum: 255
                                            }
                                        },
                                        {
                                            type: "string",
                                            pattern: schemaPatterns.color_hex
                                        }
                                    ]
                                },
                                fog_start: {
                                    description: "La distance à partir du joueur où le brouillard commencera à apparaître. La valeur de `fog_start` doit être inférieure ou égale à celle de `fog_end`.",
                                    type: "number"
                                },
                                fog_end: {
                                    description: "La distance à partir du joueur où le brouillard sera complètement opaque. La valeur de `fog_end` doit être supérieure ou égale à celle de `fog_start`.",
                                    type: "number",
                                    minimum: 0
                                },
                                render_distance_type: {
                                    description:
                                    "Définit comment la valeur de distance est utilisée" +
                                    "\n\n- `fixed`: la distance est mesurée en blocs." +
                                    "\n\n- `render`: la distance est dynamique et est multipliée par la distance de rendu du joueur. `1.0` correspond à la distance de rendu du joueur.",
                                    type: "string",
                                    enum: ["fixed", "render"]
                                }
                            }
                        },
                        lava_resistance: {
                            description: "Définit les paramètres de brouillard lorsque la caméra se trouve sous la lave et que le joueur a une résistance à la lave.",
                            type: "object",
                            required: ["render_distance_type", "fog_color", "fog_start", "fog_end"],
                            properties: {
                                fog_color: {
                                    description: "La couleur que le brouillard prendra.",
                                    oneOf: [
                                        {
                                            type: "array",
                                            minItems: 3,
                                            maxItems: 3,
                                            items: {
                                                type: "integer",
                                                minimum: 0,
                                                maximum: 255
                                            }
                                        },
                                        {
                                            type: "string",
                                            pattern: schemaPatterns.color_hex
                                        }
                                    ]
                                },
                                fog_start: {
                                    description: "La distance à partir du joueur où le brouillard commencera à apparaître. La valeur de `fog_start` doit être inférieure ou égale à celle de `fog_end`.",
                                    type: "number"
                                },
                                fog_end: {
                                    description: "La distance à partir du joueur où le brouillard sera complètement opaque. La valeur de `fog_end` doit être supérieure ou égale à celle de `fog_start`.",
                                    type: "number",
                                    minimum: 0
                                },
                                render_distance_type: {
                                    description:
                                    "Définit comment la valeur de distance est utilisée" +
                                    "\n\n- `fixed`: la distance est mesurée en blocs." +
                                    "\n\n- `render`: la distance est dynamique et est multipliée par la distance de rendu du joueur. `1.0` correspond à la distance de rendu du joueur.",
                                    type: "string",
                                    enum: ["fixed", "render"]
                                }
                            }
                        },
                        powder_snow: {
                            description: "Définit les paramètres de brouillard lorsque la caméra se trouve sous la neige poudreuse.",
                            type: "object",
                            required: ["render_distance_type", "fog_color", "fog_start", "fog_end"],
                            properties: {
                                fog_color: {
                                    description: "La couleur que le brouillard prendra.",
                                    oneOf: [
                                        {
                                            type: "array",
                                            minItems: 3,
                                            maxItems: 3,
                                            items: {
                                                type: "integer",
                                                minimum: 0,
                                                maximum: 255
                                            }
                                        },
                                        {
                                            type: "string",
                                            pattern: schemaPatterns.color_hex
                                        }
                                    ]
                                },
                                fog_start: {
                                    description: "La distance à partir du joueur où le brouillard commencera à apparaître. La valeur de `fog_start` doit être inférieure ou égale à celle de `fog_end`.",
                                    type: "number"
                                },
                                fog_end: {
                                    description: "La distance à partir du joueur où le brouillard sera complètement opaque. La valeur de `fog_end` doit être supérieure ou égale à celle de `fog_start`.",
                                    type: "number",
                                    minimum: 0
                                },
                                render_distance_type: {
                                    description:
                                    "Définit comment la valeur de distance est utilisée" +
                                    "\n\n- `fixed`: la distance est mesurée en blocs." +
                                    "\n\n- `render`: la distance est dynamique et est multipliée par la distance de rendu du joueur. `1.0` correspond à la distance de rendu du joueur.",
                                    type: "string",
                                    enum: ["fixed", "render"]
                                }
                            }
                        }
                    }
                },
                volumetric: {
                    description: "Définit les paramètres du brouillard volumétrique, utilisé par le mode graphique « Vibrant Visuals ». Le brouillard volumétrique simule la diffusion de la lumière à travers l'air, l'eau, la lave, etc., créant des effets de brume en 3D réalistes (comme des rayons lumineux ou une atmosphère épaisse). Permet de contrôler la densité, la couleur et la façon dont la lumière se disperse dans différents milieux.",
                    type: "object",
                    properties: {
                        density: {
                            description: "Définit les paramètres de densité pour différents emplacements de caméra.",
                            type: "object",
                            properties: {
                                air: {
                                    description: "Valeurs de densité du brouillard lorsque la lumière traverse les blocs d'air.",
                                    type: "object",
                                    properties: {
                                        max_density: {
                                            description: "La quantité maximale d'opacité que le brouillard au sol atteindra (0.0 = complètement transparent et 1.0 = complètement opaque).",
                                            type: "number",
                                            minimum: 0.0,
                                            maximum: 1.0
                                        },
                                        max_density_height: {
                                            description: "La hauteur en blocs à laquelle le brouillard au sol atteindra sa densité maximale. Cette valeur est requise sauf si `uniform` est défini sur `true`.",
                                            type: "number",
                                            minimum: -64,
                                            maximum: 320
                                        },
                                        zero_density_height: {
                                            description: "La hauteur en blocs à laquelle le brouillard au sol sera complètement transparent et commencera à apparaître. Cette valeur doit être au moins 1 unité plus grande que max_density_height. Cette valeur est requise sauf si `uniform` est défini sur `true`",
                                            type: "number",
                                            minimum: -64,
                                            maximum: 320
                                        },
                                        uniform: {
                                            description: "Lorsque cette option est activée (valeur `true`), la densité sera uniforme à toutes les hauteurs, c'est-à-dire qu'elle ne changera pas avec la hauteur.",
                                            type: "boolean"
                                        }
                                    }
                                },
                                weather: {
                                    description: "Valeurs de densité du brouillard lorsque la lumière traverse les blocs de pluie (pluie, neige...).",
                                    type: "object",
                                    properties: {
                                        max_density: {
                                            description: "La quantité maximale d'opacité que le brouillard au sol atteindra (0.0 = complètement transparent et 1.0 = complètement opaque).",
                                            type: "number",
                                            minimum: 0.0,
                                            maximum: 1.0
                                        },
                                        max_density_height: {
                                            description: "La hauteur en blocs à laquelle le brouillard au sol atteindra sa densité maximale. Cette valeur est requise sauf si `uniform` est défini sur `true`.",
                                            type: "number",
                                            minimum: -64,
                                            maximum: 320
                                        },
                                        zero_density_height: {
                                            description: "La hauteur en blocs à laquelle le brouillard au sol sera complètement transparent et commencera à apparaître. Cette valeur doit être au moins 1 unité plus grande que max_density_height. Cette valeur est requise sauf si `uniform` est défini sur `true`",
                                            type: "number",
                                            minimum: -64,
                                            maximum: 320
                                        },
                                        uniform: {
                                            description: "Lorsque cette option est activée (valeur `true`), la densité sera uniforme à toutes les hauteurs, c'est-à-dire qu'elle ne changera pas avec la hauteur.",
                                            type: "boolean"
                                        }
                                    }
                                },
                                water: {
                                    description: "Valeurs de densité du brouillard lorsque la lumière traverse les blocs d'eau.",
                                    type: "object",
                                    properties: {
                                        max_density: {
                                            description: "La quantité maximale d'opacité que le brouillard au sol atteindra (0.0 = complètement transparent et 1.0 = complètement opaque).",
                                            type: "number",
                                            minimum: 0.0,
                                            maximum: 1.0
                                        },
                                        max_density_height: {
                                            description: "La hauteur en blocs à laquelle le brouillard au sol atteindra sa densité maximale. Cette valeur est requise sauf si `uniform` est défini sur `true`.",
                                            type: "number",
                                            minimum: -64,
                                            maximum: 320
                                        },
                                        zero_density_height: {
                                            description: "La hauteur en blocs à laquelle le brouillard au sol sera complètement transparent et commencera à apparaître. Cette valeur doit être au moins 1 unité plus grande que max_density_height. Cette valeur est requise sauf si `uniform` est défini sur `true`",
                                            type: "number",
                                            minimum: -64,
                                            maximum: 320
                                        },
                                        uniform: {
                                            description: "Lorsque cette option est activée (valeur `true`), la densité sera uniforme à toutes les hauteurs, c'est-à-dire qu'elle ne changera pas avec la hauteur.",
                                            type: "boolean"
                                        }
                                    }
                                },
                                lava: {
                                    description: "Valeurs de densité du brouillard lorsque la lumière traverse les blocs de lave.",
                                    type: "object",
                                    properties: {
                                        max_density: {
                                            description: "La quantité maximale d'opacité que le brouillard au sol atteindra (0.0 = complètement transparent et 1.0 = complètement opaque).",
                                            type: "number",
                                            minimum: 0.0,
                                            maximum: 1.0
                                        },
                                        max_density_height: {
                                            description: "La hauteur en blocs à laquelle le brouillard au sol atteindra sa densité maximale. Cette valeur est requise sauf si `uniform` est défini sur `true`.",
                                            type: "number",
                                            minimum: -64,
                                            maximum: 320
                                        },
                                        zero_density_height: {
                                            description: "La hauteur en blocs à laquelle le brouillard au sol sera complètement transparent et commencera à apparaître. Cette valeur doit être au moins 1 unité plus grande que max_density_height. Cette valeur est requise sauf si `uniform` est défini sur `true`",
                                            type: "number",
                                            minimum: -64,
                                            maximum: 320
                                        },
                                        uniform: {
                                            description: "Lorsque cette option est activée (valeur `true`), la densité sera uniforme à toutes les hauteurs, c'est-à-dire qu'elle ne changera pas avec la hauteur.",
                                            type: "boolean"
                                        }
                                    }
                                },
                                lava_resistance: {
                                    description: "Valeurs de densité du brouillard lorsque la lumière traverse les blocs de lave et que le joueur a une résistance à la lave.",
                                    type: "object",
                                    properties: {
                                        max_density: {
                                            description: "La quantité maximale d'opacité que le brouillard au sol atteindra (0.0 = complètement transparent et 1.0 = complètement opaque).",
                                            type: "number",
                                            minimum: 0.0,
                                            maximum: 1.0
                                        },
                                        max_density_height: {
                                            description: "La hauteur en blocs à laquelle le brouillard au sol atteindra sa densité maximale. Cette valeur est requise sauf si `uniform` est défini sur `true`.",
                                            type: "number",
                                            minimum: -64,
                                            maximum: 320
                                        },
                                        zero_density_height: {
                                            description: "La hauteur en blocs à laquelle le brouillard au sol sera complètement transparent et commencera à apparaître. Cette valeur doit être au moins 1 unité plus grande que max_density_height. Cette valeur est requise sauf si `uniform` est défini sur `true`",
                                            type: "number",
                                            minimum: -64,
                                            maximum: 320
                                        },
                                        uniform: {
                                            description: "Lorsque cette option est activée (valeur `true`), la densité sera uniforme à toutes les hauteurs, c'est-à-dire qu'elle ne changera pas avec la hauteur.",
                                            type: "boolean"
                                        }
                                    }
                                }
                            }
                        },
                        media_coefficients: {
                            description: "Paramètres des coefficients pour le brouillard volumétrique dans différents blocs. Ces coefficients déterminent comment la lumière est diffusée et absorbée lorsqu'elle traverse différents matériaux, affectant ainsi l'apparence du brouillard.",
                            type: "object",
                            properties: {
                                air: {
                                    description: "Valeurs des coefficients du brouillard lorsque la lumière traverse l'air.",
                                    type: "object",
                                    required: ["scattering", "absorption"],
                                    properties: {
                                        scattering: {
                                            description: "Proportion de lumière qui est diffusée (répartie) par bloc. Cela définit combien de lumière est dispersée lorsqu'elle passe à travers un bloc d'air.",
                                            oneOf: [
                                                {
                                                    type: "array",
                                                    minItems: 3,
                                                    maxItems: 3,
                                                    items: {
                                                        type: "number",
                                                        minimum: 0,
                                                        maximum: 1
                                                    }
                                                },
                                                {
                                                    type: "string",
                                                    pattern: schemaPatterns.color_hex
                                                }
                                            ]
                                        },
                                        absorption: {
                                            description: "Proportion de lumière qui est absorbée (perdue) par bloc. Cela indique la quantité de lumière qui est absorbée par un bloc d'air, ce qui réduit l'intensité lumineuse.",
                                            oneOf: [
                                                {
                                                    type: "array",
                                                    minItems: 3,
                                                    maxItems: 3,
                                                    items: {
                                                        type: "number",
                                                        minimum: 0,
                                                        maximum: 1
                                                    }
                                                },
                                                {
                                                    type: "string",
                                                    pattern: schemaPatterns.color_hex
                                                }
                                            ]
                                        }
                                    }
                                },
                                water: {
                                    description: "Valeurs des coefficients du brouillard lorsque la lumière traverse l'eau.",
                                    type: "object",
                                    required: ["scattering", "absorption"],
                                    properties: {
                                        scattering: {
                                            description: "Proportion de lumière qui est diffusée (répartie) par bloc. Cela définit combien de lumière est dispersée lorsqu'elle passe à travers un bloc d'eau.",
                                            oneOf: [
                                                {
                                                    type: "array",
                                                    minItems: 3,
                                                    maxItems: 3,
                                                    items: {
                                                        type: "number",
                                                        minimum: 0,
                                                        maximum: 1
                                                    }
                                                },
                                                {
                                                    type: "string",
                                                    pattern: schemaPatterns.color_hex
                                                }
                                            ]
                                        },
                                        absorption: {
                                            description: "Proportion de lumière qui est absorbée (perdue) par bloc. Cela indique la quantité de lumière qui est absorbée par un bloc d'eau, ce qui réduit l'intensité lumineuse.",
                                            oneOf: [
                                                {
                                                    type: "array",
                                                    minItems: 3,
                                                    maxItems: 3,
                                                    items: {
                                                        type: "number",
                                                        minimum: 0,
                                                        maximum: 1
                                                    }
                                                },
                                                {
                                                    type: "string",
                                                    pattern: schemaPatterns.color_hex
                                                }
                                            ]
                                        }
                                    }
                                },
                                cloud: {
                                    description: "Valeurs des coefficients du brouillard lorsque la lumière traverse les nuages.",
                                    type: "object",
                                    required: ["scattering", "absorption"],
                                    properties: {
                                        scattering: {
                                            description: "Proportion de lumière qui est diffusée (répartie) par bloc. Cela définit combien de lumière est dispersée lorsqu'elle passe à travers les nuages.",
                                            oneOf: [
                                                {
                                                    type: "array",
                                                    minItems: 3,
                                                    maxItems: 3,
                                                    items: {
                                                        type: "number",
                                                        minimum: 0,
                                                        maximum: 1
                                                    }
                                                },
                                                {
                                                    type: "string",
                                                    pattern: schemaPatterns.color_hex
                                                }
                                            ]
                                        },
                                        absorption: {
                                            description: "Proportion de lumière qui est absorbée (perdue) par bloc. Cela indique la quantité de lumière qui est absorbée par les nuages, ce qui réduit l'intensité lumineuse.",
                                            oneOf: [
                                                {
                                                    type: "array",
                                                    minItems: 3,
                                                    maxItems: 3,
                                                    items: {
                                                        type: "number",
                                                        minimum: 0,
                                                        maximum: 1
                                                    }
                                                },
                                                {
                                                    type: "string",
                                                    pattern: schemaPatterns.color_hex
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
                    description: "Définit comment la lumière se diffuse dans le brouillard volumétrique (effet 3D de particules dans l'air), selon un modèle physique appelé Heney-Greenstein phase function.",
                    type: "object",
                    properties: {
                        air: {
                            description: "Valeurs de la fonction de phase Henyey-Greenstein pour l'air.",
                            type: "object",
                            properties: {
                                henyey_greenstein_g: {
                                    description: "Le paramètre g de la fonction de phase Henyey-Greenstein pour l'air. Il contrôle la direction de la diffusion de la lumière dans le brouillard volumétrique.",
                                    default: 0.75,
                                    type: "number",
                                    minimum: -1,
                                    maximum: 1
                                }
                            }
                        },
                        water: {
                            description: "Valeurs de la fonction de phase Henyey-Greenstein pour l'eau.",
                            type: "object",
                            properties: {
                                henyey_greenstein_g: {
                                    description: "Le paramètre g de la fonction de phase Henyey-Greenstein pour l'eau. Il contrôle la direction de la diffusion de la lumière dans le brouillard volumétrique.",
                                    default: 0.6,
                                    type: "number",
                                    minimum: -1,
                                    maximum: 1
                                }
                            }
                        }
                    }
                }
            }
        ]
    }
];

export const fogSettingsSchemaTypeRP: VersionedSchema = {
    fileMatch: ["**/addon/resource_pack/fogs/*.json"],
    baseSchema: baseSchema,
    versionedChanges: versionedChanges
};