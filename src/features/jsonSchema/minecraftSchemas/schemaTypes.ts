import { SchemaType } from "../../../types/schema"; 

import { aimAssistCategoriesSchemaTypeBP } from "./behavior_pack/aim_assist/categories/categories"; 
import { aimAssistPresetSchemaTypeBP } from "./behavior_pack/aim_assist/presets/_aim_assist_preset"; 
import { animationControllersSchemaTypeBP } from "./behavior_pack/animation_controllers/_animation_controllers"; 
import { animationsSchemaTypeBP } from "./behavior_pack/animations/_animations"; 
import { biomeSchemaTypeBP } from "./behavior_pack/biomes/_biome"; 
import { blockSchemaTypeBP } from "./behavior_pack/blocks/_block";
import { cameraPresetSchemaTypeBP } from "./behavior_pack/cameras/presets/_camera_preset";
import { dialogueSchemaTypeBP } from "./behavior_pack/dialogue/_dialogue";
import { dimensionSchemaTypeBP } from "./behavior_pack/dimensions/_dimension";
import { entitySchemaTypeBP } from "./behavior_pack/entities/_entity";
import { featureRulesSchemaTypeBP } from "./behavior_pack/feature_rules/_feature_rules";
import { featureSchemaTypeBP } from "./behavior_pack/features/_feature";
import { itemSchemaTypeBP } from "./behavior_pack/items/_item";
import { craftingItemCatalogSchemaTypeBP } from "./behavior_pack/item_catalog/crafting_item_catalog";
import { manifestSchemaTypeBP } from "./behavior_pack/manifest";
import { tickSchemaTypeBP } from "./behavior_pack/functions/tick";
import { lootTableSchemaTypeBP } from "./behavior_pack/loot_tables/_loot_table";
import { recipeSchemaTypeBP } from "./behavior_pack/recipes/_recipe";
import { spawnRulesSchemaTypeBP } from "./behavior_pack/spawn_rules/_spawn_rules";
import { languagesSchemaTypeBP } from "./behavior_pack/texts/languages";
import { tradingSchemaTypeBP } from "./behavior_pack/trading/_trading";
import { jigsawStructureSchemaTypeBP } from "./behavior_pack/worldgen/structures/_jigsaw_structure";
import { processorSchemaTypeBP } from "./behavior_pack/worldgen/processors/_processor";
import { structureSetSchemaTypeBP } from "./behavior_pack/worldgen/structure_sets/_structure_set";
import { templatePoolSchemaTypeBP } from "./behavior_pack/worldgen/template_pools/_template_pool";
import { contentsSchemaTypeBP } from "./behavior_pack/contents";
import { animationControllersSchemaTypeRP } from "./resource_pack/animation_controllers/_animation_controllers";
import { animationsSchemaTypeRP } from "./resource_pack/animations/_animations";
import { atmosphericSettingsSchemaTypeRP } from "./resource_pack/atmospherics/_atmospheric_settings";
import { attachableSchemaTypeRP } from "./resource_pack/attachables/_attachable";
import { clientBiomeSchemaTypeRP } from "./resource_pack/biomes/_client_biome";
import { blockCullingRulesSchemaTypeRP } from "./resource_pack/block_culling/_block_culling_rules";
import { colorGradingSettingsSchemaTypeRP } from "./resource_pack/color_grading/_color_grading_settings";
import { creditsSchemaTypeRP } from "./resource_pack/credits/credits";
import { clientEntitySchemaTypeRP } from "./resource_pack/entity/_client_entity";
import { fogSettingsSchemaTypeRP } from "./resource_pack/fogs/_fog_settings";
import { itemSchemaTypeRP } from "./resource_pack/items/_item";
import { lightingSettingsSchemaTypeRP } from "./resource_pack/lighting/_lighting_settings";
import { geometrySchemaTypeRP } from "./resource_pack/models/_geometry";
import { particleEffectSchemaTypeRP } from "./resource_pack/particles/_particle_effect";
import { pbrFallbackSettingsSchemaTypeRP } from "./resource_pack/pbr/global";
import { renderControllerSchemaTypeRP } from "./resource_pack/render_controllers/_render_controllers";
import { shadowSettingsSchemaTypeRP } from "./resource_pack/shadows/global";
import { musicDefinitionsSchemaTypeRP } from "./resource_pack/sounds/music_definitions";
import { soundDefinitionsSchemaTypeRP } from "./resource_pack/sounds/sound_definitions";
import { languagesNamesSchemaTypeRP } from "./resource_pack/texts/languages_names";
import { languagesSchemaTypeRP } from "./resource_pack/texts/languages";
import { textureSetSchemaTypeRP } from "./resource_pack/textures/_texture_set";
import { flipbookTexturesSchemaTypeRP } from "./resource_pack/textures/flipbook_textures";
import { itemTextureSchemaTypeRP } from "./resource_pack/textures/item_texture";
import { terrainTextureSchemaTypeRP } from "./resource_pack/textures/terrain_texture";
import { texturesListSchemaTypeRP } from "./resource_pack/textures/textures_list";
import { _globalVariablesSchemaTypeRP } from "./resource_pack/ui/_global_variables";
import { _uiDefsSchemaTypeRP } from "./resource_pack/ui/_ui_defs";
import { uiElementSchemaTypeRP } from "./resource_pack/ui/_ui_element";
import { waterSettingsSchemaTypeRP } from "./resource_pack/water/water";
import { biomesClientSchemaType } from "./resource_pack/biomes_client";
import { blocksSchemaTypeRP } from "./resource_pack/blocks";
import { loadingMessagesSchemaTypeRP } from "./resource_pack/loading_messages";
import { manifestSchemaTypeRP } from "./resource_pack/manifest";
import { soundsSchemaTypeRP } from "./resource_pack/sounds";
import { splashesSchemaTypeRP } from "./resource_pack/splashes";

