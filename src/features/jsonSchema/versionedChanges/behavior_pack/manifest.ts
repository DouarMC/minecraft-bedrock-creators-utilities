import { SchemaType } from "../../../../types/schema";
import { schemaPatterns } from "../../shared/schemaPatterns";

const baseSchema = {
    $schema: "https://json-schema.org/draft-07/schema#",
    description: "Ce fichier contient toutes les informations basiques d'un pack de comportement qui permet auxquels Minecraft a besoin d'identifier.",
    type: "object",
    required: ["format_version", "header", "modules"],
    properties: {
        format_version: {
            description: "La version de la syntaxe à utiliser pour ce fichier.",
            type: "integer",
            enum: [2]
        },
        header: {
            description: "Contient les informations de base du pack de comportement.",
            type: "object",
            properties: {
                description: {
                    description:
                    "**ℹ️ Texte traduisable**\n\n" +
                    "La description du pack de comportement affichée dans le jeu.",
                    type: "string"
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
                    description:
                    "**ℹ️ Texte traduisable**\n\n" +
                    "Le nom du pack de comportement affiché dans le jeu.",
                    type: "string"
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
                }
            }
        },
        modules: {
            description: "Contient les modules du pack de comportement.",
            type: "array",
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
            items: {
                type: "object",
                properties: {
                    folder_name: {
                        description: "Nom du dossier qui contient le sous-pack.",
                        type: "string"
                    },
                    name: {
                        description:
                        "**ℹ️ Texte traduisable**\n\n" +
                        "Le nom du sous-pack affiché dans le jeu.",
                        type: "string"
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
                    description: "Outil(s) utilisé(s) pour générer ou modifier ce `manifest.json`.",
                    type: "object",
                    patternProperties: {
                        "^[A-Za-z0-9_-]{1,32}$": {
                            description: "Versions semver de l'outil utilisé.",
                            type: "array",
                            items: {
                                type: "string",
                                pattern: schemaPatterns.version
                            }
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
                    type: "string",
                    format: "uri"
                }
            }
        }
    }
};

export const manifestSchemaTypeBP: SchemaType = {
    fileMatch: ["**/addon/behavior_pack/manifest.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};