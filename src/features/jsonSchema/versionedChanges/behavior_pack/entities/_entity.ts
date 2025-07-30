import { min } from "lodash";
import { SchemaChange, SchemaType } from "../../../../../types/schema";
import { commonSchemas, getCommonDefinitions } from "../../../shared/commonSchemas";
import { dynamicExamplesSourceKeys, schemaEnums } from "../../../shared/schemaEnums";
import { schemaPatterns } from "../../../shared/schemaPatterns";

const baseSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    
    // Definitions pour les schémas réutilisables et récursifs
    definitions: getCommonDefinitions(),
    
    type: "object",
    required: ["format_version", "minecraft:entity"],
    properties: {
        format_version: {
            description: "La version du format à utiliser.",
            type: "string",
            enum: [
                "1.8.0", "1.9.0", "1.10.0", "1.11.0", "1.12.0", "1.13.0", "1.14.0", "1.14.1", "1.14.20", "1.14.30", "1.15.0", "1.16.0", "1.16.20", "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90"
            ]
        },
        use_beta_features: {
            description: "Définit si les fonctionnalités bêta doivent être activées.",
            type: "boolean"
        },
        "minecraft:entity": {
            description: "Contient la définition de l'Entité.",
            type: "object",
            required: ["description"],
            properties: {
                description: {
                    description: "Contient les informations de description de l'Entité.",
                    type: "object",
                    required: ["identifier"],
                    properties: {
                        identifier: {
                            description: "L'identifiant de l'Entité.",
                            type: "string",
                            pattern: schemaPatterns.identifier_with_namespace,
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.vanilla_data_driven_entity_ids
                        },
                        runtime_identifier: {
                            description: "Certains comportements d'entités ne sont pas `data_drvien`, ce qui signifie qu'on ne peut pas les imiter ou les refaire. Dans ce cas, on se base sur un type d'entité pour que notre Entité hérite de ses comportements qui ne sont pas `data-driven`.",
                            type: "string",
                            pattern: schemaPatterns.identifier_with_namespace,
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.vanilla_data_driven_entity_ids
                        },
                        spawn_category: {
                            description: "**NON-UTILISÉ** - Définit le type de catégorie d'apparition de cette Entité. Cette entité apparaîtra avec les autres types de catégorie d'apparition.",
                            type: "string",
                            enum: ["creature", "axolotls", "ambient", "monster", "water_creature", "water_ambient", "underground_water_creature", "misc"]
                        },
                        is_spawnable: {
                            description: "Définit si un oeuf d'apparition est crée pour cette Entité.",
                            default: false,
                            type: "boolean"
                        },
                        is_summonable: {
                            description: "Définit si cette Entité peut être invoquée comme avec la commande `/summon`.",
                            default: false,
                            type: "boolean"
                        },
                        properties: {
                            description: "Définit les propriétés d'entités pour cette Entité.",
                            type: "object",
                            propertyNames: {
                                pattern: schemaPatterns.identifier_with_namespace
                            },
                            additionalProperties: {
                                oneOf: [
                                    {
                                        type: "object",
                                        required: ["type"],
                                        properties: {
                                            type: {
                                                description: "Le type de la propriété.",
                                                type: "string",
                                                enum: ["bool"]
                                            },
                                            default: {
                                                description: "La valeur par défaut de la propriété.",
                                                type: "boolean"
                                            },
                                            client_sync: {
                                                description: "Définit si la propriété doit être synchronisée avec le client.",
                                                default: false,
                                                type: "boolean"
                                            }
                                        }
                                    },
                                    {
                                        type: "object",
                                        required: ["type"],
                                        properties: {
                                            type: {
                                                description: "Le type de la propriété.",
                                                type: "string",
                                                enum: ["enum"]
                                            },
                                            default: {
                                                description: "La valeur par défaut de la propriété.",
                                                type: "string"
                                            },
                                            client_sync: {
                                                description: "Définit si la propriété doit être synchronisée avec le client.",
                                                default: false,
                                                type: "boolean"
                                            },
                                            values: {
                                                description: "Les valeurs possibles de la propriété.",
                                                type: "array",
                                                maxItems: 64,
                                                items: {
                                                    type: "string"
                                                }
                                            }
                                        }
                                    },
                                    {
                                        type: "object",
                                        required: ["type"],
                                        properties: {
                                            type: {
                                                description: "Le type de la propriété.",
                                                type: "string",
                                                enum: ["float"]
                                            },
                                            default: {
                                                description: "La valeur par défaut de la propriété.",
                                                type: "number"
                                            },
                                            client_sync: {
                                                description: "Définit si la propriété doit être synchronisée avec le client.",
                                                default: false,
                                                type: "boolean"
                                            },
                                            range: {
                                                description: "La plage de valeurs possibles pour la propriété.",
                                                type: "array",
                                                minItems: 2,
                                                maxItems: 2,
                                                items: {
                                                    type: "number"
                                                }
                                            }
                                        }
                                    },
                                    {
                                        type: "object",
                                        required: ["type"],
                                        properties: {
                                            type: {
                                                description: "Le type de la propriété.",
                                                type: "string",
                                                enum: ["int"]
                                            },
                                            default: {
                                                description: "La valeur par défaut de la propriété.",
                                                type: "integer"
                                            },
                                            client_sync: {
                                                description: "Définit si la propriété doit être synchronisée avec le client.",
                                                default: false,
                                                type: "boolean"
                                            },
                                            range: {
                                                description: "La plage de valeurs possibles pour la propriété.",
                                                type: "array",
                                                minItems: 2,
                                                maxItems: 2,
                                                items: {
                                                    type: "integer"
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        },
                        animations: {
                            description: "Attache des animations et des controlleurs d'animation à l'Entité.",
                            type: "object",
                            additionalProperties: {
                                type: "string",
                                pattern: [schemaPatterns.animation_identifier, schemaPatterns.animation_controller_identifier]
                            }
                        },
                        scripts: {
                            description: "Définit les scripts à exécuter pour cette Entité.",
                            type: "object",
                            properties: {
                                initialize: {
                                    description: "Ce script Molang s'exécute lors de la première initialisation de l'Entité, c'est-à-dire lorsqu'elle apparaît et à chaque fois qu'elle est chargée.",
                                    type: "array",
                                    items: {
                                        type: "molang"
                                    }
                                },
                                pre_animation: {
                                    description: "Ce script Molang s'exécute chaque image avant la lecture des animations. Ceci est utile pour calculer les variables qui seront utilisées dans les animations et qui doivent être calculées avant l'exécution de l'animation.",
                                    type: "array",
                                    items: {
                                        type: "molang"
                                    }
                                },
                                animate: {
                                    description: "Ce script s'exécute chaque image après `pre_animation`. C'est ici que vous exécutez des animations et des contrôleurs d'animation. Chaque image, chaque animation ou contrôleur d'animation de cette clé sera exécuté.",
                                    type: "array",
                                    items: {
                                        oneOf: [
                                            {
                                                type: "string"
                                            },
                                            {
                                                type: "object",
                                                additionalProperties: {
                                                    type: "molang"
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        aliases: {
                            description: "Définit les alias de l'Entité. Un alias est une sorte de variante de l'Entité qui varie en fonction des propriétés d'entités qui lui sont attribués.",
                            type: "object",
                            propertyNames: {
                                pattern: schemaPatterns.identifier_with_namespace
                            },
                            additionalProperties: {
                                type: "object",
                                propertyNames: {
                                    pattern: schemaPatterns.identifier_with_namespace
                                },
                                additionalProperties: {
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        {
                                            type: "number"
                                        },
                                        {
                                            type: "boolean"
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },
                components: {
                    description: "Définit les composants de l'Entité.",
                    type: "object",
                    properties: {
                        "minecraft:absorption": {
                            description: "Ajoute un montant d'absorption à l'Entité.",
                            type: "object",
                            properties: {
                                value: {
                                    description: "Montant d'absorption à ajouter à l'Entité.",
                                    type: "number"
                                },
                                max: {
                                    description: "Montant maximum d'absorption que l'Entité peut avoir.",
                                    type: "number"
                                },
                                min: {
                                    description: "Montant minimum d'absorption que l'Entité peut avoir.",
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:addrider": {
                            description: "Ajoute un cavalier à l'Entité. L'Entité doit avoir le composant `minecraft:rideable`.",
                            type: "object",
                            properties: {
                                entity_type: {
                                    description: "Définit le type de l'entité qui chevauchera cette Entité.",
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.entity_ids
                                },
                                spawn_event: {
                                    description: "Le spawn event qui sera déclenché sur l'Entité chevauchée quand son cavalier sera crée.",
                                    type: "string"
                                }
                            }
                        },
                        "minecraft:admire_item": {
                            description: "Force l'Entité à ignorer les cibles attaquables pour une durée donnée.",
                            type: "object",
                            properties: {
                                cooldown_after_being_attacked: {
                                    description: "Durée en secondes pendant laquelle l'Entité n'admirera pas les items si elle a été attaquée.",
                                    default: 0,
                                    type: "integer"
                                },
                                duration: {
                                    description: "Durée en secondes pedant laquelle l'Entité est pacifique.",
                                    default: 10,
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:ageable": {
                            description: "Ajoute un timer pour que l'Entité grandisse. Le timer peut être accéléré en donnant à l'Entité des items qu'elle aime, ces items sont définis dans `feed_items`.",
                            type: "object",
                            properties: {
                                drop_items: {
                                    description: "Items que l'Entité lâche quand elle grandit.",
                                    type: "array",
                                    items: {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                    }
                                },
                                duration: {
                                    description: "Temps en secondes avant que l'Entité grandisse. Une valeur de `-1` signifie que l'Entité restera toujours un bébé.",
                                    default: 1200,
                                    type: "number"
                                },
                                feed_items: {
                                    description: "Liste des items qui peuvent être donnés à l'Entité pour accélérer sa croissance. Inclut `item` pour le nom de l'item et `growth` pour définir combien de temps la croissance est accélérée.",
                                    type: "array",
                                    items: {
                                        oneOf: [
                                            {
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                            },
                                            {
                                                type: "object",
                                                properties: {
                                                    item: {
                                                        description: "Nom de l'item.",
                                                        type: "string",
                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                                    },
                                                    growth: {
                                                        description: "Proportion de la croissance gagnée en utilisant cet item.",
                                                        type: "number"
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                },
                                grow_up: {
                                    description: "Evenement d'entité à déclencher quand l'Entité grandit.",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                interact_filters: {
                                    description: "Liste des conditions à remplir pour que l'Entité soit nourrie.",
                                    ...commonSchemas.minecraft_filter
                                },
                                transform_to_item: {
                                    description: "L'item utilisé se transformera en cet item après une interaction réussie.",
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                }
                            }
                        },
                        "minecraft:ambient_sound_interval": {
                            description: "Définit le delai entre les sons ambiants de l'Entité.",
                            type: "object",
                            properties: {
                                event_name: {
                                    description: "Nom de l'événement sonore à jouer.",
                                    default: "ambient",
                                    type: "string"
                                },
                                event_names: {
                                    description: "Liste des événements sonores à jouer avec des conditions pour les choisirs. Evaluer dans l'ordre, le premier qui est vrai gagne. Si aucun n'est vrai, `event_name` prendra le dessus.",
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            event_name: {
                                                description: "Nom de l'événement sonore à jouer.",
                                                type: "string"
                                            },
                                            condition: {
                                                description: "Condition Molang à remplir pour que l'événement sonore soit joué.",
                                                type: "molang"
                                            }
                                        }
                                    }
                                },
                                range: {
                                    description: "Temps maximum en secondes à ajouter aléatoirement au délai du son ambiant.",
                                    default: 16,
                                    type: "number"
                                },
                                value: {
                                    description: "Temps minimum en secondes avant que l'Entité joue un son ambiant.",
                                    default: 8,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:anger_level": {
                            description: "Permet à l'entité d'accumuler de la colère envers certains ennemis et de réagir quand le seuil est atteint.",
                            type: "object",
                            properties: {
                                anger_decrement_interval: {
                                    description: "Le niveau de colère diminuera au fil du temps. Définit à quelle fréquence la colère envers toutes les nuisances diminuera de un.",
                                    default: 1,
                                    type: "number"
                                },
                                angry_boost: {
                                    description: "Définit le boost de colère appliqué au seuil de colère lorsque l'Entité devient en colère.",
                                    default: 20,
                                    type: "integer",
                                    minimum: 0
                                },
                                angry_threshold: {
                                    description: "Définit quand l'Entité est considérée en colère contre une nuisance.",
                                    default: 80,
                                    type: "integer",
                                    minimum: 0
                                },
                                default_annoyingness: {
                                    description: "Spécifie le montant de colère à augmenter pour chaque nuisance.",
                                    default: 0,
                                    type: "integer"
                                },
                                default_projectile_annoyingness: {
                                    description: "Spécifie le montant de colère à augmenter pour chaque projectile lancé sur l'Entité.",
                                    default: 0,
                                    type: "integer"
                                },
                                max_anger: {
                                    description: "Le niveau de colère maximum qui peut être atteint. S'applique à toute nuisance.",
                                    default: 100,
                                    type: "integer",
                                    minimum: 0
                                },
                                nuisance_filter: {
                                    description: "Filtre qui est appliqué pour déterminer si un mob peut être une nuisance.",
                                    ...commonSchemas.minecraft_filter
                                },
                                on_increase_sounds: {
                                    description: "Sons à jouer lorsque l'Entité est provoquée. Évalué dans l'ordre; la première condition correspondante gagne.",
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "L'événement sonore à jouer lorsque l'Entité est provoquée.",
                                                type: "string"
                                            },
                                            condition: {
                                                description: "Condition Molang à remplir pour que l'événement sonore soit joué.",
                                                type: "molang"
                                            }
                                        }
                                    }
                                },
                                remove_targets_below_angry_threshold: {
                                    description: "Définit si l'Entité doit supprimer la cible s'il tombe en dessous du seuil de colère.",
                                    default: true,
                                    type: "boolean"
                                }
                            }
                        },
                        "minecraft:angry": {
                            description: "Définit l'état 'en colère' de l'Entité en utilisant un timer.",
                            type: "object",
                            properties: {
                                angry_sound: {
                                    description: "L'événement sonore à jouer lorsque l'Entité est en colère.",
                                    type: "string"
                                },
                                broadcast_anger: {
                                    description: "Si 'true', les autres entités de la même définition de cette Entité dans la plage de diffusion (`broadcast_range`) deviendront également en colère.",
                                    default: false,
                                    type: "boolean"
                                },
                                broadcast_anger_on_attack: {
                                    description: "Si 'true', les autres entités de la même définition de cette Entité dans la plage de diffusion (`broadcast_range`) deviendront également en colère lorsque cette Entité attaque.",
                                    default: false,
                                    type: "boolean"
                                },
                                broadcast_anger_on_being_attacked: {
                                    description: "Si 'true', les autres entités de la même définition de cette Entité dans la plage de diffusion (`broadcast_range`) deviendront également en colère lorsque cette Entité est attaquée.",
                                    default: false,
                                    type: "boolean"
                                },
                                broadcast_anger_when_dying: {
                                    description: "Si 'true', les autres entités de la même définition de cette Entité dans la plage de diffusion (`broadcast_range`) deviendront également en colère lorsque cette Entité meurt.",
                                    default: true,
                                    type: "boolean"
                                },
                                broadcast_filters: {
                                    description: "Conditions qui doivent être remplies pour que l'Entité diffuse sa colère.",
                                    ...commonSchemas.minecraft_filter
                                },
                                broadcast_range: {
                                    description: "Distance en blocs où les autres entités de la même définition de cette Entité deviendront en colère.",
                                    default: 20,
                                    type: "integer"
                                },
                                broadcast_targets: {
                                    description: "Une liste de familles d'entités à diffuser la colère.",
                                    type: "array",
                                    items: {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.entity_family_ids
                                    }
                                },
                                calm_event: {
                                    description: "L'événement à déclencher lorsque l'Entité devient calme.",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                duration: {
                                    description: "Temps en secondes que l'Entité restera en colère.",
                                    default: 25,
                                    type: "integer"
                                },
                                duration_delta: {
                                    description: "Variation en secondes ajoutée à la durée de la colère. La valeur est ajoutée ou soustraite de la durée de la colère. Par exemple, si la durée est de 25 et la variation est de 5, la durée de la colère sera entre 20 et 30 secondes.",
                                    default: 0,
                                    type: "integer"
                                },
                                filters: {
                                    description: "Filtre qui est appliqué pour déterminer les types de mobs qui ne doivent pas être attaqués pendant que l'Entité est en colère.",
                                    ...commonSchemas.minecraft_filter
                                },
                                sound_interval: {
                                    description: "La plage de temps en secondes à attendre avant de rejouer le son de colère.",
                                    default: 0,
                                    oneOf: [
                                        {
                                            type: "number"
                                        },
                                        {
                                            type: "object",
                                            properties: {
                                                range_min: {
                                                    description: "Temps minimum en secondes à attendre avant de rejouer le son de colère.",
                                                    type: "number"
                                                },
                                                range_max: {
                                                    description: "Temps maximum en secondes à attendre avant de rejouer le son de colère.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                            }
                        },
                        "minecraft:annotation.break_door": {
                            description: "Oblige l'Entité à casser des portes, en supposant que des 'flags' soient configurés pour que le composant les utilise dans la navigation. Nécessite que le composant de navigation de l'entité ait le paramètre `can_break_doors` défini sur `true`.",
                            type: "object",
                            properties: {
                                break_time: {
                                    description: "Temps en secondes requis pour casser les portes.",
                                    default: 12,
                                    type: "number"
                                },
                                min_difficulty: {
                                    description: "Difficulté minimale requise pour que l'Entité casse les portes.",
                                    default: "hard",
                                    type: "string",
                                    enum: ["peaceful", "easy", "normal", "hard"]
                                }
                            }
                        },
                        "minecraft:annotation.open_door": {
                            description: "Oblige l'Entité à ouvrir des portes, en supposant que des 'flags' soient configurés pour que le composant les utilise dans la navigation. Nécessite que le composant de navigation de l'entité ait le paramètre `can_open_doors` défini sur `true`.",
                            type: "object"
                        },
                        "minecraft:area_attack": {
                            description: "Composant permettant à l'Entité d'attaquer toutes les entités dans une zone autour d'elle.",
                            type: "object",
                            properties: {
                                cause: {
                                    description: "Le type de dégâts infligés par l'attaque.",
                                    type: "string",
                                    enum: schemaEnums.entity_damage_causes
                                },
                                entity_filter: {
                                    description: "L'ensemble d'entités valides sur lesquelles appliquer des dégâts dans la zone.",
                                    ...commonSchemas.minecraft_filter
                                },
                                damage_per_tick: {
                                    description: "Définit le montant de dégâts infligés par tick aux entités.",
                                    default: 2,
                                    type: "integer"
                                },
                                damage_range: {
                                    description: "Définit la distance maximale à laquelle les entités peuvent être touchées.",
                                    default: 0.2,
                                    type: "number"
                                },
                                play_attack_sound: {
                                    description: "Définit si l'Entité doit jouer son son d'attaque lorsqu'elle attaque une cible.",
                                    type: "boolean"
                                },
                                damage_cooldown: {
                                    description: "Temps de recharge en secondes entre les attaques.",
                                    default: 0,
                                    type: "number"
                                }
                            }
                        },
                        "minecraft:attack": {
                            description: "Définit une attaque de mêlée pour l'Entité.",
                            type: "object",
                            properties: {
                                damage: {
                                    description: "Le montant de dégâts infligés par l'attaque. Note: Une valeur négative soignera l'Entité. Si un tableau est fourni, un montant de dégâts aléatoire sera choisi entre les deux valeurs.",
                                    oneOf: [
                                        {
                                            type: "integer"
                                        },
                                        {
                                            type: "array",
                                            minItems: 2,
                                            maxItems: 2,
                                            items: {
                                                type: "integer"
                                            }
                                        }
                                    ]
                                },
                                effect_duration: {
                                    description: "Durée en secondes de l'effet appliqué à l'entité touchée. Possibilité de définir cette valeur sur `infinite` pour un effet permanent.",
                                    default: 0,
                                    oneOf: [
                                        {
                                            type: "number"
                                        },
                                        {
                                            type: "string",
                                            enum: ["infinite"]
                                        }
                                    ]
                                },
                                effect_name: {
                                    description: "Nom de l'effet appliqué à l'entité touchée.",
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.effect_ids
                                }
                            }
                        },
                        "minecraft:attack_cooldown": {
                            description: "Ajoute un cooldown à une Entité. L'intention du cooldown est d'empêcher l'Entité de tenter d'acquérir de nouvelles cibles d'attaque.",
                            type: "object",
                            properties: {
                                attack_cooldown_complete_event: {
                                    description: "L'événement à déclencher lorsque le cooldown est terminé.",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                attack_cooldown_time: {
                                    description: "Temps en secondes avant que l'Entité puisse attaquer à nouveau.",
                                    oneOf: [
                                        {
                                            type: "number"
                                        },
                                        {
                                            type: "array",
                                            minItems: 2,
                                            maxItems: 2,
                                            items: {
                                                type: "number"
                                            }
                                        }
                                    ]
                                },
                            }
                        },
                        "minecraft:attack_damage": {
                            description: "Spécifie les dégâts infligés par l'Entité lorsqu'elle attaque.",
                            type: "object",
                            properties: {
                                value: {
                                    description: "Le montant de dégâts infligés par l'attaque.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:balloonable": {
                            description: "Permet à l'Entité à avoir un ballon attaché et définit les conditions et événements pour l'Entité lorsqu'elle est ballonnée.",
                            type: "object",
                            properties: {
                                soft_distance: {
                                    description: "Distance en blocs où l'Entité est considérée comme étant à une distance 'douce' du ballon.",
                                    default: 2,
                                    type: "number"
                                },
                                max_distance: {
                                    description: "Distance en blocs où le ballon se détache de l'Entité.",
                                    default: 10,
                                    type: "number"
                                },
                                on_balloon: {
                                    description: "Evénement à déclencher lorsque l'Entité est ballonnée.",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                on_unballoon: {
                                    description: "Evénement à déclencher lorsque l'Entité n'est plus ballonnée.",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                mass: {
                                    description: "La masse de l'Entité lors du calcul des forces de traction du ballon.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:barter": {
                            description: "Oblige l'Entité à lâcher un item lorsqu'elle fait du troc (échanges).",
                            type: "object",
                            properties: {
                                barter_table: {
                                    description: "La Loot Table utilisée pour déterminer les items à lâcher lors du troc.",
                                    type: "string",
                                    pattern: schemaPatterns.loot_tables_file,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.loot_table_file_paths
                                },
                                cooldown_after_being_attacked: {
                                    description: "Durée en secondes pendant laquelle l'Entité ne fera pas de troc si elle a été attaquée.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:block_climber": {
                            description: "Permet à l'Entité de grimper sur des blocs.",
                            type: "object"
                        },
                        "minecraft:block_sensor": {
                            description: "Initialise un événement spécifié lorsqu'un bloc dans la liste des blocs est cassé dans la plage du capteur.",
                            type: "object",
                            properties: {
                                on_break: {
                                    description: "Liste des blocs à surveiller quand ils sont cassés pour déclencher l'événement d'entité associé. Si un bloc est dans plusieurs listes, plusieurs événements se produiront.",
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            block_list: {
                                                description: "Liste des blocs à surveiller pour déclencher l'événement d'entité associé.",
                                                type: "array",
                                                items: {
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                }
                                            },
                                            on_block_broken: {
                                                description: "L'événement d'entité à déclencher lorsque le bloc est cassé.",
                                                oneOf: [
                                                    {
                                                        type: "string"
                                                    },
                                                    commonSchemas.entity_event_trigger
                                                ]
                                            }
                                        }
                                    }
                                },
                                sensor_radius: {
                                    description: "La distance radiale maximale à laquelle un bloc peut être détecté.",
                                    default: 16,
                                    type: "number",
                                    maximum: 32
                                },
                                sources: {
                                    description: "Liste des sources de cassage blocs qui déclencheront l'événement. Si aucune n'est spécifiée, tous les blocs cassés déclencheront l'événement. Si aucun n'est spécifié, tous les blocs cassés déclencheront l'événement. Les élements de la liste sont sous la forme de filtres de conditions.",
                                    type: "array",
                                    items: {
                                        ...commonSchemas.minecraft_filter
                                    }
                                },
                            }
                        },
                        "minecraft:body_rotation_always_follows_head": {
                            description: "Fait en sorte que le corps de l'Entité tourne toujours dans la direction de sa tête. Ne remplace pas `minecraft:body_rotation_blocked` s'il est présent.",
                            type: "object"
                        },
                        "minecraft:body_rotation_axis_aligned": {
                            description: "Fait tourner automatiquement le corps de l'entité pour s'aligner sur la direction cardinale la plus proche en fonction de sa direction de face actuelle.  Type: `Object`. Combiner cela avec le composant `minecraft:body_rotation_blocked` fera en sorte que l'entité s'aligne sur la direction cardinale la plus proche et reste fixe dans cette orientation, indépendamment des futurs changements de sa direction de face.",
                            type: "object"
                        },
                        "minecraft:body_rotation_blocked": {
                            description: "Lorsque ce composant est défini, l'entité ne tournera plus visuellement son corps pour correspondre à sa direction de face.",
                            type: "object"
                        },
                        "minecraft:boostable": {
                            description: "Définit les conditions et le comportement d'un boost de l'Entité montable.",
                            type: "object",
                            properties: {
                                boost_items: {
                                    description: "Liste des items qui peuvent être utilisés pour booster l'Entité.",
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            item: {
                                                description: "L'item qui peut être utilisé pour booster l'Entité.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                            },
                                            damage: {
                                                description: "Le montant de dégâts infligés à l'item lorsqu'il est utilisé pour booster l'Entité.",
                                                type: "integer"
                                            },
                                            replace_item: {
                                                description: "L'item qui remplacera l'item utilisé pour booster l'Entité.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                            }
                                        }
                                    }
                                },
                                duration: {
                                    description: "Durée en secondes du boost.",
                                    default: 3,
                                    type: "number"
                                },
                                speed_multiplier: {
                                    description: "Facteur par lequel la vitesse normale de l'Entité augmente.",
                                    default: 1.35,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:boss": {
                            description: "Définit l'Entité comme un boss.",
                            type: "object",
                            properties: {
                                hud_range: {
                                    description: "La distance maximale du boss à laquelle la barre de santé du boss apparaît à l'écran des joueurs.",
                                    default: 55,
                                    type: "integer"
                                },
                                name: {
                                    description:
                                    "**ℹ️ Texte traduisable**\n\n" +
                                    "Le nom du boss affiché au dessus de la barre de boss.",
                                    type: "string"
                                },
                                should_darken_sky: {
                                    description: "Définit le ciel doit s'assombrir en présence du boss.",
                                    default: false,
                                    type: "boolean"
                                },
                            }
                        },
                        "minecraft:break_blocks": {
                            description: "Spécifie les blocs que l'Entité peut casser lorsqu'elle se déplace.",
                            type: "object",
                            properties: {
                                breakable_blocks: {
                                    description: "Une liste des blocs qui peuvent être cassés par l'Entité.",
                                    type: "array",
                                    items: {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                    }
                                },
                            }
                        },
                        "minecraft:breathable": {
                            description: "Définit les blocs dans lesquels l'Entité peut respirer et définit la capacité de suffocation dans ces blocs.",
                            type: "object",
                            properties: {
                                breathe_blocks: {
                                    description: "Liste des blocs dans lesquels l'Entité peut respirer.",
                                    type: "array",
                                    items: {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                    }
                                },
                                breathes_air: {
                                    description: "Définit si l'Entité peut respirer dans l'air.",
                                    default: true,
                                    type: "boolean"
                                },
                                breathes_lava: {
                                    description: "Définit si l'Entité peut respirer dans la lave.",
                                    default: true,
                                    type: "boolean"
                                },
                                breathes_solids: {
                                    description: "Définit si l'Entité peut respirer dans les blocs solides.",
                                    default: false,
                                    type: "boolean"
                                },
                                breathes_water: {
                                    description: "Définit si l'Entité peut respirer dans l'eau.",
                                    default: false,
                                    type: "boolean"
                                },
                                generates_bubbles: {
                                    description: "Définit si l'Entité aura des bulles visibles lorsqu'elle est dans l'eau.",
                                    default: true,
                                    type: "boolean"
                                },
                                inhale_time: {
                                    description: "Temps en secondes pour que l'Entité retrouve sa respiration maximale.",
                                    default: 0,
                                    type: "number"
                                },
                                non_breathe_blocks: {
                                    description: "Liste des blocs dans lesquels l'Entité ne peut pas respirer.",
                                    type: "array",
                                    items: {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                    }
                                },
                                suffocate_time: {
                                    description: "Temps en secondes entre les dégâts de suffocation.",
                                    default: -20,
                                    type: "integer"
                                },
                                total_supply: {
                                    description: "Temps en secondes que l'Entité peut retenir sa respiration.",
                                    default: 15,
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:breedable": {
                            description: "Oblige l'Entité à entrer dans l'état d'amour utilisé pour la reproduction. L'Entité doit avoir le composant `minecraft:behavior.breed` pour se reproduire.",
                            type: "object",
                            properties: {
                                allow_sitting: {
                                    description: "Si true, l'Entité peut se reproduire en étant assise.",
                                    default: false,
                                    type: "boolean"
                                },
                                blend_attributes: {
                                    description: "Définit si les entités mélangeront leurs attributs dans leur progéniture.",
                                    default: true,
                                    type: "boolean"
                                },
                                breed_cooldown: {
                                    description: "Temps en secondes avant que l'Entité puisse se reproduire à nouveau.",
                                    default: 60,
                                    type: "number"
                                },
                                breed_items: {
                                    description: "Liste des items qui peuvent être utilisés pour amener l'Entité dans l'état d'amour.",
                                    type: "array",
                                    items: {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                    }
                                },
                                breeds_with: {
                                    description: "Liste des définitions d'entités avec lesquelles l'Entité peut se reproduire.",
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            baby_type: {
                                                description: "Définit le type de l'entité enfant.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.entity_ids
                                            },
                                            breed_event: {
                                                description: "Evénement à déclencher lorsque l'Entité se reproduit.",
                                                oneOf: [
                                                    {
                                                        type: "string"
                                                    },
                                                    commonSchemas.entity_event_trigger
                                                ]
                                            },
                                            mate_type: {
                                                description: "Définit le type de l'entité partenaire. \nType: `String`",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.entity_ids
                                            }
                                        }
                                    }
                                },
                                causes_pregnancy: {
                                    description: "Définit si l'Entité deviendra enceinte au lieu de faire apparaitre un bébé.",
                                    default: false,
                                    type: "boolean"
                                },
                                combine_parent_colors: {
                                    description: "Définit si lorsque deux Entités de ce type se reproduisent, la couleur du bébé sera un mélange des couleurs (`minecraft:color`) des parents à condition qu'elles soient compatibles. Sinon la couleur du bébé sera choisie aléatoirement entre celle du père ou de la mère.",
                                    type: "boolean"
                                },
                                deny_parents_variant: {
                                    description: "Détermine à quel point il est probable qu'un bébé de parents avec la même variante nie cette variante et prenne plutôt une variante aléatoire dans la plage donnée.",
                                    type: "object",
                                    properties: {
                                        chance: {
                                            description: "Le pourcentage de chance de nier la variante des parents.",
                                            default: 0,
                                            type: "number"
                                        },
                                        max_variant: {
                                            description: "Le maximum inclusif de la plage de variante.",
                                            default: 0,
                                            type: "integer"
                                        },
                                        min_variant: {
                                            description: "Le minimum inclusif de la plage de variante.",
                                            default: 0,
                                            type: "integer"
                                        }
                                    }
                                },
                                environment_requirements: {
                                    description: "La liste des exigences de blocs à proximité pour amener l'Entité dans l'état d'amour.",
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            blocks: {
                                                description: "Liste des blocs proches requis pour l'accouplement. \nType: `String[]`",
                                                type: "array",
                                                items: {
                                                    type: "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                }
                                            },
                                            count: {
                                                description: "Le nombre de types de blocs requis à proximité pour l'Entité pour se reproduire. \nType: `Integer`",
                                                type: "integer"
                                            },
                                            radius: {
                                                description: "Le rayon en blocs du centre de l'Entité pour rechercher les blocs requis. Borné entre 0 et 16. \nType: `Integer`",
                                                type: "integer",
                                                minimum: 0,
                                                maximum: 16
                                            }
                                        }
                                    }
                                },
                                extra_baby_chance: {
                                    description: "Chance entre 0.0 et 1.0 que jusqu'à 16 bébés apparaissent, où 1.0 est 100%.",
                                    default: 0,
                                    type: "number",
                                    minimum: 0,
                                    maximum: 1
                                },
                                inherit_tamed: {
                                    description: "Définit si les bébés des parents apprivoisés seront automatiquement apprivoisés.",
                                    default: true,
                                    type: "boolean"
                                },
                                love_filters: {
                                    description: "Les filtres à exécuter lors de la tentative de tomber amoureux.",
                                    ...commonSchemas.minecraft_filter
                                },
                                mutation_factor: {
                                    description: "Détermine à quel point les bébés sont susceptibles de NE PAS hériter des variantes de l'un de leurs parents. Les valeurs sont comprises entre 0,0 et 1,0, un nombre plus élevé correspondant à une probabilité de mutation plus élevée.",
                                    type: "object",
                                    properties: {
                                        color: {
                                            "description": "Le pourcentage de chance d'une mutation sur la couleur de l'entité. \nType: `Number`",
                                            "default": 0,
                                            "type": "number",
                                            "minimum": 0.0,
                                            "maximum": 1.0  
                                        },
                                        extra_variant: {
                                            "description": "Le pourcentage de chance d'une mutation sur le type de variante supplémentaire de l'entité. \nType: `Number`",
                                            "default": 0,
                                            "type": "number",
                                            "minimum": 0.0,
                                            "maximum": 1.0
                                        },
                                        variant: {
                                            "description": "Le pourcentage de chance d'une mutation sur le type de variante de l'entité. \nType: `Number`",
                                            "default": 0,
                                            "type": "number",
                                            "minimum": 0.0,
                                            "maximum": 1.0
                                        }
                                    }
                                },
                                mutation_strategy: {
                                    description: "Stratégie utilisée pour muter les variantes et les variantes supplémentaires pour la progéniture. Les alternatives valides actuelles sont 'random' et 'none'.",
                                    default: "none",
                                    type: "string",
                                    enum: ["none", "random"]
                                },
                                parent_centric_attribute_blending: {
                                    description: "[EXPERIMENTALE] Liste des attributs qui devraient bénéficier du mélange des attributs centrés sur les parents. Par exemple, les chevaux mélangent leur santé, leur mouvement et leur force de saut dans leur progéniture.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                property_inheritance: {
                                    "description": "Définit les propriétés d'entités de l'Entité qui seront héritées par la progéniture.",
                                    "type": "object",
                                    "propertyNames": {
                                        "pattern": schemaPatterns.identifier_with_namespace
                                    },
                                    "additionalProperties": {
                                        "type": "object",
                                        "properties": {
                                            "mutation_chance": {
                                                "description": "Définit la chance que la propriété ne soit pas héritée de l'un des parents.",
                                                "default": 0,
                                                "type": "number"
                                            },
                                            "mutation_values": {
                                                "description": "Contient les valeurs à sélectionner si la propriété est mutée et que le composant a une mutation aléatoire définie.",
                                                "type": "array",
                                                "items": {
                                                    "oneOf": [
                                                        {
                                                            "type": "boolean"
                                                        },
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
                                random_extra_variant_mutation_interval: {
                                    description: "Plage utilisée pour déterminer une variante supplémentaire aléatoire.",
                                    default: 0,
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "integer"
                                    }
                                },
                                random_variant_mutation_interval: {
                                    description: "Plage utilisée pour déterminer une variante aléatoire.",
                                    default: 0,
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "integer"
                                    }
                                },
                                require_full_health: {
                                    description: "Définit si l'Entité doit être en pleine santé pour se reproduire.",
                                    default: false,
                                    type: "boolean"
                                },
                                require_tame: {
                                    description: "Définit si l'Entité doit être apprivoisée pour se reproduire.",
                                    default: true,
                                    type: "boolean"
                                },
                                transform_to_item: {
                                    description: "L'item utilisé pour la reproduction se transformera en cet item une fois utilisé.",
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                },
                            }
                        },
                        "minecraft:bribeable": {
                            description: "Oblige l'Entité à entrer dans l'état d'influencé lorsqu'elle est influencé.",
                            type: "object",
                            properties: {
                                bribe_cooldown: {
                                    description: "Temps en secondes avant que l'Entité puisse être influencée à nouveau.",
                                    default: 2,
                                    type: "number"
                                },
                                bribe_items: {
                                    description: "Liste des items qui peuvent être utilisés pour influencer l'Entité.",
                                    type: "array",
                                    items: {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                    }
                                },
                            }
                        },
                        "minecraft:buoyant": {
                            "description": "Permet à l'Entité de flotter sur les blocs liquides spécifiés.",
                            "type": "object",
                            "properties": {
                                "apply_gravity": {
                                    "description": "Applique la gravité à l'Entité lorsqu'elle est dans l'eau.",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "base_buoyancy": {
                                    "description": "Flottabilité de base utilisée pour calculer combien l'entité flottera.",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "big_wave_probability": {
                                    "description": "Probailité qu'une grosse vague frappe l'entité. Utilisé uniquement si `simulate_waves` est vrai.",
                                    "default": 0.03,
                                    "type": "number",
                                    "minimum": 0.0,
                                    "maximum": 1.0
                                },
                                "big_wave_speed": {
                                    "description": "Multiplicateur pour la vitesse pour faire une grosse vague. Déclenché en fonction de `big_wave_probability`.",
                                    "default": 10.0,
                                    "type": "number"
                                },
                                "drag_down_on_buoyancy_removed": {
                                    "description": "De combien l'Entité sera tirée vers le bas lorsqu'on lui retire ce composant.",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "liquid_blocks": {
                                    "description": "Liste des blocs sur lesquels l'Entité peut flotter. Doit être un bloc liquide.",
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                    }
                                },
                                "simulate_waves": {
                                    "description": "Définit si l'Entité doit simuler des vagues lorsqu'elle est dans l'eau.",
                                    "default": true,
                                    "type": "boolean"
                                }
                            }
                        },
                        "minecraft:burns_in_daylight": {
                            "description": "Oblige l'Entité à brûler à la lumière du jour.`",
                            "type": "object"
                        },
                        "minecraft:can_climb": {
                            "description": "Permet à l'Entité de grimper aux échelles.",
                            "type": "object"
                        },
                        "minecraft:can_fly": {
                            "description": "Permet à l'Entité de voler.",
                            "type": "object"
                        },
                        "minecraft:can_join_raid": {
                            "description": "Définit que l'Entité peut rejoindre un raid existant.",
                            "type": "object"
                        },
                        "minecraft:can_power_jump": {
                            "description": "Permet à l'Entité de sauter avec une puissance comme les chevaux.",
                            "type": "object"
                        },
                        "minecraft:cannot_be_attacked": {
                            "description": "Empêche les entités de s'attaquer à l'Entité sauf si elles ont le composant `minecraft:ignore_cannot_be_attacked`.`",
                            "type": "object"
                        },
                        "minecraft:celebrate_hunt": {
                            "description": "Oblige l'Entité à célébrer lorsqu'elle chasse une entité spécifique.",
                            "type": "object",
                            "properties": {
                                "broadcast": {
                                    "description": "Définit si la célébration sera diffusée à d'autres entités dans la plage de diffusion.",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "celebration_targets": {
                                    "description": "Liste des conditions que la cible d'une chasse doit satisfaire pour initier la célébration.",
                                    ...commonSchemas.minecraft_filter
                                },
                                "celebrate_sound": {
                                    "description": "L'événement sonore à jouer lorsque l'Entité célèbre.",
                                    "type": "string"
                                },
                                "duration": {
                                    "description": "Durée en secondes de la célébration.",
                                    "default": 4,
                                    "type": "integer"
                                },
                                "radius": {
                                    "description": "Si la diffusion est activée, spécifie le rayon dans lequel elle notifiera d'autres entités pour la célébration.",
                                    "default": 16,
                                    "type": "number"
                                },
                                "sound_interval": {
                                    "description": "La plage de temps en secondes à attendre avant de rejouer le son de célébration.",
                                    "default": 0,
                                    "type": "object",
                                    "properties": {
                                        "range_min": {
                                            "description": "La valeur minimale de la plage de temps en secondes.",
                                            "type": "number"
                                        },
                                        "range_max": {
                                            "description": "La valeur maximale de la plage de temps en secondes.",
                                            "type": "number"
                                        }
                                    }
                                }
                            }
                        },
                        "minecraft:collision_box": {
                            "description": "Définit la largeur et la hauteur de la boîte de collision de l'Entité.",
                            "type": "object",
                            "properties": {
                                "height": {
                                    "description": "La hauteur de la boîte de collision de l'Entité.",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "width": {
                                    "description": "La largeur de la boîte de collision de l'Entité.",
                                    "default": 1.0,
                                    "type": "number",
                                    "minimum": -100000000,
                                    "maximum": 100000000
                                }
                            }
                        },
                        "minecraft:color": {
                            "description": "Définit la couleur principale de l'Entité. Note: Cet attribut ne fonctionne que sur les entités vanilles qui ont des valeurs de couleur prédéfinies (mouton, lama, shulker).",
                            "type": "object",
                            "properties": {
                                "color": {
                                    "description": "La couleur principale de l'Entité.",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:color2": {
                            "description": "Définit la couleur de la seconde texture de l'Entité. Note : Cet attribut ne fonctionne que sur les entités vanilles qui ont des valeurs de couleur prédéfinies (poisson tropical).",
                            "type": "object",
                            "properties": {
                                "value": {
                                    "description": "La couleur de la seconde texture de l'Entité. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:combat_regeneration": {
                            "description": "Ajoute Régénération I et supprime l'effet Fatigue de Minage de l'entité qui tue la cible d'attaque de l'Acteur.",
                            "type": "object",
                            "properties": {
                                "regeneration_duration": {
                                    "description": "La durée en secondes pendant laquelle l'Entité gagnera Régénération I.",
                                    "default": 5,
                                    "oneOf": [
                                        {
                                            "type": "integer"
                                        },
                                        {
                                            type: "string",
                                            enum: ["infinite"]
                                        }
                                    ]
                                },
                                "apply_to_self": {
                                    "description": "Définit si l'Entité s'accordera la Régénération de Combat si elle tue la cible.",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "apply_to_family": {
                                    "description": "Définit si l'Entité accordera la Régénération de Combat aux entités de la même famille si elles tuent la cible.",
                                    "default": false,
                                    "type": "boolean"
                                }
                            }
                        },
                        "minecraft:conditional_bandwidth_optimization": {
                            "description": "Définit les optimisations de bande passante de mise à jour spatiale conditionnelle de l'Entité.",
                            "type": "object",
                            "properties": {
                                "conditional_values": {
                                    "description": "L'objet contenant les valeurs d'optimisation de bande passante conditionnelle.",
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "conditional_values": {
                                                "description": "Conditions qui doivent être remplies pour que les valeurs d'optimisation soient appliquées.",
                                                ...commonSchemas.minecraft_filter
                                            },
                                            "max_dropped_ticks": {
                                                "description": "En relation avec la valeur d'optimisation, détermine le nombre maximum de ticks que les paquets de mise à jour spatiale peuvent être abandonnés.",
                                                "type": "integer"
                                            },
                                            "max_optimized_distance": {
                                                "description": "La distance maximale considérée lors des optimisations de bande passante. Toute valeur inférieure à la valeur maximale est interpolée pour trouver l'optimisation, et toute valeur supérieure ou égale à la valeur maximale donne une optimisation maximale.",
                                                "type": "integer"
                                            },
                                            "use_motion_prediction_hints": {
                                                "description": "Lorsque défini sur true, des paquets de mouvement plus petits seront envoyés pendant les intervalles de paquets abandonnés, ce qui permet d'envoyer la même quantité de paquets qu'avec des optimisations mais avec moins de données envoyées. Cela devrait être utilisé pour éviter les anomalies visuelles lorsque les entités se déplacent rapidement ou se téléportent.",
                                                "default": false,
                                                "type": "boolean"
                                            }
                                        }
                                    }
                                },
                                "default_values": {
                                    "description": "L'objet contenant les valeurs d'optimisation de bande passante par défaut.",
                                    "type": "object",
                                    "properties": {
                                        "max_dropped_ticks": {
                                            "description": "En relation avec la valeur d'optimisation, détermine le nombre maximum de ticks que les paquets de mise à jour spatiale peuvent être abandonnés.",
                                            "type": "integer"
                                        },
                                        "max_optimized_distance": {
                                            "description": "La distance maximale considérée lors des optimisations de bande passante. Toute valeur inférieure à la valeur maximale est interpolée pour trouver l'optimisation, et toute valeur supérieure ou égale à la valeur maximale donne une optimisation maximale.",
                                            "type": "integer"
                                        },
                                        "use_motion_prediction_hints": {
                                            "description": "Lorsque défini sur true, des paquets de mouvement plus petits seront envoyés pendant les intervalles de paquets abandonnés, ce qui permet d'envoyer la même quantité de paquets qu'avec des optimisations mais avec moins de données envoyées. Cela devrait être utilisé pour éviter les anomalies visuelles lorsque les entités se déplacent rapidement ou se téléportent.",
                                            "default": false,
                                            "type": "boolean"
                                        }
                                    }
                                }
                            }
                        },
                        "minecraft:custom_hit_test": {
                            "description": "Définit les boîtes de collision pour les attaques de mêlée et à distance contre l'Entité.",
                            "type": "object",
                            "properties": {
                                "hitboxes": {
                                    "description": "Contient les boîtes de collision pour les attaques de mêlée et à distance contre l'Entité.",
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "height": {
                                                "description": "La hauteur de la boîte de collision en blocs. Une valeur négative sera considérée comme 0.",
                                                "type": "number"
                                            },
                                            "width": {
                                                "description": "La largeur de la boîte de collision en blocs. Une valeur négative sera considérée comme 0.",
                                                "type": "number"
                                            },
                                            "pivot": {
                                                "description": "Le point de pivot de la boîte de collision.",
                                                "type": "array",
                                                "minItems": 3,
                                                "maxItems": 3,
                                                "items": {
                                                    "type": "number"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "minecraft:damage_over_time": {
                            "description": "Inflige un montant de dégâts à l'Entité à des intervalles spécifiés.",
                            "type": "object",
                            "properties": {
                                "damage_per_hurt": {
                                    "description": "Montant de dégâts infligés à l'Entité à chaque intervalle.",
                                    "default": 1,
                                    "type": "integer"
                                },
                                "time_between_hurt": {
                                    "description": "Temps en secondes entre les dégâts.",
                                    "default": 0.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:damage_sensor": {
                            "description": "Définit les événements à appeler lorsque l'Entité est endommagée par des entités ou des items spécifiques.",
                            "type": "object",
                            "properties": {
                                "triggers": {
                                    "description": "Liste des déclencheurs avec les événements à appeler lors de la prise de dégâts spécifiques.",
                                    "oneOf": [
                                        {
                                            "type": "object",
                                            "properties": {
                                                "cause": {
                                                    "description": "Type de dégâts qui déclenchera l'événement.",
                                                    "default": "none",
                                                    "type": "string",
                                                    enum: schemaEnums.entity_damage_causes
                                                },
                                                "damage_modifier": {
                                                    "description": "Un modificateur qui ajoute/retire aux dégâts de base reçus du type de dégâts spécifié. Il ne réduit pas les dégâts à moins de 0.",
                                                    "default": 0.0,
                                                    "type": "number"
                                                },
                                                "damage_multiplier": {
                                                    "description": "Un multiplicateur qui modifie les dégâts de base reçus du type de dégâts spécifié. Si 'deals_damage' est vrai, le multiplicateur ne peut que réduire les dégâts que l'entité recevra à un minimum de 1.",
                                                    "default": 1.0,
                                                    "type": "number"
                                                },
                                                "deals_damage": {
                                                    "description":
                                                    "Définit si le déclencheur inflige des dégâts à l'entité.\n\n" +
                                                    "`yes`: inflige des dégâts à l'entité. \n" +
                                                    "`no`: n'inflige pas de dégâts à l'entité. \n" +
                                                    "`no_but_side_effects_apply`: n'inflige pas de dégâts à l'entité, mais les effets secondaires de l'attaque le sont. Cela signifie que l'arme de l'attaquant perd de la durabilité, les effets secondaires des enchantements sont appliqués, etc.",
                                                    "default": "yes",
                                                    "type": "string",
                                                    "enum": ["yes", "no", "no_but_side_effects_apply"]
                                                },
                                                "on_damage": {
                                                    "description": "Définit l'événement à appeler lorsque l'Entité est endommagée par le type de dégâts spécifié.",
                                                    oneOf: [
                                                        {
                                                            type: "string"
                                                        },
                                                        commonSchemas.entity_event_trigger
                                                    ]
                                                },
                                                "on_damage_sound_event": {
                                                    "description": "Définit l'événement sonore à jouer lorsque l'Entité est endommagée par le type de dégâts spécifié.",
                                                    "type": "string"
                                                }
                                            }
                                        },
                                        {
                                            "type": "array",
                                            "items": {
                                                "$ref": "#/properties/minecraft:entity/properties/components/properties/minecraft:damage_sensor/properties/triggers/oneOf/0"
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        "minecraft:dash": {
                            "description": "Détermine si l'Entité chevauchable peut effectuer un dash comme le chameau.",
                            "type": "object",
                            "properties": {
                                "cooldown_time": {
                                    "description": "Le temps de recharge du dash, en secondes.`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "horizontal_momentum": {
                                    "description": "Le momentum horizontal du dash.",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "vertical_momentum": {
                                    "description": "Le momentum vertical du dash.`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:default_look_angle": {
                            "description": "Définit l'angle par défaut de rotation de la tête de l'Entité.",
                            "type": "object",
                            "properties": {
                                "value": {
                                    "description": "L'angle de rotation de la tête de l'Entité.",
                                    "default": 0.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:despawn": {
                            "description": "Force l'Entité à despawn lorsqu'une condition spécifique est remplie.",
                            "type": "object",
                            "properties": {
                                "despawn_from_distance": {
                                    "description": "Spécifie si la distance minimale et maximale est utilisée dans les règles de despawn standard.",
                                    "type": "object",
                                    "properties": {
                                        "max_distance": {
                                            "description": "Distance maximale pour les règles de despawn standard pour faire disparaitre instantanément l'Entité.",
                                            "default": 128,
                                            "type": "integer"
                                        },
                                        "min_distance": {
                                            "description": "Distance minimale pour les règles de despawn standard pour essayer de faire disparaitre l'Entité.",
                                            "default": 32,
                                            "type": "integer"
                                        }
                                    }
                                },
                                "despawn_from_chance": {
                                    "description": "Détermine si 'min_range_random_chance' est utilisé dans les règles de despawn standard.",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "despawn_from_inactivity": {
                                    "description": "Détermine si 'min_range_inactivity_timer' est utilisé dans les règles de despawn standard.",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "despawn_from_simulation_edge": {
                                    "description": "Détermine si l'Entité est instantanément despawn à la limite de la distance de simulation dans les règles de despawn standard.",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "filters": {
                                    "description": "La liste des conditions qui doivent être satisfaites avant que l'Entité ne soit despawn. Si un filtre est défini, les règles de despawn standard sont ignorées.",
                                    ...commonSchemas.minecraft_filter
                                },
                                "min_range_inactivity_timer": {
                                    "description": "Le temps en secondes que l'Entité doit être inactive avant de despawn.",
                                    "default": 30,
                                    "type": "integer"
                                },
                                "min_range_random_chance": {
                                    "description": "Une chance aléatoire entre 1 et la valeur donnée pour que l'Entité despawn.",
                                    "default": 800,
                                    "type": "integer"
                                },
                                "remove_child_entities": {
                                    "description": "Définit si toutes les entités liées à cette Entité dans une relation enfant (par exemple, en laisse) seront également despawn.",
                                    "default": false,
                                    "type": "boolean"
                                }
                            }
                        },
                        "minecraft:dimension_bound": {
                            "description": "Empêche l'Entité de changer de dimension via les portails.",
                            "type": "object"
                        },
                        "minecraft:drying_out_timer": {
                            "description": "Définit un minuteur pour le séchage qui comptera et initiera `dried_out_event` ou s'arrêtera si l'Entité est sous la pluie ou dans l'eau, initialisant `stopped_drying_out_event`.",
                            "type": "object",
                            "properties": {
                                "total_time": {
                                    "description": "Temps en secondes avant que l'Entité ne soit complètement séchée.",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "dried_out_event": {
                                    "description": "Evénement à executer lorsque l'Entité est complètement séchée.",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "recover_after_dried_out_event": {
                                    "description": "Evénement à executer lorsque l'Entité est déjà complètement séchée mais reçoit un approvisionnement en eau.",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "stopped_drying_out_event": {
                                    "description": "Evénement à executer lorsque l'Entité est sous la pluie ou dans l'eau.",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "water_bottle_refill_time": {
                                    "description": "Temps supplémentaire, en secondes, donné par l'utilisation d'une bouteille d'eau sur l'Entité.",
                                    "default": 0.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:dweller": {
                            "description": "Force l'Entité à rejoindre et migrer entre les villages et autres habitations.",
                            "type": "object",
                            "properties": {
                                "dwelling_type": {
                                    "description": "Le type de logement que l'Entité souhaite rejoindre.",
                                    type: "string",
                                    enum: ["village"]
                                },
                                "dweller_role": {
                                    "description": "Le role que l'Entité joue dans le logement.",
                                    "type": "string",
                                    "enum": ["inhabitant", "defender", "hostile", "passive"]
                                },
                                "update_interval_base": {
                                    "description": "Définit la fréquence à laquelle l'Entité vérifie son statut de logement en ticks. Valeurs positives uniquement.",
                                    "type": "number",
                                    "minimum": 0.0
                                },
                                "update_interval_variant": {
                                    "description": "La valeur de variante en ticks qui sera ajoutée à `update_interval_base`.",
                                    "type": "number"
                                },
                                "can_find_poi": {
                                    "description": "Définit si l'Entité peut trouver et ajouter des POI au logement.",
                                    "type": "boolean"
                                },
                                "first_founding_reward": {
                                    "description": "Détermine combien de réputation les joueurs sont récompensés lors de la première fondation.",
                                    "type": "integer"
                                },
                                "can_migrate": {
                                    "description": "Détermine si l'Entité peut migrer entre les logements, ou seulement avoir son logement initial.",
                                    "type": "boolean"
                                },
                                "dwelling_bounds_tolerance": {
                                    "description": "Une distance de tampon pour vérifier si l'Entité est dans le logement.",
                                    "type": "number"
                                },
                                "preferred_profession": {
                                    "description": "Permet à l'utilisateur de définir une profession de départ pour ce Dweller particulier, au lieu de les laisser choisir de manière organique. (Ils doivent toujours gagner de l'expérience en échange avant que cela ne prenne effet.)",
                                    "type": "string"
                                }
                            }
                        },
                        "minecraft:economy_trade_table": {
                            "description": "Donne la capacité à l'Entité d'echanger avec les joueurs.",
                            "type": "object",
                            "properties": {
                                "convert_trades_economy": {
                                    "description": "Définit si l'Entité doit convertir ses échanges lorsqu'elle est transformée en une autre entité avec un 'economy_trade_table'.",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "cured_discount": {
                                    "description": "De combien le rabais doit être modifié lorsque le joueur a guéri le Zombie Villager. Peut être spécifié comme une paire de nombres (rabais de commerce de bas niveau et rabais de commerce de haut niveau).",
                                    "default": [-5, -20],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "integer"
                                    }
                                },
                                "display_name": {
                                    "description":
                                    "**ℹ️ Texte traduisable**\n\n" +
                                    "Le nom à afficher lors de l'échange avec l'Entité.",
                                    "type": "string"
                                },
                                "hero_demand_discount": {
                                    "description": "Utilisé dans les prix hérités pour déterminer de combien la demande doit être modifiée lorsque le joueur a l'effet de mob Hero of the Village.",
                                    "default": -4,
                                    "type": "integer"
                                },
                                "max_cured_discount": {
                                    "description": "Le montant maximum que le rabais peut être modifié lorsque le joueur a guéri le Zombie Villager. Peut être spécifié comme une paire de nombres (rabais de commerce de bas niveau et rabais de commerce de haut niveau).",
                                    "default": [-25, -63],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "integer"
                                    }
                                },
                                "max_nearby_cured_discount": {
                                    "description": "Le montant maximum que le rabais peut être modifié lorsque le joueur a guéri un Zombie Villager à proximité.",
                                    "default": -200,
                                    "type": "integer"
                                },
                                "nearby_cured_discount": {
                                    "description": "De combien le rabais doit être modifié lorsque le joueur a guéri un Zombie Villager à proximité.",
                                    "default": -25,
                                    "type": "integer"
                                },
                                "new_screen": {
                                    "description": "Utilisé pour déterminer si le commerce avec l'Entité ouvre le nouvel écran de commerce.",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "persist_trades": {
                                    "description": "Détermine si les échanges doivent persister lorsque l'Entité se transforme. Cela fait en sorte que la prochaine fois que le mob est transformé en quelque chose avec un `trade_table` ou `economy_trade_table`, il conserve ses échanges.",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "show_trade_screen": {
                                    "description": "Montre un écran de commerce en jeu lors de l'interaction avec l'Entité.",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "table": {
                                    "description": "Chemin relatif à la racine du pack de comportement pour les échanges de cette Entité.",
                                    "type": "string",
                                    "pattern": schemaPatterns.trading_file,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.trading_file_paths
                                },
                                "use_legacy_price_formula": {
                                    "description": "Détermine si la formule ancienne est utilisée pour déterminer les prix de commerce.",
                                    "default": false,
                                    "type": "boolean"
                                }   
                            }
                        },
                        "minecraft:entity_armor_equipment_slot_mapping": {
                            "description": "Spécifie l'emplacement de l'armure où un item dans le deuxième slot du composant 'minecraft:equippable' doit être équipé. Note: Ceci est automatiquement appliqué à toutes les entités pour les mondes avec une version supérieure ou égale à 1.21.10. Pour les mondes plus anciens, `slot.armor.torso` sera utilisé. Il est fortement conseillé de ne pas utiliser explicitement ce composant, car aucune compatibilité ascendante ne sera fournie.",
                            "type": "object",
                            "properties": {
                                "armor_slot": {
                                    "description": "Spécifie l'emplacement de l'armure où un item dans le deuxième slot du composant 'minecraft:equippable' doit être équipé.",
                                    "default": "slot.armor.body",
                                    "type": "string"
                                }
                            }
                        },
                        "minecraft:entity_sensor": {
                            "description": "Composant qui possède plusieurs sous-cpateurs où chacun déclenche un événement  lorsque les conditions sont valides par les autres entités dans la plage défini.",
                            "type": "object",
                            "properties": {
                                "event": {
                                    "description": "L'événement à déclencher quand les conditions sont remplies.",
                                    "type": "string"
                                },
                                "event_filters": {
                                    "description": "L'ensemble de conditions qui doivent être satisfaites pour que l'événement soit déclenché.",
                                    ...commonSchemas.minecraft_filter
                                },
                                "maximum_count": {
                                    "description": "Le nombre maximum d'entités qui peuvent être détectées. ",
                                    "default": -1,
                                    "type": "integer"
                                },
                                "minimum_count": {
                                    "description": "Le nombre minimum d'entités qui doivent être détectées  pour que l'événement soit déclenché.",
                                    "default": 1,
                                    "type": "integer"
                                },
                                "relative_range": {
                                    "description": "Définit si la plage est additive par rapport à la taille de l'entité. Note: Additive signifie que la plage est ajoutée à la taille de l'entité.",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "require_all": {
                                    "description": "Définit si toutes les entités à portée doivent satisfaire les conditions pour que l'événement soit déclenché.",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "sensor_range": {
                                    "description": "La distance maximale à laquelle les entités peuvent être détectées.`",
                                    "default": 10,
                                    "type": "number"
                                },
                                "y_offset": {
                                    "description": "Décalage vertical appliquée à la position de l'Entité lors du calcul de la distance par rapport aux autres entités.",
                                    "default": 0.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:environment_sensor": {
                            "description": "Crée un déclencheur basé sur les conditions de l'environnement.",
                            "type": "object",
                            "properties": {
                                "triggers": {
                                    "description": "La liste des déclencheurs qui sont déclenchés lorsque les conditions de l'environnement correspondent aux critères de filtre donnés.",
                                    "oneOf": [
                                        commonSchemas.entity_event_trigger,
                                        {
                                            "type": "array",
                                            "items": {
                                                "$ref": "#/properties/minecraft:entity/properties/components/properties/minecraft:environment_sensor/properties/triggers/oneOf/0"
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        "minecraft:equip_item": {
                            "description": "Force l'Entité à équiper des items.",
                            "type": "object",
                            "properties": {
                                "excluded_items": {
                                    "description": "Liste des items que l'Entité ne peut pas équiper.",
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                    }
                                }
                            }
                        },
                        "minecraft:equipment": {
                            "description": "Définit la Loot Table à utiliser pour l'équipement de l'Entité.",
                            "type": "object",
                            "properties": {
                                "slot_drop_chance": {
                                    "description": "Une liste de slots avec la chance de laisser tomber un item équipé de ce slot.",
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "slot": {
                                                "description": "Le slot de l'équipement.",
                                                "type": "string",
                                                enum: ["slot.weapon.mainhand", "slot.weapon.offhand", "slot.armor.chest", "slot.armor.feet", "slot.armor.legs", "slot.armor.head"]
                                            },
                                            "drop_chance": {
                                                "description": "Définit la chance de laisser tomber un item équipé de ce slot.",
                                                "type": "number",
                                                "minimum": 0.0,
                                                "maximum": 1.0
                                            }
                                        }
                                    }
                                },
                                "table": {
                                    "description": "Le chemin relatif à la racine du pack de comportement de la Loot Table à utiliser pour l'équipement de l'Entité.",
                                    "type": "string",
                                    "pattern": schemaPatterns.loot_tables_file,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.loot_table_file_paths
                                }
                            }
                        },
                        "minecraft:equippable": {
                            "description": "Définit le comportement des slots de l'Entité.",
                            "type": "object",
                            "properties": {
                                "slots": {
                                    "description": "Liste des slots et l'item qui peut être équipé.",
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "accepted_items": {
                                                "description": "Liste des items qui peuvent être équipés dans ce slot.",
                                                "type": "array",
                                                "items": {
                                                    "type": "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                                }
                                            },
                                            "interact_text": {
                                                "description":
                                                "**ℹ️ Texte traduisable**\n\n" +
                                                "Texte à afficher lors de l'interaction avec l'Entité pour équiper l'item pour les joueurs qui joue en tactile.",
                                                "type": "string"
                                            },
                                            "item": {
                                                "description": "Identifiant de l'item qui peut être équipé pour le slot.",
                                                "type": "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                            },
                                            "on_equip": {
                                                "description": "Evénement à executer lorsque l'item est équipé.",
                                                oneOf: [
                                                    {
                                                        type: "string"
                                                    },
                                                    commonSchemas.entity_event_trigger
                                                ]
                                            },
                                            "on_unequip": {
                                                "description": "Evénement à executer lorsque l'item est déséquipé.",
                                                oneOf: [
                                                    {
                                                        type: "string"
                                                    },
                                                    commonSchemas.entity_event_trigger
                                                ]
                                            },
                                            "slot": {
                                                "description": "Le numero de slot de ce slot.",
                                                "default": 0,
                                                "type": "integer"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "minecraft:exhaustion_values": {
                            "description": "Définit combien d'épuisement chaque action du joueur devrait prendre.",
                            "type": "object",
                            "properties": {
                                "attack": {
                                    "description": "Montant d'épuisement appliqué lors d'une attaque. \nType: `Number`",
                                    "default": 0.1,
                                    "type": "number"
                                },
                                "damage": {
                                    "description": "Montant d'épuisement appliqué lors de la prise de dégâts. \nType: `Number`",
                                    "default": 0.1,
                                    "type": "number"
                                },
                                "heal": {
                                    "description": "Montant d'épuisement appliqué lors de la guérison grâce àa la regénération de nourriture. \nType: `Number`",
                                    "default": 6,
                                    "type": "number"
                                },
                                "jump": {
                                    "description": "Montant d'épuisement appliqué lors d'un saut. \nType: `Number`",
                                    "default": 0.05,
                                    "type": "number"
                                },
                                "mine": {
                                    "description": "Montant d'épuisement appliqué lors de l'exploitation minière. \nType: `Number`",
                                    "default": 0.005,
                                    "type": "number"
                                },
                                "sprint": {
                                    "description": "Montant d'épuisement appliqué lors de la course. \nType: `Number`",
                                    "default": 0.01,
                                    "type": "number"
                                },
                                "sprint_jump": {
                                    "description": "Montant d'épuisement appliqué lors d'un saut en sprint. \nType: `Number`",
                                    "default": 0.2,
                                    "type": "number"
                                },
                                "swim": {
                                    "description": "Montant d'épuisement appliqué lors de la nage. \nType: `Number`",
                                    "default": 0.01,
                                    "type": "number"
                                },
                                "walk": {
                                    "description": "Montant d'épuisement appliqué lors de la marche. \nType: `Number`",
                                    "default": 0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:experience_reward": {
                            "description": "Définit la quantité d'expérience récompensée lorsqu'une Entité meurt ou est élevée avec succès. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "on_bred": {
                                    "description": "Une expression Molang définissant la quantité d'expérience récompensée lorsque l'Entité est élevée avec succès. Un tableau d'expressions ajoute le résultat de chaque expression ensemble pour un total final.",
                                    "default": 0,
                                    "oneOf": [
                                        {
                                            "type": "molang"
                                        },
                                        {
                                            "type": "array",
                                            items: {
                                                type: "molang"
                                            }
                                        }
                                    ]
                                },
                                "on_death": {
                                    "description": "Une expression Molang définissant la quantité d'expérience récompensée lorsque l'Entité meurt. Un tableau d'expressions ajoute le résultat de chaque expression ensemble pour un total final.",
                                    "default": 0,
                                    "oneOf": [
                                        {
                                            "type": "molang"
                                        },
                                        {
                                            "type": "array",
                                            items: {
                                                type: "molang"
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        "minecraft:explode": {
                            "description": "Définit comment l'Entité explose. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "allow_underwater": {
                                    "description": "Définit si l'explosion affectera les blocs et les entités sous l'eau. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "breaks_blocks": {
                                    "description": "Définit si l'explosion détruira les blocs dans le rayon de l'explosion. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "causes_fire": {
                                    "description": "Définit si les blocs dans le rayon de l'explosion seront en feu. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "damage_scaling": {
                                    "description": "Un facteur d'échelle appliqué aux dégâts de l'explosion aux entités. Une valeur de 0.0 empêche l'explosion de causer des dégâts. Les valeurs négatives font que l'explosion soigne les entités à la place. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "fire_affected_by_griefing": {
                                    "description": "Définit si l'explosion qui cause le feu est affectée par la Gamerule de mob griefing. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "fuse_length": {
                                    "description": "La plage de temps aléatoire pendant laquelle la mèche sera allumée avant d'exploser; une valeur négative signifie que l'explosion sera immédiate. \nType: `Number | Number[2]`",
                                    "default": [0.0, 0.0],
                                    "oneOf": [
                                        {
                                            "type": "array",
                                            "minItems": 2,
                                            "maxItems": 2,
                                            "items": {
                                                "type": "number"
                                            }
                                        },
                                        {
                                            "type": "number"
                                        }
                                    ]
                                },
                                "fuse_lit": {
                                    "description": "Definit si la mèche est déjà allumée lorsque ce composant est ajouté à l'Entité. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "knockback_scaling": {
                                    "description": "Un facteur d'échelle appliqué à la force de recul causée par l'explosion. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "max_resistance": {
                                    "description": "La résistance à l'explosion d'un bloc sera plafonnée à cette valeur lorsqu'une explosion se produit. \nType: `Number | String`",
                                    "default": 3.40282e+38,
                                    "oneOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "const": "infinite"
                                        }
                                    ]
                                },
                                "negates_fall_damage": {
                                    "description": "Définit si l'explosion doit appliquer la négation des dégâts de chute aux entités au-dessus du point de collision. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "particle_effect": {
                                    "description": "Le nom de l'effet de particules à utiliser. \nType: `String`",
                                    "default": "explosion",
                                    "enum": ["explosion", "wind_burst", "breeze_wind_burst"]
                                },
                                "power": {
                                    "description": "Le rayon de l'explosion en blocs et les dégâts que l'explosion inflige. \nType: `Number`",
                                    "default": 3.0,
                                    "type": "number"
                                },
                                "sound_effect": {
                                    "description": "Le nom de l'effet sonore à jouer lorsque l'explosion se produit. \nType: `String`",
                                    "default": "explode",
                                    "type": "string"
                                },
                                "toggles_blocks": {
                                    "description": "Définit si l'explosion bascule les blocs dans le rayon de l'explosion. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                }
                            }
                        },
                        "minecraft:fire_immune": {
                            "description": "Permet à l'Entité de ne pas prendre de dégâts de feu. \nType: `Object`",
                            "type": "object"
                        },
                        "minecraft:floats_in_liquid": {
                            "description": "Permet à l'Entité de flotter dans les blocs liquides. \nType: `Object`",
                            "type": "object"
                        },
                        "minecraft:flocking": {
                            "description": "Force l'Entité à se regrouper et de se déplacer soit vers l'eau, soit loin de l'eau. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "block_distance": {
                                    "description": "La distance en blocs que l'Entité regardera et se déplacera. \nType: `Number`",
                                    "default": 0,
                                    "type": "number"
                                },
                                "block_weight": {
                                    "description": "Le poids de la poussée vers ou loin des blocs. \nType: `Number`",
                                    "default": 0,
                                    "type": "number"
                                },
                                "breach_influence": {
                                    "description": "Le montant de résistance donné à une entité de regroupement qui sort de l'eau. \nType: `Number`",
                                    "default": 0,
                                    "type": "number"
                                },
                                "cohesion_threshold": {
                                    "description": "Le seuil à partir duquel commencer à appliquer la cohésion. \nType: `Number`",
                                    "default": 1,
                                    "type": "number"
                                },
                                "cohesion_weight": {
                                    "description": "Le poids appliqué pour la cohésion du troupeau. \nType: `Number`",
                                    "default": 1,
                                    "type": "number"
                                },
                                "goal_weight": {
                                    "description": "Le poids sur lequel appliquer sur la sortie de l'objectif. \nType: `Number`",
                                    "default": 0,
                                    "type": "number"
                                },
                                "high_flock_limit": {
                                    "description": "Détermine le nombre maximum d'entités dans le troupeau avant que la cohésion ne soit appliquée. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "in_water": {
                                    "description": "Définit si l'Entité est dans l'eau. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "influence_radius": {
                                    "description": "La zone autour de l'entité qui permet d'ajouter d'autres entités au troupeau. \nType: `Number`",
                                    "default": 0,
                                    "type": "number"
                                },
                                "inner_cohesion_threshold": {
                                    "description": "La distance à partir de laquelle commencer à appliquer la cohésion. \nType: `Number`",
                                    "default": 0,
                                    "type": "number"
                                },
                                "loner_chance": {
                                    "description": "Le pourcentage de chance entre 0-1 qu'un poisson ne veuille pas rejoindre un troupeau. Les valeurs invalides seront plafonnées aux points finaux. \nType: `Number`",
                                    "default": 0,
                                    "type": "number"
                                },
                                "low_flock_limit": {
                                    "description": "Détermine le nombre minimum d'entités dans le troupeau avant que la cohésion ne soit appliquée. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "match_variants": {
                                    "description": "Définit si les entités doivent correspondre à la variante de l'entité cible. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "max_height": {
                                    "description": "La hauteur maximale autorisée dans l'air ou l'eau. \nType: `Number`",
                                    "default": 0,
                                    "type": "number"
                                },
                                "min_height": {
                                    "description": "La hauteur minimale autorisée dans l'air ou l'eau. \nType: `Number`",
                                    "default": 0,
                                    "type": "number"
                                },
                                "separation_threshold": {
                                    "description": "La distance qui est déterminée comme trop proche d'un autre troupeau et de commencer à appliquer la séparation. \nType: `Number`",
                                    "default": 2,
                                    "type": "number"
                                },
                                "separation_weight": {
                                    "description": "Le poids appliqué à la séparation du troupeau. \nType: `Number`",
                                    "default": 1,
                                    "type": "number"
                                },
                                "use_center_of_mass": {
                                    "description": "Définit si les entités de troupeau suivront les troupeaux en fonction du centre de masse. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                }
                            }
                        },
                        "minecraft:flying_speed": {
                            "description": "Définit la vitesse en blocs à laquelle l'Entité vole. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "value": {
                                    "description": "La vitesse en blocs à laquelle l'Entité vole. \nType: `Number`",
                                    "default": 0.02,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:follow_range": {
                            "description": "Définit la plage, en blocs, à laquelle l'Entité suivra un joueur. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "value": {
                                    "description": "Le rayon de la zone de blocs dans laquelle l'Entité suivra un joueur. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "max": {
                                    "description": "Distance maximale à laquelle l'Entité suivra un joueur. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:friction_modifier": {
                            "description": "Définit comment la friction affecte l'Entité. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "value": {
                                    "description": "Plus le nombre est élevé, plus la friction affecte cette Entité. Une valeur de 1.0 signifie une friction régulière, tandis que 2.0 signifie le double. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:game_event_movement_tracking": {
                            "description": "Force l'Entié à émettre des événements de jeu de mouvement. \nType: `Object` \nNote: Ce composant force une entité à émettre des événements de jeu de mouvement, tels que entityMove, swim et flap, en fonction du bloc à travers lequel l'entité se déplace. Il est ajouté par défaut à chaque mob. Ajoutez-le à nouveau pour remplacer son comportement.",
                            "type": "object",
                            "properties": {
                                "emit_flap": {
                                    "description": "Définit si l'événement de jeu de mouvement de vol doit être émis lorsque l'Entité se déplace à travers l'air. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "emit_move": {
                                    "description": "Définit si l'événement de jeu de mouvement doit être émis lorsque l'Entité se déplace à travers un bloc solide. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "emit_swim": {
                                    "description": "Définit si l'événement de jeu de mouvement de nage doit être émis lorsque l'Entité se déplace à travers un liquide. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                }
                            }
                        },
                        "minecraft:genetics": {
                            "description": "Définit la façon dont les gènes et les allèles d'une Entité sont transmis à sa progéniture, et comment ces traits se manifestent chez l'enfant. \nType: `Object` \nNote: Les gènes et les allèles compatibles sont croisés ensemble, les allèles sont transmis des parents à l'enfant, et toutes les variantes génétiques correspondantes déclenchent des événements JSON pour modifier l'enfant et exprimer les traits.",
                            "type": "object",
                            "properties": {
                                "genes": {
                                    "description": "La liste des gènes que cette Entité a et croisera avec un partenaire lors de la reproduction. \nType: `Object[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "allele_range": {
                                                "description": "La plage de valeurs d'allèles pour ce gène. Les valeurs d'allèles sont des entiers positifs. \nType: `Object`",
                                                "type": "object",
                                                "properties": {
                                                    "range_max": {
                                                        "description": "La valeur maximale de l'allèle pour ce gène. \nType: `Integer`",
                                                        "default": 0,
                                                        "type": "integer"
                                                    },
                                                    "range_min": {
                                                        "description": "La valeur minimale de l'allèle pour ce gène. \nType: `Integer`",
                                                        "default": 0,
                                                        "type": "integer"
                                                    }
                                                }
                                            },
                                            "genetic_variants": {
                                                "description": "La liste des variantes génétiques pour ce gène. Ils vérifient les combinaisons d'allèles particulières et déclenchent des événements lorsque toutes sont satisfaites. \nType: `Object[]`",
                                                "type": "array",
                                                "items": {
                                                    "type": "object",
                                                    "properties": {
                                                        "birth_event": {
                                                            "description": "Evénement à déclencher lorsque l'Entité est créée et que les conditions d'allèle sont remplies. \nType: `EventTrigger`",
                                                            oneOf: [
                                                                {
                                                                    type: "string"
                                                                },
                                                                commonSchemas.entity_event_trigger
                                                            ]
                                                        },
                                                        "both_allele": {
                                                            "description": "Si cette valeur est non négative, comparez les allèles principaux et cachés de l'Entité avec cette valeur pour une correspondance avec les deux. Peut également être une plage d'entiers. \nType: `Integer | Object`",
                                                            "default": -1,
                                                            "oneOf": [
                                                                {
                                                                    "type": "integer"
                                                                },
                                                                {
                                                                    "type": "object",
                                                                    "properties": {
                                                                        "range_min": {
                                                                            "description": "La valeur minimale de l'allèle pour ce gène. \nType: `Integer`",
                                                                            "type": "integer"
                                                                        },
                                                                        "range_max": {
                                                                            "description": "La valeur maximale de l'allèle pour ce gène. \nType: `Integer`",
                                                                            "type": "integer"
                                                                        }
                                                                    }
                                                                }
                                                            ]
                                                        },
                                                        "either_allele": {
                                                            "description": "Si cette valeur est non négative, comparez les allèles principaux et cachés de l'Entité avec cette valeur pour une correspondance avec l'un ou l'autre. Peut également être une plage d'entiers. \nType: `Integer | Object`",
                                                            "default": -1,
                                                            "oneOf": [
                                                                {
                                                                    "type": "integer"
                                                                },
                                                                {
                                                                    "type": "object",
                                                                    "properties": {
                                                                        "range_min": {
                                                                            "description": "La valeur minimale de l'allèle pour ce gène. \nType: `Integer`",
                                                                            "type": "integer"
                                                                        },
                                                                        "range_max": {
                                                                            "description": "La valeur maximale de l'allèle pour ce gène. \nType: `Integer`",
                                                                            "type": "integer"
                                                                        }
                                                                    }
                                                                }
                                                            ]
                                                        },
                                                        "hidden_allele": {
                                                            "description": "Si cette valeur est non négative, comparez l'allèle caché de l'Entité avec cette valeur pour une correspondance. Peut également être une plage d'entiers. \nType: `Integer | Object`",
                                                            "default": -1,
                                                            "oneOf": [
                                                                {
                                                                    "type": "integer"
                                                                },
                                                                {
                                                                    "type": "object",
                                                                    "properties": {
                                                                        "range_min": {
                                                                            "description": "La valeur minimale de l'allèle pour ce gène. \nType: `Integer`",
                                                                            "type": "integer"
                                                                        },
                                                                        "range_max": {
                                                                            "description": "La valeur maximale de l'allèle pour ce gène. \nType: `Integer`",
                                                                            "type": "integer"
                                                                        }
                                                                    }
                                                                }
                                                            ]
                                                        },
                                                        "main_allele": {
                                                            "description": "Si cette valeur est non négative, comparez l'allèle principal de l'Entité avec cette valeur pour une correspondance. Peut également être une plage d'entiers. \nType: `Integer | Object`",
                                                            "default": -1,
                                                            "oneOf": [
                                                                {
                                                                    "type": "integer"
                                                                },
                                                                {
                                                                    "type": "object",
                                                                    "properties": {
                                                                        "range_min": {
                                                                            "description": "La valeur minimale de l'allèle pour ce gène. \nType: `Integer`",
                                                                            "type": "integer"
                                                                        },
                                                                        "range_max": {
                                                                            "description": "La valeur maximale de l'allèle pour ce gène. \nType: `Integer`",
                                                                            "type": "integer"
                                                                        }
                                                                    }
                                                                }
                                                            ]
                                                        },
                                                        "mutation_rate": {
                                                            "description": "Si cette valeur est non négative, remplacez la valeur de l'allèle principal de l'Entité par une valeur aléatoire entre 0 et la valeur de cette propriété. \nType: `Number` \nNote: Les valeurs non négatives supérieures à 1 seront les mêmes que la valeur 1.",
                                                            "default": -1,
                                                            "type": "number"
                                                        }
                                                    }
                                                }
                                            },
                                            "name": {
                                                "description": "Le nom du gène. \nType: `String`",
                                                "type": "string"
                                            }
                                        }
                                    }
                                },
                                "mutation_rate": {
                                    "description": "Chance qu'un allèle soit remplacé par un autre allèle aléatoire au lieu de l'allèle du parent lors de la naissance. \nType: `Number`",
                                    "default": 0.03125,
                                    "type": "number"
                                },
                                "use_simplified_breeding": {
                                    "description": "Définit si il est interdit d'hériter des allèles cachés des parents en tant qu'allèles principaux chez les enfants et d'hériter des allèles principaux en tant qu'allèles cachés chez les enfants. \nType: `Boolean`",
                                    "type": "boolean"
                                }
                            }
                        },
                        "minecraft:giveable": {
                            "description": "Définit les ensembles d'items qui peuvent être utilisés pour déclencher des événements lorsqu'ils sont utilisés sur l'Entité. L'item sera également pris et placé dans l'inventaire de l'Entité. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "triggers": {
                                    "description": "Le déclencheur qui est déclenché lorsque l'item est utilisé sur l'Entité. \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "cooldown": {
                                            "description": "Un temps de recharge en secondes pour empêcher le spam des interactions. \nType: `Number`",
                                            "default": 0.0,
                                            "type": "number"
                                        },
                                        "items": {
                                            "description": "La liste des items qui peuvent être utilisés pour déclencher l'événement. \nType: `String[]`",
                                            "type": "array",
                                            "items": {
                                                "type": "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                            }
                                        },
                                        "on_give": {
                                            "description": "Evénement à déclencher lorsque l'item est donné à l'Entité. \nType: `EventTrigger`",
                                            oneOf: [
                                                {
                                                    type: "string"
                                                },
                                                commonSchemas.entity_event_trigger
                                            ]
                                        }
                                    }
                                }
                            }
                        },
                        "minecraft:ground_offset": {
                            "description": "Définit le décalage par rapport au sol que l'Entité est réellement. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "value": {
                                    "description": "La valeur de l'entité par rapport au sol, en blocs. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:group_size": {
                            "description": "Définit la taille du groupe d'entités. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "filters": {
                                    "description": "La liste des conditions qui doivent être satisfaites pour que l'Entité soit comptée dans la taille du groupe. \nType: `Minecraft Filter`",
                                    ...commonSchemas.minecraft_filter
                                },
                                "radius": {
                                    "description": "Rayon autour de l'Entité pour compter les entités dans le groupe. \nType: `Number`",
                                    "default": 16,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:grows_crop": {
                            "description": "Permet à l'Entité de faire pousser des cultures lorsqu'elle marche sur elles. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "chance": {
                                    "description": "Vzaleur entre 0 et 1. Chance que la culture pousse lorsqu'elle est marchée dessus. \nType: `Number`",
                                    "default": 0,
                                    "type": "number",
                                    "minimum": 0,
                                    "maximum": 1
                                },
                                "charges": {
                                    "description": "Nombre de charges avant que l'Entité ne puisse plus faire pousser de cultures. \nType: `Integer`",
                                    "default": 10,
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:healable": {
                            "description": "Définit les interactions avec l'Entité pour la soigner. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "filters": {
                                    "description": "La liste des conditions qui doivent être satisfaites pour que l'Entité puisse être soignée. \nType: `Minecraft Filter`",
                                    ...commonSchemas.minecraft_filter
                                },
                                "force_use": {
                                    "description": "Détermine si un item peut être utilisé indépendamment de l'Entité étant en pleine santé. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "items": {
                                    "description": "La liste des items qui peuvent être utilisés pour soigner l'Entité. \nType: `Object[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "effects": {
                                                "description": "Liste des effets à appliquer à l'Entité lorsqu'elle est nourrie avec cet item. \nType: `Object[]`",
                                                "type": "array",
                                                "items": {
                                                    "type": "object",
                                                    "required": ["name"],
                                                    "properties": {
                                                        "name": {
                                                            "description": "Le nom de l'effet à appliquer à l'Entité. \nType: `String`",
                                                            "type": "string",
                                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.effect_ids
                                                        },
                                                        "chance": {
                                                            "description": "La chance que l'effet soit appliqué à l'Entité. \nType: `Number`",
                                                            "default": 1.0,
                                                            "type": "number"
                                                        },
                                                        "duration": {
                                                            "description": "La durée de l'effet en ticks. \nType: `Integer | String`",
                                                            "default": 0,
                                                            "oneOf": [
                                                                {
                                                                    "type": "integer"
                                                                },
                                                                {
                                                                    "type": "string",
                                                                    "enum": ["infinite"]
                                                                }
                                                            ]
                                                        },
                                                        "amplifier": {
                                                            "description": "Le niveau de l'effet à appliquer à l'Entité. \nType: `Integer`",
                                                            "default": 0,
                                                            "type": "integer"
                                                        }
                                                    }
                                                }
                                            },
                                            "heal_amount": {
                                                "description": "Le montant de santé que l'Entité gagne lorsqu'elle est nourrie avec cet item. \nType: `Integer`",
                                                "default": 1,
                                                "type": "integer"
                                            },
                                            "item": {
                                                "description": "L'item qui peut être utilisé pour soigner l'Entité. \nType: `String`",
                                                "type": "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "minecraft:health": {
                            "description": "Spécifie combien de vie une Entité a lorsqu'elle est invoquée. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "max": {
                                    "description": "La santé maximale que l'Entité peut avoir. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "min": {
                                    "description": "La santé minimale que l'Entité peut avoir. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "value": {
                                    "description": "La quantité de santé que l'Entité a lorsqu'elle est invoquée. \nType: `Integer | Object` \nNote: Si la valeur est un objet, la santé de l'Entité sera aléatoire entre les valeurs min et max.",
                                    "oneOf": [
                                        {
                                            "type": "integer"
                                        },
                                        {
                                            "type": "object",
                                            "properties": {
                                                "min": {
                                                    "description": "La santé minimale que l'Entité peut avoir. \nType: `Integer`",
                                                    "type": "integer"
                                                },
                                                "max": {
                                                    "description": "La santé maximale que l'Entité peut avoir. \nType: `Integer`",
                                                    "type": "integer"
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        "minecraft:heartbeat": {
                            "description": "Définit le battement de coeur de l'Entité. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "interval": {
                                    "description": "Une expression Molang définissant l'intervalle inter-battement en secondes. Une valeur de zéro ou moins signifie pas de battement de coeur. \nType: `Molang` \nNote: Une valeur de zéro ou moins signifie pas de battement de coeur.",
                                    "default": 1.0,
                                    type: "molang"
                                },
                                "sound_event": {
                                    "description": "Evénement sonore de niveau à jouer comme son de battement de coeur. \nType: `String`",
                                    "default": "heartbeat",
                                    "type": "string"
                                }
                            }
                        },
                        "minecraft:hide": {
                            "description": "Force l'Entité à se déplacer et à se cacher à leur POI possédé ou au plus proche à proximité. \nType: `Object`",
                            "type": "object"
                        },
                        "minecraft:home": {
                            "description": "Sauvegarde une position de maison pour l'Entité lorsqu'elle est invoquée. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "home_block_list": {
                                    "description": "Liste optionnelle de blocs qui peuvent être considérés comme une maison valide. Si aucun bloc de ce type n'existe à cette position, la restriction de la maison est supprimée. \nType: `String[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                    }
                                },
                                "restriction_radius": {
                                    "description": "Rayon optionnel dans lequel l'Entité sera restreinte par rapport à sa maison. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "restriction_type": {
                                    "description": "Définit comment l'Entité sera restreinte à sa position de maison. \nType: `String` \n'none': aucune restriction \n'random_movement': mouvement aléatoire restreint autour de la maison \n'all_movement': tout mouvement restreint autour de la maison",
                                    "type": "string",
                                    "enum": ["none", "random_movement", "all_movement"]
                                }
                            }
                        },
                        "minecraft:horse.jump_strength": {
                            "description": "Détermine la hauteur de saut pour un cheval ou une entité similaire, comme un âne. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "value": {
                                    "description": "Valeur de la force de saut que l'Entité a lorsqu'elle est invoquée. \nType: `Integer | Object` \nNote: Si la valeur est un objet, la force de saut de l'Entité sera aléatoire entre les valeurs min et max.",
                                    "oneOf": [
                                        {
                                            "type": "integer"
                                        },
                                        {
                                            "type": "object",
                                            "properties": {
                                                "range_min": {
                                                    "description": "La force de saut minimale que l'Entité peut avoir. \nType: `Integer`",
                                                    "type": "integer"
                                                },
                                                "range_max": {
                                                    "description": "La force de saut maximale que l'Entité peut avoir. \nType: `Integer`",
                                                    "type": "integer"
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        "minecraft:hurt_on_condition": {
                            "description": "Définit un ensemble de conditions dans lesquelles une Entité devrait prendre des dégâts. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "damage_conditions": {
                                    "description": "Liste des conditions de dégâts qui, lorsqu'elles sont remplies, peuvent causer des dégâts à l'Entité. \nType: `Object[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "cause": {
                                                "description": "Le type de dégâts qui peuvent être infligés à l'Entité. \nType: `String` \nNote: Plusieurs armures et sorts utilisent ce champ pour déterminer si l'Entité est immunisée.",
                                                "type": "string",
                                                enum: schemaEnums.entity_damage_causes
                                            },
                                            "damage_per_tick": {
                                                "description": "Montant de dégâts infligés à l'Entité par tick. \nType: `Integer`",
                                                "type": "integer"
                                            },
                                            "filters": {
                                                "description": "Liste des conditions qui doivent être satisfaites pour que l'Entité prenne des dégâts. \nType: `Minecraft Filter`",
                                                ...commonSchemas.minecraft_filter
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "minecraft:ignore_cannot_be_attacked": {
                            "description": "Définit les conditions dans lesquelles une Entité peut être attaquée si elle a le composant 'minecraft:cannot_be_attacked'. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "filters": {
                                    "description": "Définit quelles entités peuvent attaquer l'Entité. \nType: `Minecraft Filter` \nNote: Si cette propriété n'est pas définie, toutes les attaques sont autorisées.",
                                    ...commonSchemas.minecraft_filter
                                }
                            }
                        },
                        "minecraft:input_air_controlled": {
                            "description": "Lorsque l'Entité est chevauchable, l'Entité sera controllée avec les touches du claiver et de la souris dans les 3 dimensions. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "backwards_movement_modifier": {
                                    "description": "Modifie la vitesse de l'Entité lorsqu'elle se déplace en arrière. \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number"
                                },
                                "strafe_speed_modifier": {
                                    "description": "Modifie la vitesse de l'Entité lorsqu'elle se déplace latéralement. \nType: `Number`",
                                    "default": 0.4,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:input_ground_controlled": {
                            "description": "Permet à une Entité montable de pouvoir être contrôlée à l'aide des commandes clavier lorsqu'elle est montée par un joueur. \nType: `Object`",
                            "type": "object"
                        },
                        "minecraft:inside_block_notifier": {
                            "description": "Vérifie si l'Entité est à l'intérieur d'un bloc spécifique. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "block_list": {
                                    "description": "Liste de blocs, avec certains états de blocs, qui sont surveillés pour voir si l'Entité est à l'intérieur. \nType: `Object[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "block": {
                                                "description": "Le nom du bloc à surveiller. \nType: `String | Object`",
                                                oneOf: [
                                                    {
                                                        "type": "string",
                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                    },
                                                    commonSchemas.block_descriptor
                                                ]
                                            },
                                            "entered_block_event": {
                                                "description": "Evénement à déclencher lorsque l'Entité entre dans le bloc. \nType: `EventTrigger`",
                                                oneOf: [
                                                    {
                                                        type: "string"
                                                    },
                                                    commonSchemas.entity_event_trigger
                                                ]
                                            },
                                            "exited_block_event": {
                                                "description": "Evénement à déclencher lorsque l'Entité sort du bloc. \nType: `Object`",
                                                oneOf: [
                                                    {
                                                        type: "string"
                                                    },
                                                    commonSchemas.entity_event_trigger
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "minecraft:insomnia": {
                            "description": "Ajoute un minuteur depuis le dernier repos pour voir si les phantoms doivent apparaître. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "days_until_insomnia": {
                                    "description": "Nombre de jours où l'Entité doit rester éveillée avant que l'effet d'insomnie ne commence. \nType: `Number`",
                                    "default": 3.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:instant_despawn": {
                            "description": "Fait disparaitre l'Entité instantanément. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "remove_child_entities": {
                                    "description": "Definit si toutes les entités liées dans une relation enfant (par exemple, en laisse) seront également supprimées. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                }
                            }
                        },
                        "minecraft:interact": {
                            "description": "Définit les interactions qui peuvent être utilisées avec une Entité. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "add_items": {
                                    "description": "La Loot Table avec les items à ajouter à l'inventaire du joueur lors d'une interaction réussie. \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "table": {
                                            "description": "Le chemin de la Loot Table. \nType: `String`",
                                            "type": "string",
                                            pattern: schemaPatterns.loot_tables_file,
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.loot_table_file_paths
                                        }
                                    }
                                },
                                "cooldown": {
                                    "description": "Temps en secondes avant que cette interaction puisse être utilisée à nouveau. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "cooldown_after_being_attacked": {
                                    "description": "Temps en secondes avant que cette interaction puisse être utilisée à nouveau après avoir été attaquée. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "drop_item_slot": {
                                    "description": "Le slot pour retirer et déposer l'item, le cas échéant, lors d'une interaction réussie. Les slots d'inventaire sont désignés par des nombres positifs; les slots d'armure sont désignés par slot.armor.head, slot.armor.chest, slot.armor.legs, slot.armor.feet et slot.armor.body. \nType: `String`",
                                    "type": "string",
                                    "enum": ["slot.armor.chest", "slot.armor.feet", "slot.armor.head", "slot.armor.legs", "slot.armor.body"]
                                },
                                "drop_item_y_offset": {
                                    "description": "Définit un décalage personnalisé de l'axe des Y lorsqu'un élément est déposé. Nécessite que la propriété `drop_item_slot` soit spécifié. \nType: `Number`",
                                    "default": 0,
                                    "type": "number"
                                },
                                "equip_item_slot": {
                                    "description": "Le slot pour équiper l'item, le cas échéant, lors d'une interaction réussie. Les slots d'inventaire sont désignés par des nombres positifs; les slots d'armure sont désignés par slot.armor.head, slot.armor.chest, slot.armor.legs, slot.armor.feet et slot.armor.body. \nType: `String`",
                                    "type": "string",
                                    "enum": ["slot.armor.chest", "slot.armor.feet", "slot.armor.head", "slot.armor.legs", "slot.armor.body"]
                                },
                                "health_amount": {
                                    "description": "Le montant de santé que l'Entité gagne ou perd lors d'une interaction réussie. Les valeurs négatives nuiront à l'Entité. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "hurt_item": {
                                    "description": "Le montant de dégâts que l'item subira lorsqu'il sera utilisé pour interagir avec cette Entité. \nType: `Integer` \nNote: Une valeur de 0 signifie que l'item ne subira aucun dégât.",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "interact_text": {
                                    "description":
                                    "**ℹ️ Texte traduisable**\n\n" +
                                    "Texte à afficher lorsqu'un joueur peut interagir avec cette Entité.",
                                    "type": "string"
                                },
                                "interactions": {
                                    "description": "Liste des interactions qui peuvent être utilisées avec cette Entité. \nType: `Object[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "give_item": {
                                                "description": "Défiit si l'item tenu par le joueur sera donné à l'Entité lors d'une interaction réussie. \nType: `Boolean`",
                                                "type": "boolean"
                                            },
                                            "hurt_item": {
                                                description: "Le montant de dégâts que l'item subira lorsqu'il sera utilisé pour interagir avec cette Entité.",
                                                type: "integer"
                                            },
                                            "interact_text": {
                                                "description":
                                                "**ℹ️ Texte traduisable**\n\n" +
                                                "Texte à afficher lorsqu'un joueur peut interagir avec cette Entité.",
                                                "type": "string"
                                            },
                                            "on_interact": {
                                                oneOf: [
                                                    {
                                                        type: "string"
                                                    },
                                                    commonSchemas.entity_event_trigger
                                                ]
                                            },
                                            "particle_on_start": {
                                                "type": "object",
                                                "properties": {
                                                    "particle_type": {
                                                        "description": "Le type de particule à afficher. \nType: `String`",
                                                        "type": "string"
                                                    }
                                                }
                                            },
                                            "play_sounds": {
                                                "description": "Le son à jouer lorsqu'une interaction réussie se produit. \nType: `String`",
                                                "type": "string"
                                            },
                                            "spawn_items": {
                                                "description": "Loot table avec les items à faire apparaître lors d'une interaction réussie. \nType: `Object`",
                                                "type": "object",
                                                "properties": {
                                                    "table": {
                                                        "description": "Le chemin de la Loot Table. \nType: `String`",
                                                        "type": "string",
                                                        "pattern": schemaPatterns.loot_tables_file,
                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.loot_table_file_paths
                                                    },
                                                    "y_offset": {
                                                        "description": "Décalage vertical pour les items qui apparaissent. \nType: `Number`",
                                                        "default": 1,
                                                        "type": "number"
                                                    }
                                                }
                                            },
                                            "swing": {
                                                description: "Si `true`, le joueur fera l'animation de 'swing' lorsqu'il interagit avec cette Entité.",
                                                default: false,
                                                type: "boolean"
                                            },
                                            "take_item": {
                                                "description": "Définit si l'item tenu par le joueur sera pris par l'Entité lors d'une interaction réussie. \nType: `Boolean`",
                                                "type": "boolean"
                                            },
                                            "use_item": {
                                                "description": "Définit si l'interaction utilisera un item. \nType: `Boolean`",
                                                "type": "boolean"
                                            }
                                        }
                                    }
                                },
                                "on_interact": {
                                    "description": "Evenement à déclencher lorsqu'une interaction réussie se produit. \nType: `Object`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "particle_on_start": {
                                    "description": "Effet de particules qui sera initié au début de l'interaction. \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "particle_offset_towards_interactor": {
                                            "description": "Définit si la particule apparaîtra plus proche de qui a effectué l'interaction. \nType: `Boolean`",
                                            "default": false,
                                            "type": "boolean"
                                        },
                                        "particle_type": {
                                            "description": "Le type de particule à afficher. \nType: `String`",
                                            "type": "string"
                                        },
                                        "particle_y_offset": {
                                            "description": "Décalage vertical du système de particules. \nType: `Number`",
                                            "default": 0.0,
                                            "type": "number"
                                        }
                                    }
                                },
                                "play_sounds": {
                                    "description": "Une ou plusieurs identifiants sonores à jouer lorsque l'interaction se produit. \nType: `String`",
                                    "type": "string"
                                },
                                "repair_entity_item": {
                                    "description": "Permet la réparation de l'item d'une Entité donnée. \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "amount": {
                                            "description": "De combien de durabilité l'item doit être réparé. \nType: `Integer`",
                                            "type": "integer"
                                        },
                                        "slot": {
                                            "description": "Le slot de l'entité contenant l'item à réparer. Les slots d'inventaire sont désignés par des nombres positifs; les slots d'armure sont désignés par slot.armor.head, slot.armor.chest, slot.armor.legs, slot.armor.feet et slot.armor.body. \nType: `String`",
                                            "type": "string"
                                        }
                                    }
                                },
                                "spawn_entities": {
                                    "description": "Entité à faire apparaître lorsqu'une interaction réussie se produit. \nType: `String`",
                                    "type": "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.entity_ids
                                },
                                "spawn_items": {
                                    "description": "Loot table avec les items à faire apparaître lors d'une interaction réussie. \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "table": {
                                            "description": "Le chemin de la Loot Table. \nType: `String`",
                                            "type": "string",
                                            "pattern": schemaPatterns.loot_tables_file,
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.loot_table_file_paths
                                        },
                                        "y_offset": {
                                            "description": "Décalage vertical pour les items qui apparaissent. \nType: `Number`",
                                            "default": 1,
                                            "type": "number"
                                        }
                                    }
                                },
                                "swing": {
                                    "description": "Définit si le joueur fera l'animation de 'swing' lorsqu'il interagit avec cette Entité. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "transform_to_item": {
                                    "description": "L'item utilisé dans cette interaction réussi se transformera en un cet item. \nType: `String`",
                                    "type": "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                },
                                "use_item": {
                                    "description": "Définit si l'interaction utilisera un item. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "vibration": {
                                    "description": "Le type de vibration à émettre lorsque l'interaction se produit. \nType: `String`",
                                    "default": "entity_interact",
                                    "enum": ["none", "shear", "entity_die", "entity_act", "entity_interact"]
                                }
                            }
                        },
                        "minecraft:inventory": {
                            "description": "Définit comment l'inventaire d'une Entité est géré. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "additional_slots_per_strength": {
                                    "description": "Nombre de slots que cette Entité peut gagner par force supplémentaire. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "can_be_siphoned_from": {
                                    "description": "Définit si le contenu de cet inventaire peut être siphonné par un entonnoir. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "container_type": {
                                    "description": "Type de conteneur que l'Entité possède. \nType: `String`",
                                    "default": "none",
                                    "type": "string",
                                    "enum": ["horse", "minecart_chest", "chest_boat", "minecart_hopper", "inventory", "container", "hopper", "none"]
                                },
                                "inventory_size": {
                                    "description": "Nombre de slots dans l'inventaire de l'Entité. \nType: `Integer`",
                                    "default": 5,
                                    "type": "integer"
                                },
                                "private": {
                                    "description": "Définit si l'Entité ne laissera pas tomber son inventaire à sa mort. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "restrict_to_owner": {
                                    "description": "Définit si l'inventaire de l'Entité ne peut être accédé que par son propriétaire ou par elle-même. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                }
                            }
                        },
                        "minecraft:is_baby": {
                            "description": "Définit que l'Entité est un bébé. \nType: `Object` \nNote: Ce composant est utilisé pour des requêtes Molang ou de filtres",
                            "type": "object"
                        },
                        "minecraft:is_charged": {
                            "description": "Définit si l'Entité est chargée. \nType: `Object` \nNote: Ce composant est utilisé pour des requêtes Molang ou de filtres",
                            "type": "object"
                        },
                        "minecraft:is_chested": {
                            "description": "Définit que l'Entité porte actuellement un coffre. \nType: `Object` \nNote: Ce composant est utilisé pour des requêtes Molang ou de filtres",
                            "type": "object"
                        },
                        "minecraft:is_collidable": {
                            "description": "Permet aux autres mobs d'avoir des collisions verticales et horizontales avec cette Entité. Pour qu'une collision se produise, les deux entités doivent avoir un composant `minecraft:collision_box`. Ce composant ne peut être utilisé que sur les entités et permet des collisions exclusivement entre les entités. Veuillez noter que ce type de collision est peu fiable pour les entités mobiles. Il est recommandé d'utiliser ce composant uniquement dans des scénarios où l'entité collidable reste stationnaire. Le comportement collidable est étroitement lié au comportement empilable. Alors que le composant `minecraft:is_collidable` régit la façon dont les autres entités interagissent avec le propriétaire du composant, le composant `minecraft:is_stackable` décrit comment une entité interagit avec d'autres de son espèce. \nType: `Object`",
                            "type": "object"
                        },
                        "minecraft:is_dyeable": {
                            "description": "Permet à l'Entité d'être teinte avec des colorants. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "interact_text": {
                                    "description":
                                    "**ℹ️ Texte traduisable**\n\n" +
                                    "Texte à afficher lorsqu'un joueur peut teindre cette Entité.",
                                    "type": "string"
                                }
                            }
                        },
                        "minecraft:is_hidden_when_invisible": {
                            "description": "Définit si l'Entité est cachée des mobs hostiles lorsqu'elle est invisible. \nType: `Object`",
                            "type": "object"
                        },
                        "minecraft:is_ignited": {
                            "description": "Définit si l'Entité est enflammée. \nType: `Object` \nNote: Ce composant est utilisé pour des requêtes Molang ou de filtres",
                            "type": "object"
                        },
                        "minecraft:is_illager_captain": {
                            "description": "Définit si l'Entité est un capitaine pillard. \nType: `Object` \nNote: Ce composant est utilisé pour des requêtes Molang ou de filtres",
                            "type": "object"
                        },
                        "minecraft:is_pregnant": {
                            "description": "Définit si l'Entité est enceinte. \nType: `Object` \nNote: Ce composant est utilisé pour des requêtes Molang ou de filtres",
                            "type": "object"
                        },
                        "minecraft:is_saddled": {
                            "description": "Définit si l'Entité est sellée. \nType: `Object` \nNote: Ce composant est utilisé pour des requêtes Molang ou de filtres",
                            "type": "object"
                        },
                        "minecraft:is_shaking": {
                            "description": "Définit si l'Entité est secouée. \nType: `Object`",
                            "type": "object"
                        },
                        "minecraft:is_sheared": {
                            "description": "Définit si l'Entité a été tondue. \nType: `Object` \nNote: Ce composant est utilisé pour des requêtes Molang ou de filtres",
                            "type": "object"
                        },
                        "minecraft:is_stackable": {
                            "description": "Définit que l'Entité peut être empilée. \nType: `Object`",
                            "type": "object"
                        },
                        "minecraft:is_stunned": {
                            "description": "Définit si l'Entité est étourdie. \nType: `Object` \nNote: Ce composant est utilisé pour des requêtes Molang ou de filtres",
                            "type": "object"
                        },
                        "minecraft:is_tamed": {
                            "description": "Définit si l'Entité est apprivoisée. \nType: `Object` \nNote: Ce composant est utilisé pour des requêtes Molang ou de filtres",
                            "type": "object"
                        },
                        "minecraft:item_controllable": {
                            "description": "Permet à l'Entité d'être contrôlée par un item quand elle est chevauchée. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "control_items": {
                                    "description": "Liste des items qui peuvent être utilisés pour contrôler l'Entité. \nType: `String`",
                                    "type": "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                }
                            }
                        },
                        "minecraft:item_hopper": {
                            "description": "Permer à l'Entité de fonctionner comme un bloc entonnoir. \nType: `Object`",
                            "type": "object"
                        },
                        "minecraft:jump.dynamic": {
                            "description": "Définit un contrôle de saut dynamique qui changera les propriétés de saut en fonction du modificateur de vitesse de l'Entité. \nType: `Object`",
                            "type": "object"
                        },
                        "minecraft:jump.static": {
                            "description": "Donne à l'Entité la capacité de sauter. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "jump_power": {
                                    "description": "La vitesse verticale initiale pour le saut. \nType: `Number`",
                                    "default": 0.42,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:knockback_resistance": {
                            "description": "Force une Entité à résister à être repoussée par une attaque de mêlée. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "value": {
                                    "description": "Le montant de résistance au recul que l'Entité a. \nType: `Number`",
                                    "type": "number"
                                },
                                "max": {
                                    "description": "La valeur maximale de résistance au recul que l'Entité peut avoir. \nType: `Number`",
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:lava_movement": {
                            "description": "Permet à l'Entité de se déplacer à une vitesse personnalisée sur les blocs de lave. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "value": {
                                    "description": "La vitesse à laquelle l'Entité se déplace sur les blocs de lave. \nType: `Number`",
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:leashable": {
                            "description": "Permet à l'Entité d'être attachée à une laisse. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "can_be_cut": {
                                    "description": "Si définit sur true, les joueurs peuvent couper les laisses entrantes et sortantes en utilisant des cisailles sur l'Entité. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "can_be_stolen": {
                                    "description": "Définit si les joueurs peuvent attacher la laisse à l'Entité même si elle est déjà attaché à un autre mob. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "hard_distance": {
                                    "description": "Distance en blocs à laquelle la laisse se raidit, limitant le mouvement. \nType: `Number`",
                                    "default": 6,
                                    "type": "number"
                                },
                                "max_distance": {
                                    "description": "Distance en blocs à laquelle la laisse peut s'étendre. \nType: `Number`",
                                    "default": 10,
                                    "type": "number"
                                },
                                "on_leash": {
                                    "description": "Evénement à déclencher lorsque l'Entité est attachée à une laisse. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "on_unleash": {
                                    "description": "Evénement à déclencher lorsque l'Entité est détachée d'une laisse. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "presets": {
                                    "description": "Définit comment l'Entité se comporte quand elle est attachée à une autre entité. Un preset est choisi lors de la liaison et reste en vigueur jusqu'à ce que l'Entité soit liée à un autre préréglage. Le premier preset qui a les conditions `filters` valide sera utilisé. Si aucun preset ne correspond, la configuration par défaut sera utilisé. \nType: `Object[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "filter": {
                                                "description": "Définit les conditions qui doivent être satisfaites pour que le préréglage soit utilisé. \nType: `Minecraft Filter`",
                                                ...commonSchemas.minecraft_filter
                                            },
                                            "soft_distance": {
                                                "description": "Distance en blocs à laquelle l'effet de 'ressort' commence à agir pour garder cette Entité proche de l'Entité qui l'a attachée. \nType: `Number`",
                                                "default": 4,
                                                "type": "number"
                                            },
                                            "hard_distance": {
                                                "description": "Distance en blocs à laquelle la laisse se raidit, limitant le mouvement. \nType: `Number`",
                                                "default": 6,
                                                "type": "number"
                                            },
                                            "max_distance": {
                                                "description": "Distance en blocs à laquelle la laisse peut s'étendre. \nType: `Number`",
                                                "default": 10,
                                                "type": "number"
                                            },
                                            "spring_type": {
                                                "description": "Définit le type de ressort qui tire l'entité vers son détenteur de laisse. \nType: `String` \n`bouncy`: Simule un ressort très élastique qui n'atteint jamais un équilibre si l'entité attachée est suspendue dans les airs. \n`dampened`: Simule un ressort amorti attaché à l'avant de la collision de l'entité attachée. Il atteint un équilibre si l'entité est suspendue dans les airs et s'aligne avec la direction du mouvement. \n`quad_dampened`: Simule quatre ressorts amortis connectés au centre de chaque côté des collisions des entités. Il atteint un équilibre si l'entité est suspendue dans les airs et s'aligne progressivement avec le détenteur de la laisse au fil du temps.",
                                                "default": "dampened",
                                                "type": "string",
                                                "enum": ["bouncy", "dampened", "quad_dampened"]
                                            },
                                            "rotation_adjustment": {
                                                "description": "Ajuste la rotation à laquelle l'entité atteint l'équilibre, lorsque 'spring_type' est défini sur 'dampened' ou 'quad_dampened'. \nType: `Number`",
                                                "default": 0,
                                                "type": "number"
                                            }
                                        }
                                    }
                                },
                                "soft_distance": {
                                    "description": "Distance en blocs à laquelle l'effet de 'ressort' commence à agir pour garder cette Entité proche de l'Entité qui l'a attachée. \nType: `Number`",
                                    "default": 4,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:leashable_to": {
                            "description": "Permet aux joueurs de lier cette Entité à une autre. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "can_retrieve_from": {
                                    "description": "Définit si les joueurs peuvent récupérer les entités liées à cette Entité. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                }
                            }
                        },
                        "minecraft:looked_at": {
                            "description": "Définit le comportement lorsque l'Entité est regardée par une autre Entité. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "field_of_view": {
                                    "description": "Définit l'angle de vue en degrés pour les entités regardant l'Entité propriétaire. Si 'scale_fov_by_distance' est défini sur true, alors cette valeur correspond à l'angle de vue à une distance d'un bloc entre les entités. \nType: `Number`",
                                    "default": 26,
                                    "type": "number"
                                },
                                "filters": {
                                    "description": "Définit quels entités peuvent être considérées comme regardant l'Entité propriétaire. \nType: `Minecraft Filter`",
                                    ...commonSchemas.minecraft_filter
                                },
                                "find_players_only": {
                                    "description": "Limite la recherche uniquement au joueur le plus proche qui répond aux critères spécifiés plutôt qu'à toutes les entités à proximité. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "line_of_sight_obstruction_type": {
                                    "description": "Définit le type de forme de bloc utilisé pour vérifier les obstructions de la ligne de vue. \nType: `String`",
                                    "default": "collision",
                                    "type": "string",
                                    "enum": ["outline", "collision", "collision_for_camera"]
                                },
                                "look_at_locations": {
                                    "description": "Une liste d'emplacements sur l'Entité propriétaire vers lesquels des vérifications de ligne de vue sont effectuées. Au moins un emplacement doit être dégagé pour que l'Entité soit considérée comme regardée. \nType: `String[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                        "enum": ["head", "body", "feet"]
                                    }
                                },
                                "looked_at_cooldown": {
                                    "description": "Spécifie la plage pour le nombre de secondes aléatoires qui doivent s'écouler avant que l'Entité propriétaire puisse vérifier à nouveau si une entité la regarde, après avoir détecté une entité la regardant. \nType: `Object`",
                                    "default": [0, 0],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "looked_at_event": {
                                    "description": "Définit l'événement à déclencher lorsqu'une entité regarde l'Entité propriétaire. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "min_looked_at_duration": {
                                    "description": "Définit la durée minimale et continue pendant laquelle l'Entité propriétaire doit être regardée avant d'être considérée comme telle. \nType: `Number`",
                                    "default": 0,
                                    "type": "number"
                                },
                                "not_looked_at_event": {
                                    "description": "Définit l'événement à déclencher lorsqu'une entité ne regarde pas l'Entité propriétaire. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "scale_fov_by_distance": {
                                    "description": "Définit si le champ de vision de l'entité regardant l'Entité propriétaire se rétrécit à mesure que la distance entre l'entité et l'Entité propriétaire augmente. Cela garantit que la largeur du cône de vision reste quelque peu constante vers la position de l'Entité propriétaire, quelle que soit la distance. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "search_radius": {
                                    "description": "Distance maximale à laquelle l'Entité propriétaire recherchera des entités la regardant. \nType: `Number`",
                                    "default": 10,
                                    "type": "number"
                                },
                                "set_target": {
                                    "description": "Définit si et comment l'Entité propriétaire définira les entités qui la regardent comme ses cibles de combat. \nType: `Object` \n'never': les entités regardant ne sont jamais définies comme cibles, mais des événements sont émis. \n'once_and_stop_scanning': la première entité regardant détectée est définie comme cible. La numérisation et l'émission d'événements sont suspendues jusqu'à ce que l'Entité propriétaire ait une cible. \n'once_and_keep_scanning': la première entité regardant détectée est définie comme cible. La numérisation et l'émission d'événements se poursuivent.",
                                    "default": "once_and_stop_scanning",
                                    "type": "string",
                                    "enum": ["never", "once_and_stop_scanning", "once_and_keep_scanning"]
                                }
                            }
                        },
                        "minecraft:loot": {
                            "description": "Définit la Loot Table pour définir les drops de l'Entité quand elle est tuée. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "table": {
                                    "description": "Le chemin de la Loot Table. \nType: `String`",
                                    "type": "string",
                                    "pattern": schemaPatterns.loot_tables_file,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.loot_table_file_paths
                                }
                            }
                        },
                        "minecraft:luck": {
                            "description": "Définit le niveau de chance du Joueur. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "value": {
                                    "description": "Le niveau de chance du Joueur. \nType: `Number`",
                                    "type": "number"
                                },
                                "max": {
                                    "description": "La valeur maximale de chance que le Joueur peut avoir. \nType: `Number`",
                                    "type": "number"
                                },
                                "min": {
                                    "description": "La valeur minimale de chance que le Joueur peut avoir. \nType: `Number`",
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:managed_wandering_trader": {
                            "description": "Gère la capacité de l'Entité à commercer. \nType: `Object` \nNote: Ce composant est seulement utilisable pour les marchands ambulants.",
                            "type": "object"
                        },
                        "minecraft:mark_variant": {
                            "description": "Définit la variante de l'Entité. \nType: `Object` \nNote: Ce composant nécessite que l'Entité soit configurée pour utiliser des variantes avec le composant de propriété minecraft:variant.",
                            "type": "object",
                            "properties": {
                                "value": {
                                    "description": "L'ID de la variante. Par convention, 0 est l'ID de l'Entité de base. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:mob_effect": {
                            "description": "Applique un effet de mob aux entités qui entrent dans la portée. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "cooldown_time": {
                                    "description": "Temps en secondes avant que l'effet puisse être appliqué à nouveau. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "entity_filter": {
                                    "description": "L'ensemble d'entités qui peuvent être affectées par l'effet. \nType: `Minecraft Filter`",
                                    ...commonSchemas.minecraft_filter
                                },
                                "effect_range": {
                                    "description": "De combien de blocs l'entité doit être proche pour que l'effet soit appliqué. \nType: `Number`",
                                    "default": 0.2,
                                    "type": "number"
                                },
                                "effect_time": {
                                    "description": "De combien de temps l'effet est appliqué en secondes. \nType: `Integer | String`",
                                    "default": 10,
                                    "oneOf": [
                                        {
                                            "type": "integer"
                                        },
                                        {
                                            type: "string",
                                            enum: ["infinite"]
                                        }
                                    ]
                                },
                                "mob_effect": {
                                    "description": "L'effet à appliquer. \nType: `String`",
                                    "type": "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.effect_ids
                                }
                            }
                        },
                        "minecraft:mob_effect_immunity": {
                            "description": "L'Entité avec ce composant aura une immunité aux effets de mob fournis. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "mob_effects": {
                                    "description": "Liste des effets de mob auxquels l'Entité est immunisée. \nType: `String[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.effect_ids
                                    }
                                }
                            }
                        },
                        "minecraft:movement": {
                            "description": "Ce composant représente le mouvement fondamental d'une Entité. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "max": {
                                    "description": "La vitesse maximale de l'Entité. \nType: `Number`",
                                    "type": "number"
                                },
                                "value": {
                                    "description": "La vitesse de mouvement de l'Entité. \nType: `Number`",
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:movement.amphibious": {
                            "description": "Force une Entité à nager dans l'eau et à marcher sur terre. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "max_turn": {
                                    "description": "L'angle maximum en degrés que l'Entité peut tourner par tick. \nType: `Number`",
                                    "default": 30.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:movement.basic": {
                            "description": "Définit le mouvement de base d'une Entité. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "max_turn": {
                                    "description": "L'angle maximum en degrés que l'Entité peut tourner par tick. \nType: `Number`",
                                    "default": 30.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:movement.dolphin": {
                            "description": "Force une Entité à se déplacer comme un dauphin. \nType: `Object` \nNote: Ce composant n'est pas utilisé dans le jeu.",
                            "type": "object"
                        },
                        "minecraft:movement.fly": {
                            "description": "Ce composant permet à l'Entité de voler. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "max_turn": {
                                    "description": "L'angle maximum en degrés que l'Entité peut tourner par tick. \nType: `Number`",
                                    "default": 30.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:movement.generic": {
                            "description": "Permet à l'Entité de voler, nager, grimper, etc. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "max_turn": {
                                    "description": "L'angle maximum en degrés que l'Entité peut tourner par tick. \nType: `Number`",
                                    "default": 30.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:movement.glide": {
                            "description": "Ce composant est le contrôle de mouvement pour une Entité volante qui a un mouvement de planeur. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "start_speed": {
                                    "description": "La vitesse initiale de l'Entité lorsqu'elle commence à planer. \nType: `Number`",
                                    "default": 0.1,
                                    "type": "number"
                                },
                                "speed_when_turning": {
                                    "description": "La vitesse que l'Entité ajuste lorsqu'elle doit tourner. \nType: `Number`",
                                    "default": 0.2,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:movement.hover": {
                            "description": "Ce composant est le contrôle de mouvement pour une Entité volante qui a un mouvement de vol stationnaire. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "max_turn": {
                                    "description": "L'angle maximum en degrés que l'Entité peut tourner par tick. \nType: `Number`",
                                    "default": 30.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:movement.jump": {
                            "description": "Se déplace en sautant. \nType: `Object` \nNote: Pour pouvoir suivre des cibles, cette entité doit avoir minecraft:behavior.slime_attack, sinon l'Entité sautera dans la direction dans laquelle elle regarde.",
                            "type": "object",
                            "properties": {
                                "jump_delay": {
                                    "description": "Delai après le saut avant que l'Entité puisse sauter à nouveau. \nType: `Number[2]`",
                                    "default": [0.0, 0.0],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "max_turn": {
                                    "description": "L'angle maximum en degrés que l'Entité peut tourner par tick. \nType: `Number`",
                                    "default": 30.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:movement.skip": {
                            "description": "Force l'Entité à sauter lorsqu'elle se déplace. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "max_turn": {
                                    "description": "L'angle maximum en degrés que l'Entité peut tourner par tick. \nType: `Number`",
                                    "default": 30.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:movement_sound_distance_offset": {
                            "description": "Définit l'offset utilisé pour déterminer la distance du prochain pas pour jouer un son de mouvement. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "value": {
                                    "description": "Plus le nombre est élevé, moins souvent le son de mouvement sera joué. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:movement.sway": {
                            "description": "Force une Entité à osciller de gauche à droite, donnant l'impression qu'elle nage. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "max_turn": {
                                    "description": "L'angle maximum en degrés que l'Entité peut tourner par tick. \nType: `Number`",
                                    "default": 30.0,
                                    "type": "number"
                                },
                                "sway_amplitude": {
                                    "description": "Force du mouvement d'oscillation. \nType: `Number`",
                                    "default": 0.05,
                                    "type": "number"
                                },
                                "sway_frequency": {
                                    "description": "Multiplicateur pour la fréquence du mouvement d'oscillation. \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:nameable": {
                            "description": "Permet à l'Entité d'être nommée (par exemple, en utilisant une étiquette). \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "allow_name_tag_renaming": {
                                    "description": "Définit si l'Entité peut être renommée avec des étiquettes de nom. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "always_show": {
                                    "description": "Définit si le nom sera toujours affiché. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "default_trigger": {
                                    "description": "Déclencheur d'évenement par défaut pour l'Entité nommée. \nType: `String`",
                                    "type": "string"
                                },
                                "name_actions": {
                                    "description": "Decrit les noms spéciaux pour l'Entité et les évenements à appeler lorsque l'Entité acquiert ces noms. \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "name_filter": {
                                            "description": "Liste de noms spéciaux qui déclencheront les évenements définis. \nType: `String`",
                                            "type": "string"
                                        },
                                        "on_named": {
                                            "description": "Evenement à déclencher lorsque l'Entité acquiert un nom spécial. \nType: `String`",
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        },
                        "minecraft:navigation.climb": {
                            "description": "Permet à l'Entité de générer ses chemins de navigation en grimpant à la verticale comme une araignée. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "avoid_damage_blocks": {
                                    "description": "Dit au pathfinder d'éviter les blocs qui causent des dégâts lorsqu'il trouve un chemin. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "avoid_portals": {
                                    "description": "Dit au pathfinder d'éviter les portails lorsqu'il trouve un chemin. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "avoid_sun": {
                                    "description": "Définit si le pathfinder doit éviter les blocs exposés au soleil lorsqu'il crée des chemins. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "avoid_water": {
                                    "description": "Définit si le pathfinder doit éviter les blocs d'eau lorsqu'il crée des chemins. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "blocks_to_avoid": {
                                    "description": "Dit au pathfinder quels blocs éviter lorsqu'il trouve un chemin. \nType: `String[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                    }
                                },
                                "can_breach": {
                                    "description": "Dit au pathfinder si l'Entité peut sauter hors de l'eau comme un dauphin. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_break_doors": {
                                    "description": "Dit au pathfinder qu'il peut traverser une porte fermée et la casser. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_jump": {
                                    "description": "Indique au pathfinder s'il peut ou non sauter par-dessus des blocs. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "can_open_doors": {
                                    "description": "Indique au pathfinder s'il peut ouvrir des portes. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_open_iron_doors": {
                                    "description": "Indique au pathfinder s'il peut ouvrir des portes en fer. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_pass_doors": {
                                    "description": "Indique au pathfinder s'il peut passer par une porte. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "can_path_from_air": {
                                    "description": "Indique au pathfinder qu'il peut commencer à créer un chemin lorsqu'il est dans les airs. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_path_over_lava": {
                                    "description": "Indique au pathfinder s'il peut traverser la surface de la lave. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_path_over_water": {
                                    "description": "Indique au pathfinder s'il peut traverser la surface de l'eau. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_sink": {
                                    "description": "Indique au pathfinder s'il sera ou non entraîné vers le bas par la gravité lorsqu'il est dans l'eau. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "can_swim": {
                                    "description": "Indique au pathfinder s'il peut nager dans l'eau et jouer l'animation de nage. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_walk": {
                                    "description": "Indique au pathfinder s'il peut marcher sur le sol en dehors de l'eau. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "can_walk_in_lava": {
                                    "description": "Indique au pathfinder s'il peut marcher dans la lave comme sur le sol. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "is_amphibious": {
                                    "description": "Indique au pathfinder si l'Entité peut marcher sur le sol sous l'eau. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                }
                            }
                        },
                        "minecraft:navigation.float": {
                            "description": "Permet à l'Entité de générer des chemins de naviation en volant dans l'air comme un Ghast. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "avoid_damage_blocks": {
                                    "description": "Dit au pathfinder d'éviter les blocs qui causent des dégâts lorsqu'il trouve un chemin. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "avoid_portals": {
                                    "description": "Dit au pathfinder d'éviter les portails lorsqu'il trouve un chemin. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "avoid_sun": {
                                    "description": "Définit si le pathfinder doit éviter les blocs exposés au soleil lorsqu'il crée des chemins. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "avoid_water": {
                                    "description": "Définit si le pathfinder doit éviter les blocs d'eau lorsqu'il crée des chemins. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "blocks_to_avoid": {
                                    "description": "Dit au pathfinder quels blocs éviter lorsqu'il trouve un chemin. \nType: `String[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                    }
                                },
                                "can_breach": {
                                    "description": "Dit au pathfinder si l'Entité peut sauter hors de l'eau comme un dauphin. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_break_doors": {
                                    "description": "Dit au pathfinder qu'il peut traverser une porte fermée et la casser. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_jump": {
                                    "description": "Indique au pathfinder s'il peut ou non sauter par-dessus des blocs. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "can_open_doors": {
                                    "description": "Indique au pathfinder s'il peut ouvrir des portes. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_open_iron_doors": {
                                    "description": "Indique au pathfinder s'il peut ouvrir des portes en fer. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_pass_doors": {
                                    "description": "Indique au pathfinder s'il peut passer par une porte. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "can_path_from_air": {
                                    "description": "Indique au pathfinder qu'il peut commencer à créer un chemin lorsqu'il est dans les airs. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_path_over_lava": {
                                    "description": "Indique au pathfinder s'il peut traverser la surface de la lave. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_path_over_water": {
                                    "description": "Indique au pathfinder s'il peut traverser la surface de l'eau. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_sink": {
                                    "description": "Indique au pathfinder s'il sera ou non entraîné vers le bas par la gravité lorsqu'il est dans l'eau. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "can_swim": {
                                    "description": "Indique au pathfinder s'il peut nager dans l'eau et jouer l'animation de nage. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_walk": {
                                    "description": "Indique au pathfinder s'il peut marcher sur le sol en dehors de l'eau. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "can_walk_in_lava": {
                                    "description": "Indique au pathfinder s'il peut marcher dans la lave comme sur le sol. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "is_amphibious": {
                                    "description": "Indique au pathfinder si l'Entité peut marcher sur le sol sous l'eau. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                }
                            }
                        },
                        "minecraft:navigation.fly": {
                            "description": "Permet à l'Entité de générer des chemins de navigation en volant dans l'air comme un Perroquet. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "avoid_damage_blocks": {
                                    "description": "Dit au pathfinder d'éviter les blocs qui causent des dégâts lorsqu'il trouve un chemin. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "avoid_portals": {
                                    "description": "Dit au pathfinder d'éviter les portails lorsqu'il trouve un chemin. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "avoid_sun": {
                                    "description": "Définit si le pathfinder doit éviter les blocs exposés au soleil lorsqu'il crée des chemins. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "avoid_water": {
                                    "description": "Définit si le pathfinder doit éviter les blocs d'eau lorsqu'il crée des chemins. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "blocks_to_avoid": {
                                    "description": "Dit au pathfinder quels blocs éviter lorsqu'il trouve un chemin. \nType: `String[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                    }
                                },
                                "can_breach": {
                                    "description": "Dit au pathfinder si l'Entité peut sauter hors de l'eau comme un dauphin. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_break_doors": {
                                    "description": "Dit au pathfinder qu'il peut traverser une porte fermée et la casser. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_jump": {
                                    "description": "Indique au pathfinder s'il peut ou non sauter par-dessus des blocs. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "can_open_doors": {
                                    "description": "Indique au pathfinder s'il peut ouvrir des portes. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_open_iron_doors": {
                                    "description": "Indique au pathfinder s'il peut ouvrir des portes en fer. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_pass_doors": {
                                    "description": "Indique au pathfinder s'il peut passer par une porte. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "can_path_from_air": {
                                    "description": "Indique au pathfinder qu'il peut commencer à créer un chemin lorsqu'il est dans les airs. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_path_over_lava": {
                                    "description": "Indique au pathfinder s'il peut traverser la surface de la lave. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_path_over_water": {
                                    "description": "Indique au pathfinder s'il peut traverser la surface de l'eau. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_sink": {
                                    "description": "Indique au pathfinder s'il sera ou non entraîné vers le bas par la gravité lorsqu'il est dans l'eau. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "can_swim": {
                                    "description": "Indique au pathfinder s'il peut nager dans l'eau et jouer l'animation de nage. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_walk": {
                                    "description": "Indique au pathfinder s'il peut marcher sur le sol en dehors de l'eau. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "can_walk_in_lava": {
                                    "description": "Indique au pathfinder s'il peut marcher dans la lave comme sur le sol. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "is_amphibious": {
                                    "description": "Indique au pathfinder si l'Entité peut marcher sur le sol sous l'eau. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                }
                            }
                        },
                        "minecraft:navigation.generic": {
                            "description": "Force l'Entité à générer des chemins de navigation en marchant, nageant, volant, grimpant, etc. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "avoid_damage_blocks": {
                                    "description": "Dit au pathfinder d'éviter les blocs qui causent des dégâts lorsqu'il trouve un chemin. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "avoid_portals": {
                                    "description": "Dit au pathfinder d'éviter les portails lorsqu'il trouve un chemin. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "avoid_sun": {
                                    "description": "Définit si le pathfinder doit éviter les blocs exposés au soleil lorsqu'il crée des chemins. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "avoid_water": {
                                    "description": "Définit si le pathfinder doit éviter les blocs d'eau lorsqu'il crée des chemins. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "blocks_to_avoid": {
                                    "description": "Dit au pathfinder quels blocs éviter lorsqu'il trouve un chemin. \nType: `String[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                    }
                                },
                                "can_breach": {
                                    "description": "Dit au pathfinder si l'Entité peut sauter hors de l'eau comme un dauphin. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_break_doors": {
                                    "description": "Dit au pathfinder qu'il peut traverser une porte fermée et la casser. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_jump": {
                                    "description": "Indique au pathfinder s'il peut ou non sauter par-dessus des blocs. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "can_open_doors": {
                                    "description": "Indique au pathfinder s'il peut ouvrir des portes. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_open_iron_doors": {
                                    "description": "Indique au pathfinder s'il peut ouvrir des portes en fer. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_pass_doors": {
                                    "description": "Indique au pathfinder s'il peut passer par une porte. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "can_path_from_air": {
                                    "description": "Indique au pathfinder qu'il peut commencer à créer un chemin lorsqu'il est dans les airs. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_path_over_lava": {
                                    "description": "Indique au pathfinder s'il peut traverser la surface de la lave. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_path_over_water": {
                                    "description": "Indique au pathfinder s'il peut traverser la surface de l'eau. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_sink": {
                                    "description": "Indique au pathfinder s'il sera ou non entraîné vers le bas par la gravité lorsqu'il est dans l'eau. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "can_swim": {
                                    "description": "Indique au pathfinder s'il peut nager dans l'eau et jouer l'animation de nage. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_walk": {
                                    "description": "Indique au pathfinder s'il peut marcher sur le sol en dehors de l'eau. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "can_walk_in_lava": {
                                    "description": "Indique au pathfinder s'il peut marcher dans la lave comme sur le sol. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "is_amphibious": {
                                    "description": "Indique au pathfinder si l'Entité peut marcher sur le sol sous l'eau. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                }
                            }
                        },
                        "minecraft:navigation.hover": {
                            "description": "Force l'Entité à générer des chemins de navigation en volant dans l'air comme une Abeille. Les empêche de tomber du ciel et de faire des mouvements prédictifs. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "avoid_damage_blocks": {
                                    "description": "Dit au pathfinder d'éviter les blocs qui causent des dégâts lorsqu'il trouve un chemin. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "avoid_portals": {
                                    "description": "Dit au pathfinder d'éviter les portails lorsqu'il trouve un chemin. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "avoid_sun": {
                                    "description": "Définit si le pathfinder doit éviter les blocs exposés au soleil lorsqu'il crée des chemins. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "avoid_water": {
                                    "description": "Définit si le pathfinder doit éviter les blocs d'eau lorsqu'il crée des chemins. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "blocks_to_avoid": {
                                    "description": "Dit au pathfinder quels blocs éviter lorsqu'il trouve un chemin. \nType: `String[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                    }
                                },
                                "can_breach": {
                                    "description": "Dit au pathfinder si l'Entité peut sauter hors de l'eau comme un dauphin. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_break_doors": {
                                    "description": "Dit au pathfinder qu'il peut traverser une porte fermée et la casser. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_jump": {
                                    "description": "Indique au pathfinder s'il peut ou non sauter par-dessus des blocs. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "can_open_doors": {
                                    "description": "Indique au pathfinder s'il peut ouvrir des portes. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_open_iron_doors": {
                                    "description": "Indique au pathfinder s'il peut ouvrir des portes en fer. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_pass_doors": {
                                    "description": "Indique au pathfinder s'il peut passer par une porte. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "can_path_from_air": {
                                    "description": "Indique au pathfinder qu'il peut commencer à créer un chemin lorsqu'il est dans les airs. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_path_over_lava": {
                                    "description": "Indique au pathfinder s'il peut traverser la surface de la lave. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_path_over_water": {
                                    "description": "Indique au pathfinder s'il peut traverser la surface de l'eau. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_sink": {
                                    "description": "Indique au pathfinder s'il sera ou non entraîné vers le bas par la gravité lorsqu'il est dans l'eau. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "can_swim": {
                                    "description": "Indique au pathfinder s'il peut nager dans l'eau et jouer l'animation de nage. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_walk": {
                                    "description": "Indique au pathfinder s'il peut marcher sur le sol en dehors de l'eau. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "can_walk_in_lava": {
                                    "description": "Indique au pathfinder s'il peut marcher dans la lave comme sur le sol. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "is_amphibious": {
                                    "description": "Indique au pathfinder si l'Entité peut marcher sur le sol sous l'eau. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                }
                            }
                        },
                        "minecraft:navigation.swim": {
                            "description": "Force l'Entité à générer des chemins de navigation en nageant dans l'eau. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "avoid_damage_blocks": {
                                    "description": "Dit au pathfinder d'éviter les blocs qui causent des dégâts lorsqu'il trouve un chemin. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "avoid_portals": {
                                    "description": "Dit au pathfinder d'éviter les portails lorsqu'il trouve un chemin. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "avoid_sun": {
                                    "description": "Définit si le pathfinder doit éviter les blocs exposés au soleil lorsqu'il crée des chemins. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "avoid_water": {
                                    "description": "Définit si le pathfinder doit éviter les blocs d'eau lorsqu'il crée des chemins. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "blocks_to_avoid": {
                                    "description": "Dit au pathfinder quels blocs éviter lorsqu'il trouve un chemin. \nType: `String[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                    }
                                },
                                "can_breach": {
                                    "description": "Dit au pathfinder si l'Entité peut sauter hors de l'eau comme un dauphin. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_break_doors": {
                                    "description": "Dit au pathfinder qu'il peut traverser une porte fermée et la casser. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_jump": {
                                    "description": "Indique au pathfinder s'il peut ou non sauter par-dessus des blocs. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "can_open_doors": {
                                    "description": "Indique au pathfinder s'il peut ouvrir des portes. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_open_iron_doors": {
                                    "description": "Indique au pathfinder s'il peut ouvrir des portes en fer. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_pass_doors": {
                                    "description": "Indique au pathfinder s'il peut passer par une porte. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "can_path_from_air": {
                                    "description": "Indique au pathfinder qu'il peut commencer à créer un chemin lorsqu'il est dans les airs. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_path_over_lava": {
                                    "description": "Indique au pathfinder s'il peut traverser la surface de la lave. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_path_over_water": {
                                    "description": "Indique au pathfinder s'il peut traverser la surface de l'eau. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_sink": {
                                    "description": "Indique au pathfinder s'il sera ou non entraîné vers le bas par la gravité lorsqu'il est dans l'eau. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "can_swim": {
                                    "description": "Indique au pathfinder s'il peut nager dans l'eau et jouer l'animation de nage. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_walk": {
                                    "description": "Indique au pathfinder s'il peut marcher sur le sol en dehors de l'eau. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "can_walk_in_lava": {
                                    "description": "Indique au pathfinder s'il peut marcher dans la lave comme sur le sol. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "is_amphibious": {
                                    "description": "Indique au pathfinder si l'Entité peut marcher sur le sol sous l'eau. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                }
                            }
                        },
                        "minecraft:navigation.walk": {
                            "description": "Force l'Entité à générer des chemins de navigation en marchant sur le sol. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "avoid_damage_blocks": {
                                    "description": "Dit au pathfinder d'éviter les blocs qui causent des dégâts lorsqu'il trouve un chemin. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "avoid_portals": {
                                    "description": "Dit au pathfinder d'éviter les portails lorsqu'il trouve un chemin. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "avoid_sun": {
                                    "description": "Définit si le pathfinder doit éviter les blocs exposés au soleil lorsqu'il crée des chemins. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "avoid_water": {
                                    "description": "Définit si le pathfinder doit éviter les blocs d'eau lorsqu'il crée des chemins. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "blocks_to_avoid": {
                                    "description": "Dit au pathfinder quels blocs éviter lorsqu'il trouve un chemin. \nType: `String[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                    }
                                },
                                "can_breach": {
                                    "description": "Dit au pathfinder si l'Entité peut sauter hors de l'eau comme un dauphin. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_break_doors": {
                                    "description": "Dit au pathfinder qu'il peut traverser une porte fermée et la casser. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_jump": {
                                    "description": "Indique au pathfinder s'il peut ou non sauter par-dessus des blocs. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "can_open_doors": {
                                    "description": "Indique au pathfinder s'il peut ouvrir des portes. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_open_iron_doors": {
                                    "description": "Indique au pathfinder s'il peut ouvrir des portes en fer. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_pass_doors": {
                                    "description": "Indique au pathfinder s'il peut passer par une porte. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "can_path_from_air": {
                                    "description": "Indique au pathfinder qu'il peut commencer à créer un chemin lorsqu'il est dans les airs. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_path_over_lava": {
                                    "description": "Indique au pathfinder s'il peut traverser la surface de la lave. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_path_over_water": {
                                    "description": "Indique au pathfinder s'il peut traverser la surface de l'eau. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_sink": {
                                    "description": "Indique au pathfinder s'il sera ou non entraîné vers le bas par la gravité lorsqu'il est dans l'eau. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "can_swim": {
                                    "description": "Indique au pathfinder s'il peut nager dans l'eau et jouer l'animation de nage. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_walk": {
                                    "description": "Indique au pathfinder s'il peut marcher sur le sol en dehors de l'eau. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "can_walk_in_lava": {
                                    "description": "Indique au pathfinder s'il peut marcher dans la lave comme sur le sol. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "is_amphibious": {
                                    "description": "Indique au pathfinder si l'Entité peut marcher sur le sol sous l'eau. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                }
                            }
                        },
                        "minecraft:npc": {
                            "description": "Donne à l'Entité les interactions d'un NPC. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "npc_data": {
                                    "description": "Les données du NPC. \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "portrait_offsets": {
                                            "description": "Définit les décalages du portrait de l'Entité. \nType: `Object`",
                                            "type": "object",
                                            "properties": {
                                                "translate": {
                                                    "description": "Définit les décalages de translation du portrait de l'Entité. \nType: `Number[3]`",
                                                    "type": "array",
                                                    "items": {
                                                        "type": "number"
                                                    }
                                                },
                                                "scale": {
                                                    "description": "Définit l'échelle du portrait de l'Entité. \nType: `Number[3]`",
                                                    "type": "array",
                                                    "items": {
                                                        "type": "number"
                                                    }
                                                }
                                            }
                                        },
                                        "picker_offsets": {
                                            "description": "Définit les décalages du sélecteur de l'Entité. \nType: `Object`",
                                            "type": "object",
                                            "properties": {
                                                "translate": {
                                                    "description": "Définit les décalages de translation du sélecteur de l'Entité. \nType: `Number[3]`",
                                                    "type": "array",
                                                    "items": {
                                                        "type": "number"
                                                    }
                                                },
                                                "scale": {
                                                    "description": "Définit l'échelle du sélecteur de l'Entité. \nType: `Number[3]`",
                                                    "type": "array",
                                                    "items": {
                                                        "type": "number"
                                                    }
                                                }
                                            }
                                        },
                                        "skin_list": {
                                            "description": "La liste des skins du NPC. \nType: `Object[]` \nNote: Chaque élément de cette liste contient unr propéiété 'variant' qui modifie la variante de l'Entité comme le composant 'minecraft:variant'.",
                                            "type": "array",
                                            "items": {
                                                "type": "object",
                                                "properties": {
                                                    "variant": {
                                                        "description": "Définit la variante de l'Entité. \nType: `Integer`",
                                                        "type": "integer"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "minecraft:on_death": {
                            "description": "Ajoute un déclencheur d'événement lors de la mort de l'Entité. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "event": {
                                    "description": "L'événement à déclencher lors de la mort de l'Entité. \nType: `String`",
                                    "type": "string"
                                },
                                "filters": {
                                    "description": "Les filtres à appliquer à l'événement. \nType: `Minecraft Filter`",
                                    ...commonSchemas.minecraft_filter
                                },
                                "target": {
                                    "description": "La cible de l'événement. \nType: `String`",
                                    "default": "self",
                                    "type": "string",
                                    "enum": ["baby", "block", "damager", "other", "parent", "player", "self", "target"]
                                }
                            }
                        },
                        "minecraft:on_friendly_anger": {
                            "description": "Ajoute un déclencheur d'événement lorsqu'une entité amicale de même type entre dans un état de colère. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "event": {
                                    "description": "L'événement à déclencher lorsqu'une entité amicale de même type entre dans un état de colère. \nType: `String`",
                                    "type": "string"
                                },
                                "filters": {
                                    "description": "Les filtres à appliquer à l'événement. \nType: `Minecraft Filter`",
                                    ...commonSchemas.minecraft_filter
                                },
                                "target": {
                                    "description": "La cible de l'événement. \nType: `String`",
                                    "default": "self",
                                    "type": "string",
                                    "enum": ["baby", "block", "damager", "other", "parent", "player", "self", "target"]
                                }
                            }
                        },
                        "minecraft:on_hurt_by_player": {
                            "description": "Ajoute un déclencheur d'événement lorsqu'une entité est blessée par un joueur. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "event": {
                                    "description": "L'événement à déclencher lorsqu'une entité est blessée par un joueur. \nType: `String`",
                                    "type": "string"
                                },
                                "filters": {
                                    "description": "Les filtres à appliquer à l'événement. \nType: `Minecraft Filter`",
                                    ...commonSchemas.minecraft_filter
                                },
                                "target": {
                                    "description": "La cible de l'événement. \nType: `String`",
                                    "default": "self",
                                    "type": "string",
                                    "enum": ["baby", "block", "damager", "other", "parent", "player", "self", "target"]
                                }
                            }
                        },
                        "minecraft:on_hurt": {
                            "description": "Ajoute un déclencheur d'événement lorsqu'une entité est blessée. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "event": {
                                    "description": "L'événement à déclencher lorsqu'une entité est blessée. \nType: `String`",
                                    "type": "string"
                                },
                                "filters": {
                                    "description": "Les filtres à appliquer à l'événement. \nType: `Minecraft Filter`",
                                    ...commonSchemas.minecraft_filter
                                },
                                "target": {
                                    "description": "La cible de l'événement. \nType: `String`",
                                    "default": "self",
                                    "type": "string",
                                    "enum": ["baby", "block", "damager", "other", "parent", "player", "self", "target"]
                                }
                            }
                        },
                        "minecraft:on_ignite": {
                            "description": "Ajoute un déclencheur d'événement lorsqu'une entité est enflammée. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "event": {
                                    "description": "L'événement à déclencher lorsqu'une entité est enflammée. \nType: `String`",
                                    "type": "string"
                                },
                                "filters": {
                                    "description": "Les filtres à appliquer à l'événement. \nType: `Minecraft Filter`",
                                    ...commonSchemas.minecraft_filter
                                },
                                "target": {
                                    "description": "La cible de l'événement. \nType: `String`",
                                    "default": "self",
                                    "type": "string",
                                    "enum": ["baby", "block", "damager", "other", "parent", "player", "self", "target"]
                                }
                            }
                        },
                        "minecraft:on_start_landing": {
                            "description": "Ajoute un déclencheur d'événement lorsque l'entité commence à atterrir. \nType: `Object` \nNote: minecraft:on_start_landing ne peut être utilisé que par l'entité ender_dragon.",
                            "type": "object",
                            "properties": {
                                "event": {
                                    "description": "L'événement à déclencher lorsque l'entité commence à atterrir. \nType: `String`",
                                    "type": "string"
                                },
                                "filters": {
                                    "description": "Les filtres à appliquer à l'événement. \nType: `Minecraft Filter`",
                                    ...commonSchemas.minecraft_filter
                                },
                                "target": {
                                    "description": "La cible de l'événement. \nType: `String`",
                                    "default": "self",
                                    "type": "string",
                                    "enum": ["baby", "block", "damager", "other", "parent", "player", "self", "target"]
                                }
                            }
                        },
                        "minecraft:on_start_takeoff": {
                            "description": "Ajoute un déclencheur d'événement lorsque l'entité commence à décoller. \nType: `Object` \nNote: minecraft:on_start_takeoff ne peut être utilisé que par l'entité ender_dragon.",
                            "type": "object",
                            "properties": {
                                "event": {
                                    "description": "L'événement à déclencher lorsque l'entité commence à décoller. \nType: `String`",
                                    "type": "string"
                                },
                                "filters": {
                                    "description": "Les filtres à appliquer à l'événement. \nType: `Minecraft Filter`",
                                    ...commonSchemas.minecraft_filter
                                },
                                "target": {
                                    "description": "La cible de l'événement. \nType: `String`",
                                    "default": "self",
                                    "type": "string",
                                    "enum": ["baby", "block", "damager", "other", "parent", "player", "self", "target"]
                                }
                            }
                        },
                        "minecraft:on_target_acquired": {
                            "description": "Ajoute un déclencheur d'événement lorsqu'une entité acquiert une cible. \nType: `Object` \nNote: Ce composant nécessite que l'entité peut avoir une cible pour fonctionner.",
                            "type": "object",
                            "properties": {
                                "event": {
                                    "description": "L'événement à déclencher lorsqu'une entité acquiert une cible. \nType: `String`",
                                    "type": "string"
                                },
                                "filters": {
                                    "description": "Les filtres à appliquer à l'événement. \nType: `Minecraft Filter`",
                                    ...commonSchemas.minecraft_filter
                                },
                                "target": {
                                    "description": "La cible de l'événement. \nType: `String`",
                                    "default": "self",
                                    "type": "string",
                                    "enum": ["baby", "block", "damager", "other", "parent", "player", "self", "target"]
                                }
                            }
                        },
                        "minecraft:on_target_escape": {
                            "description": "Ajoute un déclencheur d'événement lorsqu'une entité perd sa cible. \nType: `Object` \nNote: Ce composant nécessite que l'entité peut avoir une cible pour fonctionner.",
                            "type": "object",
                            "properties": {
                                "event": {
                                    "description": "L'événement à déclencher lorsqu'une entité perd sa cible. \nType: `String`",
                                    "type": "string"
                                },
                                "filters": {
                                    "description": "Les filtres à appliquer à l'événement. \nType: `Minecraft Filter`",
                                    ...commonSchemas.minecraft_filter
                                },
                                "target": {
                                    "description": "La cible de l'événement. \nType: `String`",
                                    "default": "self",
                                    "type": "string",
                                    "enum": ["baby", "block", "damager", "other", "parent", "player", "self", "target"]
                                }
                            }
                        },
                        "minecraft:on_wake_with_owner": {
                            "description": "Ajoute un déclencheur d'événement lorsque le propriétaire de l'entité se réveille après avoir dormi avec l'entité. \nType: `Object` \nNote: minecraft:on_wake_with_owner nécessite qu'un joueur soit étiqueté comme propriétaire de l'entité, via le dressage ou la commande console.",
                            "type": "object",
                            "properties": {
                                "event": {
                                    "description": "L'événement à déclencher lorsque le propriétaire de l'entité se réveille après avoir dormi avec l'entité. \nType: `String`",
                                    "type": "string"
                                },
                                "filters": {
                                    "description": "Les filtres à appliquer à l'événement. \nType: `Minecraft Filter`",
                                    ...commonSchemas.minecraft_filter
                                },
                                "target": {
                                    "description": "La cible de l'événement. \nType: `String`",
                                    "default": "self",
                                    "type": "string",
                                    "enum": ["baby", "block", "damager", "other", "parent", "player", "self", "target"]
                                }
                            }
                        },
                        "minecraft:out_of_control": {
                            "description": "Définit l'état 'hors de contrôle' de l'Entité. \nType: `Object`",
                            "type": "object"
                        },
                        "minecraft:peek": {
                            "description": "Définit le comportement 'peek' de l'Entité, et les événements qui doivent être appelés pendant celui-ci. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "on_close": {
                                    "description": "Evénement à déclencher lorsque l'Entité a fini de jeter un oeil. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "on_open": {
                                    "description": "Evénement à déclencher lorsque l'Entité commence à jeter un oeil. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "on_target_open": {
                                    "description": "Événement à appeler lorsque l'entité cible de l'entité commence à jeter un œil. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                }
                            }
                        },
                        "minecraft:persistent": {
                            "description": "Définit si l'Entité est persistante dans le monde du jeu. \nType: `Object`",
                            "type": "object"
                        },
                        "minecraft:physics": {
                            "description": "Définit les propriétés physiques d'une Entité, y compris si elle est affectée par la gravité ou si elle entre en collision avec des objets. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "has_collision": {
                                    "description": "Définit si l'Entité entre en collision avec d'autres choses. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "has_gravity": {
                                    "description": "Définit si l'Entité est affectée par la gravité. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "push_towards_closest_space": {
                                    "description": "Définit si l'Entité doit être poussée vers la zone ouverte la plus proche lorsqu'elle est coincée à l'intérieur d'un bloc. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                }
                            }
                        },
                        "minecraft:player.exhaustion": {
                            "description": "Définit le niveau d'épuisement du joueur. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "max": {
                                    "description": "Le niveau maximum d'épuisement du joueur. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "value": {
                                    "description": "La valeur actuelle de l'épuisement du joueur. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:player.experience": {
                            "description": "Définit la quantité d'expérience que chaque action du joueur doit prendre. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "max": {
                                    "description": "Le maximum d'expérience du joueur. \nType: `Integer`",
                                    "default": 5,
                                    "type": "integer"
                                },
                                "value": {
                                    "description": "La valeur initiale de l'expérience du joueur. \nType: `Integer`",
                                    "default": 1,
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:player.hunger": {
                            "description": "Définit le niveau de faim du joueur. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "value": {
                                    "description": "La valeur initiale de la faim du joueur. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "max": {
                                    "description": "Le niveau maximum de faim du joueur. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "min": {
                                    "description": "Le niveau minimum de faim du joueur. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:player.level": {
                            "description": "Définit le niveau d'xp du joueur. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "max": {
                                    "description": "Le niveau maximum du joueur. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "value": {
                                    "description": "La valeur initiale du niveau du joueur. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:player.saturation": {
                            "description": "Définit le besoin de nourriture du joueur. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "max": {
                                    "description": "Le maximum de saturation du joueur. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "value": {
                                    "description": "La valeur initiale de la saturation du joueur. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:preferred_path": {
                            "description": "Spécifie les informations de coût pour les entités qui préfèrent marcher sur des chemins préférés. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "default_block_cost": {
                                    "description": "Cout par défaut pour les blocs non préférés. \nType: `Number`",
                                    "default": 0,
                                    "type": "number"
                                },
                                "jump_cost": {
                                    "description": "Ajoute un coût pour sauter d'un bloc à un autre. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "max_fall_blocks": {
                                    "description": "Distance maximale qu'une entité peut tomber sans prendre de dégâts. \nType: `Integer`",
                                    "default": 3,
                                    "type": "integer"
                                },
                                "preferred_path_blocks": {
                                    "description": "Une liste de blocs avec leur coût associé. \nType: `Object[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "cost": {
                                                "description": "Le coût associé à ce bloc. \nType: `Number`",
                                                "type": "number"
                                            },
                                            "blocks": {
                                                "description": "La liste des blocs. \nType: `String[]`",
                                                "type": "array",
                                                "items": {
                                                    "type": "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "minecraft:projectile": {
                            "description": "Permet à l'entité d'être un projectile. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "anchor": {
                                    "description": "Permet de choisir un point d'ancrage pour lequel le projectile est tiré. \nType: `Integer \n0 = Point d'origine \n1 = Hauteur des yeux \n2 = Milieu ou hauteur du corps.`",
                                    "default": 0,
                                    "type": "integer",
                                    "enum": [0, 1, 2]
                                },
                                "angle_offset": {
                                    "description": "Altère l'angle selon lequel un projectile est tiré verticalement. De nombreuses potions de lancer dans le jeu utilisent cela pour compenser leurs angles de -20 degrés. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "catch_fire": {
                                    "description": "Définit si le projectile peut enflammer les entités qu'il touche. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "crit_particle_on_hurt": {
                                    "description": "Définit si, lorsqu'un projectile inflige des dégâts, il faut ou non générer des particules de dégâts critiques. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "destroy_on_hurt": {
                                    "description": "Définit si, lorsqu'un projectile inflige des dégâts, il faut ou non détruire immédiatement ce projectile. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "filter": {
                                    "description": "Définit les entités qui ne peuvent être touchées par le projectile. \nType: `String`",
                                    "type": "string"
                                },
                                "fire_affected_by_griefing": {
                                    "description": "Définit si le projectile qui cause le feu est affecté par la règle de jeu de griefing des entités. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "gravity": {
                                    "description": "La gravité appliquée à cette entité lorsqu'elle est lancée. Lorsque cette entité n'est pas au sol, soustrait cette quantité du changement de position verticale de l'entité à chaque tick. Plus la valeur est élevée, plus l'entité tombe rapidement. \nType: `Number`",
                                    "default": 0.05,
                                    "type": "number"
                                },
                                "hit_nearest_passenger": {
                                    "description": "Lorsque ce projectile touche un véhicule et qu'il y a au moins un passager dans ce vehicule, définit si les dégâts sont infligés au passager le plus proche du point d'impact du projectile. Si aucun passager n'est présent, ce paramètre ne fait rien. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "hit_sound": {
                                    "description": "Le son qui se joue lorsque le projectile touche quelque chose. \nType: `String`",
                                    "type": "string"
                                },
                                "hit_ground_sound": {
                                    "description": "Le son qui se joue lorsque le projectile touche le sol. \nType: `String`",
                                    "type": "string"
                                },
                                "homing": {
                                    "description": "Définit si le projectile se dirige vers l'entité la plus proche. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "ignored_entities": {
                                    "description": "[EXEPERIMENTAL] Les entités qui ne sont pas affectées par ce projectile. \nType: `String[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.entity_ids
                                    }
                                },
                                "inertia": {
                                    "description": "Définit la fraction de la vitesse du projectile maintenue à chaque frame pendant son déplacement dans l'air.",
                                    "default": 0.99,
                                    "type": "number"
                                },
                                "is_dangerous": {
                                    "description": "Définit si le projectile doit être traité comme dangereux pour les joueurs. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "knockback": {
                                    "description": "Définit si le projectile doit repousser l'entité qu'il touche. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "lightning": {
                                    "description": "Définit si l'entité touchée par le projectile est frappée par la foudre. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "liquid_inertia": {
                                    "description": "La fraction de la vitesse du projectile maintenue à chaque frame lorsqu'il se déplace dans l'eau. \nType: `Number`",
                                    "default": 0.6,
                                    "type": "number"
                                },
                                "multiple_targets": {
                                    "description": "Définit si le projectile peut toucher plusieurs entités par volée. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "offset": {
                                    "description": "Le décalage par rapport à l'ancrage de l'entité où le projectile apparaît. \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "on_fire_time": {
                                    "description": "Temps en secondes pendant lequel l'entité touchée sera en feu. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "on_hit": {
                                    "description": "Définit les comportements qui peuvent être exécutés lorsqu'un projectile touche quelque chose. \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "catch_fire": {
                                            "description": "Détèrmine si l'entité touchée est en feu. \nType: `Boolean`",
                                            "default": false,
                                            "type": "boolean"
                                        },
                                        "definition_event": {
                                            "description": "L'événement à déclencher lorsqu'un projectile touche quelque chose. \nType: `Object`",
                                            "type": "object",
                                            "properties": {
                                                "affect_projectile": {
                                                    "description": "Le projectile sera affecté par cet événement. \nType: `Boolean`",
                                                    "default": false,
                                                    "type": "boolean"
                                                },
                                                "affect_shooter": {
                                                    "description": "Le tireur sera affecté par cet événement. \nType: `Boolean`",
                                                    "default": false,
                                                    "type": "boolean"
                                                },
                                                "affect_splash_area": {
                                                    "description": "Toutes les entités dans la zone de l'explosion seront affectées par cet événement. \nType: `Boolean`",
                                                    "default": false,
                                                    "type": "boolean"
                                                },
                                                "splash_area": {
                                                    "description": "La zone d'éclaboussure qui sera affectée. \nType: `Number`",
                                                    "default": 0.0,
                                                    "type": "number"
                                                },
                                                "affect_target": {
                                                    "description": "La cible sera affectée par cet événement. \nType: `Boolean`",
                                                    "default": false,
                                                    "type": "boolean"
                                                },
                                                "event_trigger_type": {
                                                    "description": "L'événement à déclencher. \nType: `Object`",
                                                    "type": "object",
                                                    "properties": {
                                                        "event": {
                                                            "description": "L'événement à déclencher. \nType: `String`",
                                                            "type": "string"
                                                        },
                                                        "filters": {
                                                            "description": "Les filtres qui déterminent si l'événement doit être déclenché. \nType: `Minecraft Filter`",
                                                            ...commonSchemas.minecraft_filter
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        "douse_fire": {
                                            "description": "Si la cible est en feu, définit si le feu doit être éteint. \nType: `Boolean`",
                                            "default": false,
                                            "type": "boolean"
                                        },
                                        "freeze_on_hit": {
                                            "description": "Définit les propriétés de gel à l'impact. \nType: `Object`",
                                            "type": "object",
                                            "properties": {
                                                "size": {
                                                    "description": "La taille de la zone gelée. \nType: `Number`",
                                                    "type": "number"
                                                },
                                                "shape": {
                                                    "description": "La forme de la zone gelée. \nType: `String`",
                                                    "type": "string",
                                                    "enum": ["sphere", "cube"]
                                                },
                                                "snap_to_block": {
                                                    "type": "boolean"
                                                }
                                            }
                                        },
                                        "grant_xp": {
                                            "description": "Accorde des XP en cas de coup. Possède minXP pour le minimum d'XP accordé, maxXp pour le maximum ou simplement des propriétés XP fixes.",
                                            "type": "object",
                                            "properties": {
                                                "minXP": {
                                                    "description": "Le minimum d'XP accordé. \nType: `Integer`",
                                                    "type": "integer"
                                                },
                                                "maxXP": {
                                                    "description": "Le maximum d'XP accordé. \nType: `Integer`",
                                                    "type": "integer"
                                                },
                                                "xp": {
                                                    "description": "Le montant constant d'XP à donner. Lorsqu'il est défini, il sera utilisé à la place des valeurs min et max.",
                                                    "type": "integer"
                                                }
                                            }
                                        },
                                        "hurt_owner": {
                                            "description": "Détermine si le propriétaire de l'entité est blessé lorsqu'il est touché. \nType: `Object`",
                                            "type": "object",
                                            "properties": {
                                                "owner_damage": {
                                                    "type": "integer"
                                                },
                                                "knockback": {
                                                    "type": "boolean"
                                                },
                                                "ignite": {
                                                    "type": "boolean"
                                                }
                                            }
                                        },
                                        "ignite": {
                                            "description": "Détermine si un feu peut être allumé sur l'entité touchée. \nType: `Boolean`",
                                            "default": false,
                                            "type": "boolean"
                                        },
                                        "impact_damage": {
                                            "description": "Définit les dégâts que l'entité touchée subit. \nType: `Object`",
                                            "type": "object",
                                            "properties": {
                                                "catch_fire": {
                                                    "description": "Détermine si l'entité touchée est en feu. \nType: `Boolean`",
                                                    "default": false,
                                                    "type": "boolean"
                                                },
                                                "channeling": {
                                                    "description": "Définit si la foudre peut être canalisée à travers l'arme. \nType: `Boolean`",
                                                    "default": true,
                                                    "type": "boolean"
                                                },
                                                "damage": {
                                                    "description": "Les dégâts infligés à l'entité touchée. \nType: `Integer`",
                                                    "default": 1,
                                                    "type": "integer"
                                                },
                                                "destroy_on_hit": {
                                                    "description": "Définit si le projectile est supprimé lors de l'impact.",
                                                    "default": false,
                                                    "type": "boolean"
                                                },
                                                "destroy_on_hit_requires_damage": {
                                                    "description": "Définit si le projectile doit causer des dégâts pour être détruit lors de l'impact.",
                                                    "default": true,
                                                    "type": "boolean"
                                                },
                                                "filter": {
                                                    "description": "L'identifiant de l'entité qui peut être touchée par le projectile. \nType: `String`",
                                                    "type": "string"
                                                },
                                                "knockback": {
                                                    "description": "Définit si le projectile doit repousser l'entité touchée. \nType: `Boolean`",
                                                    "default": true,
                                                    "type": "boolean"
                                                },
                                                "max_critical_damage": {
                                                    "description": "Dégat critique maximum.",
                                                    "type": "integer"
                                                },
                                                "min_critical_damage": {
                                                    "description": "Dégât critique minimum.",
                                                    "default": 0,
                                                    "type": "integer"
                                                },
                                                "power_multiplier": {
                                                    "description": "De combien le dégât de l'impact est multiplié. \nType: `Number`",
                                                    "default": 2.0,
                                                    "type": "number"
                                                },
                                                "semi_random_diff_damage": {
                                                    "description": "Définit si les dégâts seront basé aléatoirement sur les dégâts et la vitesse. \nType: `Boolean`",
                                                    "default": false,
                                                    "type": "boolean"
                                                },
                                                "set_last_hurt_requires_damage": {
                                                    "description": "Définit si le dernier coup doit causer des dégâts pour mettre à jour la dernière propriété blessée.",
                                                    "default": false,
                                                    "type": "boolean"
                                                }
                                            }
                                        },
                                        "mob_effect": {
                                            "description": "La cible reçoit un effet de mob. \nType: `Object`",
                                            "type": "object",
                                            "properties": {
                                                "amplifier": {
                                                    "description": "Le multiplcateur de l'amplification de cet effet. \nType: `Integer`",
                                                    "default": 1,
                                                    "type": "integer"
                                                },
                                                "ambient": {
                                                    "description": "Définit si un mob apparaitra qui n'est pas hostile comme l'entité de chauve-souris dans Minecraft. \nType: `Boolean`",
                                                    "default": false,
                                                    "type": "boolean"
                                                },
                                                "duration": {
                                                    "description": "La durée de l'effet. \nType: `Integer | String`",
                                                    "default": 1,
                                                    "oneOf": [
                                                        {
                                                            "type": "integer"
                                                        },
                                                        {
                                                            type: "string",
                                                            enum: ["infinite"]
                                                        }
                                                    ]
                                                },
                                                "durationeasy": {
                                                    "description": "La durée de l'effet en mode facile. \nType: `Integer | String`",
                                                    "default": 0,
                                                    "oneOf": [
                                                        {
                                                            "type": "integer"
                                                        },
                                                        {
                                                            type: "string",
                                                            enum: ["infinite"]
                                                        }
                                                    ]
                                                },
                                                "durationhard": {
                                                    "description": "La durée de l'effet en mode difficile. \nType: `Integer | String`",
                                                    "default": 800,
                                                    "oneOf": [
                                                        {
                                                            "type": "integer"
                                                        },
                                                        {
                                                            type: "string",
                                                            enum: ["infinite"]
                                                        }
                                                    ]
                                                },
                                                "durationnormal": {
                                                    "description": "La durée de l'effet en mode normal. \nType: `Integer | String`",
                                                    "default": 200,
                                                    "oneOf": [
                                                        {
                                                            "type": "integer"
                                                        },
                                                        {
                                                            type: "string",
                                                            enum: ["infinite"]
                                                        }
                                                    ]
                                                },
                                                "effect": {
                                                    "description": "L'effet à appliquer. \nType: `String`",
                                                    "type": "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.effect_ids
                                                },
                                                "visible": {
                                                    "description": "Définit si l'effet est visible. \nType: `Boolean`",
                                                    "default": false,
                                                    "type": "boolean"
                                                }
                                            }
                                        },
                                        "on_fire_time": {
                                            "description": "Le temps pendant lequel la cible est en feu. \nType: `Number`",
                                            "default": 0.0,
                                            "type": "number"
                                        },
                                        "particle_on_hit": {
                                            "description": "Les particules qui apparaissent lorsqu'un projectile touche quelque chose. \nType: `Object`",
                                            "type": "object",
                                            "properties": {
                                                "particle_type": {
                                                    "description": "L'ID de la particule à emettre. \nType: `String`",
                                                    "type": "string"
                                                },
                                                "on_other_hit": {
                                                    "description": "Définit si génère des particules à tout autre coup.",
                                                    "default": false,
                                                    "type": "boolean"
                                                },
                                                "on_entity_hit": {
                                                    "description": "Définit si génère des particules à tout coup sur une entité.",
                                                    "default": false,
                                                    "type": "boolean"
                                                },
                                                "num_particles": {
                                                    "description": "Le nombre de particules à générer. \nType: `Integer`",
                                                    "default": 6,
                                                    "type": "integer"
                                                },
                                                "particle_item_name": {
                                                    "description": "Sélectionne le nom de la particule à utiliser si les filtres sont valides. \nType: `Object`",
                                                    "type": "object",
                                                    "additionalProperties": {
                                                        ...commonSchemas.minecraft_filter,
                                                    }
                                                }
                                            }
                                        },
                                        "potion_effect": {
                                            "description": "Définit l'effet de la flèche qui s'appliquera à l'entité touchée. \nType: `Integer`",
                                            "default": -1,
                                            "type": "integer"
                                        },
                                        "remove_on_hit": {
                                            "description": "Supprime le projectile. \nType: `Object`",
                                            "type": "object"
                                        },
                                        "spawn_aoe_cloud": {
                                            "description": "La potion crée un nuage d'effet de zone. \nType: `Object`",
                                            "type": "object",
                                            "properties": {
                                                "affect_owner": {
                                                    "description": "Détermine si le tireur est affecté par le nuage. \nType: `Boolean`",
                                                    "default": true,
                                                    "type": "boolean"
                                                },
                                                "color": {
                                                    "description": "Couleur du nuage sous format RGB. \nType: `Integer[3]`",
                                                    "type": "array",
                                                    "minItems": 3,
                                                    "maxItems": 3,
                                                    "items": {
                                                        "type": "integer"
                                                    }
                                                },
                                                "duration": {
                                                    "description": "Combien de temps la particule est émise. \nType: `Integer`",
                                                    "default": 0,
                                                    "type": "integer"
                                                },
                                                "particle": {
                                                    "description": "L'émetteur de particules. \nType: `Integer`",
                                                    "default": 0,
                                                    "type": "integer"
                                                },
                                                "potion": {
                                                    "description": "L'ID de la potion. \nType: `Integer`",
                                                    "default": -1,
                                                    "type": "integer"
                                                },
                                                "radius": {
                                                    "description": "Définit la zone d'effet du nuage. \nType: `Number`",
                                                    "default": 0,
                                                    "type": "number"
                                                },
                                                "radius_on_use": {
                                                    "description": "Définit la zone d'effet du nuage lorsqu'il est utilisé. \nType: `Number`",
                                                    "default": -1,
                                                    "type": "number"
                                                },
                                                "reapplication_delay": {
                                                    "description": "Delai avant que la potion puisse affecter la zone à nouveau. \nType: `Integer`",
                                                    "default": 0,
                                                    "type": "integer"
                                                }
                                            }
                                        },
                                        "spawn_chance": {
                                            "description": "Contient des informations sur la chance de faire apparaître une entité lorsqu'elle est touchée. \nType: `Object`",
                                            "type": "object",
                                            "properties": {
                                                "first_spawn_count": {
                                                    "description": "Le nombre d'entités à faire apparaître. \nType: `Integer`",
                                                    "default": 0,
                                                    "type": "integer"
                                                },
                                                "first_spawn_percent_chance": {
                                                    "description": "La chance qu'une entité apparaisse lorsqu'elle est touchée. \nType: `Number`",
                                                    "default": 0,
                                                    "type": "number"
                                                },
                                                "on_spawn": {
                                                    "description": "Le ou les événements à déclencher lorsqu'une entité apparaît. \nType: `EventTrigger[]`",
                                                    "type": "array",
                                                    "items": {
                                                        oneOf: [
                                                            {
                                                                type: "string"
                                                            },
                                                            commonSchemas.entity_event_trigger
                                                        ]
                                                    }
                                                },
                                                "second_spawn_chance": {
                                                    "description": "La chance qu'une deuxième entité apparaisse lorsqu'elle est touchée. \nType: `Number`",
                                                    "default": 32,
                                                    "type": "number"
                                                },
                                                "second_spawn_count": {
                                                    "description": "Le nombre d'entités à faire apparaître lors de la deuxième apparition. \nType: `Integer`",
                                                    "default": 0,
                                                    "type": "integer"
                                                },
                                                "spawn_definition": {
                                                    "description": "Définit les entités à faire apparaître. \nType: `String`",
                                                    "type": "string",
                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.entity_ids
                                                },
                                                "spawn_baby": {
                                                    "description": "Définit si l'entité apparue est un bébé. \nType: `Boolean`",
                                                    "default": false,
                                                    "type": "boolean"
                                                }
                                            }
                                        },
                                        "stick_in_ground": {
                                            "description": "Définit si l'objet reste dans le sol et contient le paramètre shake_time pour déterminer combien de temps il va trembler.",
                                            "type": "object",
                                            "properties": {
                                                "shake_time": {
                                                    "description": "Le temps que l'objet reste dans le sol. \nType: `Number`",
                                                    "type": "number"
                                                }
                                            }
                                        },
                                        "teleport_owner": {
                                            "description": "Définit si le propriétaire de l'entité est téléporté lorsqu'il est touché. \nType: `Boolean`",
                                            "default": false,
                                            "type": "boolean"
                                        },
                                        "thrown_potion_effect": {
                                            "description": "Crée une zone d'effet pour les effets causés par une potion lancée. \nType: `Object`",
                                            "default": {},
                                            "type": "object"
                                        },
                                        "wind_burst_on_hit": {
                                            "description": "Crée une charge de vent au momoent et au lieu de l'impact du Projectile. \nType: `Object`",
                                            "type": "object"
                                        }
                                    }
                                },
                                "particle": {
                                    "description": "La particule à afficher lorsqu'un projectile est lancé. \nType: `String`",
                                    "default": "ironcrack",
                                    "type": "string"
                                },
                                "power": {
                                    "description": "Détermine la vélocité du projectile. \nType: `Number`",
                                    "default": 1.3,
                                    "type": "number"
                                },
                                "reflect_immunity": {
                                    "description": "Durant le temps spécifié, en secondes, le projectile ne peut pas être réfléchi en le touchant.",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "reflect_on_hurt": {
                                    "description": "Définit si le projectile peut être réfléchi lorsqu'il touche une entité. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "shoot_sound": {
                                    "description": "Le son qui se joue lorsque le projectile est tiré. \nType: `String`",
                                    "type": "string"
                                },
                                "shoot_target": {
                                    "description": "Définit si le projectile doit être tiré vers la cible de l'entité. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean" 
                                },
                                "should_bounce": {
                                    "description": "Définit si le projectile rebondit lorsqu'il touche quelque chose. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "splash_potion": {
                                    "description": "Définit si le projectile doit être traité comme une potion de lancer. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "splash_range": {
                                    "description": "Rayon en blocs de l'effet de splash. \nType: `Number`",
                                    "default": 4,
                                    "type": "number"
                                },
                                "stop_on_hurt": {
                                    "description": "Détermine si le projectile s'arrête lorsque la cible est blessée. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "uncertainty_base": {
                                    "description": "La précision de base. La précision est déterminée par la formule uncertaintyBase - difficultyLevel * uncertaintyMultiplier. \nType: `Number`",
                                    "default": 0,
                                    "type": "number"
                                },
                                "uncertainty_multiplier": {
                                    "description": "Détermine dans quelle mesure la difficulté affecte la précision. La précision est déterminée par la formule uncertaintyBase - difficultyLevel * uncertaintyMultiplier. \nType: `Number`",
                                    "default": 0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:push_through": {
                            "description": "Définit la distance à laquelle l'entité peut pousser à travers. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "value": {
                                    "description": "La valeur de la poussée de l'entité, en blocs. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:pushable": {
                            "description": "Définit ce qui peut pousser une entité entre d'autres entités et des pistons. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "is_pushable": {
                                    "description": "Définit si l'entité peut être poussée par les autres entités. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "is_pushable_by_piston": {
                                    "description": "Définit si l'entité peut être poussée par un piston. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                }
                            }
                        },
                        "minecraft:raid_trigger": {
                            "description": "Tente de déclencher un raid à l'emplacement de l'entité. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "triggered_event": {
                                    "description": "L'événement à déclencher. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                }
                            }
                        },
                        "minecraft:rail_movement": {
                            "description": "Définit le mouvement de l'Entité sur les rails. \nType: `Object` \nNote: Une Entité avec ce composant ne peut se déplacer que sur les rails.",
                            "type": "object",
                            "properties": {
                                "max_speed": {
                                    "description": "La vitesse maximale à laquelle cette Entité se déplacera sur les rails. \nType: `Number`",
                                    "default": 0.4,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:rail_sensor": {
                            "description": "Définit le comportement de l'Entité lorsqu'elle passe sur un rail activé ou désactivé. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "check_block_types": {
                                    "description": "Si c'est vrai, lors du tick, l'entité déclenchera son comportement on_deactivate. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "eject_on_activate": {
                                    "description": "Si c'est vrai, l'entité éjectera tous ses passagers lorsqu'elle passera sur un rail activé. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "eject_on_deactivate": {
                                    "description": "Si c'est vrai, l'entité éjectera tous ses passagers lorsqu'elle passera sur un rail désactivé. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "on_activate": {
                                    "description": "L'événement à déclencher lorsque l'entité passe sur un rail activé. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "on_deactivate": {
                                    "description": "L'événement à déclencher lorsque l'entité passe sur un rail désactivé. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "tick_command_block_on_activate": {
                                    "description": "Si c'est vrai, les blocs de commande commenceront à être activés lorsqu'ils passeront sur un rail activé. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "tick_command_block_on_deactivate": {
                                    "description": "Si c'est vrai, les blocs de commande commenceront à être activés lorsqu'ils passeront sur un rail désactivé. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                }
                            }
                        },
                        "minecraft:ravager_blocked": {
                            "description": "Définit la réponse du ravageur à leur attaque au corps à corps bloquée. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "knockback_strength": {
                                    "description": "La force avec laquelle les entités de blocage doivent être repoussées. \nType: `Number`",
                                    "default": 3.0,
                                    "type": "number"
                                },
                                "reaction_choices": {
                                    "description": "Une liste de réponses pondérées à l'attaque au corps à corps bloquée. \nType: `Object[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "weight": {
                                                "description": "Le poids de cette réponse. \nType: `Number`",
                                                "type": "number"
                                            },
                                            "value": {
                                                "description": "La réponse à l'attaque au corps à corps bloquée. \nType: `EventTrigger`",
                                                oneOf: [
                                                    {
                                                        type: "string"
                                                    },
                                                    commonSchemas.entity_event_trigger
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "minecraft:renders_when_invisible": {
                            "description": "Définit que l'Entité sera rendu même s'il est invisible. \nType: `Object` \nNote: Le comportement du rendu peut être spécifié dans le fichier client de l'Entité.",
                            "type": "object"
                        },
                        "minecraft:reflect_projectiles": {
                            "description": "[EXPÉRIMENTAL] Permet à une entité de refléter les projectiles. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "azimuth_angle": {
                                    "description": "Une expression Molang définissant l'angle en degrés à ajouter à la rotation de l'axe y du projectile. \nType: `Molang`",
                                    "default": 0,
                                    type: "molang"
                                },
                                "elevation_angle": {
                                    "description": "Une expression Molang définissant l'angle en degrés à ajouter à la rotation de l'axe x du projectile. \nType: `Molang`",
                                    "default": 0,
                                    type: "molang"
                                },
                                "reflected_projectiles": {
                                    "description": "Les types de projectiles qui sont réfléchis lorsqu'ils touchent l'entité. \nType: `String[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    }
                                },
                                "reflection_scale": {
                                    "description": "Une expression Molang définissant l'échelle de vélocité du projectile réfléchi. Les valeurs inférieures à 1 diminuent la vélocité du projectile, et les valeurs supérieures à 1 l'augmentent. \nType: `Molang`",
                                    "default": 1,
                                    type: "molang"
                                },
                                "reflection_sound": {
                                    "description": "Le son qui se joue lorsque le projectile est réfléchi. \nType: `String`",
                                    "default": "reflect",
                                    "type": "string"
                                }
                            }
                        },
                        "minecraft:remove_in_peaceful": {
                            "description": "Définit que l'Entité sera supprimée en mode Pacifique. \nType: `Object`",
                            "type": "object"
                        },
                        "minecraft:rideable": {
                            "description": "Définit si l'Entité peut être montée. Permet de spécifier les différentes places de la monture. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "controlling_seat": {
                                    "description": "Le siège qui désigne le conducteur de l'entité. Cela n'est observé que par les styles de monture de cheval/bateau ; les chariots/entités avec 'minecraft:controlled_by_player' donnent le contrôle à n'importe quel joueur dans n'importe quel siège. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "crouching_skip_interact": {
                                    "description": "Définit si l'entité ne peut pas être interagie avec si l'entité interagissant avec elle est accroupie. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "dismount_mode": {
                                    "description": "Définit où les chevaucheurs sont placés lorsqu'ils descendent de l'Entité. \nType: `String` \n`default`: les chevaucheurs sont placés sur une position au sol valide autour de l'Entité ou au centre de la boite de collision si aucune position est trouvée. \n`on_top_center`: les chevaucheurs sont placés au centre en haut de la boite de collision de l'Entité.",
                                    "default": "default",
                                    "type": "string",
                                    "enum": ["default", "on_top_center"]
                                },
                                "family_types": {
                                    "description": "Les types de famille d'entités qui peuvent monter sur cette entité. \nType: `String[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    }
                                },
                                "interact_text": {
                                    "description": "Le texte à afficher lorsqu'un joueur peut interagir avec l'entité. \nType: `Localization String`",
                                    "type": "string"
                                },
                                "on_rider_enter_event": {
                                    "description": "L'événement à exécuter sur l'Entité quand un passager monte. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "on_rider_exit_event": {
                                    "description": "L'événement à exécuter sur l'Entité quand un passager descend. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "passenger_max_width": {
                                    "description": "La largeur maximale qu'une entité peut avoir pour être un passager. Une valeur de 0 ignore ce paramètre. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "Ce champ peut exister dans les anciennes données, mais n'est pas utilisé par minecraft:rideable. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "pull_in_entities": {
                                    "description": "Définit si l'entité tirera les entités dans les sièges disponibles. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "rider_can_interact": {
                                    "description": "Si c'est vrai, l'entité sera sélectionnée lorsqu'elle sera examinée par le pilote. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "seat_count": {
                                    "description": "Le nombre de sièges disponibles pour les passagers. \nType: `Integer`",
                                    "default": 1,
                                    "type": "integer"
                                },
                                "seats": {
                                    "description": "La liste des positions et du nombre de cavaliers pour chaque position pour les entités montant cette entité. \nType: `Object[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "camera_relax_distance_smoothing": {
                                                "description": "Ajoute l'élasticité au mouvement de la caméra lorsqu'elle revient à son rayon après avoir été poussée vers le joueur par un obstacle. \nType: `Number`",
                                                "type": "number",
                                                "minimum": 1.0,
                                                "maximum": 32.0
                                            },
                                            "lock_rider_rotation": {
                                                "description": "Angle en degrés que le cavalier est autorisé à tourner lorsqu'il monte cette entité. Omettre cette propriété pour aucune limite. \nType: `Number`",
                                                "default": 181,
                                                "type": "number"
                                            },
                                            "max_rider_count": {
                                                "description": "Définit le nombre maximum de cavaliers qui peuvent chevaucher cette entité pour que ce siège soit valide. \nType: `Integer`",
                                                "type": "integer"
                                            },
                                            "min_rider_count": {
                                                "description": "Définit le nombre minimum de cavaliers qui peuvent chevaucher cette entité pour que ce siège soit valide. \nType: `Integer`",
                                                "default": 0,
                                                "type": "integer"
                                            },
                                            "position": {
                                                "description": "La position du siège par rapport à l'entité. \nType: `Number[3]`",
                                                "default": [0, 0, 0],
                                                "type": "array",
                                                "minItems": 3,
                                                "maxItems": 3,
                                                "items": {
                                                    "type": "number"
                                                }
                                            },
                                            "rotate_rider_by": {
                                                "description": "Décalage pour faire tourner les cavaliers. \nType: `Molang`",
                                                "default": 0,
                                                "oneOf": [
                                                    {
                                                        "type": "string"
                                                    },
                                                    {
                                                        "type": "number"
                                                    }
                                                ]
                                            },
                                            "third_person_camera_radius": {
                                                "description": "Permet de définir un rayon différent de caméra pour la caméra 3ème personne ou 3ème personne avant. \nType: `Number`",
                                                "type": "number",
                                                "minimum": 1.0,
                                                "maximum": 64.0
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "minecraft:scale": {
                            "description": "Définit la taille visuelle de l'entité en modifiant la taille du modèle. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "value": {
                                    "description": "La valeur de l'échelle. 1.0 signifie que l'entité apparaîtra à l'échelle définie dans son modèle. Des nombres plus élevés rendent l'entité plus grande. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:scale_by_age": {
                            "description": "Définit l'interpolation de la taille de l'entité en fonction de l'âge de l'entité. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "end_scale": {
                                    "description": "L'échelle de fin de l'entité lorsqu'elle est entièrement développée. \nType: `Number`",
                                    "default": 1,
                                    "type": "number"
                                },
                                "start_scale": {
                                    "description": "L'échelle de départ de l'entité lorsqu'elle est bébé. \nType: `Number`",
                                    "default": 1,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:scheduler": {
                            "description": "Initialise les événements de mob programmés pendant les événements de la journée. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "scheduled_events": {
                                    "description": "La liste des événements programmés. \nType: `Object[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "filters": {
                                                "description": "Les filtres qui déterminent si l'événement doit être déclenché. \nType: `Minecraft Filter`",
                                                ...commonSchemas.minecraft_filter
                                            },
                                            "event": {
                                                "description": "L'événement à déclencher. \nType: `String`",
                                                "type": "string"
                                            }
                                        }
                                    }
                                },
                                "min_delay_secs": {
                                    "description": "Le délai minimum en secondes avant qu'un événement programmé ne puisse être déclenché. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "max_delay_secs": {
                                    "description": "Le délai maximum en secondes avant qu'un événement programmé ne puisse être déclenché. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:shareables": {
                            "description": "Définit une liste d'items que le mob veut partager ou ramasser. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "all_items": {
                                    "description": "Définit si l'entité peut ramasser et/ou partager tous les items du jeu. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "all_items_max_amount": {
                                    "description": "Nombre maximum d'items que l'Entité tiendra. \nType: `Integer`",
                                    "default": -1,
                                    "type": "integer"
                                },
                                "all_items_surplus_amount": {
                                    "description": "Nombre d'items supplémentaires que l'Entité veut partager. \nType: `Integer`",
                                    "default": -1,
                                    "type": "integer"
                                },
                                "all_items_want_amount": {
                                    "description": "Nombre d'items que l'Entité veut partager. \nType: `Integer`",
                                    "default": -1,
                                    "type": "integer"
                                },
                                "items": {
                                    "description": "Liste des items que l'entité veut partager. \nType: `Object[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "admire": {
                                                "description": "Définit si l'entité admirera l'item après l'avoir ramassé en le regardant. \nType: `Boolean` \nNote: Pour que cela se produise, l'entité doit avoir un composant Admire et un objectif Admire.",
                                                "default": false,
                                                "type": "boolean"
                                            },
                                            "barter": {
                                                "description": "Définit si l'entité marchandera l'item après l'avoir ramassé. \nType: `Boolean` \nNote: Pour que cela se produise, l'entité doit avoir un composant Barter et un objectif Barter.",
                                                "default": false,
                                                "type": "boolean"
                                            },
                                            "consume_item": {
                                                "description": "Détermine si l'entité consommera l'item ou non. \nType: `Boolean`",
                                                "default": false,
                                                "type": "boolean"
                                            },
                                            "craft_into": {
                                                "description": "Définit l'item que l'entité veut fabriquer avec l'item défini par `item`. Devrait être un nom d'item. \nType: `String`",
                                                "type": "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                            },
                                            "item": {
                                                "description": "Le nom de l'item que l'entité veut partager. \nType: `String`",
                                                "type": "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                            },
                                            "max_amount": {
                                                "description": "Nombre maximum d'items que l'Entité tiendra. \nType: `Integer`",
                                                "type": "integer"
                                            },
                                            "pickup_limit": {
                                                "description": "Nombre maximum d'items que l'Entité peut ramasser. \nType: `Integer`",
                                                "type": "integer"
                                            },
                                            "pickup_only": {
                                                "description": "Détermine si l'entité peut seulement ramasser l'item et ne pas le laisser tomber. \nType: `Boolean`",
                                                "default": false,
                                                "type": "boolean"
                                            },
                                            "priority": {
                                                "description": "Priorise les items que l'entité préfère. 0 est la priorité la plus élevée. \nType: `Integer`",
                                                "type": "integer"
                                            },
                                            "singular_pickup": {
                                                "description": "Contrôle si l'entité peut ramasser plus d'un item à la fois. \nType: `Boolean`",
                                                "default": false,
                                                "type": "boolean"
                                            },
                                            "stored_in_inventory": {
                                                "description": "Détermine si l'entité essaiera de mettre l'item dans son inventaire si elle a le composant d'inventaire et si elle ne peut pas l'équiper. \nType: `Boolean`",
                                                "type": "boolean"
                                            },
                                            "surplus_amount": {
                                                "description": "Nombre d'items supplémentaires que l'Entité veut partager. \nType: `Integer`",
                                                "type": "integer"
                                            },
                                            "want_amount": {
                                                "description": "Nombre d'items que l'Entité veut partager. \nType: `Integer`",
                                                "type": "integer"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "minecraft:shooter": {
                            "description": "Définit le comportement de l'attaque à distance de l'entité. \nType: `Object` \nNote: Le composant 'minecraft:behavior.ranged_attack' utilise ce composant pour déterminer quels projectiles tirer.",
                            "type": "object",
                            "properties": {
                                "aux_val": {
                                    "description": "ID de l'effet de potion pour le projectile par défaut à appliquer lorsqu'il touche. \nType: `Integer`",
                                    "default": -1,
                                    "type": "integer"
                                },
                                "def": {
                                    "description": "Définit l'entité projectile à utiliser pour l'attaque à distance. \nType: `String` \nNote: L'entité doit avoir un composant 'minecraft:projectile'.",
                                    "type": "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.entity_ids
                                },
                                "magic": {
                                    "description": "Définit si les projectiles utilisés sont marqués comme magiques. Si défini, l'objectif d'attaque à distance ne sera pas utilisé en même temps que d'autres objectifs magiques, tels que minecraft:behavior.drink_potion. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "power": {
                                    "description": "Velocité à laquelle les projectiles sont tirés. \nType: `Number` \nNote: Une puissance de 0 sera écrasée par la puissance de lancer de projectile par défaut.",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "projectiles": {
                                    "description": "Liste des projectiles qui peuvent être utilisés par le tireur. Les projectiles sont évalués dans l'ordre de la liste ; après qu'un projectile soit choisi, le reste de la liste est ignoré. \nType: `String[]`",
                                    "type": "array",
                                    "items": {
                                        type: "object",
                                        properties: {
                                            def: {
                                                description: "L'entité projectile à utiliser pour l'attaque à distance. Note: L'entité doit avoir un composant `minecraft:projectile`.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.entity_ids
                                            },
                                            aux_val: {
                                                description: "ID de l'effet de potion pour le projectile par défaut à appliquer lorsqu'il touche.",
                                                default: -1,
                                                type: "integer"
                                            },
                                            filters: {
                                                description: "Les filtres qui déterminent si le projectile doit être utilisé. Si le filtre est évalué à false, le projectile est ignoré.",
                                                ...commonSchemas.minecraft_filter
                                            },
                                            lose_target: {
                                                type: "boolean"
                                            }
                                        }
                                    }
                                },
                                "sound": {
                                    "description": "Le son qui se joue lorsque le tireur tire un projectile. \nType: `String`",
                                    "type": "string"
                                }
                            }
                        },
                        "minecraft:sittable": {
                            "description": "Définit l'état assise de l'entité. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "sit_event": {
                                    "description": "Evénement à déclencher lorsque l'entité s'assoit. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "stand_event": {
                                    "description": "Evénement à déclencher lorsque l'entité se lève. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                }
                            }
                        },
                        "minecraft:skin_id": {
                            "description": "Définit l'ID du skin de l'entité. Peut être utilisé pour différencier les skins, comme les skins de base pour les villageois. \nType: `Object` _nNote: minecraft:skin_id nécessite plusieurs ensembles de textures pour être configuré pour l'entité.",
                            "type": "object",
                            "properties": {
                                "value": {
                                    "description": "L'ID du skin. Par convention, 0 est l'ID du skin de base. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:sound_volume": {
                            "description": "Définit le volume de base de l'Entité pour les effets sonores. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "value": {
                                    "description": "Le volume de base de l'Entité pour les effets sonores. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:spawn_entity": {
                            "description": "Ajoute un événement de spawn d'entité à l'entité. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "entities": {
                                    "description": "Une liste d'entités à faire apparaître. \nType: `Object[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "filters": {
                                                "description": "Si présent, l'entité spécifiée ne sera générée que si le filtre est évalué à true. \nType: `Minecraft Filter`",
                                                ...commonSchemas.minecraft_filter
                                            },
                                            "max_wait_time": {
                                                "description": "Le temps maximum aléatoire en secondes à attendre avant de générer l'entité. \nType: `Integer`",
                                                "default": 600,
                                                "type": "integer"
                                            },
                                            "min_wait_time": {
                                                "description": "Le temps minimum aléatoire en secondes à attendre avant de générer l'entité. \nType: `Integer`",
                                                "default": 300,
                                                "type": "integer"
                                            },
                                            "num_to_spawn": {
                                                "description": "Le nombre d'entités à générer. \nType: `Integer`",
                                                "default": 1,
                                                "type": "integer"
                                            },
                                            "should_leash": {
                                                "description": "Si vrai, l'entité générée sera attachée à l'entité parente. \nType: `Boolean`",
                                                "default": false,
                                                "type": "boolean"
                                            },
                                            "single_use": {
                                                "description": "Définit si ce composant ne fera apparaître l'entité spécifiée qu'une seule fois. \nType: `Boolean`",
                                                "default": false,
                                                "type": "boolean"
                                            },
                                            "spawn_entity": {
                                                "description": "Identifiant de l'entité à générer. Laisser vide pour générer l'item défini par 'spawn_item' à la place. \nType: `String`",
                                                "type": "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.entity_ids
                                            },
                                            "spawn_event": {
                                                "description": "L'événement à déclencher lorsque l'entité est générée. \nType: `EventTrigger`",
                                                "default": "minecraft:entity_born",
                                                oneOf: [
                                                    {
                                                        "type": "string"
                                                    },
                                                    commonSchemas.entity_event_trigger
                                                ]
                                            },
                                            "spawn_item": {
                                                "description": "Identifiant de l'item à générer. \nType: `String`",
                                                "default": "egg",
                                                "type": "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                            },
                                            "spawn_item_event": {
                                                "description": "L'événement à déclencher lorsque l'item est généré. \nType: `EventTrigger`",
                                                oneOf: [
                                                    {
                                                        type: "string"
                                                    },
                                                    commonSchemas.entity_event_trigger
                                                ]
                                            },
                                            "spawn_method": {
                                                "description": "La méthode à utiliser pour générer l'entité. \nType: `String`",
                                                "default": "born",
                                                "type": "string"
                                            },
                                            "spawn_sound": {
                                                "description": "Identifiant de l'effet sonore à jouer lorsque l'entité est générée. \nType: `String`",
                                                "default": "plop",
                                                "type": "string"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "minecraft:spell_effects": {
                            "description": "Permet à une entité d'ajouter ou de supprimer des effets de statut d'elle-même. \nType: `Object` \nNote: Ce composant fontionne une fois quand il est ajouté à l'Entité. Supprimer le composant n'aura aucun effet sur les effets actuels de l'entité.",
                            "type": "object",
                            "properties": {
                                "add_effects": {
                                    "description": "Définit les effets de statut à ajouter à l'entité. \nType: `Object[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "effect": {
                                                "description": "L'effet de statut à ajouter. \nType: `String`",
                                                "type": "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.effect_ids
                                            },
                                            "duration": {
                                                "description": "Le temps en secondes que l'effet doit durer. \nType: `Number | String`",
                                                "oneOf": [
                                                    {
                                                        "type": "number"
                                                    },
                                                    {
                                                        type: "string",
                                                        enum: ["infinite"]
                                                    }
                                                ]
                                            },
                                            "amplifier": {
                                                "description": "Le niveau de l'effet. \nType: `Integer`",
                                                "default": 0,
                                                "type": "integer"
                                            },
                                            "ambient": {
                                                "description": "Définit si les particules de l'effet sont ambiantes. \nType: `Boolean`",
                                                "default": false,
                                                "type": "boolean"
                                            },
                                            "visible": {
                                                "description": "Définit si les particules sont visibles. \nType: `Boolean`",
                                                "default": true,
                                                "type": "boolean"
                                            },
                                            "display_on_screen_animation": {
                                                "description": "Définit si l'effet doit être affiché en tant qu'animation à l'écran. \nType: `Boolean`",
                                                "default": false,
                                                "type": "boolean"
                                            }
                                        }
                                    }
                                },
                                "remove_effects": {
                                    "description": "Définit les effets de statut à supprimer de l'entité. \nType: `String | String[]`",
                                    "oneOf": [
                                        {
                                            "type": "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.effect_ids
                                        },
                                        {
                                            "type": "array",
                                            "items": {
                                                "type": "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.effect_ids
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        "minecraft:strength": {
                            "description": "Définit la capacité de l'entité à infliger des dégâts. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "max": {
                                    "description": "La force maximale de l'entité. \nType: `Integer`",
                                    "default": 5,
                                    "type": "integer"
                                },
                                "value": {
                                    "description": "La valeur de la force de l'entité. \nType: `Integer`",
                                    "default": 1,
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:suspect_tracking": {
                            "description": "Permet à l'entité de se souvenir des emplacements suspects. \nType: `Object`",
                            "type": "object"
                        },
                        "minecraft:tameable": {
                            "description": "Définit les règles pour qu'une Entité soit apprivoisée par le joueur. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "probability": {
                                    "description": "La chance d'apprivoiser l'entité avec chaque utilisation d'item entre 0.0 et 1.0, où 1.0 est 100%. \nType: `Number`",
                                    "default": 1,
                                    "type": "number"
                                },
                                "tame_event": {
                                    "description": "L'événement à déclencher lorsque l'entité est apprivoisée. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "tame_items": {
                                    "description":"La liste des items qui peuvent être utilisés pour apprivoiser l'entité. \nType: `String | String[]`",
                                    "oneOf": [
                                        {
                                            "type": "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                        },
                                        {
                                            "type": "array",
                                            "items": {
                                                "type": "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        "minecraft:tamemount": {
                            "description": "Définit les règles pour qu'une Entité soit apprivoisée par le joueur en montant dessus. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "attempt_temper_mod": {
                                    "description": "Le degré d'augmentation du tempérament de l'entité lorsqu'elle est montée. \nType: `Integer`",
                                    "default": 5,
                                    "type": "integer"
                                },
                                "autoRejectItems": {
                                    "description": "La liste des items qui, quand le le joueur intéragit avec l'Entité, l'enervera. \nType: `Object[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "item": {
                                                "description": "L'item qui énervera l'entité. \nType: `String`",
                                                "type": "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                            }
                                        }
                                    }
                                },
                                "feed_items": {
                                    "description": "La liste des objets qui peuvent être utilisés pour augmenter le tempérament de l'entité et accélérer le processus d'apprivoisement. \nType: `Object[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "item": {
                                                "description": "L'item qui peut être utilisé pour nourrir l'entité. \nType: `String`",
                                                "type": "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                            }
                                        }
                                    }
                                },
                                "feed_text": {
                                    "description":
                                    "**ℹ️ Texte traduisable**\n\n" +
                                    "Le texte à afficher lorsqu'un joueur peut nourrir l'entité.",
                                    "type": "string"
                                },
                                "max_temper": {
                                    "description": "La valeur maximale pour le tempérament de l'entité. \nType: `Integer`",
                                    "default": 100,
                                    "type": "integer"
                                },
                                "min_temper": {
                                    "description": "La valeur minimale pour le tempérament de l'entité. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "ride_text": {
                                    "description":
                                    "**ℹ️ Texte traduisable**\n\n" +
                                    "Le texte à afficher lorsqu'un joueur peut monter l'entité.",
                                    "type": "string"
                                },
                                "tame_event": {
                                    "description": "L'événement à déclencher lorsque l'entité est apprivoisée. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                }
                            }
                        },
                        "minecraft:target_nearby_sensor": {
                            "description": "Définit la plage de l'entité dans laquelle elle peut voir ou détecter d'autres entités pour les cibler. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "inside_range": {
                                    "description": "La distance maximale en blocs à laquelle une autre entité sera considérée dans la plage 'inside'. \nType: `Number`",
                                    "default": 1,
                                    "type": "number"
                                },
                                "must_see": {
                                    "description": "Si c'est vrai, l'entité doit être visible pour être considérée dans la plage 'inside'. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "on_inside_range": {
                                    "description": "Evénement à déclencher lorsque l'entité est dans la plage 'inside'. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "on_outside_range": {
                                    "description": "Evénement à déclencher lorsque l'entité est dans la plage 'outside'. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "on_vision_lost_inside_range": {
                                    "description": "Evénement à déclencher lorsque l'entité est dans la plage 'inside' et perd la vision de la cible. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "outside_range": {
                                    "description": "La distance maximale en blocs à laquelle une autre entité sera considérée dans la plage 'outside'. \nType: `Number`",
                                    "default": 5,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:teleport": {
                            "description": "Définit les règles pour que l'entité se téléporte. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "dark_teleport_chance": {
                                    "description": "Modifie la chance que l'entité se téléporte si elle est dans l'obscurité. \nType: `Number`",
                                    "default": 0.01,
                                    "type": "number"
                                },
                                "light_teleport_chance": {
                                    "description": "Modifie la chance que l'entité se téléporte si elle est en plein jour. \nType: `Number`",
                                    "default": 0.01,
                                    "type": "number"
                                },
                                "max_random_teleport_time": {
                                    "description": "Temps maximum en secondes entre les téléportations aléatoires. \nType: `Number`",
                                    "default": 20,
                                    "type": "number"
                                },
                                "min_random_teleport_time": {
                                    "description": "Temps minimum en secondes entre les téléportations aléatoires. \nType: `Number`",
                                    "default": 0,
                                    "type": "number"
                                },
                                "random_teleport_cube": {
                                    "description": "Définit la zone dans laquelle l'entité se téléportera aléatoirement. \nType: `Number[3]`",
                                    "default": [32, 16, 32],
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "random_teleports": {
                                    "description": "Définit si l'entité se téléportera aléatoirement. \nType: `Boolean`",
                                    "default": true
                                },
                                "target_distance": {
                                    "description": "La distance maximale à laquelle l'entité se téléportera pour suivre sa cible. \nType: `Number`",
                                    "default": 16,
                                    "type": "number"
                                },
                                "target_teleport_chance": {
                                    "description": "La chance que l'entité se téléporte pour suivre sa cible. \nType: `Number`",
                                    "default": 1,
                                    "type": "number",
                                    "minimum": 0.0,
                                    "maximum": 1.0
                                }
                            }
                        },
                        "minecraft:tick_world": {
                            "description": "Définit si l'Entité met à jour le monde autour d'elle. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "distance_to_players": {
                                    "description": "La distance minimale à laquelle un joueur doit être pour que l'entité mette à jour le monde autour d'elle. \nType: `Number`",
                                    "default": 128,
                                    "type": "number",
                                    "minimum": 128
                                },
                                "never_despawn": {
                                    "description": "Si vrai, l'entité ne disparaîtra pas même si les joueurs sont loin. Si faux, distance_to_players sera utilisé pour déterminer quand disparaître. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "radius": {
                                    "description": "La zone autour de l'entité à mettre à jour. \nType: `Integer`",
                                    "default": 2,
                                    "type": "integer",
                                    "minimum": 2,
                                    "maximum": 6
                                }
                            }
                        },
                        "minecraft:timer": {
                            "description": "Définit un minuteur après lequel un événement se déclenchera. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "looping": {
                                    "description": "Si vrai, le minuteur redémarrera chaque fois qu'il se déclenche. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "randomInterval": {
                                    "description": "Si vrai, la durée du minuteur sera aléatoire entre les valeurs min et max spécifiées dans time. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "random_time_choices": {
                                    "description": "Une liste d'objets, représentant une valeur en secondes qui peut être choisie avant de déclencher l'événement et un poids optionnel. Incompatible avec time. \nType: `Object[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "weight": {
                                                "description": "Le poids de la valeur. \nType: `Number`",
                                                "type": "number"
                                            },
                                            "value": {
                                                "description": "La valeur en secondes. \nType: `Number`",
                                                "type": "number"
                                            }
                                        }
                                    }
                                },
                                "time": {
                                    "description": "La durée en secondes avant que l'événement ne se déclenche. Peut être spécifié comme un nombre ou une paire de nombres (min et max). Incompatible avec random_time_choices. \nType: `Number | Number[]`",
                                    "default": [0.0, 0.0],
                                    "oneOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "array",
                                            "minItems": 2,
                                            "maxItems": 2,
                                            "items": {
                                                "type": "number"
                                            }
                                        }
                                    ]
                                },
                                "time_down_event": {
                                    "description": "Contient l'événement à déclencher. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                }
                            }
                        },
                        "minecraft:trade_resupply": {
                            "description": "Réapprovisionne le commerce de l'entité. \nType: `Object`",
                            "type": "object"
                        },
                        "minecraft:trade_table": {
                            "description": "Définit la capacité de l'entité à commercer avec les joueurs. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "convert_trades_economy": {
                                    "description": "Détermine quand l'entité se transforme, si les échanges doivent être convertis lorsque la nouvelle entité a une table de commerce économique. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "display_name": {
                                    "description":
                                    "**ℹ️ Texte traduisable**\n\n" +
                                    "Le nom à afficher lors du commerce avec cette entité.",
                                    "type": "string"
                                },
                                "new_screen": {
                                    "description": "Détermine si le commerce s'ouvre avec le nouvel écran de commerce. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "persist_trades": {
                                    "description": "Détermine si les échanges doivent persister lorsque l'entité se transforme. Cela fait en sorte que la prochaine fois que l'entité se transforme en quelque chose avec une table de commerce ou une table de commerce économique, elle conserve ses échanges. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "table": {
                                    "description": "Chemin de la Trade Table à utiliser pour les échanges.",
                                    "type": "string",
                                    pattern: schemaPatterns.trading_file,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.trading_file_paths
                                }
                            }
                        },
                        "minecraft:trail": {
                            "description": "Oblige une entité à laisser une traînée de blocs lorsqu'elle se déplace dans le monde.",
                            "type": "object",
                            "properties": {
                                "block_type": {
                                    "description": "Le type de bloc que vous souhaitez voir apparaître lorsque l'entité se déplace dans le monde. Les blocs solides ne peuvent pas apparaître avec un décalage de (0,0,0).",
                                    "default": "air",
                                    "type": "string"
                                },
                                "spawn_filter": {
                                    "description": "Un ou plusieurs filtres qui doivent être remplis pour que le type de bloc choisi apparaisse. \nType: `Minecraft Filter`",
                                    ...commonSchemas.minecraft_filter
                                },
                                "spawn_offset": {
                                    "description": "La distance entre la position actuelle de l'entité et l'apparition du bloc. Limité à 16 blocs. La valeur X est gauche/droite (-/+), la valeur Z est en arrière/en avant (-/+), la valeur Y est en dessous/au-dessus (-/+). \nType: `Number[3]`",
                                    "default": [0, 0, 0],
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number"
                                    }
                                }
                            }
                        },
                        "minecraft:transformation": {
                            "description": "Définit une transformation d'une entité à une autre. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "add": {
                                    "description": "Liste des groupes de composants à ajouter à l'entité après la transformation. \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "component_groups": {
                                            "description": "Liste des groupes de composants à ajouter à l'entité après la transformation. \nType: `String[]`",
                                            "type": "array",
                                            "items": {
                                                "type": "string"
                                            }
                                        }
                                    }
                                },
                                "begin_transform_sound": {
                                    "description": "Le son qui se joue lorsque l'entité commence à se transformer. \nType: `String`",
                                    "type": "string"
                                },
                                "drop_equipment": {
                                    "description": "Détermine si l'entité doit laisser tomber tout son équipement lorsqu'elle se transforme. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "drop_inventory": {
                                    "description": "Détermine si l'entité doit laisser tomber tous les items de son inventaire lorsqu'elle se transforme. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "into": {
                                    "description": "L'identifiant de l'entité dans laquelle l'entité se transformera. \nType: `String`",
                                    "type": "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.entity_ids
                                },
                                "keep_level": {
                                    "description": "Si l'entité a des échanges et a monté de niveau, elle doit conserver ce niveau après la transformation. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "keep_owner": {
                                    "description": "Si l'entité appartient par une autre entité, elle doit appartenir après la transformation. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "preserve_equipment": {
                                    "description": "Définit si l'entité doit conserver son équipement après la transformation. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "transformation_sound": {
                                    "description": "Le son qui se joue lorsque l'entité se transforme. \nType: `String`",
                                    "type": "string"
                                },
                                "delay": {
                                    "description": "Définit les propriétés du délai pour la transformation. \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "block_assist_chance": {
                                            "description": "Chance que l'entité cherche des blocs à proximité qui peuvent accélérer la transformation. La valeur doit être comprise entre 0,0 et 1,0. \nType: `Number`",
                                            "default": 0.0,
                                            "type": "number",
                                            "minimum": 0.0,
                                            "maximum": 1.0
                                        },
                                        "block_chance": {
                                            "description": "Chance que, une fois un bloc trouvé, l'entité accélère la transformation. \nType: `Number`",
                                            "default": 0.0,
                                            "type": "number"
                                        },
                                        "block_max": {
                                            "description": "Nombre maximum de blocs que l'entité cherchera pour aider à la transformation. Si non défini ou défini à 0, il sera défini sur le rayon de blocs. \nType: `Integer`",
                                            "default": 0,
                                            "type": "integer"
                                        },
                                        "block_radius": {
                                            "description": "Distance en blocs que l'entité cherchera des blocs qui peuvent aider à la transformation. \nType: `Integer`",
                                            "default": 0,
                                            "type": "integer"
                                        },
                                        "block_types": {
                                            "description": "Liste des blocs qui peuvent aider à la transformation. \nType: `String[]`",
                                            "type": "array",
                                            "items": {
                                                "type": "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                            }
                                        },
                                        "range_max": {
                                            "description": "Temps maximum en secondes à ajouter pour avoir le temps aléatoire maximum jusqu'à ce que l'entité se transforme (si non nul, le temps en secondes avant que l'entité se transforme sera un décimal aléatoire entre 'valeur+range_min' et 'valeur+range_max'). \nType: `Number`",
                                            "default": 0,
                                            "type": "number"
                                        },
                                        "range_min": {
                                            "description": "Temps minimum en secondes à ajouter pour avoir le temps aléatoire minimum jusqu'à ce que l'entité se transforme (si non nul, le temps en secondes avant que l'entité se transforme sera un décimal aléatoire entre 'valeur+range_min' et 'valeur+range_max'). \nType: `Number`",
                                            "default": 0,
                                            "type": "number"
                                        },
                                        "value": {
                                            "description": "Temps en secondes avant que l'entité se transforme. \nType: `Number`",
                                            "default": 0,
                                            "type": "number"
                                        }
                                    }
                                }
                            }
                        },
                        "minecraft:transient": {
                            "description": "Définit que l'Entité ne doit jamais persister et disparaîtra pour toujours lorsqu'elle n'est plus chargée. \nType: `Object`",
                            "type": "object"
                        },
                        "minecraft:trust": {
                            "description": "Force l'entité à faire confiance à un ou plusieurs joueurs. \nType: `Object`",
                            "type": "object"
                        },
                        "minecraft:trusting": {
                            "description": "Définit les règles pour qu'une entité fasse confiance à un joueur. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "probability": {
                                    "description": "La chance de l'entité de faire confiance à chaque utilisation d'item entre 0.0 et 1.0, où 1.0 est 100%. \nType: `Number`",
                                    "default": 1.00,
                                    "type": "number",
                                    "minimum": 0.0,
                                    "maximum": 1.0
                                },
                                "trust_event": {
                                    "description": "L'événement à déclencher lorsque l'entité fait confiance au joueur. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "trust_items": {
                                    "description": "La liste des items qui peuvent être utilisés pour gagner la confiance de l'entité. \nType: `String[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                    }
                                }
                            }
                        },
                        "minecraft:type_family": {
                            "description": "Définit les familles auxquelles appartient l'entité. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "family": {
                                    "description": "Liste des familles auxquelles appartient l'entité. \nType: `String[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.entity_family_ids
                                    }
                                }
                            }
                        },
                        "minecraft:underwater_movement": {
                            "description": "Définit la vitesse à laquelle une entité peut se déplacer dans l'eau. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "value": {
                                    "description": "La vitesse à laquelle l'entité peut se déplacer dans l'eau. \nType: `Number`",
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:variable_max_auto_step": {
                            "description": "Permet aux entités d'avoir une hauteur de marche automatique maximale qui est différente en fonction de si elles sont sur un bloc qui empêche de sauter. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "base_value": {
                                    "description": "La hauteur maximale de l'auto-pas lorsqu'il est sur un bloc qui empêche de sauter. \nType: `Number`",
                                    "default": 0.5625,
                                    "type": "number"
                                },
                                "controlled_value": {
                                    "description": "La hauteur maximale de l'auto-pas lorsqu'il est sur un autre bloc et contrôlé par le joueur. \nType: `Number`",
                                    "default": 0.5625,
                                    "type": "number"
                                },
                                "jump_prevented_value": {
                                    "description": "La hauteur maximale de l'auto-pas lorsqu'il est sur un bloc qui empêche de sauter. \nType: `Number`",
                                    "default": 0.5625,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:variant": {
                            "description": "Utilisé pour différencier le groupe de composants d'une variante d'une entité des autres, comme ocelot, villageois et cheval. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "value": {
                                    "description": "L'ID de la variante. Par convention, 0 est l'ID de l'entité de base. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:vibration_damper": {
                            "description": "Définit que les vibrations émises par cette entité seront ignorées. \nType: `Object`",
                            "type": "object"
                        },
                        "minecraft:vibration_listener": {
                            "description": "Permet à l'entité d'écouter les événements de vibration. Il s'agit d'un composant largement interne, pris en charge uniquement sur les entités Warden et Allay. \nType: `Object`",
                            "type": "object"
                        },
                        "minecraft:walk_animation_speed": {
                            "description": "Définit le multiplicateur de vitesse pour la vitesse de l'animation de marche de cette entité. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "value": {
                                    "description": "Plus le nombre est élevé, plus l'animation de marche est rapide. Une valeur de 1,0 signifie une vitesse normale, tandis que 2,0 signifie deux fois plus vite. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:wants_jockey": {
                            "description": "Définit si cette entité veut devenir un jockey. \nType: `Object`",
                            "type": "object"
                        },
                        "minecraft:water_movement": {
                            "description": "Définit la vitesse à laquelle une entité peut se déplacer dans l'eau. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "drag_factor": {
                                    "description": "Le facteur de traînée pour déterminer la vitesse de déplacement lorsqu'il est dans l'eau. \nType: `Number`",
                                    "default": 0.8,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.admire_item": {
                            "description": "Fait en sorte qu'une entité admire un objet qu'elle tient. \nType: `Object` \nNote: Ce composant nécessite que le composant minecraft:admire_item soit défini dans la définition de l'entité.",
                            "type": "object",
                            "properties": {
                                "admire_item_sound": {
                                    "description": "L'événement sonore à jouer lorsque l'entité admire l'objet. \nType: `String`",
                                    "type": "string"
                                },
                                "sound_interval": {
                                    "description": "La plage de temps en secondes pour attendre avant de jouer le son à nouveau. \nType: `Number | Object`",
                                    "default": 0,
                                    "oneOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "object",
                                            "properties": {
                                                "range_min": {
                                                    "description": "La valeur minimale de la plage de temps en secondes. \nType: `Number`",
                                                    "type": "number"
                                                },
                                                "range_max": {
                                                    "description": "La valeur maximale de la plage de temps en secondes. \nType: `Number`",
                                                    "type": "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "on_admire_item_start": {
                                    "description": "L'événement à déclencher lorsque l'entité commence à admirer l'item. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "on_admire_item_stop": {
                                    "description": "L'événement à déclencher lorsque l'entité arrête d'admirer l'item. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.avoid_block": {
                            "description": "Fait en sorte qu'une entité évite certains blocs. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "avoid_block_sound": {
                                    "description": "L'événement sonore à jouer lorsque l'entité évite un bloc. \nType: `String`",
                                    "type": "string"
                                },
                                "on_escape": {
                                    "description": "L'événement à déclencher lorsque l'entité évite un bloc. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "search_height": {
                                    "description": "La hauteur maximale à laquelle l'entité cherchera un bloc à éviter. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "search_range": {
                                    "description": "La distance horizontale maximale à laquelle l'entité cherchera un bloc à éviter. \nType: `Number`",
                                    "default": 0,
                                    "type": "number"
                                },
                                "sound_interval": {
                                    "description": "La plage de temps en secondes pour attendre avant de jouer le son à nouveau. \nType: `Object`",
                                    "default": {
                                        "range_min": 3.0,
                                        "range_max": 8.0
                                    },
                                    "type": "object",
                                    "properties": {
                                        "range_max": {
                                            "description": "La valeur maximale de la plage de temps en secondes. \nType: `Number`",
                                            "type": "number"
                                        },
                                        "range_min": {
                                            "description": "La valeur minimale de la plage de temps en secondes. \nType: `Number`",
                                            "type": "number"
                                        }
                                    }
                                },
                                "sprint_speed_modifier": {
                                    "description": "Modificateur de vitesse de sprint. 1,0 signifie conserver la vitesse normale, tandis que des nombres plus élevés accélèrent la vitesse de sprint. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "target_blocks": {
                                    "description": "Liste des blocs à éviter. \nType: `String[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                    }
                                },
                                "target_selection_method": {
                                    "description": "La méthode de recherche de blocs à éviter. \nType: `String`",
                                    "default": "nearest",
                                    "type": "string"
                                },
                                "tick_interval": {
                                    "description": "Le nombre de ticks entre chaque recherche de blocs à éviter. \nType: `Integer`",
                                    "default": 1,
                                    "type": "integer"
                                },
                                "walk_speed_modifier": {
                                    "description": "Modificateur de vitesse de marche. 1,0 signifie conserver la vitesse normale, tandis que des nombres plus élevés accélèrent la vitesse de marche. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.avoid_mob_type": {
                            "description": "Force l'Entité à fuir d'autres entités spécifiques. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "avoid_mob_sound": {
                                    "description": "Le son à jouer lorsque l'entité évite une autre entité. \nType: `String`",
                                    "type": "string"
                                },
                                "avoid_target_xz": {
                                    "description": "La distance horizontale à laquelle l'entité doit s'éloigner de l'autre entité. \nType: `Integer",
                                    "default": 16,
                                    "type": "integer"
                                },
                                "avoid_target_y": {
                                    "description": "La distance verticale à laquelle l'entité doit s'éloigner de l'autre entité. \nType: `Integer`",
                                    "default": 7,
                                    "type": "integer"
                                },
                                "entity_types": {
                                    "description": "La liste des types d'entités à éviter. \nType: `Object[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "filters": {
                                                "description": "Les filtres à appliquer pour sélectionner les entités à éviter. \nType: `Minecraft Filter`",
                                                ...commonSchemas.minecraft_filter
                                            },
                                            "avoid_mob_sound": {
                                                "$ref": "#/properties/minecraft:entity/properties/components/properties/minecraft:behavior.avoid_mob_type/properties/avoid_mob_sound"
                                            },
                                            "avoid_target_xz": {
                                                "$ref": "#/properties/minecraft:entity/properties/components/properties/minecraft:behavior.avoid_mob_type/properties/avoid_target_xz"
                                            },
                                            "avoid_target_y": {
                                                "$ref": "#/properties/minecraft:entity/properties/components/properties/minecraft:behavior.avoid_mob_type/properties/avoid_target_y"
                                            },
                                            "ignore_visibility": {
                                                "$ref": "#/properties/minecraft:entity/properties/components/properties/minecraft:behavior.avoid_mob_type/properties/ignore_visibility"
                                            },
                                            "max_dist": {
                                                "$ref": "#/properties/minecraft:entity/properties/components/properties/minecraft:behavior.avoid_mob_type/properties/max_dist"
                                            },
                                            "max_flee": {
                                                "$ref": "#/properties/minecraft:entity/properties/components/properties/minecraft:behavior.avoid_mob_type/properties/max_flee"
                                            },
                                            "on_escape_event": {
                                                "$ref": "#/properties/minecraft:entity/properties/components/properties/minecraft:behavior.avoid_mob_type/properties/on_escape_event"
                                            },
                                            "priority": {
                                                "$ref": "#/properties/minecraft:entity/properties/components/properties/minecraft:behavior.avoid_mob_type/properties/priority"
                                            },
                                            "probability_per_strength": {
                                                "$ref": "#/properties/minecraft:entity/properties/components/properties/minecraft:behavior.avoid_mob_type/properties/probability_per_strength"
                                            },
                                            "remove_target": {
                                                "$ref": "#/properties/minecraft:entity/properties/components/properties/minecraft:behavior.avoid_mob_type/properties/remove_target"
                                            },
                                            "sound_interval": {
                                                "$ref": "#/properties/minecraft:entity/properties/components/properties/minecraft:behavior.avoid_mob_type/properties/sound_interval"
                                            },
                                            "sprint_distance": {
                                                "$ref": "#/properties/minecraft:entity/properties/components/properties/minecraft:behavior.avoid_mob_type/properties/sprint_distance"
                                            },
                                            "sprint_speed_multiplier": {
                                                "$ref": "#/properties/minecraft:entity/properties/components/properties/minecraft:behavior.avoid_mob_type/properties/sprint_speed_multiplier"
                                            },
                                            "walk_speed_multiplier": {
                                                "$ref": "#/properties/minecraft:entity/properties/components/properties/minecraft:behavior.avoid_mob_type/properties/walk_speed_multiplier"
                                            }
                                        }
                                    }
                                },
                                "ignore_visibility": {
                                    "description": "Ignorer ou non la ligne de vue directe pendant que cette entité s'enfuit d'autres entités spécifiées. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "max_dist": {
                                    "description": "Distance maximale à parcourir pour rechercher une cible à éviter pour l'entité.. \nType: `Number`",
                                    "default": 3.0,
                                    "type": "number"
                                },
                                "max_flee": {
                                    "description": "À combien de blocs de sa cible à éviter l'entité doit-elle se trouver pour qu'elle cesse de fuir la cible à éviter. \nType: `Number`",
                                    "default": 10.0,
                                    "type": "number" 
                                },
                                "on_escape_event": {
                                    "description": "L'événement à déclencher lorsque l'entité évite une autre entité. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "probability_per_strength": {
                                    "description": "Pourcentage de chance que cette entité arrête d'éviter une autre entité basée sur la force de cette entité, où 1,0 = 100%. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number",
                                    "minimum": 0.0,
                                    "maximum": 1.0
                                },
                                "remove_target": {
                                    "description": "Détermine si nous devons supprimer la cible lors de la fuite ou non. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "sound_interval": {
                                    "description": "La plage de temps en secondes pour attendre avant de jouer le son à nouveau. \nType: `Object`",
                                    "default": {
                                        "range_min": 3.0,
                                        "range_max": 8.0
                                    },
                                    "type": "object",
                                    "properties": {
                                        "range_max": {
                                            "description": "La valeur maximale de la plage de temps en secondes. \nType: `Number`",
                                            "type": "number"
                                        },
                                        "range_min": {
                                            "description": "La valeur minimale de la plage de temps en secondes. \nType: `Number`",
                                            "type": "number"
                                        }
                                    }
                                },
                                "sprint_distance": {
                                    "description": "Combien de blocs doivent se trouver à portée de sa cible à éviter l'entité pour qu'elle commence à sprinter loin de la cible à éviter. \nType: `Number`",
                                    "default": 7.0,
                                    "type": "number"
                                },
                                "sprint_speed_multiplier": {
                                    "description": "Multiplicateur de vitesse de sprint. 1,0 signifie conserver la vitesse normale, tandis que des nombres plus élevés accélèrent la vitesse de sprint. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "walk_speed_multiplier": {
                                    "description": "Multiplicateur de vitesse de marche. 1,0 signifie conserver la vitesse normale, tandis que des nombres plus élevés accélèrent la vitesse de marche. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.barter": {
                            "description": "Fait en sorte qu'une entité laisse tomber un item en retour après qu'un joueur ait offert un échange en déposant un objet spécifique près de l'entité. \nType: `Object` \nNote: Ce composant nécessite que le composant minecraft:barter soit défini dans la définition de l'entité.",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.beg": {
                            "description": "Permet à l'Entité de regarder et de suivre le joueur qui tient de la nourriture qu'elle aime. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "items": {
                                    "description": "La liste des items que l'entité aime. \nType: `String[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                    }
                                },
                                "look_distance": {
                                    "description": "La distance à laquelle l'entité peut regarder le joueur qui tient l'item qu'elle aime. \nType: `Number`",
                                    "default": 8.0,
                                    "type": "number"
                                },
                                "look_time": {
                                    "description": "La plage de temps en secondes que l'entité regardera le joueur qui tient l'item qu'elle aime. \nType: `Object`",
                                    "default": {
                                        "range_min": 2,
                                        "range_max": 4
                                    },
                                    "type": "object",
                                    "properties": {
                                        "range_max": {
                                            "description": "La valeur maximale de la plage de temps en secondes. \nType: `Number`",
                                            "type": "number"
                                        },
                                        "range_min": {
                                            "description": "La valeur minimale de la plage de temps en secondes. \nType: `Number`",
                                            "type": "number"
                                        }
                                    }
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.break_door": {
                            "description": "Fait en sorte qu'une entité casse une porte. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.breed": {
                            "description": "Permet à l'entité de se reproduire avec d'autres entités de la même espèce. \nType: `Object` \nNécessite que le composant minecraft:breedable soit défini dans la définition de l'entité.",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Multiplicateur de mouvement de vitesse de l'Entité quand elle utilise cet objectif AI. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.celebrate": {
                            "description": "Fait en sorte qu'une entité célèbre en faisant des sons de célébration et en sautant. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "celebration_sound": {
                                    "description": "L'événement sonore à jouer lorsque l'entité célèbre. \nType: `String`",
                                    "type": "string"
                                },
                                "duration": {
                                    "description": "La durée en secondes pendant laquelle l'entité célèbre. \nType: `Number`",
                                    "default": 30.0,
                                    "type": "number"
                                },
                                "jump_interval": {
                                    "description": "La plage de temps en secondes entre les sauts de l'entité. \nType: `Object`",
                                    "default": {
                                        "range_min": 1.0,
                                        "range_max": 3.5
                                    },
                                    "type": "object",
                                    "properties": {
                                        "range_max": {
                                            "description": "La valeur maximale de la plage de temps en secondes. \nType: `Number`",
                                            "type": "number"
                                        },
                                        "range_min": {
                                            "description": "La valeur minimale de la plage de temps en secondes. \nType: `Number`",
                                            "type": "number"
                                        }
                                    }
                                },
                                "on_celebration_end_event": {
                                    "description": "L'événement à déclencher lorsque l'entité arrête de célébrer. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "sound_interval": {
                                    "description": "La plage de temps en secondes pour attendre avant de jouer le son à nouveau. \nType: `Object`",
                                    "default": {
                                        "range_min": 2,
                                        "range_max": 7
                                    },
                                    "type": "object",
                                    "properties": {
                                        "range_max": {
                                            "description": "La valeur maximale de la plage de temps en secondes. \nType: `Number`",
                                            "type": "number"
                                        },
                                        "range_min": {
                                            "description": "La valeur minimale de la plage de temps en secondes. \nType: `Number`",
                                            "type": "number"
                                        }
                                    }
                                }
                            }
                        },
                        "minecraft:behavior.celebrate_survive": {
                            "description": "Fait en sorte que l'Entité célèbre sa survie après un raid en tirant des feux d'artifice. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "duration": {
                                    "description": "La durée en secondes pendant laquelle l'entité célèbre. \nType: `Number`",
                                    "default": 30.0,
                                    "type": "number"
                                },
                                "fireworks_interval": {
                                    "description": "La plage de temps en secondes entre les tirs de feux d'artifice. \nType: `Object`",
                                    "default": {
                                        "range_min": 10,
                                        "range_max": 20
                                    },
                                    "type": "object",
                                    "properties": {
                                        "range_max": {
                                            "description": "La valeur maximale de la plage de temps en secondes. \nType: `Number`",
                                            "type": "number"
                                        },
                                        "range_min": {
                                            "description": "La valeur minimale de la plage de temps en secondes. \nType: `Number`",
                                            "type": "number"
                                        }
                                    }
                                },
                                "on_celebration_end_event": {
                                    "description": "L'événement à déclencher lorsque l'entité arrête de célébrer. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.charge_attack": {
                            "description": "Force l'Entité à attaquer sa cible avec une attaque de charge. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "max_distance": {
                                    "description": "L'attaque de charge ne peut pas commencer si l'entité est plus loin que cette distance de la cible. \nType: `Number`",
                                    "default": 3,
                                    "type": "number"
                                },
                                "min_distance": {
                                    "description": "L'attaque de charge ne peut pas commencer si l'entité est plus proche que cette distance de la cible. \nType: `Number`",
                                    "default": 2,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Multiplicateur de vitesse de mouvement de l'entité lorsqu'elle utilise cet objectif AI. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "success_rate": {
                                    "description": "Pourcentage de chance que cette entité commence une attaque de charge, si elle n'attaque pas déjà, où 1,0 = 100%. \nType: `Number`",
                                    "default": 0.1428,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.charge_held_item": {
                            "description": "Force l'Entité à charger et à utiliser l'item qu'elle tient. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "items": {
                                    "description": "Liste des items qui peuvent être utilisés pour charger l'item tenu par l'entité. \nType: `String[]`",
                                    "type": "array",
                                    "minItems": 1,
                                    "items": {
                                        "type": "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                    }
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.circle_around_anchor": {
                            "description": "Force l'Entité à tourner autour d'un point d'ancrage placé près d'un point ou d'une cible. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "angle_change": {
                                    "description": "Nombre de degrés à changer pour l'orientation de l'entité lorsqu'elle sélectionne son prochain point d'ancrage. \nType: `Number`",
                                    "default": 15.0,
                                    "type": "number"
                                },
                                "goal_radius": {
                                    "description": "Distance maximale de l'entité par rapport à son point d'ancrage. Ceci est pour empêcher l'entité de tourner autour de son point d'ancrage. \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number"
                                },
                                "height_above_target_range": {
                                    "description": "Le nombre de blocs au-dessus de la cible que le prochain point d'ancrage peut être défini. Cette valeur est utilisée uniquement lorsque l'entité suit une cible. \nType: `Number[2]`",
                                    "default": [0.0, 0.0],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "height_adjustment_chance": {
                                    "description": "Pourcentage de chance de déterminer à quelle fréquence augmenter ou diminuer la hauteur actuelle autour du point d'ancrage. 1 = 100%. \nType: `Number` \nNote: La propriété suivante est obsolète `height_change_chance` a été remplacé par `height_adjustment_chance`.",
                                    "default": 0.002857,
                                    "type": "number"
                                },
                                "height_offset_range": {
                                    "description": "Distance verticale de l'entité par rapport à son point d'ancrage. \nType: `Number[2]`",
                                    "default": [0.0, 0.0],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "radius_adjustment_chance": {
                                    "description": "Pourcentage de chance de déterminer à quelle fréquence augmenter la taille du rayon de mouvement actuel autour du point d'ancrage. 1 = 100%. \nType: `Number` \nNote: La propriété suivante est obsolète `radius_change_chance` a été remplacé par `radius_adjustment_chance`.",
                                    "default": 0.004,
                                    "type": "number"
                                },
                                "radius_change": {
                                    "description": "Le nombre de blocs à augmenter le rayon de mouvement actuel autour du point d'ancrage lorsqu'il est sélectionné. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "radius_range": {
                                    "description": "Distance horizontale maximale de l'entité par rapport à son point d'ancrage. \nType: `Number[2]`",
                                    "default": [5.0, 15.0],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "speed_multiplier": {
                                    "description": "Multiplicateur de vitesse de mouvement de l'entité lorsqu'elle utilise cet objectif AI. \nType: `Number`",
                                    "type": "number",
                                    "default": 1.0
                                }
                            }
                        },
                        "minecraft:behavior.controlled_by_player": {
                            "description": "Force à l'Entité d'être contrôlée par le joueur en utilisant un item dans la propriété item_controllable. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "fractional_rotation": {
                                    "description": "L'Entité tentera de tourner pour faire face à l'endroit où le joueur se trouve chaque tick. L'Entité ciblera ce pourcentage de leur différence dans leurs angles de rotation actuels chaque tick (de 0.0 à 1.0 où 1.0 = 100%). Ceci est limité par FractionalRotationLimit. Une valeur de 0.0 fera en sorte que l'entité ne tourne plus là où le joueur se trouve. \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number"
                                },
                                "fractional_rotation_limit": {
                                    "description": "Limite le nombre total de degrés que l'entité peut tourner pour faire face à l'endroit où le joueur se trouve chaque tick. \nType: `Number`",
                                    "default": 5.0,
                                    "type": "number"
                                },
                                "mount_speed_multiplier": {
                                    "description": "Multiplicateur de vitesse de l'entité lorsqu'elle est contrôlée par le joueur. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.croak": {
                            "description": "Fait en sorte qu'une entité croasse à un intervalle de temps aléatoire avec des conditions configurables. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "duration": {
                                    "description": "Plage de temps en secondes pendant laquelle l'entité croasse. \nType: `Number | Number[2]`",
                                    "default": [4.5, 4.5],
                                    "oneOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "array",
                                            "minItems": 2,
                                            "maxItems": 2,
                                            "items": {
                                                "type": "number"
                                            }
                                        }
                                    ]
                                },
                                "filters": {
                                    "description": "Les filtres à appliquer pour sélectionner les entités à croasser. \nType: `Minecraft Filter`",
                                    ...commonSchemas.minecraft_filter
                                },
                                "interval": {
                                    "description": "Plage de temps en secondes entre les croassements de l'entité. \nType: `Number | Number[2]`",
                                    "default": [10, 20],
                                    "oneOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "array",
                                            "minItems": 2,
                                            "maxItems": 2,
                                            "items": {
                                                "type": "number"
                                            }
                                        }
                                    ]
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.defend_trusted_target": {
                            "description": "Force l'Entité à réagir avec un événement lorsqu'une cible de confiance est attaquée. \nType: `Object` \nNote: Ce composant nécessite que l'entité soit dans une relation de confiance avec une autre entité pour fonctionner correctement.",
                            "type": "object",
                            "properties": {
                                "aggro_sound": {
                                    "description": "L'événement sonore à jouer lorsque l'entité se défend. \nType: `String`",
                                    "type": "string"
                                },
                                "attack_interval": {
                                    "description": "Temps en secondes entre les attaques de l'entité. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "entity_types": {
                                    "description": "Liste des types d'entités à attaquer. \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "cooldown": {
                                            "description": "Le temps en secondes que l'entité doit attendre avant de pouvoir être selectionné comme cible à nouveau. \nType: `Number`",
                                            "default": 0.0,
                                            "type": "number"
                                        },
                                        "filters": {
                                            "description": "Les filtres à appliquer pour sélectionner les entités à attaquer. \nType: `Minecraft Filter`",
                                            ...commonSchemas.minecraft_filter
                                        },
                                        "max_dist": {
                                            "description": "Distance maximale à laquelle l'entité doit être pour être sélectionnée comme cible. \nType: `Number`",
                                            "default": 16,
                                            "type": "number"
                                        },
                                        "must_see": {
                                            "description": "Si vrai, l'entité doit être visible pour être sélectionnée comme cible. \nType: `Boolean`",
                                            "default": false,
                                            "type": "boolean"
                                        },
                                        "must_see_forget_duration": {
                                            "description": "Le temps en secondes que l'entité doit être hors de vue pour être oubliée comme cible. \nType: `Number`",
                                            "default": 3.0,
                                            "type": "number"
                                        },
                                        "reevaluate_description": {
                                            "description": "Si vrai, l'entité sera réévaluée comme cible à chaque tick. \nType: `Boolean`",
                                            "default": false,
                                            "type": "boolean"
                                        },
                                        "sprint_speed_multiplier": {
                                            "description": "Multiplicateur de vitesse de sprint. 1,0 signifie conserver la vitesse normale, tandis que des nombres plus élevés accélèrent la vitesse de sprint. \nType: `Number`",
                                            "default": 1.0,
                                            "type": "number"
                                        },
                                        "walk_speed_multiplier": {
                                            "description": "Multiplicateur de vitesse de marche. 1,0 signifie conserver la vitesse normale, tandis que des nombres plus élevés accélèrent la vitesse de marche. \nType: `Number`",
                                            "default": 1.0,
                                            "type": "number"
                                        }
                                    }
                                },
                                "must_see": {
                                    "description": "Si vrai, l'entité doit être visible pour être sélectionnée comme cible. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "must_see_forget_duration": {
                                    "description": "Le temps en secondes que l'entité doit être hors de vue pour être oubliée comme cible. \nType: `Number`",
                                    "default": 3.0,
                                    "type": "number"
                                },
                                "on_defend_start": {
                                    "description": "L'événement à déclencher lorsque l'entité commence à se défendre. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "sound_chance": {
                                    "description": "Pourcentage de chance que l'entité joue un son lorsqu'elle se défend. \nType: `Number`",
                                    "default": 0.05,
                                    "type": "number"
                                },
                                "within_radius": {
                                    "description": "Distance en blocs que la cible peut être à l'intérieur pour lancer une attaque. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.defend_village_target": {
                            "description": "Force l'Entité à rester dans un village et à défendre le village contre les agresseurs. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "attack_chance": {
                                    "description": "Pourcentage de chance que l'entité a d'attaquer les agresseurs de son village, où 1,0 = 100%. \nType: `Number`",
                                    "default": 0.05,
                                    "type": "number"
                                },
                                "entity_types": {
                                    "description": "Liste des types d'entités à attaquer. \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "filters": {
                                            "description": "Les filtres à appliquer pour sélectionner les entités à attaquer. \nType: `Minecraft Filter`",
                                            ...commonSchemas.minecraft_filter
                                        }
                                    }
                                },
                                "must_reach": {
                                    "description": "L'Entité doit être capable d'atteindre l'attaquant pour l'attaquer. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "probability": {
                                    "description": "La probabilité que l'entité a d'attaquer les agresseurs de son village, où 1,0 = 100%. \nType: `Number`",
                                    "default": 1,
                                    "type": "number",
                                    "minimum": 0.0,
                                    "maximum": 1.0
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.delayed_attack": {
                            "description": "Force l'Entité à attaquer tout en retardant les dégâts infligés jusqu'à un moment spécifique dans l'animation d'attaque. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "attack_duration": {
                                    "description": "L'animation d'attaque de l'Entité se jouera sur cette durée (en secondes). \nType: `Number`",
                                    "default": 0.75,
                                    "type": "number"
                                },
                                "attack_once": {
                                    "description": "Permet à l'entité d'utiliser ce comportement d'attaque une seule fois. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "attack_types": {
                                    "description": "Liste des types d'entités à attaquer. \nType: `String[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.entity_ids
                                    }
                                },
                                "hit_delay_pct": {
                                    "description": "Pourcentage dans l'animation d'attaque pour appliquer les dégâts de l'attaque (1,0 = 100%). \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number",
                                    "minimum": 0.0,
                                    "maximum": 1.0
                                },
                                "inner_boundary_time_increase": {
                                    "description": "Temps (en secondes) à ajouter au recalcul du chemin d'attaque lorsque la cible est au-delà de la 'path_inner_boundary'. \nType: `Number`",
                                    "default": 0.25,
                                    "type": "number"
                                },
                                "max_dist": {
                                    "description": "Pas utilisé dans le comportement. \nType: `Number`",
                                    "type": "number"
                                },
                                "max_path_time": {
                                    "description": "Temps maximum (en secondes) pour recalculer le chemin d'attaque. \nType: `Number`",
                                    "default": 0.55,
                                    "type": "number"
                                },
                                "melee_fov": {
                                    "description": "Champ de vision (en degrés) lors de l'utilisation du composant de détection pour détecter une cible d'attaque. \nType: `Number`",
                                    "default": 90,
                                    "type": "number"
                                },
                                "min_path_time": {
                                    "description": "Temps minimum (en secondes) pour recalculer le chemin d'attaque. \nType: `Number`",
                                    "default": 0.2,
                                    "type": "number"
                                },
                                "on_attack": {
                                    "description": "L'événement à déclencher lorsque l'entité attaque. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "outer_boundary_time_increase": {
                                    "description": "Temps (en secondes) à ajouter au recalculer lorsque la cible est au-delà de la 'path_outer_boundary'. \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number"
                                },
                                "path_fail_time_increase": {
                                    "description": "Temps (en secondes) à ajouter au recalcul du chemin d'attaque lorsque cette entité ne peut pas se déplacer le long du chemin actuel. \nType: `Number`",
                                    "default": 0.75,
                                    "type": "number"
                                },
                                "path_inner_boundary": {
                                    "description": "Distance à laquelle l'entité doit être à l'intérieur pour augmenter le recalcul du chemin d'attaque par 'inner_boundary_tick_increase'. \nType: `Number`",
                                    "default": 16,
                                    "type": "number"
                                },
                                "path_outer_boundary": {
                                    "description": "Distance à laquelle l'entité doit être à l'extérieur pour augmenter le recalcul du chemin d'attaque par 'outer_boundary_tick_increase'. \nType: `Number`",
                                    "default": 32,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "random_stop_interval": {
                                    "description": "Cette entité aura une chance de 1 sur N d'arrêter son attaque actuelle, où N = 'random_stop_interval'. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "reach_multiplier": {
                                    "description": "Utilisé avec la taille de la base de l'entité pour déterminer la distance minimale de la cible avant de tenter de causer des dégâts d'attaque. \nType: `Number`",
                                    "default": 1.5,
                                    "type": "number"
                                },
                                "require_complete_path": {
                                    "description": "Bascule (on/off) la nécessité d'avoir un chemin complet de l'entité à la cible lors de l'utilisation de ce comportement d'attaque. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "set_persistent": {
                                    "description": "Permet à l'entité d'être définie pour persister lorsqu'elle cible un joueur. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "speed_multiplier": {
                                    "description": "Multiplicateur de vitesse de mouvement de l'entité lorsqu'elle utilise cet objectif AI. \nType: `Number`",
                                    "default": 1,
                                    "type": "number"
                                },
                                "target_dist": {
                                    "description": "Inutilisé. \nType: `Number`",
                                    "type": "number"
                                },
                                "track_target": {
                                    "description": "Permet à l'entité de suivre la cible d'attaque, même si l'entité n'a pas de détection. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "x_max_rotation": {
                                    "description": "Rotation maximale (en degrés) sur l'axe X que cette entité peut tourner lorsqu'elle tente de regarder la cible. \nType: `Number`",
                                    "default": 30,
                                    "type": "number"
                                },
                                "y_max_head_rotation": {
                                    "description": "Rotation maximale (en degrés) sur l'axe Y que cette entité peut tourner la tête lorsqu'elle tente de regarder la cible. \nType: `Number`",
                                    "default": 30,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.dig": {
                            "description": "Permet à l'entité de creuser dans le sol avant de disparaître. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "allow_dig_when_named": {
                                    "description": "Si vrai, ce comportement peut être exécuté lorsque l'entité est nommée. Sinon, non. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "digs_in_daylight": {
                                    "description": "Indique que l'entité doit commencer à creuser lorsqu'elle voit la lumière du jour. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "duration": {
                                    "description": "Durée de cet objectif AI en secondes. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "idle_time": {
                                    "description": "Le temps minimum en secondes entre le dernier dérangement détecté et le début du creusement. \nType: `Number`",
                                    "type": "number"
                                },
                                "on_start": {
                                    "description": "L'événement à déclencher lorsque l'entité commence à creuser. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "suspicion_is_disturbance": {
                                    "description": "Si vrai, trouver de nouveaux emplacements suspects compte comme des perturbations qui peuvent retarder le début de cet objectif. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "vibration_is_disturbance": {
                                    "description": "Si vrai, les vibrations comptent comme des perturbations qui peuvent retarder le début de cet objectif. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                }
                            }
                        },
                        "minecraft:behavior.door_interact": {
                            "description": "Permet à l'entité d'interagir avec les portes. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.dragonchargeplayer": {
                            "description": "Force l'Entité à attaquer un joueur en chargeant vers lui. \nType: `Object` \nNote: Ce composant nécessite que l'entité soit un Ender Dragon pour fonctionner correctement.",
                            "type": "object",
                            "properties": {
                                "active_speed": {
                                    "description": "La vitesse de l'entité lorsqu'elle charge vers le joueur. \nType: `Number`",
                                    "default": 3,
                                    "type": "number"
                                },
                                "continue_charge_threshold_time": {
                                    "description": "Si le dragon est en dehors de la 'target_zone' pendant plus de 'continue_charge_threshold_time' secondes, la charge est annulée. \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number"
                                },
                                "flight_speed": {
                                    "description": "La vitesse de vol de l'entité lorsqu'elle ne charge pas vers le joueur. \nType: `Number`",
                                    "default": 0.6,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "target_zone": {
                                    "description": "Distance minimale et maximale de l'entité par rapport à la cible pour commencer à charger. \nType: `Number[2]`",
                                    "default": [10, 150],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "turn_speed": {
                                    "description": "La vitesse à laquelle l'entité tourne lorsqu'elle charge vers le joueur. \nType: `Number`",
                                    "default": 0.7,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.dragondeath": {
                            "description": "Contrôle le comportement de l'entité lorsqu'elle meurt. \nType: `Object` \nNote: Ce composant nécessite que l'entité soit un Ender Dragon pour fonctionner correctement.",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.dragonflaming": {
                            "description": "Permet à l'entité d'utiliser une attaque de souffle de feu. \nType: `Object` \nNote: Ce composant nécessite que l'entité soit un Ender Dragon pour fonctionner correctement.",
                            "type": "object",
                            "properties": {
                                "cooldown_time": {
                                    "description": "Le temps en secondes avant que l'entité puisse réutiliser l'attaque de souffle de feu. \nType: `Number`",
                                    "default": 10,
                                    "type": "number"
                                },
                                "flame_time": {
                                    "description": "Le temps en secondes que le feu reste sur le sol après l'attaque. \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number"
                                },
                                "ground_flame_count": {
                                    "description": "Le nombre d'attaques de souffle de feu au sol à utiliser avant le décollage. \nType: `Integer`",
                                    "default": 4,
                                    "type": "integer"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "roar_time": {
                                    "description": "Le temps en secondes que l'entité doit rugir avant d'utiliser l'attaque de souffle de feu. \nType: `Number`",
                                    "default": 2,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.dragonholdingpattern": {
                            "description": "Force l'Entité à voler en cercle autour du podium central situé dans The End. \nType: `Object` \nNote: Ce composant nécessite que l'entité soit un Ender Dragon pour fonctionner correctement.",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.dragonlanding": {
                            "description": "Force l'Entité à atterrir. \nType: `Object` \nNote: Ce composant nécessite que l'entité soit un Ender Dragon pour fonctionner correctement.",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.dragonscanning": {
                            "description": "Force l'Entité à scanner pour les joueurs. \nType: `Object` \nNote: Ce composant nécessite que l'entité soit un Ender Dragon pour fonctionner correctement.",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.dragonstrafeplayer": {
                            "description": "Force l'Entité à attaquer un joueur en effectuant une attaque de strafe. \nType: `Object` \nNote: Ce composant nécessite que l'entité soit un Ender Dragon pour fonctionner correctement.",
                            "type": "object",
                            "properties": {
                                "active_speed": {
                                    "description": "La vitesse de l'entité lorsqu'elle effectue une attaque de strafe. \nType: `Number`",
                                    "default": 0.6,
                                    "type": "number"
                                },
                                "fireball_range": {
                                    "description": "Distance maximale de l'attaque de boule de feu de cette entité lorsqu'elle effectue une attaque de strafe. \nType: `Number`",
                                    "default": 64,
                                    "type": "number"
                                },
                                "flight_speed": {
                                    "description": "La vitesse de vol de l'entité lorsqu'elle ne fait pas d'attaque de strafe. \nType: `Number`",
                                    "default": 0.6,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "switch_direction_probability": {
                                    "description": "Pourcentage de chance de changer la direction de strafe de cette entité entre les sens horaire et antihoraire. La chance de changement de direction se produit chaque fois qu'une nouvelle cible est choisie (1,0 = 100%). \nType: `Number`",
                                    "default": 0.125,
                                    "type": "number",
                                    "minimum": 0.0,
                                    "maximum": 1.0
                                },
                                "target_in_range_and_in_view_time": {
                                    "description": "Temps (en secondes) que la cible doit être dans la portée de la boule de feu et en vue de cette entité avant qu'une boule de feu puisse être tirée. \nType: `Number`",
                                    "default": 0.25,
                                    "type": "number"
                                },
                                "target_zone": {
                                    "description": "Distance minimale et maximale de l'entité par rapport à la cible pour commencer à effectuer une attaque de strafe. \nType: `Number[2]`",
                                    "default": [10, 150],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "turn_speed": {
                                    "description": "La vitesse à laquelle l'entité tourne lorsqu'elle effectue une attaque de strafe. \nType: `Number`",
                                    "default": 0.7,
                                    "type": "number"    
                                },
                                "view_angle": {
                                    "description": "La cible doit être dans cet angle de vue de l'entité avant qu'une boule de feu puisse être tirée. \nType: `Number`",
                                    "default": 10,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.dragontakeoff": {
                            "description": "Force l'Entité à décoller. \nType: `Object` \nNote: Ce composant nécessite que l'entité soit un Ender Dragon pour fonctionner correctement.",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.drink_milk": {
                            "description": "Force l'Entité à boire du lait en fonction des conditions de l'environnement spécifiées. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "cooldown_seconds": {
                                    "description": "Le temps en secondes avant que l'Entité puisse boire du lait à nouveau. \nType: `Number`",
                                    "default": 5.0,
                                    "type": "number"
                                },
                                "filters": {
                                    "description": "Les filtres à appliquer pour sélectionner les entités à boire du lait. \nType: `Minecraft Filter`",
                                    ...commonSchemas.minecraft_filter
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.drink_potion": {
                            "description": "Force l'Entité à boire une potion en fonction des conditions de l'environnement spécifiées. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "potions": {
                                    "description": "Liste des potions que cette Entité peut boire. \nType: `Object[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "chance": {
                                                "description": "La chance (de 0,0 à 1,0) que cette potion soit sélectionnée lors de la recherche d'une potion à utiliser. \nType: `Number`",
                                                "default": 1.0,
                                                "type": "number",
                                                "minimum": 0.0,
                                                "maximum": 1.0
                                            },
                                            "filters": {
                                                "description": "Les filtres à appliquer pour sélectionner les entités à boire cette potion. \nType: `Minecraft Filter`",
                                                ...commonSchemas.minecraft_filter
                                            },
                                            "id": {
                                                "description": "L'identifiant de la potion à boire. \nType: `Integer`",
                                                "default": -1,
                                                "type": "integer"
                                            }
                                        }
                                    }
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed_modifier": {
                                    "description": "Le modificateur de vitesse de mouvement à appliquer à l'entité pendant qu'elle boit une potion. Une valeur de 0 représente aucun changement de vitesse. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.drop_item_for": {
                            "description": "Force l'Entité à déposer un item pour une autre entité. \nType: `Object` \nNote: Ce composant nécessite que l'entité ait un composant de navigation pour fonctionner correctement.",
                            "type": "object",
                            "properties": {
                                "cooldown": {
                                    "description": "Le temps en secondes avant que l'Entité puisse déposer un autre item. \nType: `Number`",
                                    "default": 0.2,
                                    "type": "number"
                                },
                                "drop_item_chance": {
                                    "description": "La chance (de 0,0 à 1,0) que l'Entité dépose un item lorsqu'elle est ciblée. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number",
                                    "minimum": 0.0,
                                    "maximum": 1.0
                                },
                                "entity_types": {
                                    "description": "La liste des conditions qu'une autre entité doit remplir pour être une cible valide pour laquelle déposer un objet. \nType: `Minecraft Filter`",
                                    ...commonSchemas.minecraft_filter
                                },
                                "goal_radius": {
                                    "description": "La distance en blocs à laquelle l'Entité considère qu'elle a atteint sa position cible. \nType: `Number`",
                                    "default": 0.50,
                                    "type": "number"
                                },
                                "loot_table": {
                                    "description": "La Loot Table qui contient le butin possible que l'Entité peut déposer avec cet objectif. \nType: `String`",
                                    "type": "string",
                                    pattern: schemaPatterns.loot_tables_file,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.loot_table_file_paths
                                },
                                "max_head_look_at_height": {
                                    "description": "La hauteur maximale à laquelle la tête de l'entité regardera lorsqu'elle déposera l'item. L'Entité regardera toujours sa cible. \nType: `Number`",
                                    "default": 10.0,
                                    "type": "number"
                                },
                                "minimum_teleport_distance": {
                                    "description": "Si la position cible est plus éloignée que cette distance sur n'importe quel tick, l'Entité se téléportera à la position cible. \nType: `Number`",
                                    "default": 2.0,
                                    "type": "number"
                                },
                                "offering_distance": {
                                    "description": "La distance à laquelle l'Entité essaiera de déposer l'item pour la cible. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "on_drop_attempt": {
                                    "description": "L'événement à déclencher lorsque l'Entité tente de déposer un item. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "search_count": {
                                    "description": "Le nombre de blocs que l'Entité vérifiera chaque tick dans sa plage de recherche et de hauteur pour un bloc valide vers lequel se déplacer. Une valeur de 0 fera que l'entité vérifie chaque bloc dans la plage en un tick. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "search_height": {
                                    "description": "La hauteur en blocs que l'Entité vérifiera pour un bloc valide vers lequel se déplacer. \nType: `Integer`",
                                    "default": 1,
                                    "type": "integer"
                                },
                                "search_range": {
                                    "description": "La distance en blocs que l'Entité vérifiera pour un bloc valide vers lequel se déplacer. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "seconds_before_pickup": {
                                    "description": "Le nombre de secondes qui s'écouleront avant que l'Entité déposée puisse être ramassée du sol. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'Entité lorsqu'elle utilise cet objectif AI. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "target_range": {
                                    "description": "La distance en blocs à laquelle l'Entité considère qu'elle a atteint sa cible. \nType: `Number[3]`",
                                    "default": [1, 1, 1],
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "teleport_offset": {
                                    "description": "Lorsque l'entité se téléporte, décalez la position de téléportation de ce nombre de blocs dans les coordonnées X, Y et Z. \nType: `Number[3]`",
                                    "default": [0, 1, 0],
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "time_of_day_range": {
                                    "description": "Les heures de la journée pendant lesquelles cet objectif peut être utilisé. Pour référence : midi est 0.0, le coucher du soleil est 0.25, minuit est 0.5, et le lever du soleil est 0.75, et retour à midi pour 1.0. \nType: `Number[2]`",
                                    "default": [0, 1],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "number"
                                    }
                                }
                            }
                        },
                        "minecraft:behavior.eat_block": {
                            "description": "Force l'Entité à manger un bloc. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "eat_and_replace_block_pairs": {
                                    "description": "Une collection de paires de blocs; le premier ('eat_block') est le bloc que l'entité devrait manger, le second ('replace_block') est le bloc qui devrait remplacer le bloc mangé. \nType: `Object[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "eat_block": {
                                                "description": "Le bloc que l'Entité devrait manger. \nType: `String`",
                                                "type": "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                            },
                                            "replace_block": {
                                                "description": "Le bloc qui devrait remplacer le bloc mangé. \nType: `String`",
                                                "type": "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                            }
                                        }
                                    }
                                },
                                "on_eat": {
                                    "description": "L'événement à déclencher lorsque l'Entité mange un bloc. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "success_chance": {
                                    "description": "Une expression molang définissant la chance de succès de l'entité à consommer un bloc. \nType: `Molang`",
                                    "default": 0.02,
                                    "oneOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "number"
                                        }
                                    ]
                                },
                                "time_until_eat": {
                                    "description": "Le temps (en secondes) qu'il faut à l'entité pour manger un bloc avec succès. \nType: `Number`",
                                    "default": 1.8,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.eat_carried_item": {
                            "description": "Force l'Entité à manger un item qu'elle transporte dans son inventaire. \nType: `Object` \nNote: Il faut que les items soient dans l'inventaire de l'entité pour qu'elle puisse les manger.",
                            "type": "object",
                            "properties": {
                                "delay_before_eating": {
                                    "description": "Le temps en secondes avant que l'Entité puisse manger un item. \nType: `Number`",
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.eat_mob": {
                            "description": "Force l'Entité à manger une entité. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "eat_animation_time": {
                                    "description": "Le temps en secondes que l'animation de manger doit durer. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "eat_mob_sound": {
                                    "description": "Définit le son qui doit être joué lorsqu'une entité est mangée. \nType: `String`",
                                    "type": "string"
                                },
                                "loot_table": {
                                    "description": "La Loot Table qui contient le butin possible que l'Entité peut laisser tomber lorsqu'elle mange une entité. \nType: `String`",
                                    "type": "string",
                                    pattern: schemaPatterns.loot_tables_file,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.loot_table_file_paths
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "pull_in_force": {
                                    "description": "Définit la force avec laquelle l'entité à manger est attirée vers l'entité mangeante. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "reach_mob_distance": {
                                    "description": "Définit la distance à laquelle l'entité doit être avant de manger une autre entité. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "run_speed": {
                                    "description": "Définit la vitesse à laquelle l'entité doit courir lorsqu'elle mange une autre entité. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.emerge": {
                            "description": "Active le drapeau d'entité 'EMERGING' pendant la durée spécifiée et déclenche 'on_done' à la fin. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "cooldown_time": {
                                    "description": "Le temps en secondes avant que l'entité puisse émerger à nouveau. \nType: `Number`",
                                    "default": 0.50,
                                    "type": "number"
                                },
                                "duration": {
                                    "description": "La durée en secondes pendant laquelle l'entité est en train d'émerger. \nType: `Number`",
                                    "default": 5.0,
                                    "type": "number"
                                },
                                "on_done": {
                                    "description": "L'événement à déclencher lorsque l'entité a fini d'émerger. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.enderman_leave_block": {
                            "description": "Permet à l'entité à laisser tomber le bloc qu'elle tient actuellement. \nType: `Object` \nNote: Ce comportement ne peut être utilisé que par le type d'entité enderman.",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.enderman_take_block": {
                            "description": "Permet à l'entité de prendre un bloc et de le transporter. \nType: `Object` \nNote: Ce comportement ne peut être utilisé que par le type d'entité enderman.",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.equip_item": {
                            "description": "Force l'Entité à équiper un item. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.explore_outskirts": {
                            "description": "Force l'Entité à explorer les points aléatoires à la périphérie du village. \nType: `Object` \nNote: Ce composant nécessite que l'entité ait un composant de navigation et 'minecraft:dweller' pour fonctionner correctement.",
                            "type": "object",
                            "properties": {
                                "dist_from_boundary": {
                                    "description": "La distance à partir de la limite à laquelle l'Entité doit se trouver pour explorer les environs. \nType: `Number[3]`",
                                    "default": [5, 0, 5],
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "explore_dist": {
                                    "description": "La distance totale en blocs que l'Entité explorera au-delà des limites du village lorsqu'elle choisit son point de déplacement. \nType: `Number`",
                                    "default": 5.0,
                                    "type": "number"
                                },
                                "max_travel_time": {
                                    "description": "C'est le temps maximum qu'une Entité essaiera d'atteindre son point de déplacement à la périphérie du village avant que l'objectif ne soit annulé. \nType: `Number`",
                                    "default": 60.0,
                                    "type": "number"
                                },
                                "max_wait_time": {
                                    "description": "Le temps en secondes entre le choix de nouveaux points d'exploration sera choisi sur un intervalle aléatoire entre cette valeur et le temps d'attente minimum. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "min_dist_from_target": {
                                    "description": "L'Entité doit être à cette distance de son point de déplacement pour considérer qu'elle a atteint sa destination. \nType: `Number`",
                                    "default": 2.2,
                                    "type": "number"
                                },
                                "min_perimeter": {
                                    "description": "Le périmètre minimum du village requis pour exécuter cet objectif. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "min_wait_time": {
                                    "description": "Le temps en secondes entre le choix de nouveaux points d'exploration sera choisi sur un intervalle aléatoire entre ce temps et le temps d'attente maximum. \nType: `Number`",
                                    "default": 3.0,
                                    "type": "number"
                                },
                                "next_xz": {
                                    "description": "Un nouveau point d'exploration sera choisi dans cette distance XZ de la position cible actuelle lorsque la navigation est terminée et que le minuteur d'attente a expiré. \nType: `Integer`",
                                    "default": 5,
                                    "type": "integer"
                                },
                                "next_y": {
                                    "description": "Un nouveau point d'exploration sera choisi dans cette distance Y de la position cible actuelle lorsque la navigation est terminée et que le minuteur d'attente a expiré. \nType: `Integer`",
                                    "default": 3,
                                    "type": "integer"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'Entité lorsqu'elle explore les environs. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "timer_ratio": {
                                    "description": "Chaque nouveau point d'exploration sera choisi sur un intervalle aléatoire entre le temps d'attente minimum et maximum, divisé par cette valeur. Cela ne s'applique pas au premier point d'exploration choisi lorsque l'objectif est exécuté. \nType: `Number`",
                                    "default": 2.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.fertilize_farm_block": {
                            "description": "Permet à l'Entité de chercher une zone pour fertiliser les cultures. \nType: `Object` \nNote: Ce composant ne s'exécutera pas si l'entité n'a pas d'objet fertilisant dans son inventaire.",
                            "type": "object",
                            "properties": {
                                "goal_radius": {
                                    "description": "Distance en blocs à laquelle l'Entité considère qu'elle a atteint sa position cible. \nType: `Number`",
                                    "default": 1.50,
                                    "type": "number"
                                },
                                "max_fertilizer_usage": {
                                    "description": "Le nombre maximum de fois que l'Entité utilisera de l'engrais sur le bloc cible. \nType: `Integer`",
                                    "default": 1,
                                    "type": "integer"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "search_cooldown_max_seconds": {
                                    "description": "Le temps maximum en secondes avant que l'Entité ne recherche un nouveau bloc à fertiliser. Le temps est choisi entre 0 et cette valeur. \nType: `Number`",
                                    "default": 8.0,
                                    "type": "number"
                                },
                                "search_count": {
                                    "description": "Le nombre de blocs choisis aléatoirement à chaque tick que l'Entité vérifiera dans une zone de recherche pour un bloc à fertiliser. \nType: `Integer`",
                                    "default": 9,
                                    "type": "integer"
                                },
                                "search_height": {
                                    "description": "La hauteur en blocs que l'Entité vérifiera pour un bloc à fertiliser. \nType: `Integer`",
                                    "default": 1,
                                    "type": "integer"
                                },
                                "search_range": {
                                    "description": "La distance en blocs que l'Entité vérifiera pour un bloc à fertiliser. \nType: `Integer`",
                                    "default": 1,
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'Entité lorsqu'elle fertilise les cultures. \nType: `Number`",
                                    "default": 0.50,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.find_cover": {
                            "description": "Permet à l'Entité de chercher de l'ombre. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "cooldown_time": {
                                    "description": "Le temps en secondes avant que l'Entité puisse rechercher un nouvel abri. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'Entité lorsqu'elle cherche un abri. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.find_mount": {
                            "description": "Permet à l'Entité de chercher une autre entité à monter. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "avoid_water": {
                                    "description": "Si vrai, l'Entité n'ira pas dans les blocs d'eau lorsqu'elle se dirige vers une monture. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "mount_distance": {
                                    "description": "La diqstance que le mob doit être en blocs. Si la valeur est inférieure à 0, le mob utilisera sa distance d'attaque par défaut. \nType: `Number`",
                                    "default": -1.0,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "start_delay": {
                                    "description": "Le temps en secondes que le mob attendra avant de commencer à se diriger vers la monture. \nType: `Number`",
                                    "default": 0,
                                    "type": "number"
                                },
                                "target_needed": {
                                    "description": "Si vrai, le mob ne cherchera une monture que s'il a une cible. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "within_radius": {
                                    "description": "La distance en blocs dans laquelle le mob cherchera une monture. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.find_underwater_treasure": {
                            "description": "Permet à l'Entité de localiser et de se diriger vers le point d'intérêt le plus proche étiqueté comme ruine ou épave. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "search_range": {
                                    "description": "La distance maximale à laquelle l'Entité cherchera un trésor dans une ruine ou une épave pour se déplacer. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'Entité lorsqu'elle cherche un trésor sous-marin. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "stop_distance": {
                                    "description": "La distance à laquelle l'Entité considère qu'elle a atteint son point d'intérêt. \nType: `Number`",
                                    "default": 2.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.fire_at_target": {
                            "description": "Permet à l'Entité d'attaquer en tirant un coup avec un delai. \nType: `Object` \nNote: Le point d'ancrage et le décalage de ce composant remplacent le point d'ancrage et le décalage du composant de projectile.",
                            "type": "object",
                            "properties": {
                                "attack_cooldown": {
                                    "description": "Le temps en secondes avant que l'Entité puisse attaquer à nouveau. \nType: `Number`",
                                    "default": 0.50,
                                    "type": "number"
                                },
                                "attack_range": {
                                    "description": "La distance maximale à laquelle l'Entité peut attaquer sa cible. \nType: `Number[2]`",
                                    "default": [2.0, 16.0],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "filters": {
                                    "description": "Les filtres à appliquer pour sélectionner les entités à attaquer. \nType: `Minecraft Filter`",
                                    ...commonSchemas.minecraft_filter
                                },
                                "max_head_rotation_x": {
                                    "description": "La rotation maximale de la tête (en degrés) sur l'axe X que cette Entité peut appliquer tout en essayant de regarder la cible. \nType: `Number`",
                                    "default": 30.0,
                                    "type": "number"
                                },
                                "max_head_rotation_y": {
                                    "description": "La rotation maximale de la tête (en degrés) sur l'axe Y que cette Entité peut appliquer tout en essayant de regarder la cible. \nType: `Number`",
                                    "default": 30.0,
                                    "type": "number"
                                },
                                "owner_anchor": {
                                    "description": "Point d'ancrage pour l'emplacement d'apparition du projectile. \nType: `Integer`",
                                    "default": 2,
                                    "type": "integer"
                                },
                                "owner_offset": {
                                    "description": "Décalage pour l'emplacement d'apparition du projectile. \nType: `Number[3]`",
                                    "default": [0, 0, 0],
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "post_shoot_delay": {
                                    "description": "Le temps en secondes entre le tir du projectile et la fin de l'objectif. \nType: `Number`",
                                    "default": 0.20,
                                    "type": "number"
                                },
                                "pre_shoot_delay": {
                                    "description": "Le temps en secondes avant de tirer le projectile. \nType: `Number`",
                                    "default": 0.75,
                                    "type": "number"
                                },
                                "projectile_def": {
                                    "description": "Définition de l'entité à utiliser comme projectile pour l'attaque. L'entité doit être un projectile. Ce champ est requis pour que l'objectif soit utilisable. \nType: `String`",
                                    "type": "string"
                                },
                                "ranged_fov": {
                                    "description": "Champ de vision (en degrés) lors de l'utilisation de la détection pour attaquer une cible. \nType: `Number`",
                                    "default": 90.0,
                                    "type": "number"
                                },
                                "target_anchor": {
                                    "description": "Point d'ancrage pour la cible de l'attaque. \nType: `Integer`",
                                    "default": 2,
                                    "type": "integer"
                                },
                                "target_offset": {
                                    "description": "Décalage pour la cible de l'attaque. \nType: `Number[3]`",
                                    "default": [0, 0, 0],
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number"
                                    }
                                }
                            }
                        },
                        "minecraft:behavior.flee_sun": {
                            "description": "Force l'Entité à éviter le soleil. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'Entité lorsqu'elle fuit le soleil. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.float": {
                            "description": "Permet à l'Entité de flotter sur l'eau. Les passagers seront éjectés si la tête de l'entité est sous l'eau. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "sink_with_passengers": {
                                    "description": "Si vrai, l'entité continuera à couler tant qu'elle a des passagers. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                }
                            }
                        },
                        "minecraft:behavior.float_tempt": {
                            "description": "Force une Entité à être tentée par un item défini. Ce composant est fait pour les entités qui se déplacent en flottant. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "can_get_scared": {
                                    "description": "Si vrai, le mob peut cesser d'être tenté si le joueur se déplace trop vite tout en étant proche de ce mob. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_tempt_vertically": {
                                    "description": "Si vrai, la distance verticale par rapport au joueur sera prise en compte lors de la tentation. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_tempt_while_ridden": {
                                    "description": "Si vrai, le mob peut être tenté même s'il a un passager. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "items": {
                                    "description": "Liste des items qui peuvent tenter cette entité. \nType: `String[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                    }
                                },
                                "on_start": {
                                    "description": "Événement à déclencher lorsque ce comportement démarre. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "on_end": {
                                    "description": "Événement à déclencher lorsque ce comportement se termine. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "sound_interval": {
                                    "description": "Plage de ticks aléatoires à attendre entre les sons de tentation. \nType: `Number[2]`",
                                    "default": [0.0, 0.0],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle est tentée. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "stop_distance": {
                                    "description": "La distance à laquelle l’Entité arrêtera de suivre le joueur. \nType: `Number`",
                                    "default": 1.5,
                                    "type": "number"
                                },
                                "tempt_sound": {
                                    "description": "Le son à jouer pendant que le mob est tenté. \nType: `String`",
                                    "type": "string"
                                },
                                "within_radius": {
                                    "description": "La distance en blocs à laquelle le joueur doit être pour tenter cette entité. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.float_wander": {
                            "description": "Permet à l'Entité de flotter et de dériver aléatoirement comme un Ghast. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "additional_collision_buffer": {
                                    "description": "Si 'true', l'Entité vérifie qu'il n'y a aucun bloc dans une zone élargie autour de la position cible. Cela aide à éviter que l’Entité se coince ou touche des blocs lorsqu'elle erre aléatoirement. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "allow_navigating_through_liquids": {
                                    "description": "Si `true`, permet à l'Entité de naviguer à travers les blocs liquides sur son chemin vers la position cible. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "float_duration": {
                                    "description": "Temps en secondes que l'Entité flottera avant de choisir une nouvelle direction. \nType: `Number[2]`",
                                    "default": [0.0, 0.0],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "float_wander_has_move_control": {
                                    "description": "Si 'true', le drapeau MoveControl sera ajouté au comportement, ce qui signifie qu'il ne peut plus être actif en même temps que d'autres comportements avec MoveControl. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "must_reach": {
                                    "description": "Si vrai, le point doit être atteignable pour être une cible valide. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "navigate_around_surface": {
                                    "description": "Active un nouvel algorithme pour choisir une position aléatoire vers laquelle aller. L'Entité cherchera une position proche de blocs solides. Si aucun bloc n'est trouvé, elle cherchera vers le niveau de surface du monde de la dimension courante. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "random_reselect": {
                                    "description": "Si vrai, l'entité choisira un nouveau point aléatoire tout en se déplaçant vers le point précédemment sélectionné. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "surface_xz_dist": {
                                    "description": "Distance horizontale (X et Z) à laquelle chercher une surface solide. \nType: `Integer` \nNote: Ne fonctionne que si `navigate_around_surface` est activé.",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "surface_y_dist": {
                                    "description": "Distance verticale (Y) à laquelle chercher une surface solide. \nType: `Integer` \nNote: Ne fonctionne que si `navigate_around_surface` est activé.",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "use_home_position_restriction": {
                                    "description": "Si vrai, l'entité ne choisira que des points à proximité de sa position d'origine. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "xz_dist": {
                                    "description": "La distance en blocs sur le sol que l'Entité regerdera pour un nouveau point de déplacement. \nType: `Integer`",
                                    "default": 10,
                                    "type": "integer",
                                    "minimum": 1
                                },
                                "y_dist": {
                                    "description": "La distance en blocs que l'Entité regerdera pour un nouveau point de déplacement. \nType: `Integer`",
                                    "default": 7,
                                    "type": "integer",
                                    "minimum": 1
                                },
                                "y_offset": {
                                    "description": "La hauteur en blocs à ajouter à la position cible. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.follow_caravan": {
                            "description": "Force l'Entité à suivre une caravane comme un lama. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "entity_count": {
                                    "description": "Le nombre d'entités qui peuvent être dans la caravane. \nType: `Integer`",
                                    "default": 1,
                                    "type": "integer"
                                },
                                "entity_types": {
                                    "description": "Liste des types d'entités que cette Entité peut suivre dans une caravane. \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "cooldown": {
                                            "description": "Le temps en secondes que l'Entité doit attendre avant de sélectionner une nouvelle cible de la même entité. \nType: `Number`",
                                            "default": 0.0,
                                            "type": "number"
                                        },
                                        "filters": {
                                            "description": "Les filtres à appliquer pour sélectionner les entités à suivre. \nType: `Minecraft Filter`",
                                            ...commonSchemas.minecraft_filter
                                        },
                                        "max_dist": {
                                            "description": "Distance maximale à laquelle l'entité doit être pour être sélectionnée comme cible. \nType: `Number`",
                                            "default": 16,
                                            "type": "number"
                                        },
                                        "must_see": {
                                            "description": "Si vrai, l'entité doit être visible pour être sélectionnée comme cible. \nType: `Boolean`",
                                            "default": false,
                                            "type": "boolean"
                                        },
                                        "must_see_forget_duration": {
                                            "description": "Le temps en secondes que l'entité doit être hors de vue pour être oubliée comme cible. \nType: `Number`",
                                            "default": 3.0,
                                            "type": "number"
                                        },
                                        "reevaluate_description": {
                                            "description": "Si vrai, l'entité sera réévaluée comme cible à chaque tick. \nType: `Boolean`",
                                            "default": false,
                                            "type": "boolean"
                                        },
                                        "sprint_speed_multiplier": {
                                            "description": "Multiplicateur de vitesse de sprint. 1,0 signifie conserver la vitesse normale, tandis que des nombres plus élevés accélèrent la vitesse de sprint. \nType: `Number`",
                                            "default": 1.0,
                                            "type": "number"
                                        },
                                        "walk_speed_multiplier": {
                                            "description": "Multiplicateur de vitesse de marche. 1,0 signifie conserver la vitesse normale, tandis que des nombres plus élevés accélèrent la vitesse de marche. \nType: `Number`",
                                            "default": 1.0,
                                            "type": "number"
                                        }
                                    }
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'Entité lorsqu'elle suit une caravane. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.follow_mob": {
                            "description": "Force une Entité à suivre et à se rassembler autour d'autres mob du même type.",
                            "type": "object",
                            "properties": {
                                "filters": {
                                    "description": "Permet de filtrer précisément quels types d’entités peuvent être suivis. Si vide, les critères par défaut sont appliqués : exclut joueurs, poissons, calamars, têtards, dauphins, et les entités du même type que l’Entité. \nType: `Minecraft Filter`",
                                    ...commonSchemas.minecraft_filter
                                },
                                "preferred_actor_type": {
                                    "description": "Permet de préciser le type d’entité que l’Entité préfère suivre. Si ce champ n’est pas défini, un mob aléatoire à proximité (parmi les valides) sera choisi. \nType: `String`",
                                    "type": "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.entity_ids
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "search_range": {
                                    "description": "La distance en blocs à laquelle l'Entité cherchera un mob à suivre. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'Entité lorsqu'elle suit un autre mob. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "stop_distance": {
                                    "description": "La distance en blocs à laquelle cette Entité s'arrêtera de suivre un autre mob. \nType: `Number`",
                                    "default": 2.0,
                                    "type": "number"
                                },
                                "use_home_position_restriction": {
                                    "description": "Si true, l'Entité respecte le rayon de restriction défini dans le composant minecraft:home. Si false, l'Entité peut suivre une cible sans tenir compte des limites du composant `minecraft:home`. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                }
                            }
                        },
                        "minecraft:behavior.follow_owner": {
                            "description": "Force l'Entité à suivre un joueur marqué comme son propriétaire.",
                            "type": "object",
                            "properties": {
                                "can_teleport": {
                                    "description": "Définit si l'entité peut se téléporter à son propriétaire lorsqu'elle est trop éloignée. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "ignore_vibration": {
                                    "description": "Définit si l'entité doit ignorer le fait de suivre son propriétaire après avoir détecté une vibration récente. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "max_distance": {
                                    "description": "La distance maximale en blocs à laquelle cette Entité suivra son propriétaire. \nType: `Number`",
                                    "default": 60.0,
                                    "type": "number"
                                },
                                "post_teleport_distance": {
                                    "description": "Définit à quelle distance (en blocs) l'entité sera de son propriétaire après s'être téléportée. Si non spécifié, cela revient à 'stop_distance' + 1, permettant à l'entité de reprendre la navigation sans heurts. \nType: `Number`",
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'Entité lorsqu'elle suit son propriétaire. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "start_distance": {
                                    "description": "La distance minimale en blocs à laquelle cette Entité suivra son propriétaire. \nType: `Number`",
                                    "default": 10.0,
                                    "type": "number"
                                },
                                "stop_distance": {
                                    "description": "La distance en blocs à laquelle cette Entité s'arrêtera de suivre son propriétaire. \nType: `Number`",
                                    "default": 2.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.follow_parent": {
                            "description": "Force une Entité à suivre son parent. \nType: `Object` \nNote: Ce composant nécessitr que l'Entité ait le composant 'minecraft:is_baby' pour fonctionner correctement.",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'Entité lorsqu'elle suit son parent. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.follow_target_captain": {
                            "description": "Force l'Entité à suivre son capitaine. \nType: `Object` \nNote: L'Entité qui est définit comme capitaine doit avoir le composant 'minecraft:is_illager_captain'.",
                            "type": "object",
                            "properties": {
                                "follow_distance": {
                                    "description": "Définit la distance en blocs à laquelle l'Entité restera de sa cible tout en la suivant. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "within_radius": {
                                    "description": "Définit la distance en blocs à laquelle l'Entité doit être de sa cible pour considérer qu'elle l'a atteinte. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.go_and_give_items_to_noteblock": {
                            "description": "Force l'Entité à tenter de donner des items à un noteblock récemment joué à proximité. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "listen_time": {
                                    "description": "Le temps en secondes que l'Entité doit continuer à donner des items à un noteblock après l'avoir entendu. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "on_item_throw": {
                                    "description": "Les événements à déclencher lorsque l'Entité jette un item. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "reach_block_distance": {
                                    "description": "Définit la distance à laquelle l'Entité doit être pour donner des items à un noteblock. \nType: `Number`",
                                    "default": 3.0,
                                    "type": "number"
                                },
                                "run_speed": {
                                    "description": "Définit la vitesse à laquelle l'Entité doit courir lorsqu'elle donne des items à un noteblock. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "throw_force": {
                                    "description": "Définit la force avec laquelle l'Entité doit jeter des items à un noteblock. \nType: `Number`",
                                    "default": 0.20,
                                    "type": "number"
                                },
                                "throw_sound": {
                                    "description": "Définit le son à jouer lorsque l'Entité jette un item. \nType: `String`",
                                    "type": "string"
                                },
                                "vertical_throw_mul": {
                                    "description": "Définit le multiplicateur de lancer vertical qui est appliqué en plus de la force de lancer dans la direction verticale. \nType: `Number`",
                                    "default": 1.5,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.go_and_give_items_to_owner": {
                            "description": "Force l'Entité à tenter de donner des items à son propriétaire. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "on_item_throw": {
                                    "description": "Les événements à déclencher lorsque l'Entité jette un item. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "reach_mob_distance": {
                                    "description": "Définit la distance à laquelle l'Entité doit être pour donner des items à son propriétaire. \nType: `Number`",
                                    "default": 3.0,
                                    "type": "number"
                                },
                                "run_speed": {
                                    "description": "Définit la vitesse à laquelle l'Entité doit courir lorsqu'elle donne des items à son propriétaire. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "throw_force": {
                                    "description": "Définit la force avec laquelle l'Entité doit jeter des items à son propriétaire. \nType: `Number`",
                                    "default": 0.20,
                                    "type": "number"
                                },
                                "throw_sound": {
                                    "description": "Définit le son à jouer lorsque l'Entité jette un item. \nType: `String`",
                                    "default": "item_thrown",
                                    "type": "string"
                                },
                                "vertical_throw_mul": {
                                    "description": "Définit le multiplicateur de lancer vertical qui est appliqué en plus de la force de lancer dans la direction verticale. \nType: `Number`",
                                    "default": 1.5,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.go_home": {
                            "description": "Force l'Entité à retourner à son point d'apparition. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "calculate_new_path_radius": {
                                    "description": "La distance en blocs à laquelle l'Entité doit être de son point d'apparition pour calculer un nouveau chemin. \nType: `Number`",
                                    "default": 2.0,
                                    "type": "number"
                                },
                                "goal_radius": {
                                    "description": "La distance en blocs à laquelle l'Entité considère qu'il a atteint le point d'apparition. \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number"
                                },
                                "interval": {
                                    "description": "Une valeur aléatoire pour déterminer quand se déplacer aléatoirement quelque part. Cela a une chance de 1/interval de choisir cet objectif. \nType: `Integer`",
                                    "default": 120,
                                    "type": "integer"
                                },
                                "on_failed": {
                                    "description": "Les événements à déclencher lorsque l'Entité échoue à atteindre son point d'apparition. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "on_home": {
                                    "description": "Les événements à déclencher lorsque l'Entité atteint son point d'apparition. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'Entité lorsqu'elle retourne à son point d'apparition. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.guardian_attack": {
                            "description": "Permet à l'Entité d'utiliser une attaque de rayon laser. \nType: `Object` \nNote: Ce composant ne s'exécutera pas si l'entité n'est pas un Gardien ou un Gardien Ancien.",
                            "type": "object",
                            "properties": {
                                "elder_extra_magic_damage": {
                                    "description": "Montant de dégâts supplémentaires infligés par l'attaque magique d'un Gardien Ancien. \nType: `Integer`",
                                    "default": 2,
                                    "type": "integer"
                                },
                                "hard_mode_extra_magic_damage": {
                                    "description": "Montant de dégâts supplémentaires infligés par l'attaque magique d'un Gardien en mode difficile. \nType: `Integer`",
                                    "default": 2,
                                    "type": "integer"
                                },
                                "magic_damage": {
                                    "description": "Montant de dégâts infligés par l'attaque magique d'un Gardien. \nType: `Integer`",
                                    "default": 1,
                                    "type": "integer"
                                },
                                "min_distance": {
                                    "description": "La distance en blocs à laquelle l'attaque du Gardien s'arrête si la cible est plus proche. \nType: `Number`",
                                    "default": 3,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "sound_delay_time": {
                                    "description": "Le temps en secondes à attendre après le début d'une attaque avant de jouer le son de l'attaque. \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number"
                                },
                                "x_max_rotation": {
                                    "description": "Rotation maximale (en degrés), sur l'axe X, que cette Entité peut appliquer tout en essayant de regarder la cible. \nType: `Number`",
                                    "default": 90,
                                    "type": "number"
                                },
                                "y_max_head_rotation": {
                                    "description": "Rotation maximale (en degrés), sur l'axe Y, que cette Entité peut appliquer tout en essayant de regarder la cible. \nType: `Number`",
                                    "default": 90,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.harvest_farm_block": {
                            "description": "Force l'Entité à chercher dans une zone des blocs de farmland avec de l'air au dessus. Si trouvé, l'Entité remplacera le bloc d'air en plantant un item de graine de son inventaire sur le bloc de farmland. \nType: `Object` \nNote: Cet objectif nécessite les composants 'minecraft:inventory' et 'minecraft:navigation' pour fonctionner. Cet objectif ne s'exécutera pas si l'entité n'a pas d'item dans son inventaire.",
                            "type": "object",
                            "properties": {
                                "goal_radius": {
                                    "description": "La distance en blocs à laquelle l'Entité considère qu'elle a atteint son objectif. \nType: `Number`",
                                    "default": 1.5,
                                    "type": "number"
                                },
                                "max_seconds_before_search": {
                                    "description": "Le temps maximum en secondes que l'objectif peut prendre avant de chercher le premier bloc de récolte. Le temps est choisi entre 0 et ce nombre. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "search_cooldown_max_seconds": {
                                    "description": "Le temps maximum en secondes que l'objectif peut prendre avant de chercher à nouveau un bloc de récolte, après avoir échoué à en trouver un. Le temps est choisi entre 0 et ce nombre. \nType: `Number`",
                                    "default": 8.0,
                                    "type": "number"
                                },
                                "search_count": {
                                    "description": "Le nombre de blocs choisis aléatoirement à chaque tick que l'Entité vérifiera pour un bloc de récolte. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "search_height": {
                                    "description": "La hauteur en blocs que l'Entité vérifiera pour un bloc de récolte. \nType: `Integer`",
                                    "default": 1,
                                    "type": "integer"
                                },
                                "search_range": {
                                    "description": "La distance en blocs que l'Entité vérifiera pour un bloc de récolte. \nType: `Integer`",
                                    "default": 16,
                                    "type": "integer"
                                },
                                "seconds_until_new_task": {
                                    "description": "Le temps en secondes que l'Entité attendra avant de chercher un nouveau bloc de récolte après avoir réussi à en trouver un. \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'Entité lorsqu'elle cherche un bloc de récolte. \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.hide": {
                            "description": "Force une Entité avec le composant 'minecraft:hide' à tenter de se déplacer vers un point d'intérêt (POI) et à se cacher. \nType: `Object` \nNote: Ce composant nécessite un point d'intérêt pour fonctionner correctement.",
                            "type": "object",
                            "properties": {
                                "duration": {
                                    "description": "Le temps en secondes que l'Entité réagit. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "poi_type": {
                                    "description": "Définit le type de POI à cacher. \nType: `String`",
                                    "const": "bed"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'Entité lorsqu'elle se cache. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "timeout_cooldown": {
                                    "description": "Le temps en secondes avant que l'Entité puisse réutiliser cet objectif après un échec ou un délai. \nType: `Number`",
                                    "default": 8.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.hold_ground": {
                            "description": "Force l'Entité à rester à sa position actuelle et à attaquer les entités qui s'approchent. \nType: `Object` \nNote: Cet objectif nécessite une cible pour fonctionner correctement.",
                            "type": "object",
                            "properties": {
                                "broadcast": {
                                    "description": "Définit si l'Entité doit diffuser sa cible à d'autres Entités de même type. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "broadcast_range": {
                                    "description": "La distance en blocs pour laquelle l'Entité diffusera sa cible. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "min_radius": {
                                    "description": "La distance minimale en blocs à laquelle l'Entité doit rester de sa cible. \nType: `Number`",
                                    "default": 10.0,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "within_radius_event": {
                                    "description": "Les événements à déclencher lorsque l'Entité est à portée de sa cible. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                }
                            }
                        },
                        "minecraft:behavior.hurt_by_target": {
                            "description": "Force l'Entité à cibler une autre Entité qui l'a blessée. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "alert_same_type": {
                                    "description": "Si vrai, les Entités de même type à proximité seront alertées des dégâts. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "entity_types": {
                                    "description": "Liste des types d'entités que cette Entité peut cibler lorsqu'elle est blessée. \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "cooldown": {
                                            "description": "Le temps en secondes que l'entité doit attendre avant de pouvoir être selectionné comme cible à nouveau. \nType: `Number`",
                                            "default": 0.0,
                                            "type": "number"
                                        },
                                        "filters": {
                                            "description": "Les filtres à appliquer pour sélectionner les entités à attaquer. \nType: `Minecraft Filter`",
                                            ...commonSchemas.minecraft_filter
                                        },
                                        "max_dist": {
                                            "description": "Distance maximale à laquelle l'entité doit être pour être sélectionnée comme cible. \nType: `Number`",
                                            "default": 16,
                                            "type": "number"
                                        },
                                        "must_see": {
                                            "description": "Si vrai, l'entité doit être visible pour être sélectionnée comme cible. \nType: `Boolean`",
                                            "default": false,
                                            "type": "boolean"
                                        },
                                        "must_see_forget_duration": {
                                            "description": "Le temps en secondes que l'entité doit être hors de vue pour être oubliée comme cible. \nType: `Number`",
                                            "default": 3.0,
                                            "type": "number"
                                        },
                                        "reevaluate_description": {
                                            "description": "Si vrai, l'entité sera réévaluée comme cible à chaque tick. \nType: `Boolean`",
                                            "default": false,
                                            "type": "boolean"
                                        },
                                        "sprint_speed_multiplier": {
                                            "description": "Multiplicateur de vitesse de sprint. 1,0 signifie conserver la vitesse normale, tandis que des nombres plus élevés accélèrent la vitesse de sprint. \nType: `Number`",
                                            "default": 1.0,
                                            "type": "number"
                                        },
                                        "walk_speed_multiplier": {
                                            "description": "Multiplicateur de vitesse de marche. 1,0 signifie conserver la vitesse normale, tandis que des nombres plus élevés accélèrent la vitesse de marche. \nType: `Number`",
                                            "default": 1.0,
                                            "type": "number"
                                        }
                                    }
                                },
                                "hurt_owner": {
                                    "description": "Si vrai, l'Entité ciblera le propriétaire et les autres Entités du même type que le propriétaire. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                }
                            }
                        },
                        "minecraft:behavior.inspect_bookshelf": {
                            "description": "Permet à l'Entité de regarder et inspecter une bibliothèque. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "goal_radius": {
                                    "description": "La distance en blocs à laquelle l'Entité considère qu'elle a atteint son objectif. \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "search_count": {
                                    "description": "Le nombre de bibliothèques à inspecter à chaque tick. \nType: `Integer`",
                                    "default": 10,
                                    "type": "integer"
                                },
                                "search_height": {
                                    "description": "La hauteur en blocs que l'Entité inspectera pour une bibliothèque. \nType: `Integer`",
                                    "default": 1,
                                    "type": "integer"
                                },
                                "search_range": {
                                    "description": "La distance en blocs que l'Entité inspectera pour une bibliothèque. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'Entité lorsqu'elle inspecte une bibliothèque. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.investigate_suspicious_location": {
                            "description": "Force l'Entité à se déplacer vers une position 'suspecte' basée sur les données recueillies dans 'minecraft:suspect_tracking'. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "goal_radius": {
                                    "description": "La distance en blocs à laquelle l'Entité considère qu'elle a atteint son objectif. \nType: `Number`",
                                    "default": 1.5,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'Entité lorsqu'elle se déplace vers une position suspecte. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.jump_around_target": {
                            "description": "Permet à l'Entité de sauter autour de sa cible. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "check_collision": {
                                    "description": "Active les vérifications de collision lors du calcul du saut. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "entity_bounding_box_scale": {
                                    "description": "Mise à l'échelle temporaire appliquée aux limites AABB de l'entité lors du saut. Une plus petite boîte de collision réduit le risque de collisions pendant le saut. Lorsque check_collision est vrai, cela augmente également la chance de pouvoir sauter lorsqu'on est proche des obstacles. \nType: `Number`",
                                    "default": 0.7,
                                    "type": "number"
                                },
                                "filters": {
                                    "description": "Les filtres à appliquer pour sélectionner les entités à sauter autour. \nType: `Minecraft Filter`",
                                    ...commonSchemas.minecraft_filter
                                },
                                "jump_angles": {
                                    "description": "Les angles de saut en degrés flottants autorisés lors de l'exécution du saut. L'ordre dans lequel les angles sont choisis est aléatoire. \nType: `Number[]`",
                                    "default": [40.0, 55.0, 60.0, 75.0, 80.0],
                                    "type": "array",
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "jump_cooldown_duration": {
                                    "description": "Le temps en secondes à attendre avant de pouvoir sauter à nouveau. \nType: `Number`",
                                    "default": 0.50,
                                    "type": "number"
                                },
                                "jump_cooldown_when_hurt_duration": {
                                    "description": "Le temps en secondes à attendre avant de pouvoir sauter à nouveau après avoir été blessé. \nType: `Number`",
                                    "default": 0.10,
                                    "type": "number"
                                },
                                "landing_distance_from_target": {
                                    "description": "La plage déterminant à quelle distance de la cible la position d'atterrissage peut être lors du saut. \nType: `Number[2]`",
                                    "default": [4.0, 8.0],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "landing_position_spread_degrees": {
                                    "description": "Cet angle (en degrés) est utilisé pour contrôler la dispersion lors du choix d'une position d'atterrissage derrière la cible. Un angle de dispersion nul signifie que la position d'atterrissage sera droite derrière la cible sans variance. Un angle de dispersion de 90 degrés signifie que la position d'atterrissage peut être jusqu'à 45 degrés à gauche et à droite de la position droite derrière la direction de vue de la cible. \nType: `Integer`",
                                    "default": 90,
                                    "type": "integer"
                                },
                                "last_hurt_duration": {
                                    "description": "Le temps en secondes pendant lequel l'entité se souvient de la dernière fois qu'elle a été blessée. Si l'entité a été blessée dans ce délai, le jump_cooldown_when_hurt_duration sera utilisé au lieu de jump_cooldown_duration. \nType: `Number`",
                                    "default": 2.0,
                                    "type": "number"
                                },
                                "line_of_sight_obstruction_height_ignore": {
                                    "description": "Si la ligne de vue de l'entité vers sa cible est obstruée par un obstacle dont la hauteur est inférieure à ce nombre, l'obstacle sera ignoré, et l'objectif tentera de trouver une position d'atterrissage valide. \nType: `Integer`",
                                    "default": 4,
                                    "type": "integer"
                                },
                                "max_jump_velocity": {
                                    "description": "La vitesse maximale à laquelle un saut peut être effectué. \nType: `Number`",
                                    "default": 1.4,
                                    "type": "number"
                                },
                                "prepare_jump_duration": {
                                    "description": "Le temps en secondes à passer à préparer le saut. \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number"
                                },
                                "required_vertical_space": {
                                    "description": "L'espace vertical minimum requis pour que l'entité puisse sauter. \nType: `Integer`",
                                    "default": 4,
                                    "type": "integer"
                                },
                                "snap_to_surface_block_range": {
                                    "description": "Le nombre de blocs au-dessus et en dessous de la position cible de saut qui seront vérifiés pour trouver une surface sur laquelle atterrir. \nType: `Integer`",
                                    "default": 10,
                                    "type": "integer"
                                },
                                "valid_distance_to_target": {
                                    "description": "La distance minimale et maximale à laquelle la cible doit être pour que le saut se produise. \nType: `Number[2]`",
                                    "default": [4.0, 20.0],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "number"
                                    }
                                }
                            }
                        },
                        "minecraft:behavior.jump_to_block": {
                            "description": "Permet à l'Entité de chercher un bloc à sauter et de sauter dessus. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "cooldown_range": {
                                    "description": "La plage de temps en secondes à attendre avant de pouvoir sauter à nouveau. \nType: `Number[2]`",
                                    "default": [10, 20],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "number",
                                        "minimum": 0.0
                                    }
                                },
                                "forbidden_blocks": {
                                    "description": "Les blocs que l'Entité ne doit pas sauter. \nType: `String[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                    }
                                },
                                "max_velocity": {
                                    "description": "La vitesse maximale à laquelle l'Entité peut sauter. \nType: `Number`",
                                    "default": 1.5,
                                    "type": "number"
                                },
                                "minimum_distance": {
                                    "description": "La distance minimale (en blocs) de l'Entité à un bloc, pour considérer sauter dessus. \nType: `Integer`",
                                    "default": 2,
                                    "type": "integer"
                                },
                                "minimum_path_length": {
                                    "description": "La longueur minimale (en blocs) du chemin de l'Entité à un bloc, pour considérer sauter dessus. \nType: `Integer`",
                                    "default": 5,
                                    "type": "integer"
                                },
                                "preferred_blocks": {
                                    "description": "Les blocs que l'Entité préfère sauter. \nType: `String[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                    }
                                },
                                "preferred_blocks_chance": {
                                    "description": "La chance (entre 0.0 et 1.0) que l'Entité saute sur un bloc préféré, si à portée. Ne s'applique que si des blocs préférés sont définis. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number",
                                    "minimum": 0.0,
                                    "maximum": 1.0
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "scale_factor": {
                                    "description": "Le facteur d'échelle de la boîte de collision de l'Entité lorsqu'elle saute. \nType: `Number`",
                                    "default": 0.7,
                                    "type": "number"
                                },
                                "search_height": {
                                    "description": "La hauteur maximale (en blocs) à laquelle l'Entité peut sauter. \nType: `Integer`",
                                    "default": 10,
                                    "type": "integer",
                                    "minimum": 2,
                                    "maximum": 15
                                },
                                "search_width": {
                                    "description": "La largeur (en blocs) de la zone de recherche de l'Entité pour un bloc à sauter. \nType: `Integer`",
                                    "default": 8,
                                    "type": "integer",
                                    "minimum": 2,
                                    "maximum": 15
                                }
                            }
                        },
                        "minecraft:behavior.knockback_roar": {
                            "description": "Force une Entité à émettre un effet de rugissement qui repousse les autres Entités dans un rayon défini à partir de l'endroit où le rugissement a été émis. \nType: `Object` \nNote: Ce composant nécessite un événement de déclenchement pour fonctionner correctement.",
                            "type": "object",
                            "properties": {
                                "attack_time": {
                                    "description": "Le délai après lequel le knockback se produit (en secondes). \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number"
                                },
                                "cooldown_time": {
                                    "description": "Le temps en secondes que l'Entité doit attendre avant de pouvoir émettre un autre rugissement. \nType: `Number`",
                                    "default": 0.10,
                                    "type": "number"
                                },
                                "damage_filters": {
                                    "description": "La liste des conditions qu'une autre entité doit remplir pour être une cible valide pour infliger des dégâts. \nType: `Minecraft Filter`",
                                    ...commonSchemas.minecraft_filter
                                },
                                "duration": {
                                    "description": "La durée maximale du rugissement (en secondes). \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "knockback_damage": {
                                    "description": "Les dégâts infligés par le rugissement de recul. \nType: `Integer`",
                                    "default": 6,
                                    "type": "integer"
                                },
                                "knockback_filters": {
                                    "description": "La liste des conditions qu'une autre entité doit remplir pour être une cible valide pour appliquer un knockback. \nType: `Minecraft Filter`",
                                    ...commonSchemas.minecraft_filter
                                },
                                "knockback_height_cap": {
                                    "description": "La hauteur maximale pour le knockback. \nType: `Number`",
                                    "default": 0.40,
                                    "type": "number"
                                },
                                "knockback_horizontal_strength": {
                                    "description": "La force de knockback horizontale. \nType: `Integer`",
                                    "default": 4,
                                    "type": "integer"
                                },
                                "knockback_range": {
                                    "description": "Le rayon (en blocs) de l'effet de knockback. \nType: `Integer`",
                                    "default": 4,
                                    "type": "integer"
                                },
                                "knockback_vertical_strength": {
                                    "description": "La force de knockback vertical. \nType: `Integer`",
                                    "default": 4,
                                    "type": "integer"
                                },
                                "on_roar_end": {
                                    "description": "Les événements à déclencher lorsque le rugissement se termine. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.lay_down": {
                            "description": "Permet à l'Entité de s'allonger de manière aléatoire pendant une période de temps. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "interval": {
                                    "description": "Une valeur aléatoire pour déterminer à quels intervalles quelque chose peut se produire. Cela a une chance de 1/interval de choisir cet objectif. \nType: `Integer`",
                                    "default": 120,
                                    "type": "integer"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "random_stop_interval": {
                                    "description": "Une valeur aléatoire pour déterminer à quels intervalles l'objectif de l'IA peut s'arrêter. Cela a une chance de 1/interval de s'arrêter à cet objectif. \nType: `Integer`",
                                    "default": 120,
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.lay_egg": {
                            "description": "Permet à l'Entité de pondre un oeuf sur certains types de blocs si l'Entité est enceinte. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "allow_laying_from_below": {
                                    "description": "Permet à l'Entité de pondre ses oeufs depuis le dessous de la cible si elle ne peut pas y accéder. C'est utile si le bloc cible est de l'eau avec de l'air au-dessus, car les Entités peuvent ne pas pouvoir accéder au bloc d'air au-dessus de l'eau. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "egg_type": {
                                    "description": "Bloc à placer pour l'oeuf. Si c'est un oeuf de tortue, le nombre d'oeufs dans le bloc est défini aléatoirement. \nType: `String`",
                                    "default": "minecraft:turtle_egg",
                                    "type": "string"
                                },
                                "goal_radius": {
                                    "description": "La distance en blocs à laquelle l'Entité considère qu'elle a atteint son objectif. \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number"
                                },
                                "lay_egg_sound": {
                                    "description": "Le nom de l'événement sonore pour pondre un oeuf. \nType: `String`",
                                    "default": "lay_egg",
                                    "type": "string"
                                },
                                "lay_seconds": {
                                    "description": "La durée du processus de ponte de l'oeuf en secondes. \nType: `Number`",
                                    "default": 10.0,
                                    "type": "number"
                                },
                                "on_lay": {
                                    "description": "Les événements à déclencher lorsque l'Entité pond un oeuf. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "search_height": {
                                    "description": "La hauteur en blocs que l'Entité cherchera un bloc cible pour se déplacer. \nType: `Integer`",
                                    "default": 1,
                                    "type": "integer"
                                },
                                "search_range": {
                                    "description": "La distance en blocs que l'Entité cherchera un bloc cible pour se déplacer. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'Entité lorsqu'elle pond un oeuf. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "target_blocks": {
                                    "description": "Les blocs sur lesquels l'Entité peut pondre ses oeufs. \nType: `String[]`",
                                    "default": ["minecraft:sand"],
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    }
                                },
                                "target_materials_above_block": {
                                    "description": "Types de matériaux qui peuvent exister au-dessus du bloc cible. Les types valides sont Air, Water et Lava. \nType: `String[]`",
                                    "default": ["Air"],
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                        "enum": ["Air", "Water", "Lava"]
                                    }
                                },
                                "use_default_animation": {
                                    "description": "Spécifie si l'animation de ponte d'oeuf par défaut doit être jouée lorsque l'oeuf est placé ou non. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                }
                            }
                        },
                        "minecraft:behavior.leap_at_target": {
                            "description": "Force l'Entité à sauter vers une cible. \nType: `Object` \nNote: Cet objectif nécessite une cible pour fonctionner correctement.",
                            "type": "object",
                            "properties": {
                                "must_be_on_ground": {
                                    "description": "Si vrai, l'Entité ne sautera vers sa cible que si elle est au sol. Le définir sur faux lui permettra de sauter même si elle est déjà en l'air. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "set_persistent": {
                                    "description": "Définit si l'Entité doit être persistante lorsqu'elle cible un joueur. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "target_dist": {
                                    "description": "La distance en blocs que l'Entité sautera vers sa cible. \nType: `Number`",
                                    "default": 0.3,
                                    "type": "number"
                                },
                                "yd": {
                                    "description": "La hauteur en blocs que l'Entité sautera vers sa cible. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.look_at_entity": {
                            "description": "Permet à l'Entité de regarder une Entité spécifique en tournant la pose de l'os de la tête dans une limite définie. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "angle_of_view_horizontal": {
                                    "description": "L'angle en degrés que l'Entité peut voir dans l'axe X (gauche-droite). \nType: `Integer`",
                                    "default": 360,
                                    "type": "integer"
                                },
                                "angle_of_view_vertical": {
                                    "description": "L'angle en degrés que l'Entité peut voir dans l'axe Y (haut-bas). \nType: `Integer`",
                                    "default": 360,
                                    "type": "integer"
                                },
                                "filters": {
                                    "description": "Les filtres à appliquer pour sélectionner les entités à regarder. \nType: `Minecraft Filter`",
                                    ...commonSchemas.minecraft_filter
                                },
                                "look_distance": {
                                    "description": "La distance en blocs à laquelle l'Entité regardera une autre Entité. \nType: `Number`",
                                    "default": 8.0,
                                    "type": "number"
                                },
                                "look_time": {
                                    "description": "La durée en secondes pendant laquelle l'Entité regardera une autre Entité. \nType: `Number[2]`",
                                    "default": [2, 4],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "probability": {
                                    "description": "La probabilité de regarder l'entité. Une valeur de 1,00 est de 100%. \nType: `Number`",
                                    "default": 0.02,
                                    "type": "number",
                                    "minimum": 0.0,
                                    "maximum": 1.0
                                }
                            }
                        },
                        "minecraft:behavior.look_at_player": {
                            "description": "Force une Entité à regarder le joueur en tournant la pose de l'os de la tête dans une limite définie. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "angle_of_view_horizontal": {
                                    "description": "L'angle en degrés que l'Entité peut voir dans l'axe X (gauche-droite). \nType: `Integer`",
                                    "default": 360,
                                    "type": "integer"
                                },
                                "angle_of_view_vertical": {
                                    "description": "L'angle en degrés que l'Entité peut voir dans l'axe Y (haut-bas). \nType: `Integer`",
                                    "default": 360,
                                    "type": "integer"
                                },
                                "look_distance": {
                                    "description": "La distance en blocs à laquelle l'Entité regardera le joueur. \nType: `Number`",
                                    "default": 8.0,
                                    "type": "number"
                                },
                                "look_time": {
                                    "description": "La durée en secondes pendant laquelle l'Entité regardera le joueur. \nType: `Number[2]`",
                                    "default": [2, 4],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "probability": {
                                    "description": "La probabilité de regarder le joueur. Une valeur de 1,00 est de 100%. \nType: `Number`",
                                    "default": 0.02,
                                    "type": "number",
                                    "minimum": 0.0,
                                    "maximum": 1.0
                                },
                                "target_distance": {
                                    "description": "La distance en blocs à laquelle l'Entité choisira un joueur. \nType: `Number`",
                                    "default": 6.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.look_at_target": {
                            "description": "Force une Entité à regarder une cible en tournant la pose de l'os de la tête dans une limite définie. \nType: `Object` \nNote: Cet objectif nécessite une cible pour fonctionner correctement.",
                            "type": "object",
                            "properties": {
                                "angle_of_view_horizontal": {
                                    "description": "L'angle en degrés que l'Entité peut voir dans l'axe X (gauche-droite). \nType: `Integer`",
                                    "default": 360,
                                    "type": "integer"
                                },
                                "angle_of_view_vertical": {
                                    "description": "L'angle en degrés que l'Entité peut voir dans l'axe Y (haut-bas). \nType: `Integer`",
                                    "default": 360,
                                    "type": "integer"
                                },
                                "look_distance": {
                                    "description": "La distance en blocs à laquelle l'Entité regardera une cible. \nType: `Number`",
                                    "default": 8.0,
                                    "type": "number"
                                },
                                "look_time": {
                                    "description": "La durée en secondes pendant laquelle l'Entité regardera une cible. \nType: `Number[2]`",
                                    "default": [2, 4],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "probability": {
                                    "description": "La probabilité de regarder la cible. Une valeur de 1,00 est de 100%. \nType: `Number`",
                                    "default": 0.02,
                                    "type": "number",
                                    "minimum": 0.0,
                                    "maximum": 1.0
                                }
                            }
                        },
                        "minecraft:behavior.look_at_trading_player": {
                            "description": "Force une Entité à regarder le joueur qui est actuellement en train de commercer avec l'Entité. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "angle_of_view_horizontal": {
                                    "description": "L'angle en degrés que l'Entité peut voir dans l'axe X (gauche-droite). \nType: `Integer`",
                                    "default": 360,
                                    "type": "integer"
                                },
                                "angle_of_view_vertical": {
                                    "description": "L'angle en degrés que l'Entité peut voir dans l'axe Y (haut-bas). \nType: `Integer`",
                                    "default": 360,
                                    "type": "integer"
                                },
                                "look_distance": {
                                    "description": "La distance en blocs à laquelle l'Entité regardera le joueur qui commerce avec elle. \nType: `Number`",
                                    "default": 8.0,
                                    "type": "number"
                                },
                                "look_time": {
                                    "description": "La durée en secondes pendant laquelle l'Entité regardera le joueur qui commerce avec elle. \nType: `Number[2]`",
                                    "default": [2, 4],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "probability": {
                                    "description": "La probabilité de regarder le joueur qui commerce avec l'Entité. Une valeur de 1,00 est de 100%. \nType: `Number`",
                                    "default": 0.02,
                                    "type": "number",
                                    "minimum": 0.0,
                                    "maximum": 1.0
                                }
                            }
                        },
                        "minecraft:behavior.make_love": {
                            "description": "Force une Entité à interagir avec d'autres Entités similaires pour produire une progéniture. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.melee_attack": {
                            "description": "Force une Entité à effectuer des attaques au corps à corps. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "attack_once": {
                                    "description": "Permet à l'entité d'utiliser ce comportement d'attaque une seule fois. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "attack_types": {
                                    "description": "Liste des types d'entités à attaquer. \nType: `String[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.entity_ids
                                    }
                                },
                                "can_spread_on_fire": {
                                    "description": "Définit si l'entité peut mettre le feu à d'autres entités lorsqu'elle les attaque. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "cooldown_time": {
                                    "description": "Le temps en secondes entre les attaques. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "inner_boundary_time_increase": {
                                    "description": "Temps (en secondes) à ajouter au recalcul du chemin d'attaque lorsque la cible est au-delà de la 'path_inner_boundary'. \nType: `Number`",
                                    "default": 0.25,
                                    "type": "number"
                                },
                                "max_dist": {
                                    "description": "Pas utilisé dans le comportement. \nType: `Number`",
                                    "type": "number"
                                },
                                "max_path_time": {
                                    "description": "Temps maximum (en secondes) pour recalculer le chemin d'attaque. \nType: `Number`",
                                    "default": 0.55,
                                    "type": "number"
                                },
                                "melee_fov": {
                                    "description": "Champ de vision (en degrés) lors de l'utilisation du composant de détection pour détecter une cible d'attaque. \nType: `Number`",
                                    "default": 90,
                                    "type": "number"
                                },
                                "min_path_time": {
                                    "description": "Temps minimum (en secondes) pour recalculer le chemin d'attaque. \nType: `Number`",
                                    "default": 0.2,
                                    "type": "number"
                                },
                                "on_attack": {
                                    "description": "L'événement à déclencher lorsque l'entité attaque. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "on_kill": {
                                    "description": "L'événement à déclencher lorsque l'entité tue une autre entité. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "outer_boundary_time_increase": {
                                    "description": "Temps (en secondes) à ajouter au recalculer lorsque la cible est au-delà de la 'path_outer_boundary'. \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number"
                                },
                                "path_fail_time_increase": {
                                    "description": "Temps (en secondes) à ajouter au recalcul du chemin d'attaque lorsque cette entité ne peut pas se déplacer le long du chemin actuel. \nType: `Number`",
                                    "default": 0.75,
                                    "type": "number"
                                },
                                "path_inner_boundary": {
                                    "description": "Distance à laquelle l'entité doit être à l'intérieur pour augmenter le recalcul du chemin d'attaque par 'inner_boundary_tick_increase'. \nType: `Number`",
                                    "default": 16,
                                    "type": "number"
                                },
                                "path_outer_boundary": {
                                    "description": "Distance à laquelle l'entité doit être à l'extérieur pour augmenter le recalcul du chemin d'attaque par 'outer_boundary_tick_increase'. \nType: `Number`",
                                    "default": 32,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "random_stop_interval": {
                                    "description": "Cette entité aura une chance de 1 sur N d'arrêter son attaque actuelle, où N = 'random_stop_interval'. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "reach_multiplier": {
                                    "description": "Utilisé avec la taille de la base de l'entité pour déterminer la distance minimale de la cible avant de tenter de causer des dégâts d'attaque. \nType: `Number`",
                                    "default": 1.5,
                                    "type": "number"
                                },
                                "require_complete_path": {
                                    "description": "Bascule (on/off) la nécessité d'avoir un chemin complet de l'entité à la cible lors de l'utilisation de ce comportement d'attaque. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "set_persistent": {
                                    "description": "Permet à l'entité d'être définie pour persister lorsqu'elle cible un joueur. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "speed_multiplier": {
                                    "description": "Multiplicateur de vitesse de mouvement de l'entité lorsqu'elle utilise cet objectif AI. \nType: `Number`",
                                    "default": 1,
                                    "type": "number"
                                },
                                "target_dist": {
                                    "description": "Inutilisé. \nType: `Number`",
                                    "type": "number"
                                },
                                "track_target": {
                                    "description": "Permet à l'entité de suivre la cible d'attaque, même si l'entité n'a pas de détection. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "x_max_rotation": {
                                    "description": "Rotation maximale (en degrés) sur l'axe X que cette entité peut tourner lorsqu'elle tente de regarder la cible. \nType: `Number`",
                                    "default": 30,
                                    "type": "number"
                                },
                                "y_max_head_rotation": {
                                    "description": "Rotation maximale (en degrés) sur l'axe Y que cette entité peut tourner la tête lorsqu'elle tente de regarder la cible. \nType: `Number`",
                                    "default": 30,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.melee_box_attack": {
                            "description": "Force une Entité à effectuer des attaques au corps à corps avec des calculs de portée basés sur des boîtes de collision. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "attack_once": {
                                    "description": "Permet à l'entité d'utiliser ce comportement d'attaque une seule fois. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "attack_types": {
                                    "description": "Liste des types d'entités à attaquer. \nType: `String[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.entity_ids
                                    }
                                },
                                "can_spread_on_fire": {
                                    "description": "Définit si l'entité peut mettre le feu à d'autres entités lorsqu'elle les attaque. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "cooldown_time": {
                                    "description": "Le temps en secondes entre les attaques. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "horizontal_reach": {
                                    "description": "La portée d'attaque de l'entité sera une boîte de la taille des limites de l'entité augmentée de cette valeur dans toutes les directions horizontales. \nType: `Number`",
                                    "default": 0.8,
                                    "type": "number"
                                },
                                "inner_boundary_time_increase": {
                                    "description": "Temps (en secondes) à ajouter au recalcul du chemin d'attaque lorsque la cible est au-delà de la 'path_inner_boundary'. \nType: `Number`",
                                    "default": 0.25,
                                    "type": "number"
                                },
                                "max_dist": {
                                    "description": "Pas utilisé dans le comportement. \nType: `Number`",
                                    "type": "number"
                                },
                                "max_path_time": {
                                    "description": "Temps maximum (en secondes) pour recalculer le chemin d'attaque. \nType: `Number`",
                                    "default": 0.55,
                                    "type": "number"
                                },
                                "melee_fov": {
                                    "description": "Champ de vision (en degrés) lors de l'utilisation du composant de détection pour détecter une cible d'attaque. \nType: `Number`",
                                    "default": 90,
                                    "type": "number"
                                },
                                "min_path_time": {
                                    "description": "Temps minimum (en secondes) pour recalculer le chemin d'attaque. \nType: `Number`",
                                    "default": 0.2,
                                    "type": "number"
                                },
                                "on_attack": {
                                    "description": "L'événement à déclencher lorsque l'entité attaque. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "outer_boundary_time_increase": {
                                    "description": "Temps (en secondes) à ajouter au recalculer lorsque la cible est au-delà de la 'path_outer_boundary'. \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number"
                                },
                                "path_fail_time_increase": {
                                    "description": "Temps (en secondes) à ajouter au recalcul du chemin d'attaque lorsque cette entité ne peut pas se déplacer le long du chemin actuel. \nType: `Number`",
                                    "default": 0.75,
                                    "type": "number"
                                },
                                "path_inner_boundary": {
                                    "description": "Distance à laquelle l'entité doit être à l'intérieur pour augmenter le recalcul du chemin d'attaque par 'inner_boundary_tick_increase'. \nType: `Number`",
                                    "default": 16,
                                    "type": "number"
                                },
                                "path_outer_boundary": {
                                    "description": "Distance à laquelle l'entité doit être à l'extérieur pour augmenter le recalcul du chemin d'attaque par 'outer_boundary_tick_increase'. \nType: `Number`",
                                    "default": 32,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "random_stop_interval": {
                                    "description": "Cette entité aura une chance de 1 sur N d'arrêter son attaque actuelle, où N = 'random_stop_interval'. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "reach_multiplier": {
                                    "description": "Utilisé avec la taille de la base de l'entité pour déterminer la distance minimale de la cible avant de tenter de causer des dégâts d'attaque. \nType: `Number`",
                                    "default": 1.5,
                                    "type": "number"
                                },
                                "require_complete_path": {
                                    "description": "Bascule (on/off) la nécessité d'avoir un chemin complet de l'entité à la cible lors de l'utilisation de ce comportement d'attaque. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "set_persistent": {
                                    "description": "Permet à l'entité d'être définie pour persister lorsqu'elle cible un joueur. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "speed_multiplier": {
                                    "description": "Multiplicateur de vitesse de mouvement de l'entité lorsqu'elle utilise cet objectif AI. \nType: `Number`",
                                    "default": 1,
                                    "type": "number"
                                },
                                "target_dist": {
                                    "description": "Inutilisé. \nType: `Number`",
                                    "type": "number"
                                },
                                "track_target": {
                                    "description": "Permet à l'entité de suivre la cible d'attaque, même si l'entité n'a pas de détection. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "x_max_rotation": {
                                    "description": "Rotation maximale (en degrés) sur l'axe X que cette entité peut tourner lorsqu'elle tente de regarder la cible. \nType: `Number`",
                                    "default": 30,
                                    "type": "number"
                                },
                                "y_max_head_rotation": {
                                    "description": "Rotation maximale (en degrés) sur l'axe Y que cette entité peut tourner la tête lorsqu'elle tente de regarder la cible. \nType: `Number`",
                                    "default": 30,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.mingle": {
                            "description": "Force une Entité à naviguer jusqu'au point d'intérêt de la cloche du village et à interagir avec d'autres entités qui ont été assignées. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "cooldown_time": {
                                    "description": "Le temps en secondes que l'entité doit attendre avant de réutiliser l'objectif. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "duration": {
                                    "description": "La durée en secondes pendant laquelle l'entité discutera avec une autre entité. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "mingle_distance": {
                                    "description": "La distance de son partenaire avec laquelle cette entité se mêlera. Si le type d'entité n'est pas le même que l'entité, cette valeur doit être identique sur les deux entités. \nType: `Number`",
                                    "default": 2.0,
                                    "type": "number"
                                },
                                "mingle_partner_type": {
                                    "description": "Le type d'entité avec lequel cette entité est autorisée à se mêler. \nType: `String[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.entity_ids
                                    }
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle se mêle. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.mount_pathing": {
                            "description": "Force une Entité à se déplacer seule tout en étant montée. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle est montée. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "target_dist": {
                                    "description": "La distance en blocs à laquelle l'entité considère qu'elle a atteint son objectif. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "track_target": {
                                    "description": "Si vrai, cette entité poursuivra la cible tant qu'elle sera une cible valide. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                }
                            }
                        },
                        "minecraft:behavior.move_around_target": {
                            "description": "Force une entité à se déplacer autour d'une cible. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "destination_pos_search_spread_degrees": {
                                    "description": "Cet angle (en degrés) est utilisé pour contrôler la dispersion lors du choix d'une position de destination derrière la cible. \nType: `Number`",
                                    "default": 90.0,
                                    "type": "number"
                                },
                                "destination_position_range": {
                                    "description": "La plage de distances de l'entité cible dans laquelle l'objectif doit rechercher une position pour déplacer l'entité propriétaire. \nType: `Number[2]`",
                                    "default": [4.0, 8.0],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "filters": {
                                    "description": "Les conditions qui doivent être remplies pour que le comportement commence. \nType: `Minecraft Filter`",
                                    ...commonSchemas.minecraft_filter
                                },
                                "height_difference_limit": {
                                    "description": "La distance en hauteur (en blocs) entre l'entité propriétaire et la cible doit être inférieure à cette valeur lorsque l'entité propriétaire vérifie si elle est trop proche et doit s'éloigner de la cible. \nType: `Number`",
                                    "default": 10.0,
                                    "type": "number",
                                    "minimum": 0.0
                                },
                                "horizontal_search_distance": {
                                    "description": "La distance de recherche horizontale (en blocs) lors de la recherche d'une position pour s'éloigner de la cible. \nType: `Integer`",
                                    "default": 5,
                                    "type": "integer"
                                },
                                "movement_speed": {
                                    "description": "La vitesse à laquelle l'entité doit se déplacer vers sa position cible. \nType: `Number`",
                                    "default": 0.6,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "vertical_search_distance": {
                                    "description": "La distance de recherche verticale (en blocs) lors de la recherche d'une position pour s'éloigner de la cible. \nType: `Integer`",
                                    "default": 5,
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.move_indoors": {
                            "description": "Permet à une Entité de se déplacer à l'intérieur. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace à l'intérieur. \nType: `Number`",
                                    "default": 0.8,
                                    "type": "number"
                                },
                                "timeout_cooldown": {
                                    "description": "Le temps de recharge en secondes avant que l'objectif puisse être réutilisé après l'échec de la recherche de chemin. \nType: `Number`",
                                    "default": 8.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.move_outdoors": {
                            "description": "Force une Entité à se déplacer à l'extérieur. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "goal_radius": {
                                    "description": "Le rayon à partir du bloc cible pour compter comme atteignant l'objectif. \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "search_count": {
                                    "description": "Le nombre de fois à essayer de trouver une position aléatoire à l'extérieur avant d'échouer. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "search_height": {
                                    "description": "La plage de hauteurs à partir de laquelle rechercher une position à l'extérieur. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "search_range": {
                                    "description": "La plage de distances à partir de laquelle rechercher une position à l'extérieur. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace à l'extérieur. \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number"
                                },
                                "timeout_cooldown": {
                                    "description": "Le temps de recharge en secondes avant que l'objectif puisse être réutilisé après l'échec de la recherche de chemin. \nType: `Number`",
                                    "default": 8.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.move_through_village": {
                            "description": "Force une Entité à naviguer autour d'un village en créant un chemin à patrouiller. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "only_at_night": {
                                    "description": "Si vrai, le mob ne se déplacera que dans le village pendant la nuit. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace à travers le village. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.move_to_block": {
                            "description": "Permet à une Entité de se déplacer vers un bloc. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "goal_radius": {
                                    "description": "La distance en blocs à l'intérieur de laquelle l'entité considère avoir atteint l'objectif. \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number"
                                },
                                "on_reach": {
                                    "description": "L'événement à déclencher lorsque l'entité atteint le bloc. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "on_stay_completed": {
                                    "description": "L'événement à déclencher lorsque l'Entité reste sur le bloc pendant la durée de séjour('stay_duration'). \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "search_height": {
                                    "description": "La plage de hauteurs à partir de laquelle rechercher une position. \nType: `Integer`",
                                    "default": 1,
                                    "type": "integer"
                                },
                                "search_range": {
                                    "description": "La plage de distances à partir de laquelle rechercher une position. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace vers le bloc. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "start_chance": {
                                    "description": "La chance de démarrer le comportement (appliquée après chaque intervalle de tick aléatoire). \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number",
                                    "minimum": 0.0,
                                    "maximum": 1.0
                                },
                                "stay_duration": {
                                    "description": "Le nombre de ticks nécessaires pour terminer un séjour au bloc. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "target_blocks": {
                                    "description": "Les types de blocs vers lesquels l'entité doit se déplacer. \nType: `String[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                    }
                                },
                                "target_offset": {
                                    "description": "Décalage à ajouter à la position cible sélectionnée. \nType: `Number[3]`",
                                    "default": [0, 0, 0],
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "target_selection_method": {
                                    "description": "Le type de bloc à trouver correspondant à la spécification. \nType: `String`",
                                    "default": "nearest",
                                    "type": "string",
                                    "enum": ["nearest", "random"]
                                },
                                "tick_interval": {
                                    "description": "L'intervalle moyen en ticks pour essayer d'exécuter ce comportement. \nType: `Integer`",
                                    "default": 20,
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.move_to_land": {
                            "description": "Force une Entité à se déplacer vers la terre lorsqu'elle se trouve dans un milieu non terrestre tel que la lave ou l'eau. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "goal_radius": {
                                    "description": "La distance en blocs à l'intérieur de laquelle l'entité considère avoir atteint l'objectif. \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "search_count": {
                                    "description": "Le nombre de blocs que le mob vérifiera à chaque tick dans sa plage de recherche et sa hauteur pour un bloc valide vers lequel se déplacer. Une valeur de 0 fera vérifier au mob chaque bloc dans la plage en un tick. \nType: `Integer`",
                                    "default": 10,
                                    "type": "integer"
                                },
                                "search_height": {
                                    "description": "La plage de hauteurs à partir de laquelle rechercher une position. \nType: `Integer`",
                                    "default": 1,
                                    "type": "integer"
                                },
                                "search_range": {
                                    "description": "La plage de distances à partir de laquelle rechercher une position. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace vers la terre. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.move_to_lava": {
                            "description": "Force une Entité à se déplacer vers la lave lorsqu'elle se trouve sur terre. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "goal_radius": {
                                    "description": "La distance en blocs à l'intérieur de laquelle l'entité considère avoir atteint l'objectif. \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "search_count": {
                                    "description": "Le nombre de blocs que le mob vérifiera à chaque tick dans sa plage de recherche et sa hauteur pour un bloc valide vers lequel se déplacer. Une valeur de 0 fera vérifier au mob chaque bloc dans la plage en un tick. \nType: `Integer`",
                                    "default": 10,
                                    "type": "integer"
                                },
                                "search_height": {
                                    "description": "La plage de hauteurs à partir de laquelle rechercher une position. \nType: `Integer`",
                                    "default": 1,
                                    "type": "integer"
                                },
                                "search_range": {
                                    "description": "La plage de distances à partir de laquelle rechercher une position. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace vers la lave. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.move_to_liquid": {
                            "description": "Force une Entité à se déplacer dans un liquide lorsqu'elle se trouve sur terre. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "goal_radius": {
                                    "description": "La distance en blocs à l'intérieur de laquelle l'entité considère avoir atteint l'objectif. \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number"
                                },
                                "material_type": {
                                    "description": "Le type de liquide vers lequel l'entité doit se déplacer. \nType: `String`",
                                    "default": "Any",
                                    "type": "string",
                                    "enum": ["Any", "Lava", "Water"]
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "search_count": {
                                    "description": "Le nombre de blocs que le mob vérifiera à chaque tick dans sa plage de recherche et sa hauteur pour un bloc valide vers lequel se déplacer. Une valeur de 0 fera vérifier au mob chaque bloc dans la plage en un tick. \nType: `Integer`",
                                    "default": 10,
                                    "type": "integer"
                                },
                                "search_height": {
                                    "description": "La plage de hauteurs à partir de laquelle rechercher une position. \nType: `Integer`",
                                    "default": 1,
                                    "type": "integer"
                                },
                                "search_range": {
                                    "description": "La plage de distances à partir de laquelle rechercher une position. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace dans le liquide. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.move_to_poi": {
                            "description": "Permet à l'Entité de se déplacer vers un point d'intérêt. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "poi_type": {
                                    "description": "Le type de point d'intérêt vers lequel l'entité doit se déplacer. \nType: `String`",
                                    "type": "string"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace vers le point d'intérêt. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.move_to_random_block": {
                            "description": "Force une Entité à se déplacer vers un bloc aléatoire dans un rayon défini. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "block_distance": {
                                    "description": "La distance du mob, en blocs, à partir de laquelle le bloc vers lequel se déplacer sera choisi. \nType: `Number`",
                                    "default": 16.0,
                                    "type": "number"
                                },
                                "within_radius": {
                                    "description": "La distance en blocs à l'intérieur de laquelle l'entité considère avoir atteint l'objectif. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace vers le bloc aléatoire. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.move_to_village": {
                            "description": "Force une Entité à se déplacer vers un point d'intérêt du village. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "cooldown_time": {
                                    "description": "Le temps en secondes que le mob doit attendre avant de réutiliser l'objectif. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "goal_radius": {
                                    "description": "La distance en blocs à l'intérieur de laquelle l'entité considère avoir atteint l'objectif. \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "search_range": {
                                    "description": "La distance en blocs pour rechercher des villages. Si <= 0, trouvez le village le plus proche, quelle que soit la distance. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace vers le village. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.move_to_water": {
                            "description": "Force une Entité à se déplacer vers l'eau lorsqu'elle se trouve sur terre. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "goal_radius": {
                                    "description": "La distance en blocs à l'intérieur de laquelle l'entité considère avoir atteint l'objectif. \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "search_count": {
                                    "description": "Le nombre de blocs que le mob vérifiera à chaque tick dans sa plage de recherche et sa hauteur pour un bloc valide vers lequel se déplacer. Une valeur de 0 fera vérifier au mob chaque bloc dans la plage en un tick. \nType: `Integer`",
                                    "default": 10,
                                    "type": "integer"
                                },
                                "search_height": {
                                    "description": "La plage de hauteurs à partir de laquelle rechercher une position. \nType: `Integer`",
                                    "default": 1,
                                    "type": "integer"
                                },
                                "search_range": {
                                    "description": "La plage de distances à partir de laquelle rechercher une position. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace vers l'eau. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.move_towards_dwelling_restriction": {
                            "description": "Permet à l'Entité qui a le composant 'minecraft:dweller' de se déplacer vers la zone de village à laquelle l'Entité devrait être restreinte. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace vers la zone de village. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.move_towards_home_restriction": {
                            "description": "Permet à l'Entité qui a le composant 'minecraft:home' de se déplacer vers la position de la maison de l'Entité. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace vers la maison. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.move_towards_target": {
                            "description": "Force une Entité à se déplacer vers une cible. \nType: `Object` \nNote: Ce composant nécessite que l'Entité ait une cible.",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace vers la cible. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "within_radius": {
                                    "description": "La distance en blocs à l'intérieur de laquelle l'entité considère avoir atteint l'objectif. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.nap": {
                            "description": "Force une Entité à s'arrêter et à faire une sieste de temps en temps dans certaines conditions. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "can_nap_filters": {
                                    "description": "Les conditions qui doivent être remplies pour que l'entité puisse faire une sieste. \nType: `Minecraft Filter`",
                                    ...commonSchemas.minecraft_filter
                                },
                                "cooldown_max": {
                                    "description": "Le temps maximum en secondes que l'entité doit attendre avant de réutiliser l'objectif. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "cooldown_min": {
                                    "description": "Le temps minimum en secondes que l'entité doit attendre avant de réutiliser l'objectif. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "mob_detect_dist": {
                                    "description": "La distance en blocs à laquelle l'entité doit détecter les autres entités pour déterminer si elle peut faire une sieste. \nType: `Number`",
                                    "default": 6.0,
                                    "type": "number"
                                },
                                "mob_detect_height": {
                                    "description": "La plage de hauteurs à partir de laquelle l'entité doit détecter les autres entités pour déterminer si elle peut faire une sieste. \nType: `Number`",
                                    "default": 2.0,
                                    "type": "number"
                                },
                                "wake_mob_exceptions": {
                                    "description": "Les conditions qui doivent être remplies pour que l'entité se réveille de sa sieste. \nType: `Minecraft Filter`",
                                    ...commonSchemas.minecraft_filter
                                }
                            }
                        },
                        "minecraft:behavior.nearest_attackable_target": {
                            "description": "Force une Entité à attaquer la cible la plus proche dans un sous-ensemble donné de types de cibles spécifiques. \nType: `Object` \nCe composant est une nécessité pour le composant 'minecraft:behavior.melee_attack'.",
                            "type": "object",
                            "properties": {
                                "attack_interval": {
                                    "description": "La plage de temps (en secondes) entre la recherche d'une cible d'attaque, la plage est dans (0, 'attack_interval']. Utilisé uniquement si 'attack_interval' est supérieur à 0, sinon 'scan_interval' est utilisé. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "attack_interval_min": {
                                    "description": "Alias pour 'attack_interval'; fournit la même fonctionnalité que 'attack_interval'. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "attack_owner": {
                                    "description": "Si vrai, l'entité peut attaquer son propriétaire. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "entity_types": {
                                    "description": "Les types d'entités qui peuvent être attaqués par cette entité. \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "filters": {
                                            "description": "Les filtres à appliquer pour sélectionner les entités à attaquer. \nType: `Minecraft Filter`",
                                            ...commonSchemas.minecraft_filter
                                        },
                                        "max_dist": {
                                            "description": "Distance maximale à laquelle l'entité doit être pour être sélectionnée comme cible. \nType: `Number`",
                                            "default": 16,
                                            "type": "number"
                                        },
                                        "must_see": {
                                            "description": "Si vrai, l'entité doit être visible pour être sélectionnée comme cible. \nType: `Boolean`",
                                            "default": false,
                                            "type": "boolean"
                                        },
                                        "must_see_forget_duration": {
                                            "description": "Le temps en secondes que l'entité doit être hors de vue pour être oubliée comme cible. \nType: `Number`",
                                            "default": 3.0,
                                            "type": "number"
                                        },
                                        "reevaluate_description": {
                                            "description": "Si vrai, l'entité sera réévaluée comme cible à chaque tick. \nType: `Boolean`",
                                            "default": false,
                                            "type": "boolean"
                                        }
                                    }
                                },
                                "must_reach": {
                                    "description": "Si vrai, cette entité doit avoir un chemin vers la cible. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "must_see": {
                                    "description": "Si vrai, l'entité doit être visible pour être sélectionnée comme cible. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "must_see_forget_duration": {
                                    "description": "Le temps en secondes que l'entité doit être hors de vue pour être oubliée comme cible. \nType: `Number`",
                                    "default": 3.0,
                                    "type": "number"
                                },
                                "persist_time": {
                                    "description": "Le temps (en secondes) que cette entité peut continuer à attaquer la cible après que la cible ne soit plus valide. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "reselect_targets": {
                                    "description": "Permet à l'entité attaquante de mettre à jour la cible la plus proche, sinon une cible n'est réévaluée qu'après chaque 'scan_interval' ou 'attack_interval'. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "scan_interval": {
                                    "description": "Si 'attack_interval' est 0 ou n'est pas déclaré, alors entre les attaques: la recherche d'une nouvelle cible se produit tous les ticks égaux à 'scan_interval', la valeur minimale est 1. Les valeurs inférieures à 10 peuvent affecter les performances. \nType: `Integer`",
                                    "default": 10,
                                    "type": "integer"
                                },
                                "set_persistent": {
                                    "description": "Permet à l'Entité de ne pas disparaitre lorsqu'elle cible un joueur. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "target_invisible_multiplier": {
                                    "description": "Multiplié avec le pourcentage de couverture d'armure de la cible pour modifier 'max_dist' lors de la détection d'une cible invisible. \nType: `Number`",
                                    "default": 0.70,
                                    "type": "number"
                                },
                                "target_search_height": {
                                    "description": "La distance verticale maximale de recherche de cible, si elle est supérieure à 'max_dist' du type de cible. Une valeur négative revient à la plus grande 'max_dist' des 'entity_types'. \nType: `Number`",
                                    "default": -1.0,
                                    "type": "number"
                                },
                                "target_sneak_visibility_multiplier": {
                                    "description": "Multiplié avec 'max_dist' du type de cible lors de la détection d'une cible furtive. \nType: `Number`",
                                    "default": 0.80,
                                    "type": "number"
                                },
                                "within_radius": {
                                    "description": "La distance maximale à laquelle cette entité peut être de la cible lorsqu'elle la suit, sinon la cible devient invalide. Cette valeur n'est utilisée que si l'entité ne déclare pas 'minecraft:follow_range'. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.nearest_prioritized_attackable_target": {
                            "description": "Permet à une Entité de cibler et de prioriser la cible la plus proche valide. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "attack_interval": {
                                    "description": "La plage de temps (en secondes) entre la recherche d'une cible d'attaque, la plage est dans (0, 'attack_interval']. Utilisé uniquement si 'attack_interval' est supérieur à 0, sinon 'scan_interval' est utilisé. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "cooldown": {
                                    "description": "Le temps en secondes que le mob doit attendre avant de repouvoir sélectionner une cible du même type. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "entity_types": {
                                    "description": "Les types d'entités qui peuvent être attaqués par cette entité. \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "filters": {
                                            "description": "Les filtres à appliquer pour sélectionner les entités à attaquer. \nType: `Minecraft Filter`",
                                            ...commonSchemas.minecraft_filter
                                        },
                                        "max_dist": {
                                            "description": "Distance maximale à laquelle l'entité doit être pour être sélectionnée comme cible. \nType: `Number`",
                                            "default": 16,
                                            "type": "number"
                                        },
                                        "must_see": {
                                            "description": "Si vrai, l'entité doit être visible pour être sélectionnée comme cible. \nType: `Boolean`",
                                            "default": false,
                                            "type": "boolean"
                                        },
                                        "must_see_forget_duration": {
                                            "description": "Le temps en secondes que l'entité doit être hors de vue pour être oubliée comme cible. \nType: `Number`",
                                            "default": 3.0,
                                            "type": "number"
                                        },
                                        "reevaluate_description": {
                                            "description": "Si vrai, l'entité sera réévaluée comme cible à chaque tick. \nType: `Boolean`",
                                            "default": false,
                                            "type": "boolean"
                                        }
                                    }
                                },
                                "must_reach": {
                                    "description": "Si vrai, cette entité doit avoir un chemin vers la cible. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "must_see": {
                                    "description": "Si vrai, l'entité doit être visible pour être sélectionnée comme cible. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "must_see_forget_duration": {
                                    "description": "Le temps en secondes que l'entité doit être hors de vue pour être oubliée comme cible. \nType: `Number`",
                                    "default": 3.0,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "La priorité de l'attaque. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "persist_time": {
                                    "description": "Le temps (en secondes) que cette entité peut continuer à attaquer la cible après que la cible ne soit plus valide. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "reselect_targets": {
                                    "description": "Permet à l'entité attaquante de mettre à jour la cible la plus proche, sinon une cible n'est réévaluée qu'après chaque 'scan_interval' ou 'attack_interval'. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "scan_interval": {
                                    "description": "Si 'attack_interval' est 0 ou n'est pas déclaré, alors entre les attaques: la recherche d'une nouvelle cible se produit tous les ticks égaux à 'scan_interval', la valeur minimale est 1. Les valeurs inférieures à 10 peuvent affecter les performances. \nType: `Integer`",
                                    "default": 10,
                                    "type": "integer"
                                },
                                "set_persistent": {
                                    "description": "Permet à l'Entité de ne pas disparaitre lorsqu'elle cible un joueur. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "target_search_height": {
                                    "description": "La distance verticale maximale de recherche de cible, si elle est supérieure à 'max_dist' du type de cible. Une valeur négative revient à la plus grande 'max_dist' des 'entity_types'. \nType: `Number`",
                                    "default": -1.0,
                                    "type": "number"
                                },
                                "within_radius": {
                                    "description": "La distance maximale à laquelle cette entité peut être de la cible lorsqu'elle la suit, sinon la cible devient invalide. Cette valeur n'est utilisée que si l'entité ne déclare pas 'minecraft:follow_range'. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.ocelot_sit_on_block": {
                            "description": "Force une Entité à s'asseoir en place, similaire à la pose d'animation de l'entité ocelot. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite cet objectif sera exécuté. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle est assise. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.ocelotattack": {
                            "description": "Permet à une Entité d'attaquer en se faufilant et en bondissant. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "cooldown_time": {
                                    "description": "Temps en secondes entre chaque attaque. \nType: `Number`",
                                    "default": 1,
                                    "type": "number"
                                },
                                "max_distance": {
                                    "description": "La distance maximale à laquelle l'entité peut être de la cible lorsqu'elle attaque. \nType: `Number`",
                                    "default": 15,
                                    "type": "number"
                                },
                                "max_sneak_range": {
                                    "description": "La distance maximale à laquelle l'entité peut être de la cible lorsqu'elle commence à se faufiler. \nType: `Number`",
                                    "default": 15,
                                    "type": "number"
                                },
                                "max_sprint_range": {
                                    "description": "La distance maximale à laquelle l'entité peut être de la cible lorsqu'elle commence à sprinter (le sprint prend le pas sur le furtif). \nType: `Number`",
                                    "default": 4,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "La priorité de l'attaque. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "reach_multiplier": {
                                    "description": "Utilisé avec la taille de base de l'entité pour déterminer la distance minimale de la cible avant d'essayer de causer des dégâts d'attaque. \nType: `Number`",
                                    "default": 2,
                                    "type": "number"
                                },
                                "sneak_speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle se faufile. \nType: `Number`",
                                    "default": 0.6,
                                    "type": "number"
                                },
                                "sprint_speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle sprinte. \nType: `Number`",
                                    "default": 1.33,
                                    "type": "number"
                                },
                                "walk_speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle marche. \nType: `Number`",
                                    "default": 0.8,
                                    "type": "number"
                                },
                                "x_max_rotation": {
                                    "description": "La rotation maximale (en degrés), sur l'axe X, que cette entité peut effectuer en essayant de regarder la cible. \nType: `Number`",
                                    "default": 30,
                                    "type": "number"
                                },
                                "y_max_head_rotation": {
                                    "description": "La rotation maximale (en degrés), sur l'axe Y, que cette entité peut effectuer en essayant de regarder la cible. \nType: `Number`",
                                    "default": 30,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.offer_flower": {
                            "description": "Force une Entité à offrir une fleur à une autre entité. \nType: `Object` \nNote: L'Entité doit avoir un item fleur.",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "La priorité de l'offre de fleur. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.open_door": {
                            "description": "Force une Entité à interagir et à ouvrir une porte. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "close_door_after": {
                                    "description": "Si vrai, l'entité fermera la porte après l'avoir ouverte et être passée à travers. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "priority": {
                                    "description": "La priorité de l'ouverture de la porte. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.owner_hurt_by_target": {
                            "description": "Permet à l'Entité de cibler une autre entité qui blesse son propriétaire. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "entity_types": {
                                    "description": "Liste des types d'entités à attaquer. \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "cooldown": {
                                            "description": "Le temps en secondes que l'entité doit attendre avant de pouvoir être selectionné comme cible à nouveau. \nType: `Number`",
                                            "default": 0.0,
                                            "type": "number"
                                        },
                                        "filters": {
                                            "description": "Les filtres à appliquer pour sélectionner les entités à attaquer. \nType: `Minecraft Filter`",
                                            ...commonSchemas.minecraft_filter
                                        },
                                        "max_dist": {
                                            "description": "Distance maximale à laquelle l'entité doit être pour être sélectionnée comme cible. \nType: `Number`",
                                            "default": 16,
                                            "type": "number"
                                        },
                                        "must_see": {
                                            "description": "Si vrai, l'entité doit être visible pour être sélectionnée comme cible. \nType: `Boolean`",
                                            "default": false,
                                            "type": "boolean"
                                        },
                                        "must_see_forget_duration": {
                                            "description": "Le temps en secondes que l'entité doit être hors de vue pour être oubliée comme cible. \nType: `Number`",
                                            "default": 3.0,
                                            "type": "number"
                                        },
                                        "reevaluate_description": {
                                            "description": "Si vrai, l'entité sera réévaluée comme cible à chaque tick. \nType: `Boolean`",
                                            "default": false,
                                            "type": "boolean"
                                        },
                                        "sprint_speed_multiplier": {
                                            "description": "Multiplicateur de vitesse de sprint. 1,0 signifie conserver la vitesse normale, tandis que des nombres plus élevés accélèrent la vitesse de sprint. \nType: `Number`",
                                            "default": 1.0,
                                            "type": "number"
                                        },
                                        "walk_speed_multiplier": {
                                            "description": "Multiplicateur de vitesse de marche. 1,0 signifie conserver la vitesse normale, tandis que des nombres plus élevés accélèrent la vitesse de marche. \nType: `Number`",
                                            "default": 1.0,
                                            "type": "number"
                                        }
                                    }
                                },
                                "priority": {
                                    "description": "La priorité de ce comportement. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.owner_hurt_target": {
                            "description": "Permet à l'Entité de réagir lorsque son propriétaire frappe une cible. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "entity_types": {
                                    "description": "Liste des types d'entités à attaquer. \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "cooldown": {
                                            "description": "Le temps en secondes que l'entité doit attendre avant de pouvoir être selectionné comme cible à nouveau. \nType: `Number`",
                                            "default": 0.0,
                                            "type": "number"
                                        },
                                        "filters": {
                                            "description": "Les filtres à appliquer pour sélectionner les entités à attaquer. \nType: `Minecraft Filter`",
                                            ...commonSchemas.minecraft_filter
                                        },
                                        "max_dist": {
                                            "description": "Distance maximale à laquelle l'entité doit être pour être sélectionnée comme cible. \nType: `Number`",
                                            "default": 16,
                                            "type": "number"
                                        },
                                        "must_see": {
                                            "description": "Si vrai, l'entité doit être visible pour être sélectionnée comme cible. \nType: `Boolean`",
                                            "default": false,
                                            "type": "boolean"
                                        },
                                        "must_see_forget_duration": {
                                            "description": "Le temps en secondes que l'entité doit être hors de vue pour être oubliée comme cible. \nType: `Number`",
                                            "default": 3.0,
                                            "type": "number"
                                        },
                                        "reevaluate_description": {
                                            "description": "Si vrai, l'entité sera réévaluée comme cible à chaque tick. \nType: `Boolean`",
                                            "default": false,
                                            "type": "boolean"
                                        },
                                        "sprint_speed_multiplier": {
                                            "description": "Multiplicateur de vitesse de sprint. 1,0 signifie conserver la vitesse normale, tandis que des nombres plus élevés accélèrent la vitesse de sprint. \nType: `Number`",
                                            "default": 1.0,
                                            "type": "number"
                                        },
                                        "walk_speed_multiplier": {
                                            "description": "Multiplicateur de vitesse de marche. 1,0 signifie conserver la vitesse normale, tandis que des nombres plus élevés accélèrent la vitesse de marche. \nType: `Number`",
                                            "default": 1.0,
                                            "type": "number"
                                        }
                                    }
                                },
                                "priority": {
                                    "description": "La priorité de ce comportement. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.panic": {
                            "description": "Permet au mob d'entrer dans l'état de panique, ce qui le fait courir autour et loin de la source de dégâts qui l'a fait entrer dans cet état. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "damage_sources": {
                                    "description": "La liste des sources de dégâts qui peuvent déclencher la panique. \nType: `String[]`",
                                    "default": ["campfire", "fire", "fire_tick", "freezing", "lava", "lightning", "magma", "soul_campfire", "temperature", "entity_attack", "entity_explosion", "fireworks", "magic", "projectile", "ram_attack", "sonic_boom", "wither", "mace_smash"],
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                        enum: schemaEnums.entity_damage_causes
                                    }
                                },
                                "force": {
                                    "description": "Si vrai, ce mob ne cessera pas de paniquer tant qu'il ne pourra plus bouger ou que l'objectif ne lui sera pas retiré. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "ignore_mob_damage": {
                                    "description": "Si vrai, le mob ne paniquera pas en réponse aux dégâts d'autres mobs. Cela remplace les types de dégâts dans 'damage_sources'. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "panic_sound": {
                                    "description": "Le son à jouer lorsque le mob entre en panique. \nType: `String`",
                                    "default": "",
                                    "type": "string"
                                },
                                "prefer_water": {
                                    "description": "Si vrai, le mob préférera l'eau à la terre. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "priority": {
                                    "description": "La priorité de la panique. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "sound_interval": {
                                    "description": "La plage de temps en secondes à attendre aléatoirement avant de rejouer le son. \nType: `Number | Number[2]`",
                                    "default": 0,
                                    "oneOf": [
                                        {
                                            "type": "number"
                                        },
                                        {
                                            "type": "array",
                                            "minItems": 2,
                                            "maxItems": 2,
                                            "items": {
                                                "type": "number"
                                            }
                                        }
                                    ]
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle est en panique. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.pet_sleep_with_owner": {
                            "description": "Force l'Entité à dormir sur un lit partagé avec son propriétaire endormi. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "goal_radius": {
                                    "description": "La distance en blocs à l'intérieur de laquelle l'entité considère avoir atteint l'objectif. \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "search_height": {
                                    "description": "La plage de hauteurs à partir de laquelle rechercher une position. \nType: `Integer`",
                                    "default": 1,
                                    "type": "integer"
                                },
                                "search_range": {
                                    "description": "La plage de distances à partir de laquelle rechercher une position. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace vers le lit. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.pickup_items": {
                            "description": "Force une Entité à ramasser des items sélectionnés sur le sol. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "can_pickup_any_item": {
                                    "description": "Si vrai, le mob peut ramasser n'importe quel item. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_pickup_to_hand_or_equipment": {
                                    "description": "Si vrai, le mob peut ramasser des items dans sa main ou dans ses emplacements d'armure. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "cooldown_after_being_attacked": {
                                    "description": "Le temps en secondes que l'entité doit attendre avant de pouvoir ramasser des items après avoir été attaquée. \nType: `Number`",
                                    "default": 20.0,
                                    "type": "number"
                                },
                                "excluded_items": {
                                    "description": "La liste des items que le mob ne peut pas ramasser. \nType: `String[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                    }
                                },
                                "goal_radius": {
                                    "description": "La distance en blocs à l'intérieur de laquelle l'entité considère avoir atteint l'objectif. \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number"
                                },
                                "max_dist": {
                                    "description": "Distance maximale que cet Entité regardera pour ramasser des items. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "pickup_based_on_chance": {
                                    "description": "Si vrai, en fonction de la difficulté, il y a une chance aléatoire que le mob ne puisse pas ramasser d'items. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace vers les items. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "track_target": {
                                    "description": "Si vrai, le mob suivra la cible lorsqu'il ramasse des items. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                }
                            }
                        },
                        "minecraft:behavior.play": {
                            "description": "Force une Entité à jouer avec d'autres entités en se poursuivant et en se déplaçant aléatoirement. \nType: `Object` \nNote: Utilisable que par les villageois.",
                            "type": "object",
                            "properties": {
                                "chance_to_start": {
                                    "description": "La chance en pourcentage que le mob commence cet objectif, de 0 à 1. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number",
                                    "minimum": 0.0,
                                    "maximum": 1.0 
                                },
                                "follow_distance": {
                                    "description": "La distance (en blocs) que le mob essaie d'être à portée de l'ami qu'il suit. \nType: `Integer`",
                                    "default": 2,
                                    "type": "integer"
                                },
                                "friend_search_area": {
                                    "description": "Les dimensions de l'AABB utilisées pour rechercher un ami potentiel avec qui jouer. \nType: `Number[3]`",
                                    "default": [6, 3, 6],
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "friend_types": {
                                    "description": "Le(s) type(s) d'entité à considérer lors de la recherche d'un ami potentiel avec qui jouer. \nType: `String[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.entity_ids
                                    }
                                },
                                "max_play_duration_seconds": {
                                    "description": "La durée maximale en secondes que le mob jouera avant de quitter l'objectif. \nType: `Number`",
                                    "default": 50.0,
                                    "type": "number"
                                },
                                "random_pos_search_height": {
                                    "description": "La hauteur (en blocs) dans laquelle le mob cherchera pour trouver une position aléatoire où se déplacer. Doit être d'au moins 1. \nType: `Integer`",
                                    "default": 3,
                                    "type": "integer",
                                    "minimum": 1
                                },
                                "random_pos_search_range": {
                                    "description": "La distance (en blocs) dans laquelle le mob cherchera pour trouver une position aléatoire où se déplacer. \nType: `Integer`",
                                    "default": 16,
                                    "type": "integer",
                                    "minimum": 1
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle joue. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.play_dead": {
                            "description": "Permet à l'Entité de faire semblant d'être morte pour éviter d'être ciblée par des attaquants. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "apply_regeneration": {
                                    "description": "Détermine si l'entité recevra l'effet de régénération tout en jouant mort. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "damage_sources": {
                                    "description": "La liste des sources de dégâts qui peuvent déclencher le comportement de mort. \nType: `String | String[]`",
                                    "default": "all",
                                    "oneOf": [
                                        {
                                            "type": "string",
                                            enum: schemaEnums.entity_damage_causes
                                        },
                                        {
                                            "type": "array",
                                            "items": {
                                                "type": "string",
                                                enum: schemaEnums.entity_damage_causes
                                            }
                                        }
                                    ]
                                },
                                "duration": {
                                    "description": "La durée en secondes pendant laquelle l'entité jouera la morte. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "filters": {
                                    "description": "Les conditions requises pour que l'entité joue la morte. \nType: `Minecraft Filter`",
                                    ...commonSchemas.minecraft_filter
                                },
                                "force_below_health": {
                                    "description": "La quantité de santé à laquelle les dégâts feront jouer l'entité morte. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "random_damage_range": {
                                    "description": "La plage de dégâts qui peuvent déclencher le comportement de mort en fonction de l'aléatoire. Les dégâts subis en dessous du minimum ne déclencheront jamais le comportement. Les dégâts subis au-dessus du maximum déclencheront toujours le comportement. \nType: `Number[2]`",
                                    "default": [0.0, 0.0],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "random_start_chance": {
                                    "description": "La probabilité que cet objectif commence lors de la prise de dégâts. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number",
                                    "minimum": 0.0,
                                    "maximum": 1.0
                                }
                            }
                        },
                        "minecraft:behavior.player_ride_tamed": {
                            "description": "Permet à l'Entité d'être chevauché après avoir été apprivoisée par un joueur. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.raid_garden": {
                            "description": "Permet à l'Entité de manger/piller les cultures des fermes jusqu'à ce qu'elles soient pleines. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "blocks": {
                                    "description": "Les blocs que le mob recherche pour manger/piller. \nType: `String[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                    }
                                },
                                "eat_delay": {
                                    "description": "Le temps en secondes entre chaque fois qu'il mange/pille. \nType: `Integer`",
                                    "default": 2,
                                    "type": "integer"
                                },
                                "full_delay": {
                                    "description": "Le temps en secondes avant que ce mob veuille manger/piller à nouveau après avoir atteint son maximum. \nType: `Integer`",
                                    "default": 100,
                                    "type": "integer"
                                },
                                "goal_radius": {
                                    "description": "La distance en blocs à l'intérieur de laquelle l'entité considère avoir atteint l'objectif. \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number"
                                },
                                "initial_eat_delay": {
                                    "description": "Le temps en secondes avant de commencer à manger/piller une fois arrivé. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "max_to_eat": {
                                    "description": "Le nombre maximum de cultures que cette entité veut manger/piller. Si défini à zéro ou moins, il n'a pas de maximum. \nType: `Integer`",
                                    "default": 6,
                                    "type": "integer"
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "search_height": {
                                    "description": "La plage de hauteurs à partir de laquelle rechercher des blocs. \nType: `Integer`",
                                    "default": 1,
                                    "type": "integer"
                                },
                                "search_range": {
                                    "description": "La plage de distances à partir de laquelle rechercher des blocs. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace vers les blocs. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.ram_attack": {
                            "description": "Force une Entité à rechercher une cible aléatoire et, si un chemin direct existe entre l'entité et la cible, elle effectuera une charge. Si l'attaque touche, la cible sera repoussée en fonction de la vitesse de l'entité. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "baby_knockback_modifier": {
                                    "description": "Le modificateur de recul que les bébés ont. \nType: `Number`",
                                    "default": 0.3333333,
                                    "type": "number"
                                },
                                "cooldown_range": {
                                    "description": "La plage de temps (en secondes) entre chaque attaque de charge. \nType: `Number[2]`",
                                    "default": [10, 20],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "number",
                                        "minimum": 0.0
                                    }
                                },
                                "knockback_force": {
                                    "description": "La force du recul de l'attaque de charge. \nType: `Number`",
                                    "default": 5.0,
                                    "type": "number"
                                },
                                "knockback_height": {
                                    "description": "La hauteur du recul de l'attaque de charge. \nType: `Number`",
                                    "default": 0.1,
                                    "type": "number"
                                },
                                "min_ram_distance": {
                                    "description": "La distance minimale à laquelle l'entité peut commencer une attaque de charge. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "on_start": {
                                    "description": "L'événement à déclencher lors de l'attaque. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "pre_ram_sound": {
                                    "description": "Le son à jouer lorsque l'entité est sur le point de commencer une attaque de charge. \nType: `String`",
                                    "type": "string"
                                },
                                "priority": {
                                    "description": "La priorité de l'attaque de charge. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "ram_distance": {
                                    "description": "La distance maximale à laquelle l'entité peut commencer une attaque de charge. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "ram_impact_sound": {
                                    "description": "Le son à jouer lorsque l'entité touche une cible avec une attaque de charge. \nType: `String`",
                                    "type": "string"
                                },
                                "ram_speed": {
                                    "description": "La vitesse de l'entité lorsqu'elle charge vers la cible. \nType: `Number`",
                                    "default": 2.0,
                                    "type": "number"
                                },
                                "run_speed": {
                                    "description": "La vitesse de l'entité lorsqu'elle court vers la cible. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.random_breach": {
                            "description": "Force une Entité à briser la surface de l'eau à un intervalle aléatoire. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "cooldown_time": {
                                    "description": "Le temps en secondes que l'entité doit attendre avant de pouvoir utiliser à nouveau l'objectif. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "interval": {
                                    "description": "Une valeur aléatoire pour déterminer quand se déplacer aléatoirement quelque part. Cela a une chance de 1/interval de choisir cet objectif. \nType: `Integer`",
                                    "default": 120,
                                    "type": "integer"
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace vers la surface de l'eau. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "xz_dist": {
                                    "description": "La distance en blocs sur le sol que le mob cherchera un nouvel endroit où se déplacer. Doit être d'au moins 1. \nType: `Integer`",
                                    "default": 10,
                                    "type": "integer",
                                    "minimum": 1
                                },
                                "y_dist": {
                                    "description": "La distance en blocs au-dessus de la surface de l'eau que le mob cherchera un nouvel endroit où se déplacer. Doit être d'au moins 1. \nType: `Integer`",
                                    "default": 7,
                                    "type": "integer",
                                    "minimum": 1
                                }
                            }
                        },
                        "minecraft:behavior.random_fly": {
                            "description": "Force une Entité à voler vers un endroit aléatoire. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "can_land_on_trees": {
                                    "description": "Si vrai, le mob peut arrêter de voler et atterrir sur un arbre au lieu du sol. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "xz_dist": {
                                    "description": "La distance en blocs sur le sol que le mob cherchera un nouvel endroit où se déplacer. Doit être d'au moins 1. \nType: `Integer`",
                                    "default": 10,
                                    "type": "integer",
                                    "minimum": 1
                                },
                                "y_dist": {
                                    "description": "La distance en blocs au-dessus du sol que le mob cherchera un nouvel endroit où se déplacer. Doit être d'au moins 1. \nType: `Integer`",
                                    "default": 7,
                                    "type": "integer",
                                    "minimum": 1
                                }
                            }
                        },
                        "minecraft:behavior.random_hover": {
                            "description": "Force une Entité à planer aléatoirement, près de la surface. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "hover_height": {
                                    "description": "La hauteur au-dessus de la surface que l'Entité essaiera de maintenir. \nType: `Number[2]`",
                                    "default": [0.0, 0.0],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "interval": {
                                    "description": "Une valeur aléatoire pour déterminer quand se déplacer aléatoirement quelque part. Cela a une chance de 1/interval de choisir cet objectif. \nType: `Integer`",
                                    "default": 120,
                                    "type": "integer"
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace vers la surface. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "xz_dist": {
                                    "description": "La distance en blocs sur le sol que le mob cherchera un nouvel endroit où se déplacer. Doit être d'au moins 1. \nType: `Integer`",
                                    "default": 10,
                                    "type": "integer",
                                    "minimum": 1
                                },
                                "y_dist": {
                                    "description": "La distance en blocs au-dessus de la surface que le mob cherchera un nouvel endroit où se déplacer. Doit être d'au moins 1. \nType: `Integer`",
                                    "default": 7,
                                    "type": "integer",
                                    "minimum": 1
                                },
                                "y_offset": {
                                    "description": "La hauteur en blocs à ajouter à la position cible sélectionnée. \nType: `Integer`",
                                    "default": 0.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.random_look_around": {
                            "description": "Force une Entité à choisir une direction aléatoire pour regarder pendant une durée aléatoire dans une plage. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "look_time": {
                                    "description": "La plage de temps en secondes que le mob restera à regarder dans une direction aléatoire avant de regarder ailleurs. \nType: `Number[2]`",
                                    "default": [2, 4],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "max_angle_of_view_horizontal": {
                                    "description": "L'angle le plus à droite qu'un mob peut regarder sur le plan horizontal par rapport à sa direction initiale. \nType: `Integer`",
                                    "default": 30,
                                    "type": "integer"
                                },
                                "min_angle_of_view_horizontal": {
                                    "description": "L'angle le plus à gauche qu'un mob peut regarder sur le plan horizontal par rapport à sa direction initiale. \nType: `Integer`",
                                    "default": -30,
                                    "type": "integer"
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.random_look_around_and_sit": {
                            "description": "Force une Entité à s'asseoir en place et à regarder autour dans différentes directions. L'entité doit avoir une animation d'assise configurée pour utiliser cet objectif. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "continue_if_leashed": {
                                    "description": "Détermine si l'objectif doit continuer d'être utilisé si l'entité est attachée. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "continue_sitting_on_reload": {
                                    "description": "Lorsque défini sur 'true', l'entité restera assise lors du rechargement. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "max_angle_of_view_horizontal": {
                                    "description": "L'angle le plus à droite qu'un mob peut regarder sur le plan horizontal par rapport à sa direction initiale. \nType: `Integer`",
                                    "default": 30.0,
                                    "type": "number"
                                },
                                "max_look_count": {
                                    "description": "Le nombre maximum de regards uniques qu'une entité aura tout en regardant autour d'elle. \nType: `Integer`",
                                    "default": 2,
                                    "type": "integer"
                                },
                                "max_look_time": {
                                    "description": "La durée maximale (en ticks) pendant laquelle une entité restera à regarder dans une direction tout en regardant autour d'elle. \nType: `Integer`",
                                    "default": 40,
                                    "type": "integer"
                                },
                                "min_angle_of_view_horizontal": {
                                    "description": "L'angle le plus à gauche qu'un mob peut regarder sur le plan horizontal par rapport à sa direction initiale. \nType: `Integer`",
                                    "default": -30.0,
                                    "type": "number"
                                },
                                "min_look_count": {
                                    "description": "Le nombre minimum de regards uniques qu'une entité aura tout en regardant autour d'elle. \nType: `Integer`",
                                    "default": 1,
                                    "type": "integer"
                                },
                                "min_look_time": {
                                    "description": "La durée minimale (en ticks) pendant laquelle une entité restera à regarder dans une direction tout en regardant autour d'elle. \nType: `Integer`",
                                    "default": 20,
                                    "type": "integer"
                                },
                                "probability": {
                                    "description": "La probabilité que l'entité regarde autour d'elle. \nType: `Number`",
                                    "default": 0.02,
                                    "type": "number"
                                },
                                "random_look_around_cooldown": {
                                    "description": "Le temps en secondes avant que l'objectif puisse être utilisé à nouveau. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.random_search_and_dig": {
                            "description": "Force une Entité à localiser un bloc cible aléatoire vers lequel elle peut trouver un chemin. Une fois trouvé, l'Entité se déplacera vers le bloc cible et creusera un item. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "cooldown_range": {
                                    "description": "La plage de temps (en secondes) entre chaque recherche de bloc cible. \nType: `Number[2]`",
                                    "default": [0.0, 0.0],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "number",
                                        "minimum": 0.0
                                    }
                                },
                                "digging_duration_range": {
                                    "description": "La plage de temps (en secondes) que l'Entité passera à creuser le bloc cible. \nType: `Number[2]`",
                                    "default": [0.0, 0.0],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "number",
                                        "minimum": 0.0
                                    }
                                },
                                "find_valid_position_retries": {
                                    "description": "Le nombre de tentatives pour trouver une position cible valide dans la plage de recherche. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "goal_radius": {
                                    "description": "La distance en blocs à l'intérieur de laquelle l'entité considère avoir atteint l'objectif. \nType: `Number`",
                                    "default": 1.5,
                                    "type": "number"
                                },
                                "item_table": {
                                    "description": "Le chemin du fichier relatif à la racine du pack de comportement pour la liste des items à spawner (Loot Table). \nType: `String`",
                                    "type": "string"
                                },
                                "on_digging_start": {
                                    "description": "L'événement à déclencher lorsque la recherche se termine et que le creusage commence. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "on_fail_during_digging": {
                                    "description": "Evénement à déclencher lorsque l'objectif échoue pendant l'état de creusage. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "on_fail_during_searching": {
                                    "description": "Evénement à déclencher lorsque l'objectif échoue pendant l'état de recherche. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "on_item_found": {
                                    "description": "L'événement à déclencher lorsqu'un item est trouvé. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "on_searching_start": {
                                    "description": "L'événement à déclencher lorsque la recherche commence. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "on_success": {
                                    "description": "L'événement à déclencher lorsque la recherche et le creusage sont terminés. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "search_range_xz": {
                                    "description": "La largeur et la longueur du volume autour de l'entité utilisé pour trouver une position cible valide. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "search_range_y": {
                                    "description": "La hauteur du volume autour de l'entité utilisé pour trouver une position cible valide. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "spawn_item_after_seconds": {
                                    "description": "La durée en secondes avant de spawner l'item. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "spawn_item_pos_offset": {
                                    "description": "La distance pour décaler l'emplacement de spawn de l'item dans la direction vers laquelle le mob est tourné. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace vers le bloc cible. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "target_blocks": {
                                    "description": "La liste des types de blocs cibles sur lesquels l'objectif cherchera à creuser. Remplace la liste par défaut. \nType: `String[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                                    }
                                },
                                "target_dig_position_offset":{
                                    "description": "Le décalage de la position de creusage cible par rapport à la position des pieds de l'entité dans sa direction. \nType: `Number`",
                                    "default": 2.25,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.random_sitting": {
                            "description": "Force une Entité à s'asseoir et à rester assise pendant une durée aléatoire. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "cooldown_time": {
                                    "description": "Le temps en secondes que l'entité doit attendre avant de pouvoir utiliser à nouveau l'objectif. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "min_sit_time": {
                                    "description": "La durée minimale en secondes avant que l'entité puisse se relever. \nType: `Number`",
                                    "default": 10,
                                    "type": "number"
                                },
                                "start_chance": {
                                    "description": "La chance que l'entité commence cet objectif, de 0 à 1. \nType: `Number`",
                                    "default": 0.1,
                                    "type": "number",
                                    "minimum": 0.0,
                                    "maximum": 1.0
                                },
                                "stop_chance": {
                                    "description": "La chance que l'entité arrête cet objectif, de 0 à 1. \nType: `Number`",
                                    "default": 0.3,
                                    "type": "number",
                                    "minimum": 0.0,
                                    "maximum": 1.0
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.random_stroll": {
                            "description": "Force une Entité à choisir une direction aléatoire vers laquelle marcher. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "interval": {
                                    "description": "Une valeur aléatoire pour déterminer quand se déplacer aléatoirement quelque part. Cela a une chance de 1/interval de choisir cet objectif. \nType: `Integer`",
                                    "default": 120,
                                    "type": "integer"
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "xz_dist": {
                                    "description": "La distance en blocs sur le sol que le mob cherchera un nouvel endroit où se déplacer. Doit être d'au moins 1. \nType: `Integer`",
                                    "default": 10,
                                    "type": "integer",
                                    "minimum": 1
                                },
                                "y_dist": {
                                    "description": "La distance en blocs au-dessus du sol que le mob cherchera un nouvel endroit où se déplacer. Doit être d'au moins 1. \nType: `Integer`",
                                    "default": 7,
                                    "type": "integer",
                                    "minimum": 1
                                }
                            }
                        },
                        "minecraft:behavior.random_swim": {
                            "description": "Force une Entité à nager vers un point aléatoire dans l'eau. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "avoid_surface": {
                                    "description": "Si vrai, l'entité évitera les blocs d'eau de surface en nageant en dessous. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "interval": {
                                    "description": "Une valeur aléatoire pour déterminer quand se déplacer aléatoirement quelque part. Cela a une chance de 1/interval de choisir cet objectif. \nType: `Integer`",
                                    "default": 120,
                                    "type": "integer"
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle nage. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "xz_dist": {
                                    "description": "La distance en blocs sur le sol que le mob cherchera un nouvel endroit où se déplacer. Doit être d'au moins 1. \nType: `Integer`",
                                    "default": 10,
                                    "type": "integer",
                                    "minimum": 1
                                },
                                "y_dist": {
                                    "description": "La distance en blocs au-dessus de la surface de l'eau que le mob cherchera un nouvel endroit où se déplacer. Doit être d'au moins 1. \nType: `Integer`",
                                    "default": 7,
                                    "type": "integer",
                                    "minimum": 1
                                }
                            }
                        },
                        "minecraft:behavior.ranged_attack": {
                            "description": "Force une Entité à attaquer en utilisant des tirs à distance. `charge_shoot_trigger` doit être supérieur à 0 pour activer les attaques de tir en rafale chargées. Nécessite `minecraft:shooter` pour définir le comportement du projectile. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "attack_interval": {
                                    "description": "Alternative to 'attack_interval_min' & 'attack_interval_max'. Temps de rechargement constant (en secondes), lorsqu'on n'utilise pas de tir chargé. Ne s'adapte pas à la distance de la cible. \nType: `Number`",
                                    "default": 0,
                                    "type": "number"
                                },
                                "attack_interval_max": {
                                    "description": "Limite supérieure de la plage de temps de rechargement (en secondes), lorsqu'on n'utilise pas de tir chargé. La plage de temps de rechargement s'adapte à la distance de la cible. \nType: `Number`",
                                    "default": 0,
                                    "type": "number"
                                },
                                "attack_interval_min": {
                                    "description": "Limite inférieure de la plage de temps de rechargement (en secondes), lorsqu'on n'utilise pas de tir chargé. La plage de temps de rechargement s'adapte à la distance de la cible. \nType: `Number`",
                                    "default": 0,
                                    "type": "number"
                                },
                                "attack_radius": {
                                    "description": "La distance minimale à laquelle l'entité doit être de la cible avant de tirer. \nType: `Number`",
                                    "default": 0,
                                    "type": "number"
                                },
                                "attack_radius_min": {
                                    "description": "La distance minimale à laquelle la cible peut être pour que ce mob tire. Si la cible est plus proche, ce mob se déplacera d'abord avant de tirer. \nType: `Number`",
                                    "default": 0,
                                    "type": "number"
                                },
                                "burst_interval": {
                                    "description": "Le temps (en secondes) entre chaque tir individuel lorsqu'on tire une rafale de tirs à partir d'une attaque chargée. \nType: `Number`",
                                    "default": 0,
                                    "type": "number"
                                },
                                "burst_shots": {
                                    "description": "Le nombre de tirs tirés à chaque fois que l'entité attaquante utilise une attaque chargée. \nType: `Integer`",
                                    "default": 1,
                                    "type": "integer"
                                },
                                "charge_charged_trigger": {
                                    "description": "Le temps (en secondes, puis ajoutez 'charge_shoot_trigger') avant qu'une attaque chargée ne soit complètement chargée. Le temps de charge diminue lorsque la cible n'est pas en vue. \nType: `Number`",
                                    "default": 0,
                                    "type": "number"
                                },
                                "charge_shoot_trigger": {
                                    "description": "Le temps (en secondes, puis doublez) qu'un tir chargé doit être chargé avant de recharger les tirs en rafale. Le temps de charge diminue lorsque la cible n'est pas en vue. \nType: `Number`",
                                    "default": 0,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "ranged_fov": {
                                    "description": "Le champ de vision (en degrés) lors de l'utilisation de la détection pour détecter une cible pour l'attaque. \nType: `Number`",
                                    "default": 90,
                                    "type": "number"
                                },
                                "set_persistent": {
                                    "description": "Permet à l'entité d'être définie pour persister lorsqu'elle cible un joueur. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace pour attaquer. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "swing": {
                                    "description": "Si une animation de swing (en utilisant variable.attack_time) existe, cela force l'entité à balancer son bras lorsqu'elle tire l'attaque à distance. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "target_in_sight_time": {
                                    "description": "La durée minimale (en secondes) pendant laquelle l'entité doit voir la cible avant de se déplacer vers elle. \nType: `Number`",
                                    "default": 1,
                                    "type": "number"
                                },
                                "x_max_rotation": {
                                    "description": "La rotation maximale (en degrés), sur l'axe X, que cette entité peut effectuer tout en essayant de regarder la cible. \nType: `Number`",
                                    "default": 30,
                                    "type": "number"
                                },
                                "y_max_head_rotation": {
                                    "description": "La rotation maximale (en degrés), sur l'axe Y, que cette entité peut effectuer tout en essayant de regarder la cible. \nType: `Number`",
                                    "default": 30,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.receive_love": {
                            "description": "Force une Entité à s'accoupler avec une autre entité similaire lorsqu'elle s'approche pour se reproduire. \nType: `Object` \nNote: Ce comportement ne peut être utilisé que par le type d'entité villageois.",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace pour s'accoupler. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }   
                            }
                        },
                        "minecraft:behavior.restrict_open_door": {
                            "description": "Force une Entité à rester à l'intérieur pendant la nuit. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.restrict_sun": {
                            "description": "Force une Entité à éviter activement la lumière directe du soleil. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.rise_to_liquid_level": {
                            "description": "Force une Entité à remonter au sommet d'un bloc liquide si elle se trouve dans un bloc liquide ou a été générée sous un bloc liquide. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "liquid_y_offset": {
                                    "description": "La hauteur en blocs à ajouter à la position de l'entité lorsqu'elle remonte à la surface. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "rise_delta": {
                                    "description": "Le déplacement pour combien l'entité se déplacera vers le haut dans l'axe vertical. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "sink_delta": {
                                    "description": "Le déplacement pour combien l'entité se déplacera vers le bas dans l'axe vertical. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.roar": {
                            "description": "Force une Entité à rugir vers une autre entité en fonction des données de `minecraft:anger_level`. Lorsque le seuil de colère spécifié dans `minecraft:anger_level` est atteint, cette entité rugira pendant la durée spécifiée, regardera l'autre entité, appliquera un boost de colère envers elle, et enfin la ciblera. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "duration": {
                                    "description": "La durée en secondes pendant laquelle l'entité rugira. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.roll": {
                            "description": "Force une Entité à rouler vers l'avant. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "probability": {
                                    "description": "La probabilité que l'entité roule. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.run_around_like_crazy": {
                            "description": "Force une Entité à courir sans but. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle court. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.scared": {
                            "description": "Force une Entité à avoir peur lorsqu'il y a un orage. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "sound_interval": {
                                    "description": "L'intervalle dans lequel un son se jouera lorsqu'il est actif dans une chance de 1/délai pour démarrer. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.send_event": {
                            "description": "Force une Entité à envoyer un événement à une autre entité. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "cast_duration": {
                                    "description": "Le temps en secondes pour l'ensemble du processus d'envoi d'événement. \nType: `Number`",
                                    "type": "number"
                                },
                                "look_at_target": {
                                    "description": "Si vrai, le mob regardera l'entité à laquelle il envoie un événement. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "sequence": {
                                    "description": "La liste des événements à envoyer. \nType: `Object[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "base_delay": {
                                                "description": "La durée en secondes avant de commencer cette étape. \nType: `Number`",
                                                "default": 0.0,
                                                "type": "number"
                                            },
                                            "event": {
                                                "description": "L'événement à envoyer. \nType: `String`",
                                                "type": "string"
                                            },
                                            "sound_event": {
                                                "description": "L'événement sonore à jouer lorsque cette étape se produit. \nType: `String`",
                                                "type": "string"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "minecraft:behavior.share_items": {
                            "description": "Force une Entité à partager des items qu'elle a dans son inventaire avec d'autres entités spécifiques qui ont été définies. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "entity_types": {
                                    "description": "La liste des types d'entités avec lesquelles cette entité partagera des items. \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "cooldown": {
                                            "description": "Le temps en secondes que l'entité doit attendre avant de pouvoir être selectionné comme cible à nouveau. \nType: `Number`",
                                            "default": 0.0,
                                            "type": "number"
                                        },
                                        "filters": {
                                            "description": "Les filtres à appliquer pour sélectionner les entités à attaquer. \nType: `Minecraft Filter`",
                                            ...commonSchemas.minecraft_filter
                                        },
                                        "max_dist": {
                                            "description": "Distance maximale à laquelle l'entité doit être pour être sélectionnée comme cible. \nType: `Number`",
                                            "default": 16,
                                            "type": "number"
                                        },
                                        "must_see": {
                                            "description": "Si vrai, l'entité doit être visible pour être sélectionnée comme cible. \nType: `Boolean`",
                                            "default": false,
                                            "type": "boolean"
                                        },
                                        "must_see_forget_duration": {
                                            "description": "Le temps en secondes que l'entité doit être hors de vue pour être oubliée comme cible. \nType: `Number`",
                                            "default": 3.0,
                                            "type": "number"
                                        },
                                        "reevaluate_description": {
                                            "description": "Si vrai, l'entité sera réévaluée comme cible à chaque tick. \nType: `Boolean`",
                                            "default": false,
                                            "type": "boolean"
                                        },
                                        "sprint_speed_multiplier": {
                                            "description": "Multiplicateur de vitesse de sprint. 1,0 signifie conserver la vitesse normale, tandis que des nombres plus élevés accélèrent la vitesse de sprint. \nType: `Number`",
                                            "default": 1.0,
                                            "type": "number"
                                        },
                                        "walk_speed_multiplier": {
                                            "description": "Multiplicateur de vitesse de marche. 1,0 signifie conserver la vitesse normale, tandis que des nombres plus élevés accélèrent la vitesse de marche. \nType: `Number`",
                                            "default": 1.0,
                                            "type": "number"
                                        }
                                    }
                                },
                                "goal_radius": {
                                    "description": "La distance en blocs à l'intérieur de laquelle l'entité considère avoir atteint l'objectif. \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number"
                                },
                                "max_dist": {
                                    "description": "Distance maximale en blocs à laquelle ce mob cherchera des entités avec lesquelles partager des items. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace pour partager des items. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.silverfish_merge_with_stone": {
                            "description": "Force une Entité à entrer dans un bloc de pierre. \nType: `Object` \nNote: Ce comportement ne peut être utilisé que par le type d'entité poisson d'argent.",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.silverfish_wake_up_friends": {
                            "description": "Force une Entité à alerter d'autres entités de la même famille pour sortir d'un bloc de pierre. \nType: `Object` \nNote: Ce comportement ne peut être utilisé que par le type d'entité poisson d'argent. Ce comportement nécessite que `minecraft:behavior.silverfish_merge_with_stone` soit défini.",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.skeleton_horse_trap": {
                            "description": "Force une Entité à fonctionner comme un piège à cheval squelette et à être déclenchée, invoquant un éclair, des chevaux squelettes supplémentaires et des cavaliers de chevaux squelettes, lorsqu'un joueur s'approche dans un rayon défini. \nType: `Object` \nNote: Ce comportement ne peut être utilisé que par le type d'entité cheval, mule, âne et cheval squelette.",
                            "type": "object",
                            "properties": {
                                "duration": {
                                    "description": "La durée en secondes pendant laquelle le piège existe. Après ce laps de temps écoulé, le piège est retiré du monde s'il n'a pas été activé. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "within_radius": {
                                    "description": "La distance en blocs à l'intérieur de laquelle un joueur doit être pour activer le piège. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.sleep": {
                            "description": "Force une Entité à dormir dans un lit. \nType: `Object` \nNote: Ce comportement ne peut être utilisé que par le type d'entité villageois.",
                            "type": "object",
                            "properties": {
                                "can_sleep_while_riding": {
                                    "description": "Si vrai, le mob pourra utiliser l'objectif de sommeil s'il monte quelque chose. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "cooldown_time": {
                                    "description": "Le temps en secondes que le mob doit attendre avant de pouvoir utiliser l'objectif à nouveau. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "sleep_collider_height": {
                                    "description": "La hauteur du collider du mob pendant le sommeil. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "sleep_collider_width": {
                                    "description": "La largeur du collider du mob pendant le sommeil. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "sleep_y_offset": {
                                    "description": "Le décalage y du collider du mob pendant le sommeil. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace pour dormir. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "timeout_cooldown": {
                                    "description": "Le temps en secondes que le mob doit attendre avant de pouvoir utiliser l'objectif à nouveau après avoir été réveillé. \nType: `Number`",
                                    "default": 8.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.slime_attack": {
                            "description": "Active les entités avec `minecraft:movement.jump` pour se diriger vers leur cible comme le fait un slime ou un cube de magma pour attaquer. Pour attaquer, l'entité doit avoir un `runtime_identifier` défini sur `minecraft:slime` et un composant `variant` avec une valeur supérieure à 1. Sinon, elle se dirigera toujours vers une cible mais ne causera pas de dégâts. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "set_persistent": {
                                    "description": "Permet à l'entité d'être définie pour persister lorsqu'elle cible un joueur. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace pour attaquer. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "x_max_rotation": {
                                    "description": "La rotation maximale (en degrés), sur l'axe X, que cette entité peut effectuer tout en essayant de regarder la cible. \nType: `Number`",
                                    "default": 10,
                                    "type": "number"
                                },
                                "y_max_rotation": {
                                    "description": "La rotation maximale (en degrés sur l'axe Y) que cette entité peut effectuer tout en essayant de regarder la cible. \nType: `Number`",
                                    "default": 10,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.slime_float": {
                            "description": "Force une Entité à flotter dans l'eau ou la lave. \nType: `Object` \nNote: Ce comportement ne peut être utilisé que par le type d'entité slime et cube de magma.",
                            "type": "object",
                            "properties": {
                                "jump_chance_percentage": {
                                    "description": "La probabilité que l'entité saute. \nType: `Number`",
                                    "default": 0.8,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle flotte. \nType: `Number`",
                                    "default": 1.2,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.slime_keep_on_jumping": {
                            "description": "Force une Entité à sauter continuellement comme un slime. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle saute. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.slime_random_direction": {
                            "description": "Force une Entité à se déplacer dans des directions aléatoires comme un slime. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "add_random_time_range": {
                                    "description": "Temps supplémentaire (en secondes entières), choisi aléatoirement dans la plage de [0, `add_random_time_range`], à ajouter à `min_change_direction_time`. \nType: `Integer`",
                                    "default": 3,
                                    "type": "integer"
                                },
                                "min_change_direction_time": {
                                    "description": "Temps minimum (en secondes entières) à attendre avant de choisir une nouvelle direction. \nType: `Number`",
                                    "default": 2,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "turn_range": {
                                    "description": "Plage d'angle de rotation maximale (en degrés) lors du choix aléatoire d'une nouvelle direction. \nType: `Integer`",
                                    "default": 360,
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.snacking": {
                            "description": "Force une Entité à s'arrêter et à interagir avec des items alimentaires sélectionnés qui sont à proximité. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "items": {
                                    "description": "Les items que l'entité peut manger. \nType: `String[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                    }
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "snacking_cooldown": {
                                    "description": "Le temps en secondes que le mob doit attendre avant de pouvoir manger à nouveau. \nType: `Number`",
                                    "default": 7.5,
                                    "type": "number"
                                },
                                "snacking_cooldown_min": {
                                    "description": "Le temps minimum en secondes que le mob doit attendre avant de pouvoir manger à nouveau. \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number"
                                },
                                "snacking_stop_chance": {
                                    "description": "La chance que le mob arrête de manger, de 0 à 1. \nType: `Number`",
                                    "default": 0.0017,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.sneeze": {
                            "description": "Force une Entité à s'arrêter et à éternuer, ce qui peut effrayer les entités à proximité et faire tomber un item. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "cooldown_time": {
                                    "description": "Le temps en secondes que le mob doit attendre avant de pouvoir utiliser l'objectif à nouveau. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "drop_item_chance": {
                                    "description": "La probabilité que le mob laisse tomber un item lorsqu'il éternue. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "entity_types": {
                                    "description": "La liste des types d'entités à effrayer lorsqu'elles éternuent. \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "cooldown": {
                                            "description": "Le temps en secondes que l'entité doit attendre avant de pouvoir être selectionné comme cible à nouveau. \nType: `Number`",
                                            "default": 0.0,
                                            "type": "number"
                                        },
                                        "filters": {
                                            "description": "Les filtres à appliquer pour sélectionner les entités à attaquer. \nType: `Minecraft Filter`",
                                            ...commonSchemas.minecraft_filter
                                        },
                                        "max_dist": {
                                            "description": "Distance maximale à laquelle l'entité doit être pour être sélectionnée comme cible. \nType: `Number`",
                                            "default": 16,
                                            "type": "number"
                                        },
                                        "must_see": {
                                            "description": "Si vrai, l'entité doit être visible pour être sélectionnée comme cible. \nType: `Boolean`",
                                            "default": false,
                                            "type": "boolean"
                                        },
                                        "must_see_forget_duration": {
                                            "description": "Le temps en secondes que l'entité doit être hors de vue pour être oubliée comme cible. \nType: `Number`",
                                            "default": 3.0,
                                            "type": "number"
                                        },
                                        "reevaluate_description": {
                                            "description": "Si vrai, l'entité sera réévaluée comme cible à chaque tick. \nType: `Boolean`",
                                            "default": false,
                                            "type": "boolean"
                                        },
                                        "sprint_speed_multiplier": {
                                            "description": "Multiplicateur de vitesse de sprint. 1,0 signifie conserver la vitesse normale, tandis que des nombres plus élevés accélèrent la vitesse de sprint. \nType: `Number`",
                                            "default": 1.0,
                                            "type": "number"
                                        },
                                        "walk_speed_multiplier": {
                                            "description": "Multiplicateur de vitesse de marche. 1,0 signifie conserver la vitesse normale, tandis que des nombres plus élevés accélèrent la vitesse de marche. \nType: `Number`",
                                            "default": 1.0,
                                            "type": "number"
                                        }
                                    }
                                },
                                "loot_table": {
                                    "description": "Loot Table à partir de laquelle sélectionner les items laissés tomber. \nType: `String`",
                                    "type": "string",
                                    pattern: schemaPatterns.loot_tables_file,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.loot_table_file_paths
                                },
                                "prepare_sound": {
                                    "description": "Le son à jouer lorsque l'éternuement est sur le point de se produire. \nType: `String`",
                                    "type": "string"
                                },
                                "prepare_time": {
                                    "description": "Le temps en secondes que le mob prend pour se préparer à éternuer (pendant que le son de préparation se joue). \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "probability": {
                                    "description": "La probabilité d'éternuer. Une valeur de 1,00 est de 100%. \nType: `Number`",
                                    "default": 0.02,
                                    "type": "number"
                                },
                                "sound": {
                                    "description": "Le son à jouer lorsque l'éternuement se produit. \nType: `String`",
                                    "type": "string"
                                },
                                "within_radius": {
                                    "description": "La distance en blocs à l'intérieur de laquelle un joueur doit être pour activer l'éternuement. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.sniff": {
                            "description": "Force une Entité à détecter le joueur le plus proche dans un rayon spécifique et à mettre à jour son état de composant `minecraft:suspect_tracking`. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "cooldown_range": {
                                    "description": "La plage de temps en secondes entre les reniflements. \nType: `Number`",
                                    "default": [3.0, 10.0],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "duration": {
                                    "description": "La durée en secondes pendant laquelle l'entité renifle. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "sniffing_radius": {
                                    "description": "Rayon de détection des entités. \nType: `Number`",
                                    "default": 5.0,
                                    "type": "number"
                                },
                                "suspicion_radius_horizontal": {
                                    "description": "Rayon de suspicion horizontal des entités. Lorsqu'un joueur est à l'intérieur de ce rayon horizontalement, le niveau de colère envers ce joueur est augmenté. \nType: `Number`",
                                    "default": 3.0,
                                    "type": "number"
                                },
                                "suspicion_radius_vertical": {
                                    "description": "Rayon de suspicion vertical des entités. Lorsqu'un joueur est à l'intérieur de ce rayon verticalement, le niveau de colère envers ce joueur est augmenté. \nType: `Number`",
                                    "default": 3.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.sonic_boom": {
                            "description": "Force une Entité à effectuer une attaque à distance de type 'sonic boom'. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "attack_cooldown": {
                                    "description": "Le temps en secondes nécessaire après avoir utilisé cette attaque jusqu'à ce que l'entité puisse utiliser à nouveau le sonic boom. \nType: `Number`",
                                    "default": 5.0,
                                    "type": "number"
                                },
                                "attack_damage": {
                                    "description": "Les dégâts infligés par l'attaque. \nType: `Number`",
                                    "default": 30.0,
                                    "type": "number"
                                },
                                "attack_range_horizontal": {
                                    "description": "La portée horizontale (en blocs) à laquelle le sonic boom peut endommager la cible. \nType: `Number`",
                                    "default": 15.0,
                                    "type": "number"
                                },
                                "attack_range_vertical": {
                                    "description": "La portée verticale (en blocs) à laquelle le sonic boom peut endommager la cible. \nType: `Number`",
                                    "default": 20.0,
                                    "type": "number"
                                },
                                "attack_sound": {
                                    "description": "Le son à jouer lorsque l'attaque est utilisée. \nType: `String`",
                                    "type": "string"
                                },
                                "charge_sound": {
                                    "description": "L'événement sonore à jouer lorsque l'attaque est chargée. \nType: `String`",
                                    "type": "string"
                                },
                                "duration": {
                                    "description": "La durée en secondes pendant laquelle l'entité charge l'attaque. \nType: `Number`",
                                    "default": 3.0,
                                    "type": "number"
                                },
                                "duration_until_attack_sound": {
                                    "description": "La durée en secondes avant que le son de l'attaque ne soit joué. \nType: `Number`",
                                    "default": 1.70,
                                    "type": "number"
                                },
                                "knockback_height_cap": {
                                    "description": "La hauteur maximale de déplacement vertical du knockback de l'attaque. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "knockback_horizontal_strength": {
                                    "description": "La force horizontale du knockback de l'attaque appliquée à la cible de l'attaque. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "knockback_vertical_strength": {
                                    "description": "La force verticale du knockback de l'attaque appliquée à la cible de l'attaque. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace pour attaquer. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.squid_dive": {
                            "description": "Force une Entité à plonger sous l'eau. \nType: `Object` \nNote: Ce comportement ne peut être utilisé que par le type d'entité pieuvre.",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.squid_flee": {
                            "description": "Force une Entité à nager loin lorsqu'elle est attaquée. \nType: `Object` \nNote: Ce comportement ne peut être utilisé que par le type d'entité pieuvre.",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.squid_idle": {
                            "description": "Force une Entité à nager sur place. \nType: `Object` \nNote: Ce comportement ne peut être utilisé que par le type d'entité pieuvre.",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.squid_move_away_from_ground": {
                            "description": "Force une Entité à nager loin des blocs du sol. \nType: `Object` \nNote: Ce comportement ne peut être utilisé que par le type d'entité pieuvre.",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.squid_out_of_water": {
                            "description": "Force une Entité à rester proche d'un bloc de sol lorsqu'elle est hors de l'eau. \nType: `Object` \nNote: Ce comportement ne peut être utilisé que par le type d'entité pieuvre.",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.stalk_and_pounce_on_target": {
                            "description": "Force une Entité à traquer une cible spécifique. Une fois à portée de la cible, l'entité sautera sur la cible et infligera des dégâts en fonction de son attribut d'attaque. \nType: `Object` \nNote: Ce comportement nécessite une cible pour fonctionner correctement et un attribut d'attaque pour fonctionner correctement.",
                            "type": "object",
                            "properties": {
                                "interest_time": {
                                    "description": "Le temps en secondes pendant lequel le mob sera intéressé avant de bondir. Cela se produit lorsque le mob est à portée de bondir. \nType: `Number`",
                                    "default": 2.0,
                                    "type": "number"
                                },
                                "leap_distance": {
                                    "description": "La distance en blocs que le mob saute dans la direction de sa cible. \nType: `Number`",
                                    "default": 0.8,
                                    "type": "number"
                                },
                                "leap_height": {
                                    "description": "La hauteur en blocs que le mob saute lorsqu'il bondit sur sa cible. \nType: `Number`",
                                    "default": 0.9,
                                    "type": "number"
                                },
                                "max_stalk_dist": {
                                    "description": "La distance maximale à laquelle la cible peut être avant que le mob n'abandonne le traquage. \nType: `Number`",
                                    "default": 10.0,
                                    "type": "number"
                                },
                                "pounce_max_dist": {
                                    "description": "La distance maixmale à partir de la cible en blocs pour commencer à bondir sur la cible. \nType: `Number`",
                                    "default": 5.0,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "set_persistent": {
                                    "description": "Permet à l'entité d'être définie pour persister lorsqu'elle cible un joueur. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "stalk_speed": {
                                    "description": "La vitesse de déplacement à laquelle vous traquez votre cible. \nType: `Number`",
                                    "default": 1.2,
                                    "type": "number"
                                },
                                "strike_dist": {
                                    "description": "La distance maximale à laquelle la cible peut être pour infliger des dégâts lors du bond. \nType: `Number`",
                                    "default": 2.0,
                                    "type": "number"
                                },
                                "stuck_time": {
                                    "description": "Le temps en secondes pendant lequel le mob sera coincé s'il échoue et atterrit sur un bloc sur lequel il peut être coincé. \nType: `Number`",
                                    "default": 2.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.stay_near_noteblock": {
                            "description": "Force une Entité à rester près d'un bloc musical récemment joué. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "listen_time": {
                                    "description": "Le temps en secondes que l'entité doit rester près du bloc musical après l'avoir entendu. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed": {
                                    "description": "Définit la vitesse de l'entité lorsqu'elle se déplace vers le bloc. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "start_distance": {
                                    "description": "Définit la distance à laquelle l'entité doit être du bloc pour tenter de démarrer l'objectif. \nType: `Number`",
                                    "default": 10.0,
                                    "type": "number"
                                },
                                "stop_distance": {
                                    "description": "Définit la distance à laquelle l'entité doit être du bloc pour tenter d'arrêter l'objectif. \nType: `Number`",
                                    "default": 2.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.stay_while_sitting": {
                            "description": "Force une Entité à rester assise. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.stomp_attack": {
                            "description": "Force une Entité à attaquer en utilisant un comportement de dégâts AoE de stomp. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "attack_once": {
                                    "description": "Permet à l'entité d'utiliser ce comportement d'attaque une seule fois. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "attack_types": {
                                    "description": "Liste des types d'entités à attaquer. \nType: `String[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.entity_ids
                                    }
                                },
                                "can_spread_on_fire": {
                                    "description": "Définit si l'entité peut mettre le feu à d'autres entités lorsqu'elle les attaque. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "cooldown_time": {
                                    "description": "Le temps en secondes entre les attaques. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "inner_boundary_time_increase": {
                                    "description": "Temps (en secondes) à ajouter au recalcul du chemin d'attaque lorsque la cible est au-delà de la 'path_inner_boundary'. \nType: `Number`",
                                    "default": 0.25,
                                    "type": "number"
                                },
                                "max_dist": {
                                    "description": "Pas utilisé dans le comportement. \nType: `Number`",
                                    "type": "number"
                                },
                                "max_path_time": {
                                    "description": "Temps maximum (en secondes) pour recalculer le chemin d'attaque. \nType: `Number`",
                                    "default": 0.55,
                                    "type": "number"
                                },
                                "melee_fov": {
                                    "description": "Champ de vision (en degrés) lors de l'utilisation du composant de détection pour détecter une cible d'attaque. \nType: `Number`",
                                    "default": 90,
                                    "type": "number"
                                },
                                "min_path_time": {
                                    "description": "Temps minimum (en secondes) pour recalculer le chemin d'attaque. \nType: `Number`",
                                    "default": 0.2,
                                    "type": "number"
                                },
                                "no_damage_range_multiplier": {
                                    "description": "Multiplication avec la plage de dégâts AoE finale pour déterminer une plage de non-dégâts. L'attaque de stomp sera en cooldown si la cible est dans cette plage de non-dégâts. \nType: `Number`",
                                    "default": 2,
                                    "type": "number"
                                },
                                "on_attack": {
                                    "description": "L'événement à déclencher lorsque l'entité attaque. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "on_kill": {
                                    "description": "L'événement à déclencher lorsque l'entité tue une autre entité. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "outer_boundary_time_increase": {
                                    "description": "Temps (en secondes) à ajouter au recalculer lorsque la cible est au-delà de la 'path_outer_boundary'. \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number"
                                },
                                "path_fail_time_increase": {
                                    "description": "Temps (en secondes) à ajouter au recalcul du chemin d'attaque lorsque cette entité ne peut pas se déplacer le long du chemin actuel. \nType: `Number`",
                                    "default": 0.75,
                                    "type": "number"
                                },
                                "path_inner_boundary": {
                                    "description": "Distance à laquelle l'entité doit être à l'intérieur pour augmenter le recalcul du chemin d'attaque par 'inner_boundary_tick_increase'. \nType: `Number`",
                                    "default": 16,
                                    "type": "number"
                                },
                                "path_outer_boundary": {
                                    "description": "Distance à laquelle l'entité doit être à l'extérieur pour augmenter le recalcul du chemin d'attaque par 'outer_boundary_tick_increase'. \nType: `Number`",
                                    "default": 32,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "random_stop_interval": {
                                    "description": "Cette entité aura une chance de 1 sur N d'arrêter son attaque actuelle, où N = 'random_stop_interval'. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "reach_multiplier": {
                                    "description": "Utilisé avec la taille de la base de l'entité pour déterminer la distance minimale de la cible avant de tenter de causer des dégâts d'attaque. \nType: `Number`",
                                    "default": 1.5,
                                    "type": "number"
                                },
                                "require_complete_path": {
                                    "description": "Bascule (on/off) la nécessité d'avoir un chemin complet de l'entité à la cible lors de l'utilisation de ce comportement d'attaque. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "set_persistent": {
                                    "description": "Permet à l'entité d'être définie pour persister lorsqu'elle cible un joueur. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "speed_multiplier": {
                                    "description": "Multiplicateur de vitesse de mouvement de l'entité lorsqu'elle utilise cet objectif AI. \nType: `Number`",
                                    "default": 1,
                                    "type": "number"
                                },
                                "stomp_range_multiplier": {
                                    "description": "Multiplié avec la taille de base de l'entité pour déterminer la plage de dégâts AoE de stomp. \nType: `Number`",
                                    "default": 2,
                                    "type": "number"
                                },
                                "target_dist": {
                                    "description": "Inutilisé. \nType: `Number`",
                                    "type": "number"
                                },
                                "track_target": {
                                    "description": "Permet à l'entité de suivre la cible d'attaque, même si l'entité n'a pas de détection. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "x_max_rotation": {
                                    "description": "Rotation maximale (en degrés) sur l'axe X que cette entité peut tourner lorsqu'elle tente de regarder la cible. \nType: `Number`",
                                    "default": 30,
                                    "type": "number"
                                },
                                "y_max_head_rotation": {
                                    "description": "Rotation maximale (en degrés) sur l'axe Y que cette entité peut tourner la tête lorsqu'elle tente de regarder la cible. \nType: `Number`",
                                    "default": 30,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.stomp_turtle_egg": {
                            "description": "Force une Entité à cibler et à écraser des oeufs de tortue lorsqu'ils sont détectés. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "goal_radius": {
                                    "description": "Le rayon autour de l'entité à l'intérieur duquel les oeufs de tortue sont ciblés. \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number"
                                },
                                "interval": {
                                    "description": "Une valeur aléatoire pour déterminer quand se déplacer aléatoirement quelque part. Cette valeur a une chance de 1/interval de choisir cet objectif. \nType: `Integer`",
                                    "default": 120,
                                    "type": "integer"
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "search_height": {
                                    "description": "La hauteur en blocs à laquelle le mob cherchera des oeufs de tortue pour se déplacer vers eux. \nType: `Integer`",
                                    "default": 1,
                                    "type": "integer"
                                },
                                "search_range": {
                                    "description": "La distance en blocs à laquelle le mob cherchera des oeufs de tortue pour se déplacer vers eux. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace pour écraser des oeufs de tortue. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.stroll_towards_village": {
                            "description": "Force une Entité à naviguer et à rechercher un village à proximité. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "cooldown_time": {
                                    "description": "Le temps en secondes que le mob doit attendre avant de pouvoir utiliser à nouveau l'objectif. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                },
                                "goal_radius": {
                                    "description": "Le rayon autour de l'entité à l'intérieur duquel le village est ciblé. \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "search_range": {
                                    "description": "La distance en blocs pour rechercher des points à l'intérieur des villages. Si <= 0, trouvez le village le plus proche, quelle que soit la distance. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace vers un village. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "start_chance": {
                                    "description": "La chance que le mob commence cet objectif, de 0 à 1. \nType: `Number`",
                                    "default": 0.1,
                                    "type": "number",
                                    "minimum": 0,
                                    "maximum": 1
                                }
                            }
                        },
                        "minecraft:behavior.summon_entity": {
                            "description": "Force une Entité à attaquer d'autres entités en invoquant de nouvelles entités. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "summon_choices": {
                                    "description": "Liste des sorts que le mob peut utiliser pour invoquer des entités. \nType: `Object[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "cast_duration": {
                                                "description": "Temps en secondes que le lancer de sort prendra. \nType: `Number`",
                                                "type": "number"
                                            },
                                            "cooldown_time": {
                                                "description": "Le temps en secondes que le mob doit attendre avant de pouvoir utiliser à nouveau ce sort. \nType: `Number`",
                                                "default": 0.0,
                                                "type": "number"
                                            },
                                            "do_casting": {
                                                "description": "Si vrai, le mob fera les animations de lancer et affichera des particules de sort. \nType: `Boolean`",
                                                "default": true,
                                                "type": "boolean"
                                            },
                                            "filters": {
                                                "description": "Les filtres permettent aux objets de données de spécifier des critères de test. \nType: `Minecraft Filter`",
                                                ...commonSchemas.minecraft_filter
                                            },
                                            "max_activation_range": {
                                                "description": "La limite supérieure de la distance d'activation en blocs pour ce sort, ne doit pas être négative. \nType: `Number`",
                                                "default": 32.0,
                                                "type": "number",
                                                "minimum": 0
                                            },
                                            "min_activation_range": {
                                                "description": "La limite inférieure de la distance d'activation en blocs pour ce sort, ne doit pas être négative. \nType: `Number`",
                                                "default": 1.0,
                                                "type": "number",
                                                "minimum": 0
                                            },
                                            "particle_color": {
                                                "description": "La couleur des particules pour ce sort. \nType: `Integer`",
                                                "default": 0,
                                                "type": "integer"
                                            },
                                            "start_sound_event": {
                                                "description": "L'événement sonore à jouer lorsque le sort est utilisé. \nType: `String`",
                                                "type": "string"
                                            },
                                            "weight": {
                                                "description": "Le poids de ce sort. Contrôle la probabilité que le mob choisisse ce sort lorsqu'il en lance un. \nType: `Number`",
                                                "default": 0.0,
                                                "type": "number"
                                            },
                                            "sequence": {
                                                "description": "Liste des étapes pour le sort. \nType: `Object[]`",
                                                "type": "array",
                                                "items": {
                                                    "type": "object",
                                                    "properties": {
                                                        "base_delay": {
                                                            "description": "La quantité de temps en secondes à attendre avant que cette étape ne commence. \nType: `Number`",
                                                            "default": 0.0,
                                                            "type": "number"
                                                        },
                                                        "delay_per_summon": {
                                                            "description": "La quantité de temps en secondes à attendre avant que chaque entité ne soit invoquée à cette étape. \nType: `Number`",
                                                            "default": 0.0,
                                                            "type": "number"
                                                        },
                                                        "entity_lifespan": {
                                                            "description": "La quantité de temps en secondes que l'entité invoquée restera en vie. Une valeur de -1,0 signifie qu'elle restera en vie aussi longtemps qu'elle le pourra. \nType: `Number`",
                                                            "default": -1.0,
                                                            "type": "number"
                                                        },
                                                        "entity_type": {
                                                            "description": "Le type d'entité des entités que nous invoquerons à cette étape. \nType: `String`",
                                                            "type": "string"
                                                        },
                                                        "num_entities_spawned": {
                                                            "description": "Le nombre d'entités qui seront invoquées à cette étape. \nType: `Integer`",
                                                            "default": 1,
                                                            "type": "integer"
                                                        },
                                                        "shape": {
                                                            "description": "La forme de base de cette étape. Les valeurs valides sont 'circle' et 'line'. \nType: `String`",
                                                            "default": "line",
                                                            "type": "string",
                                                            "enum": ["circle", "line"]
                                                        },
                                                        "size": {
                                                            "description": "La taille de base de l'entité. \nType: `Number`",
                                                            "default": 1.0,
                                                            "type": "number"
                                                        },
                                                        "sound_event": {
                                                            "description": "L'événement sonore à jouer pour cette étape. \nType: `String`",
                                                            "type": "string"
                                                        },
                                                        "summon_cap": {
                                                            "description": "Nombre maximum d'entités invoquées à tout moment. \nType: `Integer`",
                                                            "default": 0,
                                                            "type": "integer"
                                                        },
                                                        "summon_cap_radius": {
                                                            "description": "Le rayon maximum où les entités invoquées peuvent apparaître. \nType: `Number`",
                                                            "default": 0.0,
                                                            "type": "number"
                                                        },
                                                        "summon_event": {
                                                            "description": "L'événement à invoquer sur chaque entité invoquée lors de l'apparition. \nType: `String`",
                                                            "type": "string"
                                                        },
                                                        "target": {
                                                            "description": "La cible du sort. C'est ici que le sort commencera (la ligne commencera ici, le cercle sera centré ici). \nType: `String`",
                                                            "default": "self",
                                                            "type": "string",
                                                            "enum": ["self", "target"]
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "minecraft:behavior.swell": {
                            "description": "Force une Entité à grandir en taille lorsqu'elle est approchée et à rétrécir à nouveau après une certaine distance. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "start_distance": {
                                    "description": "Cet Entité commence à gonfler lorsqu'une cible est éloignée d'au moins autant de blocs. \nType: `Number`",
                                    "default": 10.0,
                                    "type": "number"
                                },
                                "stop_distance": {
                                    "description": "Cet Entité arrête de gonfler lorsqu'une cible s'est éloignée d'au moins autant de blocs. \nType: `Number`",
                                    "default": 2.0,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.swim_idle": {
                            "description": "Oblige une Entité nageant dans l'eau à rester inactive. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "idle_time": {
                                    "description": "La durée en secondes pendant laquelle l'entité reste inactive. \nType: `Number`",
                                    "default": 5,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "success_rate": {
                                    "description": "Le pourcentage de chance que cette entité reste inactive, 1.0 = 100%. \nType: `Number`",
                                    "default": 0.1,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.swim_up_for_breath": {
                            "description": "Force une Entité à nager vers la surface pour respirer lorsqu'elle est à court d'air. \nType: `Object` \nNote: Ce comportement nécessite un composant 'minecraft:breathable' pour fonctionner correctement.",
                            "type": "object",
                            "properties": {
                                "material_type": {
                                    "description": "Le type de matériau dans lequel le mob se déplace. Un bloc d'air ne sera considéré comme valide pour se déplacer qu'avec un bloc de ce matériau en dessous. Les options sont : 'water', 'lava' ou 'any'. \nType: `String`",
                                    "default": "water",
                                    "type": "string",
                                    "enum": ["water", "lava", "any"]
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "search_height": {
                                    "description": "La hauteur (en blocs) au-dessus de la position actuelle du mob qu'il recherchera un bloc d'air valide pour se déplacer. Si un bloc valide ne peut pas être trouvé, le mob se déplacera à la position de ce nombre de blocs au-dessus de lui. \nType: `Integer`",
                                    "default": 16,
                                    "type": "integer"
                                },
                                "search_radius": {
                                    "description": "Le rayon (en blocs) autour de la position actuelle du mob qu'il recherchera un bloc d'air valide pour se déplacer. \nType: `Integer`",
                                    "default": 4,
                                    "type": "integer"
                                },
                                "speed_mod": {
                                    "description": "Le multiplicateur de vitesse de déplacement de l'entité lorsqu'elle se déplace pour respirer. \nType: `Number`",
                                    "default": 1.40,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.swim_wander": {
                            "description": "Force une Entité à errer en nageant, lorsqu'elle ne suit pas de chemin. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "interval": {
                                    "description": "Pourcentage de chance de commencer à errer, lorsqu'il n'y a pas de recherche de chemin. 1 = 100% \nType: `Number`", 
                                    "default": 0.00833,
                                    "type": "number"
                                },
                                "look_ahead": {
                                    "description": "Distance à laquelle regarder pour éviter les obstacles, lors de l'errance. \nType: `Number`",
                                    "default": 5,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace pour errer. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "wander_time": {
                                    "description": "La durée en secondes pour errer après que le comportement d'errance ait été démarré avec succès. \nType: `Number`",
                                    "default": 5,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.swim_with_entity": {
                            "description": "Force une Entité à suivre une autre entité lorsqu'elles nagent toutes les deux dans l'eau. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "catch_up_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité est modifié par lorsqu'elle suit la direction d'une autre entité. \nType: `Number`",
                                    "default": 2.5,
                                    "type": "number"
                                },
                                "catch_up_threshold": {
                                    "description": "La distance, à partir de l'entité suivie, à laquelle cette entité accélérera pour atteindre cette entité. \nType: `Number`",
                                    "default": 12,
                                    "type": "number"
                                },
                                "chance_to_stop": {
                                    "description": "Pourcentage de chance d'arrêter de suivre l'entité actuelle, si elle monte une autre entité ou si elle ne nage pas. 1.0 = 100% \nType: `Number`",
                                    "default": 0.0333,
                                    "type": "number"
                                },
                                "entity_types": {
                                    "description": "Les filtres permettent aux objets de données de spécifier des critères de test. \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "filters": {
                                            "description": "Les filtres permettent aux objets de données de spécifier des critères de test. \nType: `Minecraft Filter`",
                                            ...commonSchemas.minecraft_filter
                                        }
                                    }
                                },
                                "match_direction_threshold": {
                                    "description": "La distance, à partir de l'entité suivie, à laquelle cette entité essaiera de suivre la direction de cette entité. \nType: `Number`",
                                    "default": 2,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "search_range": {
                                    "description": "Le rayon autour de cette entité pour rechercher une autre entité à suivre. \nType: `Number`",
                                    "default": 20,
                                    "type": "number"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle suit une autre entité. \nType: `Number`",
                                    "default": 1.5,
                                    "type": "number"
                                },
                                "state_check_interval": {
                                    "description": "Le temps (en secondes) entre les vérifications pour déterminer si cette entité doit rattraper l'entité suivie ou correspondre à la direction de l'entité suivie. \nType: `Number`",
                                    "default": 0.5,
                                    "type": "number"
                                },
                                "stop_distance": {
                                    "description": "La distance, à partir de l'entité suivie, à laquelle cette entité arrêtera de suivre cette entité. \nType: `Number`",
                                    "default": 5,
                                    "type": "number"
                                },
                                "success_rate": {
                                    "description": "Pourcentage de chance de commencer à suivre une autre entité, si ce n'est pas déjà le cas. 1.0 = 100%. \nType: `Number`",
                                    "default": 0.1,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.swoop_attack": {
                            "description": "Force une Entité à attaquer en utilisant un comportement d'attaque de plongée. Idéal pour une utilisation avec des mobs volants. Le comportement se termine si l'entité a une collision horizontale ou est touchée. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "damage_reach": {
                                    "description": "Ajouté à la taille de base de l'entité pour déterminer la distance maximale autorisée de la cible, lorsqu'elle tente de causer des dégâts d'attaque. \nType: `Number`",
                                    "default": 0.2,
                                    "type": "number"
                                },
                                "delay_range": {
                                    "description": "Plage de temps de refroidissement minimum et maximum (en secondes) entre chaque attaque de plongée tentée. \nType: `Number[2]`",
                                    "default": [10, 20],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle utilise cet objectif AI. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.take_flower": {
                            "description": "Permet au mob d'accepter des fleurs d'un autre mob avec le comportement minecraft:offer_flower. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "filters": {
                                    "description": "Les filtres permettent aux objets de données de spécifier des critères de test. \nType: `Minecraft Filter`",
                                    ...commonSchemas.minecraft_filter
                                },
                                "max_head_rotation_y": {
                                    "description": "La rotation maximale (en degrés) sur l'axe Y que cette entité peut tourner la tête lorsqu'elle tente de regarder la cible. \nType: `Number`",
                                    "default": 30,
                                    "type": "number"
                                },
                                "max_rotation_x": {
                                    "description": "La rotation maximale (en degrés) sur l'axe X que cette entité peut tourner lorsqu'elle tente de regarder la cible. \nType: `Number`",
                                    "default": 30,
                                    "type": "number"
                                },
                                "max_wait_time": {
                                    "description": "La durée maximale (en secondes) pendant laquelle le mob attendra aléatoirement avant de prendre la fleur. \nType: `Number`",
                                    "default": 20.0,
                                    "type": "number"
                                },
                                "min_distance_to_target": {
                                    "description": "La distance minimale (en blocs) pour que l'entité soit considérée comme ayant atteint sa cible. \nType: `Number`",
                                    "default": 2.0,
                                    "type": "number"
                                },
                                "min_wait_time": {
                                    "description": "La durée minimale (en secondes) pendant laquelle le mob attendra aléatoirement avant de prendre la fleur. \nType: `Number`",
                                    "default": 4.0,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "search_area": {
                                    "description": "Les dimensions de l'AABB utilisées pour rechercher un mob potentiel à partir duquel prendre une fleur. \nType: `Number[3]`",
                                    "default": [6, 2, 6],
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle utilise cet objectif AI. \nType: `Number`",
                                    "default": 0.50,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.target_when_pushed": {
                            "description": "Force une Entité à cibler l'entité qui l'a poussée. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "entity_types": {
                                    "description": "Liste des types d'entités à attaquer. \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "filters": {
                                            "description": "Les filtres à appliquer pour sélectionner les entités à attaquer. \nType: `Minecraft Filter`",
                                            ...commonSchemas.minecraft_filter
                                        },
                                        "max_dist": {
                                            "description": "Distance maximale à laquelle l'entité doit être pour être sélectionnée comme cible. \nType: `Number`",
                                            "default": 16,
                                            "type": "number"
                                        },
                                        "must_see": {
                                            "description": "Si vrai, l'entité doit être visible pour être sélectionnée comme cible. \nType: `Boolean`",
                                            "default": false,
                                            "type": "boolean"
                                        },
                                        "must_see_forget_duration": {
                                            "description": "Le temps en secondes que l'entité doit être hors de vue pour être oubliée comme cible. \nType: `Number`",
                                            "default": 3.0,
                                            "type": "number"
                                        },
                                        "sprint_speed_multiplier": {
                                            "description": "Multiplicateur de vitesse de sprint. 1,0 signifie conserver la vitesse normale, tandis que des nombres plus élevés accélèrent la vitesse de sprint. \nType: `Number`",
                                            "default": 1.0,
                                            "type": "number"
                                        },
                                        "walk_speed_multiplier": {
                                            "description": "Multiplicateur de vitesse de marche. 1,0 signifie conserver la vitesse normale, tandis que des nombres plus élevés accélèrent la vitesse de marche. \nType: `Number`",
                                            "default": 1.0,
                                            "type": "number"
                                        }
                                    }
                                },
                                "percent_chance": {
                                    "description": "Pourcentage de chance que l'entité cible l'entité qui l'a poussée. \nType: `Number`",
                                    "default": 5.0,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.teleport_to_owner": {
                            "description": "Permet à une entité de se téléporter à son propriétaire. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "cooldown": {
                                    "description": "Le temps en secondes qui doit s'écouler pour que l'entité puisse essayer de se téléporter à nouveau. \nType: `Number`",
                                    "default": 1.00,
                                    "type": "number"
                                },
                                "filters": {
                                    "description": "Les filtres permettent aux objets de données de spécifier des critères de test. \nType: `Minecraft Filter`",
                                    ...commonSchemas.minecraft_filter
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.tempt": {
                            "description": "Force une Entité à être tentée par un item défini. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "can_get_scared": {
                                    "description": "Si vrai, le mob peut cesser d'être tenté si le joueur se déplace trop vite tout en étant proche de ce mob. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_tempt_vertically": {
                                    "description": "Si vrai, la distance verticale par rapport au joueur sera prise en compte lors de la tentation. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "can_tempt_while_ridden": {
                                    "description": "Si vrai, le mob peut être tenté même s'il a un passager. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "items": {
                                    "description": "Liste des items qui peuvent tenter cette entité. \nType: `String[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    }
                                },
                                "on_start": {
                                    "description": "Événement à déclencher lorsque ce comportement démarre. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "on_end": {
                                    "description": "Événement à déclencher lorsque ce comportement se termine. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "sound_interval": {
                                    "description": "Plage de ticks aléatoires à attendre entre les sons de tentation. \nType: `Number[2]`",
                                    "default": [0.0, 0.0],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle est tentée. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "stop_distance": {
                                    "description": "La distance à laquelle l’Entité arrêtera de suivre le joueur. \nType: `Number`",
                                    "default": 1.5,
                                    "type": "number"
                                },
                                "tempt_sound": {
                                    "description": "Le son à jouer pendant que le mob est tenté. \nType: `String`",
                                    "type": "string"
                                },
                                "within_radius": {
                                    "description": "La distance en blocs à laquelle le joueur doit être pour tenter cette entité. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.timer_flag_1": {
                            "description": "Déclenche un événement lorsque ce comportement démarre, puis attend une durée avant de s'arrêter. Lors de l'arrêt en raison du délai d'attente ou d'une interruption par un autre comportement, l'objectif déclenche un autre événement. query.timer_flag_1 renverra 1,0 sur le client et le serveur lorsque ce comportement est en cours d'exécution, et 0,0 sinon. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "cooldown_range": {
                                    "description": "Plage de temps de refroidissement minimum et maximum (en secondes) entre chaque exécution de ce comportement. \nType: `Number[2]`",
                                    "default": [10.0, 10.0],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "duration_range": {
                                    "description": "Plage de temps minimum et maximum (en secondes) que ce comportement doit être actif. \nType: `Number[2]`",
                                    "default": [2.0 , 2.0],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "on_end": {
                                    "description": "Événement à déclencher lorsque ce comportement se termine. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "on_start": {
                                    "description": "Événement à déclencher lorsque ce comportement démarre. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                }
                            }
                        },
                        "minecraft:behavior.timer_flag_2": {
                            "description": "Déclenche un événement lorsque ce comportement démarre, puis attend une durée avant de s'arrêter. Lors de l'arrêt en raison du délai d'attente ou d'une interruption par un autre comportement, l'objectif déclenche un autre événement. query.timer_flag_2 renverra 1,0 sur le client et le serveur lorsque ce comportement est en cours d'exécution, et 0,0 sinon. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "cooldown_range": {
                                    "description": "Plage de temps de refroidissement minimum et maximum (en secondes) entre chaque exécution de ce comportement. \nType: `Number[2]`",
                                    "default": [10.0, 10.0],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "duration_range": {
                                    "description": "Plage de temps minimum et maximum (en secondes) que ce comportement doit être actif. \nType: `Number[2]`",
                                    "default": [2.0 , 2.0],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "on_end": {
                                    "description": "Événement à déclencher lorsque ce comportement se termine. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "on_start": {
                                    "description": "Événement à déclencher lorsque ce comportement démarre. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                }
                            }
                        },
                        "minecraft:behavior.timer_flag_3": {
                            "description": "Déclenche un événement lorsque ce comportement démarre, puis attend une durée avant de s'arrêter. Lors de l'arrêt en raison du délai d'attente ou d'une interruption par un autre comportement, l'objectif déclenche un autre événement. query.timer_flag_3 renverra 1,0 sur le client et le serveur lorsque ce comportement est en cours d'exécution, et 0,0 sinon. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "cooldown_range": {
                                    "description": "Plage de temps de refroidissement minimum et maximum (en secondes) entre chaque exécution de ce comportement. \nType: `Number[2]`",
                                    "default": [10.0, 10.0],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "duration_range": {
                                    "description": "Plage de temps minimum et maximum (en secondes) que ce comportement doit être actif. \nType: `Number[2]`",
                                    "default": [2.0 , 2.0],
                                    "type": "array",
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "items": {
                                        "type": "number"
                                    }
                                },
                                "on_end": {
                                    "description": "Événement à déclencher lorsque ce comportement se termine. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "on_start": {
                                    "description": "Événement à déclencher lorsque ce comportement démarre. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                }
                            }
                        },
                        "minecraft:behavior.trade_interest": {
                            "description": "Force une Entité à se concentrer sur un joueur qui initiera un échange. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "carried_item_switch_time": {
                                    "description": "Le temps maximum en secondes que le commerçant tiendra un objet avant de tenter de le remplacer par un autre objet qui prend le même échange. \nType: `Number`",
                                    "default": 2.0,
                                    "type": "number"
                                },
                                "cooldown": {
                                    "description": "Le temps en secondes avant que le commerçant puisse utiliser à nouveau cet objectif. \nType: `Number`",
                                    "default": 2.0,
                                    "type": "number"
                                },
                                "interest_time": {
                                    "description": "Le temps maximum en secondes que le commerçant montrera ses items d'échange. \nType: `Number`",
                                    "default": 45.0,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "remove_item_time": {
                                    "description": "Le temps maximum en secondes que le commerçant attendra lorsque vous n'avez plus d'objets à échanger. \nType: `Number`",
                                    "default": 1.0,
                                    "type": "number"
                                },
                                "within_radius": {
                                    "description": "La distance en blocs à laquelle le joueur doit être pour que le commerçant soit intéressé. \nType: `Number`",
                                    "default": 0.0,
                                    "type": "number"
                                }
                            }
                        },
                        "minecraft:behavior.trade_with_player": {
                            "description": "Permet au joueur de commercer avec ce mob. Lorsque l'objectif démarre, il arrêtera la navigation du mob. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "filters": {
                                    "description": "Les filtres permettent aux objets de données de spécifier des critères de test. \nType: `Minecraft Filter`",
                                    ...commonSchemas.minecraft_filter
                                },
                                "max_distance_from_player": {
                                    "description": "La distance maximale à laquelle le joueur peut être de ce mob pour que le mob soit intéressé par le commerce. \nType: `Number`",
                                    "default": 8.0,
                                    "type": "number"
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.vex_copy_owner_target": {
                            "description": "Permet à l'entité de cibler la même entité que son propriétaire. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "entity_types": {
                                    "description": "Liste des entitiés que ce mob peut copier du propriétaire. \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "cooldown": {
                                            "description": "Le temps en secondes que l'entité doit attendre avant de pouvoir être selectionné comme cible à nouveau. \nType: `Number`",
                                            "default": 0.0,
                                            "type": "number"
                                        },
                                        "filters": {
                                            "description": "Les filtres à appliquer pour sélectionner les entités à attaquer. \nType: `Minecraft Filter`",
                                            ...commonSchemas.minecraft_filter
                                        },
                                        "max_dist": {
                                            "description": "Distance maximale à laquelle l'entité doit être pour être sélectionnée comme cible. \nType: `Number`",
                                            "default": 16,
                                            "type": "number"
                                        },
                                        "must_see": {
                                            "description": "Si vrai, l'entité doit être visible pour être sélectionnée comme cible. \nType: `Boolean`",
                                            "default": false,
                                            "type": "boolean"
                                        },
                                        "must_see_forget_duration": {
                                            "description": "Le temps en secondes que l'entité doit être hors de vue pour être oubliée comme cible. \nType: `Number`",
                                            "default": 3.0,
                                            "type": "number"
                                        },
                                        "reevaluate_description": {
                                            "description": "Si vrai, l'entité sera réévaluée comme cible à chaque tick. \nType: `Boolean`",
                                            "default": false,
                                            "type": "boolean"
                                        },
                                        "sprint_speed_multiplier": {
                                            "description": "Multiplicateur de vitesse de sprint. 1,0 signifie conserver la vitesse normale, tandis que des nombres plus élevés accélèrent la vitesse de sprint. \nType: `Number`",
                                            "default": 1.0,
                                            "type": "number"
                                        },
                                        "walk_speed_multiplier": {
                                            "description": "Multiplicateur de vitesse de marche. 1,0 signifie conserver la vitesse normale, tandis que des nombres plus élevés accélèrent la vitesse de marche. \nType: `Number`",
                                            "default": 1.0,
                                            "type": "number"
                                        }
                                    }
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.vex_random_move": {
                            "description": "Permet au mob de se déplacer aléatoirement comme le Vex. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.wither_random_attack_pos_goal": {
                            "description": "Permet au Wither de lancer des attaques aléatoires. Ne peut être utilisé que par le boss Wither. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.wither_target_highest_damage": {
                            "description": "Permet au Wither de se concentrer sur les attaques sur l'entité qui lui a infligé le plus de dégâts. Ne peut être utilisé que par le boss Wither. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "entity_types": {
                                    "description": "Liste des entitiés que ce mob peut copier du propriétaire. \nType: `Object`",
                                    "type": "object",
                                    "properties": {
                                        "cooldown": {
                                            "description": "Le temps en secondes que l'entité doit attendre avant de pouvoir être selectionné comme cible à nouveau. \nType: `Number`",
                                            "default": 0.0,
                                            "type": "number"
                                        },
                                        "filters": {
                                            "description": "Les filtres à appliquer pour sélectionner les entités à attaquer. \nType: `Minecraft Filter`",
                                            ...commonSchemas.minecraft_filter
                                        },
                                        "max_dist": {
                                            "description": "Distance maximale à laquelle l'entité doit être pour être sélectionnée comme cible. \nType: `Number`",
                                            "default": 16,
                                            "type": "number"
                                        },
                                        "must_see": {
                                            "description": "Si vrai, l'entité doit être visible pour être sélectionnée comme cible. \nType: `Boolean`",
                                            "default": false,
                                            "type": "boolean"
                                        },
                                        "must_see_forget_duration": {
                                            "description": "Le temps en secondes que l'entité doit être hors de vue pour être oubliée comme cible. \nType: `Number`",
                                            "default": 3.0,
                                            "type": "number"
                                        },
                                        "reevaluate_description": {
                                            "description": "Si vrai, l'entité sera réévaluée comme cible à chaque tick. \nType: `Boolean`",
                                            "default": false,
                                            "type": "boolean"
                                        },
                                        "sprint_speed_multiplier": {
                                            "description": "Multiplicateur de vitesse de sprint. 1,0 signifie conserver la vitesse normale, tandis que des nombres plus élevés accélèrent la vitesse de sprint. \nType: `Number`",
                                            "default": 1.0,
                                            "type": "number"
                                        },
                                        "walk_speed_multiplier": {
                                            "description": "Multiplicateur de vitesse de marche. 1,0 signifie conserver la vitesse normale, tandis que des nombres plus élevés accélèrent la vitesse de marche. \nType: `Number`",
                                            "default": 1.0,
                                            "type": "number"
                                        }
                                    }
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.work": {
                            "description": "Permet à l'entité d'utiliser le POI. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "active_time": {
                                    "description": "Le nombre de ticks que l'Entité restera à son emplacement de travail. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "can_work_in_rain": {
                                    "description": "Si vrai, cette entité peut travailler lorsque son POI de lieu de travail est sous la pluie. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "goal_cooldown": {
                                    "description": "Le nombre de ticks avant que l'objectif ne puisse être utilisé à nouveau. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "on_arrival": {
                                    "description": "L'événement à déclencher lorsque l'entité atteint son lieu de travail. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "sound_delay_max": {
                                    "description": "L'intervalle maximum dans lequel un son sera joué. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "sound_delay_min": {
                                    "description": "L'intervalle minimum dans lequel un son sera joué. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle utilise cet objectif AI. \nType: `Number`",
                                    "default": 0.50,
                                    "type": "number"
                                },
                                "work_in_rain_tolerance": {
                                    "description": "Si `can_work_in_rain` est faux, c'est le nombre maximum de ticks restants dans l'objectif où la pluie n'interrompra pas l'objectif. \nType: `Integer`",
                                    "default": -1,
                                    "type": "integer"
                                }
                            }
                        },
                        "minecraft:behavior.work_composter": {
                            "description": "Permet à l'entité d'utiliser le POI du composteur pour convertir les graines excédentaires en poudre d'os. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "active_time": {
                                    "description": "Le nombre de ticks que l'Entité restera à son emplacement de travail. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "block_interaction_max": {
                                    "description": "Le nombre maximum de fois que le mob interagira avec le composteur. \nType: `Integer`",
                                    "default": 1,
                                    "type": "integer"
                                },
                                "can_empty_composter": {
                                    "description": "Détermine si le mob peut vider un composteur plein. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "can_fill_composter": {
                                    "description": "Détermine si le mob peut ajouter des items à un composteur étant donné qu'il n'est pas plein. \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                },
                                "can_work_in_rain": {
                                    "description": "Si vrai, cette entité peut travailler lorsque son POI de lieu de travail est sous la pluie. \nType: `Boolean`",
                                    "default": false,
                                    "type": "boolean"
                                },
                                "goal_cooldown": {
                                    "description": "Le nombre de ticks avant que l'objectif ne puisse être utilisé à nouveau. \nType: `Integer`",
                                    "default": 0,
                                    "type": "integer"
                                },
                                "items_per_use_max": {
                                    "description": "Le nombre maximum d'items qui peuvent être ajoutés au composteur par interaction de bloc. \nType: `Integer`",
                                    "default": 20,
                                    "type": "integer"
                                },
                                "min_item_count": {
                                    "description": "Limite la quantité de chaque item compostable que le mob peut utiliser. Toute quantité détenue au-dessus de ce nombre sera compostée si possible. \nType: `Integer`",
                                    "default": 10,
                                    "type": "integer"
                                },
                                "on_arrival": {
                                    "description": "L'événement à déclencher lorsque l'entité atteint son lieu de travail. \nType: `EventTrigger`",
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        commonSchemas.entity_event_trigger
                                    ]
                                },
                                "priority": {
                                    "description": "La priorité de l'objectif. \nType: `Integer`",
                                    "type": "integer"
                                },
                                "speed_multiplier": {
                                    "description": "Le multiplicateur de vitesse de l'entité lorsqu'elle utilise cet objectif AI. \nType: `Number`",
                                    "default": 0.50,
                                    "type": "number"
                                },
                                "use_block_max": {
                                    "description": "Le nombre maximum de fois que le mob interagira avec le composteur. \nType: `Integer`",
                                    "default": 200,
                                    "type": "integer"
                                },
                                "use_block_min": {
                                    "description": "Le nombre minimum de fois que le mob interagira avec le composteur. \nType: `Integer`",
                                    "default": 200,
                                    "type": "integer"
                                },
                                "work_in_rain_tolerance": {
                                    "description": "Si `can_work_in_rain` est faux, c'est le nombre maximum de ticks restants dans l'objectif où la pluie n'interrompra pas l'objectif. \nType: `Integer`",
                                    "default": -1,
                                    "type": "integer"
                                }
                            }
                        }
                    }
                },
                component_groups: {
                    description: "Les groupes de composants sont des ensembles de composants qui peuvent être appliqués à une entité. Ils permettent de regrouper des composants pour une utilisation facile et cohérente.",
                    type: "object",
                    additionalProperties: {
                        $ref: "#/properties/minecraft:entity/properties/components"
                    }
                },
                events: {
                    description: "Les événements qui peuvent être déclenchés sur cette entité.",
                    type: "object",
                    additionalProperties: {
                        type: "object",
                        properties: {
                            add: {
                                description: "Les groupes de composants à ajouter à l'Entité lors de cet événement.",
                                type: "object",
                                properties: {
                                    component_groups: {
                                        description: "Les groupes de composants à ajouter à l'Entité lors de cet événement.",
                                        type: "array",
                                        items: {
                                            type: "string"
                                        }
                                    }
                                }
                            },
                            emit_particle: {
                                description: "Emet un effet de particules.",
                                type: "object",
                                properties: {
                                    particle: {
                                        description: "Le nom de l'effet de particules à émettre.",
                                        type: "string"
                                    }
                                }
                            },
                            emit_vibration: {
                                description: "Émet une vibration.",
                                type: "object",
                                properties: {
                                    vibration: {
                                        description: "Le type de vibration à émettre.",
                                        type: "string",
                                        enum: ["entity_interact", "shear", "entity_act", "entity_die"]
                                    }
                                }
                            },
                            execute_event_on_home_block: {
                                description: "[EXEPERIMENTAL] \nExecute un événement sur le bloc de la maison de l'Entité. L'Entité doit avoir le composant 'minecraft:home' pour que cet événement fonctionne.",
                                type: "object",
                                properties: {
                                    event: {
                                        description: "L'événement à exécuter sur le bloc de la maison de l'Entité.",
                                        type: "string"
                                    }
                                }
                            },
                            filters: {
                                description: "Principalement utilisé pour les réponses 'sequences'. Sert de conditions pour déterminer si l'événement doit être déclenché."
                            },
                            first_valid: {
                                description: "Exécute le premier événement valide dans la liste.",
                                type: "array",
                                items: {
                                    $ref: "#/properties/minecraft:entity/properties/events/additionalProperties"
                                }
                            },
                            play_sound: {
                                description: "Joue un son.",
                                type: "object",
                                properties: {
                                    sound: {
                                        description: "Le nom du son à jouer.",
                                        type: "string"
                                    }
                                }
                            },
                            queue_command: {
                                description: "Mettre en file d'attente une commande slash ou une série de commandes slash définies dans un tableau pour se déclencher à la fin du tick.",
                                type: "object",
                                properties: {
                                    command: {
                                        description: "La ou les commandes à exécuter.",
                                        oneOf: [
                                            {
                                                type: "string"
                                            },
                                            {
                                                type: "array",
                                                items: {
                                                    type: "string"
                                                }
                                            }
                                        ]
                                    },
                                    target: {
                                        description: "La cible de la commande",
                                        default: "self",
                                        type: "string",
                                        enum: ["self", "other", "parent", "player", "target"]
                                    }
                                }
                            },
                            randomize: {
                                description: "Exécute un événement aléatoire parmi une liste d'événements.",
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        weight: {
                                            description: "Le poids de cet événement. Plus le poids est élevé, plus la probabilité que cet événement soit choisi est grande.",
                                            type: "number"
                                        }
                                    },
                                    $ref: "#/properties/minecraft:entity/properties/events/additionalProperties"
                                }
                            },
                            remove: {
                                description: "Supprime les groupes de composants de l'Entité lors de cet événement.",
                                type: "object",
                                properties: {
                                    component_groups: {
                                        description: "Les groupes de composants à supprimer de l'Entité lors de cet événement.",
                                        type: "array",
                                        items: {
                                            type: "string"
                                        }
                                    }
                                }
                            },
                            reset_target: {
                                description: "Réinitialise la cible de l'Entité.",
                                type: "object"
                            },
                            sequence: {
                                description: "Exécute une séquence d'événements dans l'ordre.",
                                type: "array",
                                items: {
                                    $ref: "#/properties/minecraft:entity/properties/events/additionalProperties"
                                }
                            },
                            set_home_position: {
                                description: "Définit la position de la maison de l'Entité à sa position actuelle.",
                                type: "object"
                            },
                            set_property: {
                                description: "Définit la valeur des propriétés d'entités de l'Entité.",
                                type: "object",
                                propertyNames: {
                                    pattern: schemaPatterns.identifier_with_namespace
                                },
                                additionalProperties: {
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        {
                                            type: "number"
                                        },
                                        {
                                            type: "boolean"
                                        }
                                    ]
                                }
                            },
                            stop_movement: {
                                description: "Arrête le mouvement de l'Entité.",
                                type: "object",
                                properties: {
                                    stop_vertical_movement: {
                                        description: "Si vrai, l'Entité arrêtera également son mouvement vertical.",
                                        type: "boolean"
                                    },
                                    stop_horizontal_movement: {
                                        description: "Si vrai, l'Entité arrêtera également son mouvement horizontal.",
                                        type: "boolean"
                                    }
                                }
                            },
                            triggger: {
                                description: "Déclenche un événement.",
                                type: "object",
                                properties: {
                                    filters: {
                                        description: "Les filtres permettent aux objets de données de spécifier des critères de test."
                                    },
                                    event: {
                                        description: "L'événement à déclencher.",
                                        type: "string"
                                    },
                                    target: {
                                        description: "La cible de l'événement.",
                                        default: "self",
                                        type: "string",
                                        enum: ["baby", "block", "damager", "other", "parent", "player", "self", "target"]
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
        version: "1.20.60",
        changes: [
            {
                action: "modify",
                target: ["properties", "minecraft:entity", "properties", "components", "properties", "minecraft:entity_sensor"],
                value: {
                    "description": "Composant qui possède plusieurs sous-cpateurs où chacun déclenche un événement  lorsque les conditions sont valides par les autres entités dans la plage défini. \nType: `Object`",
                    "type": "object",
                    "properties": {
                        "find_players_only": {
                            "description": "Définit si la recherche est limitée uniquement aux joueurs pour tous les sous-capteurs. \nType: `Boolean`",
                            "default": false,
                            "type": "boolean"
                        },
                        "relative_range": {
                            "description": "Définit si la plage des sous-capteurs est additive par rapport à la taille de l'entité. \nType: `Boolean` \nNote: Additive signifie que la plage des sous-capteurs est ajoutée à la taille de l'entité.",
                            "default": true,
                            "type": "boolean"
                        },
                        "subsensors": {
                            "description": "La liste des sous-capteurs qui détectent les entités et émettent des événements lorsque toutes leurs conditions sont remplies. \nType: `Object[]`",
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "cooldown": {
                                        "description": "De combien de secondes le sous-capteur doit attendre avant de pouvoir détecter à nouveau des entités. \nType: `Number` \nNote: Une valeur négative signifie qu'aucun temps de recharge n'est utilisé.",
                                        "default": -1,
                                        "type": "number"
                                    },
                                    "event": {
                                        "description": "L'événement à déclencher quand les conditions du sous-capteur sont remplies. \nType: `EventTrigger`",
                                        type: "string"
                                    },
                                    "event_filters": {
                                        "description": "L'ensemble de conditions qui doivent être satisfaites pour que l'événement soit déclenché. \nType: `Minecraft Filter`",
                                        $ref: "#/definitions/minecraft_filter"
                                    },
                                    "maximum_count": {
                                        "description": "Le nombre maximum d'entités qui peuvent être détectées par le sous-capteur. \nType: `Integer`",
                                        "default": -1,
                                        "type": "integer"
                                    },
                                    "minimum_count": {
                                        "description": "Le nombre minimum d'entités qui doivent être détectées par le sous-capteur pour que l'événement soit déclenché. \nType: `Integer`",
                                        "default": 1,
                                        "type": "integer"
                                    },
                                    "range": {
                                        "description": "La distance maximale à laquelle les entités peuvent être détectées par le sous-capteur. \nType: `Number`",
                                        "default": 10,
                                        "type": "number"
                                    },
                                    "require_all": {
                                        "description": "Définit si toutes les entités à portée doivent satisfaire les conditions du sous-capteur pour que l'événement soit déclenché. \nType: `Boolean`",
                                        "default": false,
                                        "type": "boolean"
                                    },
                                    "y_offset": {
                                        "description": "Décalage vertical appliquée à la position de l'Entité lors du calcul de la distance par rapport aux autres entités. \nType: `Number`",
                                        "default": 0.0,
                                        "type": "number"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        ]
    },
    {
        version: "1.20.70",
        changes: [
            {
                action: "modify",
                target: ["properties", "minecraft:entity", "properties", "components", "properties", "minecraft:entity_sensor", "properties", "subsensors", "items", "properties", "range"],
                value: {
                    "description": "La distance horizontale et verticale maximale à laquelle les entités peuvent être détectées par le sous-capteur. \nType: `Number[2]`",
                    "type": "array",
                    "minItems": 2,
                    "maxItems": 2,
                    "items": {
                        "type": "number"
                    }
                }
            }
        ]
    },
    {
        version: "1.21.10",
        changes: [
            {
                action: "remove",
                target: ["properties", "minecraft:entity", "properties", "description", "properties", "aliases"]
            }
        ]
    },
    {
        version: "1.21.70",
        changes: [
            {
                action: "modify",
                target: ["properties", "minecraft:entity", "properties", "components", "properties", "minecraft:behavior.float_wander", "properties", "use_home_position_restriction", "default"],
                value: true
            }
        ]
    },
    {
        version: "1.21.80",
        changes: [
            {
                action: "modify",
                target: ["properties", "minecraft:entity", "properties", "components", "properties", "minecraft:leashable", "properties", "on_unleash", "description"],
                value: "Evénement à déclencher lorsque la laisse attachée à l'Entité se brise."
            },
            {
                action: "add",
                target: ["properties", "minecraft:entity", "properties", "components", "properties", "minecraft:leashable", "properties", "on_unleash_interact_only"],
                value: {
                    description: "Si vrai, l'événement `on_unleash` ne sera déclenché que si l'Entité est déliée par un joueur.",
                    default : false,
                    type: "boolean"
                }
            }
        ]
    }
];

export const entitySchemaTypeBP: SchemaType = {
    fileMatch: ["**/addon/behavior_pack/entities/**/*.json"],
    baseSchema: baseSchema,
    versionedChanges: versionedChanges
};