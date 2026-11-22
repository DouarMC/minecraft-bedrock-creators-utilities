import { commonSchemas } from "../../shared/commonSchemas";
import { dynamicExamplesSourceKeys } from "../../shared/schemaEnums";
import { MinecraftJsonSchema } from "../../../common/types/MinecraftJsonSchema";
import { VersionedSchema, SchemaChange } from "../../../common/types/VersionedSchema";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier sert à définir une table d'échanges avec une entité qui peut marchander.",
    type: "object",
    required: ["tiers"],
    properties: {
        format_version: {
            description: "La version du Format à utiliser.",
            type: "string",
            enum: [
                "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100", "1.21.110", "1.21.120", "1.21.130", "1.26.0", "1.26.10", "1.26.20", "1.26.30", "1.26.40", "1.26.50", "1.26.60"
            ]
        },
        tiers: {
            description: "Contient les différents tiers qui sont des ensemble de transactions pouvant être proposées par l'entité.",
            type: "array",
            items: {
                type: "object",
                properties: {
                    groups: {
                        description: "Contient les différentes groupes de transactions qui sont un moyen de sélectionner aléatoirement les échanges qu'un marchand peut proposer dans un tier donné.",
                        type: "array",
                        items: {
                            type: "object",
                            required: ["trades"],
                            properties: {
                                num_to_select: {
                                    description: "Définit combien d'échanges seront sélectionnés au hasard parmi ceux disponibles. Si `num_to_select = 0`, toutes les transactions seront sélectionnées (comportement par défaut).",
                                    default: 0,
                                    type: "integer"
                                },
                                trades: {
                                    description: "Contients les différentes transactions possibles.",
                                    type: "array",
                                    items: {
                                        type: "object",
                                        required: ["wants", "gives"],
                                        properties: {
                                            max_uses: {
                                                description: "Définit le nombre de fois que cet échange peut se faire avant que le marchand doit se réapprovisionner. Si 'max_uses': 0, l'échange est affiché mais ne peut pas être effectué. Si 'max_uses' est négatif, l'échange peut être effectué un nombre infini de fois.",
                                                default: 7,
                                                type: "integer"
                                            },
                                            reward_exp: {
                                                description: "Définit si le joueur reçoit de l'expérience pour avoir effectué cet échange.",
                                                default: true,
                                                type: "boolean"
                                            },
                                            trader_exp: {
                                                description: "Définit le montant d'expérience à récompenser au marchand.",
                                                default: 1,
                                                type: "integer",
                                                minimum: 0
                                            },
                                            wants: {
                                                description: "Item(s) que le marchand veut.",
                                                type: "array",
                                                minItems: 1,
                                                items: {
                                                    oneOf: [
                                                        {
                                                            type: "object",
                                                            required: ["item"],
                                                            properties: {
                                                                item: {
                                                                    description: "Item que le marchand veut.",
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                                                },
                                                                quantity: {
                                                                    description: "Quantité de l'item que le marchand veut.",
                                                                    default: {
                                                                        min: 1,
                                                                        max: 1
                                                                    },
                                                                    oneOf: [
                                                                        {
                                                                            type: "integer",
                                                                            minimum: 1
                                                                        },
                                                                        {
                                                                            type: "object",
                                                                            required: ["min", "max"],
                                                                            properties: {
                                                                                min: {
                                                                                    description: "Quantité minimale de l'item que le marchand veut.",
                                                                                    default: 1,
                                                                                    type: "integer",
                                                                                    minimum: 1
                                                                                },
                                                                                max: {
                                                                                    description: "Quantité maximale de l'item que le marchand veut.",
                                                                                    default: 1,
                                                                                    type: "integer",
                                                                                    minimum: 1
                                                                                }
                                                                            }
                                                                        }
                                                                    ]
                                                                },
                                                                price_multiplier: {
                                                                    description: "Multiplicateur de prix qui dicte comment la quantité de base d'un item est modifiée en raison de certains événements.",
                                                                    default: 0,
                                                                    type: "number"
                                                                },
                                                                functions: {
                                                                    description: "Contient les différentes fonctions qui appliqueront des modifications à l'Item que le marchand donne.",
                                                                    $ref: "#/properties/tiers/items/properties/groups/items/properties/trades/items/properties/wants/items/oneOf/0/properties/functions"
                                                                },
                                                                filters: {
                                                                    description: "Filtre qui doit être validé pour que l'échange soit disponible.",
                                                                    ...commonSchemas.minecraft_filter
                                                                }
                                                            }
                                                        },
                                                        {
                                                            type: "object",
                                                            required: ["choice"],
                                                            properties: {
                                                                choice: {
                                                                    description: "Les choix d'items possibles pour cette entrée.",
                                                                    type: "array",
                                                                    items: {
                                                                        $ref: "#/properties/tiers/items/properties/groups/items/properties/trades/items/properties/wants/items/oneOf/0"
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    ]
                                                }
                                            },
                                            gives: {
                                                description: "Item que le marchand donne.",
                                                type: "array",
                                                minItems: 1,
                                                items: {
                                                    oneOf: [
                                                        {
                                                            type: "object",
                                                            required: ["item"],
                                                            properties: {
                                                                item: {
                                                                    description: "Item que le marchand veut.",
                                                                    type: "string",
                                                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                                                },
                                                                quantity: {
                                                                    description: "Quantité de l'item que le marchand veut.",
                                                                    default: {
                                                                        min: 1,
                                                                        max: 1
                                                                    },
                                                                    oneOf: [
                                                                        {
                                                                            type: "integer",
                                                                            minimum: 1
                                                                        },
                                                                        {
                                                                            type: "object",
                                                                            required: ["min", "max"],
                                                                            properties: {
                                                                                min: {
                                                                                    description: "Quantité minimale de l'item que le marchand veut.",
                                                                                    default: 1,
                                                                                    type: "integer",
                                                                                    minimum: 1
                                                                                },
                                                                                max: {
                                                                                    description: "Quantité maximale de l'item que le marchand veut.",
                                                                                    default: 1,
                                                                                    type: "integer",
                                                                                    minimum: 1
                                                                                }
                                                                            }
                                                                        }
                                                                    ]
                                                                },
                                                                price_multiplier: {
                                                                    description: "Multiplicateur de prix qui dicte comment la quantité de base d'un item est modifiée en raison de certains événements.",
                                                                    default: 0,
                                                                    type: "number"
                                                                },
                                                                functions: {
                                                                    description: "Contient les différentes fonctions qui appliqueront des modifications à l'Item que le marchand donne.",
                                                                    $ref: "#/properties/tiers/items/properties/groups/items/properties/trades/items/properties/wants/items/oneOf/0/properties/functions"
                                                                },
                                                                filters: {
                                                                    description: "Filtre qui doit être validé pour que l'échange soit disponible.",
                                                                    ...commonSchemas.minecraft_filter
                                                                }
                                                            }
                                                        },
                                                        {
                                                            type: "object",
                                                            required: ["choice"],
                                                            properties: {
                                                                choice: {
                                                                    description: "Les choix d'items possibles pour cette entrée.",
                                                                    type: "array",
                                                                    items: {
                                                                        $ref: "#/properties/tiers/items/properties/groups/items/properties/trades/items/properties/wants/items/oneOf/0"
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    ]
                                                }
                                            },
                                            weight: {
                                                description: "Définit la probabilité que cet échange soit sélectionné par rapport aux autres échanges dans le même groupe. Plus le poids est élevé, plus la probabilité de sélection est grande.",
                                                default: 1,
                                                type: "integer",
                                                minimum: 1
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    total_exp_required: {
                        description: "Expérience totale requise pour débloquer ce tier. Si un nombre négatif est spécifié, le tier sera débloqué par défaut.",
                        type: "integer",
                        minimum: 0
                    }
                }
            }
        }
    }
};

const versionedChanges: SchemaChange[] = [
    {
        version: "1.21.30",
        changes: [
            {
                action: "add",
                target: ["properties", "tiers", "items", "required"],
                value: ["groups", "total_exp_required"]
            }
        ]
    }
];

export const versionedSchema: VersionedSchema = {
    baseSchema: baseSchema,
    versionedChanges: versionedChanges
};

export default versionedSchema;