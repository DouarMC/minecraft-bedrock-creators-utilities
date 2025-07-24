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
import { itemSchemaTypeBP } from "../versionedChanges/behavior_pack/items/_item";
import { manifestSchemaTypeBP } from "../versionedChanges/behavior_pack/manifest";
import { testSchemaType } from "../versionedChanges/behavior_pack/test";

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
    itemSchemaTypeBP,
    manifestSchemaTypeBP,
    testSchemaType
];