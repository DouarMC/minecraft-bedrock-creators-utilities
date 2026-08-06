import { schemaPatterns } from "../../shared/schemaPatterns";
import { schemaEnums, dynamicExamplesSourceKeys } from "../../shared/schemaEnums";
import { commonSchemas } from "../../shared/commonSchemas";
import { VersionedSchema, SchemaChange } from "../../../common/types/VersionedSchema";
import { MinecraftJsonSchema } from "../../../common/types/MinecraftJsonSchema";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier crée un Bloc personnalisé.",
    type: "object",
    required: ["format_version", "minecraft:block"],
    properties: {
        format_version: {
            description: "La version du format à utiliser.",
            type: "string",
            enum: [
                "1.8.0", "1.9.0", "1.10.0", "1.11.0", "1.12.0", "1.13.0", "1.14.0", "1.14.1", "1.14.20", "1.14.30", "1.15.0", "1.16.0", "1.16.20", "1.16.100", "1.16.200", "1.16.210", "1.16.220", "1.16.230", "1.17.0", "1.17.10", "1.17.20", "1.17.30", "1.17.40", "1.18.0", "1.18.10", "1.18.20", "1.18.30", "1.18.40", "1.19.0", "1.19.10", "1.19.20", "1.19.30", "1.19.40", "1.19.50", "1.19.60", "1.19.70", "1.19.80", "1.20.0", "1.20.10", "1.20.20", "1.20.30", "1.20.40", "1.20.50", "1.20.60", "1.20.70", "1.20.80", "1.21.0", "1.21.10", "1.21.20", "1.21.30", "1.21.40", "1.21.50", "1.21.60", "1.21.70", "1.21.80", "1.21.90", "1.21.100", "1.21.110", "1.21.110", "1.21.120", "1.21.130", "1.26.0", "1.26.10", "1.26.20", "1.26.30", "1.26.40"
            ]
        },
        use_beta_features: {
            description: "Définit si les fonctionnalités bêta doivent être activées. Cela signifie que si c'est définit sur `true`, il faut que l'option `Beta APIs` soit activée dans les options du jeu pour que le comportement fonctionne correctement.",
            default: false,
            type: "boolean"
        },
        "minecraft:block": {
            description: "Contient toute la définition du Bloc.",
            type: "object",
            required: ["description"],
            properties: {
                description: {
                    description: "Contient les propriétés de Descriptions du Bloc.",
                    type: "object",
                    required: ["identifier"],
                    properties: {
                        identifier: {
                            description: "L'identifiant du Bloc.",
                            type: "string",
                            pattern: schemaPatterns.identifier_with_namespace
                        },
                        menu_category: {
                            description: "Définit les informations sur la localisation du Bloc dans l'inventaire créatif ou commande.",
                            type: "object",
                            properties: {
                                category: {
                                    description: "La catégorie de l'inventaire créatif ou commande dans laquelle le Bloc sera placé.",
                                    default: "none",
                                    type: "string",
                                    enum: schemaEnums.menu_categories
                                },
                                group: {
                                    description: "Le groupe d'items du menu créatif où le Bloc sera placé.",
                                    type: "string",
                                    maxLength: 256,
                                    "x-dynamic-examples-source": [dynamicExamplesSourceKeys.item_group_ids, dynamicExamplesSourceKeys.vanilla_item_group_ids_without_namespace]
                                }
                            }
                        }
                    }
                },
                components: {
                    description: "Contient les composants du Bloc.",
                    type: "object",
                    properties: {
                        "minecraft:block_light_absorption": {
                            description: "Définit la quantité de lumière absorbée par le Bloc.",
                            default: 16,
                            oneOf: [
                                {
                                    type: "number",
                                    minimum: 0,
                                    maximum: 16
                                },
                                {
                                    type: "object",
                                    required: ["filter_level"],
                                    properties: {
                                        filter_level: {
                                            description: "Le niveau de filtre de lumière du Bloc. (0-16)",
                                            default: 16,
                                            type: "number",
                                            minimum: 0,
                                            maximum: 16
                                        }
                                    }
                                }
                            ]
                        },
                        "minecraft:block_light_emission": {
                            description: "Définit la quantité de lumière émise par le Bloc.",
                            default: 0,
                            oneOf: [
                                {
                                    type: "number",
                                    minimum: 0,
                                    maximum: 1
                                },
                                {
                                    type: "object",
                                    required: ["emission"],
                                    properties: {
                                        emission: {
                                            description: "Le niveau d'émission de lumière du Bloc.",
                                            default: 0,
                                            type: "number",
                                            minimum: 0,
                                            maximum: 1
                                        }
                                    }
                                }
                            ]
                        },
                        "minecraft:custom_components": {
                            description: "Définit les composants personnalisés qu'utilise ce Bloc. Les composants personalisés se définissent dans les fichiers de scripts.",
                            type: "array",
                            items: {
                                type: "string",
                                pattern: schemaPatterns.identifier_with_namespace
                            }
                        },
                        "minecraft:destroy_time": {
                            description: "Définit le temps nécessaire pour détruire le Bloc.",
                            default: 0,
                            oneOf: [
                                {
                                    type: "number",
                                    minimum: 0
                                },
                                {
                                    type: "object",
                                    required: ["destroy_time"],
                                    properties: {
                                        destroy_time: {
                                            description: "Le temps en secondes pour détruire le Bloc.",
                                            default: 0,
                                            type: "number",
                                            minimum: 0
                                        }
                                    }
                                }
                            ]
                        },
                        "minecraft:entity_fall_on": {
                            description: "Définit la distance de chute minimale d'une entité qui tombe sur ce Bloc pour déclencher un événement de composant personnalisé.",
                            type: "object",
                            required: ["min_fall_distance"],
                            properties: {
                                min_fall_distance: {
                                    description: "La distance de chute minimale d'une entité qui tombe sur ce Bloc pour déclencher un événement de composant personnalisé.",
                                    type: "number"
                                }
                            }
                        },
                        "minecraft:explosion_resistance": {
                            description: "Définit la résistance du Bloc aux explosions.",
                            default: 0,
                            oneOf: [
                                {
                                    type: "number",
                                    minimum: 0
                                },
                                {
                                    type: "object",
                                    required: ["resistance"],
                                    properties: {
                                        resistance: {
                                            description: "La résistance du Bloc aux explosions.",
                                            default: 0,
                                            type: "number",
                                            minimum: 0
                                        }
                                    }
                                }
                            ]
                        },
                        "minecraft:flammable": {
                            description: "Définit les propriétés inflammables du Bloc.",
                            type: "object",
                            required: ["flame_odds", "burn_odds"],
                            properties: {
                                flame_odds: {
                                    description: "La probabilité que le Bloc prenne feu lorsqu'il est exposé à une source de feu.",
                                    default: 0,
                                    type: "integer",
                                    minimum: 0
                                },
                                burn_odds: {
                                    description: "La probabilité que le Bloc soit consumé par les flammes quand il est en feu.",
                                    default: 0,
                                    type: "integer",
                                    minimum: 0
                                }
                            }
                        },
                        "minecraft:friction": {
                            description: "Définit la friction du Bloc.",
                            default: 0.1,
                            oneOf: [
                                {
                                    type: "number",
                                    minimum: 0.1,
                                    maximum: 1
                                },
                                {
                                    type: "object",
                                    required: ["friction"],
                                    properties: {
                                        friction: {
                                            description: "La friction du Bloc.",
                                            default: 0.1,
                                            type: "number",
                                            minimum: 0.1,
                                            maximum: 1
                                        }
                                    }
                                }
                            ]
                        },
                        "minecraft:loot": {
                            description: "Définit la Loot Table (table de butin) utilisée quand le Bloc est détruit.",
                            oneOf: [
                                {
                                    type: "string",
                                    pattern: schemaPatterns.loot_tables_file,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.loot_table_file_paths
                                },
                                {
                                    type: "object",
                                    required: ["loot_table"],
                                    properties: {
                                        loot_table: {
                                            description: "La Loot Table utilisée pour le Bloc.",
                                            type: "string",
                                            pattern: schemaPatterns.loot_tables_file,
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.loot_table_file_paths
                                        }
                                    }
                                }
                            ]
                        },
                        "minecraft:map_color": {
                            description: "Définit la couleur du Bloc sur une carte.",
                            oneOf: [
                                {
                                    type: "string",
                                    pattern: schemaPatterns.color_hex
                                },
                                {
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: {
                                        type: "integer",
                                        minimum: 0,
                                        maximum: 255
                                    }
                                },
                                {
                                    type: "object",
                                    required: ["map_color"],
                                    properties: {
                                        map_color: {
                                            description: "La couleur du Bloc sur une carte.",
                                            oneOf: [
                                                {
                                                    type: "string",
                                                    pattern: schemaPatterns.color_hex
                                                },
                                                {
                                                    type: "array",
                                                    minItems: 3,
                                                    maxItems: 3,
                                                    items: {
                                                        type: "integer",
                                                        minimum: 0,
                                                        maximum: 255
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                }
                            ]
                        },
                        "minecraft:tick": {
                            description: "Définit les paramètres pour le déclenchement de l'événement `onTick` des composants personnalisés de ce Bloc.",
                            type: "object",
                            properties: {
                                looping: {
                                    description: "Définit si l'événement se joue en boucle.",
                                    default: true,
                                    type: "boolean"
                                },
                                interval_range: {
                                    description: "La plage de valeurs en ticks pour le déclenchement d'évenement, la valeur sera choisi au hasard.",
                                    default: [0, 0],
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "integer",
                                        minimum: 0
                                    }
                                }
                            }
                        },

                        "tag:acacia": {
                            description: "Exemples d'usages vanilla : [`minecraft:acacia_log`]",
                            type: "object"
                        },
                        "tag:birch": {
                            description: "Exemples d'usages vanilla : [`minecraft:birch_log`]",
                            type: "object"
                        },
                        "tag:minecraft:cornerable_stairs": {
                            description: "Les blocs avec ce tag sont considérés comme des escaliers pouvant se connecter en coin. Pour ajouter ce tag aux blocs customs, il faut que ce bloc possède les états de blocs `minecraft:cardinal_direction`. Exemples d'usages vanilla : [`minecraft:oak_stairs`, `minecraft:stone_brick_stairs`]",
                            type: "object"
                        },
                        "tag:minecraft:crop": {
                            description: "Ce tag permet aux blocs de recevoir du pollen de la part des entités possédant le composant `minecraft:grows_crop`. Comme les blocs personalisés ne peuvent pas avoir d'état de croissance, le pollen ne fera que des particules et des sons. Exemples d'usages vanilla : [`minecraft:wheat`, `minecraft:beetroot`]",
                        },
                        "tag:dark_oak": {
                            description: "Exemples d'usages vanilla : [`minecraft:dark_oak_log`]",
                            type: "object"
                        },
                        "tag:diamond_pick_diggable": {
                            description: "Tag obsolète, utilisez les tags `minecraft:is_pickaxe_item_destructible` et `minecraft:diamond_tier_destructible`. Exemples d'usages vanilla : [`minecraft:obsidian`, `minecraft:end_portal_frame`]",
                            type: "object"
                        },
                        "tag:minecraft:diamond_tier_destructible": {
                            description: "Ce tag indique au bloc qu'il doit être détruit par un outil de niveau diamant minimum pour que le butin soit obtenu. Celà n'empêche pas automatiquement l'obtention de butin pour les blocs personnalisés. Exemples d'usages vanilla : [`minecraft:obsidian`, `minecraft:ancient_debris`]",
                            type: "object"
                        },
                        "tag:dirt": {
                            description: "Ce tag permet au bloc d'avoir des arbres placés dessus lors de la génération du monde. Si un arbre est placé au-dessus, le bloc sera remplacé par de la terre. Permet également de placer certaines plantes sur ce bloc, notamment le bambou, le buisson mort, les pétales roses, la canne à sucre et les fleurs sauvages. Exemples d'usages vanilla : [`minecraft:dirt`, `minecraft:grass_block`]",
                            type: "object"
                        },
                        "tag:fertilize_area": {
                            description: "Exemples d'usages vanilla : [`minecraft:grass_block`, `minecraft:azure_bluet`]",
                            type: "object"
                        },
                        "tag:grass": {
                            description: "Exemples d'usages vanilla : [`minecraft:grass_block`, `minecraft:grass_path`]",
                            type: "object"
                        },
                        "tag:gravel": {
                            description: "Permet à ce bloc d'avoir du Bambou placé dessus. Exemples d'usages vanilla : [`minecraft:gravel`]",
                            type: "object"
                        },
                        "tag:minecraft:has_fence_connections": {
                            description: "Ce tag permet d'identifier un bloc personnalisé comme un bloc créant des connexions telles qu'une clôture, cette étiquette est requise pour créer des connexions entre les clôtures personnalisées et les clôtures Vanilla.",
                            type: "object"
                        },
                        "tag:iron_pick_diggable": {
                            description: "Tag obsolète, utilisez les tags `minecraft:is_pickaxe_item_destructible` et `minecraft:iron_tier_destructible`. Exemples d'usages vanilla : [`minecraft:coal_ore`, `minecraft:emerald_ore`, `minecraft:deepslate_diamond_ore`]",
                            type: "object"
                        },
                        "tag:minecraft:iron_tier_destructible": {
                            description: "Ce tag indique au bloc qu'il doit être détruit par un outil de niveau fer minimum pour que le butin soit obtenu. Celà n'empêche pas automatiquement l'obtention de butin pour les blocs personnalisés. Exemples d'usages vanilla : [`minecraft:coal_ore`, `minecraft:emerald_ore`, `minecraft:deepslate_diamond_ore`]",
                            type: "object"
                        },
                        "tag:minecraft:is_axe_item_destructible": {
                            description: "Ce tag indique que le bloc est plus rapide à casser avec une hache. Les haches personalisés doivent vérifier ce tag dans le composant `minecraft:digger`. Exemples d'usages vanilla : [`minecraft:oak_log`, `minecraft:oak_planks`, `minecraft:bookshelf`]",
                            type: "object"
                        },
                        "tag:minecraft:is_hoe_item_destructible": {
                            description: "Ce tag indique que le bloc est plus rapide à casser avec une houe. Les houes personalisées doivent vérifier ce tag dans le composant `minecraft:digger`. Exemples d'usages vanilla : [`minecraft:dirt`, `minecraft:grass_block`, `minecraft:farmland`]",
                            type: "object"
                        },
                        "tag:minecraft:is_pickaxe_item_destructible": {
                            description: "Ce tag indique que le bloc est plus rapide à casser avec une pioche. Les pioches personalisées doivent vérifier ce tag dans le composant `minecraft:digger`. Exemples d'usages vanilla : [`minecraft:stone`, `minecraft:coal_ore`, `minecraft:iron_ore`]",
                            type: "object"
                        },
                        "tag:minecraft:is_shears_item_destructible": {
                            description: "Ce tag indique que le bloc est plus rapide à casser avec des cisailles. Les cisailles personalisées doivent vérifier ce tag dans le composant `minecraft:digger`. Exemples d'usages vanilla : [`minecraft:web`]",
                            type: "object"
                        },
                        "tag:minecraft:is_shovel_item_destructible": {
                            description: "Ce tag indique que le bloc est plus rapide à casser avec une pelle. Les pelles personalisées doivent vérifier ce tag dans le composant `minecraft:digger`. Exemples d'usages vanilla : [`minecraft:dirt`, `minecraft:gravel`, `minecraft:sand`]",
                            type: "object"
                        },
                        "tag:minecraft:is_sword_item_destructible": {
                            description: "Ce tag indique que le bloc est plus rapide à casser avec une épée. Les épées personalisées doivent vérifier ce tag dans le composant `minecraft:digger`. Exemples d'usages vanilla : [`minecraft:web`]",
                            type: "object"
                        },
                        "tag:jungle": {
                            description: "Exemples d'usages vanilla : [`minecraft:jungle_log`]",
                            type: "object"
                        },
                        "tag:log": {
                            description: "Exemples d'usages vanilla : [`minecraft:oak_log`, `minecraft:spruce_log`, `minecraft:birch_log`, `minecraft:jungle_log`, `minecraft:acacia_log`, `minecraft:dark_oak_log`]",
                            type: "object"
                        },
                        "tag:metal": {
                            description: "Exemples d'usages vanilla : [`minecraft:cauldron`, `minecraft:exposed_copper_bars`, `minecraft:iron_door`, `minecraft:gold_block`, `minecraft:weathered_copper_bars`]",
                            type: "object"
                        },
                        "tag:mob_spawner": {
                            description: "Exemples d'usages vanilla : [`minecraft:mob_spawner`]",
                            type: "object"
                        },
                        "tag:not_feature_replaceable": {
                            description: "Exemples d'usages vanilla : [`minecraft:cherry_shelf`, `minecraft:end_portal_frame`, `minecraft:trial_spawner`]",
                            type: "object"
                        },
                        "tag:oak": {
                            description: "Exemples d'usages vanilla : [`minecraft:oak_log`]",
                            type: "object"
                        },
                        "tag:one_way_collidable": {
                            description: "Ce tag indique au bloc qu'il empêche les entités situées à l'intérieur de ce bloc d'être automatiquement repoussées hors de la zone de collision du bloc. Cela permet aux entités de rester à l'intérieur du bloc sans être expulsées, même si le bloc a une forme de collision solide. Exemples d'usages vanilla : [`minecraft:waxed_copper_trapdoor`, `minecraft:mangrove_fence_gate`, `minecraft:acacia_door`]",
                            type: "object"
                        },
                        "tag:plant": {
                            description: "Exemples d'usages vanilla : [`minecraft:oak_sapling`, `minecraft:dark_oak_sapling`, `minecraft:pitcher_plant`, `minecraft:sunflower`, `minecraft:tall_grass`]",
                            type: "object"
                        },
                        "tag:pumpkin": {
                            description: "Exemples d'usages vanilla : [`minecraft:pumpkin`, `minecraft:carved_pumpkin`]",
                            type: "object"
                        },
                        "tag:rail": {
                            description: "Ce tag infique au bloc qu'il permet de placer des chariots dessus. Ce qui permet aux entités avec le composants `minecraft:rail_movement` (comme les chariots) de s'aligner sur le bloc et de se déplacer dessus vers le nord ou le sud tant que le bloc n'a pas de boîte de collision. Exemples d'usages vanilla : [`minecraft:rail`, `minecraft:powered_rail`, `minecraft:detector_rail`, `minecraft:activator_rail`]",
                            type: "object"
                        },
                        "tag:sand": {
                            description: "Ce tag permet au bloc d'avoir des cactus et de la canne à sucre placés dessus. Exemples d'usages vanilla : [`minecraft:sand`]",
                            type: "object"
                        },
                        "tag:snow": {
                            description: "Exemples d'usages vanilla : [`minecraft:snow_layer`]",
                            type: "object"
                        },
                        "tag:spruce": {
                            description: "Exemples d'usages vanilla : [`minecraft:spruce_log`]",
                            type: "object"
                        },
                        "tag:stone": {
                            description: "Exemples d'usages vanilla : [`minecraft:stone`, `minecraft:granite`, `minecraft:diorite`, `minecraft:andesite`]",
                            type: "object"
                        },
                        "tag:stone_pick_diggable": {
                            description: "Tag obsolète, utilisez les tags `minecraft:is_pickaxe_item_destructible` et `minecraft:stone_tier_destructible`. Exemples d'usages vanilla : [`minecraft:cobblestone`, `minecraft:stone`, `minecraft:coal_ore`]",
                            type: "object"
                        },
                        "tag:minecraft:stone_tier_destructible": {
                            description: "Ce tag indique au bloc qu'il doit être détruit par un outil de niveau pierre minimum pour que le butin soit obtenu. Celà n'empêche pas automatiquement l'obtention de butin pour les blocs personnalisés. Exemples d'usages vanilla : [`minecraft:cobblestone`, `minecraft:stone`, `minecraft:coal_ore`]",
                            type: "object"
                        },
                        "tag:text_sign": {
                            description: "Exemples d'usages vanilla : [`minecraft:acacia_hanging_sign`, `minecraft:spruce_sign`, `minecraft:birch_sign`, `minecraft:jungle_sign`, `minecraft:acacia_sign`, `minecraft:dark_oak_sign`]",
                            type: "object"
                        },
                        "tag:trapdoors": {
                            description: "Les blocs considéré comme des trappes sont évités par les Breezes. Exemples d'usages vanilla : [`minecraft:oak_trapdoor`, `minecraft:iron_trapdoor`, `minecraft:mangrove_trapdoor`]",
                            type: "object"
                        },
                        "tag:water": {
                            description: "Ce tag permet au bloc d'avoir de la canne à sucre d'être placé sur les blocs horizontalement adjacents qui ont le tag de `dirt`.",
                            type: "object"
                        },
                        "tag:wood": {
                            description: "Exemples d'usages vanilla : [`minecraft:oak_log`, `minecraft:cherry_standing_sign`, `minecraft:birch_log`, `minecraft:jungle_pressure_plate`, `minecraft:acacia_log`, `minecraft:dark_oak_log`]",
                            type: "object"
                        }
                    }
                }
            }
        }
    },
    definitions: {
        material_instance: {
            oneOf: [
                {
                    type: "string"
                },
                {
                    type: "object",
                    properties: {
                        ambient_occlusion: {
                            description: "Définit si des ombres doivent être créées autour et sous le Bloc.",
                            default: true,
                            type: "boolean"
                        },
                        face_dimming: {
                            description: "Définit si ce matériau doit être atténué par la direction dans laquelle il est orienté.",
                            default: true,
                            type: "boolean"
                        },
                        render_method: {
                            description:
                            "Définit la méthode de rendu utilisée pour le Bloc.\n\n" +
                            "`opaque`: Utilisé pour une texture de bloc standard sans couche alpha. Ne permet pas la transparence ni la translucidité. Exemples: Terre, Pierre, Béton\n\n" +
                            "`double_sided`: Utilisé pour désactiver complètement l'élimination de la face arrière.\n\n" +
                            "`blend`: Utilisé pour un bloc comme un vitrail. Permet la transparence et la translucidité (textures légèrement transparentes). Exemples: Verre, Balise, Bloc de miel\n\n" +
                            "`alpha_test`: Utilisé pour un bloc comme le verre vanilla (non teinté). Ne permet pas la translucidité, mais uniquement des textures totalement opaques ou transparentes. Désactive également l'élimination des faces arrière. Exemples: Vignes, Rails, Pousses d'arbres\n\n" +
                            "`alpha_test_single_sided`: Variante d'`alpha_test` qui conserve les mêmes propriétés (zones entièrement opaques ou transparentes, sans translucidité), **mais avec élimination des faces arrière activée**. Cela le rend plus adapté à des blocs plats comme les portes ou les trappes, où seule la face visible est rendue. Permet aussi la suppression des faces à distance. Exemples: Portes, Trappes\n\n" +
                            "`alpha_test_to_opaque`: Utilise un rendu `alpha_test` pour les joueurs qui sont à moins de la motié de la render distance, et un rendu `opaque` pour les joueurs qui sont plus loin. Exemples: Feuilles\n\n" +
                            "`alpha_test_single_sided_to_opaque`: Utilise un rendu `alpha_test_single_sided` pour les joueurs qui sont à moins de la motié de la render distance, et un rendu `opaque` pour les joueurs qui sont plus loin. Exemples: Varech\n\n" +
                            "`blend_to_opaque`: Utilise un rendu `blend` pour les joueurs qui sont à moins de la motié de la render distance, et un rendu `opaque` pour les joueurs qui sont plus loin.",
                            default: "opaque",
                            type: "string",
                            enum: ["opaque", "double_sided", "blend", "alpha_test", "alpha_test_single_sided", "alpha_test_to_opaque", "alpha_test_single_sided_to_opaque", "blend_to_opaque"]
                        },
                        texture: {
                            description: "La référence à la texture utilisée pour cette face du Bloc.",
                            type: "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_texture_references
                        },
                        tint_method: {
                            description: "Définit la méthode de teinte utilisée pour la couleur du Bloc.",
                            default: "none",
                            type: "string",
                            enum: schemaEnums.tint_methods
                        }
                    }
                }
            ]
        }
    }
};

const versionedChanges: SchemaChange[] = [
    {
        version: "1.18.10",
        changes: [
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:block_light_absorption"],
                notes: "Remplacé par block_light_filter"
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:block_light_filter"],
                value: {
                    description: "Définit le niveau de filtre de lumière du Bloc.",
                    default: 15,
                    oneOf: [
                        {
                            type: "number",
                            minimum: 0,
                            maximum: 15
                        },
                        {
                            type: "object",
                            required: ["filter_level"],
                            properties: {
                                filter_level: {
                                    description: "Niveau de filtre de lumière du bloc, de 0 (aucun filtre) à 15 (filtre maximum).",
                                    default: 15,
                                    type: "number",
                                    minimum: 0,
                                    maximum: 15
                                }
                            }
                        }
                    ]
                }
            }
        ]
    },
    {
        version: "1.19.10",
        changes: [
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:block_light_filter"],
                notes: "Remplacé par light_dampening"
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:light_dampening"],
                value: {
                    description: "Définit le niveau d'atténuation de la lumière du Bloc. (0-15)",
                    default: 15,
                    type: "number",
                    minimum: 0,
                    maximum: 15
                }
            },
            {
                action: "modify",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:flammable"],
                value: {
                    description: "Définit les propriétés inflammables du Bloc. En mettant cette valeur sur `true`, le Bloc utilisera les valeurs par défaut pour `catch_chance_modifier` et `destroy_chance_modifier`",
                    default: false,
                    oneOf: [
                        {
                            type: "boolean"
                        },
                        {
                            type: "object",
                            required: ["catch_chance_modifier", "destroy_chance_modifier"],
                            properties: {
                                catch_chance_modifier: {
                                    description: "La probabilité que le Bloc prenne feu lorsqu'il est exposé à une source de feu.",
                                    default: 5,
                                    type: "integer",
                                    minimum: 0
                                },
                                destroy_chance_modifier: {
                                    description: "La probabilité que le Bloc soit consumé par les flammes quand il est en feu.",
                                    default: 20,
                                    type: "integer",
                                    minimum: 0
                                }
                            }
                        }
                    ]
                }
            },
            {
                action: "modify",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:map_color"],
                value: {
                    description: "Définit la couleur du Bloc sur une carte.",
                    oneOf: [
                        {
                            type: "string",
                            pattern: schemaPatterns.color_hex
                        },
                        {
                            type: "array",
                            minItems: 3,
                            maxItems: 3,
                            items: {
                                type: "integer",
                                minimum: 0,
                                maximum: 255
                            }
                        },
                        {
                            type: "object",
                            required: ["color"],
                            properties: {
                                color: {
                                    description: "La couleur du Bloc sur une carte.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            pattern: schemaPatterns.color_hex
                                        },
                                        {
                                            type: "array",
                                            minItems: 3,
                                            maxItems: 3,
                                            items: {
                                                type: "integer",
                                                minimum: 0,
                                                maximum: 255
                                            }
                                        }
                                    ]
                                },
                                tint_method: {
                                    description: "La méthode de teinte utilisée sur la couleur du Bloc.",
                                    type: "string",
                                    enum: schemaEnums.tint_methods
                                }
                            }
                        }
                    ]
                }
            }
        ]
    },
    {
        version: "1.19.20",
        changes: [
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:block_light_emission"],
                notes: "Remplacé par light_emission"
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:light_emission"],
                value: {
                    description: "Définit la quantité de lumière émise par le Bloc. (0-15)",
                    default: 0,
                    type: "integer",
                    minimum: 0,
                    maximum: 15
                }
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:destroy_time"],
                notes: "Remplacé par destructible_by_mining"
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:destructible_by_mining"],
                value: {
                    description: "Définit les propriétés de destruction du Bloc par le minage. Si cette valeur est `true`, le Bloc utilisera les valeurs par défaut pour `seconds_to_destroy`",
                    default: true,
                    oneOf: [
                        {
                            type: "boolean"
                        },
                        {
                            type: "object",
                            required: ["seconds_to_destroy"],
                            properties: {
                                seconds_to_destroy: {
                                    description: "Le temps en secondes pour détruire le Bloc.",
                                    default: 0,
                                    type: "number",
                                    minimum: 0
                                }
                            }
                        }
                    ]
                }
            },
            {
                action: "modify",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:friction"],
                value: {
                    description: "Définit la friction du Bloc. (0.0-0.9)",
                    default: 0.4,
                    type: "number",
                    minimum: 0,
                    maximum: 0.9
                }
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:explosion_resistance"],
                notes: "Remplacé par destructible_by_explosion"
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:destructible_by_explosion"],
                value: {
                    description: "Définit les propriétés de destruction du Bloc par les explosions. Si cette valeur est `true`, le Bloc utilisera les valeurs par défaut pour `explosion_resistance`. Si cette valeur est `false`, le Bloc ne sera pas affecté par les explosions.",
                    default: true,
                    oneOf: [
                        {
                            type: "boolean"
                        },
                        {
                            type: "object",
                            required: ["explosion_resistance"],
                            properties: {
                                explosion_resistance: {
                                    description: "La résistance du Bloc aux explosions.",
                                    default: 0,
                                    type: "number",
                                    minimum: 0
                                }
                            }
                        }
                    ]
                }
            }
        ]
    },
    {
        version: "1.19.40",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "description", "properties", "menu_category", "properties", "is_hidden_in_commands"],
                value: {
                    description: "Indique si le Bloc doit être caché dans les commandes.",
                    default: false,
                    type: "boolean"
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:geometry"],
                value: {
                    description: "Définit le modèle utilisé pour le Bloc.",
                    oneOf: [
                        {
                            type: "string",
                            "x-dynamic-examples-source": [dynamicExamplesSourceKeys.model_ids]
                        },
                        {
                            type: "object",
                            required: ["identifier"],
                            properties: {
                                identifier: {
                                    description: "L'identifiant du modèle pour le Bloc.",
                                    type: "string",
                                    "x-dynamic-examples-source": [dynamicExamplesSourceKeys.model_ids]
                                },
                                bone_visibility: {
                                    description: "Définit la visibilité de chaque os du modèle. Par défaut, tous les os sont visibles.",
                                    type: "object",
                                    additionalProperties: {
                                        type: "boolean"
                                    }
                                },
                                culling: {
                                    description: "L'identifiant des règles de Block Culling à utiliser pour le Bloc.",
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_culling_rules_ids
                                },
                                culling_layer: {
                                    description: "Paramètre qui définit l'identifiant de la couche de culling du Bloc. Utile pour les fichiers des règles de Block Culling.",
                                    default: "minecraft:culling_layer.undefined",
                                    type: "string",
                                    pattern: schemaPatterns.culling_layer_identifier,
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.culling_layer_ids
                                },
                                culling_shape: {
                                    description: "Définit la Voxel Shape à utiliser pour le culling des faces adjacentes du Bloc. Les Voxel Shapes fonctionnent avec les règles de Block Culling et ne fonctionnent pas si aucune règle n'a été définit pour le Bloc. Seuls les blocs adjacents utilisant des Voxel Shapes seront masqué par cette Shape. Les Blocs avec la modèle `minecraft:geometry.full_block` utiliseront toujours la Voxel Shape `minecraft:unit_cube`.",
                                    default: "minecraft:empty",
                                    type: "string",
                                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.voxel_shape_ids
                                },
                                n_way_visual_rotation: {
                                    description: "Définit la rotation visuelle du modèle du Bloc en fonction de l'état de Bloc spécifié. Les états possible sont les traits `minecraft:cardinal_direction`, `minecraft:sixteen_way_rotation` ainsi que tous les états de blocs personalisé.",
                                    type: "object",
                                    minProperties: 1,
                                    properties: {
                                        x: {
                                            description: "L'état de Bloc utilisé pour la rotation visuelle du modèle du Bloc sur l'axe X.",
                                            type: "string"
                                        },
                                        y: {
                                            description: "L'état de Bloc utilisé pour la rotation visuelle du modèle du Bloc sur l'axe Y.",
                                            type: "string"
                                        },
                                        z: {
                                            description: "L'état de Bloc utilisé pour la rotation visuelle du modèle du Bloc sur l'axe Z.",
                                            type: "string"
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:material_instances"],
                value: {
                    description: "Permet d'assigner des textures et des propriétés de rendu spécifiques aux différentes faces du Bloc. Utilisez `*` pour définir des propriétés par défaut pour toutes les faces.",
                    type: "object",
                    properties: {
                        "*": {$ref: "#/definitions/material_instance"},
                        up: {$ref: "#/definitions/material_instance"},
                        down: {$ref: "#/definitions/material_instance"},
                        north: {$ref: "#/definitions/material_instance"},
                        south: {$ref: "#/definitions/material_instance"},
                        east: {$ref: "#/definitions/material_instance"},
                        west: {$ref: "#/definitions/material_instance"}
                    },
                    additionalProperties: {$ref: "#/definitions/material_instance"}
                }
            }
        ]
    },
    {
        version: "1.19.50",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:collision_box"],
                value: {
                    description: "Définit la boîte de collision du Bloc. Si cette valeur est `true`, le Bloc utilisera les valeurs par défaut pour `origin` et `size`. Si cette valeur est une liste, le Bloc utilisera plusieurs boîtes de collision, ce qui permet de créer des formes de collision plus complexes que les boîtes rectangulaires standard. Les Blocs ont une limite de 16 unités en largeur, et 24 en hauteur.",
                    default: true,
                    oneOf: [
                        {
                            type: "boolean"
                        },
                        {
                            type: "object",
                            required: ["origin", "size"],
                            properties: {
                                origin: {
                                    description: "La position de l'origine de la boîte de collision du Bloc.",
                                    default: [-8, 0, -8],
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: [
                                        {
                                            type: "number",
                                            minimum: -8,
                                            maximum: 8
                                        },
                                        {
                                            type: "number",
                                            minimum: 0,
                                            maximum: 24
                                        },
                                        {
                                            type: "number",
                                            minimum: -8,
                                            maximum: 8
                                        }
                                    ]
                                },
                                size: {
                                    description: "La taille de la boîte de collision du Bloc.",
                                    default: [16, 16, 16],
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: {
                                        type: "number"
                                    }
                                }
                            }
                        },
                        {
                            type: "array",
                            items: {
                                type: "object",
                                required: ["origin", "size"],
                                properties: {
                                    origin: {
                                        description: "La position de l'origine de la boîte de collision du Bloc.",
                                        default: [-8, 0, -8],
                                        type: "array",
                                        minItems: 3,
                                        maxItems: 3,
                                        items: [
                                            {
                                                type: "number",
                                                minimum: -8,
                                                maximum: 8
                                            },
                                            {
                                                type: "number",
                                                minimum: 0,
                                                maximum: 24
                                            },
                                            {
                                                type: "number",
                                                minimum: -8,
                                                maximum: 8
                                            }
                                        ]
                                    },
                                    size: {
                                        description: "La taille de la boîte de collision du Bloc.",
                                        default: [16, 16, 16],
                                        type: "array",
                                        minItems: 3,
                                        maxItems: 3,
                                        items: {
                                            type: "number"
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:crafting_table"],
                value: {
                    description: "Rend le Bloc utilisable comme une table de craft ce qui ouvre l'interface de craft quand on clique dessus et permet d'utiliser des recettes de de types `recipe_shaped` et `recipe_shapeless`.",
                    type: "object",
                    required: ["crafting_tags"],
                    properties: {
                        crafting_tags: {
                            description: "Définit les tags de crafting associés au Bloc. Les recettes de craft qui possèdent au moins un de ces tags seront utilisables sur le Bloc.",
                            type: "array",
                            maxItems: 64,
                            items: {
                                type: "string",
                                maxLength: 64,
                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.crafting_recipe_tags
                            }
                        },
                        table_name: {
                            description: "Le nom de la table de craft qui sera affiché dans l'UI. Si cette valeur n'est pas définie, le nom du Bloc sera utilisé.",
                            type: "string",
                            "x-localized": true
                        }
                    }
                }
            }
        ]
    },
    {
        version: "1.19.60",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:selection_box"],
                value: {
                    description: "Définit la boîte de sélection du Bloc. Si cette valeur est `true`, le Bloc utilisera les valeurs par défaut pour `origin` et `size`.",
                    default: true,
                    oneOf: [
                        {
                            type: "boolean"
                        },
                        {
                            type: "object",
                            properties: {
                                origin: {
                                    description: "La position de l'origine de la boîte de sélection du Bloc.",
                                    default: [-8, 0, -8],
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: [
                                        {
                                            type: "number",
                                            minimum: -8,
                                            maximum: 8
                                        },
                                        {
                                            type: "number",
                                            minimum: 0,
                                            maximum: 16
                                        },
                                        {
                                            type: "number",
                                            minimum: -8,
                                            maximum: 8
                                        }
                                    ]
                                },
                                size: {
                                    description: "La taille de la boîte de sélection du Bloc.",
                                    default: [16, 16, 16],
                                    type: "array",
                                    minItems: 3,
                                    maxItems: 3,
                                    items: {
                                        type: "number"
                                    }
                                }
                            }
                        }
                    ]
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:display_name"],
                value: {
                    description: "Le nom affiché du Bloc dans l'inventaire et les menus. Si cette valeur n'est pas définie, le nom du Bloc sera utilisé.",
                    type: "string",
                    "x-localized": true
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:placement_filter"],
                value: {
                    description: "Définit les conditions de placement du Bloc.",
                    type: "object",
                    properties: {
                        conditions: {
                            description: "Liste des conditions où le Bloc peut être placé/survivre.",
                            type: "array",
                            maxItems: 64,
                            items: {
                                type: "object",
                                properties: {
                                    allowed_faces: {
                                        description: "Liste des faces sur lesquelles le Bloc peut être placé.",
                                        type: "array",
                                        items: {
                                            type: "string",
                                            enum: ["up", "down", "north", "south", "east", "west", "side", "all"]
                                        }
                                    },
                                    block_filter: {
                                        description: "Liste des blocs auquels le Bloc peut être placé à côté.",
                                        type: "array",
                                        maxItems: 64,
                                        items: {
                                            oneOf: [
                                                {
                                                    type: "string",
                                                    "x-dynamic-examples-source": [dynamicExamplesSourceKeys.block_ids, dynamicExamplesSourceKeys.vanilla_block_ids_without_namespace]
                                                },
                                                commonSchemas.block_descriptor
                                            ]
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
        version: "1.19.70",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "description", "properties", "properties"],
                value: {
                    description: "Contient les états du Bloc.",
                    type: "object",
                    propertyNames: {
                        pattern: schemaPatterns.identifier_with_namespace
                    },
                    additionalProperties: {
                        oneOf: [
                            {
                                type: "array",
                                items: {
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        {
                                            type: "integer"
                                        },
                                        {
                                            type: "boolean"
                                        }
                                    ]
                                }
                            },
                            {
                                type: "object",
                                required: ["values"],
                                properties: {
                                    values: {
                                        description: "Les tranches de valeurs integers minimales et maximales pour l'état du Bloc.",
                                        type: "object",
                                        properties: {
                                            min: {
                                                description: "La valeur minimale de l'état du Bloc.",
                                                type: "integer",
                                            },
                                            max: {
                                                description: "La valeur maximale de l'état du Bloc.",
                                                type: "integer"
                                            }
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "permutations"],
                value: {
                    description: "Définit les permutations du Bloc.",
                    type: "array",
                    items: {
                        type: "object",
                        required: ["condition", "components"],
                        properties: {
                            condition: {
                                description: "La condition Molang qui doit être remplie pour que cette permutation soit appliquée.",
                                type: "molang"
                            },
                            components: {
                                description: "Les composants du Bloc pour cette permutation.",
                                $ref: "#/properties/minecraft:block/properties/components"
                            }
                        }
                    }
                }
            }
        ]
    },
    {
        version: "1.19.80",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:transformation"],
                value: {
                    description: "Définit la transformation appliquée au Bloc lors de son rendu.",
                    type: "object",
                    properties: {
                        translation: {
                            description: "La translation appliquée au Bloc.",
                            type: "array",
                            minItems: 3,
                            maxItems: 3,
                            items: {
                                type: "number"
                            }
                        },
                        rotation: {
                            description: "La rotation appliquée au Bloc.",
                            type: "array",
                            minItems: 3,
                            maxItems: 3,
                            items: {
                                type: "number",
                                multipleOf: 90
                            }
                        },
                        scale: {
                            description: "L'échelle appliquée au Bloc.",
                            type: "array",
                            minItems: 3,
                            maxItems: 3,
                            items: {
                                type: "number"
                            }
                        },
                        rotation_pivot: {
                            description: "Le point de pivot de rotation appliqué au Bloc.",
                            type: "array",
                            minItems: 3,
                            maxItems: 3,
                            items: {
                                type: "number"
                            }
                        },
                        scale_pivot: {
                            description: "Le point de pivot d'échelle appliqué au Bloc.",
                            type: "array",
                            minItems: 3,
                            maxItems: 3,
                            items: {
                                type: "number"
                            }
                        }
                    }
                }
            }
        ]
    },
    {
        version: "1.20.10",
        changes: [
            {
                action: "modify",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:geometry", "oneOf", "1", "properties", "bone_visibility"],
                value: {
                    description: "Définit la visibilité de chaque os du modèle. Par défaut, tous les os sont visibles. La visibilité de chaque os peut être définit via une condition molang.",
                    type: "object",
                    additionalProperties: {
                        type: "molang"
                    }
                }
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "description", "properties", "properties"],
                notes: "Renommé en `states`"
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "description", "properties", "states"],
                value: {
                    description: "Contient les états du Bloc.",
                    type: "object",
                    propertyNames: {
                        pattern: schemaPatterns.identifier_with_namespace
                    },
                    additionalProperties: {
                        description: "Les valeurs possibles pour l'état du Bloc.",
                        oneOf: [
                            {
                                type: "array",
                                items: {
                                    oneOf: [
                                        {
                                            type: "string"
                                        },
                                        {
                                            type: "integer"
                                        },
                                        {
                                            type: "boolean"
                                        }
                                    ]
                                }
                            },
                            {
                                type: "object",
                                required: ["values"],
                                properties: {
                                    values: {
                                        description: "Les tranches de valeurs integers minimales et maximales pour l'état du Bloc.",
                                        type: "object",
                                        properties: {
                                            min: {
                                                description: "La valeur minimale de l'état du Bloc.",
                                                type: "integer",
                                            },
                                            max: {
                                                description: "La valeur maximale de l'état du Bloc.",
                                                type: "integer"
                                            }
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        ]
    },
    {
        version: "1.20.20",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "description", "properties", "traits"],
                value: {
                    description: "Contient les traits du Bloc. Les traits ajoutes des états de Blocs built-in qui prennent une valeur en fonction d'un certain contexte.",
                    type: "object",
                    properties: {
                        "minecraft:placement_direction": {
                            description: "Trait qui peut ajouter des états de Blocs contenant des informations sur la rotation du joueur lorsque le bloc est placé.",
                            type: "object",
                            properties: {
                                enabled_states: {
                                    description:
                                    "La liste des états built-in à activer.\n\n" +
                                    "`minecraft:cardinal_direction`: Définit l'orientation cardinale lors du placement d'un Bloc.\n\n" +
                                    "`minecraft:facing_direction`: Définit toutes les directions de placement du Bloc.\n\n" +
                                    "`minecraft:corner_and_cardinal_direction`: Active l'état de bloc `minecraft:corner` avec les valeurs `none`, `inner_left`, `inner_right`, `outer_left` et `outer_right` qui fournit un comportement similaire aux escaliers Vanilla.\n\n" +
                                    "`minecraft:sixteen_way_rotation`: Définit l'orientation du Bloc en 16 directions différentes, avec une valeur comprise entre 0 et 15.",
                                    type: "array",
                                    items: {
                                        type: "string",
                                        enum: [
                                            "minecraft:cardinal_direction",
                                            "minecraft:facing_direction",
                                            "minecraft:corner_and_cardinal_direction",
                                            "minecraft:sixteen_way_rotation"
                                        ]
                                    }
                                },
                                y_rotation_offset: {
                                    description: "Ajoute un décalage de rotation en Y pour les états de Bloc.",
                                    default: 0,
                                    type: "number",
                                    enum: [0, 90, 180, 270, 360]
                                },
                                blocks_to_corner_with: {
                                    description: "Lorsque le trait `minecraft:corner_and_cardinal_direction` est activé, ce champ permet de définir les blocs avec lesquels ce bloc peut former un coin.",
                                    type: "array",
                                    items: {
                                        oneOf: [
                                            {
                                                type: "string",
                                                "x-dynamic-examples-source": [dynamicExamplesSourceKeys.block_ids, dynamicExamplesSourceKeys.vanilla_block_ids_without_namespace]
                                            },
                                            commonSchemas.block_descriptor
                                        ]
                                    }
                                }
                            }
                        },
                        "minecraft:placement_position": {
                            description: "Trait qui peut ajouter des états de Blocs contenant des informations sur la position du Bloc lors de son placement.",
                            type: "object",
                            properties: {
                                enabled_states: {
                                    description:
                                    "La liste des états built-in à activer.\n\n" +
                                    "`minecraft:block_face`: Indique sur quelle face du Bloc le Bloc est placé.\n\n" +
                                    "`minecraft:vertical_half`: Indique dans quelle moitié verticale de l'espace le bloc est placé.",
                                    type: "array",
                                    items: {
                                        type: "string",
                                        enum: ["minecraft:block_face", "minecraft:vertical_half"]
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
        version: "1.21.30",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:redstone_conductivity"],
                value: {
                    description: "Définit les propriétés basiques de redstone du Bloc. Si ce composant n'est pas définit, les valeurs par défaut seront utilisées.",
                    type: "object",
                    properties: {
                        allows_wire_to_step_down: {
                            description: "Spécifie si les fils de redstone peuvent descendre en escalier sur ce Bloc.",
                            default: true,
                            type: "boolean"
                        },
                        redstone_conductor: {
                            description: "Spécifie si le Bloc peut être alimenté par la redstone.",
                            default: false,
                            type: "boolean"
                        }
                    }
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:destructible_by_mining", "oneOf", "1", "properties", "item_specific_speeds"],
                value: {
                    description: "Liste facultative d'objets pour définir les vitesses de destruction du Bloc par des items spécifiques.",
                    type: "array",
                    items: {
                        type: "object",
                        required: ["item", "destroy_speed"],
                        properties: {
                            item: {
                                description: "L'item ou les items pour lesquels la vitesse de destruction est définie.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_ids
                                    },
                                    commonSchemas.item_descriptor
                                ]
                            },
                            destroy_speed: {
                                description: "La vitesse de destruction du Bloc avec l'item spécifié.",
                                type: "number"
                            }
                        }
                    }
                }
            }
        ]
    },
    {
        version: "1.21.50",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:item_visual"],
                value: {
                    description: "Définit le modèle et les textures de l'item utilisé pour représenter le Bloc.",
                    type: "object",
                    properties: {
                        geometry: {
                            $ref: "#/properties/minecraft:block/properties/components/properties/minecraft:geometry"
                        },
                        material_instances: {
                            $ref: "#/properties/minecraft:block/properties/components/properties/minecraft:material_instances"
                        }
                    }
                }
            }
        ]
    },
    {
        version: "1.21.60",
        changes: [
            {
                action: "modify",
                target: ["properties", "minecraft:block", "properties", "description", "properties", "menu_category", "properties", "group"],
                value: {
                    description: "Le groupe d'items du menu créatif où le Bloc sera placé.",
                    type: "string",
                    maxLength: 256,
                    pattern: schemaPatterns.identifier_with_namespace,
                    "x-dynamic-examples-source": dynamicExamplesSourceKeys.item_group_ids
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:liquid_detection"],
                value: {
                    description: "Définit le comportement du Bloc lors du contact avec des liquides.",
                    type: "object",
                    required: ["detection_rules"],
                    properties: {
                        detection_rules: {
                            description: "Liste des règles de détection des liquides pour le Bloc.",
                            type: "array",
                            minItems: 1,
                            items: {
                                type: "object",
                                properties: {
                                    can_contain_liquid: {
                                        description: "Indique si le Bloc peut contenir un liquide. Par exemple, si le type de liquide est `water`, le Bloc peut être rempli d'eau.",
                                        default: false,
                                        type: "boolean"
                                    },
                                    liquid_type: {
                                        description: "Le type de liquide auquel cette règle s'applique. Actuellement, seul `water` est supporté.",
                                        default: "water",
                                        type: "string",
                                        enum: ["water"]
                                    },
                                    on_liquid_touches: {
                                        description:
                                        "Définit le comportement du Bloc lorsqu'il est touché par un liquide.\n\n" +
                                        "`blocking`: La valeur par défaut. Le Bloc arrête le liquide et ne permet pas à celui-ci de le traverser.\n\n" +
                                        "`broken`: Le Bloc est complètement détruit lorsque le liquide le touche.\n\n" +
                                        "`popped`: Le Bloc est détruit, mais laisse tomber son item lorsqu'il est touché par le liquide.\n\n" +
                                        "`no_reaction`: Le Bloc n'est pas affecté par le liquide, et visuellement le liquide le traverse sans interagir avec lui.",
                                        default: "blocking",
                                        type: "string",
                                        enum: ["blocking", "broken", "popped", "no_reaction"]
                                    },
                                    stops_liquid_flowing_from_direction: {
                                        description: "Lorsque le Bloc contient un liquide, cette propriété contrôle les directions dans lesquelles le liquide ne peut pas s'écouler depuis le Bloc. Elle contrôle également les directions dans lesquelles un Bloc peut arrêter l'écoulement du liquide si `no_reaction` est défini pour le champ `on_liquid_touches`.",
                                        type: "array",
                                        items: {
                                            type: "string",
                                            enum: ["up", "down", "north", "south", "east", "west"]
                                        }
                                    },
                                    use_liquid_clipping: {
                                        description: "Si `true`, le Bloc utilisera la valeur de `minecraft:collision_box` pour visuellement clipper le liquide. Par exemple, si le type de liquide est `water` et que `use_liquid_clipping` est `true`, l'eau ne sera rendue que dans les parties du Bloc qui ne sont pas couvertes par la boîte de collision du Bloc. Si cette valeur est `false`, le liquide sera rendu à travers tout le Bloc, même dans les parties qui sont couvertes par la boîte de collision du Bloc.",
                                        default: true,
                                        type: "boolean"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            {
                action: "modify",
                target: ["definitions", "material_instance", "oneOf", "1", "properties", "ambient_occlusion"],
                value: {
                    description: "Définit si l'occlusion ambiante est activée pour le Bloc. Si cette valeur est `true`, le Bloc sera affecté par l'occlusion ambiante. Peut être de type `float` pour définir un niveau d'occlusion ambiante personnalisé.",
                    default: true,
                    oneOf: [
                        {
                            type: "boolean"
                        },
                        {
                            type: "number"
                        }
                    ]
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:replaceable"],
                value: {
                    description: "Si ce Bloc possède ce composant, il peut être remplacé par d'autres blocs quand ils sont placés à sa place. Ne peut pas être utilisé dans les permutations.",
                    type: "object"
                }
            }
        ]
    },
    {
        version: "1.21.70",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:destruction_particles"],
                value: {
                    description: "Définit les particules qui seront générées lorsque le Bloc est détruit.",
                    type: "object",
                    properties: {
                        texture: {
                            description: "La référence de la texture utilisé pour les particules de destruction du Bloc. Si cette valeur n'est pas définie, la texture `material_instance` de la face `down` du Bloc sera utilisée (ou `*` si aucune face n'est définie).",
                            type: "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_texture_references
                        },
                        tint_method: {
                            description: "La méthode de teinte à utiliser pour la couleur des particules de destruction du Bloc.",
                            default: "none",
                            type: "string",
                            enum: schemaEnums.tint_methods
                        }
                    }
                }
            },
            {
                action: "add",
                target: ["definitions", "material_instance", "oneOf", "1", "properties", "isotropic"],
                value: {
                    description: "Définit si la texture du Bloc est isotrope, c'est-à-dire si elle a des faces randomisées. Si cette valeur est `true`, la texture du Bloc sera appliquée de manière isotrope, ce qui signifie que les faces du Bloc auront des textures aléatoires.",
                    default: false,
                    type: "boolean"
                }
            }
        ]
    },
    {
        version: "1.21.90",
        changes: [
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:custom_components"],
                notes: "Remplacé par les composants personnalisés V2."
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:destruction_particles", "properties", "particle_count"],
                value: {
                    description: "Définit le nombre de particules à générer lors de la destruction du Bloc.",
                    default: 100,
                    type: "integer",
                    minimum: 0,
                    maximum: 255
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:geometry", "oneOf", "1", "properties", "uv_lock"],
                value: {
                    description: "Définit si l'orientation UV de tous les os du modèle est vérouillée, ou si l'orientation UV de certains os spécifiques est verrouillée. Pour des raisons de performance, il est recommandé d'utiliser un booléen. Notez que pour les cubes utilisant des UVs en boîte, plutôt que des UVs par face, `uv_lock` n'est pris en charge que si les faces du cube sont carrées.",
                    oneOf: [
                        {
                            type: "boolean"
                        },
                        {
                            type: "array",
                            items: {
                                type: "string"
                            }
                        }
                    ]
                }
            }
        ]
    },
    {
        version: "1.21.100",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:movable"],
                value: {
                    description: "Définit comment le Bloc réagit lorsqu'il est poussé par un piston.",
                    type: "object",
                    required: ["movement_type"],
                    "properties": {
                        movement_type: {
                            description:
                            "Définit le type de mouvement du Bloc lorsqu'il est poussé par un piston.\n\n" +
                            "`push_pull`: La valeur par défaut. Le Bloc peut être poussé et tiré par un piston.\n\n" +
                            "`push`: Le Bloc ne sera seulement poussé par un piston et ignorera les pistons collants\n\n" +
                            "`popped`: Le Bloc sera détruit quand il est déplacé par un piston.\n\n" +
                            "`immovable`: Le Bloc ne sera pas affecté par les pistons, il ne peut pas être poussé ou tiré.",
                            type: "string",
                            enum: ["push_pull", "push", "popped", "immovable"]
                        },
                        sticky: {
                            description:
                            "Définit comment le bloc doit gérer les blocs adjacents autour de lui lorsqu'il est poussé par un autre bloc comme un piston.\n\n" +
                            "`none`: Valeur par défaut. N'ajoute aucun comportement en particulier.\n\n" +
                            "`same`: Les blocs adjacents seront poussés ou tirés avec le Bloc. Celà exclut les autres blocs avec la propriété `same`. Celà ne marchera qu'avec un `movement_type` définit sur `push_pull`",
                            default: "none",
                            type: "string",
                            enum: ["none", "same"]
                        }
                    }
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:random_offset"],
                value: {
                    description: "Définit un décalage aléatoire pour la position du Bloc. Ne peut pas être utilisé dans les permutations de blocs.",
                    type: "object",
                    properties: {
                        x: {
                            description: "Les paramètres de décalage aléatoire en X.",
                            type: "object",
                            properties: {
                                range: {
                                    description: "La plage de décalage aléatoire.",
                                    type: "object",
                                    properties: {
                                        min: {
                                            description: "La valeur minimale du décalage aléatoire.",
                                            default: 0,
                                            type: "number",
                                            minimum: -8,
                                            maximum: 8
                                        },
                                        max: {
                                            description: "La valeur maximale du décalage aléatoire.",
                                            default: 0,
                                            type: "number",
                                            minimum: -8,
                                            maximum: 8
                                        }
                                    }
                                },
                                steps: {
                                    description: "Le nombre de pas/étapes pour le décalage aléatoire",
                                    type: "integer"
                                }
                            }
                        },
                        y: {
                            description: "Les paramètres de décalage aléatoire en Y.",
                            type: "object",
                            properties: {
                                range: {
                                    description: "La plage de décalage aléatoire.",
                                    type: "object",
                                    properties: {
                                        min: {
                                            description: "La valeur minimale du décalage aléatoire.",
                                            default: 0,
                                            type: "number",
                                            minimum: -8,
                                            maximum: 8
                                        },
                                        max: {
                                            description: "La valeur maximale du décalage aléatoire.",
                                            default: 0,
                                            type: "number",
                                            minimum: -8,
                                            maximum: 8
                                        }
                                    }
                                },
                                steps: {
                                    description: "Le nombre de pas/étapes pour le décalage aléatoire",
                                    type: "integer"
                                }
                            }
                        },
                        z: {
                            description: "Les paramètres de décalage aléatoire en Z.",
                            type: "object",
                            properties: {
                                range: {
                                    description: "La plage de décalage aléatoire.",
                                    type: "object",
                                    properties: {
                                        min: {
                                            description: "La valeur minimale du décalage aléatoire.",
                                            default: 0,
                                            type: "number",
                                            minimum: -8,
                                            maximum: 8
                                        },
                                        max: {
                                            description: "La valeur maximale du décalage aléatoire.",
                                            default: 0,
                                            type: "number",
                                            minimum: -8,
                                            maximum: 8
                                        }
                                    }
                                },
                                steps: {
                                    description: "Le nombre de pas/étapes pour le décalage aléatoire",
                                    type: "integer"
                                }
                            }
                        }
                    }
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "description", "properties", "traits", "properties", "minecraft:multi_block"],
                value: {
                    description: "Trait qui expose l'état de bloc built-in `minecraft:multi_block_part` qui fournit des informations sur la partie d'un multibloc. Un multibloc est un ensemble de blocs qui forment ensemble une structure plus grande comme une porte. La boite de selection du bloc prendra automatiquement en compte les différentes parties du multibloc pour fournir une sélection plus précise en mettant `minecraft:selection_box` à `true`. Egalement ce trait peut combiner les boites de selections de chaque partie du multibloc.",
                    type: "object",
                    required: ["enabled_states", "direction"],
                    properties: {
                        enabled_states: {
                            description:
                            "Liste des états built-in à activer.\n\n" +
                            "`minecraft:multi_block_part`: Indique quelle partie du multibloc le bloc représente. Les valeurs possibles sont `none`, `head`, `body` et `tail`.",
                            type: "array",
                            items: {
                                type: "string",
                                enum: ["minecraft:multi_block_part"]
                            }
                        },
                        direction: {
                            description: "Définit la direction de placement du multibloc de 0 à N. Les valeurs valides sont `up` et `down`. Les valeurs `north`, `south`, `east` et `west` sont disponibles avec l'option `Upcoming Creator Features` activée.",
                            type: "string",
                            enum: ["up", "down", "north", "south", "east", "west"]
                        },
                        parts: {
                            description: "Définit la valeur de l'état `minecraft:multi_block_part` pour chaque partie du multibloc.",
                            type: "integer",
                            minimum: 2,
                            maximum: 4
                        }
                    }
                }
            }
        ]
    },
    {
        version: "1.21.120",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:redstone_producer"],
                value: {
                    description: "Définit le comportement du Bloc en tant que source de redstone. Avec une `format_version >= 1.26.20`, ce composant ne peut être utilisé dans les permutations uniquement s'il est définit dans les composants de base du Bloc.",
                    type: "object",
                    required: ["power"],
                    properties: {
                        power: {
                            description: "La puissance de redstone émise par le Bloc. La valeur doit être comprise entre 0 et 15.",
                            type: "integer",
                            minimum: 0,
                            maximum: 15
                        },
                        strongly_powered_face: {
                            description: "Le bloc touchant cette face sera fortement alimenté avec un niveau de signal de `power`. Les blocs fortement alimentés alimenteront les blocs adjacents. Par défaut, le bloc n'alimentera aucune face.",
                            type: "string",
                            enum: ["up", "down", "north", "south", "east", "west"]
                        },
                        connected_faces: {
                            description: "La liste des faces qui sont considérées comme connectées au circuit. Si une face n'est pas connectée, elle ne fournira pas de puissance au bloc touchant cette face. Par défaut, toutes les faces sont connectées.",
                            type: "array",
                            items: {
                                type: "string",
                                enum: ["up", "down", "north", "south", "east", "west"]
                            }
                        },
                        transform_relative: {
                            description: "Si `true`, les propriétés `strongly_powered_face` et `connected_faces` seront pivotés en fonction du composant `minecraft:transformation` du Bloc.",
                            default: false,
                            type: "boolean"
                        }
                    }
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:flower_pottable"],
                value: {
                    description: "Indique que le Bloc peut être placé dans un pot de fleur.",
                    type: "object"
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:embedded_visual"],
                value: {
                    description: "Définit le modèle et les textures du Bloc lorsqu'il est placé dans un autre Bloc (comme un pot de fleur).",
                    type: "object",
                    properties: {
                        geometry: {
                            $ref: "#/properties/minecraft:block/properties/components/properties/minecraft:geometry"
                        },
                        material_instances: {
                            $ref: "#/properties/minecraft:block/properties/components/properties/minecraft:material_instances"
                        }
                    }
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:precipitation_interactions"],
                value: {
                    description: "Détermine comment le Bloc intéragit avec les précipitations (pluie, neige, etc.).",
                    type: "object",
                    properties: {
                        precipitation_behavior: {
                            description: "Le comportement du Bloc lorsqu'il est exposé aux précipitations.",
                            default: "obstruct_rain_accumulate_snow",
                            type: "string",
                            enum: [
                                "obrain", "obstruct_rain_accumulate_snow", "none", "snowlogging"
                            ]
                        }
                    }
                }
            },
            {
                action: "add",
                target: ["definitions", "material_instance", "oneOf", "1", "properties", "alpha_masked_tint"],
                value: {
                    description: "Quand `true`, la canal alpha de la texture sera utilisé pour multiplier la teinte de l'albédo de la texture. `tint_method` doit être différent de `none` et `render_method` doit être `opaque`.",
                    default: false,
                    type: "boolean"
                }
            }
        ]
    },
    {
        version: "1.26.0",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:redstone_consumer"],
                value: {
                    description: "Définit comment un Bloc peut consommer et potentiellement propager un signal de redstone. Ce composant n'est actuellement pas disponible dans les permutations de blocs.",
                    type: "object",
                    properties: {
                        min_power: {
                            description: "Définit la valeur minimale pour la force du signal entrant. Si la force du signal est supérieure ou égale à cette valeur, l'événement `onRedstoneUpdate` est envoyé aux Scripts.",
                            default: 0,
                            type: "integer",
                            minimum: 0,
                            maximum: 15
                        },
                        propagates_power: {
                            description: "Définit si un signal de redstone peut passer à travers ce Bloc. Ce paramètre remplace la propriété `redstone_conductor` du composant `minecraft:redstone_conductivity`.",
                            default: false,
                            type: "boolean"
                        }
                    }
                }
            },
            {
                action: "modify",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:liquid_detection", "properties", "use_liquid_clipping", "default"],
                value: false
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:connection_rule"],
                value: {
                    description: "Définit si les autres blocs ayant un comportement de connexion (comme les clôtures, les murs, les barreaux et les vitres) peuvent tenter d'établir une connexion.",
                    type: "object",
                    properties: {
                        accepts_connections_from: {
                            description: "La liste des types de connexions que ce Bloc accepte.",
                            type: "array",
                            items: {
                                type: "string",
                                enum: ["none", "only_fences", "all"]
                            }
                        },
                        enabled_directions: {
                            description: "Les directions dans lesquelles ce Bloc peut se connecter à d'autres blocs.",
                            type: "array",
                            items: {
                                type: "string",
                                enum: ["north", "south", "east", "west", "up", "down"]
                            }
                        }
                    }
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:support"],
                value: {
                    description: "Définit la forme de support du Bloc. Actuellement, seuls les blocs ayant la même forme qu'une clôture Vanilla et qu'un escalier Vanilla sont autorisés. Pour fonctionner avec des escaliers personnalisés, il est nécessaire d'utiliser `minecraft:vertical_half` et `minecraft:cardinal_direction` ou `minecraft:facing_direction` qui peuvent être définis via le trait de bloc `minecraft:placement_direction`. Les blocs personnalisés sans ce composant auront par défaut une unité cube de support.",
                    type: "object",
                    required: ["shape"],
                    properties: {
                        shape: {
                            description: "La forme de support du Bloc.",
                            type: "string",
                            enum: ["fence", "stair"]
                        }
                    }
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:leashable"],
                value: {
                    description: "Permet aux entités attachables d'être attachées à ce Bloc avec une laisse.",
                    type: "object",
                    properties: {
                        offset: {
                            description: "Définit le décalage de l'attache de la laisse par rapport au centre du Bloc.",
                            type: "array",
                            minItems: 3,
                            maxItems: 3,
                            items: {
                                type: "number"
                            }
                        }
                    }
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "description", "properties", "traits", "properties", "minecraft:connection"],
                value: {
                    description: "Trait qui expose le comportement similaire au barrières et aux vitres où les blocs se connectent automatiquement aux blocs adjacents. Utiliser ce trait active les états built-in `minecraft:connection_north`, `minecraft:connection_east`, `minecraft:connection_south` et `minecraft:connection_west`.",
                    type: "object",
                    properties: {
                        enabled_states: {
                            description: "Liste des états built-in à activer.",
                            type: "array",
                            items: {
                                type: "string",
                                enum: ["minecraft:cardinal_connections"]
                            }
                        }
                    }
                }
            }
        ]
    },
    {
        version: "1.26.20",
        changes: [
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:chest_obstruction"],
                value: {
                    description: "Définit le comportement du Bloc lorsqu'il est placé au dessus d'un coffre ou un coffre de l'ender pour l'empecher ou non de bloquer l'ouverture du coffre.",
                    type: "object",
                    properties: {
                        obstruction_rule: {
                            description:
                            "Définit comment le Bloc est évalué durant l'ouverture du coffre. Les Blocs avec une `format_version` antérieure à 1.26.20 seront traités en fonction de leur modèle définit ainsi que leur `material_instances`" +
                            "\n- `always`: le Bloc bloquera toujours l'ouverture du coffre." +
                            "\n- `never`: le Bloc n'empêchera jamais l'ouverture du coffre." +
                            "\n- `shape`: utilisera la boite de collision du Bloc pour déterminer s'il bloque l'ouverture du coffre.",
                            default: "shape",
                            type: "string",
                            enum: ["always", "never", "shape"]
                        }
                    }
                }
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:acacia"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:birch"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:minecraft:cornerable_stairs"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:minecraft:crop"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:dark_oak"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:diamond_pick_diggable"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:minecraft:diamond_tier_destructible"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:dirt"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:fertilize_area"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:grass"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:gravel"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:minecraft:has_fence_connections"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:iron_pick_diggable"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:minecraft:iron_tier_destructible"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:minecraft:is_axe_item_destructible"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:minecraft:is_hoe_item_destructible"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:minecraft:is_pickaxe_item_destructible"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:minecraft:is_shears_item_destructible"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:minecraft:is_shovel_item_destructible"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:minecraft:is_sword_item_destructible"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:jungle"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:log"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:metal"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:mob_spawner"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:not_feature_replaceable"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:oak"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:one_way_collidable"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:plant"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:pumpkin"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:rail"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:sand"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:snow"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:spruce"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:stone"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:stone_pick_diggable"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:minecraft:stone_tier_destructible"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:text_sign"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:trapdoors"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:water"],
            },
            {
                action: "remove",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "tag:wood"],
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:tags"],
                value: {
                    description: "Définit les tags à donner au Bloc.",
                    type: "array",
                    items: {
                        type: "string",
                        pattern: schemaPatterns.identifier_with_namespace,
                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_tags
                    }
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:flammable", "properties", "lava_flammable"],
                value: {
                    description:
                    "Définit si le Bloc peut être enflammé par la lave." +
                    "\n- `always`: le Bloc est pris en compte lorsque la lave tente de propager le feu après la mise à jour des blocs adjacents, tout en respectant les règles normales de placement du feu." +
                    "\n- `never`: le Bloc ne peut pas être enflammé par la lave.",
                    default: "never",
                    type: "string",
                    enum: ["always", "never"]
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:block_entity"],
                value: {
                    "x-experimental_options": ["Upcoming Creator Features"],
                    description: "Définit si le Bloc est un block-entity. Un block-entity est un type de bloc qui peut stocker des données persistantes et locales, similaire aux coffres, aux générateurs de monstres, aux panneaux, etc. Les block-entities sont plus gourmands en RAM que les blocs normaux, donc utilisez-les avec parcimonie. Ne peut pas être utilisé dans les permutations de blocs.",
                    type: "object",
                    properties: {
                        dynamic_properties: {
                            description: "Définit si le block-entity peut avoir des propriétés dynamiques.",
                            type: "boolean"
                        }
                    }
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:instrument_sound"],
                value: {
                    description: "Définit le son de l'instrument du Bloc. Le son de l'instrument est utilisé par les blocs de note pour produire un son spécifique lorsqu'ils sont activés.",
                    type: "object",
                    minProperties: 1,
                    properties: {
                        up: {
                            description: "Le son de l'instrument lorsque le Bloc est placé sur un bloc au dessus.",
                            default: "note.harp",
                            type: "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_sound_references,
                            examples: ["note.none"]
                        },
                        down: {
                            description: "Le son de l'instrument lorsque le Bloc est placé sur un bloc en dessous.",
                            default: "note.none",
                            type: "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_sound_references,
                            examples: ["note.none"]
                        }
                    }
                }
            },
            {
                action: "add",
                target: ["properties", "minecraft:block", "properties", "components", "properties", "minecraft:sound"],
                value: {
                    description: "Définit l'ensemble des sons à attribuer au Bloc et à ses permutations. Les valeurs du fichier `blocks.json` sont prioritaires sur celles du composant `minecraft:sound`.",
                    type: "object",
                    properties: {
                        sound: {
                            description: "La référence de son de bloc à utiliser. Cette référence doit être définie dans le fichier `sounds.json`.",
                            type: "string",
                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.block_sound_references
                        }
                    }
                }
            }
        ]
    }
];

export const versionedSchema: VersionedSchema = {
    baseSchema: baseSchema,
    versionedChanges: versionedChanges
};

export default versionedSchema;