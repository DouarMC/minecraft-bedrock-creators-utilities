import * as fs from "fs";
import * as path from "path";

async function fetchVanillaData(url: string): Promise<string[]> {
    try {
        const response = await fetch(url);
        if (! response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const textData = await response.text();

        const vanillaIds: string[] = [];

        const regex = /=\s*"([^"]+)"/g;
        const matches = textData.matchAll(regex);

        for (const match of matches) {
            vanillaIds.push(match[1]);
        }

        return vanillaIds;
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return [];
    }
}

async function includeVanillaIdentifierToJson() {
    const blocksUrl = "https://unpkg.com/@minecraft/vanilla-data@latest/lib/mojang-block.d.ts";
    const cameraPresetsUrl = "https://unpkg.com/@minecraft/vanilla-data@latest/lib/mojang-cameraPresets.d.ts";
    const cooldownCategoryUrl = "https://unpkg.com/@minecraft/vanilla-data@latest/lib/mojang-cooldownCategory.d.ts";
    const dimensionUrl = "https://unpkg.com/@minecraft/vanilla-data@latest/lib/mojang-dimension.d.ts";
    const effectUrl = "https://unpkg.com/@minecraft/vanilla-data@latest/lib/mojang-effect.d.ts";
    const enchantmentUrl = "https://unpkg.com/@minecraft/vanilla-data@latest/lib/mojang-enchantment.d.ts";
    const entityUrl = "https://unpkg.com/@minecraft/vanilla-data@latest/lib/mojang-entity.d.ts";
    const structureUrl = "https://unpkg.com/@minecraft/vanilla-data@latest/lib/mojang-feature.d.ts";
    const itemsUrl = "https://unpkg.com/@minecraft/vanilla-data@latest/lib/mojang-item.d.ts";

    const vanillaMinecraftIdentifiers = {
        "VANILLA_BLOCK_IDS": await fetchVanillaData(blocksUrl),
        "VANILLA_CAMERA_PRESET_IDS": await fetchVanillaData(cameraPresetsUrl),
        "VANILLA_COOLDOWN_CATEGORY_IDS": await fetchVanillaData(cooldownCategoryUrl),
        "VANILLA_DIMENSION_IDS": await fetchVanillaData(dimensionUrl),
        "VANILLA_EFFECT_IDS": await fetchVanillaData(effectUrl),
        "VANILLA_ENCHANTMENT_IDS": await fetchVanillaData(enchantmentUrl),
        "VANILLA_ENTITY_IDS": await fetchVanillaData(entityUrl),
        "VANILLA_STRUCTURE_IDS": await fetchVanillaData(structureUrl),
        "VANILLA_ITEM_IDS": await fetchVanillaData(itemsUrl),
        "VANILLA_ITEM_TAGS": [
            "minecraft:arrow",
            "minecraft:banner",
            "minecraft:boat",
            "minecraft:boats",
            "minecraft:bookshelf_books",
            "minecraft:chainmail_tier",
            "minecraft:chest_boat",
            "minecraft:coals",
            "minecraft:is_cooked",
            "minecraft:crimson_stems",
            "minecraft:decorated_pot_sherds",
            "minecraft:diamond_tier",
            "minecraft:digger",
            "minecraft:door",
            "minecraft:is_fish",
            "minecraft:is_food",
            "minecraft:golden_tier",
            "minecraft:hanging_actor",
            "minecraft:hanging_sign",
            "minecraft:is_axe",
            "minecraft:is_hoe",
            "minecraft:horse_armor",
            "minecraft:iron_tier",
            "minecraft:leather_tier",
            "minecraft:lectern_books",
            "minecraft:logs",
            "minecraft:logs_that_burn",
            "minecraft:mangrove_logs",
            "minecraft:is_meat",
            "minecraft:is_minecart",
            "minecraft:music_disc",
            "minecraft:netherite_tier",
            "minecraft:is_pickaxe",
            "minecraft:piglin_loved",
            "minecraft:piglin_repellents",
            "minecraft:planks",
            "minecraft:sand",
            "minecraft:is_shovel",
            "minecraft:sign",
            "minecraft:soul_fire_base_blocks",
            "minecraft:spawn_egg",
            "minecraft:stone_bricks",
            "minecraft:stone_crafting_materials",
            "minecraft:stone_tier",
            "minecraft:stone_tool_materials",
            "minecraft:is_sword",
            "minecraft:is_tool",
            "minecraft:is_trident",
            "minecraft:trim_materials",
            "minecraft:trim_templates",
            "minecraft:trimmable_armors",
            "minecraft:transformable_items",
            "minecraft:transform_materials",
            "minecraft:transform_templates",
            "minecraft:vibration_damper",
            "minecraft:warped_stems",
            "minecraft:wooden_slabs",
            "minecraft:wooden_tier",
            "minecraft:wool",
            "minecraft:is_shears",
            "minecraft:is_armor",
            "minecraft:metal_nuggets",
            "minecraft:copper_tier",
            "minecraft:egg",
            "minecraft:harness",
            "minecraft:nautilus_armor",
            "minecraft:is_spear",
            "minecraft:sulfur_cube_archetype_bouncy",
            "minecraft:sulfur_cube_archetype_fast_flat",
            "minecraft:sulfur_cube_archetype_fast_sliding",
            "minecraft:sulfur_cube_archetype_high_resistance",
            "minecraft:sulfur_cube_archetype_light",
            "minecraft:sulfur_cube_archetype_regular",
            "minecraft:sulfur_cube_archetype_slow_flat",
            "minecraft:sulfur_cube_archetype_slow_sliding",
            "minecraft:sulfur_cube_archetype_sticky"
        ],
        "VANILLA_CULLING_LAYER_IDS": [
            "minecraft:culling_layer.undefined",
            "minecraft:culling_layer.leaves",
        ],
        "VANILLA_MODEL_IDS": [
            "minecraft:geometry.full_block",
            "minecraft:geometry.cross",
            "minecraft:geometry.full_block_v1"
        ],
        "VANILLA_VOXEL_SHAPE_IDS": [
            "minecraft:empty",
            "minecraft:unit_cube"
        ],
        "VANILLA_BLOCK_TAGS": [
            "minecraft:acacia",
            "minecraft:birch",
            "minecraft:cornerable_stairs",
            "minecraft:crop",
            "minecraft:dark_oak",
            "minecraft:diamond_pick_diggable",
            "minecraft:diamond_tier_destructible",
            "minecraft:dirt",
            "minecraft:fertilize_area",
            "minecraft:grass",
            "minecraft:gravel",
            "minecraft:has_fence_connections",
            "minecraft:iron_pick_diggable",
            "minecraft:iron_tier_destructible",
            "minecraft:is_axe_item_destructible",
            "minecraft:is_hoe_item_destructible",
            "minecraft:is_pickaxe_item_destructible",
            "minecraft:is_shears_item_destructible",
            "minecraft:is_shovel_item_destructible",
            "minecraft:is_sword_item_destructible",
            "minecraft:jungle",
            "minecraft:log",
            "minecraft:metal",
            "minecraft:mob_spawner",
            "minecraft:not_feature_replaceable",
            "minecraft:oak",
            "minecraft:one_way_collidable",
            "minecraft:plant",
            "minecraft:pumpkin",
            "minecraft:rail",
            "minecraft:sand",
            "minecraft:snow",
            "minecraft:spruce",
            "minecraft:stone",
            "minecraft:stone_pick_diggable",
            "minecraft:stone_tier_destructible",
            "minecraft:text_sign",
            "minecraft:trapdoors",
            "minecraft:water",
            "minecraft:wood"
        ]
    };

    const outputPath = path.join(__dirname, "..", "dist", "minecraftVanillaIdentifiers", "stable.json");

    fs.writeFileSync(outputPath, JSON.stringify(vanillaMinecraftIdentifiers, null, 4), 'utf-8');
}

includeVanillaIdentifierToJson();