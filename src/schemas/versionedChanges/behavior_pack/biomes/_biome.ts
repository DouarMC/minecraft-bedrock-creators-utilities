import { commonSchemas } from "../../../utils/commonSchemas";
import { dynamicExamplesSourceKeys } from "../../../utils/schemaEnums";


export const baseSchema = {
    $schema: "https://json-schema.org/draft-07/schema#",
    markdownDescription:
    "[ℹ️**Expérimentale**]: `Custom Biomes`\n\n" +
    "Ce fichier crée un Biome.",
    type: "object",
    required: ["format_version", "minecraft:biome"],
    properties: {
        format_version: {
            description: "La version du format à utiliser.",
            type: "string",
            enum: [
                "1.13.0", "1.14.0", "1.14.1", "1.14.20", "1.14.30", "1.15.0", "1.16.0", "1.16.20", "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90"
            ]
        },
        "minecraft:biome": {
            description: "Contient la définition du Biome.",
            type: "object",
            required: ["description", "components"],
            properties: {
                description: {
                    description: "Contient la description du Biome.",
                    type: "object",
                    required: ["identifier"],
                    properties: {
                        identifier: {
                            description: "L'identifiant du Biome.",
                            type: "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.biome_ids
                        }
                    }
                },
                components: {
                    description: "Contient les components du Biome.",
                    type: "object",
                    properties: {
                        "minecraft:capped_surface": {
                            description: "Génère une surface sur les blocs avec des blocs non solides au-dessus ou en dessous.",
                            type: "object",
                            required: ["floor_materials", "ceiling_materials", "sea_material", "foundation_material"],
                            properties: {
                                beach_material: {
                                    description: "Le bloc utilisé pour décorer la surface près du niveau de la mer.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                floor_materials: {
                                    description: "Blocs utilisés pour la surface au niveau du sol.",
                                    type: "array",
                                    minItems: 1,
                                    items: {
                                        oneOf: [
                                            {
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                            },
                                            commonSchemas.block_descriptor
                                        ]
                                    }
                                },
                                ceiling_materials: {
                                    description: "Blocs utilisés pour la surface au niveau du plafond.",
                                    type: "array",
                                    minItems: 1,
                                    items: {
                                        oneOf: [
                                            {
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                            },
                                            commonSchemas.block_descriptor
                                        ]
                                    }
                                },
                                foundation_material: {
                                    description: "Bloc utilisé pour remplacer les blocs solides qui ne sont pas des blocs de surface.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                sea_material: {
                                    description: "Bloc utilisé pour remplacer les blocs d'air sous le niveau de la mer.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                }
                            }
                        },
                        "minecraft:climate": {
                            description: "Définit la temprature, l'humidité, les précipitations et similaires. Les Biomes sans ce composant auront des valeurs par défaut.",
                            type: "object",
                            properties: {
                                blue_spores: {
                                    description: "Densité des visuels de précipitations de spores bleues.",
                                    type: "number"
                                },
                                downfall: {
                                    description: "Quantité que les précipitations affectent les couleurs et les changements de blocs.",
                                    type: "number"
                                },
                                snow_accumulation: {
                                    description: "Quantité minimum et maximum de niveau de couche de neige, chaque multiple de 0.125 est une autre couche de neige.",
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                                white_ash: {
                                    description: "Densité des visuels de précipitations de cendres blanches.",
                                    type: "number"
                                },
                                temperature: {
                                    description: "La temperature affecte une variété de choses visuelles et comportementales, y compris le placement de la neige et de la glace, le séchage de l'éponge et la couleur du ciel.",
                                    type: "number"
                                },
                                red_spores: {
                                    description: "Densité des visuels de précipitations de spores rouges.",
                                    type: "number"
                                },
                                ash: {
                                    description: "Densité des visuels de précipitations de cendres.",
                                    type: "number"
                                }
                            }
                        },
                        "minecraft:creature_spawn_probability": {
                            description: "Définit la probabilité que les créatures apparaissent dans le Biome lorsqu'un chunk est généré.",
                            type: "object",
                            properties: {
                                probability: {
                                    description: "Probabilité entre [0.0, 0.75] que les créatures apparaissent dans le Biome lorsqu'un chunk est généré.",
                                    type: "number",
                                    minimum: 0,
                                    maximum: 0.75
                                }
                            }
                        },
                        "minecraft:frozen_ocean_surface": {
                            description: "Définit la surface de l'océan gelé en ajoutant des icebergs.",
                            type: "object",
                            required: ["sea_floor_depth", "mid_material", "sea_floor_material", "foundation_material", "top_material", "sea_material"],
                            properties: {
                                mid_material: {
                                    description: "Controle le type de bloc utilisé dans une couche sous la surface de ce biome.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                sea_floor_depth: {
                                    description: "Contrôle à quelle profondeur sous le niveau mondial des eaux le fond de l'océan devrait se produire.",
                                    type: "integer"
                                },
                                sea_floor_material: {
                                    description: "Contrôle le type de bloc utilisé comme sol pour les étendues d'eau dans ce biome.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                sea_material: {
                                    description: "Contrôle le type de bloc utilisé pour les étendues d'eau dans ce biome.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                top_material: {
                                    description: "Contrôle le type de bloc utilisé pour la surface de ce biome.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                foundation_material: {
                                    description: "Contrôle le type de bloc utilisé profondément sous terre dans ce biome.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                }
                            }
                        },
                        "minecraft:mesa_surface": {
                            description: "Ajoute des strates colorées et des piliers optionnels.",
                            type: "object",
                            required: ["mid_material", "sea_floor_depth", "sea_floor_material", "hard_clay_material", "sea_material", "top_material", "foundation_material", "clay_material", "bryce_pillars", "has_forest"],
                            properties: {
                                sea_floor_depth: {
                                    description: "Contrôle à quelle profondeur sous le niveau mondial des eaux le fond de l'océan devrait se produire.",
                                    type: "integer"
                                },
                                mid_material: {
                                    description: "Contrôle le type de bloc utilisé dans une couche sous la surface de ce biome.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                sea_floor_material: {
                                    description: "Contrôle le type de bloc utilisé comme sol pour les étendues d'eau dans ce biome.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                foundation_material: {
                                    description: "Contrôle le type de bloc utilisé profondément sous terre dans ce biome.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                top_material: {
                                    description: "Contrôle le type de bloc utilisé pour la surface de ce biome.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                sea_material: {
                                    description: "Contrôle le type de bloc utilisé pour les étendues d'eau dans ce biome.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                hard_clay_material: {
                                    description: "Contrôle le type de bloc utilisé pour les strates de terre cuite dure dans ce biome.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                clay_material: {
                                    description: "Contrôle le type de bloc utilisé pour les strates d'argile dans ce biome.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                bryce_pillars: {
                                    description: "Si vrai, ajoute des piliers Bryce dans le biome.",
                                    type: "boolean"
                                },
                                has_forest: {
                                    description: "Si vrai, place de la terre grossière et de l'herbe à haute altitude.",
                                    type: "boolean"
                                }
                            }
                        },
                        "minecraft:mountain_parameters": {
                            description: "Définit les paramètres de bruit utilisés pour générer le terrain de montagne dans l'Overworld.",
                            type: "object",
                            properties: {
                                steep_material_adjustment: {
                                    description: "Définit le bloc de surface utilisé pour les pentes raides et des paramètres.",
                                    type: "object",
                                    properties: {
                                        material: {
                                            description: "Le bloc de surface utilisé pour les pentes raides.",
                                            oneOf: [
                                                {
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                },
                                                commonSchemas.block_descriptor
                                            ]
                                        },
                                        east_slopes: {
                                            description: "Activer pour les pentes orientées à l'est.",
                                            type: "boolean"
                                        },
                                        north_slopes: {
                                            description: "Activer pour les pentes orientées au nord.",
                                            type: "boolean"
                                        },
                                        south_slopes: {
                                            description: "Activer pour les pentes orientées au sud.",
                                            type: "boolean"
                                        },
                                        west_slopes: {
                                            description: "Activer pour les pentes orientées à l'ouest.",
                                            type: "boolean"
                                        }
                                    }
                                },
                                top_slide: {
                                    description: "Contrôle la diminution de la densité qui se produit au sommet du monde pour empêcher le terrain d'atteindre trop haut.",
                                    type: "object",
                                    required: ["enabled"],
                                    properties: {
                                        enabled: {
                                            description: "Si false, le top slide sera désactivé. Si true, les autres paramètres seront pris en compte.",
                                            type: "boolean"
                                        }
                                    }
                                }
                            }
                        },
                        "minecraft:multinoise_generation_rules": {
                            description: "Contrôle comment ce biome est instancié (et potentiellement modifié) lors de la génération du monde du Nether.",
                            type: "object",
                            properties: {
                                target_weirdness: {
                                    description: "Weirdness avec lequel ce biome devrait être généré, par rapport aux autres biomes.",
                                    type: "number"
                                },
                                target_temperature: {
                                    description: "Température avec laquelle ce biome devrait être généré, par rapport aux autres biomes.",
                                    type: "number"
                                },
                                target_humidity: {
                                    description: "Humidité avec laquelle ce biome devrait être généré, par rapport aux autres biomes.",
                                    type: "number"
                                },
                                target_altitude: {
                                    description: "Altitude avec laquelle ce biome devrait être généré, par rapport aux autres biomes.",
                                    type: "number"
                                },
                                weight: {
                                    description: "Poids avec lequel ce biome devrait être généré, par rapport aux autres biomes.",
                                    type: "number"
                                }
                            }
                        },
                        "minecraft:overworld_generation_rules": {
                            description: "Définit comment ce Biome est instancié (et potentiellement modifié) lors de la génération du monde de l'overworld.",
                            type: "object",
                            properties: {
                                mutate_transformation: {
                                    description: "Quel Biome utiliser pour convertir en Biome muté. Peut être juste le nom de chaîne d'un Biome, ou un tableau de n'importe quelle taille. Si un tableau, chaque entrée peut être une chaîne de nom de Biome, ou un tableau de taille 2, où la première entrée est un nom de Biome et la deuxième entrée est un entier positif représentant comment ce Biome est pondéré par rapport aux autres entrées. Si aucun poids n'est fourni, un poids de 1 est utilisé.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.biome_ids
                                        },
                                        {
                                            type: "array",
                                            items: {
                                                oneOf: [
                                                    {
                                                        type: "string",
                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.biome_ids
                                                    },
                                                    {
                                                        type: "array",
                                                        minItems: 2,
                                                        maxItems: 2,
                                                        items: [
                                                            {
                                                                type: "string",
                                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.biome_ids
                                                            },
                                                            {
                                                                default: 1,
                                                                type: "integer",
                                                                minimum: 0
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                },
                                hills_transformation: {
                                    description: "Quel Biome utiliser pour convertir en Biome de collines. Peut être juste le nom de chaîne d'un Biome, ou un tableau de n'importe quelle taille. Si un tableau, chaque entrée peut être une chaîne de nom de Biome, ou un tableau de taille 2, où la première entrée est un nom de Biome et la deuxième entrée est un entier positif représentant comment ce Biome est pondéré par rapport aux autres entrées. Si aucun poids n'est fourni, un poids de 1 est utilisé.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.biome_ids
                                        },
                                        {
                                            type: "array",
                                            items: {
                                                oneOf: [
                                                    {
                                                        type: "string",
                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.biome_ids
                                                    },
                                                    {
                                                        type: "array",
                                                        minItems: 2,
                                                        maxItems: 2,
                                                        items: [
                                                            {
                                                                type: "string",
                                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.biome_ids
                                                            },
                                                            {
                                                                default: 1,
                                                                type: "integer",
                                                                minimum: 0
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                },
                                generate_for_climates: {
                                    description: "Contrôle les catégories de climat de génération de monde pour lesquelles ce Biome peut apparaître. Un seul Biome peut être associé à plusieurs catégories avec des pondérations différentes. Un tableau de n'importe quelle taille. Chaque entrée doit être un tableau de taille 2, où la première entrée est une chaîne de catégorie de climat ('medium', 'warm', 'lukewarm', 'cold', ou 'frozen'), et la deuxième entrée est un entier positif représentant comment ce Biome est pondéré par rapport aux autres entrées. Si aucun poids n'est fourni, un poids de 1 est utilisé.",
                                    type: "array",
                                    items: {
                                        type: "array",
                                        minItems: 2,
                                        maxItems: 2,
                                        items: [
                                            {
                                                type: "string",
                                                enum: ["medium", "warm", "lukewarm", "cold", "frozen"]
                                            },
                                            {
                                                default: 1,
                                                type: "integer",
                                                minimum: 0
                                            }
                                        ]
                                    }
                                },
                                river_transformation: {
                                    description: "Quel Biome utiliser pour convertir en Biome de rivière. Peut être juste le nom de chaîne d'un Biome, ou un tableau de n'importe quelle taille. Si un tableau, chaque entrée peut être une chaîne de nom de Biome, ou un tableau de taille 2, où la première entrée est un nom de Biome et la deuxième entrée est un entier positif représentant comment ce Biome est pondéré par rapport aux autres entrées. Si aucun poids n'est fourni, un poids de 1 est utilisé.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.biome_ids
                                        },
                                        {
                                            type: "array",
                                            items: {
                                                oneOf: [
                                                    {
                                                        type: "string",
                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.biome_ids
                                                    },
                                                    {
                                                        type: "array",
                                                        minItems: 2,
                                                        maxItems: 2,
                                                        items: [
                                                            {
                                                                type: "string",
                                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.biome_ids
                                                            },
                                                            {
                                                                default: 1,
                                                                type: "integer",
                                                                minimum: 0
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                },
                                shore_transformation: {
                                    description: "Quel Biome utiliser pour convertir en Biome d'océan. Peut être juste le nom de chaîne d'un Biome, ou un tableau de n'importe quelle taille. Si un tableau, chaque entrée peut être une chaîne de nom de Biome, ou un tableau de taille 2, où la première entrée est un nom de Biome et la deuxième entrée est un entier positif représentant comment ce Biome est pondéré par rapport aux autres entrées. Si aucun poids n'est fourni, un poids de 1 est utilisé.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.biome_ids
                                        },
                                        {
                                            type: "array",
                                            items: {
                                                oneOf: [
                                                    {
                                                        type: "string",
                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.biome_ids
                                                    },
                                                    {
                                                        type: "array",
                                                        minItems: 2,
                                                        maxItems: 2,
                                                        items: [
                                                            {
                                                                type: "string",
                                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.biome_ids
                                                            },
                                                            {
                                                                default: 1,
                                                                type: "integer",
                                                                minimum: 0
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        "minecraft:overworld_height": {
                            description: "Définit les paramètres de bruit qui influencent la hauteur du terrain dans l'Overworld.",
                            type: "object",
                            properties: {
                                noise_type: {
                                    description: "Définit un préréglage basé sur un paramètre intégré plutôt que d'utiliser manuellement noise_params.",
                                    type: "string",
                                    enum: [
                                        "default", "default_mutated", "river", "ocean", "deep_ocean", "lowlands", "taiga", "mountains", "highlands", "extreme", "less_extreme", "beach", "stone_beach", "mushroom", "swamp"
                                    ]
                                },
                                noise_params: {
                                    description: "La première valeur est la profondeur - plus négative signifie plus profond sous l'eau, tandis que plus positive signifie plus haut. La deuxième valeur est l'échelle, qui affecte la façon dont le bruit change lorsqu'il se déplace de la surface.",
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                }
                            }
                        },
                        "minecraft:replace_biomes": {
                            description: "Remplace une portion spécifiée d'un ou plusieurs biomes par ce Biome.",
                            type: "object",
                            required: ["replacements"],
                            properties: {
                                replacements: {
                                    description: "Liste des configurations de remplacement de biome. L'ajout rétroactif d'un nouveau remplacement au début de cette liste modifiera la génération du monde. Veuillez ajouter tout nouveau remplacement à la fin de la liste.",
                                    type: "array",
                                    items: {
                                        type: "object",
                                        required: ["dimension", "amount", "targets", "noise_frequency_scale"],
                                        properties: {
                                            dimension: {
                                                description: "Dimension dans laquelle ce remplacement peut se produire. Doit être 'minecraft:overworld'.",
                                                type: "string",
                                                enum: ["minecraft:overworld"]
                                            },
                                            targets: {
                                                description: "Liste des biomes qui seront remplacés par le biome de remplacement. Les biomes ciblés ne doivent pas contenir de namespaces.",
                                                type: "array",
                                                minItems: 1,
                                                items: {
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.biome_ids
                                                }
                                            },
                                            amount: {
                                                description: "Valeur de bruit utilisée pour déterminer si le remplacement est tenté ou non, similaire à un pourcentage.",
                                                type: "number",
                                                exclusiveMinimum: 0,
                                                maximum: 1
                                            },
                                            noise_frequency_scale: {
                                                description: "Valeur d'échelle utilisée pour modifier la fréquence des tentatives de remplacement. Une fréquence plus basse signifiera une plus grande zone de biome contigu qui se produit moins souvent. Une fréquence plus élevée signifiera des zones de biome contigu plus petites qui se produisent plus souvent.",
                                                type: "number",
                                                exclusiveMinimum: 0,
                                                maximum: 100
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "minecraft:surface_material_adjustments": {
                            description: "Spécifie des modifications de détail fin aux blocs utilisés dans la génération de terrain (basée sur une fonction de bruit).",
                            type: "object",
                            properties: {
                                adjustments: {
                                    description: "Toutes les modifications qui correspondent aux valeurs de bruit de la colonne seront appliquées dans l'ordre indiqué.",
                                    type: "array",
                                    items: {
                                        type: "object",
                                        required: ["materials"],
                                        properties: {
                                            materials: {
                                                description: "Les blocs spécifiques utilisés pour cet ajustement de surface.",
                                                type: "array",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        sea_material: {
                                                            description: "Contrôle le type de bloc utilisé pour les étendues d'eau dans ce biome lorsque cet ajustement est actif.",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        },
                                                        foundation_material: {
                                                            description: "Contrôle le type de bloc utilisé profondément sous terre dans ce biome lorsque cet ajustement est actif.",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        },
                                                        top_material: {
                                                            description: "Contrôle le type de bloc utilisé pour la surface de ce biome lorsque cet ajustement est actif.",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        },
                                                        mid_material: {
                                                            description: "Contrôle le type de bloc utilisé dans une couche sous la surface de ce biome lorsque cet ajustement est actif.",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        },
                                                        sea_floor_material: {
                                                            description: "Contrôle le type de bloc utilisé comme sol pour les étendues d'eau dans ce biome lorsque cet ajustement est actif.",
                                                            oneOf: [
                                                                {
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                                },
                                                                commonSchemas.block_descriptor
                                                            ]
                                                        },
                                                    }
                                                }
                                            },
                                            noise_range: {
                                                description: "Définit une plage de valeurs de bruit [min, max] pour lesquelles cet ajustement doit être appliqué.",
                                                type: "array",
                                                minItems: 2,
                                                maxItems: 2,
                                                items: {
                                                    type: "number"
                                                }
                                            },
                                            height_range: {
                                                description: "Définit une plage de valeurs de hauteur [min, max] pour lesquelles cet ajustement doit être appliqué.",
                                                type: "array",
                                                minItems: 2,
                                                maxItems: 2,
                                                items: {
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "boolean"
                                                        },
                                                        {
                                                            type: "string"
                                                        }
                                                    ]
                                                }
                                            },
                                            noise_frequency_scale: {
                                                description: "L'échelle pour multiplier par la position lors de l'accès à la valeur de bruit pour les ajustements de matériaux.",
                                                type: "number"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "minecraft:surface_parameters": {
                            description: "Contrôle les blocs utilisés pour la génération de terrain par défaut de l'Overworld.",
                            type: "object",
                            required: ["sea_floor_depth", "mid_material", "sea_floor_material", "foundation_material", "top_material","sea_material"],
                            properties: {
                                sea_floor_depth: {
                                    description: "Contrôle à quelle profondeur sous le niveau mondial des eaux le fond de l'océan devrait se produire.",
                                    type: "integer"
                                },
                                mid_material: {
                                    description: "Contrôle le type de bloc utilisé dans une couche sous la surface de ce biome.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                sea_floor_material: {
                                    description: "Contrôle le type de bloc utilisé comme sol pour les étendues d'eau dans ce biome.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                sea_material: {
                                    description: "Contrôle le type de bloc utilisé pour les étendues d'eau dans ce biome.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                top_material: {
                                    description: "Contrôle le type de bloc utilisé pour la surface de ce biome.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                foundation_material: {
                                    description: "Contrôle le type de bloc utilisé profondément sous terre dans ce biome.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                }
                            }
                        },
                        "minecraft:swamp_surface": {
                            description: "Similaire à overworld_surface. Ajoute des détails de surface de marais.",
                            type: "object",
                            required: ["sea_floor_depth", "mid_material", "sea_floor_material", "foundation_material", "top_material", "sea_material"],
                            properties: {
                                mid_material: {
                                    description: "Contrôle le type de bloc utilisé dans une couche sous la surface de ce biome.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                sea_floor_depth: {
                                    description: "Contrôle à quelle profondeur sous le niveau mondial des eaux le fond de l'océan devrait se produire.",
                                    type: "integer"
                                },
                                sea_floor_material: {
                                    description: "Contrôle le type de bloc utilisé comme sol pour les étendues d'eau dans ce biome.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                sea_material: {
                                    description: "Contrôle le type de bloc utilisé pour les étendues d'eau dans ce biome.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                top_material: {
                                    description: "Contrôle le type de bloc utilisé pour la surface de ce biome.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                },
                                foundation_material: {
                                    description: "Contrôle le type de bloc utilisé profondément sous terre dans ce biome.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                        },
                                        commonSchemas.block_descriptor
                                    ]
                                }
                            }
                        },
                        "minecraft:tags": {
                            description: "Attache des tags de chaîne arbitraires à ce Biome.",
                            type: "object",
                            required: ["tags"],
                            properties: {
                                tags: {
                                    description: "Liste des tags de chaîne à attacher à ce Biome.",
                                    type: "array",
                                    items: {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.biome_tags
                                    }
                                }
                            }
                        },
                        "minecraft:the_end_surface": {
                            description: "Utilise la génération de terrain par défaut de Minecraft End.",
                            type: "object"
                        }
                    }
                }
            }
        }
    }
};
