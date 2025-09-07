import { MinecraftFileTypeKey } from "../../../core/minecraft/fileTypes/minecraftFileRegistry";
import { VersionedSchema } from "../model/versioning";

import { aimAssistCategoriesSchemaTypeBP } from "../minecraftSchemas/behavior_pack/aim_assist/categories/categories";
import { aimAssistPresetSchemaTypeBP } from "../minecraftSchemas/behavior_pack/aim_assist/presets/_aim_assist_preset";
import { animationControllersSchemaTypeBP } from "../minecraftSchemas/behavior_pack/animation_controllers/_animation_controllers";
import { animationsSchemaTypeBP } from "../minecraftSchemas/behavior_pack/animations/_animations";
import { biomeSchemaTypeBP } from "../minecraftSchemas/behavior_pack/biomes/_biome";
import { blockSchemaTypeBP } from "../minecraftSchemas/behavior_pack/blocks/_block";
import { cameraPresetSchemaTypeBP } from "../minecraftSchemas/behavior_pack/cameras/presets/_camera_preset";
import { dialogueSchemaTypeBP } from "../minecraftSchemas/behavior_pack/dialogue/_dialogue";
import { dimensionSchemaTypeBP } from "../minecraftSchemas/behavior_pack/dimensions/_dimension";
import { entitySchemaTypeBP } from "../minecraftSchemas/behavior_pack/entities/_entity";
import { featureRulesSchemaTypeBP } from "../minecraftSchemas/behavior_pack/feature_rules/_feature_rules";
import { featureSchemaTypeBP } from "../minecraftSchemas/behavior_pack/features/_feature";
import { tickSchemaTypeBP } from "../minecraftSchemas/behavior_pack/functions/tick";
import { craftingItemCatalogSchemaTypeBP } from "../minecraftSchemas/behavior_pack/item_catalog/crafting_item_catalog";
import { itemSchemaTypeBP } from "../minecraftSchemas/behavior_pack/items/_item";
import { lootTableSchemaTypeBP } from "../minecraftSchemas/behavior_pack/loot_tables/_loot_table";
import { recipeSchemaTypeBP } from "../minecraftSchemas/behavior_pack/recipes/_recipe";
import { spawnRulesSchemaTypeBP } from "../minecraftSchemas/behavior_pack/spawn_rules/_spawn_rules";
import { languagesSchemaTypeBP } from "../minecraftSchemas/behavior_pack/texts/languages";
import { tradingSchemaTypeBP } from "../minecraftSchemas/behavior_pack/trading/_trading";
import { processorSchemaTypeBP } from "../minecraftSchemas/behavior_pack/worldgen/processors/_processor";
import { structureSetSchemaTypeBP } from "../minecraftSchemas/behavior_pack/worldgen/structure_sets/_structure_set";
import { jigsawStructureSchemaTypeBP } from "../minecraftSchemas/behavior_pack/worldgen/structures/_jigsaw_structure";
import { templatePoolSchemaTypeBP } from "../minecraftSchemas/behavior_pack/worldgen/template_pools/_template_pool";
import { contentsSchemaTypeBP } from "../minecraftSchemas/behavior_pack/contents";
import { manifestSchemaTypeBP } from "../minecraftSchemas/behavior_pack/manifest";

