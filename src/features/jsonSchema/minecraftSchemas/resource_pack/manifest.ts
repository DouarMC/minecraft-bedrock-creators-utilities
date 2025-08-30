import { SchemaType } from "../../../../types/schema";
import { schemaPatterns } from "../../utils/shared/schemaPatterns";
import { MinecraftJsonSchema } from "../../../../types/minecraftJsonSchema";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier contient toutes les informations basiques d'un resource pack qui permet auxquels Minecraft a besoin d'identifier.",
    type: "object",
    required: ["format_version", "header", "modules"],
    properties: {
        format_version: {
            description: "La version de la syntaxe à utiliser pour ce fichier.",
            type: "integer",
            enum: [2, 3]
        },
        header: {
            description: "Contient des informtations sur le Pack qui sont pour la plupart accessible en public.",
            type: "object",
            required: ["name", "uuid", "version"],
            properties: {
                description: {
                    description: "Description du pack affiché en dessous du nom du pack.",
                    type: "string",
                    "x-localized": true
                },
                min_engine_version: {
                    description: "Définit la version minimale du jeu pour que ce pack soit compatible avec.",
                    type: "array",
                    minItems: 3,
                    maxItems: 3,
                    items: {
                        type: "integer",
                        minimum: 0
                    }
                },
                name: {
                    description: "Nom du pack affiché dans Minecraft.",
                    type: "string",
                    "x-localized": true
                },
                uuid: {
                    description: "L'identifiant du pack.",
                    type: "string",
                    pattern: schemaPatterns.uuid
                },
                version: {
                    description: "La version du pack.",
                    oneOf: [
                        {
                            type: "array",
                            minItems: 3,
                            maxItems: 3,
                            items: {
                                type: "integer",
                                minimum: 0
                            }
                        },
                        {
                            type: "string"
                        }
                    ]
                },
                pack_scope: {
                    description: "Définit où le pack peut être activé.",
                    default: "any",
                    type: "string",
                    enum: ["world", "global", "any"]
                },
                platform_locked: {
                    default: false,
                    type: "boolean"
                }
            }
        },
        modules: {
            description: "Informations sur le type de contenu importé.",
            type: "array",
            minItems: 1,
            items: {
                type: "object",
                properties: {
                    description: {
                        description: "Description du module.",
                        type: "string"
                    },
                    type: {
                        description: "Type du Module.",
                        type: "string",
                        enum: ["resources"]
                    },
                    uuid: {
                        description: "L'UUID du module qui doit être différent de l'en-tête.",
                        type: "string",
                        pattern: schemaPatterns.uuid
                    },
                    version: {
                        description: "La version du module.",
                        oneOf: [
                            {
                                type: "array",
                                minItems: 3,
                                maxItems: 3,
                                items: {
                                    type: "integer",
                                    minimum: 0
                                }
                            },
                            {
                                type: "string"
                            }
                        ]
                    }
                }
            }
        },
        dependencies: {
            description: "Contient les dépendences pour que ce pack fonctionne correctement.",
            type: "array",
            items: {
                type: "object",
                properties: {
                    uuid: {
                        description: "UUID du pack auquel ce Pack est dépendant à celui-ci.",
                        type: "string",
                        pattern: schemaPatterns.uuid
                    },
                    version: {
                        description: "Version de l'autre pack nécessaire à utiliser.",
                        oneOf: [
                            {
                                type: "array",
                                minItems: 3,
                                maxItems: 3,
                                items: {
                                    type: "integer",
                                    minimum: 0
                                }
                            },
                            {
                                type: "string"
                            }
                        ]
                    }
                }
            }
        },
        capabilities: {
            description: "Fonctionnalités facultatives pouvant être activées dans Minecraft.",
            type: "array",
            items: {
                type: "string",
                enum: ["raytraced", "pbr"]
            }
        },
        subpacks: {
            description: "Liste des sous-packs inclus dans ce pack.",
            type: "array",
            required: ["folder_name", "name", "memory_tier"],
            items: {
                type: "object",
                properties: {
                    folder_name: {
                        description: "Nom du dossier à utiliser pour ce sous-pack.",
                        type: "string"
                    },
                    name: {
                        description: "Nom qui sera affiché lors de la sélection des sous-packs.",
                        type: "string",
                        "x-localized": true
                    },
                    memory_tier: {
                        description: "Quantité de RAM en mémoire tier que l'appareil doit avoir pour activer ce sous-pack. 1 mémoire tier = 0.25 Go.",
                        type: "integer"
                    }
                }
            }
        },
        metadata: {
            description: "Informations supplémentaires sur le pack.",
            type: "object",
            properties: {
                authors: {
                    description: "Liste des auteurs du pack.",
                    type: "array",
                    items: {
                        type: "string"
                    }
                },
                license: {
                    description: "Licence sous laquelle le pack est publié.",
                    type: "string"
                },
                generated_with: {
                    description: "Outil(s) utilisé(s) pour générer ou modifier ce manifest.json.",
                    type: "object",
                    propertyNames: {
                        pattern: "^[A-Za-z0-9_-]{1,32}$"
                    },
                    additionalProperties: {
                        description: "Versions semver de l'outil ayant modifié le fichier.",
                        type: "array",
                        items: {
                            type: "string"
                        }
                    }
                },
                product_type: {
                    description: "Type de contexte ciblé pour ce pack. En mettant `addon`, les succès se seront pas désactivés.",
                    type: "string",
                    enum: ["addon"]
                },
                url: {
                    description: "URL du site web du pack.",
                    type: "string"
                }
            }
        }
    }
};

