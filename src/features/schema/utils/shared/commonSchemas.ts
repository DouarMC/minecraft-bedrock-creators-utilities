import { MinecraftJsonSchema } from "../../model";
import { dynamicExamplesSourceKeys, schemaEnums } from "./schemaEnums";

// Fonction helper pour créer les schémas avec références
function createCommonSchemas() {
    const schemas: any = {};

    // On utilise directement une référence vers la définition du schéma principal
    schemas.minecraft_filter = {
        $ref: "#/definitions/minecraft_filter"
    };

    schemas.block_descriptor = {
        type: "object",
        properties: {
            name: {
                description: "L'identifiant du bloc.",
                type: "string",
                "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
            },
            states: {
                description: "Les états du bloc.",
                type: "object",
                additionalProperties: {
                    oneOf: [
                        { type: "string" },
                        { type: "integer" },
                        { type: "number" },
                        { type: "boolean" }
                    ]
                }
            },
            tags: {
                description: "Les tags du bloc.",
                type: "molang"
            }
        }
    };

    schemas.item_descriptor = {
        type: "object",
        properties: {
            name: {
                description: "L'identifiant de l'item.",
                type: "string",
                "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
            },
            data: {
                description: "La valeur aux value de l'item.",
                type: "integer"
            },
            tags: {
                markdownDescription:
                "**ℹ️ Expression Molang supportée.**\n\n" +
                "Les tags de l'item.",
                type: "molang"
            }
        }
    };

    // Event trigger simple
    schemas.entity_event_trigger = {
        type: "object",
        properties: {
            event: {
                description: "L'événement à déclencher (ex: minecraft:ageable_grow_up)",
                type: "string"
            },
            target: {
                description: "La cible de l'événement",
                default: "self",
                type: "string",
                enum: ["baby", "block", "damager", "other", "parent", "player", "self", "target"]
            },
            filters: schemas.minecraft_filter
        }
    };

    return schemas;
}

