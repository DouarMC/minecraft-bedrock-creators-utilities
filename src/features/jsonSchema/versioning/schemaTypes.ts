import { SchemaType } from "../../../types/schema"; 

import { aimAssistCategoriesSchemaTypeBP } from "../versionedChanges/behavior_pack/aim_assist/categories/categories"; 
import { aimAssistPresetSchemaTypeBP } from "../versionedChanges/behavior_pack/aim_assist/presets/_aim_assist_preset"; 
import { animationControllersSchemaTypeBP } from "../versionedChanges/behavior_pack/animation_controllers/_animation_controllers"; 
import { animationsSchemaTypeBP } from "../versionedChanges/behavior_pack/animations/_animations"; 
import { biomeSchemaTypeBP } from "../versionedChanges/behavior_pack/biomes/_biome"; 
import { blockSchemaTypeBP } from "../versionedChanges/behavior_pack/blocks/_block";
import { cameraPresetSchemaTypeBP } from "../versionedChanges/behavior_pack/cameras/presets/_camera_preset";
import { dialogueSchemaTypeBP } from "../versionedChanges/behavior_pack/dialogue/_dialogue";
import { dimensionSchemaTypeBP } from "../versionedChanges/behavior_pack/dimensions/_dimension";
import { entitySchemaTypeBP } from "../versionedChanges/behavior_pack/entities/_entity";
import { featureRulesSchemaTypeBP } from "../versionedChanges/behavior_pack/feature_rules/_feature_rules";
import { featureSchemaTypeBP } from "../versionedChanges/behavior_pack/features/_feature";
import { itemSchemaTypeBP } from "../versionedChanges/behavior_pack/items/_item";
import { craftingItemCatalogSchemaTypeBP } from "../versionedChanges/behavior_pack/item_catalog/crafting_item_catalog";
import { manifestSchemaTypeBP } from "../versionedChanges/behavior_pack/manifest";
import { tickSchemaTypeBP } from "../versionedChanges/behavior_pack/functions/tick";
import { lootTableSchemaTypeBP } from "../versionedChanges/behavior_pack/loot_tables/_loot_table";
import { recipeSchemaTypeBP } from "../versionedChanges/behavior_pack/recipes/_recipe";
import { spawnRulesSchemaTypeBP } from "../versionedChanges/behavior_pack/spawn_rules/_spawn_rules";
import { languagesSchemaTypeBP } from "../versionedChanges/behavior_pack/texts/languages";
import { tradingSchemaTypeBP } from "../versionedChanges/behavior_pack/trading/_trading";
import { jigsawStructureSchemaTypeBP } from "../versionedChanges/behavior_pack/worldgen/structures/_jigsaw_structure";
import { processorSchemaTypeBP } from "../versionedChanges/behavior_pack/worldgen/processors/_processor";
import { structureSetSchemaTypeBP } from "../versionedChanges/behavior_pack/worldgen/structure_sets/_structure_set";
import { templatePoolSchemaTypeBP } from "../versionedChanges/behavior_pack/worldgen/template_pools/_template_pool";
import { contentsSchemaTypeBP } from "../versionedChanges/behavior_pack/contents";
import { animationControllersSchemaTypeRP } from "../versionedChanges/resource_pack/animation_controllers/_animation_controllers";
import { animationsSchemaTypeRP } from "../versionedChanges/resource_pack/animations/_animations";
import { atmosphericSettingsSchemaTypeRP } from "../versionedChanges/resource_pack/atmospherics/_atmospheric_settings";
import { attachableSchemaTypeRP } from "../versionedChanges/resource_pack/attachables/_attachable";
import { clientBiomeSchemaTypeRP } from "../versionedChanges/resource_pack/biomes/_client_biome";
import { blockCullingRulesSchemaTypeRP } from "../versionedChanges/resource_pack/block_culling/_block_culling_rules";
import { colorGradingSettingsSchemaTypeRP } from "../versionedChanges/resource_pack/color_grading/_color_grading_settings";
import { creditsSchemaTypeRP } from "../versionedChanges/resource_pack/credits/credits";
import { clientEntitySchemaTypeRP } from "../versionedChanges/resource_pack/entity/_client_entity";
import { fogSettingsSchemaTypeRP } from "../versionedChanges/resource_pack/fogs/_fog_settings";
import { itemSchemaTypeRP } from "../versionedChanges/resource_pack/items/_item";
import { lightingSettingsSchemaTypeRP } from "../versionedChanges/resource_pack/lighting/_lighting_settings";
import { geometrySchemaTypeRP } from "../versionedChanges/resource_pack/models/_geometry";
import { particleEffectSchemaTypeRP } from "../versionedChanges/resource_pack/particles/_particle_effect";
import { pbrFallbackSettingsSchemaTypeRP } from "../versionedChanges/resource_pack/pbr/global";
import { renderControllerSchemaTypeRP } from "../versionedChanges/resource_pack/render_controllers/_render_controllers";
import { shadowSettingsSchemaTypeRP } from "../versionedChanges/resource_pack/shadows/global";
import { musicDefinitionsSchemaTypeRP } from "../versionedChanges/resource_pack/sounds/music_definitions";
import { soundDefinitionsSchemaTypeRP } from "../versionedChanges/resource_pack/sounds/sound_definitions";
import { languagesNamesSchemaTypeRP } from "../versionedChanges/resource_pack/texts/languages_names";
import { languagesSchemaTypeRP } from "../versionedChanges/resource_pack/texts/languages";
import { textureSetSchemaTypeRP } from "../versionedChanges/resource_pack/textures/_texture_set";
import { flipbookTexturesSchemaTypeRP } from "../versionedChanges/resource_pack/textures/flipbook_textures";
import { itemTextureSchemaTypeRP } from "../versionedChanges/resource_pack/textures/item_texture";
import { terrainTextureSchemaTypeRP } from "../versionedChanges/resource_pack/textures/terrain_texture";
import { texturesListSchemaTypeRP } from "../versionedChanges/resource_pack/textures/textures_list";
import { _globalVariablesSchemaTypeRP } from "../versionedChanges/resource_pack/ui/_global_variables";
import { _uiDefsSchemaTypeRP } from "../versionedChanges/resource_pack/ui/_ui_defs";
import { uiElementSchemaTypeRP } from "../versionedChanges/resource_pack/ui/_ui_element";
import { waterSettingsSchemaTypeRP } from "../versionedChanges/resource_pack/water/water";
import { biomesClientSchemaType } from "../versionedChanges/resource_pack/biomes_client";
import { blocksSchemaTypeRP } from "../versionedChanges/resource_pack/blocks";
import { loadingMessagesSchemaTypeRP } from "../versionedChanges/resource_pack/loading_messages";
import { manifestSchemaTypeRP } from "../versionedChanges/resource_pack/manifest";
import { soundsSchemaTypeRP } from "../versionedChanges/resource_pack/sounds";
import { splashesSchemaTypeRP } from "../versionedChanges/resource_pack/splashes";

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