import { animationControllersSchemaTypeRP } from "../minecraftSchemas/resource_pack/animation_controllers/_animation_controllers";
import { animationsSchemaTypeRP } from "../minecraftSchemas/resource_pack/animations/_animations";
import { atmosphericSettingsSchemaTypeRP } from "../minecraftSchemas/resource_pack/atmospherics/_atmospheric_settings";
import { attachableSchemaTypeRP } from "../minecraftSchemas/resource_pack/attachables/_attachable";
import { clientBiomeSchemaTypeRP } from "../minecraftSchemas/resource_pack/biomes/_client_biome";
import { blockCullingRulesSchemaTypeRP } from "../minecraftSchemas/resource_pack/block_culling/_block_culling_rules";
import { colorGradingSettingsSchemaTypeRP } from "../minecraftSchemas/resource_pack/color_grading/_color_grading_settings";
import { creditsSchemaTypeRP } from "../minecraftSchemas/resource_pack/credits/credits";
import { clientEntitySchemaTypeRP } from "../minecraftSchemas/resource_pack/entity/_client_entity";
import { fogSettingsSchemaTypeRP } from "../minecraftSchemas/resource_pack/fogs/_fog_settings";
import { itemSchemaTypeRP } from "../minecraftSchemas/resource_pack/items/_item";
import { lightingSettingsSchemaTypeRP } from "../minecraftSchemas/resource_pack/lighting/_lighting_settings";
import { geometrySchemaTypeRP } from "../minecraftSchemas/resource_pack/models/_geometry";
import { particleEffectSchemaTypeRP } from "../minecraftSchemas/resource_pack/particles/_particle_effect";
import { pbrFallbackSettingsSchemaTypeRP } from "../minecraftSchemas/resource_pack/pbr/global";
import { renderControllerSchemaTypeRP } from "../minecraftSchemas/resource_pack/render_controllers/_render_controllers";
import { shadowSettingsSchemaTypeRP } from "../minecraftSchemas/resource_pack/shadows/global";
import { musicDefinitionsSchemaTypeRP } from "../minecraftSchemas/resource_pack/sounds/music_definitions";
import { soundDefinitionsSchemaTypeRP } from "../minecraftSchemas/resource_pack/sounds/sound_definitions";
import { languagesNamesSchemaTypeRP } from "../minecraftSchemas/resource_pack/texts/languages_names";
import { languagesSchemaTypeRP } from "../minecraftSchemas/resource_pack/texts/languages";
import { textureSetSchemaTypeRP } from "../minecraftSchemas/resource_pack/textures/_texture_set";
import { flipbookTexturesSchemaTypeRP } from "../minecraftSchemas/resource_pack/textures/flipbook_textures";
import { itemTextureSchemaTypeRP } from "../minecraftSchemas/resource_pack/textures/item_texture";
import { terrainTextureSchemaTypeRP } from "../minecraftSchemas/resource_pack/textures/terrain_texture";
import { texturesListSchemaTypeRP } from "../minecraftSchemas/resource_pack/textures/textures_list";
import { _globalVariablesSchemaTypeRP } from "../minecraftSchemas/resource_pack/ui/_global_variables";
import { _uiDefsSchemaTypeRP } from "../minecraftSchemas/resource_pack/ui/_ui_defs";
import { uiElementSchemaTypeRP } from "../minecraftSchemas/resource_pack/ui/_ui_element";
import { waterSettingsSchemaTypeRP } from "../minecraftSchemas/resource_pack/water/water";
import { biomesClientSchemaType } from "../minecraftSchemas/resource_pack/biomes_client";
import { blocksSchemaTypeRP } from "../minecraftSchemas/resource_pack/blocks";
import { contentsSchemaTypeRP } from "../minecraftSchemas/resource_pack/contents";
import { loadingMessagesSchemaTypeRP } from "../minecraftSchemas/resource_pack/loading_messages";
import { manifestSchemaTypeRP } from "../minecraftSchemas/resource_pack/manifest";
import { soundsSchemaTypeRP } from "../minecraftSchemas/resource_pack/sounds";
import { splashesSchemaTypeRP } from "../minecraftSchemas/resource_pack/splashes";