/**
 * Liste des types de schémas versionnés
 */
export const schemaTypes: SchemaType[] = [
    // Behavior Pack schemas
    aimAssistCategoriesSchemaTypeBP,
    aimAssistPresetSchemaTypeBP,
    animationControllersSchemaTypeBP,
    animationsSchemaTypeBP,
    biomeSchemaTypeBP,
    blockSchemaTypeBP,
    cameraPresetSchemaTypeBP,
    dialogueSchemaTypeBP,
    dimensionSchemaTypeBP,
    entitySchemaTypeBP,
    featureRulesSchemaTypeBP,
    featureSchemaTypeBP,
    itemSchemaTypeBP,
    manifestSchemaTypeBP,
    tickSchemaTypeBP,
    craftingItemCatalogSchemaTypeBP,
    lootTableSchemaTypeBP,
    recipeSchemaTypeBP,
    spawnRulesSchemaTypeBP,
    languagesSchemaTypeBP,
    tradingSchemaTypeBP,
    jigsawStructureSchemaTypeBP,
    processorSchemaTypeBP,
    structureSetSchemaTypeBP,
    templatePoolSchemaTypeBP,
    contentsSchemaTypeBP,

    // Resource Pack schemas
    animationControllersSchemaTypeRP,
    animationsSchemaTypeRP,
    atmosphericSettingsSchemaTypeRP,
    attachableSchemaTypeRP,
    clientBiomeSchemaTypeRP,
    blockCullingRulesSchemaTypeRP,
    colorGradingSettingsSchemaTypeRP,
    creditsSchemaTypeRP,
    clientEntitySchemaTypeRP,
    fogSettingsSchemaTypeRP,
    itemSchemaTypeRP,
    lightingSettingsSchemaTypeRP,
    geometrySchemaTypeRP,
    particleEffectSchemaTypeRP,
    pbrFallbackSettingsSchemaTypeRP,
    renderControllerSchemaTypeRP,
    shadowSettingsSchemaTypeRP,
    musicDefinitionsSchemaTypeRP,
    soundDefinitionsSchemaTypeRP,
    languagesNamesSchemaTypeRP,
    languagesSchemaTypeRP,
    flipbookTexturesSchemaTypeRP,
    itemTextureSchemaTypeRP,
    terrainTextureSchemaTypeRP,
    texturesListSchemaTypeRP,
    _globalVariablesSchemaTypeRP,
    _uiDefsSchemaTypeRP,
    uiElementSchemaTypeRP,
    waterSettingsSchemaTypeRP,
    biomesClientSchemaType,
    blocksSchemaTypeRP,
    loadingMessagesSchemaTypeRP,
    manifestSchemaTypeRP,
    soundsSchemaTypeRP,
    splashesSchemaTypeRP,

    textureSetSchemaTypeRP,
];