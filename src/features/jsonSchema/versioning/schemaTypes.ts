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
import { testSchemaType } from "../versionedChanges/behavior_pack/test";
import { tickSchemaTypeBP } from "../versionedChanges/behavior_pack/functions/tick";
import { lootTableSchemaTypeBP } from "../versionedChanges/behavior_pack/loot_tables/_loot_table";
import { recipeSchemaTypeBP } from "../versionedChanges/behavior_pack/recipes/_recipe";
import { spawnRulesSchemaTypeBP } from "../versionedChanges/behavior_pack/spawn_rules/_spawn_rules";
import { languagesSchemaTypeBP } from "../versionedChanges/behavior_pack/texts/languages";
import { tradingSchemaTypeBP } from "../versionedChanges/behavior_pack/trading/_trading";
import { jigsawStructureSchemaTypeBP } from "../versionedChanges/behavior_pack/worldgen/jigsaw_structures/_jigsaw_structure";
import { processorSchemaTypeBP } from "../versionedChanges/behavior_pack/worldgen/processors/_processor";
import { structureSetSchemaTypeBP } from "../versionedChanges/behavior_pack/worldgen/structure_sets/_structure_set";
import { templatePoolSchemaTypeBP } from "../versionedChanges/behavior_pack/worldgen/template_pools/_template_pool";
import { contentsSchemaTypeBP } from "../versionedChanges/behavior_pack/contents";

/**
 * Liste des types de schémas versionnés
 */
export const schemaTypes: SchemaType[] = [
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
    testSchemaType,
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
    contentsSchemaTypeBP
];