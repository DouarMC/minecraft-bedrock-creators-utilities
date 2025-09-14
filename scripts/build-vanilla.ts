import * as fs from "fs/promises";
import * as path from "path";

import { VANILLA_BLOCK_IDS, FULL_BLOCK_MODEL_ID, VANILLA_COOLDOWN_CATEGORY_IDS, VANILLA_CULLING_LAYER_IDS, VANILLA_DIMENSION_IDS, VANILLA_EFFECT_IDS, VANILLA_ENCHANTMENT_IDS, VANILLA_ENTITY_IDS, VANILLA_ITEM_IDS, VANILLA_ITEM_TAGS, VANILLA_STRUCTURE_IDS } from "../data/vanillaMinecraftIdentifiers";

async function buildVanillaIdentifierJson() {
    const outDir = path.resolve(__dirname, "../webdata/vanilla");
    await fs.mkdir(outDir, { recursive: true });

    const data = {
        VANILLA_BLOCK_IDS: VANILLA_BLOCK_IDS,
        FULL_BLOCK_MODEL_ID: FULL_BLOCK_MODEL_ID,
        VANILLA_COOLDOWN_CATEGORY_IDS: VANILLA_COOLDOWN_CATEGORY_IDS,
        VANILLA_CULLING_LAYER_IDS: VANILLA_CULLING_LAYER_IDS,
        VANILLA_DIMENSION_IDS: VANILLA_DIMENSION_IDS,
        VANILLA_EFFECT_IDS: VANILLA_EFFECT_IDS,
        VANILLA_ENCHANTMENT_IDS: VANILLA_ENCHANTMENT_IDS,
        VANILLA_ENTITY_IDS: VANILLA_ENTITY_IDS,
        VANILLA_ITEM_IDS: VANILLA_ITEM_IDS,
        VANILLA_ITEM_TAGS: VANILLA_ITEM_TAGS,
        VANILLA_STRUCTURE_IDS: VANILLA_STRUCTURE_IDS
    };

    const outPath = path.join(outDir, "vanilla_identifiers.json");
    await fs.writeFile(outPath, JSON.stringify(data, null, 2), "utf-8");

    console.log(`Wrote vanilla identifiers to ${outPath}`);
}

buildVanillaIdentifierJson().catch(err => {
    console.error("Error building vanilla identifier JSON:", err);
    process.exit(1);
});