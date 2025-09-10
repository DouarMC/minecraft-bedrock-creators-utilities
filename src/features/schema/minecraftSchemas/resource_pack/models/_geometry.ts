import { dynamicExamplesSourceKeys } from "../../../utils/shared/schemaEnums";
import { MinecraftJsonSchema } from "../../../model";
import { VersionedSchema, SchemaChange } from "../../../model/versioning";

const baseSchema: MinecraftJsonSchema = {
    "description": "Définit des modèles de géométrie. \nType: `Object`",
    "type": "object",
    "required": ["format_version"],
    "properties": {
        "format_version": {
            "description": "La version du Format à utiliser. \nType: `String`",
            "type": "string",
            enum: [
                "1.8.0", "1.9.0", "1.10.0", "1.11.0", "1.12.0", "1.13.0", "1.14.0", "1.14.1", "1.14.20", "1.14.30", "1.15.0", "1.16.0", "1.16.20", "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100"
            ]
        },
        "debug": {
            "type": "boolean"
        }
    },
    "propertyNames": {
        "pattern": "geometry.[a-zA-Z0-9_.'-:]+",
        "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_model_ids
    },
    "additionalProperties": {
        "type": "object",
        "properties": {
            "debug": {
                "type": "boolean"
            },
            "visible_bounds_width": {
                "description": "Largeur de la boîte de visibilité du modèle (en unités d'espace modèle). \nType: `Number`",
                "type": "number"
            },
            "visible_bounds_height": {
                "description": "Hauteur de la boîte de visibilité du modèle (en unités d'espace modèle). \nType: `Number`",
                "type": "number"
            },
            "visible_bounds_offset": {
                "description": "Décalage de la boîte de visibilité par rapport au point d'origine du modèle (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                "type": "array",
                "minItems": 3,
                "maxItems": 3,
                "items": {
                    "type": "number"
                }
            },
            "texturewidth": {
                "description": "Largeur supposée de la texture associée au modèle (en pixels). \nType: `Integer`", 
                "type": "integer"
            },
            "textureheight": {
                "description": "Hauteur supposée de la texture associée au modèle (en pixels). \nType: `Integer`",
                "type": "integer"
            },
            "cape": {
                "type": "string"
            },
            "bones": {
                "description": "Les os ('bones') définissent le squelette de l'entité : les parties qui peuvent être animées, et auxquelles la géométrie et d'autres os sont attachés. \nType: `Object[]`",
                "type": "array",
                "items": {
                    "type": "object",
                    "required": ["name"],
                    "properties": {
                        "name": {
                            "description": "Le nom de l'os. \nType: `String` \nNote: Les fichiers d'animations se réfèrent à cet os par ce nom.",
                            "type": "string"
                        },
                        "reset": {
                            "type": "boolean"
                        },
                        "neverRender": {
                            "type": "boolean"
                        },
                        "parent": {
                            "description": "Nom de l'os auquel cet os est attaché. \nType: `String` \nNote: Si l'os parent bouge, cet os bougera aussi.",
                            "type": "string"
                        },
                        "pivot": {
                            "description": "Définit le point d'autour duquel l'os tourne ou s'anime. \nType: `Number[3]`",
                            "type": "array",
                            "minItems": 3,
                            "maxItems": 3,
                            "items": {
                                "type": "number"
                            }
                        },
                        "rotation": {
                            "description": "Définit la rotation initiale de l'os autour de son pivot, avant toute animation. Elle est exprimée en degrés, dans l'ordre X, puis Y, puis Z. \nType: `Number[3]`",
                            "type": "array",
                            "minItems": 3,
                            "maxItems": 3,
                            "items": {
                                "type": "number"
                            }
                        },
                        "bind_pose_rotation": {
                            "type": "array",
                            "minItems": 3,
                            "maxItems": 3,
                            "items": {
                                "type": "number"
                            }
                        },
                        "mirror": {
                            "description": "Inverse les UV de la texture sur l'axe X, ce qui retourne l'apparence du cube. Cela inverse également les faces est/ouest.",
                            "type": "boolean"
                        },
                        "inflate": {
                            "description": "Agrandit l'os dans toutes les directions de la valeur donnée. \nType: `Number`",
                            "type": "number"
                        },
                        "debug": {
                            "type": "boolean"
                        },
                        "render_group_id": {
                            "type": "integer",
                            "minimum": 0
                        },
                        "cubes": {
                            "description": "C'est la liste des cubes attachés à cet os. \nType: `Object[]`",
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "origin": {
                                        "description": "Définit le coin inférieur non-roté du cube (les plus petites valeurs X, Y, Z dans l'espace modèle). \nType: `Number[3]`",
                                        "type": "array",
                                        "minItems": 3,
                                        "maxItems": 3,
                                        "items": {
                                            "type": "number"
                                        }
                                    },
                                    "size": {
                                        "description": " Indique les dimensions du cube (largeur, hauteur, profondeur) à partir de l'origin, en unités de l'espace modèle. \nType: `Number[3]`",
                                        "type": "array",
                                        "minItems": 3,
                                        "maxItems": 3,
                                        "items": {
                                            "type": "number"
                                        }
                                    },
                                    "uv": {
                                        "type": "array",
                                        "minItems": 2,
                                        "maxItems": 2,
                                        "items": {
                                            "type": "number"
                                        }
                                    },
                                    "inflate": {
                                        "description": "Agrandit le cube dans toutes les directions de la valeur donnée. \nType: `Number`",
                                        "type": "number"
                                    },
                                    "mirror": {
                                        "description": "Inverse les UV de la texture sur l'axe X, ce qui retourne l'apparence du cube. Cela inverse également les faces est/ouest.",
                                        "type": "boolean"
                                    }
                                }
                            }
                        },
                        "locators": {
                            "description": "Définit les points de référence associés à cet os. \nType: `Object`",
                            "type": "object",
                            "additionalProperties": {
                                "type": "array",
                                "items": {
                                    "type": "number"
                                }
                            }
                        },
                        "poly_mesh": {
                            "description": "EXPERIMENTALE \nPermet de définir des objets géométriques complexes sous fomre de maillage triangulaire ou quadrilatéral. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "normalized_uvs": {
                                    "description": "Détermine le système de coordonnées UV utilisé pour le maillage. \nType: `Boolean` \n`true`: Les UVs sont normalisés entre [0-1]. \n`false`: Les UVs utilisent des dimensions basées sur la taille réelle de la texture (exemple : [0-texture_width]).",
                                    "type": "boolean"
                                },
                                "positions": {
                                    "description": "Définit les positions des sommets du maillage dans l'espace 3D. Chaque sommet est représenté par un tableau [x, y, z]. \nType: `Array[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "array",
                                        "minItems": 3,
                                        "maxItems": 3,
                                        "items": {
                                            "type": "number"
                                        }
                                    }
                                },
                                "normals": {
                                    "description": "Indique les normales pour chaque sommet (vecteurs qui définissent la direction perpendiculaire à la surface pour le rendu). Chaque UV est un tableau [u, v]. \nType: `Array[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "array",
                                        "minItems": 3,
                                        "maxItems": 3,
                                        "items": {
                                            "type": "number"
                                        }
                                    }
                                },
                                "uvs": {
                                    "description": "Définit les coordonnées UV de chaque sommet (pour le mappage de texture). Chaque UV est un tableau [u, v]. \nType: `Array[]`",
                                    "type": "array",
                                    "items": {
                                        "type": "array",
                                        "minItems": 2,
                                        "maxItems": 2,
                                        "items": {
                                            "type": "number"
                                        }
                                    }
                                },
                                "polys": {
                                    "description": "Définit les faces du maillage sous forme de triangles ou de quadrilatères. Premier tableau : liste des faces (triangles ou quads) Chaque face : indices vers les positions, normals, et uvs. \nType: `String | Array[]`",
                                    "oneOf": [
                                        {
                                            "type": "string",
                                            "enum": ["tri_list", "quad_list"]
                                        },
                                        {
                                            "type": "array",
                                            "items": {
                                                "type": "array",
                                                "minItems": 3,
                                                "maxItems": 4,
                                                "items": {
                                                    "type": "array",
                                                    "items": {
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
                                    ]
                                }
                            }
                        },
                        "texture_meshes": {
                            "description": "EXPERIMENTALE \nUtilise des textures pour créer des maillages directement à partir de pixels. \nType: `Object[]`",
                            "type": "array",
                            "items": {
                                "type": "object",
                                "required": ["texture"],
                                "properties": {
                                    "texture": {
                                        "description": "La texture référencé dans le client de l'entité à utiliser. \nType: `String`",
                                        "type": "string"
                                    },
                                    "position": {
                                        "description": "Définit la position du pivot du maillage dans l’espace de l’entité (en [x, y, z]). \nType: `Number[3]`",
                                        "type": "array",
                                        "minItems": 3,
                                        "maxItems": 3,
                                        "items": {
                                            "type": "number"
                                        }
                                    },
                                    "local_pivot": {
                                        "description": "Indique le pivot local de la texture dans l’espace de la texture elle-même (exemple : pour aligner le point d’origine). \nType: `Number[3]`",
                                        "type": "array",
                                        "minItems": 3,
                                        "maxItems": 3,
                                        "items": {
                                            "type": "number"
                                        }
                                    },
                                    "rotation": {
                                        "description": "Rotation du maillage généré par rapport à son offset (en degrés, pour les axes x, y, z). \nType: `Number[3]`",
                                        "type": "array",
                                        "minItems": 3,
                                        "maxItems": 3,
                                        "items": {
                                            "type": "number"
                                        }
                                    },
                                    "scale": {
                                        "description": "Échelle appliquée au maillage par rapport à l’offset, sur les axes x, y, z.",
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
                }
            }
        }
    }
};

const versionedChanges: SchemaChange[] = [
    {
        version: "1.12.0",
        changes: [
            {
                action: "remove",
                target: ["propertyNames"]
            },
            {
                action: "remove",
                target: ["additionalProperties"]
            },
            {
                action: "modify",
                target: ["required"],
                value: ["format_version", "minecraft:geometry"]
            },
            {
                action: "add",
                target: ["properties", "minecraft:geometry"],
                value: {
                    "description": "Contient la défintions de un ou plusieurs modèles. \nType: `Object[]`",
                    "type": "array",
                    "minItems": 1,
                    "items": {
                        "type": "object",
                        "required": ["description"],
                        "properties": {
                            "description": {
                                "description": "Contient les propriétés de description du modèle. \nType: `Object`",
                                "type": "object",
                                "required": ["identifier"],
                                "properties": {
                                    "identifier": {
                                        "description": "L'identifiant du modèle. \nType: `String`",
                                        "type": "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_model_ids
                                    },
                                    "visible_bounds_width": {
                                        "description": "Largeur de la boîte de visibilité du modèle (en unités d'espace modèle). \nType: `Number`",
                                        "type": "number"
                                    },
                                    "visible_bounds_height": {
                                        "description": "Hauteur de la boîte de visibilité du modèle (en unités d'espace modèle). \nType: `Number`",
                                        "type": "number"
                                    },
                                    "visible_bounds_offset": {
                                        "description": "Décalage de la boîte de visibilité par rapport au point d'origine du modèle (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                        "type": "array",
                                        "minItems": 3,
                                        "maxItems": 3,
                                        "items": {
                                            "type": "number"
                                        }
                                    },
                                    "texture_width": {
                                        "description": "Largeur supposée de la texture associée au modèle (en pixels). \nType: `Integer`", 
                                        "type": "integer"
                                    },
                                    "texture_height": {
                                        "description": "Hauteur supposée de la texture associée au modèle (en pixels). \nType: `Integer`",
                                        "type": "integer"
                                    }
                                }
                            },
                            "cape": {
                                "type": "string"
                            },
                            "bones": {
                                "description": "Les os ('bones') définissent le squelette de l'entité : les parties qui peuvent être animées, et auxquelles la géométrie et d'autres os sont attachés. \nType: `Object[]`",
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "required": ["name"],
                                    "properties": {
                                        "name": {
                                            "description": "Le nom de l'os. \nType: `String` \nNote: Les fichiers d'animations se réfèrent à cet os par ce nom.",
                                            "type": "string"
                                        },
                                        "parent": {
                                            "description": "Nom de l'os auquel cet os est attaché. \nType: `String` \nNote: Si l'os parent bouge, cet os bougera aussi.",
                                            "type": "string"
                                        },
                                        "pivot": {
                                            "description": "Définit le point d'autour duquel l'os tourne ou s'anime. \nType: `Number[3]`",
                                            "type": "array",
                                            "minItems": 3,
                                            "maxItems": 3,
                                            "items": {
                                                "type": "number"
                                            }
                                        },
                                        "rotation": {
                                            "description": "Définit la rotation initiale de l'os autour de son pivot, avant toute animation. Elle est exprimée en degrés, dans l'ordre X, puis Y, puis Z. \nType: `Number[3]`",
                                            "type": "array",
                                            "minItems": 3,
                                            "maxItems": 3,
                                            "items": {
                                                "type": "number"
                                            }
                                        },
                                        "mirror": {
                                            "description": "Inverse les UV de la texture sur l'axe X, ce qui retourne l'apparence du cube. Cela inverse également les faces est/ouest. \nType: `Boolean`",
                                            "type": "boolean"
                                        },
                                        "inflate": {
                                            "description": "Agrandit l'os dans toutes les directions de la valeur donnée. \nType: `Number`",
                                            "type": "number"
                                        },
                                        "debug": {
                                            "type": "boolean"
                                        },
                                        "render_group_id": {
                                            "type": "integer",
                                            "minimum": 0
                                        },
                                        "cubes": {
                                            "description": "C'est la liste des cubes attachés à cet os. \nType: `Object[]`",
                                            "type": "array",
                                            "items": {
                                                "type": "object",
                                                "properties": {
                                                    "origin": {
                                                        "description": "Définit le coin inférieur non-roté du cube (les plus petites valeurs X, Y, Z dans l'espace modèle). \nType: `Number[3]`",
                                                        "type": "array",
                                                        "minItems": 3,
                                                        "maxItems": 3,
                                                        "items": {
                                                            "type": "number"
                                                        }
                                                    },
                                                    "size": {
                                                        "description": " Indique les dimensions du cube (largeur, hauteur, profondeur) à partir de l'origin, en unités de l'espace modèle. \nType: `Number[3]`",
                                                        "type": "array",
                                                        "minItems": 3,
                                                        "maxItems": 3,
                                                        "items": {
                                                            "type": "number"
                                                        }
                                                    },
                                                    "rotation": {
                                                        "description": "Le cube est tourné de cette quantité (en degrés, dans l'ordre x puis y puis z) autour du pivot. \nType: `Number[3]`",
                                                        "type": "array",
                                                        "minItems": 3,
                                                        "maxItems": 3,
                                                        "items": {
                                                            "type": "number"
                                                        }
                                                    },
                                                    "pivot": {
                                                        "description": "Définit le point autour duquel le cube tourne ou s'anime. \nType: `Number[3]`",
                                                        "type": "array",
                                                        "minItems": 3,
                                                        "maxItems": 3,
                                                        "items": {
                                                            "type": "number"
                                                        }
                                                    },
                                                    "inflate": {
                                                        "description": "Agrandit le cube dans toutes les directions de la valeur donnée. \nType: `Number`",
                                                        "type": "number"
                                                    },
                                                    "mirror": {
                                                        "description": "Inverse les UV de la texture sur l'axe X, ce qui retourne l'apparence du cube. Cela inverse également les faces est/ouest.",
                                                        "type": "boolean"
                                                    },
                                                    "uv": {
                                                        "description": "Gère les UV du cube. \nType: `Number[2] | Object` \nNote: Il y a deux mode de gestion des UV : un qui est simple qui s'applique à tous le cube, l'autre qui permet de définir un UV pour chaque face du cube.",
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
                                                                "type": "object",
                                                                "properties": {
                                                                    "north": {
                                                                        "description": "Définit la gestion des UV pour cette face. \nType: `Object`",
                                                                        "type": "object",
                                                                        "required": ["uv"],
                                                                        "properties": {
                                                                            "uv": {
                                                                                "description": "Définit les coordonnées UV de la face. \nType: `Number[2]`",
                                                                                "type": "array",
                                                                                "minItems": 2,
                                                                                "maxItems": 2,
                                                                                "items": {
                                                                                    "type": "number"
                                                                                }
                                                                            },
                                                                            "uv_size": {
                                                                                "description": "Définit la taille de l'UV. \nType: `Number[2]`",
                                                                                "type": "array",
                                                                                "minItems": 2,
                                                                                "maxItems": 2,
                                                                                "items": {
                                                                                    "type": "number"
                                                                                }
                                                                            },
                                                                            "material_instance": {
                                                                                "type": "string"
                                                                            }
                                                                        }
                                                                    },
                                                                    "south": {
                                                                        "description": "Définit la gestion des UV pour cette face. \nType: `Object`",
                                                                        "type": "object",
                                                                        "required": ["uv"],
                                                                        "properties": {
                                                                            "uv": {
                                                                                "description": "Définit les coordonnées UV de la face. \nType: `Number[2]`",
                                                                                "type": "array",
                                                                                "minItems": 2,
                                                                                "maxItems": 2,
                                                                                "items": {
                                                                                    "type": "number"
                                                                                }
                                                                            },
                                                                            "uv_size": {
                                                                                "description": "Définit la taille de l'UV. \nType: `Number[2]`",
                                                                                "type": "array",
                                                                                "minItems": 2,
                                                                                "maxItems": 2,
                                                                                "items": {
                                                                                    "type": "number"
                                                                                }
                                                                            },
                                                                            "material_instance": {
                                                                                "type": "string"
                                                                            }
                                                                        }
                                                                    },
                                                                    "east": {
                                                                        "description": "Définit la gestion des UV pour cette face. \nType: `Object`",
                                                                        "type": "object",
                                                                        "required": ["uv"],
                                                                        "properties": {
                                                                            "uv": {
                                                                                "description": "Définit les coordonnées UV de la face. \nType: `Number[2]`",
                                                                                "type": "array",
                                                                                "minItems": 2,
                                                                                "maxItems": 2,
                                                                                "items": {
                                                                                    "type": "number"
                                                                                }
                                                                            },
                                                                            "uv_size": {
                                                                                "description": "Définit la taille de l'UV. \nType: `Number[2]`",
                                                                                "type": "array",
                                                                                "minItems": 2,
                                                                                "maxItems": 2,
                                                                                "items": {
                                                                                    "type": "number"
                                                                                }
                                                                            },
                                                                            "material_instance": {
                                                                                "type": "string"
                                                                            }
                                                                        }
                                                                    },
                                                                    "west": {
                                                                        "description": "Définit la gestion des UV pour cette face. \nType: `Object`",
                                                                        "type": "object",
                                                                        "required": ["uv"],
                                                                        "properties": {
                                                                            "uv": {
                                                                                "description": "Définit les coordonnées UV de la face. \nType: `Number[2]`",
                                                                                "type": "array",
                                                                                "minItems": 2,
                                                                                "maxItems": 2,
                                                                                "items": {
                                                                                    "type": "number"
                                                                                }
                                                                            },
                                                                            "uv_size": {
                                                                                "description": "Définit la taille de l'UV. \nType: `Number[2]`",
                                                                                "type": "array",
                                                                                "minItems": 2,
                                                                                "maxItems": 2,
                                                                                "items": {
                                                                                    "type": "number"
                                                                                }
                                                                            },
                                                                            "material_instance": {
                                                                                "type": "string"
                                                                            }
                                                                        }
                                                                    },
                                                                    "up": {
                                                                        "description": "Définit la gestion des UV pour cette face. \nType: `Object`",
                                                                        "type": "object",
                                                                        "required": ["uv"],
                                                                        "properties": {
                                                                            "uv": {
                                                                                "description": "Définit les coordonnées UV de la face. \nType: `Number[2]`",
                                                                                "type": "array",
                                                                                "minItems": 2,
                                                                                "maxItems": 2,
                                                                                "items": {
                                                                                    "type": "number"
                                                                                }
                                                                            },
                                                                            "uv_size": {
                                                                                "description": "Définit la taille de l'UV. \nType: `Number[2]`",
                                                                                "type": "array",
                                                                                "minItems": 2,
                                                                                "maxItems": 2,
                                                                                "items": {
                                                                                    "type": "number"
                                                                                }
                                                                            },
                                                                            "material_instance": {
                                                                                "type": "string"
                                                                            }
                                                                        }
                                                                    },
                                                                    "down": {
                                                                        "description": "Définit la gestion des UV pour cette face. \nType: `Object`",
                                                                        "type": "object",
                                                                        "required": ["uv"],
                                                                        "properties": {
                                                                            "uv": {
                                                                                "description": "Définit les coordonnées UV de la face. \nType: `Number[2]`",
                                                                                "type": "array",
                                                                                "minItems": 2,
                                                                                "maxItems": 2,
                                                                                "items": {
                                                                                    "type": "number"
                                                                                }
                                                                            },
                                                                            "uv_size": {
                                                                                "description": "Définit la taille de l'UV. \nType: `Number[2]`",
                                                                                "type": "array",
                                                                                "minItems": 2,
                                                                                "maxItems": 2,
                                                                                "items": {
                                                                                    "type": "number"
                                                                                }
                                                                            },
                                                                            "material_instance": {
                                                                                "type": "string"
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        ]
                                                    }
                                                }
                                            }
                                        },
                                        "locators": {
                                            "description": "Définit les points de référence associés à cet os. \nType: `Object`",
                                            "type": "object",
                                            "additionalProperties": {
                                                "oneOf": [
                                                    {
                                                        "type": "array",
                                                        "minItems": 3,
                                                        "maxItems": 3,
                                                        "items": {
                                                            "type": "number"
                                                        }
                                                    },
                                                    {
                                                        "type": "object",
                                                        "required": ["offset", "rotation"],
                                                        "properties": {
                                                            "offset": {
                                                                "description": "Définit la position du locator dans l'espace du modèle. \nType: `Number[3]`",
                                                                "type": "array",
                                                                "minItems": 3,
                                                                "maxItems": 3,
                                                                "items": {
                                                                    "type": "number"
                                                                }
                                                            },
                                                            "rotation": {
                                                                "description": "Définit la rotation du locator dans l'espace du modèle. \nType: `Number[3]`",
                                                                "type": "array",
                                                                "minItems": 3,
                                                                "maxItems": 3,
                                                                "items": {
                                                                    "type": "number"
                                                                }
                                                            },
                                                            "ignore_inherited_scale": {
                                                                "description": "Sert à empêcher un locator d'hériter de la mise à l'échelle de son parent. \nType: `Boolean`",
                                                                "type": "boolean"
                                                            }
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        "poly_mesh": {
                                            "description": "EXPERIMENTALE \nPermet de définir des objets géométriques complexes sous fomre de maillage triangulaire ou quadrilatéral. \nType: `Object`",
                                            "type": "object",
                                            "properties": {
                                                "normalized_uvs": {
                                                    "description": "Détermine le système de coordonnées UV utilisé pour le maillage. \nType: `Boolean` \n`true`: Les UVs sont normalisés entre [0-1]. \n`false`: Les UVs utilisent des dimensions basées sur la taille réelle de la texture (exemple : [0-texture_width]).",
                                                    "type": "boolean"
                                                },
                                                "positions": {
                                                    "description": "Définit les positions des sommets du maillage dans l'espace 3D. Chaque sommet est représenté par un tableau [x, y, z]. \nType: `Array[]`",
                                                    "type": "array",
                                                    "items": {
                                                        "type": "array",
                                                        "minItems": 3,
                                                        "maxItems": 3,
                                                        "items": {
                                                            "type": "number"
                                                        }
                                                    }
                                                },
                                                "normals": {
                                                    "description": "Indique les normales pour chaque sommet (vecteurs qui définissent la direction perpendiculaire à la surface pour le rendu). Chaque UV est un tableau [u, v]. \nType: `Array[]`",
                                                    "type": "array",
                                                    "items": {
                                                        "type": "array",
                                                        "minItems": 3,
                                                        "maxItems": 3,
                                                        "items": {
                                                            "type": "number"
                                                        }
                                                    }
                                                },
                                                "uvs": {
                                                    "description": "Définit les coordonnées UV de chaque sommet (pour le mappage de texture). Chaque UV est un tableau [u, v]. \nType: `Array[]`",
                                                    "type": "array",
                                                    "items": {
                                                        "type": "array",
                                                        "minItems": 2,
                                                        "maxItems": 2,
                                                        "items": {
                                                            "type": "number"
                                                        }
                                                    }
                                                },
                                                "polys": {
                                                    "description": "Définit les faces du maillage sous forme de triangles ou de quadrilatères. Premier tableau : liste des faces (triangles ou quads) Chaque face : indices vers les positions, normals, et uvs. \nType: `String | Array[]`",
                                                    "oneOf": [
                                                        {
                                                            "type": "string",
                                                            "enum": ["tri_list", "quad_list"]
                                                        },
                                                        {
                                                            "type": "array",
                                                            "items": {
                                                                "type": "array",
                                                                "minItems": 3,
                                                                "maxItems": 4,
                                                                "items": {
                                                                    "type": "array",
                                                                    "items": {
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
                                                    ]
                                                }
                                            }
                                        },
                                        "texture_meshes": {
                                            "description": "EXPERIMENTALE \nUtilise des textures pour créer des maillages directement à partir de pixels. \nType: `Object[]`",
                                            "type": "array",
                                            "items": {
                                                "type": "object",
                                                "required": ["texture"],
                                                "properties": {
                                                    "texture": {
                                                        "description": "La texture référencé dans le client de l'entité à utiliser. \nType: `String`",
                                                        "type": "string"
                                                    },
                                                    "position": {
                                                        "description": "Définit la position du pivot du maillage dans l’espace de l’entité (en [x, y, z]). \nType: `Number[3]`",
                                                        "type": "array",
                                                        "minItems": 3,
                                                        "maxItems": 3,
                                                        "items": {
                                                            "type": "number"
                                                        }
                                                    },
                                                    "local_pivot": {
                                                        "description": "Indique le pivot local de la texture dans l’espace de la texture elle-même (exemple : pour aligner le point d’origine). \nType: `Number[3]`",
                                                        "type": "array",
                                                        "minItems": 3,
                                                        "maxItems": 3,
                                                        "items": {
                                                            "type": "number"
                                                        }
                                                    },
                                                    "rotation": {
                                                        "description": "Rotation du maillage généré par rapport à son offset (en degrés, pour les axes x, y, z). \nType: `Number[3]`",
                                                        "type": "array",
                                                        "minItems": 3,
                                                        "maxItems": 3,
                                                        "items": {
                                                            "type": "number"
                                                        }
                                                    },
                                                    "scale": {
                                                        "description": "Échelle appliquée au maillage par rapport à l’offset, sur les axes x, y, z.",
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
                                }
                            }
                        }
                    }
                }
            }
        ]
    },
    {
        version: "1.16.0",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:geometry", "items", "properties", "bones", "items", "properties", "binding"],
                value: {
                    "description": "Expression Molang qui sert à attacher cet os à un l'os résultant de l'expression Molang. \nType: `Molang String`",
                    "type": "string"
                }
            }
        ]
    },
    {
        version: "1.21.0",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:geometry", "items", "properties", "item_display_transforms"],
                value: {
                    "description": "Contient les tranformations d'affichage du modèle en fonction du contexte de rendu du modèle. \nType: `Object`",
                    "type": "object",
                    "properties": {
                        "gui": {
                            "description": "Transformations d'affichage du modèle dans l'interface utilisateur. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "translation": {
                                    "description": "Le décalage du modèle (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -80,
                                        "maximum": 80
                                    }
                                },
                                "rotation": {
                                    "description": "La rotation en degrés du modèle (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -360,
                                        "maximum": 360
                                    }
                                },
                                "scale": {
                                    "description": "L'échelle du modèle (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": 0,
                                        "maximum": 4
                                    }
                                },
                                "rotation_pivot": {
                                    "description": "Le point de pivot de la rotation (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -80,
                                        "maximum": 80
                                    }
                                },
                                "scale_pivot": {
                                    "description": "Le point de pivot de l'échelle (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -80,
                                        "maximum": 80
                                    }
                                },
                                "fit_to_frame": {
                                    "description": "Si 'True', le modèle est automatiquement redimensionné et déplacé pour s'ajuster dans le cadre de l'interface graphique (GUI). \nType: `Boolean`",
                                    "default": true,
                                    "type": "boolean"
                                }
                            }
                        },
                        "firstperson_righthand": {
                            "description": "Transformations d'affichage du modèle dans la main droite en vue à la première personne. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "translation": {
                                    "description": "Le décalage du modèle (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -80,
                                        "maximum": 80
                                    }
                                },
                                "rotation": {
                                    "description": "La rotation en degrés du modèle (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -360,
                                        "maximum": 360
                                    }
                                },
                                "scale": {
                                    "description": "L'échelle du modèle (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": 0,
                                        "maximum": 4
                                    }
                                },
                                "rotation_pivot": {
                                    "description": "Le point de pivot de la rotation (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -80,
                                        "maximum": 80
                                    }
                                },
                                "scale_pivot": {
                                    "description": "Le point de pivot de l'échelle (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -80,
                                        "maximum": 80
                                    }
                                }
                            }
                        },
                        "firstperson_lefthand": {
                            "description": "Transformations d'affichage du modèle dans la main gauche en vue à la première personne. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "translation": {
                                    "description": "Le décalage du modèle (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -80,
                                        "maximum": 80
                                    }
                                },
                                "rotation": {
                                    "description": "La rotation en degrés du modèle (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -360,
                                        "maximum": 360
                                    }
                                },
                                "scale": {
                                    "description": "L'échelle du modèle (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": 0,
                                        "maximum": 4
                                    }
                                },
                                "rotation_pivot": {
                                    "description": "Le point de pivot de la rotation (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -80,
                                        "maximum": 80
                                    }
                                },
                                "scale_pivot": {
                                    "description": "Le point de pivot de l'échelle (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -80,
                                        "maximum": 80
                                    }
                                }
                            }
                        },
                        "thirdperson_righthand": {
                            "description": "Transformations d'affichage du modèle dans la main droite en vue à la troisième personne. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "translation": {
                                    "description": "Le décalage du modèle (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -80,
                                        "maximum": 80
                                    }
                                },
                                "rotation": {
                                    "description": "La rotation en degrés du modèle (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -360,
                                        "maximum": 360
                                    }
                                },
                                "scale": {
                                    "description": "L'échelle du modèle (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": 0,
                                        "maximum": 4
                                    }
                                },
                                "rotation_pivot": {
                                    "description": "Le point de pivot de la rotation (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -80,
                                        "maximum": 80
                                    }
                                },
                                "scale_pivot": {
                                    "description": "Le point de pivot de l'échelle (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -80,
                                        "maximum": 80
                                    }
                                }
                            }
                        },
                        "thirdperson_lefthand": {
                            "description": "Transformations d'affichage du modèle dans la main gauche en vue à la troisième personne. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "translation": {
                                    "description": "Le décalage du modèle (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -80,
                                        "maximum": 80
                                    }
                                },
                                "rotation": {
                                    "description": "La rotation en degrés du modèle (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -360,
                                        "maximum": 360
                                    }
                                },
                                "scale": {
                                    "description": "L'échelle du modèle (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": 0,
                                        "maximum": 4
                                    }
                                },
                                "rotation_pivot": {
                                    "description": "Le point de pivot de la rotation (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -80,
                                        "maximum": 80
                                    }
                                },
                                "scale_pivot": {
                                    "description": "Le point de pivot de l'échelle (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -80,
                                        "maximum": 80
                                    }
                                }
                            }
                        },
                        "ground": {
                            "description": "Transformations d'affichage du modèle au sol. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "translation": {
                                    "description": "Le décalage du modèle (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -80,
                                        "maximum": 80
                                    }
                                },
                                "rotation": {
                                    "description": "La rotation en degrés du modèle (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -360,
                                        "maximum": 360
                                    }
                                },
                                "scale": {
                                    "description": "L'échelle du modèle (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": 0,
                                        "maximum": 4
                                    }
                                },
                                "rotation_pivot": {
                                    "description": "Le point de pivot de la rotation (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -80,
                                        "maximum": 80
                                    }
                                },
                                "scale_pivot": {
                                    "description": "Le point de pivot de l'échelle (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -80,
                                        "maximum": 80
                                    }
                                }
                            }
                        },
                        "fixed": {
                            "description": "Transformations d'affichage du modèle quand il est dans un cadre. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "translation": {
                                    "description": "Le décalage du modèle (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -80,
                                        "maximum": 80
                                    }
                                },
                                "rotation": {
                                    "description": "La rotation en degrés du modèle (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -360,
                                        "maximum": 360
                                    }
                                },
                                "scale": {
                                    "description": "L'échelle du modèle (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": 0,
                                        "maximum": 4
                                    }
                                },
                                "rotation_pivot": {
                                    "description": "Le point de pivot de la rotation (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -80,
                                        "maximum": 80
                                    }
                                },
                                "scale_pivot": {
                                    "description": "Le point de pivot de l'échelle (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -80,
                                        "maximum": 80
                                    }
                                }
                            }
                        },
                        "head": {
                            "description": "Transformations d'affichage du modèle sur la tête du joueur. \nType: `Object`",
                            "type": "object",
                            "properties": {
                                "translation": {
                                    "description": "Le décalage du modèle (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -80,
                                        "maximum": 80
                                    }
                                },
                                "rotation": {
                                    "description": "La rotation en degrés du modèle (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -360,
                                        "maximum": 360
                                    }
                                },
                                "scale": {
                                    "description": "L'échelle du modèle (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": 0,
                                        "maximum": 4
                                    }
                                },
                                "rotation_pivot": {
                                    "description": "Le point de pivot de la rotation (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -80,
                                        "maximum": 80
                                    }
                                },
                                "scale_pivot": {
                                    "description": "Le point de pivot de l'échelle (3 valeurs flottantes pour X, Y, Z). \nType: `Number[3]`",
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "type": "number",
                                        "minimum": -80,
                                        "maximum": 80
                                    }
                                }
                            }
                        }
                    }
                }
            }
        ]
    }
];

export const geometrySchemaTypeRP: VersionedSchema = {
    baseSchema: baseSchema,
    fileMatch: ["**/addon/resource_pack/models/**/*.json"],
    versionedChanges: versionedChanges
};