export const minecraftSchemaRegistry: Partial<Record<MinecraftFileTypeKey, VersionedSchema>> = {
    "behavior_pack/aim_assist/categories/categories.json": aimAssistCategoriesSchemaTypeBP,
    "behavior_pack/aim_assist/presets/<all>.json": aimAssistPresetSchemaTypeBP,
    "behavior_pack/animation_controllers/<all>.json": animationControllersSchemaTypeBP,
    "behavior_pack/animations/<all>.json": animationsSchemaTypeBP,
    "behavior_pack/biomes/<all>.json": biomeSchemaTypeBP,
    "behavior_pack/blocks/<all>.json": blockSchemaTypeBP,
    "behavior_pack/cameras/presets/<all>.json": cameraPresetSchemaTypeBP,
    "behavior_pack/contents.json": contentsSchemaTypeBP,
    "behavior_pack/dialogue/<all>.json": dialogueSchemaTypeBP,
    "behavior_pack/dimensions/<all>.json": dimensionSchemaTypeBP,
    "behavior_pack/entities/<all>.json": entitySchemaTypeBP,
    "behavior_pack/feature_rules/<all>.json": featureRulesSchemaTypeBP,
    "behavior_pack/features/<all>.json": featureSchemaTypeBP,
    "behavior_pack/functions/tick.json": tickSchemaTypeBP,
    "behavior_pack/item_catalog/crafting_item_catalog.json": craftingItemCatalogSchemaTypeBP,
    "behavior_pack/items/<all>.json": itemSchemaTypeBP,
    "behavior_pack/loot_tables/<all>.json": lootTableSchemaTypeBP,
    "behavior_pack/manifest.json": manifestSchemaTypeBP,
    "behavior_pack/recipes/<all>.json": recipeSchemaTypeBP,
    "behavior_pack/spawn_rules/<all>.json": spawnRulesSchemaTypeBP,
    "behavior_pack/texts/languages.json": languagesSchemaTypeBP,
    "behavior_pack/trading/<all>.json": tradingSchemaTypeBP,
    "behavior_pack/worldgen/processors/<all>.json": processorSchemaTypeBP,
    "behavior_pack/worldgen/structure_sets/<all>.json": structureSetSchemaTypeBP,
    "behavior_pack/worldgen/structures/<all>.json": jigsawStructureSchemaTypeBP,
    "behavior_pack/worldgen/template_pools/<all>.json": templatePoolSchemaTypeBP,
    "resource_pack/animation_controllers/<all>.json": animationControllersSchemaTypeRP,
    "resource_pack/animations/<all>.json": animationsSchemaTypeRP,
    "resource_pack/atmospherics/<all>.json": atmosphericSettingsSchemaTypeRP,
    "resource_pack/attachables/<all>.json": attachableSchemaTypeRP,
    "resource_pack/biomes/<all>.json": clientBiomeSchemaTypeRP,
    "resource_pack/biomes_client.json": biomesClientSchemaType,
    "resource_pack/block_culling/<all>.json": blockCullingRulesSchemaTypeRP,
    "resource_pack/blocks.json": blocksSchemaTypeRP,
    "resource_pack/color_grading/<all>.json": colorGradingSettingsSchemaTypeRP,
    "resource_pack/contents.json": contentsSchemaTypeRP,
    "resource_pack/credits/credits.json": creditsSchemaTypeRP,
    "resource_pack/entity/<all>.json": clientEntitySchemaTypeRP,
    "resource_pack/fogs/<all>.json": fogSettingsSchemaTypeRP,
    "resource_pack/items/<all>.json": itemSchemaTypeRP,
    "resource_pack/lighting/<all>.json": lightingSettingsSchemaTypeRP,
    "resource_pack/loading_messages.json": loadingMessagesSchemaTypeRP,
    "resource_pack/manifest.json": manifestSchemaTypeRP,
    "resource_pack/models/<all>.json": geometrySchemaTypeRP,
    "resource_pack/particles/<all>.json": particleEffectSchemaTypeRP,
    "resource_pack/pbr/global.json": pbrFallbackSettingsSchemaTypeRP,
    "resource_pack/render_controllers/<all>.json": renderControllerSchemaTypeRP,
    "resource_pack/shadows/global.json": shadowSettingsSchemaTypeRP,
    "resource_pack/sounds.json": soundsSchemaTypeRP,
    "resource_pack/sounds/music_definitions.json": musicDefinitionsSchemaTypeRP,
    "resource_pack/sounds/sound_definitions.json": soundDefinitionsSchemaTypeRP,
    "resource_pack/splashes.json": splashesSchemaTypeRP,
    "resource_pack/texts/languages.json": languagesSchemaTypeRP,
    "resource_pack/texts/language_names.json": languagesNamesSchemaTypeRP,
    "resource_pack/textures/<all>.texture_set.json": textureSetSchemaTypeRP,
    "resource_pack/textures/flipbook_textures.json": flipbookTexturesSchemaTypeRP,
    "resource_pack/textures/item_texture.json": itemTextureSchemaTypeRP,
    "resource_pack/textures/terrain_texture.json": terrainTextureSchemaTypeRP,
    "resource_pack/textures/textures_list.json": texturesListSchemaTypeRP,
    "resource_pack/ui/<all>.json": uiElementSchemaTypeRP,
    "resource_pack/ui/_global_variables.json": _globalVariablesSchemaTypeRP,
    "resource_pack/ui/_ui_defs.json": _uiDefsSchemaTypeRP,
    "resource_pack/water/<all>.json": waterSettingsSchemaTypeRP
};