export const manifestSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/manifest.json"],
    baseSchema: baseSchema,
    versionedChanges: [
        {
            version: 3,
            changes: [
                {
                    action: "modify",
                    target: ["properties", "header", "properties", "min_engine_version"],
                    value: {
                        description: "Définit la version minimale du jeu pour que ce pack soit compatible avec.",
                        type: "string",
                        examples: [
                            "1.8.0", "1.9.0", "1.10.0", "1.11.0", "1.12.0", "1.13.0", "1.14.0", "1.14.1", "1.14.20", "1.14.30", "1.15.0", "1.16.0", "1.16.20", "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
                        ]
                    }
                },
                {
                    action: "modify",
                    target: ["properties", "header", "properties", "version"],
                    value: {
                        description: "La version du pack.",
                        oneOf: [
                            {
                                type: "string"
                            },
                            {
                                type: "object",
                                required: ["major", "minor", "patch"],
                                properties: {
                                    buildMeta: {
                                        description: "Informations supplémentaires sur la version.",
                                        type: "string"
                                    },
                                    major: {
                                        description: "La version majeure du pack.",
                                        type: "integer"
                                    },
                                    minor: {
                                        description: "La version mineure du pack.",
                                        type: "integer"
                                    },
                                    patch: {
                                        description: "La version de correction du pack.",
                                        type: "integer"
                                    },
                                    preRelease: {
                                        description: "La version pré-release du pack.",
                                        type: "string"
                                    }
                                }
                            }
                        ]
                    }
                },
                {
                    action: "modify",
                    target: ["properties", "modules", "items", "properties", "version"],
                    value: {
                        description: "La version du pack.",
                        oneOf: [
                            {
                                type: "string"
                            },
                            {
                                type: "object",
                                required: ["major", "minor", "patch"],
                                properties: {
                                    buildMeta: {
                                        description: "Informations supplémentaires sur la version.",
                                        type: "string"
                                    },
                                    major: {
                                        description: "La version majeure du pack.",
                                        type: "integer"
                                    },
                                    minor: {
                                        description: "La version mineure du pack.",
                                        type: "integer"
                                    },
                                    patch: {
                                        description: "La version de correction du pack.",
                                        type: "integer"
                                    },
                                    preRelease: {
                                        description: "La version pré-release du pack.",
                                        type: "string"
                                    }
                                }
                            }
                        ]
                    }
                },
                {
                    action: "modify",
                    target: ["properties", "dependencies", "items", "properties", "version"],
                    value: {
                        description: "La version du pack.",
                        oneOf: [
                            {
                                type: "string"
                            },
                            {
                                type: "object",
                                required: ["major", "minor", "patch"],
                                properties: {
                                    buildMeta: {
                                        description: "Informations supplémentaires sur la version.",
                                        type: "string"
                                    },
                                    major: {
                                        description: "La version majeure du pack.",
                                        type: "integer"
                                    },
                                    minor: {
                                        description: "La version mineure du pack.",
                                        type: "integer"
                                    },
                                    patch: {
                                        description: "La version de correction du pack.",
                                        type: "integer"
                                    },
                                    preRelease: {
                                        description: "La version pré-release du pack.",
                                        type: "string"
                                    }
                                }
                            }
                        ]
                    }
                },
                {
                    action: "add",
                    target: ["properties", "settings"],
                    value: {
                        description: "Définitions des paramètres configurables par le joueur.",
                        type: "array",
                        minItems: 1,
                        items: {
                            oneOf: [
                                {
                                    type: "object",
                                    required: ["text", "type"],
                                    properties: {
                                        text: {
                                            description: "Texte affiché pour le paramètre.",
                                            type: "string"
                                        },
                                        type: {
                                            description: "Type de paramètre.",
                                            type: "string",
                                            enum: ["label"]
                                        }
                                    }
                                },
                                {
                                    type: "object",
                                    required: ["default", "max", "min", "name", "step", "text", "type"],
                                    properties: {
                                        default: {
                                            description: "Valeur par défaut du paramètre.",
                                            type: "number"
                                        },
                                        max: {
                                            description: "Valeur maximale du paramètre.",
                                            type: "number"
                                        },
                                        min: {
                                            description: "Valeur minimale du paramètre.",
                                            type: "number"
                                        },
                                        name: {
                                            description: "Identifiant du paramètre.",
                                            type: "string",
                                            pattern: schemaPatterns.identifier_with_namespace
                                        },
                                        step: {
                                            description: "Pas d'incrémentation pour le paramètre.",
                                            type: "number",
                                            exclusiveMinimum: 0
                                        },
                                        text: {
                                            description: "Texte affiché pour le paramètre.",
                                            type: "string"
                                        },
                                        type: {
                                            description: "Type de paramètre.",
                                            type: "string",
                                            enum: ["slider"]
                                        }
                                    }
                                },
                                {
                                    type: "object",
                                    required: ["default", "name", "text", "type"],
                                    properties: {
                                        default: {
                                            description: "Valeur par défaut du paramètre.",
                                            type: "boolean"
                                        },
                                        name: {
                                            description: "Identifiant du paramètre.",
                                            type: "string",
                                            pattern: schemaPatterns.identifier_with_namespace
                                        },
                                        text: {
                                            description: "Texte affiché pour le paramètre.",
                                            type: "string"
                                        },
                                        type: {
                                            description: "Type de paramètre.",
                                            type: "string",
                                            enum: ["toggle"]
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            ]
        }
    ]
};