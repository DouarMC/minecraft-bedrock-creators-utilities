import * as vscode from "vscode";
import { MinecraftJsonSchema } from "../../model";
import { dynamicExamplesSourceKeys } from "../../utils/shared/schemaEnums";
import { getAimAssistCategoryIds, getDataDrivenAimAssistCategoryIds } from "./handlers/aimAssistCategories";
import { getAimAssistPresetIds, getDataDrivenAimAssistPresetIds } from "./handlers/aimAssistPresets";
import { getAtmosphereSettingsIds, getDataDrivenAtmosphereSettingsIds } from "./handlers/atmosphereSettings";
import { getBehaviorAnimationControllerIds } from "./handlers/behaviorAnimationController";
import { getBehaviorAnimationIds } from "./handlers/behaviorAnimations";
import { getBiomeIds, getBiomeTags, getDataDrivenBiomeIds, getVanillaBiomeIdsWithoutNamespace } from "./handlers/biomes";
import { getBlockCullingRulesIds, getCullingLayerIds } from "./handlers/blockCullingRules";
import { getBlockIds, getVanillaBlockIdsWithoutNamespace } from "./handlers/blocks";
import { getBlockSoundReferences, getDataDrivenBaseBlockSoundReferences, getDataDrivenIndividualEventSoundReferences, getDataDrivenIndividualNamedSoundReferences, getDataDrivenInteractiveBlockSoundReferences, getDataDrivenSoundReferences, getSoundFilePathsWithoutExtension, getSoundReferences } from "./handlers/sounds";
import { getBlockTextureReferences, getDataDrivenBlockTextureReferences, getDataDrivenItemTextureReferences, getItemTextureReferences, getProjectTextureFilePaths, getTextureFilePaths } from "./handlers/textures";
import { getCameraPresetIds, getDataDrivenCameraPresetIds, getInheritableCameraPresetIds } from "./handlers/cameras";
import { getColorGradingSettingsIds, getDataDrivenColorGradingSettingsIds } from "./handlers/colorGradingSettings";
import { getCooldownCategoryIds } from "./handlers/cooldown";
import { getCraftingRecipeTags, getDataDrivenRecipeIds } from "./handlers/recipes";
import { getDataDrivenAttachableIds } from "./handlers/attachables";
import { getDataDrivenDimensionIds } from "./handlers/dimensions";
import { getDataDrivenEntityIds, getEntityFamilyIds, getEntityIds, getVanillaEntityIdsWithoutNamespace } from "./handlers/entity";
import { getDataDrivenFeatureIds, getFeatureIds } from "./handlers/features";
import { getDataDrivenFeatureRulesIds } from "./handlers/feature_rules";
import { getDataDrivenFogIds, getFogIds } from "./handlers/fogs";
import { getDataDrivenIds, getItemGroupIds, getItemIds, getOldFormatItemIds, getVanillaItemGroupIdsWithoutNamespace } from "./handlers/items";
import { getDataDrivenJigsawStructureIds, getDataDrivenProcessorIds, getDataDrivenStructureSetIds, getDataDrivenTemplatePoolIds, getProcessorIds, getTemplatePoolIds } from "./handlers/jigsaw";
import { getDataDrivenLanguageIds, getLanguageIds } from "./handlers/texts";
import { getDataDrivenLightingSettingsIds, getLightingSettingsIds } from "./handlers/lightingSettings";
import { getDataDrivenModelIds, getFullBlockModelId, getModelIds } from "./handlers/models";
import { getDataDrivenMusicReferences, getMusicReferences } from "./handlers/musics";
import { getDataDrivenParticleEffectIds, getParticleEffectIds } from "./handlers/particles";
import { getDataDrivenRenderControllerIds, getRenderControllerIds } from "./handlers/render_controllers";
import { getDataDrivenResourceAnimationControllerIds, getResourceAnimationControllerIds } from "./handlers/resourceAnimationControllers";
import { getDataDrivenResourceAnimationIds, getResourceAnimationIds } from "./handlers/resourceAnimations";
import { getDataDrivenSpawnRulesIds } from "./handlers/spawnRules";
import { getDataDrivenWaterSettingsIds, getWaterSettingsIds } from "./handlers/waterSettings";
import { getEffectIds } from "./handlers/effects";
import { getLootTableFilePaths } from "./handlers/lootTables";
import { getMcfunctionFilePathsWithoutExtension } from "./handlers/mcfunction";
import { getProjectUiFilePaths, getVanillaUiGlobalVariables } from "./handlers/ui";
import { getTradingFilePaths } from "./handlers/trading";
import { getVanillaEnchantmentIds } from "./handlers/enchantments";

type DynamicSourceHandler = (document: vscode.TextDocument, schema: MinecraftJsonSchema) => Promise<string[]>;

