import { SchemaType } from "../../../../../types/schema";
import { experimentalOptions } from "../../../../../utils/data/experimentalOptions";
import { commonSchemas } from "../../../shared/commonSchemas";
import { dynamicExamplesSourceKeys } from "../../../shared/schemaEnums";
import { schemaPatterns } from "../../../shared/schemaPatterns";

const baseSchema = {
    description: "Ce fichier définit un Biome.",
    "x-experimental_options": [experimentalOptions.custom_biomes],
    type: "object",
    required: ["format_version", "minecraft:biome"],
    properties: {
        format_version: {
            description: "La version du format à utiliser.",
            type: "string",
            enum: [
                "1.13.0", "1.14.0", "1.14.1", "1.14.20", "1.14.30", "1.15.0", "1.16.0", "1.16.20", "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
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
                            pattern: schemaPatterns.identifier_with_namespace,
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_biome_ids
                        }
                    }
                },
                components: {
                    description: "Contient les components du Biome.",
                    type: "object",
                    properties: {
                        "minecraft:climate": {
                            description: "Définit la temprature, l'humidité, les précipitations, etc. Les Biomes sans ce composant auront des valeurs par défaut.",
                            type: "object",
                            properties: {
                                ash: {
                                    description: "Densité des particules de cendres dans l'air de ce biome. Utilisé dans le biome `soulsand_valley`.",
                                    type: "number"
                                },
                                blue_spores: {
                                    description: "Densité des particules de spores bleues dans l'air de ce biome. Utilisé dans le biome `warped_forest`.",
                                    type: "number"
                                },
                                downfall: {
                                    description: "Cette valeur influence la couleur de la végétation et de l'eau. La valeur doit être comprise entre 0.0 et 1.0, où 0.0 donne des couleurs ternes et 1.0 des couleurs vives.",
                                    type: "number"
                                },
                                red_spores: {
                                    description: "Densité des particules de spores rouges dans l'air de ce biome. Utilisé dans le biome `crimson_forest`.",
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
                                temperature: {
                                    description: "La temperature affecte une variété de choses visuelles et comportementales, y compris le placement de la neige et de la glace, le séchage des blocs d'éponge, la couleur de l'eau, et la couleur de la végétation. Si la température est froide, la pluie sera remplacée par la neige et des couches de neige seront placées sur les blocs.",
                                    type: "number"
                                },
                                white_ash: {
                                    description: "Densité des particules de cendres blanches dans l'air de ce biome. Utilisé dans le biome `basalt_deltas`.",
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
                        "minecraft:humidity": {
                            description: "Force un biome à être soit toujours humide, soit jamais humide. L'humidité affecte les chances de propagation des plantes et la vitesse de propagation du feu dans le biome.",
                            type: "object",
                            required: ["is_humid"],
                            properties: {
                                is_humid: {
                                    description: "Si `true`, le biome est considéré comme humide. Si `false`, le biome est considéré comme sec.",
                                    type: "boolean"
                                }
                            }
                        },
                        "minecraft:map_tints": {
                            description: "Définit la couleur avec laquelle l'herbe et le feuillage seront teintés dans ce biome sur la carte.",
                            type: "object",
                            properties: {
                                foliage: {
                                    description: "Définit la couleur du feuillage dans ce biome sur la carte.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            pattern: schemaPatterns.color_hex
                                        },
                                        {
                                            type: "array",
                                            minItems: 3,
                                            maxItems: 3,
                                            items: {
                                                type: "number",
                                                minimum: 0,
                                                maximum: 255
                                            }
                                        }
                                    ]
                                },
                                grass: {
                                    description: "Définit si l'herbe utilisera une couleur de teinte personnalisée ou une couleur de teinte basée sur le bruit.",
                                    oneOf: [
                                        {
                                            type: "object",
                                            required: ["tint", "type"],
                                            properties: {
                                                tint: {
                                                    description: "La couleur de teinte utilisée dans ce biome sur la carte.",
                                                    oneOf: [
                                                        {
                                                            type: "string",
                                                            pattern: schemaPatterns.color_hex
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 3,
                                                            maxItems: 3,
                                                            items: {
                                                                type: "number",
                                                                minimum: 0,
                                                                maximum: 255
                                                            }
                                                        }
                                                    ]
                                                },
                                                type: {
                                                    description: "Contrôle le type de teinte d'herbe à utiliser.",
                                                    type: "string",
                                                    enum: ["tint"]
                                                }
                                            }
                                        },
                                        {
                                            type: "object",
                                            required: ["type"],
                                            properties: {
                                                type: {
                                                    description: "Contrôle le type de teinte d'herbe à utiliser.",
                                                    type: "string",
                                                    enum: ["noise"]
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        "minecraft:mountain_parameters": {
                            description: "Définit les paramètres de bruit utilisés pour générer le terrain de montagne dans l'Overworld.",
                            type: "object",
                            properties: {
                                steep_material_adjustment: {
                                    description: "Définit le bloc de surface utilisé pour les pentes raides en définissant les pentes orientées dans chaque direction.",
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
                        "minecraft:partially_frozen": {
                            description: "Ce composant affectera la température dans un biome gelé, causant certaines zones à ne pas être gelées.",
                            type: "object"
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
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.vanilla_biome_ids_without_namespace
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
                        "minecraft:surface_builder": {
                            description: "Contrôle les blocs utilisés pour la génération de terrain.",
                            type: "object",
                            required: ["builder"],
                            properties: {
                                builder: {
                                    description: "Contrôle les blocs utilisés pour la génération de terrain.",
                                    oneOf: [
                                        {
                                            type: "object",
                                            required: ["foundation_material", "mid_material", "sea_floor_depth", "sea_floor_material", "sea_material", "top_material", "type"],
                                            properties: {
                                                foundation_material: {
                                                    description: "Contrôle le type de bloc utilisé en profondeur dans ce biome.",
                                                    oneOf: [
                                                        {
                                                            type: "string",
                                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                        },
                                                        commonSchemas.block_descriptor
                                                    ]
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
                                                type: {
                                                    description: "Définit le type de constructeur de surface à utiliser.",
                                                    type: "string",
                                                    enum: ["minecraft:overworld"]
                                                }
                                            }
                                        },
                                        {
                                            type: "object",
                                            required: ["foundation_material", "mid_material", "sea_floor_depth", "sea_floor_material", "sea_material", "top_material", "type"],
                                            properties: {
                                                foundation_material: {
                                                    description: "Contrôle le type de bloc utilisé en profondeur dans ce biome.",
                                                    oneOf: [
                                                        {
                                                            type: "string",
                                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                        },
                                                        commonSchemas.block_descriptor
                                                    ]
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
                                                type: {
                                                    description: "Définit le type de constructeur de surface à utiliser.",
                                                    type: "string",
                                                    enum: ["minecraft:frozen_ocean"]
                                                }
                                            }
                                        },
                                        {
                                            type: "object",
                                            required: ["bryce_pillars", "clay_material", "foundation_material", "hard_clay_material", "has_forest", "mid_material", "sea_floor_depth", "sea_floor_material", "sea_material", "top_material", "type"],
                                            properties: {
                                                bryce_pillars: {
                                                    description: "Définit si le mesa se génère avec des piliers.",
                                                    type: "boolean"
                                                },
                                                clay_material: {
                                                    description: "Définit le type de bloc utilisé pour la base d'argile dans ce biome.",
                                                    oneOf: [
                                                        {
                                                            type: "string",
                                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                        },
                                                        commonSchemas.block_descriptor
                                                    ]
                                                },
                                                foundation_material: {
                                                    description: "Contrôle le type de bloc utilisé en profondeur dans ce biome.",
                                                    oneOf: [
                                                        {
                                                            type: "string",
                                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                        },
                                                        commonSchemas.block_descriptor
                                                    ]
                                                },
                                                hard_clay_material: {
                                                    description: "Définit le type de bloc utilisé pour la base d'argile durcie dans ce biome.",
                                                    oneOf: [
                                                        {
                                                            type: "string",
                                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                        },
                                                        commonSchemas.block_descriptor
                                                    ]
                                                },
                                                has_forest: {
                                                    description: "Définit si de la terre stérile et de l'herbe sont générées dans ce biome dans les hautes altitudes.",
                                                    type: "boolean"
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
                                                type: {
                                                    description: "Définit le type de constructeur de surface à utiliser.",
                                                    type: "string",
                                                    enum: ["minecraft:mesa"]
                                                }
                                            }
                                        },
                                        {
                                            type: "object",
                                            required: ["foundation_material", "mid_material", "sea_floor_depth", "sea_floor_material", "sea_material", "top_material", "type"],
                                            properties: {
                                                foundation_material: {
                                                    description: "Contrôle le type de bloc utilisé en profondeur dans ce biome.",
                                                    oneOf: [
                                                        {
                                                            type: "string",
                                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                        },
                                                        commonSchemas.block_descriptor
                                                    ]
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
                                                type: {
                                                    description: "Définit le type de constructeur de surface à utiliser.",
                                                    type: "string",
                                                    enum: ["minecraft:swamp"]
                                                }
                                            }
                                        },
                                        {
                                            type: "object",
                                            required: ["ceiling_materials", "floor_materials", "foundation_material", "sea_material", "type"],
                                            properties: {
                                                beach_material: {
                                                    description: "Contrôle le type de bloc utilisé pour décorer la surface proche du niveau de la mer dans ce biome.",
                                                    oneOf: [
                                                        {
                                                            type: "string",
                                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                        },
                                                        commonSchemas.block_descriptor
                                                    ]
                                                },
                                                ceiling_materials: {
                                                    description: "Contrôle les type de bloc utilisé pour les plafonds de surface dans ce biome.",
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
                                                floor_materials: {
                                                    description: "Contrôle les type de bloc utilisé pour le sol de la surface dans ce biome.",
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
                                                    description: "Contrôle le type de bloc utilisé en profondeur dans ce biome.",
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
                                                type: {
                                                    description: "Définit le type de constructeur de surface à utiliser.",
                                                    type: "string",
                                                    enum: ["minecraft:capped"]
                                                }
                                            }
                                        },
                                        {
                                            type: "object",
                                            required: ["type"],
                                            properties: {
                                                type: {
                                                    description: "Définit le type de constructeur de surface à utiliser.",
                                                    type: "string",
                                                    enum: ["minecraft:the_end"]
                                                }
                                            }
                                        }
                                    ]
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
                                                    type: "molang"
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
                        "minecraft:tags": {
                            description: "Attache des tags de chaîne arbitraires à ce Biome.",
                            type: "object",
                            required: ["tags"],
                            properties: {
                                tags: {
                                    description: "Liste des tags à attacher à ce Biome.",
                                    type: "array",
                                    items: {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.biome_tags
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

export const biomeSchemaTypeBP: SchemaType = {
    fileMatch: ["**/addon/behavior_pack/biomes/**/*.json"],
    baseSchema: baseSchema,
    versionedChanges: [] // Pas de changements pour ce schéma pour l'instant
};