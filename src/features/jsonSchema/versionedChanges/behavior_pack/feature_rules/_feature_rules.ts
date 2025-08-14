import { SchemaType } from "../../../../../types/schema";
import { commonSchemas } from "../../../shared/commonSchemas";
import { dynamicExamplesSourceKeys } from "../../../shared/schemaEnums";
import { schemaPatterns } from "../../../shared/schemaPatterns";


const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Ce fichier définit des règles de décoration (Feature Rules) qui servent à contrôler une décoration en l'attachant à un biome en utilisant des conditions. \nType: `Object`",
    "type": "object",
    "required": ["format_version", "minecraft:feature_rules"],
    "properties": {
        "format_version": {
            "description": "La version du Format à utiliser. \nType: `String`",
            "type": "string",
            "enum": [
                "1.13.0", "1.14.0", "1.14.1", "1.14.20", "1.14.30", "1.15.0", "1.16.0", "1.16.20", "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
            ]
        },
        "minecraft:feature_rules": {
            "description": "Contient toute la définition de la Feature Rules. \nType: `Object`",
            "type": "object",
            "required": ["description", "conditions"],
            "properties": {
                "description": {
                    "description": "Contient l'identifiant de la Feature Rules et la Feature à placer. \nType: `Object`",
                    "type": "object",
                    "required": ["identifier", "places_feature"],
                    "properties": {
                        "identifier": {
                            "description": "L'identifiant de la Feature Rules. \nType: `String` \nNote: Doit être de la forme 'namespace:feature_rule_id' et 'feature_rule_id' doit correspondre au nom du fichier.",
                            "type": "string",
                            pattern: schemaPatterns.identifier_with_namespace,
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_feature_rules_ids
                        },
                        "places_feature": {
                            "description": "L'identifiant de la Feature à placer. \nType: `String`",
                            "type": "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.feature_ids
                        }
                    }
                },
                "conditions": {
                    "description": "Paramètres pour contrôler où et quand la Feature sera placée. \nType: `Object`",
                    "type": "object",
                    "required": ["placement_pass"],
                    "properties": {
                        "placement_pass": {
                            "description": "Définit quane la Feature est placée par rapport aux autres. Les passes plus tôt dans la liste sont exécutées avant les suivantes, mais l'ordre à l'intérieur d'une même passe n'est pas garanti. \nType: `String`",
                            "type": "string"
                        },
                        "minecraft:biome_filter": {
                            "description": "Liste des tests de filtre pour déterminer à quels biomes cette règle sera attachée. \nType: `(Minecraft Filter | Minecraft Filter[])`",
                            "oneOf": [
                                {
                                    ...commonSchemas.minecraft_filter
                                },
                                {
                                    "type": "array",
                                    "items": {
                                        ...commonSchemas.minecraft_filter,
                                    }
                                }
                            ]
                        }
                    }
                },
                "distribution": {
                    "description": "Les paramètres qui contrôlent la dispersion initiale de la feature, définissant comment et où elle est répartie dans le monde. \nType: `Object`",
                    "type": "object",
                    "required": ["iterations", "z", "x", "y"],
                    "properties": {
                        "z": {
                            "description": "Distribution pour la coordonnée (évaluée à chaque itération). \nType: `Molang | Object`",
                            "oneOf": [
                                {
                                    type: "molang"
                                },
                                {
                                    "type": "object",
                                    "required": ["distribution", "extent"],
                                    "properties": {
                                        "distribution": {
                                            "description": "Type de distribution à utiliser. \nType: `String`",
                                            "type": "string",
                                            "enum": ["uniform", "gaussian", "inverse_gaussian", "triangle", "fixed_grid", "jittered_grid"]
                                        },
                                        "extent": {
                                            "description": "Les bornes inférieure et supérieure (incluses) définissent la plage de dispersion, en tant que décalage par rapport au point d'entrée autour duquel la feature est dispersée. \nType: `Molang[2]`",
                                            "type": "array",
                                            "minItems": 2,
                                            "maxItems": 2,
                                            "items": {
                                                type: "molang"
                                            }
                                        },
                                        "step_size": {
                                            "description": "Lorsque le type de distribution est 'grid', définit la distance entre les étapes le long de cet axe. \nType: `Integer`",
                                            "type": "integer",
                                            "minimum": 1
                                        },
                                        "grid_offset": {
                                            "description": "Lorsque le type de distribution est 'grid', définit le décalage le long de cet axe. \nType: `Integer`",
                                            "type": "integer",
                                            "minimum": 0
                                        }
                                    }
                                }
                            ]
                        },
                        "iterations": {
                            "description": "Nombre d'itérations pour générer des positions dispersées. \nType: `Molang`",
                            type: "molang"
                        },
                        "scatter_chance": {
                            "description": "Probabilité que cette dispersion se produise. Non évalué à chaque itération; soit aucune itération ne sera exécutée, soit toutes le seront. \nType: `Molang | Object`",
                            "oneOf": [
                                {
                                    "type": "molang"
                                },
                                {
                                    "type": "object",
                                    "required": ["numerator", "denominator"],
                                    "properties": {
                                        "numerator": {
                                            "description": "Le numérateur de la probabilité. \nType: `Integer`",
                                            "type": "integer",
                                            "minimum": 1
                                        },
                                        "denominator": {
                                            "description": "Le dénominateur de la probabilité. \nType: `Integer`",
                                            "type": "integer",
                                            "minimum": 1
                                        }
                                    }
                                }
                            ]
                        },
                        "coordinate_eval_order": {
                            "description": "L'ordre dans lequel les coordonnées seront évaluées. Doit être utilisé lorsqu'une coordonnée dépend d'une autre. Si omis, les valeurs par défaut à 'xzy'. \nType: `String`",
                            "default": "xzy",
                            "type": "string",
                            "enum": ["xzy", "xyz", "yxz", "yzx", "zxy", "zyx"]
                        },
                        "x": {
                            "$ref": "#/properties/minecraft:feature_rules/properties/distribution/properties/z"
                        },
                        "y": {
                            "$ref": "#/properties/minecraft:feature_rules/properties/distribution/properties/z"
                        }
                    }
                }
            }
        }
    }
};

export const featureRulesSchemaTypeBP: SchemaType = {
    fileMatch: ["**/addon/behavior_pack/feature_rules/**/*.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};