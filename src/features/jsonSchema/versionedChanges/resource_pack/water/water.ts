import { SchemaChange, SchemaType } from "../../../../../types/schema";
import { dynamicExamplesSourceKeys } from "../../../shared/schemaEnums";
import { schemaPatterns } from "../../../shared/schemaPatterns";

const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Ce fichier sert à configurer les caractéristiques de l'eau dans Minecraft. \nType: `Object`",
    "required": ["format_version", "minecraft:water_settings"],
    "properties": {
        "format_version": {
            "description": "La version du format à utiliser. \nType: `String`",
            "type": "string",
            enum: [
                "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90"
            ]
        },
        "minecraft:water_settings": {
            "description": "Contient la définition des paramètres de l'eau. \nType: `Object`",
            "type": "object",
            "required": ["description"],
            "properties": {
                "description": {
                    "description": "Description des paramètres de l'eau. \nType: `Object`",
                    "type": "object",
                    "required": ["identifier"],
                    "properties": {
                        "identifier": {
                            "description": "L'identifiant des paramètres de l'eau. \nType: `String`",
                            "type": "string",
                            pattern: schemaPatterns.identifier_with_namespace,
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_water_settings_ids
                        }
                    }
                },
                "particle_concentrations": {
                    "description": "Définit les concentrations de particules dans l'eau. \nType: `Object`",
                    "type": "object",
                    "properties": {
                        "cdom": {
                            "description": "La concentration de matière organique dissoute chromophorique en milligrammes par litre. Plus les concentrations sont élevées, plus l'eau prendra des teintes jaunes ou jaune-brun. \nType: `Number`",
                            "type": "number",
                            "minimum": 0.0,
                            "maximum": 15.0
                        },
                        "chlorophyll": {
                            "description": "La concentration de chlorophylle en milligrammes par litre. Des concentrations élevées donnent une couleur plus verte à l'eau. \nType: `Number`",
                            "type": "number",
                            "minimum": 0.0,
                            "maximum": 10.0
                        },
                        "suspended_sediment": {
                            "description": "La concentration de sédiments en suspension en milligrammes par litre. Plus les concentrations sont élevées, plus l'eau apparaît rougeâtre ou brun-rougeâtre. \nType: `Number`",
                            "type": "number",
                            "minimum": 0.0,
                            "maximum": 300.0
                        }
                    }
                },
                "waves": {
                    "description": "Définit les paramètres des vagues dans l'eau. \nType: `Object`",
                    "type": "object",
                    "properties": {
                        "enabled": {
                            "description": "Détermine si les vagues sont activées ou non. \nType: `Boolean`",
                            "type": "boolean"
                        },
                        "depth": {
                            "description": "Contrôle l'amplitude du déplacement des vagues. Des valeurs plus élevées entraînent des vagues plus profondes et plus visibles. \nType: `Number`",
                            "type": "number",
                            "minimum": 0.0,
                            "maximum": 3.0
                        },
                        "frequency": {
                            "description": "Détermine la taille des vagues individuelles. Des valeurs élevées créent des vagues plus petites et plus rapprochées. \nType: `Number`",
                            "type": "number",
                            "minimum": 0.01,
                            "maximum": 3.0
                        },
                        "frequency_scaling": {
                            "description": "Contrôle la variation des fréquences entre les octaves successives. Cela influence la complexité globale des vagues. \nType: `Number`",
                            "type": "number",
                            "minimum": 0.0,
                            "maximum": 2.0
                        },
                        "mix": {
                            "description": "Contrôle la manière dont chaque octave (niveau de détail des vagues) se mélange avec les octaves voisines. Une valeur plus élevée donne des vagues plus lissées. \nType: `Number`",
                            "type": "number",
                            "minimum": 0.0,
                            "maximum": 1.0
                        },
                        "octaves": {
                            "description": "Définit le nombre de couches (ou octaves) simulées pour les vagues. Plus le nombre est élevé, plus les vagues deviennent complexes et détaillées. \nType: `Integer`",
                            "type": "integer",
                            "minimum": 1,
                            "maximum": 30
                        },
                        "pull": {
                            "description": "Influence l'attraction des petites vagues vers les vagues plus grandes. Des valeurs positives amplifient cet effet, tandis que des valeurs négatives le réduisent. \nType: `Number`",
                            "type": "number",
                            "minimum": -1.0,
                            "maximum": 1.0
                        },
                        "sampleWidth": {
                            "description": "Contrôle la résolution de l'effet fractal utilisé pour les vagues. Une valeur plus élevée produit des vagues plus lisses. \nType: `Number`",
                            "type": "number",
                            "minimum": 0.01,
                            "maximum": 1.0
                        },
                        "shape": {
                            "description": "Ajuste la forme des vagues. Cela peut modifier leur apparence visuelle (plus arrondies, plus angulaires, etc.). \nType: `Number`",
                            "type": "number",
                            "minimum": 1.0,
                            "maximum": 10.0
                        },
                        "speed": {
                            "description": "Contrôle la vitesse de déplacement initiale des vagues. \nType: `Number`",
                            "type": "number",
                            "minimum": 0.01,
                            "maximum": 10.0
                        },
                        "speed_scaling": {
                            "description": "Ajuste la vitesse relative des octaves suivantes. Des valeurs élevées augmentent la variation de vitesse entre les couches. \nType: `Number`",
                            "type": "number",
                            "minimum": 0.0,
                            "maximum": 2.0
                        }
                    }
                }
            }
        }
    }
};

const versionedChanges: SchemaChange[] = [
    {
        version: "1.21.80",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:water_settings", "properties", "caustics"],
                value: {
                    "description": "Définit les paramètres du rendu des caustiques sous l'eau (motifs lumineux dynamiques projetés par l'eau sur les surfaces immergées). Permet d'activer ou non cet effet, de régler la vitesse d'animation, la puissance lumineuse, l'échelle des motifs, et d'utiliser une texture personnalisée.",
                    "type": "object",
                    "properties": {
                        "enabled": {
                            "description": "Active ou désactive l'effet de caustiques sous l'eau. Si false ou non défini, aucun motif lumineux ne sera affiché. \nType: `Boolean`",
                            "type": "boolean"
                        },
                        "frame_length": {
                            "description": "Nombre de secondes pendant lesquelles chaque frame de l'animation des caustiques est affichée. Des valeurs faibles rendent l'animation plus rapide, des valeurs élevées la ralentissent. \nType: `Number`",
                            "type": "number",
                            "minimum": 0.01,
                            "maximum": 5.0
                        },
                        "power": {
                            "description": "Contrôle la luminosité des caustiques. Plus la valeur est élevée, plus l'effet lumineux sera intense. Valeur typique : entre 1 et 6. \nType: `Integer`",
                            "type": "integer",
                            "minimum": 1,
                            "maximum": 6
                        },
                        "scale": {
                            "description": "Contrôle la taille de répétition du motif de caustiques. Plus la valeur est basse, plus les motifs sont petits et répétés souvent. Plus elle est haute, plus ils sont grands. \nType: `Number`",
                            "type": "number",
                            "minimum": 0.1,
                            "maximum": 5.0
                        },
                        "texture": {
                            "description": "Chemin de la ressource pour la texture personnalisée de caustiques (ex: 'textures/effects/my_caustics.png'). Si non défini, une texture interne de Minecraft sera utilisée. \nType: `String`",
                            "type": "string"
                        }
                    }
                }
            }
        ]
    }
];

export const waterSettingsSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/water/*.json"],
    baseSchema: baseSchema,
    versionedChanges: versionedChanges
};