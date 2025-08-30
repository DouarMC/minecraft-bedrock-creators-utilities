import { SchemaType } from "../../../../types/schema";
import { schemaPatterns } from "../../utils/shared/schemaPatterns";
import { MinecraftJsonSchema } from "../../../../types/minecraftJsonSchema";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier contient toutes les informations basiques d'un pack de comportement qui permet auxquels Minecraft a besoin d'identifier.",
    type: "object",
    required: ["format_version", "header", "modules"],
    properties: {
        format_version: {
            description: "La version de la syntaxe à utiliser pour ce fichier.",
            type: "integer",
            enum: [2, 3]
        },
        header: {
            description: "Contient les informations de base du pack de comportement.",
            type: "object",
            required: ["name", "uuid", "version"],
            properties: {
                description: {
                    description: "La description du pack de comportement affichée dans le jeu.",
                    type: "string",
                    "x-localized": true
                },
                min_engine_version: {
                    description: "Définit la version minimale du moteur de jeu requise pour ce pack de comportement.",
                    type: "array",
                    minItems: 3,
                    maxItems: 3,
                    items: {
                        type: "integer"
                    }
                },
                name: {
                    description: "Le nom du pack de comportement affiché dans le jeu.",
                    type: "string",
                    "x-localized": true
                },
                uuid: {
                    description: "L'identifiant unique du pack de comportement.",
                    type: "string",
                    pattern: schemaPatterns.uuid
                },
                version: {
                    description: "La version du pack de comportement.",
                    oneOf: [
                        {
                            type: "array",
                            minItems: 3,
                            maxItems: 3,
                            items: {
                                type: "integer"
                            }
                        },
                        {
                            type: "string",
                            pattern: schemaPatterns.version
                        }
                    ]
                },
                platform_locked: {
                    default: false,
                    type: "boolean"
                }
            }
        },
        modules: {
            description: "Contient les modules du pack de comportement.",
            type: "array",
            minItems: 1,
            items: {
                oneOf: [
                    {
                        type: "object",
                        required: ["type", "uuid", "version"],
                        properties: {
                            description: {
                                description: "Description du module.",
                                type: "string"
                            },
                            type: {
                                description: "Le type de module.",
                                type: "string",
                                enum: ["data"]
                            },
                            uuid: {
                                description: "L'identifiant unique du module.",
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
                                            type: "integer"
                                        }
                                    },
                                    {
                                        type: "string",
                                        pattern: schemaPatterns.version
                                    }
                                ]
                            }
                        }
                    },
                    {
                        type: "object",
                        required: ["type", "uuid", "version", "language", "entry"],
                        properties: {
                            description: {
                                description: "Description du module de langage.",
                                type: "string"
                            },
                            type: {
                                description: "Le type de module.",
                                type: "string",
                                enum: ["script"]
                            },
                            uuid: {
                                description: "L'identifiant unique du module de langage.",
                                type: "string",
                                pattern: schemaPatterns.uuid
                            },
                            version: {
                                description: "La version du module de langage.",
                                oneOf: [
                                    {
                                        type: "array",
                                        minItems: 3,
                                        maxItems: 3,
                                        items: {
                                            type: "integer"
                                        }
                                    },
                                    {
                                        type: "string",
                                        pattern: schemaPatterns.version
                                    }
                                ]
                            },
                            language: {
                                description: "Le langage de programmation utilisé par le script. Doit être `javascript`.",
                                type: "string",
                                enum: ["javascript"]
                            },
                            entry: {
                                description: "Chemin vers le fichier d'entrée du script.",
                                type: "string"
                            }
                        }
                    }
                ]
            }
        },
        dependencies: {
            description: "Contient les dépendances du pack de comportement.",
            type: "array",
            items: {
                oneOf: [
                    {
                        type: "object",
                        required: ["module_name", "version"],
                        properties: {
                            module_name: {
                                description: "Le nom du module de script que ce pack de comportement dépend.",
                                type: "string",
                                enum: [
                                    "@minecraft/server",
                                    "@minecraft/server-ui",
                                    "@minecraft/server-gametest",
                                    "@minecraft/server-net",
                                    "@minecraft/server-admin",
                                    "@minecraft/common",
                                    "@minecraft/debug-utilities",
                                    "@minecraft/server-editor",
                                    "@minecraft/diagnostics"
                                ]
                            },
                            version: {
                                description: "La version du module de script.",
                                type: "string",
                                pattern: schemaPatterns.script_version
                            }
                        }
                    },
                    {
                        type: "object",
                        required: ["uuid", "version"],
                        properties: {
                            uuid: {
                                description: "L'identifiant unique du pack de la dépendance.",
                                type: "string",
                                pattern: schemaPatterns.uuid
                            },
                            version: {
                                description: "La version de la dépendance.",
                                oneOf: [
                                    {
                                        type: "array",
                                        minItems: 3,
                                        maxItems: 3,
                                        items: {
                                            type: "integer"
                                        }
                                    },
                                    {
                                        type: "string",
                                        pattern: schemaPatterns.version
                                    }
                                ]
                            }
                        }
                    }
                ]
            }
        },
        capabilities: {
            description: "Fonctionnalités facultatives du pack de comportement à activer.",
            type: "array",
            items: {
                type: "string",
                enum: ["chemistry", "editorExtension", "script_eval"]
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
                        description: "Nom du dossier qui contient le sous-pack.",
                        type: "string"
                    },
                    name: {
                        description: "Le nom du sous-pack affiché dans le jeu.",
                        type: "string",
                        "x-localized": true
                    },
                    memory_tier: {
                        description: "Quantité de RAM en `memory_tier` que l'appareil doit avoir pour activer ce sous-pack. 1 `memory_tier` correspond à 0.25 Go de RAM.",
                        type: "integer"
                    }
                }
            }
        },
        metadata: {
            description: "Informations supplémentaires sur le pack qui ne sont pas utilisées par le jeu.",
            type: "object",
            properties: {
                authors: {
                    description: "Liste des auteurs du pack de comportement.",
                    type: "array",
                    items: {
                        type: "string"
                    }
                },
                license: {
                    description: "Licence du pack de comportement.",
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
                    description: "Type de contexte ciblé pour ce pack. En mettant `addon`, les succès ne seront pas désactivés.",
                    type: "string",
                    enum: ["addon"]
                },
                url: {
                    description: "URL du site web du pack de comportement.",
                    type: "string"
                }
            }
        }
    }
};

export const manifestSchemaTypeBP: SchemaType = {
    fileMatch: ["**/addon/behavior_pack/manifest.json"],
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
                    target: ["properties", "modules", "items", 0, "properties", "version"],
                    value: {
                        description: "La version du module.",
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
                    target: ["properties", "modules", "items", 1, "properties", "version"],
                    value: {
                        description: "La version du module de langage.",
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
                    target: ["properties", "dependencies", "items", "oneOf", 1, "properties", "version"],
                    value: {
                        description: "La version de la dépendance.",
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