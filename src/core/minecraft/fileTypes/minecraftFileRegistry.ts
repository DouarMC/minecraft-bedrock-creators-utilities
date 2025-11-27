import { MinecraftFileId } from "./MinecraftFileId";
import { MinecraftFileType } from "./MinecraftFileType";

/**
 * Inscription de tous les types de fichiers Minecraft pris en charge.
 */
export const minecraftFileRegistry: Record<MinecraftFileId, MinecraftFileType> = {
    "behavior_pack/aim_assist/categories/categories.json": new MinecraftFileType({
        id: "behavior_pack/aim_assist/categories/categories.json",
        displayName: "Aim Assist Categories",
        packType: "behavior_pack",
        patterns: ["**/aim_assist/categories/categories.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "behavior_pack/aim_assist/presets/<all>.json": new MinecraftFileType({
        id: "behavior_pack/aim_assist/presets/<all>.json",
        displayName: "Aim Assist Presets",
        packType: "behavior_pack",
        patterns: ["**/aim_assist/presets/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "behavior_pack/animation_controllers/<all>.json": new MinecraftFileType({
        id: "behavior_pack/animation_controllers/<all>.json",
        displayName: "Behavior Animation Controllers",
        packType: "behavior_pack",
        patterns: ["**/animation_controllers/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "behavior_pack/animations/<all>.json": new MinecraftFileType({
        id: "behavior_pack/animations/<all>.json",
        displayName: "Behavior Animations",
        packType: "behavior_pack",
        patterns: ["**/animations/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "behavior_pack/biomes/<all>.json": new MinecraftFileType({
        id: "behavior_pack/biomes/<all>.json",
        displayName: "Biomes Definition",
        packType: "behavior_pack",
        patterns: ["**/biomes/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "behavior_pack/blocks/<all>.json": new MinecraftFileType({
        id: "behavior_pack/blocks/<all>.json",
        displayName: "Blocks Definition",
        packType: "behavior_pack",
        patterns: ["**/blocks/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "behavior_pack/cameras/presets/<all>.json": new MinecraftFileType({
        id: "behavior_pack/cameras/presets/<all>.json",
        displayName: "Camera Presets",
        packType: "behavior_pack",
        patterns: ["**/cameras/presets/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "behavior_pack/contents.json": new MinecraftFileType({
        id: "behavior_pack/contents.json",
        displayName: "Behavior Pack Contents",
        packType: "behavior_pack",
        patterns: ["contents.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "behavior_pack/dialogue/<all>.json": new MinecraftFileType({
        id: "behavior_pack/dialogue/<all>.json",
        displayName: "Dialogue",
        packType: "behavior_pack",
        patterns: ["**/dialogue/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "behavior_pack/dimensions/<all>.json": new MinecraftFileType({
        id: "behavior_pack/dimensions/<all>.json",
        displayName: "Dimensions Definition",
        packType: "behavior_pack",
        patterns: ["**/dimensions/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "behavior_pack/entities/<all>.json": new MinecraftFileType({
        id: "behavior_pack/entities/<all>.json",
        displayName: "Entities Definition",
        packType: "behavior_pack",
        patterns: ["**/entities/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "behavior_pack/feature_rules/<all>.json": new MinecraftFileType({
        id: "behavior_pack/feature_rules/<all>.json",
        displayName: "Feature Rules",
        packType: "behavior_pack",
        patterns: ["**/feature_rules/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "behavior_pack/features/<all>.json": new MinecraftFileType({
        id: "behavior_pack/features/<all>.json",
        displayName: "Features Definition",
        packType: "behavior_pack",
        patterns: ["**/features/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "behavior_pack/functions/<all>.mcfunction": new MinecraftFileType({
        id: "behavior_pack/functions/<all>.mcfunction",
        displayName: "Functions",
        packType: "behavior_pack",
        patterns: ["**/functions/*.mcfunction"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "behavior_pack/functions/tick.json": new MinecraftFileType({
        id: "behavior_pack/functions/tick.json",
        displayName: "Tick Function",
        packType: "behavior_pack",
        patterns: ["**/functions/tick.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "behavior_pack/item_catalog/crafting_item_catalog.json": new MinecraftFileType({
        id: "behavior_pack/item_catalog/crafting_item_catalog.json",
        displayName: "Crafting Item Catalog",
        packType: "behavior_pack",
        patterns: ["**/item_catalog/crafting_item_catalog.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "behavior_pack/items/<all>.json": new MinecraftFileType({
        id: "behavior_pack/items/<all>.json",
        displayName: "Items Definition",
        packType: "behavior_pack",
        patterns: ["**/items/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "behavior_pack/loot_tables/<all>.json": new MinecraftFileType({
        id: "behavior_pack/loot_tables/<all>.json",
        displayName: "Loot Tables",
        packType: "behavior_pack",
        patterns: ["**/loot_tables/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "behavior_pack/manifest.json": new MinecraftFileType({
        id: "behavior_pack/manifest.json",
        displayName: "Behavior Pack Manifest",
        packType: "behavior_pack",
        patterns: ["manifest.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "behavior_pack/pack_icon.png": new MinecraftFileType({
        displayName: "Behavior Pack Icon",
        id: "behavior_pack/pack_icon.png",
        packType: "behavior_pack",
        patterns: ["pack_icon.png"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "behavior_pack/recipes/<all>.json": new MinecraftFileType({
        id: "behavior_pack/recipes/<all>.json",
        displayName: "Recipes",
        packType: "behavior_pack",
        patterns: ["**/recipes/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "behavior_pack/spawn_rules/<all>.json": new MinecraftFileType({
        id: "behavior_pack/spawn_rules/<all>.json",
        displayName: "Spawn Rules",
        packType: "behavior_pack",
        patterns: ["**/spawn_rules/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "behavior_pack/structures/<all>.{mcstructure,nbt}": new MinecraftFileType({
        id: "behavior_pack/structures/<all>.{mcstructure,nbt}",
        displayName: "Structures",
        packType: "behavior_pack",
        patterns: ["**/structures/*.{mcstructure,nbt}"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "behavior_pack/texts/<all>.lang": new MinecraftFileType({
        id: "behavior_pack/texts/<all>.lang",
        displayName: "Language Files",
        packType: "behavior_pack",
        patterns: ["**/texts/*.lang"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "behavior_pack/texts/languages.json": new MinecraftFileType({
        id: "behavior_pack/texts/languages.json",
        displayName: "Languages Definition",
        packType: "behavior_pack",
        patterns: ["**/texts/languages.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "behavior_pack/trading/<all>.json": new MinecraftFileType({
        id: "behavior_pack/trading/<all>.json",
        displayName: "Trading",
        packType: "behavior_pack",
        patterns: ["**/trading/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "behavior_pack/worldgen/processors/<all>.json": new MinecraftFileType({
        id: "behavior_pack/worldgen/processors/<all>.json",
        displayName: "World Generation Processors",
        packType: "behavior_pack",
        patterns: ["**/worldgen/processors/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "behavior_pack/worldgen/structure_sets/<all>.json": new MinecraftFileType({
        id: "behavior_pack/worldgen/structure_sets/<all>.json",
        displayName: "World Generation Structure Sets",
        packType: "behavior_pack",
        patterns: ["**/worldgen/structure_sets/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "behavior_pack/worldgen/structures/<all>.json": new MinecraftFileType({
        id: "behavior_pack/worldgen/structures/<all>.json",
        displayName: "World Generation Structures",
        packType: "behavior_pack",
        patterns: ["**/worldgen/structures/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "behavior_pack/worldgen/template_pools/<all>.json": new MinecraftFileType({
        id: "behavior_pack/worldgen/template_pools/<all>.json",
        displayName: "World Generation Template Pools",
        packType: "behavior_pack",
        patterns: ["**/worldgen/template_pools/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/animation_controllers/<all>.json": new MinecraftFileType({
        id: "resource_pack/animation_controllers/<all>.json",
        displayName: "Resource Animation Controllers",
        packType: "resource_pack",
        patterns: ["**/animation_controllers/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/animations/<all>.json": new MinecraftFileType({
        id: "resource_pack/animations/<all>.json",
        displayName: "Resource Animations",
        packType: "resource_pack",
        patterns: ["**/animations/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/atmospherics/<all>.json": new MinecraftFileType({
        id: "resource_pack/atmospherics/<all>.json",
        displayName: "Atmospherics",
        packType: "resource_pack",
        patterns: ["**/atmospherics/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/attachables/<all>.json": new MinecraftFileType({
        id: "resource_pack/attachables/<all>.json",
        displayName: "Attachables",
        packType: "resource_pack",
        patterns: ["**/attachables/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/biomes/<all>.json": new MinecraftFileType({
        id: "resource_pack/biomes/<all>.json",
        displayName: "Biomes Definition",
        packType: "resource_pack",
        patterns: ["**/biomes/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/biomes_client.json": new MinecraftFileType({
        id: "resource_pack/biomes_client.json",
        displayName: "Biomes Client Definition",
        packType: "resource_pack",
        patterns: ["biomes_client.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/block_culling/<all>.json": new MinecraftFileType({
        id: "resource_pack/block_culling/<all>.json",
        displayName: "Block Culling",
        packType: "resource_pack",
        patterns: ["**/block_culling/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/blocks.json": new MinecraftFileType({
        id: "resource_pack/blocks.json",
        displayName: "Blocks Definition",
        packType: "resource_pack",
        patterns: ["blocks.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/color_grading/<all>.json": new MinecraftFileType({
        id: "resource_pack/color_grading/<all>.json",
        displayName: "Color Grading",
        packType: "resource_pack",
        patterns: ["**/color_grading/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/contents.json": new MinecraftFileType({
        id: "resource_pack/contents.json",
        displayName: "Resource Pack Contents",
        packType: "resource_pack",
        patterns: ["contents.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/credits/credits.json": new MinecraftFileType({
        id: "resource_pack/credits/credits.json",
        displayName: "Credits",
        packType: "resource_pack",
        patterns: ["**/credits/credits.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/entity/<all>.json": new MinecraftFileType({
        id: "resource_pack/entity/<all>.json",
        displayName: "Entity Definition",
        packType: "resource_pack",
        patterns: ["**/entity/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/fogs/<all>.json": new MinecraftFileType({
        id: "resource_pack/fogs/<all>.json",
        displayName: "Fogs",
        packType: "resource_pack",
        patterns: ["**/fogs/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/font/<all>.png": new MinecraftFileType({
        id: "resource_pack/font/<all>.png",
        displayName: "Font PNG Files",
        packType: "resource_pack",
        patterns: ["**/font/*.png"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/font/<all>.ttf": new MinecraftFileType({
        id: "resource_pack/font/<all>.ttf",
        displayName: "Font TTF Files",
        packType: "resource_pack",
        patterns: ["**/font/*.ttf"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/font/emoticons.json": new MinecraftFileType({
        id: "resource_pack/font/emoticons.json",
        displayName: "Emoticons Definition",
        packType: "resource_pack",
        patterns: ["**/font/emoticons.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/font/font_metadata.json": new MinecraftFileType({
        id: "resource_pack/font/font_metadata.json",
        displayName: "Font Metadata",
        packType: "resource_pack",
        patterns: ["**/font/font_metadata.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/items/<all>.json": new MinecraftFileType({
        id: "resource_pack/items/<all>.json",
        displayName: "Items Definition",
        packType: "resource_pack",
        patterns: ["**/items/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/lighting/<all>.json": new MinecraftFileType({
        id: "resource_pack/lighting/<all>.json",
        displayName: "Lighting",
        packType: "resource_pack",
        patterns: ["**/lighting/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/loading_messages.json": new MinecraftFileType({
        id: "resource_pack/loading_messages.json",
        displayName: "Loading Messages",
        packType: "resource_pack",
        patterns: ["loading_messages.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/manifest.json": new MinecraftFileType({
        id: "resource_pack/manifest.json",
        displayName: "Resource Pack Manifest",
        packType: "resource_pack",
        patterns: ["manifest.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/materials/<all>.material": new MinecraftFileType({
        id: "resource_pack/materials/<all>.material",
        displayName: "Materials",
        packType: "resource_pack",
        patterns: ["**/materials/*.material"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/models/<all>.json": new MinecraftFileType({
        id: "resource_pack/models/<all>.json",
        displayName: "Models",
        packType: "resource_pack",
        patterns: ["**/models/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/particles/<all>.json": new MinecraftFileType({
        id: "resource_pack/particles/<all>.json",
        displayName: "Particles",
        packType: "resource_pack",
        patterns: ["**/particles/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/pbr/global.json": new MinecraftFileType({
        id: "resource_pack/pbr/global.json",
        displayName: "PBR Global Settings",
        packType: "resource_pack",
        patterns: ["**/pbr/global.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/render_controllers/<all>.json": new MinecraftFileType({
        id: "resource_pack/render_controllers/<all>.json",
        displayName: "Render Controllers",
        packType: "resource_pack",
        patterns: ["**/render_controllers/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/shadows/global.json": new MinecraftFileType({
        id: "resource_pack/shadows/global.json",
        displayName: "Shadows Global Settings",
        packType: "resource_pack",
        patterns: ["**/shadows/global.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/sounds.json": new MinecraftFileType({
        id: "resource_pack/sounds.json",
        displayName: "Sounds Definition",
        packType: "resource_pack",
        patterns: ["sounds.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/sounds/*.{wav,mp3,ogg,fsb}": new MinecraftFileType({
        id: "resource_pack/sounds/*.{wav,mp3,ogg,fsb}",
        displayName: "Sound Files",
        packType: "resource_pack",
        patterns: ["**/sounds/*.{wav,mp3,ogg,fsb}"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/sounds/music_definitions.json": new MinecraftFileType({
        id: "resource_pack/sounds/music_definitions.json",
        displayName: "Music Definitions",
        packType: "resource_pack",
        patterns: ["**/sounds/music_definitions.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/sounds/sound_definitions.json": new MinecraftFileType({
        id: "resource_pack/sounds/sound_definitions.json",
        displayName: "Sound Definitions",
        packType: "resource_pack",
        patterns: ["**/sounds/sound_definitions.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/splashes.json": new MinecraftFileType({
        id: "resource_pack/splashes.json",
        displayName: "Splashes",
        packType: "resource_pack",
        patterns: ["splashes.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/texts/language_names.json": new MinecraftFileType({
        id: "resource_pack/texts/language_names.json",
        displayName: "Language Names",
        packType: "resource_pack",
        patterns: ["**/texts/language_names.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/texts/languages.json": new MinecraftFileType({
        id: "resource_pack/texts/languages.json",
        displayName: "Languages Definition",
        packType: "resource_pack",
        patterns: ["**/texts/languages.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/textures/*.{tga,png,jpg,jpeg}": new MinecraftFileType({
        id: "resource_pack/textures/*.{tga,png,jpg,jpeg}",
        displayName: "Texture Files",
        packType: "resource_pack",
        patterns: ["**/textures/*.{tga,png,jpg,jpeg}"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/textures/<all>.texture_set.json": new MinecraftFileType({
        id: "resource_pack/textures/<all>.texture_set.json",
        displayName: "Texture Sets",
        packType: "resource_pack",
        patterns: ["**/textures/*.texture_set.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/textures/flipbook_textures.json": new MinecraftFileType({
        id: "resource_pack/textures/flipbook_textures.json",
        displayName: "Flipbook Textures",
        packType: "resource_pack",
        patterns: ["**/textures/flipbook_textures.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/textures/item_texture.json": new MinecraftFileType({
        id: "resource_pack/textures/item_texture.json",
        displayName: "Item Texture Definition",
        packType: "resource_pack",
        patterns: ["**/textures/item_texture.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/textures/terrain_texture.json": new MinecraftFileType({
        id: "resource_pack/textures/terrain_texture.json",
        displayName: "Terrain Texture Definition",
        packType: "resource_pack",
        patterns: ["**/textures/terrain_texture.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/textures/textures_list.json": new MinecraftFileType({
        id: "resource_pack/textures/textures_list.json",
        displayName: "Textures List",
        packType: "resource_pack",
        patterns: ["**/textures/textures_list.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/ui/<all>.json": new MinecraftFileType({
        id: "resource_pack/ui/<all>.json",
        displayName: "UI Definition",
        packType: "resource_pack",
        patterns: ["**/ui/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/ui/_global_variables.json": new MinecraftFileType({
        id: "resource_pack/ui/_global_variables.json",
        displayName: "UI Global Variables",
        packType: "resource_pack",
        patterns: ["**/ui/_global_variables.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/ui/_ui_defs.json": new MinecraftFileType({
        id: "resource_pack/ui/_ui_defs.json",
        displayName: "UI Definitions",
        packType: "resource_pack",
        patterns: ["**/ui/_ui_defs.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    }),
    "resource_pack/water/<all>.json": new MinecraftFileType({
        id: "resource_pack/water/<all>.json",
        displayName: "Water",
        packType: "resource_pack",
        patterns: ["**/water/*.json"],
        excludePatterns: undefined,
        schemaDataUrl: undefined
    })
};