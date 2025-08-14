import { SchemaChange, SchemaType } from "../../../../../types/schema";
import { dynamicExamplesSourceKeys } from "../../../shared/schemaEnums";
import { schemaPatterns } from "../../../shared/schemaPatterns";

const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Ce fichier sert à configurer l'apparence visuelle du jeu en ajustant des paramètres tels que la saturation, le contraste, la luminosité, et les ombres pour créer des ambiances ou des thèmes spécifiques. \nType: `Object`",
    "required": ["format_version", "minecraft:color_grading_settings"],
    "properties": {
        "format_version": {
            "description": "La version du format à utiliser. \nType: `String`",
            "type": "string",
            enum: [
                "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
            ]
        },
        "minecraft:color_grading_settings": {
            "description": "Contient la définition des paramètres de color grading. \nType: `Object`",
            "type": "object",
            "required": ["description"],
            "properties": {
                "description": {
                    "description": "Description des paramètres de color grading. \nType: `Object`",
                    "type": "object",
                    "required": ["identifier"],
                    "properties": {
                        "identifier": {
                            "description": "L'identifiant de la description des paramètres de color grading. \nType: `String`",
                            "type": "string",
                            pattern: schemaPatterns.identifier_with_namespace,
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_color_grading_settings_ids
                        }
                    }
                },
                "color_grading": {
                    "description": "Définit les paramètres de color grading. \nType: `Object`",
                    "type": "object",
                    "required": ["midtones"],
                    "properties": {
                        "midtones": {
                            "description": "Permet de définir les paramètres de correction des couleurs pour les midtones, affectant les pixels ni trop sombres ni trop lumineux. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "contrast": {
                                    "description": "Ajuste la différence de luminance entre les pixels clairs et sombres de l'image. Un contraste élevé rendra l'image plus dynamique, tandis qu'un faible contraste la rendra plus douce. \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": 0.0,
                                        "maximum": 4.0
                                    }
                                },
                                "gain": {
                                    "description": "Multiplie l'intensité lumineuse de chaque canal de couleur. Cela affecte plus fortement les pixels clairs que les pixels sombres. Une valeur plus élevée rend l'image plus lumineuse. \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": 0.0,
                                        "maximum": 10.0
                                    }
                                },
                                "gamma": {
                                    "description": "Applique une correction exponentielle de la luminance après le color grading. Cela ajuste la clarté des tons intermédiaires. Des valeurs plus faibles rendent l'image plus sombre, des valeurs plus élevées la rendent plus claire. \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": 0.0,
                                        "maximum": 4.0
                                    }
                                },
                                "offset": {
                                    "description": "Ajoute une valeur à la luminance moyenne de l'image pour ajuster son intensité globale. Une valeur positive éclaircit l'image, tandis qu'une valeur négative la rend plus sombre. \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -1.0,
                                        "maximum": 1.0
                                    }
                                },
                                "saturation": {
                                    "description": "Ajuste l'intensité des couleurs. Une valeur de 0.0 rend l'image en niveaux de gris, tandis que des valeurs supérieures à 1.0 augmentent la vivacité des couleurs. \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": 0.0,
                                        "maximum": 10.0
                                    }
                                }
                            }
                        },
                        "highlights": {
                            "description": "Paramètres de color grading facultatifs pour les hautes lumières. \nType: `Object`",
                            "type": "object",
                            "required": ["enabled"],
                            "properties": {
                                "enabled": {
                                    "description": "Active ou désactive les paramètres de color grading pour les hautes lumières. \nType: `Boolean`",
                                    "type": "boolean"
                                },
                                "highlightsMin": {
                                    "description": " Définit le seuil minimal de luminance pour que les pixels soient considérés comme des hautes lumières. \nType: `Number`",
                                    "type": "number",
                                    "minimum": 1.0,
                                    "maximum": 4.0
                                },
                                "constrast": {
                                    "description": "Ajuste la différence de luminance entre les pixels clairs et sombres de l'image pour les hautes lumières. Un contraste élevé rendra l'image plus dynamique, tandis qu'un faible contraste la rendra plus douce. \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": 0.0,
                                        "maximum": 4.0
                                    }
                                },
                                "gain": {
                                    "description": "Multiplie l'intensité lumineuse de chaque canal de couleur pour les hautes lumières. Cela affecte plus fortement les pixels clairs que les pixels sombres. Une valeur plus élevée rend l'image plus lumineuse. \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": 0.0,
                                        "maximum": 10.0
                                    }
                                },
                                "gamma": {
                                    "description": "Applique une correction exponentielle de la luminance après le color grading pour les hautes lumières. Cela ajuste la clarté des tons intermédiaires. Des valeurs plus faibles rendent l'image plus sombre, des valeurs plus élevées la rendent plus claire. \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": 0.0,
                                        "maximum": 4.0
                                    }
                                },
                                "offset": {
                                    "description": "Ajoute une valeur à la luminance moyenne de l'image pour ajuster son intensité globale pour les hautes lumières. Une valeur positive éclaircit l'image, tandis qu'une valeur négative la rend plus sombre. \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -1,
                                        "maximum": 1
                                    }
                                },
                                "saturation": {
                                    "description": "Ajuste l'intensité des couleurs pour les hautes lumières. Une valeur de 0.0 rend l'image en niveaux de gris, tandis que des valeurs supérieures à 1.0 augmentent la vivacité des couleurs.",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": 0.0,
                                        "maximum": 10.0
                                    }
                                }
                            }
                        },
                        "shadows": {
                            "description": "Paramètres de color grading facultatifs pour les ombres. \nType: `Object`",
                            "type": "object",
                            "required": ["enabled"],
                            "properties": {
                                "enabled": {
                                    "description": "Active ou désactive les paramètres de color grading pour les ombres. \nType: `Boolean`",
                                    "type": "boolean"
                                },
                                "shadowsMax": {
                                    "description": "Définit le seuil maximal de luminance pour que les pixels soient considérés comme des ombres. \nType: `Number`",
                                    "type": "number",
                                    "minimum": 0.1,
                                    "maximum": 1.0
                                },
                                "contrast": {
                                    "description": "Ajuste la différence de luminance entre les pixels clairs et sombres de l'image pour les ombres. Un contraste élevé rendra l'image plus dynamique, tandis qu'un faible contraste la rendra plus douce. \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": 0.0,
                                        "maximum": 4.0
                                    }
                                },
                                "gain": {
                                    "description": "Multiplie l'intensité lumineuse de chaque canal de couleur pour les ombres. Cela affecte plus fortement les pixels clairs que les pixels sombres. Une valeur plus élevée rend l'image plus lumineuse. \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": 0.0,
                                        "maximum": 10.0
                                    }
                                },
                                "gamma": {
                                    "description": "Applique une correction exponentielle de la luminance après le color grading pour les ombres. Cela ajuste la clarté des tons intermédiaires. Des valeurs plus faibles rendent l'image plus sombre, des valeurs plus élevées la rendent plus claire. \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": 0.0,
                                        "maximum": 4.0
                                    }
                                },
                                "offset": {
                                    "description": "Ajoute une valeur à la luminance moyenne de l'image pour ajuster son intensité globale pour les ombres. Une valeur positive éclaircit l'image, tandis qu'une valeur négative la rend plus sombre. \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -1.0,
                                        "maximum": 1.0
                                    }
                                },
                                "saturation": {
                                    "description": "Ajuste l'intensité des couleurs pour les ombres. Une valeur de 0.0 rend l'image en niveaux de gris, tandis que des valeurs supérieures à 1.0 augmentent la vivacité des couleurs. \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": 0.0,
                                        "maximum": 10.0
                                    }
                                }
                            }
                        }
                    }
                },
                "tone_mapping": {
                    "description": "Définit les paramètres de tone mapping qui ajuste la gamme dynamique des couleurs d'une image HDR (High Dynamic Range) pour l'afficher correctement sur des écrans ayant une plage dynamique plus limitée (SDR - Standard Dynamic Range). \nType: `Object`",
                    "type": "object",
                    "properties": {
                        "operator": {
                            "description": "L'opérateur de tone mapping à utiliser.",
                            "type": "string",
                            "enum": ["reinhard", "reinhard_luma", "reinhard_luminance", "hable", "aces"]
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
                action: 'add',
                target: ["properties", "minecraft:color_grading_settings", "properties", "color_grading", "properties", "temperature"],
                value: {
                    "description": "Paramètres de color grading facultatifs pour la température des couleurs. \nType: `Object`",
                    "type": "object",
                    "required": ["enabled"],
                    "properties": {
                        "enabled": {
                            "description": "Active ou désactive les paramètres de color grading pour la température des couleurs. \nType: `Boolean`",
                            "type": "boolean"
                        },
                        "temperature": {
                            "description": "Ajuste la température des couleurs de l'image. Des valeurs positives rendent l'image plus chaude (plus de rouge et de jaune), tandis que des valeurs négatives la rendent plus froide (plus de bleu). \nType: `Number`",
                            "type": "number",
                            "minimum": 1000,
                            "maximum": 15000
                        },
                        "type": {
                            "description": "Le type de température des couleurs à appliquer. \nType: `String`",
                            "type": "string",
                            "enum": ["white_balance", "color_temperature"]
                        }
                    }
                }
            }
        ]
    }
];

export const colorGradingSettingsSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/color_grading/*.json"],
    baseSchema: baseSchema,
    versionedChanges: versionedChanges
};