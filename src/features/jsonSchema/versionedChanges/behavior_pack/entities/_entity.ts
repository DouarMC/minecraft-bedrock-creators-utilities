import { SchemaChange, SchemaType } from "../../../../../types/schema";
import { dynamicExamplesSourceKeys } from "../../../shared/schemaEnums";
import { schemaPatterns } from "../../../shared/schemaPatterns";

const baseSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
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
                                type: "string" // BUG FIX, mettre une liste de pattern pour animation et animation controller, mais faut changer algorithme de validation support liste pattern
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
                            description: "Ajoute un cavalier à l'Entité.  Type: `Object`. L'Entité doit avoir le composant `minecraft:rideable`.",
                            type: "object",
                            properties: {
                                entity_type: {
                                    description: "Définit le type de l'entité qui chevauchera cette Entité.",
                                    type: "string"
                                },
                                spawn_event: {
                                    description: "Le spawn event qui sera déclenché sur l'Entité chevauchée quand son cavalier sera crée.",
                                    type: "string"
                                },
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
                            description: "Ajoute un timer pour que l'Entité grandisse. Le timer peut être accéléré en donnant à l'Entité des items qu'elle aime comme défini par `feed_items`.",
                            type: "object",
                            properties: {
                                drop_items: {
                                    description: "Items que l'Entité lâche quand elle grandit.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                duration: {
                                    description: "Temps en secondes avant que l'Entité grandisse.  Type: `Number`. Une valeur de `-1` signifie que l'Entité restera toujours un bébé.",
                                    default: 1200,
                                    type: "number"
                                },
                                feed_items: {
                                    description: "Liste des items qui peuvent être donnés à l'Entité pour accélérer sa croissance. Inclut `item` pour le nom de l'item et `growth` pour définir combien de temps la croissance est accélérée.",
                                    type: "array",
                                    items: {
                                        oneOf: [
                                            {
                                                type: "string"
                                            },
                                            {
                                                type: "object",
                                                properties: {
                                                    item: {
                                                        description: "Nom de l'item.",
                                                        type: "string"
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
                                },
                                interact_filters: {
                                    description: "Liste des conditions à remplir pour que l'Entité soit nourrie.",
                                },
                                transform_to_item: {
                                    description: "L'item utilisé se transformera en cet item après une interaction réussie.",
                                    type: "string"
                                },
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
                                    description: "Liste des événements sonores à jouer avec des conditions pour les choisirs.  Type: `Object[]`. Evaluer dans l'ordre, le premier qui est vrai gagne. Si aucun n'est vrai, `event_name` prendra le dessus.",
                                    type: "array",
                                    items: {
                                        type: "object"
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
                            description: "Oblige l'Entité à suivre son niveau de colère envers un ensemble de nuisances.",
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
                                },
                                on_increase_sounds: {
                                    description: "Sons à jouer lorsque l'Entité est provoquée. Évalué dans l'ordre; la première condition correspondante gagne.",
                                    type: "array",
                                    items: {
                                        type: "object"
                                    }
                                },
                                remove_targets_below_angry_threshold: {
                                    description: "Définit si l'Entité doit supprimer la cible s'il tombe en dessous du seuil de colère.",
                                    default: true,
                                    type: "boolean"
                                },
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
                                        type: "string"
                                    }
                                },
                                calm_event: {
                                    description: "L'événement à déclencher lorsque l'Entité devient calme.",
                                },
                                duration: {
                                    description: "Temps en secondes que l'Entité restera en colère.",
                                    default: 25,
                                    type: "integer"
                                },
                                duration_delta: {
                                    description: "Variation en secondes ajoutée à la durée de la colère.  Type: `Integer`. La valeur est ajoutée ou soustraite de la durée de la colère. Par exemple, si la durée est de 25 et la variation est de 5, la durée de la colère sera entre 20 et 30 secondes.",
                                    default: 0,
                                    type: "integer"
                                },
                                filters: {
                                    description: "Filtre qui est appliqué pour déterminer les types de mobs qui ne doivent pas être attaqués pendant que l'Entité est en colère.",
                                },
                                sound_interval: {
                                    description: "La plage de temps en secondes à attendre avant de rejouer le son de colère.",
                                    default: 0,
                                    type: "array",
                                    items: {
                                        type: "number"
                                    }
                                },
                            }
                        },
                        "minecraft:annotation.break_door": {
                            description: "Oblige l'Entité à casser des portes, en supposant que des 'flags' soient configurés pour que le composant les utilise dans la navigation.  Type: `Object`. Nécessite que le composant de navigation de l'entité ait le paramètre `can_break_doors` défini sur `true`.",
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
                                },
                            }
                        },
                        "minecraft:annotation.open_door": {
                            description: "Oblige l'Entité à ouvrir des portes, en supposant que des 'flags' soient configurés pour que le composant les utilise dans la navigation.  Type: `Object`. Nécessite que le composant de navigation de l'entité ait le paramètre `can_open_doors` défini sur `true`.",
                            type: "object"
                        },
                        "minecraft:area_attack": {
                            description: "Composant permettant à l'Entité d'attaquer toutes les entités dans une zone autour d'elle.",
                            type: "object",
                            properties: {
                                cause: {
                                    description: "Le type de dégâts infligés par l'attaque.",
                                    type: "string"
                                },
                                entity_filter: {
                                    description: "L'ensemble d'entités valides sur lesquelles appliquer des dégâts dans la zone.",
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
                            }
                        },
                        "minecraft:attack": {
                            description: "Définit une attaque de mêlée pour l'Entité.",
                            type: "object",
                            properties: {
                                damage: {
                                    description: "Le montant de dégâts infligés par l'attaque.  Type: `Integer | Integer[2]`  Note: Une valeur négative soignera l'Entité.. Si un tableau est fourni, un montant de dégâts aléatoire sera choisi entre les deux valeurs.",
                                },
                                effect_duration: {
                                    description: "Durée en secondes de l'effet appliqué à l'entité touchée.",
                                    default: 0,
                                },
                                effect_name: {
                                    description: "Nom de l'effet appliqué à l'entité touchée.",
                                    type: "string"
                                },
                            }
                        },
                        "minecraft:attack_cooldown": {
                            description: "Ajoute un cooldown à une Entité. L'intention du cooldown est d'empêcher l'Entité de tenter d'acquérir de nouvelles cibles d'attaque.",
                            type: "object",
                            properties: {
                                attack_cooldown_complete_event: {
                                    description: "L'événement à déclencher lorsque le cooldown est terminé.",
                                },
                                attack_cooldown_time: {
                                    description: "Temps en secondes avant que l'Entité puisse attaquer à nouveau.",
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
                                    type: "string"
                                },
                                on_unballoon: {
                                    description: "Evénement à déclencher lorsque l'Entité n'est plus ballonnée.",
                                    type: "string"
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
                                    type: "string"
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
                                    description: "Liste des blocs ç surveiller quand ils sont cassés pour déclencher l'événement d'entité associé.  Type: `Object[]`. Si un bloc est dans plusieurs listes, plusieurs événements se produiront.",
                                    type: "array",
                                    items: {
                                        type: "object"
                                    }
                                },
                                sensor_radius: {
                                    description: "La distance radiale maximale à laquelle un bloc peut être détecté.",
                                    default: 16,
                                    type: "number",
                                    maximum: 32
                                },
                                sources: {
                                    description: "Liste des sources de cassage blocs qui déclencheront l'événement. Si aucune n'est spécifiée, tous les blocs cassés déclencheront l'événement.  Type: `String[]`. Si aucun n'est spécifié, tous les blocs cassés déclencheront l'événement.",
                                    type: "array",
                                    items: {
                                        type: "string"
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
                            description: "Lorsque ce compoqsant est défini, l'entité ne tournera plus visuellement son corps pour correspondre à sa direction de face.",
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
                                        type: "object"
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
                                    description: "Le nom du boss affiché au dessus de la barre de boss.",
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
                                        type: "string"
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
                                        type: "string"
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
                                        type: "string"
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
                            description: "Oblige l'Entité à entrer dans l'état d'amour utilisé pour la reproduction.  Type: `Object`. L'Entité doit avoir le composant `minecraft:behavior.breed` pour se reproduire.",
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
                                        type: "string"
                                    }
                                },
                                breeds_with: {
                                    description: "Liste des définitions d'entités avec lesquelles l'Entité peut se reproduire.",
                                    type: "array",
                                    items: {
                                        type: "object"
                                    }
                                },
                                causes_pregnancy: {
                                    description: "Définit si l'Entité deviendra enceinte au lieu de faire apparaitre un bébé.",
                                    default: false,
                                    type: "boolean"
                                },
                                combine_parent_colors: {
                                    description: "Définit si lorsque deux Entités de ce type se reproduisent, la couleur du bébé sera un mélange des couleurs ('minecraft:color') des parents à condition qu'elles soient compatibles. Sinon la couleur du bébé sera choisie aléatoirement entre celle du père ou de la mère.",
                                    type: "boolean"
                                },
                                deny_parents_variant: {
                                    description: "Détermine à quel point il est probable qu'un bébé de parents avec la même variante nie cette variante et prenne plutôt une variante aléatoire dans la plage donnée.",
                                    type: "object"
                                },
                                environment_requirements: {
                                    description: "La liste des exigences de blocs à proximité pour amener l'Entité dans l'état d'amour.",
                                    type: "array",
                                    items: {
                                        type: "object"
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
                                },
                                mutation_factor: {
                                    description: "Détermine à quel point les bébés sont susceptibles de NE PAS hériter des variantes de l'un de leurs parents. Les valeurs sont comprises entre 0,0 et 1,0, un nombre plus élevé correspondant à une probabilité de mutation plus élevée.",
                                    type: "object"
                                },
                                mutation_strategy: {
                                    description: "Stratégie utilisée pour muter les variantes et les variantes supplémentaires pour la progéniture. Les alternatives valides actuelles sont 'random' et 'none'.",
                                    default: "none",
                                    type: "string",
                                    enum: ["none", "random"]
                                },
                                parent_centric_attribute_blending: {
                                    description: "[EXPERIMENTALE]  Liste des attributs qui devraient bénéficier du mélange des attributs centrés sur les parents. Par exemple, les chevaux mélangent leur santé, leur mouvement et leur force de saut dans leur progéniture.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                property_inheritance: {
                                    description: "Définit les propriétés d'entités de l'Entité qui seront héritées par la progéniture.",
                                    type: "object"
                                },
                                random_extra_variant_mutation_interval: {
                                    description: "Plage utilisée pour déterminer une variante supplémentaire aléatoire.",
                                    default: 0,
                                    type: "array",
                                    items: {
                                    }
                                },
                                random_variant_mutation_interval: {
                                    description: "Plage utilisée pour déterminer une variante aléatoire.",
                                    default: 0,
                                    type: "array",
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
                                    type: "string"
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
                                        type: "string"
                                    }
                                },
                            }
                        },
                        "minecraft:buoyant": {
                            description: "Permet à l'Entité de flotter sur les blocs liquides spécifiés.",
                            type: "object",
                            properties: {
                                apply_gravity: {
                                    description: "Applique la gravité à l'Entité lorsqu'elle est dans l'eau.",
                                    default: true,
                                    type: "boolean"
                                },
                                base_buoyancy: {
                                    description: "Flottabilité de base utilisée pour calculer combien l'entité flottera.",
                                    default: 1,
                                    type: "number"
                                },
                                big_wave_probability: {
                                    description: "Probailité qu'une grosse vague frappe l'entité. Utilisé uniquement si `simulate_waves` est vrai.",
                                    default: 0.03,
                                    type: "number",
                                    minimum: 0,
                                    maximum: 1
                                },
                                big_wave_speed: {
                                    description: "Multiplicateur pour la vitesse pour faire une grosse vague. Déclenché en fonction de `big_wave_probability`.",
                                    default: 10,
                                    type: "number"
                                },
                                drag_down_on_buoyancy_removed: {
                                    description: "De combien l'Entité sera tirée vers le bas lorsqu'on lui retire ce composant",
                                    default: 0,
                                    type: "number"
                                },
                                liquid_blocks: {
                                    description: "Liste des blocs sur lesquels l'Entité peut flotter. Doit être un bloc liquide.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                simulate_waves: {
                                    description: "Définit si l'Entité doit simuler des vagues lorsqu'elle est dans l'eau.",
                                    default: true,
                                    type: "boolean"
                                },
                            }
                        },
                        "minecraft:burns_in_daylight": {
                            description: "Oblige l'Entité à brûler à la lumière du jour.",
                            type: "object"
                        },
                        "minecraft:can_climb": {
                            description: "Permet à l'Entité de grimper aux échelles.",
                            type: "object"
                        },
                        "minecraft:can_fly": {
                            description: "Permet à l'Entité de voler.",
                            type: "object"
                        },
                        "minecraft:can_join_raid": {
                            description: "Définit que l'Entité peut rejoindre un raid existant.",
                            type: "object"
                        },
                        "minecraft:can_power_jump": {
                            description: "Permet à l'Entité de sauter avec une puissance comme les chevaux.",
                            type: "object"
                        },
                        "minecraft:cannot_be_attacked": {
                            description: "Empêche les entités de s'attaquer à l'Entité sauf si elles ont le composant `minecraft:ignore_cannot_be_attacked`.",
                            type: "object"
                        },
                        "minecraft:celebrate_hunt": {
                            description: "Oblige l'Entité à célébrer lorsqu'elle chasse une entité spécifique.",
                            type: "object",
                            properties: {
                                broadcast: {
                                    description: "Définit si la célébration sera diffusée à d'autres entités dans la plage de diffusion.",
                                    default: true,
                                    type: "boolean"
                                },
                                celebration_targets: {
                                    description: "Liste des conditions que la cible d'une chasse doit satisfaire pour initier la célébration.",
                                },
                                celebrate_sound: {
                                    description: "L'événement sonore à jouer lorsque l'Entité célèbre.",
                                    type: "string"
                                },
                                duration: {
                                    description: "Durée en secondes de la célébration.",
                                    default: 4,
                                    type: "integer"
                                },
                                radius: {
                                    description: "Si la diffusion est activée, spécifie le rayon dans lequel elle notifiera d'autres entités pour la célébration.",
                                    default: 16,
                                    type: "number"
                                },
                                sound_interval: {
                                    description: "La plage de temps en secondes à attendre avant de rejouer le son de célébration.",
                                    default: 0,
                                    type: "object"
                                },
                            }
                        },
                        "minecraft:collision_box": {
                            description: "Définit la largeur et la hauteur de la boîte de collision de l'Entité.",
                            type: "object",
                            properties: {
                                height: {
                                    description: "La hauteur de la boîte de collision de l'Entité.",
                                    default: 1,
                                    type: "number"
                                },
                                width: {
                                    description: "La largeur de la boîte de collision de l'Entité.",
                                    default: 1,
                                    type: "number",
                                    minimum: -100000000,
                                    maximum: 100000000
                                },
                            }
                        },
                        "minecraft:color": {
                            description: "Définit la couleur principale de l'Entité.  Type: `Object`. Cet attribut ne fonctionne que sur les entités vanilles qui ont des valeurs de couleur prédéfinies (mouton, lama, shulker).",
                            type: "object",
                            properties: {
                                color: {
                                    description: "La couleur principale de l'Entité.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:color2": {
                            description: "Définit la couleur de la seconde texture de l'Entité.  Type: `Object`  Note : Cet attribut ne fonctionne que sur les entités vanilles qui ont des valeurs de couleur prédéfinies (poisson tropical).",
                            type: "object",
                            properties: {
                                value: {
                                    description: "La couleur de la seconde texture de l'Entité.",
                                    default: 0,
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:combat_regeneration": {
                            description: "Ajoute Régénération I et supprime l'effet Fatigue de Minage de l'entité qui tue la cible d'attaque de l'Acteur.",
                            type: "object",
                            properties: {
                                regeneration_duration: {
                                    description: "La durée en secondes pendant laquelle l'Entité gagnera Régénération I.",
                                    default: 5,
                                },
                                apply_to_self: {
                                    description: "Définit si l'Entité s'accordera la Régénération de Combat si elle tue la cible.",
                                    default: false,
                                    type: "boolean"
                                },
                                apply_to_family: {
                                    description: "Définit si l'Entité accordera la Régénération de Combat aux entités de la même famille si elles tuent la cible.",
                                    default: false,
                                    type: "boolean"
                                },
                            }
                        },
                        "minecraft:conditional_bandwidth_optimization": {
                            description: "Définit les optimisations de bande passante de mise à jour spatiale conditionnelle de l'Entité.",
                            type: "object",
                            properties: {
                                conditional_values: {
                                    description: "L'objet contenant les valeurs d'optimisation de bande passante conditionnelle.",
                                    type: "array",
                                    items: {
                                        type: "object"
                                    }
                                },
                                default_values: {
                                    description: "L'objet contenant les valeurs d'optimisation de bande passante par défaut.",
                                    type: "object"
                                },
                            }
                        },
                        "minecraft:custom_hit_test": {
                            description: "Définit les boîtes de collision pour les attaques de mêlée et à distance contre l'Entité.",
                            type: "object",
                            properties: {
                                hitboxes: {
                                    description: "Contient les boîtes de collision pour les attaques de mêlée et à distance contre l'Entité.",
                                    type: "array",
                                    items: {
                                        type: "object"
                                    }
                                },
                            }
                        },
                        "minecraft:damage_over_time": {
                            description: "Inflige un montant de dégâts à l'Entité à des intervalles spécifiés.",
                            type: "object",
                            properties: {
                                damage_per_hurt: {
                                    description: "Montant de dégâts infligés à l'Entité à chaque intervalle.",
                                    default: 1,
                                    type: "integer"
                                },
                                time_between_hurt: {
                                    description: "Temps en secondes entre les dégâts.",
                                    default: 0,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:damage_sensor": {
                            description: "Définit les événements à appeler lorsque l'Entité est endommagée par des entités ou des items spécifiques.",
                            type: "object",
                            properties: {
                                triggers: {
                                    description: "Liste des déclencheurs avec les événements à appeler lors de la prise de dégâts spécifiques.",
                                },
                            }
                        },
                        "minecraft:dash": {
                            description: "Détermine si l'Entité chevauchable peut effectuer un dash comme le chameau.",
                            type: "object",
                            properties: {
                                cooldown_time: {
                                    description: "Le temps de recharge du dash, en secondes.",
                                    default: 1,
                                    type: "number"
                                },
                                horizontal_momentum: {
                                    description: "Le momentum horizontal du dash.",
                                    default: 1,
                                    type: "number"
                                },
                                vertical_momentum: {
                                    description: "Le momentum vertical du dash.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:default_look_angle": {
                            description: "Définit l'angle par défaut de rotation de la tête de l'Entité.",
                            type: "object",
                            properties: {
                                value: {
                                    description: "L'angle de rotation de la tête de l'Entité.",
                                    default: 0,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:despawn": {
                            description: "Force l'Entité à despawn lorsqu'une condition spécifique est remplie.",
                            type: "object",
                            properties: {
                                despawn_from_distance: {
                                    description: "Spécifie si la distance minimale et maximale est utilisée dans les règles de despawn standard.",
                                    type: "object"
                                },
                                despawn_from_chance: {
                                    description: "Détermine si 'min_range_random_chance' est utilisé dans les règles de despawn standard.",
                                    default: true,
                                    type: "boolean"
                                },
                                despawn_from_inactivity: {
                                    description: "Détermine si 'min_range_inactivity_timer' est utilisé dans les règles de despawn standard.",
                                    default: true,
                                    type: "boolean"
                                },
                                despawn_from_simulation_edge: {
                                    description: "Détermine si l'Entité est instantanément despawn à la limite de la distance de simulation dans les règles de despawn standard.",
                                    default: true,
                                    type: "boolean"
                                },
                                filters: {
                                    description: "La liste des conditions qui doivent être satisfaites avant que l'Entité ne soit despawn. Si un filtre est défini, les règles de despawn standard sont ignorées.",
                                },
                                min_range_inactivity_timer: {
                                    description: "Le temps en secondes que l'Entité doit être inactive avant de despawn.",
                                    default: 30,
                                    type: "integer"
                                },
                                min_range_random_chance: {
                                    description: "Une chance aléatoire entre 1 et la valeur donnée pour que l'Entité despawn.",
                                    default: 800,
                                    type: "integer"
                                },
                                remove_child_entities: {
                                    description: "Définit si toutes les entités liées à cette Entité dans une relation enfant (par exemple, en laisse) seront également despawn.",
                                    default: false,
                                    type: "boolean"
                                },
                            }
                        },
                        "minecraft:dimension_bound": {
                            description: "Empêche l'Entité de changer de dimension via les portails.",
                            type: "object"
                        },
                        "minecraft:drying_out_timer": {
                            description: "Définit un minuteur pour le séchage qui comptera et initiera 'dried_out_event' ou s'arrêtera si l'Entité est sous la pluie ou dans l'eau, initialisant 'stopped_drying_out_event'.",
                            type: "object",
                            properties: {
                                total_time: {
                                    description: "Temps en secondes avant que l'Entité ne soit complètement séchée.",
                                    default: 0,
                                    type: "number"
                                },
                                dried_out_event: {
                                    description: "Evénement à executer lorsque l'Entité est complètement séchée.",
                                },
                                recover_after_dried_out_event: {
                                    description: "Evénement à executer lorsque l'Entité est déjà complètement séchée mais reçoit un approvisionnement en eau.",
                                },
                                stopped_drying_out_event: {
                                    description: "Evénement à executer lorsque l'Entité est sous la pluie ou dans l'eau.",
                                },
                                water_bottle_refill_time: {
                                    description: "Temps supplémentaire, en secondes, donné par l'utilisation d'une bouteille d'eau sur l'Entité.",
                                    default: 0,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:dweller": {
                            description: "Force l'Entité à rejoindre et migrer entre les villages et autres habitations.",
                            type: "object",
                            properties: {
                                dwelling_type: {
                                    description: "Le type de logement que l'Entité souhaite rejoindre.",
                                },
                                dweller_role: {
                                    description: "Le role que l'Entité joue dans le logement.",
                                    type: "string",
                                    enum: ["inhabitant", "defender", "hostile", "passive"]
                                },
                                update_interval_base: {
                                    description: "Définit la fréquence à laquelle l'Entité vérifie son statut de logement en ticks. Valeurs positives uniquement.",
                                    type: "number",
                                    minimum: 0
                                },
                                update_interval_variant: {
                                    description: "La valeur de variante en ticks qui sera ajoutée à 'update_interval_base'.",
                                    type: "number"
                                },
                                can_find_poi: {
                                    description: "Définit si l'Entité peut trouver et ajouter des POI au logement.",
                                    type: "boolean"
                                },
                                first_founding_reward: {
                                    description: "Détermine combien de réputation les joueurs sont récompensés lors de la première fondation.",
                                    type: "integer"
                                },
                                can_migrate: {
                                    description: "Détermine si l'Entité peut migrer entre les logements, ou seulement avoir son logement initial.",
                                    type: "boolean"
                                },
                                dwelling_bounds_tolerance: {
                                    description: "Une distance de tampon pour vérifier si l'Entité est dans le logement.",
                                    type: "number"
                                },
                                preferred_profession: {
                                    description: "Permet à l'utilisateur de définir une profession de départ pour ce Dweller particulier, au lieu de les laisser choisir de manière organique. (Ils doivent toujours gagner de l'expérience en échange avant que cela ne prenne effet.)",
                                    type: "string"
                                },
                            }
                        },
                        "minecraft:economy_trade_table": {
                            description: "Donne la capacité à l'Entité d'echanger avec les joueurs.",
                            type: "object",
                            properties: {
                                convert_trades_economy: {
                                    description: "Définit si l'Entité doit convertir ses échanges lorsqu'elle est transformée en une autre entité avec un 'economy_trade_table'.",
                                    default: false,
                                    type: "boolean"
                                },
                                cured_discount: {
                                    description: "De combien le rabais doit être modifié lorsque le joueur a guéri le Zombie Villager. Peut être spécifié comme une paire de nombres (rabais de commerce de bas niveau et rabais de commerce de haut niveau).",
                                    default: [-5, -20],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "integer"
                                    }
                                },
                                display_name: {
                                    description: "Le nom à afficher lors de l'échange avec l'Entité.",
                                    type: "string"
                                },
                                hero_demand_discount: {
                                    description: "Utilisé dans les prix hérités pour déterminer de combien la demande doit être modifiée lorsque le joueur a l'effet de mob Hero of the Village.",
                                    default: -4,
                                    type: "integer"
                                },
                                max_cured_discount: {
                                    description: "Le montant maximum que le rabais peut être modifié lorsque le joueur a guéri le Zombie Villager. Peut être spécifié comme une paire de nombres (rabais de commerce de bas niveau et rabais de commerce de haut niveau).",
                                    default: [-25,-63],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "integer"
                                    }
                                },
                                max_nearby_cured_discount: {
                                    description: "Le montant maximum que le rabais peut être modifié lorsque le joueur a guéri un Zombie Villager à proximité.",
                                    default: -200,
                                    type: "integer"
                                },
                                nearby_cured_discount: {
                                    description: "De combien le rabais doit être modifié lorsque le joueur a guéri un Zombie Villager à proximité.",
                                    default: -25,
                                    type: "integer"
                                },
                                new_screen: {
                                    description: "Utilisé pour déterminer si le commerce avec l'Entité ouvre le nouvel écran de commerce.",
                                    default: false,
                                    type: "boolean"
                                },
                                persist_trades: {
                                    description: "Détermine si les échanges doivent persister lorsque l'Entité se transforme. Cela fait en sorte que la prochaine fois que le mob est transformé en quelque chose avec un 'trade_table' ou 'economy_trade_table', il conserve ses échanges.",
                                    default: false,
                                    type: "boolean"
                                },
                                show_trade_screen: {
                                    description: "Montre un écran de commerce en jeu lors de l'interaction avec l'Entité.",
                                    default: true,
                                    type: "boolean"
                                },
                                table: {
                                    description: "Chemin relatif à la racine du pack de comportement pour les échanges de cette Entité.",
                                    type: "string"
                                },
                                use_legacy_price_formula: {
                                    description: "Détermine si la formule ancienne est utilisée pour déterminer les prix de commerce.",
                                    default: false,
                                    type: "boolean"
                                },
                            }
                        },
                        "minecraft:entity_armor_equipment_slot_mapping": {
                            description: "Spécifie l'emplacement de l'armure où un item dans le deuxième slot du composant 'minecraft:equippable' doit être équipé.  Type: `Object`. Ceci est automatiquement appliqué à toutes les entités pour les mondes avec une version supérieure ou égale à 1.21.10. Pour les mondes plus anciens, 'slot.armor.torso' sera utilisé. Il est fortement conseillé de ne pas utiliser explicitement ce composant, car aucune compatibilité ascendante ne sera fournie.",
                            type: "object",
                            properties: {
                                armor_slot: {
                                    description: "Spécifie l'emplacement de l'armure où un item dans le deuxième slot du composant 'minecraft:equippable' doit être équipé.",
                                    default: "slot.armor.body",
                                    type: "string"
                                },
                            }
                        },
                        "minecraft:entity_sensor": {
                            description: "Composant qui possède plusieurs sous-cpateurs où chacun déclenche un événement  lorsque les conditions sont valides par les autres entités dans la plage défini.",
                            type: "object",
                            properties: {
                                event: {
                                    description: "L'événement à déclencher quand les conditions sont remplies.",
                                },
                                event_filters: {
                                    description: "L'ensemble de conditions qui doivent être satisfaites pour que l'événement soit déclenché.",
                                },
                                maximum_count: {
                                    description: "Le nombre maximum d'entités qui peuvent être détectées.",
                                    default: -1,
                                    type: "integer"
                                },
                                minimum_count: {
                                    description: "Le nombre minimum d'entités qui doivent être détectées  pour que l'événement soit déclenché.",
                                    default: 1,
                                    type: "integer"
                                },
                                relative_range: {
                                    description: "Définit si la plage est additive par rapport à la taille de l'entité.  Type: `Boolean`. Additive signifie que la plage est ajoutée à la taille de l'entité.",
                                    default: true,
                                    type: "boolean"
                                },
                                require_all: {
                                    description: "Définit si toutes les entités à portée doivent satisfaire les conditions pour que l'événement soit déclenché.",
                                    default: false,
                                    type: "boolean"
                                },
                                sensor_range: {
                                    description: "La distance maximale à laquelle les entités peuvent être détectées.",
                                    default: 10,
                                    type: "number"
                                },
                                y_offset: {
                                    description: "Décalage vertical appliquée à la position de l'Entité lors du calcul de la distance par rapport aux autres entités.",
                                    default: 0,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:environment_sensor": {
                            description: "Crée un déclencheur basé sur les conditions de l'environnement.",
                            type: "object",
                            properties: {
                                triggers: {
                                    description: "La liste des déclencheurs qui sont déclenchés lorsque les conditions de l'environnement correspondent aux critères de filtre donnés.",
                                },
                            }
                        },
                        "minecraft:equip_item": {
                            description: "Force l'Entité à équiper des items.",
                            type: "object",
                            properties: {
                                excluded_items: {
                                    description: "Liste des items que l'Entité ne peut pas équiper.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                            }
                        },
                        "minecraft:equipment": {
                            description: "Définit la Loot Table à utiliser pour l'équipement de l'Entité.",
                            type: "object",
                            properties: {
                                slot_drop_chance: {
                                    description: "Une liste de slots avec la chance de laisser tomber un item équipé de ce slot.",
                                    type: "array",
                                    items: {
                                        type: "object"
                                    }
                                },
                                table: {
                                    description: "Le chemin relatif à la racine du pack de comportement de la Loot Table à utiliser pour l'équipement de l'Entité.",
                                    type: "string"
                                },
                            }
                        },
                        "minecraft:equippable": {
                            description: "Définit le comportement des slots de l'Entité.",
                            type: "object",
                            properties: {
                                slots: {
                                    description: "Liste des slots et l'item qui peut être équipé.",
                                    type: "array",
                                    items: {
                                        type: "object"
                                    }
                                },
                            }
                        },
                        "minecraft:exhaustion_values": {
                            description: "Définit combien d'épuisement chaque action du joueur devrait prendre.",
                            type: "object",
                            properties: {
                                attack: {
                                    description: "Montant d'épuisement appliqué lors d'une attaque.",
                                    default: 0.1,
                                    type: "number"
                                },
                                damage: {
                                    description: "Montant d'épuisement appliqué lors de la prise de dégâts.",
                                    default: 0.1,
                                    type: "number"
                                },
                                heal: {
                                    description: "Montant d'épuisement appliqué lors de la guérison grâce àa la regénération de nourriture.",
                                    default: 6,
                                    type: "number"
                                },
                                jump: {
                                    description: "Montant d'épuisement appliqué lors d'un saut.",
                                    default: 0.05,
                                    type: "number"
                                },
                                mine: {
                                    description: "Montant d'épuisement appliqué lors de l'exploitation minière.",
                                    default: 0.005,
                                    type: "number"
                                },
                                sprint: {
                                    description: "Montant d'épuisement appliqué lors de la course.",
                                    default: 0.01,
                                    type: "number"
                                },
                                sprint_jump: {
                                    description: "Montant d'épuisement appliqué lors d'un saut en sprint.",
                                    default: 0.2,
                                    type: "number"
                                },
                                swim: {
                                    description: "Montant d'épuisement appliqué lors de la nage.",
                                    default: 0.01,
                                    type: "number"
                                },
                                walk: {
                                    description: "Montant d'épuisement appliqué lors de la marche.",
                                    default: 0,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:experience_reward": {
                            description: "Définit la quantité d'expérience récompensée lorsqu'une Entité meurt ou est élevée avec succès.",
                            type: "object",
                            properties: {
                                on_bred: {
                                    description: "Une expression Molang définissant la quantité d'expérience récompensée lorsque l'Entité est élevée avec succès. Un tableau d'expressions ajoute le résultat de chaque expression ensemble pour un total final.",
                                    default: 0,
                                },
                                on_death: {
                                    description: "Une expression Molang définissant la quantité d'expérience récompensée lorsque l'Entité meurt. Un tableau d'expressions ajoute le résultat de chaque expression ensemble pour un total final.",
                                    default: 0,
                                },
                            }
                        },
                        "minecraft:explode": {
                            description: "Définit comment l'Entité explose.",
                            type: "object",
                            properties: {
                                allow_underwater: {
                                    description: "Définit si l'explosion affectera les blocs et les entités sous l'eau.",
                                    default: true,
                                    type: "boolean"
                                },
                                breaks_blocks: {
                                    description: "Définit si l'explosion détruira les blocs dans le rayon de l'explosion.",
                                    default: true,
                                    type: "boolean"
                                },
                                causes_fire: {
                                    description: "Définit si les blocs dans le rayon de l'explosion seront en feu.",
                                    default: false,
                                    type: "boolean"
                                },
                                damage_scaling: {
                                    description: "Un facteur d'échelle appliqué aux dégâts de l'explosion aux entités. Une valeur de 0.0 empêche l'explosion de causer des dégâts. Les valeurs négatives font que l'explosion soigne les entités à la place.",
                                    default: 1,
                                    type: "number"
                                },
                                fire_affected_by_griefing: {
                                    description: "Définit si l'explosion qui cause le feu est affectée par la Gamerule de mob griefing.",
                                    default: false,
                                    type: "boolean"
                                },
                                fuse_length: {
                                    description: "La plage de temps aléatoire pendant laquelle la mèche sera allumée avant d'exploser; une valeur négative signifie que l'explosion sera immédiate.",
                                    default: [0, 0],
                                    oneOf: [
                                        {
                                            type: "array",
                                            minItems: 2,
                                            maxItems: 2,
                                            items: {
                                                type: "number"
                                            }
                                        },
                                        {
                                            type: "number"
                                        }
                                    ]
                                },
                                fuse_lit: {
                                    description: "Definit si la mèche est déjà allumée lorsque ce composant est ajouté à l'Entité.",
                                    default: false,
                                    type: "boolean"
                                },
                                knockback_scaling: {
                                    description: "Un facteur d'échelle appliqué à la force de recul causée par l'explosion.",
                                    default: 1,
                                    type: "number"
                                },
                                max_resistance: {
                                    description: "La résistance à l'explosion d'un bloc sera plafonnée à cette valeur lorsqu'une explosion se produit.",
                                    default: 3.40282e+38,
                                },
                                negates_fall_damage: {
                                    description: "Définit si l'explosion doit appliquer la négation des dégâts de chute aux entités au-dessus du point de collision.",
                                    default: false,
                                    type: "boolean"
                                },
                                particle_effect: {
                                    description: "Le nom de l'effet de particules à utiliser.",
                                    default: "explosion",
                                },
                                power: {
                                    description: "Le rayon de l'explosion en blocs et les dégâts que l'explosion inflige.",
                                    default: 3,
                                    type: "number"
                                },
                                sound_effect: {
                                    description: "Le nom de l'effet sonore à jouer lorsque l'explosion se produit.",
                                    default: "explode",
                                    type: "string"
                                },
                                toggles_blocks: {
                                    description: "Définit si l'explosion bascule les blocs dans le rayon de l'explosion.",
                                    default: false,
                                    type: "boolean"
                                },
                            }
                        },
                        "minecraft:fire_immune": {
                            description: "Permet à l'Entité de ne pas prendre de dégâts de feu.",
                            type: "object"
                        },
                        "minecraft:floats_in_liquid": {
                            description: "Permet à l'Entité de flotter dans les blocs liquides.",
                            type: "object"
                        },
                        "minecraft:flocking": {
                            description: "Force l'Entité à se regrouper et de se déplacer soit vers l'eau, soit loin de l'eau.",
                            type: "object",
                            properties: {
                                block_distance: {
                                    description: "La distance en blocs que l'Entité regardera et se déplacera.",
                                    default: 0,
                                    type: "number"
                                },
                                block_weight: {
                                    description: "Le poids de la poussée vers ou loin des blocs.",
                                    default: 0,
                                    type: "number"
                                },
                                breach_influence: {
                                    description: "Le montant de résistance donné à une entité de regroupement qui sort de l'eau.",
                                    default: 0,
                                    type: "number"
                                },
                                cohesion_threshold: {
                                    description: "Le seuil à partir duquel commencer à appliquer la cohésion.",
                                    default: 1,
                                    type: "number"
                                },
                                cohesion_weight: {
                                    description: "Le poids appliqué pour la cohésion du troupeau.",
                                    default: 1,
                                    type: "number"
                                },
                                goal_weight: {
                                    description: "Le poids sur lequel appliquer sur la sortie de l'objectif.",
                                    default: 0,
                                    type: "number"
                                },
                                high_flock_limit: {
                                    description: "Détermine le nombre maximum d'entités dans le troupeau avant que la cohésion ne soit appliquée.",
                                    default: 0,
                                    type: "integer"
                                },
                                in_water: {
                                    description: "Définit si l'Entité est dans l'eau.",
                                    default: false,
                                    type: "boolean"
                                },
                                influence_radius: {
                                    description: "La zone autour de l'entité qui permet d'ajouter d'autres entités au troupeau.",
                                    default: 0,
                                    type: "number"
                                },
                                inner_cohesion_threshold: {
                                    description: "La distance à partir de laquelle commencer à appliquer la cohésion.",
                                    default: 0,
                                    type: "number"
                                },
                                loner_chance: {
                                    description: "Le pourcentage de chance entre 0-1 qu'un poisson ne veuille pas rejoindre un troupeau. Les valeurs invalides seront plafonnées aux points finaux.",
                                    default: 0,
                                    type: "number"
                                },
                                low_flock_limit: {
                                    description: "Détermine le nombre minimum d'entités dans le troupeau avant que la cohésion ne soit appliquée.",
                                    default: 0,
                                    type: "integer"
                                },
                                match_variants: {
                                    description: "Définit si les entités doivent correspondre à la variante de l'entité cible.",
                                    default: false,
                                    type: "boolean"
                                },
                                max_height: {
                                    description: "La hauteur maximale autorisée dans l'air ou l'eau.",
                                    default: 0,
                                    type: "number"
                                },
                                min_height: {
                                    description: "La hauteur minimale autorisée dans l'air ou l'eau.",
                                    default: 0,
                                    type: "number"
                                },
                                separation_threshold: {
                                    description: "La distance qui est déterminée comme trop proche d'un autre troupeau et de commencer à appliquer la séparation.",
                                    default: 2,
                                    type: "number"
                                },
                                separation_weight: {
                                    description: "Le poids appliqué à la séparation du troupeau.",
                                    default: 1,
                                    type: "number"
                                },
                                use_center_of_mass: {
                                    description: "Définit si les entités de troupeau suivront les troupeaux en fonction du centre de masse.",
                                    default: false,
                                    type: "boolean"
                                },
                            }
                        },
                        "minecraft:flying_speed": {
                            description: "Définit la vitesse en blocs à laquelle l'Entité vole.",
                            type: "object",
                            properties: {
                                value: {
                                    description: "La vitesse en blocs à laquelle l'Entité vole.",
                                    default: 0.02,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:follow_range": {
                            description: "Définit la plage, en blocs, à laquelle l'Entité suivra un joueur.",
                            type: "object",
                            properties: {
                                value: {
                                    description: "Le rayon de la zone de blocs dans laquelle l'Entité suivra un joueur.",
                                    type: "integer"
                                },
                                max: {
                                    description: "Distance maximale à laquelle l'Entité suivra un joueur.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:friction_modifier": {
                            description: "Définit comment la friction affecte l'Entité.",
                            type: "object",
                            properties: {
                                value: {
                                    description: "Plus le nombre est élevé, plus la friction affecte cette Entité. Une valeur de 1.0 signifie une friction régulière, tandis que 2.0 signifie le double.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:game_event_movement_tracking": {
                            description: "Force l'Entié à émettre des événements de jeu de mouvement.  Type: `Object`. Ce composant force une entité à émettre des événements de jeu de mouvement, tels que entityMove, swim et flap, en fonction du bloc à travers lequel l'entité se déplace. Il est ajouté par défaut à chaque mob. Ajoutez-le à nouveau pour remplacer son comportement.",
                            type: "object",
                            properties: {
                                emit_flap: {
                                    description: "Définit si l'événement de jeu de mouvement de vol doit être émis lorsque l'Entité se déplace à travers l'air.",
                                    default: false,
                                    type: "boolean"
                                },
                                emit_move: {
                                    description: "Définit si l'événement de jeu de mouvement doit être émis lorsque l'Entité se déplace à travers un bloc solide.",
                                    default: true,
                                    type: "boolean"
                                },
                                emit_swim: {
                                    description: "Définit si l'événement de jeu de mouvement de nage doit être émis lorsque l'Entité se déplace à travers un liquide.",
                                    default: true,
                                    type: "boolean"
                                },
                            }
                        },
                        "minecraft:genetics": {
                            description: "Définit la façon dont les gènes et les allèles d'une Entité sont transmis à sa progéniture, et comment ces traits se manifestent chez l'enfant.  Type: `Object`. Les gènes et les allèles compatibles sont croisés ensemble, les allèles sont transmis des parents à l'enfant, et toutes les variantes génétiques correspondantes déclenchent des événements JSON pour modifier l'enfant et exprimer les traits.",
                            type: "object",
                            properties: {
                                genes: {
                                    description: "La liste des gènes que cette Entité a et croisera avec un partenaire lors de la reproduction.",
                                    type: "array",
                                    items: {
                                        type: "object"
                                    }
                                },
                                mutation_rate: {
                                    description: "Chance qu'un allèle soit remplacé par un autre allèle aléatoire au lieu de l'allèle du parent lors de la naissance.",
                                    default: 0.03125,
                                    type: "number"
                                },
                                use_simplified_breeding: {
                                    description: "Définit si il est interdit d'hériter des allèles cachés des parents en tant qu'allèles principaux chez les enfants et d'hériter des allèles principaux en tant qu'allèles cachés chez les enfants.",
                                    type: "boolean"
                                },
                            }
                        },
                        "minecraft:giveable": {
                            description: "Définit les ensembles d'items qui peuvent être utilisés pour déclencher des événements lorsqu'ils sont utilisés sur l'Entité. L'item sera également pris et placé dans l'inventaire de l'Entité.",
                            type: "object",
                            properties: {
                                triggers: {
                                    description: "Le déclencheur qui est déclenché lorsque l'item est utilisé sur l'Entité.",
                                    type: "object"
                                },
                            }
                        },
                        "minecraft:ground_offset": {
                            description: "Définit le décalage par rapport au sol que l'Entité est réellement.",
                            type: "object",
                            properties: {
                                value: {
                                    description: "La valeur de l'entité par rapport au sol, en blocs.",
                                    default: 0,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:group_size": {
                            description: "Définit la taille du groupe d'entités.",
                            type: "object",
                            properties: {
                                filters: {
                                    description: "La liste des conditions qui doivent être satisfaites pour que l'Entité soit comptée dans la taille du groupe.",
                                },
                                radius: {
                                    description: "Rayon autour de l'Entité pour compter les entités dans le groupe.",
                                    default: 16,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:grows_crop": {
                            description: "Permet à l'Entité de faire pousser des cultures lorsqu'elle marche sur elles.",
                            type: "object",
                            properties: {
                                chance: {
                                    description: "Vzaleur entre 0 et 1. Chance que la culture pousse lorsqu'elle est marchée dessus.",
                                    default: 0,
                                    type: "number",
                                    minimum: 0,
                                    maximum: 1
                                },
                                charges: {
                                    description: "Nombre de charges avant que l'Entité ne puisse plus faire pousser de cultures.",
                                    default: 10,
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:healable": {
                            description: "Définit les interactions avec l'Entité pour la soigner.",
                            type: "object",
                            properties: {
                                filters: {
                                    description: "La liste des conditions qui doivent être satisfaites pour que l'Entité puisse être soignée.",
                                },
                                force_use: {
                                    description: "Détermine si un item peut être utilisé indépendamment de l'Entité étant en pleine santé.",
                                    default: false,
                                    type: "boolean"
                                },
                                items: {
                                    description: "La liste des items qui peuvent être utilisés pour soigner l'Entité.",
                                    type: "array",
                                    items: {
                                        type: "object"
                                    }
                                },
                            }
                        },
                        "minecraft:health": {
                            description: "Spécifie combien de vie une Entité a lorsqu'elle est invoquée.",
                            type: "object",
                            properties: {
                                max: {
                                    description: "La santé maximale que l'Entité peut avoir.",
                                    type: "integer"
                                },
                                min: {
                                    description: "La santé minimale que l'Entité peut avoir.",
                                    type: "integer"
                                },
                                value: {
                                    description: "La quantité de santé que l'Entité a lorsqu'elle est invoquée.  Type: `Integer | Object`. Si la valeur est un objet, la santé de l'Entité sera aléatoire entre les valeurs min et max.",
                                },
                            }
                        },
                        "minecraft:heartbeat": {
                            description: "Définit le battement de coeur de l'Entité.",
                            type: "object",
                            properties: {
                                interval: {
                                    description: "Une expression Molang définissant l'intervalle inter-battement en secondes. Une valeur de zéro ou moins signifie pas de battement de coeur.  Type: `Molang`. Une valeur de zéro ou moins signifie pas de battement de coeur.",
                                    default: 1,
                                },
                                sound_event: {
                                    description: "Evénement sonore de niveau à jouer comme son de battement de coeur.",
                                    default: "heartbeat",
                                    type: "string"
                                },
                            }
                        },
                        "minecraft:hide": {
                            description: "Force l'Entité à se déplacer et à se cacher à leur POI possédé ou au plus proche à proximité.",
                            type: "object"
                        },
                        "minecraft:home": {
                            description: "Sauvegarde une position de maison pour l'Entité lorsqu'elle est invoquée.",
                            type: "object",
                            properties: {
                                home_block_list: {
                                    description: "Liste optionnelle de blocs qui peuvent être considérés comme une maison valide. Si aucun bloc de ce type n'existe à cette position, la restriction de la maison est supprimée.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                restriction_radius: {
                                    description: "Rayon optionnel dans lequel l'Entité sera restreinte par rapport à sa maison.",
                                    default: 0,
                                    type: "integer"
                                },
                                restriction_type: {
                                    description: "Définit comment l'Entité sera restreinte à sa position de maison.  Type: `String`  'none': aucune restriction  'random_movement': mouvement aléatoire restreint autour de la maison  'all_movement': tout mouvement restreint autour de la maison",
                                    type: "string",
                                    enum: ["none", "random_movement", "all_movement"]
                                },
                            }
                        },
                        "minecraft:horse.jump_strength": {
                            description: "Détermine la hauteur de saut pour un cheval ou une entité similaire, comme un âne.",
                            type: "object",
                            properties: {
                                value: {
                                    description: "Valeur de la force de saut que l'Entité a lorsqu'elle est invoquée.  Type: `Integer | Object`. Si la valeur est un objet, la force de saut de l'Entité sera aléatoire entre les valeurs min et max.",
                                },
                            }
                        },
                        "minecraft:hurt_on_condition": {
                            description: "Définit un ensemble de conditions dans lesquelles une Entité devrait prendre des dégâts.",
                            type: "object",
                            properties: {
                                damage_conditions: {
                                    description: "Liste des conditions de dégâts qui, lorsqu'elles sont remplies, peuvent causer des dégâts à l'Entité.",
                                    type: "array",
                                    items: {
                                        type: "object"
                                    }
                                },
                            }
                        },
                        "minecraft:ignore_cannot_be_attacked": {
                            description: "Définit les conditions dans lesquelles une Entité peut être attaquée si elle a le composant 'minecraft:cannot_be_attacked'.",
                            type: "object",
                            properties: {
                                filters: {
                                    description: "Définit quelles entités peuvent attaquer l'Entité.  Type: `Minecraft Filter`. Si cette propriété n'est pas définie, toutes les attaques sont autorisées.",
                                },
                            }
                        },
                        "minecraft:input_air_controlled": {
                            description: "Lorsque l'Entité est chevauchable, l'Entité sera controllée avec les touches du claiver et de la souris dans les 3 dimensions.",
                            type: "object",
                            properties: {
                                backwards_movement_modifier: {
                                    description: "Modifie la vitesse de l'Entité lorsqu'elle se déplace en arrière.",
                                    default: 0.5,
                                    type: "number"
                                },
                                strafe_speed_modifier: {
                                    description: "Modifie la vitesse de l'Entité lorsqu'elle se déplace latéralement.",
                                    default: 0.4,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:input_ground_controlled": {
                            description: "Permet à une Entité montable de pouvoir être contrôlée à l'aide des commandes clavier lorsqu'elle est montée par un joueur.",
                            type: "object"
                        },
                        "minecraft:inside_block_notifier": {
                            description: "Vérifie si l'Entité est à l'intérieur d'un bloc spécifique.",
                            type: "object",
                            properties: {
                                block_list: {
                                    description: "Liste de blocs, avec certains états de blocs, qui sont surveillés pour voir si l'Entité est à l'intérieur.",
                                    type: "array",
                                    items: {
                                        type: "object"
                                    }
                                },
                            }
                        },
                        "minecraft:insomnia": {
                            description: "Ajoute un minuteur depuis le dernier repos pour voir si les phantoms doivent apparaître.",
                            type: "object",
                            properties: {
                                days_until_insomnia: {
                                    description: "Nombre de jours où l'Entité doit rester éveillée avant que l'effet d'insomnie ne commence.",
                                    default: 3,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:instant_despawn": {
                            description: "Fait disparaitre l'Entité instantanément.",
                            type: "object",
                            properties: {
                                remove_child_entities: {
                                    description: "Definit si toutes les entités liées dans une relation enfant (par exemple, en laisse) seront également supprimées.",
                                    default: false,
                                    type: "boolean"
                                },
                            }
                        },
                        "minecraft:interact": {
                            description: "Définit les interactions qui peuvent être utilisées avec une Entité.",
                            type: "object",
                            properties: {
                                add_items: {
                                    description: "La Loot Table avec les items à ajouter à l'inventaire du joueur lors d'une interaction réussie.",
                                    type: "object"
                                },
                                cooldown: {
                                    description: "Temps en secondes avant que cette interaction puisse être utilisée à nouveau.",
                                    default: 0,
                                    type: "number"
                                },
                                cooldown_after_being_attacked: {
                                    description: "Temps en secondes avant que cette interaction puisse être utilisée à nouveau après avoir été attaquée.",
                                    default: 0,
                                    type: "number"
                                },
                                drop_item_slot: {
                                    description: "Le slot pour retirer et déposer l'item, le cas échéant, lors d'une interaction réussie. Les slots d'inventaire sont désignés par des nombres positifs; les slots d'armure sont désignés par slot.armor.head, slot.armor.chest, slot.armor.legs, slot.armor.feet et slot.armor.body.",
                                    type: "string",
                                    enum: ["slot.armor.chest", "slot.armor.feet", "slot.armor.head", "slot.armor.legs", "slot.armor.body"]
                                },
                                drop_item_y_offset: {
                                    description: "Définit un décalage personnalisé de l'axe des Y lorsqu'un élément est déposé. Nécessite que la propriété `drop_item_slot` soit spécifié.",
                                    default: 0,
                                    type: "number"
                                },
                                equip_item_slot: {
                                    description: "Le slot pour équiper l'item, le cas échéant, lors d'une interaction réussie. Les slots d'inventaire sont désignés par des nombres positifs; les slots d'armure sont désignés par slot.armor.head, slot.armor.chest, slot.armor.legs, slot.armor.feet et slot.armor.body.",
                                    type: "string",
                                    enum: ["slot.armor.chest", "slot.armor.feet", "slot.armor.head", "slot.armor.legs", "slot.armor.body"]
                                },
                                health_amount: {
                                    description: "Le montant de santé que l'Entité gagne ou perd lors d'une interaction réussie. Les valeurs négatives nuiront à l'Entité.",
                                    default: 0,
                                    type: "integer"
                                },
                                hurt_item: {
                                    description: "Le montant de dégâts que l'item subira lorsqu'il sera utilisé pour interagir avec cette Entité.  Type: `Integer`. Une valeur de 0 signifie que l'item ne subira aucun dégât.",
                                    default: 0,
                                    type: "integer"
                                },
                                interact_text: {
                                    description: "Texte à afficher lorsqu'un joueur peut interagir avec cette Entité.",
                                    type: "string"
                                },
                                interactions: {
                                    description: "Liste des interactions qui peuvent être utilisées avec cette Entité.",
                                    type: "array",
                                    items: {
                                        type: "object"
                                    }
                                },
                                on_interact: {
                                    description: "Evenement à déclencher lorsqu'une interaction réussie se produit.",
                                    type: "object"
                                },
                                particle_on_start: {
                                    description: "Effet de particules qui sera initié au début de l'interaction.",
                                    type: "object"
                                },
                                play_sounds: {
                                    description: "Une ou plusieurs identifiants sonores à jouer lorsque l'interaction se produit.",
                                    type: "string"
                                },
                                repair_entity_item: {
                                    description: "Permet la réparation de l'item d'une Entité donnée.",
                                    type: "object"
                                },
                                spawn_entities: {
                                    description: "Entité à faire apparaître lorsqu'une interaction réussie se produit.",
                                    type: "string"
                                },
                                spawn_items: {
                                    description: "Loot table avec les items à faire apparaître lors d'une interaction réussie.",
                                    type: "object"
                                },
                                swing: {
                                    description: "Définit si le joueur fera l'animation de 'swing' lorsqu'il interagit avec cette Entité.",
                                    default: false,
                                    type: "boolean"
                                },
                                transform_to_item: {
                                    description: "L'item utilisé dans cette interaction réussi se transformera en un cet item.",
                                    type: "string"
                                },
                                use_item: {
                                    description: "Définit si l'interaction utilisera un item.",
                                    default: false,
                                    type: "boolean"
                                },
                                vibration: {
                                    description: "Le type de vibration à émettre lorsque l'interaction se produit.",
                                    default: "entity_interact",
                                },
                            }
                        },
                        "minecraft:inventory": {
                            description: "Définit comment l'inventaire d'une Entité est géré.",
                            type: "object",
                            properties: {
                                additional_slots_per_strength: {
                                    description: "Nombre de slots que cette Entité peut gagner par force supplémentaire.",
                                    default: 0,
                                    type: "integer"
                                },
                                can_be_siphoned_from: {
                                    description: "Définit si le contenu de cet inventaire peut être siphonné par un entonnoir.",
                                    default: false,
                                    type: "boolean"
                                },
                                container_type: {
                                    description: "Type de conteneur que l'Entité possède.",
                                    default: "none",
                                    type: "string",
                                    enum: ["horse", "minecart_chest", "chest_boat", "minecart_hopper", "inventory", "container", "hopper", "none"]
                                },
                                inventory_size: {
                                    description: "Nombre de slots dans l'inventaire de l'Entité.",
                                    default: 5,
                                    type: "integer"
                                },
                                private: {
                                    description: "Définit si l'Entité ne laissera pas tomber son inventaire à sa mort.",
                                    default: false,
                                    type: "boolean"
                                },
                                restrict_to_owner: {
                                    description: "Définit si l'inventaire de l'Entité ne peut être accédé que par son propriétaire ou par elle-même.",
                                    default: false,
                                    type: "boolean"
                                },
                            }
                        },
                        "minecraft:is_baby": {
                            description: "Définit que l'Entité est un bébé.  Type: `Object`. Ce composant est utilisé pour des requêtes Molang ou de filtres",
                            type: "object"
                        },
                        "minecraft:is_charged": {
                            description: "Définit si l'Entité est chargée.  Type: `Object`. Ce composant est utilisé pour des requêtes Molang ou de filtres",
                            type: "object"
                        },
                        "minecraft:is_chested": {
                            description: "Définit que l'Entité porte actuellement un coffre.  Type: `Object`. Ce composant est utilisé pour des requêtes Molang ou de filtres",
                            type: "object"
                        },
                        "minecraft:is_collidable": {
                            description: "Permet aux autres mobs d'avoir des collisions verticales et horizontales avec cette Entité. Pour qu'une collision se produise, les deux entités doivent avoir un composant 'minecraft:collision_box'. Ce composant ne peut être utilisé que sur les entités et permet des collisions exclusivement entre les entités. Veuillez noter que ce type de collision est peu fiable pour les entités mobiles. Il est recommandé d'utiliser ce composant uniquement dans des scénarios où l'entité collidable reste stationnaire. Le comportement collidable est étroitement lié au comportement empilable. Alors que le composant 'minecraft:is_collidable' régit la façon dont les autres entités interagissent avec le propriétaire du composant, le composant 'minecraft:is_stackable' décrit comment une entité interagit avec d'autres de son espèce.",
                            type: "object"
                        },
                        "minecraft:is_dyeable": {
                            description: "Permet à l'Entité d'être teinte avec des colorants.",
                            type: "object",
                            properties: {
                                interact_text: {
                                    description: "Texte à afficher lorsqu'un joueur peut teindre cette Entité.",
                                    type: "string"
                                },
                            }
                        },
                        "minecraft:is_hidden_when_invisible": {
                            description: "Définit si l'Entité est cachée des mobs hostiles lorsqu'elle est invisible.",
                            type: "object"
                        },
                        "minecraft:is_ignited": {
                            description: "Définit si l'Entité est enflammée.  Type: `Object`. Ce composant est utilisé pour des requêtes Molang ou de filtres",
                            type: "object"
                        },
                        "minecraft:is_illager_captain": {
                            description: "Définit si l'Entité est un capitaine pillard.  Type: `Object`. Ce composant est utilisé pour des requêtes Molang ou de filtres",
                            type: "object"
                        },
                        "minecraft:is_pregnant": {
                            description: "Définit si l'Entité est enceinte.  Type: `Object`. Ce composant est utilisé pour des requêtes Molang ou de filtres",
                            type: "object"
                        },
                        "minecraft:is_saddled": {
                            description: "Définit si l'Entité est sellée.  Type: `Object`. Ce composant est utilisé pour des requêtes Molang ou de filtres",
                            type: "object"
                        },
                        "minecraft:is_shaking": {
                            description: "Définit si l'Entité est secouée.",
                            type: "object"
                        },
                        "minecraft:is_sheared": {
                            description: "Définit si l'Entité a été tondue.  Type: `Object`. Ce composant est utilisé pour des requêtes Molang ou de filtres",
                            type: "object"
                        },
                        "minecraft:is_stackable": {
                            description: "Définit que l'Entité peut être empilée.",
                            type: "object"
                        },
                        "minecraft:is_stunned": {
                            description: "Définit si l'Entité est étourdie.  Type: `Object`. Ce composant est utilisé pour des requêtes Molang ou de filtres",
                            type: "object"
                        },
                        "minecraft:is_tamed": {
                            description: "Définit si l'Entité est apprivoisée.  Type: `Object`. Ce composant est utilisé pour des requêtes Molang ou de filtres",
                            type: "object"
                        },
                        "minecraft:item_controllable": {
                            description: "Permet à l'Entité d'être contrôlée par un item quand elle est chevauchée.",
                            type: "object",
                            properties: {
                                control_items: {
                                    description: "Liste des items qui peuvent être utilisés pour contrôler l'Entité.",
                                    type: "string"
                                },
                            }
                        },
                        "minecraft:item_hopper": {
                            description: "Permer à l'Entité de fonctionner comme un bloc entonnoir.",
                            type: "object"
                        },
                        "minecraft:jump.dynamic": {
                            description: "Définit un contrôle de saut dynamique qui changera les propriétés de saut en fonction du modificateur de vitesse de l'Entité.",
                            type: "object"
                        },
                        "minecraft:jump.static": {
                            description: "Donne à l'Entité la capacité de sauter.",
                            type: "object",
                            properties: {
                                jump_power: {
                                    description: "La vitesse verticale initiale pour le saut.",
                                    default: 0.42,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:knockback_resistance": {
                            description: "Force une Entité à résister à être repoussée par une attaque de mêlée.",
                            type: "object",
                            properties: {
                                value: {
                                    description: "Le montant de résistance au recul que l'Entité a.",
                                    type: "number"
                                },
                                max: {
                                    description: "La valeur maximale de résistance au recul que l'Entité peut avoir.",
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:lava_movement": {
                            description: "Permet à l'Entité de se déplacer à une vitesse personnalisée sur les blocs de lave.",
                            type: "object",
                            properties: {
                                value: {
                                    description: "La vitesse à laquelle l'Entité se déplace sur les blocs de lave.",
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:leashable": {
                            description: "Permet à l'Entité d'être attachée à une laisse.",
                            type: "object",
                            properties: {
                                can_be_cut: {
                                    description: "Si définit sur true, les joueurs peuvent couper les laisses entrantes et sortantes en utilisant des cisailles sur l'Entité.",
                                    default: true,
                                    type: "boolean"
                                },
                                can_be_stolen: {
                                    description: "Définit si les joueurs peuvent attacher la laisse à l'Entité même si elle est déjà attaché à un autre mob.",
                                    default: false,
                                    type: "boolean"
                                },
                                hard_distance: {
                                    description: "Distance en blocs à laquelle la laisse se raidit, limitant le mouvement.",
                                    default: 6,
                                    type: "number"
                                },
                                max_distance: {
                                    description: "Distance en blocs à laquelle la laisse peut s'étendre.",
                                    default: 10,
                                    type: "number"
                                },
                                on_leash: {
                                    description: "Evénement à déclencher lorsque l'Entité est attachée à une laisse.",
                                },
                                on_unleash: {
                                    description: "Evénement à déclencher lorsque l'Entité est détachée d'une laisse.",
                                },
                                presets: {
                                    description: "Définit comment l'Entité se comporte quand elle est attachée à une autre entité. Un preset est choisi lors de la liaison et reste en vigueur jusqu'à ce que l'Entité soit liée à un autre préréglage. Le premier preset qui a les conditions `filters` valide sera utilisé. Si aucun preset ne correspond, la configuration par défaut sera utilisé.",
                                    type: "array",
                                    items: {
                                        type: "object"
                                    }
                                },
                                soft_distance: {
                                    description: "Distance en blocs à laquelle l'effet de 'ressort' commence à agir pour garder cette Entité proche de l'Entité qui l'a attachée.",
                                    default: 4,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:leashable_to": {
                            description: "Permet aux joueurs de lier cette Entité à une autre.",
                            type: "object",
                            properties: {
                                can_retrieve_from: {
                                    description: "Définit si les joueurs peuvent récupérer les entités liées à cette Entité.",
                                    default: false,
                                    type: "boolean"
                                },
                            }
                        },
                        "minecraft:looked_at": {
                            description: "Définit le comportement lorsque l'Entité est regardée par une autre Entité.",
                            type: "object",
                            properties: {
                                field_of_view: {
                                    description: "Définit l'angle de vue en degrés pour les entités regardant l'Entité propriétaire. Si 'scale_fov_by_distance' est défini sur true, alors cette valeur correspond à l'angle de vue à une distance d'un bloc entre les entités.",
                                    default: 26,
                                    type: "number"
                                },
                                filters: {
                                    description: "Définit quels entités peuvent être considérées comme regardant l'Entité propriétaire.",
                                },
                                find_players_only: {
                                    description: "Limite la recherche uniquement au joueur le plus proche qui répond aux critères spécifiés plutôt qu'à toutes les entités à proximité.",
                                    default: false,
                                    type: "boolean"
                                },
                                line_of_sight_obstruction_type: {
                                    description: "Définit le type de forme de bloc utilisé pour vérifier les obstructions de la ligne de vue.",
                                    default: "collision",
                                    type: "string",
                                    enum: ["outline", "collision", "collision_for_camera"]
                                },
                                look_at_locations: {
                                    description: "Une liste d'emplacements sur l'Entité propriétaire vers lesquels des vérifications de ligne de vue sont effectuées. Au moins un emplacement doit être dégagé pour que l'Entité soit considérée comme regardée.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                looked_at_cooldown: {
                                    description: "Spécifie la plage pour le nombre de secondes aléatoires qui doivent s'écouler avant que l'Entité propriétaire puisse vérifier à nouveau si une entité la regarde, après avoir détecté une entité la regardant.",
                                    default: [0,0],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                                looked_at_event: {
                                    description: "Définit l'événement à déclencher lorsqu'une entité regarde l'Entité propriétaire.",
                                },
                                min_looked_at_duration: {
                                    description: "Définit la durée minimale et continue pendant laquelle l'Entité propriétaire doit être regardée avant d'être considérée comme telle.",
                                    default: 0,
                                    type: "number"
                                },
                                not_looked_at_event: {
                                    description: "Définit l'événement à déclencher lorsqu'une entité ne regarde pas l'Entité propriétaire.",
                                },
                                scale_fov_by_distance: {
                                    description: "Définit si le champ de vision de l'entité regardant l'Entité propriétaire se rétrécit à mesure que la distance entre l'entité et l'Entité propriétaire augmente. Cela garantit que la largeur du cône de vision reste quelque peu constante vers la position de l'Entité propriétaire, quelle que soit la distance.",
                                    default: true,
                                    type: "boolean"
                                },
                                search_radius: {
                                    description: "Distance maximale à laquelle l'Entité propriétaire recherchera des entités la regardant.",
                                    default: 10,
                                    type: "number"
                                },
                                set_target: {
                                    description: "Définit si et comment l'Entité propriétaire définira les entités qui la regardent comme ses cibles de combat.  Type: `Object`  'never': les entités regardant ne sont jamais définies comme cibles, mais des événements sont émis.  'once_and_stop_scanning': la première entité regardant détectée est définie comme cible. La numérisation et l'émission d'événements sont suspendues jusqu'à ce que l'Entité propriétaire ait une cible.  'once_and_keep_scanning': la première entité regardant détectée est définie comme cible. La numérisation et l'émission d'événements se poursuivent.",
                                    default: "once_and_stop_scanning",
                                    type: "string",
                                    enum: ["never", "once_and_stop_scanning", "once_and_keep_scanning"]
                                },
                            }
                        },
                        "minecraft:loot": {
                            description: "Définit la Loot Table pour définir les drops de l'Entité quand elle est tuée.",
                            type: "object",
                            properties: {
                                table: {
                                    description: "Le chemin de la Loot Table.",
                                    type: "string"
                                },
                            }
                        },
                        "minecraft:luck": {
                            description: "Définit le niveau de chance du Joueur.",
                            type: "object",
                            properties: {
                                value: {
                                    description: "Le niveau de chance du Joueur.",
                                    type: "number"
                                },
                                max: {
                                    description: "La valeur maximale de chance que le Joueur peut avoir.",
                                    type: "number"
                                },
                                min: {
                                    description: "La valeur minimale de chance que le Joueur peut avoir.",
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:managed_wandering_trader": {
                            description: "Gère la capacité de l'Entité à commercer.  Type: `Object`. Ce composant est seulement utilisable pour les marchands ambulants.",
                            type: "object"
                        },
                        "minecraft:mark_variant": {
                            description: "Définit la variante de l'Entité.  Type: `Object`. Ce composant nécessite que l'Entité soit configurée pour utiliser des variantes avec le composant de propriété minecraft:variant.",
                            type: "object",
                            properties: {
                                value: {
                                    description: "L'ID de la variante. Par convention, 0 est l'ID de l'Entité de base.",
                                    default: 0,
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:mob_effect": {
                            description: "Applique un effet de mob aux entités qui entrent dans la portée.",
                            type: "object",
                            properties: {
                                cooldown_time: {
                                    description: "Temps en secondes avant que l'effet puisse être appliqué à nouveau.",
                                    default: 0,
                                    type: "integer"
                                },
                                entity_filter: {
                                    description: "L'ensemble d'entités qui peuvent être affectées par l'effet.",
                                },
                                effect_range: {
                                    description: "De combien de blocs l'entité doit être proche pour que l'effet soit appliqué.",
                                    default: 0.2,
                                    type: "number"
                                },
                                effect_time: {
                                    description: "De combien de temps l'effet est appliqué en secondes.",
                                    default: 10,
                                },
                                mob_effect: {
                                    description: "L'effet à appliquer.",
                                    type: "string"
                                },
                            }
                        },
                        "minecraft:mob_effect_immunity": {
                            description: "L'Entité avec ce composant aura une immunité aux effets de mob fournis.",
                            type: "object",
                            properties: {
                                mob_effects: {
                                    description: "Liste des effets de mob auxquels l'Entité est immunisée.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                            }
                        },
                        "minecraft:movement": {
                            description: "Ce composant représente le mouvement fondamental d'une Entité.",
                            type: "object",
                            properties: {
                                max: {
                                    description: "La vitesse maximale de l'Entité.",
                                    type: "number"
                                },
                                value: {
                                    description: "La vitesse de mouvement de l'Entité.",
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:movement.amphibious": {
                            description: "Force une Entité à nager dans l'eau et à marcher sur terre.",
                            type: "object",
                            properties: {
                                max_turn: {
                                    description: "L'angle maximum en degrés que l'Entité peut tourner par tick.",
                                    default: 30,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:movement.basic": {
                            description: "Définit le mouvement de base d'une Entité.",
                            type: "object",
                            properties: {
                                max_turn: {
                                    description: "L'angle maximum en degrés que l'Entité peut tourner par tick.",
                                    default: 30,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:movement.dolphin": {
                            description: "Force une Entité à se déplacer comme un dauphin.  Type: `Object`. Ce composant n'est pas utilisé dans le jeu.",
                            type: "object"
                        },
                        "minecraft:movement.fly": {
                            description: "Ce composant permet à l'Entité de voler.",
                            type: "object",
                            properties: {
                                max_turn: {
                                    description: "L'angle maximum en degrés que l'Entité peut tourner par tick.",
                                    default: 30,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:movement.generic": {
                            description: "Permet à l'Entité de voler, nager, grimper, etc.",
                            type: "object",
                            properties: {
                                max_turn: {
                                    description: "L'angle maximum en degrés que l'Entité peut tourner par tick.",
                                    default: 30,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:movement.glide": {
                            description: "Ce composant est le contrôle de mouvement pour une Entité volante qui a un mouvement de planeur.",
                            type: "object",
                            properties: {
                                start_speed: {
                                    description: "La vitesse initiale de l'Entité lorsqu'elle commence à planer.",
                                    default: 0.1,
                                    type: "number"
                                },
                                speed_when_turning: {
                                    description: "La vitesse que l'Entité ajuste lorsqu'elle doit tourner.",
                                    default: 0.2,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:movement.hover": {
                            description: "Ce composant est le contrôle de mouvement pour une Entité volante qui a un mouvement de vol stationnaire.",
                            type: "object",
                            properties: {
                                max_turn: {
                                    description: "L'angle maximum en degrés que l'Entité peut tourner par tick.",
                                    default: 30,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:movement.jump": {
                            description: "Se déplace en sautant.  Type: `Object`. Pour pouvoir suivre des cibles, cette entité doit avoir minecraft:behavior.slime_attack, sinon l'Entité sautera dans la direction dans laquelle elle regarde.",
                            type: "object",
                            properties: {
                                jump_delay: {
                                    description: "Delai après le saut avant que l'Entité puisse sauter à nouveau.",
                                    default: [0,0],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                                max_turn: {
                                    description: "L'angle maximum en degrés que l'Entité peut tourner par tick.",
                                    default: 30,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:movement.skip": {
                            description: "Force l'Entité à sauter lorsqu'elle se déplace.",
                            type: "object",
                            properties: {
                                max_turn: {
                                    description: "L'angle maximum en degrés que l'Entité peut tourner par tick.",
                                    default: 30,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:movement_sound_distance_offset": {
                            description: "Définit l'offset utilisé pour déterminer la distance du prochain pas pour jouer un son de mouvement.",
                            type: "object",
                            properties: {
                                value: {
                                    description: "Plus le nombre est élevé, moins souvent le son de mouvement sera joué.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:movement.sway": {
                            description: "Force une Entité à osciller de gauche à droite, donnant l'impression qu'elle nage.",
                            type: "object",
                            properties: {
                                max_turn: {
                                    description: "L'angle maximum en degrés que l'Entité peut tourner par tick.",
                                    default: 30,
                                    type: "number"
                                },
                                sway_amplitude: {
                                    description: "Force du mouvement d'oscillation.",
                                    default: 0.05,
                                    type: "number"
                                },
                                sway_frequency: {
                                    description: "Multiplicateur pour la fréquence du mouvement d'oscillation.",
                                    default: 0.5,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:nameable": {
                            description: "Permet à l'Entité d'être nommée (par exemple, en utilisant une étiquette).",
                            type: "object",
                            properties: {
                                allow_name_tag_renaming: {
                                    description: "Définit si l'Entité peut être renommée avec des étiquettes de nom.",
                                    default: true,
                                    type: "boolean"
                                },
                                always_show: {
                                    description: "Définit si le nom sera toujours affiché.",
                                    default: false,
                                    type: "boolean"
                                },
                                default_trigger: {
                                    description: "Déclencheur d'évenement par défaut pour l'Entité nommée.",
                                    type: "string"
                                },
                                name_actions: {
                                    description: "Decrit les noms spéciaux pour l'Entité et les évenements à appeler lorsque l'Entité acquiert ces noms.",
                                    type: "object"
                                },
                            }
                        },
                        "minecraft:navigation.climb": {
                            description: "Permet à l'Entité de générer ses chemins de navigation en grimpant à la verticale comme une araignée.",
                            type: "object",
                            properties: {
                                avoid_damage_blocks: {
                                    description: "Dit au pathfinder d'éviter les blocs qui causent des dégâts lorsqu'il trouve un chemin.",
                                    default: false,
                                    type: "boolean"
                                },
                                avoid_portals: {
                                    description: "Dit au pathfinder d'éviter les portails lorsqu'il trouve un chemin.",
                                    default: false,
                                    type: "boolean"
                                },
                                avoid_sun: {
                                    description: "Définit si le pathfinder doit éviter les blocs exposés au soleil lorsqu'il crée des chemins.",
                                    default: false,
                                    type: "boolean"
                                },
                                avoid_water: {
                                    description: "Définit si le pathfinder doit éviter les blocs d'eau lorsqu'il crée des chemins.",
                                    default: false,
                                    type: "boolean"
                                },
                                blocks_to_avoid: {
                                    description: "Dit au pathfinder quels blocs éviter lorsqu'il trouve un chemin.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                can_breach: {
                                    description: "Dit au pathfinder si l'Entité peut sauter hors de l'eau comme un dauphin.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_break_doors: {
                                    description: "Dit au pathfinder qu'il peut traverser une porte fermée et la casser.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_jump: {
                                    description: "Indique au pathfinder s'il peut ou non sauter par-dessus des blocs.",
                                    default: true,
                                    type: "boolean"
                                },
                                can_open_doors: {
                                    description: "Indique au pathfinder s'il peut ouvrir des portes.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_open_iron_doors: {
                                    description: "Indique au pathfinder s'il peut ouvrir des portes en fer.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_pass_doors: {
                                    description: "Indique au pathfinder s'il peut passer par une porte.",
                                    default: true,
                                    type: "boolean"
                                },
                                can_path_from_air: {
                                    description: "Indique au pathfinder qu'il peut commencer à créer un chemin lorsqu'il est dans les airs.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_path_over_lava: {
                                    description: "Indique au pathfinder s'il peut traverser la surface de la lave.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_path_over_water: {
                                    description: "Indique au pathfinder s'il peut traverser la surface de l'eau.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_sink: {
                                    description: "Indique au pathfinder s'il sera ou non entraîné vers le bas par la gravité lorsqu'il est dans l'eau.",
                                    default: true,
                                    type: "boolean"
                                },
                                can_swim: {
                                    description: "Indique au pathfinder s'il peut nager dans l'eau et jouer l'animation de nage.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_walk: {
                                    description: "Indique au pathfinder s'il peut marcher sur le sol en dehors de l'eau.",
                                    default: true,
                                    type: "boolean"
                                },
                                can_walk_in_lava: {
                                    description: "Indique au pathfinder s'il peut marcher dans la lave comme sur le sol.",
                                    default: false,
                                    type: "boolean"
                                },
                                is_amphibious: {
                                    description: "Indique au pathfinder si l'Entité peut marcher sur le sol sous l'eau.",
                                    default: false,
                                    type: "boolean"
                                },
                            }
                        },
                        "minecraft:navigation.float": {
                            description: "Permet à l'Entité de générer des chemins de naviation en volant dans l'air comme un Ghast.",
                            type: "object",
                            properties: {
                                avoid_damage_blocks: {
                                    description: "Dit au pathfinder d'éviter les blocs qui causent des dégâts lorsqu'il trouve un chemin.",
                                    default: false,
                                    type: "boolean"
                                },
                                avoid_portals: {
                                    description: "Dit au pathfinder d'éviter les portails lorsqu'il trouve un chemin.",
                                    default: false,
                                    type: "boolean"
                                },
                                avoid_sun: {
                                    description: "Définit si le pathfinder doit éviter les blocs exposés au soleil lorsqu'il crée des chemins.",
                                    default: false,
                                    type: "boolean"
                                },
                                avoid_water: {
                                    description: "Définit si le pathfinder doit éviter les blocs d'eau lorsqu'il crée des chemins.",
                                    default: false,
                                    type: "boolean"
                                },
                                blocks_to_avoid: {
                                    description: "Dit au pathfinder quels blocs éviter lorsqu'il trouve un chemin.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                can_breach: {
                                    description: "Dit au pathfinder si l'Entité peut sauter hors de l'eau comme un dauphin.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_break_doors: {
                                    description: "Dit au pathfinder qu'il peut traverser une porte fermée et la casser.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_jump: {
                                    description: "Indique au pathfinder s'il peut ou non sauter par-dessus des blocs.",
                                    default: true,
                                    type: "boolean"
                                },
                                can_open_doors: {
                                    description: "Indique au pathfinder s'il peut ouvrir des portes.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_open_iron_doors: {
                                    description: "Indique au pathfinder s'il peut ouvrir des portes en fer.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_pass_doors: {
                                    description: "Indique au pathfinder s'il peut passer par une porte.",
                                    default: true,
                                    type: "boolean"
                                },
                                can_path_from_air: {
                                    description: "Indique au pathfinder qu'il peut commencer à créer un chemin lorsqu'il est dans les airs.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_path_over_lava: {
                                    description: "Indique au pathfinder s'il peut traverser la surface de la lave.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_path_over_water: {
                                    description: "Indique au pathfinder s'il peut traverser la surface de l'eau.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_sink: {
                                    description: "Indique au pathfinder s'il sera ou non entraîné vers le bas par la gravité lorsqu'il est dans l'eau.",
                                    default: true,
                                    type: "boolean"
                                },
                                can_swim: {
                                    description: "Indique au pathfinder s'il peut nager dans l'eau et jouer l'animation de nage.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_walk: {
                                    description: "Indique au pathfinder s'il peut marcher sur le sol en dehors de l'eau.",
                                    default: true,
                                    type: "boolean"
                                },
                                can_walk_in_lava: {
                                    description: "Indique au pathfinder s'il peut marcher dans la lave comme sur le sol.",
                                    default: false,
                                    type: "boolean"
                                },
                                is_amphibious: {
                                    description: "Indique au pathfinder si l'Entité peut marcher sur le sol sous l'eau.",
                                    default: false,
                                    type: "boolean"
                                },
                            }
                        },
                        "minecraft:navigation.fly": {
                            description: "Permet à l'Entité de générer des chemins de navigation en volant dans l'air comme un Perroquet.",
                            type: "object",
                            properties: {
                                avoid_damage_blocks: {
                                    description: "Dit au pathfinder d'éviter les blocs qui causent des dégâts lorsqu'il trouve un chemin.",
                                    default: false,
                                    type: "boolean"
                                },
                                avoid_portals: {
                                    description: "Dit au pathfinder d'éviter les portails lorsqu'il trouve un chemin.",
                                    default: false,
                                    type: "boolean"
                                },
                                avoid_sun: {
                                    description: "Définit si le pathfinder doit éviter les blocs exposés au soleil lorsqu'il crée des chemins.",
                                    default: false,
                                    type: "boolean"
                                },
                                avoid_water: {
                                    description: "Définit si le pathfinder doit éviter les blocs d'eau lorsqu'il crée des chemins.",
                                    default: false,
                                    type: "boolean"
                                },
                                blocks_to_avoid: {
                                    description: "Dit au pathfinder quels blocs éviter lorsqu'il trouve un chemin.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                can_breach: {
                                    description: "Dit au pathfinder si l'Entité peut sauter hors de l'eau comme un dauphin.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_break_doors: {
                                    description: "Dit au pathfinder qu'il peut traverser une porte fermée et la casser.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_jump: {
                                    description: "Indique au pathfinder s'il peut ou non sauter par-dessus des blocs.",
                                    default: true,
                                    type: "boolean"
                                },
                                can_open_doors: {
                                    description: "Indique au pathfinder s'il peut ouvrir des portes.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_open_iron_doors: {
                                    description: "Indique au pathfinder s'il peut ouvrir des portes en fer.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_pass_doors: {
                                    description: "Indique au pathfinder s'il peut passer par une porte.",
                                    default: true,
                                    type: "boolean"
                                },
                                can_path_from_air: {
                                    description: "Indique au pathfinder qu'il peut commencer à créer un chemin lorsqu'il est dans les airs.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_path_over_lava: {
                                    description: "Indique au pathfinder s'il peut traverser la surface de la lave.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_path_over_water: {
                                    description: "Indique au pathfinder s'il peut traverser la surface de l'eau.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_sink: {
                                    description: "Indique au pathfinder s'il sera ou non entraîné vers le bas par la gravité lorsqu'il est dans l'eau.",
                                    default: true,
                                    type: "boolean"
                                },
                                can_swim: {
                                    description: "Indique au pathfinder s'il peut nager dans l'eau et jouer l'animation de nage.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_walk: {
                                    description: "Indique au pathfinder s'il peut marcher sur le sol en dehors de l'eau.",
                                    default: true,
                                    type: "boolean"
                                },
                                can_walk_in_lava: {
                                    description: "Indique au pathfinder s'il peut marcher dans la lave comme sur le sol.",
                                    default: false,
                                    type: "boolean"
                                },
                                is_amphibious: {
                                    description: "Indique au pathfinder si l'Entité peut marcher sur le sol sous l'eau.",
                                    default: false,
                                    type: "boolean"
                                },
                            }
                        },
                        "minecraft:navigation.generic": {
                            description: "Force l'Entité à générer des chemins de navigation en marchant, nageant, volant, grimpant, etc.",
                            type: "object",
                            properties: {
                                avoid_damage_blocks: {
                                    description: "Dit au pathfinder d'éviter les blocs qui causent des dégâts lorsqu'il trouve un chemin.",
                                    default: false,
                                    type: "boolean"
                                },
                                avoid_portals: {
                                    description: "Dit au pathfinder d'éviter les portails lorsqu'il trouve un chemin.",
                                    default: false,
                                    type: "boolean"
                                },
                                avoid_sun: {
                                    description: "Définit si le pathfinder doit éviter les blocs exposés au soleil lorsqu'il crée des chemins.",
                                    default: false,
                                    type: "boolean"
                                },
                                avoid_water: {
                                    description: "Définit si le pathfinder doit éviter les blocs d'eau lorsqu'il crée des chemins.",
                                    default: false,
                                    type: "boolean"
                                },
                                blocks_to_avoid: {
                                    description: "Dit au pathfinder quels blocs éviter lorsqu'il trouve un chemin.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                can_breach: {
                                    description: "Dit au pathfinder si l'Entité peut sauter hors de l'eau comme un dauphin.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_break_doors: {
                                    description: "Dit au pathfinder qu'il peut traverser une porte fermée et la casser.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_jump: {
                                    description: "Indique au pathfinder s'il peut ou non sauter par-dessus des blocs.",
                                    default: true,
                                    type: "boolean"
                                },
                                can_open_doors: {
                                    description: "Indique au pathfinder s'il peut ouvrir des portes.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_open_iron_doors: {
                                    description: "Indique au pathfinder s'il peut ouvrir des portes en fer.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_pass_doors: {
                                    description: "Indique au pathfinder s'il peut passer par une porte.",
                                    default: true,
                                    type: "boolean"
                                },
                                can_path_from_air: {
                                    description: "Indique au pathfinder qu'il peut commencer à créer un chemin lorsqu'il est dans les airs.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_path_over_lava: {
                                    description: "Indique au pathfinder s'il peut traverser la surface de la lave.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_path_over_water: {
                                    description: "Indique au pathfinder s'il peut traverser la surface de l'eau.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_sink: {
                                    description: "Indique au pathfinder s'il sera ou non entraîné vers le bas par la gravité lorsqu'il est dans l'eau.",
                                    default: true,
                                    type: "boolean"
                                },
                                can_swim: {
                                    description: "Indique au pathfinder s'il peut nager dans l'eau et jouer l'animation de nage.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_walk: {
                                    description: "Indique au pathfinder s'il peut marcher sur le sol en dehors de l'eau.",
                                    default: true,
                                    type: "boolean"
                                },
                                can_walk_in_lava: {
                                    description: "Indique au pathfinder s'il peut marcher dans la lave comme sur le sol.",
                                    default: false,
                                    type: "boolean"
                                },
                                is_amphibious: {
                                    description: "Indique au pathfinder si l'Entité peut marcher sur le sol sous l'eau.",
                                    default: false,
                                    type: "boolean"
                                },
                            }
                        },
                        "minecraft:navigation.hover": {
                            description: "Force l'Entité à générer des chemins de navigation en volant dans l'air comme une Abeille. Les empêche de tomber du ciel et de faire des mouvements prédictifs.",
                            type: "object",
                            properties: {
                                avoid_damage_blocks: {
                                    description: "Dit au pathfinder d'éviter les blocs qui causent des dégâts lorsqu'il trouve un chemin.",
                                    default: false,
                                    type: "boolean"
                                },
                                avoid_portals: {
                                    description: "Dit au pathfinder d'éviter les portails lorsqu'il trouve un chemin.",
                                    default: false,
                                    type: "boolean"
                                },
                                avoid_sun: {
                                    description: "Définit si le pathfinder doit éviter les blocs exposés au soleil lorsqu'il crée des chemins.",
                                    default: false,
                                    type: "boolean"
                                },
                                avoid_water: {
                                    description: "Définit si le pathfinder doit éviter les blocs d'eau lorsqu'il crée des chemins.",
                                    default: false,
                                    type: "boolean"
                                },
                                blocks_to_avoid: {
                                    description: "Dit au pathfinder quels blocs éviter lorsqu'il trouve un chemin.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                can_breach: {
                                    description: "Dit au pathfinder si l'Entité peut sauter hors de l'eau comme un dauphin.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_break_doors: {
                                    description: "Dit au pathfinder qu'il peut traverser une porte fermée et la casser.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_jump: {
                                    description: "Indique au pathfinder s'il peut ou non sauter par-dessus des blocs.",
                                    default: true,
                                    type: "boolean"
                                },
                                can_open_doors: {
                                    description: "Indique au pathfinder s'il peut ouvrir des portes.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_open_iron_doors: {
                                    description: "Indique au pathfinder s'il peut ouvrir des portes en fer.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_pass_doors: {
                                    description: "Indique au pathfinder s'il peut passer par une porte.",
                                    default: true,
                                    type: "boolean"
                                },
                                can_path_from_air: {
                                    description: "Indique au pathfinder qu'il peut commencer à créer un chemin lorsqu'il est dans les airs.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_path_over_lava: {
                                    description: "Indique au pathfinder s'il peut traverser la surface de la lave.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_path_over_water: {
                                    description: "Indique au pathfinder s'il peut traverser la surface de l'eau.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_sink: {
                                    description: "Indique au pathfinder s'il sera ou non entraîné vers le bas par la gravité lorsqu'il est dans l'eau.",
                                    default: true,
                                    type: "boolean"
                                },
                                can_swim: {
                                    description: "Indique au pathfinder s'il peut nager dans l'eau et jouer l'animation de nage.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_walk: {
                                    description: "Indique au pathfinder s'il peut marcher sur le sol en dehors de l'eau.",
                                    default: true,
                                    type: "boolean"
                                },
                                can_walk_in_lava: {
                                    description: "Indique au pathfinder s'il peut marcher dans la lave comme sur le sol.",
                                    default: false,
                                    type: "boolean"
                                },
                                is_amphibious: {
                                    description: "Indique au pathfinder si l'Entité peut marcher sur le sol sous l'eau.",
                                    default: false,
                                    type: "boolean"
                                },
                            }
                        },
                        "minecraft:navigation.swim": {
                            description: "Force l'Entité à générer des chemins de navigation en nageant dans l'eau.",
                            type: "object",
                            properties: {
                                avoid_damage_blocks: {
                                    description: "Dit au pathfinder d'éviter les blocs qui causent des dégâts lorsqu'il trouve un chemin.",
                                    default: false,
                                    type: "boolean"
                                },
                                avoid_portals: {
                                    description: "Dit au pathfinder d'éviter les portails lorsqu'il trouve un chemin.",
                                    default: false,
                                    type: "boolean"
                                },
                                avoid_sun: {
                                    description: "Définit si le pathfinder doit éviter les blocs exposés au soleil lorsqu'il crée des chemins.",
                                    default: false,
                                    type: "boolean"
                                },
                                avoid_water: {
                                    description: "Définit si le pathfinder doit éviter les blocs d'eau lorsqu'il crée des chemins.",
                                    default: false,
                                    type: "boolean"
                                },
                                blocks_to_avoid: {
                                    description: "Dit au pathfinder quels blocs éviter lorsqu'il trouve un chemin.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                can_breach: {
                                    description: "Dit au pathfinder si l'Entité peut sauter hors de l'eau comme un dauphin.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_break_doors: {
                                    description: "Dit au pathfinder qu'il peut traverser une porte fermée et la casser.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_jump: {
                                    description: "Indique au pathfinder s'il peut ou non sauter par-dessus des blocs.",
                                    default: true,
                                    type: "boolean"
                                },
                                can_open_doors: {
                                    description: "Indique au pathfinder s'il peut ouvrir des portes.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_open_iron_doors: {
                                    description: "Indique au pathfinder s'il peut ouvrir des portes en fer.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_pass_doors: {
                                    description: "Indique au pathfinder s'il peut passer par une porte.",
                                    default: true,
                                    type: "boolean"
                                },
                                can_path_from_air: {
                                    description: "Indique au pathfinder qu'il peut commencer à créer un chemin lorsqu'il est dans les airs.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_path_over_lava: {
                                    description: "Indique au pathfinder s'il peut traverser la surface de la lave.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_path_over_water: {
                                    description: "Indique au pathfinder s'il peut traverser la surface de l'eau.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_sink: {
                                    description: "Indique au pathfinder s'il sera ou non entraîné vers le bas par la gravité lorsqu'il est dans l'eau.",
                                    default: true,
                                    type: "boolean"
                                },
                                can_swim: {
                                    description: "Indique au pathfinder s'il peut nager dans l'eau et jouer l'animation de nage.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_walk: {
                                    description: "Indique au pathfinder s'il peut marcher sur le sol en dehors de l'eau.",
                                    default: true,
                                    type: "boolean"
                                },
                                can_walk_in_lava: {
                                    description: "Indique au pathfinder s'il peut marcher dans la lave comme sur le sol.",
                                    default: false,
                                    type: "boolean"
                                },
                                is_amphibious: {
                                    description: "Indique au pathfinder si l'Entité peut marcher sur le sol sous l'eau.",
                                    default: false,
                                    type: "boolean"
                                },
                            }
                        },
                        "minecraft:navigation.walk": {
                            description: "Force l'Entité à générer des chemins de navigation en marchant sur le sol.",
                            type: "object",
                            properties: {
                                avoid_damage_blocks: {
                                    description: "Dit au pathfinder d'éviter les blocs qui causent des dégâts lorsqu'il trouve un chemin.",
                                    default: false,
                                    type: "boolean"
                                },
                                avoid_portals: {
                                    description: "Dit au pathfinder d'éviter les portails lorsqu'il trouve un chemin.",
                                    default: false,
                                    type: "boolean"
                                },
                                avoid_sun: {
                                    description: "Définit si le pathfinder doit éviter les blocs exposés au soleil lorsqu'il crée des chemins.",
                                    default: false,
                                    type: "boolean"
                                },
                                avoid_water: {
                                    description: "Définit si le pathfinder doit éviter les blocs d'eau lorsqu'il crée des chemins.",
                                    default: false,
                                    type: "boolean"
                                },
                                blocks_to_avoid: {
                                    description: "Dit au pathfinder quels blocs éviter lorsqu'il trouve un chemin.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                can_breach: {
                                    description: "Dit au pathfinder si l'Entité peut sauter hors de l'eau comme un dauphin.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_break_doors: {
                                    description: "Dit au pathfinder qu'il peut traverser une porte fermée et la casser.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_jump: {
                                    description: "Indique au pathfinder s'il peut ou non sauter par-dessus des blocs.",
                                    default: true,
                                    type: "boolean"
                                },
                                can_open_doors: {
                                    description: "Indique au pathfinder s'il peut ouvrir des portes.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_open_iron_doors: {
                                    description: "Indique au pathfinder s'il peut ouvrir des portes en fer.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_pass_doors: {
                                    description: "Indique au pathfinder s'il peut passer par une porte.",
                                    default: true,
                                    type: "boolean"
                                },
                                can_path_from_air: {
                                    description: "Indique au pathfinder qu'il peut commencer à créer un chemin lorsqu'il est dans les airs.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_path_over_lava: {
                                    description: "Indique au pathfinder s'il peut traverser la surface de la lave.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_path_over_water: {
                                    description: "Indique au pathfinder s'il peut traverser la surface de l'eau.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_sink: {
                                    description: "Indique au pathfinder s'il sera ou non entraîné vers le bas par la gravité lorsqu'il est dans l'eau.",
                                    default: true,
                                    type: "boolean"
                                },
                                can_swim: {
                                    description: "Indique au pathfinder s'il peut nager dans l'eau et jouer l'animation de nage.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_walk: {
                                    description: "Indique au pathfinder s'il peut marcher sur le sol en dehors de l'eau.",
                                    default: true,
                                    type: "boolean"
                                },
                                can_walk_in_lava: {
                                    description: "Indique au pathfinder s'il peut marcher dans la lave comme sur le sol.",
                                    default: false,
                                    type: "boolean"
                                },
                                is_amphibious: {
                                    description: "Indique au pathfinder si l'Entité peut marcher sur le sol sous l'eau.",
                                    default: false,
                                    type: "boolean"
                                },
                            }
                        },
                        "minecraft:npc": {
                            description: "Donne à l'Entité les interactions d'un NPC.",
                            type: "object",
                            properties: {
                                npc_data: {
                                    description: "Les données du NPC.",
                                    type: "object"
                                },
                            }
                        },
                        "minecraft:on_death": {
                            description: "Ajoute un déclencheur d'événement lors de la mort de l'Entité.",
                            type: "object",
                            properties: {
                                event: {
                                    description: "L'événement à déclencher lors de la mort de l'Entité.",
                                    type: "string"
                                },
                                filters: {
                                    description: "Les filtres à appliquer à l'événement.",
                                },
                                target: {
                                    description: "La cible de l'événement.",
                                    default: "self",
                                    type: "string",
                                    enum: ["baby", "block", "damager", "other", "parent", "player", "self", "target"]
                                },
                            }
                        },
                        "minecraft:on_friendly_anger": {
                            description: "Ajoute un déclencheur d'événement lorsqu'une entité amicale de même type entre dans un état de colère.",
                            type: "object",
                            properties: {
                                event: {
                                    description: "L'événement à déclencher lorsqu'une entité amicale de même type entre dans un état de colère.",
                                    type: "string"
                                },
                                filters: {
                                    description: "Les filtres à appliquer à l'événement.",
                                },
                                target: {
                                    description: "La cible de l'événement.",
                                    default: "self",
                                    type: "string",
                                    enum: ["baby", "block", "damager", "other", "parent", "player", "self", "target"]
                                },
                            }
                        },
                        "minecraft:on_hurt_by_player": {
                            description: "Ajoute un déclencheur d'événement lorsqu'une entité est blessée par un joueur.",
                            type: "object",
                            properties: {
                                event: {
                                    description: "L'événement à déclencher lorsqu'une entité est blessée par un joueur.",
                                    type: "string"
                                },
                                filters: {
                                    description: "Les filtres à appliquer à l'événement.",
                                },
                                target: {
                                    description: "La cible de l'événement.",
                                    default: "self",
                                    type: "string",
                                    enum: ["baby", "block", "damager", "other", "parent", "player", "self", "target"]
                                },
                            }
                        },
                        "minecraft:on_hurt": {
                            description: "Ajoute un déclencheur d'événement lorsqu'une entité est blessée.",
                            type: "object",
                            properties: {
                                event: {
                                    description: "L'événement à déclencher lorsqu'une entité est blessée.",
                                    type: "string"
                                },
                                filters: {
                                    description: "Les filtres à appliquer à l'événement.",
                                },
                                target: {
                                    description: "La cible de l'événement.",
                                    default: "self",
                                    type: "string",
                                    enum: ["baby", "block", "damager", "other", "parent", "player", "self", "target"]
                                },
                            }
                        },
                        "minecraft:on_ignite": {
                            description: "Ajoute un déclencheur d'événement lorsqu'une entité est enflammée.",
                            type: "object",
                            properties: {
                                event: {
                                    description: "L'événement à déclencher lorsqu'une entité est enflammée.",
                                    type: "string"
                                },
                                filters: {
                                    description: "Les filtres à appliquer à l'événement.",
                                },
                                target: {
                                    description: "La cible de l'événement.",
                                    default: "self",
                                    type: "string",
                                    enum: ["baby", "block", "damager", "other", "parent", "player", "self", "target"]
                                },
                            }
                        },
                        "minecraft:on_start_landing": {
                            description: "Ajoute un déclencheur d'événement lorsque l'entité commence à atterrir.  Type: `Object`. minecraft:on_start_landing ne peut être utilisé que par l'entité ender_dragon.",
                            type: "object",
                            properties: {
                                event: {
                                    description: "L'événement à déclencher lorsque l'entité commence à atterrir.",
                                    type: "string"
                                },
                                filters: {
                                    description: "Les filtres à appliquer à l'événement.",
                                },
                                target: {
                                    description: "La cible de l'événement.",
                                    default: "self",
                                    type: "string",
                                    enum: ["baby", "block", "damager", "other", "parent", "player", "self", "target"]
                                },
                            }
                        },
                        "minecraft:on_start_takeoff": {
                            description: "Ajoute un déclencheur d'événement lorsque l'entité commence à décoller.  Type: `Object`. minecraft:on_start_takeoff ne peut être utilisé que par l'entité ender_dragon.",
                            type: "object",
                            properties: {
                                event: {
                                    description: "L'événement à déclencher lorsque l'entité commence à décoller.",
                                    type: "string"
                                },
                                filters: {
                                    description: "Les filtres à appliquer à l'événement.",
                                },
                                target: {
                                    description: "La cible de l'événement.",
                                    default: "self",
                                    type: "string",
                                    enum: ["baby", "block", "damager", "other", "parent", "player", "self", "target"]
                                },
                            }
                        },
                        "minecraft:on_target_acquired": {
                            description: "Ajoute un déclencheur d'événement lorsqu'une entité acquiert une cible.  Type: `Object`. Ce composant nécessite que l'entité peut avoir une cible pour fonctionner.",
                            type: "object",
                            properties: {
                                event: {
                                    description: "L'événement à déclencher lorsqu'une entité acquiert une cible.",
                                    type: "string"
                                },
                                filters: {
                                    description: "Les filtres à appliquer à l'événement.",
                                },
                                target: {
                                    description: "La cible de l'événement.",
                                    default: "self",
                                    type: "string",
                                    enum: ["baby", "block", "damager", "other", "parent", "player", "self", "target"]
                                },
                            }
                        },
                        "minecraft:on_target_escape": {
                            description: "Ajoute un déclencheur d'événement lorsqu'une entité perd sa cible.  Type: `Object`. Ce composant nécessite que l'entité peut avoir une cible pour fonctionner.",
                            type: "object",
                            properties: {
                                event: {
                                    description: "L'événement à déclencher lorsqu'une entité perd sa cible.",
                                    type: "string"
                                },
                                filters: {
                                    description: "Les filtres à appliquer à l'événement.",
                                },
                                target: {
                                    description: "La cible de l'événement.",
                                    default: "self",
                                    type: "string",
                                    enum: ["baby", "block", "damager", "other", "parent", "player", "self", "target"]
                                },
                            }
                        },
                        "minecraft:on_wake_with_owner": {
                            description: "Ajoute un déclencheur d'événement lorsque le propriétaire de l'entité se réveille après avoir dormi avec l'entité.  Type: `Object`. minecraft:on_wake_with_owner nécessite qu'un joueur soit étiqueté comme propriétaire de l'entité, via le dressage ou la commande console.",
                            type: "object",
                            properties: {
                                event: {
                                    description: "L'événement à déclencher lorsque le propriétaire de l'entité se réveille après avoir dormi avec l'entité.",
                                    type: "string"
                                },
                                filters: {
                                    description: "Les filtres à appliquer à l'événement.",
                                },
                                target: {
                                    description: "La cible de l'événement.",
                                    default: "self",
                                    type: "string",
                                    enum: ["baby", "block", "damager", "other", "parent", "player", "self", "target"]
                                },
                            }
                        },
                        "minecraft:out_of_control": {
                            description: "Définit l'état 'hors de contrôle' de l'Entité.",
                            type: "object"
                        },
                        "minecraft:peek": {
                            description: "Définit le comportement 'peek' de l'Entité, et les événements qui doivent être appelés pendant celui-ci.",
                            type: "object",
                            properties: {
                                on_close: {
                                    description: "Evénement à déclencher lorsque l'Entité a fini de jeter un oeil.",
                                },
                                on_open: {
                                    description: "Evénement à déclencher lorsque l'Entité commence à jeter un oeil.",
                                },
                                on_target_open: {
                                    description: "Événement à appeler lorsque l'entité cible de l'entité commence à jeter un œil.",
                                },
                            }
                        },
                        "minecraft:persistent": {
                            description: "Définit si l'Entité est persistante dans le monde du jeu.",
                            type: "object"
                        },
                        "minecraft:physics": {
                            description: "Définit les propriétés physiques d'une Entité, y compris si elle est affectée par la gravité ou si elle entre en collision avec des objets.",
                            type: "object",
                            properties: {
                                has_collision: {
                                    description: "Définit si l'Entité entre en collision avec d'autres choses.",
                                    default: true,
                                    type: "boolean"
                                },
                                has_gravity: {
                                    description: "Définit si l'Entité est affectée par la gravité.",
                                    default: true,
                                    type: "boolean"
                                },
                                push_towards_closest_space: {
                                    description: "Définit si l'Entité doit être poussée vers la zone ouverte la plus proche lorsqu'elle est coincée à l'intérieur d'un bloc.",
                                    default: false,
                                    type: "boolean"
                                },
                            }
                        },
                        "minecraft:player.exhaustion": {
                            description: "Définit le niveau d'épuisement du joueur.",
                            type: "object",
                            properties: {
                                max: {
                                    description: "Le niveau maximum d'épuisement du joueur.",
                                    type: "integer"
                                },
                                value: {
                                    description: "La valeur actuelle de l'épuisement du joueur.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:player.experience": {
                            description: "Définit la quantité d'expérience que chaque action du joueur doit prendre.",
                            type: "object",
                            properties: {
                                max: {
                                    description: "Le maximum d'expérience du joueur.",
                                    default: 5,
                                    type: "integer"
                                },
                                value: {
                                    description: "La valeur initiale de l'expérience du joueur.",
                                    default: 1,
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:player.hunger": {
                            description: "Définit le niveau de faim du joueur.",
                            type: "object",
                            properties: {
                                value: {
                                    description: "La valeur initiale de la faim du joueur.",
                                    type: "integer"
                                },
                                max: {
                                    description: "Le niveau maximum de faim du joueur.",
                                    type: "integer"
                                },
                                min: {
                                    description: "Le niveau minimum de faim du joueur.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:player.level": {
                            description: "Définit le niveau d'xp du joueur.",
                            type: "object",
                            properties: {
                                max: {
                                    description: "Le niveau maximum du joueur.",
                                    type: "integer"
                                },
                                value: {
                                    description: "La valeur initiale du niveau du joueur.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:player.saturation": {
                            description: "Définit le besoin de nourriture du joueur.",
                            type: "object",
                            properties: {
                                max: {
                                    description: "Le maximum de saturation du joueur.",
                                    type: "integer"
                                },
                                value: {
                                    description: "La valeur initiale de la saturation du joueur.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:preferred_path": {
                            description: "Spécifie les informations de coût pour les entités qui préfèrent marcher sur des chemins préférés.",
                            type: "object",
                            properties: {
                                default_block_cost: {
                                    description: "Cout par défaut pour les blocs non préférés.",
                                    default: 0,
                                    type: "number"
                                },
                                jump_cost: {
                                    description: "Ajoute un coût pour sauter d'un bloc à un autre.",
                                    default: 0,
                                    type: "integer"
                                },
                                max_fall_blocks: {
                                    description: "Distance maximale qu'une entité peut tomber sans prendre de dégâts.",
                                    default: 3,
                                    type: "integer"
                                },
                                preferred_path_blocks: {
                                    description: "Une liste de blocs avec leur coût associé.",
                                    type: "array",
                                    items: {
                                        type: "object"
                                    }
                                },
                            }
                        },
                        "minecraft:projectile": {
                            description: "Permet à l'entité d'être un projectile.",
                            type: "object",
                            properties: {
                                anchor: {
                                    description: "Permet de choisir un point d'ancrage pour lequel le projectile est tiré.",
                                    default: 0,
                                    type: "integer"
                                },
                                angle_offset: {
                                    description: "Altère l'angle selon lequel un projectile est tiré verticalement. De nombreuses potions de lancer dans le jeu utilisent cela pour compenser leurs angles de -20 degrés.",
                                    default: 0,
                                    type: "number"
                                },
                                catch_fire: {
                                    description: "Définit si le projectile peut enflammer les entités qu'il touche.",
                                    default: false,
                                    type: "boolean"
                                },
                                crit_particle_on_hurt: {
                                    description: "Définit si, lorsqu'un projectile inflige des dégâts, il faut ou non générer des particules de dégâts critiques.",
                                    default: false,
                                    type: "boolean"
                                },
                                destroy_on_hurt: {
                                    description: "Définit si, lorsqu'un projectile inflige des dégâts, il faut ou non détruire immédiatement ce projectile.",
                                    default: false,
                                    type: "boolean"
                                },
                                filter: {
                                    description: "Définit les entités qui ne peuvent être touchées par le projectile.",
                                    type: "string"
                                },
                                fire_affected_by_griefing: {
                                    description: "Définit si le projectile qui cause le feu est affecté par la règle de jeu de griefing des entités.",
                                    default: false,
                                    type: "boolean"
                                },
                                gravity: {
                                    description: "La gravité appliquée à cette entité lorsqu'elle est lancée. Lorsque cette entité n'est pas au sol, soustrait cette quantité du changement de position verticale de l'entité à chaque tick. Plus la valeur est élevée, plus l'entité tombe rapidement.",
                                    default: 0.05,
                                    type: "number"
                                },
                                hit_nearest_passenger: {
                                    description: "Lorsque ce projectile touche un véhicule et qu'il y a au moins un passager dans ce vehicule, définit si les dégâts sont infligés au passager le plus proche du point d'impact du projectile. Si aucun passager n'est présent, ce paramètre ne fait rien.",
                                    default: false,
                                    type: "boolean"
                                },
                                hit_sound: {
                                    description: "Le son qui se joue lorsque le projectile touche quelque chose.",
                                    type: "string"
                                },
                                hit_ground_sound: {
                                    description: "Le son qui se joue lorsque le projectile touche le sol.",
                                    type: "string"
                                },
                                homing: {
                                    description: "Définit si le projectile se dirige vers l'entité la plus proche.",
                                    default: false,
                                    type: "boolean"
                                },
                                ignored_entities: {
                                    description: "[EXEPERIMENTAL] Les entités qui ne sont pas affectées par ce projectile.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                inertia: {
                                    description: "Définit la fraction de la vitesse du projectile maintenue à chaque frame pendant son déplacement dans l'air.",
                                    default: 0.99,
                                    type: "number"
                                },
                                is_dangerous: {
                                    description: "Définit si le projectile doit être traité comme dangereux pour les joueurs.",
                                    default: false,
                                    type: "boolean"
                                },
                                knockback: {
                                    description: "Définit si le projectile doit repousser l'entité qu'il touche.",
                                    default: true,
                                    type: "boolean"
                                },
                                lightning: {
                                    description: "Définit si l'entité touchée par le projectile est frappée par la foudre.",
                                    default: false,
                                    type: "boolean"
                                },
                                liquid_inertia: {
                                    description: "La fraction de la vitesse du projectile maintenue à chaque frame lorsqu'il se déplace dans l'eau.",
                                    default: 0.6,
                                    type: "number"
                                },
                                multiple_targets: {
                                    description: "Définit si le projectile peut toucher plusieurs entités par volée.",
                                    default: true,
                                    type: "boolean"
                                },
                                offset: {
                                    description: "Le décalage par rapport à l'ancrage de l'entité où le projectile apparaît.",
                                    type: "array",
                                    items: {
                                        type: "number"
                                    }
                                },
                                on_fire_time: {
                                    description: "Temps en secondes pendant lequel l'entité touchée sera en feu.",
                                    default: 0,
                                    type: "number"
                                },
                                on_hit: {
                                    description: "Définit les comportements qui peuvent être exécutés lorsqu'un projectile touche quelque chose.",
                                    type: "object"
                                },
                                particle: {
                                    description: "La particule à afficher lorsqu'un projectile est lancé.",
                                    default: "ironcrack",
                                    type: "string"
                                },
                                power: {
                                    description: "Détermine la vélocité du projectile.",
                                    default: 1.3,
                                    type: "number"
                                },
                                reflect_immunity: {
                                    description: "Durant le temps spécifié, en secondes, le projectile ne peut pas être réfléchi en le touchant.",
                                    default: 0,
                                    type: "number"
                                },
                                reflect_on_hurt: {
                                    description: "Définit si le projectile peut être réfléchi lorsqu'il touche une entité.",
                                    default: false,
                                    type: "boolean"
                                },
                                shoot_sound: {
                                    description: "Le son qui se joue lorsque le projectile est tiré.",
                                    type: "string"
                                },
                                shoot_target: {
                                    description: "Définit si le projectile doit être tiré vers la cible de l'entité.",
                                    default: true,
                                    type: "boolean"
                                },
                                should_bounce: {
                                    description: "Définit si le projectile rebondit lorsqu'il touche quelque chose.",
                                    default: false,
                                    type: "boolean"
                                },
                                splash_potion: {
                                    description: "Définit si le projectile doit être traité comme une potion de lancer.",
                                    default: false,
                                    type: "boolean"
                                },
                                splash_range: {
                                    description: "Rayon en blocs de l'effet de splash.",
                                    default: 4,
                                    type: "number"
                                },
                                stop_on_hurt: {
                                    description: "Détermine si le projectile s'arrête lorsque la cible est blessée.",
                                    default: false,
                                    type: "boolean"
                                },
                                uncertainty_base: {
                                    description: "La précision de base. La précision est déterminée par la formule uncertaintyBase - difficultyLevel * uncertaintyMultiplier.",
                                    default: 0,
                                    type: "number"
                                },
                                uncertainty_multiplier: {
                                    description: "Détermine dans quelle mesure la difficulté affecte la précision. La précision est déterminée par la formule uncertaintyBase - difficultyLevel * uncertaintyMultiplier.",
                                    default: 0,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:push_through": {
                            description: "Définit la distance à laquelle l'entité peut pousser à travers.",
                            type: "object",
                            properties: {
                                value: {
                                    description: "La valeur de la poussée de l'entité, en blocs.",
                                    default: 0,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:pushable": {
                            description: "Définit ce qui peut pousser une entité entre d'autres entités et des pistons.",
                            type: "object",
                            properties: {
                                is_pushable: {
                                    description: "Définit si l'entité peut être poussée par les autres entités.",
                                    default: true,
                                    type: "boolean"
                                },
                                is_pushable_by_piston: {
                                    description: "Définit si l'entité peut être poussée par un piston.",
                                    default: true,
                                    type: "boolean"
                                },
                            }
                        },
                        "minecraft:raid_trigger": {
                            description: "Tente de déclencher un raid à l'emplacement de l'entité.",
                            type: "object",
                            properties: {
                                triggered_event: {
                                    description: "L'événement à déclencher.",
                                },
                            }
                        },
                        "minecraft:rail_movement": {
                            description: "Définit le mouvement de l'Entité sur les rails.  Type: `Object`. Une Entité avec ce composant ne peut se déplacer que sur les rails.",
                            type: "object",
                            properties: {
                                max_speed: {
                                    description: "La vitesse maximale à laquelle cette Entité se déplacera sur les rails.",
                                    default: 0.4,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:rail_sensor": {
                            description: "Définit le comportement de l'Entité lorsqu'elle passe sur un rail activé ou désactivé.",
                            type: "object",
                            properties: {
                                check_block_types: {
                                    description: "Si c'est vrai, lors du tick, l'entité déclenchera son comportement on_deactivate.",
                                    default: false,
                                    type: "boolean"
                                },
                                eject_on_activate: {
                                    description: "Si c'est vrai, l'entité éjectera tous ses passagers lorsqu'elle passera sur un rail activé.",
                                    default: true,
                                    type: "boolean"
                                },
                                eject_on_deactivate: {
                                    description: "Si c'est vrai, l'entité éjectera tous ses passagers lorsqu'elle passera sur un rail désactivé.",
                                    default: false,
                                    type: "boolean"
                                },
                                on_activate: {
                                    description: "L'événement à déclencher lorsque l'entité passe sur un rail activé.",
                                },
                                on_deactivate: {
                                    description: "L'événement à déclencher lorsque l'entité passe sur un rail désactivé.",
                                },
                                tick_command_block_on_activate: {
                                    description: "Si c'est vrai, les blocs de commande commenceront à être activés lorsqu'ils passeront sur un rail activé.",
                                    default: true,
                                    type: "boolean"
                                },
                                tick_command_block_on_deactivate: {
                                    description: "Si c'est vrai, les blocs de commande commenceront à être activés lorsqu'ils passeront sur un rail désactivé.",
                                    default: false,
                                    type: "boolean"
                                },
                            }
                        },
                        "minecraft:ravager_blocked": {
                            description: "Définit la réponse du ravageur à leur attaque au corps à corps bloquée.",
                            type: "object",
                            properties: {
                                knockback_strength: {
                                    description: "La force avec laquelle les entités de blocage doivent être repoussées.",
                                    default: 3,
                                    type: "number"
                                },
                                reaction_choices: {
                                    description: "Une liste de réponses pondérées à l'attaque au corps à corps bloquée.",
                                    type: "array",
                                    items: {
                                        type: "object"
                                    }
                                },
                            }
                        },
                        "minecraft:renders_when_invisible": {
                            description: "Définit que l'Entité sera rendu même s'il est invisible.  Type: `Object`. Le comportement du rendu peut être spécifié dans le fichier client de l'Entité.",
                            type: "object"
                        },
                        "minecraft:reflect_projectiles": {
                            description: "[EXPÉRIMENTAL] Permet à une entité de refléter les projectiles.",
                            type: "object",
                            properties: {
                                azimuth_angle: {
                                    description: "Une expression Molang définissant l'angle en degrés à ajouter à la rotation de l'axe y du projectile.",
                                    default: 0,
                                },
                                elevation_angle: {
                                    description: "Une expression Molang définissant l'angle en degrés à ajouter à la rotation de l'axe x du projectile.",
                                    default: 0,
                                },
                                reflected_projectiles: {
                                    description: "Les types de projectiles qui sont réfléchis lorsqu'ils touchent l'entité.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                reflection_scale: {
                                    description: "Une expression Molang définissant l'échelle de vélocité du projectile réfléchi. Les valeurs inférieures à 1 diminuent la vélocité du projectile, et les valeurs supérieures à 1 l'augmentent.",
                                    default: 1,
                                },
                                reflection_sound: {
                                    description: "Le son qui se joue lorsque le projectile est réfléchi.",
                                    default: "reflect",
                                    type: "string"
                                },
                            }
                        },
                        "minecraft:remove_in_peaceful": {
                            description: "Définit que l'Entité sera supprimée en mode Pacifique.",
                            type: "object"
                        },
                        "minecraft:rideable": {
                            description: "Définit si l'Entité peut être montée. Permet de spécifier les différentes places de la monture.",
                            type: "object",
                            properties: {
                                controlling_seat: {
                                    description: "Le siège qui désigne le conducteur de l'entité. Cela n'est observé que par les styles de monture de cheval/bateau ; les chariots/entités avec 'minecraft:controlled_by_player' donnent le contrôle à n'importe quel joueur dans n'importe quel siège.",
                                    default: 0,
                                    type: "integer"
                                },
                                crouching_skip_interact: {
                                    description: "Définit si l'entité ne peut pas être interagie avec si l'entité interagissant avec elle est accroupie.",
                                    default: true,
                                    type: "boolean"
                                },
                                dismount_mode: {
                                    description: "Définit où les chevaucheurs sont placés lorsqu'ils descendent de l'Entité.  Type: `String`  `default`: les chevaucheurs sont placés sur une position au sol valide autour de l'Entité ou au centre de la boite de collision si aucune position est trouvée.  `on_top_center`: les chevaucheurs sont placés au centre en haut de la boite de collision de l'Entité.",
                                    default: "default",
                                    type: "string",
                                    enum: ["default", "on_top_center"]
                                },
                                family_types: {
                                    description: "Les types de famille d'entités qui peuvent monter sur cette entité.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                interact_text: {
                                    description: "Le texte à afficher lorsqu'un joueur peut interagir avec l'entité.",
                                    type: "string"
                                },
                                on_rider_enter_event: {
                                    description: "L'événement à exécuter sur l'Entité quand un passager monte.",
                                },
                                on_rider_exit_event: {
                                    description: "L'événement à exécuter sur l'Entité quand un passager descend.",
                                },
                                passenger_max_width: {
                                    description: "La largeur maximale qu'une entité peut avoir pour être un passager. Une valeur de 0 ignore ce paramètre.",
                                    default: 0,
                                    type: "number"
                                },
                                priority: {
                                    description: "Ce champ peut exister dans les anciennes données, mais n'est pas utilisé par minecraft:rideable.",
                                    default: 0,
                                    type: "integer"
                                },
                                pull_in_entities: {
                                    description: "Définit si l'entité tirera les entités dans les sièges disponibles.",
                                    default: false,
                                    type: "boolean"
                                },
                                rider_can_interact: {
                                    description: "Si c'est vrai, l'entité sera sélectionnée lorsqu'elle sera examinée par le pilote.",
                                    default: false,
                                    type: "boolean"
                                },
                                seat_count: {
                                    description: "Le nombre de sièges disponibles pour les passagers.",
                                    default: 1,
                                    type: "integer"
                                },
                                seats: {
                                    description: "La liste des positions et du nombre de cavaliers pour chaque position pour les entités montant cette entité.",
                                    type: "array",
                                    items: {
                                        type: "object"
                                    }
                                },
                            }
                        },
                        "minecraft:scale": {
                            description: "Définit la taille visuelle de l'entité en modifiant la taille du modèle.",
                            type: "object",
                            properties: {
                                value: {
                                    description: "La valeur de l'échelle. 1.0 signifie que l'entité apparaîtra à l'échelle définie dans son modèle. Des nombres plus élevés rendent l'entité plus grande.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:scale_by_age": {
                            description: "Définit l'interpolation de la taille de l'entité en fonction de l'âge de l'entité.",
                            type: "object",
                            properties: {
                                end_scale: {
                                    description: "L'échelle de fin de l'entité lorsqu'elle est entièrement développée.",
                                    default: 1,
                                    type: "number"
                                },
                                start_scale: {
                                    description: "L'échelle de départ de l'entité lorsqu'elle est bébé.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:scheduler": {
                            description: "Initialise les événements de mob programmés pendant les événements de la journée.",
                            type: "object",
                            properties: {
                                scheduled_events: {
                                    description: "La liste des événements programmés.",
                                    type: "array",
                                    items: {
                                        type: "object"
                                    }
                                },
                                min_delay_secs: {
                                    description: "Le délai minimum en secondes avant qu'un événement programmé ne puisse être déclenché.",
                                    default: 0,
                                    type: "number"
                                },
                                max_delay_secs: {
                                    description: "Le délai maximum en secondes avant qu'un événement programmé ne puisse être déclenché.",
                                    default: 0,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:shareables": {
                            description: "Définit une liste d'items que le mob veut partager ou ramasser.",
                            type: "object",
                            properties: {
                                all_items: {
                                    description: "Définit si l'entité peut ramasser et/ou partager tous les items du jeu.",
                                    default: false,
                                    type: "boolean"
                                },
                                all_items_max_amount: {
                                    description: "Nombre maximum d'items que l'Entité tiendra.",
                                    default: -1,
                                    type: "integer"
                                },
                                all_items_surplus_amount: {
                                    description: "Nombre d'items supplémentaires que l'Entité veut partager.",
                                    default: -1,
                                    type: "integer"
                                },
                                all_items_want_amount: {
                                    description: "Nombre d'items que l'Entité veut partager.",
                                    default: -1,
                                    type: "integer"
                                },
                                items: {
                                    description: "Liste des items que l'entité veut partager.",
                                    type: "array",
                                    items: {
                                        type: "object"
                                    }
                                },
                            }
                        },
                        "minecraft:shooter": {
                            description: "Définit le comportement de l'attaque à distance de l'entité.  Type: `Object`. Le composant 'minecraft:behavior.ranged_attack' utilise ce composant pour déterminer quels projectiles tirer.",
                            type: "object",
                            properties: {
                                aux_val: {
                                    description: "ID de l'effet de potion pour le projectile par défaut à appliquer lorsqu'il touche.",
                                    default: -1,
                                    type: "integer"
                                },
                                def: {
                                    description: "Définit l'entité projectile à utiliser pour l'attaque à distance.  Type: `String`. L'entité doit avoir un composant 'minecraft:projectile'.",
                                    type: "string"
                                },
                                magic: {
                                    description: "Définit si les projectiles utilisés sont marqués comme magiques. Si défini, l'objectif d'attaque à distance ne sera pas utilisé en même temps que d'autres objectifs magiques, tels que minecraft:behavior.drink_potion.",
                                    default: false,
                                    type: "boolean"
                                },
                                power: {
                                    description: "Velocité à laquelle les projectiles sont tirés.  Type: `Number`. Une puissance de 0 sera écrasée par la puissance de lancer de projectile par défaut.",
                                    default: 0,
                                    type: "number"
                                },
                                projectiles: {
                                    description: "Liste des projectiles qui peuvent être utilisés par le tireur. Les projectiles sont évalués dans l'ordre de la liste ; après qu'un projectile soit choisi, le reste de la liste est ignoré.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                sound: {
                                    description: "Le son qui se joue lorsque le tireur tire un projectile.",
                                    type: "string"
                                },
                            }
                        },
                        "minecraft:sittable": {
                            description: "Définit l'état assise de l'entité.",
                            type: "object",
                            properties: {
                                sit_event: {
                                    description: "Evénement à déclencher lorsque l'entité s'assoit.",
                                },
                                stand_event: {
                                    description: "Evénement à déclencher lorsque l'entité se lève.",
                                },
                            }
                        },
                        "minecraft:skin_id": {
                            description: "Définit l'ID du skin de l'entité. Peut être utilisé pour différencier les skins, comme les skins de base pour les villageois.",
                            type: "object",
                            properties: {
                                value: {
                                    description: "L'ID du skin. Par convention, 0 est l'ID du skin de base.",
                                    default: 0,
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:sound_volume": {
                            description: "Définit le volume de base de l'Entité pour les effets sonores.",
                            type: "object",
                            properties: {
                                value: {
                                    description: "Le volume de base de l'Entité pour les effets sonores.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:spawn_entity": {
                            description: "Ajoute un événement de spawn d'entité à l'entité.",
                            type: "object",
                            properties: {
                                entities: {
                                    description: "Une liste d'entités à faire apparaître.",
                                    type: "array",
                                    items: {
                                        type: "object"
                                    }
                                },
                            }
                        },
                        "minecraft:spell_effects": {
                            description: "Permet à une entité d'ajouter ou de supprimer des effets de statut d'elle-même.  Type: `Object`. Ce composant fontionne une fois quand il est ajouté à l'Entité. Supprimer le composant n'aura aucun effet sur les effets actuels de l'entité.",
                            type: "object",
                            properties: {
                                add_effects: {
                                    description: "Définit les effets de statut à ajouter à l'entité.",
                                    type: "array",
                                    items: {
                                        type: "object"
                                    }
                                },
                                remove_effects: {
                                    description: "Définit les effets de statut à supprimer de l'entité.",
                                },
                            }
                        },
                        "minecraft:strength": {
                            description: "Définit la capacité de l'entité à infliger des dégâts.",
                            type: "object",
                            properties: {
                                max: {
                                    description: "La force maximale de l'entité.",
                                    default: 5,
                                    type: "integer"
                                },
                                value: {
                                    description: "La valeur de la force de l'entité.",
                                    default: 1,
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:suspect_tracking": {
                            description: "Permet à l'entité de se souvenir des emplacements suspects.",
                            type: "object"
                        },
                        "minecraft:tameable": {
                            description: "Définit les règles pour qu'une Entité soit apprivoisée par le joueur.",
                            type: "object",
                            properties: {
                                probability: {
                                    description: "La chance d'apprivoiser l'entité avec chaque utilisation d'item entre 0.0 et 1.0, où 1.0 est 100%.",
                                    default: 1,
                                    type: "number"
                                },
                                tame_event: {
                                    description: "L'événement à déclencher lorsque l'entité est apprivoisée.",
                                },
                                tame_items: {
                                    description: "La liste des items qui peuvent être utilisés pour apprivoiser l'entité.",
                                },
                            }
                        },
                        "minecraft:tamemount": {
                            description: "Définit les règles pour qu'une Entité soit apprivoisée par le joueur en montant dessus.",
                            type: "object",
                            properties: {
                                attempt_temper_mod: {
                                    description: "Le degré d'augmentation du tempérament de l'entité lorsqu'elle est montée.",
                                    default: 5,
                                    type: "integer"
                                },
                                autoRejectItems: {
                                    description: "La liste des items qui, quand le le joueur intéragit avec l'Entité, l'enervera.",
                                    type: "array",
                                    items: {
                                        type: "object"
                                    }
                                },
                                feed_items: {
                                    description: "La liste des objets qui peuvent être utilisés pour augmenter le tempérament de l'entité et accélérer le processus d'apprivoisement.",
                                    type: "array",
                                    items: {
                                        type: "object"
                                    }
                                },
                                feed_text: {
                                    description: "Le texte à afficher lorsqu'un joueur peut nourrir l'entité.",
                                    type: "string"
                                },
                                max_temper: {
                                    description: "La valeur maximale pour le tempérament de l'entité.",
                                    default: 100,
                                    type: "integer"
                                },
                                min_temper: {
                                    description: "La valeur minimale pour le tempérament de l'entité.",
                                    default: 0,
                                    type: "integer"
                                },
                                ride_text: {
                                    description: "Le texte à afficher lorsqu'un joueur peut monter l'entité.",
                                    type: "string"
                                },
                                tame_event: {
                                    description: "L'événement à déclencher lorsque l'entité est apprivoisée.",
                                },
                            }
                        },
                        "minecraft:target_nearby_sensor": {
                            description: "Définit la plage de l'entité dans laquelle elle peut voir ou détecter d'autres entités pour les cibler.",
                            type: "object",
                            properties: {
                                inside_range: {
                                    description: "La distance maximale en blocs à laquelle une autre entité sera considérée dans la plage 'inside'.",
                                    default: 1,
                                    type: "number"
                                },
                                must_see: {
                                    description: "Si c'est vrai, l'entité doit être visible pour être considérée dans la plage 'inside'.",
                                    default: false,
                                    type: "boolean"
                                },
                                on_inside_range: {
                                    description: "Evénement à déclencher lorsque l'entité est dans la plage 'inside'.",
                                },
                                on_outside_range: {
                                    description: "Evénement à déclencher lorsque l'entité est dans la plage 'outside'.",
                                },
                                on_vision_lost_inside_range: {
                                    description: "Evénement à déclencher lorsque l'entité est dans la plage 'inside' et perd la vision de la cible.",
                                },
                                outside_range: {
                                    description: "La distance maximale en blocs à laquelle une autre entité sera considérée dans la plage 'outside'.",
                                    default: 5,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:teleport": {
                            description: "Définit les règles pour que l'entité se téléporte.",
                            type: "object",
                            properties: {
                                dark_teleport_chance: {
                                    description: "Modifie la chance que l'entité se téléporte si elle est dans l'obscurité.",
                                    default: 0.01,
                                    type: "number"
                                },
                                light_teleport_chance: {
                                    description: "Modifie la chance que l'entité se téléporte si elle est en plein jour.",
                                    default: 0.01,
                                    type: "number"
                                },
                                max_random_teleport_time: {
                                    description: "Temps maximum en secondes entre les téléportations aléatoires.",
                                    default: 20,
                                    type: "number"
                                },
                                min_random_teleport_time: {
                                    description: "Temps minimum en secondes entre les téléportations aléatoires.",
                                    default: 0,
                                    type: "number"
                                },
                                random_teleport_cube: {
                                    description: "Définit la zone dans laquelle l'entité se téléportera aléatoirement.",
                                    default: [32,16,32],
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: {
                                        type: "number"
                                    }
                                },
                                random_teleports: {
                                    description: "Définit si l'entité se téléportera aléatoirement.",
                                    default: true,
                                },
                                target_distance: {
                                    description: "La distance maximale à laquelle l'entité se téléportera pour suivre sa cible.",
                                    default: 16,
                                    type: "number"
                                },
                                target_teleport_chance: {
                                    description: "La chance que l'entité se téléporte pour suivre sa cible.",
                                    default: 1,
                                    type: "number",
                                    minimum: 0,
                                    maximum: 1
                                },
                            }
                        },
                        "minecraft:tick_world": {
                            description: "Définit si l'Entité met à jour le monde autour d'elle.",
                            type: "object",
                            properties: {
                                distance_to_players: {
                                    description: "La distance minimale à laquelle un joueur doit être pour que l'entité mette à jour le monde autour d'elle.",
                                    default: 128,
                                    type: "number",
                                    minimum: 128
                                },
                                never_despawn: {
                                    description: "Si vrai, l'entité ne disparaîtra pas même si les joueurs sont loin. Si faux, distance_to_players sera utilisé pour déterminer quand disparaître.",
                                    default: true,
                                    type: "boolean"
                                },
                                radius: {
                                    description: "La zone autour de l'entité à mettre à jour.",
                                    default: 2,
                                    type: "integer",
                                    minimum: 2,
                                    maximum: 6
                                },
                            }
                        },
                        "minecraft:timer": {
                            description: "Définit un minuteur après lequel un événement se déclenchera.",
                            type: "object",
                            properties: {
                                looping: {
                                    description: "Si vrai, le minuteur redémarrera chaque fois qu'il se déclenche.",
                                    default: true,
                                    type: "boolean"
                                },
                                randomInterval: {
                                    description: "Si vrai, la durée du minuteur sera aléatoire entre les valeurs min et max spécifiées dans time.",
                                    default: true,
                                    type: "boolean"
                                },
                                random_time_choices: {
                                    description: "Une liste d'objets, représentant une valeur en secondes qui peut être choisie avant de déclencher l'événement et un poids optionnel. Incompatible avec time.",
                                    type: "array",
                                    items: {
                                        type: "object"
                                    }
                                },
                                time: {
                                    description: "La durée en secondes avant que l'événement ne se déclenche. Peut être spécifié comme un nombre ou une paire de nombres (min et max). Incompatible avec random_time_choices.",
                                    default: [0,0],
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
                                time_down_event: {
                                    description: "Contient l'événement à déclencher.",
                                },
                            }
                        },
                        "minecraft:trade_resupply": {
                            description: "Réapprovisionne le commerce de l'entité.",
                            type: "object"
                        },
                        "minecraft:trade_table": {
                            description: "Définit la capacité de l'entité à commercer avec les joueurs.",
                            type: "object",
                            properties: {
                                convert_trades_economy: {
                                    description: "Détermine quand l'entité se transforme, si les échanges doivent être convertis lorsque la nouvelle entité a une table de commerce économique.",
                                    default: false,
                                    type: "boolean"
                                },
                                display_name: {
                                    description: "Le nom à afficher lors du commerce avec cette entité.",
                                    type: "string"
                                },
                                new_screen: {
                                    description: "Détermine si le commerce s'ouvre avec le nouvel écran de commerce.",
                                    default: false,
                                    type: "boolean"
                                },
                                persist_trades: {
                                    description: "Détermine si les échanges doivent persister lorsque l'entité se transforme. Cela fait en sorte que la prochaine fois que l'entité se transforme en quelque chose avec une table de commerce ou une table de commerce économique, elle conserve ses échanges.",
                                    default: false,
                                    type: "boolean"
                                },
                                table: {
                                    description: "Chemin de la Trade Table à utiliser pour les échanges.",
                                    type: "string"
                                },
                            }
                        },
                        "minecraft:trail": {
                            description: "Oblige une entité à laisser une traînée de blocs lorsqu'elle se déplace dans le monde.",
                            type: "object",
                            properties: {
                                block_type: {
                                    description: "Le type de bloc que vous souhaitez voir apparaître lorsque l'entité se déplace dans le monde. Les blocs solides ne peuvent pas apparaître avec un décalage de (0,0,0).",
                                    default: "air",
                                    type: "string"
                                },
                                spawn_filter: {
                                    description: "Un ou plusieurs filtres qui doivent être remplis pour que le type de bloc choisi apparaisse.",
                                },
                                spawn_offset: {
                                    description: "La distance entre la position actuelle de l'entité et l'apparition du bloc. Limité à 16 blocs. La valeur X est gauche/droite (-/+), la valeur Z est en arrière/en avant (-/+), la valeur Y est en dessous/au-dessus (-/+).",
                                    default: [0,0,0],
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: {
                                        type: "number"
                                    }
                                },
                            }
                        },
                        "minecraft:transformation": {
                            description: "Définit une transformation d'une entité à une autre.",
                            type: "object",
                            properties: {
                                add: {
                                    description: "Liste des groupes de composants à ajouter à l'entité après la transformation.",
                                    type: "object"
                                },
                                begin_transform_sound: {
                                    description: "Le son qui se joue lorsque l'entité commence à se transformer.",
                                    type: "string"
                                },
                                drop_equipment: {
                                    description: "Détermine si l'entité doit laisser tomber tout son équipement lorsqu'elle se transforme.",
                                    default: false,
                                    type: "boolean"
                                },
                                drop_inventory: {
                                    description: "Détermine si l'entité doit laisser tomber tous les items de son inventaire lorsqu'elle se transforme.",
                                    default: false,
                                    type: "boolean"
                                },
                                into: {
                                    description: "L'identifiant de l'entité dans laquelle l'entité se transformera.",
                                    type: "string"
                                },
                                keep_level: {
                                    description: "Si l'entité a des échanges et a monté de niveau, elle doit conserver ce niveau après la transformation.",
                                    default: false,
                                    type: "boolean"
                                },
                                keep_owner: {
                                    description: "Si l'entité appartient par une autre entité, elle doit appartenir après la transformation.",
                                    default: false,
                                    type: "boolean"
                                },
                                preserve_equipment: {
                                    description: "Définit si l'entité doit conserver son équipement après la transformation.",
                                    default: false,
                                    type: "boolean"
                                },
                                transformation_sound: {
                                    description: "Le son qui se joue lorsque l'entité se transforme.",
                                    type: "string"
                                },
                                delay: {
                                    description: "Définit les propriétés du délai pour la transformation.",
                                    type: "object"
                                },
                            }
                        },
                        "minecraft:transient": {
                            description: "Définit que l'Entité ne doit jamais persister et disparaîtra pour toujours lorsqu'elle n'est plus chargée.",
                            type: "object"
                        },
                        "minecraft:trust": {
                            description: "Force l'entité à faire confiance à un ou plusieurs joueurs.",
                            type: "object"
                        },
                        "minecraft:trusting": {
                            description: "Définit les règles pour qu'une entité fasse confiance à un joueur.",
                            type: "object",
                            properties: {
                                probability: {
                                    description: "La chance de l'entité de faire confiance à chaque utilisation d'item entre 0.0 et 1.0, où 1.0 est 100%.",
                                    default: 1,
                                    type: "number",
                                    minimum: 0,
                                    maximum: 1
                                },
                                trust_event: {
                                    description: "L'événement à déclencher lorsque l'entité fait confiance au joueur.",
                                },
                                trust_items: {
                                    description: "La liste des items qui peuvent être utilisés pour gagner la confiance de l'entité.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                            }
                        },
                        "minecraft:type_family": {
                            description: "Définit les familles auxquelles appartient l'entité.",
                            type: "object",
                            properties: {
                                family: {
                                    description: "Liste des familles auxquelles appartient l'entité.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                            }
                        },
                        "minecraft:underwater_movement": {
                            description: "Définit la vitesse à laquelle une entité peut se déplacer dans l'eau.",
                            type: "object",
                            properties: {
                                value: {
                                    description: "La vitesse à laquelle l'entité peut se déplacer dans l'eau.",
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:variable_max_auto_step": {
                            description: "Permet aux entités d'avoir une hauteur de marche automatique maximale qui est différente en fonction de si elles sont sur un bloc qui empêche de sauter.",
                            type: "object",
                            properties: {
                                base_value: {
                                    description: "La hauteur maximale de l'auto-pas lorsqu'il est sur un bloc qui empêche de sauter.",
                                    default: 0.5625,
                                    type: "number"
                                },
                                controlled_value: {
                                    description: "La hauteur maximale de l'auto-pas lorsqu'il est sur un autre bloc et contrôlé par le joueur.",
                                    default: 0.5625,
                                    type: "number"
                                },
                                jump_prevented_value: {
                                    description: "La hauteur maximale de l'auto-pas lorsqu'il est sur un bloc qui empêche de sauter.",
                                    default: 0.5625,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:variant": {
                            description: "Utilisé pour différencier le groupe de composants d'une variante d'une entité des autres, comme ocelot, villageois et cheval.",
                            type: "object",
                            properties: {
                                value: {
                                    description: "L'ID de la variante. Par convention, 0 est l'ID de l'entité de base.",
                                    default: 0,
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:vibration_damper": {
                            description: "Définit que les vibrations émises par cette entité seront ignorées.",
                            type: "object"
                        },
                        "minecraft:vibration_listener": {
                            description: "Permet à l'entité d'écouter les événements de vibration. Il s'agit d'un composant largement interne, pris en charge uniquement sur les entités Warden et Allay.",
                            type: "object"
                        },
                        "minecraft:walk_animation_speed": {
                            description: "Définit le multiplicateur de vitesse pour la vitesse de l'animation de marche de cette entité.",
                            type: "object",
                            properties: {
                                value: {
                                    description: "Plus le nombre est élevé, plus l'animation de marche est rapide. Une valeur de 1,0 signifie une vitesse normale, tandis que 2,0 signifie deux fois plus vite.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:wants_jockey": {
                            description: "Définit si cette entité veut devenir un jockey.",
                            type: "object"
                        },
                        "minecraft:water_movement": {
                            description: "Définit la vitesse à laquelle une entité peut se déplacer dans l'eau.",
                            type: "object",
                            properties: {
                                drag_factor: {
                                    description: "Le facteur de traînée pour déterminer la vitesse de déplacement lorsqu'il est dans l'eau.",
                                    default: 0.8,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.admire_item": {
                            description: "Fait en sorte qu'une entité admire un objet qu'elle tient.  Type: `Object`. Ce composant nécessite que le composant minecraft:admire_item soit défini dans la définition de l'entité.",
                            type: "object",
                            properties: {
                                admire_item_sound: {
                                    description: "L'événement sonore à jouer lorsque l'entité admire l'objet.",
                                    type: "string"
                                },
                                sound_interval: {
                                    description: "La plage de temps en secondes pour attendre avant de jouer le son à nouveau.",
                                    default: 0,
                                },
                                on_admire_item_start: {
                                    description: "L'événement à déclencher lorsque l'entité commence à admirer l'item.",
                                },
                                on_admire_item_stop: {
                                    description: "L'événement à déclencher lorsque l'entité arrête d'admirer l'item.",
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.avoid_block": {
                            description: "Fait en sorte qu'une entité évite certains blocs.",
                            type: "object",
                            properties: {
                                avoid_block_sound: {
                                    description: "L'événement sonore à jouer lorsque l'entité évite un bloc.",
                                    type: "string"
                                },
                                on_escape: {
                                    description: "L'événement à déclencher lorsque l'entité évite un bloc.",
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif.",
                                    type: "integer"
                                },
                                search_height: {
                                    description: "La hauteur maximale à laquelle l'entité cherchera un bloc à éviter.",
                                    default: 0,
                                    type: "integer"
                                },
                                search_range: {
                                    description: "La distance horizontale maximale à laquelle l'entité cherchera un bloc à éviter.",
                                    default: 0,
                                    type: "number"
                                },
                                sound_interval: {
                                    description: "La plage de temps en secondes pour attendre avant de jouer le son à nouveau.",
                                    type: "object",
                                    properties: {
                                        range_max: {
                                            description: "La valeur maximale de la plage de temps en secondes.",
                                            default: 8,
                                            type: "number"
                                        },
                                        range_min: {
                                            description: "La valeur minimale de la plage de temps en secondes.",
                                            default: 3,
                                            type: "number"
                                        }
                                    }
                                },
                                sprint_speed_modifier: {
                                    description: "Modificateur de vitesse de sprint. 1,0 signifie conserver la vitesse normale, tandis que des nombres plus élevés accélèrent la vitesse de sprint.",
                                    default: 1,
                                    type: "number"
                                },
                                target_blocks: {
                                    description: "Liste des blocs à éviter.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                target_selection_method: {
                                    description: "La méthode de recherche de blocs à éviter.",
                                    default: "nearest",
                                    type: "string"
                                },
                                tick_interval: {
                                    description: "Le nombre de ticks entre chaque recherche de blocs à éviter.",
                                    default: 1,
                                    type: "integer"
                                },
                                walk_speed_modifier: {
                                    description: "Modificateur de vitesse de marche. 1,0 signifie conserver la vitesse normale, tandis que des nombres plus élevés accélèrent la vitesse de marche.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.avoid_mob_type": {
                            description: "Force l'Entité à fuir d'autres entités spécifiques.",
                            type: "object",
                            properties: {
                                avoid_mob_sound: {
                                    description: "Le son à jouer lorsque l'entité évite une autre entité.",
                                    type: "string"
                                },
                                avoid_target_xz: {
                                    description: "La distance horizontale à laquelle l'entité doit s'éloigner de l'autre entité.  Type: `Integer",
                                    default: 16,
                                    type: "integer"
                                },
                                avoid_target_y: {
                                    description: "La distance verticale à laquelle l'entité doit s'éloigner de l'autre entité.",
                                    default: 7,
                                    type: "integer"
                                },
                                entity_types: {
                                    description: "La liste des types d'entités à éviter.",
                                    type: "array",
                                    items: {
                                        type: "object"
                                    }
                                },
                                ignore_visibility: {
                                    description: "Ignorer ou non la ligne de vue directe pendant que cette entité s'enfuit d'autres entités spécifiées.",
                                    default: false,
                                    type: "boolean"
                                },
                                max_dist: {
                                    description: "Distance maximale à parcourir pour rechercher une cible à éviter pour l'entité..",
                                    default: 3,
                                    type: "number"
                                },
                                max_flee: {
                                    description: "À combien de blocs de sa cible à éviter l'entité doit-elle se trouver pour qu'elle cesse de fuir la cible à éviter.",
                                    default: 10,
                                    type: "number"
                                },
                                on_escape_event: {
                                    description: "L'événement à déclencher lorsque l'entité évite une autre entité.",
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif.",
                                    type: "integer"
                                },
                                probability_per_strength: {
                                    description: "Pourcentage de chance que cette entité arrête d'éviter une autre entité basée sur la force de cette entité, où 1,0 = 100%.",
                                    default: 1,
                                    type: "number",
                                    minimum: 0,
                                    maximum: 1
                                },
                                remove_target: {
                                    description: "Détermine si nous devons supprimer la cible lors de la fuite ou non.",
                                    default: false,
                                    type: "boolean"
                                },
                                sound_interval: {
                                    description: "La plage de temps en secondes pour attendre avant de jouer le son à nouveau.",
                                    type: "object",
                                    properties: {
                                        range_max: {
                                            description: "La valeur maximale de la plage de temps en secondes.",
                                            default: 8,
                                            type: "number"
                                        },
                                        range_min: {
                                            description: "La valeur minimale de la plage de temps en secondes.",
                                            default: 3,
                                            type: "number"
                                        }
                                    }
                                },
                                sprint_distance: {
                                    description: "Combien de blocs doivent se trouver à portée de sa cible à éviter l'entité pour qu'elle commence à sprinter loin de la cible à éviter.",
                                    default: 7,
                                    type: "number"
                                },
                                sprint_speed_multiplier: {
                                    description: "Multiplicateur de vitesse de sprint. 1,0 signifie conserver la vitesse normale, tandis que des nombres plus élevés accélèrent la vitesse de sprint.",
                                    default: 1,
                                    type: "number"
                                },
                                walk_speed_multiplier: {
                                    description: "Multiplicateur de vitesse de marche. 1,0 signifie conserver la vitesse normale, tandis que des nombres plus élevés accélèrent la vitesse de marche.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.barter": {
                            description: "Fait en sorte qu'une entité laisse tomber un item en retour après qu'un joueur ait offert un échange en déposant un objet spécifique près de l'entité.  Type: `Object`. Ce composant nécessite que le composant minecraft:barter soit défini dans la définition de l'entité.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.beg": {
                            description: "Permet à l'Entité de regarder et de suivre le joueur qui tient de la nourriture qu'elle aime.",
                            type: "object",
                            properties: {
                                items: {
                                    description: "La liste des items que l'entité aime.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                look_distance: {
                                    description: "La distance à laquelle l'entité peut regarder le joueur qui tient l'item qu'elle aime.",
                                    default: 8,
                                    type: "number"
                                },
                                look_time: {
                                    description: "La plage de temps en secondes que l'entité regardera le joueur qui tient l'item qu'elle aime.",
                                    type: "object",
                                    properties: {
                                        range_max: {
                                            description: "La valeur maximale de la plage de temps en secondes.",
                                            default: 4,
                                            type: "number"
                                        },
                                        range_min: {
                                            description: "La valeur minimale de la plage de temps en secondes.",
                                            default: 2,
                                            type: "number"
                                        }
                                    }
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.break_door": {
                            description: "Fait en sorte qu'une entité casse une porte.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.breed": {
                            description: "Permet à l'entité de se reproduire avec d'autres entités de la même espèce.  Type: `Object`  Nécessite que le composant minecraft:breedable soit défini dans la définition de l'entité.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif.",
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Multiplicateur de mouvement de vitesse de l'Entité quand elle utilise cet objectif AI.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.celebrate": {
                            description: "Fait en sorte qu'une entité célèbre en faisant des sons de célébration et en sautant.",
                            type: "object",
                            properties: {
                                celebration_sound: {
                                    description: "L'événement sonore à jouer lorsque l'entité célèbre.",
                                    type: "string"
                                },
                                duration: {
                                    description: "La durée en secondes pendant laquelle l'entité célèbre.",
                                    default: 30,
                                    type: "number"
                                },
                                jump_interval: {
                                    description: "La plage de temps en secondes entre les sauts de l'entité.",
                                    type: "object",
                                    properties: {
                                        range_max: {
                                            description: "La valeur maximale de la plage de temps en secondes.",
                                            default: 3.5,
                                            type: "number"
                                        },
                                        range_min: {
                                            description: "La valeur minimale de la plage de temps en secondes.",
                                            default: 1,
                                            type: "number"
                                        }
                                    }
                                },
                                on_celebration_end_event: {
                                    description: "L'événement à déclencher lorsque l'entité arrête de célébrer.",
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif.",
                                    type: "integer"
                                },
                                sound_interval: {
                                    description: "La plage de temps en secondes pour attendre avant de jouer le son à nouveau.",
                                    type: "object",
                                    properties: {
                                        range_max: {
                                            description: "La valeur maximale de la plage de temps en secondes.",
                                            default: 7,
                                            type: "number"
                                        },
                                        range_min: {
                                            description: "La valeur minimale de la plage de temps en secondes.",
                                            default: 2,
                                            type: "number"
                                        }
                                    }
                                },
                            }
                        },
                        "minecraft:behavior.celebrate_survive": {
                            description: "Fait en sorte que l'Entité célèbre sa survie après un raid en tirant des feux d'artifice.",
                            type: "object",
                            properties: {
                                duration: {
                                    description: "La durée en secondes pendant laquelle l'entité célèbre.",
                                    default: 30,
                                    type: "number"
                                },
                                fireworks_interval: {
                                    description: "La plage de temps en secondes entre les tirs de feux d'artifice.",
                                    type: "object",
                                    properties: {
                                        range_max: {
                                            description: "La valeur maximale de la plage de temps en secondes.",
                                            default: 20,
                                            type: "number"
                                        },
                                        range_min: {
                                            description: "La valeur minimale de la plage de temps en secondes.",
                                            default: 10,
                                            type: "number"
                                        }
                                    }
                                },
                                on_celebration_end_event: {
                                    description: "L'événement à déclencher lorsque l'entité arrête de célébrer.",
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.charge_attack": {
                            description: "Force l'Entité à attaquer sa cible avec une attaque de charge.",
                            type: "object",
                            properties: {
                                max_distance: {
                                    description: "L'attaque de charge ne peut pas commencer si l'entité est plus loin que cette distance de la cible.",
                                    default: 3,
                                    type: "number"
                                },
                                min_distance: {
                                    description: "L'attaque de charge ne peut pas commencer si l'entité est plus proche que cette distance de la cible.",
                                    default: 2,
                                    type: "number"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif.",
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Multiplicateur de vitesse de mouvement de l'entité lorsqu'elle utilise cet objectif AI.",
                                    default: 1,
                                    type: "number"
                                },
                                success_rate: {
                                    description: "Pourcentage de chance que cette entité commence une attaque de charge, si elle n'attaque pas déjà, où 1,0 = 100%.",
                                    default: 0.1428,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.charge_held_item": {
                            description: "Force l'Entité à charger et à utiliser l'item qu'elle tient.",
                            type: "object",
                            properties: {
                                items: {
                                    description: "Liste des items qui peuvent être utilisés pour charger l'item tenu par l'entité.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.circle_around_anchor": {
                            description: "Force l'Entité à tourner autour d'un point d'ancrage placé près d'un point ou d'une cible.",
                            type: "object",
                            properties: {
                                angle_change: {
                                    description: "Nombre de degrés à changer pour l'orientation de l'entité lorsqu'elle sélectionne son prochain point d'ancrage.",
                                    default: 15,
                                    type: "number"
                                },
                                goal_radius: {
                                    description: "Distance maximale de l'entité par rapport à son point d'ancrage. Ceci est pour empêcher l'entité de tourner autour de son point d'ancrage.",
                                    default: 0.5,
                                    type: "number"
                                },
                                height_above_target_range: {
                                    description: "Le nombre de blocs au-dessus de la cible que le prochain point d'ancrage peut être défini. Cette valeur est utilisée uniquement lorsque l'entité suit une cible.",
                                    default: [0,0],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                                height_adjustment_chance: {
                                    description: "Pourcentage de chance de déterminer à quelle fréquence augmenter ou diminuer la hauteur actuelle autour du point d'ancrage. 1 = 100%.  Type: `Number`. La propriété suivante est obsolète `height_change_chance` a été remplacé par `height_adjustment_chance`.",
                                    default: 0.002857,
                                    type: "number"
                                },
                                height_offset_range: {
                                    description: "Distance verticale de l'entité par rapport à son point d'ancrage.",
                                    default: [0,0],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif.",
                                    type: "integer"
                                },
                                radius_adjustment_chance: {
                                    description: "Pourcentage de chance de déterminer à quelle fréquence augmenter la taille du rayon de mouvement actuel autour du point d'ancrage. 1 = 100%.  Type: `Number`. La propriété suivante est obsolète `radius_change_chance` a été remplacé par `radius_adjustment_chance`.",
                                    default: 0.004,
                                    type: "number"
                                },
                                radius_change: {
                                    description: "Le nombre de blocs à augmenter le rayon de mouvement actuel autour du point d'ancrage lorsqu'il est sélectionné.",
                                    default: 1,
                                    type: "number"
                                },
                                radius_range: {
                                    description: "Distance horizontale maximale de l'entité par rapport à son point d'ancrage.",
                                    default: [5,15],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                                speed_multiplier: {
                                    description: "Multiplicateur de vitesse de mouvement de l'entité lorsqu'elle utilise cet objectif AI.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.controlled_by_player": {
                            description: "Force à l'Entité d'être contrôlée par le joueur en utilisant un item dans la propriété item_controllable.",
                            type: "object",
                            properties: {
                                fractional_rotation: {
                                    description: "L'Entité tentera de tourner pour faire face à l'endroit où le joueur se trouve chaque tick. L'Entité ciblera ce pourcentage de leur différence dans leurs angles de rotation actuels chaque tick (de 0.0 à 1.0 où 1.0 = 100%). Ceci est limité par FractionalRotationLimit. Une valeur de 0.0 fera en sorte que l'entité ne tourne plus là où le joueur se trouve.",
                                    default: 0.5,
                                    type: "number"
                                },
                                fractional_rotation_limit: {
                                    description: "Limite le nombre total de degrés que l'entité peut tourner pour faire face à l'endroit où le joueur se trouve chaque tick.",
                                    default: 5,
                                    type: "number"
                                },
                                mount_speed_multiplier: {
                                    description: "Multiplicateur de vitesse de l'entité lorsqu'elle est contrôlée par le joueur.",
                                    default: 1,
                                    type: "number"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.croak": {
                            description: "Fait en sorte qu'une entité croasse à un intervalle de temps aléatoire avec des conditions configurables.",
                            type: "object",
                            properties: {
                                duration: {
                                    description: "Plage de temps en secondes pendant laquelle l'entité croasse.",
                                    default: [4.5,4.5],
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
                                filters: {
                                    description: "Les filtres à appliquer pour sélectionner les entités à croasser.",
                                },
                                interval: {
                                    description: "Plage de temps en secondes entre les croassements de l'entité.",
                                    default: [10,20],
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
                                priority: {
                                    description: "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.defend_trusted_target": {
                            description: "Force l'Entité à réagir avec un événement lorsqu'une cible de confiance est attaquée.  Type: `Object`. Ce composant nécessite que l'entité soit dans une relation de confiance avec une autre entité pour fonctionner correctement.",
                            type: "object",
                            properties: {
                                aggro_sound: {
                                    description: "L'événement sonore à jouer lorsque l'entité se défend.",
                                    type: "string"
                                },
                                attack_interval: {
                                    description: "Temps en secondes entre les attaques de l'entité.",
                                    default: 0,
                                    type: "integer"
                                },
                                entity_types: {
                                    description: "Liste des types d'entités à attaquer.",
                                    type: "object"
                                },
                                must_see: {
                                    description: "Si vrai, l'entité doit être visible pour être sélectionnée comme cible.",
                                    default: false,
                                    type: "boolean"
                                },
                                must_see_forget_duration: {
                                    description: "Le temps en secondes que l'entité doit être hors de vue pour être oubliée comme cible.",
                                    default: 3,
                                    type: "number"
                                },
                                on_defend_start: {
                                    description: "L'événement à déclencher lorsque l'entité commence à se défendre.",
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif.",
                                    type: "integer"
                                },
                                sound_chance: {
                                    description: "Pourcentage de chance que l'entité joue un son lorsqu'elle se défend.",
                                    default: 0.05,
                                    type: "number"
                                },
                                within_radius: {
                                    description: "Distance en blocs que la cible peut être à l'intérieur pour lancer une attaque.",
                                    default: 0,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.defend_village_target": {
                            description: "Force l'Entité à rester dans un village et à défendre le village contre les agresseurs.",
                            type: "object",
                            properties: {
                                attack_chance: {
                                    description: "Pourcentage de chance que l'entité a d'attaquer les agresseurs de son village, où 1,0 = 100%.",
                                    default: 0.05,
                                    type: "number"
                                },
                                entity_types: {
                                    description: "Liste des types d'entités à attaquer.",
                                    type: "object"
                                },
                                must_reach: {
                                    description: "L'Entité doit être capable d'atteindre l'attaquant pour l'attaquer.",
                                    default: true,
                                    type: "boolean"
                                },
                                probability: {
                                    description: "La probabilité que l'entité a d'attaquer les agresseurs de son village, où 1,0 = 100%.",
                                    default: 1,
                                    type: "number",
                                    minimum: 0,
                                    maximum: 1
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.delayed_attack": {
                            description: "Force l'Entité à attaquer tout en retardant les dégâts infligés jusqu'à un moment spécifique dans l'animation d'attaque.",
                            type: "object",
                            properties: {
                                attack_duration: {
                                    description: "L'animation d'attaque de l'Entité se jouera sur cette durée (en secondes).",
                                    default: 0.75,
                                    type: "number"
                                },
                                attack_once: {
                                    description: "Permet à l'entité d'utiliser ce comportement d'attaque une seule fois.",
                                    default: false,
                                    type: "boolean"
                                },
                                attack_types: {
                                    description: "Liste des types d'entités à attaquer.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                hit_delay_pct: {
                                    description: "Pourcentage dans l'animation d'attaque pour appliquer les dégâts de l'attaque (1,0 = 100%).",
                                    default: 0.5,
                                    type: "number",
                                    minimum: 0,
                                    maximum: 1
                                },
                                inner_boundary_time_increase: {
                                    description: "Temps (en secondes) à ajouter au recalcul du chemin d'attaque lorsque la cible est au-delà de la 'path_inner_boundary'.",
                                    default: 0.25,
                                    type: "number"
                                },
                                max_dist: {
                                    description: "Pas utilisé dans le comportement.",
                                    type: "number"
                                },
                                max_path_time: {
                                    description: "Temps maximum (en secondes) pour recalculer le chemin d'attaque.",
                                    default: 0.55,
                                    type: "number"
                                },
                                melee_fov: {
                                    description: "Champ de vision (en degrés) lors de l'utilisation du composant de détection pour détecter une cible d'attaque.",
                                    default: 90,
                                    type: "number"
                                },
                                min_path_time: {
                                    description: "Temps minimum (en secondes) pour recalculer le chemin d'attaque.",
                                    default: 0.2,
                                    type: "number"
                                },
                                on_attack: {
                                    description: "L'événement à déclencher lorsque l'entité attaque.",
                                },
                                outer_boundary_time_increase: {
                                    description: "Temps (en secondes) à ajouter au recalculer lorsque la cible est au-delà de la 'path_outer_boundary'.",
                                    default: 0.5,
                                    type: "number"
                                },
                                path_fail_time_increase: {
                                    description: "Temps (en secondes) à ajouter au recalcul du chemin d'attaque lorsque cette entité ne peut pas se déplacer le long du chemin actuel.",
                                    default: 0.75,
                                    type: "number"
                                },
                                path_inner_boundary: {
                                    description: "Distance à laquelle l'entité doit être à l'intérieur pour augmenter le recalcul du chemin d'attaque par 'inner_boundary_tick_increase'.",
                                    default: 16,
                                    type: "number"
                                },
                                path_outer_boundary: {
                                    description: "Distance à laquelle l'entité doit être à l'extérieur pour augmenter le recalcul du chemin d'attaque par 'outer_boundary_tick_increase'.",
                                    default: 32,
                                    type: "number"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif.",
                                    type: "integer"
                                },
                                random_stop_interval: {
                                    description: "Cette entité aura une chance de 1 sur N d'arrêter son attaque actuelle, où N = 'random_stop_interval'.",
                                    default: 0,
                                    type: "integer"
                                },
                                reach_multiplier: {
                                    description: "Utilisé avec la taille de la base de l'entité pour déterminer la distance minimale de la cible avant de tenter de causer des dégâts d'attaque.",
                                    default: 1.5,
                                    type: "number"
                                },
                                require_complete_path: {
                                    description: "Bascule (on/off) la nécessité d'avoir un chemin complet de l'entité à la cible lors de l'utilisation de ce comportement d'attaque.",
                                    default: false,
                                    type: "boolean"
                                },
                                set_persistent: {
                                    description: "Permet à l'entité d'être définie pour persister lorsqu'elle cible un joueur.",
                                    default: false,
                                    type: "boolean"
                                },
                                speed_multiplier: {
                                    description: "Multiplicateur de vitesse de mouvement de l'entité lorsqu'elle utilise cet objectif AI.",
                                    default: 1,
                                    type: "number"
                                },
                                target_dist: {
                                    description: "Inutilisé.",
                                    type: "number"
                                },
                                track_target: {
                                    description: "Permet à l'entité de suivre la cible d'attaque, même si l'entité n'a pas de détection.",
                                    default: true,
                                    type: "boolean"
                                },
                                x_max_rotation: {
                                    description: "Rotation maximale (en degrés) sur l'axe X que cette entité peut tourner lorsqu'elle tente de regarder la cible.",
                                    default: 30,
                                    type: "number"
                                },
                                y_max_head_rotation: {
                                    description: "Rotation maximale (en degrés) sur l'axe Y que cette entité peut tourner la tête lorsqu'elle tente de regarder la cible.",
                                    default: 30,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.dig": {
                            description: "Permet à l'entité de creuser dans le sol avant de disparaître.",
                            type: "object",
                            properties: {
                                allow_dig_when_named: {
                                    description: "Si vrai, ce comportement peut être exécuté lorsque l'entité est nommée. Sinon, non.",
                                    default: false,
                                    type: "boolean"
                                },
                                digs_in_daylight: {
                                    description: "Indique que l'entité doit commencer à creuser lorsqu'elle voit la lumière du jour.",
                                    default: false,
                                    type: "boolean"
                                },
                                duration: {
                                    description: "Durée de cet objectif AI en secondes.",
                                    default: 0,
                                    type: "number"
                                },
                                idle_time: {
                                    description: "Le temps minimum en secondes entre le dernier dérangement détecté et le début du creusement.",
                                    type: "number"
                                },
                                on_start: {
                                    description: "L'événement à déclencher lorsque l'entité commence à creuser.",
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif.",
                                    type: "integer"
                                },
                                suspicion_is_disturbance: {
                                    description: "Si vrai, trouver de nouveaux emplacements suspects compte comme des perturbations qui peuvent retarder le début de cet objectif.",
                                    default: false,
                                    type: "boolean"
                                },
                                vibration_is_disturbance: {
                                    description: "Si vrai, les vibrations comptent comme des perturbations qui peuvent retarder le début de cet objectif.",
                                    default: false,
                                    type: "boolean"
                                },
                            }
                        },
                        "minecraft:behavior.door_interact": {
                            description: "Permet à l'entité d'interagir avec les portes.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.dragonchargeplayer": {
                            description: "Force l'Entité à attaquer un joueur en chargeant vers lui.  Type: `Object`. Ce composant nécessite que l'entité soit un Ender Dragon pour fonctionner correctement.",
                            type: "object",
                            properties: {
                                active_speed: {
                                    description: "La vitesse de l'entité lorsqu'elle charge vers le joueur.",
                                    default: 3,
                                    type: "number"
                                },
                                continue_charge_threshold_time: {
                                    description: "Si le dragon est en dehors de la 'target_zone' pendant plus de 'continue_charge_threshold_time' secondes, la charge est annulée.",
                                    default: 0.5,
                                    type: "number"
                                },
                                flight_speed: {
                                    description: "La vitesse de vol de l'entité lorsqu'elle ne charge pas vers le joueur.",
                                    default: 0.6,
                                    type: "number"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif.",
                                    type: "integer"
                                },
                                target_zone: {
                                    description: "Distance minimale et maximale de l'entité par rapport à la cible pour commencer à charger.",
                                    default: [10,150],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                                turn_speed: {
                                    description: "La vitesse à laquelle l'entité tourne lorsqu'elle charge vers le joueur.",
                                    default: 0.7,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.dragondeath": {
                            description: "Contrôle le comportement de l'entité lorsqu'elle meurt.  Type: `Object`. Ce composant nécessite que l'entité soit un Ender Dragon pour fonctionner correctement.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.dragonflaming": {
                            description: "Permet à l'entité d'utiliser une attaque de souffle de feu.  Type: `Object`. Ce composant nécessite que l'entité soit un Ender Dragon pour fonctionner correctement.",
                            type: "object",
                            properties: {
                                cooldown_time: {
                                    description: "Le temps en secondes avant que l'entité puisse réutiliser l'attaque de souffle de feu.",
                                    default: 10,
                                    type: "number"
                                },
                                flame_time: {
                                    description: "Le temps en secondes que le feu reste sur le sol après l'attaque.",
                                    default: 0.5,
                                    type: "number"
                                },
                                ground_flame_count: {
                                    description: "Le nombre d'attaques de souffle de feu au sol à utiliser avant le décollage.",
                                    default: 4,
                                    type: "integer"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif.",
                                    type: "integer"
                                },
                                roar_time: {
                                    description: "Le temps en secondes que l'entité doit rugir avant d'utiliser l'attaque de souffle de feu.",
                                    default: 2,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.dragonholdingpattern": {
                            description: "Force l'Entité à voler en cercle autour du podium central situé dans The End.  Type: `Object`. Ce composant nécessite que l'entité soit un Ender Dragon pour fonctionner correctement.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.dragonlanding": {
                            description: "Force l'Entité à atterrir.  Type: `Object`. Ce composant nécessite que l'entité soit un Ender Dragon pour fonctionner correctement.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.dragonscanning": {
                            description: "Force l'Entité à scanner pour les joueurs.  Type: `Object`. Ce composant nécessite que l'entité soit un Ender Dragon pour fonctionner correctement.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.dragonstrafeplayer": {
                            description: "Force l'Entité à attaquer un joueur en effectuant une attaque de strafe.  Type: `Object`. Ce composant nécessite que l'entité soit un Ender Dragon pour fonctionner correctement.",
                            type: "object",
                            properties: {
                                active_speed: {
                                    description: "La vitesse de l'entité lorsqu'elle effectue une attaque de strafe.",
                                    default: 0.6,
                                    type: "number"
                                },
                                fireball_range: {
                                    description: "Distance maximale de l'attaque de boule de feu de cette entité lorsqu'elle effectue une attaque de strafe.",
                                    default: 64,
                                    type: "number"
                                },
                                flight_speed: {
                                    description: "La vitesse de vol de l'entité lorsqu'elle ne fait pas d'attaque de strafe.",
                                    default: 0.6,
                                    type: "number"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif.",
                                    type: "integer"
                                },
                                switch_direction_probability: {
                                    description: "Pourcentage de chance de changer la direction de strafe de cette entité entre les sens horaire et antihoraire. La chance de changement de direction se produit chaque fois qu'une nouvelle cible est choisie (1,0 = 100%).",
                                    default: 0.125,
                                    type: "number",
                                    minimum: 0,
                                    maximum: 1
                                },
                                target_in_range_and_in_view_time: {
                                    description: "Temps (en secondes) que la cible doit être dans la portée de la boule de feu et en vue de cette entité avant qu'une boule de feu puisse être tirée.",
                                    default: 0.25,
                                    type: "number"
                                },
                                target_zone: {
                                    description: "Distance minimale et maximale de l'entité par rapport à la cible pour commencer à effectuer une attaque de strafe.",
                                    default: [10,150],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                                turn_speed: {
                                    description: "La vitesse à laquelle l'entité tourne lorsqu'elle effectue une attaque de strafe.",
                                    default: 0.7,
                                    type: "number"
                                },
                                view_angle: {
                                    description: "La cible doit être dans cet angle de vue de l'entité avant qu'une boule de feu puisse être tirée.",
                                    default: 10,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.dragontakeoff": {
                            description: "Force l'Entité à décoller.  Type: `Object`. Ce composant nécessite que l'entité soit un Ender Dragon pour fonctionner correctement.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.drink_milk": {
                            description: "Force l'Entité à boire du lait en fonction des conditions de l'environnement spécifiées.",
                            type: "object",
                            properties: {
                                cooldown_seconds: {
                                    description: "Le temps en secondes avant que l'Entité puisse boire du lait à nouveau.",
                                    default: 5,
                                    type: "number"
                                },
                                filters: {
                                    description: "Les filtres à appliquer pour sélectionner les entités à boire du lait.",
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.drink_potion": {
                            description: "Force l'Entité à boire une potion en fonction des conditions de l'environnement spécifiées.",
                            type: "object",
                            properties: {
                                potions: {
                                    description: "Liste des potions que cette Entité peut boire.",
                                    type: "array",
                                    items: {
                                        type: "object"
                                    }
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif.",
                                    type: "integer"
                                },
                                speed_modifier: {
                                    description: "Le modificateur de vitesse de mouvement à appliquer à l'entité pendant qu'elle boit une potion. Une valeur de 0 représente aucun changement de vitesse.",
                                    default: 0,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.drop_item_for": {
                            description: "Force l'Entité à déposer un item pour une autre entité.  Type: `Object`. Ce composant nécessite que l'entité ait un composant de navigation pour fonctionner correctement.",
                            type: "object",
                            properties: {
                                cooldown: {
                                    description: "Le temps en secondes avant que l'Entité puisse déposer un autre item.",
                                    default: 0.2,
                                    type: "number"
                                },
                                drop_item_chance: {
                                    description: "La chance (de 0,0 à 1,0) que l'Entité dépose un item lorsqu'elle est ciblée.",
                                    default: 1,
                                    type: "number",
                                    minimum: 0,
                                    maximum: 1
                                },
                                entity_types: {
                                    description: "La liste des conditions qu'une autre entité doit remplir pour être une cible valide pour laquelle déposer un objet.",
                                },
                                goal_radius: {
                                    description: "La distance en blocs à laquelle l'Entité considère qu'elle a atteint sa position cible.",
                                    default: 0.5,
                                    type: "number"
                                },
                                loot_table: {
                                    description: "La Loot Table qui contient le butin possible que l'Entité peut déposer avec cet objectif.",
                                    type: "string"
                                },
                                max_head_look_at_height: {
                                    description: "La hauteur maximale à laquelle la tête de l'entité regardera lorsqu'elle déposera l'item. L'Entité regardera toujours sa cible.",
                                    default: 10,
                                    type: "number"
                                },
                                minimum_teleport_distance: {
                                    description: "Si la position cible est plus éloignée que cette distance sur n'importe quel tick, l'Entité se téléportera à la position cible.",
                                    default: 2,
                                    type: "number"
                                },
                                offering_distance: {
                                    description: "La distance à laquelle l'Entité essaiera de déposer l'item pour la cible.",
                                    default: 1,
                                    type: "number"
                                },
                                on_drop_attempt: {
                                    description: "L'événement à déclencher lorsque l'Entité tente de déposer un item.",
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                search_count: {
                                    description: "Le nombre de blocs que l'Entité vérifiera chaque tick dans sa plage de recherche et de hauteur pour un bloc valide vers lequel se déplacer. Une valeur de 0 fera que l'entité vérifie chaque bloc dans la plage en un tick.",
                                    default: 0,
                                    type: "integer"
                                },
                                search_height: {
                                    description: "La hauteur en blocs que l'Entité vérifiera pour un bloc valide vers lequel se déplacer.",
                                    default: 1,
                                    type: "integer"
                                },
                                search_range: {
                                    description: "La distance en blocs que l'Entité vérifiera pour un bloc valide vers lequel se déplacer.",
                                    default: 0,
                                    type: "integer"
                                },
                                seconds_before_pickup: {
                                    description: "Le nombre de secondes qui s'écouleront avant que l'Entité déposée puisse être ramassée du sol.",
                                    default: 0,
                                    type: "number"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'Entité lorsqu'elle utilise cet objectif AI.",
                                    default: 1,
                                    type: "number"
                                },
                                target_range: {
                                    description: "La distance en blocs à laquelle l'Entité considère qu'elle a atteint sa cible.",
                                    default: [1,1,1],
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: {
                                        type: "number"
                                    }
                                },
                                teleport_offset: {
                                    description: "Lorsque l'entité se téléporte, décalez la position de téléportation de ce nombre de blocs dans les coordonnées X, Y et Z.",
                                    default: [0,1,0],
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: {
                                        type: "number"
                                    }
                                },
                                time_of_day_range: {
                                    description: "Les heures de la journée pendant lesquelles cet objectif peut être utilisé. Pour référence : midi est 0.0, le coucher du soleil est 0.25, minuit est 0.5, et le lever du soleil est 0.75, et retour à midi pour 1.0.",
                                    default: [0,1],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                            }
                        },
                        "minecraft:behavior.eat_block": {
                            description: "Force l'Entité à manger un bloc.",
                            type: "object",
                            properties: {
                                eat_and_replace_block_pairs: {
                                    description: "Une collection de paires de blocs; le premier ('eat_block') est le bloc que l'entité devrait manger, le second ('replace_block') est le bloc qui devrait remplacer le bloc mangé.",
                                    type: "array",
                                    items: {
                                        type: "object"
                                    }
                                },
                                on_eat: {
                                    description: "L'événement à déclencher lorsque l'Entité mange un bloc.",
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                success_chance: {
                                    description: "Une expression molang définissant la chance de succès de l'entité à consommer un bloc.",
                                    default: 0.02,
                                },
                                time_until_eat: {
                                    description: "Le temps (en secondes) qu'il faut à l'entité pour manger un bloc avec succès.",
                                    default: 1.8,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.eat_carried_item": {
                            description: "Force l'Entité à manger un item qu'elle transporte dans son inventaire.  Type: `Object`. Il faut que les items soient dans l'inventaire de l'entité pour qu'elle puisse les manger.",
                            type: "object",
                            properties: {
                                delay_before_eating: {
                                    description: "Le temps en secondes avant que l'Entité puisse manger un item.",
                                    type: "number"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.eat_mob": {
                            description: "Force l'Entité à manger une entité.",
                            type: "object",
                            properties: {
                                eat_animation_time: {
                                    description: "Le temps en secondes que l'animation de manger doit durer.",
                                    default: 1,
                                    type: "number"
                                },
                                eat_mob_sound: {
                                    description: "Définit le son qui doit être joué lorsqu'une entité est mangée.",
                                    type: "string"
                                },
                                loot_table: {
                                    description: "La Loot Table qui contient le butin possible que l'Entité peut laisser tomber lorsqu'elle mange une entité.",
                                    type: "string"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                pull_in_force: {
                                    description: "Définit la force avec laquelle l'entité à manger est attirée vers l'entité mangeante.",
                                    default: 1,
                                    type: "number"
                                },
                                reach_mob_distance: {
                                    description: "Définit la distance à laquelle l'entité doit être avant de manger une autre entité.",
                                    default: 1,
                                    type: "number"
                                },
                                run_speed: {
                                    description: "Définit la vitesse à laquelle l'entité doit courir lorsqu'elle mange une autre entité.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.emerge": {
                            description: "Active le drapeau d'entité 'EMERGING' pendant la durée spécifiée et déclenche 'on_done' à la fin.",
                            type: "object",
                            properties: {
                                cooldown_time: {
                                    description: "Le temps en secondes avant que l'entité puisse émerger à nouveau.",
                                    default: 0.5,
                                    type: "number"
                                },
                                duration: {
                                    description: "La durée en secondes pendant laquelle l'entité est en train d'émerger.",
                                    default: 5,
                                    type: "number"
                                },
                                on_done: {
                                    description: "L'événement à déclencher lorsque l'entité a fini d'émerger.",
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.enderman_leave_block": {
                            description: "Permet à l'entité à laisser tomber le bloc qu'elle tient actuellement.  Type: `Object`. Ce comportement ne peut être utilisé que par le type d'entité enderman.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.enderman_take_block": {
                            description: "Permet à l'entité de prendre un bloc et de le transporter.  Type: `Object`. Ce comportement ne peut être utilisé que par le type d'entité enderman.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.equip_item": {
                            description: "Force l'Entité à équiper un item.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.explore_outskirts": {
                            description: "Force l'Entité à explorer les points aléatoires à la périphérie du village.  Type: `Object`. Ce composant nécessite que l'entité ait un composant de navigation et 'minecraft:dweller' pour fonctionner correctement.",
                            type: "object",
                            properties: {
                                dist_from_boundary: {
                                    description: "La distance à partir de la limite à laquelle l'Entité doit se trouver pour explorer les environs.",
                                    default: [5,0,5],
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: {
                                        type: "number"
                                    }
                                },
                                explore_dist: {
                                    description: "La distance totale en blocs que l'Entité explorera au-delà des limites du village lorsqu'elle choisit son point de déplacement.",
                                    default: 5,
                                    type: "number"
                                },
                                max_travel_time: {
                                    description: "C'est le temps maximum qu'une Entité essaiera d'atteindre son point de déplacement à la périphérie du village avant que l'objectif ne soit annulé.",
                                    default: 60,
                                    type: "number"
                                },
                                max_wait_time: {
                                    description: "Le temps en secondes entre le choix de nouveaux points d'exploration sera choisi sur un intervalle aléatoire entre cette valeur et le temps d'attente minimum.",
                                    default: 0,
                                    type: "number"
                                },
                                min_dist_from_target: {
                                    description: "L'Entité doit être à cette distance de son point de déplacement pour considérer qu'elle a atteint sa destination.",
                                    default: 2.2,
                                    type: "number"
                                },
                                min_perimeter: {
                                    description: "Le périmètre minimum du village requis pour exécuter cet objectif.",
                                    default: 1,
                                    type: "number"
                                },
                                min_wait_time: {
                                    description: "Le temps en secondes entre le choix de nouveaux points d'exploration sera choisi sur un intervalle aléatoire entre ce temps et le temps d'attente maximum.",
                                    default: 3,
                                    type: "number"
                                },
                                next_xz: {
                                    description: "Un nouveau point d'exploration sera choisi dans cette distance XZ de la position cible actuelle lorsque la navigation est terminée et que le minuteur d'attente a expiré.",
                                    default: 5,
                                    type: "integer"
                                },
                                next_y: {
                                    description: "Un nouveau point d'exploration sera choisi dans cette distance Y de la position cible actuelle lorsque la navigation est terminée et que le minuteur d'attente a expiré.",
                                    default: 3,
                                    type: "integer"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'Entité lorsqu'elle explore les environs.",
                                    default: 1,
                                    type: "number"
                                },
                                timer_ratio: {
                                    description: "Chaque nouveau point d'exploration sera choisi sur un intervalle aléatoire entre le temps d'attente minimum et maximum, divisé par cette valeur. Cela ne s'applique pas au premier point d'exploration choisi lorsque l'objectif est exécuté.",
                                    default: 2,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.fertilize_farm_block": {
                            description: "Permet à l'Entité de chercher une zone pour fertiliser les cultures.  Type: `Object`. Ce composant ne s'exécutera pas si l'entité n'a pas d'objet fertilisant dans son inventaire.",
                            type: "object",
                            properties: {
                                goal_radius: {
                                    description: "Distance en blocs à laquelle l'Entité considère qu'elle a atteint sa position cible.",
                                    default: 1.5,
                                    type: "number"
                                },
                                max_fertilizer_usage: {
                                    description: "Le nombre maximum de fois que l'Entité utilisera de l'engrais sur le bloc cible.",
                                    default: 1,
                                    type: "integer"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                search_cooldown_max_seconds: {
                                    description: "Le temps maximum en secondes avant que l'Entité ne recherche un nouveau bloc à fertiliser. Le temps est choisi entre 0 et cette valeur.",
                                    default: 8,
                                    type: "number"
                                },
                                search_count: {
                                    description: "Le nombre de blocs choisis aléatoirement à chaque tick que l'Entité vérifiera dans une zone de recherche pour un bloc à fertiliser.",
                                    default: 9,
                                    type: "integer"
                                },
                                search_height: {
                                    description: "La hauteur en blocs que l'Entité vérifiera pour un bloc à fertiliser.",
                                    default: 1,
                                    type: "integer"
                                },
                                search_range: {
                                    description: "La distance en blocs que l'Entité vérifiera pour un bloc à fertiliser.",
                                    default: 1,
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'Entité lorsqu'elle fertilise les cultures.",
                                    default: 0.5,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.find_cover": {
                            description: "Permet à l'Entité de chercher de l'ombre.",
                            type: "object",
                            properties: {
                                cooldown_time: {
                                    description: "Le temps en secondes avant que l'Entité puisse rechercher un nouvel abri.",
                                    default: 0,
                                    type: "number"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'Entité lorsqu'elle cherche un abri.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.find_mount": {
                            description: "Permet à l'Entité de chercher une autre entité à monter.",
                            type: "object",
                            properties: {
                                avoid_water: {
                                    description: "Si vrai, l'Entité n'ira pas dans les blocs d'eau lorsqu'elle se dirige vers une monture.",
                                    default: false,
                                    type: "boolean"
                                },
                                mount_distance: {
                                    description: "La diqstance que le mob doit être en blocs. Si la valeur est inférieure à 0, le mob utilisera sa distance d'attaque par défaut.",
                                    default: -1,
                                    type: "number"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                start_delay: {
                                    description: "Le temps en secondes que le mob attendra avant de commencer à se diriger vers la monture.",
                                    default: 0,
                                    type: "number"
                                },
                                target_needed: {
                                    description: "Si vrai, le mob ne cherchera une monture que s'il a une cible.",
                                    default: false,
                                    type: "boolean"
                                },
                                within_radius: {
                                    description: "La distance en blocs dans laquelle le mob cherchera une monture.",
                                    default: 0,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.find_underwater_treasure": {
                            description: "Permet à l'Entité de localiser et de se diriger vers le point d'intérêt le plus proche étiqueté comme ruine ou épave.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                search_range: {
                                    description: "La distance maximale à laquelle l'Entité cherchera un trésor dans une ruine ou une épave pour se déplacer.",
                                    default: 0,
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'Entité lorsqu'elle cherche un trésor sous-marin.",
                                    default: 1,
                                    type: "number"
                                },
                                stop_distance: {
                                    description: "La distance à laquelle l'Entité considère qu'elle a atteint son point d'intérêt.",
                                    default: 2,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.fire_at_target": {
                            description: "Permet à l'Entité d'attaquer en tirant un coup avec un delai.  Type: `Object`. Le point d'ancrage et le décalage de ce composant remplacent le point d'ancrage et le décalage du composant de projectile.",
                            type: "object",
                            properties: {
                                attack_cooldown: {
                                    description: "Le temps en secondes avant que l'Entité puisse attaquer à nouveau.",
                                    default: 0.5,
                                    type: "number"
                                },
                                attack_range: {
                                    description: "La distance maximale à laquelle l'Entité peut attaquer sa cible.",
                                    default: [2,16],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                                filters: {
                                    description: "Les filtres à appliquer pour sélectionner les entités à attaquer.",
                                },
                                max_head_rotation_x: {
                                    description: "La rotation maximale de la tête (en degrés) sur l'axe X que cette Entité peut appliquer tout en essayant de regarder la cible.",
                                    default: 30,
                                    type: "number"
                                },
                                max_head_rotation_y: {
                                    description: "La rotation maximale de la tête (en degrés) sur l'axe Y que cette Entité peut appliquer tout en essayant de regarder la cible.",
                                    default: 30,
                                    type: "number"
                                },
                                owner_anchor: {
                                    description: "Point d'ancrage pour l'emplacement d'apparition du projectile.",
                                    default: 2,
                                    type: "integer"
                                },
                                owner_offset: {
                                    description: "Décalage pour l'emplacement d'apparition du projectile.",
                                    default: [0,0,0],
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: {
                                        type: "number"
                                    }
                                },
                                post_shoot_delay: {
                                    description: "Le temps en secondes entre le tir du projectile et la fin de l'objectif.",
                                    default: 0.2,
                                    type: "number"
                                },
                                pre_shoot_delay: {
                                    description: "Le temps en secondes avant de tirer le projectile.",
                                    default: 0.75,
                                    type: "number"
                                },
                                projectile_def: {
                                    description: "Définition de l'entité à utiliser comme projectile pour l'attaque. L'entité doit être un projectile. Ce champ est requis pour que l'objectif soit utilisable.",
                                    type: "string"
                                },
                                ranged_fov: {
                                    description: "Champ de vision (en degrés) lors de l'utilisation de la détection pour attaquer une cible.",
                                    default: 90,
                                    type: "number"
                                },
                                target_anchor: {
                                    description: "Point d'ancrage pour la cible de l'attaque.",
                                    default: 2,
                                    type: "integer"
                                },
                                target_offset: {
                                    description: "Décalage pour la cible de l'attaque.",
                                    default: [0,0,0],
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: {
                                        type: "number"
                                    }
                                },
                            }
                        },
                        "minecraft:behavior.flee_sun": {
                            description: "Force l'Entité à éviter le soleil.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'Entité lorsqu'elle fuit le soleil.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.float": {
                            description: "Permet à l'Entité de flotter sur l'eau. Les passagers seront éjectés si la tête de l'entité est sous l'eau.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                sink_with_passengers: {
                                    description: "Si vrai, l'entité continuera à couler tant qu'elle a des passagers.",
                                    default: false,
                                    type: "boolean"
                                },
                            }
                        },
                        "minecraft:behavior.float_tempt": {
                            description: "Force une Entité à être tentée par un item défini. Ce composant est fait pour les entités qui se déplacent en flottant.",
                            type: "object",
                            properties: {
                                can_get_scared: {
                                    description: "Si vrai, le mob peut cesser d'être tenté si le joueur se déplace trop vite tout en étant proche de ce mob.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_tempt_vertically: {
                                    description: "Si vrai, la distance verticale par rapport au joueur sera prise en compte lors de la tentation.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_tempt_while_ridden: {
                                    description: "Si vrai, le mob peut être tenté même s'il a un passager.",
                                    default: false,
                                    type: "boolean"
                                },
                                items: {
                                    description: "Liste des items qui peuvent tenter cette entité.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                on_start: {
                                    description: "Événement à déclencher lorsque ce comportement démarre.",
                                },
                                on_end: {
                                    description: "Événement à déclencher lorsque ce comportement se termine.",
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                sound_interval: {
                                    description: "Plage de ticks aléatoires à attendre entre les sons de tentation.",
                                    default: [0,0],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle est tentée.",
                                    default: 1,
                                    type: "number"
                                },
                                stop_distance: {
                                    description: "La distance à laquelle l’Entité arrêtera de suivre le joueur.",
                                    default: 1.5,
                                    type: "number"
                                },
                                tempt_sound: {
                                    description: "Le son à jouer pendant que le mob est tenté.",
                                    type: "string"
                                },
                                within_radius: {
                                    description: "La distance en blocs à laquelle le joueur doit être pour tenter cette entité.",
                                    default: 0,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.float_wander": {
                            description: "Permet à l'Entité de flotter et de dériver aléatoirement comme un Ghast.",
                            type: "object",
                            properties: {
                                additional_collision_buffer: {
                                    description: "Si 'true', l'Entité vérifie qu'il n'y a aucun bloc dans une zone élargie autour de la position cible. Cela aide à éviter que l’Entité se coince ou touche des blocs lorsqu'elle erre aléatoirement.",
                                    default: false,
                                    type: "boolean"
                                },
                                allow_navigating_through_liquids: {
                                    description: "Si `true`, permet à l'Entité de naviguer à travers les blocs liquides sur son chemin vers la position cible.",
                                    default: false,
                                    type: "boolean"
                                },
                                float_duration: {
                                    description: "Temps en secondes que l'Entité flottera avant de choisir une nouvelle direction.",
                                    default: [0,0],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                                float_wander_has_move_control: {
                                    description: "Si 'true', le drapeau MoveControl sera ajouté au comportement, ce qui signifie qu'il ne peut plus être actif en même temps que d'autres comportements avec MoveControl.",
                                    default: true,
                                    type: "boolean"
                                },
                                must_reach: {
                                    description: "Si vrai, le point doit être atteignable pour être une cible valide.",
                                    default: false,
                                    type: "boolean"
                                },
                                navigate_around_surface: {
                                    description: "Active un nouvel algorithme pour choisir une position aléatoire vers laquelle aller. L'Entité cherchera une position proche de blocs solides. Si aucun bloc n'est trouvé, elle cherchera vers le niveau de surface du monde de la dimension courante.",
                                    default: false,
                                    type: "boolean"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                random_reselect: {
                                    description: "Si vrai, l'entité choisira un nouveau point aléatoire tout en se déplaçant vers le point précédemment sélectionné.",
                                    default: false,
                                    type: "boolean"
                                },
                                surface_xz_dist: {
                                    description: "Distance horizontale (X et Z) à laquelle chercher une surface solide.  Type: `Integer`. Ne fonctionne que si `navigate_around_surface` est activé.",
                                    default: 0,
                                    type: "integer"
                                },
                                surface_y_dist: {
                                    description: "Distance verticale (Y) à laquelle chercher une surface solide.  Type: `Integer`. Ne fonctionne que si `navigate_around_surface` est activé.",
                                    default: 0,
                                    type: "integer"
                                },
                                use_home_position_restriction: {
                                    description: "Si vrai, l'entité ne choisira que des points à proximité de sa position d'origine.",
                                    default: false,
                                    type: "boolean"
                                },
                                xz_dist: {
                                    description: "La distance en blocs sur le sol que l'Entité regerdera pour un nouveau point de déplacement.",
                                    default: 10,
                                    type: "integer",
                                    minimum: 1
                                },
                                y_dist: {
                                    description: "La distance en blocs que l'Entité regerdera pour un nouveau point de déplacement.",
                                    default: 7,
                                    type: "integer",
                                    minimum: 1
                                },
                                y_offset: {
                                    description: "La hauteur en blocs à ajouter à la position cible.",
                                    default: 0,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.follow_caravan": {
                            description: "Force l'Entité à suivre une caravane comme un lama.",
                            type: "object",
                            properties: {
                                entity_count: {
                                    description: "Le nombre d'entités qui peuvent être dans la caravane.",
                                    default: 1,
                                    type: "integer"
                                },
                                entity_types: {
                                    description: "Liste des types d'entités que cette Entité peut suivre dans une caravane.",
                                    type: "object"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'Entité lorsqu'elle suit une caravane.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.follow_mob": {
                            description: "Force une Entité à suivre et à se rassembler autour d'autres mob du même type.",
                            type: "object",
                            properties: {
                                filters: {
                                    description: "Permet de filtrer précisément quels types d’entités peuvent être suivis. Si vide, les critères par défaut sont appliqués : exclut joueurs, poissons, calamars, têtards, dauphins, et les entités du même type que l’Entité.",
                                },
                                preferred_actor_type: {
                                    description: "Permet de préciser le type d’entité que l’Entité préfère suivre. Si ce champ n’est pas défini, un mob aléatoire à proximité (parmi les valides) sera choisi.",
                                    type: "string"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                search_range: {
                                    description: "La distance en blocs à laquelle l'Entité cherchera un mob à suivre.",
                                    default: 0,
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'Entité lorsqu'elle suit un autre mob.",
                                    default: 1,
                                    type: "number"
                                },
                                stop_distance: {
                                    description: "La distance en blocs à laquelle cette Entité s'arrêtera de suivre un autre mob.",
                                    default: 2,
                                    type: "number"
                                },
                                use_home_position_restriction: {
                                    description: "Si true, l'Entité respecte le rayon de restriction défini dans le composant minecraft:home. Si false, l'Entité peut suivre une cible sans tenir compte des limites du composant `minecraft:home`.",
                                    default: true,
                                    type: "boolean"
                                },
                            }
                        },
                        "minecraft:behavior.follow_owner": {
                            description: "Force l'Entité à suivre un joueur marqué comme son propriétaire.",
                            type: "object",
                            properties: {
                                can_teleport: {
                                    description: "Définit si l'entité peut se téléporter à son propriétaire lorsqu'elle est trop éloignée.",
                                    default: true,
                                    type: "boolean"
                                },
                                ignore_vibration: {
                                    description: "Définit si l'entité doit ignorer le fait de suivre son propriétaire après avoir détecté une vibration récente.",
                                    default: true,
                                    type: "boolean"
                                },
                                max_distance: {
                                    description: "La distance maximale en blocs à laquelle cette Entité suivra son propriétaire.",
                                    default: 60,
                                    type: "number"
                                },
                                post_teleport_distance: {
                                    description: "Définit à quelle distance (en blocs) l'entité sera de son propriétaire après s'être téléportée. Si non spécifié, cela revient à 'stop_distance' + 1, permettant à l'entité de reprendre la navigation sans heurts.",
                                    type: "number"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'Entité lorsqu'elle suit son propriétaire.",
                                    default: 1,
                                    type: "number"
                                },
                                start_distance: {
                                    description: "La distance minimale en blocs à laquelle cette Entité suivra son propriétaire.",
                                    default: 10,
                                    type: "number"
                                },
                                stop_distance: {
                                    description: "La distance en blocs à laquelle cette Entité s'arrêtera de suivre son propriétaire.",
                                    default: 2,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.follow_parent": {
                            description: "Force une Entité à suivre son parent.  Type: `Object`. Ce composant nécessitr que l'Entité ait le composant 'minecraft:is_baby' pour fonctionner correctement.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'Entité lorsqu'elle suit son parent.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.follow_target_captain": {
                            description: "Force l'Entité à suivre son capitaine.  Type: `Object`. L'Entité qui est définit comme capitaine doit avoir le composant 'minecraft:is_illager_captain'.",
                            type: "object",
                            properties: {
                                follow_distance: {
                                    description: "Définit la distance en blocs à laquelle l'Entité restera de sa cible tout en la suivant.",
                                    default: 0,
                                    type: "number"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                within_radius: {
                                    description: "Définit la distance en blocs à laquelle l'Entité doit être de sa cible pour considérer qu'elle l'a atteinte.",
                                    default: 0,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.go_and_give_items_to_noteblock": {
                            description: "Force l'Entité à tenter de donner des items à un noteblock récemment joué à proximité.",
                            type: "object",
                            properties: {
                                listen_time: {
                                    description: "Le temps en secondes que l'Entité doit continuer à donner des items à un noteblock après l'avoir entendu.",
                                    default: 0,
                                    type: "integer"
                                },
                                on_item_throw: {
                                    description: "Les événements à déclencher lorsque l'Entité jette un item.",
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                reach_block_distance: {
                                    description: "Définit la distance à laquelle l'Entité doit être pour donner des items à un noteblock.",
                                    default: 3,
                                    type: "number"
                                },
                                run_speed: {
                                    description: "Définit la vitesse à laquelle l'Entité doit courir lorsqu'elle donne des items à un noteblock.",
                                    default: 1,
                                    type: "number"
                                },
                                throw_force: {
                                    description: "Définit la force avec laquelle l'Entité doit jeter des items à un noteblock.",
                                    default: 0.2,
                                    type: "number"
                                },
                                throw_sound: {
                                    description: "Définit le son à jouer lorsque l'Entité jette un item.",
                                    type: "string"
                                },
                                vertical_throw_mul: {
                                    description: "Définit le multiplicateur de lancer vertical qui est appliqué en plus de la force de lancer dans la direction verticale.",
                                    default: 1.5,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.go_and_give_items_to_owner": {
                            description: "Force l'Entité à tenter de donner des items à son propriétaire.",
                            type: "object",
                            properties: {
                                on_item_throw: {
                                    description: "Les événements à déclencher lorsque l'Entité jette un item.",
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                reach_mob_distance: {
                                    description: "Définit la distance à laquelle l'Entité doit être pour donner des items à son propriétaire.",
                                    default: 3,
                                    type: "number"
                                },
                                run_speed: {
                                    description: "Définit la vitesse à laquelle l'Entité doit courir lorsqu'elle donne des items à son propriétaire.",
                                    default: 1,
                                    type: "number"
                                },
                                throw_force: {
                                    description: "Définit la force avec laquelle l'Entité doit jeter des items à son propriétaire.",
                                    default: 0.2,
                                    type: "number"
                                },
                                throw_sound: {
                                    description: "Définit le son à jouer lorsque l'Entité jette un item.",
                                    default: "item_thrown",
                                    type: "string"
                                },
                                vertical_throw_mul: {
                                    description: "Définit le multiplicateur de lancer vertical qui est appliqué en plus de la force de lancer dans la direction verticale.",
                                    default: 1.5,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.go_home": {
                            description: "Force l'Entité à retourner à son point d'apparition.",
                            type: "object",
                            properties: {
                                calculate_new_path_radius: {
                                    description: "La distance en blocs à laquelle l'Entité doit être de son point d'apparition pour calculer un nouveau chemin.",
                                    default: 2,
                                    type: "number"
                                },
                                goal_radius: {
                                    description: "La distance en blocs à laquelle l'Entité considère qu'il a atteint le point d'apparition.",
                                    default: 0.5,
                                    type: "number"
                                },
                                interval: {
                                    description: "Une valeur aléatoire pour déterminer quand se déplacer aléatoirement quelque part. Cela a une chance de 1/interval de choisir cet objectif.",
                                    default: 120,
                                    type: "integer"
                                },
                                on_failed: {
                                    description: "Les événements à déclencher lorsque l'Entité échoue à atteindre son point d'apparition.",
                                },
                                on_home: {
                                    description: "Les événements à déclencher lorsque l'Entité atteint son point d'apparition.",
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'Entité lorsqu'elle retourne à son point d'apparition.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.guardian_attack": {
                            description: "Permet à l'Entité d'utiliser une attaque de rayon laser.  Type: `Object`. Ce composant ne s'exécutera pas si l'entité n'est pas un Gardien ou un Gardien Ancien.",
                            type: "object",
                            properties: {
                                elder_extra_magic_damage: {
                                    description: "Montant de dégâts supplémentaires infligés par l'attaque magique d'un Gardien Ancien.",
                                    default: 2,
                                    type: "integer"
                                },
                                hard_mode_extra_magic_damage: {
                                    description: "Montant de dégâts supplémentaires infligés par l'attaque magique d'un Gardien en mode difficile.",
                                    default: 2,
                                    type: "integer"
                                },
                                magic_damage: {
                                    description: "Montant de dégâts infligés par l'attaque magique d'un Gardien.",
                                    default: 1,
                                    type: "integer"
                                },
                                min_distance: {
                                    description: "La distance en blocs à laquelle l'attaque du Gardien s'arrête si la cible est plus proche.",
                                    default: 3,
                                    type: "number"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                sound_delay_time: {
                                    description: "Le temps en secondes à attendre après le début d'une attaque avant de jouer le son de l'attaque.",
                                    default: 0.5,
                                    type: "number"
                                },
                                x_max_rotation: {
                                    description: "Rotation maximale (en degrés), sur l'axe X, que cette Entité peut appliquer tout en essayant de regarder la cible.",
                                    default: 90,
                                    type: "number"
                                },
                                y_max_head_rotation: {
                                    description: "Rotation maximale (en degrés), sur l'axe Y, que cette Entité peut appliquer tout en essayant de regarder la cible.",
                                    default: 90,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.harvest_farm_block": {
                            description: "Force l'Entité à chercher dans une zone des blocs de farmland avec de l'air au dessus. Si trouvé, l'Entité remplacera le bloc d'air en plantant un item de graine de son inventaire sur le bloc de farmland.  Type: `Object`. Cet objectif nécessite les composants 'minecraft:inventory' et 'minecraft:navigation' pour fonctionner. Cet objectif ne s'exécutera pas si l'entité n'a pas d'item dans son inventaire.",
                            type: "object",
                            properties: {
                                goal_radius: {
                                    description: "La distance en blocs à laquelle l'Entité considère qu'elle a atteint son objectif.",
                                    default: 1.5,
                                    type: "number"
                                },
                                max_seconds_before_search: {
                                    description: "Le temps maximum en secondes que l'objectif peut prendre avant de chercher le premier bloc de récolte. Le temps est choisi entre 0 et ce nombre.",
                                    default: 1,
                                    type: "number"
                                },
                                search_cooldown_max_seconds: {
                                    description: "Le temps maximum en secondes que l'objectif peut prendre avant de chercher à nouveau un bloc de récolte, après avoir échoué à en trouver un. Le temps est choisi entre 0 et ce nombre.",
                                    default: 8,
                                    type: "number"
                                },
                                search_count: {
                                    description: "Le nombre de blocs choisis aléatoirement à chaque tick que l'Entité vérifiera pour un bloc de récolte.",
                                    default: 0,
                                    type: "integer"
                                },
                                search_height: {
                                    description: "La hauteur en blocs que l'Entité vérifiera pour un bloc de récolte.",
                                    default: 1,
                                    type: "integer"
                                },
                                search_range: {
                                    description: "La distance en blocs que l'Entité vérifiera pour un bloc de récolte.",
                                    default: 16,
                                    type: "integer"
                                },
                                seconds_until_new_task: {
                                    description: "Le temps en secondes que l'Entité attendra avant de chercher un nouveau bloc de récolte après avoir réussi à en trouver un.",
                                    default: 0.5,
                                    type: "number"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'Entité lorsqu'elle cherche un bloc de récolte.",
                                    default: 0.5,
                                    type: "number"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.hide": {
                            description: "Force une Entité avec le composant 'minecraft:hide' à tenter de se déplacer vers un point d'intérêt (POI) et à se cacher.  Type: `Object`. Ce composant nécessite un point d'intérêt pour fonctionner correctement.",
                            type: "object",
                            properties: {
                                duration: {
                                    description: "Le temps en secondes que l'Entité réagit.",
                                    default: 1,
                                    type: "number"
                                },
                                poi_type: {
                                    description: "Définit le type de POI à cacher.",
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'Entité lorsqu'elle se cache.",
                                    default: 1,
                                    type: "number"
                                },
                                timeout_cooldown: {
                                    description: "Le temps en secondes avant que l'Entité puisse réutiliser cet objectif après un échec ou un délai.",
                                    default: 8,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.hold_ground": {
                            description: "Force l'Entité à rester à sa position actuelle et à attaquer les entités qui s'approchent.  Type: `Object`. Cet objectif nécessite une cible pour fonctionner correctement.",
                            type: "object",
                            properties: {
                                broadcast: {
                                    description: "Définit si l'Entité doit diffuser sa cible à d'autres Entités de même type.",
                                    default: false,
                                    type: "boolean"
                                },
                                broadcast_range: {
                                    description: "La distance en blocs pour laquelle l'Entité diffusera sa cible.",
                                    default: 0,
                                    type: "number"
                                },
                                min_radius: {
                                    description: "La distance minimale en blocs à laquelle l'Entité doit rester de sa cible.",
                                    default: 10,
                                    type: "number"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                within_radius_event: {
                                    description: "Les événements à déclencher lorsque l'Entité est à portée de sa cible.",
                                },
                            }
                        },
                        "minecraft:behavior.hurt_by_target": {
                            description: "Force l'Entité à cibler une autre Entité qui l'a blessée.",
                            type: "object",
                            properties: {
                                alert_same_type: {
                                    description: "Si vrai, les Entités de même type à proximité seront alertées des dégâts.",
                                    default: false,
                                    type: "boolean"
                                },
                                entity_types: {
                                    description: "Liste des types d'entités que cette Entité peut cibler lorsqu'elle est blessée.",
                                    type: "object"
                                },
                                hurt_owner: {
                                    description: "Si vrai, l'Entité ciblera le propriétaire et les autres Entités du même type que le propriétaire.",
                                    default: false,
                                    type: "boolean"
                                },
                            }
                        },
                        "minecraft:behavior.inspect_bookshelf": {
                            description: "Permet à l'Entité de regarder et inspecter une bibliothèque.",
                            type: "object",
                            properties: {
                                goal_radius: {
                                    description: "La distance en blocs à laquelle l'Entité considère qu'elle a atteint son objectif.",
                                    default: 0.5,
                                    type: "number"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                search_count: {
                                    description: "Le nombre de bibliothèques à inspecter à chaque tick.",
                                    default: 10,
                                    type: "integer"
                                },
                                search_height: {
                                    description: "La hauteur en blocs que l'Entité inspectera pour une bibliothèque.",
                                    default: 1,
                                    type: "integer"
                                },
                                search_range: {
                                    description: "La distance en blocs que l'Entité inspectera pour une bibliothèque.",
                                    default: 0,
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'Entité lorsqu'elle inspecte une bibliothèque.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.investigate_suspicious_location": {
                            description: "Force l'Entité à se déplacer vers une position 'suspecte' basée sur les données recueillies dans 'minecraft:suspect_tracking'.",
                            type: "object",
                            properties: {
                                goal_radius: {
                                    description: "La distance en blocs à laquelle l'Entité considère qu'elle a atteint son objectif.",
                                    default: 1.5,
                                    type: "number"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'Entité lorsqu'elle se déplace vers une position suspecte.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.jump_around_target": {
                            description: "Permet à l'Entité de sauter autour de sa cible.",
                            type: "object",
                            properties: {
                                check_collision: {
                                    description: "Active les vérifications de collision lors du calcul du saut.",
                                    default: false,
                                    type: "boolean"
                                },
                                entity_bounding_box_scale: {
                                    description: "Mise à l'échelle temporaire appliquée aux limites AABB de l'entité lors du saut. Une plus petite boîte de collision réduit le risque de collisions pendant le saut. Lorsque check_collision est vrai, cela augmente également la chance de pouvoir sauter lorsqu'on est proche des obstacles.",
                                    default: 0.7,
                                    type: "number"
                                },
                                filters: {
                                    description: "Les filtres à appliquer pour sélectionner les entités à sauter autour.",
                                },
                                jump_angles: {
                                    description: "Les angles de saut en degrés flottants autorisés lors de l'exécution du saut. L'ordre dans lequel les angles sont choisis est aléatoire.",
                                    default: [40,55,60,75,80],
                                    type: "array",
                                    items: {
                                        type: "number"
                                    }
                                },
                                jump_cooldown_duration: {
                                    description: "Le temps en secondes à attendre avant de pouvoir sauter à nouveau.",
                                    default: 0.5,
                                    type: "number"
                                },
                                jump_cooldown_when_hurt_duration: {
                                    description: "Le temps en secondes à attendre avant de pouvoir sauter à nouveau après avoir été blessé.",
                                    default: 0.1,
                                    type: "number"
                                },
                                landing_distance_from_target: {
                                    description: "La plage déterminant à quelle distance de la cible la position d'atterrissage peut être lors du saut.",
                                    default: [4,8],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                                landing_position_spread_degrees: {
                                    description: "Cet angle (en degrés) est utilisé pour contrôler la dispersion lors du choix d'une position d'atterrissage derrière la cible. Un angle de dispersion nul signifie que la position d'atterrissage sera droite derrière la cible sans variance. Un angle de dispersion de 90 degrés signifie que la position d'atterrissage peut être jusqu'à 45 degrés à gauche et à droite de la position droite derrière la direction de vue de la cible.",
                                    default: 90,
                                    type: "integer"
                                },
                                last_hurt_duration: {
                                    description: "Le temps en secondes pendant lequel l'entité se souvient de la dernière fois qu'elle a été blessée. Si l'entité a été blessée dans ce délai, le jump_cooldown_when_hurt_duration sera utilisé au lieu de jump_cooldown_duration.",
                                    default: 2,
                                    type: "number"
                                },
                                line_of_sight_obstruction_height_ignore: {
                                    description: "Si la ligne de vue de l'entité vers sa cible est obstruée par un obstacle dont la hauteur est inférieure à ce nombre, l'obstacle sera ignoré, et l'objectif tentera de trouver une position d'atterrissage valide.",
                                    default: 4,
                                    type: "integer"
                                },
                                max_jump_velocity: {
                                    description: "La vitesse maximale à laquelle un saut peut être effectué.",
                                    default: 1.4,
                                    type: "number"
                                },
                                prepare_jump_duration: {
                                    description: "Le temps en secondes à passer à préparer le saut.",
                                    default: 0.5,
                                    type: "number"
                                },
                                required_vertical_space: {
                                    description: "L'espace vertical minimum requis pour que l'entité puisse sauter.",
                                    default: 4,
                                    type: "integer"
                                },
                                snap_to_surface_block_range: {
                                    description: "Le nombre de blocs au-dessus et en dessous de la position cible de saut qui seront vérifiés pour trouver une surface sur laquelle atterrir.",
                                    default: 10,
                                    type: "integer"
                                },
                                valid_distance_to_target: {
                                    description: "La distance minimale et maximale à laquelle la cible doit être pour que le saut se produise.",
                                    default: [4,20],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                            }
                        },
                        "minecraft:behavior.jump_to_block": {
                            description: "Permet à l'Entité de chercher un bloc à sauter et de sauter dessus.",
                            type: "object",
                            properties: {
                                cooldown_range: {
                                    description: "La plage de temps en secondes à attendre avant de pouvoir sauter à nouveau.",
                                    default: [10,20],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                                forbidden_blocks: {
                                    description: "Les blocs que l'Entité ne doit pas sauter.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                max_velocity: {
                                    description: "La vitesse maximale à laquelle l'Entité peut sauter.",
                                    default: 1.5,
                                    type: "number"
                                },
                                minimum_distance: {
                                    description: "La distance minimale (en blocs) de l'Entité à un bloc, pour considérer sauter dessus.",
                                    default: 2,
                                    type: "integer"
                                },
                                minimum_path_length: {
                                    description: "La longueur minimale (en blocs) du chemin de l'Entité à un bloc, pour considérer sauter dessus.",
                                    default: 5,
                                    type: "integer"
                                },
                                preferred_blocks: {
                                    description: "Les blocs que l'Entité préfère sauter.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                preferred_blocks_chance: {
                                    description: "La chance (entre 0.0 et 1.0) que l'Entité saute sur un bloc préféré, si à portée. Ne s'applique que si des blocs préférés sont définis.",
                                    default: 1,
                                    type: "number",
                                    minimum: 0,
                                    maximum: 1
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                scale_factor: {
                                    description: "Le facteur d'échelle de la boîte de collision de l'Entité lorsqu'elle saute.",
                                    default: 0.7,
                                    type: "number"
                                },
                                search_height: {
                                    description: "La hauteur maximale (en blocs) à laquelle l'Entité peut sauter.",
                                    default: 10,
                                    type: "integer",
                                    minimum: 2,
                                    maximum: 15
                                },
                                search_width: {
                                    description: "La largeur (en blocs) de la zone de recherche de l'Entité pour un bloc à sauter.",
                                    default: 8,
                                    type: "integer",
                                    minimum: 2,
                                    maximum: 15
                                },
                            }
                        },
                        "minecraft:behavior.knockback_roar": {
                            description: "Force une Entité à émettre un effet de rugissement qui repousse les autres Entités dans un rayon défini à partir de l'endroit où le rugissement a été émis.  Type: `Object`. Ce composant nécessite un événement de déclenchement pour fonctionner correctement.",
                            type: "object",
                            properties: {
                                attack_time: {
                                    description: "Le délai après lequel le knockback se produit (en secondes).",
                                    default: 0.5,
                                    type: "number"
                                },
                                cooldown_time: {
                                    description: "Le temps en secondes que l'Entité doit attendre avant de pouvoir émettre un autre rugissement.",
                                    default: 0.1,
                                    type: "number"
                                },
                                damage_filters: {
                                    description: "La liste des conditions qu'une autre entité doit remplir pour être une cible valide pour infliger des dégâts.",
                                },
                                duration: {
                                    description: "La durée maximale du rugissement (en secondes).",
                                    default: 1,
                                    type: "number"
                                },
                                knockback_damage: {
                                    description: "Les dégâts infligés par le rugissement de recul.",
                                    default: 6,
                                    type: "integer"
                                },
                                knockback_filters: {
                                    description: "La liste des conditions qu'une autre entité doit remplir pour être une cible valide pour appliquer un knockback.",
                                },
                                knockback_height_cap: {
                                    description: "La hauteur maximale pour le knockback.",
                                    default: 0.4,
                                    type: "number"
                                },
                                knockback_horizontal_strength: {
                                    description: "La force de knockback horizontale.",
                                    default: 4,
                                    type: "integer"
                                },
                                knockback_range: {
                                    description: "Le rayon (en blocs) de l'effet de knockback.",
                                    default: 4,
                                    type: "integer"
                                },
                                knockback_vertical_strength: {
                                    description: "La force de knockback vertical.",
                                    default: 4,
                                    type: "integer"
                                },
                                on_roar_end: {
                                    description: "Les événements à déclencher lorsque le rugissement se termine.",
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.lay_down": {
                            description: "Permet à l'Entité de s'allonger de manière aléatoire pendant une période de temps.",
                            type: "object",
                            properties: {
                                interval: {
                                    description: "Une valeur aléatoire pour déterminer à quels intervalles quelque chose peut se produire. Cela a une chance de 1/interval de choisir cet objectif.",
                                    default: 120,
                                    type: "integer"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                random_stop_interval: {
                                    description: "Une valeur aléatoire pour déterminer à quels intervalles l'objectif de l'IA peut s'arrêter. Cela a une chance de 1/interval de s'arrêter à cet objectif.",
                                    default: 120,
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.lay_egg": {
                            description: "Permet à l'Entité de pondre un oeuf sur certains types de blocs si l'Entité est enceinte.",
                            type: "object",
                            properties: {
                                allow_laying_from_below: {
                                    description: "Permet à l'Entité de pondre ses oeufs depuis le dessous de la cible si elle ne peut pas y accéder. C'est utile si le bloc cible est de l'eau avec de l'air au-dessus, car les Entités peuvent ne pas pouvoir accéder au bloc d'air au-dessus de l'eau.",
                                    default: false,
                                    type: "boolean"
                                },
                                egg_type: {
                                    description: "Bloc à placer pour l'oeuf. Si c'est un oeuf de tortue, le nombre d'oeufs dans le bloc est défini aléatoirement.",
                                    default: "minecraft:turtle_egg",
                                    type: "string"
                                },
                                goal_radius: {
                                    description: "La distance en blocs à laquelle l'Entité considère qu'elle a atteint son objectif.",
                                    default: 0.5,
                                    type: "number"
                                },
                                lay_egg_sound: {
                                    description: "Le nom de l'événement sonore pour pondre un oeuf.",
                                    default: "lay_egg",
                                    type: "string"
                                },
                                lay_seconds: {
                                    description: "La durée du processus de ponte de l'oeuf en secondes.",
                                    default: 10,
                                    type: "number"
                                },
                                on_lay: {
                                    description: "Les événements à déclencher lorsque l'Entité pond un oeuf.",
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                search_height: {
                                    description: "La hauteur en blocs que l'Entité cherchera un bloc cible pour se déplacer.",
                                    default: 1,
                                    type: "integer"
                                },
                                search_range: {
                                    description: "La distance en blocs que l'Entité cherchera un bloc cible pour se déplacer.",
                                    default: 0,
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'Entité lorsqu'elle pond un oeuf.",
                                    default: 1,
                                    type: "number"
                                },
                                target_blocks: {
                                    description: "Les blocs sur lesquels l'Entité peut pondre ses oeufs.",
                                    default: ["minecraft:sand"],
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                target_materials_above_block: {
                                    description: "Types de matériaux qui peuvent exister au-dessus du bloc cible. Les types valides sont Air, Water et Lava.",
                                    default: ["Air"],
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                use_default_animation: {
                                    description: "Spécifie si l'animation de ponte d'oeuf par défaut doit être jouée lorsque l'oeuf est placé ou non.",
                                    default: true,
                                    type: "boolean"
                                },
                            }
                        },
                        "minecraft:behavior.leap_at_target": {
                            description: "Force l'Entité à sauter vers une cible.  Type: `Object`. Cet objectif nécessite une cible pour fonctionner correctement.",
                            type: "object",
                            properties: {
                                must_be_on_ground: {
                                    description: "Si vrai, l'Entité ne sautera vers sa cible que si elle est au sol. Le définir sur faux lui permettra de sauter même si elle est déjà en l'air.",
                                    default: true,
                                    type: "boolean"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                set_persistent: {
                                    description: "Définit si l'Entité doit être persistante lorsqu'elle cible un joueur.",
                                    default: false,
                                    type: "boolean"
                                },
                                target_dist: {
                                    description: "La distance en blocs que l'Entité sautera vers sa cible.",
                                    default: 0.3,
                                    type: "number"
                                },
                                yd: {
                                    description: "La hauteur en blocs que l'Entité sautera vers sa cible.",
                                    default: 0,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.look_at_entity": {
                            description: "Permet à l'Entité de regarder une Entité spécifique en tournant la pose de l'os de la tête dans une limite définie.",
                            type: "object",
                            properties: {
                                angle_of_view_horizontal: {
                                    description: "L'angle en degrés que l'Entité peut voir dans l'axe X (gauche-droite).",
                                    default: 360,
                                    type: "integer"
                                },
                                angle_of_view_vertical: {
                                    description: "L'angle en degrés que l'Entité peut voir dans l'axe Y (haut-bas).",
                                    default: 360,
                                    type: "integer"
                                },
                                filters: {
                                    description: "Les filtres à appliquer pour sélectionner les entités à regarder.",
                                },
                                look_distance: {
                                    description: "La distance en blocs à laquelle l'Entité regardera une autre Entité.",
                                    default: 8,
                                    type: "number"
                                },
                                look_time: {
                                    description: "La durée en secondes pendant laquelle l'Entité regardera une autre Entité.",
                                    default: [2,4],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                probability: {
                                    description: "La probabilité de regarder l'entité. Une valeur de 1,00 est de 100%.",
                                    default: 0.02,
                                    type: "number",
                                    minimum: 0,
                                    maximum: 1
                                },
                            }
                        },
                        "minecraft:behavior.look_at_player": {
                            description: "Force une Entité à regarder le joueur en tournant la pose de l'os de la tête dans une limite définie.",
                            type: "object",
                            properties: {
                                angle_of_view_horizontal: {
                                    description: "L'angle en degrés que l'Entité peut voir dans l'axe X (gauche-droite).",
                                    default: 360,
                                    type: "integer"
                                },
                                angle_of_view_vertical: {
                                    description: "L'angle en degrés que l'Entité peut voir dans l'axe Y (haut-bas).",
                                    default: 360,
                                    type: "integer"
                                },
                                look_distance: {
                                    description: "La distance en blocs à laquelle l'Entité regardera le joueur.",
                                    default: 8,
                                    type: "number"
                                },
                                look_time: {
                                    description: "La durée en secondes pendant laquelle l'Entité regardera le joueur.",
                                    default: [2,4],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                probability: {
                                    description: "La probabilité de regarder le joueur. Une valeur de 1,00 est de 100%.",
                                    default: 0.02,
                                    type: "number",
                                    minimum: 0,
                                    maximum: 1
                                },
                                target_distance: {
                                    description: "La distance en blocs à laquelle l'Entité choisira un joueur.",
                                    default: 6,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.look_at_target": {
                            description: "Force une Entité à regarder une cible en tournant la pose de l'os de la tête dans une limite définie.  Type: `Object`. Cet objectif nécessite une cible pour fonctionner correctement.",
                            type: "object",
                            properties: {
                                angle_of_view_horizontal: {
                                    description: "L'angle en degrés que l'Entité peut voir dans l'axe X (gauche-droite).",
                                    default: 360,
                                    type: "integer"
                                },
                                angle_of_view_vertical: {
                                    description: "L'angle en degrés que l'Entité peut voir dans l'axe Y (haut-bas).",
                                    default: 360,
                                    type: "integer"
                                },
                                look_distance: {
                                    description: "La distance en blocs à laquelle l'Entité regardera une cible.",
                                    default: 8,
                                    type: "number"
                                },
                                look_time: {
                                    description: "La durée en secondes pendant laquelle l'Entité regardera une cible.",
                                    default: [2,4],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                probability: {
                                    description: "La probabilité de regarder la cible. Une valeur de 1,00 est de 100%.",
                                    default: 0.02,
                                    type: "number",
                                    minimum: 0,
                                    maximum: 1
                                },
                            }
                        },
                        "minecraft:behavior.look_at_trading_player": {
                            description: "Force une Entité à regarder le joueur qui est actuellement en train de commercer avec l'Entité.",
                            type: "object",
                            properties: {
                                angle_of_view_horizontal: {
                                    description: "L'angle en degrés que l'Entité peut voir dans l'axe X (gauche-droite).",
                                    default: 360,
                                    type: "integer"
                                },
                                angle_of_view_vertical: {
                                    description: "L'angle en degrés que l'Entité peut voir dans l'axe Y (haut-bas).",
                                    default: 360,
                                    type: "integer"
                                },
                                look_distance: {
                                    description: "La distance en blocs à laquelle l'Entité regardera le joueur qui commerce avec elle.",
                                    default: 8,
                                    type: "number"
                                },
                                look_time: {
                                    description: "La durée en secondes pendant laquelle l'Entité regardera le joueur qui commerce avec elle.",
                                    default: [2,4],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                probability: {
                                    description: "La probabilité de regarder le joueur qui commerce avec l'Entité. Une valeur de 1,00 est de 100%.",
                                    default: 0.02,
                                    type: "number",
                                    minimum: 0,
                                    maximum: 1
                                },
                            }
                        },
                        "minecraft:behavior.make_love": {
                            description: "Force une Entité à interagir avec d'autres Entités similaires pour produire une progéniture.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.melee_attack": {
                            description: "Force une Entité à effectuer des attaques au corps à corps.",
                            type: "object",
                            properties: {
                                attack_once: {
                                    description: "Permet à l'entité d'utiliser ce comportement d'attaque une seule fois.",
                                    default: false,
                                    type: "boolean"
                                },
                                attack_types: {
                                    description: "Liste des types d'entités à attaquer.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                can_spread_on_fire: {
                                    description: "Définit si l'entité peut mettre le feu à d'autres entités lorsqu'elle les attaque.",
                                    default: false,
                                    type: "boolean"
                                },
                                cooldown_time: {
                                    description: "Le temps en secondes entre les attaques.",
                                    default: 1,
                                    type: "number"
                                },
                                inner_boundary_time_increase: {
                                    description: "Temps (en secondes) à ajouter au recalcul du chemin d'attaque lorsque la cible est au-delà de la 'path_inner_boundary'.",
                                    default: 0.25,
                                    type: "number"
                                },
                                max_dist: {
                                    description: "Pas utilisé dans le comportement.",
                                    type: "number"
                                },
                                max_path_time: {
                                    description: "Temps maximum (en secondes) pour recalculer le chemin d'attaque.",
                                    default: 0.55,
                                    type: "number"
                                },
                                melee_fov: {
                                    description: "Champ de vision (en degrés) lors de l'utilisation du composant de détection pour détecter une cible d'attaque.",
                                    default: 90,
                                    type: "number"
                                },
                                min_path_time: {
                                    description: "Temps minimum (en secondes) pour recalculer le chemin d'attaque.",
                                    default: 0.2,
                                    type: "number"
                                },
                                on_attack: {
                                    description: "L'événement à déclencher lorsque l'entité attaque.",
                                },
                                on_kill: {
                                    description: "L'événement à déclencher lorsque l'entité tue une autre entité.",
                                },
                                outer_boundary_time_increase: {
                                    description: "Temps (en secondes) à ajouter au recalculer lorsque la cible est au-delà de la 'path_outer_boundary'.",
                                    default: 0.5,
                                    type: "number"
                                },
                                path_fail_time_increase: {
                                    description: "Temps (en secondes) à ajouter au recalcul du chemin d'attaque lorsque cette entité ne peut pas se déplacer le long du chemin actuel.",
                                    default: 0.75,
                                    type: "number"
                                },
                                path_inner_boundary: {
                                    description: "Distance à laquelle l'entité doit être à l'intérieur pour augmenter le recalcul du chemin d'attaque par 'inner_boundary_tick_increase'.",
                                    default: 16,
                                    type: "number"
                                },
                                path_outer_boundary: {
                                    description: "Distance à laquelle l'entité doit être à l'extérieur pour augmenter le recalcul du chemin d'attaque par 'outer_boundary_tick_increase'.",
                                    default: 32,
                                    type: "number"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif.",
                                    type: "integer"
                                },
                                random_stop_interval: {
                                    description: "Cette entité aura une chance de 1 sur N d'arrêter son attaque actuelle, où N = 'random_stop_interval'.",
                                    default: 0,
                                    type: "integer"
                                },
                                reach_multiplier: {
                                    description: "Utilisé avec la taille de la base de l'entité pour déterminer la distance minimale de la cible avant de tenter de causer des dégâts d'attaque.",
                                    default: 1.5,
                                    type: "number"
                                },
                                require_complete_path: {
                                    description: "Bascule (on/off) la nécessité d'avoir un chemin complet de l'entité à la cible lors de l'utilisation de ce comportement d'attaque.",
                                    default: false,
                                    type: "boolean"
                                },
                                set_persistent: {
                                    description: "Permet à l'entité d'être définie pour persister lorsqu'elle cible un joueur.",
                                    default: false,
                                    type: "boolean"
                                },
                                speed_multiplier: {
                                    description: "Multiplicateur de vitesse de mouvement de l'entité lorsqu'elle utilise cet objectif AI.",
                                    default: 1,
                                    type: "number"
                                },
                                target_dist: {
                                    description: "Inutilisé.",
                                    type: "number"
                                },
                                track_target: {
                                    description: "Permet à l'entité de suivre la cible d'attaque, même si l'entité n'a pas de détection.",
                                    default: true,
                                    type: "boolean"
                                },
                                x_max_rotation: {
                                    description: "Rotation maximale (en degrés) sur l'axe X que cette entité peut tourner lorsqu'elle tente de regarder la cible.",
                                    default: 30,
                                    type: "number"
                                },
                                y_max_head_rotation: {
                                    description: "Rotation maximale (en degrés) sur l'axe Y que cette entité peut tourner la tête lorsqu'elle tente de regarder la cible.",
                                    default: 30,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.melee_box_attack": {
                            description: "Force une Entité à effectuer des attaques au corps à corps avec des calculs de portée basés sur des boîtes de collision.",
                            type: "object",
                            properties: {
                                attack_once: {
                                    description: "Permet à l'entité d'utiliser ce comportement d'attaque une seule fois.",
                                    default: false,
                                    type: "boolean"
                                },
                                attack_types: {
                                    description: "Liste des types d'entités à attaquer.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                can_spread_on_fire: {
                                    description: "Définit si l'entité peut mettre le feu à d'autres entités lorsqu'elle les attaque.",
                                    default: false,
                                    type: "boolean"
                                },
                                cooldown_time: {
                                    description: "Le temps en secondes entre les attaques.",
                                    default: 1,
                                    type: "number"
                                },
                                horizontal_reach: {
                                    description: "La portée d'attaque de l'entité sera une boîte de la taille des limites de l'entité augmentée de cette valeur dans toutes les directions horizontales.",
                                    default: 0.8,
                                    type: "number"
                                },
                                inner_boundary_time_increase: {
                                    description: "Temps (en secondes) à ajouter au recalcul du chemin d'attaque lorsque la cible est au-delà de la 'path_inner_boundary'.",
                                    default: 0.25,
                                    type: "number"
                                },
                                max_dist: {
                                    description: "Pas utilisé dans le comportement.",
                                    type: "number"
                                },
                                max_path_time: {
                                    description: "Temps maximum (en secondes) pour recalculer le chemin d'attaque.",
                                    default: 0.55,
                                    type: "number"
                                },
                                melee_fov: {
                                    description: "Champ de vision (en degrés) lors de l'utilisation du composant de détection pour détecter une cible d'attaque.",
                                    default: 90,
                                    type: "number"
                                },
                                min_path_time: {
                                    description: "Temps minimum (en secondes) pour recalculer le chemin d'attaque.",
                                    default: 0.2,
                                    type: "number"
                                },
                                on_attack: {
                                    description: "L'événement à déclencher lorsque l'entité attaque.",
                                },
                                outer_boundary_time_increase: {
                                    description: "Temps (en secondes) à ajouter au recalculer lorsque la cible est au-delà de la 'path_outer_boundary'.",
                                    default: 0.5,
                                    type: "number"
                                },
                                path_fail_time_increase: {
                                    description: "Temps (en secondes) à ajouter au recalcul du chemin d'attaque lorsque cette entité ne peut pas se déplacer le long du chemin actuel.",
                                    default: 0.75,
                                    type: "number"
                                },
                                path_inner_boundary: {
                                    description: "Distance à laquelle l'entité doit être à l'intérieur pour augmenter le recalcul du chemin d'attaque par 'inner_boundary_tick_increase'.",
                                    default: 16,
                                    type: "number"
                                },
                                path_outer_boundary: {
                                    description: "Distance à laquelle l'entité doit être à l'extérieur pour augmenter le recalcul du chemin d'attaque par 'outer_boundary_tick_increase'.",
                                    default: 32,
                                    type: "number"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif.",
                                    type: "integer"
                                },
                                random_stop_interval: {
                                    description: "Cette entité aura une chance de 1 sur N d'arrêter son attaque actuelle, où N = 'random_stop_interval'.",
                                    default: 0,
                                    type: "integer"
                                },
                                reach_multiplier: {
                                    description: "Utilisé avec la taille de la base de l'entité pour déterminer la distance minimale de la cible avant de tenter de causer des dégâts d'attaque.",
                                    default: 1.5,
                                    type: "number"
                                },
                                require_complete_path: {
                                    description: "Bascule (on/off) la nécessité d'avoir un chemin complet de l'entité à la cible lors de l'utilisation de ce comportement d'attaque.",
                                    default: false,
                                    type: "boolean"
                                },
                                set_persistent: {
                                    description: "Permet à l'entité d'être définie pour persister lorsqu'elle cible un joueur.",
                                    default: false,
                                    type: "boolean"
                                },
                                speed_multiplier: {
                                    description: "Multiplicateur de vitesse de mouvement de l'entité lorsqu'elle utilise cet objectif AI.",
                                    default: 1,
                                    type: "number"
                                },
                                target_dist: {
                                    description: "Inutilisé.",
                                    type: "number"
                                },
                                track_target: {
                                    description: "Permet à l'entité de suivre la cible d'attaque, même si l'entité n'a pas de détection.",
                                    default: true,
                                    type: "boolean"
                                },
                                x_max_rotation: {
                                    description: "Rotation maximale (en degrés) sur l'axe X que cette entité peut tourner lorsqu'elle tente de regarder la cible.",
                                    default: 30,
                                    type: "number"
                                },
                                y_max_head_rotation: {
                                    description: "Rotation maximale (en degrés) sur l'axe Y que cette entité peut tourner la tête lorsqu'elle tente de regarder la cible.",
                                    default: 30,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.mingle": {
                            description: "Force une Entité à naviguer jusqu'au point d'intérêt de la cloche du village et à interagir avec d'autres entités qui ont été assignées.",
                            type: "object",
                            properties: {
                                cooldown_time: {
                                    description: "Le temps en secondes que l'entité doit attendre avant de réutiliser l'objectif.",
                                    default: 0,
                                    type: "number"
                                },
                                duration: {
                                    description: "La durée en secondes pendant laquelle l'entité discutera avec une autre entité.",
                                    default: 1,
                                    type: "number"
                                },
                                mingle_distance: {
                                    description: "La distance de son partenaire avec laquelle cette entité se mêlera. Si le type d'entité n'est pas le même que l'entité, cette valeur doit être identique sur les deux entités.",
                                    default: 2,
                                    type: "number"
                                },
                                mingle_partner_type: {
                                    description: "Le type d'entité avec lequel cette entité est autorisée à se mêler.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle se mêle.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.mount_pathing": {
                            description: "Force une Entité à se déplacer seule tout en étant montée.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle est montée.",
                                    default: 1,
                                    type: "number"
                                },
                                target_dist: {
                                    description: "La distance en blocs à laquelle l'entité considère qu'elle a atteint son objectif.",
                                    default: 0,
                                    type: "number"
                                },
                                track_target: {
                                    description: "Si vrai, cette entité poursuivra la cible tant qu'elle sera une cible valide.",
                                    default: false,
                                    type: "boolean"
                                },
                            }
                        },
                        "minecraft:behavior.move_around_target": {
                            description: "Force une entité à se déplacer autour d'une cible.",
                            type: "object",
                            properties: {
                                destination_pos_search_spread_degrees: {
                                    description: "Cet angle (en degrés) est utilisé pour contrôler la dispersion lors du choix d'une position de destination derrière la cible.",
                                    default: 90,
                                    type: "number"
                                },
                                destination_position_range: {
                                    description: "La plage de distances de l'entité cible dans laquelle l'objectif doit rechercher une position pour déplacer l'entité propriétaire.",
                                    default: [4,8],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                                filters: {
                                    description: "Les conditions qui doivent être remplies pour que le comportement commence.",
                                },
                                height_difference_limit: {
                                    description: "La distance en hauteur (en blocs) entre l'entité propriétaire et la cible doit être inférieure à cette valeur lorsque l'entité propriétaire vérifie si elle est trop proche et doit s'éloigner de la cible.",
                                    default: 10,
                                    type: "number",
                                    minimum: 0
                                },
                                horizontal_search_distance: {
                                    description: "La distance de recherche horizontale (en blocs) lors de la recherche d'une position pour s'éloigner de la cible.",
                                    default: 5,
                                    type: "integer"
                                },
                                movement_speed: {
                                    description: "La vitesse à laquelle l'entité doit se déplacer vers sa position cible.",
                                    default: 0.6,
                                    type: "number"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                vertical_search_distance: {
                                    description: "La distance de recherche verticale (en blocs) lors de la recherche d'une position pour s'éloigner de la cible.",
                                    default: 5,
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.move_indoors": {
                            description: "Permet à une Entité de se déplacer à l'intérieur.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace à l'intérieur.",
                                    default: 0.8,
                                    type: "number"
                                },
                                timeout_cooldown: {
                                    description: "Le temps de recharge en secondes avant que l'objectif puisse être réutilisé après l'échec de la recherche de chemin.",
                                    default: 8,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.move_outdoors": {
                            description: "Force une Entité à se déplacer à l'extérieur.",
                            type: "object",
                            properties: {
                                goal_radius: {
                                    description: "Le rayon à partir du bloc cible pour compter comme atteignant l'objectif.",
                                    default: 0.5,
                                    type: "number"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                search_count: {
                                    description: "Le nombre de fois à essayer de trouver une position aléatoire à l'extérieur avant d'échouer.",
                                    default: 0,
                                    type: "integer"
                                },
                                search_height: {
                                    description: "La plage de hauteurs à partir de laquelle rechercher une position à l'extérieur.",
                                    default: 0,
                                    type: "integer"
                                },
                                search_range: {
                                    description: "La plage de distances à partir de laquelle rechercher une position à l'extérieur.",
                                    default: 0,
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace à l'extérieur.",
                                    default: 0.5,
                                    type: "number"
                                },
                                timeout_cooldown: {
                                    description: "Le temps de recharge en secondes avant que l'objectif puisse être réutilisé après l'échec de la recherche de chemin.",
                                    default: 8,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.move_through_village": {
                            description: "Force une Entité à naviguer autour d'un village en créant un chemin à patrouiller.",
                            type: "object",
                            properties: {
                                only_at_night: {
                                    description: "Si vrai, le mob ne se déplacera que dans le village pendant la nuit.",
                                    default: false,
                                    type: "boolean"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace à travers le village.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.move_to_block": {
                            description: "Permet à une Entité de se déplacer vers un bloc.",
                            type: "object",
                            properties: {
                                goal_radius: {
                                    description: "La distance en blocs à l'intérieur de laquelle l'entité considère avoir atteint l'objectif.",
                                    default: 0.5,
                                    type: "number"
                                },
                                on_reach: {
                                    description: "L'événement à déclencher lorsque l'entité atteint le bloc.",
                                },
                                on_stay_completed: {
                                    description: "L'événement à déclencher lorsque l'Entité reste sur le bloc pendant la durée de séjour('stay_duration').",
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                search_height: {
                                    description: "La plage de hauteurs à partir de laquelle rechercher une position.",
                                    default: 1,
                                    type: "integer"
                                },
                                search_range: {
                                    description: "La plage de distances à partir de laquelle rechercher une position.",
                                    default: 0,
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace vers le bloc.",
                                    default: 1,
                                    type: "number"
                                },
                                start_chance: {
                                    description: "La chance de démarrer le comportement (appliquée après chaque intervalle de tick aléatoire).",
                                    default: 1,
                                    type: "number",
                                    minimum: 0,
                                    maximum: 1
                                },
                                stay_duration: {
                                    description: "Le nombre de ticks nécessaires pour terminer un séjour au bloc.",
                                    default: 0,
                                    type: "number"
                                },
                                target_blocks: {
                                    description: "Les types de blocs vers lesquels l'entité doit se déplacer.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                target_offset: {
                                    description: "Décalage à ajouter à la position cible sélectionnée.",
                                    default: [0,0,0],
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: {
                                        type: "number"
                                    }
                                },
                                target_selection_method: {
                                    description: "Le type de bloc à trouver correspondant à la spécification.",
                                    default: "nearest",
                                    type: "string",
                                    enum: ["nearest", "random"]
                                },
                                tick_interval: {
                                    description: "L'intervalle moyen en ticks pour essayer d'exécuter ce comportement.",
                                    default: 20,
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.move_to_land": {
                            description: "Force une Entité à se déplacer vers la terre lorsqu'elle se trouve dans un milieu non terrestre tel que la lave ou l'eau.",
                            type: "object",
                            properties: {
                                goal_radius: {
                                    description: "La distance en blocs à l'intérieur de laquelle l'entité considère avoir atteint l'objectif.",
                                    default: 0.5,
                                    type: "number"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                search_count: {
                                    description: "Le nombre de blocs que le mob vérifiera à chaque tick dans sa plage de recherche et sa hauteur pour un bloc valide vers lequel se déplacer. Une valeur de 0 fera vérifier au mob chaque bloc dans la plage en un tick.",
                                    default: 10,
                                    type: "integer"
                                },
                                search_height: {
                                    description: "La plage de hauteurs à partir de laquelle rechercher une position.",
                                    default: 1,
                                    type: "integer"
                                },
                                search_range: {
                                    description: "La plage de distances à partir de laquelle rechercher une position.",
                                    default: 0,
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace vers la terre.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.move_to_lava": {
                            description: "Force une Entité à se déplacer vers la lave lorsqu'elle se trouve sur terre.",
                            type: "object",
                            properties: {
                                goal_radius: {
                                    description: "La distance en blocs à l'intérieur de laquelle l'entité considère avoir atteint l'objectif.",
                                    default: 0.5,
                                    type: "number"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                search_count: {
                                    description: "Le nombre de blocs que le mob vérifiera à chaque tick dans sa plage de recherche et sa hauteur pour un bloc valide vers lequel se déplacer. Une valeur de 0 fera vérifier au mob chaque bloc dans la plage en un tick.",
                                    default: 10,
                                    type: "integer"
                                },
                                search_height: {
                                    description: "La plage de hauteurs à partir de laquelle rechercher une position.",
                                    default: 1,
                                    type: "integer"
                                },
                                search_range: {
                                    description: "La plage de distances à partir de laquelle rechercher une position.",
                                    default: 0,
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace vers la lave.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.move_to_liquid": {
                            description: "Force une Entité à se déplacer dans un liquide lorsqu'elle se trouve sur terre.",
                            type: "object",
                            properties: {
                                goal_radius: {
                                    description: "La distance en blocs à l'intérieur de laquelle l'entité considère avoir atteint l'objectif.",
                                    default: 0.5,
                                    type: "number"
                                },
                                material_type: {
                                    description: "Le type de liquide vers lequel l'entité doit se déplacer.",
                                    default: "Any",
                                    type: "string",
                                    enum: ["Any", "Lava", "Water"]
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                search_count: {
                                    description: "Le nombre de blocs que le mob vérifiera à chaque tick dans sa plage de recherche et sa hauteur pour un bloc valide vers lequel se déplacer. Une valeur de 0 fera vérifier au mob chaque bloc dans la plage en un tick.",
                                    default: 10,
                                    type: "integer"
                                },
                                search_height: {
                                    description: "La plage de hauteurs à partir de laquelle rechercher une position.",
                                    default: 1,
                                    type: "integer"
                                },
                                search_range: {
                                    description: "La plage de distances à partir de laquelle rechercher une position.",
                                    default: 0,
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace dans le liquide.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.move_to_poi": {
                            description: "Permet à l'Entité de se déplacer vers un point d'intérêt.",
                            type: "object",
                            properties: {
                                poi_type: {
                                    description: "Le type de point d'intérêt vers lequel l'entité doit se déplacer.",
                                    type: "string"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace vers le point d'intérêt.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.move_to_random_block": {
                            description: "Force une Entité à se déplacer vers un bloc aléatoire dans un rayon défini.",
                            type: "object",
                            properties: {
                                block_distance: {
                                    description: "La distance du mob, en blocs, à partir de laquelle le bloc vers lequel se déplacer sera choisi.",
                                    default: 16,
                                    type: "number"
                                },
                                within_radius: {
                                    description: "La distance en blocs à l'intérieur de laquelle l'entité considère avoir atteint l'objectif.",
                                    default: 0,
                                    type: "number"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace vers le bloc aléatoire.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.move_to_village": {
                            description: "Force une Entité à se déplacer vers un point d'intérêt du village.",
                            type: "object",
                            properties: {
                                cooldown_time: {
                                    description: "Le temps en secondes que le mob doit attendre avant de réutiliser l'objectif.",
                                    default: 0,
                                    type: "number"
                                },
                                goal_radius: {
                                    description: "La distance en blocs à l'intérieur de laquelle l'entité considère avoir atteint l'objectif.",
                                    default: 0.5,
                                    type: "number"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                search_range: {
                                    description: "La distance en blocs pour rechercher des villages. Si <= 0, trouvez le village le plus proche, quelle que soit la distance.",
                                    default: 0,
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace vers le village.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.move_to_water": {
                            description: "Force une Entité à se déplacer vers l'eau lorsqu'elle se trouve sur terre.",
                            type: "object",
                            properties: {
                                goal_radius: {
                                    description: "La distance en blocs à l'intérieur de laquelle l'entité considère avoir atteint l'objectif.",
                                    default: 0.5,
                                    type: "number"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                search_count: {
                                    description: "Le nombre de blocs que le mob vérifiera à chaque tick dans sa plage de recherche et sa hauteur pour un bloc valide vers lequel se déplacer. Une valeur de 0 fera vérifier au mob chaque bloc dans la plage en un tick.",
                                    default: 10,
                                    type: "integer"
                                },
                                search_height: {
                                    description: "La plage de hauteurs à partir de laquelle rechercher une position.",
                                    default: 1,
                                    type: "integer"
                                },
                                search_range: {
                                    description: "La plage de distances à partir de laquelle rechercher une position.",
                                    default: 0,
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace vers l'eau.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.move_towards_dwelling_restriction": {
                            description: "Permet à l'Entité qui a le composant 'minecraft:dweller' de se déplacer vers la zone de village à laquelle l'Entité devrait être restreinte.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace vers la zone de village.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.move_towards_home_restriction": {
                            description: "Permet à l'Entité qui a le composant 'minecraft:home' de se déplacer vers la position de la maison de l'Entité.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace vers la maison.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.move_towards_target": {
                            description: "Force une Entité à se déplacer vers une cible.  Type: `Object`. Ce composant nécessite que l'Entité ait une cible.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace vers la cible.",
                                    default: 1,
                                    type: "number"
                                },
                                within_radius: {
                                    description: "La distance en blocs à l'intérieur de laquelle l'entité considère avoir atteint l'objectif.",
                                    default: 0,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.nap": {
                            description: "Force une Entité à s'arrêter et à faire une sieste de temps en temps dans certaines conditions.",
                            type: "object",
                            properties: {
                                can_nap_filters: {
                                    description: "Les conditions qui doivent être remplies pour que l'entité puisse faire une sieste.",
                                },
                                cooldown_max: {
                                    description: "Le temps maximum en secondes que l'entité doit attendre avant de réutiliser l'objectif.",
                                    default: 0,
                                    type: "number"
                                },
                                cooldown_min: {
                                    description: "Le temps minimum en secondes que l'entité doit attendre avant de réutiliser l'objectif.",
                                    default: 0,
                                    type: "number"
                                },
                                mob_detect_dist: {
                                    description: "La distance en blocs à laquelle l'entité doit détecter les autres entités pour déterminer si elle peut faire une sieste.",
                                    default: 6,
                                    type: "number"
                                },
                                mob_detect_height: {
                                    description: "La plage de hauteurs à partir de laquelle l'entité doit détecter les autres entités pour déterminer si elle peut faire une sieste.",
                                    default: 2,
                                    type: "number"
                                },
                                wake_mob_exceptions: {
                                    description: "Les conditions qui doivent être remplies pour que l'entité se réveille de sa sieste.",
                                },
                            }
                        },
                        "minecraft:behavior.nearest_attackable_target": {
                            description: "Force une Entité à attaquer la cible la plus proche dans un sous-ensemble donné de types de cibles spécifiques.  Type: `Object`  Ce composant est une nécessité pour le composant 'minecraft:behavior.melee_attack'.",
                            type: "object",
                            properties: {
                                attack_interval: {
                                    description: "La plage de temps (en secondes) entre la recherche d'une cible d'attaque, la plage est dans (0, 'attack_interval']. Utilisé uniquement si 'attack_interval' est supérieur à 0, sinon 'scan_interval' est utilisé.",
                                    default: 0,
                                    type: "integer"
                                },
                                attack_interval_min: {
                                    description: "Alias pour 'attack_interval'; fournit la même fonctionnalité que 'attack_interval'.",
                                    default: 0,
                                    type: "integer"
                                },
                                attack_owner: {
                                    description: "Si vrai, l'entité peut attaquer son propriétaire.",
                                    default: false,
                                    type: "boolean"
                                },
                                entity_types: {
                                    description: "Les types d'entités qui peuvent être attaqués par cette entité.",
                                    type: "object"
                                },
                                must_reach: {
                                    description: "Si vrai, cette entité doit avoir un chemin vers la cible.",
                                    default: false,
                                    type: "boolean"
                                },
                                must_see: {
                                    description: "Si vrai, l'entité doit être visible pour être sélectionnée comme cible.",
                                    default: false,
                                    type: "boolean"
                                },
                                must_see_forget_duration: {
                                    description: "Le temps en secondes que l'entité doit être hors de vue pour être oubliée comme cible.",
                                    default: 3,
                                    type: "number"
                                },
                                persist_time: {
                                    description: "Le temps (en secondes) que cette entité peut continuer à attaquer la cible après que la cible ne soit plus valide.",
                                    default: 0,
                                    type: "number"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                reselect_targets: {
                                    description: "Permet à l'entité attaquante de mettre à jour la cible la plus proche, sinon une cible n'est réévaluée qu'après chaque 'scan_interval' ou 'attack_interval'.",
                                    default: false,
                                    type: "boolean"
                                },
                                scan_interval: {
                                    description: "Si 'attack_interval' est 0 ou n'est pas déclaré, alors entre les attaques: la recherche d'une nouvelle cible se produit tous les ticks égaux à 'scan_interval', la valeur minimale est 1. Les valeurs inférieures à 10 peuvent affecter les performances.",
                                    default: 10,
                                    type: "integer"
                                },
                                set_persistent: {
                                    description: "Permet à l'Entité de ne pas disparaitre lorsqu'elle cible un joueur.",
                                    default: false,
                                    type: "boolean"
                                },
                                target_invisible_multiplier: {
                                    description: "Multiplié avec le pourcentage de couverture d'armure de la cible pour modifier 'max_dist' lors de la détection d'une cible invisible.",
                                    default: 0.7,
                                    type: "number"
                                },
                                target_search_height: {
                                    description: "La distance verticale maximale de recherche de cible, si elle est supérieure à 'max_dist' du type de cible. Une valeur négative revient à la plus grande 'max_dist' des 'entity_types'.",
                                    default: -1,
                                    type: "number"
                                },
                                target_sneak_visibility_multiplier: {
                                    description: "Multiplié avec 'max_dist' du type de cible lors de la détection d'une cible furtive.",
                                    default: 0.8,
                                    type: "number"
                                },
                                within_radius: {
                                    description: "La distance maximale à laquelle cette entité peut être de la cible lorsqu'elle la suit, sinon la cible devient invalide. Cette valeur n'est utilisée que si l'entité ne déclare pas 'minecraft:follow_range'.",
                                    default: 0,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.nearest_prioritized_attackable_target": {
                            description: "Permet à une Entité de cibler et de prioriser la cible la plus proche valide.",
                            type: "object",
                            properties: {
                                attack_interval: {
                                    description: "La plage de temps (en secondes) entre la recherche d'une cible d'attaque, la plage est dans (0, 'attack_interval']. Utilisé uniquement si 'attack_interval' est supérieur à 0, sinon 'scan_interval' est utilisé.",
                                    default: 0,
                                    type: "integer"
                                },
                                cooldown: {
                                    description: "Le temps en secondes que le mob doit attendre avant de repouvoir sélectionner une cible du même type.",
                                    default: 0,
                                    type: "number"
                                },
                                entity_types: {
                                    description: "Les types d'entités qui peuvent être attaqués par cette entité.",
                                    type: "object"
                                },
                                must_reach: {
                                    description: "Si vrai, cette entité doit avoir un chemin vers la cible.",
                                    default: false,
                                    type: "boolean"
                                },
                                must_see: {
                                    description: "Si vrai, l'entité doit être visible pour être sélectionnée comme cible.",
                                    default: false,
                                    type: "boolean"
                                },
                                must_see_forget_duration: {
                                    description: "Le temps en secondes que l'entité doit être hors de vue pour être oubliée comme cible.",
                                    default: 3,
                                    type: "number"
                                },
                                priority: {
                                    description: "La priorité de l'attaque.",
                                    default: 0,
                                    type: "integer"
                                },
                                persist_time: {
                                    description: "Le temps (en secondes) que cette entité peut continuer à attaquer la cible après que la cible ne soit plus valide.",
                                    default: 0,
                                    type: "number"
                                },
                                reselect_targets: {
                                    description: "Permet à l'entité attaquante de mettre à jour la cible la plus proche, sinon une cible n'est réévaluée qu'après chaque 'scan_interval' ou 'attack_interval'.",
                                    default: false,
                                    type: "boolean"
                                },
                                scan_interval: {
                                    description: "Si 'attack_interval' est 0 ou n'est pas déclaré, alors entre les attaques: la recherche d'une nouvelle cible se produit tous les ticks égaux à 'scan_interval', la valeur minimale est 1. Les valeurs inférieures à 10 peuvent affecter les performances.",
                                    default: 10,
                                    type: "integer"
                                },
                                set_persistent: {
                                    description: "Permet à l'Entité de ne pas disparaitre lorsqu'elle cible un joueur.",
                                    default: false,
                                    type: "boolean"
                                },
                                target_search_height: {
                                    description: "La distance verticale maximale de recherche de cible, si elle est supérieure à 'max_dist' du type de cible. Une valeur négative revient à la plus grande 'max_dist' des 'entity_types'.",
                                    default: -1,
                                    type: "number"
                                },
                                within_radius: {
                                    description: "La distance maximale à laquelle cette entité peut être de la cible lorsqu'elle la suit, sinon la cible devient invalide. Cette valeur n'est utilisée que si l'entité ne déclare pas 'minecraft:follow_range'.",
                                    default: 0,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.ocelot_sit_on_block": {
                            description: "Force une Entité à s'asseoir en place, similaire à la pose d'animation de l'entité ocelot.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "Plus la priorité est haute, plus vite cet objectif sera exécuté.",
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle est assise.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.ocelotattack": {
                            description: "Permet à une Entité d'attaquer en se faufilant et en bondissant.",
                            type: "object",
                            properties: {
                                cooldown_time: {
                                    description: "Temps en secondes entre chaque attaque.",
                                    default: 1,
                                    type: "number"
                                },
                                max_distance: {
                                    description: "La distance maximale à laquelle l'entité peut être de la cible lorsqu'elle attaque.",
                                    default: 15,
                                    type: "number"
                                },
                                max_sneak_range: {
                                    description: "La distance maximale à laquelle l'entité peut être de la cible lorsqu'elle commence à se faufiler.",
                                    default: 15,
                                    type: "number"
                                },
                                max_sprint_range: {
                                    description: "La distance maximale à laquelle l'entité peut être de la cible lorsqu'elle commence à sprinter (le sprint prend le pas sur le furtif).",
                                    default: 4,
                                    type: "number"
                                },
                                priority: {
                                    description: "La priorité de l'attaque.",
                                    default: 0,
                                    type: "integer"
                                },
                                reach_multiplier: {
                                    description: "Utilisé avec la taille de base de l'entité pour déterminer la distance minimale de la cible avant d'essayer de causer des dégâts d'attaque.",
                                    default: 2,
                                    type: "number"
                                },
                                sneak_speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle se faufile.",
                                    default: 0.6,
                                    type: "number"
                                },
                                sprint_speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle sprinte.",
                                    default: 1.33,
                                    type: "number"
                                },
                                walk_speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle marche.",
                                    default: 0.8,
                                    type: "number"
                                },
                                x_max_rotation: {
                                    description: "La rotation maximale (en degrés), sur l'axe X, que cette entité peut effectuer en essayant de regarder la cible.",
                                    default: 30,
                                    type: "number"
                                },
                                y_max_head_rotation: {
                                    description: "La rotation maximale (en degrés), sur l'axe Y, que cette entité peut effectuer en essayant de regarder la cible.",
                                    default: 30,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.offer_flower": {
                            description: "Force une Entité à offrir une fleur à une autre entité.  Type: `Object`. L'Entité doit avoir un item fleur.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "La priorité de l'offre de fleur.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.open_door": {
                            description: "Force une Entité à interagir et à ouvrir une porte.",
                            type: "object",
                            properties: {
                                close_door_after: {
                                    description: "Si vrai, l'entité fermera la porte après l'avoir ouverte et être passée à travers.",
                                    default: true,
                                    type: "boolean"
                                },
                                priority: {
                                    description: "La priorité de l'ouverture de la porte.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.owner_hurt_by_target": {
                            description: "Permet à l'Entité de cibler une autre entité qui blesse son propriétaire.",
                            type: "object",
                            properties: {
                                entity_types: {
                                    description: "Liste des types d'entités à attaquer.",
                                    type: "object"
                                },
                                priority: {
                                    description: "La priorité de ce comportement.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.owner_hurt_target": {
                            description: "Permet à l'Entité de réagir lorsque son propriétaire frappe une cible.",
                            type: "object",
                            properties: {
                                entity_types: {
                                    description: "Liste des types d'entités à attaquer.",
                                    type: "object"
                                },
                                priority: {
                                    description: "La priorité de ce comportement.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.panic": {
                            description: "Permet au mob d'entrer dans l'état de panique, ce qui le fait courir autour et loin de la source de dégâts qui l'a fait entrer dans cet état.",
                            type: "object",
                            properties: {
                                damage_sources: {
                                    description: "La liste des sources de dégâts qui peuvent déclencher la panique.",
                                    default: ["campfire","fire","fire_tick","freezing","lava","lightning","magma","soul_campfire","temperature","entity_attack","entity_explosion","fireworks","magic","projectile","ram_attack","sonic_boom","wither","mace_smash"],
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                force: {
                                    description: "Si vrai, ce mob ne cessera pas de paniquer tant qu'il ne pourra plus bouger ou que l'objectif ne lui sera pas retiré.",
                                    default: false,
                                    type: "boolean"
                                },
                                ignore_mob_damage: {
                                    description: "Si vrai, le mob ne paniquera pas en réponse aux dégâts d'autres mobs. Cela remplace les types de dégâts dans 'damage_sources'.",
                                    default: false,
                                    type: "boolean"
                                },
                                panic_sound: {
                                    description: "Le son à jouer lorsque le mob entre en panique.",
                                    default: "",
                                    type: "string"
                                },
                                prefer_water: {
                                    description: "Si vrai, le mob préférera l'eau à la terre.",
                                    default: false,
                                    type: "boolean"
                                },
                                priority: {
                                    description: "La priorité de la panique.",
                                    type: "integer"
                                },
                                sound_interval: {
                                    description: "La plage de temps en secondes à attendre aléatoirement avant de rejouer le son.",
                                    default: 0,
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle est en panique.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.pet_sleep_with_owner": {
                            description: "Force l'Entité à dormir sur un lit partagé avec son propriétaire endormi.",
                            type: "object",
                            properties: {
                                goal_radius: {
                                    description: "La distance en blocs à l'intérieur de laquelle l'entité considère avoir atteint l'objectif.",
                                    default: 0.5,
                                    type: "number"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                search_height: {
                                    description: "La plage de hauteurs à partir de laquelle rechercher une position.",
                                    default: 1,
                                    type: "integer"
                                },
                                search_range: {
                                    description: "La plage de distances à partir de laquelle rechercher une position.",
                                    default: 0,
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace vers le lit.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.pickup_items": {
                            description: "Force une Entité à ramasser des items sélectionnés sur le sol.",
                            type: "object",
                            properties: {
                                can_pickup_any_item: {
                                    description: "Si vrai, le mob peut ramasser n'importe quel item.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_pickup_to_hand_or_equipment: {
                                    description: "Si vrai, le mob peut ramasser des items dans sa main ou dans ses emplacements d'armure.",
                                    default: true,
                                    type: "boolean"
                                },
                                cooldown_after_being_attacked: {
                                    description: "Le temps en secondes que l'entité doit attendre avant de pouvoir ramasser des items après avoir été attaquée.",
                                    default: 20,
                                    type: "number"
                                },
                                excluded_items: {
                                    description: "La liste des items que le mob ne peut pas ramasser.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                goal_radius: {
                                    description: "La distance en blocs à l'intérieur de laquelle l'entité considère avoir atteint l'objectif.",
                                    default: 0.5,
                                    type: "number"
                                },
                                max_dist: {
                                    description: "Distance maximale que cet Entité regardera pour ramasser des items.",
                                    default: 0,
                                    type: "number"
                                },
                                pickup_based_on_chance: {
                                    description: "Si vrai, en fonction de la difficulté, il y a une chance aléatoire que le mob ne puisse pas ramasser d'items.",
                                    default: false,
                                    type: "boolean"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace vers les items.",
                                    default: 1,
                                    type: "number"
                                },
                                track_target: {
                                    description: "Si vrai, le mob suivra la cible lorsqu'il ramasse des items.",
                                    default: false,
                                    type: "boolean"
                                },
                            }
                        },
                        "minecraft:behavior.play": {
                            description: "Force une Entité à jouer avec d'autres entités en se poursuivant et en se déplaçant aléatoirement.  Type: `Object`. Utilisable que par les villageois.",
                            type: "object",
                            properties: {
                                chance_to_start: {
                                    description: "La chance en pourcentage que le mob commence cet objectif, de 0 à 1.",
                                    default: 0,
                                    type: "number",
                                    minimum: 0,
                                    maximum: 1
                                },
                                follow_distance: {
                                    description: "La distance (en blocs) que le mob essaie d'être à portée de l'ami qu'il suit.",
                                    default: 2,
                                    type: "integer"
                                },
                                friend_search_area: {
                                    description: "Les dimensions de l'AABB utilisées pour rechercher un ami potentiel avec qui jouer.",
                                    default: [6,3,6],
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: {
                                        type: "number"
                                    }
                                },
                                friend_types: {
                                    description: "Le(s) type(s) d'entité à considérer lors de la recherche d'un ami potentiel avec qui jouer.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                max_play_duration_seconds: {
                                    description: "La durée maximale en secondes que le mob jouera avant de quitter l'objectif.",
                                    default: 50,
                                    type: "number"
                                },
                                random_pos_search_height: {
                                    description: "La hauteur (en blocs) dans laquelle le mob cherchera pour trouver une position aléatoire où se déplacer. Doit être d'au moins 1.",
                                    default: 3,
                                    type: "integer",
                                    minimum: 1
                                },
                                random_pos_search_range: {
                                    description: "La distance (en blocs) dans laquelle le mob cherchera pour trouver une position aléatoire où se déplacer.",
                                    default: 16,
                                    type: "integer",
                                    minimum: 1
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle joue.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.play_dead": {
                            description: "Permet à l'Entité de faire semblant d'être morte pour éviter d'être ciblée par des attaquants.",
                            type: "object",
                            properties: {
                                apply_regeneration: {
                                    description: "Détermine si l'entité recevra l'effet de régénération tout en jouant mort.",
                                    default: true,
                                    type: "boolean"
                                },
                                damage_sources: {
                                    description: "La liste des sources de dégâts qui peuvent déclencher le comportement de mort.",
                                    default: "all",
                                },
                                duration: {
                                    description: "La durée en secondes pendant laquelle l'entité jouera la morte.",
                                    default: 1,
                                    type: "number"
                                },
                                filters: {
                                    description: "Les conditions requises pour que l'entité joue la morte.",
                                },
                                force_below_health: {
                                    description: "La quantité de santé à laquelle les dégâts feront jouer l'entité morte.",
                                    default: 0,
                                    type: "integer"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                random_damage_range: {
                                    description: "La plage de dégâts qui peuvent déclencher le comportement de mort en fonction de l'aléatoire. Les dégâts subis en dessous du minimum ne déclencheront jamais le comportement. Les dégâts subis au-dessus du maximum déclencheront toujours le comportement.",
                                    default: [0,0],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                                random_start_chance: {
                                    description: "La probabilité que cet objectif commence lors de la prise de dégâts.",
                                    default: 1,
                                    type: "number",
                                    minimum: 0,
                                    maximum: 1
                                },
                            }
                        },
                        "minecraft:behavior.player_ride_tamed": {
                            description: "Permet à l'Entité d'être chevauché après avoir été apprivoisée par un joueur.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.raid_garden": {
                            description: "Permet à l'Entité de manger/piller les cultures des fermes jusqu'à ce qu'elles soient pleines.",
                            type: "object",
                            properties: {
                                blocks: {
                                    description: "Les blocs que le mob recherche pour manger/piller.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                eat_delay: {
                                    description: "Le temps en secondes entre chaque fois qu'il mange/pille.",
                                    default: 2,
                                    type: "integer"
                                },
                                full_delay: {
                                    description: "Le temps en secondes avant que ce mob veuille manger/piller à nouveau après avoir atteint son maximum.",
                                    default: 100,
                                    type: "integer"
                                },
                                goal_radius: {
                                    description: "La distance en blocs à l'intérieur de laquelle l'entité considère avoir atteint l'objectif.",
                                    default: 0.5,
                                    type: "number"
                                },
                                initial_eat_delay: {
                                    description: "Le temps en secondes avant de commencer à manger/piller une fois arrivé.",
                                    default: 0,
                                    type: "integer"
                                },
                                max_to_eat: {
                                    description: "Le nombre maximum de cultures que cette entité veut manger/piller. Si défini à zéro ou moins, il n'a pas de maximum.",
                                    default: 6,
                                    type: "integer"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                search_height: {
                                    description: "La plage de hauteurs à partir de laquelle rechercher des blocs.",
                                    default: 1,
                                    type: "integer"
                                },
                                search_range: {
                                    description: "La plage de distances à partir de laquelle rechercher des blocs.",
                                    default: 0,
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace vers les blocs.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.ram_attack": {
                            description: "Force une Entité à rechercher une cible aléatoire et, si un chemin direct existe entre l'entité et la cible, elle effectuera une charge. Si l'attaque touche, la cible sera repoussée en fonction de la vitesse de l'entité.",
                            type: "object",
                            properties: {
                                baby_knockback_modifier: {
                                    description: "Le modificateur de recul que les bébés ont.",
                                    default: 0.3333333,
                                    type: "number"
                                },
                                cooldown_range: {
                                    description: "La plage de temps (en secondes) entre chaque attaque de charge.",
                                    default: [10,20],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                                knockback_force: {
                                    description: "La force du recul de l'attaque de charge.",
                                    default: 5,
                                    type: "number"
                                },
                                knockback_height: {
                                    description: "La hauteur du recul de l'attaque de charge.",
                                    default: 0.1,
                                    type: "number"
                                },
                                min_ram_distance: {
                                    description: "La distance minimale à laquelle l'entité peut commencer une attaque de charge.",
                                    default: 0,
                                    type: "number"
                                },
                                on_start: {
                                    description: "L'événement à déclencher lors de l'attaque.",
                                },
                                pre_ram_sound: {
                                    description: "Le son à jouer lorsque l'entité est sur le point de commencer une attaque de charge.",
                                    type: "string"
                                },
                                priority: {
                                    description: "La priorité de l'attaque de charge.",
                                    type: "integer"
                                },
                                ram_distance: {
                                    description: "La distance maximale à laquelle l'entité peut commencer une attaque de charge.",
                                    default: 0,
                                    type: "number"
                                },
                                ram_impact_sound: {
                                    description: "Le son à jouer lorsque l'entité touche une cible avec une attaque de charge.",
                                    type: "string"
                                },
                                ram_speed: {
                                    description: "La vitesse de l'entité lorsqu'elle charge vers la cible.",
                                    default: 2,
                                    type: "number"
                                },
                                run_speed: {
                                    description: "La vitesse de l'entité lorsqu'elle court vers la cible.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.random_breach": {
                            description: "Force une Entité à briser la surface de l'eau à un intervalle aléatoire.",
                            type: "object",
                            properties: {
                                cooldown_time: {
                                    description: "Le temps en secondes que l'entité doit attendre avant de pouvoir utiliser à nouveau l'objectif.",
                                    default: 0,
                                    type: "number"
                                },
                                interval: {
                                    description: "Une valeur aléatoire pour déterminer quand se déplacer aléatoirement quelque part. Cela a une chance de 1/interval de choisir cet objectif.",
                                    default: 120,
                                    type: "integer"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace vers la surface de l'eau.",
                                    default: 1,
                                    type: "number"
                                },
                                xz_dist: {
                                    description: "La distance en blocs sur le sol que le mob cherchera un nouvel endroit où se déplacer. Doit être d'au moins 1.",
                                    default: 10,
                                    type: "integer",
                                    minimum: 1
                                },
                                y_dist: {
                                    description: "La distance en blocs au-dessus de la surface de l'eau que le mob cherchera un nouvel endroit où se déplacer. Doit être d'au moins 1.",
                                    default: 7,
                                    type: "integer",
                                    minimum: 1
                                },
                            }
                        },
                        "minecraft:behavior.random_fly": {
                            description: "Force une Entité à voler vers un endroit aléatoire.",
                            type: "object",
                            properties: {
                                can_land_on_trees: {
                                    description: "Si vrai, le mob peut arrêter de voler et atterrir sur un arbre au lieu du sol.",
                                    default: true,
                                    type: "boolean"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                xz_dist: {
                                    description: "La distance en blocs sur le sol que le mob cherchera un nouvel endroit où se déplacer. Doit être d'au moins 1.",
                                    default: 10,
                                    type: "integer",
                                    minimum: 1
                                },
                                y_dist: {
                                    description: "La distance en blocs au-dessus du sol que le mob cherchera un nouvel endroit où se déplacer. Doit être d'au moins 1.",
                                    default: 7,
                                    type: "integer",
                                    minimum: 1
                                },
                            }
                        },
                        "minecraft:behavior.random_hover": {
                            description: "Force une Entité à planer aléatoirement, près de la surface.",
                            type: "object",
                            properties: {
                                hover_height: {
                                    description: "La hauteur au-dessus de la surface que l'Entité essaiera de maintenir.",
                                    default: [0,0],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                                interval: {
                                    description: "Une valeur aléatoire pour déterminer quand se déplacer aléatoirement quelque part. Cela a une chance de 1/interval de choisir cet objectif.",
                                    default: 120,
                                    type: "integer"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace vers la surface.",
                                    default: 1,
                                    type: "number"
                                },
                                xz_dist: {
                                    description: "La distance en blocs sur le sol que le mob cherchera un nouvel endroit où se déplacer. Doit être d'au moins 1.",
                                    default: 10,
                                    type: "integer",
                                    minimum: 1
                                },
                                y_dist: {
                                    description: "La distance en blocs au-dessus de la surface que le mob cherchera un nouvel endroit où se déplacer. Doit être d'au moins 1.",
                                    default: 7,
                                    type: "integer",
                                    minimum: 1
                                },
                                y_offset: {
                                    description: "La hauteur en blocs à ajouter à la position cible sélectionnée.",
                                    default: 0,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.random_look_around": {
                            description: "Force une Entité à choisir une direction aléatoire pour regarder pendant une durée aléatoire dans une plage.",
                            type: "object",
                            properties: {
                                look_time: {
                                    description: "La plage de temps en secondes que le mob restera à regarder dans une direction aléatoire avant de regarder ailleurs.",
                                    default: [2,4],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                                max_angle_of_view_horizontal: {
                                    description: "L'angle le plus à droite qu'un mob peut regarder sur le plan horizontal par rapport à sa direction initiale.",
                                    default: 30,
                                    type: "integer"
                                },
                                min_angle_of_view_horizontal: {
                                    description: "L'angle le plus à gauche qu'un mob peut regarder sur le plan horizontal par rapport à sa direction initiale.",
                                    default: -30,
                                    type: "integer"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.random_look_around_and_sit": {
                            description: "Force une Entité à s'asseoir en place et à regarder autour dans différentes directions. L'entité doit avoir une animation d'assise configurée pour utiliser cet objectif.",
                            type: "object",
                            properties: {
                                continue_if_leashed: {
                                    description: "Détermine si l'objectif doit continuer d'être utilisé si l'entité est attachée.",
                                    default: false,
                                    type: "boolean"
                                },
                                continue_sitting_on_reload: {
                                    description: "Lorsque défini sur 'true', l'entité restera assise lors du rechargement.",
                                    default: false,
                                    type: "boolean"
                                },
                                max_angle_of_view_horizontal: {
                                    description: "L'angle le plus à droite qu'un mob peut regarder sur le plan horizontal par rapport à sa direction initiale.",
                                    default: 30,
                                    type: "number"
                                },
                                max_look_count: {
                                    description: "Le nombre maximum de regards uniques qu'une entité aura tout en regardant autour d'elle.",
                                    default: 2,
                                    type: "integer"
                                },
                                max_look_time: {
                                    description: "La durée maximale (en ticks) pendant laquelle une entité restera à regarder dans une direction tout en regardant autour d'elle.",
                                    default: 40,
                                    type: "integer"
                                },
                                min_angle_of_view_horizontal: {
                                    description: "L'angle le plus à gauche qu'un mob peut regarder sur le plan horizontal par rapport à sa direction initiale.",
                                    default: -30,
                                    type: "number"
                                },
                                min_look_count: {
                                    description: "Le nombre minimum de regards uniques qu'une entité aura tout en regardant autour d'elle.",
                                    default: 1,
                                    type: "integer"
                                },
                                min_look_time: {
                                    description: "La durée minimale (en ticks) pendant laquelle une entité restera à regarder dans une direction tout en regardant autour d'elle.",
                                    default: 20,
                                    type: "integer"
                                },
                                probability: {
                                    description: "La probabilité que l'entité regarde autour d'elle.",
                                    default: 0.02,
                                    type: "number"
                                },
                                random_look_around_cooldown: {
                                    description: "Le temps en secondes avant que l'objectif puisse être utilisé à nouveau.",
                                    default: 0,
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.random_search_and_dig": {
                            description: "Force une Entité à localiser un bloc cible aléatoire vers lequel elle peut trouver un chemin. Une fois trouvé, l'Entité se déplacera vers le bloc cible et creusera un item.",
                            type: "object",
                            properties: {
                                cooldown_range: {
                                    description: "La plage de temps (en secondes) entre chaque recherche de bloc cible.",
                                    default: [0,0],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                                digging_duration_range: {
                                    description: "La plage de temps (en secondes) que l'Entité passera à creuser le bloc cible.",
                                    default: [0,0],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                                find_valid_position_retries: {
                                    description: "Le nombre de tentatives pour trouver une position cible valide dans la plage de recherche.",
                                    default: 0,
                                    type: "number"
                                },
                                goal_radius: {
                                    description: "La distance en blocs à l'intérieur de laquelle l'entité considère avoir atteint l'objectif.",
                                    default: 1.5,
                                    type: "number"
                                },
                                item_table: {
                                    description: "Le chemin du fichier relatif à la racine du pack de comportement pour la liste des items à spawner (Loot Table).",
                                    type: "string"
                                },
                                on_digging_start: {
                                    description: "L'événement à déclencher lorsque la recherche se termine et que le creusage commence.",
                                },
                                on_fail_during_digging: {
                                    description: "Evénement à déclencher lorsque l'objectif échoue pendant l'état de creusage.",
                                },
                                on_fail_during_searching: {
                                    description: "Evénement à déclencher lorsque l'objectif échoue pendant l'état de recherche.",
                                },
                                on_item_found: {
                                    description: "L'événement à déclencher lorsqu'un item est trouvé.",
                                },
                                on_searching_start: {
                                    description: "L'événement à déclencher lorsque la recherche commence.",
                                },
                                on_success: {
                                    description: "L'événement à déclencher lorsque la recherche et le creusage sont terminés.",
                                },
                                search_range_xz: {
                                    description: "La largeur et la longueur du volume autour de l'entité utilisé pour trouver une position cible valide.",
                                    default: 0,
                                    type: "number"
                                },
                                search_range_y: {
                                    description: "La hauteur du volume autour de l'entité utilisé pour trouver une position cible valide.",
                                    default: 0,
                                    type: "number"
                                },
                                spawn_item_after_seconds: {
                                    description: "La durée en secondes avant de spawner l'item.",
                                    default: 0,
                                    type: "number"
                                },
                                spawn_item_pos_offset: {
                                    description: "La distance pour décaler l'emplacement de spawn de l'item dans la direction vers laquelle le mob est tourné.",
                                    default: 0,
                                    type: "number"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace vers le bloc cible.",
                                    default: 0,
                                    type: "number"
                                },
                                target_blocks: {
                                    description: "La liste des types de blocs cibles sur lesquels l'objectif cherchera à creuser. Remplace la liste par défaut.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                target_dig_position_offset: {
                                    description: "Le décalage de la position de creusage cible par rapport à la position des pieds de l'entité dans sa direction.",
                                    default: 2.25,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.random_sitting": {
                            description: "Force une Entité à s'asseoir et à rester assise pendant une durée aléatoire.",
                            type: "object",
                            properties: {
                                cooldown_time: {
                                    description: "Le temps en secondes que l'entité doit attendre avant de pouvoir utiliser à nouveau l'objectif.",
                                    default: 0,
                                    type: "number"
                                },
                                min_sit_time: {
                                    description: "La durée minimale en secondes avant que l'entité puisse se relever.",
                                    default: 10,
                                    type: "number"
                                },
                                start_chance: {
                                    description: "La chance que l'entité commence cet objectif, de 0 à 1.",
                                    default: 0.1,
                                    type: "number",
                                    minimum: 0,
                                    maximum: 1
                                },
                                stop_chance: {
                                    description: "La chance que l'entité arrête cet objectif, de 0 à 1.",
                                    default: 0.3,
                                    type: "number",
                                    minimum: 0,
                                    maximum: 1
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.random_stroll": {
                            description: "Force une Entité à choisir une direction aléatoire vers laquelle marcher.",
                            type: "object",
                            properties: {
                                interval: {
                                    description: "Une valeur aléatoire pour déterminer quand se déplacer aléatoirement quelque part. Cela a une chance de 1/interval de choisir cet objectif.",
                                    default: 120,
                                    type: "integer"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace.",
                                    default: 1,
                                    type: "number"
                                },
                                xz_dist: {
                                    description: "La distance en blocs sur le sol que le mob cherchera un nouvel endroit où se déplacer. Doit être d'au moins 1.",
                                    default: 10,
                                    type: "integer",
                                    minimum: 1
                                },
                                y_dist: {
                                    description: "La distance en blocs au-dessus du sol que le mob cherchera un nouvel endroit où se déplacer. Doit être d'au moins 1.",
                                    default: 7,
                                    type: "integer",
                                    minimum: 1
                                },
                            }
                        },
                        "minecraft:behavior.random_swim": {
                            description: "Force une Entité à nager vers un point aléatoire dans l'eau.",
                            type: "object",
                            properties: {
                                avoid_surface: {
                                    description: "Si vrai, l'entité évitera les blocs d'eau de surface en nageant en dessous.",
                                    default: true,
                                    type: "boolean"
                                },
                                interval: {
                                    description: "Une valeur aléatoire pour déterminer quand se déplacer aléatoirement quelque part. Cela a une chance de 1/interval de choisir cet objectif.",
                                    default: 120,
                                    type: "integer"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle nage.",
                                    default: 1,
                                    type: "number"
                                },
                                xz_dist: {
                                    description: "La distance en blocs sur le sol que le mob cherchera un nouvel endroit où se déplacer. Doit être d'au moins 1.",
                                    default: 10,
                                    type: "integer",
                                    minimum: 1
                                },
                                y_dist: {
                                    description: "La distance en blocs au-dessus de la surface de l'eau que le mob cherchera un nouvel endroit où se déplacer. Doit être d'au moins 1.",
                                    default: 7,
                                    type: "integer",
                                    minimum: 1
                                },
                            }
                        },
                        "minecraft:behavior.ranged_attack": {
                            description: "Force une Entité à attaquer en utilisant des tirs à distance. `charge_shoot_trigger` doit être supérieur à 0 pour activer les attaques de tir en rafale chargées. Nécessite `minecraft:shooter` pour définir le comportement du projectile.",
                            type: "object",
                            properties: {
                                attack_interval: {
                                    description: "Alternative to 'attack_interval_min' & 'attack_interval_max'. Temps de rechargement constant (en secondes), lorsqu'on n'utilise pas de tir chargé. Ne s'adapte pas à la distance de la cible.",
                                    default: 0,
                                    type: "number"
                                },
                                attack_interval_max: {
                                    description: "Limite supérieure de la plage de temps de rechargement (en secondes), lorsqu'on n'utilise pas de tir chargé. La plage de temps de rechargement s'adapte à la distance de la cible.",
                                    default: 0,
                                    type: "number"
                                },
                                attack_interval_min: {
                                    description: "Limite inférieure de la plage de temps de rechargement (en secondes), lorsqu'on n'utilise pas de tir chargé. La plage de temps de rechargement s'adapte à la distance de la cible.",
                                    default: 0,
                                    type: "number"
                                },
                                attack_radius: {
                                    description: "La distance minimale à laquelle l'entité doit être de la cible avant de tirer.",
                                    default: 0,
                                    type: "number"
                                },
                                attack_radius_min: {
                                    description: "La distance minimale à laquelle la cible peut être pour que ce mob tire. Si la cible est plus proche, ce mob se déplacera d'abord avant de tirer.",
                                    default: 0,
                                    type: "number"
                                },
                                burst_interval: {
                                    description: "Le temps (en secondes) entre chaque tir individuel lorsqu'on tire une rafale de tirs à partir d'une attaque chargée.",
                                    default: 0,
                                    type: "number"
                                },
                                burst_shots: {
                                    description: "Le nombre de tirs tirés à chaque fois que l'entité attaquante utilise une attaque chargée.",
                                    default: 1,
                                    type: "integer"
                                },
                                charge_charged_trigger: {
                                    description: "Le temps (en secondes, puis ajoutez 'charge_shoot_trigger') avant qu'une attaque chargée ne soit complètement chargée. Le temps de charge diminue lorsque la cible n'est pas en vue.",
                                    default: 0,
                                    type: "number"
                                },
                                charge_shoot_trigger: {
                                    description: "Le temps (en secondes, puis doublez) qu'un tir chargé doit être chargé avant de recharger les tirs en rafale. Le temps de charge diminue lorsque la cible n'est pas en vue.",
                                    default: 0,
                                    type: "number"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                ranged_fov: {
                                    description: "Le champ de vision (en degrés) lors de l'utilisation de la détection pour détecter une cible pour l'attaque.",
                                    default: 90,
                                    type: "number"
                                },
                                set_persistent: {
                                    description: "Permet à l'entité d'être définie pour persister lorsqu'elle cible un joueur.",
                                    default: false,
                                    type: "boolean"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace pour attaquer.",
                                    default: 1,
                                    type: "number"
                                },
                                swing: {
                                    description: "Si une animation de swing (en utilisant variable.attack_time) existe, cela force l'entité à balancer son bras lorsqu'elle tire l'attaque à distance.",
                                    default: false,
                                    type: "boolean"
                                },
                                target_in_sight_time: {
                                    description: "La durée minimale (en secondes) pendant laquelle l'entité doit voir la cible avant de se déplacer vers elle.",
                                    default: 1,
                                    type: "number"
                                },
                                x_max_rotation: {
                                    description: "La rotation maximale (en degrés), sur l'axe X, que cette entité peut effectuer tout en essayant de regarder la cible.",
                                    default: 30,
                                    type: "number"
                                },
                                y_max_head_rotation: {
                                    description: "La rotation maximale (en degrés), sur l'axe Y, que cette entité peut effectuer tout en essayant de regarder la cible.",
                                    default: 30,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.receive_love": {
                            description: "Force une Entité à s'accoupler avec une autre entité similaire lorsqu'elle s'approche pour se reproduire.  Type: `Object`. Ce comportement ne peut être utilisé que par le type d'entité villageois.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace pour s'accoupler.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.restrict_open_door": {
                            description: "Force une Entité à rester à l'intérieur pendant la nuit.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.restrict_sun": {
                            description: "Force une Entité à éviter activement la lumière directe du soleil.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.rise_to_liquid_level": {
                            description: "Force une Entité à remonter au sommet d'un bloc liquide si elle se trouve dans un bloc liquide ou a été générée sous un bloc liquide.",
                            type: "object",
                            properties: {
                                liquid_y_offset: {
                                    description: "La hauteur en blocs à ajouter à la position de l'entité lorsqu'elle remonte à la surface.",
                                    default: 0,
                                    type: "number"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                rise_delta: {
                                    description: "Le déplacement pour combien l'entité se déplacera vers le haut dans l'axe vertical.",
                                    default: 0,
                                    type: "number"
                                },
                                sink_delta: {
                                    description: "Le déplacement pour combien l'entité se déplacera vers le bas dans l'axe vertical.",
                                    default: 0,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.roar": {
                            description: "Force une Entité à rugir vers une autre entité en fonction des données de `minecraft:anger_level`. Lorsque le seuil de colère spécifié dans `minecraft:anger_level` est atteint, cette entité rugira pendant la durée spécifiée, regardera l'autre entité, appliquera un boost de colère envers elle, et enfin la ciblera.",
                            type: "object",
                            properties: {
                                duration: {
                                    description: "La durée en secondes pendant laquelle l'entité rugira.",
                                    default: 0,
                                    type: "number"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.roll": {
                            description: "Force une Entité à rouler vers l'avant.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                probability: {
                                    description: "La probabilité que l'entité roule.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.run_around_like_crazy": {
                            description: "Force une Entité à courir sans but.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle court.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.scared": {
                            description: "Force une Entité à avoir peur lorsqu'il y a un orage.",
                            type: "object",
                            properties: {
                                sound_interval: {
                                    description: "L'intervalle dans lequel un son se jouera lorsqu'il est actif dans une chance de 1/délai pour démarrer.",
                                    default: 0,
                                    type: "integer"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.send_event": {
                            description: "Force une Entité à envoyer un événement à une autre entité.",
                            type: "object",
                            properties: {
                                cast_duration: {
                                    description: "Le temps en secondes pour l'ensemble du processus d'envoi d'événement.",
                                    type: "number"
                                },
                                look_at_target: {
                                    description: "Si vrai, le mob regardera l'entité à laquelle il envoie un événement.",
                                    default: true,
                                    type: "boolean"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                sequence: {
                                    description: "La liste des événements à envoyer.",
                                    type: "array",
                                    items: {
                                        type: "object"
                                    }
                                },
                            }
                        },
                        "minecraft:behavior.share_items": {
                            description: "Force une Entité à partager des items qu'elle a dans son inventaire avec d'autres entités spécifiques qui ont été définies.",
                            type: "object",
                            properties: {
                                entity_types: {
                                    description: "La liste des types d'entités avec lesquelles cette entité partagera des items.",
                                    type: "object"
                                },
                                goal_radius: {
                                    description: "La distance en blocs à l'intérieur de laquelle l'entité considère avoir atteint l'objectif.",
                                    default: 0.5,
                                    type: "number"
                                },
                                max_dist: {
                                    description: "Distance maximale en blocs à laquelle ce mob cherchera des entités avec lesquelles partager des items.",
                                    default: 0,
                                    type: "number"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace pour partager des items.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.silverfish_merge_with_stone": {
                            description: "Force une Entité à entrer dans un bloc de pierre.  Type: `Object`. Ce comportement ne peut être utilisé que par le type d'entité poisson d'argent.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.silverfish_wake_up_friends": {
                            description: "Force une Entité à alerter d'autres entités de la même famille pour sortir d'un bloc de pierre.  Type: `Object`. Ce comportement ne peut être utilisé que par le type d'entité poisson d'argent. Ce comportement nécessite que `minecraft:behavior.silverfish_merge_with_stone` soit défini.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.skeleton_horse_trap": {
                            description: "Force une Entité à fonctionner comme un piège à cheval squelette et à être déclenchée, invoquant un éclair, des chevaux squelettes supplémentaires et des cavaliers de chevaux squelettes, lorsqu'un joueur s'approche dans un rayon défini.  Type: `Object`. Ce comportement ne peut être utilisé que par le type d'entité cheval, mule, âne et cheval squelette.",
                            type: "object",
                            properties: {
                                duration: {
                                    description: "La durée en secondes pendant laquelle le piège existe. Après ce laps de temps écoulé, le piège est retiré du monde s'il n'a pas été activé.",
                                    default: 1,
                                    type: "number"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                within_radius: {
                                    description: "La distance en blocs à l'intérieur de laquelle un joueur doit être pour activer le piège.",
                                    default: 0,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.sleep": {
                            description: "Force une Entité à dormir dans un lit.  Type: `Object`. Ce comportement ne peut être utilisé que par le type d'entité villageois.",
                            type: "object",
                            properties: {
                                can_sleep_while_riding: {
                                    description: "Si vrai, le mob pourra utiliser l'objectif de sommeil s'il monte quelque chose.",
                                    default: false,
                                    type: "boolean"
                                },
                                cooldown_time: {
                                    description: "Le temps en secondes que le mob doit attendre avant de pouvoir utiliser l'objectif à nouveau.",
                                    default: 0,
                                    type: "number"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                sleep_collider_height: {
                                    description: "La hauteur du collider du mob pendant le sommeil.",
                                    default: 1,
                                    type: "number"
                                },
                                sleep_collider_width: {
                                    description: "La largeur du collider du mob pendant le sommeil.",
                                    default: 1,
                                    type: "number"
                                },
                                sleep_y_offset: {
                                    description: "Le décalage y du collider du mob pendant le sommeil.",
                                    default: 1,
                                    type: "number"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace pour dormir.",
                                    default: 1,
                                    type: "number"
                                },
                                timeout_cooldown: {
                                    description: "Le temps en secondes que le mob doit attendre avant de pouvoir utiliser l'objectif à nouveau après avoir été réveillé.",
                                    default: 8,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.slime_attack": {
                            description: "Active les entités avec `minecraft:movement.jump` pour se diriger vers leur cible comme le fait un slime ou un cube de magma pour attaquer. Pour attaquer, l'entité doit avoir un `runtime_identifier` défini sur `minecraft:slime` et un composant `variant` avec une valeur supérieure à 1. Sinon, elle se dirigera toujours vers une cible mais ne causera pas de dégâts.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                set_persistent: {
                                    description: "Permet à l'entité d'être définie pour persister lorsqu'elle cible un joueur.",
                                    default: false,
                                    type: "boolean"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace pour attaquer.",
                                    default: 1,
                                    type: "number"
                                },
                                x_max_rotation: {
                                    description: "La rotation maximale (en degrés), sur l'axe X, que cette entité peut effectuer tout en essayant de regarder la cible.",
                                    default: 10,
                                    type: "number"
                                },
                                y_max_rotation: {
                                    description: "La rotation maximale (en degrés sur l'axe Y) que cette entité peut effectuer tout en essayant de regarder la cible.",
                                    default: 10,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.slime_float": {
                            description: "Force une Entité à flotter dans l'eau ou la lave.  Type: `Object`. Ce comportement ne peut être utilisé que par le type d'entité slime et cube de magma.",
                            type: "object",
                            properties: {
                                jump_chance_percentage: {
                                    description: "La probabilité que l'entité saute.",
                                    default: 0.8,
                                    type: "number"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle flotte.",
                                    default: 1.2,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.slime_keep_on_jumping": {
                            description: "Force une Entité à sauter continuellement comme un slime.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle saute.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.slime_random_direction": {
                            description: "Force une Entité à se déplacer dans des directions aléatoires comme un slime.",
                            type: "object",
                            properties: {
                                add_random_time_range: {
                                    description: "Temps supplémentaire (en secondes entières), choisi aléatoirement dans la plage de [0, `add_random_time_range`], à ajouter à `min_change_direction_time`.",
                                    default: 3,
                                    type: "integer"
                                },
                                min_change_direction_time: {
                                    description: "Temps minimum (en secondes entières) à attendre avant de choisir une nouvelle direction.",
                                    default: 2,
                                    type: "number"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                turn_range: {
                                    description: "Plage d'angle de rotation maximale (en degrés) lors du choix aléatoire d'une nouvelle direction.",
                                    default: 360,
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.snacking": {
                            description: "Force une Entité à s'arrêter et à interagir avec des items alimentaires sélectionnés qui sont à proximité.",
                            type: "object",
                            properties: {
                                items: {
                                    description: "Les items que l'entité peut manger.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                snacking_cooldown: {
                                    description: "Le temps en secondes que le mob doit attendre avant de pouvoir manger à nouveau.",
                                    default: 7.5,
                                    type: "number"
                                },
                                snacking_cooldown_min: {
                                    description: "Le temps minimum en secondes que le mob doit attendre avant de pouvoir manger à nouveau.",
                                    default: 0.5,
                                    type: "number"
                                },
                                snacking_stop_chance: {
                                    description: "La chance que le mob arrête de manger, de 0 à 1.",
                                    default: 0.0017,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.sneeze": {
                            description: "Force une Entité à s'arrêter et à éternuer, ce qui peut effrayer les entités à proximité et faire tomber un item.",
                            type: "object",
                            properties: {
                                cooldown_time: {
                                    description: "Le temps en secondes que le mob doit attendre avant de pouvoir utiliser l'objectif à nouveau.",
                                    default: 0,
                                    type: "number"
                                },
                                drop_item_chance: {
                                    description: "La probabilité que le mob laisse tomber un item lorsqu'il éternue.",
                                    default: 1,
                                    type: "number"
                                },
                                entity_types: {
                                    description: "La liste des types d'entités à effrayer lorsqu'elles éternuent.",
                                    type: "object"
                                },
                                loot_table: {
                                    description: "Loot Table à partir de laquelle sélectionner les items laissés tomber.",
                                    type: "string"
                                },
                                prepare_sound: {
                                    description: "Le son à jouer lorsque l'éternuement est sur le point de se produire.",
                                    type: "string"
                                },
                                prepare_time: {
                                    description: "Le temps en secondes que le mob prend pour se préparer à éternuer (pendant que le son de préparation se joue).",
                                    default: 1,
                                    type: "number"
                                },
                                probability: {
                                    description: "La probabilité d'éternuer. Une valeur de 1,00 est de 100%.",
                                    default: 0.02,
                                    type: "number"
                                },
                                sound: {
                                    description: "Le son à jouer lorsque l'éternuement se produit.",
                                    type: "string"
                                },
                                within_radius: {
                                    description: "La distance en blocs à l'intérieur de laquelle un joueur doit être pour activer l'éternuement.",
                                    default: 0,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.sniff": {
                            description: "Force une Entité à détecter le joueur le plus proche dans un rayon spécifique et à mettre à jour son état de composant `minecraft:suspect_tracking`.",
                            type: "object",
                            properties: {
                                cooldown_range: {
                                    description: "La plage de temps en secondes entre les reniflements.",
                                    default: [3,10],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                                duration: {
                                    description: "La durée en secondes pendant laquelle l'entité renifle.",
                                    default: 1,
                                    type: "number"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                sniffing_radius: {
                                    description: "Rayon de détection des entités.",
                                    default: 5,
                                    type: "number"
                                },
                                suspicion_radius_horizontal: {
                                    description: "Rayon de suspicion horizontal des entités. Lorsqu'un joueur est à l'intérieur de ce rayon horizontalement, le niveau de colère envers ce joueur est augmenté.",
                                    default: 3,
                                    type: "number"
                                },
                                suspicion_radius_vertical: {
                                    description: "Rayon de suspicion vertical des entités. Lorsqu'un joueur est à l'intérieur de ce rayon verticalement, le niveau de colère envers ce joueur est augmenté.",
                                    default: 3,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.sonic_boom": {
                            description: "Force une Entité à effectuer une attaque à distance de type 'sonic boom'.",
                            type: "object",
                            properties: {
                                attack_cooldown: {
                                    description: "Le temps en secondes nécessaire après avoir utilisé cette attaque jusqu'à ce que l'entité puisse utiliser à nouveau le sonic boom.",
                                    default: 5,
                                    type: "number"
                                },
                                attack_damage: {
                                    description: "Les dégâts infligés par l'attaque.",
                                    default: 30,
                                    type: "number"
                                },
                                attack_range_horizontal: {
                                    description: "La portée horizontale (en blocs) à laquelle le sonic boom peut endommager la cible.",
                                    default: 15,
                                    type: "number"
                                },
                                attack_range_vertical: {
                                    description: "La portée verticale (en blocs) à laquelle le sonic boom peut endommager la cible.",
                                    default: 20,
                                    type: "number"
                                },
                                attack_sound: {
                                    description: "Le son à jouer lorsque l'attaque est utilisée.",
                                    type: "string"
                                },
                                charge_sound: {
                                    description: "L'événement sonore à jouer lorsque l'attaque est chargée.",
                                    type: "string"
                                },
                                duration: {
                                    description: "La durée en secondes pendant laquelle l'entité charge l'attaque.",
                                    default: 3,
                                    type: "number"
                                },
                                duration_until_attack_sound: {
                                    description: "La durée en secondes avant que le son de l'attaque ne soit joué.",
                                    default: 1.7,
                                    type: "number"
                                },
                                knockback_height_cap: {
                                    description: "La hauteur maximale de déplacement vertical du knockback de l'attaque.",
                                    default: 0,
                                    type: "number"
                                },
                                knockback_horizontal_strength: {
                                    description: "La force horizontale du knockback de l'attaque appliquée à la cible de l'attaque.",
                                    default: 0,
                                    type: "number"
                                },
                                knockback_vertical_strength: {
                                    description: "La force verticale du knockback de l'attaque appliquée à la cible de l'attaque.",
                                    default: 0,
                                    type: "number"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace pour attaquer.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.squid_dive": {
                            description: "Force une Entité à plonger sous l'eau.  Type: `Object`. Ce comportement ne peut être utilisé que par le type d'entité pieuvre.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.squid_flee": {
                            description: "Force une Entité à nager loin lorsqu'elle est attaquée.  Type: `Object`. Ce comportement ne peut être utilisé que par le type d'entité pieuvre.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.squid_idle": {
                            description: "Force une Entité à nager sur place.  Type: `Object`. Ce comportement ne peut être utilisé que par le type d'entité pieuvre.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.squid_move_away_from_ground": {
                            description: "Force une Entité à nager loin des blocs du sol.  Type: `Object`. Ce comportement ne peut être utilisé que par le type d'entité pieuvre.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.squid_out_of_water": {
                            description: "Force une Entité à rester proche d'un bloc de sol lorsqu'elle est hors de l'eau.  Type: `Object`. Ce comportement ne peut être utilisé que par le type d'entité pieuvre.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.stalk_and_pounce_on_target": {
                            description: "Force une Entité à traquer une cible spécifique. Une fois à portée de la cible, l'entité sautera sur la cible et infligera des dégâts en fonction de son attribut d'attaque.  Type: `Object`. Ce comportement nécessite une cible pour fonctionner correctement et un attribut d'attaque pour fonctionner correctement.",
                            type: "object",
                            properties: {
                                interest_time: {
                                    description: "Le temps en secondes pendant lequel le mob sera intéressé avant de bondir. Cela se produit lorsque le mob est à portée de bondir.",
                                    default: 2,
                                    type: "number"
                                },
                                leap_distance: {
                                    description: "La distance en blocs que le mob saute dans la direction de sa cible.",
                                    default: 0.8,
                                    type: "number"
                                },
                                leap_height: {
                                    description: "La hauteur en blocs que le mob saute lorsqu'il bondit sur sa cible.",
                                    default: 0.9,
                                    type: "number"
                                },
                                max_stalk_dist: {
                                    description: "La distance maximale à laquelle la cible peut être avant que le mob n'abandonne le traquage.",
                                    default: 10,
                                    type: "number"
                                },
                                pounce_max_dist: {
                                    description: "La distance maixmale à partir de la cible en blocs pour commencer à bondir sur la cible.",
                                    default: 5,
                                    type: "number"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                set_persistent: {
                                    description: "Permet à l'entité d'être définie pour persister lorsqu'elle cible un joueur.",
                                    default: false,
                                    type: "boolean"
                                },
                                stalk_speed: {
                                    description: "La vitesse de déplacement à laquelle vous traquez votre cible.",
                                    default: 1.2,
                                    type: "number"
                                },
                                strike_dist: {
                                    description: "La distance maximale à laquelle la cible peut être pour infliger des dégâts lors du bond.",
                                    default: 2,
                                    type: "number"
                                },
                                stuck_time: {
                                    description: "Le temps en secondes pendant lequel le mob sera coincé s'il échoue et atterrit sur un bloc sur lequel il peut être coincé.",
                                    default: 2,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.stay_near_noteblock": {
                            description: "Force une Entité à rester près d'un bloc musical récemment joué.",
                            type: "object",
                            properties: {
                                listen_time: {
                                    description: "Le temps en secondes que l'entité doit rester près du bloc musical après l'avoir entendu.",
                                    default: 0,
                                    type: "integer"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                speed: {
                                    description: "Définit la vitesse de l'entité lorsqu'elle se déplace vers le bloc.",
                                    default: 1,
                                    type: "number"
                                },
                                start_distance: {
                                    description: "Définit la distance à laquelle l'entité doit être du bloc pour tenter de démarrer l'objectif.",
                                    default: 10,
                                    type: "number"
                                },
                                stop_distance: {
                                    description: "Définit la distance à laquelle l'entité doit être du bloc pour tenter d'arrêter l'objectif.",
                                    default: 2,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.stay_while_sitting": {
                            description: "Force une Entité à rester assise.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.stomp_attack": {
                            description: "Force une Entité à attaquer en utilisant un comportement de dégâts AoE de stomp.",
                            type: "object",
                            properties: {
                                attack_once: {
                                    description: "Permet à l'entité d'utiliser ce comportement d'attaque une seule fois.",
                                    default: false,
                                    type: "boolean"
                                },
                                attack_types: {
                                    description: "Liste des types d'entités à attaquer.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                can_spread_on_fire: {
                                    description: "Définit si l'entité peut mettre le feu à d'autres entités lorsqu'elle les attaque.",
                                    default: false,
                                    type: "boolean"
                                },
                                cooldown_time: {
                                    description: "Le temps en secondes entre les attaques.",
                                    default: 1,
                                    type: "number"
                                },
                                inner_boundary_time_increase: {
                                    description: "Temps (en secondes) à ajouter au recalcul du chemin d'attaque lorsque la cible est au-delà de la 'path_inner_boundary'.",
                                    default: 0.25,
                                    type: "number"
                                },
                                max_dist: {
                                    description: "Pas utilisé dans le comportement.",
                                    type: "number"
                                },
                                max_path_time: {
                                    description: "Temps maximum (en secondes) pour recalculer le chemin d'attaque.",
                                    default: 0.55,
                                    type: "number"
                                },
                                melee_fov: {
                                    description: "Champ de vision (en degrés) lors de l'utilisation du composant de détection pour détecter une cible d'attaque.",
                                    default: 90,
                                    type: "number"
                                },
                                min_path_time: {
                                    description: "Temps minimum (en secondes) pour recalculer le chemin d'attaque.",
                                    default: 0.2,
                                    type: "number"
                                },
                                no_damage_range_multiplier: {
                                    description: "Multiplication avec la plage de dégâts AoE finale pour déterminer une plage de non-dégâts. L'attaque de stomp sera en cooldown si la cible est dans cette plage de non-dégâts.",
                                    default: 2,
                                    type: "number"
                                },
                                on_attack: {
                                    description: "L'événement à déclencher lorsque l'entité attaque.",
                                },
                                on_kill: {
                                    description: "L'événement à déclencher lorsque l'entité tue une autre entité.",
                                },
                                outer_boundary_time_increase: {
                                    description: "Temps (en secondes) à ajouter au recalculer lorsque la cible est au-delà de la 'path_outer_boundary'.",
                                    default: 0.5,
                                    type: "number"
                                },
                                path_fail_time_increase: {
                                    description: "Temps (en secondes) à ajouter au recalcul du chemin d'attaque lorsque cette entité ne peut pas se déplacer le long du chemin actuel.",
                                    default: 0.75,
                                    type: "number"
                                },
                                path_inner_boundary: {
                                    description: "Distance à laquelle l'entité doit être à l'intérieur pour augmenter le recalcul du chemin d'attaque par 'inner_boundary_tick_increase'.",
                                    default: 16,
                                    type: "number"
                                },
                                path_outer_boundary: {
                                    description: "Distance à laquelle l'entité doit être à l'extérieur pour augmenter le recalcul du chemin d'attaque par 'outer_boundary_tick_increase'.",
                                    default: 32,
                                    type: "number"
                                },
                                priority: {
                                    description: "Plus la priorité est haute, plus vite ce comportement sera exécuté en tant qu'objectif.",
                                    type: "integer"
                                },
                                random_stop_interval: {
                                    description: "Cette entité aura une chance de 1 sur N d'arrêter son attaque actuelle, où N = 'random_stop_interval'.",
                                    default: 0,
                                    type: "integer"
                                },
                                reach_multiplier: {
                                    description: "Utilisé avec la taille de la base de l'entité pour déterminer la distance minimale de la cible avant de tenter de causer des dégâts d'attaque.",
                                    default: 1.5,
                                    type: "number"
                                },
                                require_complete_path: {
                                    description: "Bascule (on/off) la nécessité d'avoir un chemin complet de l'entité à la cible lors de l'utilisation de ce comportement d'attaque.",
                                    default: false,
                                    type: "boolean"
                                },
                                set_persistent: {
                                    description: "Permet à l'entité d'être définie pour persister lorsqu'elle cible un joueur.",
                                    default: false,
                                    type: "boolean"
                                },
                                speed_multiplier: {
                                    description: "Multiplicateur de vitesse de mouvement de l'entité lorsqu'elle utilise cet objectif AI.",
                                    default: 1,
                                    type: "number"
                                },
                                stomp_range_multiplier: {
                                    description: "Multiplié avec la taille de base de l'entité pour déterminer la plage de dégâts AoE de stomp.",
                                    default: 2,
                                    type: "number"
                                },
                                target_dist: {
                                    description: "Inutilisé.",
                                    type: "number"
                                },
                                track_target: {
                                    description: "Permet à l'entité de suivre la cible d'attaque, même si l'entité n'a pas de détection.",
                                    default: true,
                                    type: "boolean"
                                },
                                x_max_rotation: {
                                    description: "Rotation maximale (en degrés) sur l'axe X que cette entité peut tourner lorsqu'elle tente de regarder la cible.",
                                    default: 30,
                                    type: "number"
                                },
                                y_max_head_rotation: {
                                    description: "Rotation maximale (en degrés) sur l'axe Y que cette entité peut tourner la tête lorsqu'elle tente de regarder la cible.",
                                    default: 30,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.stomp_turtle_egg": {
                            description: "Force une Entité à cibler et à écraser des oeufs de tortue lorsqu'ils sont détectés.",
                            type: "object",
                            properties: {
                                goal_radius: {
                                    description: "Le rayon autour de l'entité à l'intérieur duquel les oeufs de tortue sont ciblés.",
                                    default: 0.5,
                                    type: "number"
                                },
                                interval: {
                                    description: "Une valeur aléatoire pour déterminer quand se déplacer aléatoirement quelque part. Cette valeur a une chance de 1/interval de choisir cet objectif.",
                                    default: 120,
                                    type: "integer"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                search_height: {
                                    description: "La hauteur en blocs à laquelle le mob cherchera des oeufs de tortue pour se déplacer vers eux.",
                                    default: 1,
                                    type: "integer"
                                },
                                search_range: {
                                    description: "La distance en blocs à laquelle le mob cherchera des oeufs de tortue pour se déplacer vers eux.",
                                    default: 0,
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace pour écraser des oeufs de tortue.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.stroll_towards_village": {
                            description: "Force une Entité à naviguer et à rechercher un village à proximité.",
                            type: "object",
                            properties: {
                                cooldown_time: {
                                    description: "Le temps en secondes que le mob doit attendre avant de pouvoir utiliser à nouveau l'objectif.",
                                    default: 0,
                                    type: "number"
                                },
                                goal_radius: {
                                    description: "Le rayon autour de l'entité à l'intérieur duquel le village est ciblé.",
                                    default: 0.5,
                                    type: "number"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                search_range: {
                                    description: "La distance en blocs pour rechercher des points à l'intérieur des villages. Si <= 0, trouvez le village le plus proche, quelle que soit la distance.",
                                    default: 0,
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace vers un village.",
                                    default: 1,
                                    type: "number"
                                },
                                start_chance: {
                                    description: "La chance que le mob commence cet objectif, de 0 à 1.",
                                    default: 0.1,
                                    type: "number",
                                    minimum: 0,
                                    maximum: 1
                                },
                            }
                        },
                        "minecraft:behavior.summon_entity": {
                            description: "Force une Entité à attaquer d'autres entités en invoquant de nouvelles entités.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                summon_choices: {
                                    description: "Liste des sorts que le mob peut utiliser pour invoquer des entités.",
                                    type: "array",
                                    items: {
                                        type: "object"
                                    }
                                },
                            }
                        },
                        "minecraft:behavior.swell": {
                            description: "Force une Entité à grandir en taille lorsqu'elle est approchée et à rétrécir à nouveau après une certaine distance.",
                            type: "object",
                            properties: {
                                start_distance: {
                                    description: "Cet Entité commence à gonfler lorsqu'une cible est éloignée d'au moins autant de blocs.",
                                    default: 10,
                                    type: "number"
                                },
                                stop_distance: {
                                    description: "Cet Entité arrête de gonfler lorsqu'une cible s'est éloignée d'au moins autant de blocs.",
                                    default: 2,
                                    type: "number"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.swim_idle": {
                            description: "Oblige une Entité nageant dans l'eau à rester inactive.",
                            type: "object",
                            properties: {
                                idle_time: {
                                    description: "La durée en secondes pendant laquelle l'entité reste inactive.",
                                    default: 5,
                                    type: "number"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                success_rate: {
                                    description: "Le pourcentage de chance que cette entité reste inactive, 1.0 = 100%.",
                                    default: 0.1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.swim_up_for_breath": {
                            description: "Force une Entité à nager vers la surface pour respirer lorsqu'elle est à court d'air.  Type: `Object`. Ce comportement nécessite un composant 'minecraft:breathable' pour fonctionner correctement.",
                            type: "object",
                            properties: {
                                material_type: {
                                    description: "Le type de matériau dans lequel le mob se déplace. Un bloc d'air ne sera considéré comme valide pour se déplacer qu'avec un bloc de ce matériau en dessous. Les options sont : 'water', 'lava' ou 'any'.",
                                    default: "water",
                                    type: "string",
                                    enum: ["water", "lava", "any"]
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                search_height: {
                                    description: "La hauteur (en blocs) au-dessus de la position actuelle du mob qu'il recherchera un bloc d'air valide pour se déplacer. Si un bloc valide ne peut pas être trouvé, le mob se déplacera à la position de ce nombre de blocs au-dessus de lui.",
                                    default: 16,
                                    type: "integer"
                                },
                                search_radius: {
                                    description: "Le rayon (en blocs) autour de la position actuelle du mob qu'il recherchera un bloc d'air valide pour se déplacer.",
                                    default: 4,
                                    type: "integer"
                                },
                                speed_mod: {
                                    description: "Le multiplicateur de vitesse de déplacement de l'entité lorsqu'elle se déplace pour respirer.",
                                    default: 1.4,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.swim_wander": {
                            description: "Force une Entité à errer en nageant, lorsqu'elle ne suit pas de chemin.",
                            type: "object",
                            properties: {
                                interval: {
                                    description: "Pourcentage de chance de commencer à errer, lorsqu'il n'y a pas de recherche de chemin. 1 = 100%",
                                    default: 0.00833,
                                    type: "number"
                                },
                                look_ahead: {
                                    description: "Distance à laquelle regarder pour éviter les obstacles, lors de l'errance.",
                                    default: 5,
                                    type: "number"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle se déplace pour errer.",
                                    default: 1,
                                    type: "number"
                                },
                                wander_time: {
                                    description: "La durée en secondes pour errer après que le comportement d'errance ait été démarré avec succès.",
                                    default: 5,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.swim_with_entity": {
                            description: "Force une Entité à suivre une autre entité lorsqu'elles nagent toutes les deux dans l'eau.",
                            type: "object",
                            properties: {
                                catch_up_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité est modifié par lorsqu'elle suit la direction d'une autre entité.",
                                    default: 2.5,
                                    type: "number"
                                },
                                catch_up_threshold: {
                                    description: "La distance, à partir de l'entité suivie, à laquelle cette entité accélérera pour atteindre cette entité.",
                                    default: 12,
                                    type: "number"
                                },
                                chance_to_stop: {
                                    description: "Pourcentage de chance d'arrêter de suivre l'entité actuelle, si elle monte une autre entité ou si elle ne nage pas. 1.0 = 100%",
                                    default: 0.0333,
                                    type: "number"
                                },
                                entity_types: {
                                    description: "Les filtres permettent aux objets de données de spécifier des critères de test.",
                                    type: "object"
                                },
                                match_direction_threshold: {
                                    description: "La distance, à partir de l'entité suivie, à laquelle cette entité essaiera de suivre la direction de cette entité.",
                                    default: 2,
                                    type: "number"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                search_range: {
                                    description: "Le rayon autour de cette entité pour rechercher une autre entité à suivre.",
                                    default: 20,
                                    type: "number"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle suit une autre entité.",
                                    default: 1.5,
                                    type: "number"
                                },
                                state_check_interval: {
                                    description: "Le temps (en secondes) entre les vérifications pour déterminer si cette entité doit rattraper l'entité suivie ou correspondre à la direction de l'entité suivie.",
                                    default: 0.5,
                                    type: "number"
                                },
                                stop_distance: {
                                    description: "La distance, à partir de l'entité suivie, à laquelle cette entité arrêtera de suivre cette entité.",
                                    default: 5,
                                    type: "number"
                                },
                                success_rate: {
                                    description: "Pourcentage de chance de commencer à suivre une autre entité, si ce n'est pas déjà le cas. 1.0 = 100%.",
                                    default: 0.1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.swoop_attack": {
                            description: "Force une Entité à attaquer en utilisant un comportement d'attaque de plongée. Idéal pour une utilisation avec des mobs volants. Le comportement se termine si l'entité a une collision horizontale ou est touchée.",
                            type: "object",
                            properties: {
                                damage_reach: {
                                    description: "Ajouté à la taille de base de l'entité pour déterminer la distance maximale autorisée de la cible, lorsqu'elle tente de causer des dégâts d'attaque.",
                                    default: 0.2,
                                    type: "number"
                                },
                                delay_range: {
                                    description: "Plage de temps de refroidissement minimum et maximum (en secondes) entre chaque attaque de plongée tentée.",
                                    default: [10,20],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle utilise cet objectif AI.",
                                    default: 1,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.take_flower": {
                            description: "Permet au mob d'accepter des fleurs d'un autre mob avec le comportement minecraft:offer_flower.",
                            type: "object",
                            properties: {
                                filters: {
                                    description: "Les filtres permettent aux objets de données de spécifier des critères de test.",
                                },
                                max_head_rotation_y: {
                                    description: "La rotation maximale (en degrés) sur l'axe Y que cette entité peut tourner la tête lorsqu'elle tente de regarder la cible.",
                                    default: 30,
                                    type: "number"
                                },
                                max_rotation_x: {
                                    description: "La rotation maximale (en degrés) sur l'axe X que cette entité peut tourner lorsqu'elle tente de regarder la cible.",
                                    default: 30,
                                    type: "number"
                                },
                                max_wait_time: {
                                    description: "La durée maximale (en secondes) pendant laquelle le mob attendra aléatoirement avant de prendre la fleur.",
                                    default: 20,
                                    type: "number"
                                },
                                min_distance_to_target: {
                                    description: "La distance minimale (en blocs) pour que l'entité soit considérée comme ayant atteint sa cible.",
                                    default: 2,
                                    type: "number"
                                },
                                min_wait_time: {
                                    description: "La durée minimale (en secondes) pendant laquelle le mob attendra aléatoirement avant de prendre la fleur.",
                                    default: 4,
                                    type: "number"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                search_area: {
                                    description: "Les dimensions de l'AABB utilisées pour rechercher un mob potentiel à partir duquel prendre une fleur.",
                                    default: [6,2,6],
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: {
                                        type: "number"
                                    }
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle utilise cet objectif AI.",
                                    default: 0.5,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.target_when_pushed": {
                            description: "Force une Entité à cibler l'entité qui l'a poussée.",
                            type: "object",
                            properties: {
                                entity_types: {
                                    description: "Liste des types d'entités à attaquer.",
                                    type: "object"
                                },
                                percent_chance: {
                                    description: "Pourcentage de chance que l'entité cible l'entité qui l'a poussée.",
                                    default: 5,
                                    type: "number"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.teleport_to_owner": {
                            description: "Permet à une entité de se téléporter à son propriétaire.",
                            type: "object",
                            properties: {
                                cooldown: {
                                    description: "Le temps en secondes qui doit s'écouler pour que l'entité puisse essayer de se téléporter à nouveau.",
                                    default: 1,
                                    type: "number"
                                },
                                filters: {
                                    description: "Les filtres permettent aux objets de données de spécifier des critères de test.",
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.tempt": {
                            description: "Force une Entité à être tentée par un item défini.",
                            type: "object",
                            properties: {
                                can_get_scared: {
                                    description: "Si vrai, le mob peut cesser d'être tenté si le joueur se déplace trop vite tout en étant proche de ce mob.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_tempt_vertically: {
                                    description: "Si vrai, la distance verticale par rapport au joueur sera prise en compte lors de la tentation.",
                                    default: false,
                                    type: "boolean"
                                },
                                can_tempt_while_ridden: {
                                    description: "Si vrai, le mob peut être tenté même s'il a un passager.",
                                    default: false,
                                    type: "boolean"
                                },
                                items: {
                                    description: "Liste des items qui peuvent tenter cette entité.",
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                on_start: {
                                    description: "Événement à déclencher lorsque ce comportement démarre.",
                                },
                                on_end: {
                                    description: "Événement à déclencher lorsque ce comportement se termine.",
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                sound_interval: {
                                    description: "Plage de ticks aléatoires à attendre entre les sons de tentation.",
                                    default: [0,0],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle est tentée.",
                                    default: 1,
                                    type: "number"
                                },
                                stop_distance: {
                                    description: "La distance à laquelle l’Entité arrêtera de suivre le joueur.",
                                    default: 1.5,
                                    type: "number"
                                },
                                tempt_sound: {
                                    description: "Le son à jouer pendant que le mob est tenté.",
                                    type: "string"
                                },
                                within_radius: {
                                    description: "La distance en blocs à laquelle le joueur doit être pour tenter cette entité.",
                                    default: 0,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.timer_flag_1": {
                            description: "Déclenche un événement lorsque ce comportement démarre, puis attend une durée avant de s'arrêter. Lors de l'arrêt en raison du délai d'attente ou d'une interruption par un autre comportement, l'objectif déclenche un autre événement. query.timer_flag_1 renverra 1,0 sur le client et le serveur lorsque ce comportement est en cours d'exécution, et 0,0 sinon.",
                            type: "object",
                            properties: {
                                cooldown_range: {
                                    description: "Plage de temps de refroidissement minimum et maximum (en secondes) entre chaque exécution de ce comportement.",
                                    default: [10,10],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                                duration_range: {
                                    description: "Plage de temps minimum et maximum (en secondes) que ce comportement doit être actif.",
                                    default: [2,2],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                                on_end: {
                                    description: "Événement à déclencher lorsque ce comportement se termine.",
                                },
                                on_start: {
                                    description: "Événement à déclencher lorsque ce comportement démarre.",
                                },
                            }
                        },
                        "minecraft:behavior.timer_flag_2": {
                            description: "Déclenche un événement lorsque ce comportement démarre, puis attend une durée avant de s'arrêter. Lors de l'arrêt en raison du délai d'attente ou d'une interruption par un autre comportement, l'objectif déclenche un autre événement. query.timer_flag_2 renverra 1,0 sur le client et le serveur lorsque ce comportement est en cours d'exécution, et 0,0 sinon.",
                            type: "object",
                            properties: {
                                cooldown_range: {
                                    description: "Plage de temps de refroidissement minimum et maximum (en secondes) entre chaque exécution de ce comportement.",
                                    default: [10,10],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                                duration_range: {
                                    description: "Plage de temps minimum et maximum (en secondes) que ce comportement doit être actif.",
                                    default: [2,2],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                                on_end: {
                                    description: "Événement à déclencher lorsque ce comportement se termine.",
                                },
                                on_start: {
                                    description: "Événement à déclencher lorsque ce comportement démarre.",
                                },
                            }
                        },
                        "minecraft:behavior.timer_flag_3": {
                            description: "Déclenche un événement lorsque ce comportement démarre, puis attend une durée avant de s'arrêter. Lors de l'arrêt en raison du délai d'attente ou d'une interruption par un autre comportement, l'objectif déclenche un autre événement. query.timer_flag_3 renverra 1,0 sur le client et le serveur lorsque ce comportement est en cours d'exécution, et 0,0 sinon.",
                            type: "object",
                            properties: {
                                cooldown_range: {
                                    description: "Plage de temps de refroidissement minimum et maximum (en secondes) entre chaque exécution de ce comportement.",
                                    default: [10,10],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                                duration_range: {
                                    description: "Plage de temps minimum et maximum (en secondes) que ce comportement doit être actif.",
                                    default: [2,2],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                },
                                on_end: {
                                    description: "Événement à déclencher lorsque ce comportement se termine.",
                                },
                                on_start: {
                                    description: "Événement à déclencher lorsque ce comportement démarre.",
                                },
                            }
                        },
                        "minecraft:behavior.trade_interest": {
                            description: "Force une Entité à se concentrer sur un joueur qui initiera un échange.",
                            type: "object",
                            properties: {
                                carried_item_switch_time: {
                                    description: "Le temps maximum en secondes que le commerçant tiendra un objet avant de tenter de le remplacer par un autre objet qui prend le même échange.",
                                    default: 2,
                                    type: "number"
                                },
                                cooldown: {
                                    description: "Le temps en secondes avant que le commerçant puisse utiliser à nouveau cet objectif.",
                                    default: 2,
                                    type: "number"
                                },
                                interest_time: {
                                    description: "Le temps maximum en secondes que le commerçant montrera ses items d'échange.",
                                    default: 45,
                                    type: "number"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                remove_item_time: {
                                    description: "Le temps maximum en secondes que le commerçant attendra lorsque vous n'avez plus d'objets à échanger.",
                                    default: 1,
                                    type: "number"
                                },
                                within_radius: {
                                    description: "La distance en blocs à laquelle le joueur doit être pour que le commerçant soit intéressé.",
                                    default: 0,
                                    type: "number"
                                },
                            }
                        },
                        "minecraft:behavior.trade_with_player": {
                            description: "Permet au joueur de commercer avec ce mob. Lorsque l'objectif démarre, il arrêtera la navigation du mob.",
                            type: "object",
                            properties: {
                                filters: {
                                    description: "Les filtres permettent aux objets de données de spécifier des critères de test.",
                                },
                                max_distance_from_player: {
                                    description: "La distance maximale à laquelle le joueur peut être de ce mob pour que le mob soit intéressé par le commerce.",
                                    default: 8,
                                    type: "number"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.vex_copy_owner_target": {
                            description: "Permet à l'entité de cibler la même entité que son propriétaire.",
                            type: "object",
                            properties: {
                                entity_types: {
                                    description: "Liste des entitiés que ce mob peut copier du propriétaire.",
                                    type: "object"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.vex_random_move": {
                            description: "Permet au mob de se déplacer aléatoirement comme le Vex.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.wither_random_attack_pos_goal": {
                            description: "Permet au Wither de lancer des attaques aléatoires. Ne peut être utilisé que par le boss Wither.",
                            type: "object",
                            properties: {
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.wither_target_highest_damage": {
                            description: "Permet au Wither de se concentrer sur les attaques sur l'entité qui lui a infligé le plus de dégâts. Ne peut être utilisé que par le boss Wither.",
                            type: "object",
                            properties: {
                                entity_types: {
                                    description: "Liste des entitiés que ce mob peut copier du propriétaire.",
                                    type: "object"
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.work": {
                            description: "Permet à l'entité d'utiliser le POI.",
                            type: "object",
                            properties: {
                                active_time: {
                                    description: "Le nombre de ticks que l'Entité restera à son emplacement de travail.",
                                    default: 0,
                                    type: "integer"
                                },
                                can_work_in_rain: {
                                    description: "Si vrai, cette entité peut travailler lorsque son POI de lieu de travail est sous la pluie.",
                                    default: false,
                                    type: "boolean"
                                },
                                goal_cooldown: {
                                    description: "Le nombre de ticks avant que l'objectif ne puisse être utilisé à nouveau.",
                                    default: 0,
                                    type: "integer"
                                },
                                on_arrival: {
                                    description: "L'événement à déclencher lorsque l'entité atteint son lieu de travail.",
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                sound_delay_max: {
                                    description: "L'intervalle maximum dans lequel un son sera joué.",
                                    default: 0,
                                    type: "integer"
                                },
                                sound_delay_min: {
                                    description: "L'intervalle minimum dans lequel un son sera joué.",
                                    default: 0,
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle utilise cet objectif AI.",
                                    default: 0.5,
                                    type: "number"
                                },
                                work_in_rain_tolerance: {
                                    description: "Si `can_work_in_rain` est faux, c'est le nombre maximum de ticks restants dans l'objectif où la pluie n'interrompra pas l'objectif.",
                                    default: -1,
                                    type: "integer"
                                },
                            }
                        },
                        "minecraft:behavior.work_composter": {
                            description: "Permet à l'entité d'utiliser le POI du composteur pour convertir les graines excédentaires en poudre d'os.",
                            type: "object",
                            properties: {
                                active_time: {
                                    description: "Le nombre de ticks que l'Entité restera à son emplacement de travail.",
                                    default: 0,
                                    type: "integer"
                                },
                                block_interaction_max: {
                                    description: "Le nombre maximum de fois que le mob interagira avec le composteur.",
                                    default: 1,
                                    type: "integer"
                                },
                                can_empty_composter: {
                                    description: "Détermine si le mob peut vider un composteur plein.",
                                    default: true,
                                    type: "boolean"
                                },
                                can_fill_composter: {
                                    description: "Détermine si le mob peut ajouter des items à un composteur étant donné qu'il n'est pas plein.",
                                    default: true,
                                    type: "boolean"
                                },
                                can_work_in_rain: {
                                    description: "Si vrai, cette entité peut travailler lorsque son POI de lieu de travail est sous la pluie.",
                                    default: false,
                                    type: "boolean"
                                },
                                goal_cooldown: {
                                    description: "Le nombre de ticks avant que l'objectif ne puisse être utilisé à nouveau.",
                                    default: 0,
                                    type: "integer"
                                },
                                items_per_use_max: {
                                    description: "Le nombre maximum d'items qui peuvent être ajoutés au composteur par interaction de bloc.",
                                    default: 20,
                                    type: "integer"
                                },
                                min_item_count: {
                                    description: "Limite la quantité de chaque item compostable que le mob peut utiliser. Toute quantité détenue au-dessus de ce nombre sera compostée si possible.",
                                    default: 10,
                                    type: "integer"
                                },
                                on_arrival: {
                                    description: "L'événement à déclencher lorsque l'entité atteint son lieu de travail.",
                                },
                                priority: {
                                    description: "La priorité de l'objectif.",
                                    type: "integer"
                                },
                                speed_multiplier: {
                                    description: "Le multiplicateur de vitesse de l'entité lorsqu'elle utilise cet objectif AI.",
                                    default: 0.5,
                                    type: "number"
                                },
                                use_block_max: {
                                    description: "Le nombre maximum de fois que le mob interagira avec le composteur.",
                                    default: 200,
                                    type: "integer"
                                },
                                use_block_min: {
                                    description: "Le nombre minimum de fois que le mob interagira avec le composteur.",
                                    default: 200,
                                    type: "integer"
                                },
                                work_in_rain_tolerance: {
                                    description: "Si `can_work_in_rain` est faux, c'est le nombre maximum de ticks restants dans l'objectif où la pluie n'interrompra pas l'objectif.",
                                    default: -1,
                                    type: "integer"
                                },
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
                                        "$ref": "https://douarmc.github.io/minecraft_bedrock_json_schemas/common.json#/definitions/event_trigger_type"
                                    },
                                    "event_filters": {
                                        "description": "L'ensemble de conditions qui doivent être satisfaites pour que l'événement soit déclenché. \nType: `Minecraft Filter`",
                                        "$ref": "https://douarmc.github.io/minecraft_bedrock_json_schemas/common.json#/definitions/minecraft_filter"
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