import { SchemaChange, SchemaType } from "../../../../../types/schema";
import { dynamicExamplesSourceKeys } from "../../../utils/shared/schemaEnums";
import { schemaPatterns } from "../../../utils/shared/schemaPatterns";
import { MinecraftJsonSchema } from "../../../../../types/minecraftJsonSchema";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier sert à définir des paramètres visuels de l'eau pour le mode graphique `Vibrant Visuals`.",
    type: "object",
    required: ["format_version", "minecraft:water_settings"],
    properties: {
        format_version: {
            description: "La version du format à utiliser.",
            type: "string",
            enum: [
                "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
            ]
        },
        "minecraft:water_settings": {
            description: "Contient la définition des paramètres de l'eau.",
            type: "object",
            required: ["description"],
            properties: {
                description: {
                    description: "Description des paramètres de l'eau.",
                    type: "object",
                    required: ["identifier"],
                    properties: {
                        identifier: {
                            description: "L'identifiant des paramètres de l'eau.",
                            type: "string",
                            pattern: schemaPatterns.identifier_with_namespace,
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_water_settings_ids
                        }
                    }
                },
                particle_concentrations: {
                    description: "Définit la composition des particules dans l'eau. En fonction des concentrations, l'eau peut apparaître plus jaune, verte ou rougeâtre.",
                    type: "object",
                    properties: {
                        cdom: {
                            description: "Définit la concentration de matière organique dissoute colorée (CDOM) en milligrammes par litre. Des concentrations élevées donnent des couleurs jaunes à jaune-brun à l'eau.`",
                            type: "number",
                            minimum: 0.0,
                            maximum: 15.0
                        },
                        chlorophyll: {
                            description: "Définit la concentration de chlorophylle pour l'eau. Des concentrations élevées donnent une couleur verte à l'eau.",
                            type: "number",
                            minimum: 0.0,
                            maximum: 10.0
                        },
                        suspended_sediment: {
                            description: "Définit la concentration de sédiments en suspension dans l'eau. Des concentrations élevées donnent des couleurs rouges à rouge-brun à l'eau.",
                            type: "number",
                            minimum: 0.0,
                            maximum: 300.0
                        }
                    }
                },
                waves: {
                    description: "Définit les paramètres des vagues de l'eau. Les vagues sont un effet uniquement visuel, elles n'affectent pas la physique de l'eau comme la hauteur de l'eau ou le mouvement des entités.",
                    type: "object",
                    properties: {
                        enabled: {
                            description: "Définit si les vagues sont activées ou non.",
                            type: "boolean"
                        },
                        depth: {
                            description: "Contrôle l'amplitude du déplacement des vagues. Des valeurs plus élevées entraînent des vagues plus profondes et plus visibles.",
                            type: "number",
                            minimum: 0.0,
                            maximum: 3.0
                        },
                        frequency: {
                            description: "Détermine la taille des vagues individuelles. Des valeurs élevées créent des vagues plus rapprochées.",
                            type: "number",
                            minimum: 0.01,
                            maximum: 3.0
                        },
                        frequency_scaling: {
                            description: "Contrôle comment la taille des vagues change entre les différentes octaves (couches de vagues superposées).",
                            type: "number",
                            minimum: 0.0,
                            maximum: 2.0
                        },
                        mix: {
                            description: "Définit à quel point les vagues de chaque octave se fondent entre elles. Plus la valeur est élevée, plus les vagues paraissent lisses et continues.",
                            type: "number",
                            minimum: 0.0,
                            maximum: 1.0
                        },
                        octaves: {
                            description: "Définit le nombre de couches (ou octaves) simulées pour les vagues. Plus le nombre est élevé, plus les vagues deviennent complexes et détaillées.",
                            type: "integer",
                            minimum: 1,
                            maximum: 30
                        },
                        pull: {
                            description: "Influence l'attraction des petites vagues vers les vagues plus grandes. Des valeurs positives amplifient cet effet, tandis que des valeurs négatives le réduisent.",
                            type: "number",
                            minimum: -1.0,
                            maximum: 1.0
                        },
                        sampleWidth: {
                            description: "Contrôle la résolution de l'effet fractal utilisé pour les vagues. Une valeur plus élevée produit des vagues plus lisses.`",
                            type: "number",
                            minimum: 0.01,
                            maximum: 1.0
                        },
                        shape: {
                            description: "Ajuste la forme des vagues. Cela peut modifier leur apparence visuelle (plus arrondies, plus angulaires, etc.).",
                            type: "number",
                            minimum: 1.0,
                            maximum: 10.0
                        },
                        speed: {
                            description: "Contrôle la vitesse de déplacement initiale des vagues.",
                            type: "number",
                            minimum: 0.01,
                            maximum: 10.0
                        },
                        speed_scaling: {
                            description: "Ajuste la vitesse relative des octaves suivantes. Des valeurs élevées augmentent la variation de vitesse entre les couches.",
                            type: "number",
                            minimum: 0.0,
                            maximum: 2.0
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
                    description: "Définit les paramètres du rendu des caustiques sous l'eau (motifs lumineux dynamiques projetés par l'eau sur les surfaces immergées). Permet d'activer ou non cet effet, de régler la vitesse d'animation, la puissance lumineuse, l'échelle des motifs, et d'utiliser une texture personnalisée.",
                    type: "object",
                    properties: {
                        enabled: {
                            description: "Active ou désactive l'effet de caustiques sous l'eau. Si false ou non défini, aucun motif lumineux ne sera affiché.",
                            type: "boolean"
                        },
                        frame_length: {
                            description: "Nombre de secondes pendant lesquelles chaque frame de l'animation des caustiques est affichée. Des valeurs faibles rendent l'animation plus rapide, des valeurs élevées la ralentissent.",
                            type: "number",
                            minimum: 0.01,
                            maximum: 5.0
                        },
                        power: {
                            description: "Contrôle la luminosité des caustiques. Plus la valeur est élevée, plus l'effet lumineux sera intense.",
                            type: "integer",
                            minimum: 1,
                            maximum: 6
                        },
                        scale: {
                            description: "Contrôle la taille de répétition du motif de caustiques. Plus la valeur est basse, plus les motifs sont petits et répétés souvent. Plus elle est haute, plus ils sont grands.",
                            type: "number",
                            minimum: 0.1,
                            maximum: 5.0
                        },
                        texture: {
                            description: "Chemin de la ressource pour la texture personnalisée de caustiques (ex: 'textures/effects/my_caustics.png'). Si non défini, une texture interne de Minecraft sera utilisée.",
                            type: "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.texture_file_paths
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