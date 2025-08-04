import { dynamicExamplesSourceKeys } from "./schemaEnums";

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
                markdownDescription:
                "**ℹ️ Expression Molang supportée.**\n\n" +
                "Les tags du bloc.",
                type: ["string", "number", "boolean"],
                format: "molang"
            }
        }
    };

    schemas.item_descriptor = {
        type: "object",
        required: ["name"],
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
                type: ["string", "number", "boolean"],
                format: "molang"
            }
        }
    };

    // Event trigger simple (comme dans ton exemple grow_up)
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
export function getCommonDefinitions() {
    return {
        minecraft_filter: {
            oneOf: [
                // Option 1: Un filtre simple avec test
                {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        "test": {
                            type: "string",
                            description: "Le type de test à effectuer",
                            enum: [
                                "actor_health", "all_slots_empty", "any_slot_empty", "bool_property", "clock_time", 
                                "distance_to_nearest_player", "enum_property", "float_property", "has_ability", 
                                "has_biome_tag", "has_component", "has_container_open", "has_damage", 
                                "has_damaged_equipment", "has_equipment", "has_equipment_tag", "has_mob_effect", 
                                "has_nametag", "has_property", "has_ranged_weapon", "has_silk_touch", "has_tag", 
                                "has_target", "has_trade_supply", "home_distance", "hourly_clock_time", "in_block",
                                "in_caravan", "in_clouds", "in_contact_with_water", "in_lava", "in_nether", 
                                "in_overworld", "in_water", "in_water_or_rain", "inactivity_timer", "int_property", 
                                "is_altitude", "is_avoiding_mobs", "is_baby", "is_biome", "is_block", 
                                "is_bound_to_creaking_heart", "is_brightness", "is_climbing", "is_color", 
                                "is_daytime", "is_difficulty", "is_family", "is_game_rule", "is_humid", 
                                "is_immobile", "is_in_village", "is_leashed", "is_leashed_to", "is_mark_variant", 
                                "is_missing_health", "is_moving", "is_navigating", "is_owner", "is_panicking", 
                                "is_persistent", "is_raider", "is_riding", "is_sitting", "is_skin_id", 
                                "is_sleeping", "is_sneak_held", "is_sneaking", "is_snow_covered", "is_sprinting", 
                                "is_target", "is_temperature_type", "is_temperature_value", "is_underground", 
                                "is_underwater", "is_variant", "is_visible", "is_waterlogged", "light_level", 
                                "moon_intensity", "moon_phase", "on_fire", "on_ground", "on_hot_block", "on_ladder", 
                                "owner_distance", "random_chance", "rider_count", "surface_mob", "taking_fire_damage", 
                                "target_distance", "trusts", "was_last_hurt_by", "weather", "weather_at_position", 
                                "is_riding_self", "is_vehicle_family"
                            ]
                        },
                        "subject": {
                            type: "string",
                            default: "self",
                            description: "Le sujet du test",
                            enum: ["block", "damager", "other", "parent", "player", "self", "target"]
                        },
                        "operator": {
                            type: "string",
                            default: "==",
                            description: "L'opérateur de comparaison",
                            enum: ["!=", "<", "<=", "<>", "=", "==", ">", ">=", "equals", "not"]
                        },
                        "value": {
                            description: "La valeur à comparer (type varie selon le test)",
                            oneOf: [
                                { type: "string" },
                                { type: "number" },
                                { type: "boolean" }
                            ]
                        },
                        "domain": {
                            type: "string",
                            description: "Domaine pour certains tests (ex: propriétés comme minecraft:armadillo_state)"
                        }
                    }
                },
                // Option 2: Opérateurs logiques (récursifs via $ref)
                {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        "AND": { 
                            type: "array", 
                            items: { $ref: "#/definitions/minecraft_filter" },
                            description: "Tous les tests doivent passer"
                        }
                    }
                },
                {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        "OR": { 
                            type: "array", 
                            items: { $ref: "#/definitions/minecraft_filter" },
                            description: "Au moins un test doit passer"
                        }
                    }
                },
                {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        "NOT": { 
                            type: "array", 
                            items: { $ref: "#/definitions/minecraft_filter" },
                            description: "Tous les tests doivent échouer"
                        }
                    }
                },
                {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        "all": { 
                            type: "array", 
                            items: { $ref: "#/definitions/minecraft_filter" },
                            description: "Alias pour AND"
                        }
                    }
                },
                {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        "any": { 
                            type: "array", 
                            items: { $ref: "#/definitions/minecraft_filter" },
                            description: "Alias pour OR"
                        }
                    }
                },
                {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        "all_of": { 
                            type: "array", 
                            items: { $ref: "#/definitions/minecraft_filter" },
                            description: "Alias pour AND"
                        }
                    }
                },
                {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        "any_of": { 
                            type: "array", 
                            items: { $ref: "#/definitions/minecraft_filter" },
                            description: "Alias pour OR"
                        }
                    }
                },
                {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        "none_of": { 
                            type: "array", 
                            items: { $ref: "#/definitions/minecraft_filter" },
                            description: "Alias pour NOT"
                        }
                    }
                }
            ]
        }
    };
}

export const commonSchemas = createCommonSchemas();