// Fonction pour générer les definitions communes à injecter dans les schémas principaux
export function getCommonDefinitions(): Record<string, MinecraftJsonSchema> {
    return {
        minecraft_filter: {
            oneOf: [
                {
                    type: "object",
                    required: ["test", "value"],
                    properties: {
                        test: {
                            description: "Le type de test à effectuer",
                            type: "string",
                            enum: [
                                "actor_health", "inactivity_timer", "is_altitude", "is_mark_variant", "is_skin_id", "is_variant", "random_chance", "rider_count"
                            ]
                        },
                        subject: {
                            type: "string",
                            default: "self",
                            description: "Le sujet du test",
                            enum: ["block", "damager", "other", "parent", "player", "self", "target"]
                        },
                        operator: {
                            type: "string",
                            default: "==",
                            description: "L'opérateur de comparaison",
                            enum: ["!=", "<", "<=", "<>", "=", "==", ">", ">=", "equals", "not"]
                        },
                        value: {
                            description: "La valeur à comparer (type varie selon le test)",
                            type: "integer"
                        }
                    }
                },
                {
                    type: "object",
                    required: ["test"],
                    properties: {
                        test: {
                            description: "Le type de test à effectuer",
                            type: "string",
                            enum: [
                                "all_slots_empty", "any_slot_empty"
                            ]
                        },
                        subject: {
                            type: "string",
                            default: "self",
                            description: "Le sujet du test",
                            enum: ["block", "damager", "other", "parent", "player", "self", "target"]
                        },
                        operator: {
                            type: "string",
                            default: "==",
                            description: "L'opérateur de comparaison",
                            enum: ["!=", "<", "<=", "<>", "=", "==", ">", ">=", "equals", "not"]
                        },
                        value: {
                            description: "La valeur à comparer (type varie selon le test)",
                            type: "string",
                            enum: [
                                "any", "armor", "body", "feet", "hand", "head", "inventory", "leg", "torso"
                            ]
                        }
                    }
                },
                {
                    type: "object",
                    required: ["test", "domain"],
                    properties: {
                        test: {
                            description: "Le type de test à effectuer",
                            type: "string",
                            enum: [
                                "bool_property"
                            ]
                        },
                        subject: {
                            type: "string",
                            default: "self",
                            description: "Le sujet du test",
                            enum: ["block", "damager", "other", "parent", "player", "self", "target"]
                        },
                        operator: {
                            type: "string",
                            default: "==",
                            description: "L'opérateur de comparaison",
                            enum: ["!=", "<", "<=", "<>", "=", "==", ">", ">=", "equals", "not"]
                        },
                        value: {
                            description: "La valeur à comparer (type varie selon le test)",
                            type: "boolean"
                        },
                        domain: {
                            description: "Le domaine.",
                            type: "string"
                        }
                    }
                },
                {
                    type: "object",
                    required: ["test", "value"],
                    properties: {
                        test: {
                            description: "Le type de test à effectuer",
                            type: "string",
                            enum: [
                                "clock_time", "distance_to_nearest_player", "home_distance", "owner_distance", "target_distance"
                            ]
                        },
                        subject: {
                            type: "string",
                            default: "self",
                            description: "Le sujet du test",
                            enum: ["block", "damager", "other", "parent", "player", "self", "target"]
                        },
                        operator: {
                            type: "string",
                            default: "==",
                            description: "L'opérateur de comparaison",
                            enum: ["!=", "<", "<=", "<>", "=", "==", ">", ">=", "equals", "not"]
                        },
                        value: {
                            description: "La valeur à comparer (type varie selon le test)",
                            type: "number"
                        }
                    }
                },
                {
                    type: "object",
                    required: ["test", "value", "domain"],
                    properties: {
                        type: {
                            description: "Le type de test à effectuer",
                            type: "string",
                            enum: [
                                "enum_property"
                            ]
                        },
                        subject: {
                            type: "string",
                            default: "self",
                            description: "Le sujet du test",
                            enum: ["block", "damager", "other", "parent", "player", "self", "target"]
                        },
                        operator: {
                            type: "string",
                            default: "==",
                            description: "L'opérateur de comparaison",
                            enum: ["!=", "<", "<=", "<>", "=", "==", ">", ">=", "equals", "not"]
                        },
                        value: {
                            description: "La valeur à comparer (type varie selon le test)",
                            type: "string"
                        },
                        domain: {
                            description: "Le domaine.",
                            type: "string"
                        }
                    }
                },
                {
                    type: "object",
                    required: ["test", "value", "domain"],
                    properties: {
                        test: {
                            description: "Le type de test à effectuer",
                            type: "string",
                            enum: [
                                "float_property"
                            ]
                        },
                        subject: {
                            type: "string",
                            default: "self",
                            description: "Le sujet du test",
                            enum: ["block", "damager", "other", "parent", "player", "self", "target"]
                        },
                        operator: {
                            type: "string",
                            default: "==",
                            description: "L'opérateur de comparaison",
                            enum: ["!=", "<", "<=", "<>", "=", "==", ">", ">=", "equals", "not"]
                        },
                        value: {
                            description: "La valeur à comparer (type varie selon le test)",
                            type: "number"
                        },
                        domain: {
                            description: "Le domaine.",
                            type: "string"
                        }
                    }
                },
                {
                    type: "object",
                    required: ["test", "value"],
                    properties: {
                        test: {
                            description: "Le type de test à effectuer",
                            type: "string",
                            enum: [
                                "has_ability"
                            ]
                        },
                        subject: {
                            type: "string",
                            default: "self",
                            description: "Le sujet du test",
                            enum: ["block", "damager", "other", "parent", "player", "self", "target"]
                        },
                        operator: {
                            type: "string",
                            default: "==",
                            description: "L'opérateur de comparaison",
                            enum: ["!=", "<", "<=", "<>", "=", "==", ">", ">=", "equals", "not"]
                        },
                        value: {
                            description: "La valeur à comparer (type varie selon le test)",
                            type: "string",
                            enum: [
                                "flySpeed", "flying", "instabuild", "invulnerable", "lightning", "mayfly", "mute", "noclip", "verticalFlySpeed", "walkSpeed", "worldbuilder"
                            ]
                        }
                    }
                },
                {
                    type: "object",
                    required: ["test", "value"],
                    properties: {
                        test: {
                            description: "Le type de test à effectuer",
                            type: "string",
                            enum: [
                                "has_biome_tag"
                            ]
                        },
                        subject: {
                            type: "string",
                            default: "self",
                            description: "Le sujet du test",
                            enum: ["block", "damager", "other", "parent", "player", "self", "target"]
                        },
                        operator: {
                            type: "string",
                            default: "==",
                            description: "L'opérateur de comparaison",
                            enum: ["!=", "<", "<=", "<>", "=", "==", ">", ">=", "equals", "not"]
                        },
                        value: {
                            description: "La valeur à comparer (type varie selon le test)",
                            type: "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.biome_tags
                        }
                    }
                },
                {
                    type: "object",
                    required: ["test", "value"],
                    properties: {
                        test: {
                            description: "Le type de test à effectuer",
                            type: "string",
                            enum: [
                                "has_component", "has_property", "has_tag", "is_family", "is_vehicle_family", "weather", "weather_at_position"
                            ]
                        },
                        subject: {
                            type: "string",
                            default: "self",
                            description: "Le sujet du test",
                            enum: ["block", "damager", "other", "parent", "player", "self", "target"]
                        },
                        operator: {
                            type: "string",
                            default: "==",
                            description: "L'opérateur de comparaison",
                            enum: ["!=", "<", "<=", "<>", "=", "==", ">", ">=", "equals", "not"]
                        },
                        value: {
                            description: "La valeur à comparer (type varie selon le test)",
                            type: "string"
                        }
                    }
                },
                {
                    type: "object",
                    required: ["test"],
                    properties: {
                        test: {
                            description: "Le type de test à effectuer",
                            type: "string",
                            enum: [
                                "has_container_open", "has_nametag", "has_ranged_weapon", "has_silk_touch", "has_target", "has_trade_supply", "in_caravan", "in_clouds", "in_contact_with_water", "in_lava", "in_nether", "in_overworld", "in_water", "in_water_or_rain", "is_avoiding_mobs", "is_baby", "is_bound_to_creaking_heart", "is_climbing", "is_daytime", "is_humid", "is_immobile", "is_in_village", "is_leashed", "is_leashed_to", "is_missing_health", "is_moving", "is_navigating", "is_owner", "is_panicking", "is_persistent", "is_raider", "is_riding", "is_riding_self", "is_sitting", "is_sleeping", "is_sneak_held", "is_sneaking", "is_snow_covered", "is_sprinting", "is_target", "is_underground", "is_underwater", "is_visible", "is_waterlogged", "on_fire", "on_ground", "on_hot_block", "on_ladder", "surface_mob", "taking_fire_damage", "trusts", "was_last_hurt_by"
                            ]
                        },
                        subject: {
                            type: "string",
                            default: "self",
                            description: "Le sujet du test",
                            enum: ["block", "damager", "other", "parent", "player", "self", "target"]
                        },
                        operator: {
                            type: "string",
                            default: "==",
                            description: "L'opérateur de comparaison",
                            enum: ["!=", "<", "<=", "<>", "=", "==", ">", ">=", "equals", "not"]
                        },
                        value: {
                            description: "La valeur à comparer (type varie selon le test)",
                            type: "boolean"
                        }
                    }
                },
                {
                    type: "object",
                    required: ["test", "value"],
                    properties: {
                        test: {
                            description: "Le type de test à effectuer",
                            type: "string",
                            enum: [
                                "has_damage"
                            ]
                        },
                        subject: {
                            type: "string",
                            default: "self",
                            description: "Le sujet du test",
                            enum: ["block", "damager", "other", "parent", "player", "self", "target"]
                        },
                        operator: {
                            type: "string",
                            default: "==",
                            description: "L'opérateur de comparaison",
                            enum: ["!=", "<", "<=", "<>", "=", "==", ">", ">=", "equals", "not"]
                        },
                        value: {
                            description: "La valeur à comparer (type varie selon le test)",
                            type: "string",
                            "x-dynamic-examples-source": schemaEnums.entity_damage_causes
                        }
                    }
                },
                {
                    type: "object",
                    required: ["test", "value", "domain"],
                    properties: {
                        test: {
                            description: "Le type de test à effectuer",
                            type: "string",
                            enum: [
                                "has_damaged_equipment", "has_equipment"
                            ]
                        },
                        subject: {
                            type: "string",
                            default: "self",
                            description: "Le sujet du test",
                            enum: ["block", "damager", "other", "parent", "player", "self", "target"]
                        },
                        operator: {
                            type: "string",
                            default: "==",
                            description: "L'opérateur de comparaison",
                            enum: ["!=", "<", "<=", "<>", "=", "==", ">", ">=", "equals", "not"]
                        },
                        value: {
                            description: "La valeur à comparer (type varie selon le test)",
                            type: "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                        },
                        domain: {
                            description: "Le domaine de l'équipement (hand, head, torso, leg, feet, armor, body)",
                            type: "string",
                            enum: [
                                "any", "armor", "body", "feet", "hand", "head", "inventory", "leg", "torso"
                            ]
                        }
                    }
                },
                {
                    type: "object",
                    required: ["test", "value", "domain"],
                    properties: {
                        test: {
                            description: "Le type de test à effectuer",
                            type: "string",
                            enum: [
                                "has_equipment_tag"
                            ]
                        },
                        subject: {
                            type: "string",
                            default: "self",
                            description: "Le sujet du test",
                            enum: ["block", "damager", "other", "parent", "player", "self", "target"]
                        },
                        operator: {
                            type: "string",
                            default: "==",
                            description: "L'opérateur de comparaison",
                            enum: ["!=", "<", "<=", "<>", "=", "==", ">", ">=", "equals", "not"]
                        },
                        value: {
                            description: "La valeur à comparer (type varie selon le test)",
                            type: "string"
                        },
                        domain: {
                            description: "Le domaine de l'équipement (hand, head, torso, leg, feet, armor, body)",
                            type: "string",
                            enum: [
                                "any", "armor", "body", "feet", "hand", "head", "inventory", "leg", "torso"
                            ]
                        }
                    }
                },
                {
                    type: "object",
                    required: ["test"],
                    properties: {
                        test: {
                            description: "Le type de test à effectuer",
                            type: "string",
                            enum: [
                                "has_mob_effect"
                            ]
                        },
                        subject: {
                            type: "string",
                            default: "self",
                            description: "Le sujet du test",
                            enum: ["block", "damager", "other", "parent", "player", "self", "target"]
                        },
                        operator: {
                            type: "string",
                            default: "==",
                            description: "L'opérateur de comparaison",
                            enum: ["!=", "<", "<=", "<>", "=", "==", ">", ">=", "equals", "not"]
                        },
                        value: {
                            description: "La valeur à comparer (type varie selon le test)",
                            type: "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.effect_ids
                        }
                    }
                },
                {
                    type: "object",
                    required: ["test", "value"],
                    properties: {
                        test: {
                            description: "Le type de test à effectuer",
                            type: "string",
                            enum: [
                                "hourly_clock_time"
                            ]
                        },
                        subject: {
                            type: "string",
                            default: "self",
                            description: "Le sujet du test",
                            enum: ["block", "damager", "other", "parent", "player", "self", "target"]
                        },
                        operator: {
                            type: "string",
                            default: "==",
                            description: "L'opérateur de comparaison",
                            enum: ["!=", "<", "<=", "<>", "=", "==", ">", ">=", "equals", "not"]
                        },
                        value: {
                            description: "La valeur à comparer (type varie selon le test)",
                            type: "integer",
                            minimum: 0,
                            maximum: 24000
                        }
                    }
                },
                {
                    type: "object",
                    required: ["type"],
                    properties: {
                        type: {
                            description: "Le type de test à effectuer",
                            type: "string",
                            enum: [
                                "in_block", "is_block"
                            ]
                        },
                        subject: {
                            type: "string",
                            default: "self",
                            description: "Le sujet du test",
                            enum: ["block", "damager", "other", "parent", "player", "self", "target"]
                        },
                        operator: {
                            type: "string",
                            default: "==",
                            description: "L'opérateur de comparaison",
                            enum: ["!=", "<", "<=", "<>", "=", "==", ">", ">=", "equals", "not"]
                        },
                        value: {
                            description: "La valeur à comparer (type varie selon le test)",
                            type: "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_ids
                        }
                    }
                },
                {
                    type: "object",
                    required: ["type", "value", "domain"],
                    properties: {
                        type: {
                            description: "Le type de test à effectuer",
                            type: "string",
                            enum: [
                                "int_property"
                            ]
                        },
                        subject: {
                            type: "string",
                            default: "self",
                            description: "Le sujet du test",
                            enum: ["block", "damager", "other", "parent", "player", "self", "target"]
                        },
                        operator: {
                            type: "string",
                            default: "==",
                            description: "L'opérateur de comparaison",
                            enum: ["!=", "<", "<=", "<>", "=", "==", ">", ">=", "equals", "not"]
                        },
                        value: {
                            description: "La valeur à comparer (type varie selon le test)",
                            type: "integer"
                        },
                        domain: {
                            description: "Le domaine.",
                            type: "string"
                        }
                    }
                },
                {
                    type: "object",
                    required: ["test", "value"],
                    properties: {
                        test: {
                            description: "Le type de test à effectuer",
                            type: "string",
                            enum: [
                                "is_biome"
                            ]
                        },
                        subject: {
                            type: "string",
                            default: "self",
                            description: "Le sujet du test",
                            enum: ["block", "damager", "other", "parent", "player", "self", "target"]
                        },
                        operator: {
                            type: "string",
                            default: "==",
                            description: "L'opérateur de comparaison",
                            enum: ["!=", "<", "<=", "<>", "=", "==", ">", ">=", "equals", "not"]
                        },
                        value: {
                            description: "La valeur à comparer (type varie selon le test)",
                            type: "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.biome_ids
                        }
                    }
                },
                {
                    type: "object",
                    required: ["test", "value"],
                    properties: {
                        test: {
                            description: "Le type de test à effectuer",
                            type: "string",
                            enum: [
                                "is_brightness", "is_temperature_value", "moon_intensity"
                            ]
                        },
                        subject: {
                            type: "string",
                            default: "self",
                            description: "Le sujet du test",
                            enum: ["block", "damager", "other", "parent", "player", "self", "target"]
                        },
                        operator: {
                            type: "string",
                            default: "==",
                            description: "L'opérateur de comparaison",
                            enum: ["!=", "<", "<=", "<>", "=", "==", ">", ">=", "equals", "not"]
                        },
                        value: {
                            description: "La valeur à comparer (type varie selon le test)",
                            type: "integer",
                            minimum: 0,
                            maximum: 1
                        }
                    }
                },
                {
                    type: "object",
                    required: ["test", "value"],
                    properties: {
                        test: {
                            description: "Le type de test à effectuer",
                            type: "string",
                            enum: [
                                "is_color"
                            ]
                        },
                        subject: {
                            type: "string",
                            default: "self",
                            description: "Le sujet du test",
                            enum: ["block", "damager", "other", "parent", "player", "self", "target"]
                        },
                        operator: {
                            type: "string",
                            default: "==",
                            description: "L'opérateur de comparaison",
                            enum: ["!=", "<", "<=", "<>", "=", "==", ">", ">=", "equals", "not"]
                        },
                        value: {
                            description: "La valeur à comparer (type varie selon le test)",
                            type: "string",
                            enum: [
                                "black", "blue", "brown", "cyan", "gray", "green", "light_blue", "light_green", "magenta", "orange", "pink", "purple", "red", "silver", "white", "yellow"
                            ]
                        }
                    }
                },
                {
                    type: "object",
                    required: ["test", "value"],
                    properties: {
                        test: {
                            description: "Le type de test à effectuer",
                            type: "string",
                            enum: [
                                "is_difficulty"
                            ]
                        },
                        subject: {
                            type: "string",
                            default: "self",
                            description: "Le sujet du test",
                            enum: ["block", "damager", "other", "parent", "player", "self", "target"]
                        },
                        operator: {
                            type: "string",
                            default: "==",
                            description: "L'opérateur de comparaison",
                            enum: ["!=", "<", "<=", "<>", "=", "==", ">", ">=", "equals", "not"]
                        },
                        value: {
                            description: "La valeur à comparer (type varie selon le test)",
                            type: "string",
                            enum: [
                                "easy", "hard", "normal", "peaceful"
                            ]
                        }
                    }
                },
                {
                    type: "object",
                    required: ["test", "value", "domain"],
                    properties: {
                        test: {
                            description: "Le type de test à effectuer",
                            type: "string",
                            enum: [
                                "is_game_rule"
                            ]
                        },
                        subject: {
                            type: "string",
                            default: "self",
                            description: "Le sujet du test",
                            enum: ["block", "damager", "other", "parent", "player", "self", "target"]
                        },
                        operator: {
                            type: "string",
                            default: "==",
                            description: "L'opérateur de comparaison",
                            enum: ["!=", "<", "<=", "<>", "=", "==", ">", ">=", "equals", "not"]
                        },
                        value: {
                            description: "La valeur à comparer (type varie selon le test)",
                            type: "boolean"
                        },
                        domain: {
                            description: "Le domaine.",
                            type: "string"
                        }
                    }
                },
                {
                    type: "object",
                    required: ["test", "value"],
                    properties: {
                        test: {
                            description: "Le type de test à effectuer",
                            type: "string",
                            enum: [
                                "is_temperature_type"
                            ]
                        },
                        subject: {
                            type: "string",
                            default: "self",
                            description: "Le sujet du test",
                            enum: ["block", "damager", "other", "parent", "player", "self", "target"]
                        },
                        operator: {
                            type: "string",
                            default: "==",
                            description: "L'opérateur de comparaison",
                            enum: ["!=", "<", "<=", "<>", "=", "==", ">", ">=", "equals", "not"]
                        },
                        value: {
                            description: "La valeur à comparer (type varie selon le test)",
                            type: "string",
                            enum: [
                                "cold", "mild", "ocean", "warm"
                            ]
                        }
                    }
                },
                {
                    type: "object",
                    required: ["test", "value"],
                    properties: {
                        test: {
                            description: "Le type de test à effectuer",
                            type: "string",
                            enum: [
                                "light_level"
                            ]
                        },
                        subject: {
                            type: "string",
                            default: "self",
                            description: "Le sujet du test",
                            enum: ["block", "damager", "other", "parent", "player", "self", "target"]
                        },
                        operator: {
                            type: "string",
                            default: "==",
                            description: "L'opérateur de comparaison",
                            enum: ["!=", "<", "<=", "<>", "=", "==", ">", ">=", "equals", "not"]
                        },
                        value: {
                            description: "La valeur à comparer (type varie selon le test)",
                            type: "integer",
                            minimum: 0,
                            maximum: 16
                        }
                    }
                },
                {
                    type: "object",
                    required: ["test", "value"],
                    properties: {
                        test: {
                            description: "Le type de test à effectuer",
                            type: "string",
                            enum: [
                                "moon_phase"
                            ]
                        },
                        subject: {
                            type: "string",
                            default: "self",
                            description: "Le sujet du test",
                            enum: ["block", "damager", "other", "parent", "player", "self", "target"]
                        },
                        operator: {
                            type: "string",
                            default: "==",
                            description: "L'opérateur de comparaison",
                            enum: ["!=", "<", "<=", "<>", "=", "==", ">", ">=", "equals", "not"]
                        },
                        value: {
                            description: "La valeur à comparer (type varie selon le test)",
                            type: "integer",
                            minimum: 0,
                            maximum: 7
                        }
                    }
                },
                // Option 2: Opérateurs logiques (récursifs via $ref)
                {
                    type: "object",
                    required: ["AND"],
                    properties: {
                        AND: { 
                            description: "Tous les tests doivent passer",
                            type: "array", 
                            items: {
                                $ref: "#/definitions/minecraft_filter"
                            }
                        }
                    }
                },
                {
                    type: "object",
                    required: ["OR"],
                    properties: {
                        OR: { 
                            description: "Au moins un test doit passer",
                            type: "array",
                            items: {
                                $ref: "#/definitions/minecraft_filter"
                            }
                        }
                    }
                },
                {
                    type: "object",
                    required: ["NOT"],
                    properties: {
                        NOT: { 
                            description: "Tous les tests doivent échouer",
                            type: "array",
                            items: {
                                $ref: "#/definitions/minecraft_filter"
                            }
                        }
                    }
                },
                {
                    type: "object",
                    required: ["all"],
                    properties: {
                        all: { 
                            description: "Alias pour AND",
                            type: "array", 
                            items: {
                                $ref: "#/definitions/minecraft_filter"
                            }
                        }
                    }
                },
                {
                    type: "object",
                    required: ["any"],
                    properties: {
                        any: {
                            description: "Alias pour OR",
                            type: "array", 
                            items: {
                                $ref: "#/definitions/minecraft_filter"
                            }
                        }
                    }
                },
                {
                    type: "object",
                    required: ["all_of"],
                    properties: {
                        all_of: { 
                            description: "Alias pour AND",
                            type: "array",
                            items: {
                                $ref: "#/definitions/minecraft_filter"
                            }
                        }
                    }
                },
                {
                    type: "object",
                    required: ["any_of"],
                    properties: {
                        any_of: { 
                            description: "Alias pour ANY",
                            type: "array",
                            items: {
                                $ref: "#/definitions/minecraft_filter"
                            }
                        }
                    }
                },
                {
                    type: "object",
                    required: ["none_of"],
                    properties: {
                        none_of: { 
                            description: "Alias pour NOT",
                            type: "array",
                            items: {
                                $ref: "#/definitions/minecraft_filter"
                            }
                        }
                    }
                }
            ]
        }
    };
}

export const commonSchemas = createCommonSchemas();