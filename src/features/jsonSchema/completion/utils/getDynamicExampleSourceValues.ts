import { dynamicExamplesSourceKeys } from "../../shared/schemaEnums";
import { GetMinecraftContent } from "../../../../utils/workspace/getContent";

export async function getDynamicExampleSourceValues(sourceKey: string | string[]): Promise<any[]> {
    const sourceKeys = Array.isArray(sourceKey) ? sourceKey : [sourceKey];
    const values: any[] = [];
    for (const key of sourceKeys) {
        switch (key) {
            case dynamicExamplesSourceKeys.aim_assist_category_ids:
                values.push(...await GetMinecraftContent.getAimAssistCategoryIds());
                break;
            case dynamicExamplesSourceKeys.aim_assist_preset_ids:
                values.push(...await GetMinecraftContent.getAimAssistPresetIds());
                break;
            case dynamicExamplesSourceKeys.atmosphere_settings_ids:
                values.push(...await GetMinecraftContent.getAtmosphereSettingsIds());
                break;
            case dynamicExamplesSourceKeys.behavior_animation_ids:
                values.push(...await GetMinecraftContent.getBehaviorAnimationIds());
                break;
            case dynamicExamplesSourceKeys.biome_ids:
                values.push(...await GetMinecraftContent.getBiomeIds());
                break;
            case dynamicExamplesSourceKeys.biome_tags:
                values.push(...await GetMinecraftContent.getBiomeTags());
                break;
            case dynamicExamplesSourceKeys.block_culling_rules_ids:
                values.push(...await GetMinecraftContent.getBlockCullingRulesIds());
                break;
            case dynamicExamplesSourceKeys.block_ids:
                values.push(...await GetMinecraftContent.getBlockIds());
                break;
            case dynamicExamplesSourceKeys.block_texture_references:
                values.push(...await GetMinecraftContent.getBlockTextureReferences());
                break;
            case dynamicExamplesSourceKeys.color_grading_settings_ids:
                values.push(...await GetMinecraftContent.getColorGradingSettingsIds());
                break;
            case dynamicExamplesSourceKeys.cooldown_category_ids:
                values.push(...await GetMinecraftContent.getCooldownCategoryIds());
                break;
            case dynamicExamplesSourceKeys.crafting_recipe_tags:
                values.push(...await GetMinecraftContent.getCraftingRecipeTags());
                break;
            case dynamicExamplesSourceKeys.culling_layer_ids:
                values.push(...await GetMinecraftContent.getCullingLayerIds());
                break;
            case dynamicExamplesSourceKeys.data_driven_aim_assist_category_ids:
                values.push(...await GetMinecraftContent.getDataDrivenAimAssistCategoryIds());
                break;
            case dynamicExamplesSourceKeys.data_driven_aim_assist_preset_ids:
                values.push(...await GetMinecraftContent.getDataDrivenAimAssistPresetIds());
                break;
            case dynamicExamplesSourceKeys.data_driven_atmosphere_settings_ids:
                values.push(...await GetMinecraftContent.getDataDrivenAtmosphereSettingsIds());
                break;
            case dynamicExamplesSourceKeys.data_driven_attachable_ids:
                values.push(...await GetMinecraftContent.getDataDrivenAttachableIds());
                break;
            case dynamicExamplesSourceKeys.data_driven_biome_ids:
                values.push(...await GetMinecraftContent.getDataDrivenBiomeIds());
                break;
            case dynamicExamplesSourceKeys.data_driven_camera_preset_ids:
                values.push(...await GetMinecraftContent.getDataDrivenCameraPresetIds());
                break;
            case dynamicExamplesSourceKeys.data_driven_color_grading_settings_ids:
                values.push(...await GetMinecraftContent.getDataDrivenColorGradingSettingsIds());
                break;
            case dynamicExamplesSourceKeys.data_driven_dimension_ids:
                values.push(...await GetMinecraftContent.getDataDrivenDimensionIds());
                break;
            case dynamicExamplesSourceKeys.data_driven_feature_rules_ids:
                values.push(...await GetMinecraftContent.getDataDrivenFeatureRulesIds());
                break;
            case dynamicExamplesSourceKeys.data_driven_fog_ids:
                values.push(...await GetMinecraftContent.getDataDrivenFogIds());
                break;
            case dynamicExamplesSourceKeys.data_driven_item_ids:
                values.push(...await GetMinecraftContent.getDataDrivenItemIds());
                break;
            case dynamicExamplesSourceKeys.data_driven_jigsaw_structure_ids:
                values.push(...await GetMinecraftContent.getDataDrivenJigsawStructureIds());
                break;
            case dynamicExamplesSourceKeys.data_driven_lighting_settings_ids:
                values.push(...await GetMinecraftContent.getDataDrivenLightingSettingsIds());
                break;
            case dynamicExamplesSourceKeys.data_driven_model_ids:
                values.push(...await GetMinecraftContent.getDataDrivenModelIds());
                break;
            case dynamicExamplesSourceKeys.data_driven_particle_effect_ids:
                values.push(...await GetMinecraftContent.getDataDrivenParticleEffectIds());
                break;
            case dynamicExamplesSourceKeys.data_driven_processor_ids:
                values.push(...await GetMinecraftContent.getDataDrivenProcessorIds());
                break;
            case dynamicExamplesSourceKeys.data_driven_render_controller_ids:
                values.push(...await GetMinecraftContent.getDataDrivenRenderControllerIds());
                break;
            case dynamicExamplesSourceKeys.data_driven_resource_animation_controller_ids:
                values.push(...await GetMinecraftContent.getDataDrivenResourceAnimationControllerIds());
                break;
            case dynamicExamplesSourceKeys.data_driven_resource_animation_ids:
                values.push(...await GetMinecraftContent.getDataDrivenResourceAnimationIds());
                break;
            case dynamicExamplesSourceKeys.data_driven_spawn_rules_ids:
                values.push(...await GetMinecraftContent.getDataDrivenSpawnRulesIds());
                break;
            case dynamicExamplesSourceKeys.data_driven_structure_set_ids:
                values.push(...await GetMinecraftContent.getDataDrivenStructureSetIds());
                break;
            case dynamicExamplesSourceKeys.data_driven_template_pool_ids:
                values.push(...await GetMinecraftContent.getDataDrivenTemplatePoolIds());
                break;
            case dynamicExamplesSourceKeys.data_driven_water_settings_ids:
                values.push(...await GetMinecraftContent.getDataDrivenWaterSettingsIds());
                break;
            case dynamicExamplesSourceKeys.effect_ids:
                values.push(...await GetMinecraftContent.getEffectIds());
                break;
            case dynamicExamplesSourceKeys.entity_ids:
                values.push(...await GetMinecraftContent.getEntityIds());
                break;
            case dynamicExamplesSourceKeys.feature_ids:
                values.push(...await GetMinecraftContent.getFeatureIds());
                break;
            case dynamicExamplesSourceKeys.fog_ids:
                values.push(...await GetMinecraftContent.getFogIds());
                break;
            case dynamicExamplesSourceKeys.full_block_model_id:
                values.push(GetMinecraftContent.fullBlockModelId);
                break;
            case dynamicExamplesSourceKeys.inheritable_camera_preset_ids:
                values.push(...await GetMinecraftContent.getInheritableCameraPresetIds());
                break;
            case dynamicExamplesSourceKeys.item_group_ids:
                values.push(...await GetMinecraftContent.getItemGroupIds());
                break;
            case dynamicExamplesSourceKeys.item_ids:
                values.push(...await GetMinecraftContent.getItemIds());
                break;
            case dynamicExamplesSourceKeys.item_tags:
                values.push(...await GetMinecraftContent.getItemTags());
                break;
            case dynamicExamplesSourceKeys.item_texture_references:
                values.push(...await GetMinecraftContent.getItemTextureReferences());
                break;
            case dynamicExamplesSourceKeys.lighting_settings_ids:
                values.push(...await GetMinecraftContent.getLightingSettingsIds());
                break;
            case dynamicExamplesSourceKeys.loot_table_file_paths:
                values.push(...await GetMinecraftContent.getLootTableFilePaths());
                break;
            case dynamicExamplesSourceKeys.model_ids:
                values.push(...await GetMinecraftContent.getModelIds());
                break;
            case dynamicExamplesSourceKeys.particle_effect_ids:
                values.push(...await GetMinecraftContent.getParticleEffectIds());
                break;
            case dynamicExamplesSourceKeys.render_controller_ids:
                values.push(...await GetMinecraftContent.getRenderControllerIds());
                break;
            case dynamicExamplesSourceKeys.resource_animation_controller_ids:
                values.push(...await GetMinecraftContent.getResourceAnimationControllerIds());
                break;
            case dynamicExamplesSourceKeys.resource_animation_ids:
                values.push(...await GetMinecraftContent.getResourceAnimationIds());
                break;
            case dynamicExamplesSourceKeys.texture_file_paths:
                values.push(...await GetMinecraftContent.getTextureFilePaths());
                break;
            case dynamicExamplesSourceKeys.vanilla_biome_ids:
                values.push(...await GetMinecraftContent.getVanillaBiomeIds());
                break;
            case dynamicExamplesSourceKeys.vanilla_biome_ids_without_namespace:
                values.push(...await GetMinecraftContent.getVanillaBiomeIdsWithoutNamespace());
                break;
            case dynamicExamplesSourceKeys.vanilla_block_ids_without_namespace:
                values.push(...await GetMinecraftContent.getVanillaBlockIdsWithoutNamespace());
                break;
            case dynamicExamplesSourceKeys.vanilla_camera_preset_ids:
                values.push(...await GetMinecraftContent.getVanillaCameraPresetIds());
                break;
            case dynamicExamplesSourceKeys.vanilla_dimension_ids:
                values.push(...await GetMinecraftContent.getVanillaDimensionIds());
                break;
            case dynamicExamplesSourceKeys.vanilla_entity_ids_without_namespace:
                values.push(...await GetMinecraftContent.getVanillaEntityIdsWithoutNamespace());
                break;
            case dynamicExamplesSourceKeys.vanilla_item_group_ids_without_namespace:
                values.push(...await GetMinecraftContent.getVanillaItemGroupIdsWithoutNamespace());
                break;
            case dynamicExamplesSourceKeys.water_settings_ids:
                values.push(...await GetMinecraftContent.getWaterSettingsIds());
                break;
        }
    }

    return values;
}