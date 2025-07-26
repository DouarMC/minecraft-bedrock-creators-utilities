import { SchemaType } from "../../../../../types/schema";

const baseSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Ce fichier sert à créer des élements UI. \nType: `Object`",
    "type": "object",
    "properties": {
        "namespace": {
            "description": "Namespace pour les éléments UI définit dans ce fichier. \nType: `String`",
            "type": "string"
        }
    },
    "propertyNames": {
        "not": {
            "enum": ["$schema"]
        }
    },
    "additionalProperties": {
        "$ref": "#/definitions/common_properties",
        "allOf": [
            {
                "if": {
                    "properties": {
                        "type": {
                            "enum": [
                                "panel", "stack_panel", "collection_panel", "grid", "label", "image", "input_panel", "button",
                                "toggle", "dropdown", "slider", "slider_box", "edit_box", "scroll_view", "scrollbar_track",
                                "scrollbar_box", "factory", "screen", "custom", "selection_wheel", false
                            ]
                        }
                    }
                },
                "then": {
                    "$ref": "#/definitions/control_properties"
                }
            },
            {
                "if": {
                    "properties": {
                        "type": {
                            "enum": [
                                "panel", "stack_panel", "collection_panel", "grid", "label", "image", "input_panel", "button",
                                "toggle", "dropdown", "slider", "slider_box", "edit_box", "scroll_view", "scrollbar_track",
                                "scrollbar_box", "factory", "screen", "custom", "selection_wheel", false
                            ]
                        }
                    }
                },
                "then": {
                    "$ref": "#/definitions/layout_properties"
                }
            },
            {
                "if": {
                    "properties": {
                        "type": {
                            "enum": ["stack_panel", false]
                        }
                    }
                },
                "then": {
                    "$ref": "#/definitions/stack_panel_properties"
                }
            },
            {
                "if": {
                    "properties": {
                        "type": {
                            "enum": ["label", false]
                        }
                    }
                },
                "then": {
                    "$ref": "#/definitions/text_properties"
                }
            },
            {
                "if": {
                    "properties": {
                        "type": {
                            "enum": ["stack_panel", "collection_panel", "grid", false]
                        }
                    }
                },
                "then": {
                    "$ref": "#/definitions/collecton_properties"
                }
            },
            {
                "if": {
                    "properties": {
                        "type": {
                            "enum": ["image", false]
                        }
                    }
                },
                "then": {
                    "$ref": "#/definitions/sprite_properties"
                }
            },
            {
                "if": {
                    "properties": {
                        "type": {
                            "enum": [
                                "panel", "stack_panel", "collection_panel", "grid", "label", "image", "input_panel", "button",
                                "toggle", "dropdown", "slider", "slider_box", "edit_box", "scroll_view", "screen", "custom", "selection_wheel", false
                            ]
                        }
                    }
                },
                "then": {
                    "$ref": "#/definitions/data_binding_properties"
                }
            },
            {
                "if": {
                    "properties": {
                        "type": {
                            "enum": ["button", "edit_box", false]
                        }
                    }
                },
                "then": {
                    "$ref": "#/definitions/button_properties"
                }
            },
            {
                "if": {
                    "properties": {
                        "type": {
                            "enum": ["grid", false]
                        }
                    }
                },
                "then": {
                    "$ref": "#/definitions/grid_properties"
                }
            },
            {
                "if": {
                    "properties": {
                        "type": {
                            "enum": [
                                "input_panel", "button","toggle", "dropdown", "slider", "slider_box", "edit_box", 
                                "scroll_view", "scrollbar_track", "scrollbar_box", "selection_wheel", false
                            ]
                        }
                    }
                },
                "then": {
                    "$ref": "#/definitions/input_properties"
                }
            },
            {
                "if": {
                    "properties": {
                        "type": {
                            "enum": [
                                "input_panel", "button", "toggle", "dropdown", "slider", "edit_box", "selection_wheel", false
                            ]
                        }
                    }
                },
                "else": {
                    "$ref": "#/definitions/focus_properties"
                }
            },
            {
                "if": {
                    "properties": {
                        "type": {
                            "enum": ["toggle", "dropdown", false]
                        }
                    }
                },
                "then": {
                    "$ref": "#/definitions/toggle_properties"
                }
            },
            {
                "if": {
                    "properties": {
                        "type": {
                            "enum": ["dropdown", false]
                        }
                    }
                },
                "then": {
                    "$ref": "#/definitions/dropdown_properties"
                }
            },
            {
                "if": {
                    "properties": {
                        "type": {
                            "enum": ["input_panel", "button", "toggle", "dropdown", "slider", "selection_wheel", false]
                        }
                    }
                },
                "then": {
                    "$ref": "#/definitions/sound_properties"
                }
            },
            {
                "if": {
                    "properties": {
                        "type": {
                            "enum": ["edit_box", false]
                        }
                    }
                },
                "then": {
                    "$ref": "#/definitions/text_edit_properties"
                }
            },
            {
                "if": {
                    "properties": {
                        "type": {
                            "enum": ["slider", false]
                        }
                    }
                },
                "then": {
                    "$ref": "#/definitions/slider_properties"
                }
            },
            {
                "if": {
                    "properties": {
                        "type": {
                            "enum": ["slider_box", false]
                        }
                    }
                },
                "then": {
                    "$ref": "#/definitions/slider_box_properties"
                }
            },
            {
                "if": {
                    "properties": {
                        "type": {
                            "enum": ["scroll_view", false]
                        }
                    }
                },
                "then": {
                    "$ref": "#/definitions/scroll_view_properties"
                }
            },
            {
                "if": {
                    "properties": {
                        "type": {
                            "enum": ["custom", false]
                        }
                    }
                },
                "then": {
                    "$ref": "#/definitions/custom_render_properties"
                }
            },
            {
                "if": {
                    "properties": {
                        "type": {
                            "enum": ["screen", false]
                        }
                    }
                },
                "then": {
                    "$ref": "#/definitions/screen_properties"
                }
            },
            {
                "if": {
                    "properties": {
                        "type": {
                            "enum": ["selection_wheel", false]
                        }
                    }
                },
                "then": {
                    "$ref": "#/definitions/selection_wheel_properties"
                }
            },
            {
                "if": {
                    "properties": {
                        "anim_type": {
                            "enum": [true, false]
                        }
                    }
                },
                "then": {
                    "$ref": "#/definitions/anim_type_properties"
                }
            }
        ]
    },
    "definitions": {
        "common_properties": {
            "$comment": "Définition des propriétés communes à tous les éléments UI.",
            "type": "object",
            "properties": {
                "type": {
                    "description": "Type de l'élément UI. \nType: `String`",
                    "type": "string",
                    "enum": [
                        "panel", "stack_panel", "label", "image", "collection_panel", "grid", "input_panel", "button",
                        "toggle", "dropdown", "slider", "slider_box", "edit_box", "scroll_view", "scrollbar_track",
                        "scrollbar_box", "factory", "screen", "custom", "selection_wheel"
                    ]
                },
                "anim_type": {
                    "description": "Définit cet objet comme une animation. Cela permet de créer des animations pour animer les autres éléments. \nType: `String`",
                    "type": "string",
                    "enum": [
                        "alpha", "clip", "color", "flip_book", "offset", "size", "uv", "wait", "aseprite_flip_book"
                    ]
                }
            }
        },
        "control_properties": {
            "$comment": "Définition des propriétés de type 'control'.",
            "type": "object",
            "properties": {
                "controls": {
                    "description": "Liste des éléments enfants. \nType: `Object[]`",
                    "type": "array",
                    "items": {
                        "$ref": "#/additionalProperties"
                    }
                },
                "layer": {
                    "description": "Z-Index/Layer (comme zindex en CSS) par rapport à l'élément parent. Les couches supérieures seront rendues au-dessus. \nType: `Integer`",
                    "default": 0,
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "integer",
                            "minimum": 0
                        }
                    ]
                },
                "visible": {
                    "description": "Définit si l'élément est visible ou non. \nType: `Boolean`",
                    "default": true,
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "collection_index": {
                    "description": "Index que le contrôle prend dans la collection. \nType: `Integer`",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "integer",
                            "minimum": 0
                        }
                    ]
                },
                "ignored": {
                    "description": "Définit si l'élément doit être ignoré ou non. \nType: `Boolean`",
                    "default": false,
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "disable_anim_fast_forward": {
                    "description": "\nType: `Boolean`",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "enabled": {
                    "description": "Si 'True' et si l'élément d'interface utilisateur ou l'un de ses enfants ont l'état verrouillé, ils seront dans l'état verrouillé. \nType: `Boolean`",
                    "default": true,
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "alpha": {
                    "description": "Alpha/transparence de l'élément. Cela n'affectera que l'élément de l'interface utilisateur. Ses enfants ne seront pas affectés. Si vous souhaitez que l'alpha s'applique à la fois au parent et aux enfants, utilisez également propagate_alpha. \nType: `Number`",
                    "default": 1.0,
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "number"
                        }
                    ]
                },
                "propagate_alpha": {
                    "description": "Si l'alpha ne doit pas seulement s'appliquer au parent mais aussi à tous ses enfants, utilisez propagate_alpha. \nType: `Boolean`",
                    "default": false,
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "clips_children": {
                    "description": "Coupe visuellement et de manière interactive tout ce qui dépasse les limites de l'élément de l'interface utilisateur. \nType: `Boolean`",
                    "default": false,
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "allow_clipping": {
                    "description": "Si clips_children fonctionne sur l'élément de l'interface utilisateur. Sinon, cela n'aura aucun effet. \nType: `Boolean`",
                    "default": true,
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "clip_offset": {
                    "description": "Décalage par rapport au début du découpage. \nType: `Number[2]`",
                    "default": [0, 0],
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "array",
                            "minItems": 2,
                            "maxItems": 2,
                            "items": {
                                "oneOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "number"
                                    }
                                ]
                            }
                        }
                    ]
                },
                "clip_state_change_event": {
                    "description": "\nType: `String`",
                    "type": "string"
                },
                "enable_scissor_test": {
                    "description": "\nType: `Boolean`",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "property_bag": {
                    "description": "Le property bag contient des propriétés/variables qui sont plus liées aux données qu'à la structure et à l'apparence de l'élément de l'interface utilisateur. \nType: `Object`",
                    "type": "object",
                    "properties": {
                        "#filtered_light_multiplier": {
                            "description": "Necéssite (type = custom, renderer = inventory_item_renderer) \nType: `Number`",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "number"
                                }
                            ]
                        },
                        "#banner_patterns": {
                            "description": "Necéssite (type = custom, renderer = inventory_item_renderer) \nType: `String`",
                            "type": "string"
                        },
                        "#banner_colors": {
                            "description": "Necéssite (type = custom, renderer = inventory_item_renderer) \nType: `String`",
                            "type": "string"
                        },
                        "#item_id_aux": {
                            "description": "\nType: `Integer`",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "integer"
                                }
                            ]
                        },
                        "#item_custom_color": {
                            "description": "Nécessite (type = custom, renderer = inventory_item_renderer) \nType: `Integer`",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "integer"
                                }
                            ]
                        },
                        "#disabled_filter_visible": {
                            "description": "Nécessite (type = custom, renderer = inventory_item_renderer) \nType: `Boolean`",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "boolean"
                                }
                            ]
                        },
                        "#item_pickup_time": {
                            "description": "Nécessite (type = custom, renderer = inventory_item_renderer) \nType: `Number`",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "number"
                                }
                            ]
                        },
                        "#look_at_cursor": {
                            "description": "Nécessite (type = custom, renderer = hud_player_renderer) \nType: `Boolean`",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "boolean"
                                }
                            ]
                        },
                        "entity_type": {
                            "description": "Nécessite (type = custom, renderer = paper_doll_renderer) \nType: `String`",
                            "type": "string",
                            "examples": ["player", "npc"]
                        },
                        "#skin_idx": {
                            "description": "Nécessite (type = custom, renderer = paper_doll_renderer) \nType: `Integer`",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "integer"
                                }
                            ]
                        },
                        "#player_uuid": {
                            "description": "Nécessite (type = custom, renderer = paper_doll_renderer) \nType: `String`",
                            "type": "string"
                        },
                        "#skin_rotation": {
                            "description": "Nécessite (type = custom, renderer = paper_doll_renderer) \nType: `Boolean`",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "boolean"
                                }
                            ]
                        },
                        "#custom_rot_y": {
                            "description": "Nécessite (type = custom, renderer = paper_doll_renderer) \nType: `Number`",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "number"
                                }
                            ]
                        },
                        "#gesture_delta_source": {
                            "description": "Nécessite (type = custom, renderer = paper_doll_renderer) \nType: `String`",
                            "type": "string"
                        },
                        "#gesture_mouse_delta_x": {
                            "description": "Nécessite (type = custom, renderer = paper_doll_renderer) \nType: `String`",
                            "type": "string"
                        },
                        "#pack_id": {
                            "description": "Nécessite (type = custom, renderer = paper_doll_renderer) \nType: `Integer`",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "integer"
                                }
                            ]
                        },
                        "#force_skin_update": {
                            "description": "Nécessite (type = custom, renderer = paper_doll_renderer) \nType: `String`",
                            "type": "string"
                        },
                        "#progress_bar_visible": {
                            "description": "Nécessite (type = custom, renderer = paper_doll_renderer) \nType: `Boolean`",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "boolean"
                                }
                            ]
                        },
                        "#progress_bar_total_amount": {
                            "description": "Nécessite (type = custom, renderer = progress_bar_renderer) \nType: `Number`",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "number"
                                }
                            ]
                        },
                        "#progress_bar_current_amount": {
                            "description": "Nécessite (type = custom, renderer = progress_bar_renderer) \nType: `Number`",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "number"
                                }
                            ]
                        },
                        "is_durability": {
                            "description": "Nécessite (type = custom, renderer = progress_bar_renderer) \nType: `Boolean`",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "boolean"
                                }
                            ]
                        },
                        "round_value": {
                            "description": "Nécessite (type = custom, renderer = progress_bar_renderer) \nType: `Boolean`",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "boolean"
                                }
                            ]
                        },
                        "#hover_text": {
                            "description": "Nécessite (type = custom, renderer = hover_text_renderer) \nType: `String`",
                            "type": "string"
                        },
                        "#open": {
                            "description": "Nécessite (type = custom, renderer = enchanting_book_renderer) \nType: `Boolean`",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "boolean"
                                }
                            ]
                        },
                        "flying_item_count": {
                            "description": "Nécessite (type = custom, renderer = flying_item_renderer) \nType: `Integer`",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "integer"
                                }
                            ]
                        },
                        "flying_item_id_aux": {
                            "description": "Nécessite (type = custom, renderer = flying_item_renderer)",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "integer"
                                }
                            ]
                        },
                        "flying_item_custom_color": {
                            "description": "Nécessite (type = custom, renderer = flying_item_renderer)",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "integer"
                                }
                            ]
                        },
                        "flying_item_origin_position_x": {
                            "description": "Nécessite (type = custom, renderer = flying_item_renderer)",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "number"
                                }
                            ]
                        },
                        "flying_item_origin_position_y": {
                            "description": "Nécessite (type = custom, renderer = flying_item_renderer)",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "number"
                                }
                            ]
                        },
                        "flying_item_origin_scale": {
                            "description": "Nécessite (type = custom, renderer = flying_item_renderer)",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "number"
                                }
                            ]
                        },
                        "flying_item_destination_position_x": {
                            "description": "Nécessite (type = custom, renderer = flying_item_renderer)",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "number"
                                }
                            ]
                        },
                        "flying_item_destination_position_y": {
                            "description": "Nécessite (type = custom, renderer = flying_item_renderer)",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "number"
                                }
                            ]
                        },
                        "flying_item_destination_scale": {
                            "description": "Nécessite (type = custom, renderer = flying_item_renderer)",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "number"
                                }
                            ]
                        },
                        "flying_item_banner_patterns": {
                            "description": "Nécessite (type = custom, renderer = flying_item_renderer)",
                            "type": "string"
                        },
                        "flying_item_banner_colors": {
                            "description": "Nécessite (type = custom, renderer = flying_item_renderer)",
                            "type": "string"
                        },
                        "#use_heart_offset": {
                            "description": "Nécessite (type = custom, renderer = armor_renderer)",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "boolean"
                                }
                            ]
                        },
                        "opacity_override": {
                            "description": "Nécessite (type = custom, renderer = vignette_renderer)",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "number"
                                }
                            ]
                        },
                        "#playername": {
                            "description": "Nécessite (type = custom, renderer = name_tag_renderer)",
                            "type": "string"
                        },
                        "#x_padding": {
                            "description": "Nécessite (type = custom, renderer = name_tag_renderer)",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "number"
                                }
                            ]
                        },
                        "#entity_id": {
                            "description": "Nécessite (type = custom, renderer = live_horse_renderer)",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "integer"
                                }
                            ]
                        },
                        "#hyperlink": {
                            "description": "Nécessite (type = button)",
                            "type": "string"
                        },
                        "#anchored_offset_value_x": {
                            "description": "Nécessite la propriété 'use_anchored_offset')",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "number"
                                }
                            ]
                        },
                        "#anchored_offset_value_y": {
                            "description": "Nécessite la propriété 'use_anchored_offset')",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "number"
                                }
                            ]
                        },
                        "#size_binding_x": {
                            "description": "Nécessite la propriété 'use_anchored_offset')",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "number"
                                }
                            ]
                        },
                        "#size_binding_y": {
                            "description": "Nécessite la propriété 'use_anchored_offset')",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "number"
                                }
                            ]
                        },
                        "#has_focus": {
                            "description": "Nécessite (type = custom, renderer = 3d_structure_renderer)",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "boolean"
                                }
                            ]
                        },
                        "#block_position": {
                            "description": "Nécessite (type = custom, renderer = 3d_structure_renderer)",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "oneOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "integer"
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                        "#top_right_block": {
                            "description": "Nécessite (type = custom, renderer = 3d_structure_renderer)",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "oneOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "integer"
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                        "#bottom_left_block": {
                            "description": "Nécessite (type = custom, renderer = 3d_structure_renderer)",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "oneOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "integer"
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                        "#include_entities": {
                            "description": "Nécessite (type = custom, renderer = 3d_structure_renderer)",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "boolean"
                                }
                            ]
                        },
                        "#remove_blocks": {
                            "description": "Nécessite (type = custom, renderer = 3d_structure_renderer)",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "boolean"
                                }
                            ]
                        },
                        "#include_players": {
                            "description": "Nécessite (type = custom, renderer = 3d_structure_renderer)",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "boolean"
                                }
                            ]
                        },
                        "#slider_steps": {
                            "description": "Nécessite (type = slider)",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "integer"
                                }
                            ]
                        },
                        "#slider_value": {
                            "description": "Nécessite (type = slider)",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "number"
                                }
                            ]
                        },
                        "#property_field": {
                            "description": "Nécessite (type = edit_box)",
                            "type": "string"
                        },
                        "#hover_slice": {
                            "description": "Nécessite (type = selection_wheel)",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "integer"
                                }
                            ]
                        },
                        "#toggle_state": {
                            "description": "Nécessite (type = toggle)",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "boolean"
                                }
                            ]
                        },
                        "#start_selected": {
                            "description": "",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "boolean"
                                }
                            ]
                        },
                        "#tts_dialog_title": {
                            "description": "",
                            "type": "string"
                        },
                        "#tts_dialog_body": {
                            "description": "",
                            "type": "string"
                        },
                        "force_update": {
                            "description": "",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "boolean"
                                }
                            ]
                        },
                        "#sub_command": {
                            "description": "",
                            "type": "string"
                        },
                        "#panel_title": {
                            "description": "",
                            "type": "string"
                        },
                        "#index": {
                            "description": "",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "integer"
                                }
                            ]
                        },
                        "#collection_prefix": {
                            "description": "",
                            "type": "string"
                        },
                        "#collection_name": {
                            "description": "",
                            "type": "string"
                        },
                        "#common": {
                            "description": "",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "array",
                                    "minItems": 4,
                                    "maxItems": 4,
                                    "items": {
                                        "oneOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "number"
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                        "#uncommon": {
                            "description": "",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "array",
                                    "minItems": 4,
                                    "maxItems": 4,
                                    "items": {
                                        "oneOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "number"
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                        "#rare": {
                            "description": "",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "array",
                                    "minItems": 4,
                                    "maxItems": 4,
                                    "items": {
                                        "oneOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "number"
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                        "#epic": {
                            "description": "",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "array",
                                    "minItems": 4,
                                    "maxItems": 4,
                                    "items": {
                                        "oneOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "number"
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                        "#legendary": {
                            "description": "",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "array",
                                    "minItems": 4,
                                    "maxItems": 4,
                                    "items": {
                                        "oneOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "number"
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                        "reset_group": {
                            "description": "",
                            "type": "string",
                            "examples": ["video", "audio", "accessibility"]
                        },
                        "#text": {
                            "description": "",
                            "type": "string"
                        },
                        "timer_duration": {
                            "description": "",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "number"
                                }
                            ]
                        },
                        "#should_host": {
                            "description": "",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "boolean"
                                }
                            ]
                        },
                        "is_local": {
                            "description": "",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "boolean"
                                }
                            ]
                        },
                        "#is_left": {
                            "description": "",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "boolean"
                                }
                            ]
                        },
                        "#is_skins": {
                            "description": "",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "boolean"
                                }
                            ]
                        },
                        "#is_featured": {
                            "description": "",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "boolean"
                                }
                            ]
                        },
                        "#image_name": {
                            "description": "",
                            "type": "string"
                        },
                        "#is_dropdown": {
                            "description": "",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "boolean"
                                }
                            ]
                        },
                        "#timer_field_count_to_show": {
                            "description": "",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "number"
                                }
                            ]
                        },
                        "#owned_incompatible_prompt_color": {
                            "description": "",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "items": {
                                        "oneOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "number"
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                        "#modal_title_text": {
                            "description": "",
                            "type": "string"
                        },
                        "#modal_label_text": {
                            "description": "",
                            "type": "string"
                        },
                        "#buttons_visible": {
                            "description": "",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "boolean"
                                }
                            ]
                        },
                        "#no_buttons_visible": {
                            "description": "",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "boolean"
                                }
                            ]
                        },
                        "#single_button_visible": {
                            "description": "",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "boolean"
                                }
                            ]
                        },
                        "#two_buttons_visible": {
                            "description": "",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "boolean"
                                }
                            ]
                        },
                        "is_fixed_inventory": {
                            "description": "",
                            "oneOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "boolean"
                                }
                            ]
                        },
                        "experimental_radio_button_state": {
                            "description": "",
                            "type": "string"
                        },
                        "classic_radio_button_state": {
                            "description": "",
                            "type": "string"
                        }
                    }
                },
                "selected": {
                    "description": "Définit si la zone de texte est sélectionnée par défaut.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "use_child_anchors": {
                    "description": "Définit si l'on utilise anchor_from et anchor_to de l'enfant de l'élément de l'interface utilisateur.",
                    "default": false,
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "anims": {
                    "description": "Liste de noms d'animations.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    ]
                },
                "animation_reset_name": {
                    "description": "",
                    "type": "string"
                },
                "variables": {
                    "description": "Un ensemble de conditions qui modifient les valeurs des variables.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "object",
                            "properties": {
                                "requires": {
                                    "description": "La condition qui doit être remplie pour que les variables soient modifiées.",
                                    "type": "string"
                                }
                            }
                        },
                        {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "requires": {
                                        "description": "La condition qui doit être remplie pour que les variables soient modifiées.",
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    ]
                },
                "modifications": {
                    "description": "Permet de modifier les fichiers UI des packs de ressources situés en dessous (vanilla étant le plus bas).",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "array_name": {
                                        "description": "Nom de l'array à modifier.",
                                        "type": "string"
                                    },
                                    "operation":{
                                        "description": "Opération à effectuer sur l'array.",
                                        "type": "string",
                                        "examples": [
                                            "insert_back", "insert_front", "insert_after", "insert_before", "move_back",
                                            "move_front", "move_after", "move_before", "swap", "replace", "remove"
                                        ]
                                    },
                                    "value": {
                                        "description": "Valeur à insérer.",
                                        "type": "array",
                                        "items": {}
                                    }
                                },
                                "allOf": [
                                    {
                                        "anyOf": [
                                            {
                                                "if": {
                                                    "properties": {
                                                        "operation": {
                                                            "enum": ["insert_front", "insert_back", "move_front", "move_back", "insert_after", "insert_before", "move_after", "move_before"]
                                                        }
                                                    }
                                                },
                                                "then": {
                                                    "properties": {
                                                        "value": {
                                                            "items": {
                                                                "type": "object",
                                                                "additionalProperties": {
                                                                    "$ref": "#/additionalProperties"
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                "if": {
                                                    "properties": {
                                                        "operation": {
                                                            "enum": ["move_front", "move_back", "move_after", "move_before", "swap", "replace", "remove"]
                                                        }
                                                    }
                                                },
                                                "then": {
                                                    "properties": {
                                                        "where": {
                                                            "description": "Conditions pour le selecteur.",
                                                            "type": "object"
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                "if": {
                                                    "properties": {
                                                        "operation": {
                                                            "enum": ["move_after", "move_before", "swap"]
                                                        }
                                                    }
                                                },
                                                "then": {
                                                    "properties": {
                                                        "target": {
                                                            "description": "Spécifie l'élément à déplacer dans la liste selectionné."
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                "if": {
                                                    "properties": {
                                                        "operation": {
                                                            "enum": ["replace"]
                                                        }
                                                    }
                                                },
                                                "then": {
                                                    "properties": {
                                                        "value": {
                                                            "type": "object"
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    ]
                },
                "grid_position": {
                    "description": "Position que le contrôle prendra à l'intérieur de la grille. Cela permet également de modifier des éléments spécifiques d'une grille codée en dur.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "array",
                            "minItems": 2,
                            "maxItems": 2,
                            "items": {
                                "oneOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "integer"
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        },
        "layout_properties": {
            "$comment": "Définition des propriétés de type 'layout'.",
            "type": "object",
            "properties": {
                "size": {
                    "description": "Taille de l'éléement UI.",
                    "default": ["default", "default"],
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "array",
                            "minItems": 2,
                            "maxItems": 2,
                            "items": {
                                "oneOf": [
                                    {
                                        "type": "string",
                                        "examples": ["default", "fill"]
                                    },
                                    {
                                        "type": "number",
                                        "minimum": 0
                                    }
                                ]
                            }
                        }
                    ]
                },
                "offset": {
                    "description": "Position de l'élément d'interface utilisateur par rapport à son élément parent. Elle est basée sur le coin supérieur gauche, ce qui signifie que les coordonnées [0, 0] commencent dans le coin supérieur gauche de l'écran.",
                    "default": [0, 0],
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "array",
                            "minItems": 2,
                            "maxItems": 2,
                            "items": {
                                "oneOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "number",
                                        "minimum": 0
                                    }
                                ]
                            }
                        }
                    ]
                },
                "min_size": {
                    "description": "La taille minimale de l'élément d'interface utilisateur peut avoir.",
                    "$ref": "#/definitions/layout_properties/properties/size"
                },
                "anchor_from": {
                    "description": "Point d'ancrage dans l'élément parent.",
                    "default": "center",
                    "type": "string",
                    "examples": ["top_left", "top_middle", "top_right", "left_middle", "center", "right_middle", "bottom_left", "bottom_middle", "bottom_right"]
                },
                "anchor_to": {
                    "description": "Point d'ancrage dans l'élément.",
                    "default": "center",
                    "type": "string",
                    "examples": ["top_left", "top_middle", "top_right", "left_middle", "center", "right_middle", "bottom_left", "bottom_middle", "bottom_right"]
                },
                "max_size": {
                    "description": "La taille maximale que l'élément d'interface utilisateur peut avoir.",
                    "$ref": "#/definitions/layout_properties/properties/size"
                },
                "inherit_max_sibling_width": {
                    "description": "Utiliser la largeur maximale de l'élément frère.",
                    "default": false,
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "inherit_max_sibling_height": {
                    "description": "Utiliser la hauteur maximale de l'élément frère.",
                    "default": false,
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "use_anchored_offset": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "contained": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "draggable": {
                    "description": "Rend l'élément déplaçable à l'aide du curseur. L'élément doit être capable d'accepter des entrées pour pouvoir être déplacé (input_panel, button, etc.) et doit avoir les mappages de boutons requis.",
                    "type": "string",
                    "examples": ["horizontal", "vertical", "both"]
                },
                "follows_cursor": {
                    "description": "Suit le curseur.",
                    "default": false,
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                }
            }
        },
        "stack_panel_properties": {
            "$comment": "Définition des propriétés de type 'stack_panel'.",
            "type": "object",
            "properties": {
                "orientation": {
                    "description": "La direction dans laquelle les éléments s'empilent à l'intérieur du stack_panel.",
                    "default": "vertical",
                    "type": "string",
                    "examples": ["vertical", "horizontal"]
                }
            }
        },
        "text_properties": {
            "$comment": "Définition des propriétés de type 'text'.",
            "type": "object",
            "properties": {
                "color": {
                    "description": "Couleur du texte.",
                    "default": [1.0, 1.0, 1.0],
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "array",
                            "minItems": 3,
                            "maxItems": 3,
                            "items": {
                                "type": "number",
                                "minimum": 0,
                                "maximum": 1
                            }
                        }
                    ]
                },
                "text": {
                    "description": "Contenu du texte.",
                    "type": "string"
                },
                "font_scale_factor": {
                    "description": "Échelle du texte.",
                    "default": 1.0,
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "number"
                        }
                    ]
                },
                "font_type": {
                    "description": "Type de police.",
                    "default": "default",
                    "type": "string",
                    "examples": ["default", "rune", "unicode", "smooth", "MinecraftTen"]
                },
                "locked_color": {
                    "description": "Couleur du texte lorsque le parent a enabled: false.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "array",
                            "minItems": 3,
                            "maxItems": 3,
                            "items": {
                                "type": "number",
                                "minimum": 0,
                                "maximum": 1
                            }
                        }
                    ]
                },
                "shadow": {
                    "description": "Ombre du texte.",
                    "default": false,
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "hide_hyphen": {
                    "description": "Masquer le tiret causé par la coupure de mot.",
                    "default": false,
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "notify_on_ellipses": {
                    "description": "Tableau des noms des contrôles à notifier lorsque le texte reçoit ou perd des points de suspension (ellipses).",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    ]
                },
                "enable_profanity_filter": {
                    "description": "Si les gros mots doivent être censurés.",
                    "default": false,
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "locked_alpha": {
                    "description": "Alpha/transparence de l'étiquette lorsque le parent a enabled: false.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "number"
                        }
                    ]
                },
                "font_size": {
                    "description": "Taille de la police.",
                    "default": "normal",
                    "type": "string",
                    "examples": ["small", "normal", "large", "extra_large"]
                },
                "localize": {
                    "description": "Si le texte doit pouvoir être traduit.",
                    "default": false,
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "line_padding": {
                    "description": "Espace entre les lignes.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "number"
                        }
                    ]
                },
                "backup_font_type": {
                    "description": "Type de police de secours.",
                    "default": "default",
                    "type": "string",
                    "examples": ["default", "rune", "unicode", "smooth", "MinecraftTen"]
                },
                "text_alignment": {
                    "description": "Direction de l'alignement du texte. S'il n'est pas défini, il s'ajustera automatiquement en fonction de anchor_from et anchor_to.",
                    "type": "string"
                }
            }
        },
        "collecton_properties": {
            "$comment": "Définition des propriétés de type 'collection'.",
            "type": "object",
            "properties": {
                "collection_name": {
                    "description": "Nom de la collection à utiliser.",
                    "type": "string"
                }
            }
        },
        "sprite_properties": {
            "$comment": "Définition des propriétés de type 'sprite'.",
            "type": "object",
            "properties": {
                "bilinear": {
                    "description": "Utilise la fonction bilinéaire lors du redimensionnement de l'image.",
                    "default": false,
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "texture": {
                    "description": "Chemin de l'image à partir de la racine du pack.",
                    "type": "string"
                },
                "keep_ratio": {
                    "default": true,
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "uv_size": {
                    "description": "Taille de la mapping des textures.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "array",
                            "minItems": 2,
                            "maxItems": 2,
                            "items": {
                                "oneOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "number"
                                    }
                                ]
                            }
                        }
                    ]
                },
                "uv": {
                    "description": "Position de départ de la mapping des textures.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "array",
                            "minItems": 2,
                            "maxItems": 2,
                            "items": {
                                "oneOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "number"
                                    }
                                ]
                            }
                        }
                    ]
                },
                "allow_debug_missing_texture": {
                    "description": "Afficher la missing_texture si la texture n'est pas trouvée.",
                    "default": true,
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "texture_file_system": {
                    "description": "Source pour obtenir la texture.",
                    "default": "InUserPackage",
                    "type": "string",
                    "examples": [
                        "InUserPackage","InAppPackage","RawPath","RawPersistent","InSettingsDir",
                        "InExternalDir","InServerPackage","InDataDir","InUserDir","InWorldDir","StoreCache"
                    ]
                },
                "nineslice_size": {
                    "description": "9-slice. Une méthode qui divise une texture en 9 morceaux. Lors du redimensionnement, les coins restent en place et le reste s'étire.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "integer"
                        },
                        {
                            "type": "array",
                            "oneOf": [
                                {
                                    "minItems": 2,
                                    "maxItems": 2
                                },
                                {
                                    "minItems": 4,
                                    "maxItems": 4
                                }
                            ],
                            "items": {
                                "oneOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "integer"
                                    }
                                ]
                            }
                        }
                    ]
                },
                "tiled": {
                    "description": "Si la texture doit se répéter lorsque la taille de l'élément UI est supérieure à la taille de la texture.",
                    "oneOf": [
                        {
                            "type": "string",
                            "examples": ["x", "y"]
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "tiled_scale": {
                    "description": "Échelle de répétition de la texture.",
                    "default": false,
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        },
                        {
                            "type": "array",
                            "minItems": 2,
                            "maxItems": 2,
                            "items": {
                                "oneOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "number"
                                    }
                                ]
                            }
                        }
                    ]
                },
                "clip_direction": {
                    "description": "Position du point de départ pour le clip_ratio. Si down, l'image commencera à apparaître depuis le bas.",
                    "type": "string",
                    "examples": ["left", "right", "up", "down", "center"]
                },
                "clip_ratio": {
                    "description": "La quantité à découper.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "number",
                            "minimum": 0,
                            "maximum": 1
                        }
                    ]
                },
                "clip_pixelperfect": {
                    "description": "Si le découpage doit être aussi précis que possible au niveau des pixels.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "fill": {
                    "description": "Gratter (ou ajuster) l'image à la taille.",
                    "default": false,
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "$fit_to_width": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "zip_folder": {
                    "description": "",
                    "type": "string"
                },
                "grayscale": {
                    "description": "Rendre l'image en noir et blanc.",
                    "default": false,
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "force_texture_reload": {
                    "description": "Recharger l'image lorsque le chemin de la texture est modifié.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "base_size": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "array",
                            "minItems": 2,
                            "maxItems": 2,
                            "items": {
                                "oneOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "number"
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        },
        "data_binding_properties": {
            "$comment": "Définition des propriétés de type 'data_binding'.",
            "type": "object",
            "properties": {
                "bindings": {
                    "description": "Lier et travailler avec des valeurs codées en dur dans l'élément.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "binding_type": {
                                        "description": "",
                                        "type": "string",
                                        "examples": ["global", "view", "collection", "collection_details", "none"]
                                    },
                                    "binding_collection_name": {
                                        "description": "Nom de la collection d'items à être utilisée.",
                                        "type": "string"
                                    },
                                    "binding_name": {
                                        "description": "Stocke la valeur du nom de liaison de données ou de la condition associée.",
                                        "type": "string"
                                    },
                                    "binding_name_override": {
                                        "description": "Nom de la propriété de l'élément d'interface utilisateur qui appliquera la valeur stockée dans binding_name.",
                                        "type": "string"
                                    },
                                    "binding_condition": {
                                        "description": "Condition pour que la liaison de données s'effectue.",
                                        "type": "string",
                                        "examples": ["always", "always_when_visible", "visible", "once", "none", "visibility_changed"]
                                    },
                                    "binding_collection_prefix": {
                                        "description": "",
                                        "type": "string"
                                    },
                                    "ignored": {
                                        "description": "Si le binding doit être ignoré.",
                                        "default": false,
                                        "oneOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "boolean"
                                            }
                                        ]
                                    },
                                    "source_control_name": {
                                        "description": "Nom de l'élément UI à observer pour ses valeurs de propriété.",
                                        "type": "string"
                                    },
                                    "source_property_name": {
                                        "description": "Stocker la valeur de la propriété de l'élément UI référencé dans source_control_name.",
                                        "type": "string"
                                    },
                                    "target_property_name": {
                                        "description": "La propriété de l'élément UI à laquelle la valeur stockée dans source_property_name sera appliquée.",
                                        "type": "string"
                                    },
                                    "resolve_sibling_scope": {
                                        "description": "Si True, permet la sélection d'un élément frère dans le même contrôle au lieu de son enfant, pour source_control_name.",
                                        "oneOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "boolean"
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        "button_properties": {
            "$comment": "Définition des propriétés de type 'button'.",
            "type": "object",
            "properties": {
                "default_control": {
                    "description": "Nom du contrôle enfant qui sera affiché uniquement dans l'état par défaut.",
                    "type": "string"
                },
                "hover_control": {
                    "description": "Nom du contrôle enfant qui sera affiché uniquement dans l'état de survol.",
                    "type": "string"
                },
                "pressed_control": {
                    "description": "Nom du contrôle enfant qui sera affiché uniquement dans l'état enfoncé.",
                    "type": "string"
                },
                "locked_control": {
                    "description": "Nom du contrôle enfant qui sera affiché uniquement dans l'état verrouillé.",
                    "type": "string"
                }
            }
        },
        "tts_properties": {
            "$comment": "Définition des propriétés de type 'tts'.",
            "type": "object",
            "properties": {
                "tts_control_header": {
                    "description": "",
                    "type": "string"
                },
                "tts_skip_message": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "tts_name": {
                    "description": "",
                    "type": "string"
                },
                "tts_section_header": {
                    "description": "",
                    "type": "string"
                },
                "tts_control_type_order_priority": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "integer"
                        }
                    ]
                },
                "tts_index_priority": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "integer"
                        }
                    ]
                },
                "tts_toggle_on": {
                    "description": "Utilisé par le type 'toggle'.",
                    "type": "string"
                },
                "tts_toggle_off": {
                    "description": "Utilisé par le type 'toggle'.",
                    "type": "string"
                },
                "tts_override_control_value": {
                    "description": "",
                    "type": "string"
                },
                "tts_inherit_siblings": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "tts_value_changed": {
                    "description": "",
                    "type": "string"
                },
                "ttsSectionContainer": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "tts_ignore_count": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "integer"
                        }
                    ]
                },
                "tts_value_order_priority": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "integer"
                        }
                    ]
                },
                "tts_play_on_unchanged_focus_control": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "tts_ignore_subsections": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "text_tts": {
                    "description": "",
                    "type": "string"
                },
                "use_priority": {
                    "description": "Si la propriété de priorité est utilisée pour déterminer la priorité TTS (Text-to-Speech) de chaque contrôle enfant.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "priority": {
                    "description": "Ordre/indice de priorité que l'élément a pour le TTS (Text-to-Speech).",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                }
            }
        },
        "grid_properties": {
            "$comment": "Définition des propriétés de type 'grid'.",
            "type": "object",
            "properties": {
                "grid_dimensions": {
                    "description": "Nombre de colonnes et de lignes dans la grille.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "array",
                            "minItems": 2,
                            "maxItems": 2,
                            "items": {
                                "oneOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "integer"
                                    }
                                ]
                            }
                        }
                    ]
                },
                "maximum_grid_items": {
                    "description": "Nombre maximum d'éléments que la grille générera.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "integer"
                        }
                    ]
                },
                "grid_dimension_binding": {
                    "description": "Nom de la binding pour les dimensions de la grille.",
                    "type": "string"
                },
                "grid_rescaling_type": {
                    "description": "Orientation du redimensionnement de la grille.",
                    "type": "string",
                    "examples": ["none", "horizontal", "vertical"]
                },
                "grid_fill_direction": {
                    "description": "",
                    "type": "string",
                    "examples": ["horizontal", "vertical", "none"]
                },
                "grid_item_template": {
                    "description": "Un élément capable de gérer des collections",
                    "type": "string"
                },
                "precached_grid_item_count": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "integer"
                        }
                    ]
                }
            }
        },
        "input_properties": {
            "$comment": "Définition des propriétés de type 'input'.",
            "type": "object",
            "properties": {
                "button_mappings": {
                    "description": "",
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "ignored": {
                                "description": "Si la mapping doit être ignorée.",
                                "default": false,
                                "oneOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "boolean"
                                    }
                                ]
                            },
                            "from_button_id": {
                                "description": "ID de l'action qui déclenche l'événement.",
                                "type": "string"
                            },
                            "to_button_id": {
                                "description": "ID de l'action à exécuter lorsque l'événement est déclenché.",
                                "type": "string"
                            },
                            "mapping_type": {
                                "description": "",
                                "type": "string",
                                "examples": ["global", "pressed", "double_pressed", "focused"]
                            },
                            "scope": {
                                "description": "",
                                "type": "string",
                                "enum": ["view", "controller"]
                            },
                            "input_mode_condition": {
                                "description": "",
                                "type": "string",
                                "examples": ["not_gaze", "not_gamepad", "gamepad_and_not_gaze"]
                            },
                            "ignore_input_scope": {
                                "description": "",
                                "oneOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "boolean"
                                    }
                                ]
                            },
                            "consume_event": {
                                "description": "",
                                "oneOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "boolean"
                                    }
                                ]
                            },
                            "handle_select": {
                                "description": "",
                                "oneOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "boolean"
                                    }
                                ]
                            },
                            "handle_deselect": {
                                "description": "",
                                "oneOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "boolean"
                                    }
                                ]
                            },
                            "button_up_right_of_first_refusal": {
                                "description": "",
                                "oneOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "boolean"
                                    }
                                ]
                            }
                        }
                    }
                },
                "modal": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "inline_modal": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "always_listen_to_input": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "always_handle_pointer": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "always_handle_controller_direction": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "hover_enabled": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "prevent_touch_input": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "consume_event": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "consume_hover_events": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "gesture_tracking_button": {
                    "description": "",
                    "type": "string"
                }
            }
        },
        "focus_properties": {
            "$comment": "Définition des propriétés de type 'focus'.",
            "type": "object",
            "properties": {
                "default_focus_precedence": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "integer"
                        }
                    ]
                },
                "focus_enabled": {
                    "description": "Si les touches fléchées ou la manette peuvent focaliser l'élément.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "focus_wrap_enabled": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "focus_magnet_enabled": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "focus_identifier": {
                    "description": "Identifiant de focus pour cet élément.",
                    "type": "string"
                },
                "focus_change_down": {
                    "description": "Identifiant (focus_identifier) de l'élément focalisable qui recevra le focus lorsque la touche button.menu_down est activée. Si vous voulez empêcher que le focus échappe vers le bas, utilisez FOCUS_OVERRIDE_STOP.",
                    "type": "string"
                },
                "focus_change_up": {
                    "description": "Identifiant (focus_identifier) de l'élément focalisable qui recevra le focus lorsque la touche button.menu_up est activée. Si vous voulez empêcher que le focus échappe vers le haut, utilisez FOCUS_OVERRIDE_STOP.",
                    "type": "string"
                },
                "focus_change_left": {
                    "description": "Identifiant (focus_identifier) de l'élément focalisable qui recevra le focus lorsque la touche button.menu_left est activée. Si vous voulez empêcher que le focus échappe vers la gauche, utilisez FOCUS_OVERRIDE_STOP.",
                    "type": "string"
                },
                "focus_change_right": {
                    "description": "Identifiant (focus_identifier) de l'élément focalisable qui recevra le focus lorsque la touche button.menu_right est activée. Si vous voulez empêcher que le focus échappe vers la droite, utilisez FOCUS_OVERRIDE_STOP.",
                    "type": "string"
                },
                "focus_mapping": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "array"
                        }
                    ]
                },
                "focus_navigation_mode_left": {
                    "description": "",
                    "type": "string",
                    "examples": ["none", "stop", "custom", "contained"]
                },
                "focus_navigation_mode_right": {
                    "description": "",
                    "type": "string",
                    "examples": ["none", "stop", "custom", "contained"]
                },
                "focus_navigation_mode_down": {
                    "description": "",
                    "type": "string",
                    "examples": ["none", "stop", "custom", "contained"]
                },
                "focus_navigation_mode_up": {
                    "description": "",
                    "type": "string",
                    "examples": ["none", "stop", "custom", "contained"]
                },
                "focus_container_custom_left": {
                    "description": "",
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "other_focus_container_name": {
                                "description": "Nom du contrôle UI qui recevra le focus lorsqu'une des touches button.menu_left, button.menu_right, button.menu_up ou button.menu_down est activée.",
                                "type": "string"
                            },
                            "focus_id_inside": {
                                "description": "Identifiant (focus_identifier) du contrôle enfant focalisable de other_focus_container_name qui recevra le focus."
                            }
                        }
                    }
                },
                "focus_container_custom_right": {
                    "description": "",
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "other_focus_container_name": {
                                "description": "Nom du contrôle UI qui recevra le focus lorsqu'une des touches button.menu_left, button.menu_right, button.menu_up ou button.menu_down est activée.",
                                "type": "string"
                            },
                            "focus_id_inside": {
                                "description": "Identifiant (focus_identifier) du contrôle enfant focalisable de other_focus_container_name qui recevra le focus."
                            }
                        }
                    }
                },
                "focus_container_custom_down": {
                    "description": "",
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "other_focus_container_name": {
                                "description": "Nom du contrôle UI qui recevra le focus lorsqu'une des touches button.menu_left, button.menu_right, button.menu_up ou button.menu_down est activée.",
                                "type": "string"
                            },
                            "focus_id_inside": {
                                "description": "Identifiant (focus_identifier) du contrôle enfant focalisable de other_focus_container_name qui recevra le focus."
                            }
                        }
                    }
                },
                "focus_container_custom_up": {
                    "description": "",
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "other_focus_container_name": {
                                "description": "Nom du contrôle UI qui recevra le focus lorsqu'une des touches button.menu_left, button.menu_right, button.menu_up ou button.menu_down est activée.",
                                "type": "string"
                            },
                            "focus_id_inside": {
                                "description": "Identifiant (focus_identifier) du contrôle enfant focalisable de other_focus_container_name qui recevra le focus."
                            }
                        }
                    }
                }
            }
        },
        "toggle_properties": {
            "$comment": "Définition des propriétés de type 'toggle'.",
            "type": "object",
            "properties": {
                "radio_toggle_group": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "toggle_name": {
                    "description": "Identifiant du groupe de bascule auquel il appartient. Cela peut être un groupe personnalisé.",
                    "type": "string"
                },
                "toggle_default_state": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "toggle_group_forced_index": {
                    "description": "Index du commutateur (toggle) dans son groupe.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "integer"
                        }
                    ]
                },
                "toggle_group_default_selected": {
                    "description": "Index du commutateur par défaut de son groupe.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "integer"
                        }
                    ]
                },
                "reset_on_focus_lost": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "toggle_on_hover": {
                    "description": "",
                    "type": "string"
                },
                "toggle_on_button": {
                    "description": "",
                    "type": "string"
                },
                "toggle_off_button": {
                    "description": "",
                    "type": "string"
                },
                "enable_directional_toggling": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "toggle_grid_collection_name": {
                    "description": "Nom de la collection à laquelle le commutateur (toggle) appartient.",
                    "type": "string"
                },
                "checked_control": {
                    "description": "Nom du contrôle enfant qui ne sera affiché que dans l'état coché (checked).",
                    "type": "string"
                },
                "unchecked_control": {
                    "description": "Nom du contrôle enfant qui ne sera affiché que dans l'état décoché (unchecked).",
                    "type": "string"
                },
                "checked_hover_control": {
                    "description": "Nom du contrôle enfant qui ne sera affiché que dans l'état coché (checked) et en survol.",
                    "type": "string"
                },
                "unchecked_hover_control": {
                    "description": "Nom du contrôle enfant qui ne sera affiché que dans l'état décoché (unchecked) et en survol.",
                    "type": "string"
                },
                "checked_locked_control": {
                    "description": "Nom du contrôle enfant qui ne sera affiché que dans l'état coché (checked) et verrouillé.",
                    "type": "string"
                },
                "unchecked_locked_control": {
                    "description": "Nom du contrôle enfant qui ne sera affiché que dans l'état décoché (unchecked) et verrouillé.",
                    "type": "string"
                },
                "checked_locked_hover_control": {
                    "description": "Nom du contrôle enfant qui ne sera affiché que dans l'état coché (checked) et verrouillé en survol.",
                    "type": "string"
                },
                "unchecked_locked_hover_control": {
                    "description": "Nom du contrôle enfant qui ne sera affiché que dans l'état décoché (unchecked) et verrouillé en survol.",
                    "type": "string"
                }
            }
        },
        "dropdown_properties": {
            "$comment": "Définition des propriétés de type 'dropdown'.",
            "type": "object",
            "properties": {
                "dropdown_name": {
                    "description": "Identifiant pour le dropdown.",
                    "type": "string"
                },
                "dropdown_content_control": {
                    "description": "Nom du contrôle enfant qui se comportera comme le panneau de contenu principal (root content panel).",
                    "type": "string"
                },
                "dropdown_area": {
                    "description": "Nom du contrôle enfant qui se comportera comme le contenu interne (inside content).",
                    "type": "string"
                }
            }
        },
        "sound_properties": {
            "description": "Définition des propriétés de type 'sound'.",
            "type": "object",
            "properties": {
                "sound_name": {
                    "description": "Nom du son défini dans le fichier RP/sounds/sound_definitions.json qui est joué lorsque l'événement pressed est déclenché.",
                    "type": "string"
                },
                "sound_volume": {
                    "description": "Volume du son.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "number"
                        }
                    ]
                },
                "sound_pitch": {
                    "description": "Hauteur du son.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "number"
                        }
                    ]
                },
                "sounds": {
                    "description": "Tableau des sons à jouer lorsque l'événement pressed est déclenché.",
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "sound_name": {
                                "description": "Nom du son défini dans le fichier RP/sounds/sound_definitions.json qui est joué lorsque l'événement pressed est déclenché.",
                                "type": "string"
                            },
                            "sound_volume": {
                                "description": "Volume du son.",
                                "oneOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "number"
                                    }
                                ]
                            },
                            "sound_pitch": {
                                "description": "Hauteur du son.",
                                "oneOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "number"
                                    }
                                ]
                            },
                            "min_seconds_between_plays": {
                                "description": "Nombre de secondes d'attente avant que le son puisse être joué à nouveau.",
                                "oneOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "number"
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        },
        "text_edit_properties": {
            "$comment": "Définition des propriétés de type 'text_edit'.",
            "type": "object",
            "properties": {
                "text_box_name": {
                    "description": "Nom de la zone de texte.",
                    "type": "string"
                },
                "text_edit_box_grid_collection_name": {
                    "description": "Nom de la collection à laquelle appartient la edit_box.",
                    "type": "string"
                },
                "constrain_to_rect": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "enabled_newline": {
                    "description": "Permet le texte multiligne.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "text_type": {
                    "description": "Type de caractères que l'utilisateur est autorisé à saisir dans le champ de texte.",
                    "type": "string",
                    "examples": ["ExtendedASCII", "IdentifierChars", "NumberChars"]
                },
                "max_length": {
                    "description": "Nombre maximum de caractères que l'utilisateur peut saisir dans le champ de texte.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "integer"
                        }
                    ]
                },
                "text_control": {
                    "description": "Nom du contrôle enfant qui sera utilisé pour afficher le texte.",
                    "type": "string"
                },
                "place_holder_control": {
                    "description": "Nom du contrôle enfant qui sera utilisé pour afficher le texte de remplacement (placeholder).",
                    "type": "string"
                },
                "can_be_deselected": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "always_listening": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "virtual_keyboard_buffer_control": {
                    "description": "",
                    "type": "string"
                }
            }
        },
        "slider_properties": {
            "$comment": "Définition des propriétés de type 'slider'.",
            "type": "object",
            "properties": {
                "slider_track_button": {
                    "description": "ID de l'action pour la piste du curseur (slider track).",
                    "type": "string"
                },
                "slider_small_decrease_button": {
                    "description": "ID de l'action pour la réduction du curseur.",
                    "type": "string"
                },
                "slider_small_increase_button": {
                    "description": "ID de l'action pour l'augmentation du curseur.",
                    "type": "string"
                },
                "slider_steps": {
                    "description": "Combien d'étapes (ou valeurs) le curseur a-t-il.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "integer"
                        }
                    ]
                },
                "slider_direction": {
                    "description": "Orientation du mouvement du curseur.",
                    "type": "string",
                    "examples": ["vertical", "horizontal"]
                },
                "slider_timeout": {
                    "description": "Délai avant que le curseur ne puisse être utilisé à nouveau.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "integer"
                        }
                    ]
                },
                "slider_collection_name": {
                    "description": "Nom de la collection à laquelle appartient le curseur.",
                    "type": "string"
                },
                "slider_name": {
                    "description": "Identifiant pour le curseur.",
                    "type": "string"
                },
                "slider_select_on_hover": {
                    "description": "Focaliser le curseur lorsqu'il est survolé.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "slider_selected_button": {
                    "description": "ID de l'action lorsque le curseur est sélectionné.",
                    "type": "string"
                },
                "slider_deselected_button": {
                    "description": "ID de l'action lorsque le curseur est désélectionné.",
                    "type": "string"
                },
                "slider_box_control": {
                    "description": "Nom du contrôle enfant qui se comportera comme le curseur.",
                    "type": "string"
                },
                "background_control": {
                    "description": "Nom du contrôle enfant qui se comportera comme l'arrière-plan du curseur.",
                    "type": "string"
                },
                "background_hover_control": {
                    "description": "Nom du contrôle enfant qui se comportera comme l'arrière-plan du curseur au survol.",
                    "type": "string"
                },
                "progress_control": {
                    "description": "Nom du contrôle enfant qui se comportera comme l'overlay de progression du curseur.",
                    "type": "string"
                },
                "progress_hover_control": {
                    "description": "Nom du contrôle enfant qui se comportera comme l'overlay de progression du curseur au survol.",
                    "type": "string"
                }
            }
        },
        "slider_box_properties": {
            "$comment": "Définition des propriétés de type 'slider_box'.",
            "type": "object",
            "properties": {
                "default_control": {
                    "description": "Nom du contrôle enfant qui sera affiché dans l'état par défaut.",
                    "type": "string"
                },
                "hover_control": {
                    "description": "Nom du contrôle enfant qui sera affiché dans l'état de survol.",
                    "type": "string"
                },
                "locked_control": {
                    "description": "Nom du contrôle enfant qui sera affiché dans l'état verrouillé.",
                    "type": "string"
                }
            }
        },
        "scroll_view_properties": {
            "$comment": "Définition des propriétés de type 'scroll_view'.",
            "type": "object",
            "properties": {
                "scrollbar_track_button": {
                    "description": "ID de l'action pour le bouton de la piste (track button).",
                    "type": "string"
                },
                "scrollbar_touch_button": {
                    "description": "ID de l'action pour l'entrée tactile (touch input).",
                    "type": "string"
                },
                "scroll_speed": {
                    "description": "Vitesse de défilement.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "number"
                        }
                    ]
                },
                "gesture_control_enabled": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "always_handle_scrolling": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "touch_mode": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "scrollbar_box": {
                    "description": "Nom du contrôle enfant ou du contrôle UI imbriqué qui se comportera comme le pouce de la barre de défilement.",
                    "type": "string"
                },
                "scrollbar_track": {
                    "description": "Nom du contrôle enfant ou du contrôle UI imbriqué qui se comportera comme la piste de la barre de défilement.",
                    "type": "string"
                },
                "scroll_view_port": {
                    "description": "Nom du contrôle enfant qui se comportera comme la zone de vue (view port).",
                    "type": "string"
                },
                "scroll_content": {
                    "description": "Nom du contrôle enfant qui se comportera comme le contenu racine parent.",
                    "type": "string"
                },
                "scroll_box_and_track_panel": {
                    "description": "Nom du contrôle enfant qui contiendra les contrôles de la boîte de défilement et de la piste.",
                    "type": "string"
                },
                "jump_to_bottom_on_update": {
                    "description": "Saute au bas lorsque le panneau de défilement est mis à jour. Par exemple, lorsqu'il y a l'ajout de nouveaux enfants.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                }
            }
        },
        "custom_render_properties": {
            "$comment": "Définition des propriétés de type 'custom_render'.",
            "type": "object",
            "properties": {
                "renderer": {
                    "description": "",
                    "type": "string",
                    "examples": [
                        "hover_text_renderer", "3d_structure_renderer", "splash_text_renderer", "ui_holo_cursor", "trial_time_renderer", "panorama_renderer",
                        "actor_portrait_renderer", "banner_pattern_renderer", "live_player_renderer", "web_view_renderer", "hunger_renderer", "bubbles_renderer",
                        "mob_effects_renderer", "cursor_renderer", "progress_indicator_renderer", "camera_renderer", "horse_jump_renderer", "armor_renderer",
                        "horse_heart_renderer", "heart_renderer", "hotbar_cooldown_renderer", "hotbar_renderer", "hud_player_renderer", "live_horse_renderer",
                        "holographic_postrenderer", "enchanting_book_renderer", "debug_screen_renderer", "gradient_renderer", "paper_doll_renderer",
                        "name_tag_renderer", "flying_item_renderer", "inventory_item_renderer", "credits_renderer", "vignette_renderer", "progress_bar_renderer",
                        "debug_overlay_renderer", "background_renderer", "bohr_model_renderer"
                    ]
                },
                "gradient_direction": {
                    "description": "Nécessite renderer = gradient_renderer.",
                    "type": "string",
                    "examples": ["horizontal", "vertical"]
                },
                "color1": {
                    "description": "Nécessite renderer = gradient_renderer.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "array",
                            "minItems": 4,
                            "maxItems": 4,
                            "items": {
                                "oneOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "number"
                                    }
                                ]
                            }
                        }
                    ]
                },
                "color2": {
                    "description": "Nécessite renderer = gradient_renderer.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "array",
                            "minItems": 4,
                            "maxItems": 4,
                            "items": {
                                "oneOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "number"
                                    }
                                ]
                            }
                        }
                    ]
                },
                "text_color": {
                    "description": "Nécessite renderer = name_tag_renderer.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "array",
                            "minItems": 4,
                            "maxItems": 4,
                            "items": {
                                "oneOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "number"
                                    }
                                ]
                            }
                        }
                    ]
                },
                "background_color": {
                    "description": "Nécessite renderer = name_tag_renderer.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "array",
                            "minItems": 4,
                            "maxItems": 4,
                            "items": {
                                "oneOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "number"
                                    }
                                ]
                            }
                        }
                    ]
                },
                "primary_color": {
                    "description": "Nécessite renderer = progress_bar_renderer.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "array",
                            "minItems": 4,
                            "maxItems": 4,
                            "items": {
                                "oneOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "number"
                                    }
                                ]
                            }
                        }
                    ]
                },
                "secondary_color": {
                    "description": "Nécessite renderer = progress_bar_renderer.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "array",
                            "minItems": 4,
                            "maxItems": 4,
                            "items": {
                                "oneOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "number"
                                    }
                                ]
                            }
                        }
                    ]
                },
                "camera_tilt_degrees": {
                    "description": "Nécessite renderer = paper_doll_renderer.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "number"
                        }
                    ]
                },
                "starting_rotation": {
                    "description": "Nécessite renderer = paper_doll_renderer.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "number"
                        }
                    ]
                },
                "use_selected_skin": {
                    "description": "Nécessite renderer = paper_doll_renderer.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "use_uuid": {
                    "description": "Nécessite renderer = paper_doll_renderer.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "use_skin_gui_scale": {
                    "description": "Nécessite renderer = paper_doll_renderer.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "use_player_paperdoll": {
                    "description": "Nécessite renderer = paper_doll_renderer.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "rotation": {
                    "description": "Nécessite renderer = paper_doll_renderer ou panorama_renderer.",
                    "type": "string",
                    "examples": ["auto", "gesture_x", "custom_y"]
                },
                "end_event": {
                    "description": "Nécessite renderer = credits_renderer.",
                    "type": "string"
                }
            }
        },
        "screen_properties": {
            "$comment": "Définition des propriétés de type 'screen'.",
            "type": "object",
            "properties": {
                "render_only_when_topmost": {
                    "description": "Rendre l'écran uniquement s'il est l'écran le plus haut dans la pile d'écrans.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "screen_not_flushable": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "always_accepts_input": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "render_game_behind": {
                    "description": "Cela ne empêche pas l'écran en dessous de recevoir des entrées de l'utilisateur.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "absorbs_input": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "is_showing_menu": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "is_modal": {
                    "description": "C'est un écran modal.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "should_steal_mouse": {
                    "description": "Capture le curseur et le cache.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "low_frequency_rendering": {
                    "description": "Utilise moins de mémoire pour rendre l'écran.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "screen_draws_last": {
                    "description": "C'est le dernier écran à être dessiné/rendu.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "vr_mode": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "force_render_below": {
                    "description": "Rend les écrans inférieurs en dessous de l'écran actuel dans la pile d'écrans.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "send_telemetry": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "close_on_player_hurt": {
                    "description": "Ferme l'écran si le joueur subit des dégâts.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "cache_screen": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "load_screen_immediately": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "gamepad_cursor": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "gamepad_cursor_deflection_mode": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "should_be_skipped_during_automation": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                }
            }
        },
        "selection_wheel_properties": {
            "$comment": "Définition des propriétés de type 'selection_wheel'.",
            "type": "object",
            "properties": {
                "inner_radius": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "number"
                        }
                    ]
                },
                "outer_radius": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "number"
                        }
                    ]
                },
                "state_controls": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    ]
                },
                "slice_count": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "integer"
                        }
                    ]
                },
                "button_name": {
                    "description": "",
                    "type": "string"
                },
                "iterate_left_button_name": {
                    "description": "",
                    "type": "string"
                },
                "iterate_right_button_name": {
                    "description": "",
                    "type": "string"
                },
                "initial_button_slice": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "integer"
                        }
                    ]
                }
            }
        },
        "anim_type_properties": {
            "$comment": "Définition des propriétés de type 'anim_type'.",
            "type": "object",
            "properties": {
                "duration": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "number"
                        }
                    ]
                },
                "next": {
                    "description": "",
                    "type": "string"
                },
                "destroy_at_end": {
                    "description": "",
                    "type": "string"
                },
                "play_event": {
                    "description": "",
                    "type": "string"
                },
                "end_event": {
                    "description": "",
                    "type": "string"
                },
                "start_event": {
                    "description": "",
                    "type": "string"
                },
                "reset_event": {
                    "description": "",
                    "type": "string"
                },
                "easing": {
                    "description": "",
                    "type": "string",
                    "examples": [
                        "linear", "spring", "in_quad", "out_quad", "in_out_quad", "in_cubic", "out_cubic", "in_out_cubic",
                        "in_quart", "out_quart", "in_out_quart", "in_quint", "out_quint", "in_out_quint", "in_sine", "out_sine",
                        "in_out_sine", "in_expo", "out_expo", "in_out_expo", "in_circ", "out_circ", "in_out_circ", "in_bounce",
                        "out_bounce", "in_out_bounce", "in_back", "out_back", "in_out_back", "in_elastic", "out_elastic", "in_out_elastic"
                    ]
                },
                "from": {
                    "description": ""
                },
                "to": {
                    "description": ""
                },
                "initial_uv": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "array",
                            "minItems": 2,
                            "maxItems": 2,
                            "items": {
                                "oneOf": [
                                    {
                                        "type": "string"
                                    },
                                    {
                                        "type": "number"
                                    }
                                ]
                            }
                        }
                    ]
                },
                "fps": {
                    "description": "Images par seconde.",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "integer"
                        }
                    ]
                },
                "frame_count": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "integer"
                        }
                    ]
                },
                "frame_step": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "number"
                        }
                    ]
                },
                "reversible": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "resettable": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "scale_from_starting_alpha": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                },
                "activated": {
                    "description": "",
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "boolean"
                        }
                    ]
                }
            }
        }
    }
};

export const _uiElementSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/ui/**/*.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};