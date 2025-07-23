import { SchemaType } from "../../../types/schema"; 

import { aimAssistCategoriesSchemaTypeBP } from "../versionedChanges/behavior_pack/aim_assist/categories/categories"; 
import { aimAssistPresetSchemaTypeBP } from "../versionedChanges/behavior_pack/aim_assist/presets/_aim_assist_preset"; 
import { animationControllersSchemaTypeBP } from "../versionedChanges/behavior_pack/animation_controllers/_animation_controllers"; 
import { animationsSchemaTypeBP } from "../versionedChanges/behavior_pack/animations/_animations"; 
import { biomeSchemaTypeBP } from "../versionedChanges/behavior_pack/biomes/_biome"; 
import { blockSchemaTypeBP } from "../versionedChanges/behavior_pack/blocks/_block"; 
import { itemSchemaTypeBP } from "../versionedChanges/behavior_pack/items/_item"; 

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
    itemSchemaTypeBP
];