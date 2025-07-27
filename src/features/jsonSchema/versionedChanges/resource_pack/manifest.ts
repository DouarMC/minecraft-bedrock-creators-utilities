import { SchemaType, SchemaChange } from "../../../../types/schema";

const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Ce fichier contient toutes les informations basiques d'un resource pack qui permet auxquels Minecraft a besoin d'identifier. \nType : Object",
    "type": "object",
    "required": ["format_version", "header", "modules"],
    "properties": {
        "format_version": {
            "description": "La version de la syntaxe à utiliser pour ce fichier. \nType : Integer",
            "const": 2
        },
        "header": {
            "description": "Contient des informtations sur le Pack qui sont pour la plupart accessible en public. \nType : Object",
            "type": "object",
            "properties": {
                "description": {
                    "description": "Description du pack affiché en dessous du nom du pack. \nType : Localization String",
                    "type": "string"
                },
                "min_engine_version": {
                    "description": "Définit la version minimale du jeu pour que ce pack soit compatible avec. \nType : Integer[3]",
                    "type": "array",
                    "minItems": 3,
                    "maxItems": 3,
                    "items": {
                        "type": "integer",
                        "minimum": 0
                    }
                },
                "name": {
                    "description": "Nom du pack affiché dans Minecraft. \nType : Localization String",
                    "type": "string"
                },
                "uuid": {
                    "description": "L'identifiant du pack. \nType : String",
                    "$ref": "https://douarmc.github.io/minecraft_bedrock_json_schemas/common.json#/definitions/uuid"
                },
                "version": {
                    "description": "La version du pack. \nType: `Integer[3] | String`",
                    "oneOf": [
                        {
                            "type": "array",
                            "minItems": 3,
                            "maxItems": 3,
                            "items": {
                                "type": "integer",
                                "minimum": 0
                            }
                        },
                        {
                            "type": "string",
                            "pattern": "^\\d+\\.\\d+\\.\\d+$"
                        }
                    ]
                },
                "pack_scope": {
                    "description": "Définit où le pack peut être activé. \nType : String",
                    "default": "any",
                    "type": "string",
                    "enum": ["world", "global", "any"]
                }
            }
        },
        "modules": {
            "description": "Informations sur le type de contenu importé. \nType : Object[]",
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "description": {
                        "description": "Description du module. \nType : String",
                        "type": "string"
                    },
                    "type": {
                        "description": "Type du Module. \nType : String",
                        "type": "string",
                        "enum": ["resources"]
                    },
                    "uuid": {
                        "description": "L'UUID du module qui doit être différent de l'en-tête. \nType : String",
                        "$ref": "https://douarmc.github.io/minecraft_bedrock_json_schemas/common.json#/definitions/uuid"
                    },
                    "version": {
                        "description": "La version du module. \nType: `Integer[3] | String`",
                        "oneOf": [
                            {
                                "type": "array",
                                "minItems": 3,
                                "maxItems": 3,
                                "items": {
                                    "type": "integer",
                                    "minimum": 0
                                }
                            },
                            {
                                "type": "string",
                                "pattern": "^\\d+\\.\\d+\\.\\d+$"
                            }
                        ]
                    }
                }
            }
        },
        "dependencies": {
            "description": "Contient les dépendences pour que ce pack fonctionne correctement. \nType : Object[]",
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "uuid": {
                        "description": "UUID du pack auquel ce Pack est dépendant à celui-ci. \nType : String",
                        "$ref": "https://douarmc.github.io/minecraft_bedrock_json_schemas/common.json#/definitions/uuid"
                    },
                    "version": {
                        "description": "Version de l'autre pack nécessaire à utiliser. \nType: `Integer[3] | String`",
                        "oneOf": [
                            {
                                "type": "array",
                                "minItems": 3,
                                "maxItems": 3,
                                "items": {
                                    "type": "integer",
                                    "minimum": 0
                                }
                            },
                            {
                                "type": "string",
                                "pattern": "^\\d+\\.\\d+\\.\\d+$"
                            }
                        ]
                    }
                }
            }
        },
        "capabilities": {
            "description": "Fonctionnalités facultatives pouvant être activées dans Minecraft. \nType : String[]",
            "type": "array",
            "items": {
                "type": "string",
                "enum": ["raytraced", "pbr"]
            }
        },
        "subpacks": {
            "description": "Liste des sous-packs inclus dans ce pack. \nType : Object[]",
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "folder_name": {
                        "description": "Nom du dossier à utiliser pour ce sous-pack. Doit être unique. \nType : String",
                        "type": "string"
                    },
                    "name": {
                        "description": "Nom qui sera affiché lors de la sélection des sous-packs. \nType : Localization String",
                        "type": "string"
                    },
                    "memory_tier": {
                        "description": "Quantité de RAM en mémoire tier que l'appareil doit avoir pour activer ce sous-pack. 1 mémoire tier = 0.25 Go. \nType : Integer",
                        "type": "integer"
                    }
                }
            }
        },
        "metadata": {
            "description": "Informations supplémentaires sur le pack. \nType: `Object`",
            "type": "object",
            "properties": {
                "authors": {
                    "description": "Liste des auteurs du pack. \nType: `String[]`",
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "license": {
                    "description": "Licence sous laquelle le pack est publié. \nType: `String`",
                    "type": "string"
                },
                "generated_with": {
                    "description": "Outil(s) utilisé(s) pour générer ou modifier ce manifest.json. \nType: `Object`",
                    "type": "object",
                    "patternProperties": {
                        "^[A-Za-z0-9_-]{1,32}$": {
                            "description": "Versions semver de l'outil ayant modifié le fichier. \nType: `String[]`",
                            "type": "array",
                            "items": {
                                "type": "string",
                                "pattern": "^\\d+\\.\\d+\\.\\d+$"
                            }
                        }
                    }
                },
                "product_type": {
                    "description": "Type de contexte ciblé pour ce pack. \nType: `String` \nNote: En mettant `addon`, les succès se seront pas désactivés.",
                    "type": "string",
                    "enum": ["addon"]
                },
                "url": {
                    "description": "URL du site web du pack. \nType: `String`",
                    "type": "string"
                }
            }
        }
    }
};

export const manifestSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/manifest.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};