const handlers: Record<string, DynamicSourceHandler> = {
    [dynamicExamplesSourceKeys.aim_assist_category_ids]: getAimAssistCategoryIds,
    [dynamicExamplesSourceKeys.aim_assist_preset_ids]: getAimAssistPresetIds,
    [dynamicExamplesSourceKeys.atmosphere_settings_ids]: getAtmosphereSettingsIds,
    [dynamicExamplesSourceKeys.behavior_animation_controller_ids]: getBehaviorAnimationControllerIds,
    [dynamicExamplesSourceKeys.behavior_animation_ids]: getBehaviorAnimationIds,
    [dynamicExamplesSourceKeys.biome_ids]: getBiomeIds,
    [dynamicExamplesSourceKeys.biome_tags]: getBiomeTags,
    [dynamicExamplesSourceKeys.block_culling_rules_ids]: getBlockCullingRulesIds,
    [dynamicExamplesSourceKeys.block_ids]: getBlockIds,
    [dynamicExamplesSourceKeys.block_sound_references]: getBlockSoundReferences,
    [dynamicExamplesSourceKeys.block_texture_references]: getBlockTextureReferences,
    [dynamicExamplesSourceKeys.camera_preset_ids]: getCameraPresetIds,
    [dynamicExamplesSourceKeys.color_grading_settings_ids]: getColorGradingSettingsIds,
    [dynamicExamplesSourceKeys.cooldown_category_ids]: getCooldownCategoryIds,
    [dynamicExamplesSourceKeys.crafting_recipe_tags]: getCraftingRecipeTags,
    [dynamicExamplesSourceKeys.culling_layer_ids]: getCullingLayerIds,
    [dynamicExamplesSourceKeys.data_driven_aim_assist_category_ids]: getDataDrivenAimAssistCategoryIds,
    [dynamicExamplesSourceKeys.data_driven_aim_assist_preset_ids]: getDataDrivenAimAssistPresetIds,
    [dynamicExamplesSourceKeys.data_driven_atmosphere_settings_ids]: getDataDrivenAtmosphereSettingsIds,
    [dynamicExamplesSourceKeys.data_driven_attachable_ids]: getDataDrivenAttachableIds,
    [dynamicExamplesSourceKeys.data_driven_base_block_sound_references]: getDataDrivenBaseBlockSoundReferences,
    [dynamicExamplesSourceKeys.data_driven_biome_ids]: getDataDrivenBiomeIds,
    [dynamicExamplesSourceKeys.data_driven_block_texture_references]: getDataDrivenBlockTextureReferences,
    [dynamicExamplesSourceKeys.data_driven_camera_preset_ids]: getDataDrivenCameraPresetIds,
    [dynamicExamplesSourceKeys.data_driven_color_grading_settings_ids]: getDataDrivenColorGradingSettingsIds,
    [dynamicExamplesSourceKeys.data_driven_dimension_ids]: getDataDrivenDimensionIds,
    [dynamicExamplesSourceKeys.data_driven_entity_ids]: getDataDrivenEntityIds,
    [dynamicExamplesSourceKeys.data_driven_feature_ids]: getDataDrivenFeatureIds,
    [dynamicExamplesSourceKeys.data_driven_feature_rules_ids]: getDataDrivenFeatureRulesIds,
    [dynamicExamplesSourceKeys.data_driven_fog_ids]: getDataDrivenFogIds,
    [dynamicExamplesSourceKeys.data_driven_individual_event_sound_references]: getDataDrivenIndividualEventSoundReferences,
    [dynamicExamplesSourceKeys.data_driven_individual_named_sound_references]: getDataDrivenIndividualNamedSoundReferences,
    [dynamicExamplesSourceKeys.data_driven_interactive_block_sound_references]: getDataDrivenInteractiveBlockSoundReferences,
    [dynamicExamplesSourceKeys.data_driven_item_ids]: getDataDrivenIds,
    [dynamicExamplesSourceKeys.data_driven_item_texture_references]: getDataDrivenItemTextureReferences,
    [dynamicExamplesSourceKeys.data_driven_jigsaw_structure_ids]: getDataDrivenJigsawStructureIds,
    [dynamicExamplesSourceKeys.data_driven_language_ids]: getDataDrivenLanguageIds,
    [dynamicExamplesSourceKeys.data_driven_lighting_settings_ids]: getDataDrivenLightingSettingsIds,
    [dynamicExamplesSourceKeys.data_driven_model_ids]: getDataDrivenModelIds,
    [dynamicExamplesSourceKeys.data_driven_music_references]: getDataDrivenMusicReferences,
    [dynamicExamplesSourceKeys.data_driven_particle_effect_ids]: getDataDrivenParticleEffectIds,
    [dynamicExamplesSourceKeys.data_driven_processor_ids]: getDataDrivenProcessorIds,
    [dynamicExamplesSourceKeys.data_driven_recipe_ids]: getDataDrivenRecipeIds,
    [dynamicExamplesSourceKeys.data_driven_render_controller_ids]: getDataDrivenRenderControllerIds,
    [dynamicExamplesSourceKeys.data_driven_resource_animation_controller_ids]: getDataDrivenResourceAnimationControllerIds,
    [dynamicExamplesSourceKeys.data_driven_resource_animation_ids]: getDataDrivenResourceAnimationIds,
    [dynamicExamplesSourceKeys.data_driven_sound_references]: getDataDrivenSoundReferences,
    [dynamicExamplesSourceKeys.data_driven_spawn_rules_ids]: getDataDrivenSpawnRulesIds,
    [dynamicExamplesSourceKeys.data_driven_structure_set_ids]: getDataDrivenStructureSetIds,
    [dynamicExamplesSourceKeys.data_driven_template_pool_ids]: getDataDrivenTemplatePoolIds,
    [dynamicExamplesSourceKeys.data_driven_water_settings_ids]: getDataDrivenWaterSettingsIds,
    [dynamicExamplesSourceKeys.effect_ids]: getEffectIds,
    [dynamicExamplesSourceKeys.entity_family_ids]: getEntityFamilyIds,
    [dynamicExamplesSourceKeys.entity_ids]: getEntityIds,
    [dynamicExamplesSourceKeys.feature_ids]: getFeatureIds,
    [dynamicExamplesSourceKeys.fog_ids]: getFogIds,
    [dynamicExamplesSourceKeys.full_block_model_id]: getFullBlockModelId,
    [dynamicExamplesSourceKeys.inheritable_camera_preset_ids]: getInheritableCameraPresetIds,
    [dynamicExamplesSourceKeys.item_group_ids]: getItemGroupIds,
    [dynamicExamplesSourceKeys.item_ids]: getItemIds,
    [dynamicExamplesSourceKeys.item_texture_references]: getItemTextureReferences,
    [dynamicExamplesSourceKeys.language_ids]: getLanguageIds,
    [dynamicExamplesSourceKeys.lighting_settings_ids]: getLightingSettingsIds,
    [dynamicExamplesSourceKeys.loot_table_file_paths]: getLootTableFilePaths,
    [dynamicExamplesSourceKeys.mcfunction_file_paths_without_extension]: getMcfunctionFilePathsWithoutExtension,
    [dynamicExamplesSourceKeys.model_ids]: getModelIds,
    [dynamicExamplesSourceKeys.music_references]: getMusicReferences,
    [dynamicExamplesSourceKeys.old_format_item_ids]: getOldFormatItemIds,
    [dynamicExamplesSourceKeys.particle_effect_ids]: getParticleEffectIds,
    [dynamicExamplesSourceKeys.processor_ids]: getProcessorIds,
    [dynamicExamplesSourceKeys.project_texture_file_paths]: getProjectTextureFilePaths,
    [dynamicExamplesSourceKeys.project_ui_file_paths]: getProjectUiFilePaths,
    [dynamicExamplesSourceKeys.render_controller_ids]: getRenderControllerIds,
    [dynamicExamplesSourceKeys.resource_animation_controller_ids]: getResourceAnimationControllerIds,
    [dynamicExamplesSourceKeys.resource_animation_ids]: getResourceAnimationIds,
    [dynamicExamplesSourceKeys.sound_file_paths_without_extension]: getSoundFilePathsWithoutExtension,
    [dynamicExamplesSourceKeys.sound_references]: getSoundReferences,
    [dynamicExamplesSourceKeys.template_pool_ids]: getTemplatePoolIds,
    [dynamicExamplesSourceKeys.texture_file_paths]: getTextureFilePaths,
    [dynamicExamplesSourceKeys.trading_file_paths]: getTradingFilePaths,
    [dynamicExamplesSourceKeys.vanilla_biome_ids_without_namespace]: getVanillaBiomeIdsWithoutNamespace,
    [dynamicExamplesSourceKeys.vanilla_block_ids_without_namespace]: getVanillaBlockIdsWithoutNamespace,
    [dynamicExamplesSourceKeys.vanilla_enchantment_ids]: getVanillaEnchantmentIds,
    [dynamicExamplesSourceKeys.vanilla_entity_ids_without_namespace]: getVanillaEntityIdsWithoutNamespace,
    [dynamicExamplesSourceKeys.vanilla_item_group_ids_without_namespace]: getVanillaItemGroupIdsWithoutNamespace,
    [dynamicExamplesSourceKeys.vanilla_ui_global_variables]: getVanillaUiGlobalVariables,
    [dynamicExamplesSourceKeys.water_settings_ids]: getWaterSettingsIds
};

export async function getDynamicExampleSourceValues(sourceKey: string | string[], document: vscode.TextDocument, schema: MinecraftJsonSchema): Promise<string[]> {
    const sourceKeys = Array.isArray(sourceKey) ? sourceKey : [sourceKey];
    const values: string[] = [];

    for (const key of sourceKeys) {
        const handler = handlers[key];
        if (handler) {
            values.push(...await handler(document, schema));
        } else {
            console.warn(`⚠️ Unknown dynamicExamplesSource key: ${key}`);
        }
    }

    return Array.from(new Set(values));
}