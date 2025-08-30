export interface MinecraftFileTypeDefinition {
    packType: "behavior_pack" | "resource_pack" | "skin_pack" | "world_template";
    pathFolder: string;
    subFolder: boolean;
    fileNames: string[];
    fileExtension: string[];
    excludeFileNames: string[];
    searchInDefinitionsFolder?: boolean; // Par défaut false
}

export const minecraftFileTypes = {
    "behavior_pack/aim_assist/categories/categories.json": {
        packType: "behavior_pack",
        pathFolder: "aim_assist/categories",
        subFolder: false,
        fileNames: ["categories"],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "behavior_pack/aim_assist/presets/<all>.json": {
        packType: "behavior_pack",
        pathFolder: "aim_assist/presets",
        subFolder: true,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "behavior_pack/animation_controllers/<all>.json": {
        packType: "behavior_pack",
        pathFolder: "animation_controllers",
        subFolder: true,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "behavior_pack/animations/<all>.json": {
        packType: "behavior_pack",
        pathFolder: "animations",
        subFolder: true,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "behavior_pack/biomes/<all>.json": {
        packType: "behavior_pack",
        pathFolder: "biomes",
        subFolder: true,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "behavior_pack/blocks/<all>.json": {
        packType: "behavior_pack",
        pathFolder: "blocks",
        subFolder: true,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "behavior_pack/cameras/presets/<all>.json": {
        packType: "behavior_pack",
        pathFolder: "cameras/presets",
        subFolder: true,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "behavior_pack/dialogue/<all>.json": {
        packType: "behavior_pack",
        pathFolder: "dialogue",
        subFolder: true,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "behavior_pack/dimensions/<all>.json": {
        packType: "behavior_pack",
        pathFolder: "dimensions",
        subFolder: true,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "behavior_pack/entities/<all>.json": {
        packType: "behavior_pack",
        pathFolder: "entities",
        subFolder: true,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "behavior_pack/feature_rules/<all>.json": {
        packType: "behavior_pack",
        pathFolder: "feature_rules",
        subFolder: true,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: [],
        searchInDefinitionsFolder: true
    },
    "behavior_pack/features/<all>.json": {
        packType: "behavior_pack",
        pathFolder: "features",
        subFolder: true,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: [],
        searchInDefinitionsFolder: true
    },
    "behavior_pack/functions/<all>.mcfunction": {
        packType: "behavior_pack",
        pathFolder: "functions",
        subFolder: true,
        fileNames: [],
        fileExtension: [".mcfunction"],
        excludeFileNames: []
    },
    "behavior_pack/functions/tick.json": {
        packType: "behavior_pack",
        pathFolder: "functions",
        subFolder: false,
        fileNames: ["tick"],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "behavior_pack/item_catalog/crafting_item_catalog.json": {
        packType: "behavior_pack",
        pathFolder: "item_catalog",
        subFolder: false,
        fileNames: ["crafting_item_catalog"],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "behavior_pack/items/<all>.json": {
        packType: "behavior_pack",
        pathFolder: "items",
        subFolder: true,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "behavior_pack/loot_tables/<all>.json": {
        packType: "behavior_pack",
        pathFolder: "loot_tables",
        subFolder: true,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "behavior_pack/recipes/<all>.json": {
        packType: "behavior_pack",
        pathFolder: "recipes",
        subFolder: true,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "behavior_pack/spawn_rules/<all>.json": {
        packType: "behavior_pack",
        pathFolder: "spawn_rules",
        subFolder: true,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "behavior_pack/structures/<all>.{mcstructure,nbt}": {
        packType: "behavior_pack",
        pathFolder: "structures",
        subFolder: true,
        fileNames: [],
        fileExtension: [".mcstructure", ".nbt"],
        excludeFileNames: []
    },
    "behavior_pack/texts/<all>.lang": {
        packType: "behavior_pack",
        pathFolder: "texts",
        subFolder: false,
        fileNames: [],
        fileExtension: [".lang"],
        excludeFileNames: []
    },
    "behavior_pack/texts/languages.json": {
        packType: "behavior_pack",
        pathFolder: "texts",
        subFolder: false,
        fileNames: ["languages"],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "behavior_pack/trading/<all>.json": {
        packType: "behavior_pack",
        pathFolder: "trading",
        subFolder: true,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "behavior_pack/worldgen/processors/<all>.json": {
        packType: "behavior_pack",
        pathFolder: "worldgen/processors",
        subFolder: false,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "behavior_pack/worldgen/structure_sets/<all>.json": {
        packType: "behavior_pack",
        pathFolder: "worldgen/structure_sets",
        subFolder: false,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "behavior_pack/worldgen/structures/<all>.json": {
        packType: "behavior_pack",
        pathFolder: "worldgen/structures",
        subFolder: false,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "behavior_pack/worldgen/template_pools/<all>.json": {
        packType: "behavior_pack",
        pathFolder: "worldgen/template_pools",
        subFolder: false,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "behavior_pack/contents.json": {
        packType: "behavior_pack",
        pathFolder: "",
        subFolder: false,
        fileNames: ["contents"],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "behavior_pack/manifest.json": {
        packType: "behavior_pack",
        pathFolder: "",
        subFolder: false,
        fileNames: ["manifest"],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "behavior_pack/pack_icon.png": {
        packType: "behavior_pack",
        pathFolder: "",
        subFolder: false,
        fileNames: ["pack_icon"],
        fileExtension: [".png"],
        excludeFileNames: []
    },
    "resource_pack/animation_controllers/<all>.json": {
        packType: "resource_pack",
        pathFolder: "animation_controllers",
        subFolder: true,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/animations/<all>.json": {
        packType: "resource_pack",
        pathFolder: "animations",
        subFolder: true,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/atmospherics/<all>.json": {
        packType: "resource_pack",
        pathFolder: "atmospherics",
        subFolder: true,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/attachables/<all>.json": {
        packType: "resource_pack",
        pathFolder: "attachables",
        subFolder: true,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: [],
        searchInDefinitionsFolder: true
    },
    "resource_pack/biomes/<all>.json": {
        packType: "resource_pack",
        pathFolder: "biomes",
        subFolder: true,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/block_culling/<all>.json": {
        packType: "resource_pack",
        pathFolder: "block_culling",
        subFolder: true,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/color_grading/<all>.json": {
        packType: "resource_pack",
        pathFolder: "color_grading",
        subFolder: true,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/credits/credits.json": {
        packType: "resource_pack",
        pathFolder: "credits",
        subFolder: false,
        fileNames: ["credits"],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/entity/<all>.json": {
        packType: "resource_pack",
        pathFolder: "entity",
        subFolder: true,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/fogs/<all>.json": {
        packType: "resource_pack",
        pathFolder: "fogs",
        subFolder: true,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/font/emoticons.json": {
        packType: "resource_pack",
        pathFolder: "font",
        subFolder: false,
        fileNames: ["emoticons"],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/font/font_metadata.json": {
        packType: "resource_pack",
        pathFolder: "font",
        subFolder: false,
        fileNames: ["font_metadata"],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/font/<all>.png": {
        packType: "resource_pack",
        pathFolder: "font",
        subFolder: false,
        fileNames: [],
        fileExtension: [".png"],
        excludeFileNames: []
    },
    "resource_pack/font/<all>.ttf": {
        packType: "resource_pack",
        pathFolder: "font",
        subFolder: false,
        fileNames: [],
        fileExtension: [".ttf"],
        excludeFileNames: []
    },
    "resource_pack/items/<all>.json": {
        packType: "resource_pack",
        pathFolder: "items",
        subFolder: true,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/lighting/<all>.json": {
        packType: "resource_pack",
        pathFolder: "lighting",
        subFolder: true,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/materials/<all>.material": {
        packType: "resource_pack",
        pathFolder: "materials",
        subFolder: true,
        fileNames: [],
        fileExtension: [".material"],
        excludeFileNames: []
    },
    "resource_pack/models/<all>.json": {
        packType: "resource_pack",
        pathFolder: "models",
        subFolder: true,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/particles/<all>.json": {
        packType: "resource_pack",
        pathFolder: "particles",
        subFolder: true,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/pbr/global.json": {
        packType: "resource_pack",
        pathFolder: "pbr",
        subFolder: false,
        fileNames: ["global"],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/render_controllers/<all>.json": {
        packType: "resource_pack",
        pathFolder: "render_controllers",
        subFolder: true,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/shadows/global.json": {
        packType: "resource_pack",
        pathFolder: "shadows",
        subFolder: false,
        fileNames: ["global"],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/sounds/*.{wav,mp3,ogg,fsb}": {
        packType: "resource_pack",
        pathFolder: "sounds",
        subFolder: false,
        fileNames: [],
        fileExtension: [".wav", ".mp3", ".ogg", ".fsb"],
        excludeFileNames: []
    },
    "resource_pack/sounds/music_definitions.json": {
        packType: "resource_pack",
        pathFolder: "sounds",
        subFolder: false,
        fileNames: ["music_definitions"],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/sounds/sound_definitions.json": {
        packType: "resource_pack",
        pathFolder: "sounds",
        subFolder: false,
        fileNames: ["sound_definitions"],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/texts/language_names.json": {
        packType: "resource_pack",
        pathFolder: "texts",
        subFolder: false,
        fileNames: ["language_names"],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/texts/languages.json": {
        packType: "resource_pack",
        pathFolder: "texts",
        subFolder: false,
        fileNames: ["languages"],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/textures/<all>.texture_set.json": {
        packType: "resource_pack",
        pathFolder: "textures",
        subFolder: true,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: ["flipbook_textures", "item_texture", "terrain_texture", "textures_list"]
    },
    "resource_pack/textures/flipbook_textures.json": {
        packType: "resource_pack",
        pathFolder: "textures",
        subFolder: false,
        fileNames: ["flipbook_textures"],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/textures/item_texture.json": {
        packType: "resource_pack",
        pathFolder: "textures",
        subFolder: false,
        fileNames: ["item_texture"],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/textures/terrain_texture.json": {
        packType: "resource_pack",
        pathFolder: "textures",
        subFolder: false,
        fileNames: ["terrain_texture"],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/textures/textures_list.json": {
        packType: "resource_pack",
        pathFolder: "textures",
        subFolder: false,
        fileNames: ["textures_list"],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/textures/*.{tga,png,jpg,jpeg}": {
        packType: "resource_pack",
        pathFolder: "textures",
        subFolder: true,
        fileNames: [],
        fileExtension: [".tga", ".png", ".jpg", ".jpeg"],
        excludeFileNames: []
    },
    "resource_pack/ui/_global_variables.json": {
        packType: "resource_pack",
        pathFolder: "ui",
        subFolder: false,
        fileNames: ["_global_variables"],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/ui/_ui_defs.json": {
        packType: "resource_pack",
        pathFolder: "ui",
        subFolder: false,
        fileNames: ["_ui_defs"],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/ui/<all>.json": {
        packType: "resource_pack",
        pathFolder: "ui",
        subFolder: true,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: ["_global_variables", "_ui_defs"]
    },
    "resource_pack/water/<all>.json": {
        packType: "resource_pack",
        pathFolder: "water",
        subFolder: false,
        fileNames: [],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/biomes_client.json": {
        packType: "resource_pack",
        pathFolder: "",
        subFolder: false,
        fileNames: ["biomes_client"],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/blocks.json": {
        packType: "resource_pack",
        pathFolder: "",
        subFolder: false,
        fileNames: ["blocks"],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/contents.json": {
        packType: "resource_pack",
        pathFolder: "",
        subFolder: false,
        fileNames: ["contents"],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/loading_messages.json": {
        packType: "resource_pack",
        pathFolder: "",
        subFolder: false,
        fileNames: ["loading_messages"],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/manifest.json": {
        packType: "resource_pack",
        pathFolder: "",
        subFolder: false,
        fileNames: ["manifest"],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/sounds.json": {
        packType: "resource_pack",
        pathFolder: "",
        subFolder: false,
        fileNames: ["sounds"],
        fileExtension: [".json"],
        excludeFileNames: []
    },
    "resource_pack/splashes.json": {
        packType: "resource_pack",
        pathFolder: "",
        subFolder: false,
        fileNames: ["splashes"],
        fileExtension: [".json"],
        excludeFileNames: []
    }
} satisfies Record<string, MinecraftFileTypeDefinition>;